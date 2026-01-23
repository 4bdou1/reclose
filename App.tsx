
import React from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
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
import AuthScreen from './components/auth/AuthScreen';
import Dashboard from './components/dashboard/Dashboard';
import AIArchitect from './components/AIArchitect';

const MainContent: React.FC = () => {
  const { view } = useAppContext();

  if (view === 'auth') {
    return <AuthScreen />;
  }

  if (view === 'dashboard') {
    return (
      <>
        <Dashboard />
        <AIArchitect />
      </>
    );
  }

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

const App: React.FC = () => {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
};

export default App;
