export type MissionTaskStatus = 'Not Started' | 'In Progress' | 'Completed' | 'On Hold';
export type MissionTaskPriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type ResearchBucket = 'Clients' | 'Ideas' | 'Documents';
export type FileCategory = 'Pitch decks' | 'Research' | 'Client documents' | 'Assets';

export interface MissionTask {
  id: string;
  title: string;
  owner: string;
  status: MissionTaskStatus;
  deadline: string;
  priority: MissionTaskPriority;
  progress: number;
}

export interface ActivityItem {
  id: string;
  type: 'completed' | 'updated' | 'research' | 'file';
  action: string;
  category: string;
  timestamp: string;
}

export interface ResearchItem {
  id: string;
  bucket: ResearchBucket;
  title: string;
  description: string;
  owner: string;
  source: string;
  dateAdded: string;
  tags: string[];
}

export interface FileItem {
  id: string;
  category: FileCategory;
  title: string;
  subtitle: string;
  owner: string;
  updatedAt: string;
  size: string;
}

export interface GoalItem {
  id: string;
  title: string;
  owner: string;
  progress: number;
  targetDate: string;
}

const seededTasks: MissionTask[] = [
  { id: 'task-01', title: 'Finalize REclose hero messaging', owner: 'Abdoul', status: 'In Progress', deadline: '2026-07-09', priority: 'High', progress: 72 },
  { id: 'task-02', title: 'Reach out to 20 real estate agencies', owner: 'Ameer', status: 'Completed', deadline: '2026-07-08', priority: 'Critical', progress: 100 },
  { id: 'task-03', title: 'Wire landing page analytics events', owner: 'Abdoul', status: 'In Progress', deadline: '2026-07-10', priority: 'High', progress: 54 },
  { id: 'task-04', title: 'Refine REclose pitch deck structure', owner: 'Abdoul', status: 'Completed', deadline: '2026-07-06', priority: 'High', progress: 100 },
  { id: 'task-05', title: 'Publish Dubai objection research digest', owner: 'Noura', status: 'Not Started', deadline: '2026-07-12', priority: 'Medium', progress: 0 },
  { id: 'task-06', title: 'Map outbound follow-up cadence', owner: 'Ameer', status: 'In Progress', deadline: '2026-07-11', priority: 'Medium', progress: 43 },
  { id: 'task-07', title: 'Assemble client onboarding checklist', owner: 'Noura', status: 'Completed', deadline: '2026-07-05', priority: 'Medium', progress: 100 },
  { id: 'task-08', title: 'Draft HOS Labs weekly operator memo', owner: 'Abdoul', status: 'On Hold', deadline: '2026-07-13', priority: 'Low', progress: 25 },
  { id: 'task-09', title: 'QA WhatsApp lead handoff flow', owner: 'Noura', status: 'In Progress', deadline: '2026-07-09', priority: 'High', progress: 61 },
  { id: 'task-10', title: 'Audit CRM pipeline naming', owner: 'Ameer', status: 'Not Started', deadline: '2026-07-14', priority: 'Low', progress: 0 },
  { id: 'task-11', title: 'Prepare launch week founder updates', owner: 'Abdoul', status: 'In Progress', deadline: '2026-07-10', priority: 'Critical', progress: 68 },
  { id: 'task-12', title: 'Secure final testimonials for REclose', owner: 'Ameer', status: 'Not Started', deadline: '2026-07-15', priority: 'Medium', progress: 0 },
  { id: 'task-13', title: 'Rebuild analytics dashboard components', owner: 'Abdoul', status: 'In Progress', deadline: '2026-07-16', priority: 'High', progress: 39 },
  { id: 'task-14', title: 'Format investor update appendix', owner: 'Noura', status: 'Not Started', deadline: '2026-07-17', priority: 'Low', progress: 0 },
  { id: 'task-15', title: 'Collect competitor landing page snapshots', owner: 'Ameer', status: 'Completed', deadline: '2026-07-04', priority: 'Medium', progress: 100 },
  { id: 'task-16', title: 'Review client documents storage taxonomy', owner: 'Noura', status: 'Completed', deadline: '2026-07-07', priority: 'Medium', progress: 100 },
  { id: 'task-17', title: 'Define weekly research publishing cadence', owner: 'Abdoul', status: 'In Progress', deadline: '2026-07-18', priority: 'Medium', progress: 47 },
  { id: 'task-18', title: 'Stage launch partner outreach list', owner: 'Ameer', status: 'Not Started', deadline: '2026-07-19', priority: 'High', progress: 0 },
  { id: 'task-19', title: 'Document internal QA handoff', owner: 'Noura', status: 'Completed', deadline: '2026-07-08', priority: 'Low', progress: 100 },
  { id: 'task-20', title: 'Validate mission-control mobile layouts', owner: 'Abdoul', status: 'In Progress', deadline: '2026-07-09', priority: 'High', progress: 76 },
  { id: 'task-21', title: 'Prototype team velocity forecast', owner: 'Abdoul', status: 'On Hold', deadline: '2026-07-22', priority: 'Medium', progress: 20 },
  { id: 'task-22', title: 'Add file-tagging standards', owner: 'Noura', status: 'Not Started', deadline: '2026-07-21', priority: 'Low', progress: 0 },
  { id: 'task-23', title: 'Run sales objection interview review', owner: 'Ameer', status: 'In Progress', deadline: '2026-07-11', priority: 'Critical', progress: 58 },
  { id: 'task-24', title: 'Clean up old shared asset exports', owner: 'Noura', status: 'Not Started', deadline: '2026-07-23', priority: 'Low', progress: 0 },
];

export const missionActivities: ActivityItem[] = [
  {
    id: 'activity-01',
    type: 'completed',
    action: 'Ameer completed “Reach out to 20 real estate agencies”',
    category: 'Sales / Outreach',
    timestamp: '8h ago',
  },
  {
    id: 'activity-02',
    type: 'updated',
    action: 'Abdoul updated “REclose Pitch Deck”',
    category: 'Documents',
    timestamp: '9h ago',
  },
  {
    id: 'activity-03',
    type: 'research',
    action: 'New research added: “Top 10 objections in real estate”',
    category: 'Research / Clients',
    timestamp: '10h ago',
  },
  {
    id: 'activity-04',
    type: 'file',
    action: 'New file added: “Agency Lead List - Dubai.xlsx”',
    category: 'Files / Leads',
    timestamp: '11h ago',
  },
];

export const researchItems: ResearchItem[] = [
  {
    id: 'research-01',
    bucket: 'Clients',
    title: 'Top 10 objections in Dubai real estate',
    description: 'Interview synthesis from broker and agency calls focused on trust, response time, and platform switching friction.',
    owner: 'Ameer',
    source: 'https://hoslabs.internal/research/dubai-objections',
    dateAdded: '2026-07-06',
    tags: ['Objections', 'Real Estate', 'Sales'],
  },
  {
    id: 'research-02',
    bucket: 'Clients',
    title: 'Agency intake expectations benchmark',
    description: 'Comparison of response-time expectations across premium agencies and white-label partners.',
    owner: 'Noura',
    source: 'https://hoslabs.internal/research/agency-intake',
    dateAdded: '2026-07-05',
    tags: ['Benchmark', 'Agency', 'Ops'],
  },
  {
    id: 'research-03',
    bucket: 'Ideas',
    title: 'Mission-control weekly briefing format',
    description: 'Template for summarizing team velocity, blockers, and growth signals inside one elegant status broadcast.',
    owner: 'Abdoul',
    source: 'https://hoslabs.internal/ideas/briefing-format',
    dateAdded: '2026-07-04',
    tags: ['Internal OS', 'Reporting', 'Leadership'],
  },
  {
    id: 'research-04',
    bucket: 'Ideas',
    title: 'Operator-facing file taxonomy refresh',
    description: 'Proposal for categorizing decks, research, outreach lists, and reusable assets more cleanly.',
    owner: 'Noura',
    source: 'https://hoslabs.internal/ideas/file-taxonomy',
    dateAdded: '2026-07-03',
    tags: ['Files', 'System Design', 'Ops'],
  },
  {
    id: 'research-05',
    bucket: 'Documents',
    title: 'REclose launch memo',
    description: 'Narrative doc covering positioning, rollout goals, and key dependencies before launch week.',
    owner: 'Abdoul',
    source: 'https://hoslabs.internal/docs/reclose-launch-memo',
    dateAdded: '2026-07-02',
    tags: ['Launch', 'Docs', 'Strategy'],
  },
  {
    id: 'research-06',
    bucket: 'Documents',
    title: 'HOS Labs investor appendix',
    description: 'Reference material with traction snapshots, market framing, and team execution notes.',
    owner: 'Ameer',
    source: 'https://hoslabs.internal/docs/investor-appendix',
    dateAdded: '2026-07-01',
    tags: ['Investor', 'Metrics', 'Docs'],
  },
];

export const fileItems: FileItem[] = [
  { id: 'file-01', category: 'Pitch decks', title: 'REclose Pitch Deck', subtitle: 'Version 4.2 · Founder narrative refresh', owner: 'Abdoul', updatedAt: '2h ago', size: '18.4 MB' },
  { id: 'file-02', category: 'Pitch decks', title: 'HOS Labs Vision Deck', subtitle: 'Board-facing strategy deck', owner: 'Ameer', updatedAt: '1d ago', size: '21.1 MB' },
  { id: 'file-03', category: 'Research', title: 'Dubai Objections Research', subtitle: 'Interview synthesis and category mapping', owner: 'Noura', updatedAt: '6h ago', size: '2.6 MB' },
  { id: 'file-04', category: 'Research', title: 'Agency Benchmark Notes', subtitle: 'Response-time expectations audit', owner: 'Ameer', updatedAt: '9h ago', size: '1.2 MB' },
  { id: 'file-05', category: 'Client documents', title: 'Agency Lead List - Dubai.xlsx', subtitle: 'Qualified agencies for outreach sprint', owner: 'Ameer', updatedAt: '11h ago', size: '768 KB' },
  { id: 'file-06', category: 'Client documents', title: 'REclose MVP Scope', subtitle: 'Signed internal scope and milestone sheet', owner: 'Abdoul', updatedAt: '14h ago', size: '4.8 MB' },
  { id: 'file-07', category: 'Assets', title: 'Motion Hero Renders', subtitle: 'Website hero stills and export pack', owner: 'Noura', updatedAt: '1d ago', size: '124 MB' },
  { id: 'file-08', category: 'Assets', title: 'Brand Marks Archive', subtitle: 'SVG, PNG, monochrome and favicon set', owner: 'Noura', updatedAt: '2d ago', size: '12.3 MB' },
];

export const companyGoals: GoalItem[] = [
  { id: 'goal-01', title: 'Launch REclose MVP', owner: 'Abdoul', progress: 68, targetDate: 'June 30, 2025' },
  { id: 'goal-02', title: 'Close 3 pilot partners', owner: 'Ameer', progress: 52, targetDate: 'July 15, 2025' },
  { id: 'goal-03', title: 'Standardize research operating system', owner: 'Noura', progress: 74, targetDate: 'July 21, 2025' },
];

export const weeklyProgressSeries = [28, 40, 38, 55, 50, 61, 72];
export const weeklyCompletedTasks = [3, 5, 4, 6, 7, 6, 8];
export const memberContribution = [
  { name: 'Abdoul', completed: 11, active: 6 },
  { name: 'Ameer', completed: 7, active: 5 },
  { name: 'Noura', completed: 6, active: 4 },
];

export const missionPreview = {
  label: 'CURRENT MISSION',
  title: 'Launch REclose MVP',
  deadline: 'June 30, 2025',
  progress: 68,
  completedTasks: 41,
  totalTasks: 60,
  remainingDays: 19,
};

function normalizeStatus(value: string | undefined): MissionTaskStatus {
  const normalized = (value || '').toLowerCase().trim();
  if (normalized === 'completed' || normalized === 'done') return 'Completed';
  if (normalized === 'on hold' || normalized === 'hold') return 'On Hold';
  if (normalized === 'in progress' || normalized === 'active') return 'In Progress';
  return 'Not Started';
}

function normalizePriority(value: string | undefined): MissionTaskPriority {
  const normalized = (value || '').toLowerCase().trim();
  if (normalized === 'critical' || normalized === 'urgent') return 'Critical';
  if (normalized === 'high') return 'High';
  if (normalized === 'low') return 'Low';
  return 'Medium';
}

function mapSpreadsheetTask(raw: Record<string, unknown>, index: number): MissionTask {
  const get = (...keys: string[]) => {
    for (const key of keys) {
      if (raw[key] !== undefined && raw[key] !== null) return String(raw[key]);
    }
    return '';
  };

  const progressValue = Number(get('progress', 'Progress', 'completion'));

  return {
    id: get('id', 'ID') || `sheet-task-${index + 1}`,
    title: get('task', 'Task', 'title', 'Title') || `Imported task ${index + 1}`,
    owner: get('owner', 'Owner', 'assigned_to', 'Assigned To') || 'Unassigned',
    status: normalizeStatus(get('status', 'Status')),
    deadline: get('deadline', 'Deadline', 'due_date', 'Due Date') || 'TBD',
    priority: normalizePriority(get('priority', 'Priority')),
    progress: Number.isFinite(progressValue) ? Math.max(0, Math.min(100, progressValue)) : 0,
  };
}

export async function fetchMissionTasks(): Promise<{ tasks: MissionTask[]; source: 'sheet' | 'local' }> {
  const sheetUrl = import.meta.env.VITE_TASKS_SHEET_URL;

  if (sheetUrl) {
    try {
      const response = await fetch(sheetUrl);
      if (!response.ok) throw new Error('Failed to fetch spreadsheet data');

      const payload = await response.json();
      const taskRows = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.rows)
          ? payload.rows
          : Array.isArray(payload?.data)
            ? payload.data
            : [];

      if (taskRows.length > 0) {
        return {
          tasks: taskRows.map((row: Record<string, unknown>, index: number) => mapSpreadsheetTask(row, index)),
          source: 'sheet',
        };
      }
    } catch (_error) {
      // Fall back to local seeded data when the live sheet is unavailable.
    }
  }

  return { tasks: seededTasks, source: 'local' };
}

export function buildTaskBreakdown(tasks: MissionTask[]) {
  return {
    total: tasks.length,
    inProgress: tasks.filter((task) => task.status === 'In Progress').length,
    notStarted: tasks.filter((task) => task.status === 'Not Started').length,
    completed: tasks.filter((task) => task.status === 'Completed').length,
    onHold: tasks.filter((task) => task.status === 'On Hold').length,
  };
}
