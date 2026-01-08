# Cloud Run deployment (Python backend)

This repo contains a Python FastAPI backend at `backend/api.py`.

## What you deploy
- Container image built from `Dockerfile`
- Service listens on `PORT` (Cloud Run provides this env var)

## Prereqs
- Google Cloud project
- Billing enabled
- `gcloud` CLI installed

## One-time setup
```bash
gcloud auth login
gcloud config set project YOUR_PROJECT_ID

gcloud services enable \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com
```

## Deploy
From the repo root:

```bash
gcloud run deploy savedbytheplate-backend \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars "PORT=8080" \
  --set-env-vars "PYTHONUNBUFFERED=1"
```

After deploy, Cloud Run will print a URL like:
- `https://savedbytheplate-backend-<hash>-uc.a.run.app`

That URL is your **production `BACKEND_API_URL`**.

## Health check
```bash
curl -s https://YOUR_CLOUD_RUN_URL/health
```

## Supabase Edge Function secrets
In Supabase Dashboard -> Edge Functions -> Secrets:
- `BACKEND_API_URL` = `https://YOUR_CLOUD_RUN_URL`
- `GOOGLE_AI_API_KEY` = your Gemini API key

(Your functions also read `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` for rate limiting/auth.)
