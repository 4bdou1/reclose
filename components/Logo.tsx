
import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  theme?: 'light' | 'dark';
}

const Logo: React.FC<LogoProps> = ({ className = "", showText = true, size = 'md', theme = 'dark' }) => {
  const dimensions = {
    sm: { icon: 'w-8 h-8', text: 'text-lg', subText: 'text-[9px]' },
    md: { icon: 'w-10 h-10', text: 'text-2xl', subText: 'text-[11px]' },
    lg: { icon: 'w-16 h-16', text: 'text-4xl', subText: 'text-[14px]' },
    xl: { icon: 'w-32 h-32', text: 'text-6xl', subText: 'text-[24px]' },
  }[size];

  const textColor = theme === 'light' ? 'text-slate-900' : 'text-white';
  const sublineColor = theme === 'light' ? 'text-slate-500' : 'text-brand-silver/30';

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative">
        <div className="absolute inset-0 bg-brand-blue opacity-20 blur-lg rounded-lg"></div>
        <svg
          viewBox="0 0 100 80"
          className={`${dimensions.icon} relative z-10`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="rc-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4ADE80" />
              <stop offset="50%" stopColor="#2DD4BF" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
          </defs>
          <path
            d="M10 10H45C53 10 58 15 58 22C58 29 53 34 45 34H22V65M22 34H35L52 65"
            stroke="url(#rc-gradient)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M85 20C90 28 90 45 85 55C78 68 62 70 52 65"
            stroke="url(#rc-gradient)"
            strokeWidth="10"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className={`${dimensions.text} font-bold tracking-tight ${textColor} uppercase`}>
              RE<span className="text-brand-blue">close</span>
            </span>
            <span className={`${sublineColor} font-bold`}>.AI</span>
          </div>
          <div className={`${dimensions.subText} flex items-center gap-1 mt-[-4px] ml-[2px] tracking-[0.2em] uppercase`}>
            <span className="font-bold text-[#C5A059]">HPF</span>
            <span className="font-light italic text-[#C5A059]/80">&Co</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Logo;
