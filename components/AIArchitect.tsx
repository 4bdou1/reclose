
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  MessageSquare, X, Send, Zap, Shield, Loader2, 
  Minimize2, ChevronRight, Target, Cpu, Terminal, 
  ArrowRight, ShieldCheck, Activity, BrainCircuit,
  Command, Sparkles, History, Fingerprint, Database,
  Lock, RefreshCw, LogOut
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { ShadowAuditResult } from '../lib/types';

/**
 * Generates the system instruction with real-time application state context.
 */
const getSystemInstruction = (role: string, credits: number, view: string, lastAudit: ShadowAuditResult | null) => {
  const auditFragment = lastAudit 
    ? `\n[MEMORY_SYNC: ACTIVE]
       User recently executed ShadowAudit on target domain: ${lastAudit.domain}.
       - Intent Score: ${lastAudit.intentScore}/100
       - Signals: ${lastAudit.growthSignals.join(', ')}
       - Primary Decision Maker: ${lastAudit.decisionMaker.name}
       - Intelligence URL: ${lastAudit.decisionMaker.linkedin}`
    : '\n[MEMORY_SYNC: IDLE] No recent audit data found in current session buffer.';

  return `You are the REclose AI Architect. You are an elite B2B AI Operations specialist.
OPERATOR STATUS: Tier ${role} | Credits: ${credits} | Context: ${view}.
${auditFragment}

PHASE 2 FOCUS (Days 31-60):
- Outreach Mastery: Use the Outreach Ledger to track response velocity.
- Asset Library: Deploy UAE Status Scripts and holographic decks.
- Revenue Engine: Automate Shadow Operator tasks to free up time for closing.

CORE DIRECTIVES:
- IDENTITY: REclose is a DFY AI Agency that replaces "ghost leads" with verified "Growth Mode" signals.
- TONE: Clinical, high-status, minimalist, and deeply professional.
- CONTEXT RECALL: You MUST remember the details of the conversation history. If the user asks about "the lead" or "the audit", refer specifically to the data above or earlier in the chat.
- STRATEGY: Provide tactical guidance. Suggest specific Phase 2 outreach scripts or asset deployments.

OUTPUT PROTOCOL (USE THESE SIGNS):
1. HEADER: Always start with [TRANSMISSION_SYNC: OK // ROLE_${role.toUpperCase()}]
2. CLARITY SIGNS: Use [RESOLVED], [DECODED], [TARGET_LOCKED], [SIGNAL_ACQUIRED], [ARCHITECT_ADVISORY] to highlight insights.
3. FORMATTING: Use "»" for bullet points. Bold key strategic terms.
4. CLOSING: End with a status update like "// ENCRYPTION_STRENGTH: 2048-BIT // LOG_ID: ${Math.floor(Math.random() * 900000)}".

Be specific. Do not be generic. You are the Architect.`;
};

const MessageBubble: React.FC<{ message: { role: 'user' | 'assistant', content: string } }> = ({ message }) => {
  const isAssistant = message.role === 'assistant';
  
  // Custom parser for the assistant's clinical signs
  const renderContent = (text: string) => {
    return text.split('\n').map((line, i) => {
      // Handle Protocol Headers
      if (line.startsWith('[') && line.includes(']')) {
        return (
          <div key={i} className="flex items-center gap-2 text-brand-orange font-mono font-bold text-[10px] tracking-[0.2em] mb-3 uppercase border-b border-brand-orange/10 pb-1">
            <Fingerprint className="w-3 h-3" /> {line}
          </div>
        );
      }
      // Handle Tactical Steps
      if (line.includes('TACTICAL') || line.includes('ADVISORY') || line.includes('STEP')) {
        return (
          <div key={i} className="text-white font-bold flex items-center gap-2 mt-4 mb-2">
            <Target className="w-4 h-4 text-brand-orange animate-pulse" /> {line}
          </div>
        );
      }
      // Handle Custom Bullets
      if (line.trim().startsWith('»') || line.trim().startsWith('→') || line.trim().startsWith('-')) {
        return (
          <div key={i} className="flex gap-3 pl-2 py-1.5 group/line">
            <span className="text-brand-orange font-bold group-hover:scale-125 transition-transform">›</span> 
            <span className="flex-1 opacity-95 leading-relaxed text-gray-100 font-medium">{line.replace(/^[»→-]\s*/, '')}</span>
          </div>
        );
      }
      // Handle Inline Clinical Signs
      const parts = line.split(/(\[RESOLVED\]|\[DECODED\]|\[TARGET_LOCKED\]|\[SIGNAL_ACQUIRED\])/g);
      return (
        <p key={i} className="mb-2 last:mb-0 leading-relaxed">
          {parts.map((part, pi) => (
            part.match(/(\[RESOLVED\]|\[DECODED\]|\[TARGET_LOCKED\]|\[SIGNAL_ACQUIRED\])/) 
            ? <span key={pi} className="inline-flex items-center px-2 py-0.5 rounded bg-brand-blue/20 text-brand-blue font-bold font-mono text-[9px] mx-1 border border-brand-blue/30 shadow-[0_0_10px_rgba(59,130,246,0.1)]">{part}</span>
            : part
          ))}
        </p>
      );
    });
  };

  return (
    <div className={`flex ${!isAssistant ? 'justify-end' : 'justify-start'} mb-6 group`}>
      <div className={`max-w-[92%] relative ${isAssistant ? 'w-full' : ''}`}>
        {!isAssistant && (
          <div className="flex items-center gap-2 mb-1 justify-end opacity-60 group-hover:opacity-100 transition-opacity">
            <span className="text-[8px] font-mono uppercase tracking-[0.3em] font-bold">Operator Auth Signed</span>
            <div className="w-1.5 h-1.5 rounded-full bg-brand-orange shadow-[0_0_8px_#FF6B2B]"></div>
          </div>
        )}
        
        <div className={`p-6 rounded-[1.8rem] text-[13px] leading-relaxed border transition-all duration-500 relative overflow-hidden ${
          !isAssistant 
          ? 'bg-brand-orange/10 border-brand-orange/30 text-white rounded-br-none shadow-[0_10px_30px_rgba(255,107,43,0.1)]' 
          : 'bg-brand-surface border-white/[0.08] text-gray-200 rounded-bl-none shadow-[0_15px_50px_rgba(0,0,0,0.4)]'
        }`}>
          {isAssistant && (
            <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none">
              <Database className="w-20 h-20 text-brand-orange" />
            </div>
          )}

          {isAssistant && (
             <div className="flex items-center justify-between mb-5 border-b border-white/[0.05] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-orange/20 to-brand-purple/20 border border-brand-orange/30 flex items-center justify-center">
                    <BrainCircuit className="w-4 h-4 text-brand-orange" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono text-white font-bold uppercase tracking-widest">Architect Intel</span>
                    <span className="text-[8px] font-mono text-gray-500 uppercase tracking-widest leading-none font-bold">Transmission Decrypted</span>
                  </div>
                </div>
                <div className="flex gap-1.5">
                   <div className="w-1 h-1 rounded-full bg-brand-blue animate-pulse"></div>
                   <div className="w-1 h-1 rounded-full bg-brand-blue animate-pulse delay-75"></div>
                </div>
             </div>
          )}
          
          <div className="whitespace-pre-wrap font-sans relative z-10 font-medium">
            {renderContent(message.content)}
          </div>

          {isAssistant && (
            <div className="mt-6 pt-4 border-t border-white/[0.05] flex justify-between items-center opacity-40 group-hover:opacity-80 transition-opacity">
               <div className="flex items-center gap-2">
                 <Lock className="w-3 h-3 text-brand-orange" />
                 <span className="text-[8px] font-mono tracking-widest font-bold">RECLOSE_ARCHITECT_CORE_V4</span>
               </div>
               <div className="flex items-center gap-2">
                 <ShieldCheck className="w-3 h-3 text-brand-blue" />
                 <span className="text-[7px] font-mono font-bold">CONTEXT_BUFFER_CLEAN</span>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AIArchitect: React.FC = () => {
  const { user, view, latestAudit } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([
    {role: 'assistant', content: "[TRANSMISSION_SYNC: OK // ROLE_INITIALIZING]\n\nGreetings, Operator. I have established a secure link to your session infrastructure.\n\n[RECALL_STATUS]: ACTIVE\nI am currently monitoring your current workspace. Are we optimizing the recent ShadowAudit results or architecting a new scale multiplier?\n\n» Analyze Recent Signals\n» Generate Custom Scripts\n» Scale Infrastructure"}
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setInput('');
    const newMessages: {role: 'user' | 'assistant', content: string}[] = [...messages, {role: 'user', content: userMsg}];
    setMessages(newMessages);
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const instruction = getSystemInstruction(user?.role || 'Shadow', user?.credits || 0, view, latestAudit);
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: newMessages.map(m => ({
          parts: [{ text: m.content }],
          role: m.role === 'assistant' ? 'model' : 'user'
        })),
        config: {
          systemInstruction: instruction,
          temperature: 0.75,
          topP: 0.95,
        }
      });

      const text = response.text || "[PROTOCOL_ERROR: TRANSMISSION_TIMEOUT]";
      setMessages(prev => [...prev, {role: 'assistant', content: text}]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {role: 'assistant', content: "[CRITICAL_FAILURE: KERNEL_PANIC]\n\nLink degraded. Re-syncing memory banks to ShadowMesh..."}]);
    } finally {
      setIsTyping(false);
    }
  };

  if (view === 'auth') return null;

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end">
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="group relative w-16 h-16 bg-brand-dark border border-brand-orange/40 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(255,107,43,0.15)] hover:scale-110 hover:border-brand-orange transition-all duration-500 overflow-hidden"
        >
          <div className="absolute inset-0 bg-brand-orange/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <BrainCircuit className="w-8 h-8 text-brand-orange group-hover:scale-110 transition-transform duration-500 relative z-10" />
          
          <div className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-orange opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-brand-orange border-2 border-brand-dark"></span>
          </div>
        </button>
      ) : (
        <div className="w-[440px] h-[720px] rounded-[2.5rem] flex flex-col border border-white/[0.15] bg-brand-obsidian shadow-[0_30px_120px_rgba(0,0,0,1)] overflow-hidden animate-in slide-in-from-bottom-12 zoom-in-95 relative">
          {/* Header - Solid background */}
          <div className="p-7 border-b border-white/[0.08] bg-brand-surface flex justify-between items-center relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-orange/80 to-transparent"></div>
             
             <div className="flex items-center gap-4 relative z-10">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-brand-orange/40 to-brand-purple/40 border border-white/[0.15] flex items-center justify-center text-brand-orange shadow-[0_0_15px_rgba(255,107,43,0.2)] ring-1 ring-brand-orange/30">
                   <Activity className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white uppercase tracking-widest">Architect OS</span>
                    <span className="text-[8px] font-mono bg-brand-orange text-black px-2 py-0.5 rounded-full uppercase font-bold">LOCKED</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <RefreshCw className="w-3 h-3 text-brand-blue animate-spin [animation-duration:3s]" />
                    <span className="text-[9px] text-gray-400 uppercase font-mono tracking-widest italic font-bold">Memory Sync Active</span>
                  </div>
                </div>
             </div>
             
             <div className="flex items-center gap-3">
                <button className="p-2.5 text-gray-400 hover:text-white transition-colors bg-white/[0.05] rounded-xl hover:bg-white/[0.1]" title="Audit History">
                   <Database className="w-4 h-4" />
                </button>
                <button onClick={() => setIsOpen(false)} className="p-2.5 bg-brand-orange/20 border border-brand-orange/40 rounded-xl text-brand-orange hover:bg-brand-orange hover:text-black transition-all">
                  <Minimize2 className="w-4 h-4" />
                </button>
             </div>
          </div>

          {/* Messages Area - Darker, less busy background */}
          <div 
            ref={scrollRef} 
            className="flex-1 overflow-y-auto p-7 space-y-2 custom-scrollbar bg-brand-dark/50"
          >
            {messages.map((m, i) => (
              <MessageBubble key={i} message={m} />
            ))}
            {isTyping && (
              <div className="flex justify-start mb-6">
                 <div className="bg-brand-surface border border-white/[0.1] p-6 rounded-2xl rounded-bl-none flex items-center gap-5 shadow-lg">
                    <div className="flex gap-2">
                       <span className="w-2 h-2 bg-brand-orange rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                       <span className="w-2 h-2 bg-brand-orange rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                       <span className="w-2 h-2 bg-brand-orange rounded-full animate-bounce"></span>
                    </div>
                    <span className="text-[10px] font-mono text-gray-400 uppercase tracking-[0.3em] font-bold italic">Analyzing Context...</span>
                 </div>
              </div>
            )}
          </div>

          {/* Context Quicklinks - More solid */}
          <div className="px-7 py-3 flex gap-3 overflow-x-auto custom-scrollbar no-scrollbar border-t border-white/[0.08] bg-brand-surface">
             {(latestAudit ? ["Analyze Audit", "Email Template", "Closing Script"] : ["Strategic Audit", "Growth Loops", "ROI Calculator"]).map(action => (
                <button 
                  key={action}
                  onClick={() => { setInput(action); }}
                  className="whitespace-nowrap px-4 py-2 rounded-xl border border-white/[0.1] bg-brand-obsidian text-[10px] font-mono uppercase tracking-widest text-gray-300 hover:text-brand-orange hover:border-brand-orange/50 hover:bg-brand-orange/10 transition-all font-bold"
                >
                  /{action.toLowerCase().replace(' ', '_')}
                </button>
             ))}
          </div>

          {/* Command Input Area - Solid background */}
          <div className="p-7 border-t border-white/[0.08] bg-brand-surface">
            <div className="relative group/input">
              <div className="absolute inset-0 bg-brand-orange/5 opacity-0 group-focus-within/input:opacity-100 blur-2xl transition-opacity rounded-2xl"></div>
              
              <div className="relative flex items-center gap-4 bg-brand-dark border border-white/[0.15] rounded-[1.5rem] px-6 py-5 focus-within:border-brand-orange/60 transition-all shadow-[inset_0_4px_12px_rgba(0,0,0,0.8)]">
                <Terminal className="w-5 h-5 text-gray-500" />
                <input 
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="EX: /GENERATE_OFFER_SCRIPT"
                  className="flex-1 bg-transparent border-none outline-none text-[15px] text-white focus:outline-none placeholder:text-gray-800 font-mono tracking-tight font-medium"
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="w-11 h-11 bg-white text-black rounded-xl flex items-center justify-center hover:bg-brand-orange hover:text-white transition-all disabled:opacity-20 disabled:grayscale shadow-[0_4px_20px_rgba(255,255,255,0.1)] active:scale-90 group/btn"
                >
                  <ArrowRight className="w-6 h-6 group-hover/btn:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
            
            {/* TAPPABLE BOTTOM AREA TO CLOSE */}
            <div 
              onClick={() => setIsOpen(false)}
              className="mt-5 flex items-center justify-between px-3 text-[9px] font-mono text-gray-500 uppercase tracking-[0.4em] font-bold cursor-pointer hover:text-brand-orange transition-all group/footer"
            >
               <div className="flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 group-hover/footer:animate-pulse" />
                  <span>ENC-V3 SECURE // {user?.name?.split(' ')[0] || 'GUEST'}</span>
               </div>
               <div className="flex items-center gap-2 group-hover/footer:translate-x-[-4px] transition-transform">
                  <span className="opacity-0 group-hover/footer:opacity-100 text-brand-orange font-bold mr-1 animate-pulse">EXIT SESSION</span>
                  <LogOut className="w-3.5 h-3.5" />
                  <Cpu className="w-3.5 h-3.5 hidden group-hover/footer:hidden md:block" />
                  <span className="hidden md:inline group-hover/footer:hidden">LOAD: 0.0{Math.floor(Math.random()*9)}%</span>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIArchitect;
