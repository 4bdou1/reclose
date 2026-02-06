import React, { useState, useEffect } from 'react';
import { Save, Bot, Sparkles } from 'lucide-react';
import { supabase, Receptionist } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const [receptionist, setReceptionist] = useState<Receptionist | null>(null);
  const [personality, setPersonality] = useState('');
  const [aiName, setAiName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      fetchReceptionist();
    }
  }, [user]);

  const fetchReceptionist = async () => {
    try {
      const { data, error } = await supabase
        .from('receptionists')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (data) {
        setReceptionist(data);
        setPersonality(data.personality || '');
        setAiName(data.name || '');
      }
    } catch (error) {
      console.error('Error fetching receptionist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      if (receptionist) {
        // Update existing
        const { error } = await supabase
          .from('receptionists')
          .update({ personality, name: aiName })
          .eq('id', receptionist.id);

        if (error) throw error;
      } else {
        // Create new
        const { data, error } = await supabase
          .from('receptionists')
          .insert({ user_id: user.id, personality, name: aiName, is_active: false })
          .select()
          .single();

        if (error) throw error;
        if (data) setReceptionist(data);
      }

      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
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
    <div data-testid="settings-page" className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight font-[Manrope]">Settings</h1>
        <p className="text-gray-500 mt-1">Configure your AI Receptionist personality</p>
      </div>

      {/* Main Settings Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Preview */}
        <div className="backdrop-blur-xl bg-black/40 border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#C5A059]/30 mb-4 relative">
            <img
              src="https://images.unsplash.com/photo-1770062422145-c4c08e1f5cc5?crop=entropy&cs=srgb&fm=jpg&q=85&w=200"
              alt="AI Receptionist"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
          <h3 className="text-lg font-semibold text-white font-[Manrope]">{aiName || 'AI Receptionist'}</h3>
          <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Virtual Assistant</p>
          <div className="mt-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#C5A059]" />
            <span className="text-sm text-[#C5A059]">{receptionist?.is_active ? 'Active' : 'Inactive'}</span>
          </div>
        </div>

        {/* Settings Form */}
        <div className="lg:col-span-2 backdrop-blur-xl bg-black/40 border border-white/10 rounded-2xl p-6 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-white/5">
            <div className="w-10 h-10 rounded-xl bg-[#C5A059]/10 border border-[#C5A059]/20 flex items-center justify-center">
              <Bot className="w-5 h-5 text-[#C5A059]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white font-[Manrope]">AI Personality Configuration</h2>
              <p className="text-xs text-gray-500">Customize how your AI interacts with leads</p>
            </div>
          </div>

          {/* AI Name */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-widest text-gray-500 mb-2">
              AI Name
            </label>
            <input
              data-testid="ai-name-input"
              type="text"
              value={aiName}
              onChange={(e) => setAiName(e.target.value)}
              placeholder="e.g., Sarah, Alex, Jordan"
              className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-[#C5A059]/50 focus:ring-1 focus:ring-[#C5A059]/20 transition-all"
            />
          </div>

          {/* Personality */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-widest text-gray-500 mb-2">
              Personality Description
            </label>
            <textarea
              data-testid="personality-input"
              value={personality}
              onChange={(e) => setPersonality(e.target.value)}
              placeholder="Describe how you want your AI to behave. E.g., 'Professional and friendly, always addresses leads by name, asks qualifying questions about their budget and timeline...'"
              rows={6}
              className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-[#C5A059]/50 focus:ring-1 focus:ring-[#C5A059]/20 transition-all resize-none"
            />
            <p className="text-xs text-gray-600 mt-2">This will guide how your AI receptionist communicates with leads.</p>
          </div>

          {/* Save Button */}
          <button
            data-testid="save-settings-btn"
            onClick={handleSave}
            disabled={saving}
            className="w-full py-4 rounded-xl bg-[#C5A059] text-black font-semibold hover:bg-[#C5A059]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(197,160,89,0.2)]"
          >
            {saving ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Settings
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tips Section */}
      <div className="backdrop-blur-xl bg-[#C5A059]/5 border border-[#C5A059]/20 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white font-[Manrope] mb-3">Tips for AI Personality</h3>
        <ul className="space-y-2 text-sm text-gray-400">
          <li className="flex items-start gap-2">
            <span className="text-[#C5A059] mt-1">•</span>
            Be specific about the tone (professional, casual, friendly)
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#C5A059] mt-1">•</span>
            Include key qualifying questions you want the AI to ask
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#C5A059] mt-1">•</span>
            Mention your business name and services for context
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#C5A059] mt-1">•</span>
            Specify how to handle common objections or questions
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Settings;
