import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bnjwgnssqsstdsalscjv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJuandnbnNzcXNzdGRzYWxzY2p2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyNzY0MzEsImV4cCI6MjA4NTg1MjQzMX0.RLCIcFuvAbKqjszDWKmpJhSJeuruTHYyqPvFKtG_Yzg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types based on your Supabase tables
export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  summary?: string;
  created_at: string;
  user_id?: string;
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
  created_at: string;
}
