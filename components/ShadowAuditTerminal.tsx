
import React, { useState } from 'react';
import { Search, Terminal, Loader2, CheckCircle, Zap, ShieldAlert, Cpu, Database } from 'lucide-react';
import Reveal from './Reveal';
import { useAppContext } from '../context/AppContext';

const ShadowAuditTerminal: React.FC = () => {
  const { setLatestAudit } = useAppContext();
  const [domain, setDomain] = useState('');
  const [status, setStatus] = useState<'idle' | 'scanning' | 'results'>('idle');
  const [logs, setLogs] = useState<string[]>([]);

  const startAudit = async () => {
    if (!domain) return;
    setStatus('scanning');
    setLogs(['[SYSTEM] Initializing ShadowAudit™ Protocol...', '[OS] Mounting autonomous agents...', '[INFO] Protocol requires 1 Shadow Credit.']);
    
    const steps = [
      '[AGENT 01] Entering domain architecture...',
      '[AGENT 02] Scanning /careers for hiring signals...',
      '[SIGNAL] Found: 4 high-value signals in "Enterprise Sales"',
      '[TECH] Verifying tech stack... Salesforce detected.',
      '[RECLOSE AI] Growth-Mode verified (Intent Score: 92/100).',
      '[SYSTEM] Verification complete. Data Unlocked.'
    ];

    for (const step of steps) {
      await new Promise(r => setTimeout(r, 600));
      setLogs(prev => [...prev, step]);
    }
    
    // Store in context for AI Architect awareness
    setLatestAudit({
      id: Math.random().toString(36).substr(2, 9),
      domain: domain,
      intentScore: 92,
      growthSignals: ['Enterprise Sales Hiring', 'Salesforce Integration', 'SaaS Stack Expansion'],
      decisionMaker: {
        name: 'Marcus Sterling',
        email: 'm.sterling@' + domain,
        linkedin: 'linkedin.com/in/msterling'
      },
      timestamp: new Date().toISOString()
    });
    
    setStatus('results');
  };

  return (
    <section className="py-32 relative overflow-hidden bg-brand-obsidian">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-orange/20 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          <div>
            <Reveal>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl cyber-glass flex items-center justify-center text-brand-orange">
                  <Cpu className="w-6 h-6" />
                </div>
                <span className="font-mono text-brand-orange uppercase tracking-[0.4em] text-xs italic font-bold">Protocol 4.2.0</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-bold mb-8 tracking-tighter leading-tight">
                Live <br/><span className="holographic-silver italic">Neural Scans.</span>
              </h2>
              <p className="text-brand-silver/50 text-lg mb-10 leading-relaxed tracking-tight max-w-lg">
                Drop a URL. Our agents ghost-visit the company's architecture to detect budget surges and hiring signals scrapers miss.
              </p>
              
              <div className="space-y-6">
                <div className="flex flex-col gap-4">
                   <div className="flex flex-col sm:flex-row gap-4 p-2 bg-brand-surface/30 border border-brand-border rounded-3xl cyber-glass shadow-inner group">
                      <div className="flex-1 flex items-center gap-4 px-6 py-4">
                         <Terminal className="w-5 h-5 text-brand-silver/30" />
                         <input 
                           type="text" 
                           placeholder="target-domain.io" 
                           value={domain}
                           onChange={(e) => setDomain(e.target.value)}
                           className="bg-transparent border-none outline-none text-white w-full text-lg font-mono placeholder:text-gray-800 tracking-tight"
                         />
                      </div>
                      <button 
                       onClick={startAudit}
                       disabled={status === 'scanning'}
                       className="tactile-btn bg-white text-black px-10 py-4 rounded-2xl font-bold hover:bg-brand-silver transition-all flex items-center justify-center gap-3 whitespace-nowrap"
                      >
                        {status === 'scanning' ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Zap className="w-5 h-5 fill-black" /> Init Scan</>}
                      </button>
                   </div>
                   <div className="flex items-center gap-6 px-4">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse shadow-[0_0_8px_#FF6B2B]"></span>
                        <span className="text-[10px] text-brand-silver/40 uppercase font-mono tracking-widest">Cost: 1 Credit</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Database className="w-3 h-3 text-brand-blue/40" />
                        <span className="text-[10px] text-brand-silver/40 uppercase font-mono tracking-widest">Nodes Ready</span>
                      </div>
                   </div>
                </div>
              </div>
            </Reveal>
          </div>

          <div className="relative group">
             <div className="absolute -inset-4 bg-gradient-to-tr from-brand-orange/5 to-brand-purple/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
             <Reveal width="100%">
               <div className="cyber-glass rounded-[2.5rem] border border-brand-border h-[480px] flex flex-col overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] relative">
                  <div className="bg-black/80 px-8 py-5 border-b border-brand-border flex items-center justify-between">
                     <div className="flex gap-3">
                        <div className="w-3 h-3 rounded-full bg-red-500/10 border border-red-500/30"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/10 border border-yellow-500/30"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/10 border border-green-500/30"></div>
                     </div>
                     <span className="text-[10px] font-mono text-brand-silver/30 tracking-[0.4em] uppercase font-bold italic">Terminal Agent RC4</span>
                  </div>
                  
                  <div className="flex-1 p-8 font-mono text-xs overflow-y-auto space-y-3 custom-scrollbar">
                     {logs.length === 0 && <div className="text-gray-800 italic flex items-center gap-3 animate-pulse uppercase tracking-widest"><div className="w-1.5 h-4 bg-gray-800"></div> System Idle // Awaiting Target...</div>}
                     {logs.map((log, i) => (
                       <div key={i} className={`animate-in fade-in slide-in-from-left-4 ${log.includes('[SIGNAL]') ? 'text-brand-orange' : log.includes('[RECLOSE AI]') ? 'text-brand-purple font-bold' : 'text-brand-silver/40'}`}>
                          <span className="mr-3 opacity-20">[{new Date().toLocaleTimeString([], {hour12: false})}]</span> {log}
                       </div>
                     ))}
                     {status === 'scanning' && (
                       <div className="h-[2px] w-full bg-brand-surface rounded-full mt-6 overflow-hidden relative">
                          <div className="absolute inset-0 bg-brand-orange animate-glow-line shadow-[0_0_10px_#FF6B2B]"></div>
                       </div>
                     )}
                     
                     {status === 'results' && (
                       <div className="mt-10 p-6 bg-brand-orange/5 border border-brand-orange/10 rounded-3xl animate-in fade-in zoom-in-95 backdrop-blur-md">
                          <div className="flex items-center gap-3 text-brand-orange font-bold text-sm mb-4">
                             <CheckCircle className="w-5 h-5" /> 
                             <span className="uppercase tracking-[0.2em]">Intent Verified: High Status</span>
                          </div>
                          <div className="grid grid-cols-1 gap-4 text-[10px] text-brand-silver/60 uppercase font-mono tracking-widest">
                             <div className="flex justify-between border-b border-brand-border pb-2"><span>Decision Maker:</span> <span className="text-white">Marcus Sterling</span></div>
                             <div className="flex justify-between border-b border-brand-border pb-2"><span>Role:</span> <span className="text-white">Chief of Ops</span></div>
                             <div className="flex justify-between border-b border-brand-border pb-2"><span>Growth Signal:</span> <span className="text-brand-orange">SaaS Stack Expansion</span></div>
                          </div>
                          <button className="mt-6 w-full py-3 bg-white text-black rounded-xl text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-brand-silver transition-all shadow-xl">
                             Mount to Shadow CRM
                          </button>
                       </div>
                     )}
                  </div>
               </div>
             </Reveal>
          </div>

        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-brand-dark to-transparent"></div>
    </section>
  );
};

export default ShadowAuditTerminal;
