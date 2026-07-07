import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BellRing,
  CheckCircle2,
  Clock3,
  FileText,
  FolderPlus,
  ListTodo,
  SearchCheck,
  Sparkles,
  Target,
} from 'lucide-react';
import {
  buildTaskBreakdown,
  fetchMissionTasks,
  missionActivities,
  missionPreview,
  weeklyProgressSeries,
} from '../lib/hosMissionControl';

const cardMotion = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
};

const overviewMetrics = [
  { label: 'Tasks Updated', value: '5', icon: ListTodo },
  { label: 'Tasks Completed', value: '3', icon: CheckCircle2 },
  { label: 'Research Updates', value: '2', icon: SearchCheck },
  { label: 'Files Added', value: '1', icon: FolderPlus },
];

const deadlinePreview = [
  { label: 'Today', task: 'Follow up with 10 agencies', owner: 'Abdoul' },
  { label: 'May 28', task: 'Landing page content', owner: 'Ameer' },
  { label: 'May 30', task: 'Deck update', owner: 'Abdoul' },
];

const activityIcons = {
  completed: CheckCircle2,
  updated: FileText,
  research: SearchCheck,
  file: FolderPlus,
};

function ProgressGraph() {
  const max = Math.max(...weeklyProgressSeries);
  const points = weeklyProgressSeries
    .map((value, index) => {
      const x = (index / (weeklyProgressSeries.length - 1)) * 100;
      const y = 100 - (value / max) * 100;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg viewBox="0 0 100 100" className="h-28 w-full overflow-visible">
      <defs>
        <linearGradient id="weekly-progress-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(232,215,170,0.35)" />
          <stop offset="100%" stopColor="rgba(232,215,170,0)" />
        </linearGradient>
      </defs>
      <polyline
        fill="none"
        stroke="rgba(232,215,170,0.92)"
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        points={points}
      />
      <polygon
        fill="url(#weekly-progress-fill)"
        points={`0,100 ${points} 100,100`}
      />
      {weeklyProgressSeries.map((value, index) => {
        const x = (index / (weeklyProgressSeries.length - 1)) * 100;
        const y = 100 - (value / max) * 100;

        return (
          <circle
            key={`${value}-${index}`}
            cx={x}
            cy={y}
            r="2.2"
            fill="#E8D7AA"
            stroke="#0B0B0D"
            strokeWidth="1.2"
          />
        );
      })}
    </svg>
  );
}

function CircularBreakdown({
  total,
  inProgress,
  notStarted,
  completed,
  onHold,
}: {
  total: number;
  inProgress: number;
  notStarted: number;
  completed: number;
  onHold: number;
}) {
  const segments = [
    { value: inProgress, color: '#E8D7AA' },
    { value: notStarted, color: '#8E939D' },
    { value: completed, color: '#8EB391' },
    { value: onHold, color: '#CB8671' },
  ];

  let current = 0;
  const gradient = segments
    .map((segment) => {
      const start = current;
      const size = total === 0 ? 0 : (segment.value / total) * 100;
      current += size;
      return `${segment.color} ${start}% ${current}%`;
    })
    .join(', ');

  return (
    <div
      className="relative h-44 w-44 rounded-full"
      style={{
        background: `conic-gradient(${gradient})`,
      }}
    >
      <div className="absolute inset-[18px] rounded-full bg-[#09090C] ring-1 ring-white/6" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-4xl font-semibold tracking-[-0.05em] text-white">{total}</span>
        <span className="mt-1 text-sm text-white/55">Total Tasks</span>
      </div>
    </div>
  );
}

export default function Overview() {
  const [loading, setLoading] = useState(true);
  const [taskBreakdown, setTaskBreakdown] = useState({
    total: 24,
    inProgress: 9,
    notStarted: 7,
    completed: 6,
    onHold: 2,
  });

  useEffect(() => {
    let active = true;

    async function loadTasks() {
      const { tasks } = await fetchMissionTasks();
      if (!active) return;
      setTaskBreakdown(buildTaskBreakdown(tasks));
      setLoading(false);
    }

    loadTasks();

    return () => {
      active = false;
    };
  }, []);

  const missionCompletion = useMemo(
    () => `${missionPreview.completedTasks} / ${missionPreview.totalTasks} completed`,
    []
  );

  return (
    <div className="space-y-6 pb-28">
      <motion.section
        {...cardMotion}
        className="relative overflow-hidden rounded-[2rem] border border-white/8 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_26%),linear-gradient(180deg,rgba(11,11,14,0.85)_0%,rgba(5,5,7,0.92)_100%)] p-5 shadow-[0_35px_80px_rgba(0,0,0,0.42)] sm:p-6"
      >
        <div className="pointer-events-none absolute inset-0 hos-grid-overlay opacity-25" />
        <div className="pointer-events-none absolute right-[-18%] top-[-8%] h-72 w-72 rounded-full border border-white/8 opacity-35" />
        <div className="pointer-events-none absolute right-[-8%] top-[12%] h-56 w-56 rounded-full border border-[#E8D7AA]/12 opacity-60" />
        <div className="pointer-events-none absolute right-[7%] top-[14%] h-20 w-20 rounded-full bg-[#E8D7AA]/20 blur-2xl" />

        <div className="relative z-10 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/8 bg-white/[0.03]">
              <img src="/hos-logo.png" alt="HOS Labs" className="h-8 w-auto object-contain" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.36em] text-[#E8D7AA]/86">HOS Labs</p>
              <p className="mt-1 text-sm text-white/48">Internal command center</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/76">
              <BellRing className="h-5 w-5" />
            </button>
            <button className="hos-gold-glow flex h-11 w-11 items-center justify-center rounded-full border border-[#E8D7AA]/18 bg-[#121214] text-base font-medium text-white">
              A
            </button>
          </div>
        </div>

        <div className="relative z-10 mt-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-[11px] uppercase tracking-[0.35em] text-[#E8D7AA]/82">Mission Control</p>
            <h1 className="mt-4 text-[2.6rem] font-semibold leading-[0.94] tracking-[-0.06em] text-white sm:text-[3.15rem]">
              Good morning, Abdoul.
            </h1>
            <p className="mt-3 max-w-xl text-base leading-7 text-white/58 sm:text-lg">
              Here&apos;s what changed while you were away.
            </p>
          </div>

          <div className="inline-flex items-center gap-3 self-start rounded-[1.25rem] border border-white/10 bg-white/[0.03] px-4 py-3 text-white/76 backdrop-blur-md">
            <Clock3 className="h-4 w-4 text-[#E8D7AA]" />
            <div>
              <p className="text-[10px] uppercase tracking-[0.28em] text-white/42">Since last check-in</p>
              <p className="mt-1 text-sm">10h ago</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-8 grid grid-cols-2 gap-3 border-t border-white/6 pt-5 lg:grid-cols-4">
          {overviewMetrics.map((metric) => {
            const Icon = metric.icon;

            return (
              <div key={metric.label} className="flex items-start gap-3 rounded-[1.4rem] border border-white/6 bg-white/[0.02] p-4">
                <div className="rounded-2xl bg-white/[0.03] p-2.5 text-[#E8D7AA]">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-3xl font-semibold tracking-[-0.04em] text-white">{metric.value}</p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.26em] text-white/42">{metric.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </motion.section>

      <motion.section
        {...cardMotion}
        transition={{ ...cardMotion.transition, delay: 0.08 }}
        className="grid gap-4 xl:grid-cols-[1.45fr_0.82fr]"
      >
        <div className="hos-panel rounded-[2rem] p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.03] px-3 py-1.5 text-[10px] uppercase tracking-[0.32em] text-white/46">
                <Target className="h-3.5 w-3.5 text-[#E8D7AA]" />
                {missionPreview.label}
              </div>
              <h2 className="mt-5 text-[2rem] font-semibold tracking-[-0.05em] text-white">{missionPreview.title}</h2>
              <p className="mt-3 text-white/52">Deadline: {missionPreview.deadline}</p>
            </div>

            <div className="hidden h-28 w-28 items-center justify-center rounded-full border border-white/8 bg-[#08090B] xl:flex">
              <div
                className="relative flex h-20 w-20 items-center justify-center rounded-full"
                style={{
                  background: `conic-gradient(#E8D7AA ${missionPreview.progress}%, rgba(255,255,255,0.08) 0)`,
                }}
              >
                <div className="absolute inset-[10px] rounded-full bg-[#08090B]" />
                <span className="relative z-10 text-lg font-semibold text-white">{missionPreview.progress}%</span>
              </div>
            </div>
          </div>

          <div className="mt-7">
            <div className="flex items-center justify-between text-sm text-white/62">
              <span>Progress</span>
              <span className="text-3xl font-semibold tracking-[-0.04em] text-[#E8D7AA]">{missionPreview.progress}%</span>
            </div>
            <div className="mt-4 h-4 rounded-full bg-white/8">
              <motion.div
                className="h-full rounded-full bg-[linear-gradient(90deg,#F7E6BB_0%,#E8D7AA_100%)]"
                initial={{ width: 0 }}
                animate={{ width: `${missionPreview.progress}%` }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
            <div className="mt-4 flex items-center justify-between text-sm text-white/52">
              <span>{missionCompletion}</span>
              <span>{missionPreview.remainingDays} days left</span>
            </div>
          </div>
        </div>

        <div className="hos-panel rounded-[2rem] p-5 sm:p-6">
          <p className="text-[11px] uppercase tracking-[0.33em] text-white/44">Mission Status</p>
          <h3 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-white">On Track</h3>
          <div className="relative mt-6 flex h-[15.5rem] items-center justify-center overflow-hidden rounded-[1.8rem] border border-white/6 bg-[#070709]">
            <div className="absolute h-56 w-56 rounded-full border border-white/6" />
            <div className="absolute h-44 w-44 rounded-full border border-white/6" />
            <div className="absolute h-32 w-32 rounded-full border border-white/6" />
            <div className="absolute h-20 w-20 rounded-full border border-white/6" />
            <div className="absolute h-5 w-5 rounded-full bg-[#E8D7AA] shadow-[0_0_35px_rgba(232,215,170,0.75)]" />
            <div className="absolute left-[20%] top-[24%] h-3 w-3 rounded-full bg-[#E8D7AA]/82" />
            <div className="absolute right-[24%] top-[36%] h-2.5 w-2.5 rounded-full bg-white/68" />
            <div className="absolute bottom-[22%] right-[34%] h-3 w-3 rounded-full bg-[#E8D7AA]/68" />
          </div>
        </div>
      </motion.section>

      <motion.section
        {...cardMotion}
        transition={{ ...cardMotion.transition, delay: 0.14 }}
        className="hos-panel rounded-[2rem] p-5 sm:p-6"
      >
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.33em] text-white/44">Recent Activity</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">Team movement across the stack</h3>
          </div>
          <button className="text-sm text-white/56 transition-colors hover:text-white">View all</button>
        </div>

        <div className="space-y-0">
          {missionActivities.map((item, index) => {
            const Icon = activityIcons[item.type];

            return (
              <div key={item.id} className="grid grid-cols-[auto_1fr_auto] gap-4 py-4">
                <div className="relative flex w-10 justify-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[#0B0B0D] text-[#E8D7AA]">
                    <Icon className="h-4 w-4" />
                  </div>
                  {index !== missionActivities.length - 1 && (
                    <div className="absolute top-10 h-[calc(100%+0.25rem)] w-px bg-white/10" />
                  )}
                </div>
                <div className="border-b border-white/6 pb-4 last:border-b-0">
                  <p className="text-base leading-7 text-white">{item.action}</p>
                  <p className="mt-1 text-sm text-white/46">{item.category}</p>
                </div>
                <div className="border-b border-white/6 pb-4 text-right text-sm text-white/36 last:border-b-0">
                  {item.timestamp}
                </div>
              </div>
            );
          })}
        </div>
      </motion.section>

      <motion.section
        {...cardMotion}
        transition={{ ...cardMotion.transition, delay: 0.2 }}
        className="grid gap-4 xl:grid-cols-3"
      >
        <div className="hos-panel rounded-[2rem] p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <p className="text-[11px] uppercase tracking-[0.3em] text-white/44">Weekly Progress</p>
            <Sparkles className="h-4 w-4 text-[#E8D7AA]" />
          </div>
          <div className="mt-6">
            <div className="text-6xl font-semibold tracking-[-0.07em] text-white">72%</div>
            <p className="mt-2 text-white/58">Overall Progress</p>
          </div>
          <div className="mt-5">
            <ProgressGraph />
          </div>
          <p className="mt-4 text-sm text-emerald-300">+12% vs last week</p>
        </div>

        <div className="hos-panel rounded-[2rem] p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <p className="text-[11px] uppercase tracking-[0.3em] text-white/44">Tasks Overview</p>
            <ListTodo className="h-4 w-4 text-[#E8D7AA]" />
          </div>

          {loading ? (
            <div className="mt-8 h-60 rounded-[1.6rem] bg-white/[0.03] hos-shimmer" />
          ) : (
            <div className="mt-6 flex flex-col items-center gap-6 xl:flex-row xl:items-start xl:justify-between">
              <CircularBreakdown {...taskBreakdown} />
              <div className="grid flex-1 gap-3">
                {[
                  { label: 'In Progress', value: taskBreakdown.inProgress, color: 'bg-[#E8D7AA]' },
                  { label: 'Not Started', value: taskBreakdown.notStarted, color: 'bg-[#8E939D]' },
                  { label: 'Completed', value: taskBreakdown.completed, color: 'bg-[#8EB391]' },
                  { label: 'On Hold', value: taskBreakdown.onHold, color: 'bg-[#CB8671]' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between rounded-[1.2rem] border border-white/6 bg-white/[0.03] px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                      <span className="text-sm text-white/66">{item.label}</span>
                    </div>
                    <span className="text-lg font-semibold text-white">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="hos-panel rounded-[2rem] p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <p className="text-[11px] uppercase tracking-[0.3em] text-white/44">Upcoming Deadlines</p>
            <Clock3 className="h-4 w-4 text-[#E8D7AA]" />
          </div>
          <div className="mt-6 space-y-5">
            {deadlinePreview.map((item, index) => (
              <div key={`${item.label}-${item.task}`} className="grid grid-cols-[4.5rem_1fr] gap-4">
                <div className="relative">
                  <p className={`text-sm ${index === 0 ? 'text-[#E8D7AA]' : 'text-white/56'}`}>{item.label}</p>
                  {index !== deadlinePreview.length - 1 && (
                    <div className="absolute left-[2.2rem] top-7 h-[calc(100%+0.5rem)] w-px bg-white/10" />
                  )}
                </div>
                <div className="relative rounded-[1.2rem] border border-white/6 bg-white/[0.03] px-4 py-3">
                  <div className="absolute left-0 top-4 h-6 w-px bg-[#E8D7AA]" />
                  <p className="text-sm text-white">{item.task}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.25em] text-white/36">{item.owner}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
}
