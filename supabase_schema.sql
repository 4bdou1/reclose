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
