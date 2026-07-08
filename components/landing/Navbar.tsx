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
          scrollDirection === 'down' && !isAtTop ? '-translate-y-full' : 'translate-y-0'
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

          <div className="mt-10 rounded-[2rem] border border-white/8 bg-white/[0.03] p-3">
            <p className="text-[11px] uppercase tracking-[0.35em] text-white/45">Navigation</p>
            <div className="mt-4 space-y-2">
              {navLinks.map((link, index) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="lux-button flex items-center justify-between rounded-[1.4rem] border border-white/6 bg-black/25 px-4 py-4 hover:border-[#D6B36B]/30 hover:bg-white/[0.04]"
                >
                  <span className="text-sm text-white/40">0{index + 1}</span>
                  <span className="text-lg font-medium text-white">{link.label}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="mt-6 rounded-[2rem] border border-white/8 bg-[#0f1116] p-5">
            <p className="text-[11px] uppercase tracking-[0.35em] text-white/45">Engagement</p>
            <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white">
              Premium websites and automation systems for service-led brands.
            </h3>
            <p className="mt-3 text-sm leading-6 text-white/62">
              From positioning and buildout to lead capture and follow-up, the public site is designed to feel as high-touch as the service behind it.
            </p>
          </div>

          <div className="mt-auto space-y-3">
            <a
              href="#get-started"
              onClick={() => setIsOpen(false)}
              className="lux-button inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#D6B36B] px-5 py-3.5 text-sm font-semibold text-black shadow-[0_14px_35px_rgba(214,179,107,0.26)] hover:bg-[#e2c27c]"
            >
              Start Your Project
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
