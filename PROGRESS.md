# HerHack - Project Progress & Architecture Summary

## 1. Overview
HerHack is an AI-powered safety and incident response platform designed to facilitate emergency reporting, crowd-sourced safety tracking, and automated risk assessment.

---

## 2. Completed Components

### A. Database & PostGIS Setup ([`supabase/schema.sql`](supabase/schema.sql))
- **PostGIS Extension**: Enabled (`CREATE EXTENSION IF NOT EXISTS postgis`) for high-precision geographic calculations.
- **Three Core Tables**:
  - **`profiles`**: Linked to Supabase Auth `auth.users`, storing user contact info, profile avatars, and emergency contacts JSON.
  - **`incidents`**: Tracks safety events with latitude, longitude, and a native PostGIS `GEOGRAPHY(Point, 4326)` column with a **GIST spatial index** for sub-second proximity queries.
  - **`reports`**: Stores evidence, witness testimonies, photo arrays (`photo_urls`), and AI risk scoring metadata.
- **Photos Storage Bucket**:
  - Automatically provisions the `photos` public storage bucket in `storage.buckets`.
- **Proximity Stored Procedure (`get_nearby_incidents`)**:
  - PostGIS SQL function utilizing `ST_DWithin` and `ST_Distance` to query incidents within any radius (in meters) sorted by distance.
- **Row-Level Security (RLS)**:
  - Enabled on `profiles`, `incidents`, `reports`, and `storage.objects` with authenticated and public policies.

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
├── .gitignore          # Strict exclusion rules
└── SECURITY.md         # Zero-hardcoding and environment security policy
```

---

### C. Security & Zero-Hardcoding Policy ([`SECURITY.md`](SECURITY.md))
- **No hardcoded URLs or secret keys** exist in any code file.
- All secrets and service endpoints are strictly managed through environment variables (`.env`).
- **`.gitignore`** is configured and verified to exclude:
  - `.env`, `.env*`, and `*.env` (preserving `.env.example` templates)
  - `uploads/` and `*/uploads/`
  - `venv/`, `.venv/`, and `env/`
  - `node_modules/` and build directories.

---

### D. API Endpoints Implemented

| Service | Method | Route | Description |
|---|---|---|---|
| **Backend** | `GET` | `/` | Health check |
| **Backend** | `GET` | `/api/incidents` | List incidents (filter by status/category) |
| **Backend** | `GET` | `/api/incidents/nearby` | Query nearby incidents via PostGIS radius RPC |
| **Backend** | `GET` | `/api/incidents/{id}` | Retrieve incident details |
| **Backend** | `POST` | `/api/incidents` | Create incident (auto-formats PostGIS Point) |
| **Backend** | `GET` | `/api/profiles/{id}` | Fetch user profile |
| **Backend** | `POST` | `/api/profiles` | Create/update user profile |
| **Backend** | `GET` | `/api/reports` | List reports by incident ID |
| **Backend** | `POST` | `/api/reports` | Submit incident report with photo URLs |
| **Backend** | `POST` | `/api/photos/upload` | Upload image directly to Supabase `photos` bucket |
| **AI Service** | `POST` | `/analyze` | Run threat & risk score assessment |

---

## 3. Remote Synchronization
- **Repository**: [https://github.com/jaya030888/HerHack.git](https://github.com/jaya030888/HerHack.git)
- **Branch**: `main`
- All architectural commits, schema definitions, and services are synced.

