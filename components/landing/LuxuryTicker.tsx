import React from 'react';

const LuxuryTicker: React.FC = () => {
  const items = [
    'Luxury Web Design',
    'AI Receptionists',
    'CRM Automation',
    'WhatsApp Intake',
    'Conversion Strategy',
    'Booking Systems',
    'Follow-Up Sequences',
    'Brand Positioning',
  ];

  return (
    <div className="relative overflow-hidden bg-[#2F2F33] py-4 select-none">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-28 bg-gradient-to-r from-[#2F2F33] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-28 bg-gradient-to-l from-[#2F2F33] to-transparent" />

      <div className="flex whitespace-nowrap overflow-hidden">
        {[0, 1].map((row) => (
          <div key={row} className="flex lux-marquee">
            {Array.from({ length: 2 }).flatMap(() => items).map((item, index) => (
              <div key={`${row}-${item}-${index}`} className="mx-8 flex items-center gap-8">
                <span className="text-[11px] uppercase tracking-[0.35em] text-white/52">{item}</span>
                <span className="text-[#D6B36B]">•</span>
                <span className="text-[11px] uppercase tracking-[0.35em] text-[#f0d39a]">
                  REclose System Design
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LuxuryTicker;
