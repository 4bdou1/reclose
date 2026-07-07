import React from 'react';
import { motion } from 'framer-motion';
import { FileStack, FolderOpenDot, Images, Presentation } from 'lucide-react';
import { fileItems, FileCategory } from '../lib/hosMissionControl';

const categoryIcons: Record<FileCategory, typeof Presentation> = {
  'Pitch decks': Presentation,
  Research: FileStack,
  'Client documents': FolderOpenDot,
  Assets: Images,
};

const categories: FileCategory[] = ['Pitch decks', 'Research', 'Client documents', 'Assets'];

export default function Files() {
  return (
    <div className="space-y-6 pb-28">
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="hos-panel rounded-[2rem] p-5 sm:p-6"
      >
        <p className="text-[11px] uppercase tracking-[0.34em] text-[#E8D7AA]/82">Files</p>
        <h1 className="mt-3 text-[2.3rem] font-semibold leading-[0.95] tracking-[-0.06em] text-white">
          Premium internal file manager.
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-white/58">
          Decks, research, client documents, and assets organized like a private cloud storage app for a focused AI startup team.
        </p>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        className="grid gap-4 xl:grid-cols-2"
      >
        {categories.map((category) => {
          const Icon = categoryIcons[category];
          const items = fileItems.filter((item) => item.category === category);

          return (
            <section key={category} className="hos-panel rounded-[1.8rem] p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-[1rem] bg-white/[0.03] p-3 text-[#E8D7AA]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.28em] text-white/34">{category}</p>
                    <p className="mt-1 text-lg font-semibold text-white">{items.length} files</p>
                  </div>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="rounded-[1.3rem] border border-white/8 bg-white/[0.03] px-4 py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-base font-semibold text-white">{item.title}</h2>
                        <p className="mt-1 text-sm leading-6 text-white/54">{item.subtitle}</p>
                      </div>
                      <span className="text-xs text-white/34">{item.size}</span>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-sm text-white/42">
                      <span>{item.owner}</span>
                      <span>{item.updatedAt}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </motion.section>
    </div>
  );
}
