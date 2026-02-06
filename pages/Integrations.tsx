import React, { useState, useEffect } from 'react';
import { 
  Plug, Phone, Globe, MessageSquare, Instagram, Calendar,
  Check, X, ExternalLink, Settings, RefreshCw, Loader2
} from 'lucide-react';
import { supabase, Integration, API_URL } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { useSearchParams } from 'react-router-dom';

interface IntegrationConfig {
  type: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  connectUrl?: string;
  configurable: boolean;
}

const INTEGRATIONS: IntegrationConfig[] = [
  {
    type: 'web_widget',
    name: 'Web Widget',
    description: 'Embed AI receptionist on your website',
    icon: <Globe className="w-6 h-6" />,
    color: 'text-blue-400',
    configurable: true
  },
  {
    type: 'whatsapp',
    name: 'WhatsApp Business',
    description: 'Handle WhatsApp conversations automatically',
    icon: <Phone className="w-6 h-6" />,
    color: 'text-emerald-400',
    configurable: true
  },
  {
    type: 'sms',
    name: 'SMS',
    description: 'Respond to text messages via Twilio',
    icon: <MessageSquare className="w-6 h-6" />,
    color: 'text-purple-400',
    configurable: true
  },
  {
    type: 'instagram',
    name: 'Instagram DMs',
    description: 'Auto-respond to Instagram direct messages',
    icon: <Instagram className="w-6 h-6" />,
    color: 'text-pink-400',
    configurable: true
  },
  {
    type: 'google_calendar',
    name: 'Google Calendar',
    description: 'Sync meetings and availability',
    icon: <Calendar className="w-6 h-6" />,
    color: 'text-[#C5A059]',
    configurable: false
  }
];

const Integrations: React.FC = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [googleConnected, setGoogleConnected] = useState(false);
  const [googleEmail, setGoogleEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchIntegrations();
      checkGoogleConnection();
    }
  }, [user]);

  useEffect(() => {
    // Handle Google OAuth callback
    if (searchParams.get('google_connected') === 'true') {
      const email = searchParams.get('email');
      setGoogleConnected(true);
      setGoogleEmail(email);
      toast.success('Google Calendar connected!');
    }
  }, [searchParams]);

  const fetchIntegrations = async () => {
    try {
      const { data } = await supabase
        .from('integrations')
        .select('*')
        .eq('user_id', user?.id);
      setIntegrations(data || []);
    } catch (error) {
      console.error('Error fetching integrations:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkGoogleConnection = async () => {
    try {
      const res = await fetch(`${API_URL}/api/auth/google/status?user_id=${user?.id}`);
      const data = await res.json();
      setGoogleConnected(data.connected);
      setGoogleEmail(data.email);
    } catch (error) {
      console.error('Error checking Google:', error);
    }
  };

  const connectGoogle = async () => {
    setConnecting('google_calendar');
    try {
      const res = await fetch(`${API_URL}/api/auth/google/login?user_id=${user?.id}`);
      const data = await res.json();
      window.location.href = data.authorization_url;
    } catch (error) {
      toast.error('Failed to connect Google Calendar');
      setConnecting(null);
    }
  };

  const disconnectGoogle = async () => {
    try {
      await fetch(`${API_URL}/api/auth/google/disconnect?user_id=${user?.id}`, { method: 'POST' });
      setGoogleConnected(false);
      setGoogleEmail(null);
      toast.success('Google Calendar disconnected');
    } catch (error) {
      toast.error('Failed to disconnect');
    }
  };

  const toggleIntegration = async (type: string) => {
    const existing = integrations.find(i => i.type === type);
    
    if (existing) {
      const { error } = await supabase
        .from('integrations')
        .update({ is_active: !existing.is_active })
        .eq('id', existing.id);
      
      if (!error) {
        setIntegrations(integrations.map(i => 
          i.id === existing.id ? { ...i, is_active: !i.is_active } : i
        ));
        toast.success(`${type} ${!existing.is_active ? 'enabled' : 'disabled'}`);
      }
    } else {
      const { data, error } = await supabase
        .from('integrations')
        .insert({ user_id: user?.id, type, is_active: true })
        .select()
        .single();
      
      if (!error && data) {
        setIntegrations([...integrations, data]);
        toast.success(`${type} enabled`);
      }
    }
  };

  const isActive = (type: string) => {
    if (type === 'google_calendar') return googleConnected;
    return integrations.find(i => i.type === type)?.is_active || false;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div data-testid="integrations-page" className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight font-[Manrope]">Integrations</h1>
        <p className="text-gray-500 mt-1">Connect channels for your AI receptionist</p>
      </div>

      {/* Integration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {INTEGRATIONS.map((config) => {
          const active = isActive(config.type);
          const isGoogle = config.type === 'google_calendar';
          
          return (
            <div
              key={config.type}
              className={`backdrop-blur-xl bg-black/40 border rounded-2xl p-6 transition-all ${
                active ? 'border-[#C5A059]/30' : 'border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${config.color} bg-current/10`}>
                    <div className={config.color}>{config.icon}</div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{config.name}</h3>
                    <p className="text-xs text-gray-500">{config.description}</p>
                  </div>
                </div>
              </div>

              {isGoogle && googleEmail && (
                <div className="mb-4 p-3 rounded-lg bg-white/[0.02] border border-white/5">
                  <p className="text-xs text-gray-500">Connected as</p>
                  <p className="text-sm text-white">{googleEmail}</p>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                  active
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                }`}>
                  {active ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                  {active ? 'Connected' : 'Disconnected'}
                </span>

                {isGoogle ? (
                  <button
                    onClick={active ? disconnectGoogle : connectGoogle}
                    disabled={connecting === 'google_calendar'}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                      active
                        ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                        : 'bg-[#C5A059] text-black hover:bg-[#C5A059]/90'
                    }`}
                  >
                    {connecting === 'google_calendar' ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : active ? (
                      'Disconnect'
                    ) : (
                      'Connect'
                    )}
                  </button>
                ) : (
                  <button
                    onClick={() => toggleIntegration(config.type)}
                    className={`relative w-12 h-7 rounded-full transition-all duration-300 ${
                      active ? 'bg-[#C5A059]' : 'bg-gray-700'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow transform transition-transform duration-300 ${
                        active ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Integration Status Summary */}
      <div className="backdrop-blur-xl bg-black/40 border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Active Channels</h3>
        <div className="flex flex-wrap gap-3">
          {INTEGRATIONS.filter(c => isActive(c.type)).map(config => (
            <span
              key={config.type}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#C5A059]/10 text-[#C5A059] text-sm"
            >
              {config.icon}
              {config.name}
            </span>
          ))}
          {!INTEGRATIONS.some(c => isActive(c.type)) && (
            <p className="text-gray-500 text-sm">No active integrations. Connect a channel to get started.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Integrations;
