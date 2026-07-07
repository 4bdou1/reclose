import React, { createContext, useContext, useState, useEffect } from 'react';
import { useGoogleLogin, googleLogout } from '@react-oauth/google';

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

  useEffect(() => {
    // Load persisted state
    const savedToken = localStorage.getItem('hos_google_token');
    const savedTokenExpiry = localStorage.getItem('hos_google_token_expiry');
    const savedSheetId = localStorage.getItem('hos_spreadsheet_id');

    if (savedSheetId) {
      setSpreadsheetIdState(savedSheetId);
    }

    if (savedToken && savedTokenExpiry) {
      if (new Date().getTime() < parseInt(savedTokenExpiry)) {
        setAccessToken(savedToken);
      } else {
        // Token expired
        localStorage.removeItem('hos_google_token');
        localStorage.removeItem('hos_google_token_expiry');
      }
    }
    
    setIsReady(true);
  }, []);

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      setAccessToken(tokenResponse.access_token);
      localStorage.setItem('hos_google_token', tokenResponse.access_token);
      // Approximate expiry (1 hour)
      localStorage.setItem('hos_google_token_expiry', (new Date().getTime() + 3500 * 1000).toString());
    },
    onError: (error) => console.error('Login Failed:', error),
    scope: 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.readonly',
  });

  const logout = () => {
    googleLogout();
    setAccessToken(null);
    setSpreadsheetIdState(null);
    localStorage.removeItem('hos_google_token');
    localStorage.removeItem('hos_google_token_expiry');
    localStorage.removeItem('hos_spreadsheet_id');
  };

  const setSpreadsheetId = (id: string) => {
    setSpreadsheetIdState(id);
    localStorage.setItem('hos_spreadsheet_id', id);
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
