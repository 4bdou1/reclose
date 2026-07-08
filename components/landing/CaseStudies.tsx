import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import Reveal from '../Reveal';

const projects = [
  {
    title: 'HOS Labs Dashboard',
    category: 'SaaS Platform',
    description: 'A complete operational dashboard tracking analytics, tasks, and file management in real-time.',
    gradient: 'from-blue-500/20 to-cyan-500/20',
  },
  {
    title: 'REclose Internal CRM',
    category: 'Internal Tooling',
    description: 'Custom client relationship manager built to streamline the lead intake and tracking process.',
    gradient: 'from-[#D6B36B]/20 to-[#ba8c2c]/20',
  },
  {
    title: 'AI Outreach Tracker',
    category: 'Automation',
    description: 'Automated workflow system connecting Google Sheets with intelligent email outreach sequences.',
    gradient: 'from-emerald-500/20 to-teal-500/20',
  },
  {
    title: 'Website Redesign Concepts',
    category: 'Conversion Design',
    description: 'High-end, modern landing pages optimized for conversion and built on premium aesthetics.',
    gradient: 'from-purple-500/20 to-pink-500/20',
  },
];

const CaseStudies: React.FC = () => {
  return (
    <section id="work" className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <Reveal>
              <h2 className="text-base font-semibold leading-7 text-[#ba8c2c] uppercase tracking-widest">Our Work</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Case studies & projects.
              </p>
              <p className="mt-4 text-lg text-gray-600">
                A look at the digital growth systems we've built to help businesses scale.
              </p>
            </Reveal>
          </div>
          <Reveal delay={200}>
            <a href="#get-started" className="hidden md:inline-flex items-center gap-2 text-sm font-semibold text-black hover:text-[#ba8c2c] transition-colors">
              Start your project <ArrowUpRight className="w-4 h-4" />
            </a>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <Reveal key={project.title} delay={index * 150} width="100%">
              <div className="group cursor-pointer relative overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
                {/* Visual Placeholder */}
                <div className={`h-64 w-full bg-gradient-to-br ${project.gradient} flex items-center justify-center p-8`}>
                  <div className="w-full h-full bg-white/40 backdrop-blur-sm border border-white/50 rounded-xl shadow-sm flex items-center justify-center">
                    <span className="text-gray-500/50 font-medium tracking-widest uppercase text-sm">Project Visual</span>
                  </div>
                </div>

                <div className="p-8">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#ba8c2c]">{project.category}</span>
                    <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-black transition-colors transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{project.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{project.description}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CaseStudies;
