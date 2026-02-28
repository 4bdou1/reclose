
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, MessageCircle, Calendar,
  Bell, Zap, User, Target, Cpu,
  ShieldCheck, ArrowRight, Award, Crown, Shield, Check
} from 'lucide-react';
import Reveal from './Reveal.tsx';

/**
 * High-status Keyhole-Chat logo accurately reconstructed from the reference image.
 * Reverted to match the version in the Hero section for brand consistency.
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

/**
 * Reconstructed Master Eagle Emblem (Image 1 Style)
 */
const EagleEmblem = () => (
  <svg
    viewBox="0 0 1000 600"
    className="w-full h-full drop-shadow-[0_0_80px_rgba(197,160,89,0.25)] mix-blend-screen opacity-60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="gold-grad" x1="500" y1="100" x2="500" y2="500" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#C5A059" stopOpacity="0.9" />
        <stop offset="50%" stopColor="#8A6E3B" stopOpacity="0.7" />
        <stop offset="100%" stopColor="#C5A059" stopOpacity="0" />
      </linearGradient>
    </defs>
    <path d="M500 450 L470 360 L490 310 L500 290 L510 310 L530 360 Z" fill="url(#gold-grad)" />
    <path d="M470 360 C350 360 100 250 50 150 L120 170 L110 190 L180 210 L170 230 L240 250 L230 270 L470 360" fill="url(#gold-grad)" />
    <path d="M530 360 C650 360 900 250 950 150 L880 170 L890 190 L820 210 L830 230 L760 250 L770 270 L530 360" fill="url(#gold-grad)" />
    <path d="M50 150 L120 170 L110 190 L180 210 L470 360 Z" fill="#000" fillOpacity="0.3" />
    <path d="M950 150 L880 170 L890 190 L820 210 L530 360 Z" fill="#000" fillOpacity="0.3" />
  </svg>
);

const StarHalo = () => {
  const stars = useMemo(() => {
    return Array.from({ length: 70 }).map((_, i) => {
      const angle = (i / 70) * Math.PI * 2;
      const radius = 240 + Math.random() * 80;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * (radius * 0.5);
      return { id: i, x, y, size: 1 + Math.random() * 2, duration: 1.5 + Math.random() * 3, delay: Math.random() * 5 };
    });
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="relative w-full h-full animate-star-rotate">
        {stars.map((star) => (
          <div key={star.id} className="absolute bg-brand-gold rounded-full animate-star-twinkle"
            style={{ width: star.size, height: star.size, left: `calc(50% + ${star.x}px)`, top: `calc(50% + ${star.y}px)`, animationDuration: `${star.duration}s`, animationDelay: `${star.delay}s` }}
          />
        ))}
      </div>
    </div>
  );
};

const FlowNode: React.FC<{ icon: React.ReactNode, label: string, subLabel?: string, color: 'blue' | 'gold' }> = ({ icon, label, subLabel, color }) => (
  <div className="flex flex-col items-center z-20 transition-all duration-500 hover:scale-105">
    <div className={`w-14 h-14 md:w-16 md:h-16 rounded-[1.2rem] bg-black border ${color === 'blue' ? 'border-brand-blue/40 shadow-[0_0_25px_rgba(59,130,246,0.3)]' : 'border-brand-gold/40 shadow-[0_0_25px_rgba(197,160,89,0.3)]'} flex items-center justify-center transition-all duration-500`}>
      <div className={color === 'blue' ? 'text-brand-blue' : 'text-brand-gold'}>
        {React.cloneElement(icon as React.ReactElement, { size: 24, strokeWidth: 1.5 })}
      </div>
    </div>
    <div className="mt-4 text-center max-w-[120px]">
      <div className="text-[10px] font-black text-white uppercase tracking-[0.15em] leading-tight">{label}</div>
      {subLabel && <div className="text-[8px] text-white/30 uppercase tracking-[0.2em] font-mono mt-1">{subLabel}</div>}
    </div>
  </div>
);

const PricingCard: React.FC<{ title: string, price: string, description: string, icon: React.ReactNode, features: string[], isPremium?: boolean }> = ({ title, price, description, icon, features, isPremium }) => (
  <div className={`p-8 rounded-[2.5rem] bg-black border ${isPremium ? 'border-brand-gold shadow-[0_0_40px_rgba(197,160,89,0.1)]' : 'border-white/5'} transition-all duration-500 hover:scale-105 group`}>
    <div className="mb-8 flex justify-between items-start">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isPremium ? 'bg-brand-gold/10 text-brand-gold' : 'bg-white/5 text-brand-silver/30'}`}>
        {icon}
      </div>
      {isPremium && <span className="text-[8px] font-mono font-bold text-brand-gold border border-brand-gold/30 px-2 py-1 rounded-lg uppercase tracking-widest">Recommended</span>}
    </div>
    <h3 className={`text-xl font-black uppercase tracking-widest mb-2 ${isPremium ? 'text-brand-gold' : 'text-white'}`}>{title}</h3>
    <div className="flex items-baseline gap-1 mb-6">
      <span className="text-4xl font-black text-white">{price}</span>
      <span className="text-[9px] text-white/20 font-mono uppercase tracking-widest">/ Month</span>
    </div>
    <p className="text-white/40 text-[11px] font-semibold leading-relaxed mb-8 h-12">{description}</p>
    <ul className="space-y-4 mb-10">
      {features.map((f, i) => (
        <li key={i} className="flex items-center gap-3 text-[10px] text-white/60 group-hover:text-white transition-colors">
          <Check className={`w-3.5 h-3.5 ${isPremium ? 'text-brand-gold' : 'text-white/20'}`} /> {f}
        </li>
      ))}
    </ul>
    <button className={`w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] transition-all ${isPremium ? 'bg-brand-gold text-black hover:bg-white' : 'bg-white/5 border border-white/10 text-white hover:bg-white hover:text-black'}`}>Get Access</button>
  </div>
);

interface TheReceptionistProps {
  onClose?: () => void;
}

const TheReceptionist: React.FC<TheReceptionistProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const paths = { p1: "M100,100 L200,100", p2: "M300,100 L400,100", p3: "M500,100 C 580,100 580,40 680,40", p4: "M500,100 C 580,100 580,160 680,160", p5: "M780,40 C 850,40 850,100 920,100", p6: "M780,160 C 850,160 850,100 920,100" };

  return (
    <div className="w-full h-full bg-black text-white font-sans overflow-hidden selection:bg-brand-gold/30 relative">

      {/* 1. FROZEN SUB-BACKGROUND */}
      <div className="absolute inset-0 bg-black pointer-events-none z-0"></div>

      {/* STATIC LOCKED EAGLE BACKGROUND - Aligned with the text but frozen */}
      <div className="absolute left-1/2 -translate-x-1/2 top-[140px] md:top-[60px] w-full max-w-[1200px] aspect-video flex items-center justify-center pointer-events-none z-0 opacity-80 md:opacity-100">
        <div className="relative w-full h-full flex items-center justify-center scale-[1.25] md:scale-[1.15]">
          <EagleEmblem />
          <StarHalo />
        </div>
      </div>

      <div className="absolute inset-0 industrial-grid opacity-[0.03] pointer-events-none z-1"></div>

      {/* 2. FROZEN NAVBAR LAYER */}
      <nav className="absolute top-0 left-0 right-0 z-[100] p-10 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
        <button
          onClick={() => { if (onClose) onClose(); else navigate('/'); }}
          className="pointer-events-auto flex items-center gap-3 text-white/30 hover:text-white transition-all font-mono text-[10px] uppercase tracking-[0.5em] font-black group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1.5 transition-transform" /> LEAVE
        </button>
        <div className="flex items-center gap-4 pointer-events-auto">
          <div className="relative flex items-center justify-center w-10 h-10">
            <div className="absolute inset-0 bg-brand-gold/10 blur-xl rounded-full animate-pulse"></div>
            <KeyholeLogo className="w-10 h-10 relative z-10" />
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[8px] font-mono text-brand-gold uppercase tracking-[0.3em] font-black opacity-60">SYSTEM_RECLOSE</span>
            <span className="text-[7px] font-mono text-green-500 uppercase tracking-[0.2em] font-bold">OPERATIONAL</span>
          </div>
        </div>
      </nav>

      {/* 3. SCROLLING CONTENT LAYER */}
      <div className="absolute inset-0 overflow-y-auto overflow-x-hidden z-20">
        <main className="relative flex flex-col items-center pt-32 pb-16 px-4 min-h-screen">

          <div className="text-center mb-24 animate-fade-in relative z-10">
            <div className="font-mono text-[9px] text-white/20 tracking-[0.8em] mb-4 uppercase flex items-center justify-center gap-4">
              <span>[ RECLOSE_OS_V4.2 ]</span> <span className="opacity-10">//</span> <span>[ FRONT_OFFICE_ARCHITECTURE ]</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-[0.6em] text-white uppercase drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">ᴛʜᴇ ʀᴇᴄᴇᴘᴛɪᴏɴɪꜱᴛ</h1>
          </div>

          {/* Workflow Diagram Section */}
          <div className="relative w-full max-w-5xl py-12 mb-52">
            <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible hidden md:block" viewBox="0 0 1000 200">
              <g stroke="white" strokeWidth="1" strokeOpacity="0.1" fill="none">
                <path d={paths.p1} /><path d={paths.p2} /><path d={paths.p3} /><path d={paths.p4} /><path d={paths.p5} /><path d={paths.p6} />
              </g>
              <g>
                <circle r="2.5" fill="#3B82F6"><animateMotion dur="2.5s" repeatCount="indefinite" path={paths.p1} /></circle>
                <circle r="2.5" fill="#C5A059"><animateMotion dur="3s" repeatCount="indefinite" path={paths.p2} begin="0.5s" /></circle>
                <circle r="2" fill="#3B82F6"><animateMotion dur="3.5s" repeatCount="indefinite" path={paths.p3} begin="1s" /></circle>
                <circle r="2" fill="#C5A059"><animateMotion dur="4s" repeatCount="indefinite" path={paths.p4} begin="1.5s" /></circle>
                <circle r="2" fill="#3B82F6"><animateMotion dur="3.5s" repeatCount="indefinite" path={paths.p5} begin="2s" /></circle>
                <circle r="2" fill="#C5A059"><animateMotion dur="4s" repeatCount="indefinite" path={paths.p6} begin="2.5s" /></circle>
              </g>
            </svg>
            <div className="flex flex-col md:flex-row items-center justify-between gap-16 md:gap-0 relative z-20 px-8">
              <FlowNode icon={<User />} label="Lead" color="blue" />
              <FlowNode icon={<MessageCircle />} label="WhatsApp Capture" color="blue" />
              <FlowNode icon={<Zap />} label="Qualification (AI)" color="gold" />
              <div className="flex flex-col gap-24">
                <FlowNode icon={<Calendar />} label="Instant Booking" subLabel="(CRM Sync)" color="blue" />
                <FlowNode icon={<Bell />} label="Agent Notification" subLabel="(REclose OS)" color="gold" />
              </div>
              <div className="flex flex-col items-center transition-all duration-500 hover:scale-110">
                <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center bg-black shadow-[0_0_40px_rgba(255,255,255,0.05)] relative group overflow-hidden">
                  <div className="absolute inset-0 bg-brand-blue/10 animate-pulse"></div>
                  <div className="w-3 h-3 rounded-full bg-white shadow-[0_0_20px_#fff]"></div>
                  <div className="absolute inset-0 w-full h-full rounded-full border border-white/30 animate-ping opacity-20"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Philosophy Cards restored with original full length sentences */}
          <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-12 mb-32 relative z-20">
            <Reveal>
              <div className="space-y-6 group">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-brand-blue/10 border border-brand-blue/20">
                    <ShieldCheck className="text-brand-blue w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter">Philosophy</h3>
                </div>
                <p className="text-white/40 text-[13px] leading-relaxed font-semibold italic group-hover:text-white/60 transition-colors">
                  "In a high-stakes world, attention is the only currency that truly matters. We didn't just build a tool; we created The Receptionist to be the guardian of your time."
                </p>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="space-y-6 group">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                    <Cpu className="text-white w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter">Operative</h3>
                </div>
                <p className="text-white/40 text-[13px] leading-relaxed font-semibold group-hover:text-white/60 transition-colors">
                  Your 24/7 digital partner. Awake and alert when you can't be. A sophisticated presence that understands prospect intent and clears noise before it hits your desk.
                </p>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div className="space-y-6 group">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-brand-gold/10 border border-brand-gold/20">
                    <Target className="text-brand-gold w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter">The Goal</h3>
                </div>
                <p className="text-white/40 text-[13px] leading-relaxed font-semibold group-hover:text-white/60 transition-colors">
                  Security & Vision. You focus on the scaling. We'll make sure the frontline is always secure and every high-value opportunity is locked in instantly.
                </p>
              </div>
            </Reveal>
          </div>

          {/* Pricing section maintained */}
          <section className="w-full max-w-6xl mx-auto px-4 mb-32 relative z-20">
            <div className="text-center mb-16"><h2 className="text-4xl font-black uppercase tracking-widest mb-4">Infrastructure Access</h2><div className="w-12 h-1 bg-brand-gold mx-auto rounded-full"></div></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Reveal delay={300} width="100%"><PricingCard title="Starter" price="$25" icon={<Award size={24} />} description="24/7 WhatsApp FAQ handling." features={["FAQ Handling", "Lead Storage", "Basic Analytics"]} /></Reveal>
              <Reveal delay={400} width="100%"><PricingCard title="Premium" price="$50" isPremium icon={<Crown size={24} />} description="Full calendar sync." features={["Calendar Sync", "AI Qualifying", "CRM Integration"]} /></Reveal>
              <Reveal delay={500} width="100%"><PricingCard title="Enterprise" price="$250" icon={<Shield size={24} />} description="Multi-agent routing." features={["Multi-Agent Routing", "Unlimited Flow", "Custom Logic"]} /></Reveal>
            </div>
          </section>

          <footer className="w-full py-12 border-t border-white/5 text-center mt-20 opacity-20"><div className="text-[9px] font-mono uppercase tracking-[1.5em] font-black">RECLOSE_OS_V4 // GLOBAL_STATION // HPF_ENGINES</div></footer>
        </main>
      </div>
      <style>{`
        @keyframes starRotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes starTwinkle { 0%, 100% { opacity: 0.1; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.2); } }
        .animate-star-rotate { animation: starRotate 120s linear infinite; }
        .animate-star-twinkle { animation: starTwinkle ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default TheReceptionist;
