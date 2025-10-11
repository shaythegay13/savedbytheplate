# Google APIs Setup Guide for Garden Planner

This guide walks you through setting up all Google Cloud APIs for the enhanced garden planner backend.

## Overview

The garden planner now integrates **9 Google Cloud APIs** to provide comprehensive environmental data:

1. **Air Quality API** - Real-time pollution data and plant health impacts
2. **Solar API** - Precise sunlight analysis for optimal plant placement
3. **Weather API** - Current conditions and forecasts (via Maps Platform)
4. **Pollen API** - Pollen counts for pollination optimization
5. **Maps Elevation API** - Elevation data for drainage and frost risk
6. **Maps Static API** - Aerial imagery for vegetation analysis
7. **Map Tiles API** - High-resolution tile coordinates
8. **Street View Static API** - Ground-level context and microclimate
9. **Maps Embed API** - Future embeddable map visualizations

---

## Step 1: Google Cloud Console Setup

### 1.1 Create or Select Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing project
3. Note your **Project ID**

### 1.2 Enable Billing

1. Go to **Billing** in the left sidebar
2. Link a billing account (required for API access)
3. Most APIs have generous free tiers

---

## Step 2: Enable APIs

Enable each API individually:

### 2.1 Air Quality API
```
https://console.cloud.google.com/apis/library/airquality.googleapis.com
```
- Click **Enable**
- **Free Tier**: 1,000 requests/day
- **Pricing**: $0.50 per 1,000 requests after free tier

### 2.2 Solar API
```
https://console.cloud.google.com/apis/library/solar.googleapis.com
```
- Click **Enable**
- **Free Tier**: 1,000 requests/month
- **Pricing**: $0.50 per 1,000 requests after free tier

### 2.3 Pollen API
```
https://console.cloud.google.com/apis/library/pollen.googleapis.com
```
- Click **Enable**
- **Free Tier**: 1,000 requests/day
- **Pricing**: $0.50 per 1,000 requests after free tier

### 2.4 Maps Elevation API
```
https://console.cloud.google.com/apis/library/elevation-backend.googleapis.com
```
- Click **Enable**
- **Free Tier**: $200 monthly credit (covers ~40,000 requests)
- **Pricing**: $5 per 1,000 requests after credit

### 2.5 Maps Static API
```
https://console.cloud.google.com/apis/library/static-maps-backend.googleapis.com
```
- Click **Enable**
- **Free Tier**: $200 monthly credit
- **Pricing**: $2 per 1,000 requests after credit

### 2.6 Street View Static API
```
https://console.cloud.google.com/apis/library/street-view-image-backend.googleapis.com
```
- Click **Enable**
- **Free Tier**: $200 monthly credit
- **Pricing**: $7 per 1,000 requests after credit

### 2.7 Map Tiles API
```
https://console.cloud.google.com/apis/library/tile.googleapis.com
```
- Click **Enable**
- **Free Tier**: $200 monthly credit
- **Pricing**: $7 per 1,000 map loads after credit

### 2.8 Maps Embed API (Future Use)
```
https://console.cloud.google.com/apis/library/maps-embed-backend.googleapis.com
```
- Click **Enable**
- **Free**: Unlimited embed loads

### 2.9 Maps JavaScript API (Already Enabled)
```
https://console.cloud.google.com/apis/library/maps-backend.googleapis.com
```
- Should already be enabled for your map components
- **Free Tier**: $200 monthly credit

---

## Step 3: Create API Key

### 3.1 Generate Key

1. Go to **APIs & Services** > **Credentials**
2. Click **+ CREATE CREDENTIALS** > **API Key**
3. Copy the generated API key (starts with `AIza...`)

### 3.2 Restrict API Key (Recommended)

1. Click **Edit API key** (pencil icon)
2. Under **API restrictions**:
   - Select **Restrict key**
   - Check all the APIs you enabled:
     - Air Quality API
     - Solar API
     - Pollen API
     - Maps Elevation API
     - Maps Static API
     - Street View Static API
     - Map Tiles API
     - Maps Embed API
     - Maps JavaScript API
3. Under **Application restrictions**:
   - Select **HTTP referrers** for frontend use
   - Add your domains:
     - `localhost:*`
     - `*.supabase.co`
     - `your-domain.com`
4. Click **Save**

### 3.3 Create Server-Side Key (Recommended)

For better security, create a separate key for backend:

1. Create another API key
2. Under **Application restrictions**:
   - Select **IP addresses**
   - Add Supabase IP ranges (or leave unrestricted for edge functions)
3. Restrict to same APIs as above
4. Click **Save**

---

## Step 4: Add API Key to Supabase

### 4.1 Local Development

1. Create `.env.local` in your project root:
```bash
GOOGLE_MAPS_API_KEY=AIza...your-key-here
```

2. Update Supabase local config:
```bash
supabase secrets set GOOGLE_MAPS_API_KEY=AIza...your-key-here
```

### 4.2 Production (Supabase Dashboard)

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** > **Edge Functions** > **Secrets**
4. Add secret:
   - **Name**: `GOOGLE_MAPS_API_KEY`
   - **Value**: `AIza...your-key-here`
5. Click **Save**

---

## Step 5: Optional - OpenWeatherMap API

For enhanced weather data (optional, has fallback):

1. Go to [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for free account
3. Get API key from dashboard
4. Add to Supabase secrets:
```bash
OPENWEATHER_API_KEY=your-openweather-key
```

---

## Step 6: Test the Integration

### 6.1 Test Edge Function Directly

```bash
curl -X POST 'https://your-project.supabase.co/functions/v1/get-google-enhanced-data' \
  -H 'Authorization: Bearer YOUR_SUPABASE_ANON_KEY' \
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

### 6.2 Test via Garden Planner

1. Go to `/garden-plan` in your app
2. Enter a location
3. Complete the garden planning flow
4. Check browser console for logs:
   - `Enhanced Google data fetched: { hasAirQuality: true, hasSolar: true, ... }`

### 6.3 Check Supabase Logs

1. Go to Supabase Dashboard > **Edge Functions** > **Logs**
2. Look for `get-google-enhanced-data` invocations
3. Verify successful API calls

---

## Step 7: Monitor Usage & Costs

### 7.1 Google Cloud Console

1. Go to **APIs & Services** > **Dashboard**
2. View API usage metrics
3. Set up budget alerts:
   - Go to **Billing** > **Budgets & alerts**
   - Create budget (e.g., $50/month)
   - Set alert at 50%, 90%, 100%

### 7.2 Expected Costs (Estimates)

**Typical Usage per Garden Plan Generation:**
- Air Quality API: 1 request = $0.0005
- Solar API: 1 request = $0.0005
- Pollen API: 1 request = $0.0005
- Elevation API: 1 request = $0.000125
- Maps Static API: 1 request = $0.002
- Street View API: 0-1 requests = $0-$0.007

**Total per plan: ~$0.004 - $0.011**

**With $200 monthly credit:**
- Can generate ~18,000-50,000 garden plans/month for free
- After credit: ~$4-11 per 1,000 plans

---

## Step 8: Optimization Tips

### 8.1 Reduce API Calls

1. **Cache responses**: Implement Redis/Supabase caching for 1-6 hours
2. **Conditional fetching**: Only fetch data when location changes
3. **Disable optional APIs**: Set `includeStreetView: false` by default

### 8.2 Batch Requests

For multiple locations, batch requests where possible:
```typescript
// Instead of 10 separate calls
const locations = [...];
const results = await Promise.all(
  locations.map(loc => getEnhancedData(loc))
);
```

### 8.3 Use Free Alternatives

- **Weather**: Use NOAA (free, US-only) as primary, Google as fallback
- **Elevation**: USGS has free elevation data for US
- **Air Quality**: EPA AirNow API (free, US-only)

---

## Troubleshooting

### Issue: "API key not valid"
- **Solution**: Check API key is correct in Supabase secrets
- Verify API is enabled in Google Cloud Console
- Check API key restrictions aren't blocking requests

### Issue: "Quota exceeded"
- **Solution**: Check usage in Google Cloud Console
- Increase quota or enable billing
- Implement caching to reduce requests

### Issue: "No data returned"
- **Solution**: Check API is available in your region
- Some APIs (Solar, Pollen) have limited geographic coverage
- Check console logs for specific error messages

### Issue: "CORS errors"
- **Solution**: Add your domain to API key restrictions
- For local dev, add `localhost:*`
- For production, add your Supabase URL

---

## Security Best Practices

1. **Never commit API keys** to version control
2. **Use environment variables** for all keys
3. **Restrict API keys** to specific APIs and domains
4. **Rotate keys regularly** (every 90 days)
5. **Monitor usage** for unexpected spikes
6. **Use separate keys** for dev/staging/production
7. **Enable billing alerts** to prevent surprise charges

---

## Next Steps

1. ✅ Enable all APIs in Google Cloud Console
2. ✅ Create and restrict API key
3. ✅ Add key to Supabase secrets
4. ✅ Test integration
5. ✅ Set up monitoring and alerts
6. 🔄 Implement caching layer (optional)
7. 🔄 Add frontend UI for enhanced data display
8. 🔄 Create admin dashboard for API usage tracking

---

## Support Resources

- [Google Maps Platform Documentation](https://developers.google.com/maps/documentation)
- [Air Quality API Docs](https://developers.google.com/maps/documentation/air-quality)
- [Solar API Docs](https://developers.google.com/maps/documentation/solar)
- [Pollen API Docs](https://developers.google.com/maps/documentation/pollen)
- [Supabase Edge Functions Docs](https://supabase.com/docs/guides/functions)

---

## Questions?

If you encounter issues:
1. Check Supabase Edge Function logs
2. Check Google Cloud Console API dashboard
3. Review error messages in browser console
4. Verify all environment variables are set correctly
