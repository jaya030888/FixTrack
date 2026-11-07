-- ==============================================================================
-- HerHack Supabase Complete Schema
-- Civic Issue & Safety Response Platform
-- (Potholes, Garbage, Harassment, Street Hazards)
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
    type TEXT NOT NULL, -- e.g. 'pothole', 'garbage', 'harassment', 'unsafe_area', 'street_light'
    severity TEXT DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
    location GEOGRAPHY(Point, 4326) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    address TEXT,
    status TEXT DEFAULT 'open', -- 'open', 'investigating', 'in_progress', 'resolved', 'dismissed'
    confirmed_count INTEGER DEFAULT 1,
    time TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. High-Performance Spatial Index for Location Queries (e.g. "within 30 meters")
CREATE INDEX IF NOT EXISTS idx_incidents_location ON public.incidents USING GIST (location);

-- 5. Reports Table: (incident, user, before photo, after photo, time)
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    incident_id UUID REFERENCES public.incidents(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    before_photo TEXT,
    after_photo TEXT,
    details TEXT,
    detected_objects JSONB DEFAULT '[]'::jsonb, -- YOLOv8 bounding boxes & confidence (e.g. pothole, garbage)
    clip_similarity_score DOUBLE PRECISION,     -- CLIP before/after verification score
    time TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Stored PostGIS RPC Function: Proximity Search (e.g., within 30m or custom radius)
CREATE OR REPLACE FUNCTION get_nearby_incidents(
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    radius_meters DOUBLE PRECISION DEFAULT 30
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

-- 7. Provision Supabase Public Storage Bucket: 'photos'
INSERT INTO storage.buckets (id, name, public)
VALUES ('photos', 'photos', true)
ON CONFLICT (id) DO NOTHING;

-- 8. Row Level Security (RLS) Configuration
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone"
ON public.profiles FOR SELECT
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
CREATE POLICY "Incidents are viewable by everyone"
ON public.incidents FOR SELECT
USING (true);

CREATE POLICY "Anyone can report an incident"
ON public.incidents FOR INSERT
WITH CHECK (true);

CREATE POLICY "Users or responders can update incidents"
ON public.incidents FOR UPDATE
USING (true);

-- Reports Policies
CREATE POLICY "Reports are viewable by everyone"
ON public.reports FOR SELECT
USING (true);

CREATE POLICY "Anyone can submit a report"
ON public.reports FOR INSERT
WITH CHECK (true);

-- Storage bucket policies for 'photos'
CREATE POLICY "Photos are publicly accessible"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'photos');

CREATE POLICY "Anyone can upload photos to the photos bucket"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'photos');

CREATE POLICY "Users can update/delete their uploaded photos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'photos' AND auth.uid()::text = (storage.foldername(name))[1]);
