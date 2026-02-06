import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, BarChart3, Calendar, CheckCircle, Circle, 
  Clock, Flag, Trash2, Edit2, X, ChevronDown, Users,
  Loader2, ArrowRight, GripVertical
} from 'lucide-react';
import { supabase, Project, Task, Lead } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

type ViewMode = 'gantt' | 'pipeline';

const LEAD_STAGES = [
  { id: 'new', name: 'New Leads', color: 'bg-gray-500' },
  { id: 'qualified', name: 'Qualified', color: 'bg-[#C5A059]' },
  { id: 'meeting_scheduled', name: 'Meeting Scheduled', color: 'bg-blue-500' },
  { id: 'closed_won', name: 'Closed Won', color: 'bg-emerald-500' },
  { id: 'closed_lost', name: 'Closed Lost', color: 'bg-red-500' },
];

const Projects: React.FC = () => {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>('pipeline');
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const [projectsRes, tasksRes, leadsRes] = await Promise.all([
        supabase.from('projects').select('*').eq('user_id', user?.id).order('created_at', { ascending: false }),
        supabase.from('tasks').select('*').eq('user_id', user?.id).order('due_date', { ascending: true }),
        supabase.from('leads').select('*').eq('user_id', user?.id).order('created_at', { ascending: false })
      ]);

      setProjects(projectsRes.data || []);
      setTasks(tasksRes.data || []);
      setLeads(leadsRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    const { error } = await supabase
      .from('leads')
      .update({ status: newStatus })
      .eq('id', leadId);

    if (!error) {
      setLeads(leads.map(l => l.id === leadId ? { ...l, status: newStatus as any } : l));
      toast.success('Lead status updated');

      // Log activity
      await supabase.from('activities').insert({
        user_id: user?.id,
        type: newStatus === 'qualified' ? 'lead_qualified' : 'message_sent',
        title: `Lead moved to ${newStatus.replace('_', ' ')}`,
        metadata: { lead_id: leadId }
      });
    }
  };

  const getLeadsByStage = (stage: string) => leads.filter(l => l.status === stage);

  // Gantt Chart calculations
  const ganttData = useMemo(() => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 7);
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + 30);
    
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    return { startDate, endDate, totalDays };
  }, [tasks]);

  const getTaskPosition = (task: Task) => {
    if (!task.start_date || !task.due_date) return null;
    
    const start = new Date(task.start_date);
    const end = new Date(task.due_date);
    
    const startOffset = Math.max(0, Math.ceil((start.getTime() - ganttData.startDate.getTime()) / (1000 * 60 * 60 * 24)));
    const duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    return {
      left: `${(startOffset / ganttData.totalDays) * 100}%`,
      width: `${(duration / ganttData.totalDays) * 100}%`
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div data-testid="projects-page" className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight font-[Manrope]">Projects & Pipeline</h1>
          <p className="text-gray-500 mt-1">Track leads and business tasks</p>
        </div>
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center p-1 bg-black/40 border border-white/10 rounded-xl">
            <button
              onClick={() => setViewMode('pipeline')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === 'pipeline'
                  ? 'bg-[#C5A059]/10 text-[#C5A059]'
                  : 'text-gray-500 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4 inline-block mr-2" />
              Pipeline
            </button>
            <button
              onClick={() => setViewMode('gantt')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === 'gantt'
                  ? 'bg-[#C5A059]/10 text-[#C5A059]'
                  : 'text-gray-500 hover:text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4 inline-block mr-2" />
              Gantt
            </button>
          </div>
          
          {viewMode === 'gantt' && (
            <button
              onClick={() => setShowCreateProject(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#C5A059] text-black rounded-xl font-medium hover:bg-[#C5A059]/90 transition-colors"
            >
              <Plus className="w-5 h-5" />
              New Project
            </button>
          )}
        </div>
      </div>

      {viewMode === 'pipeline' ? (
        /* Pipeline View */
        <div className="flex gap-4 overflow-x-auto pb-4">
          {LEAD_STAGES.map((stage) => (
            <div key={stage.id} className="flex-shrink-0 w-72">
              <div className="backdrop-blur-xl bg-black/40 border border-white/10 rounded-2xl overflow-hidden">
                {/* Stage Header */}
                <div className="p-4 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                    <span className="text-sm font-medium text-white">{stage.name}</span>
                  </div>
                  <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded-full">
                    {getLeadsByStage(stage.id).length}
                  </span>
                </div>

                {/* Stage Content */}
                <div className="p-3 space-y-3 min-h-[300px]">
                  {getLeadsByStage(stage.id).map((lead) => (
                    <div
                      key={lead.id}
                      draggable
                      onDragStart={(e) => e.dataTransfer.setData('leadId', lead.id)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const leadId = e.dataTransfer.getData('leadId');
                        if (leadId) updateLeadStatus(leadId, stage.id);
                      }}
                      className="p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 cursor-grab active:cursor-grabbing transition-all group"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[#C5A059]/10 flex items-center justify-center">
                            <span className="text-[#C5A059] text-xs font-bold">
                              {lead.name?.charAt(0) || '?'}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{lead.name || 'Unknown'}</p>
                            <p className="text-xs text-gray-500">{lead.email}</p>
                          </div>
                        </div>
                        <GripVertical className="w-4 h-4 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      
                      {/* Qualification dots */}
                      <div className="flex items-center gap-1 mt-2">
                        <div className={`w-2 h-2 rounded-full ${lead.has_budget ? 'bg-[#C5A059]' : 'bg-gray-700'}`} title="Budget" />
                        <div className={`w-2 h-2 rounded-full ${lead.has_timeline ? 'bg-[#C5A059]' : 'bg-gray-700'}`} title="Timeline" />
                        <div className={`w-2 h-2 rounded-full ${lead.has_authority ? 'bg-[#C5A059]' : 'bg-gray-700'}`} title="Authority" />
                        <span className="text-[10px] text-gray-600 ml-1">Score</span>
                      </div>
                    </div>
                  ))}
                  
                  {/* Drop zone indicator */}
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const leadId = e.dataTransfer.getData('leadId');
                      if (leadId) updateLeadStatus(leadId, stage.id);
                    }}
                    className="h-20 border-2 border-dashed border-white/5 rounded-xl flex items-center justify-center text-gray-600 text-xs"
                  >
                    Drop lead here
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Gantt View */
        <div className="space-y-4">
          {/* Project Cards */}
          {projects.length === 0 ? (
            <div className="backdrop-blur-xl bg-black/40 border border-white/10 rounded-2xl p-12 text-center">
              <BarChart3 className="w-12 h-12 text-gray-700 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No projects yet</h3>
              <p className="text-gray-500 text-sm mb-4">Create a project to start tracking tasks</p>
              <button
                onClick={() => setShowCreateProject(true)}
                className="px-4 py-2 bg-[#C5A059] text-black rounded-xl font-medium"
              >
                Create Project
              </button>
            </div>
          ) : (
            projects.map((project) => (
              <div key={project.id} className="backdrop-blur-xl bg-black/40 border border-white/10 rounded-2xl overflow-hidden">
                {/* Project Header */}
                <div className="p-4 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: project.color }} />
                    <h3 className="text-lg font-semibold text-white">{project.name}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      project.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' :
                      project.status === 'completed' ? 'bg-blue-500/10 text-blue-400' :
                      'bg-gray-500/10 text-gray-400'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <button
                    onClick={() => { setSelectedProject(project.id); setShowCreateTask(true); }}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white/5 text-white rounded-lg text-sm hover:bg-white/10 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Task
                  </button>
                </div>

                {/* Gantt Timeline */}
                <div className="p-4">
                  {/* Date Header */}
                  <div className="flex mb-4 border-b border-white/5 pb-2">
                    <div className="w-48 flex-shrink-0" />
                    <div className="flex-1 flex">
                      {Array.from({ length: Math.min(ganttData.totalDays, 14) }).map((_, i) => {
                        const date = new Date(ganttData.startDate);
                        date.setDate(date.getDate() + i * 3);
                        return (
                          <div key={i} className="flex-1 text-center">
                            <span className="text-[10px] text-gray-500">
                              {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Tasks */}
                  <div className="space-y-2">
                    {tasks.filter(t => t.project_id === project.id).map((task) => {
                      const position = getTaskPosition(task);
                      return (
                        <div key={task.id} className="flex items-center">
                          <div className="w-48 flex-shrink-0 pr-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={async () => {
                                  const newStatus = task.status === 'completed' ? 'todo' : 'completed';
                                  await supabase.from('tasks').update({ status: newStatus }).eq('id', task.id);
                                  setTasks(tasks.map(t => t.id === task.id ? { ...t, status: newStatus as any } : t));
                                }}
                                className="flex-shrink-0"
                              >
                                {task.status === 'completed' ? (
                                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                                ) : (
                                  <Circle className="w-4 h-4 text-gray-600" />
                                )}
                              </button>
                              <span className={`text-sm truncate ${
                                task.status === 'completed' ? 'text-gray-500 line-through' : 'text-white'
                              }`}>
                                {task.title}
                              </span>
                            </div>
                          </div>
                          <div className="flex-1 h-8 relative bg-white/[0.02] rounded">
                            {position && (
                              <div
                                className={`absolute top-1 bottom-1 rounded ${
                                  task.status === 'completed' ? 'bg-emerald-500/50' :
                                  task.priority === 'urgent' ? 'bg-red-500/50' :
                                  task.priority === 'high' ? 'bg-[#FF6B2B]/50' :
                                  'bg-[#C5A059]/50'
                                }`}
                                style={position}
                              />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Create Project Modal */}
      {showCreateProject && (
        <CreateProjectModal
          onClose={() => setShowCreateProject(false)}
          onCreated={(project) => {
            setProjects([project, ...projects]);
            setShowCreateProject(false);
          }}
          userId={user?.id || ''}
        />
      )}

      {/* Create Task Modal */}
      {showCreateTask && selectedProject && (
        <CreateTaskModal
          projectId={selectedProject}
          onClose={() => { setShowCreateTask(false); setSelectedProject(null); }}
          onCreated={(task) => {
            setTasks([...tasks, task]);
            setShowCreateTask(false);
            setSelectedProject(null);
          }}
          userId={user?.id || ''}
        />
      )}
    </div>
  );
};

// Create Project Modal
const CreateProjectModal: React.FC<{
  onClose: () => void;
  onCreated: (project: Project) => void;
  userId: string;
}> = ({ onClose, onCreated, userId }) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#C5A059');
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) return;
    setCreating(true);
    
    const { data, error } = await supabase
      .from('projects')
      .insert({ user_id: userId, name, color, status: 'active' })
      .select()
      .single();

    if (!error && data) {
      toast.success('Project created');
      onCreated(data);
    } else {
      toast.error('Failed to create project');
    }
    setCreating(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-md bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h3 className="text-lg font-semibold text-white">New Project</h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 text-gray-400"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-widest">Project Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#C5A059]/50"
              placeholder="Q1 Sales Campaign"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-widest">Color</label>
            <div className="flex gap-2">
              {['#C5A059', '#FF6B2B', '#3B82F6', '#10B981', '#8B5CF6', '#EC4899'].map(c => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-lg transition-all ${color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-[#0A0A0A]' : ''}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-white/5">
          <button
            onClick={handleCreate}
            disabled={creating || !name.trim()}
            className="w-full py-3 bg-[#C5A059] text-black rounded-xl font-medium hover:bg-[#C5A059]/90 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {creating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
            Create Project
          </button>
        </div>
      </div>
    </div>
  );
};

// Create Task Modal
const CreateTaskModal: React.FC<{
  projectId: string;
  onClose: () => void;
  onCreated: (task: Task) => void;
  userId: string;
}> = ({ projectId, onClose, onCreated, userId }) => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    if (!title.trim()) return;
    setCreating(true);
    
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        user_id: userId,
        project_id: projectId,
        title,
        priority,
        start_date: startDate || null,
        due_date: dueDate || null,
        status: 'todo',
        progress: 0
      })
      .select()
      .single();

    if (!error && data) {
      toast.success('Task created');
      onCreated(data);
    } else {
      toast.error('Failed to create task');
    }
    setCreating(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-md bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h3 className="text-lg font-semibold text-white">New Task</h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 text-gray-400"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-widest">Task Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#C5A059]/50"
              placeholder="Follow up with leads"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-widest">Priority</label>
            <div className="flex gap-2">
              {(['low', 'medium', 'high', 'urgent'] as const).map(p => (
                <button
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    priority === p
                      ? p === 'urgent' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                        p === 'high' ? 'bg-[#FF6B2B]/20 text-[#FF6B2B] border border-[#FF6B2B]/30' :
                        p === 'medium' ? 'bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/30' :
                        'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                      : 'bg-white/5 text-gray-500 border border-white/10'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-widest">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#C5A059]/50"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-widest">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#C5A059]/50"
              />
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-white/5">
          <button
            onClick={handleCreate}
            disabled={creating || !title.trim()}
            className="w-full py-3 bg-[#C5A059] text-black rounded-xl font-medium hover:bg-[#C5A059]/90 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {creating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
            Create Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default Projects;
