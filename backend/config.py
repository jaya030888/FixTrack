from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PORT: int = 8000
    HOST: str = "0.0.0.0"
    ENVIRONMENT: str = "development"

    SUPABASE_URL: str
    SUPABASE_ANON_KEY: str
    SUPABASE_SERVICE_ROLE_KEY: Optional[str] = None
    SUPABASE_STORAGE_BUCKET_PHOTOS: str = "photos"

    AI_SERVICE_URL: Optional[str] = "http://localhost:8001"

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
