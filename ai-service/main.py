import os
from fastapi import FastAPI
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

PORT = int(os.getenv("PORT", 8001))
MODEL_NAME = os.getenv("MODEL_NAME", "safety-threat-detector-v1")
THRESHOLD = float(os.getenv("CONFIDENCE_THRESHOLD", 0.75))

app = FastAPI(title="HerHack AI Service", version="1.0.0")

class AnalyzeRequest(BaseModel):
    text: str
    incident_type: str = "general"

class AnalyzeResponse(BaseModel):
    risk_score: float
    model_version: str
    flagged: bool
    summary: str

@app.get("/")
def health_check():
    return {"status": "ok", "service": "ai-service", "model": MODEL_NAME}

@app.post("/analyze", response_model=AnalyzeResponse)
def analyze_incident(req: AnalyzeRequest):
    # Baseline heuristic / model simulation
    high_risk_keywords = ["attack", "stalker", "danger", "weapon", "urgent", "help", "threat"]
    detected = any(keyword in req.text.lower() for keyword in high_risk_keywords)
    score = 0.88 if detected else 0.25

    return AnalyzeResponse(
        risk_score=score,
        model_version=MODEL_NAME,
        flagged=score >= THRESHOLD,
        summary=f"Analysis completed for type: {req.incident_type}"
    )
