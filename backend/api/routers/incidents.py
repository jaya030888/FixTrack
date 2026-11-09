from fastapi import APIRouter, HTTPException, Query
from config import settings
from database import supabase
from schemas import IncidentCreate, IncidentResponse
from typing import List, Optional, Dict, Any
import uuid

router = APIRouter(prefix="/api/incidents", tags=["Incidents"])

@router.get("/", response_model=List[IncidentResponse])
def list_incidents(status: Optional[str] = None, category: Optional[str] = None):
    """Retrieve all incidents with optional filtering by status and category"""
    try:
        query = supabase.table("incidents").select("*")
        if status:
            query = query.eq("status", status)
        if category:
            query = query.eq("category", category)
        res = query.order("created_at", desc=True).execute()
        return res.data or []
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database query error: {str(e)}")

@router.get("/nearby")
def get_nearby_incidents(
    lat: float = Query(..., description="Latitude"),
    lng: float = Query(..., description="Longitude"),
    radius_meters: float = Query(5000, description="Search radius in meters")
):
    """Query nearby incidents using PostGIS RPC get_nearby_incidents"""
    try:
        res = supabase.rpc("get_nearby_incidents", {
            "lat": lat,
            "lng": lng,
            "radius_meters": radius_meters
        }).execute()
        return res.data or []
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PostGIS proximity RPC error: {str(e)}")

@router.get("/stats/summary")
def get_incident_stats():
    """Retrieve aggregate statistics of reported incidents"""
    try:
        res = supabase.table("incidents").select("category, severity, status").execute()
        data = res.data or []
        summary = {
            "total": len(data),
            "by_severity": {"critical": 0, "high": 0, "medium": 0, "low": 0},
            "by_category": {},
            "open_cases": 0
        }
        for item in data:
            sev = item.get("severity", "medium").lower()
            if sev in summary["by_severity"]:
                summary["by_severity"][sev] += 1
            cat = item.get("category", "general")
            summary["by_category"][cat] = summary["by_category"].get(cat, 0) + 1
            if item.get("status") == "open":
                summary["open_cases"] += 1
        return summary
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Stats calculation error: {str(e)}")

@router.get("/{incident_id}", response_model=IncidentResponse)
def get_incident(incident_id: uuid.UUID):
    """Get single incident details by ID"""
    try:
        res = supabase.table("incidents").select("*").eq("id", str(incident_id)).execute()
        if not res.data:
            raise HTTPException(status_code=404, detail="Incident not found")
        return res.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/", response_model=IncidentResponse)
def create_incident(incident: IncidentCreate):
    """Create a new incident and format location as PostGIS Point"""
    try:
        data = incident.dict()
        if data.get("user_id"):
            data["user_id"] = str(data["user_id"])
        
        # Store PostGIS Point format: POINT(lng lat)
        data["location"] = f"POINT({incident.longitude} {incident.latitude})"
        res = supabase.table("incidents").insert(data).execute()
        if not res.data:
            raise HTTPException(status_code=400, detail="Failed to create incident")
        return res.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to record incident: {str(e)}")

@router.post("/sos", response_model=IncidentResponse)
def trigger_sos_beacon(
    lat: float = Query(..., description="Latitude"),
    lng: float = Query(..., description="Longitude"),
    details: Optional[str] = "High-urgency emergency SOS trigger"
):
    """High-priority emergency SOS beacon creator with automatic critical classification"""
    try:
        sos_data = {
            "title": "🚨 IMMEDIATE EMERGENCY SOS SIGNAL",
            "description": details,
            "category": "sos",
            "severity": "critical",
            "latitude": lat,
            "longitude": lng,
            "location": f"POINT({lng} {lat})",
            "address": f"GPS Verified Coordinates ({lat:.5f}, {lng:.5f})",
            "status": "open"
        }
        res = supabase.table("incidents").insert(sos_data).execute()
        if not res.data:
            raise HTTPException(status_code=400, detail="Failed to log emergency SOS")
        return res.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Emergency beacon failure: {str(e)}")
