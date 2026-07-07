import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Building, Briefcase, FileText, Calendar, MessageSquare, Loader2, Save } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

interface Lead {
  id: string;
  full_name: string;
  business_name: string;
  business_type: string;
  needs: string[];
  message: string;
  status: string;
  notes: string;
  created_at: string;
}

const LeadDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingStatus, setSavingStatus] = useState(false);
  const [savingNotes, setSavingNotes] = useState(false);

  // Editable fields
  const [status, setStatus] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchLead();
  }, [id]);

  const fetchLead = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      setLead(data);
      setStatus(data.status || 'New');
      setNotes(data.notes || '');
    } catch (error) {
      console.error(error);
      toast.error('Failed to load lead details');
      navigate('/dashboard/leads');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    setStatus(newStatus);
    setSavingStatus(true);
    try {
      const { error } = await supabase
        .from('leads')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      toast.success('Status updated successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update status');
      setStatus(lead?.status || 'New'); // Revert on failure
    } finally {
      setSavingStatus(false);
    }
  };

  const handleSaveNotes = async () => {
    setSavingNotes(true);
    try {
      const { error } = await supabase
        .from('leads')
        .update({ notes })
        .eq('id', id);

      if (error) throw error;
      toast.success('Notes saved successfully');
      setLead(prev => prev ? { ...prev, notes } : null);
    } catch (error) {
      console.error(error);
      toast.error('Failed to save notes');
    } finally {
      setSavingNotes(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="w-8 h-8 border-2 border-brand-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!lead) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button
        onClick={() => navigate('/dashboard/leads')}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Leads
      </button>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">{lead.full_name}</h1>
        
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">Status:</span>
          <div className="relative">
            <select
              value={status}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={savingStatus}
              className="appearance-none bg-[#111] border border-white/10 rounded-xl pl-4 pr-10 py-2 text-sm text-white focus:outline-none focus:border-brand-orange transition-colors disabled:opacity-50"
            >
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="In Progress">In Progress</option>
              <option value="Closed">Closed</option>
            </select>
            {savingStatus && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-orange animate-spin" />
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-6">Lead Information</h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Full Name</p>
                  <p className="text-white">{lead.full_name}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                  <Building className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Business Name</p>
                  <p className="text-white">{lead.business_name}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                  <Briefcase className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Business Type</p>
                  <p className="text-white">{lead.business_type}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Needs</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {lead.needs.map((need, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-full text-xs font-medium bg-brand-orange/10 text-brand-orange border border-brand-orange/20">
                        {need}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Message</p>
                  <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">
                    {lead.message || <span className="text-gray-500 italic">No additional message provided.</span>}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Notes & Meta */}
        <div className="space-y-6">
          <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Internal Notes</h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full h-32 bg-black border border-white/10 rounded-xl p-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-brand-orange transition-colors resize-none mb-4"
              placeholder="Add internal notes about this lead..."
            />
            <button
              onClick={handleSaveNotes}
              disabled={savingNotes || notes === lead.notes}
              className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {savingNotes ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Notes
            </button>
          </div>

          <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Metadata</h2>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Submitted On</p>
                <p className="text-white text-sm">{new Date(lead.created_at).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetail;
