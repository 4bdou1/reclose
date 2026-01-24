
import React, { useState, useEffect } from 'react';
import { useAppContext, DashboardModule } from '../../context/AppContext';
import { GoogleGenAI } from "@google/genai";
import { 
  Bell, Zap, Globe, Plus, ChevronRight, BarChart3, 
  Briefcase, LogOut, Rocket, Percent, Activity, 
  Loader2, Search, Database, Layout, Send, 
  FileText, Calendar, Filter, MoreVertical, 
  CheckCircle2, ArrowUpRight, TrendingUp, Target, 
  BrainCircuit, MapPin, Sparkles, UserCheck, 
  Instagram, Mail, MessageCircle, ArrowDownNarrowWide,
  Library, Cpu, Layers, MousePointer2, Clipboard,
  Clock, Flame, DollarSign, ShieldAlert, Workflow,
  ShieldCheck, Crown
} from 'lucide-react';
import Logo from '../Logo';

// --- SHARED COMPONENTS ---

/**
 * High-status Gold Crown Icon for HPF Executive
 * Replaced the hooded silhouette with a premium golden crown.
 */
const GoldCrownIcon = () => (
  <div className="w-full h-full flex items-center justify-center bg-[#0A0A0F] rounded-full p-2 border border-[#C5A059]/30 shadow-[inset_0_0_15px_rgba(197,160,89,0.2)]">
    <Crown className="w-6 h-6 text-[#C5A059] fill-[#C5A059]/20" strokeWidth={1.5} />
  </div>
);

const DashboardStatCard: React.FC<{ 
  label: string, 
  value: string, 
  trend: string, 
  icon: any, 
  color: string, 
  isPositive?: boolean 
}> = ({ label, value, trend, icon: Icon, color, isPositive = true }) => (
  <div className="bg-[#0F1219] border border-white/[0.04] p-6 rounded-[1.2rem] flex flex-col justify-between relative overflow-hidden group hover:border-white/[0.08] transition-all h-[140px]">
    <div className="flex justify-between items-start">
      <div className="space-y-1">
        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{label}</div>
        <div className="text-2xl font-bold tracking-tighter text-white flex items-baseline gap-2">
          {value}
          <span className={`text-[10px] font-bold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>{trend}</span>
        </div>
      </div>
      <div className="text-white/10 group-hover:text-white/20 transition-colors">
        <Icon className="w-8 h-8" strokeWidth={1.5} />
      </div>
    </div>
    <div className="w-full h-1 bg-white/[0.03] rounded-full overflow-hidden mt-4">
      <div className={`h-full opacity-80 ${color}`} style={{ width: '65%' }}></div>
    </div>
  </div>
);

// --- MODULE: OUTREACH LEDGER (Phase 2) ---

const OutreachLedgerModule: React.FC = () => {
  const [leads, setLeads] = useState([
    { id: 1, name: '@dubai_luxury_interiors', channel: 'Instagram', status: 'Engaged', velocity: 92, lastActivity: '2m ago', responseTime: '14m' },
    { id: 2, name: 'Sterling Assets Group', channel: 'Email', status: 'Pinged', velocity: 45, lastActivity: '1h ago', responseTime: '4h' },
    { id: 3, name: '@desert_tech_founder', channel: 'Instagram', status: 'Closing', velocity: 98, lastActivity: 'Just now', responseTime: '3m' },
    { id: 4, name: 'UAE Logistics Hub', channel: 'WhatsApp', status: 'Scouted', velocity: 0, lastActivity: '4h ago', responseTime: '-' },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Closing': return 'text-brand-orange bg-brand-orange/10 border-brand-orange/20';
      case 'Engaged': return 'text-brand-blue bg-brand-blue/10 border-brand-blue/20';
      case 'Pinged': return 'text-brand-purple bg-brand-purple/10 border-brand-purple/20';
      default: return 'text-gray-500 bg-white/5 border-white/10';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tighter mb-2">Outreach Ledger</h2>
          <p className="text-gray-500 text-sm font-mono uppercase tracking-widest">Tracking Response Velocity // Phase 2 Protocol</p>
        </div>
        <div className="flex gap-4">
           <div className="bg-brand-orange/10 border border-brand-orange/20 px-6 py-3 rounded-xl flex items-center gap-3">
              <Flame className="w-4 h-4 text-brand-orange animate-pulse" />
              <div className="text-right">
                <div className="text-[8px] font-bold text-brand-orange uppercase tracking-widest leading-none">Global Velocity</div>
                <div className="text-sm font-bold text-white tracking-tight">84.2% Optimal</div>
              </div>
           </div>
        </div>
      </div>

      <div className="bg-[#0F1219] border border-white/[0.04] rounded-[2rem] overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-white/[0.04] flex justify-between items-center bg-white/[0.01]">
          <div className="flex gap-6">
            <button className="text-xs font-bold uppercase tracking-widest text-brand-orange border-b border-brand-orange pb-1">Master View</button>
            <button className="text-xs font-bold uppercase tracking-widest text-gray-600 hover:text-white transition-colors">By Channel</button>
            <button className="text-xs font-bold uppercase tracking-widest text-gray-600 hover:text-white transition-colors">High Velocity</button>
          </div>
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-700" />
            <input type="text" placeholder="FILTER LEDGER..." className="bg-transparent border-none outline-none text-[10px] font-mono uppercase tracking-widest text-white placeholder:text-gray-800 w-40" />
          </div>
        </div>
        
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/[0.04] bg-white/[0.005]">
              <th className="p-8 text-[9px] font-bold text-gray-500 uppercase tracking-widest">Target Operator</th>
              <th className="p-8 text-[9px] font-bold text-gray-500 uppercase tracking-widest">Status Hub</th>
              <th className="p-8 text-[9px] font-bold text-gray-500 uppercase tracking-widest">Response Velocity</th>
              <th className="p-8 text-[9px] font-bold text-gray-500 uppercase tracking-widest">Avg Pulse</th>
              <th className="p-8 text-[9px] font-bold text-gray-500 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.02]">
            {leads.map(lead => (
              <tr key={lead.id} className="hover:bg-white/[0.01] transition-colors group">
                <td className="p-8">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-surface border border-white/5 flex items-center justify-center text-gray-600 group-hover:border-brand-orange/30 transition-all">
                      {lead.channel === 'Instagram' ? <Instagram className="w-5 h-5" /> : lead.channel === 'Email' ? <Mail className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white tracking-tight">{lead.name}</div>
                      <div className="text-[10px] text-gray-600 font-mono uppercase tracking-widest">{lead.channel}</div>
                    </div>
                  </div>
                </td>
                <td className="p-8">
                  <span className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest border ${getStatusColor(lead.status)}`}>
                    {lead.status}
                  </span>
                  <div className="mt-2 text-[8px] text-gray-700 font-mono italic">{lead.lastActivity}</div>
                </td>
                <td className="p-8">
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-1.5 bg-white/[0.03] rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-1000 ${lead.velocity > 80 ? 'bg-brand-orange shadow-[0_0_10px_#FF6B2B]' : lead.velocity > 40 ? 'bg-brand-blue' : 'bg-gray-800'}`} 
                        style={{ width: `${lead.velocity}%` }}
                      ></div>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-gray-500">{lead.velocity}%</span>
                  </div>
                </td>
                <td className="p-8">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3 text-gray-700" />
                    <span className="text-[11px] font-mono text-white font-bold">{lead.responseTime}</span>
                  </div>
                </td>
                <td className="p-8">
                  <button className="p-3 bg-white/[0.02] border border-white/[0.05] rounded-xl hover:bg-white hover:text-black transition-all">
                    <MousePointer2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-8 bg-white/[0.005] border-t border-white/[0.04] text-center">
           <button className="text-[9px] font-bold text-gray-600 uppercase tracking-[0.4em] hover:text-white transition-colors italic">Load Extended Archives</button>
        </div>
      </div>
    </div>
  );
};

// --- MODULE: ASSET LIBRARY (Phase 2) ---

const AssetLibraryModule: React.FC = () => {
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const assets = [
    { id: 1, title: 'UAE Status Script (Phase 2)', type: 'Outreach', description: 'Institutional-grade IG opener for Dubai-based micro-creators.', tags: ['Clinical', 'Status-Heavy'] },
    { id: 2, title: 'Shadow Operator Profile Kit', type: 'Digital ID', description: 'Optimized bios and profile aesthetic guidelines for trust building.', tags: ['Identity', 'Authority'] },
    { id: 3, title: 'Holographic Deck V4', type: 'Sales Asset', description: 'Presentation slides focusing on Arbitrage ROI and Scale.', tags: ['Presentation', 'Closing'] },
    { id: 4, title: 'Institutional Follow-up', type: 'Protocol', description: 'Multi-channel persistence script to avoid being ignored.', tags: ['Closing', 'Clinical'] },
  ];

  const handleCopy = (id: number) => {
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tighter mb-2">Asset Library</h2>
          <p className="text-gray-500 text-sm font-mono uppercase tracking-widest">Stored Tactical Assets // Verified Deployment</p>
        </div>
        <button className="px-6 py-3 bg-white text-black rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-brand-silver transition-all flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Asset
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {assets.map(asset => (
          <div key={asset.id} className="bg-[#0F1219] border border-white/[0.04] p-8 rounded-[2rem] group hover:border-brand-orange/30 transition-all flex flex-col justify-between h-[280px] relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Library className="w-32 h-32 text-brand-orange" />
             </div>
             <div>
               <div className="flex justify-between items-start mb-6">
                 <div className="px-3 py-1 rounded-lg bg-brand-surface border border-white/5 text-[8px] font-bold text-gray-500 uppercase tracking-widest">{asset.type}</div>
                 <div className="flex gap-2">
                   {asset.tags.map(tag => (
                     <span key={tag} className="text-[7px] font-mono text-brand-orange/60 uppercase">{tag}</span>
                   ))}
                 </div>
               </div>
               <h3 className="text-xl font-bold text-white mb-3 tracking-tight group-hover:text-brand-orange transition-colors">{asset.title}</h3>
               <p className="text-gray-500 text-xs leading-relaxed max-w-xs">{asset.description}</p>
             </div>
             <div className="mt-8 flex gap-3">
                <button 
                  onClick={() => handleCopy(asset.id)}
                  className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-[9px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2"
                >
                  {copiedId === asset.id ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clipboard className="w-3.5 h-3.5" />}
                  {copiedId === asset.id ? 'PROTOCOL COPIED' : 'COPY PROTOCOL'}
                </button>
                <button className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-brand-blue/20 hover:text-brand-blue transition-all">
                  <ArrowUpRight className="w-4 h-4" />
                </button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- MODULE: REVENUE ENGINE (Phase 2) ---

const RevenueEngineModule: React.FC = () => (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      {/* Main Stats Column */}
      <div className="lg:col-span-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-[#0F1219] border border-white/[0.04] p-8 rounded-[2rem] flex flex-col justify-between">
              <div className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-4">Pipeline Value</div>
              <div className="text-4xl font-bold text-white tracking-tighter">$142,500<span className="text-sm text-brand-orange font-mono ml-2">+12%</span></div>
              <div className="mt-6 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-brand-orange animate-pulse"></div>
                <span className="text-[9px] font-mono text-gray-700 uppercase tracking-widest">Active Verification Required</span>
              </div>
           </div>
           <div className="bg-[#0F1219] border border-white/[0.04] p-8 rounded-[2rem] flex flex-col justify-between">
              <div className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-4">Automation Health</div>
              <div className="text-4xl font-bold text-brand-blue tracking-tighter">98.4<span className="text-sm font-mono ml-2">%</span></div>
              <div className="mt-6 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-blue" />
                <span className="text-[9px] font-mono text-gray-700 uppercase tracking-widest">ShadowSync Optimized</span>
              </div>
           </div>
           <div className="bg-[#0F1219] border border-brand-orange/30 p-8 rounded-[2rem] flex flex-col justify-between shadow-[0_0_50px_rgba(255,107,43,0.1)]">
              <div className="text-[10px] font-bold text-brand-orange uppercase tracking-widest mb-4">Close Probability</div>
              <div className="text-4xl font-bold text-white tracking-tighter">64<span className="text-sm font-mono ml-2">%</span></div>
              <div className="mt-6 flex items-center gap-2">
                <Target className="w-3.5 h-3.5 text-brand-orange" />
                <span className="text-[9px] font-mono text-white/50 uppercase tracking-widest">Institutional Verified</span>
              </div>
           </div>
        </div>

        {/* Automation Flow Visualizer */}
        <div className="bg-[#0F1219] border border-white/[0.04] p-10 rounded-[2.5rem] relative overflow-hidden">
           <div className="flex justify-between items-center mb-12">
             <div className="flex gap-4 items-center">
                <Workflow className="w-6 h-6 text-brand-orange" />
                <h3 className="text-xl font-bold text-white tracking-tight uppercase tracking-widest">Revenue Flow Protocol</h3>
             </div>
             <div className="flex gap-2">
                <span className="px-3 py-1 bg-green-500/10 text-green-500 text-[8px] font-bold uppercase tracking-widest rounded-lg border border-green-500/20">Active Engine</span>
             </div>
           </div>

           <div className="grid grid-cols-5 gap-4 relative">
              {/* Connector lines */}
              <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-orange/20 to-transparent z-0"></div>
              
              {[
                { label: 'Scout', icon: Search, status: 'Done' },
                { label: 'Verify', icon: ShieldCheck, status: 'Done' },
                { label: 'Outreach', icon: Send, status: 'Active' },
                { label: 'Engage', icon: MessageCircle, status: 'Pending' },
                { label: 'Close', icon: DollarSign, status: 'Goal' },
              ].map((step, idx) => (
                <div key={idx} className="flex flex-col items-center gap-4 relative z-10">
                   <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all ${step.status === 'Active' ? 'bg-brand-orange text-black border-brand-orange shadow-[0_0_30px_rgba(255,107,43,0.3)]' : step.status === 'Done' ? 'bg-white/5 border-white/10 text-brand-orange' : 'bg-brand-surface border-white/5 text-gray-700'}`}>
                      <step.icon className="w-6 h-6" />
                   </div>
                   <div className="text-center">
                     <div className={`text-[9px] font-bold uppercase tracking-widest mb-1 ${step.status === 'Active' ? 'text-white' : 'text-gray-600'}`}>{step.label}</div>
                     <div className="text-[7px] font-mono text-gray-800 uppercase tracking-widest">{step.status}</div>
                   </div>
                </div>
              ))}
           </div>

           <div className="mt-12 pt-10 border-t border-white/[0.04] grid grid-cols-2 gap-8">
              <div className="space-y-4">
                 <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">System Efficiency</div>
                 <div className="h-2 w-full bg-white/[0.03] rounded-full overflow-hidden">
                    <div className="h-full bg-brand-blue" style={{ width: '88%' }}></div>
                 </div>
                 <div className="flex justify-between text-[9px] font-mono text-gray-700">
                    <span>ARCHIVE SYNC: 99.2%</span>
                    <span>BOT DETECTION: OPTIMAL</span>
                 </div>
              </div>
              <div className="flex justify-end items-end pb-1">
                 <button className="px-8 py-3 bg-brand-orange text-black rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-brand-orange/80 transition-all">Optimize Flow</button>
              </div>
           </div>
        </div>
      </div>

      {/* Side Alerts Column */}
      <div className="lg:col-span-4">
         <div className="bg-[#0F1219] border border-white/[0.04] rounded-[2rem] p-8 h-full">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/[0.04]">
               <h3 className="text-xs font-bold text-white uppercase tracking-widest">Operator Alerts</h3>
               <ShieldAlert className="w-4 h-4 text-brand-orange" />
            </div>
            <div className="space-y-6">
               {[
                 { title: 'Response Detected', desc: '@dxb_minimalist replied to Ping V2.', time: '2m ago', priority: 'High' },
                 { title: 'Credit Threshold', desc: 142 + ' credits remaining in pool.', time: '1h ago', priority: 'Med' },
                 { title: 'New Signal Locked', desc: 'Series B detection for "Arid Systems".', time: '3h ago', priority: 'Low' },
               ].map((alert, i) => (
                 <div key={i} className="p-4 bg-white/[0.01] border border-white/[0.04] rounded-xl group hover:border-white/[0.1] transition-all cursor-pointer">
                    <div className="flex justify-between items-start mb-2">
                       <span className={`text-[7px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${alert.priority === 'High' ? 'bg-brand-orange/10 text-brand-orange' : 'bg-gray-800 text-gray-500'}`}>{alert.priority} Priority</span>
                       <span className="text-[8px] font-mono text-gray-700">{alert.time}</span>
                    </div>
                    <div className="text-xs font-bold text-white mb-1">{alert.title}</div>
                    <div className="text-[10px] text-gray-500">{alert.desc}</div>
                 </div>
               ))}
            </div>
            <div className="mt-8">
               <div className="p-6 bg-brand-surface/50 border border-brand-orange/20 rounded-2xl flex flex-col items-center text-center gap-4">
                  <Cpu className="w-8 h-8 text-brand-orange opacity-40" />
                  <div className="text-[10px] font-bold text-white uppercase tracking-widest">Execute Batch Outreach</div>
                  <p className="text-[9px] text-gray-600 font-mono">24 verified signals awaiting protocol initiation.</p>
                  <button className="w-full py-3 bg-white text-black rounded-lg font-bold text-[10px] uppercase tracking-widest hover:bg-brand-silver transition-all">Start Batch V4.2</button>
               </div>
            </div>
         </div>
      </div>

    </div>
  </div>
);

// --- MODULE: OS PLANNING ---

const OSPlanningModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'MARKET' | 'USP' | 'KPI'>('MARKET');
  const [isProcessing, setIsProcessing] = useState(false);
  const [uspInput, setUspInput] = useState('');
  const [uspResult, setUspResult] = useState('');
  const [marketLeads, setMarketLeads] = useState<any[]>([]);
  const [kpiData, setKpiData] = useState({ mrr: '50000', reach: '5000', timeline: '30' });
  const [sortMode, setSortMode] = useState<'ROI' | 'SPEED'>('ROI');
  const [creatorMode, setCreatorMode] = useState(true);

  const runMarketScan = async () => {
    setIsProcessing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = creatorMode 
        ? `Act as the REclose Micro-Creator Scout. Target: UAE region (Dubai/Abu Dhabi). Niche: Lifestyle/Tech. Find 5 realistic profiles with 10k-40k followers. 
           Requirements: MUST have contact info (DM/Email), MUST NOT have a shop or heavy ads. 
           Format as JSON array of objects: {handle, followers, city, status: "Alpha" | "Beta", contactPath: "Email" | "DM", arbitragePotential: number (1-10)}. No markdown.`
        : "Generate a list of 5 real or highly realistic UAE companies (Dubai/Abu Dhabi) currently in 'Growth Mode'. Format as JSON array of objects with keys: name, city, niche, signal (e.g. 'Series B Expansion', 'Hiring 10+ devs'). No markdown.";
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      const data = JSON.parse(response.text.replace(/```json|```/g, '').trim());
      setMarketLeads(data);
    } catch (e) {
      setMarketLeads([
        { handle: '@dubai_minimalist', followers: '24.2k', city: 'Dubai', status: 'Alpha', contactPath: 'DM', arbitragePotential: 9 },
        { handle: '@tech_abudhabi', followers: '18.5k', city: 'Abu Dhabi', status: 'Alpha', contactPath: 'Email', arbitragePotential: 8 },
        { handle: '@desert_fitness', followers: '32.1k', city: 'Dubai', status: 'Beta', contactPath: 'DM', arbitragePotential: 7 }
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  const generateUSP = async () => {
    if (!uspInput) return;
    setIsProcessing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze these competitors and my service: "${uspInput}". Craft a high-status, minimalist USP that positions me as a "Shadow Operator" in the micro-creator arbitrage market. Focus on clinical precision and speed. 3 sentences max.`,
      });
      setUspResult(response.text);
    } catch (e) {
      setUspResult("Protocol error. Verify AI bridge.");
    } finally {
      setIsProcessing(false);
    }
  };

  const sortedLeads = [...marketLeads].sort((a, b) => {
    if (sortMode === 'ROI') return b.arbitragePotential - a.arbitragePotential;
    return a.contactPath === 'DM' ? -1 : 1;
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
      {/* Growth Runway Widget */}
      <div className="bg-[#0F1219] border border-white/[0.04] p-8 rounded-[2rem] relative overflow-hidden">
        <div className="flex justify-between items-center relative z-10">
          <div className="flex gap-6 items-center">
            <div className="w-12 h-12 rounded-2xl bg-brand-orange/10 border-brand-orange/20 flex items-center justify-center text-brand-orange">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-[0.3em] mb-1">Phase 1: Foundation (Days 1-30)</h3>
              <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">Targeting: 10k–40k Influence Arbitrage</p>
            </div>
          </div>
          <div className="text-right">
             <div className="text-[9px] font-bold text-gray-600 uppercase tracking-widest mb-1">Creator Outreach Velocity</div>
             <div className="flex items-center gap-4">
               <div className="w-48 h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                  <div className="h-full bg-brand-orange shadow-[0_0_15px_#FF6B2B]" style={{ width: '42%' }}></div>
               </div>
               <span className="text-sm font-mono font-bold text-white">42%</span>
             </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/5 blur-[120px] rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Step-by-Step Tactical Sidebar */}
        <div className="lg:col-span-3 space-y-6">
          <div className="space-y-3">
             <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.4em] px-2">Foundation Stack</h4>
             {[
               { id: 'MARKET', label: '1. Market Analysis', icon: MapPin },
               { id: 'USP', label: '2. USP Neural Engine', icon: BrainCircuit },
               { id: 'KPI', label: '3. KPI Baseline', icon: Target },
             ].map((tab) => (
               <button
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id as any)}
                 className={`w-full p-4 rounded-xl border transition-all text-left flex items-center gap-3 ${activeTab === tab.id ? 'bg-white/[0.04] border-brand-orange/40' : 'border-white/[0.02] hover:border-white/[0.08] text-gray-500'}`}
               >
                 <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-brand-orange' : 'text-gray-600'}`} />
                 <div className="text-xs font-bold uppercase tracking-widest">{tab.label}</div>
               </button>
             ))}
          </div>

          <div className="bg-[#0F1219] border border-white/[0.04] p-6 rounded-2xl">
             <div className="flex justify-between items-center mb-4">
                <h5 className="text-[10px] font-bold text-white uppercase tracking-widest">Next in Queue</h5>
                <span className="flex h-2 w-2 rounded-full bg-brand-orange animate-pulse"></span>
             </div>
             <div className="p-4 bg-brand-surface/50 border border-white/[0.05] rounded-xl flex items-center gap-4 group cursor-pointer hover:border-brand-orange/30 transition-all">
                <div className="w-10 h-10 rounded-full bg-brand-dark flex items-center justify-center border border-white/[0.08]">
                   <Instagram className="w-5 h-5 text-brand-silver/30 group-hover:text-brand-orange transition-colors" />
                </div>
                <div className="flex-1">
                   <div className="text-[11px] font-bold text-white tracking-tight">@dxb_vibe_check</div>
                   <div className="text-[9px] text-brand-orange uppercase font-mono">High Engagement Reel</div>
                </div>
             </div>
          </div>
        </div>

        {/* Tactical Workspace */}
        <div className="lg:col-span-9">
          <div className="bg-[#0F1219] border border-white/[0.04] p-10 rounded-[2.5rem] min-h-[650px] relative overflow-hidden flex flex-col">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
               <Database className="w-40 h-40 text-brand-orange" />
            </div>

            {activeTab === 'MARKET' && (
              <div className="animate-in fade-in slide-in-from-right-4 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-10">
                  <div>
                    <h2 className="text-3xl font-bold text-white tracking-tighter mb-2">ShadowAudit™ Scanner</h2>
                    <p className="text-gray-500 text-sm">Identifying 100+ "Growth Mode" creators in UAE (10k–40k Followers).</p>
                  </div>
                  <div className="flex items-center gap-3 bg-brand-dark/50 p-1.5 rounded-xl border border-white/[0.05]">
                     <button 
                       onClick={() => setCreatorMode(true)}
                       className={`px-4 py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all ${creatorMode ? 'bg-brand-orange text-black' : 'text-gray-500 hover:text-white'}`}
                     >
                       Micro-Creator
                     </button>
                     <button 
                       onClick={() => setCreatorMode(false)}
                       className={`px-4 py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all ${!creatorMode ? 'bg-brand-orange text-black' : 'text-gray-500 hover:text-white'}`}
                     >
                       Company B2B
                     </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                   <div className="md:col-span-2 p-8 bg-brand-surface/30 border border-white/[0.05] rounded-2xl flex flex-col justify-between">
                      <div className="flex gap-12">
                         <div>
                            <div className="text-[9px] font-bold text-gray-600 uppercase tracking-widest mb-1">Follower Bracket</div>
                            <div className="text-lg font-bold text-white">10k — 40k</div>
                         </div>
                         <div>
                            <div className="text-[9px] font-bold text-gray-600 uppercase tracking-widest mb-1">Target Hub</div>
                            <div className="text-lg font-bold text-white">Dubai / Abu Dhabi</div>
                         </div>
                      </div>
                      <button 
                        onClick={runMarketScan}
                        disabled={isProcessing}
                        className="mt-8 py-5 bg-white text-black rounded-xl font-bold text-[10px] uppercase tracking-[0.4em] flex items-center justify-center gap-3 hover:bg-gray-200 transition-all shadow-[0_0_40px_rgba(255,107,43,0.05)]"
                      >
                        {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Sparkles className="w-5 h-5" /> Initialize UAE Scanner</>}
                      </button>
                   </div>
                   <div className="p-8 bg-brand-surface/30 border border-white/[0.05] rounded-2xl flex flex-col justify-center gap-6">
                      <div className="flex justify-between items-center">
                         <span className="text-[9px] font-bold text-gray-600 uppercase">Sort Protocol</span>
                         <ArrowDownNarrowWide className="w-4 h-4 text-gray-700" />
                      </div>
                      <div className="flex flex-col gap-2">
                         <button 
                           onClick={() => setSortMode('ROI')}
                           className={`p-3 rounded-xl border text-[9px] font-bold uppercase tracking-widest transition-all ${sortMode === 'ROI' ? 'border-brand-orange bg-brand-orange/10 text-brand-orange' : 'border-white/5 text-gray-600'}`}
                         >
                           Highest Potential ROI
                         </button>
                         <button 
                           onClick={() => setSortMode('SPEED')}
                           className={`p-3 rounded-xl border text-[9px] font-bold uppercase tracking-widest transition-all ${sortMode === 'SPEED' ? 'border-brand-orange bg-brand-orange/10 text-brand-orange' : 'border-white/5 text-gray-600'}`}
                         >
                           Quickest Close
                         </button>
                      </div>
                   </div>
                </div>

                <div className="flex-1 space-y-4">
                  <div className="flex justify-between items-center mb-6 px-2">
                    <h5 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em]">Found Arbitrage Targets</h5>
                    <span className="text-[9px] font-mono text-gray-700 italic">ShadowAudit™ Cache: {marketLeads.length} Records</span>
                  </div>
                  {marketLeads.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-white/[0.02] rounded-3xl opacity-30">
                       <Database className="w-12 h-12 mb-4" />
                       <div className="text-[10px] uppercase tracking-widest font-mono">No active scan detected.</div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-3">
                      {sortedLeads.map((lead, i) => (
                        <div key={i} className="p-5 bg-white/[0.01] border border-white/[0.04] rounded-xl flex items-center justify-between group hover:border-brand-orange/20 transition-all cursor-crosshair">
                          <div className="flex items-center gap-6">
                             <div className="w-10 h-10 rounded-full bg-brand-dark border border-white/5 flex items-center justify-center text-gray-600">
                                {lead.handle ? <Instagram className="w-5 h-5" /> : lead.name[0]}
                             </div>
                             <div>
                                <div className="text-sm font-bold text-white font-mono">{lead.handle || lead.name}</div>
                                <div className="flex gap-3 mt-1">
                                   <span className="text-[10px] text-gray-600 uppercase tracking-widest">{lead.city}</span>
                                   <span className="text-[10px] text-brand-blue font-bold font-mono">{lead.followers || lead.signal}</span>
                                </div>
                             </div>
                          </div>
                          <div className="flex items-center gap-8">
                             <div className="text-right">
                                <div className={`text-[9px] font-bold px-3 py-1 rounded uppercase tracking-widest mb-1 ${lead.status === 'Alpha' ? 'bg-brand-orange/10 text-brand-orange' : 'bg-brand-blue/10 text-brand-blue'}`}>
                                   {lead.status || 'Verified'}
                                </div>
                                <div className="flex items-center gap-2 justify-end">
                                   {lead.contactPath === 'Email' ? <Mail className="w-3 h-3 text-gray-600" /> : <MessageCircle className="w-3 h-3 text-gray-600" />}
                                   <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">{lead.contactPath || 'Protocol Locked'}</span>
                                </div>
                             </div>
                             <button className="p-3 bg-white/[0.05] border border-white/[0.05] rounded-xl group-hover:bg-brand-orange group-hover:text-black transition-all">
                                <Plus className="w-4 h-4" />
                             </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'USP' && (
              <div className="animate-in fade-in slide-in-from-right-4">
                <div className="mb-10">
                  <h2 className="text-3xl font-bold text-white tracking-tighter mb-2">USP Neural Engine</h2>
                  <p className="text-gray-500 text-sm">Crafting a high-status angle for the Micro-Creator market.</p>
                </div>
                
                <div className="space-y-6">
                   <div className="relative">
                     <label className="block text-[9px] uppercase tracking-[0.4em] text-gray-600 mb-3 font-mono font-bold">Protocol Context (Service + Competitor Flaws)</label>
                     <textarea 
                        value={uspInput}
                        onChange={(e) => setUspInput(e.target.value)}
                        placeholder="e.g. Agency focusing on monetization for 20k followers. Competitors are too expensive and offer generic management."
                        className="w-full bg-black/40 border border-white/[0.05] rounded-2xl p-8 text-sm text-white focus:outline-none focus:border-brand-orange transition-all min-h-[180px] font-mono leading-relaxed"
                     />
                     <div className="absolute bottom-6 right-6 flex items-center gap-2 opacity-30">
                        <span className="text-[10px] font-mono text-gray-500">Processing Node: Gemini 3</span>
                        <BrainCircuit className="w-3 h-3" />
                     </div>
                   </div>

                   <button 
                     onClick={generateUSP}
                     disabled={isProcessing || !uspInput}
                     className="w-full py-6 bg-brand-orange text-black font-bold rounded-2xl hover:bg-brand-orange/80 transition-all flex items-center justify-center gap-4 uppercase tracking-[0.3em] text-xs shadow-[0_0_30px_rgba(255,107,43,0.2)]"
                   >
                     {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Sparkles className="w-5 h-5" /> Execute Neural Synthesis</>}
                   </button>

                   {uspResult && (
                     <div className="mt-12 p-10 bg-brand-surface/80 border border-brand-orange/30 rounded-[2.5rem] relative animate-in zoom-in-95 group">
                        <div className="absolute top-0 left-10 w-20 h-1 bg-brand-orange rounded-full mt-[-2px] shadow-[0_0_15px_#FF6B2B]"></div>
                        <div className="text-[10px] font-bold text-brand-orange uppercase tracking-[0.5em] mb-8 italic flex items-center gap-3">
                           <Zap className="w-3 h-3 fill-brand-orange" /> High-Status Angle Locked
                        </div>
                        <div className="text-2xl font-bold text-white leading-[1.3] italic font-mono tracking-tight">
                           "{uspResult}"
                        </div>
                        <div className="mt-10 pt-10 border-t border-white/[0.04] flex gap-4">
                           <button className="px-8 py-4 bg-white text-black rounded-xl text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-gray-200 transition-all">Lock in Vault</button>
                           <button className="px-8 py-4 text-brand-silver/40 hover:text-white rounded-xl text-[10px] font-bold uppercase tracking-[0.3em]" onClick={() => setUspResult('')}>Re-Simulate</button>
                        </div>
                     </div>
                   )}
                </div>
              </div>
            )}

            {activeTab === 'KPI' && (
              <div className="animate-in fade-in slide-in-from-right-4">
                <div className="mb-10">
                  <h2 className="text-3xl font-bold text-white tracking-tighter mb-2">KPI Baseline Protocol</h2>
                  <p className="text-gray-500 text-sm">Benchmarking the 90-day creator expansion phase.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    { key: 'mrr', label: 'Monthly Revenue ($)', icon: BarChart3, color: 'text-brand-orange' },
                    { key: 'reach', label: 'Influencer Reach', icon: Globe, color: 'text-brand-blue' },
                    { key: 'timeline', label: 'Phase 1 Cycle (Days)', icon: Calendar, color: 'text-brand-purple' },
                  ].map((field) => (
                    <div key={field.key} className="p-8 bg-brand-surface/30 border border-white/[0.05] rounded-[2rem] group hover:border-white/[0.1] transition-all">
                      <field.icon className={`w-6 h-6 mb-6 ${field.color} opacity-50 group-hover:opacity-100 transition-opacity`} />
                      <label className="block text-[9px] uppercase tracking-[0.4em] text-gray-500 mb-2 font-bold">{field.label}</label>
                      <input 
                        type="number"
                        value={kpiData[field.key as keyof typeof kpiData]}
                        onChange={(e) => setKpiData({...kpiData, [field.key]: e.target.value})}
                        className="bg-transparent border-none outline-none text-3xl font-bold text-white w-full tracking-tighter font-mono"
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-12 p-10 bg-brand-blue/5 border border-brand-blue/10 rounded-[2.5rem] flex items-center justify-between group overflow-hidden relative">
                   <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                      <Target className="w-32 h-32 text-brand-blue" />
                   </div>
                   <div className="flex items-center gap-8 relative z-10">
                      <div className="w-16 h-16 rounded-2xl bg-brand-blue/10 flex items-center justify-center text-brand-blue border border-brand-blue/20">
                         <Target className="w-8 h-8" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white uppercase tracking-[0.3em] mb-1">Architecture Sync</div>
                        <div className="text-[10px] text-gray-600 font-mono italic">Phase 1 velocity is mapped to clinical benchmarks.</div>
                      </div>
                   </div>
                   <button className="px-12 py-5 bg-brand-blue text-white rounded-2xl font-bold text-[10px] uppercase tracking-[0.4em] hover:bg-brand-blue/80 transition-all shadow-[0_0_40px_rgba(59,130,246,0.3)] relative z-10">
                      Lock Baseline
                   </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

// --- MODULE: COMMAND CENTER ---

const CommandCenterModule: React.FC<{ leads: any[], isScanning: boolean, onScan: () => void }> = ({ leads, isScanning, onScan }) => (
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
    <div className="lg:col-span-8 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <DashboardStatCard label="Total Leads" value="12,482" trend="+14%" icon={Globe} color="bg-brand-blue" />
        <DashboardStatCard label="Growth Mode Found" value="843" trend="+22%" icon={Rocket} color="bg-green-500" />
        <DashboardStatCard label="Conversion Rate" value="4.8%" trend="-0.2%" icon={Percent} color="bg-brand-orange" isPositive={false} />
        <div className="bg-[#0F1219] border border-brand-blue/30 p-6 rounded-[1.2rem] relative overflow-hidden group shadow-[0_0_40px_rgba(59,130,246,0.1)] h-[140px] flex flex-col justify-between">
          <div className="space-y-1">
            <div className="text-[10px] font-bold text-brand-blue uppercase tracking-widest">System Status</div>
            <div className="text-2xl font-bold text-white tracking-tighter">AI Online</div>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">Processing Data</span>
          </div>
        </div>
      </div>

      <div className="bg-[#0F1219] border border-white/[0.04] p-8 rounded-[1.5rem] relative">
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-brand-orange/10 border border-brand-orange/20 flex items-center justify-center text-brand-orange">
              <Zap className="w-5 h-5 fill-brand-orange" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">ShadowAudit™ Protocol</h2>
          </div>
          <div className="px-3 py-1 rounded-md bg-brand-orange/10 border border-brand-orange/30 text-[9px] font-bold text-brand-orange uppercase tracking-widest">Active Scan</div>
        </div>
        <div className="space-y-8">
          {[
            { label: 'Competitor Keyword Mapping', value: 84 },
            { label: 'Market Gap Analysis', value: 42, sub: 'Analyzing 2,034 data points...' },
            { label: 'Sentiment Decoding', value: 12 },
          ].map((item, idx) => (
            <div key={idx}>
              <div className="flex justify-between items-end mb-3 text-xs font-semibold text-gray-300">
                <span>{item.label}</span>
                <span className="text-brand-orange">{item.value}%</span>
              </div>
              <div className="h-1.5 w-full bg-white/[0.03] rounded-full overflow-hidden">
                <div className="h-full bg-brand-orange" style={{ width: `${item.value}%` }}></div>
              </div>
              {item.sub && <div className="mt-2 text-[10px] font-mono text-gray-600 italic">{item.sub}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="lg:col-span-4">
      <div className="bg-[#0F1219] border border-white/[0.04] rounded-[1.5rem] h-full flex flex-col min-h-[600px]">
        <div className="p-8 pb-4 border-b border-white/[0.04] flex justify-between items-center">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest">Live Lead Feed</h3>
          <button onClick={onScan} className="text-[10px] font-bold text-brand-blue uppercase hover:text-white transition-colors">
            {isScanning ? 'Scanning...' : 'Refresh'}
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
          {leads.map((lead, idx) => (
            <div key={idx} className="py-6 border-b border-white/[0.03] last:border-0 group cursor-pointer hover:bg-white/[0.01] transition-colors rounded-xl px-2">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[9px] font-bold text-gray-600 uppercase">{lead.time}</span>
                <span className={`px-2 py-0.5 rounded-[4px] text-[8px] font-bold ${lead.tag === 'HOT' ? 'bg-brand-blue/10 text-brand-blue' : 'bg-green-500/10 text-green-500'}`}>
                  {lead.tag}
                </span>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#161922] border border-white/[0.05] flex items-center justify-center text-[10px] font-bold text-gray-500 uppercase">{lead.initials}</div>
                <div>
                  <div className="text-sm font-bold text-white">{lead.company}</div>
                  <div className="text-[10px] text-gray-600 uppercase">{lead.location}</div>
                  <div className="mt-2 text-[10px] font-mono"><span className="text-green-500 italic">Detected:</span> <span className="text-gray-400">{lead.detected}</span></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// --- MODULE: LEAD VAULT ---

const LeadVaultModule: React.FC = () => (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-3xl font-bold text-white tracking-tight">The Lead Vault</h2>
        <p className="text-gray-500 text-sm">Central database for "Unused Lists" and Sentiment Decoding.</p>
      </div>
      <div className="flex gap-4">
        <button className="px-6 py-3 bg-white text-black rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2">
          <Plus className="w-4 h-4" /> Import List
        </button>
        <button className="px-6 py-3 bg-brand-surface border border-white/[0.05] text-white rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2">
          <Filter className="w-4 h-4" /> Filter
        </button>
      </div>
    </div>

    <div className="bg-[#0F1219] border border-white/[0.04] rounded-[1.5rem] overflow-hidden">
      <div className="p-8 border-b border-white/[0.04] flex items-center gap-8">
        {['The Cold Deck', 'Sentimental Queue', 'High Score Targets'].map((tab, i) => (
          <button key={tab} className={`text-xs font-bold uppercase tracking-widest ${i === 0 ? 'text-brand-orange border-b-2 border-brand-orange pb-2' : 'text-gray-600'}`}>
            {tab}
          </button>
        ))}
      </div>
      <table className="w-full text-left border-collapse">
        <thead className="bg-white/[0.01] border-b border-white/[0.04]">
          <tr>
            <th className="p-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Target Company</th>
            <th className="p-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Growth Score</th>
            <th className="p-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Detected Signals</th>
            <th className="p-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Sentiment</th>
            <th className="p-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.02]">
          {[
            { company: 'MetaFlow Systems', score: 94, signals: 'Hiring 5+ Senior Roles', sentiment: 'GROWTH MODE', initials: 'MS' },
            { company: 'Quantize Labs', score: 88, signals: 'Series C Expansion', sentiment: 'STABLE', initials: 'QL' },
            { company: 'HyperScale AI', score: 92, signals: 'New CTO Appointment', sentiment: 'CRITICAL INTENT', initials: 'HA' },
            { company: 'Nexus Digital', score: 76, signals: 'Tech Stack Upgrade', sentiment: 'WARM', initials: 'ND' },
            { company: 'Vertex Solutions', score: 81, signals: 'Domain Repurchase', sentiment: 'RECOGNIZED', initials: 'VS' },
          ].map((row, i) => (
            <tr key={i} className="hover:bg-white/[0.01] transition-colors group">
              <td className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-[#161922] border border-white/[0.05] flex items-center justify-center text-[10px] font-bold text-gray-500 uppercase">{row.initials}</div>
                  <span className="text-sm font-bold text-white">{row.company}</span>
                </div>
              </td>
              <td className="p-6">
                <div className="flex items-center gap-2">
                  <div className="w-24 h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                    <div className="h-full bg-brand-blue" style={{ width: `${row.score}%` }}></div>
                  </div>
                  <span className="text-[10px] font-mono text-brand-blue font-bold">{row.score}</span>
                </div>
              </td>
              <td className="p-6 text-[11px] text-gray-500 font-medium">{row.signals}</td>
              <td className="p-6">
                <span className={`px-2 py-1 rounded text-[9px] font-bold uppercase tracking-widest ${row.sentiment.includes('GROWTH') || row.sentiment.includes('CRITICAL') ? 'bg-brand-orange/10 text-brand-orange' : 'bg-brand-blue/10 text-brand-blue'}`}>
                  {row.sentiment}
                </span>
              </td>
              <td className="p-6">
                <button className="p-2 rounded-lg hover:bg-white/5 text-gray-600 hover:text-white transition-colors">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="p-6 bg-white/[0.01] border-t border-white/[0.04] flex justify-center">
        <button className="text-[10px] font-bold text-gray-600 uppercase tracking-widest hover:text-white transition-colors">Load More Records</button>
      </div>
    </div>
  </div>
);

// --- MAIN DASHBOARD SHELL ---

const Dashboard: React.FC = () => {
  const { user, logout, activeDashboardModule, setActiveDashboardModule } = useAppContext();
  const [isScanning, setIsScanning] = useState(false);
  const [leads, setLeads] = useState([
    { time: '12:04:22 PM', company: 'TechCorp Solutions', location: 'San Francisco, CA', tag: 'HOT' as const, detected: 'Hiring surge in Sales Dept.', initials: 'TC' },
    { time: '12:01:05 PM', company: 'Alpha Logistics', location: 'Austin, TX', tag: 'WARM' as const, detected: 'Series B Funding Announcement', initials: 'AL' },
    { time: '11:58:30 AM', company: 'Nova Retail Group', location: 'New York, NY', tag: 'WARM' as const, detected: 'Website Redesign Detected', initials: 'NV' },
    { time: '11:45:12 AM', company: 'BlueDoor Real Estate', location: 'Miami, FL', tag: 'HOT' as const, detected: 'High engagement on LinkedIn', initials: 'BD' },
  ]);

  const initScan = async () => {
    setIsScanning(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: "Generate one realistic high-ticket B2B company lead for an AI agency. Return ONLY a JSON object with: company, location, tag (HOT or WARM), detected (a growth signal like 'New CTO appointed' or 'Expanding to UK'), initials. No markdown.",
      });
      
      const text = response.text.replace(/```json|```/g, '').trim();
      const newLead = JSON.parse(text);
      setLeads(prev => [{ ...newLead, time: new Date().toLocaleTimeString() }, ...prev].slice(0, 8));
    } catch (e) {
      console.error("Scan Error", e);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090D] flex flex-col font-sans selection:bg-brand-blue/30 overflow-hidden">
      {/* Precision Top Navigation */}
      <header className="h-[72px] border-b border-white/[0.04] flex items-center justify-between px-10 bg-[#07090D] z-50">
        <div className="flex items-center gap-12">
          <a href="#" onClick={(e) => { e.preventDefault(); setActiveDashboardModule('COMMAND'); }} className="flex items-center group">
            <Logo size="sm" showText={true} className="scale-75 origin-left" />
          </a>
          <nav className="hidden lg:flex items-center gap-1">
            {[
              { id: 'COMMAND', label: 'Command', icon: Activity },
              { id: 'PLANNING', label: 'Phase 1', icon: Layout },
              { id: 'OUTREACH', label: 'Outreach', icon: Send },
              { id: 'LIBRARY', label: 'Assets', icon: Library },
              { id: 'REVENUE', label: 'Engine', icon: Cpu },
              { id: 'VAULT', label: 'Vault', icon: Database },
            ].map(module => (
              <button 
                key={module.id} 
                onClick={() => setActiveDashboardModule(module.id as DashboardModule)}
                className={`flex items-center gap-3 px-5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeDashboardModule === module.id ? 'bg-white/[0.04] text-white' : 'text-gray-500 hover:text-white'}`}
              >
                <module.icon className={`w-3.5 h-3.5 ${activeDashboardModule === module.id ? 'text-brand-orange' : 'text-gray-600'}`} />
                {module.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-6">
          <div className="relative cursor-pointer group p-2">
            <Bell className="w-[18px] h-[18px] text-gray-500 group-hover:text-white transition-colors" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-brand-orange rounded-full border border-[#07090D]"></span>
          </div>
          
          <div className="flex items-center gap-4 pl-6 border-l border-white/[0.04]">
            <div className="text-right">
              <div className="text-[10px] font-bold text-gray-600 uppercase tracking-widest leading-none mb-1">Welcome back,</div>
              <div className="text-[12px] font-bold text-brand-blue uppercase tracking-tight">{user?.name || "Alex Reynolds"}</div>
            </div>
            <div className="w-10 h-10 rounded-full border border-white/[0.08] bg-[#000000] flex items-center justify-center overflow-hidden relative">
              {user?.name === 'HPF Executive' ? (
                <GoldCrownIcon />
              ) : (
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'Alex'}`} alt="User" className="w-full h-full object-cover" />
              )}
            </div>
            <button onClick={logout} className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-600">
               <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main tactical area */}
      <main className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto px-10 py-10 scroll-smooth custom-scrollbar">
          <div className="max-w-[1700px] mx-auto h-full">
            {activeDashboardModule === 'COMMAND' && <CommandCenterModule leads={leads} isScanning={isScanning} onScan={initScan} />}
            {activeDashboardModule === 'VAULT' && <LeadVaultModule />}
            {activeDashboardModule === 'PLANNING' && <OSPlanningModule />}
            {activeDashboardModule === 'OUTREACH' && <OutreachLedgerModule />}
            {activeDashboardModule === 'LIBRARY' && <AssetLibraryModule />}
            {activeDashboardModule === 'REVENUE' && <RevenueEngineModule />}
          </div>
        </div>
      </main>

      {/* Footer System Status Bar */}
      <footer className="h-8 bg-[#0F1219] border-t border-white/[0.04] px-10 flex items-center justify-between text-[9px] font-mono text-gray-600 uppercase tracking-[0.3em]">
        <div className="flex items-center gap-6">
           <span>RECLOSE. PART OF THE HPF&CO FAMILY AND B2 COMPANIES. // COMMAND CENTER V4.2.0</span>
           <span className="text-gray-800">|</span>
           <span className="text-green-500/60 font-bold">Latency: 0.00ms</span>
        </div>
        <div className="flex items-center gap-4">
           <span>Encrypted Session</span>
           <span className="text-gray-800">|</span>
           <span>HPF DECRYPTION ACTIVE</span>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
