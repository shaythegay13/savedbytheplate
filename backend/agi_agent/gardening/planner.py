from datetime import date
from typing import List, Optional, Dict, Any
from .models import UserInput, ClimateData, Sunlight, GardeningMethod, SpaceSize, SoilType, Experience
from .knowledge import recommend_plants
from .water_management import (
    simulate_water_deficit,
    generate_irrigation_recommendation,
    SoilType as WaterSoilType,
    CropWaterUse,
)
from .seasonal_planning import (
    generate_cover_crop_recommendations,
    generate_succession_planting_guide,
)
from .crop_timing import get_crop_timing, format_crop_timing
from .climate_adaptation import (
    get_usda_hardiness_zone_simple,
    fetch_drought_status_simple,
    get_climate_hub_for_location,
    generate_drought_adapted_recommendations,
    generate_climate_hub_section,
    enhance_hardiness_zone_info,
)
from .future_climate import (
    get_future_projections,
    analyze_climate_trends,
    generate_future_climate_section,
    get_hardiness_zone_shift,
)
from .regional_resources import (
    generate_comprehensive_resources_section,
)
from .companion_planting import (
    generate_companion_planting_guide,
)
from .rotation_planner import (
    generate_rotation_plan,
    generate_soil_improvement_plan,
)
from .care_guides import (
    generate_detailed_care_guide,
    generate_maintenance_schedule,
    generate_fertilization_guide,
    generate_pruning_guide,
)
from .troubleshooting import (
    generate_troubleshooting_guide,
    generate_common_mistakes_guide,
    generate_expert_tips,
    generate_seasonal_tips,
)
from .yield_estimator import (
    generate_yield_summary,
)
from .disease_prevention import (
    generate_disease_prevention_guide,
)
from .educational_resources import (
    generate_resource_guide,
    SkillLevel as ResourceSkillLevel,
)
from .layout_generator import (  # v4.0 Phase 1
    generate_layout_guide,
)
from .crop_varieties import (  # v4.0 Phase 2
    generate_variety_guide,
    get_varieties_for_crop,
)
from .crop_families import (  # v4.2 Extended Crop Database (245+ crops)
    get_crop_family,
    get_family_diseases,
    get_companion_recommendations,
    CROP_FAMILIES,
)
from .google_enhanced_data import (  # v4.1 Google APIs Integration
    EnhancedEnvironmentalData,
    generate_environmental_summary,
    analyze_air_quality_impact,
    analyze_solar_exposure,
    analyze_pollen_levels,
    analyze_elevation_effects,
)


def _layout_suggestions(method: GardeningMethod, size: SpaceSize, sunlight: Sunlight) -> str:
    tips = []
    if method == GardeningMethod.CONTAINERS:
        tips.append("Use 5–20 gallon containers with drainage; match pot size to crop.")
        tips.append("Use high-quality potting mix; add slow-release organic fertilizer.")
    if method == GardeningMethod.RAISED_BEDS:
        tips.append('Build 4\'x8\' beds 10–12" deep; fill with 50/50 compost and topsoil.')
        tips.append("Adopt square-foot gardening for intensive planting.")
    if method == GardeningMethod.IN_GROUND:
        tips.append("Conduct a soil test; amend with compost to improve structure.")
        tips.append("Use mulches to retain moisture and reduce weeds.")
    if method == GardeningMethod.VERTICAL:
        tips.append("Install trellises/netting for cucumbers, beans, and peas.")
    if method == GardeningMethod.INDOOR:
        tips.append("Use full-spectrum LED grow lights 12–18 inches above plants, 12–16h/day.")
        tips.append("Ensure good airflow; use trays to prevent water damage.")
    if method == GardeningMethod.ROOFTOP:
        tips.append("Check structural load capacity and wind exposure; use fabric grow bags.")

    if size == SpaceSize.SMALL:
        tips.append("Prioritize compact/dwarf varieties and cut-and-come-again greens.")
    if size == SpaceSize.MEDIUM:
        tips.append("Use vertical supports to expand growing area.")
    if size in (SpaceSize.LARGE, SpaceSize.VERY_LARGE):
        tips.append("Plan crop rotation across 3–4 beds; include pollinator strip.")

    if sunlight == Sunlight.FULL_SUN:
        tips.append("Schedule watering early morning; monitor for heat stress.")
    if sunlight in (Sunlight.PARTIAL_SUN, Sunlight.PARTIAL_SHADE):
        tips.append("Choose heat-tolerant greens; place sun-lovers at brightest spots.")
    if sunlight in (Sunlight.SHADE, Sunlight.ARTIFICIAL_ONLY):
        tips.append("Focus on leafy greens, herbs, and microgreens.")

    return "\n- ".join(["Layout & Setup Tips:"] + tips)


def _care_schedule(water_recommendation: Optional[str] = None) -> str:
    schedule = "Care Schedule:\n"
    
    if water_recommendation:
        schedule += "\n" + water_recommendation + "\n"
    else:
        schedule += "- Water: Keep soil evenly moist; deep, infrequent watering for beds.\n"
    
    schedule += (
        "- Feeding: Organic fertilizer every 3–4 weeks (containers every 2–3 weeks).\n"
        "- Mulch: 2–3 inches to retain moisture and suppress weeds.\n"
        "- Pest Mgmt: Inspect weekly; use row covers and hand-picking before sprays.\n"
        "- Succession: Sow quick crops every 2–3 weeks for continuous harvests.\n"
    )
    return schedule

def _planting_calendar(climate: ClimateData, today: Optional[date] = None) -> str:
    """Frost-aware planting guidance; fallback to temperature heuristic if frost dates unavailable."""
    if today is None:
        today = date.today()
    if climate.frost_last_spring or climate.frost_first_fall or climate.usda_zone:
        zone = climate.usda_zone or "Unknown"
        last = climate.frost_last_spring or "N/A"
        first = climate.frost_first_fall or "N/A"
        return (
            "Planting Calendar (Frost-aware):\n"
            f"- USDA Zone: {zone}\n"
            f"- Typical Last Spring Frost: {last}\n"
            f"- Typical First Fall Frost: {first}\n"
            "- Rule of thumb: Start warm-season transplants ~2–4 weeks after last frost; \n"
            "  start cool-season crops 4–8 weeks before last frost and again late summer for fall."
        )
    # Fallback to simple upcoming temperature heuristic
    highs = climate.daily_highs_c
    if not highs:
        return "Planting Calendar: Data unavailable."
    avg_high = sum(highs) / len(highs)
    if avg_high < 18:
        season = "cool-season focus (greens, peas, radishes)."
    elif avg_high > 24:
        season = "warm-season focus (tomatoes, peppers, cucumbers, beans)."
    else:
        season = "transition season; mix cool- and warm-season crops."
    return f"Planting Calendar: Based on upcoming temps, plan for {season}"


def _multi_year_rotation() -> str:
    return (
        "Multi-Year Planning (3-year rotation example):\n"
        "- Year 1: Leafy greens and herbs; legumes (beans/peas) to fix nitrogen.\n"
        "- Year 2: Fruiting crops (tomatoes, peppers, cucumbers) in beds following legumes.\n"
        "- Year 3: Roots and brassicas (carrots, radishes, kale); add compost; then repeat cycle.\n"
        "Tip: Avoid planting the same family in the same spot in consecutive years to reduce disease.\n"
    )

def _map_crop_to_water_use(interests: List) -> CropWaterUse:
    """Map crop interests to water use category."""
    from .models import CropInterest
    
    if CropInterest.TOMATOES in interests:
        return CropWaterUse.TOMATOES_PEPPERS
    elif CropInterest.PEPPERS in interests:
        return CropWaterUse.TOMATOES_PEPPERS
    elif CropInterest.BEANS_PEAS in interests:
        return CropWaterUse.BEANS_PEAS
    elif CropInterest.ROOT_VEGETABLES in interests:
        return CropWaterUse.ROOT_CROPS
    elif CropInterest.LEAFY_GREENS in interests:
        return CropWaterUse.LEAFY_GREENS
    elif CropInterest.HERBS in interests:
        return CropWaterUse.HERBS
    else:
        return CropWaterUse.VEGETABLES  # Default


def generate_plan(
    user: UserInput, 
    climate: ClimateData, 
    vision_insights: Optional[Dict[str, Any]] = None,
    enhanced_data: Optional[EnhancedEnvironmentalData] = None
) -> str:
    # Analyze enhanced environmental data if available
    air_quality_analysis = None
    solar_analysis = None
    pollen_analysis = None
    elevation_analysis = None
    environmental_summary = ""
    
    if enhanced_data:
        air_quality_analysis = analyze_air_quality_impact(enhanced_data.air_quality)
        solar_analysis = analyze_solar_exposure(enhanced_data.solar)
        pollen_analysis = analyze_pollen_levels(enhanced_data.pollen)
        elevation_analysis = analyze_elevation_effects(
            enhanced_data.elevation,
            climate.latitude
        )
        environmental_summary = generate_environmental_summary(enhanced_data)
    
    # Override sunlight if we have precise solar data
    effective_sunlight = user.sunlight
    if solar_analysis and solar_analysis["sunlight_category"] != "unknown":
        # Map solar category to Sunlight enum
        solar_to_sunlight = {
            "full_sun": Sunlight.FULL_SUN,
            "partial_sun": Sunlight.PARTIAL_SUN,
            "partial_shade": Sunlight.PARTIAL_SHADE,
            "shade": Sunlight.SHADE,
        }
        effective_sunlight = solar_to_sunlight.get(
            solar_analysis["sunlight_category"],
            user.sunlight
        )
    
    plants = recommend_plants(
        interests=user.goals.crops,
        sunlight=effective_sunlight,  # Use solar-enhanced sunlight
        method=user.method,
        size=user.size,
        experience=user.experience,
        preferences=user.goals.preferences,
        us_region=climate.us_region,
        state=climate.state,
    )
    
    # Add air quality note if pollution is high
    air_quality_note = ""
    if air_quality_analysis and air_quality_analysis["filter_pollution_tolerant"]:
        air_quality_note = "\n⚠️  Note: High air pollution detected. Prioritizing pollution-tolerant varieties and recommending thorough washing of leafy greens before consumption.\n"

    # Use all recommended plants (15-20 for diversity) with timing info
    plant_entries = []
    for p in plants:
        timing = get_crop_timing(p.name)
        if timing:
            entry = f"- {p.name}: {p.notes} | Plant: {', '.join(timing.planting_months[:3])} | Harvest: {timing.days_to_harvest} days"
        else:
            entry = f"- {p.name}: {p.notes}"
        plant_entries.append(entry)
    
    plant_list = "\n".join(plant_entries) or "- No matches; consider adjusting constraints."
    plant_list += air_quality_note
    
    # Extract crop names for v3.1 features (use all plants)
    crop_names = [p.name for p in plants]
    
    # v3.1 Feature 1: Companion Planting
    companion_guide = generate_companion_planting_guide(crop_names)
    
    # v4.1 Feature: Multi-Year Rotation Planning
    rotation_plan = generate_rotation_plan(crop_names, years=4)
    soil_improvement = generate_soil_improvement_plan(crop_names)
    
    # v4.1 Feature: Detailed Care Instructions
    detailed_care = generate_detailed_care_guide(crop_names)
    maintenance_schedule = generate_maintenance_schedule(crop_names)
    fertilization_guide = generate_fertilization_guide(crop_names)
    pruning_guide = generate_pruning_guide(crop_names)
    
    # v4.1 Feature: Expert Tips & Troubleshooting
    troubleshooting_guide = generate_troubleshooting_guide(crop_names)
    common_mistakes = generate_common_mistakes_guide()
    expert_tips = generate_expert_tips(crop_names)
    # Determine current season for seasonal tips
    from datetime import date
    month = date.today().month
    if month in [3, 4, 5]:
        current_season = "Spring"
    elif month in [6, 7, 8]:
        current_season = "Summer"
    elif month in [9, 10, 11]:
        current_season = "Fall"
    else:
        current_season = "Winter"
    seasonal_tips = generate_seasonal_tips(current_season)
    
    # v3.1 Feature 2: Yield Estimates
    # Map experience to resource skill level
    skill_level_map = {
        Experience.BEGINNER: ResourceSkillLevel.BEGINNER,
        Experience.NOVICE: ResourceSkillLevel.BEGINNER,
        Experience.INTERMEDIATE: ResourceSkillLevel.INTERMEDIATE,
        Experience.ADVANCED: ResourceSkillLevel.ADVANCED,
    }
    resource_skill = skill_level_map.get(user.experience, ResourceSkillLevel.BEGINNER)
    
    yield_summary = generate_yield_summary(
        crop_names,
        user.size,
        user.sunlight,
        user.experience
    )
    
    # v3.1 Feature 3: Disease Prevention
    # v3.2: Pass region for regional risk assessment
    disease_guide = generate_disease_prevention_guide(crop_names, climate.us_region)
    
    # v3.1 Feature 4: Educational Resources
    learning_resources = generate_resource_guide(
        crop_names,
        resource_skill,
        topics=["watering", "soil"]
    )
    
    # Phase 1: Drought status and climate hub
    drought_status = fetch_drought_status_simple(climate.latitude, climate.longitude)
    drought_adapted_recs = ""
    if drought_status["severity_numeric"] > 0:
        drought_adapted_recs = generate_drought_adapted_recommendations(
            drought_status["drought_level"],
            drought_status["severity_numeric"]
        )
    
    climate_hub_info = get_climate_hub_for_location(climate.state, climate.us_region)
    climate_hub_section = generate_climate_hub_section(climate_hub_info, climate.state)
    
    # Enhanced hardiness zone info if available
    enhanced_zone_info = ""
    if climate.usda_zone:
        # Get minimum temp from climate data (approximate)
        min_temp_c = min(climate.daily_lows_c) if climate.daily_lows_c else -10
        enhanced_zone_info = "\n" + enhance_hardiness_zone_info(climate.usda_zone, min_temp_c)
    
    # Phase 2: Future climate projections
    future_climate_section = generate_future_climate_section(climate.us_region, climate.state)
    
    # Phase 3: Regional resources and risk assessment
    regional_resources_section = generate_comprehensive_resources_section(
        climate.latitude,
        climate.longitude,
        climate.state,
        climate.us_region
    )
    
    # Water deficit analysis if soil type known
    water_recommendation = None
    if user.soil_type != SoilType.UNKNOWN and climate.daily_highs_c and climate.daily_lows_c:
        try:
            # Map soil type
            soil_map = {
                SoilType.HIGH: WaterSoilType.HIGH,
                SoilType.MEDIUM: WaterSoilType.MEDIUM,
                SoilType.LOW: WaterSoilType.LOW,
            }
            water_soil = soil_map.get(user.soil_type, WaterSoilType.MEDIUM)
            
            # Determine crop water use from goals
            crop_water_use = _map_crop_to_water_use(user.goals.crops)
            
            # Simulate water deficit
            water_results = simulate_water_deficit(
                daily_highs_c=climate.daily_highs_c,
                daily_lows_c=climate.daily_lows_c,
                daily_precip_mm=climate.daily_precip_mm,
                latitude=climate.latitude,
                start_date=date.today(),
                soil_type=water_soil,
                crop_type=crop_water_use,
            )
            water_recommendation = generate_irrigation_recommendation(water_results)
        except Exception as e:
            water_recommendation = f"Water analysis unavailable: {e}"
    
    # Seasonal planning
    frost_first = None
    frost_last = None
    try:
        if climate.frost_first_fall:
            # Parse "Oct 15" format to date
            from datetime import datetime
            frost_first = datetime.strptime(f"{climate.frost_first_fall} 2024", "%b %d %Y").date()
        if climate.frost_last_spring:
            frost_last = datetime.strptime(f"{climate.frost_last_spring} 2024", "%b %d %Y").date()
    except:
        pass
    
    cover_crop_guide = generate_cover_crop_recommendations(
        current_date=date.today(),
        first_frost=frost_first,
        us_region=climate.us_region,
    )
    
    succession_guide = generate_succession_planting_guide(
        frost_last_spring=frost_last,
        frost_first_fall=frost_first,
        current_date=date.today(),
        recommended_crops=crop_names,
        user_seasons=user.seasons,  # User's selected growing seasons
    )

    # v4.0 Phase 1: Generate visual layout if we have recommended crops
    visual_layout = ""
    if plants:
        layout_crop_names = [p.name for p in plants[:8]]  # Top 8 crops for layout
        
        # Determine bed size based on user space
        if user.size == SpaceSize.SMALL:
            bed_size = "4x4 bed"
        elif user.size == SpaceSize.MEDIUM:
            bed_size = "4x8 bed"
        else:  # LARGE
            bed_size = "8x12 bed"
        
        try:
            visual_layout = "\n\n" + generate_layout_guide(layout_crop_names, bed_size) + "\n"
        except Exception as e:
            visual_layout = f"\n\nNote: Visual layout generation unavailable: {e}\n"
    
    # v4.0 Phase 2: Generate variety guides for top crops
    variety_guides = ""
    if plants:
        # Generate variety guides for top 3 crops that have variety data
        crops_with_varieties = []
        for plant in plants[:5]:  # Check top 5
            varieties = get_varieties_for_crop(plant.name)
            if varieties:
                crops_with_varieties.append(plant.name)
                if len(crops_with_varieties) >= 3:  # Limit to 3 to keep plan readable
                    break
        
        if crops_with_varieties:
            variety_guides = "\n"
            for crop_name in crops_with_varieties:
                try:
                    variety_guides += generate_variety_guide(crop_name, max_varieties=2) + "\n"
                except Exception as e:
                    variety_guides += f"\nNote: Variety guide for {crop_name} unavailable: {e}\n"
    
    # Add solar data note if available
    sunlight_note = ""
    if solar_analysis and solar_analysis["summer_hours"]:
        sunlight_note = f" (Solar Analysis: {solar_analysis['summer_hours']:.1f}h summer, {solar_analysis['winter_hours']:.1f}h winter)"
    
    # Add elevation adjustment note if available
    elevation_note = ""
    if elevation_analysis and elevation_analysis["elevation_meters"]:
        elevation_note = f" | Elevation: {int(elevation_analysis['elevation_meters'])}m (Temp adjustment: {elevation_analysis['temperature_adjustment']:.1f}°F)"
    
    plan = (
        f"{'=' * 70}\n"
        f"CUSTOMIZED GARDENING PLAN v4.1 (Google APIs Enhanced)\n"
        f"{'=' * 70}\n\n"
        f"Location: {climate.city or ''} {climate.state or ''} {climate.country or ''} ({climate.latitude:.4f}, {climate.longitude:.4f}) | TZ: {climate.timezone}\n"
        f"Region: {climate.us_region or 'N/A'} | USDA Zone: {climate.usda_zone or 'Unknown'}{elevation_note}\n"
        f"Frost Window: Last Spring {climate.frost_last_spring or 'N/A'} | First Fall {climate.frost_first_fall or 'N/A'}\n\n"
        f"Your Garden Profile:\n"
        f"  Method: {user.method}\n"
        f"  Space Size: {user.size}\n"
        f"  Sunlight: {user.sunlight}{sunlight_note}\n"
        f"  Soil Type: {user.soil_type}\n"
        f"  Experience: {user.experience}\n"
        f"  Goals: {[c.value for c in user.goals.crops]}\n"
        f"  Preferences: {[p.value for p in user.goals.preferences]}\n"
        f"\nCurrent Climate Summary: {climate.summary}\n"
        + enhanced_zone_info
        + drought_adapted_recs
        + climate_hub_section
        + environmental_summary
        + "\n\n" + ("=" * 70)
        + "\nPLANNING RECOMMENDATIONS\n"
        + ("=" * 70) + "\n\n"
        + _layout_suggestions(user.method, user.size, user.sunlight)
        + "\n\nRecommended Crops (top matches):\n"
        + plant_list
        + yield_summary
        + companion_guide
        + visual_layout
        + variety_guides
        + "\n\n"
        + _planting_calendar(climate)
        + "\n\n"
        + _care_schedule(water_recommendation)
        + "\n\n"
        + succession_guide
        + "\n\n"
        + cover_crop_guide
        + rotation_plan
        + soil_improvement
        + detailed_care
        + maintenance_schedule
        + fertilization_guide
        + pruning_guide
        + troubleshooting_guide
        + common_mistakes
        + expert_tips
        + seasonal_tips
        + "\n\n"
        + disease_guide
        + future_climate_section
        + regional_resources_section
        + learning_resources
        + "\n\n" + ("=" * 70)
        + "\nEND OF PLAN\n"
        + ("=" * 70)
    )

    if user.image_path:
        plan += f"\nImage: {user.image_path}"
        if vision_insights:
            plan += "\nImage Insights:\n"
            for k in ("brightness","green_index","edge_density"):
                if k in vision_insights:
                    plan += f"- {k.replace('_',' ').title()}: {vision_insights[k]}\n"
            for note in vision_insights.get("notes", []):
                plan += f"- {note}\n"
        else:
            plan += "\nNote: Image provided; analysis unavailable."

    return plan
