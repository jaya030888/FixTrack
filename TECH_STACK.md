# HerHack Architecture & Tech Stack

This document defines the production technology stack and cloud configuration for the HerHack platform.

## 1. Unified Tech Stack Matrix

| Layer | Technology | Role & Purpose |
|---|---|---|
| **Frontend** | **Next.js (App Router) + React** | Client dashboard, responsive SSR/CSR, Vercel zero-config deploy |
| **Styling** | **Tailwind CSS** | Fast UI components, mobile-first design |
| **Maps** | **Leaflet + react-leaflet + OpenStreetMap** | Free, open-source geospatial visualization, no API key or billing required |
| **Charts** | **Recharts** | Interactive civic analytics & incident severity trends |
| **Backend** | **FastAPI (Python)** | High-performance API, shared Python runtime with ML models, interactive `/docs` Swagger |
| **Database** | **Supabase PostgreSQL + PostGIS** | Managed cloud DB, native spatial indexing (`ST_DWithin`, `ST_Distance`) for queries like *"within 30 meters"* |
| **Photo Storage** | **Supabase Storage (`photos`)** | Cloud object storage for before & after incident photos |
| **Authentication** | **Supabase Auth** | Built-in session, JWT, and user management without custom auth boilerplate |
| **AI: Image Detection** | **YOLOv8 (Ultralytics)** | Automatic detection of road potholes, garbage heaps, and bounding-box severity assessment |
| **AI: Image Verification** | **CLIP (Optional)** | Verifies before/after image similarity to ensure genuine resolution |
| **AI: NLP** | **Claude API (Optional)** | Multilingual understanding of Hindi and Hinglish complaint descriptions |
| **Routing** | **OpenRouteService API** | Free alternative route generation avoiding high-severity hazard clusters |

---

## 2. Cloud Supabase Setup (No Local Docker or DBeaver Required)

All database operations, spatial calculations, and photo assets run through your cloud Supabase project:

1. Open your Supabase Dashboard: [supabase.com/dashboard](https://supabase.com/dashboard)
2. Navigate to the **SQL Editor** on the left menu.
3. Open [`supabase/schema.sql`](supabase/schema.sql), paste its content, and click **Run**.
4. The migration will automatically:
   - Enable the **PostGIS** extension.
   - Create `profiles` (`name`, `role`, `civic_score`).
   - Create `incidents` (`type`, `severity`, `location`, `status`, `confirmed_count`, `time`) with a GIST spatial index (`idx_incidents_location`).
   - Create `reports` (`incident_id`, `user_id`, `before_photo`, `after_photo`, `time`, `detected_objects`).
   - Provision the public **`photos`** Supabase storage bucket.
   - Deploy the `get_nearby_incidents` function for proximity radius searches (e.g. 30m).

---

## 3. Environment Variable Security Policy

Never commit secrets. Store credentials in `.env`:

### `backend/.env`
```ini
PORT=8000
HOST=0.0.0.0
ENVIRONMENT=development
SUPABASE_URL=https://<your-project-id>.supabase.co
SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
SUPABASE_STORAGE_BUCKET_PHOTOS=photos
```

### `frontend/.env`
```ini
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-id>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
NEXT_PUBLIC_STORAGE_BUCKET_PHOTOS=photos
```

