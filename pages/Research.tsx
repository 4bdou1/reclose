import React, { useState, useEffect } from 'react';
import { Search, MapPin, Phone, MessageSquare, Mail, Calendar, Loader2, Plus } from 'lucide-react';
import { googleSheetsAPI, Research as ResearchData } from '../lib/googleSheets';
import { useSheetsData } from '../hooks/useSheetsData';
import { useGoogleAuth } from '../context/GoogleAuthContext';
import { toast } from 'sonner';

const getContactIcon = (method: string) => {
  switch (method?.toLowerCase()) {
    case 'call': return <Phone className="w-3 h-3" />;
    case 'dm': return <MessageSquare className="w-3 h-3" />;
    case 'email': return <Mail className="w-3 h-3" />;
    default: return null;
  }
};

const getResponseBadge = (response: string) => {
  switch (response?.toLowerCase()) {
    case 'no answer': return 'bg-gray-100 text-gray-600 border border-gray-200';
    case 'pending': return 'bg-yellow-50 text-yellow-700 border border-yellow-200';
    case 'positive': return 'bg-green-50 text-green-700 border border-green-200';
    case 'negative': return 'bg-red-50 text-red-700 border border-red-200';
    default: return 'bg-gray-50 text-gray-500 border border-gray-100';
  }
};

const EditableRow = ({ item, onUpdate }: { item: ResearchData & { _rowIndex?: number }, onUpdate: (row: any) => void }) => {
  const [data, setData] = useState(item);
  const [isSyncing, setIsSyncing] = useState(false);

  // Keep local state in sync if parent data changes (e.g. from refetch)
  useEffect(() => {
    setData(item);
  }, [item]);

  const handleChange = (field: keyof ResearchData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleBlur = (field: keyof ResearchData) => {
    if (data[field] !== item[field]) {
      handleSync(data);
    }
  };

  const handleSelectChange = (field: keyof ResearchData, value: string) => {
    const newData = { ...data, [field]: value };
    setData(newData);
    if (newData[field] !== item[field]) {
      handleSync(newData);
    }
  };

  const handleSync = async (newData: any) => {
    setIsSyncing(true);
    try {
      await onUpdate(newData);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <tr className="hover:bg-gray-50/50 transition-colors group relative">
      {/* Date */}
      <td className="p-2 border-b border-gray-100 relative">
        {isSyncing && <div className="absolute top-2 left-2"><Loader2 className="w-3 h-3 animate-spin text-gray-400" /></div>}
        <input 
          type="text" 
          placeholder="DD/MM/YYYY"
          value={data.date || ''} 
          onChange={e => handleChange('date', e.target.value)}
          onBlur={() => handleBlur('date')}
          className="w-full bg-transparent text-xs text-gray-500 focus:bg-white focus:ring-1 focus:ring-black rounded px-2 py-1 outline-none"
        />
      </td>
      {/* Business Name */}
      <td className="p-2 border-b border-gray-100">
        <input 
          type="text" 
          placeholder="Business Name"
          value={data.business_name || ''} 
          onChange={e => handleChange('business_name', e.target.value)}
          onBlur={() => handleBlur('business_name')}
          className="w-full bg-transparent font-semibold text-sm text-gray-900 focus:bg-white focus:ring-1 focus:ring-black rounded px-2 py-1 outline-none"
        />
      </td>
      {/* Category */}
      <td className="p-2 border-b border-gray-100">
        <input 
          type="text" 
          placeholder="Category"
          value={data.category || ''} 
          onChange={e => handleChange('category', e.target.value)}
          onBlur={() => handleBlur('category')}
          className="w-full bg-transparent text-[10px] uppercase tracking-wider text-gray-500 font-bold focus:bg-white focus:ring-1 focus:ring-black rounded px-2 py-1 outline-none"
        />
      </td>
      {/* City */}
      <td className="p-2 border-b border-gray-100">
        <input 
          type="text" 
          placeholder="City"
          value={data.city || ''} 
          onChange={e => handleChange('city', e.target.value)}
          onBlur={() => handleBlur('city')}
          className="w-full bg-transparent text-sm text-gray-600 focus:bg-white focus:ring-1 focus:ring-black rounded px-2 py-1 outline-none"
        />
      </td>
      {/* Contact Method */}
      <td className="p-2 border-b border-gray-100">
        <select 
          value={data.contact_method || ''}
          onChange={e => handleSelectChange('contact_method', e.target.value)}
          className="w-full bg-transparent text-xs text-gray-600 focus:bg-white focus:ring-1 focus:ring-black rounded px-1 py-1 outline-none cursor-pointer"
        >
          <option value="">Select</option>
          <option value="Call">Call</option>
          <option value="DM">DM</option>
          <option value="Email">Email</option>
        </select>
      </td>
      {/* Time of Contact */}
      <td className="p-2 border-b border-gray-100">
        <input 
          type="text" 
          placeholder="Time (e.g. 10am)"
          value={data.time_of_contact || ''} 
          onChange={e => handleChange('time_of_contact', e.target.value)}
          onBlur={() => handleBlur('time_of_contact')}
          className="w-full bg-transparent text-xs text-gray-500 focus:bg-white focus:ring-1 focus:ring-black rounded px-2 py-1 outline-none"
        />
      </td>
      {/* 30s Note */}
      <td className="p-2 border-b border-gray-100">
        <input 
          type="text" 
          placeholder="Researched detail..."
          value={data['researched_detail_(30s_note)'] || ''} 
          onChange={e => handleChange('researched_detail_(30s_note)', e.target.value)}
          onBlur={() => handleBlur('researched_detail_(30s_note)')}
          className="w-full bg-transparent text-xs text-gray-600 focus:bg-white focus:ring-1 focus:ring-black rounded px-2 py-1 outline-none"
        />
      </td>
      {/* Response */}
      <td className="p-2 border-b border-gray-100">
        <select 
          value={data.response || ''}
          onChange={e => handleSelectChange('response', e.target.value)}
          className={`w-full text-[10px] font-bold uppercase tracking-wider rounded px-1 py-1 outline-none cursor-pointer ${
            data.response ? getResponseBadge(data.response) : 'bg-transparent text-gray-500 hover:bg-gray-50 focus:bg-white focus:ring-1 focus:ring-black'
          }`}
        >
          <option value="">No Status</option>
          <option value="No Answer">No Answer</option>
          <option value="Pending">Pending</option>
          <option value="Positive">Positive</option>
          <option value="Negative">Negative</option>
        </select>
      </td>
      {/* Follow-Up Due */}
      <td className="p-2 border-b border-gray-100">
        <input 
          type="text" 
          placeholder="DD/MM/YYYY"
          value={data['follow-up_due'] || ''} 
          onChange={e => handleChange('follow-up_due', e.target.value)}
          onBlur={() => handleBlur('follow-up_due')}
          className="w-full bg-transparent text-xs text-gray-600 focus:bg-white focus:ring-1 focus:ring-black rounded px-2 py-1 outline-none"
        />
      </td>
      {/* Follow-Up Sent? */}
      <td className="p-2 border-b border-gray-100">
        <select 
          value={data['follow-up_sent?'] || ''}
          onChange={e => handleSelectChange('follow-up_sent?', e.target.value)}
          className="w-full bg-transparent text-xs text-gray-600 focus:bg-white focus:ring-1 focus:ring-black rounded px-1 py-1 outline-none cursor-pointer"
        >
          <option value="">-</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </td>
      {/* Outcome / Notes */}
      <td className="p-2 border-b border-gray-100">
        <input 
          type="text" 
          placeholder="Outcome notes..."
          value={data['outcome_/_notes'] || ''} 
          onChange={e => handleChange('outcome_/_notes', e.target.value)}
          onBlur={() => handleBlur('outcome_/_notes')}
          className="w-full bg-transparent text-xs text-gray-600 focus:bg-white focus:ring-1 focus:ring-black rounded px-2 py-1 outline-none"
        />
      </td>
    </tr>
  );
};

const Research: React.FC = () => {
  const { data: researchItems, loading, refetch } = useSheetsData(googleSheetsAPI.getResearch);
  const { spreadsheetId, accessToken } = useGoogleAuth();
  
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // Extract unique categories for the tabs
  const uniqueCategories = Array.from(new Set(researchItems.map(r => r.category).filter(Boolean)));
  const categories = ['All', ...uniqueCategories];

  const filteredItems = researchItems.filter(item => {
    const matchesTab = activeTab === 'All' || item.category?.toLowerCase() === activeTab.toLowerCase();
    
    const searchLower = searchTerm.toLowerCase();
    const businessMatch = item.business_name?.toLowerCase()?.includes(searchLower) ?? false;
    const cityMatch = item.city?.toLowerCase()?.includes(searchLower) ?? false;
    const matchesSearch = searchTerm === '' || businessMatch || cityMatch;
    
    // Check if the row has any meaningful data to filter out empty rows from bottom of spreadsheet
    const isNotEmpty = !!(item.business_name || item.date || item.city || item.contact_method);

    return matchesTab && matchesSearch && isNotEmpty;
  });

  const handleUpdateRow = async (updatedData: any) => {
    if (!spreadsheetId || !accessToken || !updatedData._rowIndex) return;
    try {
      const rowData = { ...updatedData };
      delete rowData._rowIndex;
      
      await googleSheetsAPI.updateResearch(updatedData._rowIndex, rowData, spreadsheetId, accessToken);
      toast.success('Row synced to Google Sheets', {
        style: { background: '#D6B36B', color: '#000', border: 'none' }
      });
    } catch (error: any) {
      toast.error('Failed to sync: ' + error.message);
      refetch(); // Revert to server state on error
    }
  };

  const handleAddLead = async () => {
    if (!spreadsheetId || !accessToken) return;
    setIsAdding(true);
    
    const newLead = {
      date: new Date().toLocaleDateString('en-GB'), // DD/MM/YYYY natively
      business_name: '',
      category: '',
      city: '',
      contact_method: '',
      time_of_contact: '',
      'researched_detail_(30s_note)': '',
      response: '',
      'follow-up_due': '',
      'follow-up_sent?': '',
      'outcome_/_notes': ''
    };

    try {
      await googleSheetsAPI.addResearch(newLead, spreadsheetId, accessToken);
      toast.success('New lead created in Google Sheets', {
        style: { background: '#D6B36B', color: '#000', border: 'none' }
      });
      refetch(); // Pull the newly added row
    } catch (error: any) {
      toast.error('Failed to add lead: ' + error.message);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Outreach Tracker</h1>
          <p className="text-sm text-gray-500">Manage your leads and sync directly with Google Sheets</p>
        </div>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search business or city..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
          />
        </div>
      </div>

      {categories.length > 1 && (
        <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === cat 
                  ? 'bg-[#050505] text-white' 
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300 hover:text-black'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="w-full h-64 bg-gray-200 rounded-3xl animate-pulse" />
      ) : (
        <div className="premium-card overflow-hidden overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1200px] bg-white">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-100/80">
                <th className="p-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider w-[120px]">Date</th>
                <th className="p-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider w-[180px]">Business Name</th>
                <th className="p-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider w-[120px]">Category</th>
                <th className="p-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider w-[120px]">City</th>
                <th className="p-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider w-[100px]">Contact</th>
                <th className="p-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider w-[100px]">Time</th>
                <th className="p-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider w-[220px]">30s Note</th>
                <th className="p-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider w-[110px]">Response</th>
                <th className="p-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider w-[120px]">Follow-Up Due</th>
                <th className="p-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider w-[90px]">Sent?</th>
                <th className="p-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider min-w-[200px]">Outcome / Notes</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item, idx) => (
                <EditableRow 
                  key={idx} 
                  item={item} 
                  onUpdate={handleUpdateRow} 
                />
              ))}
            </tbody>
          </table>
          
          <div className="p-4 border-t border-gray-100 bg-gray-50">
            <button
              onClick={handleAddLead}
              disabled={isAdding}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-black transition-colors disabled:opacity-50"
            >
              {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              {isAdding ? 'Adding Lead...' : 'Add New Lead'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Research;
