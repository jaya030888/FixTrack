from fastapi import APIRouter, HTTPException
from config import settings
from database import supabase
from schemas import ProfileCreate, ProfileResponse, ProfileBase
from typing import List
import uuid

router = APIRouter(prefix="/api/profiles", tags=["Profiles"])

@router.get("/{user_id}", response_model=ProfileResponse)
def get_profile(user_id: uuid.UUID):
    res = supabase.table("profiles").select("*").eq("id", str(user_id)).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Profile not found")
    return res.data[0]

@router.post("/", response_model=ProfileResponse)
def create_or_update_profile(profile: ProfileCreate):
    data = profile.dict()
    data["id"] = str(data["id"])
    res = supabase.table("profiles").upsert(data).execute()
    if not res.data:
        raise HTTPException(status_code=400, detail="Could not save profile")
    return res.data[0]

