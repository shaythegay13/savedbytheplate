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

    crop_candidates = [
        "tomato",
        "tomatoes",
        "pepper",
        "peppers",
        "lettuce",
        "cucumber",
        "cucumbers",
        "squash",
        "beans",
        "carrot",
        "carrots",
        "basil",
        "mint",
        "spinach",
        "broccoli",
        "cauliflower",
        "onion",
        "onions",
    ]

    def pick_crop() -> Optional[str]:
        for c in crop_candidates:
            if c in lower:
                return c
        return None

    crop = pick_crop()

    if crop and ("companion" in lower or "plant next" in lower or "good with" in lower or "avoid" in lower):
        info = get_companion_info(crop)
        if info:
            good = ", ".join(info.good_companions[:8])
            bad = ", ".join(info.bad_companions[:8])
            response_text = f"Good companions for {crop}: {good}. Plants to avoid near {crop}: {bad}."
            return ConversationResponse(response=response_text)

    if crop and ("when" in lower or "planting" in lower or "plant" in lower or "harvest" in lower):
        timing = get_crop_timing(crop)
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
            info = get_troubleshooting_info(crop, problem)
            if info:
                response_text = (
                    f"{crop.title()} – {problem.replace('_', ' ').title()}: "
                    f"Symptoms: {info.get('symptoms')}. Cause: {info.get('cause')}. "
                    f"Solution: {info.get('solution')}. Prevention: {info.get('prevention')}."
                )
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