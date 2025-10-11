# Deployment Checklist - Google APIs Integration

## 🚀 Pre-Deployment

### 1. Google Cloud Setup
- [x] All 9 APIs enabled in Google Cloud Console
  - [x] Air Quality API
  - [x] Solar API
  - [x] Pollen API
  - [x] Maps Elevation API
  - [x] Maps Static API
  - [x] Street View Static API
  - [x] Map Tiles API
  - [x] Maps Embed API
  - [x] Maps JavaScript API
- [x] API key created: `AIzaSyCGuiIwh3b2OWtyAvQWqMVgqTpDDY-eBnk`
- [ ] API key restrictions configured (optional but recommended)
- [ ] Billing enabled and alerts set

### 2. Supabase Configuration
- [ ] **CRITICAL**: Add `GOOGLE_MAPS_API_KEY` secret
  - Go to: https://supabase.com/dashboard/project/rxwynfplditdwqtjhkpw/settings/functions
  - Name: `GOOGLE_MAPS_API_KEY`
  - Value: `AIzaSyCGuiIwh3b2OWtyAvQWqMVgqTpDDY-eBnk`
- [ ] Deploy `get-google-enhanced-data` edge function
- [ ] Deploy updated `generate-smart-garden-plan` edge function

### 3. Code Repositories
- [x] Frontend code pushed to GitHub (savedbytheplate)
- [x] Backend code pushed to GitHub (agenticaigardenplanner)
- [ ] Verify both repos show latest commits

---

## 📦 Deployment Steps

### Step 1: Deploy Supabase Edge Functions

#### Option A: Via Supabase CLI (Recommended)
```bash
cd /home/shaybouchles/CascadeProjects/savedbytheplate

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref rxwynfplditdwqtjhkpw

# Deploy new function
supabase functions deploy get-google-enhanced-data

# Deploy updated function
supabase functions deploy generate-smart-garden-plan
```

#### Option B: Via Supabase Dashboard
1. Go to: https://supabase.com/dashboard/project/rxwynfplditdwqtjhkpw/functions
2. Click **Deploy new function**
3. Upload `supabase/functions/get-google-enhanced-data/index.ts`
4. Repeat for `generate-smart-garden-plan`

#### Verify Deployment
```bash
# Test new function
curl https://rxwynfplditdwqtjhkpw.supabase.co/functions/v1/get-google-enhanced-data \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

### Step 2: Verify Backend Deployment (Render)

#### Check Render Auto-Deploy
1. Go to: https://dashboard.render.com/
2. Find `agenticaigardenplanner` service
3. Check latest deployment shows commit: `0547528` (Add Google APIs integration v4.1)
4. Verify status is **Live**

#### Manual Deploy (if needed)
1. In Render dashboard, click **Manual Deploy**
2. Select **Deploy latest commit**
3. Wait for deployment to complete (~2-3 minutes)

#### Verify Backend
```bash
# Check version
curl https://agenticaigardenplanner.onrender.com/

# Expected response includes:
# "version": "4.1.0"
# "features": [..., "Google APIs environmental data", ...]
```

### Step 3: Add Supabase Secret

**CRITICAL STEP - Required for Google APIs to work**

1. Go to: https://supabase.com/dashboard/project/rxwynfplditdwqtjhkpw/settings/functions
2. Scroll to **Secrets** section
3. Click **Add new secret**
4. Enter:
   - **Name**: `GOOGLE_MAPS_API_KEY`
   - **Value**: `AIzaSyCGuiIwh3b2OWtyAvQWqMVgqTpDDY-eBnk`
5. Click **Save**

**Verify Secret Added:**
- Secret should appear in the list
- Name should be exactly `GOOGLE_MAPS_API_KEY` (case-sensitive)

---

## ✅ Post-Deployment Verification

### Test 1: Backend Health Check
```bash
curl https://agenticaigardenplanner.onrender.com/
```
✅ **Expected**: Version `4.1.0` with Google APIs features

### Test 2: Google APIs Edge Function
```bash
curl -X POST 'https://rxwynfplditdwqtjhkpw.supabase.co/functions/v1/get-google-enhanced-data' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4d3luZnBsZGl0ZHdxdGpoa3B3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5MDgzMTMsImV4cCI6MjA2NDQ4NDMxM30.5xfL0tW0G_cue1dII_MdbBHxIHy8BEnb6gz1Vs5NOnA' \
  -H 'Content-Type: application/json' \
  -d '{"latitude": 40.7128, "longitude": -74.0060, "includeAirQuality": true, "includeSolar": true}'
```
✅ **Expected**: JSON with airQuality and solar data

### Test 3: End-to-End Garden Plan
```bash
curl -X POST 'https://rxwynfplditdwqtjhkpw.supabase.co/functions/v1/generate-smart-garden-plan' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4d3luZnBsZGl0ZHdxdGpoa3B3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5MDgzMTMsImV4cCI6MjA2NDQ4NDMxM30.5xfL0tW0G_cue1dII_MdbBHxIHy8BEnb6gz1Vs5NOnA' \
  -H 'Content-Type: application/json' \
  -d '{"latitude": 40.7128, "longitude": -74.0060, "space_type": "Raised Beds", "space_size": "Medium", "sunlight": "Full Sun", "experience_level": "Beginner", "preferred_plants": "Tomatoes,Herbs"}'
```
✅ **Expected**: Plan with "v4.1 (Google APIs Enhanced)" and environmental analysis

### Test 4: Frontend UI Test
1. Open: https://your-app-url.com/garden-plan
2. Enter location: "New York, NY"
3. Complete garden planning steps
4. Verify plan includes:
   - ✅ "v4.1 (Google APIs Enhanced)" in header
   - ✅ Solar analysis in sunlight line
   - ✅ Elevation in location line
   - ✅ Enhanced Environmental Analysis section

---

## 🔍 Monitoring Setup

### 1. Google Cloud Monitoring
- [ ] Set up billing alerts
  - Go to: https://console.cloud.google.com/billing
  - Set alert at $50/month
- [ ] Enable API usage notifications
- [ ] Bookmark API dashboard: https://console.cloud.google.com/apis/dashboard

### 2. Supabase Monitoring
- [ ] Bookmark edge function logs: https://supabase.com/dashboard/project/rxwynfplditdwqtjhkpw/logs
- [ ] Set up error alerts (if available)
- [ ] Monitor function invocation counts

### 3. Render Monitoring
- [ ] Bookmark backend logs: https://dashboard.render.com/
- [ ] Set up uptime monitoring
- [ ] Monitor response times

---

## 🐛 Troubleshooting

### Issue: "Google Maps key not configured"

**Cause**: Secret not added to Supabase

**Solution**:
1. Go to Supabase dashboard → Settings → Edge Functions → Secrets
2. Add `GOOGLE_MAPS_API_KEY` secret
3. Redeploy edge function

### Issue: "API key not valid"

**Cause**: API key incorrect or APIs not enabled

**Solution**:
1. Verify API key: `AIzaSyCGuiIwh3b2OWtyAvQWqMVgqTpDDY-eBnk`
2. Check all 9 APIs enabled in Google Cloud Console
3. Wait 5 minutes for API enablement to propagate

### Issue: Backend shows v4.0 instead of v4.1

**Cause**: Render hasn't deployed latest code

**Solution**:
1. Go to Render dashboard
2. Click **Manual Deploy** → **Deploy latest commit**
3. Wait 2-3 minutes for deployment

### Issue: No environmental data in plan

**Cause**: Google APIs not returning data

**Solution**:
1. Check Supabase logs for errors
2. Test `get-google-enhanced-data` function directly
3. Verify location has coverage (some APIs limited by region)

### Issue: Slow response times

**Cause**: Google APIs taking too long

**Solution**:
1. Check Google Cloud Console for API latency
2. Consider implementing caching (future enhancement)
3. Disable optional APIs (street view) to improve speed

---

## 📊 Success Criteria

### All Green ✅
- [ ] Backend API returns v4.1.0
- [ ] Google APIs edge function returns data
- [ ] End-to-end plan generation works
- [ ] Frontend displays enhanced data
- [ ] No errors in logs
- [ ] Response time < 5 seconds
- [ ] Google Cloud billing < $10/day

### Performance Targets
- Google APIs fetch: < 500ms
- Python backend: < 3 seconds
- Total end-to-end: < 5 seconds

---

## 🎯 Launch Checklist

### Pre-Launch
- [ ] All deployment steps completed
- [ ] All verification tests passed
- [ ] Monitoring set up
- [ ] Troubleshooting guide reviewed

### Launch Day
- [ ] Monitor logs for first 2 hours
- [ ] Check Google Cloud billing
- [ ] Test with 5+ different locations
- [ ] Verify error handling works

### Post-Launch (24 hours)
- [ ] Review API usage in Google Cloud
- [ ] Check for any errors in logs
- [ ] Verify costs are within budget
- [ ] Gather user feedback

### Week 1
- [ ] Analyze API usage patterns
- [ ] Optimize if needed
- [ ] Document any issues found
- [ ] Plan caching implementation if needed

---

## 📞 Emergency Contacts

### If Something Goes Wrong

**Disable Google APIs Integration:**
1. Revert frontend to previous commit
2. Redeploy edge functions
3. Backend will gracefully fallback to v4.0 behavior

**Disable Specific APIs:**
Edit edge function to set flags to false:
```typescript
includeAirQuality: false,  // Disable air quality
includeSolar: false,        // Disable solar
// etc.
```

**Rollback Backend:**
1. Go to Render dashboard
2. Find previous deployment (v4.0.2)
3. Click **Rollback to this version**

---

## 📚 Documentation Links

- **Setup Guide**: `GOOGLE_APIS_SETUP.md`
- **Integration Summary**: `GOOGLE_APIS_INTEGRATION_SUMMARY.md`
- **Test Guide**: `INTEGRATION_TEST_GUIDE.md`
- **Backend Changelog**: `agenticaigardenplanner/CHANGELOG_v4_1.md`
- **Data Flow**: `supabase/functions/get-google-enhanced-data/DATA_FLOW.md`

---

## ✨ You're Ready to Deploy!

Follow this checklist step by step, and you'll have a world-class garden planner with Google APIs integration! 🚀🌱

**Estimated Deployment Time**: 15-30 minutes  
**Difficulty**: Medium  
**Risk Level**: Low (fully backward compatible)

---

**Last Updated**: 2025-10-11  
**Version**: 1.0  
**Status**: Ready for Production
