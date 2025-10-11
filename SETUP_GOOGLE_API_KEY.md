# Quick Setup: Google API Key

Your Google API key has been added to the local `.env` file. Now you need to add it to Supabase for the edge functions to use it.

## Your API Key
```
AIzaSyCGuiIwh3b2OWtyAvQWqMVgqTpDDY-eBnk
```

---

## Option 1: Supabase Dashboard (Recommended)

### Step 1: Go to Supabase Dashboard
1. Open: https://supabase.com/dashboard/project/rxwynfplditdwqtjhkpw
2. Log in if needed

### Step 2: Navigate to Edge Functions Secrets
1. Click **Edge Functions** in the left sidebar
2. Click **Manage secrets** button (top right)
   - OR go directly to: https://supabase.com/dashboard/project/rxwynfplditdwqtjhkpw/settings/functions

### Step 3: Add the Secret
1. Click **Add new secret**
2. **Name**: `GOOGLE_MAPS_API_KEY`
3. **Value**: `AIzaSyCGuiIwh3b2OWtyAvQWqMVgqTpDDY-eBnk`
4. Click **Save** or **Add secret**

### Step 4: Verify
The secret should now appear in your list of edge function secrets.

---

## Option 2: Supabase CLI (If you install it later)

```bash
# Install Supabase CLI (if not installed)
npm install -g supabase

# Set the secret
supabase secrets set GOOGLE_MAPS_API_KEY="AIzaSyCGuiIwh3b2OWtyAvQWqMVgqTpDDY-eBnk"
```

---

## Option 3: Alternative Secret Names

The edge function checks for multiple possible secret names. If `GOOGLE_MAPS_API_KEY` doesn't work, try:
- `Google_Maps`
- `GOOGLE_MAPS`
- `GOOGLE_MAPS_KEY`

---

## Verify It's Working

### Test the Edge Function

1. After adding the secret, test the function:

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

2. You should get a JSON response with air quality, solar, weather, pollen, elevation, and aerial view data.

### Test via Garden Planner

1. Go to your app: http://localhost:5173/garden-plan (or your production URL)
2. Enter a location (e.g., "New York, NY")
3. Complete the garden planning steps
4. Check the browser console for:
   ```
   Enhanced Google data fetched: { hasAirQuality: true, hasSolar: true, ... }
   ```

---

## Troubleshooting

### "API key not valid" error
- Double-check the key is exactly: `AIzaSyCGuiIwh3b2OWtyAvQWqMVgqTpDDY-eBnk`
- Make sure there are no extra spaces or quotes
- Verify the secret name is `GOOGLE_MAPS_API_KEY`

### "Quota exceeded" error
- Check your Google Cloud Console for API usage
- Verify billing is enabled
- Check if you hit the free tier limit

### No data returned
- Check Supabase Edge Function logs for errors
- Verify all 9 APIs are enabled in Google Cloud Console
- Some APIs (Solar, Pollen) have limited geographic coverage

---

## Next: Deploy the Edge Function

After adding the secret, you need to deploy the new edge function:

### Via Supabase Dashboard
1. Go to **Edge Functions** in Supabase Dashboard
2. Click **Deploy new function**
3. Upload the function files from:
   - `supabase/functions/get-google-enhanced-data/index.ts`

### Via Supabase CLI (if installed)
```bash
supabase functions deploy get-google-enhanced-data
```

---

## Status Checklist

- [x] APIs enabled in Google Cloud Console
- [x] API key added to local `.env` file
- [ ] **API key added to Supabase secrets** ← DO THIS NOW
- [ ] Edge function deployed to Supabase
- [ ] Test integration via garden planner

---

**Once you add the secret to Supabase, the integration will be ready to use!** 🚀
