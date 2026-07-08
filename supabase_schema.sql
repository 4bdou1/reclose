-- REclose - Supabase Schema
-- Run this in your Supabase SQL Editor

-- 1. Users table (Optional extension if we need to store user-specific data beyond Auth)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Leads table (For Landing Page form captures)
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  business_name TEXT NOT NULL,
  business_type TEXT,
  needs TEXT[] DEFAULT '{}'::TEXT[],
  message TEXT,
  status TEXT DEFAULT 'New', -- New, Contacted, In Progress, Closed
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- RLS Policies for leads
-- Public can insert leads (from the landing page)
CREATE POLICY "Public can insert leads" ON leads FOR INSERT WITH CHECK (true);

-- Only authenticated users can view and manage leads
CREATE POLICY "Auth users can view leads" ON leads FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Auth users can update leads" ON leads FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth users can delete leads" ON leads FOR DELETE USING (auth.role() = 'authenticated');

-- Enable realtime for leads to update dashboard instantly
ALTER PUBLICATION supabase_realtime ADD TABLE leads;

-- 3. App Settings (Global Configuration)
CREATE TABLE IF NOT EXISTS app_settings (
  id INT PRIMARY KEY DEFAULT 1,
  spreadsheet_id TEXT
);
INSERT INTO app_settings (id, spreadsheet_id) VALUES (1, '') ON CONFLICT DO NOTHING;

-- 4. Files Library
CREATE TABLE IF NOT EXISTS files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name TEXT NOT NULL,
  category TEXT DEFAULT 'All Files',
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL, -- 'pdf' or 'link'
  uploaded_by_id UUID REFERENCES auth.users(id),
  uploaded_by_name TEXT,
  visibility TEXT DEFAULT 'for all', -- 'for all' or 'for me'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Secure the table
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View public or own files" ON files FOR SELECT USING (visibility = 'for all' OR uploaded_by_id = auth.uid());
CREATE POLICY "Upload files" ON files FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Delete own files" ON files FOR DELETE USING (uploaded_by_id = auth.uid());
ALTER PUBLICATION supabase_realtime ADD TABLE files;

-- Create the Storage Bucket for PDFs
INSERT INTO storage.buckets (id, name, public) VALUES ('dashboard-files', 'dashboard-files', true) ON CONFLICT DO NOTHING;
CREATE POLICY "Public read PDFs" ON storage.objects FOR SELECT USING (bucket_id = 'dashboard-files');
CREATE POLICY "Auth upload PDFs" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'dashboard-files' AND auth.role() = 'authenticated');
CREATE POLICY "Delete own PDFs" ON storage.objects FOR DELETE USING (bucket_id = 'dashboard-files' AND auth.uid() = owner);

