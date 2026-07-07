import React, { useState } from 'react';
import { Search, MapPin, Phone, MessageSquare, Mail, Calendar } from 'lucide-react';
import { googleSheetsAPI } from '../lib/googleSheets';
import { useSheetsData } from '../hooks/useSheetsData';

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

const Research: React.FC = () => {
  const { data: researchItems, loading } = useSheetsData(googleSheetsAPI.getResearch);
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

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

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Outreach Tracker</h1>
          <p className="text-sm text-gray-500">Manage your leads and communications</p>
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
      ) : filteredItems.length === 0 ? (
        <div className="w-full py-20 text-center text-gray-500 bg-white border border-gray-100 rounded-3xl shadow-sm">
          No outreach entries found.
        </div>
      ) : (
        <div className="premium-card overflow-hidden overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1200px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/80">
                <th className="p-4 text-xs font-semibold text-gray-500 w-[100px]">Date</th>
                <th className="p-4 text-xs font-semibold text-gray-500 w-[180px]">Business Name</th>
                <th className="p-4 text-xs font-semibold text-gray-500 w-[120px]">City</th>
                <th className="p-4 text-xs font-semibold text-gray-500 w-[140px]">Contact</th>
                <th className="p-4 text-xs font-semibold text-gray-500 w-[200px]">30s Note</th>
                <th className="p-4 text-xs font-semibold text-gray-500 w-[120px]">Response</th>
                <th className="p-4 text-xs font-semibold text-gray-500 w-[120px]">Follow-Up</th>
                <th className="p-4 text-xs font-semibold text-gray-500 min-w-[200px]">Outcome / Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredItems.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="p-4 text-xs text-gray-500 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      {item.date}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-sm text-gray-900">{item.business_name}</div>
                    <div className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mt-1">{item.category}</div>
                  </td>
                  <td className="p-4 text-sm text-gray-600 whitespace-nowrap">
                    {item.city && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        {item.city}
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700">
                        {getContactIcon(item.contact_method)}
                        {item.contact_method}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">{item.time_of_contact}</div>
                  </td>
                  <td className="p-4 text-xs text-gray-600 leading-snug">
                    <p className="line-clamp-2" title={item['researched_detail_(30s_note)']}>
                      {item['researched_detail_(30s_note)']}
                    </p>
                  </td>
                  <td className="p-4">
                    {item.response && (
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getResponseBadge(item.response)}`}>
                        {item.response}
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-xs text-gray-600 whitespace-nowrap">
                    <div className="font-medium">{item['follow-up_due']}</div>
                    {item['follow-up_sent?'] && item['follow-up_sent?'].toLowerCase() === 'yes' && (
                      <div className="text-[10px] font-bold text-green-600 uppercase tracking-wider mt-1">Sent ✓</div>
                    )}
                  </td>
                  <td className="p-4 text-xs text-gray-600">
                    <p className="line-clamp-2" title={item['outcome_/_notes']}>
                      {item['outcome_/_notes']}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Research;
