import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import Reveal from '../Reveal';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Strategic intake',
      description: 'We learn the business model, current lead flow, offer structure, and where the frontend or operations are leaking trust.',
      deliverable: 'Clear scope and priority map',
    },
    {
      number: '02',
      title: 'Design direction and system planning',
      description: 'The website hierarchy, conversion path, and automation logic are planned together so the experience feels premium from every angle.',
      deliverable: 'Experience direction and workflow logic',
    },
    {
      number: '03',
      title: 'Build and integration',
      description: 'Visual execution, form structure, WhatsApp or booking flow, and operational handoff points are implemented as one product.',
      deliverable: 'Launch-ready frontend and intake stack',
    },
    {
      number: '04',
      title: 'Launch and refinement',
      description: 'Once live, the system is positioned to capture cleaner leads and reduce friction for your team on every new inquiry.',
      deliverable: 'A sharper public presence with better follow-through',
    },
  ];

  return (
    <section id="how-it-works" className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.72fr_1.28fr]">
        <Reveal width="100%">
          <div className="lux-panel rounded-[2.2rem] p-6 md:p-8 lg:sticky lg:top-28">
            <p className="text-[11px] uppercase tracking-[0.35em] text-[#f0d39a]">Process</p>
            <h2 className="mt-4 text-balance text-4xl font-semibold tracking-[-0.05em] text-white md:text-5xl">
              A tighter build process with fewer vague handoffs.
            </h2>
            <p className="mt-5 text-base leading-7 text-white/66">
              The point is not to hand you a pretty shell. The point is to create a branded system that speaks clearly, captures intent, and works operationally after launch.
            </p>

            <div className="mt-8 rounded-[1.8rem] border border-white/8 bg-white/[0.03] p-5">
              <p className="text-[11px] uppercase tracking-[0.3em] text-white/38">What You Feel</p>
              <p className="mt-3 text-xl font-medium leading-8 text-white">
                A guided project with strong visual direction, operational thinking, and a far more premium final surface than generic agency output.
              </p>
            </div>
          </div>
        </Reveal>

        <div className="relative">
          <div className="absolute bottom-10 left-6 top-10 hidden w-px bg-gradient-to-b from-transparent via-white/14 to-transparent md:block" />
          <div className="space-y-5">
            {steps.map((step, index) => (
              <Reveal key={step.number} width="100%" delay={index * 110}>
                <div className="relative md:pl-20">
                  <div className="absolute left-0 top-8 hidden h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-[#0f0f14] text-sm font-semibold text-white shadow-[0_0_25px_rgba(255,255,255,0.05)] md:flex">
                    {step.number}
                  </div>
                  <div className="lux-panel lux-card-hover rounded-[2rem] p-6 md:p-7">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.3em] text-white/38 md:hidden">{step.number}</p>
                        <h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">{step.title}</h3>
                        <p className="mt-4 max-w-2xl text-sm leading-7 text-white/62">{step.description}</p>
                      </div>
                      <ArrowRight className="hidden h-5 w-5 text-white/28 md:block" />
                    </div>

                    <div className="mt-6 flex items-start gap-3 rounded-[1.5rem] border border-[#D6B36B]/16 bg-[#D6B36B]/8 p-4">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#f0d39a]" />
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.3em] text-[#f0d39a]/72">Outcome</p>
                        <p className="mt-2 text-sm leading-6 text-[#f9ebc6]">{step.deliverable}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
