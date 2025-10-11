# Integration Test Guide - Google APIs + Garden Planner

## Overview

This guide walks you through testing the complete integration between the frontend (savedbytheplate), Supabase edge functions, and Python backend (agenticaigardenplanner).

---

## Pre-Test Checklist

### ✅ Frontend (savedbytheplate)
- [x] Code pushed to GitHub
- [ ] Supabase secret `GOOGLE_MAPS_API_KEY` added
- [ ] Edge function `get-google-enhanced-data` deployed
- [ ] Edge function `generate-smart-garden-plan` updated

### ✅ Backend (agenticaigardenplanner)
- [x] Code pushed to GitHub
- [ ] Render auto-deployed v4.1.0
- [ ] API endpoint accessible

---

## Test 1: Backend API Health Check

### Test the Python backend is running v4.1.0

```bash
curl https://agenticaigardenplanner.onrender.com/
```

**Expected Response:**
```json
{
  "status": "online",
  "service": "AI Garden Planner API",
  "version": "4.1.0",
  "features": [
    "100+ crop varieties",
    "Google APIs environmental data",
    "Air quality analysis",
    "Solar exposure mapping",
    "Pollen tracking",
    "Elevation-based adjustments"
  ],
  "docs": "/docs"
}
```

✅ **Pass Criteria**: Version shows `4.1.0` and features include Google APIs

---

## Test 2: Edge Function - Google Enhanced Data

### Test the new Google APIs edge function

```bash
curl -X POST 'https://rxwynfplditdwqtjhkpw.supabase.co/functions/v1/get-google-enhanced-data' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4d3luZnBsZGl0ZHdxdGpoa3B3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5MDgzMTMsImV4cCI6MjA2NDQ4NDMxM30.5xfL0tW0G_cue1dII_MdbBHxIHy8BEnb6gz1Vs5NOnA' \
  -H 'Content-Type: application/json' \
  -d '{
    "latitude": 40.7128,
    "longitude": -74.0060,
    "includeAirQuality": true,
    "includeSolar": true,
    "includeWeather": true,
    "includePollen": true,
    "includeElevation": true,
    "includeAerialView": true,
    "includeStreetView": false
  }'
```

**Expected Response Structure:**
```json
{
  "location": {
    "latitude": 40.7128,
    "longitude": -74.0060
  },
  "airQuality": {
    "aqi": 45,
    "category": "Good",
    "dominantPollutant": "PM2.5",
    "pollutants": {...},
    "healthRecommendations": [...],
    "gardenImpact": "..."
  },
  "solar": {
    "maxSunshineHoursPerYear": 2800,
    "solarPotential": "High",
    "sunlightHoursPerDay": {
      "spring": 7.5,
      "summer": 8.5,
      "fall": 6.5,
      "winter": 4.2
    }
  },
  "pollen": {...},
  "elevation": {...},
  "weather": {...},
  "aerialView": {...},
  "timestamp": "2025-10-11T..."
}
```

✅ **Pass Criteria**: 
- Returns data for all requested APIs
- No errors in response
- Response time < 1 second

### Common Errors & Solutions

**Error: "Google Maps key not configured"**
- Solution: Add `GOOGLE_MAPS_API_KEY` to Supabase secrets

**Error: "API key not valid"**
- Solution: Verify API key is correct and all APIs are enabled in Google Cloud Console

**Error: "Quota exceeded"**
- Solution: Check Google Cloud Console for API usage limits

---

## Test 3: End-to-End Garden Plan Generation

### Test complete flow from frontend to backend

```bash
curl -X POST 'https://rxwynfplditdwqtjhkpw.supabase.co/functions/v1/generate-smart-garden-plan' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4d3luZnBsZGl0ZHdxdGpoa3B3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5MDgzMTMsImV4cCI6MjA2NDQ4NDMxM30.5xfL0tW0G_cue1dII_MdbBHxIHy8BEnb6gz1Vs5NOnA' \
  -H 'Content-Type: application/json' \
  -d '{
    "space_type": "Raised Beds",
    "space_size": "Medium (balcony, small patio)",
    "sunlight": "Full Sun (6+ hours direct sunlight)",
    "growing_location": "outdoors",
    "soil_contaminated": false,
    "soil_type": "Medium (Loam, mixed)",
    "growing_options": "traditional",
    "rainfall": "moderate",
    "season": "spring",
    "experience_level": "Beginner (never grown anything before)",
    "goals": "food production",
    "space_description": "Small balcony garden",
    "preferred_plants": "Tomatoes,Herbs,Leafy Greens",
    "time_commitment": "moderate",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "city": "New York, NY"
  }'
```

**Expected Response:**
```json
{
  "plan": "======================================================================\nCUSTOMIZED GARDENING PLAN v4.1 (Google APIs Enhanced)\n======================================================================\n\nLocation: New York NY USA (40.7128, -74.0060) | TZ: America/New_York\nRegion: Northeast | USDA Zone: 7a | Elevation: 10m (Temp adjustment: -0.1°F)\n...\n\n================================================================================\nENHANCED ENVIRONMENTAL ANALYSIS (Google APIs)\n================================================================================\n\n🌫️ AIR QUALITY ANALYSIS\nCurrent AQI: 45 (Good)\n...",
  "planId": "..."
}
```

✅ **Pass Criteria**:
- Plan header shows "v4.1 (Google APIs Enhanced)"
- Includes "ENHANCED ENVIRONMENTAL ANALYSIS" section
- Shows solar analysis in sunlight line
- Shows elevation in location line
- No errors in response
- Response time < 5 seconds

---

## Test 4: Frontend UI Test

### Manual test through the web interface

1. **Navigate to Garden Planner**
   - Go to: http://localhost:5173/garden-plan (or your production URL)

2. **Enter Location**
   - Enter: "New York, NY" or any address
   - Click "Continue"

3. **Complete Garden Questions**
   - Select garden type, size, sunlight, etc.
   - Complete all steps

4. **Check Generated Plan**
   - Open browser DevTools Console (F12)
   - Look for logs:
     ```
     Enhanced Google data fetched: {
       hasAirQuality: true,
       hasSolar: true,
       hasWeather: true,
       hasPollen: true,
       hasElevation: true
     }
     ```

5. **Verify Plan Content**
   - Plan should show "v4.1 (Google APIs Enhanced)"
   - Should include environmental analysis section
   - Should show precise solar hours
   - Should show elevation data

✅ **Pass Criteria**:
- All Google APIs return data (check console logs)
- Plan includes enhanced environmental analysis
- No errors in console
- Plan generation completes successfully

---

## Test 5: Error Handling Test

### Test graceful degradation when APIs fail

```bash
# Test with invalid coordinates (should still generate plan)
curl -X POST 'https://rxwynfplditdwqtjhkpw.supabase.co/functions/v1/generate-smart-garden-plan' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4d3luZnBsZGl0ZHdxdGpoa3B3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5MDgzMTMsImV4cCI6MjA2NDQ4NDMxM30.5xfL0tW0G_cue1dII_MdbBHxIHy8BEnb6gz1Vs5NOnA' \
  -H 'Content-Type: application/json' \
  -d '{
    "space_type": "Raised Beds",
    "space_size": "Medium",
    "sunlight": "Full Sun",
    "experience_level": "Beginner",
    "preferred_plants": "Tomatoes",
    "latitude": 0,
    "longitude": 0
  }'
```

✅ **Pass Criteria**:
- Plan still generates (fallback to standard data)
- No 500 errors
- Plan shows standard version without enhanced analysis

---

## Test 6: Performance Test

### Measure response times

```bash
# Time the complete flow
time curl -X POST 'https://rxwynfplditdwqtjhkpw.supabase.co/functions/v1/generate-smart-garden-plan' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4d3luZnBsZGl0ZHdxdGpoa3B3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5MDgzMTMsImV4cCI6MjA2NDQ4NDMxM30.5xfL0tW0G_cue1dII_MdbBHxIHy8BEnb6gz1Vs5NOnA' \
  -H 'Content-Type: application/json' \
  -d '{
    "latitude": 40.7128,
    "longitude": -74.0060,
    "space_type": "Raised Beds",
    "space_size": "Medium",
    "sunlight": "Full Sun",
    "experience_level": "Beginner",
    "preferred_plants": "Tomatoes,Herbs"
  }' \
  -o /dev/null -s
```

✅ **Pass Criteria**:
- Total time < 5 seconds
- Google APIs fetch < 1 second
- Python backend processing < 3 seconds

---

## Test 7: Different Locations Test

### Test with various locations to ensure global coverage

**Test Locations:**

1. **New York, NY** (Urban, Northeast)
   - Lat: 40.7128, Lon: -74.0060
   - Expected: High air quality data, good solar coverage

2. **Los Angeles, CA** (Urban, West Coast)
   - Lat: 34.0522, Lon: -118.2437
   - Expected: Moderate air quality, excellent solar

3. **Denver, CO** (High Elevation)
   - Lat: 39.7392, Lon: -104.9903
   - Expected: Elevation adjustments, excellent solar

4. **Miami, FL** (Coastal, Tropical)
   - Lat: 25.7617, Lon: -80.1918
   - Expected: High pollen, high humidity

5. **Rural Montana** (Remote)
   - Lat: 46.8797, Lon: -110.3626
   - Expected: Limited street view, good air quality

✅ **Pass Criteria**:
- All locations generate plans
- Environmental data varies appropriately by location
- Elevation adjustments correct for Denver
- No crashes or errors

---

## Troubleshooting Guide

### Issue: No Google API data in plan

**Check:**
1. Supabase logs for `get-google-enhanced-data` errors
2. Google Cloud Console for API enablement
3. API key in Supabase secrets

**Solution:**
```bash
# Check Supabase logs
# Go to: https://supabase.com/dashboard/project/rxwynfplditdwqtjhkpw/logs

# Verify API key
# Go to: https://supabase.com/dashboard/project/rxwynfplditdwqtjhkpw/settings/functions
```

### Issue: Plan shows v4.0 instead of v4.1

**Check:**
1. Python backend deployed latest version
2. Check: https://agenticaigardenplanner.onrender.com/

**Solution:**
```bash
# Force redeploy on Render
# Or check Render logs for deployment errors
```

### Issue: Slow response times

**Check:**
1. Google API response times in Supabase logs
2. Python backend response time

**Solution:**
- Consider caching Google API responses
- Check Render instance isn't sleeping (free tier)

### Issue: API quota exceeded

**Check:**
1. Google Cloud Console → APIs & Services → Dashboard
2. View API usage metrics

**Solution:**
- Implement caching layer
- Reduce API calls (disable optional APIs)
- Upgrade Google Cloud billing

---

## Success Metrics

### ✅ All Tests Passing
- [ ] Backend health check shows v4.1.0
- [ ] Google APIs edge function returns data
- [ ] End-to-end plan generation works
- [ ] Frontend UI displays enhanced data
- [ ] Error handling works gracefully
- [ ] Performance under 5 seconds
- [ ] Multiple locations work

### 📊 Expected Performance
- Google APIs fetch: 300-500ms
- Python backend: 2-3 seconds
- Total end-to-end: 3-5 seconds

### 🎯 Quality Indicators
- No console errors
- All environmental sections present
- Solar data overrides user sunlight
- Elevation adjustments visible
- Air quality warnings when appropriate

---

## Next Steps After Testing

### If All Tests Pass ✅
1. Monitor production usage for 24 hours
2. Check Google Cloud billing
3. Set up monitoring alerts
4. Document any edge cases found

### If Tests Fail ❌
1. Check specific test failure
2. Review Supabase logs
3. Check Google Cloud Console
4. Verify API keys and secrets
5. Contact support if needed

---

## Monitoring & Maintenance

### Daily Checks
- [ ] Check Supabase edge function logs
- [ ] Monitor Google Cloud API usage
- [ ] Check Render backend logs

### Weekly Checks
- [ ] Review Google Cloud costs
- [ ] Check API success rates
- [ ] Monitor response times

### Monthly Checks
- [ ] Review and optimize API usage
- [ ] Update documentation
- [ ] Check for API deprecations

---

## Support Resources

- **Supabase Dashboard**: https://supabase.com/dashboard/project/rxwynfplditdwqtjhkpw
- **Google Cloud Console**: https://console.cloud.google.com/
- **Render Dashboard**: https://dashboard.render.com/
- **Frontend Repo**: https://github.com/shaythegay13/savedbytheplate
- **Backend Repo**: https://github.com/shaythegay13/agenticaigardenplanner

---

**Last Updated**: 2025-10-11  
**Version**: 1.0  
**Integration**: Frontend v1.0 + Backend v4.1.0
