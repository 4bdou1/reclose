
import React from 'react';

const LuxuryTicker: React.FC = () => {
  const tickerText = "A B2 Companies Venture | Engineered by HPF & Co";
  // Repeat the text enough times to fill the screen width twice for a seamless loop
  const items = Array(12).fill(tickerText);

  return (
    <div className="relative w-full bg-brand-dark overflow-hidden border-t-[0.5px] border-b-[0.5px] border-gray-800/60 py-4 select-none">
      {/* Lateral Fades for that premium "emerging from shadows" look */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-brand-dark to-transparent z-10 pointer-events-none"></div>
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-brand-dark to-transparent z-10 pointer-events-none"></div>

      <div className="flex whitespace-nowrap overflow-hidden">
        <div className="flex animate-marquee hover:[animation-play-state:paused]">
          {items.map((text, i) => (
            <div key={i} className="flex items-center mx-10">
              <span className="text-[10px] md:text-xs font-sans font-medium uppercase tracking-[0.4em] text-brand-silver/40">
                <span className="text-brand-silver/80 font-bold">A B2</span> COMPANIES VENTURE
              </span>
              <span className="mx-6 text-gray-800 font-light">|</span>
              <span className="text-[10px] md:text-xs font-sans font-medium uppercase tracking-[0.4em] text-[#C5A059]/60">
                ENGINEERED BY <span className="text-[#C5A059] font-bold">HPF & CO</span>
              </span>
            </div>
          ))}
        </div>
        
        {/* Mirror div for seamless infinite effect */}
        <div className="flex animate-marquee hover:[animation-play-state:paused]" aria-hidden="true">
          {items.map((text, i) => (
            <div key={i + '-clone'} className="flex items-center mx-10">
              <span className="text-[10px] md:text-xs font-sans font-medium uppercase tracking-[0.4em] text-brand-silver/40">
                <span className="text-brand-silver/80 font-bold">A B2</span> COMPANIES VENTURE
              </span>
              <span className="mx-6 text-gray-800 font-light">|</span>
              <span className="text-[10px] md:text-xs font-sans font-medium uppercase tracking-[0.4em] text-[#C5A059]/60">
                ENGINEERED BY <span className="text-[#C5A059] font-bold">HPF & CO</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 60s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default LuxuryTicker;
