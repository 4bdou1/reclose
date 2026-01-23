
import React from 'react';
import Logo from './Logo';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-brand-border bg-black py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start mb-12">
            <div className="mb-8 md:mb-0">
                <Logo size="sm" className="items-start" />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-12 text-sm text-gray-400">
                <div className="flex flex-col gap-3">
                  <span className="text-white font-bold uppercase tracking-widest text-[10px]">Ecosystem</span>
                  <a href="#" className="hover:text-white transition-colors">ShadowAudit™</a>
                  <a href="#" className="hover:text-white transition-colors">Business OS</a>
                  <a href="#" className="hover:text-white transition-colors">Architect AI</a>
                </div>
                <div className="flex flex-col gap-3">
                  <span className="text-white font-bold uppercase tracking-widest text-[10px]">Protocol</span>
                  <a href="#" className="hover:text-white transition-colors">Security</a>
                  <a href="#" className="hover:text-white transition-colors">API Logs</a>
                  <a href="#" className="hover:text-white transition-colors">Status</a>
                </div>
                <div className="flex flex-col gap-3">
                  <span className="text-white font-bold uppercase tracking-widest text-[10px]">Legal</span>
                  <a href="#" className="hover:text-white transition-colors">Privacy</a>
                  <a href="#" className="hover:text-white transition-colors">Terms</a>
                  <a href="#" className="hover:text-white transition-colors">Contact</a>
                </div>
            </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-600 font-mono pt-8 border-t border-brand-border/30 uppercase tracking-widest">
            <p>&copy; {new Date().getFullYear()} RECLOSE. PART OF THE HPF&CO FAMILY AND B2 COMPANIES.</p>
            <p className="mt-4 md:mt-0 flex items-center gap-3">
                <span className="flex h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]"></span>
                SYSTEM STATUS: OPERATIONAL
            </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
