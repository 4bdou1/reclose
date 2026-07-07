import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, FileStack, Lightbulb, SearchCheck } from 'lucide-react';
import { researchItems, ResearchBucket } from '../lib/hosMissionControl';

const bucketIcons = {
  Clients: SearchCheck,
  Ideas: Lightbulb,
  Documents: FileStack,
};

const buckets: ResearchBucket[] = ['Clients', 'Ideas', 'Documents'];

export default function Research() {
  const [activeBucket, setActiveBucket] = useState<ResearchBucket>('Clients');

  const visibleItems = useMemo(
    () => researchItems.filter((item) => item.bucket === activeBucket),
    [activeBucket]
  );

  return (
    <div className="space-y-6 pb-28">
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="hos-panel rounded-[2rem] p-5 sm:p-6"
      >
        <p className="text-[11px] uppercase tracking-[0.34em] text-[#E8D7AA]/82">Research</p>
        <h1 className="mt-3 text-[2.3rem] font-semibold leading-[0.95] tracking-[-0.06em] text-white">
          Intelligence, ideas, and operator notes.
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-white/58">
          Split research into clients, ideas, and documents so the team can move from raw signals to reusable insight without losing context.
        </p>

        <div className="mt-6 inline-flex flex-wrap gap-2 rounded-[1.2rem] border border-white/10 bg-[#08090B] p-1">
          {buckets.map((bucket) => {
            const Icon = bucketIcons[bucket];
            const active = activeBucket === bucket;

            return (
              <button
                key={bucket}
                type="button"
                onClick={() => setActiveBucket(bucket)}
                className={`lux-button inline-flex items-center gap-2 rounded-[0.95rem] px-4 py-2 text-sm ${
                  active ? 'bg-[#E8D7AA] text-black' : 'text-white/58 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                {bucket}
              </button>
            );
          })}
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        className="grid gap-4"
      >
        {visibleItems.map((item) => {
          const Icon = bucketIcons[item.bucket];

          return (
            <article key={item.id} className="hos-panel rounded-[1.8rem] p-5 sm:p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex gap-4">
                  <div className="mt-0.5 rounded-[1.25rem] bg-white/[0.03] p-3 text-[#E8D7AA]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="max-w-2xl">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full border border-[#E8D7AA]/16 bg-[#E8D7AA]/10 px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-[#F5E9C6]">
                        {item.bucket}
                      </span>
                      <span className="text-[11px] uppercase tracking-[0.28em] text-white/34">{item.dateAdded}</span>
                    </div>
                    <h2 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-white">{item.title}</h2>
                    <p className="mt-3 text-sm leading-7 text-white/58">{item.description}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {item.tags.map((tag) => (
                        <span key={tag} className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1 text-xs text-white/56">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="rounded-[1.4rem] border border-white/8 bg-white/[0.03] p-4 text-sm text-white/62 lg:min-w-[16rem]">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-white/34">Owner</p>
                  <p className="mt-2 text-white">{item.owner}</p>
                  <a
                    href={item.source}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center gap-2 text-[#E8D7AA] hover:text-[#F5E9C6]"
                  >
                    Source link
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </article>
          );
        })}
      </motion.section>
    </div>
  );
}
