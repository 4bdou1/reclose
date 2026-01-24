
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  X, Send, Zap, Shield, Loader2, 
  Minimize2, Target, Cpu, Terminal, 
  ArrowRight, ShieldCheck, Activity, BrainCircuit,
  Fingerprint, Database, Lock, RefreshCw, LogOut
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
- CONTEXT RECALL: You MUST remember the details of the conversation history.
- STRATEGY: Provide tactical guidance. Suggest specific Phase 2 outreach scripts or asset deployments.

OUTPUT PROTOCOL (USE THESE SIGNS):
1. HEADER: Always start with [TRANSMISSION_SYNC: OK // ROLE_${role.toUpperCase()}]
2. CLARITY SIGNS: Use [RESOLVED], [DECODED], [TARGET_LOCKED], [SIGNAL_ACQUIRED] to highlight insights.
3. FORMATTING: Use "»" for bullet points. Bold key strategic terms.
4. CLOSING: End with a status update like "// ENCRYPTION_STRENGTH: 2048-BIT".

Be specific. Do not be generic. You are the Architect.`;
};

const MessageBubble: React.FC<{ message: { role: 'user' | 'assistant', content: string } }> = ({ message }) => {
  const isAssistant = message.role === 'assistant';
  
  const renderContent = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('[') && line.includes(']')) {
        return (
          <div key={i} className="flex items-center gap-2 text-brand-orange font-mono font-bold text-[10px] tracking-[0.2em] mb-4 uppercase mt-2">
             <Fingerprint className="w-3 h-3" /> {line}
          </div>
        );
      }
      if (line.trim().startsWith('»') || line.trim().startsWith('→') || line.trim().startsWith('-')) {
        return (
          <div key={i} className="flex gap-3 pl-2 py-1.5 group/line">
            <span className="text-brand-orange font-bold">›</span> 
            <span className="flex-1 opacity-95 leading-relaxed text-gray-100 font-medium">{line.replace(/^[»→-]\s*/, '')}</span>
          </div>
        );
      }
      const parts = line.split(/(\[RESOLVED\]|\[DECODED\]|\[TARGET_LOCKED\]|\[SIGNAL_ACQUIRED\])/g);
      return (
        <p key={i} className="mb-2 last:mb-0 leading-relaxed text-[13px]">
          {parts.map((part, pi) => (
            part.match(/(\[RESOLVED\]|\[DECODED\]|\[TARGET_LOCKED\]|\[SIGNAL_ACQUIRED\])/) 
            ? <span key={pi} className="inline-flex items-center px-2 py-0.5 rounded bg-brand-blue/20 text-brand-blue font-bold font-mono text-[9px] mx-1 border border-brand-blue/30">{part}</span>
            : part
          ))}
        </p>
      );
    });
  };

  return (
    <div className={`flex ${!isAssistant ? 'justify-end' : 'justify-start'} mb-8 group`}>
      <div className={`max-w-[95%] relative ${isAssistant ? 'w-full' : ''}`}>
        {!isAssistant && (
          <div className="flex items-center gap-2 mb-1.5 justify-end opacity-40">
            <span className="text-[7px] font-mono uppercase tracking-[0.3em] font-bold">Operator Verified</span>
          </div>
        )}
        
        <div className={`p-7 rounded-[1.8rem] border transition-all duration-500 relative overflow-hidden ${
          !isAssistant 
          ? 'bg-brand-orange/5 border-brand-orange/20 text-white rounded-br-none' 
          : 'bg-[#0E1015] border-white/[0.06] text-gray-200 rounded-bl-none shadow-2xl'
        }`}>
          {isAssistant && (
             <div className="flex items-center justify-between mb-6 border-b border-white/[0.03] pb-5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-orange/10 border border-brand-orange/20 flex items-center justify-center">
                    <BrainCircuit className="w-5 h-5 text-brand-orange" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[12px] font-bold text-white uppercase tracking-[0.1em]">Architect Intel</span>
                    <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest font-bold">Transmission Decrypted</span>
                  </div>
                </div>
                <div className="flex gap-1.5 opacity-60">
                   <div className="w-1 h-1 rounded-full bg-brand-blue shadow-[0_0_5px_#3B82F6]"></div>
                   <div className="w-1 h-1 rounded-full bg-brand-blue shadow-[0_0_5px_#3B82F6]"></div>
                </div>
             </div>
          )}
          
          <div className="whitespace-pre-wrap font-sans relative z-10 font-medium">
            {renderContent(message.content)}
          </div>
        </div>
      </div>
    </div>
  );
};

const AIArchitect: React.FC = () => {
  const { user, view, latestAudit } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([
    {role: 'assistant', content: "[TRANSMISSION_SYNC: OK // ROLE_INITIALIZING]\n\nGreetings, Operator. I have established a secure link to your session infrastructure.\n\n[RECALL_STATUS]: ACTIVE\n\nI am currently monitoring your current workspace. Are we optimizing the recent ShadowAudit results or architecting a new scale multiplier?\n\n» Analyze Recent Signals\n» Generate Custom Scripts\n» Scale Infrastructure"}
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
        }
      });

      const text = response.text || "[PROTOCOL_ERROR: TIMEOUT]";
      setMessages(prev => [...prev, {role: 'assistant', content: text}]);
    } catch (error) {
      setMessages(prev => [...prev, {role: 'assistant', content: "[FAILURE] Link degraded. Re-syncing..."}]);
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
          className="group relative w-16 h-16 bg-brand-dark border border-brand-orange/40 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(255,107,43,0.15)] hover:scale-110 hover:border-brand-orange transition-all duration-500"
        >
          <BrainCircuit className="w-8 h-8 text-brand-orange" />
          <div className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-orange opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-brand-orange border-2 border-brand-dark"></span>
          </div>
        </button>
      ) : (
        <div className="w-[460px] h-[780px] rounded-[2.5rem] flex flex-col border border-white/[0.1] bg-[#07080A] shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden animate-in slide-in-from-bottom-8">
          
          {/* Main Chat Header */}
          <div className="p-7 border-b border-white/[0.05] bg-[#0C0E12] flex justify-between items-center relative">
             <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl bg-brand-orange/10 border border-brand-orange/20 flex items-center justify-center text-brand-orange">
                   <Activity className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <div className="text-[12px] font-bold text-white uppercase tracking-widest">Architect OS</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <RefreshCw className="w-3 h-3 text-brand-blue animate-spin [animation-duration:4s]" />
                    <span className="text-[9px] text-gray-500 uppercase font-mono font-bold">Memory Sync Active</span>
                  </div>
                </div>
             </div>
             <button onClick={() => setIsOpen(false)} className="p-2.5 bg-brand-surface border border-white/5 rounded-xl text-gray-500 hover:text-white transition-all">
                <Minimize2 className="w-4 h-4" />
             </button>
          </div>

          {/* Messages Feed */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-7 space-y-2 custom-scrollbar">
            {messages.map((m, i) => (
              <MessageBubble key={i} message={m} />
            ))}
            {isTyping && (
              <div className="flex justify-start mb-6">
                 <div className="bg-[#0E1015] border border-white/[0.05] p-6 rounded-2xl flex items-center gap-4">
                    <div className="flex gap-1.5">
                       <span className="w-1.5 h-1.5 bg-brand-orange rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                       <span className="w-1.5 h-1.5 bg-brand-orange rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                       <span className="w-1.5 h-1.5 bg-brand-orange rounded-full animate-bounce"></span>
                    </div>
                    <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest font-bold">Processing Intel...</span>
                 </div>
              </div>
            )}
          </div>

          {/* Quick Shortcuts */}
          <div className="px-7 py-3 flex gap-3 overflow-x-auto no-scrollbar border-t border-white/[0.03] bg-[#07080A]">
             {["Strategic Audit", "Growth Loops", "ROI Calculator"].map(action => (
                <button 
                  key={action}
                  onClick={() => setInput(action)}
                  className="whitespace-nowrap px-4 py-2 rounded-xl border border-white/[0.05] bg-[#0C0E12] text-[9px] font-mono uppercase tracking-widest text-gray-500 hover:text-brand-orange hover:border-brand-orange/30 transition-all font-bold"
                >
                  /{action.toLowerCase().replace(' ', '_')}
                </button>
             ))}
          </div>

          {/* Input Terminal */}
          <div className="p-7 border-t border-white/[0.05] bg-[#0C0E12]">
            <div className="flex items-center gap-4 bg-[#07080A] border border-white/[0.08] rounded-[1.5rem] px-5 py-4 focus-within:border-brand-orange/40 transition-all shadow-inner">
              <Terminal className="w-5 h-5 text-gray-700" />
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="EX: /GENERATE_OFFER_SCRIPT"
                className="flex-1 bg-transparent border-none outline-none text-[14px] text-white focus:outline-none placeholder:text-gray-800 font-mono"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="w-10 h-10 bg-white text-black rounded-xl flex items-center justify-center hover:bg-brand-orange hover:text-white transition-all disabled:opacity-20 active:scale-95"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            
            {/* Status Telemetry Footer */}
            <div 
              onClick={() => setIsOpen(false)}
              className="mt-6 flex items-center justify-between px-2 text-[8px] font-mono text-gray-600 uppercase tracking-[0.3em] font-bold cursor-pointer hover:text-brand-orange transition-all"
            >
               <div className="flex items-center gap-3">
                  <Shield className="w-3.5 h-3.5" />
                  <span>ENC-V3 SECURE // {user?.role?.toUpperCase() || 'GUEST'}</span>
               </div>
               <div className="flex items-center gap-3">
                  <span className="text-brand-orange animate-pulse">EXIT SESSION</span>
                  <div className="flex items-center gap-2">
                    <Cpu className="w-3 h-3" />
                    <span>LOAD: 0.0{Math.floor(Math.random()*9)}%</span>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIArchitect;
