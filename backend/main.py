from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from database import supabase
import uuid

app = FastAPI(title="HerHack Backend API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health_check():
    return {"status": "ok", "service": "backend", "environment": settings.ENVIRONMENT}

@app.get("/api/incidents")
def list_incidents():
    response = supabase.table("incidents").select("*").execute()
    return response.data

@app.post("/api/incidents")
def create_incident(data: dict):
    # PostGIS location format: 'POINT(lon lat)'
    if "latitude" in data and "longitude" in data:
        data["location"] = f"POINT({data['longitude']} {data['latitude']})"
    response = supabase.table("incidents").insert(data).execute()
    return response.data

@app.post("/api/photos/upload")
async def upload_photo(file: UploadFile = File(...)):
    try:
        content = await file.read()
        file_ext = file.filename.split(".")[-1] if "." in file.filename else "jpg"
        file_path = f"uploads/{uuid.uuid4()}.{file_ext}"

        # Upload to Supabase Storage bucket
        res = supabase.storage.from_(settings.SUPABASE_STORAGE_BUCKET_PHOTOS).upload(
            file_path,
            content,
            {"content-type": file.content_type}
        )
        
        # Get public URL
        public_url = supabase.storage.from_(settings.SUPABASE_STORAGE_BUCKET_PHOTOS).get_public_url(file_path)
        return {"file_path": file_path, "url": public_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

