import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

interface Lead {
  id: string;
  full_name: string;
  business_name: string;
  business_type: string;
  needs: string[];
  status: string;
  created_at: string;
}

const Leads: React.FC = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (error: any) {
      toast.error('Failed to load leads');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Contacted': return 'bg-brand-orange/10 text-brand-orange border-brand-orange/20';
      case 'In Progress': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'Closed': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          lead.business_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Leads</h1>
          <p className="text-sm text-gray-500">Manage and track your incoming leads</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#111] border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-orange transition-colors"
          />
        </div>
        <div className="relative w-full md:w-48">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#111] border border-white/10 rounded-xl text-sm text-white appearance-none focus:outline-none focus:border-brand-orange transition-colors"
          >
            <option value="All">All Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="In Progress">In Progress</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Leads List */}
      <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex justify-center p-8">
            <div className="w-6 h-6 border-2 border-brand-orange border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">
            No leads found matching your criteria.
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {filteredLeads.map(lead => (
              <div 
                key={lead.id}
                onClick={() => navigate(`/dashboard/leads/${lead.id}`)}
                className="p-4 hover:bg-white/[0.02] cursor-pointer transition-colors flex items-center justify-between group"
              >
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-white truncate">{lead.full_name}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${getStatusColor(lead.status)}`}>
                      {lead.status}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
                    <span className="truncate">{lead.business_name} • {lead.business_type}</span>
                    <span className="hidden md:inline">•</span>
                    <span className="truncate">Needs: {lead.needs.join(', ')}</span>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-2">
                  <span className="text-[10px] text-gray-500 whitespace-nowrap">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-brand-orange transition-colors" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Leads;
