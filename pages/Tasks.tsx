import React, { useState } from 'react';
import { LayoutGrid, List, Search, Plus, Loader2 } from 'lucide-react';
import { googleSheetsAPI, Task } from '../lib/googleSheets';
import { useSheetsData } from '../hooks/useSheetsData';
import { useGoogleAuth } from '../context/GoogleAuthContext';
import { toast } from 'sonner';

const Tasks: React.FC = () => {
  const { data: tasks, loading, refetch } = useSheetsData(googleSheetsAPI.getTasks);
  const { spreadsheetId, accessToken } = useGoogleAuth();
  
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');

  const filteredTasks = tasks.filter(t => 
    t.task?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.owner?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'bg-green-50 text-green-700';
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

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskName.trim() || !spreadsheetId || !accessToken) return;
    
    setIsAdding(true);
    try {
      const newTaskObj = {
        id: crypto.randomUUID(),
        task: newTaskName,
        owner: 'Current User',
        role: 'Team Member',
        status: 'Not Started',
        priority: 'Medium',
        deadline: new Date().toISOString().split('T')[0],
        progress: '0',
        category: 'General',
        last_updated: new Date().toISOString().split('T')[0],
        notes: ''
      };
      
      const success = await googleSheetsAPI.addTask(newTaskObj, spreadsheetId, accessToken);
      if (success) {
        toast.success('Task added to Google Sheets!');
        setNewTaskName('');
        refetch(); // Reload the data
      } else {
        toast.error('Failed to add task');
      }
    } catch (err) {
      toast.error('Error adding task');
      console.error(err);
    } finally {
      setIsAdding(false);
    }
  };

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

      {/* Quick Add Task */}
      <form onSubmit={handleAddTask} className="premium-card p-4 flex gap-3 items-center">
        <input 
          type="text"
          placeholder="New task name..."
          value={newTaskName}
          onChange={(e) => setNewTaskName(e.target.value)}
          className="flex-1 bg-transparent border-none focus:outline-none text-sm placeholder:text-gray-400"
          disabled={isAdding}
        />
        <button 
          type="submit"
          disabled={isAdding || !newTaskName.trim()}
          className="px-4 py-2 bg-[#050505] disabled:bg-gray-300 text-white text-sm font-semibold rounded-lg flex items-center gap-2"
        >
          {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          Add Task
        </button>
      </form>

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
                <th className="p-4 text-xs font-semibold text-gray-500">Owner</th>
                <th className="p-4 text-xs font-semibold text-gray-500">Status</th>
                <th className="p-4 text-xs font-semibold text-gray-500">Deadline</th>
                <th className="p-4 text-xs font-semibold text-gray-500">Priority</th>
                <th className="p-4 text-xs font-semibold text-gray-500">Last Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTasks.map((task, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50 transition-colors group cursor-pointer">
                  <td className="p-4 text-sm font-medium pr-8">{task.task}</td>
                  <td className="p-4 text-sm text-gray-600 whitespace-nowrap">{task.owner}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-600 font-medium whitespace-nowrap">{task.deadline}</td>
                  <td className={`p-4 text-xs uppercase tracking-wider ${getPriorityColor(task.priority)}`}>{task.priority}</td>
                  <td className="p-4 text-xs text-gray-400 whitespace-nowrap">{task.last_updated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map((task, idx) => (
            <div key={idx} className="premium-card p-5 hover:-translate-y-1 transition-transform cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${getStatusColor(task.status)}`}>
                  {task.status}
                </span>
                <span className={`text-[10px] uppercase tracking-wider ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
              </div>
              <h3 className="font-semibold text-lg leading-tight mb-4">{task.task}</h3>
              
              <div className="space-y-2 mt-auto">
                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                   <div className="bg-[#050505] h-full rounded-full" style={{ width: `${task.progress || 0}%` }} />
                </div>
                <div className="flex items-center justify-between text-xs mt-4">
                  <span className="font-medium text-gray-500">Owner: <span className="text-black">{task.owner}</span></span>
                  <span className="font-medium text-gray-500">{task.deadline}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tasks;
