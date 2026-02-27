import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Reveal from './Reveal';

const CTA: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section id="cta" className="py-32 relative text-center px-4">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-purple/5 to-brand-orange/5 pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        <Reveal width="100%">
          <div className="flex flex-col items-center">
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-tech font-bold mb-8 tracking-wider text-slate-900 uppercase">
              Initialize your <br />
              <span className="text-slate-500">Growth Phase.</span>
            </h2>
            <p className="text-xl text-slate-600 mb-12">
              Stop pitching ghosts. Start closing verified intent.
            </p>

            <div className="flex flex-col items-center">
              <button
                onClick={() => navigate('/auth')}
                className="group relative px-10 py-5 bg-slate-900 text-white rounded-full font-bold text-xl flex items-center gap-3 overflow-hidden transition-transform hover:scale-105"
              >
                <span className="relative z-10 font-tech uppercase tracking-widest text-sm text-[12px]">Access Agent Protocol</span>
                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-r from-brand-orange via-white to-brand-purple opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
              </button>

              <p className="mt-6 text-sm text-slate-500 font-mono italic">
                EXCLUSIVE ACCESS • SHADOW OPERATOR MODEL
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default CTA;
