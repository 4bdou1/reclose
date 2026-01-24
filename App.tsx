
import React from 'react';
import { AppProvider, useAppContext } from './context/AppContext.tsx';
import Navbar from './components/Navbar.tsx';
import Hero from './components/Hero.tsx';
import About from './components/About.tsx';
import Services from './components/Services.tsx';
import LuxuryTicker from './components/LuxuryTicker.tsx';
import Benefits from './components/Benefits.tsx';
import ShadowAuditTerminal from './components/ShadowAuditTerminal.tsx';
import Pricing from './components/Pricing.tsx';
import CTA from './components/CTA.tsx';
import Footer from './components/Footer.tsx';
import AuthScreen from './components/auth/AuthScreen.tsx';
import Dashboard from './components/dashboard/Dashboard.tsx';
import AIArchitect from './components/AIArchitect.tsx';
import TheReceptionist from './components/TheReceptionist.tsx';

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

  if (view === 'receptionist') {
    return <TheReceptionist />;
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
