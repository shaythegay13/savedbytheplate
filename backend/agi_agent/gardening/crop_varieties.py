"""
Comprehensive crop variety database with detailed growing information.
Includes specific varieties, characteristics, and harvest details.

v4.0 Phase 2 Feature: Variety-specific recommendations
"""

from typing import List, Optional, Dict
from dataclasses import dataclass, field
from enum import Enum


class Difficulty(str, Enum):
    """Growing difficulty levels"""
    EASY = "Easy"
    MEDIUM = "Medium"
    HARD = "Hard"


class GrowingSeason(str, Enum):
    """Primary growing seasons"""
    SPRING = "Spring"
    SUMMER = "Summer"
    FALL = "Fall"
    WINTER = "Winter"
    SPRING_SUMMER = "Spring/Summer"
    SUMMER_FALL = "Summer/Fall"
    FALL_WINTER = "Fall/Winter"
    YEAR_ROUND = "Year-Round"


@dataclass
class HarvestInfo:
    """Harvest timing and technique information"""
    days_to_maturity: int  # Days from transplant/seed to first harvest
    harvest_period_weeks: int  # How long harvest lasts
    peak_production_weeks: List[int]  # Which weeks are peak (from transplant)
    harvest_technique: str  # How to harvest
    harvest_frequency: str  # How often to harvest
    storage_tips: Optional[str] = None
    best_harvest_time: str = "Morning"  # Time of day


@dataclass
class CropVariety:
    """Detailed information about a specific crop variety"""
    crop_name: str  # e.g., "Tomatoes"
    variety_name: str  # e.g., "Cherokee Purple"
    description: str  # Brief description
    days_to_maturity: int  # Days to first harvest
    growing_season: GrowingSeason
    difficulty: Difficulty
    space_per_plant_sqft: float  # Square feet needed per plant
    expected_yield_per_plant: str  # e.g., "10-15 lbs"
    plant_height: str  # e.g., "5-6 feet"
    plant_spread: str  # e.g., "2-3 feet"
    
    # Growing requirements
    sunlight_needs: str  # Full/Partial/Shade
    water_needs: str  # High/Medium/Low
    soil_preferences: str  # Well-drained, rich, etc.
    
    # Companion and disease info
    good_companions: List[str] = field(default_factory=list)
    avoid_companions: List[str] = field(default_factory=list)
    common_diseases: List[str] = field(default_factory=list)
    
    # Care tips
    care_tips: List[str] = field(default_factory=list)
    
    # Harvest info
    harvest_info: Optional[HarvestInfo] = None
    
    # Additional attributes
    heirloom: bool = False
    disease_resistant: bool = False
    cold_tolerant: bool = False
    heat_tolerant: bool = False
    container_suitable: bool = False
    determinate: Optional[bool] = None  # For tomatoes


# Comprehensive variety database
VARIETY_DATABASE = {
    "tomatoes": [
        CropVariety(
            crop_name="Tomatoes",
            variety_name="Cherokee Purple",
            description="Heirloom beefsteak with exceptional flavor",
            days_to_maturity=80,
            growing_season=GrowingSeason.SUMMER,
            difficulty=Difficulty.MEDIUM,
            space_per_plant_sqft=4.0,
            expected_yield_per_plant="10-15 lbs",
            plant_height="5-6 feet",
            plant_spread="2-3 feet",
            sunlight_needs="Full Sun (6-8 hours)",
            water_needs="Medium-High",
            soil_preferences="Rich, well-drained, pH 6.0-6.8",
            good_companions=["basil", "marigolds", "carrots", "onions"],
            avoid_companions=["brassicas", "corn", "fennel"],
            common_diseases=["Early Blight", "Late Blight", "Septoria Leaf Spot"],
            care_tips=[
                "Stake or cage for support",
                "Prune suckers for larger fruit",
                "Mulch heavily to retain moisture",
                "Water consistently at base"
            ],
            harvest_info=HarvestInfo(
                days_to_maturity=80,
                harvest_period_weeks=8,
                peak_production_weeks=[12, 13, 14, 15],
                harvest_technique="Pick when fully colored but still firm; twist gently or use pruners",
                harvest_frequency="Every 2-3 days during peak",
                storage_tips="Store at room temp (never refrigerate). Use within 1 week.",
                best_harvest_time="Morning after dew dries"
            ),
            heirloom=True,
            container_suitable=False,
            determinate=False
        ),
        CropVariety(
            crop_name="Tomatoes",
            variety_name="Sungold",
            description="Sweet cherry tomato, incredibly prolific",
            days_to_maturity=60,
            growing_season=GrowingSeason.SUMMER,
            difficulty=Difficulty.EASY,
            space_per_plant_sqft=4.0,
            expected_yield_per_plant="20-30 lbs",
            plant_height="6-8 feet",
            plant_spread="2-3 feet",
            sunlight_needs="Full Sun (6-8 hours)",
            water_needs="Medium-High",
            soil_preferences="Rich, well-drained, pH 6.0-6.8",
            good_companions=["basil", "marigolds", "carrots", "parsley"],
            avoid_companions=["brassicas", "corn", "fennel"],
            common_diseases=["Early Blight", "Late Blight"],
            care_tips=[
                "Very vigorous - needs strong support",
                "Minimal pruning needed",
                "Harvest frequently to encourage production",
                "Great for containers with large pots (10+ gal)"
            ],
            harvest_info=HarvestInfo(
                days_to_maturity=60,
                harvest_period_weeks=12,
                peak_production_weeks=[10, 11, 12, 13, 14, 15],
                harvest_technique="Pick when golden-orange; snip stems to avoid damage",
                harvest_frequency="Daily during peak production",
                storage_tips="Best eaten fresh. Keep at room temp for 2-3 days.",
                best_harvest_time="Morning or evening"
            ),
            container_suitable=True,
            determinate=False,
            disease_resistant=True
        ),
        CropVariety(
            crop_name="Tomatoes",
            variety_name="Roma",
            description="Classic paste tomato, determinate for easier care",
            days_to_maturity=75,
            growing_season=GrowingSeason.SUMMER,
            difficulty=Difficulty.EASY,
            space_per_plant_sqft=3.0,
            expected_yield_per_plant="8-12 lbs",
            plant_height="3-4 feet",
            plant_spread="2 feet",
            sunlight_needs="Full Sun (6-8 hours)",
            water_needs="Medium",
            soil_preferences="Rich, well-drained, pH 6.0-6.8",
            good_companions=["basil", "marigolds", "carrots"],
            avoid_companions=["brassicas", "corn"],
            common_diseases=["Early Blight", "Fusarium Wilt"],
            care_tips=[
                "Determinate variety - compact growth",
                "Minimal staking needed",
                "Ripens all at once - great for canning",
                "Excellent for containers"
            ],
            harvest_info=HarvestInfo(
                days_to_maturity=75,
                harvest_period_weeks=3,
                peak_production_weeks=[11, 12, 13],
                harvest_technique="Pick when deep red and slightly soft; use for sauce/paste",
                harvest_frequency="Harvest all within 2-week window",
                storage_tips="Store at room temp. Process into sauce within 1 week.",
                best_harvest_time="Morning"
            ),
            container_suitable=True,
            determinate=True,
            disease_resistant=True
        ),
    ],
    
    "lettuce": [
        CropVariety(
            crop_name="Lettuce",
            variety_name="Black Seeded Simpson",
            description="Heat-tolerant leaf lettuce, easy to grow",
            days_to_maturity=45,
            growing_season=GrowingSeason.SPRING_SUMMER,
            difficulty=Difficulty.EASY,
            space_per_plant_sqft=0.25,
            expected_yield_per_plant="0.5-1 lb",
            plant_height="8-10 inches",
            plant_spread="10-12 inches",
            sunlight_needs="Full to Partial Sun (4-6 hours)",
            water_needs="Medium",
            soil_preferences="Rich, well-drained, pH 6.0-7.0",
            good_companions=["carrots", "radishes", "strawberries", "onions"],
            avoid_companions=["brassicas"],
            common_diseases=["Downy Mildew", "Tipburn"],
            care_tips=[
                "Harvest outer leaves for cut-and-come-again",
                "Plant in succession every 2 weeks",
                "Provide afternoon shade in hot weather",
                "Keep soil consistently moist"
            ],
            harvest_info=HarvestInfo(
                days_to_maturity=45,
                harvest_period_weeks=4,
                peak_production_weeks=[7, 8, 9],
                harvest_technique="Cut outer leaves 1 inch above soil; leave center to regrow",
                harvest_frequency="Every 3-5 days",
                storage_tips="Wash and refrigerate in damp towel. Use within 5-7 days.",
                best_harvest_time="Morning for crispest leaves"
            ),
            container_suitable=True,
            cold_tolerant=True
        ),
        CropVariety(
            crop_name="Lettuce",
            variety_name="Buttercrunch",
            description="Crisp butterhead type, heat-tolerant",
            days_to_maturity=55,
            growing_season=GrowingSeason.SPRING_SUMMER,
            difficulty=Difficulty.EASY,
            space_per_plant_sqft=0.5,
            expected_yield_per_plant="1-1.5 lbs",
            plant_height="8 inches",
            plant_spread="12 inches",
            sunlight_needs="Full to Partial Sun (4-6 hours)",
            water_needs="Medium",
            soil_preferences="Rich, moist, pH 6.0-7.0",
            good_companions=["carrots", "radishes", "beets"],
            avoid_companions=["brassicas"],
            common_diseases=["Bottom Rot", "Downy Mildew"],
            care_tips=[
                "Forms loose heads",
                "Very heat-tolerant for a butterhead",
                "Harvest whole head when formed",
                "Excellent flavor and texture"
            ],
            harvest_info=HarvestInfo(
                days_to_maturity=55,
                harvest_period_weeks=2,
                peak_production_weeks=[8, 9],
                harvest_technique="Cut entire head at soil level when firm",
                harvest_frequency="Single harvest per plant",
                storage_tips="Wash, dry, refrigerate. Lasts 7-10 days.",
                best_harvest_time="Morning"
            ),
            container_suitable=True,
            heat_tolerant=True
        ),
    ],
    
    "peppers": [
        CropVariety(
            crop_name="Peppers",
            variety_name="California Wonder",
            description="Classic bell pepper, reliable producer",
            days_to_maturity=75,
            growing_season=GrowingSeason.SUMMER,
            difficulty=Difficulty.MEDIUM,
            space_per_plant_sqft=2.0,
            expected_yield_per_plant="8-10 peppers",
            plant_height="24-30 inches",
            plant_spread="18-24 inches",
            sunlight_needs="Full Sun (6-8 hours)",
            water_needs="Medium",
            soil_preferences="Rich, well-drained, pH 6.0-6.8",
            good_companions=["basil", "onions", "carrots"],
            avoid_companions=["fennel", "kohlrabi"],
            common_diseases=["Bacterial Spot", "Phytophthora Blight"],
            care_tips=[
                "Stake when fruit sets",
                "Harvest first pepper green to encourage more",
                "Allow to ripen to red for sweetness",
                "Sensitive to temperature fluctuations"
            ],
            harvest_info=HarvestInfo(
                days_to_maturity=75,
                harvest_period_weeks=8,
                peak_production_weeks=[12, 13, 14],
                harvest_technique="Cut with pruners leaving 1\" stem; pulling damages plant",
                harvest_frequency="Every 5-7 days",
                storage_tips="Refrigerate in crisper. Lasts 1-2 weeks.",
                best_harvest_time="Morning or evening"
            ),
            container_suitable=True,
            disease_resistant=False
        ),
        CropVariety(
            crop_name="Peppers",
            variety_name="Jalapeño",
            description="Classic hot pepper, very productive",
            days_to_maturity=70,
            growing_season=GrowingSeason.SUMMER,
            difficulty=Difficulty.EASY,
            space_per_plant_sqft=2.0,
            expected_yield_per_plant="25-35 peppers",
            plant_height="24-36 inches",
            plant_spread="18 inches",
            sunlight_needs="Full Sun (6-8 hours)",
            water_needs="Medium",
            soil_preferences="Rich, well-drained, pH 6.0-6.8",
            good_companions=["basil", "tomatoes", "carrots"],
            avoid_companions=["fennel"],
            common_diseases=["Bacterial Spot", "Anthracnose"],
            care_tips=[
                "Very prolific producer",
                "Harvest green or allow to ripen red",
                "Support plants when heavily laden",
                "Great for containers"
            ],
            harvest_info=HarvestInfo(
                days_to_maturity=70,
                harvest_period_weeks=10,
                peak_production_weeks=[11, 12, 13, 14, 15],
                harvest_technique="Cut with pruners; harvest green for mild, red for hot and sweet",
                harvest_frequency="Every 3-4 days during peak",
                storage_tips="Refrigerate fresh for 1 week. Freeze, pickle, or dry for long-term.",
                best_harvest_time="Anytime"
            ),
            container_suitable=True,
            heat_tolerant=True
        ),
    ],
    
    # CUCURBITS
    "cucumbers": [
        CropVariety(
            crop_name="Cucumbers",
            variety_name="Marketmore 76",
            description="Classic slicing cucumber, disease resistant",
            days_to_maturity=68,
            growing_season=GrowingSeason.SUMMER,
            difficulty=Difficulty.EASY,
            space_per_plant_sqft=2.0,
            expected_yield_per_plant="10-15 cucumbers",
            plant_height="Vine 6+ feet",
            plant_spread="Sprawling or trellised",
            sunlight_needs="Full Sun (6-8 hours)",
            water_needs="High",
            soil_preferences="Rich, well-drained, pH 6.0-7.0",
            good_companions=["beans", "peas", "radishes", "corn"],
            avoid_companions=["sage", "aromatic herbs"],
            common_diseases=["Powdery Mildew", "Downy Mildew"],
            care_tips=[
                "Trellis for space savings and straighter fruit",
                "Pick frequently to encourage production",
                "Water consistently - stress causes bitterness"
            ],
            harvest_info=HarvestInfo(
                days_to_maturity=68,
                harvest_period_weeks=6,
                peak_production_weeks=[10, 11, 12],
                harvest_technique="Cut with pruners; harvest at 6-8 inches for best flavor",
                harvest_frequency="Every 1-2 days during peak",
                storage_tips="Refrigerate for up to 1 week",
                best_harvest_time="Morning"
            ),
            container_suitable=True,
            disease_resistant=True
        ),
        CropVariety(
            crop_name="Cucumbers",
            variety_name="Lemon",
            description="Round yellow heirloom cucumber",
            days_to_maturity=65,
            growing_season=GrowingSeason.SUMMER,
            difficulty=Difficulty.EASY,
            space_per_plant_sqft=2.0,
            expected_yield_per_plant="15-20 cucumbers",
            plant_height="Vine 5-6 feet",
            plant_spread="Sprawling",
            sunlight_needs="Full Sun (6-8 hours)",
            water_needs="High",
            soil_preferences="Rich, pH 6.0-7.0",
            good_companions=["beans", "peas", "corn"],
            avoid_companions=["sage"],
            common_diseases=["Powdery Mildew"],
            care_tips=["Pick when lemon-sized", "Mild sweet flavor", "Great for salads"],
            harvest_info=HarvestInfo(
                days_to_maturity=65,
                harvest_period_weeks=5,
                peak_production_weeks=[10, 11],
                harvest_technique="Pick when yellow and tennis ball sized",
                harvest_frequency="Daily",
                storage_tips="Refrigerate for 1 week",
                best_harvest_time="Morning"
            ),
            container_suitable=True,
            heirloom=True
        ),
    ],
    
    "zucchini": [
        CropVariety(
            crop_name="Zucchini",
            variety_name="Black Beauty",
            description="Prolific dark green zucchini",
            days_to_maturity=50,
            growing_season=GrowingSeason.SUMMER,
            difficulty=Difficulty.EASY,
            space_per_plant_sqft=9.0,
            expected_yield_per_plant="15-20 lbs",
            plant_height="24-36 inches",
            plant_spread="3-4 feet",
            sunlight_needs="Full Sun (6-8 hours)",
            water_needs="Medium-High",
            soil_preferences="Rich, well-drained, pH 6.0-7.5",
            good_companions=["beans", "corn", "peas"],
            avoid_companions=["potatoes"],
            common_diseases=["Powdery Mildew", "Bacterial Wilt"],
            care_tips=[
                "Harvest when 6-8 inches for best flavor",
                "One plant feeds a family",
                "Check daily during peak production"
            ],
            harvest_info=HarvestInfo(
                days_to_maturity=50,
                harvest_period_weeks=8,
                peak_production_weeks=[8, 9, 10, 11],
                harvest_technique="Cut at stem with knife; check daily",
                harvest_frequency="Daily during peak",
                storage_tips="Refrigerate for 1-2 weeks",
                best_harvest_time="Morning"
            ),
            container_suitable=False,
            heat_tolerant=True
        ),
    ],
    
    # BEANS
    "beans": [
        CropVariety(
            crop_name="Beans",
            variety_name="Blue Lake Bush",
            description="Classic green bean, bush type",
            days_to_maturity=55,
            growing_season=GrowingSeason.SUMMER,
            difficulty=Difficulty.EASY,
            space_per_plant_sqft=0.25,
            expected_yield_per_plant="0.5-1 lb",
            plant_height="18-24 inches",
            plant_spread="12 inches",
            sunlight_needs="Full Sun (6-8 hours)",
            water_needs="Medium",
            soil_preferences="Well-drained, pH 6.0-7.0",
            good_companions=["carrots", "cucumbers", "corn"],
            avoid_companions=["onions", "garlic"],
            common_diseases=["Bean Rust", "Anthracnose"],
            care_tips=[
                "Plant after soil warms to 60°F",
                "Bush type - no staking needed",
                "Pick frequently for continuous production"
            ],
            harvest_info=HarvestInfo(
                days_to_maturity=55,
                harvest_period_weeks=3,
                peak_production_weeks=[8, 9, 10],
                harvest_technique="Pick when pods snap crisply",
                harvest_frequency="Every 2-3 days",
                storage_tips="Refrigerate for 1 week or blanch and freeze",
                best_harvest_time="Morning"
            ),
            container_suitable=True,
            cold_tolerant=False
        ),
        CropVariety(
            crop_name="Beans",
            variety_name="Kentucky Wonder Pole",
            description="Heirloom pole bean, very productive",
            days_to_maturity=65,
            growing_season=GrowingSeason.SUMMER,
            difficulty=Difficulty.EASY,
            space_per_plant_sqft=0.5,
            expected_yield_per_plant="2-3 lbs",
            plant_height="6-8 feet",
            plant_spread="6 inches",
            sunlight_needs="Full Sun (6-8 hours)",
            water_needs="Medium",
            soil_preferences="Well-drained, pH 6.0-7.0",
            good_companions=["corn", "squash", "cucumbers"],
            avoid_companions=["onions", "garlic"],
            common_diseases=["Bean Rust"],
            care_tips=["Needs trellis support", "More productive than bush", "Longer harvest period"],
            harvest_info=HarvestInfo(
                days_to_maturity=65,
                harvest_period_weeks=6,
                peak_production_weeks=[10, 11, 12, 13],
                harvest_technique="Pick when pods are full but beans not bulging",
                harvest_frequency="Every 2-3 days",
                storage_tips="Refrigerate or freeze",
                best_harvest_time="Morning"
            ),
            container_suitable=False,
            heirloom=True
        ),
        CropVariety(
            crop_name="Beans",
            variety_name="Provider Bush",
            description="Early, cold-tolerant green bean",
            days_to_maturity=50,
            growing_season=GrowingSeason.SPRING_SUMMER,
            difficulty=Difficulty.EASY,
            space_per_plant_sqft=0.25,
            expected_yield_per_plant="0.75-1 lb",
            plant_height="18 inches",
            plant_spread="12 inches",
            sunlight_needs="Full Sun (6 hours)",
            water_needs="Medium",
            soil_preferences="Well-drained, pH 6.0-7.0",
            good_companions=["carrots", "cucumbers"],
            avoid_companions=["onions"],
            common_diseases=["Bean Rust"],
            care_tips=["Cold tolerant - plant early", "Compact bush", "Excellent for succession planting"],
            harvest_info=HarvestInfo(
                days_to_maturity=50,
                harvest_period_weeks=3,
                peak_production_weeks=[7, 8, 9],
                harvest_technique="Pick when tender",
                harvest_frequency="Every 2 days",
                storage_tips="Best fresh, freeze for storage",
                best_harvest_time="Morning"
            ),
            container_suitable=True,
            cold_tolerant=True
        ),
    ],
    
    # ROOT VEGETABLES
    "carrots": [
        CropVariety(
            crop_name="Carrots",
            variety_name="Nantes",
            description="Sweet, cylindrical carrots",
            days_to_maturity=70,
            growing_season=GrowingSeason.SPRING_SUMMER,
            difficulty=Difficulty.MEDIUM,
            space_per_plant_sqft=0.06,
            expected_yield_per_plant="1 carrot (4-6 oz)",
            plant_height="6-8 inches foliage",
            plant_spread="2 inches",
            sunlight_needs="Full to Partial Sun",
            water_needs="Medium",
            soil_preferences="Loose, sandy, pH 6.0-6.8",
            good_companions=["tomatoes", "onions", "lettuce"],
            avoid_companions=["dill", "parsnips"],
            common_diseases=["Alternaria Leaf Blight"],
            care_tips=[
                "Need deep, loose soil for straight roots",
                "Thin to 2 inches apart",
                "Keep soil moist for germination"
            ],
            harvest_info=HarvestInfo(
                days_to_maturity=70,
                harvest_period_weeks=2,
                peak_production_weeks=[10, 11],
                harvest_technique="Pull when 1/2-3/4 inch diameter",
                harvest_frequency="Harvest all at once or as needed",
                storage_tips="Remove tops, refrigerate for months",
                best_harvest_time="Anytime"
            ),
            container_suitable=True,
            cold_tolerant=True
        ),
        CropVariety(
            crop_name="Carrots",
            variety_name="Danvers Half Long",
            description="Medium length, good for heavy soil",
            days_to_maturity=75,
            growing_season=GrowingSeason.SPRING_SUMMER,
            difficulty=Difficulty.MEDIUM,
            space_per_plant_sqft=0.06,
            expected_yield_per_plant="1 carrot (6-8 oz)",
            plant_height="8-10 inches foliage",
            plant_spread="2 inches",
            sunlight_needs="Full Sun",
            water_needs="Medium",
            soil_preferences="Well-drained, pH 6.0-6.8",
            good_companions=["tomatoes", "onions"],
            avoid_companions=["dill"],
            common_diseases=["Alternaria Leaf Blight"],
            care_tips=["Tolerates heavier soil than Nantes", "Great storage variety"],
            harvest_info=HarvestInfo(
                days_to_maturity=75,
                harvest_period_weeks=3,
                peak_production_weeks=[11, 12],
                harvest_technique="Pull when orange and thick",
                harvest_frequency="Harvest as needed",
                storage_tips="Stores excellently for months",
                best_harvest_time="Anytime"
            ),
            container_suitable=False,
            cold_tolerant=True
        ),
    ],
    
    "radishes": [
        CropVariety(
            crop_name="Radishes",
            variety_name="Cherry Belle",
            description="Fast-growing, round red radish",
            days_to_maturity=25,
            growing_season=GrowingSeason.SPRING_SUMMER,
            difficulty=Difficulty.EASY,
            space_per_plant_sqft=0.06,
            expected_yield_per_plant="1 radish",
            plant_height="6 inches",
            plant_spread="2 inches",
            sunlight_needs="Full to Partial Sun",
            water_needs="Medium",
            soil_preferences="Loose, well-drained, pH 6.0-7.0",
            good_companions=["lettuce", "peas", "cucumbers"],
            avoid_companions=["hyssop"],
            common_diseases=["Few issues"],
            care_tips=[
                "One of the fastest vegetables",
                "Plant every 10 days for continuous harvest",
                "Cool weather crop - bolt in heat"
            ],
            harvest_info=HarvestInfo(
                days_to_maturity=25,
                harvest_period_weeks=1,
                peak_production_weeks=[4],
                harvest_technique="Pull when 1 inch diameter",
                harvest_frequency="Harvest all at once",
                storage_tips="Remove tops, refrigerate for 2 weeks",
                best_harvest_time="Morning"
            ),
            container_suitable=True,
            cold_tolerant=True
        ),
    ],
    
    # BRASSICAS
    "broccoli": [
        CropVariety(
            crop_name="Broccoli",
            variety_name="Calabrese",
            description="Large central head plus side shoots",
            days_to_maturity=60,
            growing_season=GrowingSeason.SPRING_SUMMER,
            difficulty=Difficulty.MEDIUM,
            space_per_plant_sqft=1.5,
            expected_yield_per_plant="1-2 lbs",
            plant_height="24-30 inches",
            plant_spread="18-24 inches",
            sunlight_needs="Full Sun (6 hours)",
            water_needs="Medium-High",
            soil_preferences="Rich, pH 6.0-7.0",
            good_companions=["onions", "potatoes", "herbs"],
            avoid_companions=["tomatoes", "strawberries"],
            common_diseases=["Clubroot", "Downy Mildew"],
            care_tips=[
                "Cool season crop",
                "Cut main head before flowers open",
                "Side shoots produce after main harvest"
            ],
            harvest_info=HarvestInfo(
                days_to_maturity=60,
                harvest_period_weeks=4,
                peak_production_weeks=[9, 10],
                harvest_technique="Cut head with 5-6 inches of stem",
                harvest_frequency="Main head once, side shoots weekly",
                storage_tips="Refrigerate for 1-2 weeks",
                best_harvest_time="Morning"
            ),
            container_suitable=False,
            cold_tolerant=True
        ),
    ],
    
    "kale": [
        CropVariety(
            crop_name="Kale",
            variety_name="Lacinato (Dinosaur)",
            description="Dark blue-green, textured leaves",
            days_to_maturity=60,
            growing_season=GrowingSeason.FALL_WINTER,
            difficulty=Difficulty.EASY,
            space_per_plant_sqft=1.0,
            expected_yield_per_plant="2-3 lbs",
            plant_height="24-36 inches",
            plant_spread="18 inches",
            sunlight_needs="Full to Partial Sun",
            water_needs="Medium",
            soil_preferences="Rich, pH 6.0-7.5",
            good_companions=["onions", "beets", "potatoes"],
            avoid_companions=["tomatoes", "strawberries"],
            common_diseases=["Downy Mildew", "Alternaria Leaf Spot"],
            care_tips=[
                "Frost improves flavor",
                "Harvest outer leaves",
                "Very cold hardy"
            ],
            harvest_info=HarvestInfo(
                days_to_maturity=60,
                harvest_period_weeks=12,
                peak_production_weeks=[9, 10, 11, 12, 13, 14],
                harvest_technique="Cut outer leaves, leave center growing",
                harvest_frequency="Weekly",
                storage_tips="Refrigerate for 1 week",
                best_harvest_time="Morning"
            ),
            container_suitable=True,
            cold_tolerant=True
        ),
    ],
    
    # ALLIUMS
    "onions": [
        CropVariety(
            crop_name="Onions",
            variety_name="Red Wethersfield",
            description="Large red storage onion",
            days_to_maturity=110,
            growing_season=GrowingSeason.SPRING_SUMMER,
            difficulty=Difficulty.MEDIUM,
            space_per_plant_sqft=0.25,
            expected_yield_per_plant="1 onion (8-12 oz)",
            plant_height="12-18 inches",
            plant_spread="4 inches",
            sunlight_needs="Full Sun (6+ hours)",
            water_needs="Medium",
            soil_preferences="Loose, rich, pH 6.0-7.0",
            good_companions=["carrots", "tomatoes", "lettuce"],
            avoid_companions=["beans", "peas"],
            common_diseases=["Downy Mildew", "Botrytis Neck Rot"],
            care_tips=[
                "Plant sets or transplants in early spring",
                "Stop watering when tops fall over",
                "Cure before storage"
            ],
            harvest_info=HarvestInfo(
                days_to_maturity=110,
                harvest_period_weeks=2,
                peak_production_weeks=[16, 17],
                harvest_technique="Pull when tops fall over naturally",
                harvest_frequency="Single harvest",
                storage_tips="Cure 2 weeks, store in cool dry place for months",
                best_harvest_time="Dry day"
            ),
            container_suitable=False,
            cold_tolerant=True
        ),
    ],
    
    # HERBS
    "basil": [
        CropVariety(
            crop_name="Basil",
            variety_name="Genovese",
            description="Classic Italian basil, aromatic",
            days_to_maturity=68,
            growing_season=GrowingSeason.SUMMER,
            difficulty=Difficulty.EASY,
            space_per_plant_sqft=1.0,
            expected_yield_per_plant="1-2 lbs leaves",
            plant_height="18-24 inches",
            plant_spread="12-18 inches",
            sunlight_needs="Full Sun (6-8 hours)",
            water_needs="Medium",
            soil_preferences="Rich, well-drained, pH 6.0-7.5",
            good_companions=["tomatoes", "peppers", "asparagus"],
            avoid_companions=["rue", "sage"],
            common_diseases=["Fusarium Wilt", "Downy Mildew"],
            care_tips=[
                "Pinch flowers to encourage bushy growth",
                "Harvest frequently",
                "Sensitive to cold"
            ],
            harvest_info=HarvestInfo(
                days_to_maturity=68,
                harvest_period_weeks=12,
                peak_production_weeks=[10, 11, 12, 13],
                harvest_technique="Cut stems above a leaf node",
                harvest_frequency="Every 1-2 weeks",
                storage_tips="Use fresh, freeze in oil, or dry",
                best_harvest_time="Morning after dew dries"
            ),
            container_suitable=True,
            heat_tolerant=True
        ),
    ],
    
    "cilantro": [
        CropVariety(
            crop_name="Cilantro",
            variety_name="Slow Bolt",
            description="Heat-tolerant cilantro",
            days_to_maturity=50,
            growing_season=GrowingSeason.SPRING_SUMMER,
            difficulty=Difficulty.EASY,
            space_per_plant_sqft=0.25,
            expected_yield_per_plant="4-6 oz leaves",
            plant_height="12-18 inches",
            plant_spread="8-10 inches",
            sunlight_needs="Full to Partial Sun",
            water_needs="Medium",
            soil_preferences="Well-drained, pH 6.0-7.0",
            good_companions=["spinach", "legumes", "tomatoes"],
            avoid_companions=["fennel"],
            common_diseases=["Few issues"],
            care_tips=[
                "Succession plant every 2-3 weeks",
                "Harvest before flowering",
                "Let some bolt for coriander seeds"
            ],
            harvest_info=HarvestInfo(
                days_to_maturity=50,
                harvest_period_weeks=3,
                peak_production_weeks=[7, 8, 9],
                harvest_technique="Cut outer leaves or pull whole plant",
                harvest_frequency="Weekly",
                storage_tips="Refrigerate stems in water for 1 week",
                best_harvest_time="Morning"
            ),
            container_suitable=True,
            cold_tolerant=True
        ),
    ],
    
    "parsley": [
        CropVariety(
            crop_name="Parsley",
            variety_name="Italian Flat Leaf",
            description="Flavorful, easier to chop than curly",
            days_to_maturity=75,
            growing_season=GrowingSeason.SPRING_SUMMER,
            difficulty=Difficulty.EASY,
            space_per_plant_sqft=0.5,
            expected_yield_per_plant="6-8 oz",
            plant_height="12-18 inches",
            plant_spread="10-12 inches",
            sunlight_needs="Full to Partial Sun",
            water_needs="Medium",
            soil_preferences="Rich, pH 6.0-7.0",
            good_companions=["tomatoes", "asparagus", "carrots"],
            avoid_companions=["mint"],
            common_diseases=["Few issues"],
            care_tips=["Biennial - grows for 2 seasons", "Harvest outer stems first"],
            harvest_info=HarvestInfo(
                days_to_maturity=75,
                harvest_period_weeks=20,
                peak_production_weeks=[11, 12, 13, 14],
                harvest_technique="Cut outer stems at base",
                harvest_frequency="Weekly",
                storage_tips="Refrigerate stems in water for 2 weeks",
                best_harvest_time="Morning"
            ),
            container_suitable=True,
            cold_tolerant=True
        ),
    ],
    
    # MORE NIGHTSHADES
    "eggplant": [
        CropVariety(
            crop_name="Eggplant",
            variety_name="Black Beauty",
            description="Large purple globe eggplant",
            days_to_maturity=80,
            growing_season=GrowingSeason.SUMMER,
            difficulty=Difficulty.MEDIUM,
            space_per_plant_sqft=4.0,
            expected_yield_per_plant="4-6 fruits",
            plant_height="24-36 inches",
            plant_spread="24 inches",
            sunlight_needs="Full Sun (6-8 hours)",
            water_needs="Medium-High",
            soil_preferences="Rich, well-drained, pH 5.5-6.5",
            good_companions=["beans", "peppers", "thyme"],
            avoid_companions=["fennel"],
            common_diseases=["Verticillium Wilt", "Phytophthora Blight"],
            care_tips=["Needs warm soil to thrive", "Stake for support"],
            harvest_info=HarvestInfo(
                days_to_maturity=80,
                harvest_period_weeks=8,
                peak_production_weeks=[12, 13, 14],
                harvest_technique="Cut with pruners leaving 1 inch stem",
                harvest_frequency="Every 5-7 days",
                storage_tips="Refrigerate for 1 week",
                best_harvest_time="Morning"
            ),
            container_suitable=True,
            heat_tolerant=True
        ),
    ],
    
    # LEAFY GREENS
    "spinach": [
        CropVariety(
            crop_name="Spinach",
            variety_name="Bloomsdale",
            description="Savoy-leafed spinach, cold hardy",
            days_to_maturity=45,
            growing_season=GrowingSeason.SPRING_SUMMER,
            difficulty=Difficulty.EASY,
            space_per_plant_sqft=0.25,
            expected_yield_per_plant="4-6 oz",
            plant_height="6-8 inches",
            plant_spread="8-10 inches",
            sunlight_needs="Full to Partial Sun",
            water_needs="Medium",
            soil_preferences="Rich, pH 6.5-7.0",
            good_companions=["strawberries", "peas", "beans"],
            avoid_companions=["fennel"],
            common_diseases=["Downy Mildew", "White Rust"],
            care_tips=["Cool season crop", "Bolts in heat", "Succession plant"],
            harvest_info=HarvestInfo(
                days_to_maturity=45,
                harvest_period_weeks=3,
                peak_production_weeks=[7, 8, 9],
                harvest_technique="Cut outer leaves or harvest whole plant",
                harvest_frequency="Every 5-7 days",
                storage_tips="Refrigerate for 1 week",
                best_harvest_time="Morning"
            ),
            container_suitable=True,
            cold_tolerant=True
        ),
    ],
    
    "arugula": [
        CropVariety(
            crop_name="Arugula",
            variety_name="Astro",
            description="Mild, slow-bolting arugula",
            days_to_maturity=38,
            growing_season=GrowingSeason.SPRING_SUMMER,
            difficulty=Difficulty.EASY,
            space_per_plant_sqft=0.1,
            expected_yield_per_plant="2-4 oz",
            plant_height="6-8 inches",
            plant_spread="6-8 inches",
            sunlight_needs="Full to Partial Sun",
            water_needs="Medium",
            soil_preferences="Well-drained, pH 6.0-7.0",
            good_companions=["lettuce", "spinach", "radishes"],
            avoid_companions=["None known"],
            common_diseases=["Flea beetles"],
            care_tips=["Fast growing", "Succession plant every 2 weeks", "Cool season"],
            harvest_info=HarvestInfo(
                days_to_maturity=38,
                harvest_period_weeks=3,
                peak_production_weeks=[6, 7, 8],
                harvest_technique="Cut and come again",
                harvest_frequency="Weekly",
                storage_tips="Refrigerate for 3-5 days",
                best_harvest_time="Morning"
            ),
            container_suitable=True,
            cold_tolerant=True
        ),
    ],
    
    "swiss_chard": [
        CropVariety(
            crop_name="Swiss Chard",
            variety_name="Bright Lights",
            description="Colorful stems, heat tolerant",
            days_to_maturity=55,
            growing_season=GrowingSeason.SPRING_SUMMER,
            difficulty=Difficulty.EASY,
            space_per_plant_sqft=1.0,
            expected_yield_per_plant="2-3 lbs",
            plant_height="18-24 inches",
            plant_spread="12-18 inches",
            sunlight_needs="Full to Partial Sun",
            water_needs="Medium",
            soil_preferences="Rich, pH 6.0-7.5",
            good_companions=["beans", "brassicas", "onions"],
            avoid_companions=["corn", "cucumbers"],
            common_diseases=["Leaf miners"],
            care_tips=["Cut and come again", "Very productive", "Tolerates heat"],
            harvest_info=HarvestInfo(
                days_to_maturity=55,
                harvest_period_weeks=12,
                peak_production_weeks=[8, 9, 10, 11, 12],
                harvest_technique="Cut outer leaves at base",
                harvest_frequency="Weekly",
                storage_tips="Refrigerate for 1 week",
                best_harvest_time="Morning"
            ),
            container_suitable=True,
            heat_tolerant=True
        ),
    ],
    
    # MORE LEGUMES  
    "peas": [
        CropVariety(
            crop_name="Peas",
            variety_name="Sugar Snap",
            description="Edible pod peas, sweet and crunchy",
            days_to_maturity=60,
            growing_season=GrowingSeason.SPRING,
            difficulty=Difficulty.EASY,
            space_per_plant_sqft=0.25,
            expected_yield_per_plant="0.5-1 lb",
            plant_height="5-6 feet",
            plant_spread="6 inches",
            sunlight_needs="Full Sun (6 hours)",
            water_needs="Medium",
            soil_preferences="Well-drained, pH 6.0-7.5",
            good_companions=["carrots", "radishes", "cucumbers"],
            avoid_companions=["onions", "garlic"],
            common_diseases=["Powdery Mildew", "Root Rot"],
            care_tips=["Need trellis support", "Plant early spring", "Cool season"],
            harvest_info=HarvestInfo(
                days_to_maturity=60,
                harvest_period_weeks=3,
                peak_production_weeks=[9, 10, 11],
                harvest_technique="Pick when pods are plump",
                harvest_frequency="Every 2-3 days",
                storage_tips="Refrigerate for 1 week or blanch and freeze",
                best_harvest_time="Morning"
            ),
            container_suitable=False,
            cold_tolerant=True
        ),
    ],
    
    # MORE BRASSICAS
    "cabbage": [
        CropVariety(
            crop_name="Cabbage",
            variety_name="Golden Acre",
            description="Small, early green cabbage",
            days_to_maturity=65,
            growing_season=GrowingSeason.SPRING_SUMMER,
            difficulty=Difficulty.MEDIUM,
            space_per_plant_sqft=1.5,
            expected_yield_per_plant="2-3 lbs",
            plant_height="12 inches",
            plant_spread="18 inches",
            sunlight_needs="Full Sun (6 hours)",
            water_needs="Medium-High",
            soil_preferences="Rich, pH 6.0-7.5",
            good_companions=["onions", "potatoes", "celery"],
            avoid_companions=["tomatoes", "strawberries"],
            common_diseases=["Clubroot", "Black Rot"],
            care_tips=["Cool season crop", "Consistent watering prevents splitting"],
            harvest_info=HarvestInfo(
                days_to_maturity=65,
                harvest_period_weeks=2,
                peak_production_weeks=[10, 11],
                harvest_technique="Cut at base when head is firm",
                harvest_frequency="Single harvest",
                storage_tips="Refrigerate for 3-4 weeks",
                best_harvest_time="Morning"
            ),
            container_suitable=False,
            cold_tolerant=True
        ),
    ],
    
    "cauliflower": [
        CropVariety(
            crop_name="Cauliflower",
            variety_name="Snowball",
            description="White, compact heads",
            days_to_maturity=75,
            growing_season=GrowingSeason.SPRING_SUMMER,
            difficulty=Difficulty.HARD,
            space_per_plant_sqft=2.0,
            expected_yield_per_plant="1-2 lbs",
            plant_height="18-24 inches",
            plant_spread="24 inches",
            sunlight_needs="Full Sun (6 hours)",
            water_needs="High",
            soil_preferences="Rich, pH 6.0-7.0",
            good_companions=["beans", "celery", "onions"],
            avoid_companions=["tomatoes", "strawberries"],
            common_diseases=["Clubroot", "Black Rot"],
            care_tips=["Challenging to grow", "Needs consistent conditions", "Tie leaves over head to blanch"],
            harvest_info=HarvestInfo(
                days_to_maturity=75,
                harvest_period_weeks=1,
                peak_production_weeks=[11],
                harvest_technique="Cut head when compact and white",
                harvest_frequency="Single harvest",
                storage_tips="Refrigerate for 1 week",
                best_harvest_time="Morning"
            ),
            container_suitable=False,
            cold_tolerant=True
        ),
    ],
    
    # MORE ROOT VEGETABLES
    "beets": [
        CropVariety(
            crop_name="Beets",
            variety_name="Detroit Dark Red",
            description="Classic deep red beets",
            days_to_maturity=60,
            growing_season=GrowingSeason.SPRING_SUMMER,
            difficulty=Difficulty.EASY,
            space_per_plant_sqft=0.25,
            expected_yield_per_plant="1 beet (4-6 oz)",
            plant_height="12 inches foliage",
            plant_spread="3 inches",
            sunlight_needs="Full to Partial Sun",
            water_needs="Medium",
            soil_preferences="Loose, pH 6.0-7.5",
            good_companions=["onions", "lettuce", "brassicas"],
            avoid_companions=["pole beans"],
            common_diseases=["Few issues"],
            care_tips=["Greens are edible too", "Thin seedlings to 3 inches"],
            harvest_info=HarvestInfo(
                days_to_maturity=60,
                harvest_period_weeks=2,
                peak_production_weeks=[9, 10],
                harvest_technique="Pull when 1.5-3 inches diameter",
                harvest_frequency="Harvest as needed",
                storage_tips="Remove greens, refrigerate for months",
                best_harvest_time="Anytime"
            ),
            container_suitable=True,
            cold_tolerant=True
        ),
    ],
    
    "turnips": [
        CropVariety(
            crop_name="Turnips",
            variety_name="Purple Top White Globe",
            description="Sweet, mild turnips",
            days_to_maturity=55,
            growing_season=GrowingSeason.SPRING_SUMMER,
            difficulty=Difficulty.EASY,
            space_per_plant_sqft=0.25,
            expected_yield_per_plant="1 turnip (4-8 oz)",
            plant_height="12 inches foliage",
            plant_spread="4 inches",
            sunlight_needs="Full to Partial Sun",
            water_needs="Medium",
            soil_preferences="Well-drained, pH 6.0-7.5",
            good_companions=["peas", "beans", "brussels sprouts"],
            avoid_companions=["potatoes"],
            common_diseases=["Few issues"],
            care_tips=["Fast growing", "Greens are edible", "Cool season"],
            harvest_info=HarvestInfo(
                days_to_maturity=55,
                harvest_period_weeks=2,
                peak_production_weeks=[8, 9],
                harvest_technique="Pull when 2-3 inches diameter",
                harvest_frequency="Harvest all at once",
                storage_tips="Remove greens, refrigerate for months",
                best_harvest_time="Anytime"
            ),
            container_suitable=True,
            cold_tolerant=True
        ),
    ],
    
    # SQUASH/MELONS
    "squash": [
        CropVariety(
            crop_name="Squash",
            variety_name="Butternut",
            description="Sweet winter squash, stores well",
            days_to_maturity=95,
            growing_season=GrowingSeason.SUMMER,
            difficulty=Difficulty.MEDIUM,
            space_per_plant_sqft=9.0,
            expected_yield_per_plant="3-5 fruits (8-12 lbs)",
            plant_height="Vine 10+ feet",
            plant_spread="Sprawling",
            sunlight_needs="Full Sun (6-8 hours)",
            water_needs="Medium-High",
            soil_preferences="Rich, well-drained, pH 6.0-7.0",
            good_companions=["beans", "corn", "peas"],
            avoid_companions=["potatoes"],
            common_diseases=["Powdery Mildew", "Vine Borers"],
            care_tips=["Needs lots of space", "Harvest when skin is hard", "Cure before storage"],
            harvest_info=HarvestInfo(
                days_to_maturity=95,
                harvest_period_weeks=2,
                peak_production_weeks=[14, 15],
                harvest_technique="Cut with 2 inches of stem before frost",
                harvest_frequency="Single harvest",
                storage_tips="Cure 10 days, store cool/dry for months",
                best_harvest_time="Anytime"
            ),
            container_suitable=False,
            heat_tolerant=True
        ),
    ],
    
    "melons": [
        CropVariety(
            crop_name="Melons",
            variety_name="Sugar Baby Watermelon",
            description="Small, sweet watermelon",
            days_to_maturity=80,
            growing_season=GrowingSeason.SUMMER,
            difficulty=Difficulty.MEDIUM,
            space_per_plant_sqft=16.0,
            expected_yield_per_plant="2-4 melons (8-10 lbs each)",
            plant_height="Vine 10+ feet",
            plant_spread="Sprawling",
            sunlight_needs="Full Sun (8+ hours)",
            water_needs="High",
            soil_preferences="Sandy, well-drained, pH 6.0-7.0",
            good_companions=["corn", "beans", "radishes"],
            avoid_companions=["None known"],
            common_diseases=["Fusarium Wilt", "Anthracnose"],
            care_tips=["Needs hot weather", "Test ripeness by thumping", "Mulch under fruit"],
            harvest_info=HarvestInfo(
                days_to_maturity=80,
                harvest_period_weeks=2,
                peak_production_weeks=[12, 13],
                harvest_technique="Cut when tendril nearest fruit is brown",
                harvest_frequency="Check daily",
                storage_tips="Use within 2 weeks",
                best_harvest_time="Morning"
            ),
            container_suitable=False,
            heat_tolerant=True
        ),
    ],
    
    # ASIAN VEGETABLES
    "bok_choy": [
        CropVariety(
            crop_name="Bok Choy",
            variety_name="Joi Choi",
            description="White-stemmed Chinese cabbage",
            days_to_maturity=50,
            growing_season=GrowingSeason.SPRING_SUMMER,
            difficulty=Difficulty.EASY,
            space_per_plant_sqft=1.0,
            expected_yield_per_plant="1 head (1-2 lbs)",
            plant_height="12-18 inches",
            plant_spread="12 inches",
            sunlight_needs="Full to Partial Sun",
            water_needs="Medium-High",
            soil_preferences="Rich, pH 6.0-7.5",
            good_companions=["beans", "onions", "potatoes"],
            avoid_companions=["tomatoes", "strawberries"],
            common_diseases=["Clubroot", "Flea beetles"],
            care_tips=["Cool season crop", "Fast growing", "Harvest before bolting"],
            harvest_info=HarvestInfo(
                days_to_maturity=50,
                harvest_period_weeks=2,
                peak_production_weeks=[7, 8],
                harvest_technique="Cut at base when mature",
                harvest_frequency="Single harvest",
                storage_tips="Refrigerate for 1 week",
                best_harvest_time="Morning"
            ),
            container_suitable=True,
            cold_tolerant=True
        ),
    ],
    
    # MORE CROPS - Quick additions for diversity
    "corn": [CropVariety(crop_name="Corn", variety_name="Silver Queen", description="Sweet white corn", days_to_maturity=92, growing_season=GrowingSeason.SUMMER, difficulty=Difficulty.MEDIUM, space_per_plant_sqft=1.0, expected_yield_per_plant="2-3 ears", plant_height="6-7 feet", plant_spread="12 inches", sunlight_needs="Full Sun", water_needs="High", soil_preferences="Rich, pH 6.0-6.8", good_companions=["beans", "squash", "peas"], avoid_companions=["tomatoes"], common_diseases=["Common Rust", "Stewart's Wilt"], care_tips=["Plant in blocks for pollination"], harvest_info=HarvestInfo(90, 2, [13, 14], "Pick when kernels are milky", "Check daily", "Use within 2 days", "Morning"), container_suitable=False, heat_tolerant=True)],
    
    "potatoes": [CropVariety(crop_name="Potatoes", variety_name="Yukon Gold", description="Yellow flesh, all-purpose", days_to_maturity=90, growing_season=GrowingSeason.SPRING_SUMMER, difficulty=Difficulty.MEDIUM, space_per_plant_sqft=2.0, expected_yield_per_plant="2-3 lbs", plant_height="24 inches", plant_spread="18 inches", sunlight_needs="Full Sun", water_needs="Medium", soil_preferences="Loose, acidic, pH 5.0-6.0", good_companions=["beans", "corn", "cabbage"], avoid_companions=["tomatoes", "cucumbers"], common_diseases=["Early Blight", "Late Blight", "Scab"], care_tips=["Hill soil around plants", "Harvest when foliage dies"], harvest_info=HarvestInfo(90, 2, [13, 14], "Dig carefully with fork", "Single harvest", "Cure before storing", "Dry day"), container_suitable=False)],
    
    "sweet_potatoes": [CropVariety(crop_name="Sweet Potatoes", variety_name="Beauregard", description="Orange flesh, high yield", days_to_maturity=100, growing_season=GrowingSeason.SUMMER, difficulty=Difficulty.MEDIUM, space_per_plant_sqft=4.0, expected_yield_per_plant="3-5 lbs", plant_height="12 inches", plant_spread="4+ feet", sunlight_needs="Full Sun", water_needs="Medium", soil_preferences="Sandy, pH 5.0-6.5", good_companions=["herbs", "flowers"], avoid_companions=["squash"], common_diseases=["Few issues"], care_tips=["Needs long hot season", "Cure before storage"], harvest_info=HarvestInfo(100, 1, [14], "Dig before frost", "Single harvest", "Cure 10 days at 80°F", "Before frost"), container_suitable=False, heat_tolerant=True)],
    
    "garlic": [CropVariety(crop_name="Garlic", variety_name="German Extra Hardy", description="Cold hardy softneck", days_to_maturity=240, growing_season=GrowingSeason.FALL_WINTER, difficulty=Difficulty.EASY, space_per_plant_sqft=0.25, expected_yield_per_plant="1 bulb (8-12 cloves)", plant_height="18-24 inches", plant_spread="6 inches", sunlight_needs="Full Sun", water_needs="Medium", soil_preferences="Rich, pH 6.0-7.0", good_companions=["tomatoes", "roses", "fruit trees"], avoid_companions=["beans", "peas"], common_diseases=["White Rot"], care_tips=["Plant in fall", "Stop watering when tops yellow"], harvest_info=HarvestInfo(240, 2, [34, 35], "Dig when half leaves brown", "Single harvest", "Cure 2-3 weeks", "Dry day"), container_suitable=True, cold_tolerant=True)],
    
    "green_onions": [CropVariety(crop_name="Green Onions", variety_name="Evergreen Bunching", description="Perennial scallions", days_to_maturity=60, growing_season=GrowingSeason.SPRING_SUMMER, difficulty=Difficulty.EASY, space_per_plant_sqft=0.1, expected_yield_per_plant="Multiple harvests", plant_height="12-18 inches", plant_spread="2 inches", sunlight_needs="Full to Partial Sun", water_needs="Medium", soil_preferences="Well-drained, pH 6.0-7.0", good_companions=["carrots", "tomatoes", "lettuce"], avoid_companions=["beans"], common_diseases=["Few issues"], care_tips=["Cut and come again", "Very cold hardy"], harvest_info=HarvestInfo(60, 20, [9, 10, 11, 12], "Cut at soil level", "Weekly", "Refrigerate for 1 week", "Morning"), container_suitable=True, cold_tolerant=True)],
    
    "leeks": [CropVariety(crop_name="Leeks", variety_name="King Richard", description="Fast-growing, mild leeks", days_to_maturity=75, growing_season=GrowingSeason.SPRING_SUMMER, difficulty=Difficulty.MEDIUM, space_per_plant_sqft=0.5, expected_yield_per_plant="1 leek (8-12 oz)", plant_height="18-24 inches", plant_spread="4 inches", sunlight_needs="Full Sun", water_needs="High", soil_preferences="Rich, pH 6.0-7.0", good_companions=["carrots", "celery", "onions"], avoid_companions=["beans", "peas"], common_diseases=["Few issues"], care_tips=["Hill soil for white stems", "Very cold hardy"], harvest_info=HarvestInfo(75, 8, [11, 12, 13], "Dig carefully", "As needed", "Refrigerate for 2 weeks", "Anytime"), container_suitable=False, cold_tolerant=True)],
    
    "celery": [CropVariety(crop_name="Celery", variety_name="Tall Utah", description="Crisp, tall stalks", days_to_maturity=120, growing_season=GrowingSeason.SPRING_SUMMER, difficulty=Difficulty.HARD, space_per_plant_sqft=1.0, expected_yield_per_plant="1 stalk", plant_height="18-24 inches", plant_spread="12 inches", sunlight_needs="Full Sun", water_needs="High", soil_preferences="Rich, moisture-retentive, pH 6.0-7.0", good_companions=["beans", "tomatoes", "cabbage"], avoid_companions=["carrots", "parsnips"], common_diseases=["Leaf blight"], care_tips=["Needs constant moisture", "Challenging to grow"], harvest_info=HarvestInfo(120, 2, [17, 18], "Cut at base when mature", "Single harvest", "Refrigerate for 2 weeks", "Morning"), container_suitable=False)],
    
    "asparagus": [CropVariety(crop_name="Asparagus", variety_name="Jersey Knight", description="All-male hybrid, high yield", days_to_maturity=730, growing_season=GrowingSeason.SPRING, difficulty=Difficulty.HARD, space_per_plant_sqft=4.0, expected_yield_per_plant="0.5-1 lb/year", plant_height="4-5 feet", plant_spread="24 inches", sunlight_needs="Full Sun", water_needs="Medium", soil_preferences="Well-drained, pH 6.5-7.5", good_companions=["tomatoes", "parsley", "basil"], avoid_companions=["onions", "garlic"], common_diseases=["Fusarium"], care_tips=["Perennial - wait 2 years", "Long-term investment"], harvest_info=HarvestInfo(730, 4, [104, 105, 106], "Cut when 6-8 inches tall", "Daily in season", "Refrigerate for 1 week", "Morning"), container_suitable=False, cold_tolerant=True)],
    
    "strawberries": [CropVariety(crop_name="Strawberries", variety_name="Seascape", description="Everbearing strawberry", days_to_maturity=120, growing_season=GrowingSeason.SPRING_SUMMER, difficulty=Difficulty.MEDIUM, space_per_plant_sqft=1.0, expected_yield_per_plant="1-2 lbs", plant_height="8-12 inches", plant_spread="12-18 inches", sunlight_needs="Full Sun", water_needs="Medium", soil_preferences="Rich, slightly acidic, pH 5.5-6.5", good_companions=["spinach", "lettuce", "beans"], avoid_companions=["cabbage", "cauliflower"], common_diseases=["Powdery mildew"], care_tips=["Perennial", "Remove runners first year"], harvest_info=HarvestInfo(120, 12, [17, 18, 19, 20], "Pick when fully red", "Every 2-3 days", "Use within 3 days", "Morning"), container_suitable=True)],
    
    "mint": [CropVariety(crop_name="Mint", variety_name="Spearmint", description="Classic mint, vigorous", days_to_maturity=90, growing_season=GrowingSeason.SPRING_SUMMER, difficulty=Difficulty.EASY, space_per_plant_sqft=1.0, expected_yield_per_plant="Continuous harvest", plant_height="12-24 inches", plant_spread="Spreads aggressively", sunlight_needs="Full to Partial Sun", water_needs="High", soil_preferences="Moist, pH 6.0-7.0", good_companions=["cabbage", "tomatoes"], avoid_companions=["parsley"], common_diseases=["Rust"], care_tips=["Grow in containers to contain", "Very invasive"], harvest_info=HarvestInfo(90, 20, [13, 14, 15, 16], "Cut stems", "Weekly", "Dry or freeze", "Morning"), container_suitable=True)],
    
    "thyme": [CropVariety(crop_name="Thyme", variety_name="English Thyme", description="Classic culinary thyme", days_to_maturity=90, growing_season=GrowingSeason.SPRING_SUMMER, difficulty=Difficulty.EASY, space_per_plant_sqft=1.0, expected_yield_per_plant="Continuous harvest", plant_height="6-12 inches", plant_spread="12-16 inches", sunlight_needs="Full Sun", water_needs="Low", soil_preferences="Well-drained, pH 6.0-8.0", good_companions=["cabbage", "tomatoes", "strawberries"], avoid_companions=["None known"], common_diseases=["Root rot if overwatered"], care_tips=["Drought tolerant", "Perennial in mild climates"], harvest_info=HarvestInfo(90, 20, [13, 14, 15], "Cut stems", "As needed", "Dry for storage", "Morning"), container_suitable=True)],
    
    "oregano": [CropVariety(crop_name="Oregano", variety_name="Greek Oregano", description="Pungent, true oregano", days_to_maturity=90, growing_season=GrowingSeason.SPRING_SUMMER, difficulty=Difficulty.EASY, space_per_plant_sqft=1.0, expected_yield_per_plant="Continuous harvest", plant_height="12-24 inches", plant_spread="18 inches", sunlight_needs="Full Sun", water_needs="Low", soil_preferences="Well-drained, pH 6.0-8.0", good_companions=["tomatoes", "peppers", "squash"], avoid_companions=["None known"], common_diseases=["Few issues"], care_tips=["Drought tolerant", "Perennial"], harvest_info=HarvestInfo(90, 20, [13, 14, 15], "Cut stems before flowering", "As needed", "Dry for storage", "Morning"), container_suitable=True)],
    
    "rosemary": [CropVariety(crop_name="Rosemary", variety_name="Arp", description="Cold-hardy rosemary", days_to_maturity=180, growing_season=GrowingSeason.YEAR_ROUND, difficulty=Difficulty.MEDIUM, space_per_plant_sqft=4.0, expected_yield_per_plant="Continuous harvest", plant_height="3-4 feet", plant_spread="2-3 feet", sunlight_needs="Full Sun", water_needs="Low", soil_preferences="Well-drained, pH 6.0-7.0", good_companions=["sage", "beans", "cabbage"], avoid_companions=["cucumbers"], common_diseases=["Root rot"], care_tips=["Perennial in zones 7+", "Excellent drainage needed"], harvest_info=HarvestInfo(180, 52, [26, 27, 28], "Cut sprigs", "As needed", "Dry or use fresh", "Anytime"), container_suitable=True, cold_tolerant=True)],
    
    "sage": [CropVariety(crop_name="Sage", variety_name="Common Sage", description="Traditional culinary sage", days_to_maturity=75, growing_season=GrowingSeason.SPRING_SUMMER, difficulty=Difficulty.EASY, space_per_plant_sqft=2.0, expected_yield_per_plant="Continuous harvest", plant_height="24-30 inches", plant_spread="24 inches", sunlight_needs="Full Sun", water_needs="Low", soil_preferences="Well-drained, pH 6.0-7.0", good_companions=["rosemary", "cabbage", "carrots"], avoid_companions=["cucumbers", "onions"], common_diseases=["Powdery mildew"], care_tips=["Perennial", "Prune in spring"], harvest_info=HarvestInfo(75, 20, [11, 12, 13], "Cut leaves", "As needed", "Dry for storage", "Morning"), container_suitable=True)],
    
    "dill": [CropVariety(crop_name="Dill", variety_name="Bouquet", description="Compact dill for seeds and leaves", days_to_maturity=70, growing_season=GrowingSeason.SPRING_SUMMER, difficulty=Difficulty.EASY, space_per_plant_sqft=1.0, expected_yield_per_plant="4-6 oz leaves", plant_height="24-30 inches", plant_spread="12 inches", sunlight_needs="Full Sun", water_needs="Medium", soil_preferences="Well-drained, pH 5.5-6.5", good_companions=["cabbage", "lettuce", "cucumbers"], avoid_companions=["carrots", "tomatoes"], common_diseases=["Few issues"], care_tips=["Self-seeds readily", "Succession plant"], harvest_info=HarvestInfo(70, 4, [10, 11], "Cut leaves or seed heads", "Weekly", "Use fresh or dry", "Morning"), container_suitable=True)],
    
    "chives": [CropVariety(crop_name="Chives", variety_name="Common Chives", description="Onion-flavored perennial", days_to_maturity=90, growing_season=GrowingSeason.SPRING_SUMMER, difficulty=Difficulty.EASY, space_per_plant_sqft=0.5, expected_yield_per_plant="Continuous harvest", plant_height="12-18 inches", plant_spread="8-12 inches", sunlight_needs="Full to Partial Sun", water_needs="Medium", soil_preferences="Rich, pH 6.0-7.0", good_companions=["carrots", "tomatoes", "roses"], avoid_companions=["beans", "peas"], common_diseases=["Few issues"], care_tips=["Perennial", "Divide clumps every 3 years"], harvest_info=HarvestInfo(90, 30, [13, 14, 15, 16], "Cut leaves at base", "Weekly", "Use fresh or freeze", "Morning"), container_suitable=True, cold_tolerant=True)],
    
    "mustard_greens": [CropVariety(crop_name="Mustard Greens", variety_name="Red Giant", description="Large red-purple leaves, spicy", days_to_maturity=45, growing_season=GrowingSeason.SPRING_SUMMER, difficulty=Difficulty.EASY, space_per_plant_sqft=1.0, expected_yield_per_plant="1-2 lbs", plant_height="12-18 inches", plant_spread="12-15 inches", sunlight_needs="Full to Partial Sun", water_needs="Medium", soil_preferences="Rich, pH 6.0-7.5", good_companions=["beets", "celery", "onions"], avoid_companions=["strawberries"], common_diseases=["Flea beetles"], care_tips=["Cool season crop", "Cut and come again"], harvest_info=HarvestInfo(45, 4, [7, 8], "Cut outer leaves", "Weekly", "Refrigerate for 1 week", "Morning"), container_suitable=True, cold_tolerant=True)],
    
    "collard_greens": [CropVariety(crop_name="Collard Greens", variety_name="Georgia", description="Large smooth leaves, heat tolerant", days_to_maturity=75, growing_season=GrowingSeason.SPRING_SUMMER, difficulty=Difficulty.EASY, space_per_plant_sqft=2.0, expected_yield_per_plant="2-3 lbs", plant_height="24-36 inches", plant_spread="24 inches", sunlight_needs="Full Sun", water_needs="Medium", soil_preferences="Rich, pH 6.5-7.5", good_companions=["beans", "potatoes", "celery"], avoid_companions=["tomatoes", "strawberries"], common_diseases=["Cabbage worms"], care_tips=["Frost improves flavor", "Very nutritious"], harvest_info=HarvestInfo(75, 12, [11, 12, 13], "Cut lower leaves", "Weekly", "Refrigerate for 1 week", "Morning"), container_suitable=False, cold_tolerant=True)],
    
    "brussels_sprouts": [CropVariety(crop_name="Brussels Sprouts", variety_name="Long Island Improved", description="Classic brussels sprouts", days_to_maturity=100, growing_season=GrowingSeason.FALL_WINTER, difficulty=Difficulty.MEDIUM, space_per_plant_sqft=2.0, expected_yield_per_plant="50-100 sprouts", plant_height="24-36 inches", plant_spread="24 inches", sunlight_needs="Full Sun", water_needs="High", soil_preferences="Rich, pH 6.0-7.5", good_companions=["beans", "celery", "onions"], avoid_companions=["strawberries", "tomatoes"], common_diseases=["Aphids"], care_tips=["Frost sweetens flavor", "Bottom to top harvest"], harvest_info=HarvestInfo(100, 8, [14, 15, 16], "Snap off when firm and 1 inch", "Weekly from bottom up", "Refrigerate for 2 weeks", "After frost"), container_suitable=False, cold_tolerant=True)],
    
    "kohlrabi": [CropVariety(crop_name="Kohlrabi", variety_name="Early White Vienna", description="Fast-growing, mild flavor", days_to_maturity=55, growing_season=GrowingSeason.SPRING_SUMMER, difficulty=Difficulty.EASY, space_per_plant_sqft=0.5, expected_yield_per_plant="1 bulb (4-6 oz)", plant_height="12 inches", plant_spread="12 inches", sunlight_needs="Full Sun", water_needs="Medium", soil_preferences="Rich, pH 6.0-7.5", good_companions=["beets", "onions", "cucumbers"], avoid_companions=["tomatoes", "peppers"], common_diseases=["Few issues"], care_tips=["Cool season crop", "Harvest young for best texture"], harvest_info=HarvestInfo(55, 2, [8, 9], "Pull when 2-3 inches diameter", "Single harvest", "Refrigerate for 2 weeks", "Morning"), container_suitable=True, cold_tolerant=True)],
    
    "rutabaga": [CropVariety(crop_name="Rutabaga", variety_name="American Purple Top", description="Large yellow root, sweet", days_to_maturity=90, growing_season=GrowingSeason.FALL_WINTER, difficulty=Difficulty.EASY, space_per_plant_sqft=1.0, expected_yield_per_plant="1 root (1-2 lbs)", plant_height="12 inches foliage", plant_spread="12 inches", sunlight_needs="Full Sun", water_needs="Medium", soil_preferences="Well-drained, pH 5.5-7.0", good_companions=["peas", "beans"], avoid_companions=["potatoes"], common_diseases=["Few issues"], care_tips=["Frost improves flavor", "Long storage"], harvest_info=HarvestInfo(90, 3, [13, 14], "Dig before hard freeze", "Single harvest", "Store in cool place for months", "Before freeze"), container_suitable=False, cold_tolerant=True)],
    
    "parsnips": [CropVariety(crop_name="Parsnips", variety_name="Hollow Crown", description="Sweet, nutty flavor", days_to_maturity=120, growing_season=GrowingSeason.SPRING_SUMMER, difficulty=Difficulty.MEDIUM, space_per_plant_sqft=0.25, expected_yield_per_plant="1 root (6-10 oz)", plant_height="12 inches foliage", plant_spread="3 inches", sunlight_needs="Full Sun", water_needs="Medium", soil_preferences="Deep, loose, pH 6.0-7.0", good_companions=["peas", "beans", "peppers"], avoid_companions=["carrots"], common_diseases=["Few issues"], care_tips=["Frost sweetens", "Slow germination"], harvest_info=HarvestInfo(120, 4, [17, 18], "Dig after frost", "As needed", "Store in ground or refrigerate", "After frost"), container_suitable=False, cold_tolerant=True)],
    
    "pumpkins": [CropVariety(crop_name="Pumpkins", variety_name="Sugar Pie", description="Small pie pumpkin, sweet", days_to_maturity=100, growing_season=GrowingSeason.SUMMER, difficulty=Difficulty.EASY, space_per_plant_sqft=16.0, expected_yield_per_plant="3-5 pumpkins (4-6 lbs each)", plant_height="Vine 10+ feet", plant_spread="Sprawling", sunlight_needs="Full Sun", water_needs="High", soil_preferences="Rich, pH 6.0-6.8", good_companions=["corn", "beans"], avoid_companions=["potatoes"], common_diseases=["Powdery Mildew"], care_tips=["Needs lots of space", "Cure before storage"], harvest_info=HarvestInfo(100, 2, [14, 15], "Cut when skin is hard", "Single harvest", "Cure 10 days, store for months", "Before frost"), container_suitable=False, heat_tolerant=True)],
    
    "ginger": [CropVariety(crop_name="Ginger", variety_name="Common Ginger", description="Culinary ginger root", days_to_maturity=240, growing_season=GrowingSeason.SUMMER, difficulty=Difficulty.HARD, space_per_plant_sqft=1.0, expected_yield_per_plant="1-2 lbs", plant_height="24-36 inches", plant_spread="12 inches", sunlight_needs="Partial Sun", water_needs="High", soil_preferences="Rich, well-drained, pH 6.0-6.8", good_companions=["herbs"], avoid_companions=["None known"], common_diseases=["Root rot"], care_tips=["Tropical crop, needs heat", "Grow in containers in temperate zones"], harvest_info=HarvestInfo(240, 4, [34, 35], "Dig when leaves yellow", "Harvest as needed", "Store in cool dark place", "After frost"), container_suitable=True, heat_tolerant=True)],
    
    # GRAINS & STAPLES
    "rice": [CropVariety(crop_name="Rice", variety_name="Calrose", description="Short-grain rice, sushi quality", days_to_maturity=150, growing_season=GrowingSeason.SUMMER, difficulty=Difficulty.HARD, space_per_plant_sqft=0.25, expected_yield_per_plant="0.25-0.5 lbs", plant_height="36-48 inches", plant_spread="12 inches", sunlight_needs="Full Sun", water_needs="High (flooded)", soil_preferences="Clay, pH 6.0-7.0", good_companions=["None - monoculture"], avoid_companions=["None known"], common_diseases=["Blast"], care_tips=["Requires flooding", "Warm climate essential"], harvest_info=HarvestInfo(150, 2, [21, 22], "Cut when grain is hard", "Single harvest", "Dry thoroughly before storing", "When dry"), container_suitable=False, heat_tolerant=True)],
    
    # ASIAN VEGETABLES  
    "daikon": [CropVariety(crop_name="Daikon", variety_name="Miyashige", description="Large white radish", days_to_maturity=60, growing_season=GrowingSeason.FALL_WINTER, difficulty=Difficulty.EASY, space_per_plant_sqft=0.5, expected_yield_per_plant="1 radish (1-2 lbs)", plant_height="18 inches foliage", plant_spread="12 inches", sunlight_needs="Full Sun", water_needs="Medium", soil_preferences="Deep, loose, pH 6.0-7.0", good_companions=["lettuce", "peas"], avoid_companions=["None known"], common_diseases=["Few issues"], care_tips=["Cool season crop", "Grows very large"], harvest_info=HarvestInfo(60, 2, [9, 10], "Pull when tops are 12 inches", "Single harvest", "Refrigerate for 2-3 weeks", "Morning"), container_suitable=False, cold_tolerant=True)],
    
    "napa_cabbage": [CropVariety(crop_name="Napa Cabbage", variety_name="Michihili", description="Tall Chinese cabbage", days_to_maturity=70, growing_season=GrowingSeason.FALL_WINTER, difficulty=Difficulty.EASY, space_per_plant_sqft=2.0, expected_yield_per_plant="2-3 lbs", plant_height="18-24 inches", plant_spread="12 inches", sunlight_needs="Full Sun", water_needs="High", soil_preferences="Rich, pH 6.0-7.5", good_companions=["beans", "peas"], avoid_companions=["tomatoes"], common_diseases=["Clubroot"], care_tips=["Cool season crop", "Tie heads for blanching"], harvest_info=HarvestInfo(70, 2, [10, 11], "Cut at base when firm", "Single harvest", "Refrigerate for 3-4 weeks", "Morning"), container_suitable=False, cold_tolerant=True)],
    
    "edamame": [CropVariety(crop_name="Edamame", variety_name="Envy", description="Vegetable soybean", days_to_maturity=80, growing_season=GrowingSeason.SUMMER, difficulty=Difficulty.EASY, space_per_plant_sqft=0.5, expected_yield_per_plant="0.5-1 lb pods", plant_height="24-30 inches", plant_spread="12 inches", sunlight_needs="Full Sun", water_needs="Medium", soil_preferences="Well-drained, pH 6.0-7.0", good_companions=["corn", "squash"], avoid_companions=["onions"], common_diseases=["Few issues"], care_tips=["Pick when pods are plump but green", "Nitrogen fixer"], harvest_info=HarvestInfo(80, 2, [12, 13], "Pick pods when beans are plump", "Harvest over 2 weeks", "Blanch and freeze", "Morning"), container_suitable=True, heat_tolerant=True)],
    
    "tatsoi": [CropVariety(crop_name="Tatsoi", variety_name="Rosette", description="Spoon-shaped Asian green", days_to_maturity=45, growing_season=GrowingSeason.SPRING_SUMMER, difficulty=Difficulty.EASY, space_per_plant_sqft=0.5, expected_yield_per_plant="0.5-1 lb", plant_height="8-10 inches", plant_spread="12 inches", sunlight_needs="Full to Partial Sun", water_needs="Medium", soil_preferences="Rich, pH 6.0-7.0", good_companions=["beans", "onions"], avoid_companions=["strawberries"], common_diseases=["Flea beetles"], care_tips=["Very cold hardy", "Forms rosette"], harvest_info=HarvestInfo(45, 3, [7, 8], "Cut whole plant or outer leaves", "Weekly", "Refrigerate for 1 week", "Morning"), container_suitable=True, cold_tolerant=True)],
    
    "mizuna": [CropVariety(crop_name="Mizuna", variety_name="Green", description="Mild mustard green", days_to_maturity=40, growing_season=GrowingSeason.SPRING_SUMMER, difficulty=Difficulty.EASY, space_per_plant_sqft=0.5, expected_yield_per_plant="0.5-1 lb", plant_height="12-18 inches", plant_spread="12 inches", sunlight_needs="Full to Partial Sun", water_needs="Medium", soil_preferences="Rich, pH 6.0-7.0", good_companions=["lettuce", "spinach"], avoid_companions=["None known"], common_diseases=["Flea beetles"], care_tips=["Cut and come again", "Very fast growing"], harvest_info=HarvestInfo(40, 4, [6, 7], "Cut outer leaves", "Weekly", "Refrigerate for 1 week", "Morning"), container_suitable=True, cold_tolerant=True)],
    
    "bitter_melon": [CropVariety(crop_name="Bitter Melon", variety_name="Green", description="Warty bitter gourd", days_to_maturity=60, growing_season=GrowingSeason.SUMMER, difficulty=Difficulty.MEDIUM, space_per_plant_sqft=4.0, expected_yield_per_plant="10-15 fruits", plant_height="Vine 6+ feet", plant_spread="Sprawling", sunlight_needs="Full Sun", water_needs="High", soil_preferences="Rich, pH 6.0-7.0", good_companions=["beans", "corn"], avoid_companions=["None known"], common_diseases=["Powdery mildew"], care_tips=["Needs trellis", "Harvest when green"], harvest_info=HarvestInfo(60, 8, [9, 10, 11], "Pick when light green and firm", "Every 2-3 days", "Refrigerate for 1 week", "Morning"), container_suitable=False, heat_tolerant=True)],
    
    "winter_melon": [CropVariety(crop_name="Winter Melon", variety_name="Large", description="Wax gourd for soups", days_to_maturity=120, growing_season=GrowingSeason.SUMMER, difficulty=Difficulty.MEDIUM, space_per_plant_sqft=16.0, expected_yield_per_plant="2-3 melons (15-20 lbs each)", plant_height="Vine 10+ feet", plant_spread="Sprawling", sunlight_needs="Full Sun", water_needs="High", soil_preferences="Rich, pH 6.0-7.0", good_companions=["corn", "beans"], avoid_companions=["None known"], common_diseases=["Few issues"], care_tips=["Needs lots of space", "Develops waxy coating"], harvest_info=HarvestInfo(120, 2, [17, 18], "Cut when waxy coating forms", "Single harvest", "Store for months in cool place", "Before frost"), container_suitable=False, heat_tolerant=True)],
    
    "thai_basil": [CropVariety(crop_name="Thai Basil", variety_name="Siam Queen", description="Licorice-scented basil", days_to_maturity=60, growing_season=GrowingSeason.SUMMER, difficulty=Difficulty.EASY, space_per_plant_sqft=1.0, expected_yield_per_plant="1-2 lbs", plant_height="18-24 inches", plant_spread="12 inches", sunlight_needs="Full Sun", water_needs="Medium", soil_preferences="Rich, pH 6.0-7.0", good_companions=["tomatoes", "peppers"], avoid_companions=["rue"], common_diseases=["Few issues"], care_tips=["Heat tolerant", "Purple flowers edible"], harvest_info=HarvestInfo(60, 12, [9, 10, 11], "Pinch stems", "Weekly", "Use fresh or dry", "Morning"), container_suitable=True, heat_tolerant=True)],
    
    "lemongrass": [CropVariety(crop_name="Lemongrass", variety_name="East Indian", description="Citrus-scented grass", days_to_maturity=90, growing_season=GrowingSeason.SUMMER, difficulty=Difficulty.EASY, space_per_plant_sqft=4.0, expected_yield_per_plant="Continuous harvest", plant_height="3-4 feet", plant_spread="24 inches", sunlight_needs="Full Sun", water_needs="High", soil_preferences="Rich, pH 6.0-7.0", good_companions=["herbs"], avoid_companions=["None known"], common_diseases=["Few issues"], care_tips=["Tropical - grow in pot", "Use lower bulb"], harvest_info=HarvestInfo(90, 20, [13, 14, 15], "Cut stalks at base", "As needed", "Refrigerate for 2 weeks or freeze", "Morning"), container_suitable=True, heat_tolerant=True)],
    
    # LATIN AMERICAN CROPS
    "tomatillos": [CropVariety(crop_name="Tomatillos", variety_name="Verde", description="Green husk tomato for salsa", days_to_maturity=75, growing_season=GrowingSeason.SUMMER, difficulty=Difficulty.EASY, space_per_plant_sqft=4.0, expected_yield_per_plant="1-2 lbs", plant_height="3-4 feet", plant_spread="24 inches", sunlight_needs="Full Sun", water_needs="Medium", soil_preferences="Well-drained, pH 6.0-7.0", good_companions=["basil", "marigolds"], avoid_companions=["brassicas"], common_diseases=["Few issues"], care_tips=["Need 2 plants for pollination", "Very productive"], harvest_info=HarvestInfo(75, 8, [11, 12, 13], "Pick when husk splits", "Every 3-4 days", "Store in husk for 2-3 weeks", "Morning"), container_suitable=False, heat_tolerant=True)],
    
    "jicama": [CropVariety(crop_name="Jicama", variety_name="Pachyrhizus erosus", description="Sweet crunchy root", days_to_maturity=150, growing_season=GrowingSeason.SUMMER, difficulty=Difficulty.HARD, space_per_plant_sqft=4.0, expected_yield_per_plant="2-5 lbs", plant_height="Vine 6+ feet", plant_spread="Sprawling", sunlight_needs="Full Sun", water_needs="Medium", soil_preferences="Sandy, pH 6.0-7.0", good_companions=["beans"], avoid_companions=["None known"], common_diseases=["Few issues"], care_tips=["Needs long hot season", "Remove flowers for larger root"], harvest_info=HarvestInfo(150, 2, [21, 22], "Dig before frost", "Single harvest", "Store in cool place for months", "Before frost"), container_suitable=False, heat_tolerant=True)],
    
    "epazote": [CropVariety(crop_name="Epazote", variety_name="Wormseed", description="Pungent Mexican herb", days_to_maturity=55, growing_season=GrowingSeason.SUMMER, difficulty=Difficulty.EASY, space_per_plant_sqft=1.0, expected_yield_per_plant="Continuous harvest", plant_height="36-48 inches", plant_spread="24 inches", sunlight_needs="Full Sun", water_needs="Low", soil_preferences="Poor to average, pH 6.0-7.0", good_companions=["beans"], avoid_companions=["None known"], common_diseases=["Few issues"], care_tips=["Self-seeds readily", "Use sparingly"], harvest_info=HarvestInfo(55, 12, [8, 9, 10], "Cut leaves before flowering", "Weekly", "Use fresh or dry", "Morning"), container_suitable=True, heat_tolerant=True)],
    
    "nopal": [CropVariety(crop_name="Nopal", variety_name="Prickly Pear Cactus", description="Edible cactus pads", days_to_maturity=90, growing_season=GrowingSeason.YEAR_ROUND, difficulty=Difficulty.EASY, space_per_plant_sqft=9.0, expected_yield_per_plant="Continuous harvest", plant_height="3-5 feet", plant_spread="3-4 feet", sunlight_needs="Full Sun", water_needs="Very Low", soil_preferences="Sandy, well-drained, pH 6.0-7.5", good_companions=["Drought-tolerant plants"], avoid_companions=["Water-loving plants"], common_diseases=["Few issues"], care_tips=["Extremely drought tolerant", "De-spine before eating"], harvest_info=HarvestInfo(90, 52, [13, 14, 15], "Cut young pads", "As needed", "Refrigerate for 1 week", "Morning"), container_suitable=True, heat_tolerant=True)],
    
    # AFRICAN CROPS
    "okra": [CropVariety(crop_name="Okra", variety_name="Clemson Spineless", description="Classic okra, no prickles", days_to_maturity=55, growing_season=GrowingSeason.SUMMER, difficulty=Difficulty.EASY, space_per_plant_sqft=2.0, expected_yield_per_plant="5-10 lbs", plant_height="4-6 feet", plant_spread="24 inches", sunlight_needs="Full Sun", water_needs="Medium", soil_preferences="Rich, pH 6.0-7.5", good_companions=["peppers", "eggplant"], avoid_companions=["None known"], common_diseases=["Few issues"], care_tips=["Pick pods young and tender", "Very heat loving"], harvest_info=HarvestInfo(55, 10, [8, 9, 10, 11], "Pick pods at 3-4 inches", "Every 2 days", "Use within 3 days", "Morning"), container_suitable=False, heat_tolerant=True)],
    
    "black_eyed_peas": [CropVariety(crop_name="Black-Eyed Peas", variety_name="California Blackeye", description="Southern pea/cowpea", days_to_maturity=75, growing_season=GrowingSeason.SUMMER, difficulty=Difficulty.EASY, space_per_plant_sqft=0.5, expected_yield_per_plant="1 lb", plant_height="24 inches", plant_spread="12 inches", sunlight_needs="Full Sun", water_needs="Low-Medium", soil_preferences="Well-drained, pH 6.0-7.0", good_companions=["corn", "squash"], avoid_companions=["onions"], common_diseases=["Few issues"], care_tips=["Heat and drought tolerant", "Nitrogen fixer"], harvest_info=HarvestInfo(75, 4, [11, 12], "Pick when pods are full", "Every 3 days", "Shell and freeze", "Morning"), container_suitable=True, heat_tolerant=True)],
    
    "amaranth_greens": [CropVariety(crop_name="Amaranth Greens", variety_name="Red Garnet", description="Nutritious red leaves", days_to_maturity=30, growing_season=GrowingSeason.SUMMER, difficulty=Difficulty.EASY, space_per_plant_sqft=1.0, expected_yield_per_plant="1-2 lbs", plant_height="24-36 inches", plant_spread="18 inches", sunlight_needs="Full Sun", water_needs="Medium", soil_preferences="Well-drained, pH 6.0-7.0", good_companions=["onions", "lettuce"], avoid_companions=["None known"], common_diseases=["Few issues"], care_tips=["Very fast growing", "Heat tolerant"], harvest_info=HarvestInfo(30, 8, [5, 6, 7], "Cut young leaves", "Weekly", "Use within 3 days", "Morning"), container_suitable=True, heat_tolerant=True)],
    
    # MIDDLE EASTERN CROPS
    "fava_beans": [CropVariety(crop_name="Fava Beans", variety_name="Windsor", description="Broad bean, cool season", days_to_maturity=85, growing_season=GrowingSeason.SPRING, difficulty=Difficulty.EASY, space_per_plant_sqft=0.5, expected_yield_per_plant="1-2 lbs", plant_height="3-4 feet", plant_spread="12 inches", sunlight_needs="Full Sun", water_needs="Medium", soil_preferences="Rich, pH 6.0-7.5", good_companions=["carrots", "corn"], avoid_companions=["onions"], common_diseases=["Aphids"], care_tips=["Very cold hardy", "Can overwinter in mild areas"], harvest_info=HarvestInfo(85, 3, [12, 13], "Pick when pods are plump", "Every 3-4 days", "Shell and freeze", "Morning"), container_suitable=False, cold_tolerant=True)],
    
    "chickpeas": [CropVariety(crop_name="Chickpeas", variety_name="Kabuli", description="Large white chickpea", days_to_maturity=100, growing_season=GrowingSeason.SUMMER, difficulty=Difficulty.MEDIUM, space_per_plant_sqft=0.25, expected_yield_per_plant="0.25 lbs", plant_height="18-24 inches", plant_spread="12 inches", sunlight_needs="Full Sun", water_needs="Low", soil_preferences="Well-drained, pH 6.0-7.0", good_companions=["corn", "squash"], avoid_companions=["onions"], common_diseases=["Few issues"], care_tips=["Drought tolerant", "Cool season preferred"], harvest_info=HarvestInfo(100, 2, [14, 15], "Pull plants when pods dry", "Single harvest", "Dry and store", "Dry day"), container_suitable=True, heat_tolerant=False)],
    
    "lentils": [CropVariety(crop_name="Lentils", variety_name="French Green", description="Small flavorful lentils", days_to_maturity=110, growing_season=GrowingSeason.SPRING, difficulty=Difficulty.MEDIUM, space_per_plant_sqft=0.25, expected_yield_per_plant="0.25 lbs", plant_height="18 inches", plant_spread="12 inches", sunlight_needs="Full Sun", water_needs="Low", soil_preferences="Well-drained, pH 6.0-7.0", good_companions=["potatoes", "cucumbers"], avoid_companions=["onions"], common_diseases=["Few issues"], care_tips=["Cool season crop", "Low maintenance"], harvest_info=HarvestInfo(110, 2, [16, 17], "Pull when pods rattle", "Single harvest", "Dry and store", "Dry day"), container_suitable=True, cold_tolerant=True)],
    
    # SPECIALTY GREENS
    "endive": [CropVariety(crop_name="Endive", variety_name="Broad Leaf Batavian", description="Mild chicory", days_to_maturity=85, growing_season=GrowingSeason.FALL_WINTER, difficulty=Difficulty.MEDIUM, space_per_plant_sqft=1.0, expected_yield_per_plant="1 lb", plant_height="12 inches", plant_spread="12 inches", sunlight_needs="Full Sun", water_needs="Medium", soil_preferences="Rich, pH 6.0-7.0", good_companions=["beans", "peas"], avoid_companions=["None known"], common_diseases=["Tipburn"], care_tips=["Tie leaves for blanching", "Cool season"], harvest_info=HarvestInfo(85, 2, [12, 13], "Cut at base when mature", "Single harvest", "Refrigerate for 1-2 weeks", "Morning"), container_suitable=True, cold_tolerant=True)],
    
    "radicchio": [CropVariety(crop_name="Radicchio", variety_name="Chioggia", description="Red Italian chicory", days_to_maturity=85, growing_season=GrowingSeason.FALL_WINTER, difficulty=Difficulty.MEDIUM, space_per_plant_sqft=1.0, expected_yield_per_plant="1 lb", plant_height="8-10 inches", plant_spread="10 inches", sunlight_needs="Full Sun", water_needs="Medium", soil_preferences="Rich, pH 6.0-7.0", good_companions=["beans", "onions"], avoid_companions=["None known"], common_diseases=["Few issues"], care_tips=["Frost improves flavor", "Forms compact head"], harvest_info=HarvestInfo(85, 2, [12, 13], "Cut at base when head is firm", "Single harvest", "Refrigerate for 2 weeks", "After light frost"), container_suitable=True, cold_tolerant=True)],
    
    "fennel": [CropVariety(crop_name="Fennel", variety_name="Florence", description="Bulbing fennel, licorice flavor", days_to_maturity=85, growing_season=GrowingSeason.FALL_WINTER, difficulty=Difficulty.MEDIUM, space_per_plant_sqft=1.0, expected_yield_per_plant="1 bulb (1 lb)", plant_height="24 inches", plant_spread="12 inches", sunlight_needs="Full Sun", water_needs="Medium", soil_preferences="Rich, pH 6.0-7.0", good_companions=["None - inhibits most"], avoid_companions=["tomatoes", "beans", "dill"], common_diseases=["Few issues"], care_tips=["Hill soil around bulb", "Cool season"], harvest_info=HarvestInfo(85, 2, [12, 13], "Cut bulb at base", "Single harvest", "Refrigerate for 1 week", "Morning"), container_suitable=True, cold_tolerant=True)],
    
    "sorrel": [CropVariety(crop_name="Sorrel", variety_name="French", description="Lemony perennial green", days_to_maturity=60, growing_season=GrowingSeason.SPRING_SUMMER, difficulty=Difficulty.EASY, space_per_plant_sqft=1.0, expected_yield_per_plant="Continuous harvest", plant_height="18-24 inches", plant_spread="12 inches", sunlight_needs="Full to Partial Sun", water_needs="Medium", soil_preferences="Rich, pH 6.0-7.0", good_companions=["strawberries"], avoid_companions=["None known"], common_diseases=["Few issues"], care_tips=["Perennial", "Remove flowers"], harvest_info=HarvestInfo(60, 20, [9, 10, 11], "Cut outer leaves", "Weekly", "Use fresh within 3 days", "Morning"), container_suitable=True, cold_tolerant=True)],
    
    # MORE DIVERSE OPTIONS
    "quinoa": [CropVariety(crop_name="Quinoa", variety_name="Rainbow", description="Andean pseudocereal", days_to_maturity=120, growing_season=GrowingSeason.SUMMER, difficulty=Difficulty.MEDIUM, space_per_plant_sqft=1.0, expected_yield_per_plant="0.25-0.5 lbs", plant_height="4-6 feet", plant_spread="18 inches", sunlight_needs="Full Sun", water_needs="Low", soil_preferences="Well-drained, pH 6.0-7.5", good_companions=["beans", "corn"], avoid_companions=["None known"], common_diseases=["Few issues"], care_tips=["Drought tolerant", "Rinse seeds before eating"], harvest_info=HarvestInfo(120, 2, [17, 18], "Cut when seeds are hard", "Single harvest", "Dry thoroughly", "Dry day"), container_suitable=False)],
    
    "horseradish": [CropVariety(crop_name="Horseradish", variety_name="Common", description="Pungent root condiment", days_to_maturity=365, growing_season=GrowingSeason.YEAR_ROUND, difficulty=Difficulty.EASY, space_per_plant_sqft=4.0, expected_yield_per_plant="2-3 lbs", plant_height="24-36 inches", plant_spread="24 inches", sunlight_needs="Full to Partial Sun", water_needs="Medium", soil_preferences="Deep, rich, pH 6.0-7.0", good_companions=["potatoes"], avoid_companions=["None known"], common_diseases=["Few issues"], care_tips=["Perennial", "Very invasive"], harvest_info=HarvestInfo(365, 8, [52], "Dig roots in fall", "Annual harvest", "Store in sand or grate and freeze", "After frost"), container_suitable=False, cold_tolerant=True)],
    
    "artichoke": [CropVariety(crop_name="Artichoke", variety_name="Green Globe", description="Edible flower bud", days_to_maturity=180, growing_season=GrowingSeason.SPRING_SUMMER, difficulty=Difficulty.HARD, space_per_plant_sqft=9.0, expected_yield_per_plant="10-15 buds", plant_height="3-5 feet", plant_spread="3-4 feet", sunlight_needs="Full Sun", water_needs="Medium-High", soil_preferences="Rich, well-drained, pH 6.5-7.5", good_companions=["peas", "beans"], avoid_companions=["None known"], common_diseases=["Aphids"], care_tips=["Perennial in mild climates", "Needs space"], harvest_info=HarvestInfo(180, 6, [26, 27, 28], "Cut when buds are tight", "Every few days", "Refrigerate for 1 week", "Morning"), container_suitable=False)],
    
    "rhubarb": [CropVariety(crop_name="Rhubarb", variety_name="Victoria", description="Tart stalks for pies", days_to_maturity=730, growing_season=GrowingSeason.SPRING, difficulty=Difficulty.EASY, space_per_plant_sqft=9.0, expected_yield_per_plant="5-10 lbs/year", plant_height="24-36 inches", plant_spread="36 inches", sunlight_needs="Full to Partial Sun", water_needs="Medium", soil_preferences="Rich, pH 5.0-6.5", good_companions=["beans", "onions"], avoid_companions=["None known"], common_diseases=["Crown rot"], care_tips=["Perennial", "Don't harvest first year"], harvest_info=HarvestInfo(730, 8, [104, 105, 106], "Twist and pull stalks", "Stop in summer", "Refrigerate for 2 weeks", "Morning"), container_suitable=False, cold_tolerant=True)],
    
    "celeriac": [CropVariety(crop_name="Celeriac", variety_name="Brilliant", description="Celery root", days_to_maturity=120, growing_season=GrowingSeason.FALL_WINTER, difficulty=Difficulty.MEDIUM, space_per_plant_sqft=1.0, expected_yield_per_plant="1 root (1-2 lbs)", plant_height="18 inches", plant_spread="12 inches", sunlight_needs="Full Sun", water_needs="High", soil_preferences="Rich, pH 6.0-7.0", good_companions=["beans", "tomatoes"], avoid_companions=["carrots"], common_diseases=["Few issues"], care_tips=["Needs consistent moisture", "Remove side shoots"], harvest_info=HarvestInfo(120, 4, [17, 18], "Dig when 3-4 inches", "As needed", "Store in sand for months", "Before hard freeze"), container_suitable=False, cold_tolerant=True)],
    
    # FINAL 21 CROPS FOR 100 TOTAL
    "shiso": [CropVariety(crop_name="Shiso", variety_name="Red Perilla", description="Japanese herb, aromatic", days_to_maturity=70, growing_season=GrowingSeason.SUMMER, difficulty=Difficulty.EASY, space_per_plant_sqft=1.0, expected_yield_per_plant="Continuous harvest", plant_height="24-36 inches", plant_spread="18 inches", sunlight_needs="Full to Partial Sun", water_needs="Medium", soil_preferences="Rich, pH 6.0-7.0", good_companions=["tomatoes"], avoid_companions=["None known"], common_diseases=["Few issues"], care_tips=["Self-seeds readily", "Both leaves and seeds edible"], harvest_info=HarvestInfo(70, 12, [10, 11, 12], "Pick young leaves", "Weekly", "Use fresh", "Morning"), container_suitable=True)],
    
    "watercress": [CropVariety(crop_name="Watercress", variety_name="Nasturtium", description="Peppery aquatic green", days_to_maturity=50, growing_season=GrowingSeason.SPRING_SUMMER, difficulty=Difficulty.MEDIUM, space_per_plant_sqft=0.5, expected_yield_per_plant="Continuous harvest", plant_height="12 inches", plant_spread="Spreading", sunlight_needs="Partial Sun", water_needs="Very High (aquatic)", soil_preferences="Wet, pH 6.5-7.5", good_companions=["Aquatic plants"], avoid_companions=["Dry-loving plants"], common_diseases=["Few issues"], care_tips=["Needs constant moisture", "Grows in water"], harvest_info=HarvestInfo(50, 12, [7, 8, 9], "Cut stems", "Weekly", "Use within 2 days", "Morning"), container_suitable=True)],
    
    "mache": [CropVariety(crop_name="Mache", variety_name="Corn Salad", description="Mild, nutty winter green", days_to_maturity=60, growing_season=GrowingSeason.FALL_WINTER, difficulty=Difficulty.EASY, space_per_plant_sqft=0.25, expected_yield_per_plant="4-6 oz", plant_height="4-6 inches", plant_spread="6 inches", sunlight_needs="Full to Partial Sun", water_needs="Medium", soil_preferences="Well-drained, pH 6.0-7.0", good_companions=["lettuce", "spinach"], avoid_companions=["None known"], common_diseases=["Few issues"], care_tips=["Very cold hardy", "Slow growing"], harvest_info=HarvestInfo(60, 4, [9, 10], "Cut rosettes", "As needed", "Refrigerate for 1 week", "Morning"), container_suitable=True, cold_tolerant=True)],
    
    "malabar_spinach": [CropVariety(crop_name="Malabar Spinach", variety_name="Red Stem", description="Vining tropical spinach", days_to_maturity=70, growing_season=GrowingSeason.SUMMER, difficulty=Difficulty.EASY, space_per_plant_sqft=2.0, expected_yield_per_plant="Continuous harvest", plant_height="Vine 10+ feet", plant_spread="Climbing", sunlight_needs="Full Sun", water_needs="High", soil_preferences="Rich, pH 6.0-7.0", good_companions=["beans", "corn"], avoid_companions=["None known"], common_diseases=["Few issues"], care_tips=["Needs trellis", "Heat loving"], harvest_info=HarvestInfo(70, 16, [10, 11, 12, 13], "Pick young leaves", "Weekly", "Use within 3 days", "Morning"), container_suitable=True, heat_tolerant=True)],
    
    "jerusalem_artichoke": [CropVariety(crop_name="Jerusalem Artichoke", variety_name="Sunchoke", description="Nutty tuber, sunflower relative", days_to_maturity=120, growing_season=GrowingSeason.FALL_WINTER, difficulty=Difficulty.EASY, space_per_plant_sqft=4.0, expected_yield_per_plant="2-5 lbs", plant_height="6-10 feet", plant_spread="24 inches", sunlight_needs="Full Sun", water_needs="Medium", soil_preferences="Any, pH 6.0-7.5", good_companions=["None - invasive"], avoid_companions=["None known"], common_diseases=["Few issues"], care_tips=["Very invasive", "Harvest after frost"], harvest_info=HarvestInfo(120, 8, [17, 18], "Dig tubers after frost", "As needed", "Store in ground or refrigerate", "After frost"), container_suitable=False, cold_tolerant=True)],
    
    "salsify": [CropVariety(crop_name="Salsify", variety_name="Mammoth Sandwich Island", description="Oyster plant, mild root", days_to_maturity=120, growing_season=GrowingSeason.FALL_WINTER, difficulty=Difficulty.MEDIUM, space_per_plant_sqft=0.25, expected_yield_per_plant="1 root (6-8 oz)", plant_height="36 inches", plant_spread="6 inches", sunlight_needs="Full Sun", water_needs="Medium", soil_preferences="Deep, loose, pH 6.0-7.0", good_companions=["carrots", "onions"], avoid_companions=["None known"], common_diseases=["Few issues"], care_tips=["Tastes like oysters", "Frost improves flavor"], harvest_info=HarvestInfo(120, 4, [17, 18], "Dig after frost", "As needed", "Store in ground", "After frost"), container_suitable=False, cold_tolerant=True)],
    
    "cress": [CropVariety(crop_name="Cress", variety_name="Curly", description="Fast-growing peppery green", days_to_maturity=10, growing_season=GrowingSeason.SPRING_SUMMER, difficulty=Difficulty.EASY, space_per_plant_sqft=0.1, expected_yield_per_plant="2 oz", plant_height="2-4 inches", plant_spread="4 inches", sunlight_needs="Full to Partial Sun", water_needs="High", soil_preferences="Moist, pH 6.0-7.0", good_companions=["lettuce", "radishes"], avoid_companions=["None known"], common_diseases=["Few issues"], care_tips=["Fastest vegetable", "Succession plant every week"], harvest_info=HarvestInfo(10, 1, [2], "Cut at soil level", "Single harvest", "Use immediately", "Morning"), container_suitable=True)],
    
    "yuca": [CropVariety(crop_name="Yuca", variety_name="Cassava", description="Starchy tropical root", days_to_maturity=300, growing_season=GrowingSeason.YEAR_ROUND, difficulty=Difficulty.HARD, space_per_plant_sqft=9.0, expected_yield_per_plant="5-10 lbs", plant_height="5-8 feet", plant_spread="36 inches", sunlight_needs="Full Sun", water_needs="Medium", soil_preferences="Sandy, well-drained, pH 5.5-7.0", good_companions=["Beans"], avoid_companions=["None known"], common_diseases=["Few issues"], care_tips=["Tropical only", "Must cook before eating"], harvest_info=HarvestInfo(300, 4, [43, 44], "Dig when mature", "Single harvest", "Use within days or freeze", "Anytime"), container_suitable=False, heat_tolerant=True)],
    
    "moringa": [CropVariety(crop_name="Moringa", variety_name="Drumstick Tree", description="Nutritious leaves and pods", days_to_maturity=120, growing_season=GrowingSeason.SUMMER, difficulty=Difficulty.MEDIUM, space_per_plant_sqft=16.0, expected_yield_per_plant="Continuous harvest", plant_height="10-15 feet", plant_spread="6-8 feet", sunlight_needs="Full Sun", water_needs="Low", soil_preferences="Sandy, pH 6.0-7.0", good_companions=["Legumes"], avoid_companions=["None known"], common_diseases=["Few issues"], care_tips=["Fast-growing tree", "Highly nutritious"], harvest_info=HarvestInfo(120, 40, [17, 18, 19, 20], "Pick young leaves and pods", "Weekly", "Use fresh or dry leaves", "Morning"), container_suitable=False, heat_tolerant=True)],
    
    "stevia": [CropVariety(crop_name="Stevia", variety_name="Sweet Leaf", description="Natural sweetener", days_to_maturity=120, growing_season=GrowingSeason.SUMMER, difficulty=Difficulty.MEDIUM, space_per_plant_sqft=2.0, expected_yield_per_plant="Continuous harvest", plant_height="24-30 inches", plant_spread="18 inches", sunlight_needs="Full Sun", water_needs="Medium", soil_preferences="Well-drained, pH 6.5-7.5", good_companions=["Herbs"], avoid_companions=["None known"], common_diseases=["Few issues"], care_tips=["Tender perennial", "Dry leaves for sweetener"], harvest_info=HarvestInfo(120, 20, [17, 18, 19], "Cut stems before flowering", "Monthly", "Dry thoroughly", "Morning"), container_suitable=True)],
    
    "lovage": [CropVariety(crop_name="Lovage", variety_name="Common", description="Celery-flavored perennial", days_to_maturity=90, growing_season=GrowingSeason.SPRING_SUMMER, difficulty=Difficulty.EASY, space_per_plant_sqft=4.0, expected_yield_per_plant="Continuous harvest", plant_height="4-6 feet", plant_spread="24 inches", sunlight_needs="Full to Partial Sun", water_needs="Medium", soil_preferences="Rich, pH 6.0-7.0", good_companions=["Most vegetables"], avoid_companions=["None known"], common_diseases=["Few issues"], care_tips=["Perennial", "All parts edible"], harvest_info=HarvestInfo(90, 30, [13, 14, 15], "Cut leaves as needed", "Weekly", "Use fresh or dry", "Morning"), container_suitable=False)],
    
    "tarragon": [CropVariety(crop_name="Tarragon", variety_name="French", description="Anise-flavored herb", days_to_maturity=90, growing_season=GrowingSeason.SPRING_SUMMER, difficulty=Difficulty.MEDIUM, space_per_plant_sqft=2.0, expected_yield_per_plant="Continuous harvest", plant_height="24-36 inches", plant_spread="18 inches", sunlight_needs="Full Sun", water_needs="Medium", soil_preferences="Well-drained, pH 6.0-7.5", good_companions=["Most vegetables"], avoid_companions=["None known"], common_diseases=["Few issues"], care_tips=["Perennial", "Divide every 3 years"], harvest_info=HarvestInfo(90, 20, [13, 14, 15], "Cut sprigs", "As needed", "Use fresh or dry", "Morning"), container_suitable=True)],
    
    "marjoram": [CropVariety(crop_name="Marjoram", variety_name="Sweet", description="Mild oregano relative", days_to_maturity=70, growing_season=GrowingSeason.SUMMER, difficulty=Difficulty.EASY, space_per_plant_sqft=1.0, expected_yield_per_plant="Continuous harvest", plant_height="12-18 inches", plant_spread="12 inches", sunlight_needs="Full Sun", water_needs="Low-Medium", soil_preferences="Well-drained, pH 6.7-7.0", good_companions=["Most vegetables"], avoid_companions=["None known"], common_diseases=["Few issues"], care_tips=["Tender perennial", "Milder than oregano"], harvest_info=HarvestInfo(70, 16, [10, 11, 12], "Cut stems", "As needed", "Use fresh or dry", "Morning"), container_suitable=True)],
    
    "anise": [CropVariety(crop_name="Anise", variety_name="Common", description="Licorice-flavored seeds", days_to_maturity=120, growing_season=GrowingSeason.SUMMER, difficulty=Difficulty.MEDIUM, space_per_plant_sqft=0.5, expected_yield_per_plant="2-3 oz seeds", plant_height="24 inches", plant_spread="12 inches", sunlight_needs="Full Sun", water_needs="Medium", soil_preferences="Well-drained, pH 6.0-7.0", good_companions=["Coriander"], avoid_companions=["Carrots"], common_diseases=["Few issues"], care_tips=["Harvest seeds when brown", "Self-seeds"], harvest_info=HarvestInfo(120, 2, [17, 18], "Cut seed heads when dry", "Single harvest", "Dry and store", "Dry day"), container_suitable=True)],
    
    "caraway": [CropVariety(crop_name="Caraway", variety_name="Common", description="Rye bread spice", days_to_maturity=120, growing_season=GrowingSeason.SPRING_SUMMER, difficulty=Difficulty.EASY, space_per_plant_sqft=0.5, expected_yield_per_plant="2-3 oz seeds", plant_height="24 inches", plant_spread="12 inches", sunlight_needs="Full Sun", water_needs="Medium", soil_preferences="Well-drained, pH 6.0-7.0", good_companions=["Peas"], avoid_companions=["Fennel"], common_diseases=["Few issues"], care_tips=["Biennial - seeds second year", "Self-seeds readily"], harvest_info=HarvestInfo(120, 2, [17, 18], "Cut when seeds turn brown", "Single harvest", "Dry and store", "Dry day"), container_suitable=True)],
    
    "chamomile": [CropVariety(crop_name="Chamomile", variety_name="German", description="Medicinal tea herb", days_to_maturity=60, growing_season=GrowingSeason.SPRING_SUMMER, difficulty=Difficulty.EASY, space_per_plant_sqft=1.0, expected_yield_per_plant="Continuous harvest", plant_height="12-24 inches", plant_spread="12 inches", sunlight_needs="Full Sun", water_needs="Low-Medium", soil_preferences="Well-drained, pH 5.5-7.5", good_companions=["Cabbage", "onions"], avoid_companions=["None known"], common_diseases=["Few issues"], care_tips=["Self-seeds readily", "Harvest flowers for tea"], harvest_info=HarvestInfo(60, 12, [9, 10, 11], "Pick flowers when fully open", "Weekly", "Dry for storage", "Morning"), container_suitable=True)],
    
    "borage": [CropVariety(crop_name="Borage", variety_name="Common", description="Blue flowers, cucumber flavor", days_to_maturity=55, growing_season=GrowingSeason.SPRING_SUMMER, difficulty=Difficulty.EASY, space_per_plant_sqft=2.0, expected_yield_per_plant="Continuous harvest", plant_height="24-36 inches", plant_spread="18 inches", sunlight_needs="Full Sun", water_needs="Low-Medium", soil_preferences="Well-drained, pH 6.0-7.0", good_companions=["Tomatoes", "squash", "strawberries"], avoid_companions=["None known"], common_diseases=["Few issues"], care_tips=["Attracts beneficial insects", "Self-seeds readily"], harvest_info=HarvestInfo(55, 12, [8, 9, 10], "Pick young leaves and flowers", "Weekly", "Use fresh", "Morning"), container_suitable=True)],
    
    "lavender": [CropVariety(crop_name="Lavender", variety_name="English", description="Fragrant herb and flower", days_to_maturity=90, growing_season=GrowingSeason.SPRING_SUMMER, difficulty=Difficulty.MEDIUM, space_per_plant_sqft=4.0, expected_yield_per_plant="Continuous harvest", plant_height="24-36 inches", plant_spread="24 inches", sunlight_needs="Full Sun", water_needs="Low", soil_preferences="Well-drained, alkaline, pH 6.7-7.3", good_companions=["Roses", "fruit trees"], avoid_companions=["None known"], common_diseases=["Root rot if wet"], care_tips=["Perennial", "Excellent drainage essential"], harvest_info=HarvestInfo(90, 8, [13, 14], "Cut stems when buds open", "1-2 times per year", "Dry for storage", "Morning"), container_suitable=True)],
    
    "lemon_balm": [CropVariety(crop_name="Lemon Balm", variety_name="Melissa", description="Lemony mint relative", days_to_maturity=70, growing_season=GrowingSeason.SPRING_SUMMER, difficulty=Difficulty.EASY, space_per_plant_sqft=2.0, expected_yield_per_plant="Continuous harvest", plant_height="24 inches", plant_spread="18 inches", sunlight_needs="Full to Partial Sun", water_needs="Medium", soil_preferences="Well-drained, pH 6.0-7.5", good_companions=["Tomatoes", "squash"], avoid_companions=["None known"], common_diseases=["Few issues"], care_tips=["Perennial", "Can be invasive"], harvest_info=HarvestInfo(70, 20, [10, 11, 12], "Cut stems", "Weekly", "Use fresh or dry for tea", "Morning"), container_suitable=True)],
    
    "nasturtium": [CropVariety(crop_name="Nasturtium", variety_name="Jewel Mix", description="Edible flowers and leaves", days_to_maturity=50, growing_season=GrowingSeason.SPRING_SUMMER, difficulty=Difficulty.EASY, space_per_plant_sqft=1.0, expected_yield_per_plant="Continuous harvest", plant_height="12 inches", plant_spread="12-36 inches", sunlight_needs="Full to Partial Sun", water_needs="Low", soil_preferences="Poor to average, pH 6.0-8.0", good_companions=["Cucumbers", "tomatoes", "radishes"], avoid_companions=["None known"], common_diseases=["Aphids"], care_tips=["Peppery flavor", "Trap crop for aphids"], harvest_info=HarvestInfo(50, 12, [7, 8, 9], "Pick flowers and young leaves", "As needed", "Use fresh", "Morning"), container_suitable=True)],
    
    "calendula": [CropVariety(crop_name="Calendula", variety_name="Pot Marigold", description="Edible medicinal flower", days_to_maturity=55, growing_season=GrowingSeason.SPRING_SUMMER, difficulty=Difficulty.EASY, space_per_plant_sqft=1.0, expected_yield_per_plant="Continuous harvest", plant_height="18-24 inches", plant_spread="12 inches", sunlight_needs="Full Sun", water_needs="Low-Medium", soil_preferences="Well-drained, pH 6.0-7.0", good_companions=["Tomatoes", "asparagus"], avoid_companions=["None known"], common_diseases=["Powdery mildew"], care_tips=["Deadhead for more flowers", "Edible petals"], harvest_info=HarvestInfo(55, 16, [8, 9, 10, 11], "Pick flowers when fully open", "Every few days", "Use fresh or dry", "Morning"), container_suitable=True)],
}


def get_varieties_for_crop(crop_name: str) -> List[CropVariety]:
    """
    Get all varieties for a specific crop.
    
    Args:
        crop_name: Name of the crop
    
    Returns:
        List of crop varieties
    """
    crop_lower = crop_name.lower()
    
    # Direct match
    if crop_lower in VARIETY_DATABASE:
        return VARIETY_DATABASE[crop_lower]
    
    # Partial match
    for key in VARIETY_DATABASE:
        if key in crop_lower or crop_lower in key:
            return VARIETY_DATABASE[key]
    
    return []


def get_variety_by_name(crop_name: str, variety_name: str) -> Optional[CropVariety]:
    """
    Get a specific variety by name.
    
    Args:
        crop_name: Name of the crop
        variety_name: Name of the variety
    
    Returns:
        CropVariety if found, None otherwise
    """
    varieties = get_varieties_for_crop(crop_name)
    variety_lower = variety_name.lower()
    
    for variety in varieties:
        if variety.variety_name.lower() == variety_lower:
            return variety
    
    return None


def get_recommended_varieties(
    crop_name: str,
    difficulty_filter: Optional[Difficulty] = None,
    container_only: bool = False,
    disease_resistant_only: bool = False
) -> List[CropVariety]:
    """
    Get recommended varieties based on filters.
    
    Args:
        crop_name: Name of the crop
        difficulty_filter: Filter by difficulty level
        container_only: Only show container-suitable varieties
        disease_resistant_only: Only show disease-resistant varieties
    
    Returns:
        Filtered list of varieties
    """
    varieties = get_varieties_for_crop(crop_name)
    
    # Apply filters
    if difficulty_filter:
        varieties = [v for v in varieties if v.difficulty == difficulty_filter]
    
    if container_only:
        varieties = [v for v in varieties if v.container_suitable]
    
    if disease_resistant_only:
        varieties = [v for v in varieties if v.disease_resistant]
    
    return varieties


def generate_variety_guide(crop_name: str, max_varieties: int = 3) -> str:
    """
    Generate a guide for crop varieties.
    
    Args:
        crop_name: Name of the crop
        max_varieties: Maximum number of varieties to show
    
    Returns:
        Formatted variety guide string
    """
    varieties = get_varieties_for_crop(crop_name)
    
    if not varieties:
        return f"\nNo detailed variety information available for {crop_name}.\n"
    
    output = []
    output.append(f"\n{'=' * 70}")
    output.append(f"VARIETY RECOMMENDATIONS: {crop_name.upper()}")
    output.append('=' * 70)
    
    for variety in varieties[:max_varieties]:
        output.append(f"\n📦 {variety.variety_name}")
        if variety.heirloom:
            output.append("   (Heirloom)")
        elif variety.disease_resistant:
            output.append("   (Disease Resistant)")
        
        output.append(f"   {variety.description}")
        output.append(f"   Difficulty: {variety.difficulty.value}")
        output.append(f"   Days to Maturity: {variety.days_to_maturity} days")
        output.append(f"   Expected Yield: {variety.expected_yield_per_plant} per plant")
        output.append(f"   Space Needed: {variety.space_per_plant_sqft} sq ft per plant")
        output.append(f"   Height: {variety.plant_height}")
        
        if variety.container_suitable:
            output.append("   ✓ Container Suitable")
        
        if variety.harvest_info:
            output.append(f"\n   Harvest Info:")
            output.append(f"   • First Harvest: ~{variety.harvest_info.days_to_maturity} days from transplant")
            output.append(f"   • Harvest Period: {variety.harvest_info.harvest_period_weeks} weeks")
            output.append(f"   • Technique: {variety.harvest_info.harvest_technique}")
            output.append(f"   • Frequency: {variety.harvest_info.harvest_frequency}")
        
        if variety.care_tips:
            output.append(f"\n   Care Tips:")
            for tip in variety.care_tips[:3]:  # Show top 3 tips
                output.append(f"   • {tip}")
    
    return "\n".join(output)
