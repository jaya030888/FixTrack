from supabase import create_client, Client
from config import settings

# Supabase Client initialized from environment variables with safe fallback
supabase_key = settings.SUPABASE_SERVICE_ROLE_KEY or settings.SUPABASE_ANON_KEY or "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder"
supabase: Client = create_client(settings.SUPABASE_URL, supabase_key)

