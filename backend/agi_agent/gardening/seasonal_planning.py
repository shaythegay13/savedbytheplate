"""
Seasonal planning and succession planting module.
Based on Cornell Climate Smart Farming tools for cover crops and succession planting.

References:
- CSF Winter Cover Crop Planting Scheduler
- Growing degree day calculations for optimal timing
"""

from typing import List, Dict, Any, Optional, Tuple
from datetime import date, timedelta
from enum import Enum


class CoverCropType(str, Enum):
    """Common cover crop types for home gardens"""
    WINTER_RYE = "Winter Rye"
    BUCKWHEAT = "Buckwheat"
    CRIMSON_CLOVER = "Crimson Clover"
    HAIRY_VETCH = "Hairy Vetch"
    FIELD_PEAS = "Field Peas"
    OATS = "Oats"
    RADISH = "Tillage Radish"


# Growing degree day (GDD) base temperatures (°C)
GDD_BASE_TEMP = {
    CoverCropType.WINTER_RYE: 0,      # Cool season
    CoverCropType.BUCKWHEAT: 10,      # Warm season
    CoverCropType.CRIMSON_CLOVER: 5,  # Cool season
    CoverCropType.HAIRY_VETCH: 5,     # Cool season
    CoverCropType.FIELD_PEAS: 4,      # Cool season
    CoverCropType.OATS: 4,            # Cool season
    CoverCropType.RADISH: 5,          # Cool season
}

# Target GDD for establishment/biomass
GDD_TARGETS = {
    CoverCropType.WINTER_RYE: 150,    # Just needs to establish before winter
    CoverCropType.BUCKWHEAT: 800,     # Needs significant growth
    CoverCropType.CRIMSON_CLOVER: 400,
    CoverCropType.HAIRY_VETCH: 350,
    CoverCropType.FIELD_PEAS: 600,
    CoverCropType.OATS: 500,
    CoverCropType.RADISH: 400,
}


def calculate_gdd(temp_high_c: float, temp_low_c: float, base_temp_c: float) -> float:
    """
    Calculate growing degree days using average method.
    
    GDD = max(0, (T_max + T_min) / 2 - T_base)
    
    Args:
        temp_high_c: Daily maximum temperature (Celsius)
        temp_low_c: Daily minimum temperature (Celsius)
        base_temp_c: Base temperature for crop (Celsius)
    
    Returns:
        Growing degree days
    """
    avg_temp = (temp_high_c + temp_low_c) / 2.0
    gdd = max(0, avg_temp - base_temp_c)
    return gdd


def estimate_cover_crop_window(
    current_date: date,
    first_frost_date: Optional[date],
    cover_crop: CoverCropType,
    avg_daily_gdd: float = 10.0
) -> Dict[str, Any]:
    """
    Estimate planting window for cover crops.
    
    Args:
        current_date: Current date
        first_frost_date: Expected first frost date
        cover_crop: Type of cover crop
        avg_daily_gdd: Average daily GDD accumulation (estimated from forecast)
    
    Returns:
        Planting window recommendation
    """
    if first_frost_date is None:
        # Fallback: assume mid-October for temperate climates
        first_frost_date = date(current_date.year, 10, 15)
        frost_assumed = True
    else:
        frost_assumed = False
    
    target_gdd = GDD_TARGETS[cover_crop]
    base_temp = GDD_BASE_TEMP[cover_crop]
    
    # Days needed to accumulate target GDD
    days_needed = int(target_gdd / avg_daily_gdd) if avg_daily_gdd > 0 else 60
    
    # Latest safe planting date
    latest_planting = first_frost_date - timedelta(days=days_needed)
    
    # Optimal planting window (add buffer)
    optimal_start = latest_planting - timedelta(days=14)  # 2 weeks before latest
    
    # Determine status
    days_until_latest = (latest_planting - current_date).days
    
    if current_date > latest_planting:
        status = "too_late"
        message = f"Too late to plant {cover_crop.value} for this season."
    elif current_date > optimal_start:
        status = "late"
        message = f"Plant {cover_crop.value} soon! {days_until_latest} days until latest safe date."
    else:
        status = "optimal"
        days_until_window = (optimal_start - current_date).days
        message = f"Optimal planting window opens in {days_until_window} days."
    
    return {
        "cover_crop": cover_crop.value,
        "optimal_start": optimal_start.isoformat(),
        "latest_date": latest_planting.isoformat(),
        "first_frost": first_frost_date.isoformat(),
        "frost_assumed": frost_assumed,
        "status": status,
        "message": message,
        "days_needed": days_needed,
    }


def generate_succession_planting_schedule(
    start_date: date,
    end_date: date,
    crop_name: str,
    days_to_harvest: int,
    planting_interval_days: int = 14
) -> List[Dict[str, str]]:
    """
    Generate succession planting schedule for continuous harvest.
    
    Args:
        start_date: Start of planting season
        end_date: End of planting season (last safe date)
        crop_name: Name of crop
        days_to_harvest: Days from planting to harvest
        planting_interval_days: Days between successive plantings
    
    Returns:
        List of planting dates with expected harvest dates
    """
    schedule = []
    current_date = start_date
    
    while current_date <= end_date:
        harvest_date = current_date + timedelta(days=days_to_harvest)
        
        schedule.append({
            "crop": crop_name,
            "planting_date": current_date.isoformat(),
            "expected_harvest": harvest_date.isoformat(),
            "days_to_harvest": days_to_harvest,
        })
        
        current_date += timedelta(days=planting_interval_days)
    
    return schedule


def recommend_succession_crops() -> List[Dict[str, Any]]:
    """
    Recommend crops suitable for succession planting in home gardens.
    
    Returns:
        List of succession-friendly crops with timing info
    """
    crops = [
        {
            "name": "Lettuce",
            "days_to_harvest": 45,
            "interval_days": 14,
            "season": "cool",
            "notes": "Plant every 2 weeks spring and fall for continuous salads",
        },
        {
            "name": "Radishes",
            "days_to_harvest": 25,
            "interval_days": 10,
            "season": "cool",
            "notes": "Fast-growing; sow every 10 days for fresh radishes",
        },
        {
            "name": "Bush Beans",
            "days_to_harvest": 55,
            "interval_days": 21,
            "season": "warm",
            "notes": "Plant every 3 weeks through summer",
        },
        {
            "name": "Arugula",
            "days_to_harvest": 30,
            "interval_days": 14,
            "season": "cool",
            "notes": "Quick-growing green; succession plant spring and fall",
        },
        {
            "name": "Carrots",
            "days_to_harvest": 70,
            "interval_days": 21,
            "season": "cool",
            "notes": "Stagger plantings every 3 weeks for continuous harvest",
        },
        {
            "name": "Spinach",
            "days_to_harvest": 40,
            "interval_days": 14,
            "season": "cool",
            "notes": "Plant every 2 weeks; bolt-resistant varieties in summer",
        },
        {
            "name": "Cilantro",
            "days_to_harvest": 40,
            "interval_days": 14,
            "season": "cool",
            "notes": "Bolts quickly in heat; succession plant in cool seasons",
        },
        {
            "name": "Beets",
            "days_to_harvest": 55,
            "interval_days": 21,
            "season": "cool",
            "notes": "Plant every 3 weeks for continuous harvest of greens and roots",
        },
    ]
    
    return crops


def generate_cover_crop_recommendations(
    current_date: date,
    first_frost: Optional[date],
    us_region: Optional[str] = None
) -> str:
    """
    Generate cover crop recommendations based on location and timing.
    
    Args:
        current_date: Current date
        first_frost: Expected first frost date
        us_region: US region (Northeast, Midwest, South, West)
    
    Returns:
        Formatted recommendations string
    """
    recommendations = "Cover Crop Recommendations:\n\n"
    recommendations += "Cover crops build soil health between growing seasons:\n"
    recommendations += "- Fix nitrogen (legumes like clover, vetch)\n"
    recommendations += "- Prevent erosion and suppress weeds\n"
    recommendations += "- Break up compacted soil (tillage radish)\n"
    recommendations += "- Add organic matter when tilled in\n\n"
    
    # Determine season
    month = current_date.month
    if month in [3, 4, 5]:
        season = "spring"
    elif month in [6, 7, 8]:
        season = "summer"
    elif month in [9, 10]:
        season = "fall"
    else:
        season = "winter"
    
    if season == "fall":
        recommendations += "Fall Cover Crop Planting:\n"
        
        # Check winter rye
        rye_window = estimate_cover_crop_window(current_date, first_frost, CoverCropType.WINTER_RYE)
        recommendations += f"- **Winter Rye**: {rye_window['message']}\n"
        recommendations += "  Hardy; establishes quickly; excellent for overwintering\n"
        
        # Crimson clover
        clover_window = estimate_cover_crop_window(current_date, first_frost, CoverCropType.CRIMSON_CLOVER)
        recommendations += f"- **Crimson Clover**: {clover_window['message']}\n"
        recommendations += "  Nitrogen fixer; beautiful flowers in spring\n"
        
        # Hairy vetch
        vetch_window = estimate_cover_crop_window(current_date, first_frost, CoverCropType.HAIRY_VETCH)
        recommendations += f"- **Hairy Vetch**: {vetch_window['message']}\n"
        recommendations += "  Nitrogen fixer; good for spring vegetable beds\n"
        
        # Tillage radish
        radish_window = estimate_cover_crop_window(current_date, first_frost, CoverCropType.RADISH)
        recommendations += f"- **Tillage Radish**: {radish_window['message']}\n"
        recommendations += "  Deep roots break up compaction; winter-kills in cold climates\n"
        
    elif season in ["spring", "summer"]:
        recommendations += "Summer Cover Crop Options:\n"
        recommendations += "- **Buckwheat**: Fast-growing; plant after spring crops\n"
        recommendations += "  Grows in 6-8 weeks; great for weed suppression\n"
        recommendations += "- **Oats**: Quick establishment; good smother crop\n"
        recommendations += "  Plant in gaps or after early harvests\n"
        recommendations += "- **Field Peas**: Nitrogen fixer for summer\n"
        recommendations += "  Prepare beds for fall brassicas\n"
    else:
        recommendations += "Winter Planning:\n"
        recommendations += "- Review your fall cover crop performance\n"
        recommendations += "- Order seeds for spring succession plantings\n"
        recommendations += "- Plan crop rotation for upcoming season\n"
    
    return recommendations


def generate_succession_planting_guide(
    frost_last_spring: Optional[date],
    frost_first_fall: Optional[date],
    current_date: date,
    recommended_crops: Optional[List[str]] = None,
    user_seasons: Optional[List[str]] = None
) -> str:
    """
    Generate succession planting guide with specific dates based on user's recommended crops.
    
    Args:
        frost_last_spring: Last spring frost date
        frost_first_fall: First fall frost date
        current_date: Current date
        recommended_crops: List of crop names recommended to the user
        user_seasons: List of seasons user selected (e.g., ["Spring", "Summer", "Fall"])
    
    Returns:
        Formatted succession planting guide
    """
    guide = "Seasonal Planting Guide:\n\n"
    guide += "Based on your recommended crops and selected growing seasons:\n\n"
    
    # Get all succession crop data
    all_succession_crops = recommend_succession_crops()
    
    # Filter to only crops that were recommended to the user
    if recommended_crops:
        succession_crops = [
            crop for crop in all_succession_crops
            if any(rec_crop.lower() in crop["name"].lower() or crop["name"].lower() in rec_crop.lower() 
                   for rec_crop in recommended_crops)
        ]
    else:
        succession_crops = all_succession_crops
    
    # Use user's selected seasons or default to current season
    seasons_to_show = []
    if user_seasons:
        seasons_to_show = [s.lower() for s in user_seasons]
    else:
        # Determine current season as fallback
        month = current_date.month
        if month in [3, 4, 5]:
            seasons_to_show = ["spring"]
        elif month in [6, 7, 8]:
            seasons_to_show = ["summer"]
        elif month in [9, 10, 11]:
            seasons_to_show = ["fall"]
        else:
            seasons_to_show = ["winter"]
    
    # Show planting info for each selected season
    if "spring" in seasons_to_show:
        guide += "**Spring Planting** (your recommended crops):\n"
        spring_crops = [c for c in succession_crops if c["season"] == "cool"]
        if spring_crops:
            for crop in spring_crops:
                guide += f"- **{crop['name']}** ({crop['days_to_harvest']} days): {crop['notes']}\n"
        else:
            guide += "- Start warm-season crops indoors 6-8 weeks before last frost\n"
        guide += "\n"
    
    if "summer" in seasons_to_show:
        guide += "**Summer Planting** (your recommended crops):\n"
        summer_crops = [c for c in succession_crops if c["season"] == "warm"]
        if summer_crops:
            for crop in summer_crops:
                guide += f"- **{crop['name']}** ({crop['days_to_harvest']} days): {crop['notes']}\n"
        guide += "- Late summer: Start cool-season crops for fall harvest\n"
        guide += "\n"
    
    if "fall" in seasons_to_show:
        guide += "**Fall Planting** (your recommended crops):\n"
        fall_crops = [c for c in succession_crops if c["season"] == "cool" and c["days_to_harvest"] <= 60]
        if fall_crops:
            for crop in fall_crops:
                guide += f"- **{crop['name']}** ({crop['days_to_harvest']} days): Quick-maturing for late harvest\n"
        else:
            guide += "- Plant garlic and perennials in fall\n"
        guide += "\n"
    
    if "winter" in seasons_to_show:
        guide += "**Winter Planning**:\n"
        guide += "- Review your garden journal and plan for spring\n"
        guide += "- Order seeds early for best selection\n"
        guide += "- Start planning crop rotation\n"
        guide += "\n"
    
    guide += "\n**Pro Tips**:\n"
    guide += "- Mark plantings with date labels\n"
    guide += "- Keep a simple log to track what works\n"
    guide += "- Adjust intervals based on weather (faster in warm weather)\n"
    guide += "- Consider container plantings for flexibility\n"
    
    return guide
