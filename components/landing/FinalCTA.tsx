import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import Reveal from '../Reveal';

const FinalCTA: React.FC = () => {
  return (
    <section id="get-started" className="relative bg-[#111318] py-32 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(214,179,107,0.1),transparent_50%)]" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D6B36B]/20 to-transparent" />
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
              href="mailto:contact@reclose.com" // Update to actual booking link if available
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
