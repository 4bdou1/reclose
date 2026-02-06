import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bnjwgnssqsstdsalscjv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJuandnbnNzcXNzdGRzYWxzY2p2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyNzY0MzEsImV4cCI6MjA4NTg1MjQzMX0.RLCIcFuvAbKqjszDWKmpJhSJeuruTHYyqPvFKtG_Yzg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types based on Supabase tables
export interface Lead {
  id: string;
  user_id?: string;
  name: string;
  phone: string;
  email: string;
  source: 'web' | 'whatsapp' | 'sms' | 'instagram';
  status: 'new' | 'qualified' | 'meeting_scheduled' | 'closed_won' | 'closed_lost';
  summary?: string;
  has_budget: boolean;
  has_timeline: boolean;
  has_authority: boolean;
  budget_amount?: number;
  timeline_date?: string;
  score: number;
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: string;
  lead_id: string;
  user_id: string;
  messages: Array<{
    role: 'lead' | 'ai' | 'user';
    content: string;
    timestamp: string;
  }>;
  channel: 'web' | 'whatsapp' | 'sms';
  started_at: string;
  ended_at?: string;
  created_at: string;
}

export interface Meeting {
  id: string;
  user_id: string;
  lead_id?: string;
  google_event_id?: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  attendee_email?: string;
  attendee_name?: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
  meeting_link?: string;
  created_at: string;
  updated_at: string;
}

export interface Activity {
  id: string;
  user_id: string;
  type: 'lead_qualified' | 'meeting_booked' | 'message_sent' | 'lead_captured' | 'integration_connected';
  title: string;
  description?: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface Integration {
  id: string;
  user_id: string;
  type: 'whatsapp' | 'web_widget' | 'sms' | 'google_calendar' | 'instagram';
  is_active: boolean;
  config?: Record<string, any>;
  last_sync_at?: string;
  created_at: string;
  updated_at: string;
}

export interface KnowledgeBaseItem {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  file_url: string;
  file_public_id: string;
  file_size?: number;
  file_type: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  color: string;
  start_date?: string;
  end_date?: string;
  status: 'active' | 'completed' | 'on_hold';
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  user_id: string;
  project_id: string;
  lead_id?: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  start_date?: string;
  due_date?: string;
  completed_at?: string;
  assignee?: string;
  progress: number;
  created_at: string;
  updated_at: string;
}

export interface InboxMessage {
  id: string;
  user_id: string;
  lead_id: string;
  conversation_id: string;
  content: string;
  sender_type: 'lead' | 'ai' | 'user';
  requires_attention: boolean;
  is_read: boolean;
  flagged_reason?: string;
  created_at: string;
}

export interface Receptionist {
  id: string;
  user_id: string;
  personality?: string;
  is_active: boolean;
  name?: string;
  created_at: string;
}

export interface Profile {
  id: string;
  email?: string;
  full_name?: string;
  avatar_url?: string;
  google_tokens?: Record<string, any>;
  created_at: string;
}

// API URL for backend
export const API_URL = import.meta.env.VITE_API_URL || 'https://4ca99975-c6ee-4715-b344-46b4ebe8a637.preview.emergentagent.com';
