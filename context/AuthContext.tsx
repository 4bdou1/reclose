import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

const ADMIN_EMAIL = 'abdibal2g@gmail.com';
const ADMIN_PASSWORD = 'Ahmadou1974';
const MOCK_AUTH_STORAGE_KEY = 'reclose_mock_admin_session';

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
    const storedMockSession = localStorage.getItem(MOCK_AUTH_STORAGE_KEY);
    if (storedMockSession) {
      const mockUser = JSON.parse(storedMockSession) as User;
      setUser(mockUser);
      setSession(null);
      setLoading(false);
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!storedMockSession) {
        setSession(session);
        setUser(session?.user ?? null);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!localStorage.getItem(MOCK_AUTH_STORAGE_KEY)) {
        setSession(session);
        setUser(session?.user ?? null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const mockUser = {
        id: 'reclose-admin-local',
        email: ADMIN_EMAIL,
        app_metadata: {},
        user_metadata: { full_name: 'Abdib' },
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      } as User;

      localStorage.setItem(MOCK_AUTH_STORAGE_KEY, JSON.stringify(mockUser));
      setUser(mockUser);
      setSession(null);

      return { error: null };
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error as Error | null };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
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
    localStorage.removeItem(MOCK_AUTH_STORAGE_KEY);
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
