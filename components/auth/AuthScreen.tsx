
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { api } from '../../lib/api';
import { UserRole } from '../../lib/types';
import { ArrowLeft, Loader2, Zap, CheckCircle2, Ticket, ShieldCheck, Globe, Cpu, Award, Lock } from 'lucide-react';
import Logo from '../Logo';

const AuthScreen: React.FC = () => {
  const { setView, setUser, selectedTier, setSelectedTier, isDiscountActive, setIsDiscountActive } = useAppContext();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [promoInput, setPromoInput] = useState('');
  const [memberInput, setMemberInput] = useState('');
  const [isMemberVerified, setIsMemberVerified] = useState(false);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>(selectedTier || 'Shadow');

  useEffect(() => {
    const handleModeSwitch = (e: any) => {
      if (e.detail === 'register') setIsLogin(false);
    };
    window.addEventListener('auth_view_mode', handleModeSwitch);
    return () => window.removeEventListener('auth_view_mode', handleModeSwitch);
  }, []);

  // Sync internal role with selectedTier
  useEffect(() => {
    if (selectedTier) setRole(selectedTier);
  }, [selectedTier]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        const { user } = await api.auth.login(email, password);
        setUser(user);
      } else {
        const baseCredits = role === 'Shadow' ? 500 : role === 'Operator' ? 2500 : 10000;
        const finalCredits = isMemberVerified ? 999999 : baseCredits;
        const { user } = await api.auth.register({ 
          name, 
          email, 
          role: isMemberVerified ? 'Admin' : role, 
          password, 
          credits: finalCredits 
        });
        setUser(user);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyPromo = () => {
    if (promoInput.toUpperCase() === 'HPF01') {
      setIsDiscountActive(true);
      setError('');
    } else {
      setError('INVALID PROTOCOL CODE');
    }
  };

  const handleVerifyAndLogin = async () => {
    setError('');
    setIsLoading(true);
    
    // Simulate some verification delay
    await new Promise(r => setTimeout(r, 1200));

    if (memberInput === 'ANABDOUL4BC') {
      // Direct login as Admin for HPF members
      const mockAdmin = {
        id: 'hpf-member-' + Date.now(),
        name: 'HPF Executive',
        email: 'member@hpf.co',
        role: 'Admin' as UserRole,
        credits: 999999
      };
      setUser(mockAdmin);
    } else {
      setError('INVALID MEMBER CLEARANCE KEY');
      setIsLoading(false);
    }
  };

  const handleVerifyMemberToggle = () => {
    if (memberInput === 'ANABDOUL4BC') {
      setIsMemberVerified(true);
      setError('');
    } else {
      setIsMemberVerified(false);
      setError('INVALID MEMBER CLEARANCE');
    }
  };

  const getTierPrice = (r: UserRole) => {
    if (isMemberVerified) return 0;
    const prices = { Shadow: 97, Operator: 297, Architect: 997, Admin: 0 };
    const base = prices[r];
    return isDiscountActive ? Math.floor(base * 0.65) : base;
  };

  const manifestDetails = {
    Shadow: ["500 ShadowAudit™ Scans", "Basic Outreach Protocols", "Single Integration Hub", "Standard Speed"],
    Operator: ["2,500 ShadowAudit™ Scans", "Full Business OS Kit", "Multi-Channel Automation", "ShadowSync API Access"],
    Architect: ["Unlimited Audit Access", "White-Label Dashboard", "Custom Agent Logic", "Dedicated Growth Architect"]
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative px-4 py-12 md:py-20 bg-brand-dark overflow-hidden">
      {/* Background Matrix */}
      <div className="absolute inset-0 industrial-grid opacity-20 z-0 pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,107,43,0.05)_0%,transparent_70%)] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-0 shadow-2xl rounded-3xl overflow-hidden border border-brand-border">
        
        {/* Left Side: System Manifest (Checkout Details) */}
        <div className="lg:col-span-5 bg-brand-surface/80 backdrop-blur-xl p-8 md:p-12 flex flex-col border-r border-brand-border relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-flight opacity-50"></div>
          
          <button 
            onClick={() => { setView('landing'); setSelectedTier(null); }}
            className="mb-12 flex items-center gap-2 text-gray-500 hover:text-white transition-colors group w-fit font-mono text-[10px] uppercase tracking-widest"
          >
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" /> Exit Initialization
          </button>

          <div className="flex-1">
            <div className="mb-8">
               <span className="font-mono text-brand-orange text-[10px] uppercase tracking-[0.4em] mb-2 block animate-pulse">Session Active</span>
               <h2 className="text-3xl font-bold uppercase tracking-tight text-white">System <span className="italic text-gray-500">Manifest</span></h2>
            </div>

            <div className="space-y-8">
              {/* Active Tier Display */}
              <div className="p-6 bg-brand-dark/50 border border-brand-border rounded-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Cpu className="w-16 h-16 text-brand-orange" />
                 </div>
                 <div className="relative z-10">
                    <div className="text-[10px] font-mono text-gray-500 uppercase mb-1">Target Protocol</div>
                    <div className="text-2xl font-bold text-brand-orange uppercase tracking-widest">{isMemberVerified ? 'HPF MEMBER' : role}</div>
                    <div className="mt-4 space-y-2">
                       {(isMemberVerified ? ["Full HQ Access", "Unlimited Scans", "Admin Privileges"] : manifestDetails[role as keyof typeof manifestDetails])?.map((item, idx) => (
                         <div key={idx} className="flex items-center gap-2 text-xs text-gray-400">
                           <CheckCircle2 className="w-3 h-3 text-brand-orange/50" />
                           {item}
                         </div>
                       ))}
                    </div>
                 </div>
              </div>

              {/* Status Modules */}
              <div className="grid grid-cols-2 gap-4">
                 <div className="p-4 border border-brand-border rounded-xl bg-brand-dark/30">
                    <Globe className="w-4 h-4 text-brand-blue mb-2" />
                    <div className="text-[8px] font-mono text-gray-500 uppercase">Latency</div>
                    <div className="text-xs font-bold text-white">0ms Response</div>
                 </div>
                 <div className="p-4 border border-brand-border rounded-xl bg-brand-dark/30">
                    <ShieldCheck className="w-4 h-4 text-green-500 mb-2" />
                    <div className="text-[8px] font-mono text-gray-500 uppercase">Security</div>
                    <div className="text-xs font-bold text-white">Encrypted</div>
                 </div>
              </div>
            </div>
          </div>

          {/* Pricing Breakdown */}
          <div className="mt-12 pt-8 border-t border-brand-border">
            <div className="flex justify-between items-end mb-2">
               <span className="text-gray-500 font-mono text-[10px] uppercase tracking-[0.2em]">Deployment Cost</span>
               <div className="text-right">
                  {(isDiscountActive || isMemberVerified) && !isMemberVerified && (
                    <div className="text-xs text-gray-500 line-through mb-[-2px]">$ {role === 'Shadow' ? 97 : role === 'Operator' ? 297 : 997}</div>
                  )}
                  <div className="text-5xl font-bold text-white tracking-tighter transition-all">
                    ${getTierPrice(role)}
                    <span className="text-sm text-gray-500 font-normal ml-1">/mo</span>
                  </div>
               </div>
            </div>
            {isDiscountActive && !isMemberVerified && (
               <div className="text-[10px] font-mono text-brand-orange flex items-center gap-2 italic justify-end">
                  <Zap className="w-3 h-3 fill-brand-orange" /> HPF01 APPLIED: 35% OFF
               </div>
            )}
            {isMemberVerified && (
               <div className="text-[10px] font-mono text-[#C5A059] flex items-center gap-2 italic justify-end uppercase tracking-widest">
                  <Award className="w-3 h-3 fill-[#C5A059]" /> HPF&Co Family Clearance Verified
               </div>
            )}
          </div>
        </div>

        {/* Right Side: Deployment Interface (Form) */}
        <div className="lg:col-span-7 bg-brand-dark p-8 md:p-12 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <div className="text-center lg:text-left mb-10">
               <Logo size="sm" className="mb-6 lg:items-start" />
               <h3 className="text-xl font-bold uppercase tracking-widest text-white">{isLogin ? 'Welcome back' : 'Initialize Operator'}</h3>
               <p className="text-gray-500 text-xs mt-2 font-mono italic uppercase tracking-wider">
                 {isLogin ? 'Sign in to access your account' : 'Select tier and configure neural identifier'}
               </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/5 border border-red-500/20 text-red-500 text-[10px] font-mono uppercase rounded animate-in shake-in flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                [STATUS FAIL] {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <>
                  <div className="animate-in fade-in slide-in-from-top-2">
                    <label className="block text-[8px] uppercase tracking-[0.4em] text-gray-600 mb-2 font-mono font-bold">Operator Signature</label>
                    <input
                      type="text"
                      required
                      placeholder="FULL LEGAL IDENTITY"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-brand-surface border border-brand-border rounded-xl p-4 text-white focus:border-brand-orange focus:outline-none transition-all text-sm placeholder:text-gray-800 font-mono shadow-inner"
                    />
                  </div>

                  {!isMemberVerified && (
                    <div className="animate-in fade-in slide-in-from-top-2 delay-75">
                      <label className="block text-[8px] uppercase tracking-[0.4em] text-gray-600 mb-2 font-mono font-bold">Shadow Level Select</label>
                      <div className="grid grid-cols-3 gap-3">
                        {(['Shadow', 'Operator', 'Architect'] as UserRole[]).map((r) => (
                          <button
                            key={r}
                            type="button"
                            onClick={() => {setRole(r); setSelectedTier(r);}}
                            className={`py-3 px-2 text-[10px] font-bold rounded-xl border transition-all uppercase tracking-[0.2em] relative group ${role === r ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.1)]' : 'bg-brand-surface border-brand-border text-gray-600 hover:border-gray-500'}`}
                          >
                            {role === r && <Zap className="w-3 h-3 absolute top-1 right-1 fill-black" />}
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              <div className="animate-in fade-in slide-in-from-top-2 delay-100">
                <label className="block text-[8px] uppercase tracking-[0.4em] text-gray-600 mb-2 font-mono font-bold">EMAIL ADDRESS</label>
                <input
                  type="email"
                  required
                  placeholder="ID@RECLOSE.IO"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-brand-surface border border-brand-border rounded-xl p-4 text-white focus:border-brand-orange focus:outline-none transition-all text-sm placeholder:text-gray-800 font-mono shadow-inner"
                />
              </div>

              <div className="animate-in fade-in slide-in-from-top-2 delay-150">
                <label className="block text-[8px] uppercase tracking-[0.4em] text-gray-600 mb-2 font-mono font-bold">PASSWORD</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-brand-surface border border-brand-border rounded-xl p-4 text-white focus:border-brand-orange focus:outline-none transition-all text-sm placeholder:text-gray-800 font-mono shadow-inner"
                />
              </div>

              {/* Action Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-5 bg-white text-black font-bold rounded-2xl hover:bg-gray-200 transition-all mt-6 flex items-center justify-center gap-3 shadow-[0_20px_50px_rgba(255,255,255,0.05)] active:scale-95 group relative overflow-hidden"
              >
                {isLoading && !memberInput ? (
                  <Loader2 className="animate-spin w-5 h-5" />
                ) : (
                  <>
                    <span className="relative z-10 uppercase tracking-widest">{isLogin ? 'Execute Authentication' : 'Initiate Deployment'}</span>
                    <Zap className="w-4 h-4 group-hover:fill-current relative z-10" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-orange/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  </>
                )}
              </button>

              {/* HPF Member Login Area (Divider + Gold Option) */}
              <div className="py-6 flex items-center gap-4">
                <div className="h-px flex-1 bg-brand-border"></div>
                <span className="text-[9px] font-mono text-gray-600 uppercase tracking-widest">OR</span>
                <div className="h-px flex-1 bg-brand-border"></div>
              </div>

              <div className="animate-in fade-in slide-in-from-top-2 delay-200">
                <div className="bg-[#C5A059]/5 border border-[#C5A059]/10 rounded-2xl p-6 relative group overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#C5A059]/5 blur-2xl rounded-full"></div>
                  
                  <label className="block text-[9px] uppercase tracking-[0.4em] text-[#C5A059] mb-4 font-mono font-bold flex items-center gap-2">
                    <Award className="w-3 h-3" /> HPF&Co Member Clearance
                  </label>
                  
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#C5A059]/40" />
                      <input
                        type="password"
                        placeholder="MEMBER CLEARANCE KEY"
                        value={memberInput}
                        onChange={(e) => setMemberInput(e.target.value)}
                        className="w-full bg-brand-surface border border-[#C5A059]/20 rounded-xl py-4 pl-10 pr-4 text-[#C5A059] focus:border-[#C5A059] focus:outline-none transition-all text-sm placeholder:text-[#C5A059]/30 font-mono shadow-inner"
                      />
                    </div>
                    <button 
                      type="button" 
                      onClick={isLogin ? handleVerifyAndLogin : handleVerifyMemberToggle}
                      disabled={isLoading}
                      className="px-6 bg-[#C5A059] text-black rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-[#C5A059]/80 transition-all flex items-center justify-center min-w-[100px]"
                    >
                      {isLoading && memberInput ? <Loader2 className="w-4 h-4 animate-spin" /> : (isLogin ? 'Grant Access' : 'Verify')}
                    </button>
                  </div>
                </div>
              </div>

              {/* Promo Code (Only on Register) */}
              {!isLogin && !isMemberVerified && (
                <div className="mt-8 pt-8 border-t border-brand-border animate-in fade-in">
                  <label className="block text-[8px] uppercase tracking-[0.4em] text-gray-600 mb-2 font-mono font-bold">Protocol Voucher</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="REDEEM CODE"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="flex-1 bg-brand-surface border border-brand-border rounded-xl p-4 text-white focus:border-brand-orange focus:outline-none transition-all text-sm placeholder:text-gray-800 font-mono shadow-inner"
                    />
                    <button 
                      type="button" 
                      onClick={handleApplyPromo}
                      className="px-6 bg-brand-surface border border-brand-border text-gray-400 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:text-white transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </form>

            <div className="mt-12 text-center">
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setMemberInput('');
                  setIsMemberVerified(false);
                  setError('');
                }}
                className="text-[10px] font-mono uppercase text-gray-600 hover:text-brand-orange transition-colors tracking-[0.3em]"
              >
                {isLogin ? "> Request New Operator Access" : "> Existing Signature Detected"}
              </button>
            </div>
            
            <div className="mt-12 flex items-center justify-center gap-8 opacity-20 grayscale hover:grayscale-0 transition-all duration-700">
               <ShieldCheck className="w-5 h-5" />
               <Ticket className="w-5 h-5" />
               <Zap className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
