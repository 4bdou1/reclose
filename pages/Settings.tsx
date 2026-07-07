import React, { useState } from 'react';
import { Settings as SettingsIcon, Link2, Key, Database, RefreshCw } from 'lucide-react';
import { useGoogleAuth } from '../context/GoogleAuthContext';
import { toast } from 'sonner';

const Settings: React.FC = () => {
  const { isAuthenticated, login, logout, spreadsheetId, setSpreadsheetId } = useGoogleAuth();
  const [sheetIdInput, setSheetIdInput] = useState(spreadsheetId || '');

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
              <button 
                onClick={logout}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-[#050505] text-sm font-semibold rounded-lg transition-colors"
              >
                Disconnect Account
              </button>
            ) : (
              <button 
                onClick={() => login()}
                className="px-4 py-2 bg-[#050505] hover:bg-black/80 text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-2"
              >
                <Link2 className="w-4 h-4" />
                Connect Google Account
              </button>
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

    </div>
  );
};

export default Settings;
