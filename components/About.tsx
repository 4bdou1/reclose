
import React from 'react';
import Reveal from './Reveal';

const About: React.FC = () => {
  return (
    <section id="about" className="py-24 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-purple/5 blur-[100px] rounded-full pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div>
            <Reveal>
              <div className="flex items-center gap-3 mb-6">
                <span className="w-12 h-[1px] bg-brand-orange"></span>
                <span className="font-mono text-brand-orange uppercase tracking-widest text-sm">Shadow Operator Protocol</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Lead generation for the <span className="text-brand-purple italic">Shadow Era</span>.
              </h2>
              
              <p className="text-gray-400 text-lg leading-relaxed mb-6">
                <span className="text-white font-semibold">reclose</span> isn't another scraper. We are a "Done-For-You" AI agency that replaces cold, dead data with absolute verification. Our agents ghost-visit websites, detect hiring surges, and identify real decision-makers.
              </p>
              
              <p className="text-gray-400 text-lg leading-relaxed">
                We've reimagined business operations to eliminate friction. Stop chasing ghosts and start closing companies that are actively trying to grow.
              </p>
            </Reveal>

            <Reveal delay={200}>
              <div className="mt-10 grid grid-cols-2 gap-8 border-t border-brand-border pt-8">
                 <div>
                   <div className="text-3xl font-mono font-bold text-white mb-1">94%</div>
                   <div className="text-sm text-gray-500 uppercase tracking-wider">Close Probability</div>
                 </div>
                 <div>
                   <div className="text-3xl font-mono font-bold text-white mb-1">0ms</div>
                   <div className="text-sm text-gray-500 uppercase tracking-wider">Friction</div>
                 </div>
              </div>
            </Reveal>
          </div>

          <div className="relative">
            <Reveal delay={300} width="100%">
              <div className="relative aspect-square max-w-md mx-auto [perspective:1000px]">
                 {/* Outer Circle - High Visibility with standard linear rotation */}
                 <div className="absolute inset-0 border border-brand-border rounded-full animate-spin-slow [transform-style:preserve-3d]"></div>
                 
                 {/* Inner Circle - Brighter with Vertical Y-Axis Rotation */}
                 <div className="absolute inset-4 border border-brand-border rounded-full animate-spin-y [transform-style:preserve-3d]"></div>
                 
                 <div className="absolute inset-0 bg-gradient-radial from-brand-purple/20 to-transparent blur-2xl"></div>
                 
                 <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-48 h-48 bg-black border border-brand-border rounded-lg flex items-center justify-center relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-flight opacity-10 group-hover:opacity-20 transition-opacity"></div>
                      <div className="text-center relative z-10">
                        <div className="text-4xl font-bold mb-1">OS</div>
                        <div className="text-[10px] font-mono text-brand-orange tracking-widest">ARCHITECT CORE</div>
                      </div>
                      <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-brand-orange"></div>
                      <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-brand-orange"></div>
                      <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-brand-orange"></div>
                      <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-brand-orange"></div>
                   </div>
                 </div>
              </div>
            </Reveal>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes spin-y {
          from { transform: rotateY(0deg); }
          to { transform: rotateY(360deg); }
        }
        @keyframes spin-standard {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-y {
          animation: spin-y 8s linear infinite;
        }
        .animate-spin-slow {
          animation: spin-standard 15s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default About;
