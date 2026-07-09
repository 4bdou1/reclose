import React from 'react';
import Logo from './Logo';

const HOSLogo = () => (
  <div className="mt-6 flex items-center gap-4">
    <div className="flex flex-col items-start gap-1">
      <span className="text-[10px] font-mono uppercase tracking-widest text-white/42">A HOS Labs product</span>
      <div className="relative h-10 w-auto">
        <img
          src="/hos-logo.png"
          alt="HOS Logo"
          className="h-full w-auto object-contain"
        />
      </div>
    </div>
  </div>
);

const Footer: React.FC = () => {
  return (
    <footer 
      className="relative overflow-hidden border-t border-white/8 px-4 py-14 text-white sm:px-6 lg:px-8"
      style={{
        backgroundImage: 'url("/footer.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="relative z-10 mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_0.6fr_0.6fr]">
        <div>
          <Logo size="sm" className="items-start" theme="dark" />
          <p className="mt-5 max-w-md text-sm leading-7 text-white/62">
            REclose is a digital growth agency that builds premium websites, marketing engines, and intelligent automations for businesses looking to scale efficiently.
          </p>
          <HOSLogo />
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-[0.35em] text-white/40">Explore</p>
          <div className="mt-5 space-y-3 text-sm text-white/68">
            <a className="block hover:text-white" href="#why-reclose">Why REclose?</a>
            <a className="block hover:text-white" href="#how-we-work">Process</a>
            <a className="block hover:text-white" href="#work">Our Work</a>
            <a className="block hover:text-white" href="#get-started">Start a Project</a>
          </div>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-[0.35em] text-white/40">Access</p>
          <div className="mt-5 space-y-3 text-sm text-white/68">
            <a className="block hover:text-white" href="/auth">Admin Login</a>
            <a className="block hover:text-white" href="#get-started">WhatsApp Intake</a>
            <p className="pt-4 text-white/40">Luxury frontend direction. Automation-first delivery.</p>
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto mt-12 flex max-w-7xl flex-col gap-3 border-t border-white/8 pt-6 text-xs uppercase tracking-[0.3em] text-white/36 sm:flex-row sm:items-center sm:justify-between">
        <p>&copy; {new Date().getFullYear()} REclose.</p>
        <p>Digital growth systems.</p>
      </div>
    </footer>
  );
};

export default Footer;
