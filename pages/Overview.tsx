import React, { useState, useEffect } from 'react';
import { Users, Phone, Power, TrendingUp } from 'lucide-react';
import { supabase, Lead, Receptionist } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

const Overview: React.FC = () => {
  const { user } = useAuth();
  const [totalLeads, setTotalLeads] = useState(0);
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [isAiActive, setIsAiActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [receptionistId, setReceptionistId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      // Fetch leads count
      const { count } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true });
      setTotalLeads(count || 0);

      // Fetch recent leads
      const { data: leads } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      setRecentLeads(leads || []);

      // Fetch receptionist status
      const { data: receptionist } = await supabase
        .from('receptionists')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (receptionist) {
        setIsAiActive(receptionist.is_active);
        setReceptionistId(receptionist.id);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAiStatus = async () => {
    if (!user) return;

    const newStatus = !isAiActive;
    setIsAiActive(newStatus);

    try {
      if (receptionistId) {
        // Update existing receptionist
        const { error } = await supabase
          .from('receptionists')
          .update({ is_active: newStatus })
          .eq('id', receptionistId);

        if (error) throw error;
      } else {
        // Create new receptionist
        const { data, error } = await supabase
          .from('receptionists')
          .insert({ user_id: user.id, is_active: newStatus })
          .select()
          .single();

        if (error) throw error;
        if (data) setReceptionistId(data.id);
      }

      toast.success(`AI Receptionist ${newStatus ? 'activated' : 'deactivated'}`);
    } catch (error) {
      console.error('Error updating status:', error);
      setIsAiActive(!newStatus); // Revert on error
      toast.error('Failed to update status');
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
    <div data-testid="overview-page" className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight font-[Manrope]">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1">Monitor your AI Receptionist performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Leads Card */}
        <div className="backdrop-blur-xl bg-black/40 border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-[#C5A059]/30 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-[#C5A059]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-medium uppercase tracking-widest text-gray-500">Total Leads</span>
              <Users className="w-5 h-5 text-[#C5A059]" />
            </div>
            <p data-testid="total-leads-count" className="text-4xl font-bold text-white font-[Manrope]">{totalLeads}</p>
            <div className="flex items-center gap-2 mt-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span className="text-sm text-emerald-500">Active tracking</span>
            </div>
          </div>
        </div>

        {/* AI Status Card */}
        <div className="md:col-span-2 backdrop-blur-xl bg-black/40 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-medium uppercase tracking-widest text-gray-500">AI Receptionist Status</span>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  isAiActive
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isAiActive ? 'bg-emerald-400 animate-pulse' : 'bg-gray-400'}`} />
                  {isAiActive ? 'Online' : 'Offline'}
                </span>
              </div>
              <p className="text-xl font-semibold text-white font-[Manrope]">
                {isAiActive ? 'Your AI is actively handling calls' : 'Your AI Receptionist is currently offline'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Toggle the switch to {isAiActive ? 'disable' : 'enable'} your AI receptionist
              </p>
            </div>

            {/* Toggle Switch */}
            <button
              data-testid="ai-status-toggle"
              onClick={toggleAiStatus}
              className={`relative w-16 h-9 rounded-full transition-all duration-300 ${
                isAiActive
                  ? 'bg-[#C5A059] shadow-[0_0_20px_rgba(197,160,89,0.4)]'
                  : 'bg-gray-700'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-7 h-7 rounded-full bg-white shadow-lg transform transition-transform duration-300 flex items-center justify-center ${
                  isAiActive ? 'translate-x-7' : 'translate-x-0'
                }`}
              >
                <Power className={`w-4 h-4 ${isAiActive ? 'text-[#C5A059]' : 'text-gray-400'}`} />
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Leads */}
      <div className="backdrop-blur-xl bg-black/40 border border-white/10 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5">
          <h2 className="text-lg font-semibold text-white font-[Manrope]">Recent Leads</h2>
        </div>
        {recentLeads.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500">No leads yet. Your AI receptionist will capture leads here.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {recentLeads.map((lead) => (
              <div
                key={lead.id}
                className="px-6 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/20 flex items-center justify-center">
                    <span className="text-[#C5A059] font-medium text-sm">
                      {lead.name?.charAt(0).toUpperCase() || '?'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{lead.name || 'Unknown'}</p>
                    <p className="text-xs text-gray-500">{lead.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">{lead.phone || 'N/A'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Overview;
