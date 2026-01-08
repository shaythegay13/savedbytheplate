"""
Yield estimation module for garden crops.
Provides realistic harvest predictions based on space, conditions, and experience.

v3.1 Feature: Formula-based yield calculations
"""

from typing import Dict, Optional, Tuple
from enum import Enum
from .models import SpaceSize, Sunlight, Experience


class YieldUnit(str, Enum):
    """Units for yield measurements"""
    POUNDS = "lbs"
    KILOGRAMS = "kg"
    PIECES = "pieces"
    BUNCHES = "bunches"


# Base yield data per crop (optimized conditions per 4x8 bed or equivalent 32 sq ft)
CROP_YIELD_DATA = {
    "tomatoes": {
        "base_yield": 60,
        "unit": YieldUnit.POUNDS,
        "yield_per_sqft": 1.8,
        "days_to_harvest": 70,
        "harvest_period_weeks": 8,
        "sunlight_requirement": 0.9,  # needs 90% optimal sun
    },
    "cherry tomatoes": {
        "base_yield": 80,
        "unit": YieldUnit.POUNDS,
        "yield_per_sqft": 2.5,
        "days_to_harvest": 65,
        "harvest_period_weeks": 10,
        "sunlight_requirement": 0.9,
    },
    "lettuce": {
        "base_yield": 16,
        "unit": YieldUnit.POUNDS,
        "yield_per_sqft": 0.5,
        "days_to_harvest": 45,
        "harvest_period_weeks": 4,
        "sunlight_requirement": 0.6,  # can tolerate partial shade
    },
    "basil": {
        "base_yield": 4,
        "unit": YieldUnit.POUNDS,
        "yield_per_sqft": 0.125,
        "days_to_harvest": 60,
        "harvest_period_weeks": 12,
        "sunlight_requirement": 0.8,
    },
    "peppers": {
        "base_yield": 40,
        "unit": YieldUnit.POUNDS,
        "yield_per_sqft": 1.25,
        "days_to_harvest": 75,
        "harvest_period_weeks": 8,
        "sunlight_requirement": 0.9,
    },
    "beans": {
        "base_yield": 25,
        "unit": YieldUnit.POUNDS,
        "yield_per_sqft": 0.8,
        "days_to_harvest": 55,
        "harvest_period_weeks": 3,
        "sunlight_requirement": 0.8,
    },
    "peas": {
        "base_yield": 20,
        "unit": YieldUnit.POUNDS,
        "yield_per_sqft": 0.6,
        "days_to_harvest": 60,
        "harvest_period_weeks": 3,
        "sunlight_requirement": 0.7,
    },
    "carrots": {
        "base_yield": 30,
        "unit": YieldUnit.POUNDS,
        "yield_per_sqft": 0.9,
        "days_to_harvest": 70,
        "harvest_period_weeks": 2,
        "sunlight_requirement": 0.7,
    },
    "radishes": {
        "base_yield": 45,
        "unit": YieldUnit.BUNCHES,
        "yield_per_sqft": 1.4,
        "days_to_harvest": 25,
        "harvest_period_weeks": 1,
        "sunlight_requirement": 0.7,
    },
    "spinach": {
        "base_yield": 12,
        "unit": YieldUnit.POUNDS,
        "yield_per_sqft": 0.375,
        "days_to_harvest": 40,
        "harvest_period_weeks": 3,
        "sunlight_requirement": 0.6,
    },
    "kale": {
        "base_yield": 15,
        "unit": YieldUnit.POUNDS,
        "yield_per_sqft": 0.47,
        "days_to_harvest": 55,
        "harvest_period_weeks": 12,
        "sunlight_requirement": 0.7,
    },
    "cucumbers": {
        "base_yield": 50,
        "unit": YieldUnit.POUNDS,
        "yield_per_sqft": 1.5,
        "days_to_harvest": 60,
        "harvest_period_weeks": 6,
        "sunlight_requirement": 0.9,
    },
    "squash": {
        "base_yield": 40,
        "unit": YieldUnit.POUNDS,
        "yield_per_sqft": 1.25,
        "days_to_harvest": 50,
        "harvest_period_weeks": 8,
        "sunlight_requirement": 0.9,
    },
    "zucchini": {
        "base_yield": 50,
        "unit": YieldUnit.POUNDS,
        "yield_per_sqft": 1.5,
        "days_to_harvest": 45,
        "harvest_period_weeks": 8,
        "sunlight_requirement": 0.9,
    },
    "broccoli": {
        "base_yield": 20,
        "unit": YieldUnit.POUNDS,
        "yield_per_sqft": 0.6,
        "days_to_harvest": 85,
        "harvest_period_weeks": 2,
        "sunlight_requirement": 0.8,
    },
    "cabbage": {
        "base_yield": 35,
        "unit": YieldUnit.POUNDS,
        "yield_per_sqft": 1.1,
        "days_to_harvest": 90,
        "harvest_period_weeks": 3,
        "sunlight_requirement": 0.8,
    },
    "onions": {
        "base_yield": 25,
        "unit": YieldUnit.POUNDS,
        "yield_per_sqft": 0.8,
        "days_to_harvest": 100,
        "harvest_period_weeks": 2,
        "sunlight_requirement": 0.8,
    },
    "garlic": {
        "base_yield": 15,
        "unit": YieldUnit.POUNDS,
        "yield_per_sqft": 0.47,
        "days_to_harvest": 240,
        "harvest_period_weeks": 2,
        "sunlight_requirement": 0.8,
    },
    "beets": {
        "base_yield": 30,
        "unit": YieldUnit.POUNDS,
        "yield_per_sqft": 0.9,
        "days_to_harvest": 60,
        "harvest_period_weeks": 2,
        "sunlight_requirement": 0.7,
    },
    "swiss chard": {
        "base_yield": 18,
        "unit": YieldUnit.POUNDS,
        "yield_per_sqft": 0.56,
        "days_to_harvest": 50,
        "harvest_period_weeks": 12,
        "sunlight_requirement": 0.7,
    },
    "arugula": {
        "base_yield": 10,
        "unit": YieldUnit.POUNDS,
        "yield_per_sqft": 0.3,
        "days_to_harvest": 35,
        "harvest_period_weeks": 4,
        "sunlight_requirement": 0.6,
    },
    "cilantro": {
        "base_yield": 3,
        "unit": YieldUnit.POUNDS,
        "yield_per_sqft": 0.09,
        "days_to_harvest": 45,
        "harvest_period_weeks": 6,
        "sunlight_requirement": 0.7,
    },
    "parsley": {
        "base_yield": 4,
        "unit": YieldUnit.POUNDS,
        "yield_per_sqft": 0.125,
        "days_to_harvest": 70,
        "harvest_period_weeks": 12,
        "sunlight_requirement": 0.6,
    },
}


def get_space_multiplier(space_size: SpaceSize) -> float:
    """
    Get yield multiplier based on garden size.
    
    Args:
        space_size: Size classification
    
    Returns:
        Multiplier (base is for Medium = 100-300 sqft)
    """
    multipliers = {
        SpaceSize.SMALL: 0.3,      # ~30-100 sqft
        SpaceSize.MEDIUM: 1.0,     # 100-300 sqft (baseline 32 sqft bed)
        SpaceSize.LARGE: 2.5,      # 300-600 sqft
        SpaceSize.VERY_LARGE: 5.0, # 600+ sqft
    }
    return multipliers.get(space_size, 1.0)


def get_sunlight_factor(crop_data: Dict, sunlight: Sunlight) -> float:
    """
    Calculate yield reduction based on sunlight availability.
    
    Args:
        crop_data: Crop yield data with sunlight_requirement
        sunlight: Available sunlight
    
    Returns:
        Yield factor (0.0 to 1.0)
    """
    # Map sunlight levels to percentage of optimal
    sunlight_map = {
        Sunlight.FULL_SUN: 1.0,
        Sunlight.PARTIAL_SUN: 0.75,
        Sunlight.PARTIAL_SHADE: 0.5,
        Sunlight.SHADE: 0.3,
        Sunlight.ARTIFICIAL_ONLY: 0.6,  # Can be good with proper setup
    }
    
    available = sunlight_map.get(sunlight, 0.7)
    required = crop_data.get("sunlight_requirement", 0.7)
    
    # If available sunlight meets or exceeds requirement, full yield
    if available >= required:
        return 1.0
    
    # Otherwise, proportional reduction
    return available / required


def get_experience_factor(experience: Experience) -> float:
    """
    Adjust yield based on gardener experience.
    
    Args:
        experience: Experience level
    
    Returns:
        Yield factor (0.0 to 1.0)
    """
    factors = {
        Experience.BEGINNER: 0.6,      # 60% of optimal
        Experience.NOVICE: 0.75,       # 75% of optimal
        Experience.INTERMEDIATE: 0.9,  # 90% of optimal
        Experience.ADVANCED: 1.0,      # 100% of optimal
    }
    return factors.get(experience, 0.75)


def estimate_yield(
    crop: str,
    space_size: SpaceSize,
    sunlight: Sunlight,
    experience: Experience
) -> Optional[Dict]:
    """
    Estimate yield for a specific crop.
    
    Args:
        crop: Crop name
        space_size: Garden size
        sunlight: Available sunlight
        experience: Gardener experience
    
    Returns:
        Dict with yield estimates or None if crop not found
    """
    crop_lower = crop.lower()
    crop_data = None
    
    # Find matching crop data
    for key in CROP_YIELD_DATA:
        if key in crop_lower or crop_lower in key:
            crop_data = CROP_YIELD_DATA[key]
            break
    
    if not crop_data:
        return None
    
    # Calculate factors
    base_yield = crop_data["base_yield"]
    space_mult = get_space_multiplier(space_size)
    sun_factor = get_sunlight_factor(crop_data, sunlight)
    exp_factor = get_experience_factor(experience)
    
    # Calculate estimated yield
    estimated = base_yield * space_mult * sun_factor * exp_factor
    
    # Calculate range (±15%)
    low_estimate = estimated * 0.85
    high_estimate = estimated * 1.15
    
    return {
        "crop": crop,
        "estimated_yield": round(estimated, 1),
        "low_estimate": round(low_estimate, 1),
        "high_estimate": round(high_estimate, 1),
        "unit": crop_data["unit"].value,
        "days_to_harvest": crop_data["days_to_harvest"],
        "harvest_period_weeks": crop_data["harvest_period_weeks"],
        "factors": {
            "space": f"{space_mult:.1f}x",
            "sunlight": f"{sun_factor:.0%}",
            "experience": f"{exp_factor:.0%}",
        }
    }


def generate_yield_summary(
    crops: list,
    space_size: SpaceSize,
    sunlight: Sunlight,
    experience: Experience
) -> str:
    """
    Generate formatted yield summary for all crops.
    
    Args:
        crops: List of crop names
        space_size: Garden size
        sunlight: Available sunlight
        experience: Gardener experience
    
    Returns:
        Formatted yield summary
    """
    if not crops:
        return ""
    
    summary = "\n📊 Expected Harvest Yields\n\n"
    summary += "Realistic estimates based on your space, sunlight, and experience:\n\n"
    
    total_weight_lbs = 0
    
    for crop in crops:
        yield_est = estimate_yield(crop, space_size, sunlight, experience)
        if not yield_est:
            continue
        
        summary += f"**{crop.title()}**:\n"
        summary += f"  Estimated Yield: {yield_est['low_estimate']}-{yield_est['high_estimate']} {yield_est['unit']}\n"
        summary += f"  Days to First Harvest: {yield_est['days_to_harvest']} days\n"
        summary += f"  Harvest Period: {yield_est['harvest_period_weeks']} weeks\n"
        
        # Add to total if in pounds
        if yield_est['unit'] == YieldUnit.POUNDS.value:
            total_weight_lbs += yield_est['estimated_yield']
        
        summary += "\n"
    
    if total_weight_lbs > 0:
        summary += f"**Total Estimated Harvest**: ~{int(total_weight_lbs)} lbs of produce\n\n"
    
    # Add factors explanation
    summary += "**Yield Factors**:\n"
    summary += f"  • Space: {space_size.value}\n"
    summary += f"  • Sunlight: {sunlight.value}\n"
    summary += f"  • Experience: {experience.value}\n\n"
    
    summary += "**Tips to Maximize Yields**:\n"
    summary += "  • Ensure proper spacing for air circulation\n"
    summary += "  • Maintain consistent watering schedule\n"
    summary += "  • Feed plants regularly with balanced fertilizer\n"
    summary += "  • Harvest frequently to encourage production\n"
    summary += "  • Practice succession planting for continuous harvests\n"
    
    return summary


def get_crop_yield_data(crop: str) -> Optional[Dict]:
    """
    Get raw yield data for a crop.
    
    Args:
        crop: Crop name
    
    Returns:
        Yield data dict or None
    """
    crop_lower = crop.lower()
    for key in CROP_YIELD_DATA:
        if key in crop_lower or crop_lower in key:
            return CROP_YIELD_DATA[key].copy()
    return None
