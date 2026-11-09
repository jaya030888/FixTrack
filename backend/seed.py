import random
import uuid
from datetime import datetime, timedelta
from database import supabase
from config import settings

# Center coordinates for realistic incident clusters (Bangalore / Delhi-NCR metro hubs)
HUBS = [
    {"name": "Bangalore Central", "lat": 12.9716, "lng": 77.5946},
    {"name": "Indiranagar", "lat": 12.9784, "lng": 77.6408},
    {"name": "Koramangala", "lat": 12.9352, "lng": 77.6245},
    {"name": "Whitefield", "lat": 12.9698, "lng": 77.7500},
    {"name": "Delhi Connaught Place", "lat": 28.6304, "lng": 77.2177},
    {"name": "Delhi South Ex", "lat": 28.5683, "lng": 77.2212}
]

INCIDENT_TYPES = ["pothole", "garbage", "harassment", "unsafe_area", "street_light"]
SEVERITIES = ["low", "medium", "high", "critical"]
STATUSES = ["open", "investigating", "in_progress", "resolved"]

SAMPLE_PHOTOS = [
    "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600",
    "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600",
    "https://images.unsplash.com/photo-1605647540924-852290f6b0d5?w=600",
    "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600"
]

def seed_database(count=150):
    print(f"🌱 Generating {count} realistic civic & safety incidents...")
    now = datetime.utcnow()
    created_incidents = 0
    created_reports = 0

    for i in range(count):
        hub = random.choice(HUBS)
        # Random jitter (~0 to 3km radius)
        lat_jitter = random.uniform(-0.025, 0.025)
        lng_jitter = random.uniform(-0.025, 0.025)
        lat = round(hub["lat"] + lat_jitter, 6)
        lng = round(hub["lng"] + lng_jitter, 6)

        inc_type = random.choice(INCIDENT_TYPES)
        severity = random.choices(SEVERITIES, weights=[0.2, 0.4, 0.3, 0.1])[0]
        status = random.choices(STATUSES, weights=[0.45, 0.20, 0.15, 0.20])[0]
        days_ago = random.randint(0, 30)
        hours_ago = random.randint(0, 23)
        created_time = (now - timedelta(days=days_ago, hours=hours_ago)).isoformat() + "Z"

        address = f"Near Sector {random.randint(1, 22)}, {hub['name']} Main Road"

        # 1. Insert Incident
        incident_row = {
            "type": inc_type,
            "severity": severity,
            "latitude": lat,
            "longitude": lng,
            "location": f"SRID=4326;POINT({lng} {lat})",
            "address": address,
            "status": status,
            "confirmed_count": random.randint(1, 8),
            "incident_time": created_time,
            "created_at": created_time,
            "updated_at": created_time
        }

        try:
            res = supabase.table("incidents").insert(incident_row).execute()
            if res.data and len(res.data) > 0:
                created_incidents += 1
                incident_id = res.data[0]["id"]

                # 2. Insert Linked Report
                report_row = {
                    "incident_id": incident_id,
                    "before_photo": random.choice(SAMPLE_PHOTOS),
                    "after_photo": random.choice(SAMPLE_PHOTOS) if status == "resolved" else None,
                    "details": f"Automated citizen safety & road issue report for {inc_type}.",
                    "report_time": created_time,
                    "created_at": created_time
                }
                supabase.table("reports").insert(report_row).execute()
                created_reports += 1
        except Exception as e:
            print(f"Error seeding item {i}: {e}")

    print(f"✅ Seeding complete: {created_incidents} incidents and {created_reports} reports added to Supabase!")

if __name__ == "__main__":
    seed_database(150)

