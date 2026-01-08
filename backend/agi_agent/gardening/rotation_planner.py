"""
Multi-Year Crop Rotation Planning Module
Generates detailed 3-5 year rotation schedules based on crop families
"""

from typing import List, Dict, Optional
from .crop_families import CropFamily, CROP_FAMILIES


# Crop family rotation rules
ROTATION_RULES = {
    CropFamily.SOLANACEAE: {
        "wait_years": 3,  # Wait 3 years before planting in same spot
        "good_followers": [CropFamily.FABACEAE, CropFamily.BRASSICACEAE],
        "avoid_followers": [CropFamily.SOLANACEAE],
        "notes": "Heavy feeders, deplete nitrogen. Follow with legumes to restore soil."
    },
    CropFamily.BRASSICACEAE: {
        "wait_years": 2,
        "good_followers": [CropFamily.FABACEAE, CropFamily.SOLANACEAE],
        "avoid_followers": [CropFamily.BRASSICACEAE],
        "notes": "Susceptible to clubroot. Rotate to prevent disease buildup."
    },
    CropFamily.FABACEAE: {
        "wait_years": 3,
        "good_followers": [CropFamily.SOLANACEAE, CropFamily.CUCURBITACEAE, CropFamily.BRASSICACEAE],
        "avoid_followers": [CropFamily.FABACEAE],
        "notes": "Nitrogen fixers. Excellent before heavy feeders like tomatoes."
    },
    CropFamily.CUCURBITACEAE: {
        "wait_years": 3,
        "good_followers": [CropFamily.FABACEAE, CropFamily.BRASSICACEAE],
        "avoid_followers": [CropFamily.CUCURBITACEAE],
        "notes": "Heavy feeders. Follow with legumes or light feeders."
    },
    CropFamily.ALLIACEAE: {
        "wait_years": 2,
        "good_followers": [CropFamily.SOLANACEAE, CropFamily.BRASSICACEAE],
        "avoid_followers": [CropFamily.ALLIACEAE],
        "notes": "Light feeders. Good before heavy feeders."
    },
    CropFamily.APIACEAE: {
        "wait_years": 3,
        "good_followers": [CropFamily.FABACEAE, CropFamily.BRASSICACEAE],
        "avoid_followers": [CropFamily.APIACEAE],
        "notes": "Moderate feeders. Rotate to prevent carrot rust fly."
    },
    CropFamily.ASTERACEAE: {
        "wait_years": 2,
        "good_followers": [CropFamily.FABACEAE, CropFamily.BRASSICACEAE],
        "avoid_followers": [CropFamily.ASTERACEAE],
        "notes": "Light to moderate feeders."
    },
    CropFamily.CHENOPODIACEAE: {
        "wait_years": 2,
        "good_followers": [CropFamily.FABACEAE, CropFamily.SOLANACEAE],
        "avoid_followers": [CropFamily.CHENOPODIACEAE],
        "notes": "Moderate feeders. Tolerate poor soil."
    },
}


# Cover crop recommendations by season
COVER_CROPS = {
    "winter": [
        {"name": "Winter Rye", "family": CropFamily.POACEAE, "benefits": "Erosion control, weed suppression, biomass"},
        {"name": "Crimson Clover", "family": CropFamily.FABACEAE, "benefits": "Nitrogen fixation, pollinator support"},
        {"name": "Hairy Vetch", "family": CropFamily.FABACEAE, "benefits": "Nitrogen fixation, weed suppression"},
        {"name": "Field Peas", "family": CropFamily.FABACEAE, "benefits": "Nitrogen fixation, quick growth"},
    ],
    "summer": [
        {"name": "Buckwheat", "family": CropFamily.POLYGONACEAE, "benefits": "Fast growth, weed suppression, pollinator support"},
        {"name": "Cowpeas", "family": CropFamily.FABACEAE, "benefits": "Nitrogen fixation, heat tolerance"},
        {"name": "Sorghum-Sudangrass", "family": CropFamily.POACEAE, "benefits": "Biomass, deep roots, weed suppression"},
    ],
    "fall": [
        {"name": "Oats", "family": CropFamily.POACEAE, "benefits": "Quick growth, winter-kill mulch"},
        {"name": "Tillage Radish", "family": CropFamily.BRASSICACEAE, "benefits": "Deep taproot, compaction relief"},
        {"name": "Winter Wheat", "family": CropFamily.POACEAE, "benefits": "Erosion control, spring biomass"},
    ],
}


def get_crop_family(crop_name: str) -> Optional[CropFamily]:
    """Get the family for a given crop name"""
    crop_key = crop_name.lower().replace(" ", "_")
    return CROP_FAMILIES.get(crop_key)


def generate_rotation_plan(crops: List[str], years: int = 4) -> str:
    """
    Generate a multi-year crop rotation plan.
    
    Args:
        crops: List of crop names to rotate
        years: Number of years to plan (default 4)
    
    Returns:
        Formatted rotation plan
    """
    # Group crops by family
    family_crops = {}
    for crop in crops:
        family = get_crop_family(crop)
        if family:
            if family not in family_crops:
                family_crops[family] = []
            family_crops[family].append(crop)
    
    if not family_crops:
        return "\n\nCrop Rotation Plan:\nNo rotation plan available for selected crops.\n"
    
    plan = "\n\n" + "="*70 + "\n"
    plan += "MULTI-YEAR CROP ROTATION PLAN\n"
    plan += "="*70 + "\n\n"
    plan += "A good rotation prevents disease buildup, maintains soil health, and maximizes yields.\n\n"
    
    # Generate year-by-year rotation
    families = list(family_crops.keys())
    
    for year in range(1, years + 1):
        plan += f"**Year {year}:**\n"
        
        # Rotate families
        year_index = (year - 1) % len(families)
        
        for i, family in enumerate(families):
            rotated_index = (year_index + i) % len(families)
            rotated_family = families[rotated_index]
            
            # Get crops in this family
            crops_in_family = family_crops[rotated_family]
            crop_list = ", ".join(crops_in_family[:3])  # Show up to 3 crops
            
            plan += f"  • Bed {i+1}: {rotated_family.value} - {crop_list}\n"
        
        # Add cover crop recommendation
        if year < years:
            season = "winter" if year % 2 == 1 else "summer"
            cover_crop = COVER_CROPS[season][0]
            plan += f"  • After harvest: Plant {cover_crop['name']} ({cover_crop['benefits']})\n"
        
        plan += "\n"
    
    # Add rotation principles
    plan += "**Rotation Principles:**\n"
    plan += "1. Never plant the same family in the same spot for 2-3 years\n"
    plan += "2. Follow heavy feeders (tomatoes, squash) with nitrogen fixers (beans, peas)\n"
    plan += "3. Follow nitrogen fixers with heavy feeders\n"
    plan += "4. Use cover crops between seasons to improve soil health\n"
    plan += "5. Rotate to different families to prevent disease and pest buildup\n\n"
    
    # Add family-specific notes
    plan += "**Family-Specific Rotation Notes:**\n"
    for family in families:
        if family in ROTATION_RULES:
            rules = ROTATION_RULES[family]
            plan += f"• {family.value}: {rules['notes']}\n"
    
    plan += "\n"
    
    return plan


def generate_cover_crop_recommendations(current_crops: List[str], season: str = "winter") -> str:
    """
    Generate cover crop recommendations based on current crops and season.
    
    Args:
        current_crops: List of crops currently growing
        season: Season for cover crop (winter, summer, fall)
    
    Returns:
        Formatted cover crop recommendations
    """
    # Get families of current crops
    current_families = set()
    for crop in current_crops:
        family = get_crop_family(crop)
        if family:
            current_families.add(family)
    
    # Get cover crops for season
    season_covers = COVER_CROPS.get(season.lower(), COVER_CROPS["winter"])
    
    recommendations = "\n\n**Cover Crop Recommendations:**\n\n"
    recommendations += f"After harvesting your {season} crops, consider planting:\n\n"
    
    for cover in season_covers:
        # Check if cover crop family is different from current crops
        if cover["family"] not in current_families or cover["family"] == CropFamily.FABACEAE:
            recommendations += f"• **{cover['name']}** ({cover['family'].value})\n"
            recommendations += f"  Benefits: {cover['benefits']}\n"
            
            # Add specific recommendations
            if cover["family"] == CropFamily.FABACEAE:
                recommendations += "  → Excellent for adding nitrogen to soil\n"
            elif cover["family"] == CropFamily.POACEAE:
                recommendations += "  → Great for adding organic matter\n"
            elif cover["family"] == CropFamily.BRASSICACEAE:
                recommendations += "  → Helps break up compacted soil\n"
            
            recommendations += "\n"
    
    recommendations += "**Cover Crop Tips:**\n"
    recommendations += "- Plant cover crops 4-6 weeks before first frost\n"
    recommendations += "- Turn under or cut down 2-3 weeks before spring planting\n"
    recommendations += "- Legume cover crops add nitrogen for next season's crops\n"
    recommendations += "- Grass cover crops add organic matter and prevent erosion\n\n"
    
    return recommendations


def generate_soil_improvement_plan(crops: List[str]) -> str:
    """
    Generate a soil improvement plan based on crop families.
    
    Args:
        crops: List of crops being grown
    
    Returns:
        Formatted soil improvement recommendations
    """
    # Analyze crop families
    heavy_feeders = []
    light_feeders = []
    nitrogen_fixers = []
    
    for crop in crops:
        family = get_crop_family(crop)
        if family == CropFamily.SOLANACEAE or family == CropFamily.CUCURBITACEAE:
            heavy_feeders.append(crop)
        elif family == CropFamily.FABACEAE:
            nitrogen_fixers.append(crop)
        else:
            light_feeders.append(crop)
    
    plan = "\n\n**Soil Health Improvement Plan:**\n\n"
    
    if heavy_feeders:
        plan += "**For Heavy Feeders** (Tomatoes, Peppers, Squash, Cucumbers):\n"
        plan += "- Add 2-3 inches of compost before planting\n"
        plan += "- Side-dress with compost or balanced fertilizer mid-season\n"
        plan += "- Mulch heavily to retain moisture and suppress weeds\n"
        plan += "- Follow with legumes next year to restore nitrogen\n\n"
    
    if nitrogen_fixers:
        plan += "**For Nitrogen Fixers** (Beans, Peas):\n"
        plan += "- Minimal fertilizer needed - they make their own nitrogen!\n"
        plan += "- Add compost for phosphorus and potassium\n"
        plan += "- Leave roots in soil after harvest to release nitrogen\n"
        plan += "- Plant heavy feeders in this spot next year\n\n"
    
    if light_feeders:
        plan += "**For Light Feeders** (Lettuce, Herbs, Root Vegetables):\n"
        plan += "- Add 1 inch of compost before planting\n"
        plan += "- Minimal additional fertilizer needed\n"
        plan += "- Good for following heavy feeders\n\n"
    
    plan += "**General Soil Health Tips:**\n"
    plan += "1. Test soil pH annually (most vegetables prefer 6.0-7.0)\n"
    plan += "2. Add compost every season (2-4 inches per year)\n"
    plan += "3. Use mulch to retain moisture and add organic matter\n"
    plan += "4. Rotate crops to prevent nutrient depletion\n"
    plan += "5. Plant cover crops in fall/winter to protect and enrich soil\n"
    plan += "6. Avoid tilling when possible to preserve soil structure\n\n"
    
    return plan


def get_rotation_recommendations(crop: str) -> Dict[str, any]:
    """
    Get rotation recommendations for a specific crop.
    
    Args:
        crop: Crop name
    
    Returns:
        Dictionary with rotation info
    """
    family = get_crop_family(crop)
    
    if not family or family not in ROTATION_RULES:
        return {
            "family": "Unknown",
            "wait_years": 2,
            "good_followers": [],
            "avoid_followers": [],
            "notes": "General rotation recommended - wait 2 years before replanting."
        }
    
    rules = ROTATION_RULES[family]
    
    return {
        "family": family.value,
        "wait_years": rules["wait_years"],
        "good_followers": [f.value for f in rules["good_followers"]],
        "avoid_followers": [f.value for f in rules["avoid_followers"]],
        "notes": rules["notes"]
    }
