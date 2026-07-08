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
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ease-in-out ${
          scrollDirection === 'down' && !isAtTop ? '-translate-y-full md:translate-y-0' : 'translate-y-0'
        } ${
          isAtTop ? 'bg-transparent py-5' : 'bg-[#050505]/90 backdrop-blur-md py-3 border-b border-white/10'
        } px-4 md:px-6`}
      >
        <div className="mx-auto grid max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-6">
          <Link to="/dashboard" className="justify-self-start">
            <Logo
              size="sm"
              showText={true}
              theme="dark"
              animateTextReveal={true}
              textVisible={isAtTop}
            />
          </Link>

          <div className="hidden items-center justify-center lg:flex">
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

          <div className="hidden items-center gap-3 justify-self-end md:flex">
            <a
              href="#get-started"
              className="lux-button inline-flex items-center gap-2 rounded-full bg-[#D6B36B] px-4 py-2 text-sm font-semibold text-black shadow-[0_14px_35px_rgba(214,179,107,0.26)] hover:bg-[#e2c27c]"
            >
              Book a Build Sprint
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>

          <button
            onClick={() => setIsOpen(true)}
            className="justify-self-end rounded-full p-2 text-white transition-colors hover:text-[#B38A33] md:hidden"
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-[60] transition-[opacity,visibility] duration-300 ${isOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}
      >
        <button
          className="absolute inset-0 bg-black/72 backdrop-blur-md"
          onClick={() => setIsOpen(false)}
          aria-label="Close navigation backdrop"
        />

        <div
          className={`absolute right-0 top-0 flex h-full w-full max-w-[28rem] flex-col border-l border-white/10 bg-[#0a0a0f]/96 p-6 shadow-[0_0_80px_rgba(0,0,0,0.55)] backdrop-blur-2xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="flex items-center justify-between">
            <Link to="/dashboard" onClick={() => setIsOpen(false)}>
              <Logo size="sm" showText={true} />
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full border border-white/10 p-2 text-white transition-colors hover:border-white/25 hover:text-[#D6B36B]"
              aria-label="Close navigation"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

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
            <div className="absolute -right-16 -bottom-16 opacity-40 blur-[2px] pointer-events-none transform scale-150">
               <svg viewBox="0 0 100 80" className="w-64 h-64 text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 10H45C53 10 58 15 58 22C58 29 53 34 45 34H22V65M22 34H35L52 65" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M85 20C90 28 90 45 85 55C78 68 62 70 52 65" stroke="currentColor" strokeWidth="6" strokeLinecap="round"/>
               </svg>
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/45">Engagement</p>
                <div className="w-2 h-2 rotate-45 bg-cyan-400"></div>
              </div>
              
              <h3 className="mt-2 text-2xl font-bold tracking-[-0.02em] text-white pr-10">
                Premium websites and automation systems for service-led brands.
              </h3>
              <p className="mt-4 text-xs leading-5 text-white/50 max-w-[85%]">
                From positioning and buildout to lead capture and follow-up, the public site is designed to feel as high-touch as the service behind it.
              </p>

              <a
                href="#get-started"
                onClick={() => setIsOpen(false)}
                className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-2 text-xs font-semibold text-cyan-400 hover:bg-white/5 transition-colors"
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
