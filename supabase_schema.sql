-- ==============================================================================
-- LYNTRIX CLOUD POSTGRESQL DATABASE SCHEMA (SUPABASE)
-- Execute this script in your Supabase Project Dashboard -> SQL Editor -> Run
-- ==============================================================================

-- 1. Create Users Table (Client Profiles)
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT,
  company TEXT DEFAULT 'Corporate Client',
  birthday TEXT,
  phone TEXT,
  country TEXT DEFAULT 'Sri Lanka',
  role TEXT DEFAULT 'Client',
  status TEXT DEFAULT 'Active',
  "joinedDate" TEXT DEFAULT TO_CHAR(NOW(), 'YYYY-MM-DD'),
  "authProvider" TEXT DEFAULT 'Email',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Inquiries / Orders Table (Proposals)
CREATE TABLE IF NOT EXISTS public.inquiries (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT DEFAULT 'N/A',
  service TEXT NOT NULL,
  scale TEXT DEFAULT 'Enterprise',
  budget TEXT NOT NULL,
  status TEXT DEFAULT 'New',
  "consultationStatus" TEXT DEFAULT 'Pending Approval',
  "hasConsultation" BOOLEAN DEFAULT false,
  "consultationDate" TEXT,
  "consultationTime" TEXT,
  "meetingPlatform" TEXT,
  "meetingLink" TEXT,
  date TEXT DEFAULT TO_CHAR(NOW(), 'YYYY-MM-DD HH24:MI'),
  details TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure all columns exist for existing tables
ALTER TABLE public.inquiries ADD COLUMN IF NOT EXISTS "consultationStatus" TEXT DEFAULT 'Pending Approval';
ALTER TABLE public.inquiries ADD COLUMN IF NOT EXISTS "hasConsultation" BOOLEAN DEFAULT false;
ALTER TABLE public.inquiries ADD COLUMN IF NOT EXISTS "consultationDate" TEXT;
ALTER TABLE public.inquiries ADD COLUMN IF NOT EXISTS "consultationTime" TEXT;
ALTER TABLE public.inquiries ADD COLUMN IF NOT EXISTS "meetingPlatform" TEXT;
ALTER TABLE public.inquiries ADD COLUMN IF NOT EXISTS "meetingLink" TEXT;

-- 3. Create Admins Table (Access Control)
CREATE TABLE IF NOT EXISTS public.admins (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'Master Admin',
  status TEXT DEFAULT 'Active',
  "createdDate" TEXT DEFAULT TO_CHAR(NOW(), 'YYYY-MM-DD'),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert Default Admins
INSERT INTO public.admins (id, name, email, password, role, status, "createdDate")
VALUES 
  ('ADM-001', 'Dilneth Madushanka', 'admin@lyntrixtec.com', 'admin123', 'Master Admin', 'Active', '2026-08-01'),
  ('ADM-002', 'Dilneth Madushanka', 'dilneth@lyntrixtec.com', 'admin123', 'Master Admin', 'Active', '2026-08-01')
ON CONFLICT (email) DO NOTHING;

-- 4. Create Services Table (Pricing Matrix)
CREATE TABLE IF NOT EXISTS public.services (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  "basePrice" NUMERIC NOT NULL,
  badge TEXT,
  tagline TEXT,
  architect TEXT,
  sla TEXT,
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.services ADD COLUMN IF NOT EXISTS badge TEXT;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS tagline TEXT;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS architect TEXT;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS sla TEXT;

-- 5. Create Add-ons Table
CREATE TABLE IF NOT EXISTS public.addons (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  price NUMERIC NOT NULL,
  popular BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ENABLE PUBLIC ACCESS POLICIES FOR INSTANT WEB CLIENT INTEGRATION
-- ==============================================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addons ENABLE ROW LEVEL SECURITY;

-- Allow read & write for anonymous web client
CREATE POLICY "Allow public read/write users" ON public.users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write inquiries" ON public.inquiries FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write admins" ON public.admins FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write services" ON public.services FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write addons" ON public.addons FOR ALL USING (true) WITH CHECK (true);
