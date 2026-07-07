import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Gauge, Target, TimerReset } from 'lucide-react';
import {
  buildTaskBreakdown,
  companyGoals,
  fetchMissionTasks,
  memberContribution,
  missionPreview,
  weeklyCompletedTasks,
} from '../lib/hosMissionControl';

export default function Analytics() {
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
    }

    loadTasks();

    return () => {
      active = false;
    };
  }, []);

  const averageVelocity = useMemo(() => {
    const total = weeklyCompletedTasks.reduce((sum, value) => sum + value, 0);
    return (total / weeklyCompletedTasks.length).toFixed(1);
  }, []);

  return (
    <div className="space-y-6 pb-28">
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="hos-panel rounded-[2rem] p-5 sm:p-6"
      >
        <p className="text-[11px] uppercase tracking-[0.34em] text-[#E8D7AA]/82">Analytics</p>
        <h1 className="mt-3 text-[2.3rem] font-semibold leading-[0.95] tracking-[-0.06em] text-white">
          Company goals and team velocity.
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-white/58">
          Track completion percentage, contribution, deadlines, and progress against expected completion time inside one premium operating layer.
        </p>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        className="grid gap-4 xl:grid-cols-3"
      >
        <div className="hos-panel rounded-[1.8rem] p-5">
          <div className="flex items-center justify-between">
            <p className="text-[11px] uppercase tracking-[0.3em] text-white/44">Team Velocity</p>
            <Gauge className="h-4 w-4 text-[#E8D7AA]" />
          </div>
          <div className="mt-6 text-5xl font-semibold tracking-[-0.06em] text-white">{averageVelocity}</div>
          <p className="mt-2 text-white/58">tasks completed per week</p>
          <div className="mt-6 flex h-28 items-end gap-3">
            {weeklyCompletedTasks.map((value, index) => (
              <div key={`${value}-${index}`} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-[1rem] bg-[linear-gradient(180deg,#F5E9C6_0%,rgba(232,215,170,0.22)_100%)]"
                  style={{ height: `${value * 14}px` }}
                />
                <span className="text-[10px] uppercase tracking-[0.24em] text-white/34">W{index + 1}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hos-panel rounded-[1.8rem] p-5">
          <div className="flex items-center justify-between">
            <p className="text-[11px] uppercase tracking-[0.3em] text-white/44">Task State</p>
            <BarChart3 className="h-4 w-4 text-[#E8D7AA]" />
          </div>
          <div className="mt-6 space-y-4">
            {[
              { label: 'In Progress', value: taskBreakdown.inProgress, color: 'bg-[#E8D7AA]' },
              { label: 'Not Started', value: taskBreakdown.notStarted, color: 'bg-[#8E939D]' },
              { label: 'Completed', value: taskBreakdown.completed, color: 'bg-[#8EB391]' },
              { label: 'On Hold', value: taskBreakdown.onHold, color: 'bg-[#CB8671]' },
            ].map((item) => (
              <div key={item.label}>
                <div className="mb-2 flex items-center justify-between text-sm text-white/62">
                  <span>{item.label}</span>
                  <span>{item.value}</span>
                </div>
                <div className="h-2 rounded-full bg-white/8">
                  <div
                    className={`h-full rounded-full ${item.color}`}
                    style={{
                      width: `${taskBreakdown.total === 0 ? 0 : (item.value / taskBreakdown.total) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="hos-panel rounded-[1.8rem] p-5">
          <div className="flex items-center justify-between">
            <p className="text-[11px] uppercase tracking-[0.3em] text-white/44">Expected Completion</p>
            <TimerReset className="h-4 w-4 text-[#E8D7AA]" />
          </div>
          <div className="mt-6 grid gap-4">
            <div className="rounded-[1.4rem] border border-white/8 bg-white/[0.03] p-4">
              <p className="text-[10px] uppercase tracking-[0.25em] text-white/34">Current Mission</p>
              <p className="mt-2 text-xl font-semibold text-white">{missionPreview.title}</p>
              <p className="mt-2 text-sm text-white/54">19 days left until target milestone</p>
            </div>
            <div className="rounded-[1.4rem] border border-white/8 bg-white/[0.03] p-4">
              <p className="text-[10px] uppercase tracking-[0.25em] text-white/34">Projected Completion</p>
              <p className="mt-2 text-xl font-semibold text-white">On track by July 24</p>
              <p className="mt-2 text-sm text-emerald-300">+6% ahead of expected team velocity</p>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
        className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]"
      >
        <div className="hos-panel rounded-[1.8rem] p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <p className="text-[11px] uppercase tracking-[0.3em] text-white/44">Company Goals</p>
            <Target className="h-4 w-4 text-[#E8D7AA]" />
          </div>
          <div className="mt-6 space-y-5">
            {companyGoals.map((goal) => (
              <div key={goal.id} className="rounded-[1.4rem] border border-white/8 bg-white/[0.03] p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold tracking-[-0.03em] text-white">{goal.title}</h2>
                    <p className="mt-2 text-sm text-white/48">Owner: {goal.owner}</p>
                  </div>
                  <span className="text-3xl font-semibold tracking-[-0.05em] text-[#E8D7AA]">{goal.progress}%</span>
                </div>
                <div className="mt-4 h-2 rounded-full bg-white/8">
                  <div
                    className="h-full rounded-full bg-[linear-gradient(90deg,#F4E5BC_0%,#E8D7AA_100%)]"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
                <p className="mt-3 text-sm text-white/44">Target: {goal.targetDate}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="hos-panel rounded-[1.8rem] p-5 sm:p-6">
          <p className="text-[11px] uppercase tracking-[0.3em] text-white/44">Member Contribution</p>
          <div className="mt-6 space-y-4">
            {memberContribution.map((member) => (
              <div key={member.name} className="rounded-[1.4rem] border border-white/8 bg-white/[0.03] p-4">
                <div className="flex items-center justify-between">
                  <p className="text-lg font-semibold text-white">{member.name}</p>
                  <span className="text-sm text-white/44">{member.completed + member.active} active units</span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-[1rem] bg-[#08090B] px-4 py-3">
                    <p className="text-[10px] uppercase tracking-[0.24em] text-white/34">Completed</p>
                    <p className="mt-2 text-2xl font-semibold text-white">{member.completed}</p>
                  </div>
                  <div className="rounded-[1rem] bg-[#08090B] px-4 py-3">
                    <p className="text-[10px] uppercase tracking-[0.24em] text-white/34">In Motion</p>
                    <p className="mt-2 text-2xl font-semibold text-white">{member.active}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
}
