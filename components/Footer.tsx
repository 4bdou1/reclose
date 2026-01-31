
import React from 'react';
import Logo from './Logo';

const HPFLogo = () => (
  <div className="flex items-center gap-5 group cursor-pointer mt-6">
    {/* Logo Container - Box Mode */}
    <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center p-2 shadow-[0_0_30px_rgba(255,255,255,0.05)] border border-white/10 relative overflow-hidden transition-transform duration-500 group-hover:scale-105 group-hover:shadow-[0_0_40px_rgba(197,160,89,0.2)]">
      <img 
        src="/hpf-logo.png" 
        alt="HPF Logo" 
        className="w-full h-full object-contain"
      />
    </div>
    
    <div className="flex flex-col justify-center opacity-70 group-hover:opacity-100 transition-all duration-500">
      <span className="text-[8px] font-mono text-[#C5A059] uppercase tracking-[0.3em] font-bold mb-1">Parent Entity</span>
      <span className="text-xl font-bold text-white uppercase tracking-[0.2em] leading-none">HPF & Co</span>
    </div>
  </div>
);

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-brand-border bg-black py-20 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#064E3B]/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start mb-16">
            <div className="mb-12 md:mb-0 flex flex-col gap-8">
                <div>
                   <Logo size="sm" className="items-start" />
                   <p className="mt-4 text-gray-500 text-xs max-w-xs leading-relaxed">
                     The world's first AI-Architect for high-ticket lead generation. Replacing manual prospecting with verified growth signals.
                   </p>
                </div>
                
                {/* HPF Logo Placement */}
                <HPFLogo />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-16 text-sm text-gray-500">
                <div className="flex flex-col gap-4">
                  <span className="text-white font-bold uppercase tracking-widest text-[10px] mb-2">Ecosystem</span>
                  <a href="#" className="hover:text-brand-orange transition-colors">ShadowAudit™</a>
                  <a href="#" className="hover:text-brand-orange transition-colors">Business OS</a>
                  <a href="#" className="hover:text-brand-orange transition-colors">Architect AI</a>
                </div>
                <div className="flex flex-col gap-4">
                  <span className="text-white font-bold uppercase tracking-widest text-[10px] mb-2">Protocol</span>
                  <a href="#" className="hover:text-brand-orange transition-colors">Security</a>
                  <a href="#" className="hover:text-brand-orange transition-colors">API Logs</a>
                  <a href="#" className="hover:text-brand-orange transition-colors">Status</a>
                </div>
                <div className="flex flex-col gap-4">
                  <span className="text-white font-bold uppercase tracking-widest text-[10px] mb-2">Legal</span>
                  <a href="#" className="hover:text-brand-orange transition-colors">Privacy Policy</a>
                  <a href="#" className="hover:text-brand-orange transition-colors">Terms of Service</a>
                  <a href="#" className="hover:text-brand-orange transition-colors">Contact Support</a>
                </div>
            </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-700 font-mono pt-8 border-t border-brand-border/30 uppercase tracking-widest">
            <p className="hover:text-gray-500 transition-colors cursor-default">&copy; {new Date().getFullYear()} RECLOSE. PART OF THE HPF&CO FAMILY AND B2 COMPANIES.</p>
            <p className="mt-4 md:mt-0 flex items-center gap-3">
                <span className="flex h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]"></span>
                SYSTEM STATUS: OPERATIONAL
            </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
