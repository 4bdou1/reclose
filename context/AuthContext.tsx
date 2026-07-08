import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

// Initial allowed emails as a fallback/bootstrap
const INITIAL_ALLOWED_EMAILS = [
  'haliluismailibrahim@gmail.com',
  'abdibal2g@gmail.com',
  'sadiquseey@gmail.com'
];

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const isEmailAuthorized = async (email: string): Promise<boolean> => {
    const normalizedEmail = email.toLowerCase().trim();
    if (INITIAL_ALLOWED_EMAILS.includes(normalizedEmail)) return true;

    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('email')
        .eq('email', normalizedEmail)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error checking authorized emails:', error);
      }
      return !!data;
    } catch (err) {
      console.error('Failed to verify email:', err);
      return false;
    }
  };

  const handleSession = async (currentSession: Session | null, event?: string) => {
    if (currentSession?.user?.email) {
      const authorized = await isEmailAuthorized(currentSession.user.email);
      if (!authorized) {
        toast.error('This email is not authorized to access HOS Labs.');
        await supabase.auth.signOut();
        setUser(null);
        setSession(null);
        setLoading(false);
        return;
      }
      
      // Upsert profile for authorized user
      await supabase.from('profiles').upsert({
        id: currentSession.user.id,
        email: currentSession.user.email,
        full_name: currentSession.user.user_metadata?.full_name || currentSession.user.email
      });
    }

    // ONLY Intercept Google Tokens on fresh sign in to prevent resurrecting expired tokens on page reload!
    if (event === 'SIGNED_IN' && currentSession?.provider_token) {
      localStorage.setItem('hos_google_token', currentSession.provider_token);
      localStorage.setItem('hos_google_token_expiry', (new Date().getTime() + 3500 * 1000).toString());
      
      if (currentSession.provider_refresh_token) {
        localStorage.setItem('hos_google_refresh_token', currentSession.provider_refresh_token);
      }
    }

    setSession(currentSession);
    setUser(currentSession?.user ?? null);
    setLoading(false);
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleSession(session, 'INITIAL');
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      handleSession(session, event);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/dashboard',
        scopes: 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.readonly',
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      }
    });
  };

  const signOut = async () => {
    setUser(null);
    setSession(null);
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
