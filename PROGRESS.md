# HerHack - Project Progress & Architecture Summary

## 1. Overview
HerHack is an AI-powered safety and incident response platform designed to facilitate emergency reporting, crowd-sourced safety tracking, and automated risk assessment using Supabase (Cloud PostgreSQL + PostGIS).

---

## 2. Completed Architecture (Supabase-First)

### A. Database & PostGIS Setup ([`supabase/schema.sql`](supabase/schema.sql))
- **PostGIS Extension**: Enabled (`CREATE EXTENSION IF NOT EXISTS postgis`) for high-precision geographic spatial computations.
- **Three Core Tables**:
  - **`profiles`**: `(name, role, civic_score, phone_number, avatar_url, emergency_contacts)` linked to Supabase Auth.
  - **`incidents`**: `(type, severity, location [Point], latitude, longitude, status, confirmed_count, time)` with a **GIST spatial index** (`idx_incidents_location`).
  - **`reports`**: `(incident_id, user_id, before_photo, after_photo, details, time, ai_risk_score, ai_metadata)`.
- **Photos Storage Bucket**:
  - Auto-provisioned `photos` public storage bucket in `storage.buckets`.
- **Proximity Stored Function (`get_nearby_incidents`)**:
  - PostGIS SQL function executing `ST_DWithin` and `ST_Distance` to query incidents within any radius (in meters) sorted by distance.
- **Row-Level Security (RLS)**:
  - Enabled on `profiles`, `incidents`, `reports`, and storage objects.

---

### B. Microservices & Repository Architecture

```
HerHack/
├── backend/            # FastAPI REST backend
│   ├── routers/        # Modular endpoints (profiles, incidents, reports)
│   ├── config.py       # Pydantic environment configuration
│   ├── database.py     # Supabase client instantiation
│   ├── schemas.py      # Pydantic data validation models
│   ├── main.py         # Entrypoint + Photo upload endpoint
│   └── requirements.txt
├── frontend/           # Vite + React web application
│   ├── src/services/   # Supabase client & photo upload utilities
│   ├── package.json
│   └── src/App.jsx     # Frontend dashboard entry
├── ai-service/         # Dedicated ML/Threat assessment service
│   ├── main.py         # Threat heuristic and model scoring endpoint
│   └── requirements.txt
├── supabase/
│   └── schema.sql      # Database migrations & PostGIS setup
├── .gitignore          # Strict exclusion rules (.env, uploads, venv, node_modules)
└── SECURITY.md         # Zero-hardcoding and environment security policy
```

---

### C. Security & Zero-Hardcoding Policy ([`SECURITY.md`](SECURITY.md))
- **Zero hardcoded secrets or URLs** in code.
- Dynamic environment loading via `.env` with templates committed in `.env.example`.
- `.gitignore` ignores all `.env*` files, local upload files, venvs, and node_modules.

---

### D. Connecting DBeaver / pgAdmin Directly to Supabase
You can connect DBeaver or pgAdmin directly to your Supabase PostgreSQL cloud database without local Docker:
1. In Supabase Dashboard, go to **Project Settings** -> **Database**.
2. Under **Connection string**, select **URI** or **Parameters**:
   - **Host**: `db.<your-project-ref>.supabase.co`
   - **Port**: `5432` (or `6543` for connection pooling)
   - **Database**: `postgres`
   - **User**: `postgres`
   - **Password**: Your database password chosen at project creation.
