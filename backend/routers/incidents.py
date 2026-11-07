from fastapi import APIRouter, HTTPException, Query
from config import settings
from database import supabase
from schemas import IncidentCreate, IncidentResponse
from typing import List, Optional
import uuid

router = APIRouter(prefix="/api/incidents", tags=["Incidents"])

@router.get("/", response_model=List[IncidentResponse])
def list_incidents(status: Optional[str] = None, category: Optional[str] = None):
    """Retrieve all incidents with optional filtering by status and category"""
    query = supabase.table("incidents").select("*")
    if status:
        query = query.eq("status", status)
    if category:
        query = query.eq("category", category)
    res = query.order("created_at", desc=True).execute()
    return res.data

@router.get("/nearby")
def get_nearby_incidents(
    lat: float = Query(..., description="Latitude"),
    lng: float = Query(..., description="Longitude"),
    radius_meters: float = Query(5000, description="Search radius in meters")
):
    """Query nearby incidents using PostGIS RPC get_nearby_incidents"""
    res = supabase.rpc("get_nearby_incidents", {
        "lat": lat,
        "lng": lng,
        "radius_meters": radius_meters
    }).execute()
    return res.data

@router.get("/{incident_id}", response_model=IncidentResponse)
def get_incident(incident_id: uuid.UUID):
    """Get single incident details by ID"""
    res = supabase.table("incidents").select("*").eq("id", str(incident_id)).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Incident not found")
    return res.data[0]

@router.post("/", response_model=IncidentResponse)
def create_incident(incident: IncidentCreate):
    """Create a new incident and format location as PostGIS Point"""
    data = incident.dict()
    if data.get("user_id"):
        data["user_id"] = str(data["user_id"])
    
    # Store PostGIS Point format: POINT(lng lat)
    data["location"] = f"POINT({incident.longitude} {incident.latitude})"
    res = supabase.table("incidents").insert(data).execute()
    if not res.data:
        raise HTTPException(status_code=400, detail="Failed to create incident")
    return res.data[0]
