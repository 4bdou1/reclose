import React from 'react';
import {
  ArrowRight,
  TrendingUp,
  Globe,
  Bot,
  Sparkles,
} from 'lucide-react';
import Reveal from '../Reveal';

const Hero: React.FC = () => {
  return (
    <section id="top" className="relative flex min-h-screen items-center bg-transparent px-4 pb-24 pt-32 text-white sm:px-6 lg:px-8 lg:pb-32 lg:pt-36">
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-[-1]">
        {/* Dot Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.2]" 
          style={{ 
            backgroundImage: 'radial-gradient(circle at center, rgba(255,255,255,0.8) 1px, transparent 1px)', 
            backgroundSize: '32px 32px',
            maskImage: 'linear-gradient(to bottom, transparent 10%, black 50%, transparent 95%)'
          }} 
        />

        {/* Orbital Circles & Center Cube (Top Right) */}
        <div className="absolute right-[-15%] top-[-5%] w-[800px] h-[800px] opacity-70 md:right-[-5%] md:top-[-10%]">
          <svg viewBox="0 0 800 800" className="w-full h-full animate-[spin_60s_linear_infinite]">
            <circle cx="400" cy="400" r="320" stroke="rgba(255,255,255,0.06)" strokeWidth="1" fill="none" />
            <circle cx="400" cy="400" r="320" stroke="#3B82F6" strokeWidth="2" strokeDasharray="150 1500" strokeLinecap="round" fill="none" className="opacity-80 drop-shadow-[0_0_10px_#3B82F6]" />
            
            <circle cx="400" cy="400" r="240" stroke="rgba(255,255,255,0.06)" strokeWidth="1" fill="none" />
            <circle cx="400" cy="400" r="240" stroke="#D6B36B" strokeWidth="1" strokeDasharray="80 1000" strokeLinecap="round" fill="none" className="opacity-70 drop-shadow-[0_0_10px_#D6B36B]" />
            
            <circle cx="400" cy="400" r="160" stroke="rgba(255,255,255,0.06)" strokeWidth="1" fill="none" />
            <circle cx="400" cy="400" r="160" stroke="#3B82F6" strokeWidth="1" strokeDasharray="40 600" strokeLinecap="round" fill="none" className="opacity-50" />
            
            <circle cx="80" cy="400" r="3" fill="#3B82F6" className="drop-shadow-[0_0_8px_#3B82F6]" />
            <circle cx="400" cy="160" r="2.5" fill="#D6B36B" className="drop-shadow-[0_0_8px_#D6B36B]" />
            <circle cx="640" cy="540" r="3.5" fill="#fff" className="drop-shadow-[0_0_8px_#fff]" />
          </svg>
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-[2rem] bg-gradient-to-br from-white/10 via-transparent to-transparent p-[1px] shadow-[0_0_60px_rgba(59,130,246,0.15)] transform -rotate-12 backdrop-blur-md">
            <div className="w-full h-full rounded-[2rem] bg-gradient-to-b from-[#111115] to-[#050505] flex items-center justify-center shadow-[inset_0_4px_20px_rgba(0,0,0,0.5)]">
               <svg viewBox="0 0 100 80" className="w-20 h-20 opacity-30 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 10H45C53 10 58 15 58 22C58 29 53 34 45 34H22V65M22 34H35L52 65" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M85 20C90 28 90 45 85 55C78 68 62 70 52 65" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
               </svg>
            </div>
          </div>
        </div>

        
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,5,0.95)_0%,rgba(5,5,5,0)_40%,rgba(5,5,5,0.7)_100%)] pointer-events-none" />
      </div>

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)] lg:gap-14">
        <Reveal width="100%" className="w-full">
          <div className="max-w-3xl">
            <h1 className="mt-6 text-balance text-[clamp(3.6rem,8vw,7.2rem)] font-semibold leading-[0.93] tracking-[-0.06em] text-white">
              Build.
              <span className="block font-swash font-medium italic text-[#ba8c2c]">Scale.</span>
              Automate.
            </h1>

            <p className="mt-6 max-w-2xl text-balance text-lg leading-8 text-gray-400 md:text-xl">
              We help businesses attract more customers, convert more leads, and automate repetitive work through marketing, high-converting websites, and intelligent automations.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href="#get-started"
                className="lux-button inline-flex items-center justify-center gap-2 rounded-full bg-[#111318] px-6 py-4 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(17,19,24,0.16)] hover:bg-[#1d2026]"
              >
                Book a Discovery Call
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#work"
                className="lux-button inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-4 text-sm font-medium text-gray-300 hover:border-white/20 hover:bg-white/10 hover:text-white"
              >
                View Our Work
              </a>
            </div>
          </div>
        </Reveal>

        <Reveal width="100%" className="w-full" delay={120}>
          <div className="relative">
            <div className="absolute -left-4 top-10 hidden h-24 w-24 rounded-[2rem] border border-white/10 bg-white/5 lg:block" />
            <div className="relative overflow-hidden rounded-[2.2rem] border border-white/10 bg-[#111111] p-5 shadow-[0_35px_100px_rgba(0,0,0,0.5)] md:p-7">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(214,179,107,0.18),transparent_24%)]" />
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.35em] text-slate-500">Growth Systems</p>
                  <h3 className="mt-3 max-w-md text-3xl font-semibold leading-tight tracking-[-0.04em] text-white">
                    Digital systems that help your business scale efficiently.
                  </h3>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <div className="rounded-[1.8rem] border border-white/5 bg-white/5 p-5 flex items-center gap-4 transition-all hover:bg-white/10">
                  <div className="rounded-2xl bg-blue-500/12 p-3 text-blue-600 shrink-0">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold tracking-tight text-white">Marketing</h4>
                    <p className="text-sm text-gray-400">Attract the right audience consistently.</p>
                  </div>
                </div>

                <div className="rounded-[1.8rem] border border-white/5 bg-white/5 p-5 flex items-center gap-4 transition-all hover:bg-white/10">
                  <div className="rounded-2xl bg-[#D6B36B]/12 p-3 text-[#ba8c2c] shrink-0">
                    <Globe className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold tracking-tight text-white">Websites</h4>
                    <p className="text-sm text-gray-400">Convert traffic into booked revenue.</p>
                  </div>
                </div>

                <div className="rounded-[1.8rem] border border-white/5 bg-white/5 p-5 flex items-center gap-4 transition-all hover:bg-white/10">
                  <div className="rounded-2xl bg-emerald-500/12 p-3 text-emerald-600 shrink-0">
                    <Bot className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold tracking-tight text-white">Automations</h4>
                    <p className="text-sm text-gray-400">Eliminate manual work and scale operations.</p>
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
