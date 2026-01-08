# Gardening planning module package

from .models import (
    GardeningMethod,
    SpaceSize,
    Sunlight,
    Experience,
    CropInterest,
    Preference,
    SoilType,
    LocationInput,
    UserGoals,
    UserInput,
    ClimateData,
)
from .climate import geocode_location, fetch_simple_forecast
from .planner import generate_plan
from .water_management import (
    simulate_water_deficit,
    generate_irrigation_recommendation,
    CropWaterUse,
)
from .seasonal_planning import (
    generate_cover_crop_recommendations,
    generate_succession_planting_guide,
    recommend_succession_crops,
)
from .climate_adaptation import (
    DroughtLevel,
    ClimateHub,
    get_usda_hardiness_zone_simple,
    fetch_drought_status_simple,
    get_climate_hub_for_location,
)
from .future_climate import (
    ClimateScenario,
    ClimateTrend,
    get_future_projections,
    analyze_climate_trends,
    recommend_resilient_varieties,
)
from .regional_resources import (
    CoastalRisk,
    FloodZone,
    assess_coastal_risk,
    get_state_climate_assessment,
    get_regional_tools,
)
from .companion_planting import (
    get_companion_info,
    generate_companion_planting_guide,
)
from .yield_estimator import (
    estimate_yield,
    generate_yield_summary,
    YieldUnit,
)
from .disease_prevention import (
    get_disease_info,
    generate_disease_prevention_guide,
    get_regional_disease_risk,  # v3.2
    DiseaseRisk,  # v3.2
    DiseaseSeason,  # v3.3
)
from .educational_resources import (
    get_resources_by_topic,
    generate_resource_guide,
    ResourceType,
    SkillLevel as ResourceSkillLevel,
)
from .layout_generator import (  # v4.0 Phase 1
    generate_layout_guide,
    generate_layout,
    SpacingMethod,
    PlantSize,
)
from .crop_varieties import (  # v4.0 Phase 2
    generate_variety_guide,
    get_varieties_for_crop,
    get_recommended_varieties,
    Difficulty,
    GrowingSeason,
)

__all__ = [
    "GardeningMethod",
    "SpaceSize",
    "Sunlight",
    "Experience",
    "CropInterest",
    "Preference",
    "SoilType",
    "LocationInput",
    "UserGoals",
    "UserInput",
    "ClimateData",
    "geocode_location",
    "fetch_simple_forecast",
    "generate_plan",
    "simulate_water_deficit",
    "generate_irrigation_recommendation",
    "CropWaterUse",
    "generate_cover_crop_recommendations",
    "generate_succession_planting_guide",
    "recommend_succession_crops",
    "DroughtLevel",
    "ClimateHub",
    "get_usda_hardiness_zone_simple",
    "fetch_drought_status_simple",
    "get_climate_hub_for_location",
    "ClimateScenario",
    "ClimateTrend",
    "get_future_projections",
    "analyze_climate_trends",
    "recommend_resilient_varieties",
    "CoastalRisk",
    "FloodZone",
    "assess_coastal_risk",
    "get_state_climate_assessment",
    "get_regional_tools",
    # v3.1 exports
    "get_companion_info",
    "generate_companion_planting_guide",
    "estimate_yield",
    "generate_yield_summary",
    "YieldUnit",
    "get_disease_info",
    "generate_disease_prevention_guide",
    "get_regional_disease_risk",  # v3.2
    "DiseaseRisk",  # v3.2
    "DiseaseSeason",  # v3.3
    "get_resources_by_topic",
    "generate_resource_guide",
    "ResourceType",
    "ResourceSkillLevel",
    # v4.0 Phase 1 exports
    "generate_layout_guide",
    "generate_layout",
    "SpacingMethod",
    "PlantSize",
    # v4.0 Phase 2 exports
    "generate_variety_guide",
    "get_varieties_for_crop",
    "get_recommended_varieties",
    "Difficulty",
    "GrowingSeason",
]
