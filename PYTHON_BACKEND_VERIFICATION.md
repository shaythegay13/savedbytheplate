# Python Backend Verification Guide (Phase 4)

## Overview
This guide helps you verify that your Python FastAPI backend on Render is properly synced with GitHub and configured correctly.

## Step 1: Check GitHub Repository

### Verify the Repository Contents
1. Go to your Python backend repository on GitHub
2. Confirm these files exist:
   - `main.py` or `app/main.py` (FastAPI application)
   - `requirements.txt` (Python dependencies)
   - `/api/v1/garden-plan/generate` endpoint implementation
   - Any crop database files or data sources

### Check Key Files
The backend should have these endpoints:
- `GET /health` - Health check endpoint
- `POST /api/v1/garden-plan/generate` - Garden plan generation endpoint

### Expected Request Payload Structure
The Python backend should accept this JSON structure:
```json
{
  "space_type": "string",
  "space_size": "string",
  "sunlight": "string",
  "growing_location": "string",
  "soil_contaminated": "boolean or string",
  "soil_type": "string",
  "growing_options": "string",
  "rainfall": "string",
  "season": "string",
  "experience_level": "string",
  "goals": "string",
  "space_description": "string",
  "preferred_plants": "string or array",
  "time_commitment": "string",
  "latitude": "number",
  "longitude": "number",
  "city": "string",
  "hardiness_zone": "string",
  "avg_temp_min": "number",
  "avg_temp_max": "number",
  "avg_annual_precip": "number",
  "frost_free_days": "number",
  "first_frost_date": "string",
  "last_frost_date": "string",
  "google_enhanced": "object",
  "air_quality": "object",
  "solar_data": "object",
  "weather_data": "object",
  "pollen_data": "object",
  "elevation_data": "object",
  "aerial_view": "object"
}
```

### Expected Response Structure
The Python backend should return:
```json
{
  "plantRecommendations": [
    {
      "name": "string",
      "variety": "string",
      "plantingTime": "string",
      "harvestTime": "string",
      "spacing": "string",
      "careInstructions": "string",
      "difficulty": "Easy|Medium|Hard",
      "yield": "string"
    }
  ],
  "gardenLayout": [
    {
      "section": "string",
      "plants": ["string"],
      "size": "string",
      "notes": "string"
    }
  ],
  "plantingCalendar": [
    {
      "month": "string",
      "activities": ["string"]
    }
  ],
  "careInstructions": "string",
  "expertTips": ["string"]
}
```

## Step 2: Verify Render Deployment

### Check Render Dashboard
1. Go to https://dashboard.render.com/
2. Find your Python backend service
3. Check the service status:
   - ✅ **Active** - Service is running
   - 🟡 **Deploying** - Service is being deployed
   - ⏸️ **Suspended** - Service is sleeping (free tier)
   - ❌ **Failed** - Deployment failed

### Free Tier Considerations
If you're on Render's free tier:
- Services spin down after 15 minutes of inactivity
- Cold starts can take 30-50 seconds
- The first request after inactivity will timeout
- **Solution**: Wait 30 seconds and retry, or upgrade to paid tier

### Manual Redeploy
If the service needs to be redeployed:
1. Go to your Render dashboard
2. Click on your service
3. Click "Manual Deploy" → "Deploy latest commit"
4. Wait for deployment to complete (usually 2-5 minutes)

## Step 3: Verify Environment Variables

### Required Environment Variables on Render
Check that these are set in your Render service:
- `GOOGLE_MAPS_API_KEY` (if using Google Maps)
- Any database connection strings
- Any other API keys your backend needs

### Update Environment Variables
1. Go to Render dashboard → Your service → Environment
2. Add or update variables
3. Save changes (this will trigger a redeploy)

## Step 4: Test the Endpoints Directly

### Test Health Endpoint
```bash
curl https://agenticaigardenplanner.onrender.com/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2025-01-15T12:00:00Z"
}
```

### Test Garden Plan Generation
```bash
curl -X POST https://agenticaigardenplanner.onrender.com/api/v1/garden-plan/generate \
  -H "Content-Type: application/json" \
  -d '{
    "space_type": "balcony",
    "space_size": "small",
    "sunlight": "full-sun",
    "growing_location": "outdoors",
    "soil_type": "loamy",
    "rainfall": "moderate",
    "season": "spring",
    "experience_level": "beginner",
    "goals": "fresh vegetables",
    "space_description": "Small balcony in NYC",
    "preferred_plants": "tomatoes, herbs",
    "time_commitment": "1-2 hours per week",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "city": "New York"
  }'
```

## Step 5: Check CORS Configuration

### Python Backend CORS Setup
Ensure your FastAPI app has CORS configured:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your Lovable domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Step 6: Monitor Logs

### Check Render Logs
1. Go to Render dashboard → Your service → Logs
2. Look for errors during startup or requests
3. Common issues:
   - Missing dependencies in `requirements.txt`
   - Missing environment variables
   - Database connection failures
   - API key issues

## Step 7: Verify GitHub → Render Auto-Deploy

### Check Auto-Deploy Settings
1. Go to Render dashboard → Your service → Settings
2. Scroll to "Build & Deploy"
3. Verify:
   - Auto-Deploy is enabled
   - Correct branch is selected (usually `main` or `master`)
   - Build command is correct (e.g., `pip install -r requirements.txt`)
   - Start command is correct (e.g., `uvicorn main:app --host 0.0.0.0 --port $PORT`)

### Test Auto-Deploy
1. Make a small change to your GitHub repo (e.g., update a comment)
2. Commit and push to the connected branch
3. Check Render dashboard - it should automatically start deploying
4. Wait for deployment to complete

## Troubleshooting

### Issue: 504 Gateway Timeout
**Cause**: Render free tier cold start
**Solution**: Wait 30-50 seconds and retry

### Issue: 500 Internal Server Error
**Cause**: Backend code error or missing dependencies
**Solution**: Check Render logs for Python errors

### Issue: CORS Error
**Cause**: CORS not configured or misconfigured
**Solution**: Add CORSMiddleware to FastAPI app

### Issue: "Python backend is not responding"
**Cause**: Service is sleeping or crashed
**Solution**: 
1. Check Render dashboard for service status
2. Manually redeploy if needed
3. Check logs for startup errors

## Current Backend URL
Your Python backend is deployed at:
```
https://agenticaigardenplanner.onrender.com
```

## Next Steps After Verification

Once you've verified:
1. ✅ GitHub repo has correct code structure
2. ✅ Render service is active and deployed
3. ✅ Environment variables are set
4. ✅ CORS is configured
5. ✅ Endpoints respond correctly

Then test the full flow:
1. Go to your Lovable app
2. Navigate to the Garden Planner
3. Fill out the form
4. Submit and wait (allow extra time for cold start)
5. Check Edge Function logs for request/response details
6. Check Render logs for backend processing

## Monitoring Tips

- **Edge Function Logs**: https://supabase.com/dashboard/project/rxwynfplditdwqtjhkpw/functions/generate-smart-garden-plan/logs
- **Render Logs**: https://dashboard.render.com/ → Your service → Logs
- **Browser Console**: F12 → Console tab for frontend errors

## Getting Help

If you're still experiencing issues:
1. Share Edge Function logs
2. Share Render logs
3. Share browser console errors
4. Verify all payload structures match
5. Test endpoints directly with curl/Postman
