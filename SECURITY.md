# Environment and Security Architecture Policy

## Core Principle: Zero Hardcoded URLs and Secrets
1. **Never Hardcode Secrets or Service URLs**:
   - Every API URL, base domain, port, database host, Supabase key, or third-party service credential must strictly be loaded from environment variables (`.env`).
   - Defaults in code must only be fallback placeholders or development fallbacks pointing to local environment configs, never production secrets or hardcoded live URLs.

2. **Git Safeguards**:
   - All `.env` files are tracked in `.gitignore` and must never be committed.
   - Any new service or environment must commit a `.env.example` file describing required keys without secrets.
   - Local upload directories (`uploads/`), Python virtual environments (`venv/`), and dependency trees (`node_modules/`) are strictly ignored.

3. **Current Environment Contracts**:
   - **Frontend**: Accessible via `import.meta.env.VITE_*` (e.g. `VITE_API_BASE_URL`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
   - **Backend**: Managed via Pydantic `BaseSettings` reading `.env` (e.g. `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `AI_SERVICE_URL`).
   - **AI Service**: Loaded via `python-dotenv` and `os.getenv` (e.g. `MODEL_NAME`, `CONFIDENCE_THRESHOLD`, `PORT`).
