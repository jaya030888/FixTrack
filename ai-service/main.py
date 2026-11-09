import os
import io
from pathlib import Path
from typing import List, Dict, Any, Optional
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from PIL import Image

# Hugging Face Spaces port requirement: 7860
PORT = int(os.getenv("PORT", 7860))

# Absolute path resolution to ensure best.pt is found both locally and inside container
BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "best.pt"

app = FastAPI(
    title="FixTrack / HerHack Pothole Detection AI Microservice",
    description="Fine-tuned YOLO AI hazard detector for road infrastructure monitoring. Designed for Hugging Face Spaces.",
    version="1.0.0"
)

# Enable CORS for external frontend and backend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Lazy model cache
_yolo_model = None

def get_model():
    """Load the fine-tuned YOLO model from container or local path."""
    global _yolo_model
    if _yolo_model is not None:
        return _yolo_model

    from ultralytics import YOLO

    resolved_path = None
    candidate_paths = [
        MODEL_PATH,
        Path("/app/best.pt"),
        BASE_DIR.parent / "models" / "best.pt",
        Path("best.pt"),
    ]

    for p in candidate_paths:
        if p.exists() and p.is_file():
            resolved_path = p
            break

    if resolved_path:
        print(f"🎯 Loading trained model from: {resolved_path}")
        _yolo_model = YOLO(str(resolved_path))
        print(f"✅ Model loaded! Task: {getattr(_yolo_model, 'task', 'unknown')}, Classes: {_yolo_model.names}")
    else:
        print("⚠️ best.pt not found at candidate paths. Falling back to yolov8n.pt")
        _yolo_model = YOLO("yolov8n.pt")

    return _yolo_model


@app.get("/")
def root():
    return {
        "status": "online",
        "service": "Pothole Detection AI",
        "port": PORT,
        "model_file_present": MODEL_PATH.exists(),
        "model_path": str(MODEL_PATH),
        "docs_url": "/docs"
    }


@app.get("/health")
def health():
    return {"status": "healthy", "service": "ai-service"}


@app.post("/detect")
async def detect_hazard(file: UploadFile = File(...)):
    """
    Primary Detection Endpoint:
    Accepts an uploaded road/pothole image.
    Returns detected objects, bounding boxes, confidence score, and calculated severity.
    """
    try:
        content = await file.read()
        image = Image.open(io.BytesIO(content)).convert("RGB")
        width, height = image.size

        model = get_model()
        results = model(image, verbose=False)

        detections = []
        max_box_area_ratio = 0.0
        detected_type = "pothole"
        top_confidence = 0.0

        for r in results:
            if hasattr(r, "boxes") and r.boxes is not None:
                for box in r.boxes:
                    cls_id = int(box.cls[0])
                    label = model.names.get(cls_id, "pothole").lower()
                    conf = float(box.conf[0])
                    xyxy = box.xyxy[0].tolist()

                    # Class normalization
                    if any(k in label for k in ["pothole", "hole", "crack", "road"]):
                        mapped_type = "pothole"
                    else:
                        mapped_type = label

                    if conf > top_confidence:
                        top_confidence = conf
                        detected_type = mapped_type

                    # Compute physical size heuristic
                    box_w = max(0, xyxy[2] - xyxy[0])
                    box_h = max(0, xyxy[3] - xyxy[1])
                    area_ratio = (box_w * box_h) / (width * height)
                    if area_ratio > max_box_area_ratio:
                        max_box_area_ratio = area_ratio

                    detections.append({
                        "label": mapped_type,
                        "confidence": round(conf, 3),
                        "box": [round(c, 2) for c in xyxy],
                        "area_ratio": round(area_ratio, 3)
                    })

        # Calculate severity heuristic based on physical area and detection count
        if len(detections) == 0:
            severity = "low"
            top_confidence = 0.0
            detected_type = "pothole"
        elif max_box_area_ratio > 0.20 or len(detections) >= 4 or top_confidence > 0.90:
            severity = "critical" if max_box_area_ratio > 0.35 else "high"
        elif max_box_area_ratio > 0.08 or len(detections) >= 2:
            severity = "medium"
        else:
            severity = "low"

        return {
            "detected": len(detections) > 0,
            "count": len(detections),
            "type": detected_type,
            "severity": severity,
            "confidence": round(top_confidence, 3),
            "detections": detections,
            "image_dimensions": {"width": width, "height": height},
            "model_source": "best.pt" if MODEL_PATH.exists() else "fallback"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    print(f"🚀 Starting AI Detector microservice on port {PORT}...")
    uvicorn.run("main:app", host="0.0.0.0", port=PORT, reload=False)
