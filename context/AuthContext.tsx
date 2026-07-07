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

  const handleSession = async (currentSession: Session | null) => {
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

    setSession(currentSession);
    setUser(currentSession?.user ?? null);
    setLoading(false);
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleSession(session);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/dashboard'
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
