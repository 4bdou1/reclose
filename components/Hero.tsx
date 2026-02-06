
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, X, Sparkles } from 'lucide-react';
import Reveal from './Reveal.tsx';

/**
 * High-status Keyhole-Chat logo accurately reconstructed from the reference image.
 */
const KeyholeLogo = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="48" stroke="#C5A059" strokeWidth="1.5" strokeOpacity="0.8" />
    <circle cx="50" cy="50" r="38" stroke="#CBD5E1" strokeWidth="1.2" strokeOpacity="0.4" />
    <path 
      d="M50 25 C 38 25, 30 35, 30 45 C 30 52, 35 58, 40 62 L 35 75 L 50 68 L 65 75 L 60 62 C 65 58, 70 52, 70 45 C 70 35, 62 25, 50 25 Z" 
      fill="#C5A059" 
      fillOpacity="0.9"
    />
    <circle cx="50" cy="45" r="8" fill="#020205" />
    <path d="M50 45 L 44 58 L 56 58 Z" fill="#020205" />
  </svg>
);

const Hero: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isOpen || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 8, y: y * -8 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const handleViewOperative = () => {
    setIsOpen(false);
    navigate('/receptionist');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center pt-32 pb-24 overflow-hidden bg-brand-dark">
      <div className="absolute inset-0 industrial-grid opacity-[0.08] pointer-events-none"></div>

      {/* THE ORBITAL SYSTEM */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-6xl max-h-[800px] pointer-events-none flex items-center justify-center z-30">
        <div className={`absolute w-[600px] h-[600px] border border-brand-silver/[0.15] rounded-full transition-all duration-[600ms] cubic-bezier-reclose ${isOpen ? 'scale-150 opacity-0' : 'opacity-100'}`}></div>
        <div className={`absolute w-[850px] h-[850px] border border-brand-silver/[0.1] rounded-full transition-all duration-[600ms] cubic-bezier-reclose ${isOpen ? 'scale-110 opacity-5' : 'opacity-100'}`}></div>
        
        <div 
          className={`absolute w-[850px] h-[850px] transition-all duration-[600ms] cubic-bezier-reclose ${isOpen ? 'rotate-[15deg] scale-105' : 'animate-orbitRotate'}`}
          style={isOpen ? { animation: 'none' } : {}}
        >
          <div 
            className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto transition-all duration-500 ${isOpen ? 'opacity-0 scale-50 pointer-events-none' : 'opacity-100'}`}
            onClick={() => setIsOpen(true)}
          >
            <div className="relative cursor-pointer group p-6">
              <div className="absolute inset-0 bg-[#C5A059]/15 blur-2xl rounded-full group-hover:bg-[#C5A059]/30 transition-all duration-700 scale-150 animate-pulse"></div>
              <div className="relative w-20 h-20 bg-brand-obsidian/95 backdrop-blur-3xl rounded-full border border-white/10 p-2.5 shadow-[0_0_50px_rgba(197,160,89,0.2)] group-hover:scale-110 group-hover:border-[#C5A059]/50 transition-all duration-500">
                <KeyholeLogo className="w-full h-full" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RECEPTIONIST INTERFACE (THE CARD) */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-brand-dark/60 backdrop-blur-md animate-in fade-in duration-700"
          onClick={() => setIsOpen(false)}
        >
          {/* Parallax Container with Gold Frame */}
          <div 
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={(e) => e.stopPropagation()}
            style={{ 
              transform: `perspective(2000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
              transition: tilt.x === 0 ? 'all 0.6s cubic-bezier(0.22, 1, 0.36, 1)' : 'none'
            }}
            className="relative w-full max-w-lg p-[1.5px] rounded-[3.1rem] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-12 duration-600 cubic-bezier-reclose shadow-[0_0_60px_rgba(197,160,89,0.25)]"
          >
            {/* The Liquid Metal Sheen Border Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#C5A059] via-[#fceabb] to-[#C5A059] animate-goldSheen"></div>
            
            {/* Main Card Body Container */}
            <div className="relative bg-[#07070B] rounded-[3rem] p-12 overflow-hidden shadow-inner">
              {/* Header Section */}
              <div className="flex justify-between items-start mb-10">
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <span className="flex h-2 w-2 rounded-full bg-[#22c55e] shadow-[0_0_12px_#22c55e] animate-pulse"></span>
                    <h3 className="text-[12px] font-sans font-bold text-[#C5A059] uppercase tracking-[0.25em] animate-in fade-in slide-in-from-left duration-700 delay-100">REclose AI Receptionist</h3>
                  </div>
                  <div className="w-16 h-[0.5px] bg-[#C5A059]/40 rounded-full"></div>
                </div>
                
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2.5 text-brand-silver/30 hover:text-white transition-all hover:bg-white/5 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body Content */}
              <div className="space-y-8 mb-12">
                <p className="text-[0.95rem] font-light text-brand-silver/70 font-sans tracking-tight leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                  Your business never sleeps. Our AI Receptionist takes over the frontline, answering every WhatsApp inquiry instantly. It qualifies your leads, books your meetings, and ensures you only spend time on the deals that matter.
                </p>
                
                <div className="flex items-center gap-4 animate-in fade-in duration-1000 delay-500">
                   <div className="h-[0.5px] flex-1 bg-white/10"></div>
                   <div className="flex items-center gap-2.5 text-[9px] font-mono text-brand-silver/30 uppercase tracking-[0.4em] font-bold">
                     <Sparkles className="w-3.5 h-3.5 text-brand-silver/20" /> SYSTEM LIVE V4.2.0
                   </div>
                   <div className="h-[0.5px] flex-1 bg-white/10"></div>
                </div>
              </div>

              {/* Primary CTA */}
              <button 
                onClick={handleViewOperative}
                className="w-full group relative overflow-hidden py-5 rounded-2xl border border-white/10 text-white/90 font-bold text-[11px] uppercase tracking-[0.4em] transition-all duration-500 hover:border-[#C5A059]/60 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300"
              >
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="relative z-10">VIEW THE OPERATIVE</span>
              </button>
            </div>
            
            <div className="absolute inset-0 industrial-grid opacity-[0.03] pointer-events-none"></div>
          </div>
        </div>
      )}

      {/* LANDING PAGE CONTENT LAYER */}
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full transition-all duration-[800ms] ${isOpen ? 'opacity-10 blur-xl scale-[0.98]' : 'opacity-100 blur-0 scale-100'}`}>
        <div className="flex flex-col items-center text-center">
          <Reveal>
            <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full border border-brand-border bg-white/[0.02] backdrop-blur-md mb-12 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-brand-orange shadow-[0_0_12px_#FF6B2B] animate-pulse"></span>
              <span className="text-[10px] font-mono text-brand-silver uppercase tracking-[0.5em] font-bold">LIVE TRANSIENT ANALYTICS</span>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight mb-12 leading-[1.1] max-w-5xl text-white font-sans">
              <span className="font-light opacity-80">Command Your Market With</span> <span className="text-brand-orange italic font-bold">REclose</span> <br className="hidden md:block" />
              And Secure <span className="text-brand-silver font-bold">10+ High-Status Sales Meetings</span> <br className="hidden md:block" />
              Every Month on <span className="italic font-light text-brand-silver/50">Autopilot.</span>
            </h1>
          </Reveal>

          <Reveal delay={300}>
            <p className="max-w-2xl text-lg md:text-xl text-brand-silver/40 mb-16 leading-relaxed tracking-tight font-medium">
              The clinical antidote to manual prospecting. We deploy AI-verified intent signals directly to your CRM, allowing you to focus exclusively on closing.
            </p>
          </Reveal>

          <Reveal delay={500}>
            <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto items-center">
              <button
                onClick={() => navigate('/auth')}
                className="tactile-btn group relative px-14 py-7 bg-white text-black rounded-2xl font-bold text-lg flex items-center gap-5 overflow-hidden shadow-[0_25px_70px_-15px_rgba(255,255,255,0.15)] active:scale-95"
              >
                <span className="relative z-10 uppercase tracking-[0.2em]">Initialize Command</span>
                <ArrowRight className="w-6 h-6 relative z-10 group-hover:translate-x-1.5 transition-transform duration-500" />
              </button>
              
              <button
                onClick={() => {
                  const el = document.getElementById('services');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-14 py-7 rounded-2xl border border-brand-border text-brand-silver/60 font-bold text-lg hover:text-white hover:border-white/20 transition-all flex items-center gap-3 backdrop-blur-md"
              >
                View System Docs
              </button>
            </div>
          </Reveal>

          <Reveal delay={700}>
            <div className="mt-32 flex flex-wrap justify-center gap-16 opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-1000">
               <div className="flex items-center gap-4">
                 <div className="h-[0.5px] w-12 bg-white/20"></div>
                 <span className="text-[11px] font-mono uppercase tracking-[0.4em] font-bold">Institutional Grade</span>
                 <div className="h-[0.5px] w-12 bg-white/20"></div>
               </div>
               <div className="flex items-center gap-4">
                 <div className="h-[0.5px] w-12 bg-white/20"></div>
                 <span className="text-[11px] font-mono uppercase tracking-[0.4em] font-bold">Verified Autopilot</span>
                 <div className="h-[0.5px] w-12 bg-white/20"></div>
               </div>
            </div>
          </Reveal>
        </div>
      </div>

      <style>{`
        @keyframes orbitRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes goldSheen {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-orbitRotate {
          animation: orbitRotate 45s linear infinite;
        }
        .animate-goldSheen {
          background-size: 300% 300%;
          animation: goldSheen 8s ease infinite;
        }
        .cubic-bezier-reclose {
          transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
        }
      `}</style>
    </section>
  );
};

export default Hero;
