from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from database import supabase
from routers import profiles, incidents, reports, ai
import storage

app = FastAPI(
    title="HerHack Backend API",
    description="FastAPI service for civic safety, PostGIS geospatial queries, Supabase Storage, and YOLOv8 hazard detection",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modular routers
app.include_router(profiles.router)
app.include_router(incidents.router)
app.include_router(reports.router)
app.include_router(ai.router)

@app.get("/")
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
    """Upload a photo and create an incident + report (dummy type/severity for now)."""
    try:
        photo_url = storage.upload_photo(await photo.read(), photo.filename, photo.content_type)

        incident = supabase.table("incidents").insert({
            "type": "pothole",      # dummy for now
            "severity": "medium",   # dummy for now
            "latitude": latitude,
            "longitude": longitude,
            # PostGIS: longitude FIRST, then latitude
            "location": f"SRID=4326;POINT({longitude} {latitude})",
        }).execute().data[0]

        rep = supabase.table("reports").insert({
            "incident_id": incident["id"],
            "before_photo": photo_url,
        }).execute().data[0]

        return {"incident": incident, "report": rep}
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
