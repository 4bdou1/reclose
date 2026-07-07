import React from 'react';
import {
  Building2,
  Home,
  Landmark,
  Layers3,
} from 'lucide-react';
import Reveal from '../Reveal';

const WhoItsFor: React.FC = () => {
  const segments = [
    {
      title: 'High-trust local brands',
      icon: Home,
      description: 'Clinics, studios, home services, and premium local operators that need the site to feel polished before the first conversation.',
    },
    {
      title: 'Real estate and advisory teams',
      icon: Landmark,
      description: 'Businesses that sell trust, expertise, and responsiveness benefit most from cleaner intake and stronger digital authority.',
    },
    {
      title: 'Agencies and white-label partners',
      icon: Layers3,
      description: 'Studios that want sharper delivery, better presentation, and automation infrastructure they can use across multiple clients.',
    },
  ];

  return (
    <section id="who-its-for" className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-[0.78fr_1.22fr]">
          <Reveal width="100%">
            <div className="lux-panel rounded-[2.2rem] p-6 md:p-8 lg:sticky lg:top-28">
              <p className="text-[11px] uppercase tracking-[0.35em] text-[#f0d39a]">Who It Fits</p>
              <h2 className="mt-4 text-balance text-4xl font-semibold tracking-[-0.05em] text-white md:text-5xl">
                Built for companies where perception and response time change the deal.
              </h2>
              <p className="mt-5 text-base leading-7 text-white/66">
                The sweet spot is a business that already delivers strong service but needs its public presence and lead handling to finally match the quality of the work.
              </p>

              <div className="mt-8 rounded-[1.8rem] border border-[#D6B36B]/18 bg-[#D6B36B]/8 p-5">
                <p className="text-[11px] uppercase tracking-[0.3em] text-[#f0d39a]/80">Best Use Case</p>
                <p className="mt-3 text-xl font-medium tracking-[-0.03em] text-white">
                  You are tired of losing premium positioning because the site looks ordinary or the inquiry flow feels manual.
                </p>
              </div>
            </div>
          </Reveal>

          <div className="grid gap-5">
            {segments.map((segment, index) => {
              const Icon = segment.icon;

              return (
                <Reveal key={segment.title} width="100%" delay={index * 120}>
                  <div className="lux-panel lux-card-hover rounded-[2rem] p-6 md:p-7">
                    <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                      <div className="flex gap-4">
                        <div className="rounded-[1.4rem] bg-white/8 p-3 text-white">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-semibold tracking-[-0.04em] text-white">{segment.title}</h3>
                          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/62">{segment.description}</p>
                        </div>
                      </div>
                      <div className="rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-white/40">
                        Ideal Fit
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}

            <Reveal width="100%" delay={360}>
              <div className="grid gap-5 md:grid-cols-2">
                <div className="lux-panel-soft rounded-[1.8rem] p-5">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-[#D6B36B]/12 p-3 text-[#f0d39a]">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.3em] text-white/38">Engagement Style</p>
                      <p className="mt-2 text-lg font-semibold text-white">Done-for-you builds with strategic framing, not just execution tickets.</p>
                    </div>
                  </div>
                </div>

                <div className="lux-panel-soft rounded-[1.8rem] p-5">
                  <p className="text-[11px] uppercase tracking-[0.3em] text-white/38">Not The Best Fit</p>
                  <p className="mt-3 text-lg font-semibold leading-8 text-white">
                    Businesses looking for the cheapest possible site or a disconnected automation add-on.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhoItsFor;
