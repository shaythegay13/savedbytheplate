"""
Water deficit and irrigation management module.
Based on Cornell Climate Smart Farming Water Deficit Calculator methodology:
https://climatesmartfarming.org/tools/csf-water-deficit-calculator/

Uses water balance model: Precipitation - ET - Runoff - Drainage = Soil Water Content
"""

from typing import List, Dict, Any, Optional, Tuple
from datetime import date, timedelta
from enum import Enum
import math


class SoilType(str, Enum):
    """Soil water holding capacity levels"""
    HIGH = "High (Clay, fine textured)"
    MEDIUM = "Medium (Loam, mixed)"
    LOW = "Low (Sand, coarse)"


class CropWaterUse(str, Enum):
    """Crop types with different evapotranspiration coefficients"""
    GRASS_REFERENCE = "Grass Reference"
    LEAFY_GREENS = "Leafy Greens"
    VEGETABLES = "Vegetables"
    TOMATOES_PEPPERS = "Tomatoes & Peppers"
    BEANS_PEAS = "Beans & Peas"
    ROOT_CROPS = "Root Crops"
    HERBS = "Herbs"


# Soil water capacity in inches per foot of soil depth
# Source: Cornell CSF tool uses these standard ranges
SOIL_WATER_CAPACITY = {
    SoilType.HIGH: 2.5,      # Clay: ~2.0-3.0 inches/foot
    SoilType.MEDIUM: 1.75,   # Loam: ~1.5-2.0 inches/foot
    SoilType.LOW: 0.75,      # Sand: ~0.5-1.0 inches/foot
}

# Field capacity as percentage of water holding capacity
# Optimal soil moisture = field capacity
FIELD_CAPACITY = 1.0  # 100% of available water

# Crop coefficients (Kc) for ET calculation
# These adjust reference ET based on crop type
CROP_COEFFICIENTS = {
    CropWaterUse.GRASS_REFERENCE: 1.0,
    CropWaterUse.LEAFY_GREENS: 0.7,
    CropWaterUse.VEGETABLES: 0.85,
    CropWaterUse.TOMATOES_PEPPERS: 1.05,
    CropWaterUse.BEANS_PEAS: 0.95,
    CropWaterUse.ROOT_CROPS: 0.8,
    CropWaterUse.HERBS: 0.6,
}

# Stress thresholds (water deficit as % of capacity)
STRESS_THRESHOLDS = {
    "optimal": 0.0,      # 0% deficit = at field capacity
    "slight": 0.25,      # 25% deficit
    "moderate": 0.50,    # 50% deficit
    "severe": 0.75,      # 75% deficit
}


def estimate_reference_et_hargreaves(
    temp_high_c: float,
    temp_low_c: float,
    latitude: float,
    day_of_year: int
) -> float:
    """
    Estimate reference evapotranspiration using Hargreaves-Samani equation.
    
    This temperature-based method works when only temperature data is available.
    More accurate than Thornthwaite, suitable for daily estimates.
    
    Args:
        temp_high_c: Daily maximum temperature (Celsius)
        temp_low_c: Daily minimum temperature (Celsius)
        latitude: Location latitude in degrees
        day_of_year: Day of year (1-365)
    
    Returns:
        Reference ET in mm/day
    """
    # Temperature difference and average
    temp_range = temp_high_c - temp_low_c
    temp_avg = (temp_high_c + temp_low_c) / 2.0
    
    # Extraterrestrial radiation (Ra) calculation
    # Solar declination
    dec = 0.409 * math.sin((2 * math.pi / 365) * day_of_year - 1.39)
    
    # Convert latitude to radians
    lat_rad = latitude * math.pi / 180
    
    # Sunset hour angle
    ws = math.acos(-math.tan(lat_rad) * math.tan(dec))
    
    # Inverse relative distance Earth-Sun
    dr = 1 + 0.033 * math.cos(2 * math.pi / 365 * day_of_year)
    
    # Extraterrestrial radiation (MJ/m²/day)
    Ra = (24 * 60 / math.pi) * 0.0820 * dr * (
        ws * math.sin(lat_rad) * math.sin(dec) +
        math.cos(lat_rad) * math.cos(dec) * math.sin(ws)
    )
    
    # Hargreaves equation: ET0 = 0.0023 * Ra * (Tavg + 17.8) * sqrt(Tmax - Tmin)
    if temp_range < 0:
        temp_range = 0
    
    et0_mm = 0.0023 * Ra * (temp_avg + 17.8) * math.sqrt(temp_range)
    
    # Convert from mm to inches for consistency with soil capacity
    et0_inches = et0_mm / 25.4
    
    return max(0, et0_inches)


def calculate_crop_et(reference_et: float, crop_type: CropWaterUse, growth_stage: float = 1.0) -> float:
    """
    Calculate crop-specific ET using crop coefficient.
    
    Args:
        reference_et: Reference ET (inches/day)
        crop_type: Crop water use category
        growth_stage: Growth stage multiplier (0.5 = early, 1.0 = mid, 0.8 = late)
    
    Returns:
        Crop ET in inches/day
    """
    kc = CROP_COEFFICIENTS.get(crop_type, 1.0)
    return reference_et * kc * growth_stage


def calculate_water_balance(
    initial_water: float,
    precipitation: float,
    et: float,
    irrigation: float = 0.0,
    soil_capacity: float = 2.0,
    root_depth_feet: float = 1.0
) -> Tuple[float, float, float]:
    """
    Calculate daily water balance for root zone.
    
    Following Cornell CSF methodology:
    - Water balance tracks soil moisture in effective root zone
    - Drainage occurs when water exceeds field capacity
    - Runoff approximated as portion of heavy rain events
    
    Args:
        initial_water: Starting soil water content (inches in root zone)
        precipitation: Daily rainfall (inches)
        et: Daily evapotranspiration (inches)
        irrigation: Applied irrigation (inches)
        soil_capacity: Soil water holding capacity (inches/foot)
        root_depth_feet: Effective root depth (feet, typically 1.0)
    
    Returns:
        Tuple of (new_water_content, drainage, runoff) in inches
    """
    max_capacity = soil_capacity * root_depth_feet
    
    # Simple runoff approximation: heavy rain events (>2 inches) lose 25%
    runoff = 0.0
    effective_precip = precipitation
    if precipitation > 2.0:
        runoff = precipitation * 0.25
        effective_precip = precipitation - runoff
    
    # Water balance
    new_water = initial_water + effective_precip + irrigation - et
    
    # Drainage if exceeds field capacity
    drainage = 0.0
    if new_water > max_capacity:
        drainage = new_water - max_capacity
        new_water = max_capacity
    
    # Cannot go below zero
    new_water = max(0, new_water)
    
    return new_water, drainage, runoff


def calculate_water_deficit(current_water: float, soil_capacity: float, root_depth: float = 1.0) -> float:
    """
    Calculate water deficit as amount needed to reach field capacity.
    
    Args:
        current_water: Current soil water content (inches)
        soil_capacity: Soil water holding capacity (inches/foot)
        root_depth: Root depth (feet)
    
    Returns:
        Water deficit in inches
    """
    field_cap = soil_capacity * root_depth * FIELD_CAPACITY
    deficit = field_cap - current_water
    return max(0, deficit)


def get_stress_level(water_deficit: float, soil_capacity: float) -> str:
    """
    Determine plant stress level based on water deficit.
    
    Args:
        water_deficit: Current water deficit (inches)
        soil_capacity: Soil water holding capacity (inches/foot)
    
    Returns:
        Stress level: "optimal", "slight", "moderate", or "severe"
    """
    deficit_fraction = water_deficit / soil_capacity
    
    if deficit_fraction <= STRESS_THRESHOLDS["optimal"] + 0.1:
        return "optimal"
    elif deficit_fraction <= STRESS_THRESHOLDS["slight"]:
        return "slight"
    elif deficit_fraction <= STRESS_THRESHOLDS["moderate"]:
        return "moderate"
    else:
        return "severe"


def simulate_water_deficit(
    daily_highs_c: List[float],
    daily_lows_c: List[float],
    daily_precip_mm: List[float],
    latitude: float,
    start_date: date,
    soil_type: SoilType,
    crop_type: CropWaterUse,
    initial_irrigation: float = 0.0
) -> List[Dict[str, Any]]:
    """
    Simulate water balance and deficit for a period.
    
    Args:
        daily_highs_c: Daily high temperatures (Celsius)
        daily_lows_c: Daily low temperatures (Celsius)
        daily_precip_mm: Daily precipitation (mm)
        latitude: Location latitude
        start_date: Starting date
        soil_type: Soil classification
        crop_type: Crop water use category
        initial_irrigation: Optional starting irrigation amount
    
    Returns:
        List of daily water balance records
    """
    capacity = SOIL_WATER_CAPACITY[soil_type]
    
    # Initialize at field capacity
    current_water = capacity * FIELD_CAPACITY
    if initial_irrigation > 0:
        current_water = min(current_water + initial_irrigation, capacity)
    
    results = []
    
    for i, (high, low, precip_mm) in enumerate(zip(daily_highs_c, daily_lows_c, daily_precip_mm)):
        current_date = start_date + timedelta(days=i)
        day_of_year = current_date.timetuple().tm_yday
        
        # Calculate ET
        ref_et = estimate_reference_et_hargreaves(high, low, latitude, day_of_year)
        crop_et = calculate_crop_et(ref_et, crop_type)
        
        # Convert precipitation to inches
        precip_inches = precip_mm / 25.4
        
        # Water balance
        new_water, drainage, runoff = calculate_water_balance(
            current_water, precip_inches, crop_et, 0.0, capacity
        )
        
        # Calculate deficit
        deficit = calculate_water_deficit(new_water, capacity)
        stress = get_stress_level(deficit, capacity)
        
        results.append({
            "date": current_date.isoformat(),
            "water_content_inches": round(new_water, 3),
            "water_deficit_inches": round(deficit, 3),
            "precipitation_inches": round(precip_inches, 3),
            "et_inches": round(crop_et, 3),
            "drainage_inches": round(drainage, 3),
            "runoff_inches": round(runoff, 3),
            "stress_level": stress,
        })
        
        current_water = new_water
    
    return results


def generate_irrigation_recommendation(water_balance_results: List[Dict[str, Any]]) -> str:
    """
    Generate irrigation recommendations based on water balance analysis.
    
    Args:
        water_balance_results: Output from simulate_water_deficit()
    
    Returns:
        Human-readable irrigation guidance
    """
    if not water_balance_results:
        return "Insufficient data for irrigation recommendations."
    
    latest = water_balance_results[-1]
    deficit = latest["water_deficit_inches"]
    stress = latest["stress_level"]
    
    # Calculate average deficit over period
    avg_deficit = sum(r["water_deficit_inches"] for r in water_balance_results) / len(water_balance_results)
    
    # Check trend
    recent_deficits = [r["water_deficit_inches"] for r in water_balance_results[-3:]]
    increasing_trend = len(recent_deficits) >= 2 and recent_deficits[-1] > recent_deficits[0]
    
    recommendation = f"Current Water Status:\n"
    recommendation += f"- Water Deficit: {deficit:.2f} inches\n"
    recommendation += f"- Stress Level: {stress.title()}\n"
    recommendation += f"- 7-day Average Deficit: {avg_deficit:.2f} inches\n\n"
    
    if stress == "optimal":
        recommendation += "✓ Soil moisture is optimal. No irrigation needed at this time.\n"
        recommendation += "Monitor for changes in weather and crop water demand."
    elif stress == "slight":
        if increasing_trend:
            recommendation += "⚠ Light irrigation recommended within 1-2 days.\n"
            recommendation += f"Apply approximately {deficit:.2f} inches to return to field capacity.\n"
        else:
            recommendation += "Monitor closely. Consider light irrigation if dry conditions persist."
    elif stress == "moderate":
        recommendation += "⚠ Irrigation needed soon to prevent yield impacts.\n"
        recommendation += f"Apply {deficit:.2f} inches to restore optimal moisture.\n"
        recommendation += "Water deeply to encourage root development."
    else:  # severe
        recommendation += "🚨 URGENT: Severe water stress detected!\n"
        recommendation += f"Irrigate immediately with {deficit:.2f} inches.\n"
        recommendation += "Split into 2-3 applications if amount is >1 inch to prevent runoff.\n"
        recommendation += "Water early morning or evening to minimize evaporation."
    
    return recommendation
