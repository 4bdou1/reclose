
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, ShadowAuditResult } from '../lib/types';

type View = 'landing' | 'auth' | 'dashboard' | 'receptionist';
export type DashboardModule = 'COMMAND' | 'VAULT' | 'PLANNING' | 'OUTREACH' | 'LIBRARY' | 'REVENUE';

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  view: View;
  setView: (view: View) => void;
  logout: () => void;
  selectedTier: UserRole | null;
  setSelectedTier: (role: UserRole | null) => void;
  isDiscountActive: boolean;
  setIsDiscountActive: (active: boolean) => void;
  latestAudit: ShadowAuditResult | null;
  setLatestAudit: (audit: ShadowAuditResult | null) => void;
  activeDashboardModule: DashboardModule;
  setActiveDashboardModule: (module: DashboardModule) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<View>('landing');
  const [selectedTier, setSelectedTier] = useState<UserRole | null>(null);
  const [isDiscountActive, setIsDiscountActive] = useState(false);
  const [latestAudit, setLatestAudit] = useState<ShadowAuditResult | null>(null);
  const [activeDashboardModule, setActiveDashboardModule] = useState<DashboardModule>('COMMAND');

  // Check for existing session
  useEffect(() => {
    const storedUser = localStorage.getItem('reclose_current_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setView('dashboard');
    }
  }, []);

  const handleSetUser = (u: User | null) => {
    setUser(u);
    if (u) {
      localStorage.setItem('reclose_current_user', JSON.stringify(u));
      setView('dashboard');
    } else {
      localStorage.removeItem('reclose_current_user');
    }
  };

  const logout = () => {
    handleSetUser(null);
    setView('landing');
    setSelectedTier(null);
    setLatestAudit(null);
    setActiveDashboardModule('COMMAND');
  };

  return (
    <AppContext.Provider value={{ 
      user, 
      setUser: handleSetUser, 
      view, 
      setView, 
      logout,
      selectedTier,
      setSelectedTier,
      isDiscountActive,
      setIsDiscountActive,
      latestAudit,
      setLatestAudit,
      activeDashboardModule,
      setActiveDashboardModule
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
