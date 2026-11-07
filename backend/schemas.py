from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
import uuid

# --- Profile Schemas ---
class ProfileBase(BaseModel):
    name: str
    role: Optional[str] = "citizen"
    civic_score: Optional[int] = 100
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
    type: str  # 'pothole', 'garbage', 'harassment', 'unsafe_area', 'street_light'
    severity: Optional[str] = "medium"  # 'low', 'medium', 'high', 'critical'
    latitude: float
    longitude: float
    address: Optional[str] = None
    status: Optional[str] = "open"
    confirmed_count: Optional[int] = 1

class IncidentCreate(IncidentBase):
    user_id: Optional[uuid.UUID] = None

class IncidentResponse(IncidentBase):
    id: uuid.UUID
    user_id: Optional[uuid.UUID] = None
    incident_time: Optional[datetime] = None
    time: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

# --- Report Schemas ---
class ReportBase(BaseModel):
    incident_id: uuid.UUID
    before_photo: Optional[str] = None
    after_photo: Optional[str] = None
    details: Optional[str] = None
    detected_objects: Optional[List[Dict[str, Any]]] = Field(default_factory=list)
    clip_similarity_score: Optional[float] = None

class ReportCreate(ReportBase):
    user_id: Optional[uuid.UUID] = None

class ReportResponse(ReportBase):
    id: uuid.UUID
    user_id: Optional[uuid.UUID] = None
    report_time: Optional[datetime] = None
    time: Optional[datetime] = None
    created_at: datetime
