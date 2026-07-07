import React, { createContext, useContext, useState, useEffect } from 'react';

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

  // Function to sync token from localStorage (set by AuthContext on Supabase login)
  const syncToken = () => {
    const savedToken = localStorage.getItem('hos_google_token');
    const savedTokenExpiry = localStorage.getItem('hos_google_token_expiry');
    
    if (savedToken && savedTokenExpiry) {
      if (new Date().getTime() < parseInt(savedTokenExpiry)) {
        setAccessToken(savedToken);
      } else {
        localStorage.removeItem('hos_google_token');
        localStorage.removeItem('hos_google_token_expiry');
        setAccessToken(null);
      }
    } else {
      setAccessToken(null);
    }
  };

  useEffect(() => {
    // Initial sync
    const savedSheetId = localStorage.getItem('hos_spreadsheet_id');
    if (savedSheetId) setSpreadsheetIdState(savedSheetId);
    
    syncToken();
    setIsReady(true);

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
