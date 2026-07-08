import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Link2, Key, Database, RefreshCw, Users, Target, CheckCircle2 } from 'lucide-react';
import { useGoogleAuth } from '../context/GoogleAuthContext';
import { toast } from 'sonner';
import { supabase, Mission } from '../lib/supabase';
import { googleSheetsAPI, TeamMember } from '../lib/googleSheets';

const Settings: React.FC = () => {
  const { isAuthenticated, login, logout, spreadsheetId, setSpreadsheetId, accessToken } = useGoogleAuth();
  const [sheetIdInput, setSheetIdInput] = useState(spreadsheetId || '');
  
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [newTeamEmail, setNewTeamEmail] = useState('');
  const [addingTeamMember, setAddingTeamMember] = useState(false);

  const [missions, setMissions] = useState<Mission[]>([]);
  const [newMissionName, setNewMissionName] = useState('');
  const [newMissionTarget, setNewMissionTarget] = useState('');
  const [newMissionMetricType, setNewMissionMetricType] = useState('outreaches');
  const [newMissionTargetDate, setNewMissionTargetDate] = useState('');
  const [addingMission, setAddingMission] = useState(false);

  useEffect(() => {
    if (spreadsheetId) {
      setSheetIdInput(spreadsheetId);
    }
  }, [spreadsheetId]);

  useEffect(() => {
    fetchTeamMembers();
    fetchMissions();
  }, [spreadsheetId, accessToken]);

  const fetchMissions = async () => {
    const { data, error } = await supabase.from('missions').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      setMissions(data);
    }
  };

  const fetchTeamMembers = async () => {
    try {
      // Fetch from Supabase
      const { data, error } = await supabase.from('team_members').select('*');
      if (!error && data) {
        setTeamMembers(data);
      }
    } catch (err) {
      console.error('Failed to fetch team members:', err);
    }
  };

  const handleAddTeamMember = async () => {
    if (!newTeamEmail.trim()) return;
    setAddingTeamMember(true);
    
    try {
      const email = newTeamEmail.toLowerCase().trim();
      
      // 1. Insert into Supabase
      const { error: supaError } = await supabase.from('team_members').insert([
        { email, added_at: new Date().toISOString() }
      ]);
      
      if (supaError) throw supaError;

      // 2. Insert into Google Sheets (if connected)
      if (spreadsheetId && accessToken) {
        try {
          await googleSheetsAPI.addTeamMember({ email, added_at: new Date().toISOString() }, spreadsheetId, accessToken);
        } catch (sheetErr) {
          console.warn('Failed to sync team member to Google Sheets (tab might not exist yet):', sheetErr);
        }
      }

      toast.success('Team member added successfully!');
      setNewTeamEmail('');
      fetchTeamMembers();
    } catch (error: any) {
      toast.error(error.message || 'Failed to add team member');
    } finally {
      setAddingTeamMember(false);
    }
  };

  const handleSetMission = async () => {
    if (!newMissionName || !newMissionTarget || !newMissionTargetDate) {
       toast.error("Please fill in all mission fields");
       return;
    }
    setAddingMission(true);
    try {
      const { error: completeErr } = await supabase.from('missions').update({ status: 'completed', completed_at: new Date().toISOString() }).eq('status', 'active');
      if (completeErr) throw completeErr;

      const { error: insertErr } = await supabase.from('missions').insert([{
        mission_name: newMissionName,
        target_value: parseFloat(newMissionTarget),
        metric_type: newMissionMetricType,
        target_date: new Date(newMissionTargetDate).toISOString(),
        status: 'active'
      }]);
      
      if (insertErr) throw insertErr;
      
      toast.success("New active mission set!");
      setNewMissionName('');
      setNewMissionTarget('');
      setNewMissionTargetDate('');
      fetchMissions();
    } catch(err) {
      toast.error("Failed to set mission");
    } finally {
      setAddingMission(false);
    }
  };

  const handleCompleteMission = async (id: string) => {
    const { error } = await supabase.from('missions').update({ status: 'completed', completed_at: new Date().toISOString() }).eq('id', id);
    if (!error) {
       toast.success("Mission marked as completed!");
       fetchMissions();
    }
  };

  const handleSaveSheetId = () => {
    if (!sheetIdInput.trim()) {
      toast.error('Spreadsheet ID cannot be empty');
      return;
    }
    
    // Extract ID if user pasted full URL
    let finalId = sheetIdInput.trim();
    if (finalId.includes('/d/')) {
      const match = finalId.match(/\/d\/([a-zA-Z0-9-_]+)/);
      if (match && match[1]) {
        finalId = match[1];
        setSheetIdInput(finalId);
      }
    }

    setSpreadsheetId(finalId);
    toast.success('Spreadsheet connected successfully');
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gray-100 rounded-xl">
          <SettingsIcon className="w-5 h-5 text-[#050505]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight leading-none">Database Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Configure your Google Sheets backend connection</p>
        </div>
      </div>

      <div className="premium-card p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className={`p-3 rounded-xl ${isAuthenticated ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
            <Key className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-1">Google OAuth Connection</h3>
            <p className="text-sm text-gray-500 mb-4">
              {isAuthenticated 
                ? 'Your Google account is securely connected. The dashboard has read/write access to your sheets.'
                : 'Connect your Google account to allow the dashboard to read and write from your Google Sheets.'}
            </p>
            
            {isAuthenticated ? (
              <div className="px-4 py-2 bg-green-500/10 text-green-600 text-sm font-semibold rounded-lg inline-block">
                Auto-Connected via SSO
              </div>
            ) : (
              <div className="flex flex-col items-start gap-3">
                <div className="px-4 py-2 bg-red-500/10 text-red-600 text-sm font-semibold rounded-lg inline-block">
                  Not Connected. Please connect your account to sync Google Sheets.
                </div>
                <button
                  onClick={login}
                  className="px-4 py-2 bg-white border border-gray-200 text-black hover:bg-gray-50 text-sm font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-2"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Connect Google Sheets
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="premium-card p-6">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-xl ${spreadsheetId ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
            <Database className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-1">Spreadsheet Connection</h3>
            <p className="text-sm text-gray-500 mb-4">
              Enter the Spreadsheet ID or paste the full URL of the Google Sheet you want to use as your database.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <input 
                type="text" 
                placeholder="e.g. 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
                value={sheetIdInput}
                onChange={(e) => setSheetIdInput(e.target.value)}
                className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                disabled={!isAuthenticated}
              />
              <button 
                onClick={handleSaveSheetId}
                disabled={!isAuthenticated || !sheetIdInput.trim()}
                className="px-4 py-2 bg-[#050505] disabled:bg-gray-300 disabled:text-gray-500 hover:bg-black/80 text-white text-sm font-semibold rounded-lg transition-colors whitespace-nowrap"
              >
                Save Connection
              </button>
            </div>
            {!isAuthenticated && (
              <p className="text-xs text-red-500 mt-2 font-medium">Please connect your Google Account first.</p>
            )}
          </div>
        </div>
      </div>

      <div className="premium-card p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-purple-50 text-purple-600">
            <Users className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-1">Team Members</h3>
            <p className="text-sm text-gray-500 mb-4">
              Authorize new team members by adding their email address. Only authorized emails can log in.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <input 
                type="email" 
                placeholder="colleague@example.com"
                value={newTeamEmail}
                onChange={(e) => setNewTeamEmail(e.target.value)}
                className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
              />
              <button 
                onClick={handleAddTeamMember}
                disabled={addingTeamMember || !newTeamEmail.trim()}
                className="px-4 py-2 bg-[#050505] disabled:bg-gray-300 disabled:text-gray-500 hover:bg-black/80 text-white text-sm font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center justify-center min-w-[140px]"
              >
                {addingTeamMember ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Add Team Member'}
              </button>
            </div>
            
            {teamMembers.length > 0 && (
              <div className="mt-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Currently Authorized</h4>
                <div className="space-y-2">
                  {teamMembers.map((member, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg border border-gray-100">
                      <span className="text-sm font-medium">{member.email}</span>
                      <span className="text-[10px] text-gray-400 uppercase tracking-wider">{member.added_at ? new Date(member.added_at).toLocaleDateString() : 'Active'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="premium-card p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-orange-50 text-orange-600">
            <Target className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold mb-1">Company Missions</h3>
            <p className="text-sm text-gray-500 mb-4">
              Set active targets for the team. The active mission is displayed on the dashboard for everyone.
            </p>
            
            <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Set New Active Mission</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <input 
                  type="text" 
                  placeholder="Mission Name (e.g., Reach 120 Outreach Threshold)"
                  value={newMissionName}
                  onChange={(e) => setNewMissionName(e.target.value)}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black transition-all"
                />
                <input 
                  type="number" 
                  placeholder="Target Value (e.g., 120)"
                  value={newMissionTarget}
                  onChange={(e) => setNewMissionTarget(e.target.value)}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black transition-all"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                <select 
                  value={newMissionMetricType}
                  onChange={(e) => setNewMissionMetricType(e.target.value)}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black transition-all"
                >
                  <option value="outreaches">Total Outreaches (Analytics)</option>
                  <option value="tasks">Completed Tasks (Google Sheets)</option>
                  <option value="manual">Manual Progress (Coming Soon)</option>
                </select>
                <input 
                  type="date" 
                  value={newMissionTargetDate}
                  onChange={(e) => setNewMissionTargetDate(e.target.value)}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black transition-all text-gray-600"
                />
              </div>
              <button 
                onClick={handleSetMission}
                disabled={addingMission || !newMissionName || !newMissionTarget || !newMissionTargetDate}
                className="w-full px-4 py-2 bg-[#050505] disabled:bg-gray-300 disabled:text-gray-500 hover:bg-black/80 text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center"
              >
                {addingMission ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Set Active Mission'}
              </button>
            </div>
            
            {missions.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Mission History</h4>
                <div className="space-y-3">
                  {missions.map((mission) => (
                    <div key={mission.id} className={`p-4 rounded-xl border ${mission.status === 'active' ? 'border-[#C5A059] bg-[#C5A059]/5' : 'border-gray-100 bg-white'}`}>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mb-1 ${mission.status === 'active' ? 'bg-[#C5A059] text-white' : 'bg-gray-100 text-gray-500'}`}>
                            {mission.status}
                          </span>
                          <h5 className="font-semibold text-sm">{mission.mission_name}</h5>
                        </div>
                        {mission.status === 'active' && (
                          <button 
                            onClick={() => handleCompleteMission(mission.id)}
                            className="p-1.5 hover:bg-green-50 text-green-600 rounded-lg transition-colors group relative"
                            title="Mark as Completed"
                          >
                            <CheckCircle2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Target: <span className="font-semibold text-black">{mission.target_value}</span></span>
                        <span>Type: <span className="font-semibold text-black uppercase tracking-wider">{mission.metric_type}</span></span>
                        <span>Due: <span className="font-semibold text-black">{new Date(mission.target_date).toLocaleDateString()}</span></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default Settings;
