# Supabase Database Migration & Setup

-- 1. Enable PostGIS extension for spatial queries/geography
CREATE EXTENSION IF NOT EXISTS postgis;

-- 2. Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    phone_number TEXT,
    avatar_url TEXT,
    emergency_contacts JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create incidents table (with PostGIS geography point)
CREATE TABLE IF NOT EXISTS public.incidents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL, -- e.g., 'harassment', 'theft', 'unsafe_area', 'sos'
    severity TEXT DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
    location GEOGRAPHY(Point, 4326),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    address TEXT,
    status TEXT DEFAULT 'open', -- 'open', 'investigating', 'resolved'
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Spatial index for fast proximity queries
CREATE INDEX IF NOT EXISTS incidents_location_idx ON public.incidents USING GIST (location);

-- 4. Create reports table (linked to incidents or independent user safety reports)
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    incident_id UUID REFERENCES public.incidents(id) ON DELETE CASCADE,
    reporter_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    report_type TEXT NOT NULL, -- 'witness', 'evidence', 'ai_analysis', 'official'
    details TEXT,
    photo_urls TEXT[] DEFAULT ARRAY[]::TEXT[],
    ai_risk_score DOUBLE PRECISION,
    ai_metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Setup Storage Bucket for photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('photos', 'photos', true)
ON CONFLICT (id) DO NOTHING;

-- 6. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by authenticated users"
ON public.profiles FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- Incidents Policies
CREATE POLICY "Incidents viewable by authenticated users"
ON public.incidents FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can report incidents"
ON public.incidents FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own incidents"
ON public.incidents FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Reports Policies
CREATE POLICY "Reports viewable by authenticated users"
ON public.reports FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can submit reports"
ON public.reports FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = reporter_id);

-- Storage bucket policies for 'photos'
CREATE POLICY "Photos are publicly accessible"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'photos');

CREATE POLICY "Authenticated users can upload photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'photos');

CREATE POLICY "Users can update/delete their own photos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'photos' AND auth.uid()::text = (storage.foldername(name))[1]);
