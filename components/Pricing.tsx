
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ArrowRight, Zap, Ticket, Shield } from 'lucide-react';
import Reveal from './Reveal';
import { UserRole } from '../lib/types';

const PricingCard: React.FC<{
  tier: UserRole;
  price: number;
  discountedPrice: number;
  isDiscounted: boolean;
  description: string;
  features: string[];
  highlight?: boolean;
  credits: string;
  onSelect: (tier: UserRole) => void;
}> = ({ tier, price, discountedPrice, isDiscounted, description, features, highlight, credits, onSelect }) => (
  <div className={`group relative p-10 rounded-[2.5rem] flex flex-col transition-all duration-700 cyber-glass-light tactile-btn ${highlight ? 'border-brand-orange/40 ring-1 ring-brand-orange/20 shadow-[0_0_60px_rgba(255,107,43,0.1)]' : 'border-slate-200'}`}>

    {highlight && (
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-orange/5 blur-3xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity"></div>
    )}

    <div className="flex justify-between items-start mb-10">
      <div>
        <h3 className={`text-xl font-bold mb-3 uppercase tracking-widest font-tech ${highlight ? 'text-brand-orange' : 'text-slate-900'}`}>{tier}</h3>
        <p className="text-slate-500 text-[10px] font-tech uppercase tracking-[0.1em] leading-relaxed max-w-[180px]">{description}</p>
      </div>
      {highlight && (
        <div className="p-2 rounded-xl bg-brand-orange/10 border border-brand-orange/20">
          <Shield className="w-5 h-5 text-brand-orange" />
        </div>
      )}
    </div>

    <div className="mb-12 text-left">
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-slate-400">$</span>
        <div className="flex flex-col">
          {isDiscounted && (
            <span className="text-sm text-slate-400 line-through mb-[-4px]">$ {price}</span>
          )}
          <span className={`text-7xl font-bold tracking-tighter ${isDiscounted ? 'text-brand-orange' : 'text-slate-900'}`}>
            {isDiscounted ? Math.floor(discountedPrice) : price}
          </span>
        </div>
        <span className="text-slate-400 text-sm font-mono italic">/mo</span>
      </div>
      <div className="mt-6 inline-flex items-center gap-3 px-3 py-1.5 rounded-xl bg-white border border-slate-200">
        <Zap className="w-3.5 h-3.5 text-brand-orange fill-brand-orange" />
        <span className="text-[10px] font-mono text-slate-600 uppercase tracking-[0.3em] font-bold">{credits} Credits Unlocked</span>
      </div>
    </div>

    <ul className="space-y-6 mb-12 flex-1">
      {features.map((f, i) => (
        <li key={i} className="flex items-start gap-4 text-xs font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
          <Check className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
          {f}
        </li>
      ))}
    </ul>

    <button
      onClick={() => onSelect(tier)}
      className={`w-full py-5 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 shadow-2xl relative overflow-hidden group/btn ${highlight ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-slate-50 border border-slate-200 text-slate-900 hover:border-slate-300'}`}
    >
      <span className="relative z-10 uppercase tracking-widest">Initialize {tier}</span>
      <ArrowRight className="w-5 h-5 relative z-10 group-hover/btn:translate-x-1 transition-transform" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-orange/5 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
    </button>
  </div>
);

const Pricing: React.FC = () => {
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState('');
  const [isDiscountActive, setIsDiscountActive] = useState(false);
  const DISCOUNT_RATE = 0.5;

  const handleApplyCode = () => {
    if (promoCode.toUpperCase() === 'HPF00101') {
      setIsDiscountActive(true);
    } else {
      setIsDiscountActive(false);
    }
  };

  const calculateDiscount = (basePrice: number) => {
    return basePrice * (1 - DISCOUNT_RATE);
  };

  const handleSelectTier = (tier: UserRole) => {
    navigate('/auth');
  };

  return (
    <section id="pricing" className="py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <Reveal width="100%">
            <span className="font-tech text-brand-orange uppercase tracking-[0.2em] text-[10px] block mb-4 font-bold">Infrastructure Tiers</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 tracking-wider text-slate-900 font-tech uppercase">Choose your <br className="md:hidden" /><span className="text-slate-500">Shadow Access.</span></h2>

            <div className="max-w-md mx-auto relative group mt-12">
              <div className="flex items-center gap-4 bg-slate-100/50 cyber-glass-light p-2 pr-2 rounded-2xl border border-slate-200 group-focus-within:border-brand-orange/40 transition-all shadow-inner">
                <div className="pl-4 text-slate-400">
                  <Ticket className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="PROMO CODE"
                  className="bg-transparent border-none outline-none text-slate-900 w-full text-xs font-mono py-2 uppercase placeholder:text-slate-400 tracking-widest"
                />
                <button
                  onClick={handleApplyCode}
                  className="bg-white border border-slate-200 text-slate-600 hover:text-slate-900 px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all hover:bg-slate-50"
                >
                  APPLY
                </button>
              </div>

              {isDiscountActive && (
                <div className="mt-4 text-[10px] font-mono text-brand-orange animate-in slide-in-from-top-2 flex items-center justify-center gap-3 italic tracking-widest uppercase">
                  <Zap className="w-4 h-4 fill-brand-orange" />
                  [PROTOCOL HPF00101 ACTIVE] // 1 MO FREE + 50% OFF SECURED
                </div>
              )}
            </div>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <Reveal delay={100} width="100%">
            <PricingCard
              tier="Shadow"
              price={97}
              onSelect={handleSelectTier}
              discountedPrice={calculateDiscount(97)}
              isDiscounted={isDiscountActive}
              credits="500"
              description="SOLO OPERATOR PHASE"
              features={[
                "500 ShadowAudit™ Scans",
                "Blueprint Access (Basic)",
                "Single Integration Hub",
                "Standard Speed Deployment"
              ]}
            />
          </Reveal>
          <Reveal delay={200} width="100%">
            <PricingCard
              tier="Operator"
              price={297}
              onSelect={handleSelectTier}
              discountedPrice={calculateDiscount(297)}
              isDiscounted={isDiscountActive}
              credits="2,500"
              highlight
              description="AGENCY SCALE PROTOCOL"
              features={[
                "2,500 ShadowAudit™ Scans",
                "Full Sprint View Map",
                "Multi-Channel Automation",
                "Priority Neural Nodes"
              ]}
            />
          </Reveal>
          <Reveal delay={300} width="100%">
            <PricingCard
              tier="Architect"
              price={997}
              onSelect={handleSelectTier}
              discountedPrice={calculateDiscount(997)}
              isDiscounted={isDiscountActive}
              credits="Unlimited"
              description="ENTERPRISE COMMAND"
              features={[
                "Unlimited Audits (Priority)",
                "White-Label Terminal",
                "Slash Command Customizer",
                "Dedicated Agent Architect"
              ]}
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
