
import React from 'react';
import { ChevronRight, Target, ShieldCheck, Activity, ArrowRight } from 'lucide-react';
import Reveal from './Reveal.tsx';
import { useAppContext } from '../context/AppContext.tsx';

// Hero component providing the landing page header section with key CTAs and value propositions
const Hero: React.FC = () => {
  const { setView } = useAppContext();

  return (
    <section className="relative min-h-screen flex items-center pt-32 pb-24 overflow-hidden bg-brand-dark">
      {/* Background Ambience: Subtle and Architectural */}
      <div className="absolute inset-0 industrial-grid opacity-[0.1] pointer-events-none"></div>
      
      {/* Refined Radial Glows */}
      <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-brand-orange/[0.03] blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-full h-[200px] bg-gradient-to-t from-brand-orange/[0.02] to-transparent blur-[60px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="flex flex-col items-center text-center">
          
          {/* Status Badge */}
          <Reveal>
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-brand-border bg-white/[0.02] backdrop-blur-md mb-10 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-brand-orange shadow-[0_0_10px_#FF6B2B] animate-pulse"></span>
              <span className="text-[10px] font-mono text-brand-silver uppercase tracking-[0.4em] font-bold">LIVE TRANSIENT ANALYTICS</span>
            </div>
          </Reveal>

          {/* Clean, Refined Headline */}
          <Reveal delay={100}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight mb-10 leading-[1.1] max-w-5xl text-white font-sans">
              <span className="font-light opacity-90">Command Your Market With</span> <span className="text-brand-orange italic font-bold">REclose</span> <br className="hidden md:block" />
              And Secure <span className="text-brand-silver font-bold">10+ High-Status Sales Meetings</span> <br className="hidden md:block" />
              Every Month on <span className="italic font-light text-brand-silver/60">Autopilot.</span>
            </h1>
          </Reveal>

          <Reveal delay={300}>
            <p className="max-w-xl text-base md:text-lg text-brand-silver/40 mb-14 leading-relaxed tracking-tight font-medium">
              The clinical antidote to manual prospecting. We deploy AI-verified intent signals directly to your CRM, allowing you to focus exclusively on closing.
            </p>
          </Reveal>

          {/* CTAs: Smooth and Precise */}
          <Reveal delay={500}>
            <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto items-center">
              <button
                onClick={() => setView('auth')}
                className="tactile-btn group relative px-10 py-5 bg-white text-black rounded-xl font-bold text-lg flex items-center gap-3 overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_20px_50px_rgba(255,255,255,0.1)]"
              >
                <span className="relative z-10">Access Agent Protocol</span>
                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-r from-brand-orange/10 via-transparent to-brand-purple/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
              
              <button
                onClick={() => {
                  const el = document.getElementById('services');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-10 py-5 rounded-xl border border-brand-border text-brand-silver/60 font-bold text-lg hover:text-white hover:border-white/20 transition-all flex items-center gap-3"
              >
                View System Docs
              </button>
            </div>
          </Reveal>

          {/* Visual Trust Indicator */}
          <Reveal delay={700}>
            <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-12 opacity-30 grayscale hover:opacity-60 hover:grayscale-0 transition-all duration-700">
               <div className="flex flex-col items-center gap-2">
                 <ShieldCheck className="w-6 h-6" />
                 <span className="text-[8px] font-mono uppercase tracking-[0.3em]">Encrypted Buffer</span>
               </div>
               <div className="flex flex-col items-center gap-2">
                 <Activity className="w-6 h-6" />
                 <span className="text-[8px] font-mono uppercase tracking-[0.3em]">Real-time Pulse</span>
               </div>
               <div className="flex flex-col items-center gap-2">
                 <Target className="w-6 h-6" />
                 <span className="text-[8px] font-mono uppercase tracking-[0.3em]">Precision Scout</span>
               </div>
               <div className="flex flex-col items-center gap-2">
                 <ChevronRight className="w-6 h-6" />
                 <span className="text-[8px] font-mono uppercase tracking-[0.3em]">Neural Interface</span>
               </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default Hero;
