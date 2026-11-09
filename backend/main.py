import sys
from pathlib import Path

# Ensure backend root is always on sys.path for serverless environments (e.g. Vercel)
BACKEND_ROOT = str(Path(__file__).resolve().parent)
if BACKEND_ROOT not in sys.path:
    sys.path.insert(0, BACKEND_ROOT)

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from database import supabase
from routers import profiles, incidents, reports, ai, civic
import storage

app = FastAPI(
    title="HerHack Backend API",
    description="FastAPI service for civic safety, PostGIS geospatial queries, Supabase Storage, and YOLOv8 hazard detection",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Vercel entrypoint aliases
handler = app
app.include_router(profiles.router)
app.include_router(incidents.router)
app.include_router(reports.router)
app.include_router(ai.router)
app.include_router(civic.router)

@app.get("/")
@app.get("/api")
@app.get("/api/")
@app.get("/api/health")
@app.get("/api/index")
@app.get("/api/index.py")
def health_check():
    return {
        "status": "ok",
        "service": "HerHack Backend",
        "environment": settings.ENVIRONMENT,
        "docs_url": "/docs"
    }

@app.post("/api/photos/upload", tags=["Storage"])
async def upload_photo(file: UploadFile = File(...)):
    """Uploads before/after photos directly to Supabase photos bucket"""
    try:
        url = storage.upload_photo(await file.read(), file.filename, file.content_type)
        return {"url": url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/report", tags=["Report"])
async def report(
    photo: UploadFile = File(...),
    latitude: float = Form(..., ge=-90, le=90),
    longitude: float = Form(..., ge=-180, le=180),
):
    """
    Step 7 Integration: Upload a photo, run YOLOv8 detection to determine real type and severity,
    and create the incident + report in Supabase.
    """
    try:
        content = await photo.read()
        photo_url = storage.upload_photo(content, photo.filename, photo.content_type)

        # Step 7: Real AI inference replaces dummy placeholders
        from ai_engine import run_hazard_detection
        ai_result = run_hazard_detection(content)
        predicted_type = ai_result.get("type", "pothole")
        calculated_severity = ai_result.get("severity", "medium")

        incident = supabase.table("incidents").insert({
            "type": predicted_type,
            "severity": calculated_severity,
            "latitude": latitude,
            "longitude": longitude,
            # PostGIS: longitude FIRST, then latitude
            "location": f"SRID=4326;POINT({longitude} {latitude})",
        }).execute().data[0]

        rep = supabase.table("reports").insert({
            "incident_id": incident["id"],
            "before_photo": photo_url,
            "detected_objects": ai_result.get("detected_objects", [])
        }).execute().data[0]

        return {
            "incident": incident,
            "report": rep,
            "ai_inference": ai_result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/incidents", tags=["Report"])
def all_incidents():
    """Return all incidents with lat/lng, confirmed count and the first report photo."""
    res = supabase.table("incidents").select(
        "id,type,severity,status,confirmed_count,latitude,longitude,incident_time,reports(before_photo)"
    ).order("created_at", desc=True).execute()
    out = []
    for row in res.data:
        reports = row.pop("reports", None) or []
        row["photo"] = next((r["before_photo"] for r in reports if r.get("before_photo")), None)
        out.append(row)
    return out
