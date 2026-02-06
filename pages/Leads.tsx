import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Search, Eye, X, Phone, Mail, User, MessageSquare, 
  CheckCircle, Circle, DollarSign, Calendar, UserCheck,
  ArrowLeft, Send, Globe, Instagram
} from 'lucide-react';
import { supabase, Lead, Conversation } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

// Lead Detail Component
const LeadDetail: React.FC<{ leadId: string; onClose: () => void }> = ({ leadId, onClose }) => {
  const { user } = useAuth();
  const [lead, setLead] = useState<Lead | null>(null);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeadDetails();
  }, [leadId]);

  const fetchLeadDetails = async () => {
    try {
      const { data: leadData } = await supabase
        .from('leads')
        .select('*')
        .eq('id', leadId)
        .single();
      setLead(leadData);

      const { data: convData } = await supabase
        .from('conversations')
        .select('*')
        .eq('lead_id', leadId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      setConversation(convData);
    } catch (error) {
      console.error('Error fetching lead:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQualification = async (field: 'has_budget' | 'has_timeline' | 'has_authority', value: boolean) => {
    if (!lead) return;
    
    const { error } = await supabase
      .from('leads')
      .update({ [field]: value })
      .eq('id', lead.id);

    if (!error) {
      setLead({ ...lead, [field]: value });
      toast.success('Qualification updated');
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'whatsapp': return <Phone className="w-4 h-4" />;
      case 'instagram': return <Instagram className="w-4 h-4" />;
      case 'sms': return <MessageSquare className="w-4 h-4" />;
      default: return <Globe className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="w-8 h-8 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!lead) return null;

  return (
    <div
      data-testid="lead-detail-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl max-h-[90vh] bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.02]">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/20 flex items-center justify-center">
                <span className="text-[#C5A059] font-bold text-lg">
                  {lead.name?.charAt(0).toUpperCase() || '?'}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white font-[Manrope]">{lead.name || 'Unknown Lead'}</h2>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  {getSourceIcon(lead.source)}
                  <span className="capitalize">{lead.source}</span>
                  <span>•</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    lead.status === 'qualified' ? 'bg-emerald-500/10 text-emerald-400' :
                    lead.status === 'meeting_scheduled' ? 'bg-blue-500/10 text-blue-400' :
                    lead.status === 'closed_won' ? 'bg-[#C5A059]/10 text-[#C5A059]' :
                    'bg-gray-500/10 text-gray-400'
                  }`}>
                    {lead.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <button
            data-testid="close-detail-btn"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
            {/* Left Column - Info & Qualification */}
            <div className="space-y-6">
              {/* Contact Info */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
                <h3 className="text-xs font-medium uppercase tracking-widest text-gray-500">Contact Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-white">{lead.email || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-white">{lead.phone || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Qualification Checklist */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-4">
                <h3 className="text-xs font-medium uppercase tracking-widest text-gray-500">Qualification Checklist</h3>
                
                <button
                  data-testid="qual-budget"
                  onClick={() => updateQualification('has_budget', !lead.has_budget)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${
                    lead.has_budget 
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                      : 'bg-white/[0.02] border-white/5 text-gray-400 hover:border-white/10'
                  }`}
                >
                  {lead.has_budget ? <CheckCircle className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium">Budget Confirmed</p>
                    <p className="text-xs opacity-70">Lead has shared budget information</p>
                  </div>
                  <DollarSign className="w-4 h-4" />
                </button>

                <button
                  data-testid="qual-timeline"
                  onClick={() => updateQualification('has_timeline', !lead.has_timeline)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${
                    lead.has_timeline 
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                      : 'bg-white/[0.02] border-white/5 text-gray-400 hover:border-white/10'
                  }`}
                >
                  {lead.has_timeline ? <CheckCircle className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium">Timeline Established</p>
                    <p className="text-xs opacity-70">Lead has a decision timeline</p>
                  </div>
                  <Calendar className="w-4 h-4" />
                </button>

                <button
                  data-testid="qual-authority"
                  onClick={() => updateQualification('has_authority', !lead.has_authority)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${
                    lead.has_authority 
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                      : 'bg-white/[0.02] border-white/5 text-gray-400 hover:border-white/10'
                  }`}
                >
                  {lead.has_authority ? <CheckCircle className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium">Decision Maker</p>
                    <p className="text-xs opacity-70">Lead has authority to decide</p>
                  </div>
                  <UserCheck className="w-4 h-4" />
                </button>

                {/* Qualification Score */}
                <div className="pt-4 border-t border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500">Qualification Score</span>
                    <span className="text-sm font-bold text-[#C5A059]">
                      {[lead.has_budget, lead.has_timeline, lead.has_authority].filter(Boolean).length}/3
                    </span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#C5A059] to-[#FF6B2B] transition-all duration-500"
                      style={{ width: `${([lead.has_budget, lead.has_timeline, lead.has_authority].filter(Boolean).length / 3) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Summary */}
              {lead.summary && (
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <h3 className="text-xs font-medium uppercase tracking-widest text-gray-500 mb-3">AI Summary</h3>
                  <p className="text-sm text-gray-300 leading-relaxed">{lead.summary}</p>
                </div>
              )}
            </div>

            {/* Right Column - Conversation Replay */}
            <div className="h-full">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-medium uppercase tracking-widest text-gray-500">Conversation Replay</h3>
                  {conversation && (
                    <span className="text-xs text-gray-600">
                      {new Date(conversation.started_at).toLocaleDateString()}
                    </span>
                  )}
                </div>

                {conversation && conversation.messages?.length > 0 ? (
                  <div className="flex-1 space-y-3 overflow-y-auto max-h-[400px] pr-2">
                    {conversation.messages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex ${msg.role === 'lead' ? 'justify-start' : 'justify-end'}`}
                      >
                        <div
                          className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                            msg.role === 'lead'
                              ? 'bg-white/5 text-white rounded-bl-md'
                              : msg.role === 'ai'
                              ? 'bg-[#C5A059]/20 text-[#C5A059] rounded-br-md'
                              : 'bg-blue-500/20 text-blue-400 rounded-br-md'
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                          <p className="text-[10px] opacity-50 mt-1">
                            {msg.role === 'ai' ? 'AI Sarah' : msg.role === 'user' ? 'You' : 'Lead'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-center">
                    <div>
                      <MessageSquare className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                      <p className="text-sm text-gray-500">No conversation history available</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Leads Component
const Leads: React.FC = () => {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

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
        .eq('user_id', user?.id)
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
    const matchesSearch = 
      lead.name?.toLowerCase().includes(query) ||
      lead.email?.toLowerCase().includes(query) ||
      lead.phone?.includes(query);
    
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'whatsapp': return <Phone className="w-4 h-4 text-emerald-400" />;
      case 'instagram': return <Instagram className="w-4 h-4 text-pink-400" />;
      case 'sms': return <MessageSquare className="w-4 h-4 text-blue-400" />;
      default: return <Globe className="w-4 h-4 text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div data-testid="leads-page" className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight font-[Manrope]">Leads</h1>
          <p className="text-gray-500 mt-1">View and manage captured leads</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-[#C5A059] font-[Manrope]">{leads.length}</p>
          <p className="text-xs text-gray-500 uppercase tracking-widest">Total Leads</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
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
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#C5A059]/50"
        >
          <option value="all">All Status</option>
          <option value="new">New</option>
          <option value="qualified">Qualified</option>
          <option value="meeting_scheduled">Meeting Scheduled</option>
          <option value="closed_won">Closed Won</option>
          <option value="closed_lost">Closed Lost</option>
        </select>
      </div>

      {/* Table */}
      <div className="backdrop-blur-xl bg-black/40 border border-white/10 rounded-2xl overflow-hidden">
        {filteredLeads.length === 0 ? (
          <div className="p-12 text-center">
            <User className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500">
              {searchQuery || statusFilter !== 'all' ? 'No leads match your filters' : 'No leads captured yet'}
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="text-left px-6 py-4 text-xs font-medium uppercase tracking-widest text-gray-500">Lead</th>
                <th className="text-left px-6 py-4 text-xs font-medium uppercase tracking-widest text-gray-500">Contact</th>
                <th className="text-left px-6 py-4 text-xs font-medium uppercase tracking-widest text-gray-500">Source</th>
                <th className="text-left px-6 py-4 text-xs font-medium uppercase tracking-widest text-gray-500">Status</th>
                <th className="text-left px-6 py-4 text-xs font-medium uppercase tracking-widest text-gray-500">Score</th>
                <th className="text-right px-6 py-4 text-xs font-medium uppercase tracking-widest text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredLeads.map((lead) => (
                <tr
                  key={lead.id}
                  data-testid={`lead-row-${lead.id}`}
                  className="hover:bg-white/[0.02] transition-colors group cursor-pointer"
                  onClick={() => setSelectedLeadId(lead.id)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/20 flex items-center justify-center">
                        <span className="text-[#C5A059] font-medium text-sm">
                          {lead.name?.charAt(0).toUpperCase() || '?'}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-white">{lead.name || 'Unknown'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <Mail className="w-3.5 h-3.5" />
                        {lead.email || 'N/A'}
                      </div>
                      <div className="flex items-center gap-2 text-gray-500 text-xs">
                        <Phone className="w-3 h-3" />
                        {lead.phone || 'N/A'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getSourceIcon(lead.source)}
                      <span className="text-sm text-gray-400 capitalize">{lead.source}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                      lead.status === 'qualified' ? 'bg-emerald-500/10 text-emerald-400' :
                      lead.status === 'meeting_scheduled' ? 'bg-blue-500/10 text-blue-400' :
                      lead.status === 'closed_won' ? 'bg-[#C5A059]/10 text-[#C5A059]' :
                      lead.status === 'closed_lost' ? 'bg-red-500/10 text-red-400' :
                      'bg-gray-500/10 text-gray-400'
                    }`}>
                      {lead.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-0.5">
                        {[lead.has_budget, lead.has_timeline, lead.has_authority].map((checked, i) => (
                          <div key={i} className={`w-2 h-2 rounded-full ${checked ? 'bg-[#C5A059]' : 'bg-gray-700'}`} />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">
                        {[lead.has_budget, lead.has_timeline, lead.has_authority].filter(Boolean).length}/3
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      data-testid={`view-lead-btn-${lead.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedLeadId(lead.id);
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#C5A059]/10 text-[#C5A059] text-sm font-medium hover:bg-[#C5A059]/20 border border-[#C5A059]/20 transition-all"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Lead Detail Modal */}
      {selectedLeadId && (
        <LeadDetail leadId={selectedLeadId} onClose={() => setSelectedLeadId(null)} />
      )}
    </div>
  );
};

export default Leads;
