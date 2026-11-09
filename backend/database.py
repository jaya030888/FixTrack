from supabase import create_client, Client
from config import settings

# Supabase Client initialized from environment variables with safe fallback
supabase_url = settings.SUPABASE_URL if (settings.SUPABASE_URL and settings.SUPABASE_URL.startswith("http")) else "https://hzalojkkghsxwbdflkyk.supabase.co"
supabase_key = settings.SUPABASE_SERVICE_ROLE_KEY or settings.SUPABASE_ANON_KEY or "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder"

try:
    supabase: Client = create_client(supabase_url, supabase_key)
except Exception as e:
    print(f"Warning: Supabase client initialization notice: {e}")
    try:
        supabase: Client = create_client("https://hzalojkkghsxwbdflkyk.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder")
    except Exception:
        supabase = None
