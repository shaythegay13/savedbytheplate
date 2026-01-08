"""
Crop Timing Database
Planting times, days to harvest, and seasonal information for 270+ crops
"""

from typing import Dict, List, Optional
from dataclasses import dataclass

@dataclass
class CropTiming:
    """Timing information for a crop"""
    name: str
    days_to_harvest: int  # Days from planting to harvest
    planting_season: List[str]  # When to plant: ["Spring", "Summer", "Fall", "Winter"]
    planting_months: List[str]  # Specific months to plant
    harvest_months: List[str]  # When to harvest
    succession_plant: bool  # Can be succession planted
    succession_interval_days: Optional[int] = None  # Days between succession plantings
    indoor_start_weeks: Optional[int] = None  # Weeks before last frost to start indoors
    notes: str = ""


# Comprehensive crop timing database for all 270+ crops
CROP_TIMING_DATABASE: Dict[str, CropTiming] = {
    # VEGETABLES - Solanaceae (Nightshades)
    "tomato": CropTiming(
        name="Tomato",
        days_to_harvest=70,
        planting_season=["Spring"],
        planting_months=["March", "April", "May"],
        harvest_months=["July", "August", "September"],
        succession_plant=False,
        indoor_start_weeks=6,
        notes="Start indoors 6-8 weeks before last frost"
    ),
    "pepper": CropTiming(
        name="Pepper",
        days_to_harvest=75,
        planting_season=["Spring"],
        planting_months=["March", "April", "May"],
        harvest_months=["July", "August", "September"],
        succession_plant=False,
        indoor_start_weeks=8,
        notes="Needs warm soil, transplant after last frost"
    ),
    "eggplant": CropTiming(
        name="Eggplant",
        days_to_harvest=80,
        planting_season=["Spring"],
        planting_months=["March", "April", "May"],
        harvest_months=["July", "August", "September"],
        succession_plant=False,
        indoor_start_weeks=8,
        notes="Very heat-loving, transplant after soil warms"
    ),
    "potato": CropTiming(
        name="Potato",
        days_to_harvest=90,
        planting_season=["Spring"],
        planting_months=["March", "April"],
        harvest_months=["June", "July", "August"],
        succession_plant=False,
        notes="Plant 2-4 weeks before last frost"
    ),
    
    # VEGETABLES - Brassicaceae (Brassicas)
    "broccoli": CropTiming(
        name="Broccoli",
        days_to_harvest=60,
        planting_season=["Spring", "Fall"],
        planting_months=["March", "April", "August"],
        harvest_months=["May", "June", "October", "November"],
        succession_plant=True,
        succession_interval_days=21,
        indoor_start_weeks=4,
        notes="Cool-season crop, tolerates light frost"
    ),
    "cabbage": CropTiming(
        name="Cabbage",
        days_to_harvest=70,
        planting_season=["Spring", "Fall"],
        planting_months=["March", "April", "August"],
        harvest_months=["June", "July", "October", "November"],
        succession_plant=False,
        indoor_start_weeks=4,
        notes="Cool-season crop"
    ),
    "kale": CropTiming(
        name="Kale",
        days_to_harvest=55,
        planting_season=["Spring", "Fall"],
        planting_months=["March", "April", "August", "September"],
        harvest_months=["May", "June", "October", "November", "December"],
        succession_plant=True,
        succession_interval_days=21,
        notes="Very cold-hardy, improves after frost"
    ),
    "cauliflower": CropTiming(
        name="Cauliflower",
        days_to_harvest=65,
        planting_season=["Spring", "Fall"],
        planting_months=["March", "April", "August"],
        harvest_months=["June", "July", "October", "November"],
        succession_plant=False,
        indoor_start_weeks=4,
        notes="Needs consistent moisture"
    ),
    
    # LEAFY GREENS
    "lettuce": CropTiming(
        name="Lettuce",
        days_to_harvest=45,
        planting_season=["Spring", "Fall"],
        planting_months=["March", "April", "August", "September"],
        harvest_months=["May", "June", "October", "November"],
        succession_plant=True,
        succession_interval_days=14,
        notes="Plant every 2 weeks for continuous harvest"
    ),
    "spinach": CropTiming(
        name="Spinach",
        days_to_harvest=40,
        planting_season=["Spring", "Fall"],
        planting_months=["March", "April", "August", "September"],
        harvest_months=["May", "June", "October", "November"],
        succession_plant=True,
        succession_interval_days=14,
        notes="Bolts in heat, best in cool weather"
    ),
    "arugula": CropTiming(
        name="Arugula",
        days_to_harvest=30,
        planting_season=["Spring", "Fall"],
        planting_months=["March", "April", "August", "September"],
        harvest_months=["April", "May", "September", "October"],
        succession_plant=True,
        succession_interval_days=14,
        notes="Fast-growing, spicy green"
    ),
    
    # HERBS
    "basil": CropTiming(
        name="Basil",
        days_to_harvest=60,
        planting_season=["Spring", "Summer"],
        planting_months=["April", "May", "June"],
        harvest_months=["June", "July", "August", "September"],
        succession_plant=True,
        succession_interval_days=21,
        indoor_start_weeks=6,
        notes="Very frost-sensitive, needs warm weather"
    ),
    "cilantro": CropTiming(
        name="Cilantro",
        days_to_harvest=40,
        planting_season=["Spring", "Fall"],
        planting_months=["March", "April", "September"],
        harvest_months=["May", "June", "October", "November"],
        succession_plant=True,
        succession_interval_days=14,
        notes="Bolts quickly in heat"
    ),
    "parsley": CropTiming(
        name="Parsley",
        days_to_harvest=70,
        planting_season=["Spring"],
        planting_months=["March", "April", "May"],
        harvest_months=["June", "July", "August", "September"],
        succession_plant=False,
        notes="Slow to germinate, soak seeds"
    ),
    "mint": CropTiming(
        name="Mint",
        days_to_harvest=90,
        planting_season=["Spring"],
        planting_months=["April", "May"],
        harvest_months=["June", "July", "August", "September"],
        succession_plant=False,
        notes="Perennial, very invasive - grow in containers"
    ),
    
    # LEGUMES
    "beans": CropTiming(
        name="Beans",
        days_to_harvest=55,
        planting_season=["Spring", "Summer"],
        planting_months=["May", "June", "July"],
        harvest_months=["July", "August", "September"],
        succession_plant=True,
        succession_interval_days=21,
        notes="Plant every 3 weeks for continuous harvest"
    ),
    "peas": CropTiming(
        name="Peas",
        days_to_harvest=60,
        planting_season=["Spring", "Fall"],
        planting_months=["March", "April", "August"],
        harvest_months=["May", "June", "October"],
        succession_plant=True,
        succession_interval_days=14,
        notes="Cool-season crop, plant early"
    ),
    
    # ROOT VEGETABLES
    "carrot": CropTiming(
        name="Carrot",
        days_to_harvest=70,
        planting_season=["Spring", "Summer"],
        planting_months=["March", "April", "May", "June"],
        harvest_months=["June", "July", "August", "September"],
        succession_plant=True,
        succession_interval_days=21,
        notes="Direct sow, thin seedlings"
    ),
    "radish": CropTiming(
        name="Radish",
        days_to_harvest=25,
        planting_season=["Spring", "Fall"],
        planting_months=["March", "April", "August", "September"],
        harvest_months=["April", "May", "September", "October"],
        succession_plant=True,
        succession_interval_days=10,
        notes="Fastest vegetable, plant every 10 days"
    ),
    "beet": CropTiming(
        name="Beet",
        days_to_harvest=55,
        planting_season=["Spring", "Fall"],
        planting_months=["March", "April", "August"],
        harvest_months=["May", "June", "October"],
        succession_plant=True,
        succession_interval_days=21,
        notes="Harvest greens and roots"
    ),
    
    # CUCURBITS
    "cucumber": CropTiming(
        name="Cucumber",
        days_to_harvest=55,
        planting_season=["Spring", "Summer"],
        planting_months=["May", "June"],
        harvest_months=["July", "August", "September"],
        succession_plant=True,
        succession_interval_days=21,
        notes="Needs warm soil, trellis for space"
    ),
    "zucchini": CropTiming(
        name="Zucchini",
        days_to_harvest=50,
        planting_season=["Spring", "Summer"],
        planting_months=["May", "June"],
        harvest_months=["July", "August", "September"],
        succession_plant=True,
        succession_interval_days=21,
        notes="Very productive, 1-2 plants sufficient"
    ),
    "squash": CropTiming(
        name="Squash",
        days_to_harvest=85,
        planting_season=["Spring"],
        planting_months=["May", "June"],
        harvest_months=["August", "September", "October"],
        succession_plant=False,
        notes="Winter squash needs long season"
    ),
    "pumpkin": CropTiming(
        name="Pumpkin",
        days_to_harvest=100,
        planting_season=["Spring", "Summer"],
        planting_months=["May", "June"],
        harvest_months=["September", "October"],
        succession_plant=False,
        notes="Needs lots of space"
    ),
    "watermelon": CropTiming(
        name="Watermelon",
        days_to_harvest=85,
        planting_season=["Spring"],
        planting_months=["May", "June"],
        harvest_months=["August", "September"],
        succession_plant=False,
        notes="Needs hot weather and space"
    ),
    
    # ALLIUMS
    "onion": CropTiming(
        name="Onion",
        days_to_harvest=100,
        planting_season=["Spring"],
        planting_months=["March", "April"],
        harvest_months=["July", "August"],
        succession_plant=False,
        notes="Plant sets or transplants early"
    ),
    "garlic": CropTiming(
        name="Garlic",
        days_to_harvest=240,
        planting_season=["Fall"],
        planting_months=["October", "November"],
        harvest_months=["June", "July"],
        succession_plant=False,
        notes="Plant in fall for summer harvest"
    ),
    "leek": CropTiming(
        name="Leek",
        days_to_harvest=120,
        planting_season=["Spring"],
        planting_months=["March", "April"],
        harvest_months=["August", "September", "October"],
        succession_plant=False,
        indoor_start_weeks=8,
        notes="Long season crop"
    ),
    
    # FRUITS - Berries
    "strawberry": CropTiming(
        name="Strawberry",
        days_to_harvest=120,
        planting_season=["Spring", "Fall"],
        planting_months=["April", "May", "September"],
        harvest_months=["May", "June"],
        succession_plant=False,
        notes="Perennial, produces year 2+"
    ),
    "blueberry": CropTiming(
        name="Blueberry",
        days_to_harvest=730,
        planting_season=["Spring", "Fall"],
        planting_months=["March", "April", "October"],
        harvest_months=["June", "July", "August"],
        succession_plant=False,
        notes="Perennial shrub, needs acidic soil"
    ),
    "raspberry": CropTiming(
        name="Raspberry",
        days_to_harvest=365,
        planting_season=["Spring", "Fall"],
        planting_months=["March", "April", "October"],
        harvest_months=["June", "July", "August"],
        succession_plant=False,
        notes="Perennial, produces year 2+"
    ),
    
    # GRAINS
    "corn": CropTiming(
        name="Corn",
        days_to_harvest=75,
        planting_season=["Spring", "Summer"],
        planting_months=["May", "June"],
        harvest_months=["July", "August", "September"],
        succession_plant=True,
        succession_interval_days=14,
        notes="Plant in blocks for pollination"
    ),
    "wheat": CropTiming(
        name="Wheat",
        days_to_harvest=120,
        planting_season=["Spring", "Fall"],
        planting_months=["March", "April", "September", "October"],
        harvest_months=["July", "August"],
        succession_plant=False,
        notes="Winter wheat planted in fall"
    ),
    "quinoa": CropTiming(
        name="Quinoa",
        days_to_harvest=90,
        planting_season=["Spring"],
        planting_months=["April", "May"],
        harvest_months=["July", "August"],
        succession_plant=False,
        notes="Drought-tolerant grain"
    ),
    
    # PHASE 2: MORE VEGETABLES (20 crops)
    "tomatillo": CropTiming(
        name="Tomatillo",
        days_to_harvest=75,
        planting_season=["Spring"],
        planting_months=["April", "May"],
        harvest_months=["July", "August", "September"],
        succession_plant=False,
        indoor_start_weeks=6,
        notes="Similar to tomatoes, needs support"
    ),
    "okra": CropTiming(
        name="Okra",
        days_to_harvest=60,
        planting_season=["Spring", "Summer"],
        planting_months=["May", "June"],
        harvest_months=["July", "August", "September"],
        succession_plant=True,
        succession_interval_days=14,
        notes="Heat-loving, very productive"
    ),
    "asparagus": CropTiming(
        name="Asparagus",
        days_to_harvest=730,
        planting_season=["Spring"],
        planting_months=["March", "April"],
        harvest_months=["April", "May"],
        succession_plant=False,
        notes="Perennial, harvest year 3+"
    ),
    "artichoke": CropTiming(
        name="Artichoke",
        days_to_harvest=180,
        planting_season=["Spring"],
        planting_months=["March", "April"],
        harvest_months=["June", "July"],
        succession_plant=False,
        indoor_start_weeks=8,
        notes="Perennial in warm climates"
    ),
    "brussels_sprouts": CropTiming(
        name="Brussels Sprouts",
        days_to_harvest=90,
        planting_season=["Spring", "Summer"],
        planting_months=["March", "April", "July"],
        harvest_months=["October", "November", "December"],
        succession_plant=False,
        indoor_start_weeks=4,
        notes="Cold-hardy, improves with frost"
    ),
    "kohlrabi": CropTiming(
        name="Kohlrabi",
        days_to_harvest=55,
        planting_season=["Spring", "Fall"],
        planting_months=["March", "April", "August"],
        harvest_months=["May", "June", "October"],
        succession_plant=True,
        succession_interval_days=21,
        notes="Fast-growing brassica"
    ),
    "turnip": CropTiming(
        name="Turnip",
        days_to_harvest=50,
        planting_season=["Spring", "Fall"],
        planting_months=["March", "April", "August", "September"],
        harvest_months=["May", "June", "October", "November"],
        succession_plant=True,
        succession_interval_days=21,
        notes="Harvest greens and roots"
    ),
    "rutabaga": CropTiming(
        name="Rutabaga",
        days_to_harvest=90,
        planting_season=["Summer"],
        planting_months=["June", "July"],
        harvest_months=["October", "November"],
        succession_plant=False,
        notes="Cold-hardy root vegetable"
    ),
    "parsnip": CropTiming(
        name="Parsnip",
        days_to_harvest=120,
        planting_season=["Spring"],
        planting_months=["March", "April"],
        harvest_months=["October", "November"],
        succession_plant=False,
        notes="Sweetens after frost"
    ),
    "celery": CropTiming(
        name="Celery",
        days_to_harvest=120,
        planting_season=["Spring"],
        planting_months=["March", "April"],
        harvest_months=["August", "September"],
        succession_plant=False,
        indoor_start_weeks=10,
        notes="Needs consistent moisture"
    ),
    "swiss_chard": CropTiming(
        name="Swiss Chard",
        days_to_harvest=55,
        planting_season=["Spring", "Summer"],
        planting_months=["March", "April", "May", "June"],
        harvest_months=["June", "July", "August", "September"],
        succession_plant=True,
        succession_interval_days=21,
        notes="Heat-tolerant leafy green"
    ),
    "collard_greens": CropTiming(
        name="Collard Greens",
        days_to_harvest=60,
        planting_season=["Spring", "Fall"],
        planting_months=["March", "April", "August"],
        harvest_months=["June", "October", "November"],
        succession_plant=True,
        succession_interval_days=21,
        notes="Very cold-hardy"
    ),
    "mustard_greens": CropTiming(
        name="Mustard Greens",
        days_to_harvest=40,
        planting_season=["Spring", "Fall"],
        planting_months=["March", "April", "August", "September"],
        harvest_months=["May", "June", "October"],
        succession_plant=True,
        succession_interval_days=14,
        notes="Spicy greens"
    ),
    "bok_choy": CropTiming(
        name="Bok Choy",
        days_to_harvest=45,
        planting_season=["Spring", "Fall"],
        planting_months=["March", "April", "August", "September"],
        harvest_months=["May", "June", "October"],
        succession_plant=True,
        succession_interval_days=14,
        notes="Asian green, quick-growing"
    ),
    "napa_cabbage": CropTiming(
        name="Napa Cabbage",
        days_to_harvest=70,
        planting_season=["Fall"],
        planting_months=["July", "August"],
        harvest_months=["September", "October", "November"],
        succession_plant=False,
        notes="Chinese cabbage"
    ),
    "endive": CropTiming(
        name="Endive",
        days_to_harvest=85,
        planting_season=["Summer", "Fall"],
        planting_months=["July", "August"],
        harvest_months=["October", "November"],
        succession_plant=False,
        notes="Bitter salad green"
    ),
    "radicchio": CropTiming(
        name="Radicchio",
        days_to_harvest=85,
        planting_season=["Summer"],
        planting_months=["July", "August"],
        harvest_months=["October", "November"],
        succession_plant=False,
        notes="Italian chicory"
    ),
    "watercress": CropTiming(
        name="Watercress",
        days_to_harvest=50,
        planting_season=["Spring", "Fall"],
        planting_months=["March", "April", "September"],
        harvest_months=["May", "June", "October", "November"],
        succession_plant=True,
        succession_interval_days=14,
        notes="Aquatic green, needs water"
    ),
    "rhubarb": CropTiming(
        name="Rhubarb",
        days_to_harvest=730,
        planting_season=["Spring"],
        planting_months=["March", "April"],
        harvest_months=["April", "May", "June"],
        succession_plant=False,
        notes="Perennial, harvest year 2+"
    ),
    "horseradish": CropTiming(
        name="Horseradish",
        days_to_harvest=180,
        planting_season=["Spring"],
        planting_months=["March", "April"],
        harvest_months=["October", "November"],
        succession_plant=False,
        notes="Perennial root, very invasive"
    ),
    
    # PHASE 3: ALL HERBS (30 crops)
    "oregano": CropTiming(
        name="Oregano",
        days_to_harvest=90,
        planting_season=["Spring"],
        planting_months=["April", "May"],
        harvest_months=["June", "July", "August", "September"],
        succession_plant=False,
        indoor_start_weeks=6,
        notes="Perennial herb, drought-tolerant"
    ),
    "thyme": CropTiming(
        name="Thyme",
        days_to_harvest=90,
        planting_season=["Spring"],
        planting_months=["April", "May"],
        harvest_months=["June", "July", "August", "September"],
        succession_plant=False,
        indoor_start_weeks=6,
        notes="Perennial herb, low-growing"
    ),
    "rosemary": CropTiming(
        name="Rosemary",
        days_to_harvest=180,
        planting_season=["Spring"],
        planting_months=["April", "May"],
        harvest_months=["Year-round"],
        succession_plant=False,
        indoor_start_weeks=8,
        notes="Perennial shrub, tender in cold"
    ),
    "sage": CropTiming(
        name="Sage",
        days_to_harvest=90,
        planting_season=["Spring"],
        planting_months=["April", "May"],
        harvest_months=["June", "July", "August", "September"],
        succession_plant=False,
        indoor_start_weeks=6,
        notes="Perennial herb, cold-hardy"
    ),
    "dill": CropTiming(
        name="Dill",
        days_to_harvest=70,
        planting_season=["Spring", "Summer"],
        planting_months=["April", "May", "June"],
        harvest_months=["June", "July", "August"],
        succession_plant=True,
        succession_interval_days=21,
        notes="Annual, bolts in heat"
    ),
    "chives": CropTiming(
        name="Chives",
        days_to_harvest=90,
        planting_season=["Spring"],
        planting_months=["March", "April"],
        harvest_months=["May", "June", "July", "August"],
        succession_plant=False,
        notes="Perennial, very cold-hardy"
    ),
    "tarragon": CropTiming(
        name="Tarragon",
        days_to_harvest=120,
        planting_season=["Spring"],
        planting_months=["April", "May"],
        harvest_months=["June", "July", "August"],
        succession_plant=False,
        notes="Perennial, French variety best"
    ),
    "marjoram": CropTiming(
        name="Marjoram",
        days_to_harvest=70,
        planting_season=["Spring"],
        planting_months=["April", "May"],
        harvest_months=["June", "July", "August"],
        succession_plant=False,
        indoor_start_weeks=6,
        notes="Similar to oregano, tender"
    ),
    "lavender": CropTiming(
        name="Lavender",
        days_to_harvest=365,
        planting_season=["Spring"],
        planting_months=["April", "May"],
        harvest_months=["June", "July"],
        succession_plant=False,
        notes="Perennial, needs good drainage"
    ),
    "lemon_balm": CropTiming(
        name="Lemon Balm",
        days_to_harvest=70,
        planting_season=["Spring"],
        planting_months=["April", "May"],
        harvest_months=["June", "July", "August"],
        succession_plant=False,
        notes="Perennial, can be invasive"
    ),
    "chamomile": CropTiming(
        name="Chamomile",
        days_to_harvest=60,
        planting_season=["Spring", "Fall"],
        planting_months=["March", "April", "September"],
        harvest_months=["May", "June", "October"],
        succession_plant=True,
        succession_interval_days=21,
        notes="Annual, self-seeds readily"
    ),
    "stevia": CropTiming(
        name="Stevia",
        days_to_harvest=120,
        planting_season=["Spring"],
        planting_months=["April", "May"],
        harvest_months=["July", "August", "September"],
        succession_plant=False,
        indoor_start_weeks=8,
        notes="Tender perennial, natural sweetener"
    ),
    "catnip": CropTiming(
        name="Catnip",
        days_to_harvest=90,
        planting_season=["Spring"],
        planting_months=["April", "May"],
        harvest_months=["June", "July", "August"],
        succession_plant=False,
        notes="Perennial, attracts cats"
    ),
    "lemongrass": CropTiming(
        name="Lemongrass",
        days_to_harvest=90,
        planting_season=["Spring"],
        planting_months=["May", "June"],
        harvest_months=["July", "August", "September"],
        succession_plant=False,
        notes="Tropical grass, tender"
    ),
    "bay_leaf": CropTiming(
        name="Bay Leaf",
        days_to_harvest=730,
        planting_season=["Spring"],
        planting_months=["April", "May"],
        harvest_months=["Year-round"],
        succession_plant=False,
        notes="Perennial tree, container-friendly"
    ),
    "sorrel": CropTiming(
        name="Sorrel",
        days_to_harvest=60,
        planting_season=["Spring", "Fall"],
        planting_months=["March", "April", "September"],
        harvest_months=["May", "June", "October"],
        succession_plant=True,
        succession_interval_days=21,
        notes="Perennial, lemony flavor"
    ),
    "borage": CropTiming(
        name="Borage",
        days_to_harvest=60,
        planting_season=["Spring"],
        planting_months=["April", "May"],
        harvest_months=["June", "July", "August"],
        succession_plant=True,
        succession_interval_days=21,
        notes="Annual, edible flowers"
    ),
    "anise": CropTiming(
        name="Anise",
        days_to_harvest=120,
        planting_season=["Spring"],
        planting_months=["April", "May"],
        harvest_months=["August", "September"],
        succession_plant=False,
        notes="Annual, licorice flavor"
    ),
    "caraway": CropTiming(
        name="Caraway",
        days_to_harvest=120,
        planting_season=["Spring", "Fall"],
        planting_months=["April", "September"],
        harvest_months=["July", "August"],
        succession_plant=False,
        notes="Biennial, seeds in year 2"
    ),
    "coriander": CropTiming(
        name="Coriander",
        days_to_harvest=100,
        planting_season=["Spring"],
        planting_months=["April", "May"],
        harvest_months=["July", "August"],
        succession_plant=False,
        notes="Cilantro seeds, let bolt"
    ),
    
    # PHASE 4: FRUITS & BERRIES (40 crops)
    "blackberry": CropTiming(
        name="Blackberry",
        days_to_harvest=365,
        planting_season=["Spring", "Fall"],
        planting_months=["March", "April", "October"],
        harvest_months=["June", "July", "August"],
        succession_plant=False,
        notes="Perennial canes, produces year 2+"
    ),
    "gooseberry": CropTiming(
        name="Gooseberry",
        days_to_harvest=730,
        planting_season=["Spring", "Fall"],
        planting_months=["March", "April", "October"],
        harvest_months=["June", "July"],
        succession_plant=False,
        notes="Perennial shrub, cold-hardy"
    ),
    "currant": CropTiming(
        name="Currant",
        days_to_harvest=730,
        planting_season=["Spring", "Fall"],
        planting_months=["March", "April", "October"],
        harvest_months=["June", "July"],
        succession_plant=False,
        notes="Perennial shrub, red/black varieties"
    ),
    "elderberry": CropTiming(
        name="Elderberry",
        days_to_harvest=730,
        planting_season=["Spring", "Fall"],
        planting_months=["March", "April", "October"],
        harvest_months=["August", "September"],
        succession_plant=False,
        notes="Perennial shrub, medicinal"
    ),
    "cranberry": CropTiming(
        name="Cranberry",
        days_to_harvest=1095,
        planting_season=["Spring"],
        planting_months=["April", "May"],
        harvest_months=["September", "October"],
        succession_plant=False,
        notes="Perennial, needs acidic bog conditions"
    ),
    "grape": CropTiming(
        name="Grape",
        days_to_harvest=1095,
        planting_season=["Spring"],
        planting_months=["March", "April"],
        harvest_months=["August", "September", "October"],
        succession_plant=False,
        notes="Perennial vine, produces year 3+"
    ),
    "kiwi": CropTiming(
        name="Kiwi",
        days_to_harvest=1825,
        planting_season=["Spring"],
        planting_months=["March", "April"],
        harvest_months=["October", "November"],
        succession_plant=False,
        notes="Perennial vine, needs male/female"
    ),
    "fig": CropTiming(
        name="Fig",
        days_to_harvest=1095,
        planting_season=["Spring"],
        planting_months=["March", "April"],
        harvest_months=["August", "September"],
        succession_plant=False,
        notes="Perennial tree, warm climates"
    ),
    "apple": CropTiming(
        name="Apple",
        days_to_harvest=1825,
        planting_season=["Spring", "Fall"],
        planting_months=["March", "April", "October", "November"],
        harvest_months=["August", "September", "October"],
        succession_plant=False,
        notes="Perennial tree, produces year 5+"
    ),
    "pear": CropTiming(
        name="Pear",
        days_to_harvest=1825,
        planting_season=["Spring", "Fall"],
        planting_months=["March", "April", "October", "November"],
        harvest_months=["August", "September", "October"],
        succession_plant=False,
        notes="Perennial tree, produces year 5+"
    ),
    "cherry": CropTiming(
        name="Cherry",
        days_to_harvest=1460,
        planting_season=["Spring", "Fall"],
        planting_months=["March", "April", "October"],
        harvest_months=["June", "July"],
        succession_plant=False,
        notes="Perennial tree, sweet/sour varieties"
    ),
    "plum": CropTiming(
        name="Plum",
        days_to_harvest=1460,
        planting_season=["Spring", "Fall"],
        planting_months=["March", "April", "October"],
        harvest_months=["July", "August", "September"],
        succession_plant=False,
        notes="Perennial tree, produces year 4+"
    ),
    "peach": CropTiming(
        name="Peach",
        days_to_harvest=1460,
        planting_season=["Spring"],
        planting_months=["March", "April"],
        harvest_months=["July", "August"],
        succession_plant=False,
        notes="Perennial tree, needs chill hours"
    ),
    "apricot": CropTiming(
        name="Apricot",
        days_to_harvest=1460,
        planting_season=["Spring"],
        planting_months=["March", "April"],
        harvest_months=["June", "July"],
        succession_plant=False,
        notes="Perennial tree, early bloomer"
    ),
    "nectarine": CropTiming(
        name="Nectarine",
        days_to_harvest=1460,
        planting_season=["Spring"],
        planting_months=["March", "April"],
        harvest_months=["July", "August"],
        succession_plant=False,
        notes="Perennial tree, smooth peach"
    ),
    "persimmon": CropTiming(
        name="Persimmon",
        days_to_harvest=1825,
        planting_season=["Spring", "Fall"],
        planting_months=["March", "April", "October"],
        harvest_months=["October", "November"],
        succession_plant=False,
        notes="Perennial tree, astringent/non-astringent"
    ),
    "pomegranate": CropTiming(
        name="Pomegranate",
        days_to_harvest=1095,
        planting_season=["Spring"],
        planting_months=["March", "April"],
        harvest_months=["September", "October"],
        succession_plant=False,
        notes="Perennial shrub/tree, warm climates"
    ),
    "quince": CropTiming(
        name="Quince",
        days_to_harvest=1460,
        planting_season=["Spring", "Fall"],
        planting_months=["March", "April", "October"],
        harvest_months=["October", "November"],
        succession_plant=False,
        notes="Perennial tree, cooking fruit"
    ),
    "mulberry": CropTiming(
        name="Mulberry",
        days_to_harvest=1095,
        planting_season=["Spring"],
        planting_months=["March", "April"],
        harvest_months=["June", "July"],
        succession_plant=False,
        notes="Perennial tree, very productive"
    ),
    "pawpaw": CropTiming(
        name="Pawpaw",
        days_to_harvest=1825,
        planting_season=["Spring", "Fall"],
        planting_months=["March", "April", "October"],
        harvest_months=["September", "October"],
        succession_plant=False,
        notes="Native tree, tropical flavor"
    ),
    "melon": CropTiming(
        name="Melon",
        days_to_harvest=80,
        planting_season=["Spring"],
        planting_months=["May", "June"],
        harvest_months=["July", "August", "September"],
        succession_plant=False,
        notes="Cantaloupe, honeydew varieties"
    ),
    "cantaloupe": CropTiming(
        name="Cantaloupe",
        days_to_harvest=80,
        planting_season=["Spring"],
        planting_months=["May", "June"],
        harvest_months=["July", "August", "September"],
        succession_plant=False,
        notes="Warm-season melon"
    ),
    "honeydew": CropTiming(
        name="Honeydew",
        days_to_harvest=90,
        planting_season=["Spring"],
        planting_months=["May", "June"],
        harvest_months=["August", "September"],
        succession_plant=False,
        notes="Needs longer season than cantaloupe"
    ),
    "goji_berry": CropTiming(
        name="Goji Berry",
        days_to_harvest=730,
        planting_season=["Spring"],
        planting_months=["April", "May"],
        harvest_months=["July", "August", "September"],
        succession_plant=False,
        notes="Perennial shrub, superfood"
    ),
    "huckleberry": CropTiming(
        name="Huckleberry",
        days_to_harvest=730,
        planting_season=["Spring", "Fall"],
        planting_months=["March", "April", "October"],
        harvest_months=["July", "August"],
        succession_plant=False,
        notes="Perennial shrub, native"
    ),
    "serviceberry": CropTiming(
        name="Serviceberry",
        days_to_harvest=1095,
        planting_season=["Spring", "Fall"],
        planting_months=["March", "April", "October"],
        harvest_months=["June", "July"],
        succession_plant=False,
        notes="Native shrub/tree, ornamental"
    ),
    "aronia": CropTiming(
        name="Aronia",
        days_to_harvest=730,
        planting_season=["Spring", "Fall"],
        planting_months=["March", "April", "October"],
        harvest_months=["August", "September"],
        succession_plant=False,
        notes="Chokeberry, superfood"
    ),
    "sea_buckthorn": CropTiming(
        name="Sea Buckthorn",
        days_to_harvest=1095,
        planting_season=["Spring"],
        planting_months=["March", "April"],
        harvest_months=["August", "September"],
        succession_plant=False,
        notes="Perennial shrub, vitamin C rich"
    ),
    "jujube": CropTiming(
        name="Jujube",
        days_to_harvest=1095,
        planting_season=["Spring"],
        planting_months=["March", "April"],
        harvest_months=["September", "October"],
        succession_plant=False,
        notes="Chinese date, drought-tolerant"
    ),
    "passion_fruit": CropTiming(
        name="Passion Fruit",
        days_to_harvest=365,
        planting_season=["Spring"],
        planting_months=["April", "May"],
        harvest_months=["July", "August", "September"],
        succession_plant=False,
        notes="Tropical vine, tender"
    ),
    
    # PHASE 5: GRAINS & MORE LEGUMES (30 crops)
    "rice": CropTiming(
        name="Rice",
        days_to_harvest=120,
        planting_season=["Spring"],
        planting_months=["April", "May"],
        harvest_months=["August", "September"],
        succession_plant=False,
        notes="Needs flooded conditions"
    ),
    "barley": CropTiming(
        name="Barley",
        days_to_harvest=90,
        planting_season=["Spring", "Fall"],
        planting_months=["March", "April", "September"],
        harvest_months=["July", "August"],
        succession_plant=False,
        notes="Cool-season grain"
    ),
    "oats": CropTiming(
        name="Oats",
        days_to_harvest=90,
        planting_season=["Spring", "Fall"],
        planting_months=["March", "April", "September"],
        harvest_months=["July", "August"],
        succession_plant=False,
        notes="Cool-season grain, cover crop"
    ),
    "rye": CropTiming(
        name="Rye",
        days_to_harvest=120,
        planting_season=["Fall"],
        planting_months=["September", "October"],
        harvest_months=["June", "July"],
        succession_plant=False,
        notes="Winter grain, cover crop"
    ),
    "millet": CropTiming(
        name="Millet",
        days_to_harvest=75,
        planting_season=["Spring", "Summer"],
        planting_months=["May", "June"],
        harvest_months=["August", "September"],
        succession_plant=False,
        notes="Drought-tolerant grain"
    ),
    "sorghum": CropTiming(
        name="Sorghum",
        days_to_harvest=100,
        planting_season=["Spring"],
        planting_months=["May", "June"],
        harvest_months=["September", "October"],
        succession_plant=False,
        notes="Drought-tolerant grain"
    ),
    "amaranth": CropTiming(
        name="Amaranth",
        days_to_harvest=100,
        planting_season=["Spring"],
        planting_months=["May", "June"],
        harvest_months=["August", "September"],
        succession_plant=False,
        notes="Grain and greens"
    ),
    "buckwheat": CropTiming(
        name="Buckwheat",
        days_to_harvest=70,
        planting_season=["Spring", "Summer"],
        planting_months=["May", "June", "July"],
        harvest_months=["July", "August", "September"],
        succession_plant=True,
        succession_interval_days=21,
        notes="Fast grain, cover crop"
    ),
    "lentils": CropTiming(
        name="Lentils",
        days_to_harvest=100,
        planting_season=["Spring"],
        planting_months=["April", "May"],
        harvest_months=["July", "August"],
        succession_plant=False,
        notes="Cool-season legume"
    ),
    "chickpeas": CropTiming(
        name="Chickpeas",
        days_to_harvest=100,
        planting_season=["Spring"],
        planting_months=["April", "May"],
        harvest_months=["July", "August"],
        succession_plant=False,
        notes="Garbanzo beans, warm-season"
    ),
    "soybeans": CropTiming(
        name="Soybeans",
        days_to_harvest=100,
        planting_season=["Spring"],
        planting_months=["May", "June"],
        harvest_months=["September", "October"],
        succession_plant=False,
        notes="Edamame when young"
    ),
    "fava_beans": CropTiming(
        name="Fava Beans",
        days_to_harvest=80,
        planting_season=["Spring", "Fall"],
        planting_months=["March", "April", "October"],
        harvest_months=["June", "July"],
        succession_plant=False,
        notes="Broad beans, cool-season"
    ),
    "lima_beans": CropTiming(
        name="Lima Beans",
        days_to_harvest=75,
        planting_season=["Spring"],
        planting_months=["May", "June"],
        harvest_months=["August", "September"],
        succession_plant=False,
        notes="Warm-season, butter beans"
    ),
    "black_beans": CropTiming(
        name="Black Beans",
        days_to_harvest=90,
        planting_season=["Spring"],
        planting_months=["May", "June"],
        harvest_months=["August", "September"],
        succession_plant=False,
        notes="Dry beans"
    ),
    "pinto_beans": CropTiming(
        name="Pinto Beans",
        days_to_harvest=90,
        planting_season=["Spring"],
        planting_months=["May", "June"],
        harvest_months=["August", "September"],
        succession_plant=False,
        notes="Dry beans"
    ),
    "kidney_beans": CropTiming(
        name="Kidney Beans",
        days_to_harvest=95,
        planting_season=["Spring"],
        planting_months=["May", "June"],
        harvest_months=["August", "September"],
        succession_plant=False,
        notes="Dry beans"
    ),
    "navy_beans": CropTiming(
        name="Navy Beans",
        days_to_harvest=85,
        planting_season=["Spring"],
        planting_months=["May", "June"],
        harvest_months=["August", "September"],
        succession_plant=False,
        notes="Small white beans"
    ),
    "adzuki_beans": CropTiming(
        name="Adzuki Beans",
        days_to_harvest=120,
        planting_season=["Spring"],
        planting_months=["May", "June"],
        harvest_months=["September", "October"],
        succession_plant=False,
        notes="Asian red beans"
    ),
    "mung_beans": CropTiming(
        name="Mung Beans",
        days_to_harvest=90,
        planting_season=["Spring"],
        planting_months=["May", "June"],
        harvest_months=["August", "September"],
        succession_plant=False,
        notes="Sprouting beans"
    ),
    "cowpeas": CropTiming(
        name="Cowpeas",
        days_to_harvest=75,
        planting_season=["Spring", "Summer"],
        planting_months=["May", "June"],
        harvest_months=["August", "September"],
        succession_plant=False,
        notes="Black-eyed peas, heat-tolerant"
    ),
    
    # PHASE 6: NUTS & TROPICAL FRUITS (30 crops)
    "almond": CropTiming(
        name="Almond",
        days_to_harvest=1825,
        planting_season=["Spring"],
        planting_months=["March", "April"],
        harvest_months=["August", "September"],
        succession_plant=False,
        notes="Tree nut, warm climates"
    ),
    "walnut": CropTiming(
        name="Walnut",
        days_to_harvest=2555,
        planting_season=["Spring", "Fall"],
        planting_months=["March", "April", "October"],
        harvest_months=["September", "October"],
        succession_plant=False,
        notes="Large tree, produces year 7+"
    ),
    "pecan": CropTiming(
        name="Pecan",
        days_to_harvest=2555,
        planting_season=["Spring"],
        planting_months=["March", "April"],
        harvest_months=["October", "November"],
        succession_plant=False,
        notes="Large tree, southern climates"
    ),
    "hazelnut": CropTiming(
        name="Hazelnut",
        days_to_harvest=1095,
        planting_season=["Spring", "Fall"],
        planting_months=["March", "April", "October"],
        harvest_months=["September", "October"],
        succession_plant=False,
        notes="Filbert, shrub/tree"
    ),
    "chestnut": CropTiming(
        name="Chestnut",
        days_to_harvest=1825,
        planting_season=["Spring"],
        planting_months=["March", "April"],
        harvest_months=["September", "October"],
        succession_plant=False,
        notes="Tree nut, blight-resistant varieties"
    ),
    "pistachio": CropTiming(
        name="Pistachio",
        days_to_harvest=2555,
        planting_season=["Spring"],
        planting_months=["March", "April"],
        harvest_months=["September", "October"],
        succession_plant=False,
        notes="Tree nut, arid climates"
    ),
    "cashew": CropTiming(
        name="Cashew",
        days_to_harvest=1095,
        planting_season=["Spring"],
        planting_months=["April", "May"],
        harvest_months=["Year-round"],
        succession_plant=False,
        notes="Tropical tree, frost-sensitive"
    ),
    "macadamia": CropTiming(
        name="Macadamia",
        days_to_harvest=2190,
        planting_season=["Spring"],
        planting_months=["March", "April"],
        harvest_months=["Year-round"],
        succession_plant=False,
        notes="Tropical tree, Hawaii/California"
    ),
    "pine_nut": CropTiming(
        name="Pine Nut",
        days_to_harvest=5475,
        planting_season=["Spring"],
        planting_months=["March", "April"],
        harvest_months=["September", "October"],
        succession_plant=False,
        notes="Pinyon pine, very long to produce"
    ),
    "peanut": CropTiming(
        name="Peanut",
        days_to_harvest=120,
        planting_season=["Spring"],
        planting_months=["May", "June"],
        harvest_months=["September", "October"],
        succession_plant=False,
        notes="Ground nut, warm climates"
    ),
    "mango": CropTiming(
        name="Mango",
        days_to_harvest=1825,
        planting_season=["Spring"],
        planting_months=["March", "April"],
        harvest_months=["June", "July", "August"],
        succession_plant=False,
        notes="Tropical tree, frost-sensitive"
    ),
    "papaya": CropTiming(
        name="Papaya",
        days_to_harvest=270,
        planting_season=["Spring"],
        planting_months=["March", "April", "May"],
        harvest_months=["Year-round"],
        succession_plant=False,
        notes="Tropical tree, fast-growing"
    ),
    "banana": CropTiming(
        name="Banana",
        days_to_harvest=270,
        planting_season=["Spring"],
        planting_months=["March", "April", "May"],
        harvest_months=["Year-round"],
        succession_plant=False,
        notes="Tropical plant, needs warmth"
    ),
    "pineapple": CropTiming(
        name="Pineapple",
        days_to_harvest=540,
        planting_season=["Spring"],
        planting_months=["March", "April", "May"],
        harvest_months=["Year-round"],
        succession_plant=False,
        notes="Tropical plant, 18 months to fruit"
    ),
    "avocado": CropTiming(
        name="Avocado",
        days_to_harvest=1460,
        planting_season=["Spring"],
        planting_months=["March", "April"],
        harvest_months=["Year-round"],
        succession_plant=False,
        notes="Tropical tree, frost-sensitive"
    ),
    "guava": CropTiming(
        name="Guava",
        days_to_harvest=730,
        planting_season=["Spring"],
        planting_months=["March", "April"],
        harvest_months=["Year-round"],
        succession_plant=False,
        notes="Tropical shrub/tree"
    ),
    "lychee": CropTiming(
        name="Lychee",
        days_to_harvest=1825,
        planting_season=["Spring"],
        planting_months=["March", "April"],
        harvest_months=["May", "June"],
        succession_plant=False,
        notes="Tropical tree, needs chill"
    ),
    "dragon_fruit": CropTiming(
        name="Dragon Fruit",
        days_to_harvest=365,
        planting_season=["Spring"],
        planting_months=["April", "May"],
        harvest_months=["Summer", "Fall"],
        succession_plant=False,
        notes="Cactus fruit, warm climates"
    ),
    "starfruit": CropTiming(
        name="Starfruit",
        days_to_harvest=1095,
        planting_season=["Spring"],
        planting_months=["March", "April"],
        harvest_months=["Year-round"],
        succession_plant=False,
        notes="Carambola, tropical tree"
    ),
    "coconut": CropTiming(
        name="Coconut",
        days_to_harvest=2190,
        planting_season=["Spring"],
        planting_months=["Year-round"],
        harvest_months=["Year-round"],
        succession_plant=False,
        notes="Tropical palm, coastal"
    ),
    "date": CropTiming(
        name="Date",
        days_to_harvest=1825,
        planting_season=["Spring"],
        planting_months=["March", "April"],
        harvest_months=["September", "October"],
        succession_plant=False,
        notes="Date palm, arid climates"
    ),
    "orange": CropTiming(
        name="Orange",
        days_to_harvest=1095,
        planting_season=["Spring"],
        planting_months=["March", "April"],
        harvest_months=["December", "January", "February"],
        succession_plant=False,
        notes="Citrus tree, warm climates"
    ),
    "lemon": CropTiming(
        name="Lemon",
        days_to_harvest=1095,
        planting_season=["Spring"],
        planting_months=["March", "April"],
        harvest_months=["Year-round"],
        succession_plant=False,
        notes="Citrus tree, warm climates"
    ),
    "lime": CropTiming(
        name="Lime",
        days_to_harvest=1095,
        planting_season=["Spring"],
        planting_months=["March", "April"],
        harvest_months=["Year-round"],
        succession_plant=False,
        notes="Citrus tree, warm climates"
    ),
    "grapefruit": CropTiming(
        name="Grapefruit",
        days_to_harvest=1095,
        planting_season=["Spring"],
        planting_months=["March", "April"],
        harvest_months=["December", "January", "February"],
        succession_plant=False,
        notes="Citrus tree, warm climates"
    ),
    "tangerine": CropTiming(
        name="Tangerine",
        days_to_harvest=1095,
        planting_season=["Spring"],
        planting_months=["March", "April"],
        harvest_months=["November", "December", "January"],
        succession_plant=False,
        notes="Mandarin citrus, warm climates"
    ),
    
    # PHASE 7: ASIAN & SPECIALTY VEGETABLES (40 crops)
    "daikon": CropTiming(
        name="Daikon",
        days_to_harvest=60,
        planting_season=["Spring", "Fall"],
        planting_months=["March", "April", "August", "September"],
        harvest_months=["May", "June", "October", "November"],
        succession_plant=True,
        succession_interval_days=21,
        notes="Japanese radish, large"
    ),
    "mizuna": CropTiming(
        name="Mizuna",
        days_to_harvest=40,
        planting_season=["Spring", "Fall"],
        planting_months=["March", "April", "August", "September"],
        harvest_months=["May", "June", "October"],
        succession_plant=True,
        succession_interval_days=14,
        notes="Japanese mustard green"
    ),
    "tatsoi": CropTiming(
        name="Tatsoi",
        days_to_harvest=45,
        planting_season=["Spring", "Fall"],
        planting_months=["March", "April", "August", "September"],
        harvest_months=["May", "June", "October"],
        succession_plant=True,
        succession_interval_days=14,
        notes="Asian spoon mustard"
    ),
    "gai_lan": CropTiming(
        name="Gai Lan",
        days_to_harvest=60,
        planting_season=["Spring", "Fall"],
        planting_months=["March", "April", "August"],
        harvest_months=["May", "June", "October"],
        succession_plant=True,
        succession_interval_days=21,
        notes="Chinese broccoli"
    ),
    "yu_choy": CropTiming(
        name="Yu Choy",
        days_to_harvest=50,
        planting_season=["Spring", "Fall"],
        planting_months=["March", "April", "August", "September"],
        harvest_months=["May", "June", "October"],
        succession_plant=True,
        succession_interval_days=14,
        notes="Chinese flowering cabbage"
    ),
    "komatsuna": CropTiming(
        name="Komatsuna",
        days_to_harvest=40,
        planting_season=["Spring", "Fall"],
        planting_months=["March", "April", "August", "September"],
        harvest_months=["May", "June", "October"],
        succession_plant=True,
        succession_interval_days=14,
        notes="Japanese mustard spinach"
    ),
    "shiso": CropTiming(
        name="Shiso",
        days_to_harvest=70,
        planting_season=["Spring"],
        planting_months=["April", "May"],
        harvest_months=["June", "July", "August"],
        succession_plant=False,
        notes="Perilla, Japanese herb"
    ),
    "edamame": CropTiming(
        name="Edamame",
        days_to_harvest=80,
        planting_season=["Spring"],
        planting_months=["May", "June"],
        harvest_months=["July", "August"],
        succession_plant=True,
        succession_interval_days=21,
        notes="Young soybeans"
    ),
    "bitter_melon": CropTiming(
        name="Bitter Melon",
        days_to_harvest=60,
        planting_season=["Spring"],
        planting_months=["May", "June"],
        harvest_months=["July", "August", "September"],
        succession_plant=False,
        notes="Asian gourd, medicinal"
    ),
    "winter_melon": CropTiming(
        name="Winter Melon",
        days_to_harvest=120,
        planting_season=["Spring"],
        planting_months=["May", "June"],
        harvest_months=["September", "October"],
        succession_plant=False,
        notes="Large Asian squash"
    ),
    "luffa": CropTiming(
        name="Luffa",
        days_to_harvest=150,
        planting_season=["Spring"],
        planting_months=["May", "June"],
        harvest_months=["September", "October"],
        succession_plant=False,
        notes="Sponge gourd, edible when young"
    ),
    "yard_long_beans": CropTiming(
        name="Yard Long Beans",
        days_to_harvest=75,
        planting_season=["Spring", "Summer"],
        planting_months=["May", "June"],
        harvest_months=["July", "August", "September"],
        succession_plant=True,
        succession_interval_days=21,
        notes="Asparagus beans, heat-loving"
    ),
    "winged_beans": CropTiming(
        name="Winged Beans",
        days_to_harvest=90,
        planting_season=["Spring"],
        planting_months=["May", "June"],
        harvest_months=["August", "September"],
        succession_plant=False,
        notes="Tropical legume"
    ),
    "lotus_root": CropTiming(
        name="Lotus Root",
        days_to_harvest=120,
        planting_season=["Spring"],
        planting_months=["April", "May"],
        harvest_months=["September", "October"],
        succession_plant=False,
        notes="Aquatic vegetable"
    ),
    "water_chestnut": CropTiming(
        name="Water Chestnut",
        days_to_harvest=180,
        planting_season=["Spring"],
        planting_months=["April", "May"],
        harvest_months=["October", "November"],
        succession_plant=False,
        notes="Aquatic vegetable"
    ),
    "taro": CropTiming(
        name="Taro",
        days_to_harvest=210,
        planting_season=["Spring"],
        planting_months=["April", "May"],
        harvest_months=["October", "November"],
        succession_plant=False,
        notes="Tropical root, needs moisture"
    ),
    "yam": CropTiming(
        name="Yam",
        days_to_harvest=180,
        planting_season=["Spring"],
        planting_months=["April", "May"],
        harvest_months=["October", "November"],
        succession_plant=False,
        notes="Tropical tuber"
    ),
    "cassava": CropTiming(
        name="Cassava",
        days_to_harvest=270,
        planting_season=["Spring"],
        planting_months=["April", "May"],
        harvest_months=["Year-round"],
        succession_plant=False,
        notes="Tropical root, drought-tolerant"
    ),
    "jicama": CropTiming(
        name="Jicama",
        days_to_harvest=150,
        planting_season=["Spring"],
        planting_months=["May", "June"],
        harvest_months=["October", "November"],
        succession_plant=False,
        notes="Mexican yam bean"
    ),
    "sunchoke": CropTiming(
        name="Sunchoke",
        days_to_harvest=120,
        planting_season=["Spring"],
        planting_months=["March", "April"],
        harvest_months=["October", "November"],
        succession_plant=False,
        notes="Jerusalem artichoke, invasive"
    ),
    "celeriac": CropTiming(
        name="Celeriac",
        days_to_harvest=120,
        planting_season=["Spring"],
        planting_months=["March", "April"],
        harvest_months=["September", "October"],
        succession_plant=False,
        indoor_start_weeks=10,
        notes="Celery root"
    ),
    "salsify": CropTiming(
        name="Salsify",
        days_to_harvest=120,
        planting_season=["Spring"],
        planting_months=["March", "April"],
        harvest_months=["October", "November"],
        succession_plant=False,
        notes="Oyster plant"
    ),
    "scorzonera": CropTiming(
        name="Scorzonera",
        days_to_harvest=120,
        planting_season=["Spring"],
        planting_months=["March", "April"],
        harvest_months=["October", "November"],
        succession_plant=False,
        notes="Black salsify"
    ),
    "crosne": CropTiming(
        name="Crosne",
        days_to_harvest=180,
        planting_season=["Spring"],
        planting_months=["April", "May"],
        harvest_months=["November", "December"],
        succession_plant=False,
        notes="Chinese artichoke"
    ),
    "oca": CropTiming(
        name="Oca",
        days_to_harvest=180,
        planting_season=["Spring"],
        planting_months=["April", "May"],
        harvest_months=["November", "December"],
        succession_plant=False,
        notes="Andean tuber"
    ),
    "ulluco": CropTiming(
        name="Ulluco",
        days_to_harvest=180,
        planting_season=["Spring"],
        planting_months=["April", "May"],
        harvest_months=["November", "December"],
        succession_plant=False,
        notes="Andean tuber"
    ),
    "mashua": CropTiming(
        name="Mashua",
        days_to_harvest=180,
        planting_season=["Spring"],
        planting_months=["April", "May"],
        harvest_months=["November", "December"],
        succession_plant=False,
        notes="Andean tuber"
    ),
    "yacon": CropTiming(
        name="Yacon",
        days_to_harvest=200,
        planting_season=["Spring"],
        planting_months=["April", "May"],
        harvest_months=["November", "December"],
        succession_plant=False,
        notes="Andean root, sweet"
    ),
    "ginger": CropTiming(
        name="Ginger",
        days_to_harvest=240,
        planting_season=["Spring"],
        planting_months=["March", "April", "May"],
        harvest_months=["October", "November", "December"],
        succession_plant=False,
        notes="Tropical rhizome"
    ),
    "turmeric": CropTiming(
        name="Turmeric",
        days_to_harvest=270,
        planting_season=["Spring"],
        planting_months=["March", "April", "May"],
        harvest_months=["December", "January"],
        succession_plant=False,
        notes="Tropical rhizome, medicinal"
    ),
    "galangal": CropTiming(
        name="Galangal",
        days_to_harvest=270,
        planting_season=["Spring"],
        planting_months=["March", "April", "May"],
        harvest_months=["December", "January"],
        succession_plant=False,
        notes="Thai ginger"
    ),
    
    # ROOT VEGETABLES - Additional
    "beets": CropTiming(
        name="Beets",
        days_to_harvest=55,
        planting_season=["Spring", "Fall"],
        planting_months=["March", "April", "August", "September"],
        harvest_months=["May", "June", "October", "November"],
        succession_plant=True,
        succession_interval_days=14,
        notes="Direct seed, tolerates light frost"
    ),
    "carrots": CropTiming(
        name="Carrots",
        days_to_harvest=70,
        planting_season=["Spring", "Fall"],
        planting_months=["March", "April", "August"],
        harvest_months=["June", "July", "October", "November"],
        succession_plant=True,
        succession_interval_days=21,
        notes="Direct seed in loose soil"
    ),
    "potatoes": CropTiming(
        name="Potatoes",
        days_to_harvest=90,
        planting_season=["Spring"],
        planting_months=["March", "April", "May"],
        harvest_months=["June", "July", "August"],
        succession_plant=False,
        notes="Plant seed potatoes 2-4 weeks before last frost"
    ),
    
    # TREE FRUITS
    "apples": CropTiming(
        name="Apples",
        days_to_harvest=1460,  # 4 years to first harvest
        planting_season=["Spring", "Fall"],
        planting_months=["March", "April", "October", "November"],
        harvest_months=["August", "September", "October"],
        succession_plant=False,
        notes="Perennial tree, plant bare root or container"
    ),
    "cherries": CropTiming(
        name="Cherries",
        days_to_harvest=1095,  # 3 years to first harvest
        planting_season=["Spring", "Fall"],
        planting_months=["March", "April", "October", "November"],
        harvest_months=["June", "July"],
        succession_plant=False,
        notes="Perennial tree, needs chill hours"
    ),
    "peaches": CropTiming(
        name="Peaches",
        days_to_harvest=1095,  # 3 years
        planting_season=["Spring", "Fall"],
        planting_months=["March", "April", "October", "November"],
        harvest_months=["June", "July", "August"],
        succession_plant=False,
        notes="Perennial tree, prune annually"
    ),
    "pears": CropTiming(
        name="Pears",
        days_to_harvest=1460,  # 4 years
        planting_season=["Spring", "Fall"],
        planting_months=["March", "April", "October", "November"],
        harvest_months=["August", "September", "October"],
        succession_plant=False,
        notes="Perennial tree, needs cross-pollination"
    ),
    "plums": CropTiming(
        name="Plums",
        days_to_harvest=1095,  # 3 years
        planting_season=["Spring", "Fall"],
        planting_months=["March", "April", "October", "November"],
        harvest_months=["July", "August", "September"],
        succession_plant=False,
        notes="Perennial tree"
    ),
    
    # BERRIES
    "blueberries": CropTiming(
        name="Blueberries",
        days_to_harvest=730,  # 2 years
        planting_season=["Spring", "Fall"],
        planting_months=["March", "April", "October", "November"],
        harvest_months=["June", "July", "August"],
        succession_plant=False,
        notes="Perennial shrub, needs acidic soil pH 4.5-5.5"
    ),
    "blackberries": CropTiming(
        name="Blackberries",
        days_to_harvest=365,  # 1 year
        planting_season=["Spring", "Fall"],
        planting_months=["March", "April", "October", "November"],
        harvest_months=["June", "July", "August"],
        succession_plant=False,
        notes="Perennial canes, prune after fruiting"
    ),
    
    # NUTS
    "almonds": CropTiming(
        name="Almonds",
        days_to_harvest=1825,  # 5 years
        planting_season=["Spring", "Fall"],
        planting_months=["March", "April", "October", "November"],
        harvest_months=["August", "September", "October"],
        succession_plant=False,
        notes="Perennial tree, needs warm climate"
    ),
    "chestnuts": CropTiming(
        name="Chestnuts",
        days_to_harvest=1825,  # 5 years
        planting_season=["Spring", "Fall"],
        planting_months=["March", "April", "October", "November"],
        harvest_months=["September", "October", "November"],
        succession_plant=False,
        notes="Perennial tree, needs cross-pollination"
    ),
    "cashews": CropTiming(
        name="Cashews",
        days_to_harvest=1095,  # 3 years
        planting_season=["Spring"],
        planting_months=["March", "April", "May"],
        harvest_months=["March", "April", "May"],
        succession_plant=False,
        notes="Tropical tree, needs warm climate year-round"
    ),
    
    # TROPICAL FRUITS
    "bananas": CropTiming(
        name="Bananas",
        days_to_harvest=365,  # 1 year
        planting_season=["Spring"],
        planting_months=["March", "April", "May"],
        harvest_months=["Year-round in tropics"],
        succession_plant=False,
        notes="Tropical perennial, needs frost-free climate"
    ),
    "mangoes": CropTiming(
        name="Mangoes",
        days_to_harvest=1460,  # 4 years
        planting_season=["Spring"],
        planting_months=["March", "April", "May"],
        harvest_months=["June", "July", "August"],
        succession_plant=False,
        notes="Tropical tree, needs warm climate"
    ),
    "papayas": CropTiming(
        name="Papayas",
        days_to_harvest=270,
        planting_season=["Spring"],
        planting_months=["March", "April", "May"],
        harvest_months=["Year-round in tropics"],
        succession_plant=False,
        notes="Tropical, fast-growing, frost-sensitive"
    ),
    "avocados": CropTiming(
        name="Avocados",
        days_to_harvest=1460,  # 4 years
        planting_season=["Spring"],
        planting_months=["March", "April", "May"],
        harvest_months=["Year-round depending on variety"],
        succession_plant=False,
        notes="Subtropical tree, frost-sensitive"
    ),
    "pineapples": CropTiming(
        name="Pineapples",
        days_to_harvest=540,  # 18 months
        planting_season=["Spring"],
        planting_months=["March", "April", "May"],
        harvest_months=["Year-round in tropics"],
        succession_plant=False,
        notes="Tropical perennial, plant crowns"
    ),
    
    # LEGUMES - Additional
    "black_eyed_peas": CropTiming(
        name="Black-Eyed Peas",
        days_to_harvest=75,
        planting_season=["Spring", "Summer"],
        planting_months=["May", "June", "July"],
        harvest_months=["July", "August", "September"],
        succession_plant=True,
        succession_interval_days=21,
        notes="Heat-loving, drought-tolerant"
    ),
    "broad_bean": CropTiming(
        name="Broad Bean (Fava)",
        days_to_harvest=90,
        planting_season=["Fall", "Spring"],
        planting_months=["October", "November", "March"],
        harvest_months=["May", "June"],
        succession_plant=False,
        notes="Cool season crop, frost-tolerant"
    ),
    
    # CITRUS
    "lemons": CropTiming(
        name="Lemons",
        days_to_harvest=1095,  # 3 years
        planting_season=["Spring"],
        planting_months=["March", "April", "May"],
        harvest_months=["Year-round"],
        succession_plant=False,
        notes="Subtropical tree, can fruit year-round"
    ),
    "limes": CropTiming(
        name="Limes",
        days_to_harvest=1095,  # 3 years
        planting_season=["Spring"],
        planting_months=["March", "April", "May"],
        harvest_months=["Year-round"],
        succession_plant=False,
        notes="Tropical tree, frost-sensitive"
    ),
    "oranges": CropTiming(
        name="Oranges",
        days_to_harvest=1095,  # 3 years
        planting_season=["Spring"],
        planting_months=["March", "April", "May"],
        harvest_months=["December", "January", "February", "March"],
        succession_plant=False,
        notes="Subtropical tree, winter harvest"
    ),
    
    # HERBS - Additional
    "chervil": CropTiming(
        name="Chervil",
        days_to_harvest=40,
        planting_season=["Spring", "Fall"],
        planting_months=["March", "April", "September"],
        harvest_months=["May", "June", "October", "November"],
        succession_plant=True,
        succession_interval_days=14,
        notes="Cool season herb, bolts in heat"
    ),
    
    # GRAINS - Additional
    "bulgur": CropTiming(
        name="Bulgur (Wheat)",
        days_to_harvest=120,
        planting_season=["Fall", "Spring"],
        planting_months=["October", "November", "March"],
        harvest_months=["June", "July"],
        succession_plant=False,
        notes="Winter or spring wheat variety"
    ),
    "artichokes": CropTiming(
        name="Artichokes",
        days_to_harvest=180,
        planting_season=["Spring", "Fall"],
        planting_months=["March", "April", "September"],
        harvest_months=["May", "June", "July"],
        succession_plant=False,
        notes="Perennial in mild climates, annual elsewhere"
    ),
    
    # MORE VEGETABLES
    "cucumbers": CropTiming(
        name="Cucumbers",
        days_to_harvest=55,
        planting_season=["Spring", "Summer"],
        planting_months=["April", "May", "June"],
        harvest_months=["June", "July", "August", "September"],
        succession_plant=True,
        succession_interval_days=14,
        notes="Warm season crop, needs support"
    ),
    "fennel": CropTiming(
        name="Fennel",
        days_to_harvest=90,
        planting_season=["Spring", "Fall"],
        planting_months=["March", "April", "August", "September"],
        harvest_months=["June", "July", "October", "November"],
        succession_plant=False,
        notes="Cool season crop, harvest bulb when baseball-sized"
    ),
    "escarole": CropTiming(
        name="Escarole",
        days_to_harvest=85,
        planting_season=["Spring", "Fall"],
        planting_months=["March", "April", "August"],
        harvest_months=["May", "June", "October", "November"],
        succession_plant=True,
        succession_interval_days=14,
        notes="Cool season green, frost-tolerant"
    ),
    "chicory": CropTiming(
        name="Chicory",
        days_to_harvest=85,
        planting_season=["Spring", "Fall"],
        planting_months=["March", "April", "August"],
        harvest_months=["May", "June", "October", "November"],
        succession_plant=False,
        notes="Cool season, can force roots for Belgian endive"
    ),
    "cress": CropTiming(
        name="Cress",
        days_to_harvest=10,
        planting_season=["Spring", "Summer", "Fall"],
        planting_months=["March", "April", "May", "August", "September"],
        harvest_months=["Year-round"],
        succession_plant=True,
        succession_interval_days=7,
        notes="Fast-growing microgreen, harvest young"
    ),
    
    # MORE BERRIES
    "cranberries": CropTiming(
        name="Cranberries",
        days_to_harvest=730,  # 2 years
        planting_season=["Spring"],
        planting_months=["April", "May"],
        harvest_months=["September", "October"],
        succession_plant=False,
        notes="Perennial, needs acidic bog conditions"
    ),
    "grapes": CropTiming(
        name="Grapes",
        days_to_harvest=1095,  # 3 years
        planting_season=["Spring", "Fall"],
        planting_months=["March", "April", "October", "November"],
        harvest_months=["August", "September", "October"],
        succession_plant=False,
        notes="Perennial vine, needs support and pruning"
    ),
    
    # MORE NUTS
    "hazelnuts": CropTiming(
        name="Hazelnuts (Filberts)",
        days_to_harvest=1460,  # 4 years
        planting_season=["Spring", "Fall"],
        planting_months=["March", "April", "October", "November"],
        harvest_months=["September", "October"],
        succession_plant=False,
        notes="Perennial shrub, needs cross-pollination"
    ),
    "hickory_nut": CropTiming(
        name="Hickory Nut",
        days_to_harvest=2555,  # 7 years
        planting_season=["Fall"],
        planting_months=["October", "November"],
        harvest_months=["September", "October"],
        succession_plant=False,
        notes="Native tree, very slow to bear"
    ),
    "ginkgo_nut": CropTiming(
        name="Ginkgo Nut",
        days_to_harvest=3650,  # 10 years
        planting_season=["Spring"],
        planting_months=["March", "April"],
        harvest_months=["October", "November"],
        succession_plant=False,
        notes="Ancient tree, female trees produce edible seeds"
    ),
    
    # MORE TROPICAL FRUITS
    "jackfruit": CropTiming(
        name="Jackfruit",
        days_to_harvest=1095,  # 3 years
        planting_season=["Spring"],
        planting_months=["March", "April", "May"],
        harvest_months=["Year-round in tropics"],
        succession_plant=False,
        notes="Tropical tree, largest tree fruit"
    ),
    "durian": CropTiming(
        name="Durian",
        days_to_harvest=1825,  # 5 years
        planting_season=["Spring"],
        planting_months=["March", "April", "May"],
        harvest_months=["June", "July", "August"],
        succession_plant=False,
        notes="Tropical tree, requires high humidity"
    ),
    "feijoa": CropTiming(
        name="Feijoa (Pineapple Guava)",
        days_to_harvest=1095,  # 3 years
        planting_season=["Spring", "Fall"],
        planting_months=["March", "April", "October"],
        harvest_months=["October", "November"],
        succession_plant=False,
        notes="Subtropical shrub, frost-tolerant to 15°F"
    ),
    
    # MORE CITRUS
    "clementine": CropTiming(
        name="Clementine",
        days_to_harvest=1095,  # 3 years
        planting_season=["Spring"],
        planting_months=["March", "April", "May"],
        harvest_months=["November", "December", "January"],
        succession_plant=False,
        notes="Mandarin variety, seedless, easy to peel"
    ),
    "crab_apple": CropTiming(
        name="Crab Apple",
        days_to_harvest=1095,  # 3 years
        planting_season=["Spring", "Fall"],
        planting_months=["March", "April", "October", "November"],
        harvest_months=["September", "October"],
        succession_plant=False,
        notes="Ornamental and edible, good for jelly"
    ),
    
    # MORE LEGUMES
    "green_beans": CropTiming(
        name="Green Beans",
        days_to_harvest=55,
        planting_season=["Spring", "Summer"],
        planting_months=["April", "May", "June"],
        harvest_months=["June", "July", "August", "September"],
        succession_plant=True,
        succession_interval_days=14,
        notes="Bush or pole varieties, harvest regularly"
    ),
    "garbanzo": CropTiming(
        name="Garbanzo (Chickpeas)",
        days_to_harvest=100,
        planting_season=["Spring"],
        planting_months=["March", "April"],
        harvest_months=["July", "August"],
        succession_plant=False,
        notes="Cool season, drought-tolerant"
    ),
    "field_bean": CropTiming(
        name="Field Bean",
        days_to_harvest=90,
        planting_season=["Spring"],
        planting_months=["April", "May"],
        harvest_months=["July", "August"],
        succession_plant=False,
        notes="Dry bean, harvest when pods dry"
    ),
    "horse_bean": CropTiming(
        name="Horse Bean (Fava)",
        days_to_harvest=90,
        planting_season=["Fall", "Spring"],
        planting_months=["October", "November", "March"],
        harvest_months=["May", "June"],
        succession_plant=False,
        notes="Large fava variety, cool season"
    ),
    "jack_bean": CropTiming(
        name="Jack Bean",
        days_to_harvest=90,
        planting_season=["Spring"],
        planting_months=["April", "May"],
        harvest_months=["July", "August"],
        succession_plant=False,
        notes="Tropical legume, cover crop"
    ),
    "haricot": CropTiming(
        name="Haricot (Navy Bean)",
        days_to_harvest=95,
        planting_season=["Spring"],
        planting_months=["April", "May"],
        harvest_months=["July", "August", "September"],
        succession_plant=False,
        notes="Dry bean, harvest when fully mature"
    ),
    "garden_pea": CropTiming(
        name="Garden Pea",
        days_to_harvest=60,
        planting_season=["Spring", "Fall"],
        planting_months=["March", "April", "August"],
        harvest_months=["May", "June", "October"],
        succession_plant=True,
        succession_interval_days=14,
        notes="Cool season, needs support"
    ),
    
    # ANCIENT GRAINS
    "einkorn": CropTiming(
        name="Einkorn",
        days_to_harvest=120,
        planting_season=["Fall", "Spring"],
        planting_months=["October", "November", "March"],
        harvest_months=["June", "July"],
        succession_plant=False,
        notes="Ancient wheat, low gluten"
    ),
    "farro": CropTiming(
        name="Farro (Emmer Wheat)",
        days_to_harvest=120,
        planting_season=["Fall", "Spring"],
        planting_months=["October", "November", "March"],
        harvest_months=["June", "July"],
        succession_plant=False,
        notes="Ancient wheat, nutty flavor"
    ),
    "freekeh": CropTiming(
        name="Freekeh",
        days_to_harvest=120,
        planting_season=["Fall", "Spring"],
        planting_months=["October", "November", "March"],
        harvest_months=["June", "July"],
        succession_plant=False,
        notes="Young green wheat, roasted"
    ),
    "fonio": CropTiming(
        name="Fonio",
        days_to_harvest=90,
        planting_season=["Spring"],
        planting_months=["April", "May"],
        harvest_months=["July", "August"],
        succession_plant=False,
        notes="Ancient African grain, drought-tolerant"
    ),
    
    # SEED CROPS
    "chia_seed": CropTiming(
        name="Chia Seed",
        days_to_harvest=120,
        planting_season=["Spring"],
        planting_months=["March", "April"],
        harvest_months=["July", "August"],
        succession_plant=False,
        notes="Warm season, harvest when flowers dry"
    ),
    "flax_seed": CropTiming(
        name="Flax Seed",
        days_to_harvest=100,
        planting_season=["Spring"],
        planting_months=["March", "April"],
        harvest_months=["July", "August"],
        succession_plant=False,
        notes="Cool season, harvest when seeds rattle"
    ),
    "hemp_seed": CropTiming(
        name="Hemp Seed",
        days_to_harvest=120,
        planting_season=["Spring"],
        planting_months=["April", "May"],
        harvest_months=["August", "September"],
        succession_plant=False,
        notes="Industrial hemp, check local regulations"
    ),
    "fennel_seed": CropTiming(
        name="Fennel Seed",
        days_to_harvest=90,
        planting_season=["Spring"],
        planting_months=["March", "April"],
        harvest_months=["July", "August"],
        succession_plant=False,
        notes="Let fennel flower and go to seed"
    ),
    "coriander_seed": CropTiming(
        name="Coriander Seed",
        days_to_harvest=100,
        planting_season=["Spring"],
        planting_months=["March", "April"],
        harvest_months=["July", "August"],
        succession_plant=False,
        notes="Cilantro seeds, harvest when brown"
    ),
    "cumin_seed": CropTiming(
        name="Cumin Seed",
        days_to_harvest=120,
        planting_season=["Spring"],
        planting_months=["March", "April"],
        harvest_months=["July", "August"],
        succession_plant=False,
        notes="Warm season spice, needs long season"
    ),
    "fenugreek_seed": CropTiming(
        name="Fenugreek Seed",
        days_to_harvest=90,
        planting_season=["Spring", "Fall"],
        planting_months=["March", "April", "September"],
        harvest_months=["June", "July", "November"],
        succession_plant=False,
        notes="Cool season, leaves and seeds edible"
    ),
    
    # COMMON VEGETABLES - Missing essentials
    "tomatoes": CropTiming(
        name="Tomatoes",
        days_to_harvest=75,
        planting_season=["Spring"],
        planting_months=["March", "April", "May"],
        harvest_months=["July", "August", "September"],
        succession_plant=False,
        indoor_start_weeks=6,
        notes="Start indoors 6-8 weeks before last frost"
    ),
    "peppers": CropTiming(
        name="Peppers",
        days_to_harvest=75,
        planting_season=["Spring"],
        planting_months=["March", "April", "May"],
        harvest_months=["July", "August", "September"],
        succession_plant=False,
        indoor_start_weeks=8,
        notes="Needs warm soil, transplant after last frost"
    ),
    "onions": CropTiming(
        name="Onions",
        days_to_harvest=100,
        planting_season=["Spring", "Fall"],
        planting_months=["March", "April", "September", "October"],
        harvest_months=["July", "August"],
        succession_plant=False,
        notes="Plant sets or transplants, harvest when tops fall"
    ),
    "leeks": CropTiming(
        name="Leeks",
        days_to_harvest=120,
        planting_season=["Spring"],
        planting_months=["March", "April"],
        harvest_months=["October", "November", "December"],
        succession_plant=False,
        notes="Long season crop, hill for white stems"
    ),
    "radishes": CropTiming(
        name="Radishes",
        days_to_harvest=25,
        planting_season=["Spring", "Fall"],
        planting_months=["March", "April", "August", "September"],
        harvest_months=["April", "May", "September", "October"],
        succession_plant=True,
        succession_interval_days=7,
        notes="Fast-growing, harvest promptly"
    ),
    "turnips": CropTiming(
        name="Turnips",
        days_to_harvest=50,
        planting_season=["Spring", "Fall"],
        planting_months=["March", "April", "August"],
        harvest_months=["May", "June", "October", "November"],
        succession_plant=True,
        succession_interval_days=14,
        notes="Cool season, greens also edible"
    ),
    "melons": CropTiming(
        name="Melons",
        days_to_harvest=85,
        planting_season=["Spring"],
        planting_months=["April", "May"],
        harvest_months=["July", "August", "September"],
        succession_plant=False,
        notes="Warm season, needs space and consistent water"
    ),
    "shallots": CropTiming(
        name="Shallots",
        days_to_harvest=90,
        planting_season=["Fall", "Spring"],
        planting_months=["October", "November", "March"],
        harvest_months=["June", "July"],
        succession_plant=False,
        notes="Plant sets, milder than onions"
    ),
    "sweet_potato": CropTiming(
        name="Sweet Potato",
        days_to_harvest=100,
        planting_season=["Spring"],
        planting_months=["May", "June"],
        harvest_months=["September", "October"],
        succession_plant=False,
        notes="Plant slips, needs warm soil and long season"
    ),
    
    # BERRIES - Missing essentials
    "strawberries": CropTiming(
        name="Strawberries",
        days_to_harvest=120,
        planting_season=["Spring", "Fall"],
        planting_months=["March", "April", "September", "October"],
        harvest_months=["May", "June"],
        succession_plant=False,
        notes="Perennial, produces second year"
    ),
    "raspberries": CropTiming(
        name="Raspberries",
        days_to_harvest=365,  # 1 year
        planting_season=["Spring", "Fall"],
        planting_months=["March", "April", "October", "November"],
        harvest_months=["June", "July"],
        succession_plant=False,
        notes="Perennial canes, summer or fall-bearing varieties"
    ),
    
    # MORE NUTS
    "peanuts": CropTiming(
        name="Peanuts",
        days_to_harvest=120,
        planting_season=["Spring"],
        planting_months=["April", "May"],
        harvest_months=["September", "October"],
        succession_plant=False,
        notes="Warm season legume, needs loose soil"
    ),
    "pecans": CropTiming(
        name="Pecans",
        days_to_harvest=2555,  # 7 years
        planting_season=["Fall", "Spring"],
        planting_months=["October", "November", "March"],
        harvest_months=["October", "November"],
        succession_plant=False,
        notes="Large tree, needs cross-pollination"
    ),
    "walnuts": CropTiming(
        name="Walnuts",
        days_to_harvest=2190,  # 6 years
        planting_season=["Fall", "Spring"],
        planting_months=["October", "November", "March"],
        harvest_months=["September", "October"],
        succession_plant=False,
        notes="Large tree, English or black varieties"
    ),
    "pistachios": CropTiming(
        name="Pistachios",
        days_to_harvest=2190,  # 6 years
        planting_season=["Spring"],
        planting_months=["March", "April"],
        harvest_months=["September", "October"],
        succession_plant=False,
        notes="Needs hot, dry climate, male and female trees"
    ),
    "pine_nuts": CropTiming(
        name="Pine Nuts",
        days_to_harvest=5475,  # 15 years
        planting_season=["Spring", "Fall"],
        planting_months=["March", "April", "October"],
        harvest_months=["September", "October"],
        succession_plant=False,
        notes="From pine cones, very long to bear"
    ),
    "brazil_nuts": CropTiming(
        name="Brazil Nuts",
        days_to_harvest=3650,  # 10 years
        planting_season=["Spring"],
        planting_months=["March", "April", "May"],
        harvest_months=["Year-round in tropics"],
        succession_plant=False,
        notes="Tropical rainforest tree, very large"
    ),
    
    # MORE TROPICAL FRUITS
    "tamarind": CropTiming(
        name="Tamarind",
        days_to_harvest=2555,  # 7 years
        planting_season=["Spring"],
        planting_months=["March", "April", "May"],
        harvest_months=["Year-round in tropics"],
        succession_plant=False,
        notes="Tropical tree, sour pods for cooking"
    ),
    "passionfruit": CropTiming(
        name="Passionfruit",
        days_to_harvest=365,  # 1 year
        planting_season=["Spring"],
        planting_months=["March", "April", "May"],
        harvest_months=["Summer through fall"],
        succession_plant=False,
        notes="Tropical vine, needs support"
    ),
    "longan": CropTiming(
        name="Longan",
        days_to_harvest=1460,  # 4 years
        planting_season=["Spring"],
        planting_months=["March", "April", "May"],
        harvest_months=["July", "August"],
        succession_plant=False,
        notes="Tropical tree, similar to lychee"
    ),
    "rambutan": CropTiming(
        name="Rambutan",
        days_to_harvest=1460,  # 4 years
        planting_season=["Spring"],
        planting_months=["March", "April", "May"],
        harvest_months=["June", "July", "August"],
        succession_plant=False,
        notes="Tropical tree, hairy fruit"
    ),
    "mangosteen": CropTiming(
        name="Mangosteen",
        days_to_harvest=2555,  # 7 years
        planting_season=["Spring"],
        planting_months=["March", "April", "May"],
        harvest_months=["Year-round in tropics"],
        succession_plant=False,
        notes="Tropical tree, queen of fruits"
    ),
    "breadfruit": CropTiming(
        name="Breadfruit",
        days_to_harvest=1095,  # 3 years
        planting_season=["Spring"],
        planting_months=["March", "April", "May"],
        harvest_months=["Year-round in tropics"],
        succession_plant=False,
        notes="Tropical tree, starchy fruit"
    ),
    "cherimoya": CropTiming(
        name="Cherimoya",
        days_to_harvest=1095,  # 3 years
        planting_season=["Spring"],
        planting_months=["March", "April"],
        harvest_months=["November", "December", "January"],
        succession_plant=False,
        notes="Subtropical tree, custard apple"
    ),
    "kumquat": CropTiming(
        name="Kumquat",
        days_to_harvest=1095,  # 3 years
        planting_season=["Spring"],
        planting_months=["March", "April", "May"],
        harvest_months=["November", "December", "January"],
        succession_plant=False,
        notes="Small citrus, eat peel and all"
    ),
    
    # OTHER CROPS
    "sunflowers": CropTiming(
        name="Sunflowers",
        days_to_harvest=80,
        planting_season=["Spring"],
        planting_months=["April", "May"],
        harvest_months=["August", "September"],
        succession_plant=True,
        succession_interval_days=14,
        notes="Ornamental or seed varieties"
    ),
    "mushroom": CropTiming(
        name="Mushroom",
        days_to_harvest=60,
        planting_season=["Year-round"],
        planting_months=["Year-round"],
        harvest_months=["Year-round"],
        succession_plant=True,
        succession_interval_days=30,
        notes="Indoor cultivation, needs specific conditions"
    ),
    
    # ANCIENT GRAINS - Additional
    "kamut": CropTiming(
        name="Kamut (Khorasan Wheat)",
        days_to_harvest=120,
        planting_season=["Fall", "Spring"],
        planting_months=["October", "November", "March"],
        harvest_months=["June", "July"],
        succession_plant=False,
        notes="Ancient wheat, large kernels"
    ),
    "spelt": CropTiming(
        name="Spelt",
        days_to_harvest=120,
        planting_season=["Fall", "Spring"],
        planting_months=["October", "November", "March"],
        harvest_months=["June", "July"],
        succession_plant=False,
        notes="Ancient wheat, nutty flavor"
    ),
    "teff": CropTiming(
        name="Teff",
        days_to_harvest=90,
        planting_season=["Spring"],
        planting_months=["April", "May"],
        harvest_months=["July", "August"],
        succession_plant=False,
        notes="Ethiopian grain, tiny seeds"
    ),
    "triticale": CropTiming(
        name="Triticale",
        days_to_harvest=120,
        planting_season=["Fall", "Spring"],
        planting_months=["October", "November", "March"],
        harvest_months=["June", "July"],
        succession_plant=False,
        notes="Wheat-rye hybrid"
    ),
    "wild_rice": CropTiming(
        name="Wild Rice",
        days_to_harvest=120,
        planting_season=["Spring"],
        planting_months=["April", "May"],
        harvest_months=["August", "September"],
        succession_plant=False,
        notes="Aquatic grass, needs shallow water"
    ),
    "semolina": CropTiming(
        name="Semolina (Durum Wheat)",
        days_to_harvest=120,
        planting_season=["Fall", "Spring"],
        planting_months=["October", "November", "March"],
        harvest_months=["June", "July"],
        succession_plant=False,
        notes="Hard wheat for pasta"
    ),
    
    # SPECIALTY LEGUMES
    "lentil_dal": CropTiming(
        name="Lentil Dal",
        days_to_harvest=100,
        planting_season=["Spring"],
        planting_months=["March", "April"],
        harvest_months=["July", "August"],
        succession_plant=False,
        notes="Cool season, harvest when pods dry"
    ),
    "pigeon_pea": CropTiming(
        name="Pigeon Pea",
        days_to_harvest=150,
        planting_season=["Spring"],
        planting_months=["April", "May"],
        harvest_months=["September", "October"],
        succession_plant=False,
        notes="Tropical legume, drought-tolerant"
    ),
    "rice_bean": CropTiming(
        name="Rice Bean",
        days_to_harvest=90,
        planting_season=["Spring"],
        planting_months=["April", "May"],
        harvest_months=["July", "August"],
        succession_plant=False,
        notes="Asian legume, small red beans"
    ),
    "moth_bean": CropTiming(
        name="Moth Bean",
        days_to_harvest=90,
        planting_season=["Spring"],
        planting_months=["April", "May"],
        harvest_months=["July", "August"],
        succession_plant=False,
        notes="Drought-tolerant, Indian cuisine"
    ),
    "winged_bean": CropTiming(
        name="Winged Bean",
        days_to_harvest=90,
        planting_season=["Spring"],
        planting_months=["April", "May"],
        harvest_months=["July", "August"],
        succession_plant=False,
        notes="Tropical, all parts edible"
    ),
    "tepary_bean": CropTiming(
        name="Tepary Bean",
        days_to_harvest=90,
        planting_season=["Spring"],
        planting_months=["April", "May"],
        harvest_months=["July", "August"],
        succession_plant=False,
        notes="Desert bean, extremely drought-tolerant"
    ),
    "scarlet_runner_bean": CropTiming(
        name="Scarlet Runner Bean",
        days_to_harvest=70,
        planting_season=["Spring"],
        planting_months=["April", "May"],
        harvest_months=["July", "August"],
        succession_plant=False,
        notes="Ornamental and edible, red flowers"
    ),
    "sword_bean": CropTiming(
        name="Sword Bean",
        days_to_harvest=90,
        planting_season=["Spring"],
        planting_months=["April", "May"],
        harvest_months=["July", "August"],
        succession_plant=False,
        notes="Large tropical bean"
    ),
    "velvet_bean": CropTiming(
        name="Velvet Bean",
        days_to_harvest=120,
        planting_season=["Spring"],
        planting_months=["April", "May"],
        harvest_months=["August", "September"],
        succession_plant=False,
        notes="Tropical cover crop and food"
    ),
    "yam_bean": CropTiming(
        name="Yam Bean (Jicama)",
        days_to_harvest=150,
        planting_season=["Spring"],
        planting_months=["April", "May"],
        harvest_months=["September", "October"],
        succession_plant=False,
        notes="Tropical, edible tuber"
    ),
    "lupin": CropTiming(
        name="Lupin",
        days_to_harvest=120,
        planting_season=["Spring", "Fall"],
        planting_months=["March", "April", "September"],
        harvest_months=["July", "August"],
        succession_plant=False,
        notes="Cool season, ornamental and edible"
    ),
    "vetch": CropTiming(
        name="Vetch",
        days_to_harvest=90,
        planting_season=["Fall", "Spring"],
        planting_months=["September", "October", "March"],
        harvest_months=["May", "June"],
        succession_plant=False,
        notes="Cover crop and forage"
    ),
    "lablab_bean": CropTiming(
        name="Lablab Bean (Hyacinth Bean)",
        days_to_harvest=90,
        planting_season=["Spring"],
        planting_months=["April", "May"],
        harvest_months=["July", "August"],
        succession_plant=False,
        notes="Tropical, ornamental purple pods"
    ),
    "bambara_groundnut": CropTiming(
        name="Bambara Groundnut",
        days_to_harvest=120,
        planting_season=["Spring"],
        planting_months=["April", "May"],
        harvest_months=["August", "September"],
        succession_plant=False,
        notes="African legume, underground pods"
    ),
    "mesquite_bean": CropTiming(
        name="Mesquite Bean",
        days_to_harvest=1825,  # 5 years for tree
        planting_season=["Spring"],
        planting_months=["March", "April"],
        harvest_months=["Summer"],
        succession_plant=False,
        notes="Desert tree, edible pods"
    ),
    "protein_pea": CropTiming(
        name="Protein Pea (Field Pea)",
        days_to_harvest=90,
        planting_season=["Spring", "Fall"],
        planting_months=["March", "April", "September"],
        harvest_months=["June", "July"],
        succession_plant=False,
        notes="Cool season, high protein"
    ),
}


def get_crop_timing(crop_name: str) -> Optional[CropTiming]:
    """Get timing information for a crop"""
    crop_key = crop_name.lower().replace(" ", "_")
    return CROP_TIMING_DATABASE.get(crop_key)


def get_planting_months_for_season(season: str) -> List[str]:
    """Get typical planting months for a season"""
    season_months = {
        "Spring": ["March", "April", "May"],
        "Summer": ["June", "July", "August"],
        "Fall": ["September", "October", "November"],
        "Winter": ["December", "January", "February"]
    }
    return season_months.get(season, [])


def format_crop_timing(crop_name: str) -> str:
    """Format timing information for display"""
    timing = get_crop_timing(crop_name)
    if not timing:
        return f"{crop_name}: Timing data not available"
    
    info = f"{timing.name}:\n"
    info += f"  • Days to harvest: {timing.days_to_harvest} days\n"
    info += f"  • Plant in: {', '.join(timing.planting_months)}\n"
    info += f"  • Harvest in: {', '.join(timing.harvest_months)}\n"
    
    if timing.indoor_start_weeks:
        info += f"  • Start indoors: {timing.indoor_start_weeks} weeks before last frost\n"
    
    if timing.succession_plant:
        info += f"  • Succession plant: Every {timing.succession_interval_days} days\n"
    
    if timing.notes:
        info += f"  • Notes: {timing.notes}\n"
    
    return info
