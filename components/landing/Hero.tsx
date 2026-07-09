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
    <section id="top" className="relative flex min-h-screen items-center overflow-hidden bg-[#050505] px-4 pb-24 pt-32 text-white sm:px-6 lg:px-8 lg:pb-32 lg:pt-36">
      <div className="pointer-events-none absolute inset-0">
        <SplineRocket />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(214,179,107,0.16),transparent_32%)]" />
        <div className="absolute right-[8%] top-[18%] h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(circle,rgba(214,179,107,0.12),transparent_70%)]" />
        <div className="absolute bottom-10 left-[-5%] h-[20rem] w-[20rem] rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.10),transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,5,0.85)_0%,rgba(5,5,5,0)_38%)]" />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)] lg:gap-14">
        <Reveal width="100%" className="w-full">
          <div className="max-w-3xl">
            <h1 className="mt-6 text-balance text-[clamp(3.6rem,8vw,7.2rem)] font-semibold leading-[0.93] tracking-[-0.06em] text-white">
              Build.
              <span className="block font-swash font-medium italic text-[#ba8c2c]">Grow.</span>
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

const SplineRocket: React.FC = () => {
  React.useEffect(() => {
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://unpkg.com/@splinetool/viewer@1.12.98/build/spline-viewer.js';
    document.head.appendChild(script);

    const removeSplineLogo = setInterval(() => {
      const viewer = document.querySelector('spline-viewer');
      if (viewer && viewer.shadowRoot) {
        const logo = viewer.shadowRoot.querySelector('#logo');
        if (logo) {
          logo.remove();
          clearInterval(removeSplineLogo);
        }
      }
    }, 500);

    return () => {
      clearInterval(removeSplineLogo);
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="absolute top-[35%] right-[-20%] w-[600px] h-[600px] -translate-y-1/2 opacity-70 pointer-events-auto md:w-[800px] md:h-[800px] md:right-[-5%] lg:right-[5%] z-0 mix-blend-screen">
      {/* @ts-ignore */}
      <spline-viewer url="https://prod.spline.design/9dJTIFucV-KyX7hc/scene.splinecode"></spline-viewer>
    </div>
  );
};

export default Hero;
