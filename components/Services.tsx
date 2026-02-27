import React from 'react';
import Reveal from './Reveal';

const Services: React.FC = () => {
  return (
    <section id="services" className="py-40 relative overflow-hidden bg-[#FDFDFD]">
      <div className="absolute inset-0 bg-transparent industrial-grid-light opacity-50 pattern-grid"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center text-center gap-24 sm:gap-32">

        {/* Seamless Integration */}
        <Reveal>
          <div className="flex flex-col items-center gap-4">
            <div className="font-tech uppercase tracking-[0.4em] text-[10px] sm:text-xs text-slate-400">
              Seamless Integration
            </div>
            <p className="text-[22px] sm:text-[32px] lg:text-[42px] leading-[1.2] tracking-tight font-thin text-[#171827]">
              Your custom AI is designed to plug directly into where you already work, meaning no more jumping between tools to get things done.
            </p>
          </div>
        </Reveal>

        {/* Divider */}
        <div className="w-[1px] h-20 sm:h-32 bg-gradient-to-b from-transparent via-slate-300 to-transparent"></div>

        {/* Elite Efficiency */}
        <Reveal delay={200}>
          <div className="flex flex-col items-center gap-4">
            <div className="font-tech uppercase tracking-[0.4em] text-[10px] sm:text-xs text-slate-400">
              Elite Efficiency
            </div>
            <p className="text-[22px] sm:text-[32px] lg:text-[42px] leading-[1.2] tracking-tight font-thin text-[#171827]">
              Achieve a "10+ High-Status Meetings" workflow on autopilot by delegating complex, context-heavy tasks to an AI that already knows your playbook.
            </p>
          </div>
        </Reveal>

      </div>
    </section>
  );
};

export default Services;
