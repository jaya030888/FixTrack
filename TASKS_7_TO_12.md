# FixTrack / HerHack - Roadmap & Production Blueprint (Tasks 7 to 12)

This document outlines the detailed execution plan and configurations for **Tasks 7 through 12**.

---

## Task 7: Train the AI Model and Plug in `best.pt`
- **Objective**: Replace dummy labels and hardcoded "medium" severities with custom object detection.
- **Implementation**:
  - Model loader configured at [`backend/ai_engine.py`](file:///c:/Users/Jaya/Desktop/HerHack/backend/ai_engine.py).
  - Expects fine-tuned model weights placed at: `backend/models/best.pt`.
  - When `best.pt` is dropped into `backend/models/`, the engine dynamically prioritizes it; otherwise, it utilizes pretrained `yolov8n.pt` with automatic class-to-severity mapping based on relative bounding-box area (`(w * h) / (img_w * img_h)`).
- **Free Google Colab Training Notebook Recipe**:
  ```python
  from ultralytics import YOLO
  # 1. Load nano model
  model = YOLO('yolov8n.pt')
  # 2. Train on road hazards (Potholes, Garbage, Debris)
  model.train(data='road-hazards.yaml', epochs=50, imgsz=640, device=0)
  # 3. Download runs/detect/train/weights/best.pt -> place into backend/models/best.pt
  ```

---

## Task 8: Real Before/After AI Check (`disputed` Flagging)
- **Objective**: Replace manual "looks fixed" guesswork with automatic scene and hazard validation.
- **Endpoint**: `POST /api/civic/incidents/{incident_id}/verify-resolution`
- **Logic Matrix**:
  1. Compares structural similarity between the original `before_photo` and the uploaded `after_photo`.
  2. If similarity $< 0.40$ (e.g. photo taken in a completely different room or road) &rarr; flags status as **`disputed`**.
  3. Re-runs YOLO inference on `after_photo`. If the hazard is still detected with high confidence &rarr; flags status as **`disputed`**.
  4. Only when scene matches AND hazard is absent does it mark **`resolved`**.

---

## Task 9: Login & Supabase Auth Integration
- **Objective**: Enable citizen and authority roles so civic scores belong to authenticated profiles.
- **Supabase Auth Config**:
  - Citizen signup: sets `role: 'citizen'` in `profiles`.
  - Municipal worker / Authority login: sets `role: 'responder'` or `'admin'`.
  - Connected in `frontend/src/services/supabase.js`:
    ```javascript
    // Sign Up
    await supabase.auth.signUp({ email, password, options: { data: { name, role: 'citizen' } } });
    // Sign In
    await supabase.auth.signInWithPassword({ email, password });
    ```
- **Civic Score Policy**:
  - Citizens earn **+10 points** per verified report.
  - Citizens earn **+5 points** per duplicate confirmation (upvoting).
  - High scores grant civic trust badges on the public map.

---

## Task 10: Testing & Field Resilience Checklist
- **Bad Photos**: Tested handling of blurry, low-light, and non-hazard images (graceful fallback).
- **No GPS**: Tested manual landmark entry fallback and IP-based coordinate resolution.
- **Slow 3G Connection**: Client compresses images using canvas before dispatching multipart payload.

---

## Task 11: Deployment Architecture
| Component | Platform | Environment Variables Required |
|---|---|---|
| **AI Detection Service** | **Hugging Face Spaces** (Docker/Gradio/FastAPI) | `PORT=7860` |
| **Backend API** | **Render / Railway** | `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `PORT=8000` |
| **Frontend** | **Vercel** (Zero-config Next.js) | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_API_URL` |
| **Uptime Monitor** | **UptimeRobot** | Ping `https://<backend>.onrender.com/` every 5 min to prevent cold starts |

---

## Task 12: Pitch & Demo Strategy
- **4 Real Test Photos Ready**:
  1. `pothole_before.jpg`: Clear road pothole with water.
  2. `pothole_fake_after.jpg`: Picture of a living room rug &rarr; triggers **`disputed`** verdict!
  3. `pothole_real_after.jpg`: Freshly asphalted road patch &rarr; triggers **`resolved`** verdict!
  4. `night_harassment.jpg`: Dark street corner &rarr; triggers SafeWalk SOS alert.
- **Demo Accounts Pre-configured**:
  - `citizen@fix-track.org` (Civic score: 140)
  - `authority@bbmp.gov.in` (Municipal resolver role)

