import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutGrid,
  List,
  RefreshCw,
  Search,
  TableProperties,
} from 'lucide-react';
import {
  fetchMissionTasks,
  MissionTask,
  MissionTaskStatus,
} from '../lib/hosMissionControl';

const statusOptions: Array<MissionTaskStatus | 'All'> = [
  'All',
  'Not Started',
  'In Progress',
  'Completed',
  'On Hold',
];

function getStatusStyles(status: MissionTaskStatus) {
  switch (status) {
    case 'Completed':
      return 'bg-emerald-500/12 text-emerald-200 border-emerald-400/16';
    case 'In Progress':
      return 'bg-[#E8D7AA]/12 text-[#F3E8C8] border-[#E8D7AA]/18';
    case 'On Hold':
      return 'bg-[#CB8671]/12 text-[#F0C4B5] border-[#CB8671]/18';
    default:
      return 'bg-white/8 text-white/62 border-white/10';
  }
}

function getPriorityStyles(priority: MissionTask['priority']) {
  switch (priority) {
    case 'Critical':
      return 'text-[#F7BC9D]';
    case 'High':
      return 'text-[#E8D7AA]';
    case 'Low':
      return 'text-white/42';
    default:
      return 'text-white/62';
  }
}

export default function Tasks() {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<MissionTask[]>([]);
  const [source, setSource] = useState<'sheet' | 'local'>('local');
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<MissionTaskStatus | 'All'>('All');

  useEffect(() => {
    let active = true;

    async function loadTasks() {
      setLoading(true);
      const result = await fetchMissionTasks();
      if (!active) return;
      setTasks(result.tasks);
      setSource(result.source);
      setLoading(false);
    }

    loadTasks();

    return () => {
      active = false;
    };
  }, []);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.owner.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || task.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [tasks, searchTerm, statusFilter]);

  return (
    <div className="space-y-6 pb-28">
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="hos-panel rounded-[2rem] p-5 sm:p-6"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.34em] text-[#E8D7AA]/82">Tasks</p>
            <h1 className="mt-3 text-[2.3rem] font-semibold leading-[0.95] tracking-[-0.06em] text-white">
              Team execution board
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-white/58">
              Switch between table and card view. If a spreadsheet feed is configured, this page reads tasks live from Google Sheets; otherwise it falls back to the internal task board.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white/66">
              <RefreshCw className="h-4 w-4 text-[#E8D7AA]" />
              {source === 'sheet' ? 'Live spreadsheet sync' : 'Internal task board'}
            </div>
            <div className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] p-1">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`lux-button inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm ${viewMode === 'table' ? 'bg-[#E8D7AA] text-black' : 'text-white/62 hover:text-white'}`}
              >
                <TableProperties className="h-4 w-4" />
                Table
              </button>
              <button
                type="button"
                onClick={() => setViewMode('card')}
                className={`lux-button inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm ${viewMode === 'card' ? 'bg-[#E8D7AA] text-black' : 'text-white/62 hover:text-white'}`}
              >
                <LayoutGrid className="h-4 w-4" />
                Cards
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-[1fr_auto]">
          <label className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/32" />
            <input
              type="text"
              placeholder="Search tasks or owners"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-full rounded-[1.15rem] border border-white/10 bg-[#08090B] py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-white/24 focus:border-[#E8D7AA] focus:outline-none"
            />
          </label>

          <div className="inline-flex flex-wrap gap-2 rounded-[1.15rem] border border-white/10 bg-[#08090B] p-1">
            {statusOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setStatusFilter(option)}
                className={`lux-button rounded-[0.9rem] px-4 py-2 text-sm ${
                  statusFilter === option
                    ? 'bg-white text-black'
                    : 'text-white/54 hover:text-white'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </motion.section>

      {loading ? (
        <div className="grid gap-4">
          <div className="h-28 rounded-[1.8rem] bg-white/[0.03] hos-shimmer" />
          <div className="h-28 rounded-[1.8rem] bg-white/[0.03] hos-shimmer" />
          <div className="h-28 rounded-[1.8rem] bg-white/[0.03] hos-shimmer" />
        </div>
      ) : viewMode === 'table' ? (
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="hos-panel overflow-hidden rounded-[2rem]"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="border-b border-white/8 text-[11px] uppercase tracking-[0.28em] text-white/38">
                  <th className="px-5 py-4 font-medium">Task</th>
                  <th className="px-5 py-4 font-medium">Owner</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                  <th className="px-5 py-4 font-medium">Deadline</th>
                  <th className="px-5 py-4 font-medium">Priority</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((task) => (
                  <tr key={task.id} className="border-b border-white/6 last:border-b-0">
                    <td className="px-5 py-4">
                      <p className="font-medium text-white">{task.title}</p>
                      <div className="mt-2 h-1.5 rounded-full bg-white/8">
                        <div
                          className="h-full rounded-full bg-[linear-gradient(90deg,#F2E2B7_0%,#E8D7AA_100%)]"
                          style={{ width: `${task.progress}%` }}
                        />
                      </div>
                    </td>
                    <td className="px-5 py-4 text-white/62">{task.owner}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex rounded-full border px-3 py-1 text-xs ${getStatusStyles(task.status)}`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-white/62">{task.deadline}</td>
                    <td className={`px-5 py-4 text-sm font-medium ${getPriorityStyles(task.priority)}`}>{task.priority}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.section>
      ) : (
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="grid gap-4 xl:grid-cols-2"
        >
          {filteredTasks.map((task) => (
            <div key={task.id} className="hos-panel rounded-[1.8rem] p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.28em] text-white/34">{task.owner}</p>
                  <h3 className="mt-3 text-xl font-semibold tracking-[-0.04em] text-white">{task.title}</h3>
                </div>
                <span className={`inline-flex rounded-full border px-3 py-1 text-xs ${getStatusStyles(task.status)}`}>
                  {task.status}
                </span>
              </div>

              <div className="mt-6 h-2 rounded-full bg-white/8">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,#F2E2B7_0%,#E8D7AA_100%)]"
                  style={{ width: `${task.progress}%` }}
                />
              </div>

              <div className="mt-5 grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-white/34">Progress</p>
                  <p className="mt-2 text-white">{task.progress}%</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-white/34">Deadline</p>
                  <p className="mt-2 text-white">{task.deadline}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-white/34">Priority</p>
                  <p className={`mt-2 ${getPriorityStyles(task.priority)}`}>{task.priority}</p>
                </div>
              </div>
            </div>
          ))}
        </motion.section>
      )}

      {!loading && filteredTasks.length === 0 && (
        <div className="hos-panel rounded-[1.8rem] p-10 text-center">
          <List className="mx-auto h-8 w-8 text-white/26" />
          <p className="mt-4 text-lg text-white">No tasks match the current filters.</p>
          <p className="mt-2 text-sm text-white/48">Adjust the status filter or search query to reveal more work.</p>
        </div>
      )}
    </div>
  );
}
