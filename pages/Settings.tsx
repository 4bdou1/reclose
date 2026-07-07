import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Link2, Key, Database, RefreshCw, Users } from 'lucide-react';
import { useGoogleAuth } from '../context/GoogleAuthContext';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';
import { googleSheetsAPI, TeamMember } from '../lib/googleSheets';

const Settings: React.FC = () => {
  const { isAuthenticated, login, logout, spreadsheetId, setSpreadsheetId, accessToken } = useGoogleAuth();
  const [sheetIdInput, setSheetIdInput] = useState(spreadsheetId || '');
  
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [newTeamEmail, setNewTeamEmail] = useState('');
  const [addingTeamMember, setAddingTeamMember] = useState(false);

  useEffect(() => {
    if (spreadsheetId) {
      setSheetIdInput(spreadsheetId);
    }
  }, [spreadsheetId]);

  useEffect(() => {
    fetchTeamMembers();
  }, [spreadsheetId, accessToken]);

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
              <div className="px-4 py-2 bg-red-500/10 text-red-600 text-sm font-semibold rounded-lg inline-block">
                Not Connected. Please log in again to sync Google Sheets.
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

    </div>
  );
};

export default Settings;
