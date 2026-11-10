# HERHACK_FixTrack · AI Pothole Radar & Civic Infrastructure Platform

[![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js-16.4-black?logo=next.js&logoColor=white)](https://nextjs.org)
[![YOLOv8](https://img.shields.io/badge/YOLOv8-Computer_Vision-blueviolet)](https://ultralytics.com)
[![Supabase](https://img.shields.io/badge/Supabase-PostGIS-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com)
[![HerHack](https://img.shields.io/badge/HerHack-2026_National_Hackathon-ff5a3d)](https://herhack.netlify.app)
[![Live API](https://img.shields.io/badge/Production_Backend-HTTP_200_OK-success)](https://fix-track-umb6.vercel.app/)

> **HerHack 2026 Submission Repository**  
> **Official Live Backend URL**: [https://fix-track-umb6.vercel.app/](https://fix-track-umb6.vercel.app/)  
> **Design & Typography Reference**: Aligned with [herhack.netlify.app](https://herhack.netlify.app/) (Warm Peach `#fff8f3`, Coral `#ff5a3d`, Lime `#c9f45a`, `Space Grotesk` + `Instrument Serif`)

---

## 1. Project Overview & Problem Relevance

### The Problem
* **Road Fatalities & Economic Damage**: India records over 3,500 pothole-related deaths every year, with hundreds of thousands injured and extensive two-wheeler damage.
* **Municipal Contractor Fraud & Bogus Repairs**: Authorities frequently close road repair tickets on paper without performing real repairs, leaving hazardous craters unaddressed.
* **Dangerous Transit for Women**: Unpaved roads, waterlogging, broken streetlights, and secluded alleys create elevated harassment zones. Lone women commuters lack intelligent navigation that prioritizes personal security over mere road distance.
* **Civic Reporting Fatigue**: Citizens stop reporting hazards when portals lack feedback and duplicate complaints within the same street get fragmented.

### The FixTrack Solution
FixTrack is an end-to-end, citizen-driven civic infrastructure platform powered by custom computer vision and spatial intelligence:
1. **Snap & Geotag**: Citizens photograph a pothole or hazard; EXIF GPS and PostGIS automatically group duplicates within a **30-meter radius**.
2. **YOLOv8 Neural Vision**: A custom-trained YOLOv8 neural network (`best.pt`) instantly calculates crater area ($m^2$), estimated depth ($cm$), and severity grade in under 1.2s.
3. **Closed-Loop Citizen Verification**: Tickets cannot be marked resolved by contractors alone. Nearby citizens receive before/after comparison photos and vote **Fixed 👍** or **Still Broken 👎** to earn Civic Karma points.
4. **Dual-Transit Pathfinder**: Enter Departure & Arrival &rarr; Compare the **⚡ Fastest Commute** against the **🛡️ Women-Special Safe Corridor** (routes through illuminated streets, open shops, and Pink Police booths).

---

## 2. HerHack Judging Criteria Alignment

| Evaluation Criterion | How FixTrack Delivers & Solves It |
| :--- | :--- |
| **1. Innovation** | First platform to fuse **YOLOv8 asphalt defect geometry**, **PostGIS 30m auto-deduplication**, and a **tamper-proof citizen verification consensus engine** that strips contractor power to self-certify bogus road repairs. |
| **2. Technical Implementation** | Full-stack production engineering: FastAPI microservices, YOLOv8 vision pipeline, Next.js 16 client, Supabase PostgreSQL with PostGIS geometry indexing (`SRID=4326`), Web Audio API siren, and clean OOP architecture. |
| **3. Impact & Relevance** | Targets two critical national challenges simultaneously: civic infrastructure safety (saving lives from road craters) and women's transit security (illuminated corridors & SafeWalk). |
| **4. UX & Usability** | Custom HerHack 2026 design system: Warm peach `#fff8f3`, coral `#ff5a3d`, `Space Grotesk` + `Instrument Serif`, Google Material Symbols, zero synthetic illustrations, and real-time bounding box telemetry. |
| **5. Scalability** | Decoupled architecture: Serverless auto-scaling on Vercel, isolated containerized AI inference engine, and PostGIS `GIST(location)` spatial indexing capable of handling city-wide ward traffic. |
| **6. Presentation & Demo** | Ready for live stage pitch with end-to-end user flows, interactive before/after verification toggles, and strict 10-slide presentation deck. |

---

## 3. System Design & Architecture

### System Flowchart

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           CITIZEN CLIENT (Next.js 16)                           │
│  - Space Grotesk / Instrument Serif UI  - Google Material Symbols              │
│  - Camera Snap & EXIF Geotagging        - Safe Transit Pathfinder (A -> B)      │
│  - Real-time Road Defect Viewport       - SafeWalk Guardian & Discreet SOS      │
└───────────────────────┬─────────────────────────────────┬───────────────────────┘
                        │ HTTPS (Multipart / JSON)         │
                        ▼                                 ▼
┌──────────────────────────────────────┐  ┌──────────────────────────────────────┐
│       VERCEL SERVERLESS EDGE         │  │       LOCAL FASTAPI BACKEND          │
│   (https://fix-track-umb6.vercel.app)│  │      (http://localhost:8000)         │
│  - ASGI Entrypoint: api/index.py     │  │  - Uvicorn Event Loop                │
│  - Route Rewrites & CORS Handling    │  │  - OOP Domain Service Layer          │
└──────────────────┬───────────────────┘  └──────────────────┬───────────────────┘
                   │                                         │
                   ├────────────────────┬────────────────────┘
                   │                    │
                   ▼                    ▼
┌─────────────────────────────────┐  ┌───────────────────────────────────────────┐
│      YOLOv8 AI MICROSERVICE     │  │           SUPABASE POSTGRESQL + POSTGIS   │
│      (http://localhost:7860)    │  │  - Table: `incidents` (POINT SRID=4326)   │
│  - Custom Weights: `best.pt`    │  │  - Spatial Index: `GIST(location)`        │
│  - Bounding Box & Area Scoring  │  │  - RPC: `get_nearby_incidents` (30m)      │
│  - Sub-1.2s Real-time Latency   │  │  - Bucket: `photos` with RLS Policies     │
└─────────────────────────────────┘  └───────────────────────────────────────────┘
```

### Core User Flows

#### A. Citizen Pothole Reporting & Auto-Grouping Flow
```
[User snaps photo] 
   ──> [Extract EXIF Lat/Lng] 
   ──> [PostGIS RPC Query: Hazards within 30m?]
         ├── YES: Increment `confirmed_count` (+1 confirmation) ──> Return Grouped Ticket
         └── NO:  Send bytes to YOLOv8 `best.pt` ──> Compute Crater Area & Severity 
                  ──> Insert `incidents` + `reports` ──> Return Fresh Ticket ID
```

#### B. Closed-Loop Citizen Verification Flow
```
[Municipal Crew Uploads Bitumen After-Photo] 
   ──> [Status: `pending_citizen_verification`]
   ──> [Nearby Citizens within 500m receive Audit Notification]
   ──> [Citizen inspects road surface]
   ──> [Citizen clicks "Fixed 👍" or "Still Broken 👎"]
         ├── Quorum Reached (3+ Fixed votes): Ticket CLOSED & Contractor Approved (+15 Karma)
         └── Quorum Disputed (Dispute votes > Fixed): Ticket RE-OPENED to Ward Chief (+15 Karma)
```

#### C. Dual-Transit Safe Corridor Flow
```
[User inputs: Departure (Point A) & Arrival (Point B)]
   ──> [PostGIS Spatial Cost Analysis]
         ├── Option 1: ⚡ FASTEST COMMUTE (Minimizes travel time, flags hazards)
         └── Option 2: 🛡️ WOMEN-SPECIAL SAFE CORRIDOR (Maximizes street illumination, open shops, Pink Police booths)
   ──> [One-click trigger: "Start SafeWalk Guardian Companion"]
```

---

## 4. Object-Oriented Programming (OOP) Architecture

The backend implements clean OOP principles, design patterns, and domain encapsulation:

```
backend/hazard_service.py
├── Enums: SeverityGrade, HazardType
├── Dataclasses: BoundingBox, DetectionResult
├── Strategy Pattern:
│   ├── BaseHazardDetector (Abstract Base Class / ABC)
│   ├── YOLOv8PotholeDetector (Concrete Strategy)
│   ├── DrainageWaterloggingDetector (Concrete Strategy)
│   └── GarbageDumpDetector (Concrete Strategy)
├── Factory Pattern:
│   └── HazardDetectorFactory (Dynamic strategy instantiation)
└── Domain Services:
    ├── SpatialDeduplicationService (PostGIS Haversine clustering)
    └── ClosedLoopAuditService (State machine & quorum consensus)
```

### Design Patterns Used
1. **Strategy Pattern (`BaseHazardDetector`)**: Allows the AI inference engine to seamlessly swap detection algorithms (YOLOv8 pothole model vs. future flood/drainage models) without modifying the HTTP router.
2. **Factory Pattern (`HazardDetectorFactory`)**: Encapsulates model loading and caching, dynamically serving detectors based on the requested hazard type.
3. **Single Responsibility Principle (SRP)**: Coordinates spatial distance calculation, neural vision inference, and voting state transitions across distinct domain classes.

---

## 5. Security & Environment Protection

FixTrack follows production security guidelines:

* **Zero Hardcoded Secrets**: All database keys, storage buckets, and AI endpoints are injected via environment variables (`.env`).
* **Strict `.gitignore` Policy**:
  ```gitignore
  .env
  .env*
  !.env.example
  uploads/
  models/*.pt
  __pycache__/
  node_modules/
  ```
* **PostGIS Parameterized Queries**: Spatial queries execute via parameterized Supabase RPCs (`get_nearby_incidents`), mitigating SQL injection vectors.
* **Row-Level Security (RLS)**: Public citizens can read verified hazards and create reports, while destructive operations (deleting records, updating municipal status) require authenticated role privileges.
* **File Upload Sanitization**: Uploaded images are compressed on the client side via canvas heuristics, validated against strict MIME types (`image/jpeg`, `image/png`), and stored in isolated Supabase Storage buckets.

---

## 6. Documented AI Tools Used (HerHack Checklist Requirement)

| AI Tool / Framework | Model / Checkpoint | Role in FixTrack |
| :--- | :--- | :--- |
| **Ultralytics YOLOv8** | Custom `best.pt` (v8-nano fine-tuned) | Object detection for road potholes, bitumen fractures, and surface cracks. Computes bounding boxes and severity scores. |
| **Heuristic NLP Engine** | Regex & Semantic Lexicon | Real-time parser for Hindi, Hinglish, and English civic complaint descriptions (auto-detects keywords like *gaddha*, *paani*, *kachra*). |
| **Web Audio API Engine** | HTML5 Oscillator & Gain Nodes | Synthesizes an emergency dual-tone alarm (700Hz to 1300Hz cycle) without external MP3 dependencies. |
| **Web Speech API** | Browser SpeechRecognition | Listens for hands-free emergency trigger words (*"Help"*, *"Bachao"*, *"Police"*) to fire SOS automatically. |

---

## 7. Presentation Deck (PPT · Exactly 10 Slides)

In accordance with the **HerHack Presentation Guidelines (Hard Limit: 10 Slides)**:

1. **Slide 1: Title & Hook**: FixTrack — AI-Powered Civic Pothole Radar & Safe Transit Platform.
2. **Slide 2: The Core Problem**: The dual hazard crisis — 3,500+ pothole road fatalities & unlit transit danger zones for women.
3. **Slide 3: The Broken Status Quo**: Why existing civic portals fail (contractor self-certification fraud & duplicate ticket spam).
4. **Slide 4: The Innovation — FixTrack Overview**: Fusing computer vision, 30m spatial clustering, and citizen consensus audits.
5. **Slide 5: Technical Architecture**: Clean microservice system design (Next.js 16 + FastAPI + YOLOv8 + PostGIS).
6. **Slide 6: Pothole Vision Engine**: YOLOv8 neural detection in action (area $m^2$, depth estimate, severity tier).
7. **Slide 7: Closed-Loop Citizen Verification**: "Is it solved or not?" — Citizen before/after photo audits with +15 Civic Karma points.
8. **Slide 8: Dual-Transit & Women Safety**: Fastest Commute vs. Women-Special Safe Corridor with SafeWalk guardian.
9. **Slide 9: Scalability & Road Map**: Expanding model training from potholes &rarr; monsoon drainage waterlogging & garbage dumps.
10. **Slide 10: Conclusion & Call to Action**: Empowering citizens to build transparent, safe, and accountable cities.

---

## 8. Quickstart & Local Setup Guide

### Prerequisites
* Python 3.10+
* Node.js 18+ & npm
* Supabase Account (with PostGIS enabled)

### Step 1: Clone the Repository
```bash
git clone https://github.com/jaya030888/FixTrack.git
cd FixTrack
```

### Step 2: Configure Environment Variables
Copy `.env.example` templates in each service directory:
```bash
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### Step 3: Run the Services Locally

#### Terminal 1 — FastAPI Backend (Port 8000)
```bash
python -m uvicorn main:app --app-dir backend --port 8000 --reload
```

#### Terminal 2 — AI Vision Microservice (Port 7860)
```bash
python -m uvicorn main:app --app-dir ai-service --port 7860 --reload
```

#### Terminal 3 — Next.js 16 Frontend (Port 3000)
```bash
node node_modules/next/dist/bin/next dev frontend --webpack
```

Visit **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 9. License & Team

Developed for **HerHack 2026** at Echelon Institute of Technology, Faridabad.  
**Track**: Smart Cities & Civic Infrastructure · **Special Track**: Women Safety.
