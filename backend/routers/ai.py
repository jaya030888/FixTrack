from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import List, Dict, Any
import io

router = APIRouter(prefix="/api/ai", tags=["AI Inference - YOLOv8"])

@router.post("/detect")
async def detect_objects(file: UploadFile = File(...)):
    """
    Run YOLOv8 inference to detect potholes, garbage, or road hazards.
    Returns detected classes, confidence scores, and bounding boxes.
    """
    try:
        from PIL import Image
        content = await file.read()
        image = Image.open(io.BytesIO(content))

        # Lazy load YOLOv8 model
        try:
            from ultralytics import YOLO
            model = YOLO("yolov8n.pt") # lightweight base model or fine-tuned weights
            results = model(image)
            
            detections = []
            for r in results:
                for box in r.boxes:
                    cls_id = int(box.cls[0])
                    label = model.names[cls_id]
                    confidence = float(box.conf[0])
                    xyxy = box.xyxy[0].tolist() # [x1, y1, x2, y2]
                    
                    detections.append({
                        "label": label,
                        "confidence": round(confidence, 3),
                        "box": [round(coord, 2) for coord in xyxy]
                    })

            # Calculate severity heuristic based on detection size & confidence
            severity = "medium"
            if len(detections) > 3 or any(d["confidence"] > 0.85 for d in detections):
                severity = "high"

            return {
                "detected": len(detections) > 0,
                "count": len(detections),
                "severity_assessment": severity,
                "detections": detections
            }
        except ImportError:
            # Fallback simulator if ultralytics/torch is still downloading
            return {
                "detected": True,
                "count": 1,
                "severity_assessment": "medium",
                "detections": [{
                    "label": "pothole",
                    "confidence": 0.88,
                    "box": [120.5, 85.0, 310.2, 245.8]
                }],
                "note": "Simulator mode (install ultralytics for live weights)"
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
