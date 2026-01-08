"""
Regional resources and coastal/flood risk assessment module.
Provides location-specific tools and risk information.

Phase 3 Features:
- Coastal flooding and sea level rise risk
- FEMA flood zone information
- State-specific climate assessments
- Regional tool ecosystem links
"""

from typing import Optional, Dict, Any, List
from enum import Enum


class CoastalRisk(str, Enum):
    """Coastal flooding risk levels"""
    NONE = "No Coastal Risk"
    LOW = "Low Risk (>10 miles from coast)"
    MODERATE = "Moderate Risk (5-10 miles from coast)"
    HIGH = "High Risk (1-5 miles from coast)"
    IMMEDIATE = "Immediate Risk (<1 mile from coast)"


class FloodZone(str, Enum):
    """FEMA flood zone classifications (simplified)"""
    NONE = "Minimal Risk (Zone X)"
    MODERATE = "Moderate Risk (Zone B/C/Shaded X)"
    HIGH = "High Risk (Zone A)"
    VERY_HIGH = "Very High Risk (Zone V - Coastal)"


# State climate assessment resources
STATE_CLIMATE_ASSESSMENTS = {
    "New York": {
        "name": "New York State Climate Impacts Assessment",
        "url": "https://nysclimateimpacts.org/",
        "agriculture_chapter": "https://nysclimateimpacts.org/wp-content/uploads/2024/02/Assessment-ch3-agriculture-01-31-24.pdf",
        "year": 2024,
        "key_findings": [
            "Growing season extended by 2-3 weeks since 1970",
            "Average annual temperature increased 2.4°F since 1970",
            "More intense precipitation events",
            "Earlier spring onset affecting frost dates",
            "Increased pest and disease pressure",
        ],
        "recommendations": [
            "Select crop varieties adapted to warmer, wetter conditions",
            "Implement improved drainage systems",
            "Plan for earlier planting and extended fall season",
            "Monitor for new pests and diseases migrating north",
            "Invest in irrigation for summer dry spells despite increased annual rainfall",
        ],
    },
    "California": {
        "name": "California Climate Assessment",
        "url": "https://www.energy.ca.gov/programs-and-topics/programs/climate-assessment",
        "year": 2018,
        "key_findings": [
            "Increased drought frequency and intensity",
            "More variable precipitation patterns",
            "Rising temperatures affecting crop suitability",
            "Extended fire season",
            "Water supply challenges",
        ],
        "recommendations": [
            "Prioritize water-efficient crops and irrigation",
            "Select drought-tolerant and heat-adapted varieties",
            "Implement water conservation strategies",
            "Prepare for increased wildfire smoke impacts",
            "Diversify crop selection for resilience",
        ],
    },
    # Additional states can be added as data becomes available
}

# Regional tool ecosystem
REGIONAL_TOOLS = {
    "Northeast": {
        "NRCC": {
            "name": "Northeast Regional Climate Center",
            "url": "https://www.nrcc.cornell.edu/",
            "description": "Weather data, climate tools, and regional analysis",
            "tools": ["Applied Climate Information System (ACIS)", "Moisture maps", "Growing degree days"],
        },
        "CSF": {
            "name": "Cornell Climate Smart Farming",
            "url": "https://climatesmartfarming.org/",
            "description": "Agriculture-focused climate tools",
            "tools": ["Water deficit calculator", "Cover crop scheduler", "Climate change visualization"],
        },
    },
    "West": {
        "WSU": {
            "name": "WSU Ag Climate Change Tools",
            "url": "http://agclimatechangetools.cahnrs.wsu.edu/",
            "description": "Agricultural climate adaptation tools for Pacific Northwest",
            "tools": ["Decision support tools", "Climate projections", "Crop modeling"],
        },
        "Climate Toolbox": {
            "name": "Climate Toolbox",
            "url": "https://climatetoolbox.org/",
            "description": "Future climate dashboard for Western US",
            "tools": ["Future climate scenarios", "Historical trends", "Seasonal forecasts"],
        },
    },
    "Midwest": {
        "Useful to Usable (U2U)": {
            "name": "Useful to Usable",
            "url": "http://mygeohub.org/groups/u2u",
            "description": "Climate forecasts and agronomic decision support",
            "tools": ["Seasonal climate forecasts", "Management strategies", "Decision calendars"],
        },
    },
    "Southeast": {
        "SERCC": {
            "name": "Southeast Regional Climate Center",
            "url": "https://sercc.com/",
            "description": "Climate data and information for Southeast US",
            "tools": ["Climate data", "Drought monitoring", "Agricultural weather"],
        },
    },
}


def assess_coastal_risk(lat: float, lon: float, elevation_m: Optional[float] = None) -> Dict[str, Any]:
    """
    Assess coastal flooding and sea level rise risk.
    
    NOTE: This is a simplified placeholder. Production should integrate:
    - NOAA Sea Level Rise Viewer API: https://coast.noaa.gov/slr/
    - Distance-to-coast calculation
    - Elevation data
    
    Args:
        lat: Latitude
        lon: Longitude
        elevation_m: Elevation in meters (if known)
    
    Returns:
        Dict with coastal risk assessment
    """
    # TODO: Implement actual coastal risk API integration
    # For now, rough heuristic based on location
    
    # Simplified: Check if in coastal states
    coastal_latitudes = [
        (24, 31, -85, -75),  # Florida/Southeast coast
        (31, 40, -80, -71),  # Mid-Atlantic
        (40, 45, -75, -68),  # Northeast coast
        (47, 49, -125, -122), # Pacific Northwest
        (32, 42, -125, -117), # California coast
    ]
    
    is_coastal = any(
        lat_min <= lat <= lat_max and lon_min <= lon <= lon_max
        for lat_min, lat_max, lon_min, lon_max in coastal_latitudes
    )
    
    if not is_coastal:
        return {
            "risk_level": CoastalRisk.NONE,
            "description": "Not in coastal area",
            "recommendations": [],
            "resources": [],
        }
    
    # If coastal, assume moderate risk for now
    return {
        "risk_level": CoastalRisk.MODERATE,
        "description": "Located in coastal region - may be affected by sea level rise and storm surge",
        "recommendations": [
            "Consider raised beds or containers for flexibility",
            "Monitor NOAA sea level rise projections for your area",
            "Check local flood maps",
            "Prepare for increased coastal storm intensity",
        ],
        "resources": [
            "NOAA Sea Level Rise Viewer: https://coast.noaa.gov/slr/",
            "FEMA Flood Map Service: https://msc.fema.gov/portal/home",
        ],
        "status": "placeholder",
    }


def get_flood_zone(lat: float, lon: float) -> Dict[str, Any]:
    """
    Get FEMA flood zone information for location.
    
    NOTE: This is a placeholder. Production should use:
    - FEMA Map Service Center API
    - Specific flood zone lookup by coordinates
    
    Args:
        lat: Latitude
        lon: Longitude
    
    Returns:
        Dict with flood zone info
    """
    # TODO: Implement actual FEMA API integration
    return {
        "zone": FloodZone.NONE,
        "description": "Minimal flood risk (preliminary assessment)",
        "recommendations": [],
        "url": "https://msc.fema.gov/portal/home",
        "status": "placeholder",
    }


def get_state_climate_assessment(state: Optional[str]) -> Optional[Dict[str, Any]]:
    """
    Get state-specific climate assessment information.
    
    Args:
        state: US state name
    
    Returns:
        State assessment dict or None
    """
    return STATE_CLIMATE_ASSESSMENTS.get(state)


def get_regional_tools(us_region: Optional[str]) -> Optional[Dict[str, Dict]]:
    """
    Get regional tool ecosystem for a location.
    
    Args:
        us_region: US region name
    
    Returns:
        Dict of regional tools or None
    """
    return REGIONAL_TOOLS.get(us_region)


def generate_coastal_risk_section(lat: float, lon: float) -> str:
    """
    Generate coastal risk assessment section.
    
    Args:
        lat: Latitude
        lon: Longitude
    
    Returns:
        Formatted section
    """
    risk = assess_coastal_risk(lat, lon)
    
    if risk["risk_level"] == CoastalRisk.NONE:
        return ""  # Don't show section if no risk
    
    section = f"\n🌊 Coastal Flood Risk Assessment\n\n"
    section += f"Risk Level: {risk['risk_level'].value}\n"
    section += f"{risk['description']}\n\n"
    
    if risk["recommendations"]:
        section += "Recommended Actions:\n"
        for rec in risk["recommendations"]:
            section += f"  • {rec}\n"
        section += "\n"
    
    if risk["resources"]:
        section += "Resources:\n"
        for resource in risk["resources"]:
            section += f"  • {resource}\n"
        section += "\n"
    
    if risk.get("status") == "placeholder":
        section += "**Note:** This is a preliminary assessment. Check detailed maps for your specific location.\n"
    
    return section


def generate_state_assessment_section(state: Optional[str]) -> str:
    """
    Generate state climate assessment section.
    
    Args:
        state: State name
    
    Returns:
        Formatted section
    """
    assessment = get_state_climate_assessment(state)
    
    if not assessment:
        return ""
    
    section = f"\n📊 {state} Climate Assessment Highlights\n\n"
    section += f"Source: {assessment['name']} ({assessment['year']})\n"
    section += f"URL: {assessment['url']}\n\n"
    
    if assessment.get("key_findings"):
        section += "Key Findings for Agriculture:\n"
        for finding in assessment["key_findings"]:
            section += f"  • {finding}\n"
        section += "\n"
    
    if assessment.get("recommendations"):
        section += "State-Specific Recommendations:\n"
        for i, rec in enumerate(assessment["recommendations"], 1):
            section += f"  {i}. {rec}\n"
        section += "\n"
    
    if assessment.get("agriculture_chapter"):
        section += f"Full Agriculture Chapter: {assessment['agriculture_chapter']}\n\n"
    
    return section


def generate_regional_tools_section(us_region: Optional[str]) -> str:
    """
    Generate regional tools and resources section.
    
    Args:
        us_region: US region name
    
    Returns:
        Formatted section
    """
    tools = get_regional_tools(us_region)
    
    if not tools:
        return ""
    
    section = f"\n🔧 Regional Climate Tools for {us_region}\n\n"
    section += "Specialized tools and resources for your region:\n\n"
    
    for tool_key, tool_info in tools.items():
        section += f"**{tool_info['name']}**\n"
        section += f"  {tool_info['description']}\n"
        section += f"  URL: {tool_info['url']}\n"
        
        if tool_info.get("tools"):
            section += f"  Available Tools: {', '.join(tool_info['tools'])}\n"
        
        section += "\n"
    
    return section


def generate_comprehensive_resources_section(
    lat: float,
    lon: float,
    state: Optional[str],
    us_region: Optional[str]
) -> str:
    """
    Generate comprehensive regional resources section combining all Phase 3 features.
    
    Args:
        lat: Latitude
        lon: Longitude
        state: State name
        us_region: US region name
    
    Returns:
        Formatted comprehensive section
    """
    sections = []
    
    # State assessment
    state_section = generate_state_assessment_section(state)
    if state_section:
        sections.append(state_section)
    
    # Regional tools
    tools_section = generate_regional_tools_section(us_region)
    if tools_section:
        sections.append(tools_section)
    
    # Coastal risk (if applicable)
    coastal_section = generate_coastal_risk_section(lat, lon)
    if coastal_section:
        sections.append(coastal_section)
    
    if not sections:
        return ""
    
    return "\n".join(sections)
