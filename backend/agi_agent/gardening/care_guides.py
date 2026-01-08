"""
Crop-Specific Care Instructions Module
Detailed care calendars, fertilization schedules, and maintenance guides
"""

from typing import List, Dict, Optional
from .crop_families import CropFamily, CROP_FAMILIES


# Comprehensive care database for major crops
CARE_DATABASE = {
    # TOMATOES
    "tomato": {
        "family": CropFamily.SOLANACEAE,
        "care_calendar": {
            "week_1-2": "Transplant seedlings after last frost. Water deeply. Stake or cage plants.",
            "week_3-4": "Mulch around plants. Begin weekly fertilization with balanced fertilizer.",
            "week_5-6": "Prune suckers on indeterminate varieties. Monitor for pests.",
            "week_7-8": "Continue fertilization. Water consistently (1-2 inches per week).",
            "week_9-10": "First fruits forming. Switch to low-nitrogen, high-potassium fertilizer.",
            "week_11-12": "Begin harvesting ripe fruits. Remove diseased leaves promptly.",
            "week_13+": "Continue harvesting. Reduce watering as season ends.",
        },
        "fertilization": "Feed weekly with balanced 10-10-10 until flowering, then switch to 5-10-10. Side-dress with compost mid-season.",
        "watering": "1-2 inches per week. Water at base, avoid wetting leaves. Consistent moisture prevents blossom end rot.",
        "pruning": "Remove suckers on indeterminate varieties. Remove lower leaves for air circulation.",
        "support": "Stake or cage at planting. Tie stems loosely as they grow.",
        "common_tasks": [
            "Check daily for hornworms and remove by hand",
            "Remove yellowing lower leaves",
            "Harvest ripe fruits promptly to encourage more production",
            "Monitor for early blight and treat with copper fungicide if needed"
        ]
    },
    
    # PEPPERS
    "pepper": {
        "family": CropFamily.SOLANACEAE,
        "care_calendar": {
            "week_1-2": "Transplant after soil warms to 65°F. Space 18-24 inches apart.",
            "week_3-4": "Mulch to retain moisture. Begin fertilization every 2 weeks.",
            "week_5-6": "Stake tall varieties. Monitor for aphids.",
            "week_7-8": "First flowers appearing. Maintain consistent watering.",
            "week_9-10": "Small peppers forming. Continue fertilization.",
            "week_11-12": "Begin harvesting when peppers reach full size.",
            "week_13+": "Continue harvesting. Peppers sweeten as they ripen to final color.",
        },
        "fertilization": "Feed every 2 weeks with 5-10-10 fertilizer. Avoid high nitrogen which delays fruiting.",
        "watering": "1 inch per week. Deep, infrequent watering better than frequent shallow watering.",
        "pruning": "Pinch first flowers to encourage stronger plant. Remove damaged leaves.",
        "support": "Stake or cage heavy-fruiting varieties to prevent branch breakage.",
        "common_tasks": [
            "Check for aphids on new growth",
            "Harvest regularly to encourage more production",
            "Allow some peppers to fully ripen for sweetest flavor",
            "Protect from early fall frost with row covers"
        ]
    },
    
    # LETTUCE
    "lettuce": {
        "family": CropFamily.ASTERACEAE,
        "care_calendar": {
            "week_1-2": "Direct sow or transplant. Keep soil moist for germination.",
            "week_3-4": "Thin seedlings to 6-8 inches apart. Begin light fertilization.",
            "week_5-6": "Harvest outer leaves or wait for full heads.",
            "week_7-8": "Continue harvesting. Watch for bolting in warm weather.",
        },
        "fertilization": "Light feeding with nitrogen-rich fertilizer (fish emulsion) every 2 weeks.",
        "watering": "Keep soil consistently moist. Water in morning to prevent disease.",
        "pruning": "Harvest outer leaves regularly to encourage continued growth.",
        "support": "None needed.",
        "common_tasks": [
            "Harvest in morning for crispest leaves",
            "Succession plant every 2 weeks for continuous harvest",
            "Provide shade cloth in hot weather to prevent bolting",
            "Watch for slugs and use beer traps or diatomaceous earth"
        ]
    },
    
    # TOMATOES (additional detail)
    "basil": {
        "family": CropFamily.LAMIACEAE,
        "care_calendar": {
            "week_1-2": "Plant after last frost. Pinch growing tips to encourage bushiness.",
            "week_3-4": "Begin harvesting leaves. Fertilize lightly.",
            "week_5-6": "Pinch flower buds to keep plant producing leaves.",
            "week_7-8": "Continue harvesting. Plant may slow in extreme heat.",
            "week_9+": "Harvest heavily before first frost. Make pesto to preserve.",
        },
        "fertilization": "Light feeding monthly with balanced fertilizer. Avoid over-fertilizing.",
        "watering": "Keep soil moist but not waterlogged. Water at base of plant.",
        "pruning": "Pinch growing tips regularly. Remove flower buds immediately.",
        "support": "None needed.",
        "common_tasks": [
            "Harvest leaves in morning for best flavor",
            "Pinch flowers as soon as they appear",
            "Harvest regularly to encourage bushy growth",
            "Watch for Japanese beetles and remove by hand"
        ]
    },
    
    # CARROTS
    "carrot": {
        "family": CropFamily.APIACEAE,
        "care_calendar": {
            "week_1-2": "Direct sow. Keep soil moist for germination (10-14 days).",
            "week_3-4": "Thin seedlings to 2-3 inches apart. Mulch lightly.",
            "week_5-8": "Keep soil consistently moist. Weed carefully.",
            "week_9-10": "Carrots sizing up. Reduce watering slightly.",
            "week_11-12": "Begin harvesting when shoulders are 3/4 inch diameter.",
        },
        "fertilization": "Minimal fertilizer needed. Too much nitrogen causes hairy roots.",
        "watering": "1 inch per week. Consistent moisture prevents cracking.",
        "pruning": "None needed.",
        "support": "None needed.",
        "common_tasks": [
            "Thin seedlings carefully to avoid disturbing neighbors",
            "Mulch to prevent green shoulders",
            "Harvest before ground freezes",
            "Store in sand or sawdust for winter keeping"
        ]
    },
    
    # CUCUMBERS
    "cucumber": {
        "family": CropFamily.CUCURBITACEAE,
        "care_calendar": {
            "week_1-2": "Plant after soil warms. Provide trellis for vining types.",
            "week_3-4": "Mulch heavily. Begin weekly fertilization.",
            "week_5-6": "Flowers appearing. Ensure good pollination.",
            "week_7-8": "First cucumbers forming. Harvest when 6-8 inches long.",
            "week_9+": "Harvest daily to encourage continued production.",
        },
        "fertilization": "Feed weekly with balanced fertilizer. Switch to low-nitrogen when fruiting.",
        "watering": "1-2 inches per week. Consistent moisture prevents bitter cucumbers.",
        "pruning": "Remove dead leaves. Train vines onto trellis.",
        "support": "Trellis or cage for vining varieties. Saves space and improves air circulation.",
        "common_tasks": [
            "Harvest daily - overripe cucumbers stop production",
            "Check for cucumber beetles and hand-pick",
            "Ensure good pollination - plant flowers nearby",
            "Remove any diseased leaves immediately"
        ]
    },
    
    # BEANS
    "beans": {
        "family": CropFamily.FABACEAE,
        "care_calendar": {
            "week_1-2": "Direct sow after last frost. Provide support for pole beans.",
            "week_3-4": "Thin to 4-6 inches apart. Mulch lightly.",
            "week_5-6": "Flowers appearing. Avoid disturbing plants.",
            "week_7-8": "Begin harvesting snap beans when pods are firm.",
            "week_9+": "Harvest every 2-3 days to encourage production.",
        },
        "fertilization": "Minimal - beans fix their own nitrogen. Light compost tea if needed.",
        "watering": "1 inch per week. Water at base to prevent disease.",
        "pruning": "None needed.",
        "support": "Pole beans need 6-8 foot trellis or poles.",
        "common_tasks": [
            "Harvest in morning when pods are crisp",
            "Pick regularly to encourage more pods",
            "Avoid working in wet plants (spreads disease)",
            "Leave roots in soil after harvest to release nitrogen"
        ]
    },
    
    # SQUASH
    "squash": {
        "family": CropFamily.CUCURBITACEAE,
        "care_calendar": {
            "week_1-2": "Plant after last frost. Space 3-4 feet apart.",
            "week_3-4": "Mulch heavily. Begin weekly fertilization.",
            "week_5-6": "Large leaves developing. Monitor for squash bugs.",
            "week_7-8": "Flowers appearing. Hand-pollinate if needed.",
            "week_9-10": "Summer squash ready when 6-8 inches. Winter squash needs longer.",
            "week_11+": "Continue harvesting summer squash. Let winter squash mature on vine.",
        },
        "fertilization": "Feed weekly with balanced fertilizer until flowering, then reduce.",
        "watering": "1-2 inches per week. Water at base, avoid wetting leaves.",
        "pruning": "Remove dead leaves. Can prune excess vines if needed.",
        "support": "None for bush types. Trellis possible for vining types.",
        "common_tasks": [
            "Check daily for squash bugs and eggs - remove immediately",
            "Hand-pollinate flowers in morning if few bees",
            "Harvest summer squash when small and tender",
            "Cure winter squash in sun for 10-14 days before storage"
        ]
    },
    
    # KALE
    "kale": {
        "family": CropFamily.BRASSICACEAE,
        "care_calendar": {
            "week_1-2": "Plant in early spring or late summer. Space 12-18 inches.",
            "week_3-4": "Thin seedlings. Begin light fertilization.",
            "week_5-6": "Begin harvesting outer leaves when 8-10 inches.",
            "week_7+": "Continue harvesting. Flavor improves after light frost.",
        },
        "fertilization": "Feed every 3 weeks with nitrogen-rich fertilizer.",
        "watering": "1 inch per week. Consistent moisture for tender leaves.",
        "pruning": "Harvest outer leaves, leave center to continue growing.",
        "support": "None needed.",
        "common_tasks": [
            "Harvest outer leaves regularly",
            "Check for cabbage worms and remove by hand",
            "Mulch to retain moisture",
            "Flavor sweetens after frost - harvest through winter"
        ]
    },
    
    # ONIONS
    "onion": {
        "family": CropFamily.ALLIACEAE,
        "care_calendar": {
            "week_1-4": "Plant sets or transplants in early spring. Space 4-6 inches.",
            "week_5-8": "Keep weeded. Fertilize every 2-3 weeks.",
            "week_9-12": "Bulbs sizing up. Reduce watering as tops yellow.",
            "week_13-16": "When tops fall over, stop watering. Harvest when tops are brown.",
        },
        "fertilization": "Feed every 2-3 weeks with nitrogen-rich fertilizer until bulbing.",
        "watering": "1 inch per week until tops begin to yellow, then stop.",
        "pruning": "None needed.",
        "support": "None needed.",
        "common_tasks": [
            "Keep weed-free - onions don't compete well",
            "Don't bend tops over - let them fall naturally",
            "Cure in warm, dry place for 2-3 weeks before storage",
            "Harvest green onions anytime for fresh use"
        ]
    },
    
    # BROCCOLI
    "broccoli": {
        "family": CropFamily.BRASSICACEAE,
        "care_calendar": {
            "week_1-2": "Transplant seedlings 18-24 inches apart. Water well after planting.",
            "week_3-4": "Mulch around plants. Begin fertilization with nitrogen-rich fertilizer.",
            "week_5-6": "Monitor for cabbage worms. Use row covers if needed.",
            "week_7-8": "Continue fertilization every 2 weeks. Keep soil moist.",
            "week_9-10": "Heads beginning to form. Maintain consistent watering.",
            "week_11-12": "Harvest main head when tight and before flowers open.",
            "week_13+": "Continue harvesting side shoots for 4-6 weeks after main head.",
        },
        "fertilization": "Feed every 2 weeks with nitrogen-rich fertilizer (blood meal or fish emulsion). Side-dress with compost.",
        "watering": "1-2 inches per week. Consistent moisture essential for head formation.",
        "pruning": "Remove yellowing lower leaves. Harvest main head to encourage side shoots.",
        "support": "None needed.",
        "common_tasks": [
            "Check daily for cabbage worms and hand-pick",
            "Use row covers to prevent cabbage moths",
            "Harvest main head in morning when cool",
            "Continue harvesting side shoots after main head"
        ]
    },
    
    # POTATOES
    "potato": {
        "family": CropFamily.SOLANACEAE,
        "care_calendar": {
            "week_1-2": "Plant seed potatoes 4 inches deep, 12 inches apart. Water well.",
            "week_3-4": "Plants emerging. Begin hilling soil around stems when 6 inches tall.",
            "week_5-6": "Continue hilling every 2 weeks. Keep soil moist but not waterlogged.",
            "week_7-8": "Plants flowering. Stop hilling. Maintain consistent watering.",
            "week_9-10": "Tubers forming. Reduce watering slightly.",
            "week_11-12": "For new potatoes, harvest when flowers appear. For storage, wait until foliage dies.",
            "week_13+": "Cure harvested potatoes in dark, cool place for 2 weeks before storage.",
        },
        "fertilization": "Apply balanced fertilizer at planting. Side-dress with compost when plants are 6 inches tall. Avoid high nitrogen after flowering.",
        "watering": "1-2 inches per week. Consistent moisture prevents hollow heart and knobby tubers.",
        "pruning": "Remove flowers to direct energy to tuber production (optional).",
        "support": "None needed.",
        "common_tasks": [
            "Hill soil around plants every 2 weeks until flowering",
            "Check for Colorado potato beetles daily",
            "Mulch heavily to keep tubers covered and cool",
            "Stop watering 2 weeks before harvest for storage potatoes"
        ]
    },
    
    # GARLIC
    "garlic": {
        "family": CropFamily.ALLIACEAE,
        "care_calendar": {
            "week_1-4": "Plant cloves in fall, 2 inches deep, 6 inches apart. Mulch heavily.",
            "winter": "Mulch protects through winter. No care needed.",
            "spring_week_1-4": "Remove mulch in spring. Begin fertilization when shoots appear.",
            "spring_week_5-8": "Scapes appear on hardneck varieties. Cut and use in cooking.",
            "spring_week_9-12": "Stop watering when lower leaves begin to brown.",
            "harvest": "Harvest when 1/3 to 1/2 of leaves have browned. Cure for 2-3 weeks.",
        },
        "fertilization": "Apply nitrogen-rich fertilizer in early spring. Stop fertilizing 4 weeks before harvest.",
        "watering": "1 inch per week during active growth. Stop watering 2-3 weeks before harvest.",
        "pruning": "Remove scapes (flower stalks) on hardneck varieties to increase bulb size.",
        "support": "None needed.",
        "common_tasks": [
            "Mulch heavily in fall and winter",
            "Remove scapes when they curl (use in pesto)",
            "Watch for yellowing leaves as harvest indicator",
            "Cure bulbs in warm, dry, shaded area before storage"
        ]
    },
    
    # STRAWBERRIES
    "strawberry": {
        "family": CropFamily.ROSACEAE,
        "care_calendar": {
            "year_1_spring": "Plant crowns with roots spread. Crown should be at soil level. Water well.",
            "year_1_summer": "Remove flowers first year to establish strong plants. Keep weeded.",
            "year_1_fall": "Mulch with straw after first hard freeze.",
            "year_2_spring": "Remove mulch when growth starts. Fertilize lightly.",
            "year_2_summer": "Harvest berries in morning. Remove runners if desired.",
            "year_2_fall": "Renovate June-bearing varieties after harvest. Mulch for winter.",
        },
        "fertilization": "Apply balanced fertilizer in early spring. Avoid high nitrogen which reduces fruiting.",
        "watering": "1-2 inches per week. Drip irrigation ideal to keep fruit dry.",
        "pruning": "Remove runners to maintain plant vigor. Renovate June-bearing beds after harvest.",
        "support": "None needed.",
        "common_tasks": [
            "Remove flowers first year for stronger plants",
            "Harvest berries every 2-3 days when ripe",
            "Remove runners unless expanding bed",
            "Mulch with straw to keep fruit clean and control weeds"
        ]
    },
    
    # ZUCCHINI
    "zucchini": {
        "family": CropFamily.CUCURBITACEAE,
        "care_calendar": {
            "week_1-2": "Direct sow or transplant after last frost. Space 3-4 feet apart.",
            "week_3-4": "Mulch around plants. Begin fertilization.",
            "week_5-6": "Flowers appearing. Hand-pollinate if needed. Monitor for squash bugs.",
            "week_7-8": "Begin harvesting when 6-8 inches long. Check daily.",
            "week_9+": "Continue harvesting. Remove oversize fruits to encourage production.",
        },
        "fertilization": "Feed every 2 weeks with balanced fertilizer. Side-dress with compost when flowering begins.",
        "watering": "1-2 inches per week. Water at base to prevent powdery mildew.",
        "pruning": "Remove damaged or diseased leaves. Harvest oversize fruits promptly.",
        "support": "None needed for bush varieties. Trellis for vining types.",
        "common_tasks": [
            "Check daily for squash vine borers at base of plant",
            "Harvest when 6-8 inches for best flavor",
            "Hand-pollinate early morning if few bees present",
            "Remove and destroy squash bug eggs on leaf undersides"
        ]
    },
    
    # BEETS
    "beet": {
        "family": CropFamily.CHENOPODIACEAE,
        "care_calendar": {
            "week_1-2": "Direct sow 1/2 inch deep. Keep soil moist for germination.",
            "week_3-4": "Thin seedlings to 3-4 inches apart. Use thinnings in salads.",
            "week_5-6": "Begin light fertilization. Keep soil moist.",
            "week_7-8": "Roots sizing up. Maintain consistent watering.",
            "week_9-10": "Begin harvesting when roots are 1-3 inches diameter.",
        },
        "fertilization": "Light feeding with balanced fertilizer every 3 weeks. Avoid high nitrogen.",
        "watering": "1 inch per week. Consistent moisture prevents woody roots.",
        "pruning": "Harvest greens when young for salads (optional).",
        "support": "None needed.",
        "common_tasks": [
            "Thin seedlings early - each seed produces 2-3 plants",
            "Harvest greens for salads when thinning",
            "Pull roots when 1-3 inches for best tenderness",
            "Succession plant every 2-3 weeks for continuous harvest"
        ]
    },
    
    # SPINACH
    "spinach": {
        "family": CropFamily.CHENOPODIACEAE,
        "care_calendar": {
            "week_1-2": "Direct sow in early spring or fall. Keep soil moist.",
            "week_3-4": "Thin to 4-6 inches apart. Begin light fertilization.",
            "week_5-6": "Begin harvesting outer leaves or wait for full rosette.",
            "week_7-8": "Continue harvesting. Watch for bolting in warm weather.",
        },
        "fertilization": "Feed every 2 weeks with nitrogen-rich fertilizer (fish emulsion).",
        "watering": "1 inch per week. Consistent moisture prevents bolting.",
        "pruning": "Harvest outer leaves regularly to encourage continued growth.",
        "support": "None needed.",
        "common_tasks": [
            "Harvest outer leaves when 3-4 inches long",
            "Provide shade cloth in warm weather to delay bolting",
            "Succession plant every 2 weeks in spring and fall",
            "Watch for leaf miners and remove affected leaves"
        ]
    },
    
    # PEAS
    "pea": {
        "family": CropFamily.FABACEAE,
        "care_calendar": {
            "week_1-2": "Direct sow 1 inch deep as soon as soil can be worked. Install trellis.",
            "week_3-4": "Seedlings emerging. Protect from birds with netting.",
            "week_5-6": "Plants climbing. Guide tendrils to trellis.",
            "week_7-8": "Flowering begins. Maintain consistent watering.",
            "week_9-10": "Pods forming. Check daily for harvest readiness.",
            "week_11-12": "Harvest snap peas when pods are full. Harvest snow peas when flat.",
        },
        "fertilization": "Light fertilization only - peas fix their own nitrogen. Compost at planting sufficient.",
        "watering": "1 inch per week. Increase to 1.5 inches when flowering and podding.",
        "pruning": "Pinch growing tips when plants reach top of support (optional).",
        "support": "Trellis, fence, or netting for climbing varieties. Bush types need minimal support.",
        "common_tasks": [
            "Install trellis before planting",
            "Harvest daily once pods begin forming",
            "Pick pods in morning for sweetest flavor",
            "Remove plants after harvest and compost (nitrogen-rich)"
        ]
    },
    
    # EGGPLANT
    "eggplant": {
        "family": CropFamily.SOLANACEAE,
        "care_calendar": {
            "week_1-2": "Transplant after soil warms to 70°F. Space 24-30 inches apart.",
            "week_3-4": "Mulch around plants. Begin fertilization.",
            "week_5-6": "Stake plants. Monitor for flea beetles.",
            "week_7-8": "Flowers appearing. Hand-pollinate if needed.",
            "week_9-10": "Fruits forming. Continue fertilization.",
            "week_11-12": "Begin harvesting when fruits are glossy and firm.",
            "week_13+": "Continue harvesting. Remove overripe fruits promptly.",
        },
        "fertilization": "Feed every 2 weeks with balanced fertilizer. Increase potassium when fruiting.",
        "watering": "1-2 inches per week. Consistent moisture prevents bitter fruit.",
        "pruning": "Pinch first flowers for stronger plants. Remove suckers below first flower.",
        "support": "Stake or cage plants to support heavy fruits.",
        "common_tasks": [
            "Check for flea beetles and use row covers if needed",
            "Harvest when skin is glossy - dull skin means overripe",
            "Use pruning shears to cut fruit with stem attached",
            "Remove overripe fruits to encourage continued production"
        ]
    },
}


def get_generic_care_guide(crop_name: str, family: CropFamily) -> Dict:
    """
    Generate a generic care guide based on crop family.
    Used as fallback for crops without specific care guides.
    """
    # Family-based generic care templates
    family_templates = {
        CropFamily.SOLANACEAE: {
            "care_calendar": {
                "week_1-2": "Transplant after last frost when soil is warm. Space according to variety.",
                "week_3-6": "Mulch, stake if needed, and begin regular fertilization.",
                "week_7-10": "Monitor for pests. Maintain consistent watering during flowering and fruiting.",
                "week_11+": "Harvest regularly to encourage continued production.",
            },
            "fertilization": "Feed every 2-3 weeks with balanced fertilizer. Reduce nitrogen when fruiting begins.",
            "watering": "1-2 inches per week. Consistent moisture important for fruit development.",
            "pruning": "Remove diseased leaves. Prune for air circulation.",
            "support": "Stake or cage as needed for support.",
            "common_tasks": ["Monitor for hornworms and aphids", "Harvest regularly", "Remove diseased foliage promptly"]
        },
        CropFamily.BRASSICACEAE: {
            "care_calendar": {
                "week_1-2": "Transplant or direct sow in cool weather. Space 12-24 inches apart.",
                "week_3-6": "Mulch and fertilize with nitrogen-rich fertilizer. Use row covers for pest protection.",
                "week_7-10": "Monitor for cabbage worms. Maintain consistent moisture.",
                "week_11+": "Harvest when heads/leaves reach desired size.",
            },
            "fertilization": "Feed every 2 weeks with nitrogen-rich fertilizer (blood meal or fish emulsion).",
            "watering": "1-2 inches per week. Consistent moisture prevents splitting and bolting.",
            "pruning": "Remove yellowing lower leaves.",
            "support": "None typically needed.",
            "common_tasks": ["Check daily for cabbage worms", "Use row covers to prevent pests", "Harvest promptly"]
        },
        CropFamily.CUCURBITACEAE: {
            "care_calendar": {
                "week_1-2": "Plant after last frost in warm soil. Space 3-6 feet apart.",
                "week_3-6": "Mulch heavily. Begin fertilization when vines start running.",
                "week_7-10": "Hand-pollinate if needed. Monitor for squash bugs and vine borers.",
                "week_11+": "Harvest regularly. Remove oversize fruits.",
            },
            "fertilization": "Feed every 2 weeks with balanced fertilizer. Side-dress with compost.",
            "watering": "1-2 inches per week. Water at base to prevent powdery mildew.",
            "pruning": "Remove diseased leaves. Harvest oversize fruits promptly.",
            "support": "Trellis for vining types. None for bush varieties.",
            "common_tasks": ["Check for squash bugs daily", "Hand-pollinate if few pollinators", "Harvest regularly"]
        },
        CropFamily.FABACEAE: {
            "care_calendar": {
                "week_1-2": "Direct sow or transplant. Install support for climbing varieties.",
                "week_3-6": "Minimal fertilization needed - legumes fix nitrogen. Keep weeded.",
                "week_7-10": "Harvest regularly once pods form.",
                "week_11+": "Continue harvesting. Remove plants when production slows.",
            },
            "fertilization": "Minimal - legumes fix their own nitrogen. Compost at planting sufficient.",
            "watering": "1 inch per week. Increase when flowering and podding.",
            "pruning": "Pinch tips when plants reach support height (optional).",
            "support": "Trellis or stakes for climbing varieties.",
            "common_tasks": ["Harvest daily for best quality", "Install support early", "Compost plants after harvest"]
        },
        CropFamily.APIACEAE: {
            "care_calendar": {
                "week_1-4": "Direct sow or transplant. Keep soil moist for germination.",
                "week_5-8": "Thin seedlings. Begin light fertilization.",
                "week_9-12": "Maintain consistent watering. Hill soil for blanching if desired.",
                "week_13+": "Harvest when roots/stems reach desired size.",
            },
            "fertilization": "Light feeding every 3 weeks with balanced fertilizer.",
            "watering": "1 inch per week. Consistent moisture prevents woody roots.",
            "pruning": "None needed.",
            "support": "None needed.",
            "common_tasks": ["Keep weed-free", "Thin seedlings early", "Harvest at proper size"]
        },
        CropFamily.ALLIACEAE: {
            "care_calendar": {
                "planting": "Plant sets or transplants in spring or fall.",
                "growing": "Keep weed-free. Light fertilization in spring.",
                "harvest": "Harvest when tops fall over naturally. Cure before storage.",
            },
            "fertilization": "Light nitrogen in spring. Stop 4 weeks before harvest.",
            "watering": "1 inch per week. Stop when tops begin to yellow.",
            "pruning": "None needed.",
            "support": "None needed.",
            "common_tasks": ["Keep weed-free", "Don't bend tops - let fall naturally", "Cure properly before storage"]
        },
    }
    
    # Get template for family or use generic
    template = family_templates.get(family, {
        "care_calendar": {"general": "Follow standard care practices for this crop family."},
        "fertilization": "Feed according to crop needs.",
        "watering": "Maintain consistent moisture.",
        "pruning": "As needed.",
        "support": "As needed.",
        "common_tasks": ["Monitor for pests", "Harvest at proper maturity", "Maintain consistent care"]
    })
    
    return {
        "family": family,
        **template
    }


def get_care_guide(crop_name: str) -> Optional[Dict]:
    """
    Get care guide for a specific crop.
    Falls back to generic family-based guide if specific guide not available.
    """
    crop_key = crop_name.lower().replace(" ", "_")
    
    # Check for specific care guide first
    if crop_key in CARE_DATABASE:
        return CARE_DATABASE[crop_key]
    
    # Fall back to generic family-based guide
    if crop_key in CROP_FAMILIES:
        family = CROP_FAMILIES[crop_key]
        return get_generic_care_guide(crop_name, family)
    
    return None


def generate_care_calendar(crop_name: str) -> str:
    """
    Generate a week-by-week care calendar for a crop.
    
    Args:
        crop_name: Name of the crop
    
    Returns:
        Formatted care calendar
    """
    care_guide = get_care_guide(crop_name)
    
    if not care_guide:
        return f"\n**{crop_name} Care Calendar:**\nDetailed care calendar not available. Follow general care guidelines.\n"
    
    calendar = f"\n**{crop_name} Care Calendar:**\n\n"
    
    # Week-by-week schedule
    for week, tasks in care_guide["care_calendar"].items():
        calendar += f"• {week.replace('_', ' ').title()}: {tasks}\n"
    
    calendar += "\n"
    
    return calendar


def generate_detailed_care_guide(crops: List[str]) -> str:
    """
    Generate detailed care guides for selected crops.
    
    Args:
        crops: List of crop names
    
    Returns:
        Formatted care guide
    """
    guide = "\n\n" + "="*70 + "\n"
    guide += "DETAILED CARE INSTRUCTIONS\n"
    guide += "="*70 + "\n\n"
    
    # Get care guides for crops that have them
    crops_with_guides = []
    for crop in crops[:5]:  # Show detailed guides for top 5 crops
        care_guide = get_care_guide(crop)
        if care_guide:
            crops_with_guides.append((crop, care_guide))
    
    if not crops_with_guides:
        guide += "General care guidelines apply to your selected crops.\n"
        guide += "Water consistently, fertilize as needed, and monitor for pests.\n\n"
        return guide
    
    for crop, care_guide in crops_with_guides:
        guide += f"**{crop.upper()}**\n"
        guide += f"Family: {care_guide['family'].value}\n\n"
        
        # Fertilization
        guide += f"**Fertilization:** {care_guide['fertilization']}\n\n"
        
        # Watering
        guide += f"**Watering:** {care_guide['watering']}\n\n"
        
        # Pruning
        guide += f"**Pruning:** {care_guide['pruning']}\n\n"
        
        # Support
        guide += f"**Support:** {care_guide['support']}\n\n"
        
        # Common tasks
        guide += "**Weekly Tasks:**\n"
        for task in care_guide['common_tasks']:
            guide += f"  • {task}\n"
        
        guide += "\n" + "-"*70 + "\n\n"
    
    return guide


def generate_maintenance_schedule(crops: List[str]) -> str:
    """
    Generate a general maintenance schedule for all crops.
    
    Args:
        crops: List of crop names
    
    Returns:
        Formatted maintenance schedule
    """
    schedule = "\n\n**WEEKLY MAINTENANCE CHECKLIST:**\n\n"
    
    schedule += "**Daily Tasks:**\n"
    schedule += "• Check soil moisture - water if top inch is dry\n"
    schedule += "• Harvest ripe produce to encourage more production\n"
    schedule += "• Scout for pests and remove by hand\n"
    schedule += "• Remove any diseased or damaged leaves\n\n"
    
    schedule += "**Weekly Tasks:**\n"
    schedule += "• Deep watering (1-2 inches) if no rain\n"
    schedule += "• Weed around plants\n"
    schedule += "• Check stakes and supports, adjust as needed\n"
    schedule += "• Apply mulch if it's thin\n"
    schedule += "• Fertilize crops that need weekly feeding\n\n"
    
    schedule += "**Bi-Weekly Tasks:**\n"
    schedule += "• Fertilize most crops\n"
    schedule += "• Prune and train vining plants\n"
    schedule += "• Check for signs of disease\n"
    schedule += "• Succession plant quick crops (lettuce, radishes)\n\n"
    
    schedule += "**Monthly Tasks:**\n"
    schedule += "• Refresh mulch layer\n"
    schedule += "• Side-dress heavy feeders with compost\n"
    schedule += "• Review and adjust watering schedule\n"
    schedule += "• Plan next season's plantings\n\n"
    
    return schedule


def generate_fertilization_guide(crops: List[str]) -> str:
    """
    Generate crop-specific fertilization recommendations.
    
    Args:
        crops: List of crop names
    
    Returns:
        Formatted fertilization guide
    """
    guide = "\n\n**FERTILIZATION GUIDE:**\n\n"
    
    # Categorize crops
    heavy_feeders = []
    moderate_feeders = []
    light_feeders = []
    
    for crop in crops:
        family = CROP_FAMILIES.get(crop.lower().replace(" ", "_"))
        if family in [CropFamily.SOLANACEAE, CropFamily.CUCURBITACEAE]:
            heavy_feeders.append(crop)
        elif family == CropFamily.FABACEAE:
            light_feeders.append(crop)
        else:
            moderate_feeders.append(crop)
    
    if heavy_feeders:
        guide += "**Heavy Feeders** (weekly feeding):\n"
        guide += f"Crops: {', '.join(heavy_feeders)}\n"
        guide += "• Feed weekly with balanced 10-10-10 fertilizer\n"
        guide += "• Switch to 5-10-10 when flowering/fruiting\n"
        guide += "• Side-dress with compost mid-season\n"
        guide += "• Water well after fertilizing\n\n"
    
    if moderate_feeders:
        guide += "**Moderate Feeders** (bi-weekly feeding):\n"
        guide += f"Crops: {', '.join(moderate_feeders)}\n"
        guide += "• Feed every 2 weeks with balanced fertilizer\n"
        guide += "• Use compost tea or fish emulsion\n"
        guide += "• Reduce feeding as harvest approaches\n\n"
    
    if light_feeders:
        guide += "**Light Feeders** (minimal feeding):\n"
        guide += f"Crops: {', '.join(light_feeders)}\n"
        guide += "• Minimal fertilizer needed\n"
        guide += "• Compost at planting is usually sufficient\n"
        guide += "• Over-fertilizing can reduce production\n\n"
    
    guide += "**Fertilizer Types:**\n"
    guide += "• 10-10-10: Balanced for vegetative growth\n"
    guide += "• 5-10-10: Lower nitrogen for fruiting\n"
    guide += "• Fish emulsion: Gentle, organic nitrogen source\n"
    guide += "• Compost tea: All-purpose, adds beneficial microbes\n"
    guide += "• Bone meal: Phosphorus for root development\n"
    guide += "• Kelp meal: Potassium and trace minerals\n\n"
    
    return guide


def generate_pruning_guide(crops: List[str]) -> str:
    """
    Generate pruning and training recommendations.
    
    Args:
        crops: List of crop names
    
    Returns:
        Formatted pruning guide
    """
    guide = "\n\n**PRUNING & TRAINING GUIDE:**\n\n"
    
    # Check which crops need pruning
    needs_pruning = []
    for crop in crops:
        care_guide = get_care_guide(crop)
        if care_guide and "prune" in care_guide.get("pruning", "").lower():
            needs_pruning.append((crop, care_guide["pruning"]))
    
    if needs_pruning:
        for crop, pruning_info in needs_pruning:
            guide += f"**{crop.title()}:** {pruning_info}\n\n"
    else:
        guide += "Most of your selected crops require minimal pruning.\n"
        guide += "General tips:\n"
        guide += "• Remove dead, diseased, or damaged leaves promptly\n"
        guide += "• Thin overcrowded plants for better air circulation\n"
        guide += "• Harvest regularly to encourage continued production\n\n"
    
    return guide
