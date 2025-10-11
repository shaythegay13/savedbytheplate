# Google Enhanced Data API Integration

This Supabase Edge Function integrates multiple Google Cloud APIs to provide comprehensive environmental and location data for the AI Garden Planner.

## Integrated Google APIs

### 1. **Air Quality API**
- **Purpose**: Provides real-time air quality data including AQI, pollutant levels, and health recommendations
- **Garden Use Cases**:
  - Alert gardeners when air quality affects plant health
  - Recommend indoor vs outdoor gardening based on pollution levels
  - Warn about ozone damage to sensitive plants
  - Suggest when to harvest leafy greens to avoid pollutant accumulation

### 2. **Solar API**
- **Purpose**: Analyzes solar potential and sunlight exposure for specific locations
- **Garden Use Cases**:
  - Determine precise sunlight hours per day by season
  - Identify optimal planting areas based on sun exposure
  - Recommend full-sun vs shade plants based on actual solar data
  - Calculate growing season length based on available sunlight

### 3. **Weather Data** (via OpenWeatherMap)
- **Purpose**: Current conditions and 7-day forecast
- **Garden Use Cases**:
  - Frost risk warnings for tender plants
  - Heat stress alerts for optimal watering schedules
  - Precipitation forecasts for irrigation planning
  - UV index for plant protection recommendations

### 4. **Pollen API**
- **Purpose**: Real-time pollen counts by type (tree, grass, weed) with 5-day forecast
- **Garden Use Cases**:
  - Optimize timing for planting pollinator-attracting flowers
  - Identify best times for hand-pollination
  - Warn about cross-pollination risks for seed saving
  - Recommend self-pollinating varieties during low pollen periods

### 5. **Elevation API**
- **Purpose**: Precise elevation data with resolution metrics
- **Garden Use Cases**:
  - Analyze drainage patterns and flood risk
  - Identify frost pocket risks in low-lying areas
  - Adjust temperature expectations based on elevation
  - Recommend cold-hardy varieties for high elevations

### 6. **Aerial View / Map Tiles API**
- **Purpose**: High-resolution satellite imagery and tile coordinates
- **Garden Use Cases**:
  - Analyze existing vegetation and tree cover
  - Identify shaded areas for shade-tolerant plants
  - Calculate available growing space
  - Detect soil conditions from vegetation patterns

### 7. **Street View API**
- **Purpose**: Ground-level imagery and surrounding context
- **Garden Use Cases**:
  - Assess urban density and microclimate effects
  - Identify nearby vegetation that may affect sunlight
  - Analyze building heights for shade patterns
  - Understand wind exposure from surrounding structures

## API Response Structure

```typescript
interface EnhancedGardenData {
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  airQuality?: {
    aqi: number;
    category: string;
    dominantPollutant: string;
    pollutants: { pm25, pm10, o3, no2, so2, co };
    healthRecommendations: string[];
    gardenImpact: string;
  };
  solar?: {
    maxSunshineHoursPerYear: number;
    solarPotential: string;
    sunlightHoursPerDay: { spring, summer, fall, winter };
    optimalPlantingAreas: Array<{bounds, sunExposure}>;
  };
  weather?: {
    current: { temperature, humidity, windSpeed, precipitation, cloudCover, uvIndex };
    forecast: Array<{ date, tempHigh, tempLow, precipitation, humidity }>;
    growingConditions: { soilMoisture, frostRisk, heatStress, optimalForPlanting };
  };
  pollen?: {
    overall: { index, category };
    types: { tree, grass, weed };
    forecast: Array<{ date, index, category }>;
    gardenRecommendations: string[];
  };
  elevation?: {
    elevation: number;
    resolution: number;
    drainagePattern: string;
    frostPocketRisk: string;
    microclimateNotes: string[];
  };
  aerialView?: {
    imageUrl: string;
    tileCoordinates: { zoom, x, y };
    vegetationAnalysis: { greenCoverPercentage, existingTrees, shadedAreas };
  };
  streetView?: {
    available: boolean;
    panoId?: string;
    imageUrl?: string;
    surroundingContext: { urbanDensity, nearbyVegetation, buildingHeight };
  };
  timestamp: string;
}
```

## Usage Example

```typescript
const { data, error } = await supabase.functions.invoke('get-google-enhanced-data', {
  body: {
    latitude: 40.7128,
    longitude: -74.0060,
    address: "New York, NY",
    includeAirQuality: true,
    includeSolar: true,
    includeWeather: true,
    includePollen: true,
    includeElevation: true,
    includeAerialView: true,
    includeStreetView: false
  }
});
```

## Required Environment Variables

Add these to your Supabase project secrets:

```bash
# Google Maps API Key (with all APIs enabled)
GOOGLE_MAPS_API_KEY=AIza...

# Optional: OpenWeatherMap API Key for weather data
OPENWEATHER_API_KEY=...
```

## Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable the following APIs:
   - Air Quality API
   - Solar API
   - Pollen API
   - Maps Elevation API
   - Maps Static API (for Aerial View)
   - Street View Static API
   - Map Tiles API
3. Create or use existing API key
4. Add API key to Supabase secrets

## Integration with Garden Planner

The `generate-smart-garden-plan` function automatically calls this enhanced data function and passes all data to the AI model for intelligent plant recommendations based on:

- **Air Quality**: Recommends pollution-tolerant plants in high-AQI areas
- **Solar Data**: Matches plants to actual sunlight hours, not estimates
- **Weather**: Adjusts planting calendar based on real-time conditions
- **Pollen**: Optimizes pollinator-dependent crop recommendations
- **Elevation**: Adjusts temperature expectations and frost dates
- **Aerial View**: Identifies existing vegetation and optimal planting zones

## Performance Considerations

- All API calls are made in parallel using `Promise.all()` for optimal performance
- Each API can be individually enabled/disabled via request parameters
- Street View is disabled by default to improve response times
- Data is cached with timestamp for potential future caching layer

## Error Handling

- Each API call has individual error handling
- Failed API calls return `null` instead of breaking the entire request
- Fallback data is provided for critical APIs (weather, solar)
- Console logs track which APIs succeeded/failed for debugging

## Future Enhancements

1. **Image Analysis**: Use Google Vision API to analyze aerial/street view images for vegetation detection
2. **Caching Layer**: Cache responses for 1-6 hours to reduce API costs
3. **Historical Data**: Track changes over time for trend analysis
4. **Maps Embed**: Generate embeddable maps for garden layout visualization
5. **Routes API**: Calculate distance to nearest garden centers/nurseries
