import React from 'react';
import { TrendingUp, Globe, Zap } from 'lucide-react';
import Reveal from '../Reveal';
import { DiaText } from '@/components/ui/dia-text';

const WhyReclose: React.FC = () => {
  const pillars = [
    {
      title: 'Marketing',
      description: 'Create demand, reach the right audience, and turn attention into real opportunities.',
      icon: TrendingUp,
      color: 'bg-blue-500/10 text-blue-600',
      border: 'border-blue-500/20',
    },
    {
      title: 'Websites',
      description: 'Build trust instantly with a digital experience designed to convert visitors into clients.',
      icon: Globe,
      color: 'bg-[#D6B36B]/10 text-[#ba8c2c]',
      border: 'border-[#D6B36B]/20',
    },
    {
      title: 'Automation',
      description: 'Remove repetitive work with AI systems that handle responses, follow-ups, and operations.',
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
            <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl mb-8">
              Everything your business needs to{" "}
              <DiaText
                repeat
                repeatDelay={1.1}
                text={["grow.", "scale.", "thrive.", "expand.", "evolve.", "accelerate.", "advance.", "flourish."]}
              />
            </p>
            <div className="space-y-4 text-lg leading-8 text-gray-400">
              <p>Because growth is not just about getting attention.</p>
              <p>You can have the best ads, the best website, and still lose customers if your systems cannot keep up.</p>
              <p className="font-medium text-white pt-2">REclose connects every step of your growth journey:</p>
            </div>
          </Reveal>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:max-w-none">
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

        <div className="mx-auto mt-16 max-w-2xl lg:text-center">
          <Reveal delay={300}>
            <p className="text-xl font-medium tracking-tight text-[#D6B36B] sm:text-2xl">
              Growth becomes simpler when everything works together.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default WhyReclose;
