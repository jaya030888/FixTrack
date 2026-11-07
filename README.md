# HerHack Repository Architecture & Setup Guide

This repository contains the full architecture for the HerHack platform organized into modular services.

## Directory Structure

```
HerHack/
├── backend/            # FastAPI backend service
│   ├── .env.example    # Template environment variables
│   ├── config.py       # Pydantic environment configuration
│   ├── database.py     # Supabase client instantiation
│   ├── main.py         # REST API endpoints (Incidents & Photo upload)
│   └── requirements.txt
├── frontend/           # Vite + React frontend client
│   ├── .env.example    # Template environment variables
│   ├── package.json
│   └── src/
│       ├── services/supabase.js  # Supabase frontend client
│       └── App.jsx
├── ai-service/         # Microservice for threat assessment & ML models
│   ├── .env.example    # Template environment variables
│   ├── main.py         # AI inference endpoint
│   └── requirements.txt
├── supabase/
│   └── schema.sql      # Database migrations (PostGIS, tables, bucket & RLS)
└── .gitignore          # Prevents committing secrets or .env files
```

---

## 1. Supabase Setup Instructions

1. Go to [database.new](https://database.new) or sign in to [supabase.com](https://supabase.com).
2. Click **New Project** and name it (e.g. `herhack-db`).
3. Once the database is ready, navigate to the **SQL Editor** tab on the left sidebar.
4. Open the SQL migration file located in [`supabase/schema.sql`](supabase/schema.sql), copy its contents, and execute it.
   - This executes:
     - `CREATE EXTENSION IF NOT EXISTS postgis;`
     - Creates `profiles`, `incidents` (with `GEOGRAPHY(Point, 4326)` & spatial GIST index), and `reports`.
     - Creates the public storage bucket named **`photos`**.
     - Configures Row Level Security (RLS) policies for tables and the photos bucket.
5. In your Supabase Dashboard, go to **Project Settings** -> **API** to copy:
   - **Project URL**
   - **Project API Keys** (`anon` public key and `service_role` key)

---

## 2. Environment Variables Configuration

Copy `.env.example` to `.env` in each service folder and insert your Supabase credentials:

### `backend/.env`
```ini
PORT=8000
HOST=0.0.0.0
ENVIRONMENT=development
SUPABASE_URL=https://<your-project-id>.supabase.co
SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
SUPABASE_STORAGE_BUCKET_PHOTOS=photos
AI_SERVICE_URL=http://localhost:8001
```

### `frontend/.env`
```ini
VITE_API_BASE_URL=http://localhost:8000
VITE_SUPABASE_URL=https://<your-project-id>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
VITE_STORAGE_BUCKET_PHOTOS=photos
```

### `ai-service/.env`
```ini
PORT=8001
HOST=0.0.0.0
MODEL_NAME=safety-threat-detector-v1
CONFIDENCE_THRESHOLD=0.75
```
