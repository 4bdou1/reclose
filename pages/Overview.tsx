import React, { useState, useEffect } from 'react';
import { CheckCircle2, FileText, Microscope, RefreshCw, ChevronRight, Activity as ActivityIcon } from 'lucide-react';
import { googleSheetsAPI, AnalyticsData } from '../lib/googleSheets';
import { useSheetsData } from '../hooks/useSheetsData';
import { supabase, Mission } from '../lib/supabase';
import { useGoogleAuth } from '../context/GoogleAuthContext';
import { useAuth } from '../context/AuthContext';

const Overview: React.FC = () => {
  const { user } = useAuth();
  const { accessToken, spreadsheetId, isReady } = useGoogleAuth();
  const { data: tasksData, loading: tasksLoading } = useSheetsData(googleSheetsAPI.getTasks);
  
  const [activeMission, setActiveMission] = useState<Mission | null>(null);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [missionLoading, setMissionLoading] = useState(true);
  
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [isActivityLoading, setIsActivityLoading] = useState(true);

  const loading = isActivityLoading || missionLoading;
  
  // Show all activities from the last 24 hours across all users
  const isSinceYesterday = (dateString: string) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return false;
    const yesterday = new Date();
    yesterday.setHours(yesterday.getHours() - 24);
    return date.getTime() > yesterday.getTime();
  };
  
  const activities = activityLogs.filter(a => isSinceYesterday(a.created_at));
  
  const ownerName = user?.user_metadata?.full_name || user?.email || 'Unknown User';

  const deadlines = tasksData 
    ? tasksData
        .filter(t => t.status !== 'Completed' && t.status !== 'Done' && t.deadline)
        .filter(t => !t.user || t.user.toLowerCase() === ownerName.toLowerCase())
        .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
        .slice(0, 3)
    : [];

  useEffect(() => {
    const fetchActivities = async (showLoading = true) => {
      if (showLoading) setIsActivityLoading(true);
      const { data, error } = await supabase
        .from('activity_log')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (!error && data) {
        setActivityLogs(data);
      }
      if (showLoading) setIsActivityLoading(false);
    };
    
    fetchActivities();
    
    // Optional: Realtime subscription for instant dashboard updates
    const subscription = supabase
      .channel('activity_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'activity_log' }, () => fetchActivities(false))
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  useEffect(() => {
    const fetchMissionData = async (showLoading = true) => {
      if (showLoading) setMissionLoading(true);
      const { data, error } = await supabase.from('missions').select('*').eq('status', 'active').order('created_at', { ascending: false }).limit(1);
      
      if (!error && data && data.length > 0) {
        const mission = data[0];
        setActiveMission(mission);
        
        if (mission.metric_type === 'outreaches' && spreadsheetId && accessToken) {
          try {
            const aData = await googleSheetsAPI.getAnalytics(spreadsheetId, accessToken);
            setAnalyticsData(aData);
          } catch (e) {
            console.error('Failed to fetch analytics for mission', e);
          }
        }
      }
      if (showLoading) setMissionLoading(false);
    };
    
    fetchMissionData();

    // Optional: Realtime subscription for missions
    const subscription = supabase
      .channel('missions_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'missions' }, () => fetchMissionData(false))
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [spreadsheetId, accessToken]);

  const calculateDaysLeft = (targetDate: string) => {
    if (!targetDate) return 0;
    const diffTime = Math.abs(new Date(targetDate).getTime() - new Date().getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  };

  const calculateProgress = (completed: string, total: string) => {
    const c = parseInt(completed) || 0;
    const t = parseInt(total) || 1;
    return Math.round((c / t) * 100);
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6 animate-pulse">
        <div className="h-64 bg-gray-200 rounded-3xl" />
        <div className="h-48 bg-gray-200 rounded-3xl" />
        <div className="h-48 bg-gray-200 rounded-3xl" />
      </div>
    );
  }

  // Count actions from the native activity log that happened in the last 24 hours
  const tasksUpdated = activityLogs.filter(a => (a.action_type === 'Task Added' || a.action_type === 'Task Updated') && isSinceYesterday(a.created_at)).length;
  const tasksCompleted = activityLogs.filter(a => a.action_type === 'Task Completed' && isSinceYesterday(a.created_at)).length;
  const newResearch = activityLogs.filter(a => a.action_type === 'Research Added' && isSinceYesterday(a.created_at)).length;
  const newFilesCount = activityLogs.filter(a => a.action_type === 'File Uploaded' && isSinceYesterday(a.created_at)).length;

  const metrics = [
    { icon: RefreshCw, value: tasksUpdated.toString(), label: 'Tasks added/updated', color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { icon: CheckCircle2, value: tasksCompleted.toString(), label: 'Tasks completed', color: 'text-green-500', bg: 'bg-green-500/10' },
    { icon: Microscope, value: newResearch.toString(), label: 'New research items', color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { icon: FileText, value: newFilesCount.toString(), label: 'New files added', color: 'text-orange-500', bg: 'bg-orange-500/10' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      
      {/* Black Overview Hero Card */}
      <section>
        <div className="black-card p-6 md:p-8">
          <div className="flex items-center justify-between mb-8">
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400">Overview</span>
            <span className="text-[10px] font-medium px-3 py-1 bg-white/10 rounded-full text-white">Since last night</span>
          </div>
          
          <h2 className="text-3xl font-semibold tracking-tight mb-2">Good morning, Abdoul.</h2>
          <p className="text-sm text-gray-400 mb-8">Here's what changed while you were away.</p>

          <div className="grid grid-cols-2 gap-4">
            {metrics.map((m, i) => {
              const Icon = m.icon;
              return (
                <div key={i} className="flex items-start gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/5">
                  <div className={`p-2 rounded-xl ${m.bg}`}>
                    <Icon className={`w-4 h-4 ${m.color}`} />
                  </div>
                  <div>
                    <p className="text-xl font-semibold leading-none mb-1">{m.value}</p>
                    <p className="text-[10px] text-gray-400 leading-tight">{m.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission Progress Section */}
      <section>
        <h3 className="text-xs font-bold tracking-[0.15em] uppercase text-gray-500 mb-4 px-1">Mission Progress</h3>
        
        {activeMission ? (() => {
          const currentMissionValue = activeMission.metric_type === 'outreaches' && analyticsData 
             ? parseInt(analyticsData.overview.totalOutreaches || '0') 
             : activeMission.metric_type === 'tasks' && tasksData
             ? tasksData.filter(t => t.status?.toLowerCase() === 'done' || t.status?.toLowerCase() === 'completed').length
             : activeMission.current_value || 0;

          const targetMissionValue = activeMission.target_value || 1;
          const progressPercent = calculateProgress(currentMissionValue.toString(), targetMissionValue.toString());

          return (
            <div className="premium-card p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path className="text-gray-100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="text-[#050505] transition-all duration-1000 ease-out" strokeDasharray={`${progressPercent}, 100`} strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <span className="absolute text-sm font-bold">{progressPercent}%</span>
                </div>
                
                <div>
                  <h4 className="font-semibold text-lg leading-tight mb-1">{activeMission.mission_name}</h4>
                  <p className="text-xs text-gray-500">Target completion: <span className="text-black font-medium">{new Date(activeMission.target_date).toLocaleDateString()}</span></p>
                </div>
              </div>

              <div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
                  <div 
                    className="h-full bg-[#050505] rounded-full transition-all duration-1000" 
                    style={{ width: `${progressPercent}%` }} 
                  />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-gray-500"><span className="text-black">{currentMissionValue}</span> of {targetMissionValue} {activeMission.metric_type}</span>
                  <span className="font-medium text-black px-2 py-1 bg-gray-100 rounded-md">{calculateDaysLeft(activeMission.target_date)} days left</span>
                </div>
              </div>
            </div>
          );
        })() : (
          <div className="premium-card p-6 flex flex-col items-center justify-center text-center py-12">
            <div className="p-4 bg-gray-50 rounded-full mb-4">
              <CheckCircle2 className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="font-semibold text-lg mb-1">No Active Mission</h4>
            <p className="text-sm text-gray-500 max-w-sm">Head over to Settings to set a new active mission for the team.</p>
          </div>
        )}
      </section>

      {/* Recent Activity */}
      <section>
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="text-xs font-bold tracking-[0.15em] uppercase text-gray-500">Recent Activity</h3>
        </div>
        
        <div className="premium-card overflow-hidden">
          <div className="divide-y divide-gray-100/50 max-h-[350px] overflow-y-auto hide-scrollbar">
            {activities.length > 0 ? activities.map((activity, idx) => {
              const formattedTime = new Date(activity.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              return (
                <div key={idx} className="flex items-start gap-4 p-4 hover:bg-gray-50/50 transition-colors cursor-pointer group">
                  <div className="mt-0.5 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0 group-hover:bg-gray-200 transition-colors">
                    <ActivityIcon className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{activity.user_name} <span className="font-normal text-gray-500">{activity.action_type}</span></p>
                    <p className="text-xs text-[#050505] truncate">"{activity.description}"</p>
                  </div>
                  <span className="text-[10px] text-gray-400 font-medium shrink-0 whitespace-nowrap">{formattedTime}</span>
                </div>
              );
            }) : (
              <div className="p-8 text-center text-sm text-gray-500">No recent activity found.</div>
            )}
          </div>
          
          <button className="w-full p-4 border-t border-gray-100/50 text-xs font-semibold text-gray-500 hover:text-black hover:bg-gray-50 transition-colors flex items-center justify-center gap-1">
            View all activity <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </section>

      {/* Upcoming Deadlines */}
      <section>
        <h3 className="text-xs font-bold tracking-[0.15em] uppercase text-gray-500 mb-4 px-1">Upcoming Deadlines</h3>
        
        <div className="premium-card overflow-hidden overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="p-4 text-xs font-semibold text-gray-500 w-[45%]">Task</th>
                <th className="p-4 text-xs font-semibold text-gray-500">Assigned To</th>
                <th className="p-4 text-xs font-semibold text-gray-500">Due Date</th>
                <th className="p-4 text-xs font-semibold text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100/50">
              {deadlines.length > 0 ? deadlines.map((task, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50 transition-colors group cursor-pointer">
                  <td className="p-4 text-sm font-medium truncate max-w-[200px]">{task.task}</td>
                  <td className="p-4 text-sm text-gray-600">{task.owner}</td>
                  <td className="p-4 text-sm text-gray-600 font-medium">{task.deadline}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider
                      ${task.status === 'In Progress' ? 'bg-blue-50 text-blue-600' : 
                        task.status === 'Not Started' ? 'bg-gray-100 text-gray-600' : 'bg-orange-50 text-orange-600'}`}>
                      {task.status}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-sm text-gray-500">No upcoming deadlines found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
};

export default Overview;
