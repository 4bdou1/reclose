import React from 'react';
import { Search, PenTool, Rocket, LineChart } from 'lucide-react';
import Reveal from '../Reveal';

const steps = [
  {
    id: '01',
    name: 'Understand your business',
    description: 'We dive deep into your operations, target audience, and growth goals to identify bottlenecks and opportunities.',
    icon: Search,
  },
  {
    id: '02',
    name: 'Build the solution',
    description: 'We design the conversion systems, set up the automations, and craft the marketing assets tailored to your needs.',
    icon: PenTool,
  },
  {
    id: '03',
    name: 'Launch',
    description: 'Your new systems go live. We monitor performance closely to ensure everything functions perfectly from day one.',
    icon: Rocket,
  },
  {
    id: '04',
    name: 'Optimize and scale',
    description: 'We continuously analyze data, tweak campaigns, and refine workflows to maximize your ROI over time.',
    icon: LineChart,
  },
];

const HowWeWork: React.FC = () => {
  return (
    <section id="how-we-work" className="bg-[#F5F6F7] py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <Reveal>
            <h2 className="text-base font-semibold leading-7 text-[#ba8c2c] uppercase tracking-widest">Process</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              How we work
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              A streamlined, four-step approach to building digital systems that actually move your business forward.
            </p>
          </Reveal>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 transform md:-translate-x-1/2" />

            <div className="space-y-16">
              {steps.map((step, index) => (
                <Reveal key={step.id} delay={index * 150}>
                  <div className={`relative flex flex-col md:flex-row items-center gap-8 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                    
                    {/* Icon Bubble */}
                    <div className="absolute left-6 md:left-1/2 w-12 h-12 rounded-full bg-black text-[#D6B36B] flex items-center justify-center transform -translate-x-1/2 border-4 border-[#F5F6F7] shadow-sm z-10">
                      <step.icon className="w-5 h-5" />
                    </div>

                    {/* Content Box */}
                    <div className="w-full md:w-1/2 pl-16 md:pl-0 flex flex-col justify-center">
                      <div className={`premium-card p-8 bg-white ${index % 2 === 0 ? 'md:mr-12' : 'md:ml-12'}`}>
                        <div className="text-[11px] font-bold tracking-widest text-gray-400 mb-2">STEP {step.id}</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">{step.name}</h3>
                        <p className="text-gray-600 leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowWeWork;
