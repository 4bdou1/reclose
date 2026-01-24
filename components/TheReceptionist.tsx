
import React, { useEffect, useRef } from 'react';
import { 
  ArrowLeft, MessageCircle, Calendar, 
  Bell, Check, Award, Building2, Stethoscope, 
  Briefcase, Zap, Globe, User, Crown, Shield
} from 'lucide-react';
import { useAppContext } from '../context/AppContext.tsx';
import Reveal from './Reveal.tsx';

const AnimatedNetwork: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles: Particle[] = [];
    const particleCount = 80;
    const maxDistance = 180;

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.size = Math.random() * 1.5;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(56, 189, 248, 0.2)';
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) particles.push(new Particle());

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p, i) => {
        p.update();
        p.draw();
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDistance) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            const opacity = (1 - dist / maxDistance) * 0.15;
            ctx.strokeStyle = `rgba(56, 189, 248, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });
      requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
};

const HeaderTitle: React.FC = () => (
  <div className="flex flex-col items-center mb-24">
    <div className="font-mono text-[11px] text-white/40 tracking-[0.4em] mb-1">01010100 01001000 01000101</div>
    <div className="font-mono text-[11px] text-white/40 tracking-[0.4em] mb-4">01010010 01000101 01000011</div>
    <h1 className="text-4xl md:text-7xl font-black tracking-[0.25em] text-white text-center">
      THE_RECEPTIONIST
    </h1>
  </div>
);

const FlowNode: React.FC<{ 
  icon: React.ReactNode, 
  label: string, 
  subLabel?: string, 
  color: 'teal' | 'gold', 
  active?: boolean 
}> = ({ icon, label, subLabel, color, active }) => {
  const colorClass = color === 'teal' ? 'border-brand-blue/60 shadow-[0_0_20px_rgba(59,130,246,0.2)]' : 'border-[#C5A059]/60 shadow-[0_0_20px_rgba(197,160,89,0.2)]';
  const iconColor = color === 'teal' ? 'text-brand-blue' : 'text-[#C5A059]';

  return (
    <div className="flex flex-col items-center z-10">
      <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-[#0F1117] border-2 ${colorClass} flex items-center justify-center transition-transform hover:scale-110 duration-500`}>
        <div className={`${iconColor}`}>{icon}</div>
      </div>
      <div className="mt-4 text-center">
        <div className="text-[10px] md:text-[11px] font-bold text-white uppercase tracking-widest">{label}</div>
        {subLabel && <div className="text-[8px] md:text-[9px] text-white/40 uppercase tracking-widest font-mono mt-1">{subLabel}</div>}
      </div>
    </div>
  );
};

const PricingCard: React.FC<{
  title: string;
  price: string;
  icon: React.ReactNode;
  description: string;
  isPremium?: boolean;
}> = ({ title, price, icon, description, isPremium }) => (
  <div className={`relative flex flex-col items-center p-12 rounded-[2rem] border transition-all duration-500 hover:-translate-y-2 cursor-default h-full ${
    isPremium 
      ? 'bg-brand-obsidian border-[#C5A059]/40 shadow-[0_20px_60px_-15px_rgba(197,160,89,0.15)]' 
      : 'bg-brand-surface/30 border-white/5'
  }`}>
    {isPremium && (
      <div className="absolute -top-[1.5px] left-0 right-0 h-16 bg-gradient-to-b from-[#C5A059] to-transparent rounded-t-[2rem] flex items-start justify-center pt-3">
        <span className="text-[10px] font-bold text-black uppercase tracking-[0.4em]">PREMIUM CARD</span>
      </div>
    )}

    <div className={`w-14 h-14 rounded-full border border-white/10 flex items-center justify-center mb-8 ${isPremium ? 'text-[#C5A059]' : 'text-white/40'}`}>
      {icon}
    </div>

    <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-[0.2em]">{title}</h3>
    
    <p className="text-[11px] text-white/30 text-center leading-relaxed mb-10 max-w-[200px]">
      {description}
    </p>

    <div className={`mt-auto font-bold text-white tracking-tighter ${price.length > 5 ? 'text-2xl' : 'text-4xl'}`}>
      {price}
    </div>
  </div>
);

const TheReceptionist: React.FC = () => {
  const { setView } = useAppContext();

  return (
    <div className="min-h-screen bg-[#020205] text-white font-sans overflow-x-hidden selection:bg-brand-orange selection:text-white">
      <AnimatedNetwork />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-[100] p-8 flex justify-between items-center bg-gradient-to-b from-[#020205] to-transparent">
        <button 
          onClick={() => setView('landing')}
          className="flex items-center gap-2 text-white/40 hover:text-white transition-all group font-mono text-[10px] uppercase tracking-[0.4em] font-bold"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back
        </button>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-brand-blue animate-pulse"></div>
          <span className="text-[10px] font-mono text-brand-blue uppercase tracking-[0.4em] font-bold">SYSTEM ACTIVE</span>
        </div>
      </nav>

      <main className="relative z-10 pt-40 pb-24">
        <section className="max-w-7xl mx-auto px-6 mb-40">
          <HeaderTitle />

          {/* FLOW ARCHITECTURE - Reconstructed precisely from image */}
          <div className="relative max-w-6xl mx-auto py-20 px-4 md:px-0">
            {/* Connecting Lines SVG Overlay */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible hidden md:block" viewBox="0 0 1000 300">
              <defs>
                <linearGradient id="grad-teal" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.8" />
                </linearGradient>
                <linearGradient id="grad-gold" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#C5A059" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#C5A059" stopOpacity="0.8" />
                </linearGradient>
              </defs>
              {/* Paths based on the image's wiring */}
              <path d="M120,150 L200,150" stroke="url(#grad-teal)" strokeWidth="2" fill="none" />
              <path d="M300,150 L400,150" stroke="url(#grad-gold)" strokeWidth="2" fill="none" />
              <path d="M500,150 C 550,150 550,80 650,80" stroke="url(#grad-teal)" strokeWidth="2" fill="none" />
              <path d="M500,150 C 550,150 550,220 650,220" stroke="url(#grad-gold)" strokeWidth="2" fill="none" />
              <path d="M750,80 C 850,80 850,150 900,150" stroke="url(#grad-teal)" strokeWidth="2" fill="none" />
              <path d="M750,220 C 850,220 850,150 900,150" stroke="url(#grad-gold)" strokeWidth="2" fill="none" />
              {/* Animated dots on paths */}
              <circle r="3" fill="#3B82F6">
                <animateMotion dur="3s" repeatCount="indefinite" path="M120,150 L200,150" />
              </circle>
              <circle r="3" fill="#C5A059">
                <animateMotion dur="4s" repeatCount="indefinite" path="M300,150 L400,150" />
              </circle>
            </svg>

            <div className="flex flex-col md:flex-row items-center justify-between gap-12 md:gap-4">
              <FlowNode icon={<User className="w-8 h-8" />} label="Lead" color="teal" />
              <FlowNode icon={<MessageCircle className="w-8 h-8" />} label="WhatsApp Capture" color="teal" />
              <FlowNode icon={<Zap className="w-8 h-8" />} label="Qualification (AI)" color="gold" />
              
              <div className="flex flex-col gap-12">
                <FlowNode icon={<Calendar className="w-8 h-8" />} label="Instant Booking" subLabel="(CRM Sync)" color="teal" />
                <FlowNode icon={<Bell className="w-8 h-8" />} label="Agent Notification" subLabel="(REclose OS)" color="gold" />
              </div>

              {/* End Point */}
              <div className="w-10 h-10 rounded-full border-2 border-brand-blue/40 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-brand-blue shadow-[0_0_15px_#3B82F6]"></div>
              </div>
            </div>
          </div>
        </section>

        {/* TRIPLE COLUMN LAYOUT - manifesto, why, pricing header */}
        <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-16 mb-24 items-start">
          <Reveal>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tight">The Manifesto</h2>
              <div className="w-12 h-[1px] bg-white/20"></div>
              <p className="text-white/40 text-[13px] leading-[1.8] font-medium">
                REclose is a premium assistant considering global trends has automatically in process, and unlock the caliber to fit and agent isolate the global shift.<br/><br/>
                REclose have evolution to has premium issued design to high-growth industries in harmony with that their services are seamless automation workflow.<br/><br/>
                REclose is a new frontier and presents leaders, and omnipresent; every business deal to be responsive in meeting and execute the deals to the timeline.
              </p>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tight">The 'Why' Behind<br/>the Global Shift</h2>
              <p className="text-white/40 text-[13px] leading-[1.8] font-medium">
                The "Why" Behind the Global Shift mining an emotion of a seamless automation workflow, helped with concurrency and newly agency three innovation leaderships, in the media and spelling the core effects and global needs goes into resilient practices.<br/><br/>
                Our global in the transition has world investment continued to my business, they won awareness marketplace, and
              </p>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tight">Tiered Global Pricing & Services</h2>
              <p className="text-white/40 text-[13px] leading-[1.8] font-medium">
                You can have bespoke like requirements and configurations northshore.
              </p>
            </div>
          </Reveal>
        </section>

        {/* PRICING GRID - Updated with new requested tiers */}
        <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 mb-40">
          <Reveal width="100%" delay={300}>
            <PricingCard 
              title="Starter"
              icon={<Award className="w-8 h-8" />}
              description="24/7 WhatsApp FAQ handling, basic intake, and storage of core business data."
              price="Contact for Quote"
            />
          </Reveal>
          <Reveal width="100%" delay={400}>
            <PricingCard 
              title="Premium"
              isPremium
              icon={<Crown className="w-8 h-8" />}
              description="Full calendar sync, CRM integration, and automated qualifying questions to filter high-intent leads."
              price="$250"
            />
          </Reveal>
          <Reveal width="100%" delay={500}>
            <PricingCard 
              title="Enterprise"
              icon={<Shield className="w-8 h-8" />}
              description="Unlimited concurrent calls/chats, multi-agent routing, and complex workflow automation tailored to global operations."
              price="$50"
            />
          </Reveal>
        </section>

        <footer className="text-center py-12 border-t border-white/5 opacity-20">
           <div className="text-[9px] font-mono uppercase tracking-[0.8em]">RECLOSE OPERATIVE V4.20 // 01011001</div>
        </footer>
      </main>

      <style>{`
        @keyframes flowPulse {
          0% { stroke-dashoffset: 100; opacity: 0.4; }
          50% { opacity: 0.8; }
          100% { stroke-dashoffset: 0; opacity: 0.4; }
        }
        .flow-path {
          stroke-dasharray: 10;
          animation: flowPulse 3s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default TheReceptionist;
