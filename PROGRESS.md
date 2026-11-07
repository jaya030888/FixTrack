# HerHack / FixTrack - Project Progress & Architecture Summary

## 1. Overview
FixTrack (HerHack) is an AI-powered safety and incident response platform designed for women's safety, civic hazard reporting, crowd-sourced tracking, and real-time risk assessment using Supabase (Cloud PostgreSQL + PostGIS) and microservices.

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
FixTrack/
├── backend/            # FastAPI REST backend
│   ├── routers/        # Modular endpoints (incidents, profiles, reports, ai)
│   ├── config.py       # Pydantic environment configuration (with fallback defaults)
│   ├── database.py     # Supabase client instantiation
│   ├── storage.py      # Supabase Storage helpers
│   ├── schemas.py      # Pydantic data validation models
│   ├── main.py         # Entrypoint + Photo upload + YOLO & PostGIS routes
│   └── requirements.txt
├── frontend/           # Full Safety & Incident Frontend
│   ├── src/            # Interactive Women's Safety & Civic Platform
│   │   ├── components/
│   │   │   ├── Navbar.jsx            # Dynamic top navigation & GPS coordinate chip
│   │   │   ├── IncidentMap.jsx       # SVG spatial radar, proximity circles & live feed
│   │   │   ├── SafeWalk.jsx          # Timed guardian companion & neighborhood index
│   │   │   ├── ReportForm.jsx        # Hazard reporting with real-time AI threat scoring
│   │   │   ├── SafetyTools.jsx       # One-touch SOS, Web Audio siren, voice guard & fake call
│   │   │   ├── EmergencyContacts.jsx # 1-click WhatsApp/SMS GPS distress links
│   │   │   ├── AIAnalyzer.jsx        # Multilingual ML risk tier classifier
│   │   │   └── DiscreetMode.jsx      # Secret calculator disguise with covert SOS PIN
│   │   ├── services/
│   │   │   ├── api.js                # Unified API service with offline resilience
│   │   │   └── supabase.js           # Supabase client & photo upload helper
│   │   ├── App.jsx                   # Central state machine & SOS modal orchestrator
│   │   ├── index.css                 # Dark theme, glassmorphism cards & SOS strobe
│   │   └── main.jsx
│   ├── app/            # Next.js App Router & Leaflet Map integration
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── ai-service/         # Dedicated ML/Threat assessment microservice
│   ├── main.py         # Multilingual (English + Hindi) keyword inference & CORS
│   └── requirements.txt
├── supabase/
│   └── schema.sql      # Database migrations & PostGIS setup
├── .gitignore          # Strict exclusion rules (.env, uploads, venv, node_modules)
└── SECURITY.md         # Zero-hardcoding and environment security policy
```

---

### C. Security & Zero-Hardcoding Policy ([`SECURITY.md`](SECURITY.md))
- **No hardcoded credentials**: All keys and tokens are strictly configured through `.env` files.
- **`.gitignore`** is configured and verified to exclude `.env`, `.env*`, `node_modules/`, and `dist/`.

---

### D. Implemented API Endpoints

| Service | Method | Route | Description |
|---|---|---|---|
| **Backend** | `GET` | `/` | Health check |
| **Backend** | `GET` | `/api/incidents` | List incidents (filter by status/category) |
| **Backend** | `GET` | `/api/incidents/nearby` | Query nearby incidents via PostGIS radius RPC |
| **Backend** | `GET` | `/api/incidents/stats/summary` | Aggregate counts by severity and category |
| **Backend** | `POST` | `/api/incidents` | Create incident (auto-formats PostGIS Point) |
| **Backend** | `POST` | `/api/incidents/sos` | High-priority SOS distress beacon endpoint |
| **Backend** | `POST` | `/report` | Photo upload + incident creation |
| **Backend** | `POST` | `/api/ai/detect` | YOLOv8 hazard & object detection |
| **Backend** | `POST` | `/api/photos/upload` | Upload image directly to Supabase `photos` bucket |
| **AI Service** | `GET` | `/` | Service health & active model info |
| **AI Service** | `POST` | `/analyze` | Multilingual threat scoring & escalation classification |

---

## 3. Remote Synchronization
- **Repository**: [https://github.com/jaya030888/FixTrack.git](https://github.com/jaya030888/FixTrack.git)
- **Active Branch**: `Chandani`
- **Main Branch**: Left untouched as per user specifications.
- **Status**: Pulled from `origin/main` into `Chandani`, conflicts resolved, up-to-date with both origin branches.
