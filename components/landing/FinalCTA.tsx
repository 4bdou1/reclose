import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import Reveal from '../Reveal';

const FinalCTA: React.FC = () => {
  return (
    <section id="get-started" className="relative bg-[#111318] py-32 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(214,179,107,0.1),transparent_50%)]" />
      </div>

      <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center relative z-10">
        <Reveal>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D6B36B]/20 bg-[#D6B36B]/10 px-4 py-2 text-[11px] uppercase tracking-[0.35em] text-[#D6B36B] mb-8">
            <Sparkles className="h-3.5 w-3.5" />
            Let's Grow
          </div>

          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-6xl mb-8 leading-tight">
            Ready to build something that actually <span className="font-swash italic text-[#ba8c2c] font-medium">moves your business</span> forward?
          </h2>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
            <a
              href="mailto:hello@reclose.ai?subject=Discovery%20Call%20-%20REclose&body=Hi%20REclose%20Team%2C%0A%0AI%E2%80%99d%20like%20to%20book%20a%20discovery%20call%20to%20explore%20how%20we%20can%20improve%20our%20current%20client%20acquisition%20and%20growth%20systems.%0A%0AA%20few%20details%20about%20my%20business%3A%0A%0ACompany%3A%20%0AIndustry%3A%20%0AMain%20challenge%20right%20now%3A%20%0ACurrent%20goal%3A%20%0A%0ALooking%20forward%20to%20seeing%20what%20opportunities%20we%20can%20unlock.%0A%0ABest%2C%0A%5BName%5D"
              className="lux-button inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-5 text-sm font-semibold text-black shadow-lg hover:bg-gray-100 transition-all w-full sm:w-auto"
            >
              Book a Discovery Call
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default FinalCTA;
