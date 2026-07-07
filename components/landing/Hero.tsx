import React from 'react';
import {
  ArrowRight,
  Bot,
  Globe,
  PhoneCall,
  Sparkles,
  TimerReset,
  Workflow,
} from 'lucide-react';
import Reveal from '../Reveal';

const Hero: React.FC = () => {
  const signals = [
    { label: 'Positioning-led design', value: 'Brand-first' },
    { label: 'Automation architecture', value: 'Done-for-you' },
    { label: 'Conversion flow', value: 'Lead-ready' },
  ];

  return (
    <section id="top" className="relative flex min-h-screen items-center overflow-hidden bg-[#F5F6F7] px-4 pb-24 pt-32 text-[#111318] sm:px-6 lg:px-8 lg:pb-32 lg:pt-36">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(214,179,107,0.16),transparent_32%)]" />
        <div className="absolute left-[6%] top-[8%] h-40 w-40 rounded-full border border-black/6" />
        <div className="absolute right-[8%] top-[18%] h-[24rem] w-[24rem] rounded-full bg-[#D6B36B]/12 blur-[120px]" />
        <div className="absolute bottom-10 left-[-5%] h-[20rem] w-[20rem] rounded-full bg-cyan-500/10 blur-[140px]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.55)_0%,rgba(245,246,247,0)_38%)]" />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)] lg:gap-14">
        <Reveal width="100%" className="w-full">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D6B36B]/35 bg-[#D6B36B]/10 px-4 py-2 text-[11px] uppercase tracking-[0.35em] text-[#9b7424]">
              <Sparkles className="h-3.5 w-3.5" />
              Premium Web Systems for Operators
            </div>

            <h1 className="mt-6 text-balance text-[clamp(3.6rem,8vw,7.2rem)] font-semibold leading-[0.93] tracking-[-0.06em] text-[#101215]">
              Websites that feel
              <span className="block font-swash font-medium italic text-[#ba8c2c]">high-end</span>
              and automation that closes like an operator.
            </h1>

            <p className="mt-6 max-w-2xl text-balance text-lg leading-8 text-slate-600 md:text-xl">
              REclose builds luxury-grade websites, AI-led intake, and follow-up systems for service businesses that need sharper positioning and less manual chaos.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href="#get-started"
                className="lux-button inline-flex items-center justify-center gap-2 rounded-full bg-[#111318] px-6 py-4 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(17,19,24,0.16)] hover:bg-[#1d2026]"
              >
                Book Your Build Sprint
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#what-we-do"
                className="lux-button inline-flex items-center justify-center rounded-full border border-black/10 bg-white/50 px-6 py-4 text-sm font-medium text-slate-800 hover:border-black/20 hover:bg-white/80 hover:text-slate-950"
              >
                Explore the System
              </a>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              {signals.map((signal) => (
                <div
                  key={signal.label}
                  className="rounded-[1.6rem] border border-black/8 bg-white/65 p-4 backdrop-blur-xl"
                >
                  <p className="text-[11px] uppercase tracking-[0.35em] text-slate-500">{signal.label}</p>
                  <p className="mt-3 text-lg font-semibold tracking-[-0.03em] text-slate-950">{signal.value}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal width="100%" className="w-full" delay={120}>
          <div className="relative">
            <div className="absolute -left-4 top-10 hidden h-24 w-24 rounded-[2rem] border border-black/8 bg-white/45 lg:block" />
            <div className="relative overflow-hidden rounded-[2.2rem] border border-black/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.85)_0%,rgba(237,240,243,0.96)_100%)] p-5 shadow-[0_35px_100px_rgba(17,24,39,0.12)] md:p-7">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(214,179,107,0.18),transparent_24%)]" />
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.35em] text-slate-500">Studio Control Room</p>
                  <h3 className="mt-3 max-w-md text-3xl font-semibold leading-tight tracking-[-0.04em] text-slate-950">
                    One premium frontend, one conversion system, one operational flow.
                  </h3>
                </div>
                <div className="rounded-full border border-emerald-400/18 bg-emerald-400/10 px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-emerald-200">
                  Lead Flow Online
                </div>
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <div className="rounded-[1.8rem] border border-black/8 bg-white/72 p-5">
                  <div className="flex items-center justify-between">
                    <div className="rounded-2xl bg-[#D6B36B]/12 p-3 text-[#e7c886]">
                      <Globe className="h-5 w-5" />
                    </div>
                    <span className="text-xs uppercase tracking-[0.28em] text-slate-400">Layer 01</span>
                  </div>
                  <h4 className="mt-5 text-xl font-semibold tracking-[-0.03em] text-slate-950">Conversion Site</h4>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    Positioning, proof framing, offer clarity, and a visual language that feels expensive before a call is ever booked.
                  </p>
                </div>

                <div className="rounded-[1.8rem] border border-black/8 bg-white/72 p-5">
                  <div className="flex items-center justify-between">
                    <div className="rounded-2xl bg-cyan-400/12 p-3 text-cyan-200">
                      <Bot className="h-5 w-5" />
                    </div>
                    <span className="text-xs uppercase tracking-[0.28em] text-slate-400">Layer 02</span>
                  </div>
                  <h4 className="mt-5 text-xl font-semibold tracking-[-0.03em] text-slate-950">Automation Stack</h4>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    AI receptionists, booking logic, CRM routing, follow-up cadence, and cleaner handoffs between traffic and revenue.
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-[1.8rem] border border-black/8 bg-[#f0f2f4] p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] uppercase tracking-[0.35em] text-slate-500">Sample Flow</p>
                    <Workflow className="h-4 w-4 text-slate-500" />
                  </div>
                  <div className="mt-5 space-y-3">
                    <div className="rounded-2xl border border-black/8 bg-white/70 p-3">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Traffic lands</p>
                      <p className="mt-2 text-sm text-slate-700">Offer framing, premium design, and clear CTA remove friction fast.</p>
                    </div>
                    <div className="rounded-2xl border border-[#D6B36B]/18 bg-[#D6B36B]/8 p-3">
                      <p className="text-xs uppercase tracking-[0.3em] text-[#f0d39a]/70">AI qualifies</p>
                      <p className="mt-2 text-sm text-[#f7e4bc]">Lead details, intent, and next steps are captured before the team touches the inbox.</p>
                    </div>
                    <div className="rounded-2xl border border-black/8 bg-white/70 p-3">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Ops follow through</p>
                      <p className="mt-2 text-sm text-slate-700">Booking, reminders, routing, and nurture stay consistent without manual babysitting.</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="float-slow rounded-[1.8rem] border border-black/8 bg-white/72 p-5 shadow-[0_18px_45px_rgba(17,24,39,0.08)]">
                    <div className="flex items-center gap-3">
                      <div className="rounded-2xl bg-slate-900 p-3 text-white">
                        <PhoneCall className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">Operator feel</p>
                        <p className="mt-1 text-lg font-semibold text-slate-950">Calls, forms, and WhatsApp can move as one experience.</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[1.8rem] border border-black/8 bg-white/72 p-5 shadow-[0_18px_45px_rgba(17,24,39,0.08)]">
                    <div className="flex items-center gap-3">
                      <div className="rounded-2xl bg-[#D6B36B]/12 p-3 text-[#e7c886]">
                        <TimerReset className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">Less drag</p>
                        <p className="mt-1 text-lg font-semibold text-slate-950">The goal is fewer bottlenecks, fewer missed leads, and a sharper close path.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default Hero;
