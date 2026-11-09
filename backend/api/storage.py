"""Supabase Storage helpers. Kept separate so storage logic is easy to swap later."""
import uuid

from config import settings
from database import supabase


def upload_photo(content: bytes, filename: str | None, content_type: str | None) -> str:
    """Upload image bytes to the Supabase photos bucket and return its public URL."""
    ext = filename.rsplit(".", 1)[-1].lower() if filename and "." in filename else "jpg"
    path = f"reports/{uuid.uuid4()}.{ext}"
    bucket = supabase.storage.from_(settings.SUPABASE_STORAGE_BUCKET_PHOTOS)
    bucket.upload(path, content, {"content-type": content_type or "image/jpeg"})
    return bucket.get_public_url(path)
