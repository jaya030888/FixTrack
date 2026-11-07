import os
from typing import List, Optional
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

PORT = int(os.getenv("PORT", 8001))
MODEL_NAME = os.getenv("MODEL_NAME", "safety-threat-detector-v2-multilingual")
THRESHOLD = float(os.getenv("CONFIDENCE_THRESHOLD", 0.70))

app = FastAPI(
    title="HerHack / FixTrack AI Threat Assessment Service",
    description="Intelligent natural language & heuristic safety evaluation microservice",
    version="2.0.0"
)

# Enable CORS for frontend and external integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalyzeRequest(BaseModel):
    text: str
    incident_type: Optional[str] = "general"

class AnalyzeResponse(BaseModel):
    risk_score: float
    risk_level: str  # 'critical', 'high', 'medium', 'low'
    model_version: str
    flagged: bool
    keywords_detected: List[str]
    recommended_action: str
    summary: str

# Critical, High, and Medium danger keywords (English + Hindi/Hinglish)
CRITICAL_KEYWORDS = [
    "attack", "stalker", "weapon", "gun", "knife", "assault", "violence", 
    "kidnap", "grabbed", "force", "screaming", "chhuri", "bandook", "hamla", 
    "chhedkhani", "bachao", "madad", "pichha"
]

HIGH_KEYWORDS = [
    "danger", "threat", "urgent", "alone", "scared", "following", "harass", 
    "dark", "trapped", "cornered", "gunda", "suspicious group", "chasing"
]

MEDIUM_KEYWORDS = [
    "unlit", "broken light", "isolated", "strange", "loitering", "unmonitored",
    "catcalling", "unsafe area"
]

@app.get("/")
def health_check():
    return {
        "status": "ok",
        "service": "ai-service",
        "model": MODEL_NAME,
        "threshold": THRESHOLD
    }

@app.post("/analyze", response_model=AnalyzeResponse)
def analyze_incident(req: AnalyzeRequest):
    text_lower = req.text.lower()
    
    detected_critical = [k for k in CRITICAL_KEYWORDS if k in text_lower]
    detected_high = [k for k in HIGH_KEYWORDS if k in text_lower]
    detected_medium = [k for k in MEDIUM_KEYWORDS if k in text_lower]

    all_detected = detected_critical + detected_high + detected_medium

    # Risk scoring algorithm
    score = 0.20
    if detected_critical:
        score = min(0.98, 0.75 + len(detected_critical) * 0.08)
    elif detected_high:
        score = min(0.85, 0.55 + len(detected_high) * 0.07)
    elif detected_medium:
        score = min(0.65, 0.35 + len(detected_medium) * 0.06)

    # Risk classification
    if score >= 0.75:
        risk_level = "critical"
        recommended_action = "EMERGENCY_DISPATCH: Alert police control room (112) and broadcast instant SOS beacon"
    elif score >= 0.55:
        risk_level = "high"
        recommended_action = "PATROL_ALERT: Dispatch nearby community patrols and notify users within 2km geofence"
    elif score >= 0.35:
        risk_level = "medium"
        recommended_action = "COMMUNITY_CAUTION: Mark area as caution zone and log infrastructure ticket (lighting/cctv)"
    else:
        risk_level = "low"
        recommended_action = "ROUTINE_LOG: Log incident in safety database for ongoing monitoring"

    flagged = score >= THRESHOLD

    summary = (
        f"Critical threat detected ({len(all_detected)} alert markers). Immediate emergency response advised."
        if flagged else
        f"Standard safety evaluation completed for incident category '{req.incident_type}'."
    )

    return AnalyzeResponse(
        risk_score=round(score, 2),
        risk_level=risk_level,
        model_version=MODEL_NAME,
        flagged=flagged,
        keywords_detected=all_detected,
        recommended_action=recommended_action,
        summary=summary
    )
