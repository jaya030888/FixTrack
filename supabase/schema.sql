-- ==============================================================================
-- HerHack Supabase Database Schema & Setup
-- ==============================================================================

-- 1. Enable PostGIS Extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- 2. Profiles Table: (name, role, civic score, auth linkage)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'citizen', -- 'citizen', 'responder', 'admin'
    civic_score INTEGER DEFAULT 100,
    phone_number TEXT,
    avatar_url TEXT,
    emergency_contacts JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Incidents Table: (type, severity, location, status, confirmed count, time)
CREATE TABLE IF NOT EXISTS public.incidents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    type TEXT NOT NULL, -- e.g. 'harassment', 'theft', 'unsafe_area', 'sos'
    severity TEXT DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
    location GEOGRAPHY(Point, 4326) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    address TEXT,
    status TEXT DEFAULT 'open', -- 'open', 'investigating', 'resolved', 'dismissed'
    confirmed_count INTEGER DEFAULT 1,
    time TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Spatial GIST Index on incidents.location
CREATE INDEX IF NOT EXISTS idx_incidents_location ON public.incidents USING GIST (location);

-- 5. Reports Table: (incident, user, before photo, after photo, time)
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    incident_id UUID REFERENCES public.incidents(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    before_photo TEXT,
    after_photo TEXT,
    details TEXT,
    time TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    ai_risk_score DOUBLE PRECISION,
    ai_metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Stored RPC Function: Proximity Search with PostGIS
CREATE OR REPLACE FUNCTION get_nearby_incidents(
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    radius_meters DOUBLE PRECISION DEFAULT 5000
)
RETURNS TABLE (
    id UUID,
    type TEXT,
    severity TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    address TEXT,
    status TEXT,
    confirmed_count INTEGER,
    distance_meters DOUBLE PRECISION,
    time TIMESTAMPTZ,
    created_at TIMESTAMPTZ
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
    SELECT
        i.id,
        i.type,
        i.severity,
        i.latitude,
        i.longitude,
        i.address,
        i.status,
        i.confirmed_count,
        ST_Distance(i.location, ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography) AS distance_meters,
        i.time,
        i.created_at
    FROM public.incidents i
    WHERE ST_DWithin(i.location, ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography, radius_meters)
    ORDER BY distance_meters ASC;
$$;

-- 7. Setup Storage Bucket for Photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('photos', 'photos', true)
ON CONFLICT (id) DO NOTHING;

-- 8. Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

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
WITH CHECK (auth.uid() = user_id);

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
