import React, { useState, useEffect } from 'react';
import {
  Users, Calendar, Clock, Power, TrendingUp,
  MessageSquare, Zap, Wifi, WifiOff, Phone, Globe, Instagram
} from 'lucide-react';
import { supabase, Lead, Activity, Integration, Meeting } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

const Overview: React.FC = () => {
  const { user } = useAuth();
  const [totalLeads, setTotalLeads] = useState(0);
  const [meetingsBooked, setMeetingsBooked] = useState(0);
  const [timeSaved, setTimeSaved] = useState(0);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [isAiActive, setIsAiActive] = useState(false);
  const [receptionistId, setReceptionistId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchData();
      subscribeToActivities();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      // Fetch leads count
      const { count: leadsCount } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id);
      setTotalLeads(leadsCount || 0);

      // Fetch meetings count
      const { count: meetingsCount } = await supabase
        .from('meetings')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id)
        .eq('status', 'scheduled');
      setMeetingsBooked(meetingsCount || 0);

      // Calculate time saved (estimate: 15 min per lead qualified)
      setTimeSaved(Math.round((leadsCount || 0) * 0.25));

      // Fetch recent activities
      const { data: activityData } = await supabase
        .from('activities')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(10);
      setActivities(activityData || []);

      // Fetch integrations
      const { data: integrationData } = await supabase
        .from('integrations')
        .select('*')
        .eq('user_id', user?.id);
      setIntegrations(integrationData || []);

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

  const subscribeToActivities = () => {
    const channel = supabase
      .channel('activities')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'activities', filter: `user_id=eq.${user?.id}` },
        (payload) => {
          setActivities((prev) => [payload.new as Activity, ...prev.slice(0, 9)]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const toggleAiStatus = async () => {
    if (!user) return;
    const newStatus = !isAiActive;
    setIsAiActive(newStatus);

    try {
      if (receptionistId) {
        const { error } = await supabase
          .from('receptionists')
          .update({ is_active: newStatus })
          .eq('id', receptionistId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('receptionists')
          .insert({ user_id: user.id, is_active: newStatus })
          .select()
          .single();
        if (error) throw error;
        if (data) setReceptionistId(data.id);
      }

      // Log activity
      await supabase.from('activities').insert({
        user_id: user.id,
        type: 'integration_connected',
        title: newStatus ? 'AI Receptionist Activated' : 'AI Receptionist Deactivated',
        description: `System status changed to ${newStatus ? 'online' : 'offline'}`
      });

      toast.success(`AI Receptionist ${newStatus ? 'activated' : 'deactivated'}`);
    } catch (error) {
      setIsAiActive(!newStatus);
      toast.error('Failed to update status');
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'lead_captured':
        return <Users className="w-4 h-4 text-emerald-400" />;
      case 'lead_qualified':
        return <Zap className="w-4 h-4 text-[#C5A059]" />;
      case 'meeting_booked':
        return <Calendar className="w-4 h-4 text-blue-400" />;
      case 'message_sent':
        return <MessageSquare className="w-4 h-4 text-purple-400" />;
      default:
        return <Zap className="w-4 h-4 text-gray-400" />;
    }
  };

  const getIntegrationIcon = (type: string) => {
    switch (type) {
      case 'whatsapp':
        return <Phone className="w-5 h-5" />;
      case 'web_widget':
        return <Globe className="w-5 h-5" />;
      case 'sms':
        return <MessageSquare className="w-5 h-5" />;
      case 'instagram':
        return <Instagram className="w-5 h-5" />;
      default:
        return <Wifi className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const defaultIntegrations = [
    { type: 'whatsapp', name: 'WhatsApp', is_active: false },
    { type: 'web_widget', name: 'Web Widget', is_active: true },
    { type: 'sms', name: 'SMS', is_active: false },
  ];

  const displayIntegrations = defaultIntegrations.map(def => {
    const found = integrations.find(i => i.type === def.type);
    return found || { ...def, id: def.type };
  });

  return (
    <div data-testid="overview-page" className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight font-[Manrope] drop-shadow-md">Command Center</h1>
          <p className="text-gray-400 mt-1 font-medium">Your AI receptionist operating system</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${isAiActive
            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
            }`}>
            <span className={`w-2 h-2 rounded-full ${isAiActive ? 'bg-emerald-400 animate-pulse' : 'bg-gray-400'}`} />
            System {isAiActive ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>

      {/* Stats Grid - 3 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Leads */}
        <div className="backdrop-blur-3xl bg-[#1C1C1E]/60 border border-white/5 rounded-3xl p-6 relative overflow-hidden group hover:border-[#C5A059]/40 hover:bg-[#1C1C1E]/80 transition-all duration-500 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#C5A059]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-medium uppercase tracking-widest text-gray-500">Total Leads</span>
              <Users className="w-5 h-5 text-[#C5A059]" />
            </div>
            <p data-testid="total-leads-count" className="text-4xl font-bold text-white font-[Manrope]">{totalLeads}</p>
            <div className="flex items-center gap-2 mt-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span className="text-sm text-emerald-500">Captured by AI</span>
            </div>
          </div>
        </div>

        {/* Meetings Booked (ROI) */}
        <div className="backdrop-blur-3xl bg-[#1C1C1E]/60 border border-white/5 rounded-3xl p-6 relative overflow-hidden group hover:border-blue-500/40 hover:bg-[#1C1C1E]/80 transition-all duration-500 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-medium uppercase tracking-widest text-gray-500">Meetings Booked</span>
              <Calendar className="w-5 h-5 text-blue-400" />
            </div>
            <p data-testid="meetings-count" className="text-4xl font-bold text-white font-[Manrope]">{meetingsBooked}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm text-blue-400">Scheduled this month</span>
            </div>
          </div>
        </div>

        {/* Time Saved */}
        <div className="backdrop-blur-3xl bg-[#1C1C1E]/60 border border-white/5 rounded-3xl p-6 relative overflow-hidden group hover:border-purple-500/40 hover:bg-[#1C1C1E]/80 transition-all duration-500 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-medium uppercase tracking-widest text-gray-500">Time Saved</span>
              <Clock className="w-5 h-5 text-purple-400" />
            </div>
            <p data-testid="time-saved" className="text-4xl font-bold text-white font-[Manrope]">{timeSaved}<span className="text-xl text-gray-500 ml-1">hrs</span></p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm text-purple-400">From AI automation</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Status Card */}
        <div className="lg:col-span-2 backdrop-blur-3xl bg-[#1C1C1E]/60 border border-white/5 rounded-3xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-500 hover:bg-[#1C1C1E]/80">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-medium uppercase tracking-widest text-gray-500">AI Receptionist Status</span>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${isAiActive
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                  }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isAiActive ? 'bg-emerald-400 animate-pulse' : 'bg-gray-400'}`} />
                  {isAiActive ? 'Online' : 'Offline'}
                </span>
              </div>
              <p className="text-xl font-semibold text-white font-[Manrope]">
                {isAiActive ? 'Your AI is actively handling inquiries' : 'Your AI Receptionist is currently offline'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Toggle to {isAiActive ? 'disable' : 'enable'} 24/7 lead qualification
              </p>
            </div>

            <button
              data-testid="ai-status-toggle"
              onClick={toggleAiStatus}
              className={`relative w-16 h-9 rounded-full transition-all duration-300 ${isAiActive
                ? 'bg-[#C5A059] shadow-[0_0_20px_rgba(197,160,89,0.4)]'
                : 'bg-gray-700'
                }`}
            >
              <span
                className={`absolute top-1 left-1 w-7 h-7 rounded-full bg-white shadow-lg transform transition-transform duration-300 flex items-center justify-center ${isAiActive ? 'translate-x-7' : 'translate-x-0'
                  }`}
              >
                <Power className={`w-4 h-4 ${isAiActive ? 'text-[#C5A059]' : 'text-gray-400'}`} />
              </span>
            </button>
          </div>
        </div>

        {/* Service Status Card */}
        <div className="backdrop-blur-3xl bg-[#1C1C1E]/60 border border-white/5 rounded-3xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-500 hover:bg-[#1C1C1E]/80">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-medium uppercase tracking-widest text-gray-500">Service Status</span>
            <Wifi className="w-4 h-4 text-gray-500" />
          </div>
          <div className="space-y-3">
            {displayIntegrations.map((integration: any) => (
              <div key={integration.type} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${integration.is_active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-gray-500/10 text-gray-500'
                    }`}>
                    {getIntegrationIcon(integration.type)}
                  </div>
                  <span className="text-sm text-white">{integration.name || integration.type}</span>
                </div>
                {integration.is_active ? (
                  <Wifi className="w-4 h-4 text-emerald-400" />
                ) : (
                  <WifiOff className="w-4 h-4 text-gray-500" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Activity Feed */}
      <div className="backdrop-blur-3xl bg-[#1C1C1E]/60 border border-white/5 rounded-3xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-500 hover:bg-[#1C1C1E]/80">
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <h2 className="text-lg font-semibold text-white font-[Manrope]">Live Activity Feed</h2>
          </div>
          <span className="text-xs text-gray-500 uppercase tracking-widest">Real-time</span>
        </div>

        {activities.length === 0 ? (
          <div className="p-12 text-center">
            <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500">No activity yet. Your AI will log events here.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5 max-h-[400px] overflow-y-auto">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="px-6 py-4 flex items-start gap-4 hover:bg-white/[0.02] transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{activity.title}</p>
                  {activity.description && (
                    <p className="text-xs text-gray-500 mt-0.5">{activity.description}</p>
                  )}
                </div>
                <span className="text-xs text-gray-600 flex-shrink-0">
                  {new Date(activity.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Overview;
