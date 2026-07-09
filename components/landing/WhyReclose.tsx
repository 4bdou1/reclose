import React from 'react';
import { TrendingUp, Globe, Zap } from 'lucide-react';
import Reveal from '../Reveal';

const WhyReclose: React.FC = () => {
  const pillars = [
    {
      title: 'Marketing',
      description: 'Get your business in front of the right people.',
      icon: TrendingUp,
      color: 'bg-blue-500/10 text-blue-600',
      border: 'border-blue-500/20',
    },
    {
      title: 'Websites',
      description: 'Beautiful websites designed to convert visitors into customers.',
      icon: Globe,
      color: 'bg-[#D6B36B]/10 text-[#ba8c2c]',
      border: 'border-[#D6B36B]/20',
    },
    {
      title: 'Automations',
      description: 'Save hours every week by automating repetitive workflows.',
      icon: Zap,
      color: 'bg-emerald-500/10 text-emerald-600',
      border: 'border-emerald-500/20',
    },
  ];

  return (
    <section id="why-reclose" className="relative bg-transparent py-24 sm:py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <Reveal>
            <h2 className="text-base font-semibold leading-7 text-[#ba8c2c] uppercase tracking-widest">Why REclose?</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Everything your business needs to grow.
            </p>
          </Reveal>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {pillars.map((pillar, index) => (
              <Reveal key={pillar.title} delay={index * 100}>
                <div className="flex flex-col items-start black-card p-8 h-full transition-all hover:-translate-y-1 hover:shadow-xl">
                  <div className={`rounded-2xl p-4 ${pillar.color} ${pillar.border} border mb-6`}>
                    <pillar.icon className="h-8 w-8" aria-hidden="true" />
                  </div>
                  <dt className="text-xl font-semibold leading-7 text-white mb-4">
                    {pillar.title}
                  </dt>
                  <dd className="text-base leading-7 text-gray-400 flex-1">
                    {pillar.description}
                  </dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
};

export default WhyReclose;
