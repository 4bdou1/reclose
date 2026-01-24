
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { api } from '../../lib/api';
import { UserRole } from '../../lib/types';
import { ArrowLeft, Loader2, Zap, ShieldCheck, Lock } from 'lucide-react';
import Logo from '../Logo';

const AuthScreen: React.FC = () => {
  const { setView, setUser, selectedTier, setSelectedTier, isDiscountActive, setIsDiscountActive } = useAppContext();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [promoInput, setPromoInput] = useState('');
  const [memberInput, setMemberInput] = useState('');

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>(selectedTier || 'Shadow');

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
        const { user } = await api.auth.register({ 
          name, 
          email, 
          role, 
          password, 
          credits: baseCredits 
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

  const handleVerifyMember = async () => {
    setError('');
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1200));

    if (memberInput === 'ANABDOUL4BC') {
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

  return (
    <div className="min-h-screen flex items-center justify-center relative px-4 py-20 bg-brand-dark overflow-hidden font-sans">
      {/* Background Ambience */}
      <div className="absolute inset-0 industrial-grid opacity-10 z-0 pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(197,160,89,0.03)_0%,transparent_70%)] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-[480px] animate-in fade-in slide-in-from-bottom-8 duration-1000">
        
        {/* Navigation / Exit */}
        <button 
          onClick={() => { setView('landing'); setSelectedTier(null); }}
          className="mb-8 flex items-center gap-3 text-gray-600 hover:text-white transition-all group font-mono text-[9px] uppercase tracking-[0.4em] font-black"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Exit Initialization
        </button>

        {/* PRIMARY AUTH CARD */}
        <div className="bg-[#0A0A0F]/90 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-10 md:p-14 shadow-[0_40px_120px_rgba(0,0,0,0.7)]">
          {/* Branding & Header */}
          <div className="flex flex-col items-center text-center mb-10">
            <Logo size="sm" showText={true} className="mb-8" />
            <h1 className="text-3xl font-black uppercase tracking-[0.1em] text-white mb-2">
              {isLogin ? 'Welcome Back' : 'Create Your Account'}
            </h1>
            <p className="text-gray-600 text-[10px] font-mono uppercase tracking-[0.2em] italic">
              {isLogin ? 'Sign in to access your account' : 'Initialize your operator signature'}
            </p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-500/5 border border-red-500/20 text-red-500 text-[10px] font-mono uppercase rounded-xl flex items-center gap-3 animate-in shake-in">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
              [SYSTEM_FAIL] {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-7">
            {!isLogin && (
              <div className="space-y-6 animate-in fade-in duration-500">
                <div>
                  <label className="block text-[9px] uppercase tracking-[0.4em] text-gray-600 mb-2.5 font-mono font-black">Operator Identity</label>
                  <input
                    type="text"
                    required
                    placeholder="ENTER FULL NAME"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-black/50 border border-white/5 rounded-xl p-4 text-white focus:border-brand-orange/40 focus:outline-none transition-all text-sm placeholder:text-gray-800 font-mono"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[9px] uppercase tracking-[0.4em] text-gray-600 mb-2.5 font-mono font-black">Email Address</label>
              <input
                type="email"
                required
                placeholder="ID@RECLOSE.IO"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/50 border border-white/5 rounded-xl p-4 text-white focus:border-white/20 focus:outline-none transition-all text-sm placeholder:text-gray-800 font-mono"
              />
            </div>

            <div>
              <label className="block text-[9px] uppercase tracking-[0.4em] text-gray-600 mb-2.5 font-mono font-black">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/50 border border-white/5 rounded-xl p-4 text-white focus:border-white/20 focus:outline-none transition-all text-sm placeholder:text-gray-800 font-mono"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-5 bg-white text-black font-black rounded-xl hover:bg-brand-silver transition-all flex items-center justify-center gap-3 active:scale-[0.98] shadow-2xl group"
              >
                {isLoading && !memberInput ? (
                  <Loader2 className="animate-spin w-5 h-5" />
                ) : (
                  <>
                    <span className="uppercase tracking-[0.25em] text-[11px]">Continue</span>
                    <Zap className="w-4 h-4 fill-black" />
                  </>
                )}
              </button>
            </div>

            {/* Toggle Link - Moved inside card per request */}
            <div className="text-center pt-4">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setMemberInput('');
                  setError('');
                }}
                className="text-[9px] font-mono font-black uppercase text-gray-600 hover:text-white transition-all tracking-[0.3em] group"
              >
                {isLogin ? "> Request New Operator Access" : "> Existing Signature Detected"}
              </button>
            </div>
          </form>
        </div>

        {/* Divider */}
        <div className="py-12 flex items-center gap-6">
          <div className="h-[0.5px] flex-1 bg-white/5"></div>
          <span className="text-[10px] font-mono text-gray-700 uppercase tracking-[0.4em] font-black">OR</span>
          <div className="h-[0.5px] flex-1 bg-white/5"></div>
        </div>

        {/* Member Clearance Section */}
        <div className="bg-[#C5A059]/5 border border-[#C5A059]/10 rounded-[2.5rem] p-10 space-y-6">
          <div className="flex items-center gap-3 text-[#C5A059] font-mono font-black text-[9px] uppercase tracking-[0.4em]">
            <ShieldCheck className="w-4 h-4" /> HPF & Co Member Clearance
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C5A059]/30" />
              <input
                type="password"
                placeholder="CLEARANCE KEY"
                value={memberInput}
                onChange={(e) => setMemberInput(e.target.value)}
                className="w-full bg-brand-dark border border-[#C5A059]/20 rounded-xl py-4 pl-14 pr-4 text-[#C5A059] focus:border-[#C5A059] focus:outline-none transition-all text-[11px] placeholder:text-[#C5A059]/20 font-mono"
              />
            </div>
            <button 
              type="button"
              onClick={handleVerifyMember}
              disabled={isLoading}
              className="px-8 py-4 bg-[#C5A059] text-black rounded-xl font-black text-[10px] uppercase tracking-[0.15em] hover:brightness-110 active:scale-95 transition-all shadow-lg"
            >
              {isLoading && memberInput ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Grant Access'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
