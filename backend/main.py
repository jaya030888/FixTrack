from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from database import supabase
from routers import profiles, incidents, reports, ai
import uuid

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
        content = await file.read()
        file_ext = file.filename.split(".")[-1] if "." in file.filename else "jpg"
        file_path = f"reports/{uuid.uuid4()}.{file_ext}"

        # Upload to Supabase Storage bucket
        supabase.storage.from_(settings.SUPABASE_STORAGE_BUCKET_PHOTOS).upload(
            file_path,
            content,
            {"content-type": file.content_type}
        )
        
        public_url = supabase.storage.from_(settings.SUPABASE_STORAGE_BUCKET_PHOTOS).get_public_url(file_path)
        return {"file_path": file_path, "url": public_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
