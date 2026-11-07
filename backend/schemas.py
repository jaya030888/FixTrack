from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
import uuid

# --- Profile Schemas ---
class ProfileBase(BaseModel):
    full_name: Optional[str] = None
    phone_number: Optional[str] = None
    avatar_url: Optional[str] = None
    emergency_contacts: Optional[List[Dict[str, Any]]] = Field(default_factory=list)

class ProfileCreate(ProfileBase):
    id: uuid.UUID

class ProfileResponse(ProfileBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime

# --- Incident Schemas ---
class IncidentBase(BaseModel):
    title: str
    description: Optional[str] = None
    category: str  # 'harassment', 'theft', 'unsafe_area', 'sos'
    severity: Optional[str] = "medium"  # 'low', 'medium', 'high', 'critical'
    latitude: float
    longitude: float
    address: Optional[str] = None
    status: Optional[str] = "open"

class IncidentCreate(IncidentBase):
    user_id: Optional[uuid.UUID] = None

class IncidentResponse(IncidentBase):
    id: uuid.UUID
    user_id: Optional[uuid.UUID] = None
    created_at: datetime
    updated_at: datetime

# --- Report Schemas ---
class ReportBase(BaseModel):
    incident_id: Optional[uuid.UUID] = None
    report_type: str = "witness"  # 'witness', 'evidence', 'ai_analysis', 'official'
    details: Optional[str] = None
    photo_urls: Optional[List[str]] = Field(default_factory=list)
    ai_risk_score: Optional[float] = None
    ai_metadata: Optional[Dict[str, Any]] = Field(default_factory=dict)

class ReportCreate(ReportBase):
    reporter_id: Optional[uuid.UUID] = None

class ReportResponse(ReportBase):
    id: uuid.UUID
    reporter_id: Optional[uuid.UUID] = None
    created_at: datetime
