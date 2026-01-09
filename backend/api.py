"""
AI Garden Planner REST API
FastAPI backend for Lovable frontend integration
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict
import os
import sys

sys.path.append(os.path.dirname(__file__))

from agi_agent.gardening.models import (
    UserInput, LocationInput, GardeningMethod, SpaceSize, Sunlight,
    Experience, UserGoals, CropInterest, Preference, SoilType,
    GrowingLocation, Season, TimeCommitment,
)
from agi_agent.gardening.climate import fetch_simple_forecast, geocode_location
from agi_agent.gardening.planner import generate_plan
from agi_agent.gardening.crop_varieties import VARIETY_DATABASE
from agi_agent.gardening.crop_families import CROP_FAMILIES
from agi_agent.gardening.disease_identifier import (
    identify_disease_from_image,
    DiseaseIdentificationRequest,
    DiseaseIdentificationResponse,
)
from agi_agent.gardening.google_enhanced_data import (
    EnhancedEnvironmentalData,
    AirQualityData,
    SolarData,
    WeatherData,
    PollenData,
    ElevationData,
    AerialViewData,
)
from agi_agent.gardening.companion_planting import get_companion_info
from agi_agent.gardening.crop_timing import get_crop_timing
from agi_agent.gardening.troubleshooting import get_troubleshooting_info
from agi_agent.gardening.care_guides import CARE_DATABASE, get_care_guide, generate_fertilization_guide
from agi_agent.gardening.crop_timing import CROP_TIMING_DATABASE
from agi_agent.gardening.crop_varieties import generate_variety_guide, get_recommended_varieties
from agi_agent.gardening.rotation_planner import generate_soil_improvement_plan
from agi_agent.gardening.disease_prevention import get_disease_info, get_regional_disease_risk
from agi_agent.gardening.climate_adaptation import get_climate_hub_for_location

app = FastAPI(
    title="AI Garden Planner API",
    description="REST API for personalized garden planning with 270+ crops and Google APIs environmental data",
    version="4.2.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to your Lovable domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PlanRequest(BaseModel):
    # Question 1: Location (required)
    address: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    
    # Question 2: Gardening method (required)
    method: str  # Container, Raised Beds, In-ground, Vertical, Indoor, Rooftop, Hydroponic
    
    # Question 3: Space size (required)
    size: str  # Small, Medium, Large, Very Large
    
    # Question 4: Growing location (required)
    growing_location: str = "Outdoors"  # Indoors, Outdoors, Both
    sunlight: str = "Full Sun (6+ hours direct sunlight)"  # Full Sun, Partial Sun, Limited Sun, No Sun, Artificial Lights
    soil_type: str = "Medium (Loam, mixed)"  # Auto-detected from location or user-specified
    
    # Question 5: Growing seasons (required)
    seasons: List[str] = ["Spring", "Summer", "Fall"]  # Spring, Summer, Fall, Winter
    
    # Question 6: Time commitment (required)
    time_commitment: str = "Moderate (few times per week)"  # Minimal, Moderate, Dedicated
    
    # Question 7: Experience level (required)
    experience: str  # Beginner, Novice, Intermediate, Advanced
    
    # Question 8: Garden goals
    crop_interests: List[str] = []  # Leafy greens, Tomatoes, etc., or ["I don't know - suggest crops for me"]
    preferences: List[str] = []  # Drought resistant, Native plants, Low maintenance, Pest resistant, Fast growing
    additional_notes: Optional[str] = None  # User's custom notes
    
    # Question 9 (Optional): Garden space image
    garden_image_url: Optional[str] = None  # URL to uploaded image
    garden_image_base64: Optional[str] = None  # Base64 encoded image
    
    # Enhanced Google API data (auto-fetched by frontend or backend)
    air_quality: Optional[Dict] = None
    solar_data: Optional[Dict] = None
    weather_data: Optional[Dict] = None
    pollen_data: Optional[Dict] = None
    elevation_data: Optional[Dict] = None
    aerial_view: Optional[Dict] = None


class ConversationRequest(BaseModel):
    message: str
    context: Optional[Dict] = None


class ConversationResponse(BaseModel):
    response: str

@app.get("/")
async def root():
    return {
        "status": "online",
        "service": "AI Garden Planner API",
        "version": "4.2.0",
        "features": [
            "270+ crops (fruits, vegetables, nuts, grains, legumes, rice)",
            "100+ detailed crop varieties",
            "300+ disease database with identification",
            "Photo-based disease identifier",
            "Google APIs environmental data",
            "Air quality analysis",
            "Solar exposure mapping",
            "Pollen tracking",
            "Elevation-based adjustments",
            "Family-based disease prevention",
            "Intelligent companion planting"
        ],
        "endpoints": {
            "garden_plan": "/api/v1/garden-plan/generate",
            "disease_identifier": "/api/v1/disease/identify",
            "crop_list": "/api/crops",
            "enums": "/api/enums"
        },
        "docs": "/docs"
    }

@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.get("/api/enums")
async def get_enums():
    """Get dropdown options for frontend forms - all 9 questions"""
    return {
        # Question 2: Gardening method
        "methods": [m.value for m in GardeningMethod],
        
        # Question 3: Space size
        "sizes": [s.value for s in SpaceSize],
        
        # Question 4: Growing location and sunlight
        "growing_locations": [l.value for l in GrowingLocation],
        "sunlight": [s.value for s in Sunlight],
        
        # Question 5: Seasons
        "seasons": [s.value for s in Season],
        
        # Question 6: Time commitment
        "time_commitments": [t.value for t in TimeCommitment],
        
        # Question 7: Experience
        "experience": [e.value for e in Experience],
        
        # Question 8: Garden goals
        "crop_interests": [c.value for c in CropInterest],
        "preferences": [p.value for p in Preference],
    }

@app.get("/api/crops")
async def list_crops():
    """Get all 270+ crops"""
    # Detailed crops with varieties
    detailed_crops = [
        {
            "name": k.replace("_", " ").title(),
            "key": k,
            "variety_count": len(v),
            "has_detailed_info": True
        }
        for k, v in VARIETY_DATABASE.items()
    ]
    
    # Extended crops from family database
    extended_crops = [
        {
            "name": k.replace("_", " ").title(),
            "key": k,
            "variety_count": 0,
            "has_detailed_info": False,
            "family": v.value
        }
        for k, v in CROP_FAMILIES.items()
        if k not in VARIETY_DATABASE
    ]
    
    all_crops = detailed_crops + extended_crops
    return {
        "total_crops": len(all_crops),
        "detailed_crops": len(detailed_crops),
        "extended_crops": len(extended_crops),
        "crops": sorted(all_crops, key=lambda x: x["name"])
    }


@app.post("/api/conversation", response_model=ConversationResponse)
async def conversation(request: ConversationRequest):
    message = (request.message or "").strip()
    if not message:
        raise HTTPException(status_code=400, detail="Message is required")

    lower = message.lower()

    def build_location_followup() -> ConversationResponse:
        return ConversationResponse(
            response=(
                "To give accurate timing/climate advice, what’s your location? "
                "A city + state, neighborhood, or ZIP code works.".strip()
            )
        )

    def extract_location_from_context() -> Dict:
        ctx = request.context or {}
        # Accept multiple shapes since different clients may send different context payloads.
        lat = ctx.get("latitude") or ctx.get("lat")
        lon = ctx.get("longitude") or ctx.get("lon")
        address = ctx.get("address") or ctx.get("location") or ctx.get("city")
        state = ctx.get("state")
        if address and state and isinstance(address, str) and isinstance(state, str):
            address = f"{address}, {state}"
        return {"latitude": lat, "longitude": lon, "address": address}

    def ensure_lat_lon(location_ctx: Dict) -> Optional[Dict]:
        lat = location_ctx.get("latitude")
        lon = location_ctx.get("longitude")
        address = location_ctx.get("address")
        if lat and lon:
            return {"latitude": float(lat), "longitude": float(lon)}
        if address and isinstance(address, str) and address.strip():
            try:
                loc = LocationInput(address=address.strip())
                glat, glon = geocode_location(loc)
                return {"latitude": float(glat), "longitude": float(glon)}
            except Exception:
                return None
        return None

    location_ctx = extract_location_from_context()

    def normalize_crop_name(c: str) -> str:
        c = (c or "").strip().lower()
        # Very small normalization layer so our internal databases match.
        # Keep it conservative: only handle a few common plurals.
        plural_map = {
            "tomatoes": "tomato",
            "peppers": "pepper",
            "cucumbers": "cucumber",
            "carrots": "carrot",
            "onions": "onion",
        }
        return plural_map.get(c, c)

    def build_crop_candidates() -> List[str]:
        candidates = set()
        try:
            candidates.update([k.lower() for k in CARE_DATABASE.keys()])
        except Exception:
            pass
        try:
            candidates.update([k.lower() for k in VARIETY_DATABASE.keys()])
        except Exception:
            pass
        try:
            candidates.update([k.lower() for k in CROP_FAMILIES.keys()])
        except Exception:
            pass
        try:
            candidates.update([k.lower() for k in CROP_TIMING_DATABASE.keys()])
        except Exception:
            pass
        # Add a few common plural spellings where our DB keys are singular.
        candidates.update(["tomatoes", "peppers", "cucumbers", "carrots", "onions"])
        return sorted(candidates, key=lambda s: (-len(s), s))

    crop_candidates = build_crop_candidates()

    def pick_crop() -> Optional[str]:
        for c in crop_candidates:
            if c in lower:
                return c
        return None

    crop = pick_crop()

    crop_norm = normalize_crop_name(crop) if crop else None

    if crop and ("companion" in lower or "plant next" in lower or "good with" in lower or "avoid" in lower):
        info = get_companion_info(crop_norm or crop)
        if info:
            good = ", ".join(info.good_companions[:8])
            bad = ", ".join(info.bad_companions[:8])
            response_text = f"Good companions for {crop}: {good}. Plants to avoid near {crop}: {bad}."
            return ConversationResponse(response=response_text)

    timing_intent = any(k in lower for k in ["when", "planting", "harvest", "start indoors", "last frost", "first frost", "calendar", "this month", "right now"])
    if crop and timing_intent:
        # Timing is location/zone sensitive. If we don't have a location, ask.
        loc = ensure_lat_lon(location_ctx)
        if not loc:
            return build_location_followup()
        timing = get_crop_timing(crop_norm or crop)
        if timing:
            response_text = (
                f"{timing.name}: typically plant in {', '.join(timing.planting_months)} "
                f"and harvest in {', '.join(timing.harvest_months)}. "
                f"Days to harvest: ~{timing.days_to_harvest}. {timing.notes}".strip()
            )
            return ConversationResponse(response=response_text)

    if crop and any(k in lower for k in ["yellow", "spot", "mildew", "rot", "bug", "pest", "wilting", "curl"]):
        # Heuristic: try common problem keys
        for problem in [
            "powdery_mildew",
            "early_blight",
            "late_blight",
            "blossom_end_rot",
            "aphids",
            "hornworms",
            "leaf_curl",
            "tip_burn",
            "slugs",
        ]:
            info = get_troubleshooting_info(crop_norm, problem)
            if info:
                response_text = (
                    f"{crop.title()} – {problem.replace('_', ' ').title()}: "
                    f"Symptoms: {info.get('symptoms')}. Cause: {info.get('cause')}. "
                    f"Solution: {info.get('solution')}. Prevention: {info.get('prevention')}."
                )
                return ConversationResponse(response=response_text)

        # Broader disease prevention / common issues (not symptom-specific)
        diseases = get_disease_info(crop_norm)
        if diseases:
            names = ", ".join([d.name for d in diseases[:5]])
            return ConversationResponse(
                response=(
                    f"Common diseases/pests to watch for on {crop_norm}: {names}. "
                    "Tell me your location (city/state or ZIP) and any symptoms if you want a more specific diagnosis."
                )
            )

    # Soil advice intent
    soil_intent = any(k in lower for k in ["soil", "compost", "fertil", "nutrient", "ph", "amend", "manure", "mulch"])
    if soil_intent:
        # Soil advice can be general without location.
        crops_for_soil = [crop_norm] if crop_norm else []
        response_parts: List[str] = []
        if crop_norm:
            response_parts.append(generate_fertilization_guide(crops_for_soil).strip())
            response_parts.append(generate_soil_improvement_plan(crops_for_soil).strip())
        else:
            response_parts.append(
                "Tell me what you’re growing (or plan to grow) and whether you’re in containers, raised beds, or in-ground, and I’ll tailor soil and compost advice."
            )
        response_text = "\n\n".join([p for p in response_parts if p]).strip()
        if response_text:
            return ConversationResponse(response=response_text)

    # Climate advice intent
    climate_intent = any(k in lower for k in ["climate", "weather", "frost", "heat", "drought", "rain", "zone", "hardiness"])
    if climate_intent:
        loc = ensure_lat_lon(location_ctx)
        if not loc:
            return build_location_followup()
        climate = fetch_simple_forecast(loc["latitude"], loc["longitude"])
        hub = get_climate_hub_for_location(climate.state, climate.us_region)
        hub_text = f"Climate hub: {hub.get('name')} ({hub.get('url')})" if hub else ""
        response_text = "\n".join([t for t in [climate.summary, f"USDA zone: {climate.usda_zone}", f"Typical last frost: {climate.frost_last_spring}", f"Typical first frost: {climate.frost_first_fall}", hub_text] if t and str(t).strip()]).strip()
        if response_text:
            return ConversationResponse(response=response_text)

    # Variety recommendations intent
    variety_intent = any(k in lower for k in ["variety", "cultivar", "heirloom", "best type", "recommend", "which kind", "container variety"])
    if crop_norm and variety_intent:
        varieties = get_recommended_varieties(crop_norm)
        if varieties:
            picks = "\n".join([f"- {v.variety_name}: {v.description}" for v in varieties[:3]])
            return ConversationResponse(response=f"Here are a few {crop_norm} varieties to consider:\n{picks}")

    # Spacing/layout intent (best-effort using variety database)
    spacing_intent = any(k in lower for k in ["spacing", "space", "how far", "distance", "layout", "plant apart", "square feet"])
    if crop_norm and spacing_intent:
        varieties = get_recommended_varieties(crop_norm)
        if varieties:
            v = varieties[0]
            response_text = (
                f"A common spacing starting point for {crop_norm} is about {v.space_per_plant_sqft} sq ft per plant "
                f"(spread: {v.plant_spread}). If you tell me your bed/container size, I can suggest a simple layout."
            )
            return ConversationResponse(response=response_text)

    # If we detected a crop but didn't match the specialized intent keywords above,
    # return practical growing/care guidance instead of the generic fallback.
    if crop_norm:
        care = get_care_guide(crop_norm)
        if care:
            # Build a short, user-friendly summary.
            # Keep it compact since this endpoint feeds voice + UI.
            response_parts: List[str] = []

            response_parts.append(
                f"Here are the basics for growing {crop_norm}:\n"
                f"Watering: {care.get('watering')}\n"
                f"Fertilization: {care.get('fertilization')}\n"
                f"Support: {care.get('support')}\n"
                f"Pruning: {care.get('pruning')}"
            )

            common_tasks = care.get('common_tasks') or []
            if isinstance(common_tasks, list) and common_tasks:
                tasks = "\n".join([f"- {t}" for t in common_tasks[:5]])
                response_parts.append(f"Weekly checklist:\n{tasks}")

            # Add a small variety hint if we have it (kept short)
            try:
                variety_guide = generate_variety_guide(crop_norm, max_varieties=2)
                if isinstance(variety_guide, str) and variety_guide.strip():
                    response_parts.append(variety_guide.strip())
            except Exception:
                # Don't fail the whole endpoint if variety info has an issue
                pass

            response_text = "\n\n".join(response_parts).strip()
            return ConversationResponse(response=response_text)

    return ConversationResponse(
        response="I can help with planting times, companion planting, and troubleshooting. Tell me which plant you’re asking about (e.g., tomatoes) and what you’re trying to do."
    )


async def _generate_garden_plan_logic(request: PlanRequest):
    """Shared logic for generating garden plans"""
    try:
        # Build location
        location = LocationInput(
            address=request.address,
            latitude=request.latitude,
            longitude=request.longitude
        )
        
        # Geocode if address provided
        if request.address and not (request.latitude and request.longitude):
            try:
                lat, lon = geocode_location(location)
                location.latitude = lat
                location.longitude = lon
            except Exception as e:
                raise HTTPException(
                    status_code=400,
                    detail=f"Could not geocode address '{request.address}': {str(e)}"
                )
        
        # Validate coordinates exist
        if not location.has_coordinates():
            raise HTTPException(
                status_code=400, 
                detail="Must provide either a valid address or latitude/longitude coordinates"
            )
        
        # Map strings to enums
        method = next((m for m in GardeningMethod if m.value == request.method), GardeningMethod.RAISED_BEDS)
        size = next((s for s in SpaceSize if s.value == request.size), SpaceSize.MEDIUM)
        sunlight = next((s for s in Sunlight if s.value == request.sunlight), Sunlight.FULL_SUN)
        experience = next((e for e in Experience if e.value == request.experience), Experience.BEGINNER)
        soil_type = next((s for s in SoilType if s.value == request.soil_type), SoilType.MEDIUM)
        
        crop_interests = [
            next((c for c in CropInterest if c.value == i), CropInterest.SUGGEST)
            for i in request.crop_interests
        ]
        preferences = [
            p for p in [
                next((p for p in Preference if p.value == pf), None)
                for pf in request.preferences
            ] if p
        ]
        
        # Create user input with proper types
        user_input = UserInput(
            location=location,  # This is a LocationInput object
            method=method,
            size=size,
            sunlight=sunlight,
            soil_type=soil_type,
            experience=experience,
            goals=UserGoals(crops=crop_interests, preferences=preferences),
            seasons=request.seasons  # Pass user's selected growing seasons
        )
        
        # Get climate data
        climate = fetch_simple_forecast(location.latitude, location.longitude)
        
        # Build enhanced environmental data if provided
        enhanced_weather_data = None
        if any([request.air_quality, request.solar_data, request.weather_data, 
                request.pollen_data, request.elevation_data, request.aerial_view]):
            try:
                enhanced_weather_data = EnhancedEnvironmentalData(
                    location={
                        "latitude": location.latitude,
                        "longitude": location.longitude,
                        "address": location.address
                    },
                    air_quality=AirQualityData(**request.air_quality) if request.air_quality else None,
                    solar=SolarData(**request.solar_data) if request.solar_data else None,
                    weather=WeatherData(**request.weather_data) if request.weather_data else None,
                    pollen=PollenData(**request.pollen_data) if request.pollen_data else None,
                    elevation=ElevationData(**request.elevation_data) if request.elevation_data else None,
                    aerial_view=AerialViewData(**request.aerial_view) if request.aerial_view else None,
                    timestamp=""
                )
            except Exception as e:
                print(f"Warning: Could not parse enhanced data: {e}")
                enhanced_weather_data = None
        
        # Generate plan with enhanced data
        plan_text = generate_plan(user_input, climate, enhanced_data=enhanced_weather_data)
        
        return {
            "success": True,
            "plan": plan_text,
            "location": {
                "city": climate.city,
                "state": climate.state,
                "usda_zone": climate.usda_zone,
            },
        }
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        raise HTTPException(
            status_code=500, 
            detail=f"Error generating plan: {str(e)}\n{traceback.format_exc()}"
        )

@app.post("/api/plan")
async def generate_garden_plan(request: PlanRequest):
    """Generate personalized garden plan (legacy endpoint)"""
    return await _generate_garden_plan_logic(request)

@app.post("/api/v1/garden-plan/generate")
async def generate_garden_plan_v1(request: PlanRequest):
    """Generate personalized garden plan (v1 endpoint)"""
    return await _generate_garden_plan_logic(request)

@app.post("/api/v1/disease/identify", response_model=DiseaseIdentificationResponse)
async def identify_disease(request: DiseaseIdentificationRequest):
    """
    Identify plant disease from image and/or symptoms
    
    Analyzes plant images and symptoms against comprehensive 300+ disease database.
    Returns potential disease matches with confidence levels, symptoms, prevention, and treatment.
    
    Request body:
    - image_base64: Base64 encoded image of diseased plant (optional)
    - image_url: URL to image (optional)
    - crop_name: Name of the crop (optional, improves accuracy)
    - symptoms: List of observed symptoms (optional)
    - location: Location for regional disease context (optional)
    
    Returns:
    - List of potential disease matches with confidence levels
    - Detailed symptoms, prevention, and treatment for each match
    - General recommendations
    """
    try:
        result = identify_disease_from_image(
            image_data=request.image_base64 or request.image_url,
            crop_name=request.crop_name,
            symptoms=request.symptoms,
            location=request.location
        )
        return result
    except Exception as e:
        import traceback
        raise HTTPException(
            status_code=500,
            detail=f"Error identifying disease: {str(e)}\n{traceback.format_exc()}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 8000)))