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

# Modular routers
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
