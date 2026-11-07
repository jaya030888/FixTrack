from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from database import supabase
from routers import profiles, incidents, reports
import uuid

app = FastAPI(
    title="HerHack Backend API",
    description="Safety platform backend supporting PostGIS incidents, user profiles, and reports",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include table routers
app.include_router(profiles.router)
app.include_router(incidents.router)
app.include_router(reports.router)

@app.get("/")
def health_check():
    return {
        "status": "ok",
        "service": "backend",
        "environment": settings.ENVIRONMENT
    }

@app.post("/api/photos/upload", tags=["Storage"])
async def upload_photo(file: UploadFile = File(...)):
    """Uploads an incident or report image to the Supabase photos bucket"""
    try:
        content = await file.read()
        file_ext = file.filename.split(".")[-1] if "." in file.filename else "jpg"
        file_path = f"uploads/{uuid.uuid4()}.{file_ext}"

        # Upload to Supabase Storage bucket
        supabase.storage.from_(settings.SUPABASE_STORAGE_BUCKET_PHOTOS).upload(
            file_path,
            content,
            {"content-type": file.content_type}
        )
        
        # Get public URL
        public_url = supabase.storage.from_(settings.SUPABASE_STORAGE_BUCKET_PHOTOS).get_public_url(file_path)
        return {"file_path": file_path, "url": public_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
