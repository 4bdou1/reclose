import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Mission', href: '#about' },
    { name: 'System', href: '#services' },
    { name: 'Benefits', href: '#benefits' },
  ];

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsMobileMenuOpen(false);
  };

  const handleAuthClick = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav id="global-navbar" className="fixed top-0 left-0 right-0 z-50 transition-all duration-700 pointer-events-none">

      {/* Sleek Scrolled Tab Toggle */}
      <div className={`absolute left-1/2 -translate-x-1/2 top-0 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] pointer-events-auto shadow-[0_10px_30px_rgba(0,0,0,0.08)] rounded-b-2xl overflow-hidden ${isScrolled ? 'translate-y-0' : '-translate-y-[150%]'}`}>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-white/95 backdrop-blur-md px-10 pt-2 pb-4 flex flex-col justify-center items-center gap-[5px] hover:bg-white transition-colors group"
        >
          <div className="w-6 h-[1.5px] bg-[#171827] group-hover:scale-x-110 transition-transform origin-center"></div>
          <div className="w-6 h-[1.5px] bg-[#171827] group-hover:scale-x-110 transition-transform origin-center delay-75"></div>
        </button>
      </div>

      {/* Main Full Navbar */}
      <div className={`max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center relative transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] pointer-events-auto ${isScrolled ? 'opacity-0 -translate-y-12 invisible' : 'opacity-100 translate-y-0 visible'}`}>
        {/* Logo */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate('/');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center group z-10"
        >
          <Logo size="sm" className="scale-75 origin-left" theme="light" />
        </a>

        {/* Decorative Line (Desktop Only) */}
        <div className="hidden lg:flex absolute top-1/2 -translate-y-[0.5px] left-[150px] right-[150px] pointer-events-none items-start z-0 opacity-80">
          <div className="flex-grow h-[1px] bg-slate-300"></div>
          <svg width="44" height="24" viewBox="0 0 44 24" className="flex-shrink-0 -ml-[1px]">
            <path d="M0,0.5 L12,23.5 L44,23.5" stroke="currentColor" strokeWidth="1" fill="none" className="text-slate-300" />
          </svg>
          <div className="w-[320px] h-[1px] bg-slate-300 mt-[23px] -ml-[1px] -mr-[1px] shrink-0"></div>
          <svg width="44" height="24" viewBox="0 0 44 24" className="flex-shrink-0 -mr-[1px]">
            <path d="M0,23.5 L32,23.5 L44,0.5" stroke="currentColor" strokeWidth="1" fill="none" className="text-slate-300" />
          </svg>
          <div className="flex-grow h-[1px] bg-slate-300"></div>
        </div>

        {/* Center Desktop Nav */}
        <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] items-center gap-10 z-10">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-[10px] font-bold text-slate-800 hover:text-[#A67B5B] transition-colors uppercase tracking-[0.2em] font-tech cursor-pointer"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Right Desktop Nav — Orange Pulse CTA */}
        <div className="hidden md:flex items-center z-10">
          <button
            data-testid="nav-auth-btn"
            onClick={handleAuthClick}
            className="group relative px-6 py-[9px] rounded-full text-[11px] font-bold tracking-[0.05em] text-white bg-brand-orange flex items-center justify-center transition-all duration-300 shadow-[0_8px_25px_-5px_rgba(255,107,43,0.6)] hover:shadow-[0_12px_35px_-5px_rgba(255,107,43,0.8)] hover:-translate-y-[1px]"
          >
            {/* Expandable pulse ring on hover */}
            <span className="absolute inset-0 rounded-full bg-brand-orange opacity-0 group-hover:animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite]"></span>

            <span className="relative z-10">{user ? 'Dashboard' : 'Get started'}</span>
          </button>
        </div>

        {/* Mobile Toggle (Original) */}
        <button
          className="md:hidden text-slate-600 hover:text-slate-900 p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="pointer-events-auto md:hidden bg-white/95 backdrop-blur-md absolute top-full left-0 right-0 border-b border-slate-200 p-6 flex flex-col gap-4 animate-in slide-in-from-top-4 shadow-xl">
          {navLinks.map((link) => (
            <a
              key={link.name}
              className="text-lg font-bold text-slate-600 hover:text-slate-900 uppercase tracking-[0.2em] font-tech py-2"
              onClick={(e) => handleNavClick(e, link.href)}
            >
              {link.name}
            </a>
          ))}
          <button
            onClick={handleAuthClick}
            className="mt-4 flex items-center justify-center gap-2 bg-slate-900 text-white px-5 py-4 rounded-full text-xs font-bold uppercase tracking-[0.2em] font-tech"
          >
            {user ? 'Dashboard' : 'Access System'} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
