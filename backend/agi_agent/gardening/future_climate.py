"""
Future climate projections and adaptation planning module.
Provides long-term climate trends and crop adaptation strategies.

Phase 2 Features:
- Future climate projections (10/20/30 year outlook)
- Climate trend analysis
- Climate-resilient crop recommendations
- Adaptation strategies for changing conditions
"""

from typing import Dict, Any, List, Optional, Tuple
from enum import Enum
from datetime import date


class ClimateScenario(str, Enum):
    """Climate change scenarios (simplified from RCP/SSP)"""
    LOW_EMISSIONS = "Low Emissions (RCP 2.6 / SSP1-2.6)"
    MODERATE_EMISSIONS = "Moderate Emissions (RCP 4.5 / SSP2-4.5)"
    HIGH_EMISSIONS = "High Emissions (RCP 8.5 / SSP5-8.5)"


class ClimateTrend(str, Enum):
    """Types of climate trends"""
    WARMING = "Warming"
    DRYING = "Drying"
    WETTING = "Increased Precipitation"
    VARIABLE = "Increased Variability"
    EXTREME_HEAT = "More Extreme Heat"
    EXTREME_PRECIP = "More Extreme Precipitation"


# Regional climate projections (simplified from Climate Toolbox and USDA Climate Hubs)
# Format: {region: {horizon: {metric: change}}}
REGIONAL_PROJECTIONS = {
    "Northeast": {
        "2030s": {
            "temp_increase_c": 1.5,
            "precip_change_pct": 5,
            "growing_season_days": 10,
            "extreme_heat_days": 5,
            "trends": [ClimateTrend.WARMING, ClimateTrend.WETTING, ClimateTrend.EXTREME_PRECIP],
        },
        "2050s": {
            "temp_increase_c": 2.5,
            "precip_change_pct": 10,
            "growing_season_days": 20,
            "extreme_heat_days": 15,
            "trends": [ClimateTrend.WARMING, ClimateTrend.WETTING, ClimateTrend.EXTREME_PRECIP, ClimateTrend.EXTREME_HEAT],
        },
        "2080s": {
            "temp_increase_c": 4.0,
            "precip_change_pct": 15,
            "growing_season_days": 30,
            "extreme_heat_days": 30,
            "trends": [ClimateTrend.WARMING, ClimateTrend.WETTING, ClimateTrend.EXTREME_PRECIP, ClimateTrend.EXTREME_HEAT, ClimateTrend.VARIABLE],
        },
    },
    "Southeast": {
        "2030s": {
            "temp_increase_c": 1.5,
            "precip_change_pct": -5,
            "growing_season_days": 15,
            "extreme_heat_days": 10,
            "trends": [ClimateTrend.WARMING, ClimateTrend.EXTREME_HEAT],
        },
        "2050s": {
            "temp_increase_c": 2.5,
            "precip_change_pct": -5,
            "growing_season_days": 25,
            "extreme_heat_days": 25,
            "trends": [ClimateTrend.WARMING, ClimateTrend.DRYING, ClimateTrend.EXTREME_HEAT],
        },
        "2080s": {
            "temp_increase_c": 4.5,
            "precip_change_pct": -10,
            "growing_season_days": 40,
            "extreme_heat_days": 45,
            "trends": [ClimateTrend.WARMING, ClimateTrend.DRYING, ClimateTrend.EXTREME_HEAT, ClimateTrend.VARIABLE],
        },
    },
    "Midwest": {
        "2030s": {
            "temp_increase_c": 1.5,
            "precip_change_pct": 5,
            "growing_season_days": 10,
            "extreme_heat_days": 8,
            "trends": [ClimateTrend.WARMING, ClimateTrend.WETTING],
        },
        "2050s": {
            "temp_increase_c": 2.5,
            "precip_change_pct": 10,
            "growing_season_days": 20,
            "extreme_heat_days": 20,
            "trends": [ClimateTrend.WARMING, ClimateTrend.WETTING, ClimateTrend.EXTREME_HEAT, ClimateTrend.VARIABLE],
        },
        "2080s": {
            "temp_increase_c": 4.0,
            "precip_change_pct": 15,
            "growing_season_days": 35,
            "extreme_heat_days": 35,
            "trends": [ClimateTrend.WARMING, ClimateTrend.WETTING, ClimateTrend.EXTREME_HEAT, ClimateTrend.VARIABLE],
        },
    },
    "West": {
        "2030s": {
            "temp_increase_c": 1.5,
            "precip_change_pct": -10,
            "growing_season_days": 10,
            "extreme_heat_days": 10,
            "trends": [ClimateTrend.WARMING, ClimateTrend.DRYING],
        },
        "2050s": {
            "temp_increase_c": 2.5,
            "precip_change_pct": -15,
            "growing_season_days": 20,
            "extreme_heat_days": 25,
            "trends": [ClimateTrend.WARMING, ClimateTrend.DRYING, ClimateTrend.EXTREME_HEAT],
        },
        "2080s": {
            "temp_increase_c": 4.5,
            "precip_change_pct": -20,
            "growing_season_days": 30,
            "extreme_heat_days": 40,
            "trends": [ClimateTrend.WARMING, ClimateTrend.DRYING, ClimateTrend.EXTREME_HEAT, ClimateTrend.VARIABLE],
        },
    },
    "South": {  # Redirect to Southeast
        "2030s": {"temp_increase_c": 1.5, "precip_change_pct": -5, "growing_season_days": 15, "extreme_heat_days": 10, "trends": [ClimateTrend.WARMING, ClimateTrend.EXTREME_HEAT]},
        "2050s": {"temp_increase_c": 2.5, "precip_change_pct": -5, "growing_season_days": 25, "extreme_heat_days": 25, "trends": [ClimateTrend.WARMING, ClimateTrend.DRYING, ClimateTrend.EXTREME_HEAT]},
        "2080s": {"temp_increase_c": 4.5, "precip_change_pct": -10, "growing_season_days": 40, "extreme_heat_days": 45, "trends": [ClimateTrend.WARMING, ClimateTrend.DRYING, ClimateTrend.EXTREME_HEAT, ClimateTrend.VARIABLE]},
    },
}

# Climate-resilient crop varieties and strategies
RESILIENT_STRATEGIES = {
    ClimateTrend.WARMING: {
        "description": "Rising average temperatures",
        "crops": ["Heat-tolerant lettuce", "Armenian cucumber", "Drought-tolerant beans", "Okra", "Sweet potato"],
        "strategies": [
            "Shift spring planting 1-2 weeks earlier",
            "Extend fall growing season",
            "Use shade cloth for cool-season crops in summer",
            "Select heat-tolerant varieties",
            "Consider two spring/fall growing seasons",
        ],
    },
    ClimateTrend.DRYING: {
        "description": "Decreased precipitation and increased drought",
        "crops": ["Drought-tolerant herbs (rosemary, thyme)", "Amaranth", "Tepary beans", "Jerusalem artichoke", "Sunflowers"],
        "strategies": [
            "Install drip irrigation or soaker hoses",
            "Increase mulch depth to 4-6 inches",
            "Collect rainwater in barrels",
            "Choose drought-tolerant native plants",
            "Reduce lawn, increase gardens with mulch",
        ],
    },
    ClimateTrend.WETTING: {
        "description": "Increased total precipitation",
        "crops": ["Disease-resistant tomatoes", "Raised bed vegetables", "Rice", "Taro", "Water-loving herbs"],
        "strategies": [
            "Improve drainage with raised beds",
            "Use disease-resistant varieties",
            "Increase air circulation between plants",
            "Apply preventative fungicide treatments",
            "Install rain gardens to manage excess water",
        ],
    },
    ClimateTrend.EXTREME_HEAT: {
        "description": "More frequent heat waves (>90°F/32°C)",
        "crops": ["Cherry tomatoes (heat-set varieties)", "Yardlong beans", "Eggplant", "Peppers", "Summer squash"],
        "strategies": [
            "Install shade structures (30-50% shade cloth)",
            "Increase watering frequency during heat waves",
            "Mulch heavily to keep roots cool",
            "Plant on east side of structures for afternoon shade",
            "Use misting systems during extreme heat",
        ],
    },
    ClimateTrend.EXTREME_PRECIP: {
        "description": "More intense rainfall events",
        "crops": ["Flood-tolerant vegetables", "Deep-rooted crops", "Container gardens", "Raised bed crops"],
        "strategies": [
            "Build berms and swales to redirect water",
            "Use raised beds (12-18 inches)",
            "Install overflow drainage",
            "Protect soil with permanent mulch or cover crops",
            "Avoid working wet soil to prevent compaction",
        ],
    },
    ClimateTrend.VARIABLE: {
        "description": "Increased weather variability and unpredictability",
        "crops": ["Quick-maturing varieties", "Succession-planted crops", "Season-extending crops", "Container-mobile crops"],
        "strategies": [
            "Plant in succession for risk spreading",
            "Keep row covers and frost blankets ready",
            "Use containers for flexibility",
            "Diversify crop varieties and planting times",
            "Monitor forecasts closely and adapt quickly",
        ],
    },
}


def get_future_projections(us_region: Optional[str], horizon: str = "2050s") -> Optional[Dict[str, Any]]:
    """
    Get climate projections for a region and time horizon.
    
    Args:
        us_region: US region name
        horizon: Time horizon ("2030s", "2050s", "2080s")
    
    Returns:
        Projection data dict or None
    """
    if not us_region or us_region not in REGIONAL_PROJECTIONS:
        return None
    
    return REGIONAL_PROJECTIONS[us_region].get(horizon)


def analyze_climate_trends(us_region: Optional[str]) -> List[ClimateTrend]:
    """
    Get primary climate trends for a region (2050s mid-century outlook).
    
    Args:
        us_region: US region name
    
    Returns:
        List of climate trends
    """
    projections = get_future_projections(us_region, "2050s")
    if not projections:
        return []
    
    return projections.get("trends", [])


def recommend_resilient_varieties(trends: List[ClimateTrend]) -> Dict[str, Any]:
    """
    Recommend climate-resilient crop varieties and strategies.
    
    Args:
        trends: List of climate trends for the region
    
    Returns:
        Dict with crops and strategies
    """
    all_crops = set()
    all_strategies = []
    
    for trend in trends:
        if trend in RESILIENT_STRATEGIES:
            strategy_data = RESILIENT_STRATEGIES[trend]
            all_crops.update(strategy_data["crops"])
            all_strategies.extend(strategy_data["strategies"])
    
    return {
        "crops": list(all_crops),
        "strategies": list(set(all_strategies)),  # Deduplicate
        "trends": trends,
    }


def generate_future_climate_section(us_region: Optional[str], state: Optional[str]) -> str:
    """
    Generate future climate outlook section for garden plan.
    
    Args:
        us_region: US region name
        state: State name
    
    Returns:
        Formatted section
    """
    if not us_region:
        return ""
    
    section = "\n🌡️ Climate Change Outlook (Mid-Century: 2050s)\n\n"
    
    # Get projections
    projections_2030 = get_future_projections(us_region, "2030s")
    projections_2050 = get_future_projections(us_region, "2050s")
    projections_2080 = get_future_projections(us_region, "2080s")
    
    if not projections_2050:
        section += "Climate projections not available for your region.\n"
        section += "Visit Climate Toolbox for detailed projections: https://climatetoolbox.org/\n"
        return section
    
    section += f"Projected Changes for {us_region} (compared to 1980-2010 baseline):\n\n"
    
    # Temperature
    section += f"**Temperature:**\n"
    section += f"  2030s: +{projections_2030['temp_increase_c']:.1f}°C (+{projections_2030['temp_increase_c']*1.8:.1f}°F)\n"
    section += f"  2050s: +{projections_2050['temp_increase_c']:.1f}°C (+{projections_2050['temp_increase_c']*1.8:.1f}°F)\n"
    section += f"  2080s: +{projections_2080['temp_increase_c']:.1f}°C (+{projections_2080['temp_increase_c']*1.8:.1f}°F)\n\n"
    
    # Precipitation
    precip_direction = "increase" if projections_2050['precip_change_pct'] > 0 else "decrease"
    section += f"**Precipitation:** {abs(projections_2050['precip_change_pct'])}% {precip_direction} by 2050s\n\n"
    
    # Growing season
    section += f"**Growing Season:** +{projections_2050['growing_season_days']} days by 2050s\n\n"
    
    # Extreme heat
    section += f"**Extreme Heat Days:** +{projections_2050['extreme_heat_days']} days above 90°F (32°C) by 2050s\n\n"
    
    # Trends
    section += "**Key Trends:**\n"
    for trend in projections_2050['trends']:
        section += f"  • {trend.value}\n"
    
    # Adaptation strategies
    section += "\n**Adaptation Strategies:**\n\n"
    resilient_info = recommend_resilient_varieties(projections_2050['trends'])
    
    if resilient_info['strategies']:
        section += "Recommended Actions:\n"
        for i, strategy in enumerate(resilient_info['strategies'][:8], 1):  # Top 8
            section += f"  {i}. {strategy}\n"
        section += "\n"
    
    if resilient_info['crops']:
        section += "Climate-Adapted Crops to Consider:\n"
        for crop in sorted(resilient_info['crops'])[:10]:  # Top 10
            section += f"  • {crop}\n"
        section += "\n"
    
    # Resources
    section += "Learn More:\n"
    section += "- Climate Toolbox: https://climatetoolbox.org/tool/future-climate-dashboard\n"
    section += f"- USDA Climate Hubs: https://www.climatehubs.usda.gov/\n"
    
    if state:
        section += f"- {state} Climate Assessment: Search at your state's resources\n"
    
    section += "\n**Note:** Projections are based on moderate emissions scenario (RCP 4.5). "
    section += "Actual changes depend on global emissions trajectory.\n"
    
    return section


def get_hardiness_zone_shift(current_zone: str, us_region: Optional[str], horizon: str = "2050s") -> Tuple[str, str]:
    """
    Estimate hardiness zone shift due to climate change.
    
    Args:
        current_zone: Current USDA zone
        us_region: US region
        horizon: Time horizon
    
    Returns:
        Tuple of (future_zone, explanation)
    """
    projections = get_future_projections(us_region, horizon)
    if not projections:
        return current_zone, "Projection not available"
    
    # Rough estimate: ~10°F increase in minimum temp = 2 zones
    # Each degree C increase ≈ 0.5 zone shift
    temp_increase_c = projections['temp_increase_c']
    zone_shift = int(temp_increase_c * 0.5)
    
    # Parse current zone
    try:
        zone_num = int(current_zone[0])
        zone_letter = current_zone[1] if len(current_zone) > 1 else "a"
        
        # Shift up
        new_zone_num = min(13, zone_num + zone_shift)
        future_zone = f"{new_zone_num}{zone_letter}"
        
        explanation = f"By {horizon}, your area may experience conditions similar to current zone {future_zone} "
        explanation += f"(~{zone_shift} zone shift warmer). "
        explanation += "This means some plants currently marginal may thrive, while others may struggle with heat."
        
        return future_zone, explanation
        
    except:
        return current_zone, "Unable to estimate zone shift"
