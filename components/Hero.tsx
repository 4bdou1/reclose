
import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronRight, Zap, Globe, Shield } from 'lucide-react';
import Reveal from './Reveal';
import { useAppContext } from '../context/AppContext';

const DeadDataDecryption: React.FC<{ text: string }> = ({ text }) => {
  const [revealedCount, setRevealedCount] = useState(0);
  const [flickers, setFlickers] = useState<string[]>(text.split('').map(() => '0'));

  // Rapid Binary Flicker Effect (50ms refresh)
  useEffect(() => {
    const flickerInterval = setInterval(() => {
      setFlickers(text.split('').map(() => (Math.random() > 0.5 ? '1' : '0')));
    }, 50);
    
    return () => clearInterval(flickerInterval);
  }, [text]);

  // Sequential Reveal Logic (500ms initial wait, then lock left-to-right)
  useEffect(() => {
    const lockSequence = setTimeout(() => {
      const revealInterval = setInterval(() => {
        setRevealedCount((prev) => {
          if (prev >= text.length) {
            clearInterval(revealInterval);
            return prev;
          }
          return prev + 1;
        });
      }, 120); // Speed of character reveal
      return () => clearInterval(revealInterval);
    }, 500); // Minimum flicker time before first character locks

    return () => clearTimeout(lockSequence);
  }, [text]);

  return (
    <span className="inline-flex font-mono tracking-tighter select-none">
      {text.split('').map((char, i) => {
        const isLocked = i < revealedCount;
        return (
          <span 
            key={i} 
            className={`transition-colors duration-150 text-center inline-block ${
              isLocked 
                ? 'text-white opacity-100 font-bold italic' 
                : 'text-emerald-500/30 opacity-40'
            }`}
            style={{ 
              width: char === ' ' ? '0.4em' : '0.65em',
            }}
          >
            {isLocked ? char : flickers[i]}
          </span>
        );
      })}
    </span>
  );
};

const BinaryResolver: React.FC<{ targetText: string, delay?: number, className?: string }> = ({ targetText, delay = 0, className = "" }) => {
  const [step, setStep] = useState(0);
  const totalSteps = 15;

  useEffect(() => {
    const timeout = setTimeout(() => {
      const timer = setInterval(() => {
        setStep((prev) => (prev < totalSteps ? prev + 1 : prev));
      }, 70);
      return () => clearInterval(timer);
    }, delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  const generateBinary = () => {
    return Array.from({ length: targetText.length }, () => Math.round(Math.random())).join('');
  };

  if (step === totalSteps) {
    return (
      <span className={`font-bold animate-fade-in ${className}`}>
        {targetText}
      </span>
    );
  }

  return (
    <div className="flex flex-col items-center font-mono text-brand-orange/40 text-[10px] uppercase tracking-[0.5em] h-[40px] overflow-hidden select-none">
      <div className="animate-pulse space-y-1">
        <div>{generateBinary()}</div>
        <div className="opacity-60">{generateBinary()}</div>
        <div className="opacity-30">{generateBinary()}</div>
        <div className="opacity-10">{generateBinary()}</div>
      </div>
    </div>
  );
};

const Hero: React.FC = () => {
  const { setView } = useAppContext();

  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-glow-radial opacity-30 blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-brand-dark industrial-grid opacity-40"></div>
      
      <div className="absolute top-[10%] left-[10%] w-[400px] h-[400px] bg-brand-orange/5 rounded-full blur-[100px] animate-pulse-slow"></div>
      <div className="absolute bottom-[20%] right-[10%] w-[300px] h-[300px] bg-brand-purple/5 rounded-full blur-[100px] animate-pulse-slow delay-1000"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="flex flex-col items-center text-center">
          
          <div className="mb-4 h-12 flex items-center justify-center">
            <BinaryResolver targetText="reclose" className="text-white" />
          </div>

          <Reveal delay={100}>
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-brand-border cyber-glass mb-8 animate-fade-in">
              <span className="flex h-2 w-2 rounded-full bg-brand-orange shadow-[0_0_10px_#FF6B2B]"></span>
              <span className="text-[10px] font-mono text-brand-silver uppercase tracking-[0.3em] font-medium">System Alpha v4.0.2 // Online</span>
            </div>
          </Reveal>

          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter mb-8 leading-[0.9] animate-slide-up">
            <span className="text-white">Stop Pitching</span><br />
            <DeadDataDecryption text="Dead Data." />
          </h1>

          <Reveal delay={400}>
            <p className="max-w-2xl text-lg md:text-xl text-brand-silver/60 mb-12 leading-relaxed tracking-tight">
              The era of ghost-chasing is over. <span className="text-white font-medium">reclose</span> weaponizes AI verification to deliver high-status "Growth Mode" leads directly to your CRM.
            </p>
          </Reveal>

          <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto animate-slide-up">
            <button
              onClick={() => setView('auth')}
              className="tactile-btn group relative px-10 py-5 bg-white text-black rounded-2xl font-bold text-lg flex items-center justify-center gap-3 overflow-hidden"
            >
              <span className="relative z-10 uppercase tracking-widest">Initialize ShadowAudit</span>
              <Zap className="w-5 h-5 relative z-10 fill-black" />
              <div className="absolute inset-0 bg-gradient-to-r from-brand-orange/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            
            <a
              href="#services"
              className="tactile-btn px-10 py-5 rounded-2xl font-bold text-white border border-brand-border cyber-glass hover:border-brand-silver/30 transition-all flex items-center justify-center gap-3 group"
            >
              The Arsenal <ChevronRight className="w-5 h-5 text-brand-silver/40 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          <div className="mt-24 w-full max-w-6xl relative animate-float">
            <div className="absolute -inset-2 bg-gradient-flight opacity-5 blur-[80px] rounded-3xl"></div>
            <div className="cyber-glass rounded-3xl border border-brand-border p-4 shadow-2xl overflow-hidden text-left">
               <div className="h-10 bg-brand-dark/40 border-b border-brand-border flex items-center px-6 justify-between mb-6">
                  <div className="flex gap-2.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/40"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/40"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/40"></div>
                  </div>
                  <div className="text-[10px] font-mono text-brand-silver/30 tracking-[0.2em] uppercase italic">Kernel: shadow audit stream v4.2</div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-3 h-3 text-brand-blue/50" />
                    <span className="text-[10px] font-mono text-brand-blue/50">ENCRYPTED</span>
                  </div>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-4">
                  <div className="md:col-span-8 h-80 rounded-2xl bg-brand-surface/50 border border-brand-border relative overflow-hidden flex flex-col p-8 group text-left">
                      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-10 grayscale group-hover:scale-105 transition-transform duration-1000"></div>
                      <div className="relative z-10 mt-auto text-left">
                          <div className="text-6xl font-mono font-bold tracking-tighter text-white">99.2<span className="text-brand-orange">%</span></div>
                          <div className="text-[10px] font-mono text-brand-silver/40 uppercase tracking-[0.4em] mt-2">Neural Verification Accuracy</div>
                      </div>
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-orange to-transparent opacity-20 shadow-[0_0_20px_rgba(255,107,43,0.5)] animate-glow-line"></div>
                  </div>

                  <div className="md:col-span-4 grid grid-rows-2 gap-6">
                      <div className="rounded-2xl bg-brand-surface/50 border border-brand-border p-6 flex flex-col justify-between group hover:border-brand-orange/30 transition-colors text-left">
                           <div className="flex justify-between items-start">
                             <div className="w-10 h-10 rounded-xl bg-brand-orange/10 border border-brand-orange/20 flex items-center justify-center">
                                <Zap className="w-5 h-5 text-brand-orange" />
                             </div>
                             <span className="text-[10px] font-mono text-green-400 bg-green-500/10 px-2 py-0.5 rounded uppercase font-bold">LIVE SCAN</span>
                           </div>
                           <div>
                              <div className="text-4xl font-bold tracking-tighter">1,422</div>
                              <div className="text-[10px] font-mono text-brand-silver/40 uppercase tracking-widest mt-1">Signals Extracted</div>
                           </div>
                      </div>
                      <div className="rounded-2xl bg-brand-surface/50 border border-brand-border p-6 flex flex-col justify-between group hover:border-brand-purple/30 transition-colors text-left">
                           <div className="flex justify-between items-start">
                             <div className="w-10 h-10 rounded-xl bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center">
                                <Globe className="w-5 h-5 text-brand-purple" />
                             </div>
                             <span className="text-[10px] font-mono text-brand-silver/30">DISTRIBUTED</span>
                           </div>
                           <div>
                              <div className="text-2xl font-bold text-white tracking-tighter">Global Nodes</div>
                              <div className="text-[10px] font-mono text-brand-silver/40 uppercase tracking-widest mt-1">Agent Cluster Active</div>
                           </div>
                      </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-brand-dark via-brand-dark/80 to-transparent pointer-events-none z-20"></div>
    </section>
  );
};

export default Hero;
