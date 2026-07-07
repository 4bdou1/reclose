import React from 'react';
import { Target, TrendingUp, Users, CalendarDays, CheckCircle } from 'lucide-react';
import { googleSheetsAPI } from '../lib/googleSheets';
import { useSheetsData } from '../hooks/useSheetsData';

const Analytics: React.FC = () => {
  const { data: goalsData, loading: goalsLoading } = useSheetsData(googleSheetsAPI.getGoals);
  const { data: tasksData, loading: tasksLoading } = useSheetsData(googleSheetsAPI.getTasks);

  const loading = goalsLoading || tasksLoading;
  const goal = goalsData && goalsData.length > 0 ? goalsData[0] : null;
  const tasks = tasksData || [];

  const calculateProgress = () => {
    const c = parseInt(goal?.completed_tasks || '0');
    const t = parseInt(goal?.total_tasks || '1');
    return Math.round((c / t) * 100);
  };

  const calculateDaysLeft = () => {
    if (!goal?.target_date) return 0;
    const diffTime = Math.abs(new Date(goal.target_date).getTime() - new Date().getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  };

  // Calculate team contribution
  const teamContribution = tasks.reduce((acc, task) => {
    if (task.status === 'Completed') {
      acc[task.owner] = (acc[task.owner] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const sortedTeam = Object.entries(teamContribution)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  const completedCount = parseInt(goal?.completed_tasks || '0');
  const expectedPace = 50; // Placeholder for expected progress metric
  const currentPace = calculateProgress();
  const isOnTrack = currentPace >= expectedPace;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Analytics</h1>
          <p className="text-sm text-gray-500">Project trajectory and team velocity</p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          <div className="w-full h-32 bg-gray-200 rounded-3xl animate-pulse" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-40 bg-gray-200 rounded-3xl animate-pulse" />
            <div className="h-40 bg-gray-200 rounded-3xl animate-pulse" />
          </div>
        </div>
      ) : (
        <>
          {/* Main Trajectory Card */}
          <div className={`p-6 md:p-8 rounded-[24px] border transition-all ${isOnTrack ? 'bg-[#050505] text-white border-black/10 shadow-[0_12px_40px_-8px_rgba(0,0,0,0.15)]' : 'bg-red-50 text-red-900 border-red-100'}`}>
            <div className="flex items-center justify-between mb-8">
              <span className={`text-[10px] font-bold tracking-[0.2em] uppercase ${isOnTrack ? 'text-gray-400' : 'text-red-700'}`}>Trajectory</span>
              <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${isOnTrack ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-700'}`}>
                {isOnTrack ? 'ON TRACK' : 'BEHIND SCHEDULE'}
              </span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className={`text-[10px] font-medium mb-1 ${isOnTrack ? 'text-gray-400' : 'text-red-700/70'}`}>Completion</p>
                <p className="text-3xl font-semibold">{currentPace}%</p>
              </div>
              <div>
                <p className={`text-[10px] font-medium mb-1 ${isOnTrack ? 'text-gray-400' : 'text-red-700/70'}`}>Expected</p>
                <p className="text-3xl font-semibold text-gray-500">{expectedPace}%</p>
              </div>
              <div>
                <p className={`text-[10px] font-medium mb-1 ${isOnTrack ? 'text-gray-400' : 'text-red-700/70'}`}>Time Left</p>
                <p className="text-3xl font-semibold">{calculateDaysLeft()}<span className="text-lg font-normal text-gray-500 ml-1">days</span></p>
              </div>
              <div>
                <p className={`text-[10px] font-medium mb-1 ${isOnTrack ? 'text-gray-400' : 'text-red-700/70'}`}>Completed</p>
                <p className="text-3xl font-semibold">{completedCount}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Team Contribution */}
            <div className="premium-card p-6">
              <div className="flex items-center gap-2 mb-6">
                <Users className="w-4 h-4 text-gray-400" />
                <h3 className="text-xs font-bold tracking-[0.15em] uppercase text-gray-500">Team Velocity</h3>
              </div>
              
              <div className="space-y-4">
                {sortedTeam.map(([name, count], idx) => {
                  const max = sortedTeam[0][1] || 1;
                  const percentage = (count / max) * 100;
                  return (
                    <div key={idx}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">{name}</span>
                        <span className="text-gray-500 font-medium">{count} tasks</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="bg-[#050505] h-full rounded-full" style={{ width: `${percentage}%` }} />
                      </div>
                    </div>
                  )
                })}
                {sortedTeam.length === 0 && (
                  <p className="text-sm text-gray-500 py-4 text-center">No completed tasks yet.</p>
                )}
              </div>
            </div>

            {/* Weekly Productivity Metric placeholder */}
            <div className="premium-card p-6 flex flex-col">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-4 h-4 text-gray-400" />
                <h3 className="text-xs font-bold tracking-[0.15em] uppercase text-gray-500">Weekly Output</h3>
              </div>
              
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-blue-500" />
                </div>
                <h4 className="text-3xl font-semibold mb-1">12</h4>
                <p className="text-sm text-gray-500 font-medium">Tasks completed this week</p>
                <p className="text-xs text-green-600 font-semibold mt-2 bg-green-50 px-2 py-1 rounded-md">+4 from last week</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Analytics;
