import sys
from pathlib import Path

# Ensure backend/api and backend directories are on sys.path
current_dir = Path(__file__).resolve().parent
backend_dir = current_dir.parent

for d in [str(current_dir), str(backend_dir)]:
    if d not in sys.path:
        sys.path.insert(0, d)

from main import app

# Vercel serverless entrypoint handler
app = app
handler = app
