"""
Climate adaptation and resilience module.
Integrates official USDA data, drought monitoring, and regional resources.

Phase 1 Features:
- Official USDA Plant Hardiness Zone lookup
- Current drought status from US Drought Monitor
- USDA Climate Hub regional resources
"""

from typing import Optional, Dict, Any, Tuple
from enum import Enum
from datetime import date
import requests


class DroughtLevel(str, Enum):
    """US Drought Monitor severity levels"""
    NONE = "None"
    D0_ABNORMALLY_DRY = "D0 - Abnormally Dry"
    D1_MODERATE = "D1 - Moderate Drought"
    D2_SEVERE = "D2 - Severe Drought"
    D3_EXTREME = "D3 - Extreme Drought"
    D4_EXCEPTIONAL = "D4 - Exceptional Drought"


class ClimateHub(str, Enum):
    """USDA Climate Hub regions"""
    NORTHEAST = "Northeast"
    SOUTHEAST = "Southeast"
    MIDWEST = "Midwest"
    NORTHERN_PLAINS = "Northern Plains"
    SOUTHERN_PLAINS = "Southern Plains"
    NORTHWEST = "Northwest"
    SOUTHWEST = "Southwest"
    CALIFORNIA = "California"
    CARIBBEAN = "Caribbean"
    PACIFIC_ISLANDS = "Pacific Islands"


# USDA Climate Hub URLs by region
CLIMATE_HUB_URLS = {
    ClimateHub.NORTHEAST: "https://www.climatehubs.usda.gov/hubs/northeast",
    ClimateHub.SOUTHEAST: "https://www.climatehubs.usda.gov/hubs/southeast",
    ClimateHub.MIDWEST: "https://www.climatehubs.usda.gov/hubs/midwest",
    ClimateHub.NORTHERN_PLAINS: "https://www.climatehubs.usda.gov/hubs/northern-plains",
    ClimateHub.SOUTHERN_PLAINS: "https://www.climatehubs.usda.gov/hubs/southern-plains",
    ClimateHub.NORTHWEST: "https://www.climatehubs.usda.gov/hubs/northwest",
    ClimateHub.SOUTHWEST: "https://www.climatehubs.usda.gov/hubs/southwest",
    ClimateHub.CALIFORNIA: "https://www.climatehubs.usda.gov/hubs/california",
    ClimateHub.CARIBBEAN: "https://www.climatehubs.usda.gov/hubs/caribbean",
    ClimateHub.PACIFIC_ISLANDS: "https://www.climatehubs.usda.gov/hubs/pacific-islands",
}

# State to Climate Hub mapping
STATE_TO_HUB = {
    # Northeast
    "Maine": ClimateHub.NORTHEAST, "New Hampshire": ClimateHub.NORTHEAST,
    "Vermont": ClimateHub.NORTHEAST, "Massachusetts": ClimateHub.NORTHEAST,
    "Rhode Island": ClimateHub.NORTHEAST, "Connecticut": ClimateHub.NORTHEAST,
    "New York": ClimateHub.NORTHEAST, "New Jersey": ClimateHub.NORTHEAST,
    "Pennsylvania": ClimateHub.NORTHEAST, "Delaware": ClimateHub.NORTHEAST,
    "Maryland": ClimateHub.NORTHEAST, "West Virginia": ClimateHub.NORTHEAST,
    
    # Southeast
    "Virginia": ClimateHub.SOUTHEAST, "North Carolina": ClimateHub.SOUTHEAST,
    "South Carolina": ClimateHub.SOUTHEAST, "Georgia": ClimateHub.SOUTHEAST,
    "Florida": ClimateHub.SOUTHEAST, "Alabama": ClimateHub.SOUTHEAST,
    "Mississippi": ClimateHub.SOUTHEAST, "Louisiana": ClimateHub.SOUTHEAST,
    "Arkansas": ClimateHub.SOUTHEAST, "Tennessee": ClimateHub.SOUTHEAST,
    "Kentucky": ClimateHub.SOUTHEAST,
    
    # Midwest
    "Ohio": ClimateHub.MIDWEST, "Indiana": ClimateHub.MIDWEST,
    "Illinois": ClimateHub.MIDWEST, "Michigan": ClimateHub.MIDWEST,
    "Wisconsin": ClimateHub.MIDWEST, "Minnesota": ClimateHub.MIDWEST,
    "Iowa": ClimateHub.MIDWEST, "Missouri": ClimateHub.MIDWEST,
    
    # Northern Plains
    "North Dakota": ClimateHub.NORTHERN_PLAINS, "South Dakota": ClimateHub.NORTHERN_PLAINS,
    "Nebraska": ClimateHub.NORTHERN_PLAINS, "Kansas": ClimateHub.NORTHERN_PLAINS,
    "Montana": ClimateHub.NORTHERN_PLAINS, "Wyoming": ClimateHub.NORTHERN_PLAINS,
    
    # Southern Plains
    "Oklahoma": ClimateHub.SOUTHERN_PLAINS, "Texas": ClimateHub.SOUTHERN_PLAINS,
    
    # Northwest
    "Washington": ClimateHub.NORTHWEST, "Oregon": ClimateHub.NORTHWEST,
    "Idaho": ClimateHub.NORTHWEST,
    
    # Southwest
    "Arizona": ClimateHub.SOUTHWEST, "New Mexico": ClimateHub.SOUTHWEST,
    "Utah": ClimateHub.SOUTHWEST, "Colorado": ClimateHub.SOUTHWEST,
    "Nevada": ClimateHub.SOUTHWEST,
    
    # California
    "California": ClimateHub.CALIFORNIA,
    
    # Territories
    "Puerto Rico": ClimateHub.CARIBBEAN, "Virgin Islands": ClimateHub.CARIBBEAN,
    "Hawaii": ClimateHub.PACIFIC_ISLANDS, "Guam": ClimateHub.PACIFIC_ISLANDS,
}


def get_usda_hardiness_zone_simple(lat: float, lon: float, min_temp_c: float) -> str:
    """
    Get USDA hardiness zone estimate from minimum temperature.
    
    NOTE: This is a fallback calculation. For production, should use official
    USDA Plant Hardiness Zone Map API: https://planthardiness.ars.usda.gov/
    
    Args:
        lat: Latitude
        lon: Longitude
        min_temp_c: Average annual extreme minimum temperature (Celsius)
    
    Returns:
        Zone string (e.g., "6b", "7a")
    """
    # Convert to Fahrenheit for USDA zone calculation
    min_temp_f = (min_temp_c * 9/5) + 32
    
    # USDA zones based on average annual extreme minimum temperature (°F)
    # Each zone is 10°F, each half-zone is 5°F
    zone_map = [
        (-60, -55, "1a"), (-55, -50, "1b"),
        (-50, -45, "2a"), (-45, -40, "2b"),
        (-40, -35, "3a"), (-35, -30, "3b"),
        (-30, -25, "4a"), (-25, -20, "4b"),
        (-20, -15, "5a"), (-15, -10, "5b"),
        (-10, -5, "6a"), (-5, 0, "6b"),
        (0, 5, "7a"), (5, 10, "7b"),
        (10, 15, "8a"), (15, 20, "8b"),
        (20, 25, "9a"), (25, 30, "9b"),
        (30, 35, "10a"), (35, 40, "10b"),
        (40, 45, "11a"), (45, 50, "11b"),
        (50, 55, "12a"), (55, 60, "12b"),
        (60, 70, "13a"), (70, 100, "13b"),
    ]
    
    for min_f, max_f, zone in zone_map:
        if min_f <= min_temp_f < max_f:
            return zone
    
    # Fallback
    if min_temp_f < -60:
        return "1a"
    return "13b"


def fetch_drought_status_simple(lat: float, lon: float) -> Dict[str, Any]:
    """
    Get current drought status for location.
    
    NOTE: This is a simplified version. Production should use:
    - US Drought Monitor data feed: https://droughtmonitor.unl.edu/DmData/DataDownload.aspx
    - Or state-specific APIs
    
    For now, returns placeholder that can be replaced with actual API call.
    
    Args:
        lat: Latitude
        lon: Longitude
    
    Returns:
        Dict with drought information
    """
    # TODO: Implement actual US Drought Monitor API integration
    # For now, return structure that would be populated by real API
    
    return {
        "drought_level": DroughtLevel.NONE,
        "severity_numeric": 0,  # 0=None, 1=D0, 2=D1, 3=D2, 4=D3, 5=D4
        "description": "No drought conditions reported",
        "last_updated": date.today().isoformat(),
        "source": "US Drought Monitor (placeholder)",
        "url": "https://droughtmonitor.unl.edu/",
        "status": "placeholder",  # "placeholder" or "live"
    }


def get_climate_hub_for_location(state: Optional[str], us_region: Optional[str] = None) -> Optional[Dict[str, str]]:
    """
    Get USDA Climate Hub information for a location.
    
    Args:
        state: US state name
        us_region: US region name (for fallback)
    
    Returns:
        Dict with climate hub info or None
    """
    hub = None
    
    # Try state first
    if state:
        hub = STATE_TO_HUB.get(state)
    
    # Fallback to region-based guess
    if not hub and us_region:
        region_to_hub = {
            "Northeast": ClimateHub.NORTHEAST,
            "Southeast": ClimateHub.SOUTHEAST,
            "Midwest": ClimateHub.MIDWEST,
            "South": ClimateHub.SOUTHEAST,
            "West": ClimateHub.SOUTHWEST,
        }
        hub = region_to_hub.get(us_region)
    
    if not hub:
        return None
    
    return {
        "name": hub.value,
        "url": CLIMATE_HUB_URLS[hub],
        "description": f"USDA {hub.value} Climate Hub - Regional climate adaptation resources",
    }


def generate_drought_adapted_recommendations(drought_level: DroughtLevel, severity: int) -> str:
    """
    Generate gardening recommendations based on current drought status.
    
    Args:
        drought_level: Current drought classification
        severity: Numeric severity (0-5)
    
    Returns:
        Formatted recommendations
    """
    if severity == 0:
        return ""
    
    recommendations = f"\n🌵 Drought Status: {drought_level.value}\n\n"
    recommendations += "Drought-Adapted Recommendations:\n"
    
    if severity >= 1:  # D0 - Abnormally Dry
        recommendations += "- Monitor soil moisture closely\n"
        recommendations += "- Apply mulch to reduce evaporation (3-4 inches)\n"
        recommendations += "- Consider drought-tolerant varieties for new plantings\n"
    
    if severity >= 2:  # D1 - Moderate Drought
        recommendations += "- Prioritize watering established crops over new plantings\n"
        recommendations += "- Water deeply but less frequently to encourage deep roots\n"
        recommendations += "- Delay planting of water-intensive crops\n"
        recommendations += "- Install drip irrigation or soaker hoses for efficiency\n"
    
    if severity >= 3:  # D2 - Severe Drought
        recommendations += "- ⚠️ Focus on preserving mature plants only\n"
        recommendations += "- Consider removing struggling annual crops\n"
        recommendations += "- Harvest early before plants are severely stressed\n"
        recommendations += "- Use greywater if legally permitted in your area\n"
    
    if severity >= 4:  # D3 - Extreme Drought
        recommendations += "- 🚨 Consider suspending most gardening activities\n"
        recommendations += "- Protect perennials and fruit trees as priority\n"
        recommendations += "- Check local water restrictions and comply strictly\n"
        recommendations += "- Plan for drought-resilient varieties next season\n"
    
    if severity >= 5:  # D4 - Exceptional Drought
        recommendations += "- ⛔ Water restrictions likely in effect\n"
        recommendations += "- Focus on survival watering of trees/perennials only\n"
        recommendations += "- Do not plant new crops until conditions improve\n"
        recommendations += "- Review xeriscaping and desert gardening techniques\n"
    
    recommendations += "\nDrought Resources:\n"
    recommendations += "- US Drought Monitor: https://droughtmonitor.unl.edu/\n"
    recommendations += "- Local Extension Office: http://cce.cornell.edu/localoffices\n"
    recommendations += "- Water Conservation Tips: https://www.epa.gov/watersense\n"
    
    return recommendations


def generate_climate_hub_section(hub_info: Optional[Dict[str, str]], state: Optional[str]) -> str:
    """
    Generate climate hub resources section for plan.
    
    Args:
        hub_info: Climate hub information dict
        state: State name
    
    Returns:
        Formatted section
    """
    if not hub_info:
        return ""
    
    section = f"\n📍 Your Regional Climate Hub: {hub_info['name']}\n\n"
    section += f"{hub_info['description']}\n\n"
    section += "Regional Resources:\n"
    section += f"- Climate Hub Portal: {hub_info['url']}\n"
    section += "- Regional climate change impacts and adaptation strategies\n"
    section += "- Crop-specific guidance for your area\n"
    section += "- Extreme weather preparation resources\n"
    section += "- Connection to local research and extension\n"
    
    if state:
        section += f"\nState Resources:\n"
        section += f"- {state} Extension Office: http://cce.cornell.edu/localoffices\n"
        section += f"- {state} Climate Assessment: Search at https://nysclimateimpacts.org/ (if available)\n"
    
    return section


def enhance_hardiness_zone_info(zone: str, min_temp_c: float) -> str:
    """
    Generate detailed hardiness zone information.
    
    Args:
        zone: USDA zone (e.g., "6b")
        min_temp_c: Minimum temperature in Celsius
    
    Returns:
        Formatted zone information
    """
    min_temp_f = (min_temp_c * 9/5) + 32
    
    info = f"USDA Hardiness Zone: {zone}\n"
    info += f"Average Annual Extreme Minimum: {min_temp_c:.1f}°C ({min_temp_f:.1f}°F)\n\n"
    info += "What this means:\n"
    info += f"- Perennial plants rated for zone {zone} or lower will typically survive winter\n"
    info += "- This zone is based on 30-year average extreme minimum temperatures\n"
    info += "- Individual winters may be colder or warmer than average\n"
    info += "- Microclimates in your garden may vary by 1-2 zones\n\n"
    info += "Official USDA Zone Map: https://planthardiness.ars.usda.gov/\n"
    
    return info
