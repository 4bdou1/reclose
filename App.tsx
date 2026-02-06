import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'sonner';

// Pages
import Auth from './pages/Auth';
import Overview from './pages/Overview';
import Leads from './pages/Leads';
import Settings from './pages/Settings';
import Inbox from './pages/Inbox';
import KnowledgeBase from './pages/KnowledgeBase';
import Integrations from './pages/Integrations';
import CalendarPage from './pages/Calendar';
import Projects from './pages/Projects';

// Components
import DashboardLayout from './components/dashboard/DashboardLayout';

// Landing Page Components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import LuxuryTicker from './components/LuxuryTicker';
import Benefits from './components/Benefits';
import ShadowAuditTerminal from './components/ShadowAuditTerminal';
import Pricing from './components/Pricing';
import CTA from './components/CTA';
import Footer from './components/Footer';
import AIArchitect from './components/AIArchitect';
import TheReceptionist from './components/TheReceptionist';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020205] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

// Landing Page Component
const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-brand-dark text-white font-sans selection:bg-brand-orange selection:text-white overflow-x-hidden industrial-grid">
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <ShadowAuditTerminal />
        <About />
        <Services />
        <LuxuryTicker />
        <Benefits />
        <Pricing />
        <CTA />
      </main>
      <Footer />
      <AIArchitect />
    </div>
  );
};

// Main App Component with Routes
const AppRoutes: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020205] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin" />
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
      <Route path="/receptionist" element={<TheReceptionist />} />

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
        <Route path="leads" element={<Leads />} />
        <Route path="inbox" element={<Inbox />} />
        <Route path="calendar" element={<CalendarPage />} />
        <Route path="projects" element={<Projects />} />
        <Route path="knowledge" element={<KnowledgeBase />} />
        <Route path="integrations" element={<Integrations />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Catch all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#0A0A0A',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#fff',
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
