import React from 'react';
import {
  Activity,
  Bot,
  ChartNoAxesCombined,
  Globe,
  Workflow,
} from 'lucide-react';
import Reveal from '../Reveal';

const WhatWeDo: React.FC = () => {
  const pillars = [
    {
      title: 'Positioning-led websites',
      description: 'Not brochure pages. We shape the offer, hierarchy, and presentation so the site feels expensive and easy to trust.',
      icon: Globe,
      accent: 'text-cyan-200 bg-cyan-400/12',
    },
    {
      title: 'AI-led intake and qualification',
      description: 'Receptionist logic, instant follow-up, and a cleaner path from inquiry to booked conversation.',
      icon: Bot,
      accent: 'text-[#f0d39a] bg-[#D6B36B]/12',
    },
    {
      title: 'Operational workflow design',
      description: 'Routing, reminders, handoffs, and backend structure that removes repeat admin from the team.',
      icon: Workflow,
      accent: 'text-emerald-200 bg-emerald-400/12',
    },
    {
      title: 'Performance visibility',
      description: 'We design every touchpoint around clarity so the frontend, intake, and sales process speak the same language.',
      icon: ChartNoAxesCombined,
      accent: 'text-white bg-white/10',
    },
  ];

  return (
    <section id="what-we-do" className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Reveal width="100%">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="text-[11px] uppercase tracking-[0.35em] text-[#f0d39a]">What We Build</p>
              <h2 className="mt-4 text-balance text-4xl font-semibold tracking-[-0.05em] text-white md:text-5xl">
                Premium digital surfaces backed by real operational systems.
              </h2>
            </div>
            <p className="max-w-2xl text-balance text-base leading-7 text-white/66 md:text-lg">
              The frontend should look sharp, but it also needs to route leads, reinforce trust, and reduce chaos behind the scenes. That is where the website and automation stack become one product.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;

            return (
              <Reveal key={pillar.title} width="100%" delay={index * 100}>
                <div className="lux-panel lux-card-hover h-full rounded-[2rem] p-6">
                  <div className={`inline-flex rounded-2xl p-3 ${pillar.accent}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-6 text-2xl font-semibold tracking-[-0.04em] text-white">{pillar.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-white/62">{pillar.description}</p>
                </div>
              </Reveal>
            );
          })}
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <Reveal width="100%" delay={120}>
            <div className="lux-panel rounded-[2.2rem] p-6 md:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.35em] text-white/40">Flagship Build</p>
                  <h3 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">
                    Website creation that carries the authority of a high-ticket company.
                  </h3>
                </div>
                <Activity className="hidden h-6 w-6 text-white/35 md:block" />
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                <div className="rounded-[1.6rem] border border-white/8 bg-white/[0.03] p-4">
                  <p className="text-[11px] uppercase tracking-[0.3em] text-white/38">Experience</p>
                  <p className="mt-3 text-lg font-medium text-white">Sharper typography, richer depth, and layouts that feel intentional instead of generic.</p>
                </div>
                <div className="rounded-[1.6rem] border border-white/8 bg-white/[0.03] p-4">
                  <p className="text-[11px] uppercase tracking-[0.3em] text-white/38">Messaging</p>
                  <p className="mt-3 text-lg font-medium text-white">Clear offer framing, service segmentation, and premium CTA placement across the funnel.</p>
                </div>
                <div className="rounded-[1.6rem] border border-white/8 bg-white/[0.03] p-4">
                  <p className="text-[11px] uppercase tracking-[0.3em] text-white/38">Conversion</p>
                  <p className="mt-3 text-lg font-medium text-white">Forms, WhatsApp handoff, automation, and sales operations move together.</p>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal width="100%" delay={220}>
            <div className="lux-panel rounded-[2.2rem] p-6 md:p-8">
              <p className="text-[11px] uppercase tracking-[0.35em] text-[#f0d39a]">Automation Stack</p>
              <h3 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">
                The back-end flow is designed with the same care as the front end.
              </h3>
              <div className="mt-7 space-y-3">
                {[
                  'Lead capture and structured intake',
                  'Booking, reminders, and follow-up choreography',
                  'CRM routing and qualification logic',
                  'Operator-friendly handoff moments',
                ].map((item) => (
                  <div key={item} className="rounded-[1.4rem] border border-white/8 bg-black/28 px-4 py-3 text-sm text-white/74">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default WhatWeDo;
