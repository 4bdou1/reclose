import React, { useState, useEffect } from 'react';
import { Search, Eye, X, Phone, Mail, User, MessageSquare } from 'lucide-react';
import { supabase, Lead } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const Leads: React.FC = () => {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  useEffect(() => {
    if (user) {
      fetchLeads();
    }
  }, [user]);

  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLeads = leads.filter((lead) => {
    const query = searchQuery.toLowerCase();
    return (
      lead.name?.toLowerCase().includes(query) ||
      lead.email?.toLowerCase().includes(query) ||
      lead.phone?.includes(query)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div data-testid="leads-page" className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight font-[Manrope]">Leads</h1>
          <p className="text-gray-500 mt-1">View and manage your captured leads</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-[#C5A059] font-[Manrope]">{leads.length}</p>
          <p className="text-xs text-gray-500 uppercase tracking-widest">Total Leads</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input
          data-testid="leads-search-input"
          type="text"
          placeholder="Search by name, email, or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-[#C5A059]/50 focus:ring-1 focus:ring-[#C5A059]/20 transition-all"
        />
      </div>

      {/* Table */}
      <div className="backdrop-blur-xl bg-black/40 border border-white/10 rounded-2xl overflow-hidden">
        {filteredLeads.length === 0 ? (
          <div className="p-12 text-center">
            <User className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500">
              {searchQuery ? 'No leads match your search' : 'No leads captured yet'}
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="text-left px-6 py-4 text-xs font-medium uppercase tracking-widest text-gray-500">Name</th>
                <th className="text-left px-6 py-4 text-xs font-medium uppercase tracking-widest text-gray-500">Phone</th>
                <th className="text-left px-6 py-4 text-xs font-medium uppercase tracking-widest text-gray-500">Email</th>
                <th className="text-right px-6 py-4 text-xs font-medium uppercase tracking-widest text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredLeads.map((lead) => (
                <tr
                  key={lead.id}
                  data-testid={`lead-row-${lead.id}`}
                  className="hover:bg-white/[0.02] transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/20 flex items-center justify-center group-hover:border-[#C5A059]/40 transition-colors">
                        <span className="text-[#C5A059] font-medium text-sm">
                          {lead.name?.charAt(0).toUpperCase() || '?'}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-white">{lead.name || 'Unknown'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">{lead.phone || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">{lead.email || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      data-testid={`view-summary-btn-${lead.id}`}
                      onClick={() => setSelectedLead(lead)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#C5A059]/10 text-[#C5A059] text-sm font-medium hover:bg-[#C5A059]/20 border border-[#C5A059]/20 hover:border-[#C5A059]/40 transition-all"
                    >
                      <Eye className="w-4 h-4" />
                      View Summary
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Summary Modal */}
      {selectedLead && (
        <div
          data-testid="lead-summary-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setSelectedLead(null)}
        >
          <div
            className="w-full max-w-lg bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/20 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-[#C5A059]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white font-[Manrope]">AI Conversation Summary</h3>
                  <p className="text-xs text-gray-500">{selectedLead.name || 'Unknown Lead'}</p>
                </div>
              </div>
              <button
                data-testid="close-modal-btn"
                onClick={() => setSelectedLead(null)}
                className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Lead Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                  <p className="text-xs text-gray-500 mb-1">Phone</p>
                  <p className="text-sm text-white">{selectedLead.phone || 'N/A'}</p>
                </div>
                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                  <p className="text-xs text-gray-500 mb-1">Email</p>
                  <p className="text-sm text-white">{selectedLead.email || 'N/A'}</p>
                </div>
              </div>

              {/* Summary */}
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Conversation Summary</p>
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 min-h-[120px]">
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {selectedLead.summary || 'No conversation summary available for this lead.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-white/5 bg-white/[0.01]">
              <button
                onClick={() => setSelectedLead(null)}
                className="w-full py-3 rounded-xl bg-[#C5A059] text-black font-medium hover:bg-[#C5A059]/90 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leads;
