# HerHack / FixTrack - Project Progress & Architecture Summary

## 1. Overview
FixTrack (HerHack) is an AI-powered safety and incident response platform designed for women's safety, proactive incident reporting, crowd-sourced hazard tracking, and real-time risk assessment.

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
FixTrack/
├── backend/            # FastAPI REST backend
│   ├── routers/        # Modular endpoints (incidents, profiles, reports)
│   ├── config.py       # Pydantic environment configuration (with fallback defaults)
│   ├── database.py     # Supabase client instantiation
│   ├── schemas.py      # Pydantic data validation models
│   ├── main.py         # Entrypoint + Photo upload endpoint
│   └── requirements.txt
├── frontend/           # Vite + React web application
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx            # Dynamic top navigation & GPS coordinate chip
│   │   │   ├── IncidentMap.jsx       # SVG spatial radar, proximity circles & live feed
│   │   │   ├── SafeWalk.jsx          # Timed guardian companion & neighborhood index
│   │   │   ├── ReportForm.jsx        # Hazard reporting with real-time AI threat scoring
│   │   │   ├── SafetyTools.jsx       # One-touch SOS, Web Audio siren & fake call
│   │   │   ├── EmergencyContacts.jsx # 1-click WhatsApp/SMS GPS distress links
│   │   │   ├── AIAnalyzer.jsx        # Multilingual ML risk tier classifier
│   │   │   └── DiscreetMode.jsx      # Secret calculator disguise with covert SOS PIN
│   │   ├── services/
│   │   │   ├── api.js                # Unified API service with offline resilience
│   │   │   └── supabase.js           # Supabase client & photo upload helper
│   │   ├── App.jsx                   # Central state machine & SOS modal orchestrator
│   │   ├── index.css                 # Dark theme, glassmorphism cards & SOS strobe
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── ai-service/         # Dedicated ML/Threat assessment microservice
│   ├── main.py         # Multilingual (English + Hindi) keyword inference & CORS
│   └── requirements.txt
├── supabase/
│   └── schema.sql      # Database migrations & PostGIS setup
├── .gitignore          # Strict exclusion rules (.env, node_modules, dist)
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
| **Backend** | `GET` | `/api/incidents/{id}` | Retrieve incident details |
| **Backend** | `GET` | `/api/profiles/{id}` | Fetch user profile |
| **Backend** | `POST` | `/api/profiles` | Create/update user profile |
| **Backend** | `GET` | `/api/reports` | List reports by incident ID |
| **Backend** | `POST` | `/api/reports` | Submit incident report with photo URLs |
| **Backend** | `POST` | `/api/photos/upload` | Upload image directly to Supabase `photos` bucket |
| **AI Service** | `GET` | `/` | Service health & active model info |
| **AI Service** | `POST` | `/analyze` | Multilingual threat scoring & escalation classification |

---

## 3. Remote Synchronization
- **Repository**: [https://github.com/jaya030888/FixTrack.git](https://github.com/jaya030888/FixTrack.git)
- **Active Branch**: `Chandani`
- **Main Branch**: Left untouched as per user specifications.
- **Status**: All features, backend endpoints, frontend components, and documentation are committed and pushed to `origin/Chandani`.
