-- ==============================================================================
-- HerHack Docker Postgres + PostGIS Initialization Script
-- ==============================================================================

-- 1. Enable PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;

-- 2. Profiles Table: (name, role, civic score)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'citizen', -- e.g., 'citizen', 'responder', 'admin'
    civic_score INTEGER DEFAULT 100,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Incidents Table: (type, severity, location, status, confirmed count, time)
CREATE TABLE IF NOT EXISTS incidents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(100) NOT NULL, -- e.g., 'harassment', 'theft', 'unsafe_area', 'sos'
    severity VARCHAR(50) DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
    location GEOGRAPHY(Point, 4326) NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    status VARCHAR(50) DEFAULT 'open', -- 'open', 'investigating', 'resolved', 'dismissed'
    confirmed_count INTEGER DEFAULT 1,
    time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Add spatial GIST index on incidents.location
CREATE INDEX IF NOT EXISTS idx_incidents_location ON incidents USING GIST (location);

-- 5. Reports Table: (incident, user, before photo, after photo, time)
CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    incident_id UUID REFERENCES incidents(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    before_photo TEXT,
    after_photo TEXT,
    time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Insert Sample Data for immediate testing in DBeaver / pgAdmin
INSERT INTO profiles (id, name, role, civic_score)
VALUES 
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Ananya Sharma', 'citizen', 120),
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Priya Patel', 'responder', 150)
ON CONFLICT (id) DO NOTHING;

INSERT INTO incidents (id, type, severity, location, latitude, longitude, status, confirmed_count, time)
VALUES 
    (
        'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
        'unsafe_area',
        'high',
        ST_SetSRID(ST_MakePoint(77.5946, 12.9716), 4326)::geography,
        12.9716,
        77.5946,
        'open',
        3,
        CURRENT_TIMESTAMP
    )
ON CONFLICT (id) DO NOTHING;

INSERT INTO reports (incident_id, user_id, before_photo, after_photo, time)
VALUES 
    (
        'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        'https://example.com/photos/before1.jpg',
        'https://example.com/photos/after1.jpg',
        CURRENT_TIMESTAMP
    )
ON CONFLICT (id) DO NOTHING;
