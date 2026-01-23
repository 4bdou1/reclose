
import React from 'react';
import { Search, ShieldCheck, Zap, FileText, Layout, Map, Compass, Terminal } from 'lucide-react';
import Reveal from './Reveal';

const ServiceBentoCard: React.FC<{
  title: string;
  description: string;
  icon: React.ReactNode;
  colSpan?: string;
  rowSpan?: string;
  color?: string;
  badge?: string;
}> = ({ title, description, icon, colSpan = "col-span-1", rowSpan = "row-span-1", color = "brand-orange", badge }) => {
  return (
    <div className={`group relative p-8 ${colSpan} ${rowSpan} cyber-glass rounded-[2rem] hover:border-${color}/40 transition-all duration-500 flex flex-col justify-between overflow-hidden cursor-pointer tactile-btn`}>
      {/* Background Decor */}
      <div className={`absolute top-0 right-0 p-12 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-700 text-${color}`}>
        {icon}
      </div>
      
      {/* Glow Corner */}
      <div className={`absolute -top-12 -left-12 w-24 h-24 bg-${color}/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity`}></div>

      <div className="relative z-10">
        <div className="mb-8 flex justify-between items-start">
            <div className={`p-4 rounded-2xl bg-brand-obsidian border border-brand-border text-white group-hover:text-${color} group-hover:border-${color}/30 transition-all shadow-xl`}>
                {icon}
            </div>
            {badge && (
              <span className={`text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-${color}/80 bg-${color}/10 px-2 py-1 rounded-lg`}>{badge}</span>
            )}
        </div>
        
        <h3 className="text-2xl font-bold mb-4 text-white leading-tight">
          {title}
        </h3>
        
        <p className="text-brand-silver/50 text-sm leading-relaxed max-w-xs">
          {description}
        </p>
      </div>

      <div className="mt-8 relative z-10 flex items-center gap-2 text-[10px] font-mono text-brand-silver/30 group-hover:text-white transition-colors uppercase tracking-[0.3em]">
        <span>Initialize Protocol</span>
        <div className={`w-8 h-[1px] bg-brand-border group-hover:bg-${color} transition-all`}></div>
      </div>
    </div>
  );
};

const Services: React.FC = () => {
  return (
    <section id="services" className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-brand-dark industrial-grid opacity-20"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <Reveal>
            <div className="flex flex-col">
              <span className="font-mono text-brand-purple uppercase tracking-[0.4em] text-xs block mb-4 italic">Operational Arsenal v4.2</span>
              <h2 className="text-5xl md:text-7xl font-bold tracking-tighter">The <span className="holographic-silver italic">Next-Gen</span> Stack.</h2>
            </div>
          </Reveal>
          <Reveal delay={200}>
            <p className="max-w-sm text-brand-silver/50 text-sm font-mono uppercase tracking-widest leading-relaxed text-right md:text-left">
              Advanced neural logic integrated with luxury business architecture.
            </p>
          </Reveal>
        </div>

        <div className="bento-grid">
          <ServiceBentoCard 
            title="Live Audit Blocks"
            description="Drop a URL directly into your workflow. ShadowAudit runs in the background and populates hiring signals automatically."
            icon={<Search className="w-6 h-6" />}
            colSpan="md:col-span-2"
            rowSpan="md:row-span-2"
            color="brand-orange"
            badge="Exclusive"
          />
          <ServiceBentoCard 
            title="90-Day Sprint View"
            description="A high-status tactical map that calculates Outreach ROI and dynamically adjusts your daily tasks."
            icon={<Map className="w-6 h-6" />}
            color="brand-purple"
          />
          <ServiceBentoCard 
            title="AI Blueprints"
            description="Pre-configured environments like 'Dubai Takeover' with market-specific scripts and goals."
            icon={<Compass className="w-6 h-6" />}
            color="brand-blue"
          />
          <ServiceBentoCard 
            title="Slash Commands"
            description="Type /outreach to pull scripts or /close to generate high-ticket contracts in seconds."
            icon={<Terminal className="w-6 h-6" />}
            colSpan="md:col-span-2"
            color="brand-silver"
            badge="Beta"
          />
          <ServiceBentoCard 
            title="Business OS"
            description="Centralized command center for high-ticket operations and financial forecasting."
            icon={<Layout className="w-6 h-6" />}
            color="brand-purple"
          />
        </div>
      </div>
    </section>
  );
};

export default Services;
