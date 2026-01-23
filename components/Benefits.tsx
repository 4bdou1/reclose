
import React from 'react';
import { Crosshair, Layers, Workflow, Eye, ShieldCheck, Zap } from 'lucide-react';
import Reveal from './Reveal';
import { useAppContext, DashboardModule } from '../context/AppContext';

const BenefitCard: React.FC<{
  title: string;
  desc: string;
  icon: React.ReactNode;
  targetModule: DashboardModule;
}> = ({ title, desc, icon, targetModule }) => {
  const { user, setView, setActiveDashboardModule } = useAppContext();

  const handleInteraction = () => {
    setActiveDashboardModule(targetModule);
    if (user) {
      setView('dashboard');
    } else {
      setView('auth');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div 
      onClick={handleInteraction}
      className="group relative h-full cursor-pointer"
    >
      {/* SKY BLUE BORDER TRACING ANIMATION */}
      <div className="absolute inset-0 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-[-150%] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_160deg,#38bdf8_180deg,transparent_200deg,transparent_360deg)] animate-[spin_4s_linear_infinite]"></div>
      </div>
      
      {/* Main Card Content */}
      <div className="relative z-10 m-[2px] p-8 rounded-[calc(2rem-2px)] bg-brand-surface border border-brand-border transition-all duration-500 group-hover:bg-brand-obsidian group-hover:-translate-y-4 group-hover:shadow-[0_30px_70px_-15px_rgba(56,189,248,0.3)] flex flex-col h-full overflow-hidden">
        
        {/* Subtle Inner Glow on Hover */}
        <div className="absolute -top-12 -left-12 w-40 h-40 bg-sky-500/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col h-full">
          <div className="mb-8 w-14 h-14 rounded-2xl bg-brand-dark border border-brand-border flex items-center justify-center text-sky-400 group-hover:text-white group-hover:bg-sky-500 transition-all duration-500 shadow-xl group-hover:shadow-sky-500/20">
            {icon}
          </div>
          
          <h4 className="text-2xl font-bold text-white mb-4 tracking-tight group-hover:text-sky-400 transition-colors duration-300">
            {title}
          </h4>
          
          <p className="text-gray-400 text-sm leading-relaxed font-medium mb-8">
            {desc}
          </p>

          <div className="mt-auto flex items-center gap-3 opacity-60 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
            <div className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse shadow-[0_0_8px_#38bdf8]"></div>
            <span className="text-[10px] font-mono text-sky-400 uppercase tracking-widest font-bold">Initialize {targetModule} Engine</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Benefits: React.FC = () => {
  const { setView } = useAppContext();
  
  const benefits = [
    {
      title: "Absolute Verification",
      desc: "Stop wasting resources on stagnant accounts. Our system scans for hiring surges, market gap analysis, and sentiment decoding to ensure every lead is in a verified \"Growth Mode\".",
      icon: <ShieldCheck className="w-6 h-6" />,
      targetModule: 'VAULT' as DashboardModule
    },
    {
      title: "Arbitrage Targeting",
      desc: "Focus your energy where it’s most profitable. We isolate micro-creators (10k-40k followers) who have high influence but no existing store or collaborations, giving you the first-mover advantage.",
      icon: <Crosshair className="w-6 h-6" />,
      targetModule: 'PLANNING' as DashboardModule
    },
    {
      title: "REclose OS Integration",
      desc: "Transform your business from a chaotic doc into a clinical Operating System. With our month-by-month \"Foundation Stack,\" you control your plan, track your progress, and manage your Lead Vault in one high-performance interface.",
      icon: <Layers className="w-6 h-6" />,
      targetModule: 'PLANNING' as DashboardModule
    },
    {
      title: "Autonomous Outreach",
      desc: "Deploy self-optimizing strategies across 14 channels simultaneously. While your competitors are sending manual DMs, REclose is running a multi-channel \"Network Nurture\" on autopilot.",
      icon: <Workflow className="w-6 h-6" />,
      targetModule: 'OUTREACH' as DashboardModule
    },
    {
      title: "Real-Time Intelligence",
      desc: "The Live Lead Feed gives you a \"God View\" of the market, detecting website redesigns, funding announcements, and high engagement levels the second they happen.",
      icon: <Eye className="w-6 h-6" />,
      targetModule: 'COMMAND' as DashboardModule
    }
  ];

  return (
    <section id="benefits" className="py-32 relative overflow-hidden bg-brand-dark">
      {/* Background Ambience */}
      <div className="absolute right-0 top-1/4 w-1/3 h-1/2 bg-sky-500/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute left-0 bottom-1/4 w-1/3 h-1/2 bg-brand-orange/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center mb-24">
          <Reveal>
            <span className="font-mono text-sky-400 uppercase tracking-[0.6em] text-[10px] block mb-6 italic font-bold">STRATEGIC EDGE</span>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 leading-tight text-white">
              Scale Without <br/><span className="bg-gradient-flight bg-clip-text text-transparent italic">Friction.</span>
            </h2>
            <p className="max-w-2xl text-gray-400 text-lg leading-relaxed">
              Traditional lead generation is dead. <span className="text-white font-medium">reclose</span> provides the clinical antidote: 
              AI-verified signals that replace ghost-chasing with growth.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((item, idx) => (
            <Reveal key={idx} delay={idx * 100} width="100%">
              <BenefitCard 
                title={item.title} 
                desc={item.desc} 
                icon={item.icon} 
                targetModule={item.targetModule}
              />
            </Reveal>
          ))}
          
          {/* Custom CTA Box */}
          <Reveal delay={500} width="100%">
            <div 
              onClick={() => setView('auth')}
              className="p-8 rounded-[2rem] bg-gradient-to-br from-brand-orange/10 to-brand-purple/10 border border-brand-orange/20 flex flex-col justify-center items-center text-center group cursor-pointer h-full transition-all hover:scale-105 hover:border-brand-orange/50 shadow-lg hover:shadow-brand-orange/20"
            >
              <Zap className="w-12 h-12 text-brand-orange mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500" />
              <h4 className="text-xl font-bold text-white mb-3 uppercase tracking-widest">Awaiting Command</h4>
              <p className="text-[10px] font-mono text-brand-orange/60 uppercase tracking-widest font-bold">Ready to initialize your vault</p>
            </div>
          </Reveal>
        </div>

        <div className="mt-32 pt-16 border-t border-brand-border flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex gap-16">
            <div className="flex flex-col">
              <span className="text-4xl font-mono font-bold text-white tracking-tighter">10X</span>
              <span className="text-[10px] text-gray-500 uppercase font-mono tracking-[0.3em] mt-2">Pipeline Velocity</span>
            </div>
            <div className="flex flex-col">
              <span className="text-4xl font-mono font-bold text-white tracking-tighter">0</span>
              <span className="text-[10px] text-gray-500 uppercase font-mono tracking-[0.3em] mt-2">Ghost Responses</span>
            </div>
          </div>
          <div className="p-5 px-8 bg-brand-surface/30 border border-brand-border rounded-2xl flex items-center gap-4 cyber-glass">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]"></div>
            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-[0.4em] font-bold">Clinical Infrastructure Online // v4.2.0</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
