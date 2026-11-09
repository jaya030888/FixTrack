from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import List, Dict, Any
import io
import sys
from pathlib import Path

# Add backend directory to sys.path if not present
backend_dir = str(Path(__file__).resolve().parent.parent)
if backend_dir not in sys.path:
    sys.path.append(backend_dir)

from ai_engine import run_hazard_detection, get_yolo_model

router = APIRouter(prefix="/api/ai", tags=["AI Inference - YOLOv8"])

@router.post("/detect")
async def detect_objects(file: UploadFile = File(...)):
    """
    Run custom fine-tuned YOLO model (best.pt) to detect potholes and road hazards.
    Returns detected classes, confidence scores, bounding boxes, and severity rating.
    """
    try:
        content = await file.read()
        result = run_hazard_detection(content)
        return {
            "detected": len(result.get("detected_objects", [])) > 0,
            "count": len(result.get("detected_objects", [])),
            "type": result.get("type", "pothole"),
            "severity_assessment": result.get("severity", "medium"),
            "confidence": result.get("confidence", 0.0),
            "detections": result.get("detected_objects", []),
            "model_source": result.get("model_source", "custom_best_pt")
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


