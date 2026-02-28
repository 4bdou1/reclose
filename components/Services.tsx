import React from 'react';
import Reveal from './Reveal';

const Services: React.FC = () => {
  return (
    <section id="services" className="relative w-full z-0 font-sans mt-[-100vh] h-[200vh]">

      {/* 1. SCROLL-LOCKED FULL SECTION (Revealed completely behind About as it slides up) */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden z-0 bg-[#FDFDFD]">

        {/* Background Grid */}
        <div className="absolute inset-0 bg-transparent industrial-grid-light opacity-50 pattern-grid pointer-events-none"></div>

        {/* 2. ALREADY PLACED CONTENT LAYER (Stationary, fully formed) */}
        <div className="absolute inset-0 z-10 w-full h-full flex flex-col items-center justify-center pt-8 sm:pt-0">
          <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center gap-12 sm:gap-20">

            {/* Seamless Integration */}
            <Reveal>
              <div className="flex flex-col items-center gap-4">
                <div className="font-tech uppercase tracking-[0.4em] text-[10px] sm:text-xs text-slate-400">
                  Seamless Integration
                </div>
                <p className="text-[22px] sm:text-[28px] lg:text-[40px] leading-[1.25] tracking-tight font-thin text-[#171827]">
                  Your custom AI is designed to plug directly into where you already work, meaning no more jumping between tools to get things done.
                </p>
              </div>
            </Reveal>

            {/* Divider */}
            <div className="w-[1px] h-12 sm:h-20 bg-gradient-to-b from-transparent via-slate-300 to-transparent"></div>

            {/* Elite Efficiency */}
            <Reveal delay={200}>
              <div className="flex flex-col items-center gap-4">
                <div className="font-tech uppercase tracking-[0.4em] text-[10px] sm:text-xs text-slate-400">
                  Elite Efficiency
                </div>
                <p className="text-[22px] sm:text-[28px] lg:text-[40px] leading-[1.25] tracking-tight font-thin text-[#171827]">
                  Achieve a "10+ High-Status Meetings" workflow on autopilot by delegating complex, context-heavy tasks to an AI that already knows your playbook.
                </p>
              </div>
            </Reveal>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
