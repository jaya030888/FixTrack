from supabase import create_client, Client
from config import settings

# Supabase Client initialized from environment variables
supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY or settings.SUPABASE_ANON_KEY)

