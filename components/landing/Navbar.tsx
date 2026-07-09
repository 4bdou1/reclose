import React, { useEffect, useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '../Logo';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsAtTop(currentScrollY < 20);
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setScrollDirection('down');
      } else if (currentScrollY < lastScrollY) {
        setScrollDirection('up');
      }
      lastScrollY = currentScrollY;

      // Scrollspy logic
      const sections = ['why-reclose', 'how-we-work', 'work', 'get-started'];
      let current = '';
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            current = section;
            break;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Why REclose?', href: '#why-reclose' },
    { label: 'Process', href: '#how-we-work' },
    { label: 'Our Work', href: '#work' },
    { label: 'Start', href: '#get-started' },
  ];

  return (
    <>
      <nav 
        className={`fixed inset-x-0 top-0 z-[70] transition-all duration-300 ease-in-out ${
          scrollDirection === 'down' && !isAtTop && !isOpen ? '-translate-y-full md:translate-y-0' : 'translate-y-0'
        } ${
          isAtTop && !isOpen ? 'bg-transparent py-5' : 'bg-[#050505]/90 backdrop-blur-md py-3 border-b border-white/10'
        } px-4 md:px-6`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6">
          <Link to="/dashboard" onClick={() => setIsOpen(false)} className="relative z-10">
            <Logo
              size="sm"
              showText={true}
              theme="dark"
              animateTextReveal={true}
              textVisible={isAtTop}
            />
          </Link>

          <div className="hidden items-center justify-center lg:flex flex-1">
            <div className={`flex items-center gap-10 rounded-full px-7 py-3 transition-colors ${isAtTop ? 'bg-white/[0.04] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] border border-white/10' : 'bg-transparent'}`}>
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.substring(1);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={`lux-button px-1 py-2 text-sm transition-colors relative ${isActive ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  {link.label}
                  {isActive && !isAtTop && (
                    <span className="absolute left-0 right-0 -bottom-1 h-[2px] bg-[#D6B36B] rounded-full" />
                  )}
                </a>
              );
            })}
            </div>
          </div>

          <div className="hidden items-center gap-3 md:flex relative z-10">
            <a
              href="#get-started"
              className="lux-button inline-flex items-center gap-2 rounded-full bg-[#D6B36B] px-4 py-2 text-sm font-semibold text-black shadow-[0_14px_35px_rgba(214,179,107,0.26)] hover:bg-[#e2c27c]"
            >
              Book a Build Sprint
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>

          <div className="relative md:hidden z-10 flex items-center justify-end">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative w-12 h-12 flex items-center justify-center rounded-full focus:outline-none group cursor-pointer transition-transform duration-200 active:scale-90"
                aria-label="Toggle menu"
                aria-expanded={isOpen}
            >
                {/* SVG icon */}
                <svg
                    viewBox="0 0 100 100"
                    className="w-6 h-6 relative z-10"
                    fill="none"
                    strokeWidth="6"
                    strokeLinecap="round"
                >
                    <path 
                        className={`stroke-white transition-all duration-[650ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] [transform-box:view-box] origin-[40%_38%] ${isOpen ? 'translate-x-[10%] translate-y-[12%] rotate-45 !stroke-[#D6B36B] delay-75' : 'delay-0'}`} 
                        d="M25 38 L55 38" 
                    />
                    <path 
                        className={`stroke-white transition-all duration-[650ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] [transform-box:view-box] origin-[50%_62%] ${isOpen ? 'translate-x-0 -translate-y-[12%] -rotate-45 !stroke-[#D6B36B] delay-0' : 'delay-75'}`} 
                        d="M25 62 L75 62" 
                    />
                </svg>
            </button>
          </div>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        <button
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
          aria-label="Close navigation backdrop"
        />

        <div
          className={`absolute left-0 top-0 flex w-full max-h-[100dvh] overflow-y-auto flex-col border-b border-white/10 bg-[#050505] p-6 pt-20 pb-12 shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${isOpen ? 'translate-y-0' : '-translate-y-full'}`}
        >

          <div className="mt-8">
            <p className="text-[11px] uppercase tracking-[0.35em] text-white/45 mb-4 px-2">Navigation</p>
            <div className="space-y-3">
              {[
                { label: 'Why REclose?', subtitle: 'Our mission and approach', href: '#why-reclose', glow: 'from-blue-500/10 via-blue-500/5 to-transparent', border: 'border-blue-500/30', text: 'text-blue-400' },
                { label: 'Process', subtitle: 'From strategy to execution', href: '#how-we-work', glow: 'from-emerald-500/10 via-emerald-500/5 to-transparent', border: 'border-emerald-500/30', text: 'text-emerald-400' },
                { label: 'Our Work', subtitle: 'Selected projects', href: '#work', glow: 'from-purple-500/10 via-purple-500/5 to-transparent', border: 'border-purple-500/30', text: 'text-purple-400' },
                { label: 'Start', subtitle: "Let's build together", href: '#get-started', glow: 'from-orange-500/10 via-orange-500/5 to-transparent', border: 'border-orange-500/30', text: 'text-orange-400' },
              ].map((link, index) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between rounded-2xl border ${link.border} bg-gradient-to-r ${link.glow} px-5 py-4 transition-all hover:scale-[1.02]`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`text-lg font-mono ${link.text}`}>0{index + 1}</span>
                    <div className="flex flex-col">
                      <span className="text-lg font-medium text-white">{link.label}</span>
                      <span className="text-[11px] text-white/40">{link.subtitle}</span>
                    </div>
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white/60">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div className="mt-8 rounded-3xl border border-white/5 bg-[#111111] p-6 relative overflow-hidden">
            <div className="absolute right-[-10px] bottom-[0px] pointer-events-none opacity-[0.4] z-0">
               <svg viewBox="0 0 100 80" className="w-[120px] h-[120px] drop-shadow-[0_0_15px_rgba(45,212,191,0.4)]" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="rc-gradient-mobile" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#4ADE80" />
                      <stop offset="50%" stopColor="#2DD4BF" />
                      <stop offset="100%" stopColor="#3B82F6" />
                    </linearGradient>
                  </defs>
                  <path d="M10 10H45C53 10 58 15 58 22C58 29 53 34 45 34H22V65M22 34H35L52 65" stroke="url(#rc-gradient-mobile)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M85 20C90 28 90 45 85 55C78 68 62 70 52 65" stroke="url(#rc-gradient-mobile)" strokeWidth="5" strokeLinecap="round"/>
               </svg>
            </div>
            
            <div className="relative z-10 pr-[50px]">
              <div className="flex items-center gap-2 mb-4">
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/45">Engagement</p>
                <div className="w-2 h-2 rotate-45 bg-[#22d3ee]"></div>
              </div>
              <h3 className="text-xl font-bold tracking-[-0.02em] text-white">
                Marketing, websites and automation systems for service-led brands.
              </h3>
              <p className="mt-3 text-xs leading-5 text-white/50 max-w-[95%] relative z-20">
                From positioning and buildout to lead capture and follow-up, the public site is designed to feel as high-touch as the service behind it.
              </p>

              <a
                href="#get-started"
                onClick={() => setIsOpen(false)}
                className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-2 text-xs font-semibold text-[#22d3ee] hover:bg-white/5 transition-colors relative z-20"
              >
                Learn More 
                <ArrowUpRight className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
