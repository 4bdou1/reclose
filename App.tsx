import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleAuthProviderContext, useGoogleAuth } from './context/GoogleAuthContext';
import { Toaster } from 'sonner';

// Pages
import Auth from './pages/Auth';
import Overview from './pages/Overview';
import Tasks from './pages/Tasks';
import Research from './pages/Research';
import Analytics from './pages/Analytics';
import Files from './pages/Files';
import Settings from './pages/Settings';

// Components
import DashboardLayout from './components/dashboard/DashboardLayout';

// Landing Page Components
import Hero from './components/landing/Hero';
import WhyReclose from './components/landing/WhyReclose';
import HowWeWork from './components/landing/HowWeWork';
import CaseStudies from './components/landing/CaseStudies';
import FinalCTA from './components/landing/FinalCTA';
import Footer from './components/Footer';
import Navbar from './components/landing/Navbar';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'missing-client-id.apps.googleusercontent.com';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const { isAuthenticated, spreadsheetId, isReady } = useGoogleAuth();
  const location = useLocation();

  if (loading || !isReady) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // If user is authenticated but hasn't connected Google or a spreadsheet, force them to settings
  if ((!isAuthenticated || !spreadsheetId) && location.pathname !== '/dashboard/settings') {
    return <Navigate to="/dashboard/settings" replace />;
  }

  return <>{children}</>;
};

// Landing Page Component
const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-[#C5A059] selection:text-white">
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <WhyReclose />
        <HowWeWork />
        <CaseStudies />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
};

// Main App Component with Routes
const AppRoutes: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/auth"
        element={user ? <Navigate to="/dashboard" replace /> : <Auth />}
      />

      {/* Protected Dashboard Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Overview />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="research" element={<Research />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="files" element={<Files />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Catch all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <GoogleAuthProviderContext>
        <BrowserRouter>
          <AuthProvider>
            <AppRoutes />
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: '#FFFFFF',
                  border: '1px solid rgba(0,0,0,0.1)',
                  color: '#050505',
                  borderRadius: '16px',
                },
              }}
            />
          </AuthProvider>
        </BrowserRouter>
      </GoogleAuthProviderContext>
    </GoogleOAuthProvider>
  );
};

export default App;
