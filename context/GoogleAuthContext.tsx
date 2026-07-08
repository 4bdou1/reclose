import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

interface GoogleAuthContextType {
  accessToken: string | null;
  spreadsheetId: string | null;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  setSpreadsheetId: (id: string) => void;
  isReady: boolean;
}

const GoogleAuthContext = createContext<GoogleAuthContextType | undefined>(undefined);

export const GoogleAuthProviderContext: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [spreadsheetId, setSpreadsheetIdState] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const isRefreshingRef = useRef(false);

  const refreshGoogleToken = async () => {
    if (isRefreshingRef.current) return;
    
    const refreshToken = localStorage.getItem('hos_google_refresh_token');
    if (!refreshToken) {
      localStorage.removeItem('hos_google_token');
      localStorage.removeItem('hos_google_token_expiry');
      setAccessToken(null);
      return;
    }

    isRefreshingRef.current = true;
    try {
      const { data, error } = await supabase.functions.invoke('refresh-google-token', {
        body: { refresh_token: refreshToken }
      });

      if (error) throw error;
      if (data && data.access_token) {
        const expiresIn = data.expires_in || 3500;
        const expiryTime = new Date().getTime() + (expiresIn * 1000);
        
        localStorage.setItem('hos_google_token', data.access_token);
        localStorage.setItem('hos_google_token_expiry', expiryTime.toString());
        setAccessToken(data.access_token);
      } else {
        throw new Error('Invalid response from edge function');
      }
    } catch (err) {
      console.error('Failed to automatically refresh Google token:', err);
      localStorage.removeItem('hos_google_token');
      localStorage.removeItem('hos_google_token_expiry');
      setAccessToken(null);
    } finally {
      isRefreshingRef.current = false;
    }
  };

  // Function to sync token from localStorage (set by AuthContext on Supabase login)
  const syncToken = () => {
    const savedToken = localStorage.getItem('hos_google_token');
    const savedTokenExpiry = localStorage.getItem('hos_google_token_expiry');
    
    if (savedToken && savedTokenExpiry) {
      const timeRemaining = parseInt(savedTokenExpiry) - new Date().getTime();
      
      if (timeRemaining > 300000) { 
        // Valid and > 5 minutes remaining
        setAccessToken(savedToken);
      } else if (timeRemaining > 0 && timeRemaining <= 300000) {
        // Valid but expiring in < 5 mins, start silent refresh
        setAccessToken(savedToken);
        refreshGoogleToken();
      } else {
        // Completely expired
        refreshGoogleToken();
      }
    } else {
      setAccessToken(null);
    }
  };

  useEffect(() => {
    const fetchSpreadsheetId = async () => {
      try {
        const { data, error } = await supabase.from('app_settings').select('spreadsheet_id').eq('id', 1).single();
        if (data && data.spreadsheet_id) {
          setSpreadsheetIdState(data.spreadsheet_id);
          localStorage.setItem('hos_spreadsheet_id', data.spreadsheet_id);
        } else {
          const savedSheetId = localStorage.getItem('hos_spreadsheet_id');
          if (savedSheetId) setSpreadsheetIdState(savedSheetId);
        }
      } catch (err) {
        const savedSheetId = localStorage.getItem('hos_spreadsheet_id');
        if (savedSheetId) setSpreadsheetIdState(savedSheetId);
      } finally {
        setIsReady(true);
      }
    };
    
    fetchSpreadsheetId();
    syncToken();

    // Set up a tiny interval to catch the token from AuthContext
    const interval = setInterval(syncToken, 1000);
    return () => clearInterval(interval);
  }, []);

  const login = () => {
    console.warn('Google login is now handled automatically by Supabase during initial sign in.');
  };

  const logout = () => {
    setAccessToken(null);
    setSpreadsheetIdState(null);
    localStorage.removeItem('hos_google_token');
    localStorage.removeItem('hos_google_token_expiry');
    localStorage.removeItem('hos_spreadsheet_id');
  };

  const setSpreadsheetId = async (id: string) => {
    setSpreadsheetIdState(id);
    localStorage.setItem('hos_spreadsheet_id', id);
    try {
      await supabase.from('app_settings').upsert({ id: 1, spreadsheet_id: id });
    } catch (err) {
      console.error('Failed to save spreadsheet ID to Supabase', err);
    }
  };

  const isAuthenticated = !!accessToken;

  return (
    <GoogleAuthContext.Provider
      value={{
        accessToken,
        spreadsheetId,
        isAuthenticated,
        login,
        logout,
        setSpreadsheetId,
        isReady
      }}
    >
      {children}
    </GoogleAuthContext.Provider>
  );
};

export const useGoogleAuth = () => {
  const context = useContext(GoogleAuthContext);
  if (context === undefined) {
    throw new Error('useGoogleAuth must be used within a GoogleAuthProviderContext');
  }
  return context;
};
