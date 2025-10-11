# Google Enhanced Data - Data Flow Architecture

## Overview

This document explains how Google API data flows through the garden planner system and how it enhances AI recommendations.

---

## Data Flow Diagram

```
User Input (Location)
        ↓
Frontend (GardenPlan.tsx)
        ↓
generate-smart-garden-plan (Edge Function)
        ↓
    ┌───┴───┐
    ↓       ↓
get-climate-data    get-google-enhanced-data
(NOAA/ACIS)         (9 Google APIs)
    ↓                       ↓
    └───────┬───────────────┘
            ↓
    Python AI Backend
    (FastAPI on Render)
            ↓
    AI Model Processing
    (Plant Recommendations)
            ↓
    Enhanced Garden Plan
            ↓
    Frontend Display
```

---

## Detailed Flow

### 1. User Initiates Garden Plan

**Location**: `src/pages/GardenPlan.tsx`

```typescript
// User completes location input
handleLocationSubmit(location: { lat, lng, address })
  ↓
// User completes garden questions
handleQuestionsComplete(questions)
  ↓
// Trigger plan generation
generateGardenPlan(formData)
```

### 2. Edge Function Orchestration

**Location**: `supabase/functions/generate-smart-garden-plan/index.ts`

```typescript
// Parallel data fetching
Promise.all([
  supabase.functions.invoke('get-climate-data', { lat, lng }),
  supabase.functions.invoke('get-google-enhanced-data', { 
    lat, lng,
    includeAirQuality: true,
    includeSolar: true,
    includeWeather: true,
    includePollen: true,
    includeElevation: true,
    includeAerialView: true
  })
])
```

**Result**: Two data objects merged into request payload

### 3. Google Enhanced Data Collection

**Location**: `supabase/functions/get-google-enhanced-data/index.ts`

```typescript
// Parallel API calls (all execute simultaneously)
Promise.all([
  getAirQualityData(lat, lng, apiKey),      // ~200ms
  getSolarData(lat, lng, apiKey),           // ~300ms
  getWeatherData(lat, lng, apiKey),         // ~250ms
  getPollenData(lat, lng, apiKey),          // ~200ms
  getElevationData(lat, lng, apiKey),       // ~150ms
  getAerialViewData(lat, lng, apiKey),      // ~100ms
  getStreetViewData(lat, lng, apiKey)       // ~200ms (optional)
])

// Total time: ~300ms (longest API call)
// vs ~1,400ms if sequential
```

### 4. Data Transformation

Each API response is transformed into garden-specific insights:

#### Air Quality → Plant Recommendations
```typescript
AQI 0-50   → All plants safe, optimal conditions
AQI 51-100 → Recommend pollution-tolerant varieties
AQI 101+   → Suggest indoor growing, leafy greens caution
```

#### Solar → Sunlight Categories
```typescript
8+ hours/day summer → Full sun plants (tomatoes, peppers)
6-8 hours/day       → Partial sun (lettuce, herbs)
4-6 hours/day       → Partial shade (leafy greens)
<4 hours/day        → Shade plants (ferns, hostas)
```

#### Pollen → Pollination Strategy
```typescript
High tree pollen   → Plant fruit trees, hand-pollinate
High grass pollen  → Good for grass seed, lawn establishment
Low overall pollen → Recommend self-pollinating varieties
```

#### Elevation → Temperature Adjustment
```typescript
Every 100m elevation = -0.6°F temperature
High elevation → Shorter growing season, cold-hardy plants
Low elevation  → Longer season, watch drainage
```

### 5. AI Model Processing

**Location**: Python FastAPI Backend (external)

```python
def generate_garden_plan(request):
    # Base data
    space_type = request.space_type
    sunlight = request.sunlight  # Enhanced by solar data
    
    # Enhanced Google data
    air_quality = request.air_quality
    solar_data = request.solar_data
    pollen_data = request.pollen_data
    elevation_data = request.elevation_data
    
    # AI processing
    if air_quality.aqi > 100:
        plants = filter_pollution_tolerant(plants)
    
    if solar_data.sunlightHoursPerDay.summer < 6:
        plants = filter_shade_tolerant(plants)
    
    if elevation_data.elevation > 1000:
        plants = adjust_for_elevation(plants)
        frost_dates = adjust_frost_dates(elevation_data.elevation)
    
    if pollen_data.overall.index < 2:
        plants = prioritize_self_pollinating(plants)
    
    return enhanced_garden_plan
```

### 6. Response Enhancement

The AI model returns a garden plan enriched with Google data insights:

```json
{
  "plants": [
    {
      "name": "Tomato",
      "variety": "Early Girl",
      "reason": "Selected based on 8.5 hours summer sunlight (Solar API) and elevation-adjusted 120-day growing season"
    }
  ],
  "environmental_insights": {
    "air_quality": {
      "current_aqi": 45,
      "impact": "Excellent conditions for all plants",
      "recommendations": ["Safe to harvest leafy greens anytime"]
    },
    "sunlight_analysis": {
      "hours_per_day": 8.5,
      "optimal_areas": ["South-facing garden bed", "West patio"],
      "source": "Google Solar API"
    },
    "pollination_forecast": {
      "current_index": 4,
      "recommendation": "High pollen levels - excellent for fruit trees, bees active"
    }
  }
}
```

---

## Data Usage by Feature

### Garden Plan Generation
- **Air Quality**: Filter plant recommendations
- **Solar**: Determine sun/shade requirements
- **Weather**: Adjust planting calendar
- **Pollen**: Optimize pollination strategy
- **Elevation**: Adjust temperature/frost dates
- **Aerial View**: Identify existing vegetation

### Weather Notifications
- **Weather**: Real-time alerts
- **Air Quality**: Harvest timing alerts
- **Pollen**: Allergy/pollination alerts

### Layout Planning
- **Solar**: Optimal placement zones
- **Aerial View**: Existing obstacles
- **Elevation**: Drainage patterns

### Plant Care Instructions
- **Weather**: Watering schedule
- **Air Quality**: Harvest timing
- **Solar**: Seasonal adjustments

---

## Performance Optimization

### Caching Strategy (Future)

```typescript
// Cache key structure
const cacheKey = `google-data:${lat}:${lng}:${date}`;

// Cache duration by data type
Air Quality:  1 hour   (changes frequently)
Weather:      1 hour   (changes frequently)
Pollen:       6 hours  (daily updates)
Solar:        30 days  (rarely changes)
Elevation:    Forever  (never changes)
Aerial View:  90 days  (seasonal changes)
```

### Conditional Fetching

```typescript
// Only fetch what's needed
if (growing_location === 'indoors') {
  // Skip: weather, pollen, aerial view
  // Keep: air quality (indoor air)
}

if (user_has_premium === false) {
  // Skip: aerial view, street view
  // Keep: essential data only
}
```

---

## Error Handling & Fallbacks

### API Failure Scenarios

```typescript
// Air Quality API fails
→ Fallback: Assume moderate air quality (AQI 50)
→ Impact: Minor - still generate plan

// Solar API fails
→ Fallback: Use latitude-based sunlight estimation
→ Impact: Moderate - less accurate sun recommendations

// Weather API fails
→ Fallback: Use NOAA climate data
→ Impact: Minor - historical data still useful

// Elevation API fails
→ Fallback: Assume sea level
→ Impact: Minor - affects only high-elevation areas

// Pollen API fails
→ Fallback: Assume moderate pollen
→ Impact: Minor - affects only pollination timing

// Aerial View fails
→ Fallback: Skip vegetation analysis
→ Impact: None - optional feature
```

### Graceful Degradation

```typescript
// Full data available
✓ Air Quality ✓ Solar ✓ Weather ✓ Pollen ✓ Elevation
→ "Premium AI-Enhanced Plan"

// Partial data available
✓ Solar ✓ Weather ✗ Air Quality ✗ Pollen ✗ Elevation
→ "AI-Enhanced Plan"

// Minimal data available
✗ All Google APIs failed
→ "Standard Plan" (uses NOAA/ACIS only)
```

---

## Data Retention & Privacy

### User Data
- Location coordinates: Stored in `garden_plans` table
- Google API responses: NOT stored (fetched on-demand)
- Plan results: Stored with user consent

### API Response Caching (Future)
- Cache location: Redis or Supabase cache
- Cache duration: 1 hour - 90 days (by data type)
- Cache invalidation: Time-based + manual
- Privacy: Anonymized coordinates (rounded to 3 decimals)

---

## Monitoring & Logging

### Success Metrics
```typescript
console.log('Enhanced Google data fetched:', {
  hasAirQuality: !!enhancedGoogleData.airQuality,
  hasSolar: !!enhancedGoogleData.solar,
  hasWeather: !!enhancedGoogleData.weather,
  hasPollen: !!enhancedGoogleData.pollen,
  hasElevation: !!enhancedGoogleData.elevation
});
```

### Error Tracking
```typescript
console.error('Error fetching air quality data:', error);
// → Track in Sentry/LogRocket
// → Alert if error rate > 5%
```

### Performance Metrics
- API response time (target: <500ms)
- Success rate per API (target: >95%)
- Cache hit rate (target: >70% when implemented)

---

## Future Enhancements

### Phase 2: Advanced Features
1. **Image Analysis**: Use Google Vision API on aerial/street view
2. **Historical Trends**: Track air quality/weather over time
3. **Predictive Modeling**: ML models for yield prediction
4. **Community Data**: Aggregate data from multiple gardens

### Phase 3: Real-Time Updates
1. **WebSocket Integration**: Live weather/air quality updates
2. **Push Notifications**: Alert users of changing conditions
3. **Dynamic Replanning**: Adjust plans based on real-time data

### Phase 4: Advanced Visualization
1. **3D Garden Models**: Using elevation + aerial data
2. **Sun Path Simulation**: Animated sunlight throughout day
3. **Growth Simulation**: Time-lapse of expected garden growth
