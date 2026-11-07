import os
from pydantic_settings import BaseSettings
from typing import Optional
from pathlib import Path
import os

BACKEND_DIR = Path(__file__).resolve().parent
ENV_PATH = BACKEND_DIR / ".env"

class Settings(BaseSettings):
    PORT: int = 8000
    HOST: str = "0.0.0.0"
    ENVIRONMENT: str = "development"

    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "https://hzalojkkghsxwbdflkyk.supabase.co")
    SUPABASE_ANON_KEY: Optional[str] = os.getenv("SUPABASE_ANON_KEY")
    SUPABASE_SERVICE_ROLE_KEY: Optional[str] = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    SUPABASE_STORAGE_BUCKET_PHOTOS: str = "photos"

    AI_SERVICE_URL: Optional[str] = "http://localhost:8001"

    class Config:
        env_file = str(ENV_PATH)
        extra = "ignore"

settings = Settings()
