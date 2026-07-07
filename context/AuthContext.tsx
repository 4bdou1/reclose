import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

// Initial allowed emails as a fallback/bootstrap
const INITIAL_ALLOWED_EMAILS = [
  'haliluismailibrahim@gmail.com',
  'abdibal2g@gmail.com'
];

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

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

  const signIn = async (email: string, password: string) => {
    const authorized = await isEmailAuthorized(email);
    if (!authorized) {
      return { error: new Error('This email is not authorized to access HOS Labs.') };
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error as Error | null };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const authorized = await isEmailAuthorized(email);
    if (!authorized) {
      return { error: new Error('This email is not authorized to access HOS Labs.') };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName }
      }
    });

    // Create profile after signup
    if (data.user && !error) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        email: email,
        full_name: fullName
      });
    }

    return { error: error as Error | null };
  };

  const signOut = async () => {
    setUser(null);
    setSession(null);
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut }}>
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
