import React, { useState } from 'react';
import { LayoutGrid, List, Search, Plus, Loader2, Sparkles, X, CheckCircle2, Trash2 } from 'lucide-react';
import { googleSheetsAPI, Task } from '../lib/googleSheets';
import { useSheetsData } from '../hooks/useSheetsData';
import { useGoogleAuth } from '../context/GoogleAuthContext';
import { useAuth } from '../context/AuthContext';
import { parseTaskFromText, ParsedTask } from '../lib/ai';
import { toast } from 'sonner';
import { SwipeableList, SwipeableListItem, SwipeAction } from '../components/ui/be-ui-swipeable-list';
import { logDashboardActivity } from '../lib/supabase';

const Tasks: React.FC = () => {
  const { data: tasks, loading, refetch } = useSheetsData(googleSheetsAPI.getTasks);
  const { spreadsheetId, accessToken } = useGoogleAuth();
  const { user } = useAuth();
  
  const [viewMode, setViewMode] = useState<'table' | 'card'>('card');
  const [searchTerm, setSearchTerm] = useState('');
  
  // AI Task State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newTaskInput, setNewTaskInput] = useState('');
  const [parsedPreview, setParsedPreview] = useState<ParsedTask | null>(null);

  const filteredTasks = tasks.filter(t => {
    // Hide completed tasks that are older than 12 hours
    if (t.status?.toLowerCase() === 'done' && t.completed_at) {
      const completedTime = new Date(t.completed_at).getTime();
      const now = Date.now();
      const twelveHours = 12 * 60 * 60 * 1000;
      if (now - completedTime > twelveHours) {
        return false;
      }
    }

    const taskName = t.task || '';
    const taskUser = t.user || '';
    return taskName.toLowerCase().includes(searchTerm.toLowerCase()) || 
           taskUser.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'done':
      case 'completed': return 'bg-[#D6B36B]/10 text-[#C5A059] border border-[#D6B36B]/20';
      case 'in progress': return 'bg-blue-50 text-blue-700';
      case 'not started': return 'bg-gray-100 text-gray-700';
      case 'blocked': return 'bg-red-50 text-red-700';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'text-orange-600 font-bold';
      case 'medium': return 'text-yellow-600 font-semibold';
      case 'low': return 'text-gray-500 font-medium';
      default: return 'text-gray-600';
    }
  };

  const handleAnalyzeTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskInput.trim() || !spreadsheetId || !accessToken) return;
    
    setIsAnalyzing(true);
    try {
      // Pass an empty string for API key since we're using local regex extraction now
      const parsed = await parseTaskFromText(newTaskInput, '');
      if (parsed) {
        setParsedPreview(parsed);
      } else {
        toast.error('Could not parse task details.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error parsing task');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleConfirmTask = async () => {
    if (!parsedPreview || !spreadsheetId || !accessToken) return;
    
    setIsSaving(true);
    try {
      const ownerName = user?.user_metadata?.full_name || user?.email || 'Unknown User';
      
      const newTaskObj = {
        id: crypto.randomUUID(),
        task: parsedPreview.task,
        user: ownerName,
        role: 'Team Member',
        status: parsedPreview.status,
        priority: parsedPreview.priority,
        deadline: parsedPreview.deadline,
        progress: '0',
        category: 'General',
        last_updated: new Date().toISOString().split('T')[0],
        notes: ''
      };
      
      const success = await googleSheetsAPI.addTask(newTaskObj, spreadsheetId, accessToken);
      if (success) {
        toast.success('Task added to Google Sheets!');
        await logDashboardActivity(ownerName, 'Task Added', `Added new task: ${newTaskObj.task}`);
        setNewTaskInput('');
        setParsedPreview(null);
        refetch(); // Reload the data
      } else {
        toast.error('Failed to add task');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error adding task');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCompleteTask = async (task: Task) => {
    if (!task._rowIndex || !spreadsheetId || !accessToken) return;
    try {
      const updatedTask = {
        ...task,
        status: 'Done',
        completed_at: new Date().toISOString()
      };
      // Explicitly delete _rowIndex before sending to API so it doesn't get inserted as a column
      delete updatedTask._rowIndex;

      await googleSheetsAPI.updateTask(task._rowIndex, updatedTask, spreadsheetId, accessToken);
      toast.success('Task marked as completed!');
      const ownerName = user?.user_metadata?.full_name || user?.email || 'Unknown User';
      await logDashboardActivity(ownerName, 'Task Completed', `Completed task: ${task.task}`);
      refetch();
    } catch (err: any) {
      toast.error(err.message || 'Failed to complete task');
    }
  };

  const handleDeleteTask = async (task: Task) => {
    if (!task._rowIndex || !spreadsheetId || !accessToken) return;
    try {
      await googleSheetsAPI.deleteTask(task._rowIndex, spreadsheetId, accessToken);
      
      // Also remove it from recent activity (activity_log)
      await supabase
        .from('activity_log')
        .delete()
        .ilike('action_type', 'Task%')
        .ilike('description', `%${task.task}%`);

      toast.success('Task deleted permanently');
      refetch();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete task');
    }
  };

  const leftActions: SwipeAction[] = [
    {
      id: "done",
      label: "Done",
      icon: <CheckCircle2 className="h-5 w-5" />,
      tone: "success",
    }
  ];

  const rightActions: SwipeAction[] = [
    {
      id: "trash",
      label: "Trash",
      icon: <Trash2 className="h-5 w-5" />,
      tone: "danger",
    }
  ];

  const swipeableItems: SwipeableListItem[] = filteredTasks.map((task, idx) => ({
    id: task.id || String(idx),
    leftActions,
    rightActions,
    taskData: task,
  } as any));

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Tasks</h1>
          <p className="text-sm text-gray-500">Manage and track your operational tasks</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search tasks..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
            />
          </div>
          <div className="flex items-center bg-gray-100 p-1 rounded-xl shrink-0">
            <button 
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-black'}`}
            >
              <List className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('card')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'card' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-black'}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Smart Add Task */}
      <div className="space-y-4">
        <form onSubmit={handleAnalyzeTask} className="premium-card p-4 flex gap-3 items-center border-[#D6B36B]/30 bg-white shadow-sm focus-within:border-[#C5A059] transition-colors">
          <Sparkles className="w-5 h-5 text-[#C5A059] shrink-0" />
          <input 
            type="text"
            placeholder="Type a task naturally (e.g., 'Finish landing page by Friday, high priority')"
            value={newTaskInput}
            onChange={(e) => setNewTaskInput(e.target.value)}
            className="flex-1 bg-transparent border-none focus:outline-none text-sm placeholder:text-gray-400"
            disabled={isAnalyzing || isSaving}
          />
          {newTaskInput.trim() && (
            <button
              type="button"
              onClick={() => { setNewTaskInput(''); setParsedPreview(null); }}
              className="p-1 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button 
            type="submit"
            disabled={isAnalyzing || isSaving || !newTaskInput.trim()}
            className="px-5 py-2 bg-[#050505] disabled:bg-gray-300 text-white text-sm font-semibold rounded-lg flex items-center gap-2 shadow-md hover:bg-[#1a1a1a] transition-all"
          >
            {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Generate'}
          </button>
        </form>

        {/* Smart Preview Card */}
        {parsedPreview && (
          <div className="premium-card p-5 border-[#050505]/10 animate-in fade-in slide-in-from-top-2 duration-300 bg-gray-50/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500">Task Preview</h3>
              <span className="text-xs bg-blue-50 text-blue-600 font-semibold px-2 py-1 rounded-md">Smart Recognition</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Task Title</label>
                <input
                  type="text"
                  value={parsedPreview.task}
                  onChange={(e) => setParsedPreview({...parsedPreview, task: e.target.value})}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:border-black"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">User</label>
                <input
                  type="text"
                  value={user?.user_metadata?.full_name || user?.email || 'Unknown User'}
                  disabled
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-500 cursor-not-allowed"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Priority</label>
                <select
                  value={parsedPreview.priority}
                  onChange={(e) => setParsedPreview({...parsedPreview, priority: e.target.value})}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:border-black"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Deadline</label>
                <input
                  type="date"
                  value={parsedPreview.deadline}
                  onChange={(e) => setParsedPreview({...parsedPreview, deadline: e.target.value})}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:border-black"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                onClick={() => setParsedPreview(null)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-black transition-colors"
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmTask}
                disabled={isSaving}
                className="px-6 py-2 bg-[#D6B36B] hover:bg-[#c4a159] text-black text-sm font-semibold rounded-lg flex items-center gap-2 shadow-md transition-all"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Task'}
              </button>
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="w-full h-64 bg-gray-200 rounded-3xl animate-pulse" />
      ) : filteredTasks.length === 0 ? (
        <div className="w-full py-20 text-center text-gray-500 bg-white border border-gray-100 rounded-3xl shadow-sm">
          No tasks found matching your criteria.
        </div>
      ) : viewMode === 'table' ? (
        <div className="premium-card overflow-hidden overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/80">
                <th className="p-4 text-xs font-semibold text-gray-500 w-[30%]">Task</th>
                <th className="p-4 text-xs font-semibold text-gray-500">User</th>
                <th className="p-4 text-xs font-semibold text-gray-500">Status</th>
                <th className="p-4 text-xs font-semibold text-gray-500">Deadline</th>
                <th className="p-4 text-xs font-semibold text-gray-500">Priority</th>
                <th className="p-4 text-xs font-semibold text-gray-500">Last Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTasks.map((task, idx) => {
                const isDone = task.status?.toLowerCase() === 'done' || task.status?.toLowerCase() === 'completed';
                return (
                  <tr key={idx} className="hover:bg-gray-50/50 transition-colors group cursor-pointer">
                    <td className={`p-4 text-sm pr-8 ${isDone ? 'text-gray-400 line-through opacity-70 font-semibold' : 'font-medium'}`}>
                      {task.task}
                    </td>
                    <td className="p-4 text-sm text-gray-600 whitespace-nowrap">{task.user}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-600 font-medium whitespace-nowrap">{task.deadline}</td>
                    <td className={`p-4 text-xs uppercase tracking-wider ${getPriorityColor(task.priority)}`}>{task.priority}</td>
                    <td className="p-4 text-xs text-gray-400 whitespace-nowrap">{task.last_updated}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="w-full max-w-5xl mx-auto">
          <SwipeableList
            items={swipeableItems}
            actionWidth={72}
            revealThreshold={40}
            onAction={({ item, action }) => {
              const task = (item as any).taskData as Task;
              if (action.id === "done") {
                handleCompleteTask(task);
              } else if (action.id === "trash") {
                handleDeleteTask(task);
              }
            }}
            renderItem={(item) => {
              const task = (item as any).taskData as Task;
              const isDone = task.status?.toLowerCase() === 'done' || task.status?.toLowerCase() === 'completed';
              
              return (
                <div className="flex flex-col w-full h-full p-1 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                    <span className={`text-[10px] uppercase tracking-wider ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                  <h3 className={`font-semibold text-lg leading-tight mb-4 ${
                    isDone ? 'text-gray-400 line-through opacity-70' : ''
                  }`}>{task.task}</h3>
                  
                  <div className="space-y-2 mt-auto">
                    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                       <div 
                         className={`h-full rounded-full transition-all duration-500 ${isDone ? 'bg-[#D6B36B]' : 'bg-[#050505]'}`} 
                         style={{ width: isDone ? '100%' : `${task.progress || 0}%` }} 
                       />
                    </div>
                    <div className="flex items-center justify-between text-xs mt-4">
                      <span className="font-medium text-gray-500">User: <span className="text-black">{task.user}</span></span>
                      <span className="font-medium text-gray-500">{task.deadline}</span>
                    </div>
                  </div>
                </div>
              );
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Tasks;
