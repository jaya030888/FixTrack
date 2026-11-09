import sys
from pathlib import Path

# Ensure api directory and backend directory are on sys.path
current_dir = Path(__file__).resolve().parent
backend_dir = current_dir.parent / "backend"

for d in [str(current_dir), str(backend_dir)]:
    if d not in sys.path:
        sys.path.insert(0, d)

from main import app

# Vercel serverless entrypoint handler
app = app
