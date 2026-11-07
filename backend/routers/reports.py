from fastapi import APIRouter, HTTPException
from config import settings
from database import supabase
from schemas import ReportCreate, ReportResponse
from typing import List, Optional
import uuid

router = APIRouter(prefix="/api/reports", tags=["Reports"])

@router.get("/", response_model=List[ReportResponse])
def list_reports(incident_id: Optional[uuid.UUID] = None):
    query = supabase.table("reports").select("*")
    if incident_id:
        query = query.eq("incident_id", str(incident_id))
    res = query.order("created_at", desc=True).execute()
    return res.data

@router.post("/", response_model=ReportResponse)
def create_report(report: ReportCreate):
    data = report.dict()
    if data.get("incident_id"):
        data["incident_id"] = str(data["incident_id"])
    if data.get("reporter_id"):
        data["reporter_id"] = str(data["reporter_id"])
    res = supabase.table("reports").insert(data).execute()
    if not res.data:
        raise HTTPException(status_code=400, detail="Failed to create report")
    return res.data[0]
