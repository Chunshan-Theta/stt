# Docker usage

Quick steps to build and run the full stack (frontend + backend + MongoDB) with Docker Compose.

1. Copy and edit environment file for backend:

   - Create `backend/.env` from `backend/.env.example` and set your actual API keys (OpenAI/Gemini) and any other environment variables.

2. Build and start everything:

```bash
docker-compose up --build
```

3. Access the apps:

- Frontend (served by nginx): http://localhost:3000
- Backend API: http://localhost:5001 (endpoints under /api/...)

Notes:

- The compose file includes a `mongo` service. The default `MONGODB_URI` in the `.env.example` points to `mongodb://mongo:27017/stt-database` so the backend connects to the Mongo container.
- Uploaded files are persisted to `./backend/uploads` on the host via a bind mount.
- Keep secrets out of version control. Use Docker secrets or environment management in production.
