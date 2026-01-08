"""
Visual garden layout generator.
Creates optimized 2D layouts with companion planting and space efficiency.

v4.0 Phase 1 Feature: Visual layout generation
"""

from typing import List, Dict, Tuple, Optional
from dataclasses import dataclass, field
from enum import Enum
import math

from .companion_planting import get_companion_info


class SpacingMethod(str, Enum):
    """Garden spacing methods"""
    SQUARE_FOOT = "Square Foot"  # 1 sq ft grid
    INTENSIVE = "Intensive"  # Tight spacing
    TRADITIONAL = "Traditional"  # Row spacing
    WIDE = "Wide"  # Extra space


class PlantSize(str, Enum):
    """Relative plant sizes for layout"""
    SMALL = "Small"  # Lettuce, radishes (4-6" spacing)
    MEDIUM = "Medium"  # Peppers, cabbage (12-18" spacing)
    LARGE = "Large"  # Tomatoes, squash (24-36" spacing)
    VINE = "Vine"  # Cucumbers, melons (requires trellis or sprawl)


@dataclass
class CropPlacement:
    """A crop placed in the layout"""
    crop: str
    variety: Optional[str] = None
    quantity: int = 1
    size: PlantSize = PlantSize.MEDIUM
    position: Optional[Tuple[int, int]] = None  # (row, col) in grid
    companion_to: Optional[str] = None  # Which crop is this companioning
    notes: List[str] = field(default_factory=list)


@dataclass
class GardenBed:
    """A garden bed or growing space"""
    name: str
    width: int  # feet
    length: int  # feet
    sunlight: str  # Full/Partial/Shade
    placements: List[CropPlacement] = field(default_factory=list)


@dataclass
class GardenLayout:
    """Complete garden layout"""
    beds: List[GardenBed]
    spacing_method: SpacingMethod
    notes: List[str] = field(default_factory=list)


# Comprehensive crop size database for 100+ crops
CROP_SIZES = {
    # SMALL CROPS (4-9 per sq ft) - 6" spacing
    "lettuce": PlantSize.SMALL,
    "radishes": PlantSize.SMALL,
    "spinach": PlantSize.SMALL,
    "arugula": PlantSize.SMALL,
    "green_onions": PlantSize.SMALL,
    "scallions": PlantSize.SMALL,
    "basil": PlantSize.SMALL,
    "cilantro": PlantSize.SMALL,
    "parsley": PlantSize.SMALL,
    "chives": PlantSize.SMALL,
    "dill": PlantSize.SMALL,
    "mesclun": PlantSize.SMALL,
    "mache": PlantSize.SMALL,
    "claytonia": PlantSize.SMALL,
    "cress": PlantSize.SMALL,
    "mustard_greens": PlantSize.SMALL,
    "mizuna": PlantSize.SMALL,
    "tatsoi": PlantSize.SMALL,
    "bok_choy": PlantSize.SMALL,  # Baby bok choy
    "asian_greens": PlantSize.SMALL,
    "endive": PlantSize.SMALL,
    "radicchio": PlantSize.SMALL,
    "sorrel": PlantSize.SMALL,
    "watercress": PlantSize.SMALL,
    
    # MEDIUM CROPS (1-4 per sq ft) - 12-18" spacing
    "peppers": PlantSize.MEDIUM,
    "eggplant": PlantSize.MEDIUM,
    "broccoli": PlantSize.MEDIUM,
    "cauliflower": PlantSize.MEDIUM,
    "cabbage": PlantSize.MEDIUM,
    "kale": PlantSize.MEDIUM,
    "collard_greens": PlantSize.MEDIUM,
    "swiss_chard": PlantSize.MEDIUM,
    "chard": PlantSize.MEDIUM,
    "beets": PlantSize.MEDIUM,
    "carrots": PlantSize.MEDIUM,
    "onions": PlantSize.MEDIUM,
    "leeks": PlantSize.MEDIUM,
    "garlic": PlantSize.MEDIUM,
    "shallots": PlantSize.MEDIUM,
    "beans": PlantSize.MEDIUM,
    "bush_beans": PlantSize.MEDIUM,
    "peas": PlantSize.MEDIUM,
    "snap_peas": PlantSize.MEDIUM,
    "snow_peas": PlantSize.MEDIUM,
    "turnips": PlantSize.MEDIUM,
    "rutabaga": PlantSize.MEDIUM,
    "parsnips": PlantSize.MEDIUM,
    "kohlrabi": PlantSize.MEDIUM,
    "celery": PlantSize.MEDIUM,
    "celeriac": PlantSize.MEDIUM,
    "fennel": PlantSize.MEDIUM,
    "brussels_sprouts": PlantSize.MEDIUM,
    "artichoke": PlantSize.MEDIUM,
    "cardoon": PlantSize.MEDIUM,
    "okra": PlantSize.MEDIUM,
    "tomatillo": PlantSize.MEDIUM,
    "ground_cherry": PlantSize.MEDIUM,
    "daikon": PlantSize.MEDIUM,
    "horseradish": PlantSize.MEDIUM,
    "ginger": PlantSize.MEDIUM,
    "turmeric": PlantSize.MEDIUM,
    
    # HERBS (mostly small to medium)
    "oregano": PlantSize.SMALL,
    "thyme": PlantSize.SMALL,
    "sage": PlantSize.MEDIUM,
    "rosemary": PlantSize.MEDIUM,
    "mint": PlantSize.MEDIUM,
    "lemon_balm": PlantSize.MEDIUM,
    "chamomile": PlantSize.SMALL,
    "lavender": PlantSize.MEDIUM,
    "tarragon": PlantSize.MEDIUM,
    "marjoram": PlantSize.SMALL,
    "stevia": PlantSize.MEDIUM,
    "lemongrass": PlantSize.MEDIUM,
    "shiso": PlantSize.MEDIUM,
    "borage": PlantSize.MEDIUM,
    
    # LARGE CROPS (1 per 2-4 sq ft) - 24-36" spacing
    "tomatoes": PlantSize.LARGE,
    "indeterminate_tomatoes": PlantSize.LARGE,
    "determinate_tomatoes": PlantSize.LARGE,
    "corn": PlantSize.LARGE,
    "sweet_corn": PlantSize.LARGE,
    "popcorn": PlantSize.LARGE,
    "potatoes": PlantSize.LARGE,
    "sweet_potatoes": PlantSize.LARGE,
    "asparagus": PlantSize.LARGE,
    "rhubarb": PlantSize.LARGE,
    "sunflowers": PlantSize.LARGE,
    "amaranth": PlantSize.LARGE,
    "quinoa": PlantSize.LARGE,
    "sorghum": PlantSize.LARGE,
    
    # VINING CROPS (special handling - trellis or sprawl)
    "cucumbers": PlantSize.VINE,
    "squash": PlantSize.VINE,
    "summer_squash": PlantSize.VINE,
    "winter_squash": PlantSize.VINE,
    "zucchini": PlantSize.VINE,
    "pattypan_squash": PlantSize.VINE,
    "melons": PlantSize.VINE,
    "watermelon": PlantSize.VINE,
    "cantaloupe": PlantSize.VINE,
    "honeydew": PlantSize.VINE,
    "muskmelon": PlantSize.VINE,
    "pumpkins": PlantSize.VINE,
    "gourds": PlantSize.VINE,
    "pole_beans": PlantSize.VINE,
    "runner_beans": PlantSize.VINE,
    "lima_beans": PlantSize.VINE,
    "yard_long_beans": PlantSize.VINE,
    "bitter_melon": PlantSize.VINE,
    "luffa": PlantSize.VINE,
    "chayote": PlantSize.VINE,
    "passion_fruit": PlantSize.VINE,
    "grapes": PlantSize.VINE,
    "kiwi": PlantSize.VINE,
    "hops": PlantSize.VINE,
    
    # BERRIES (medium to large spacing)
    "strawberries": PlantSize.MEDIUM,
    "blueberries": PlantSize.LARGE,
    "raspberries": PlantSize.LARGE,
    "blackberries": PlantSize.LARGE,
    "currants": PlantSize.LARGE,
    "gooseberries": PlantSize.LARGE,
    "elderberries": PlantSize.LARGE,
    "goji_berries": PlantSize.LARGE,
    "cranberries": PlantSize.MEDIUM,
    "huckleberries": PlantSize.LARGE,
    
    # LEGUMES
    "soybeans": PlantSize.MEDIUM,
    "edamame": PlantSize.MEDIUM,
    "chickpeas": PlantSize.MEDIUM,
    "lentils": PlantSize.MEDIUM,
    "fava_beans": PlantSize.MEDIUM,
    "black_beans": PlantSize.MEDIUM,
    "pinto_beans": PlantSize.MEDIUM,
    "kidney_beans": PlantSize.MEDIUM,
    "navy_beans": PlantSize.MEDIUM,
    "cowpeas": PlantSize.MEDIUM,
    "black_eyed_peas": PlantSize.MEDIUM,
    "mung_beans": PlantSize.MEDIUM,
    "adzuki_beans": PlantSize.MEDIUM,
    
    # GRAINS
    "wheat": PlantSize.MEDIUM,
    "barley": PlantSize.MEDIUM,
    "oats": PlantSize.MEDIUM,
    "rye": PlantSize.MEDIUM,
    "rice": PlantSize.MEDIUM,
    "millet": PlantSize.MEDIUM,
    "buckwheat": PlantSize.MEDIUM,
    
    # ASIAN VEGETABLES
    "napa_cabbage": PlantSize.MEDIUM,
    "gai_lan": PlantSize.MEDIUM,
    "yu_choy": PlantSize.MEDIUM,
    "komatsuna": PlantSize.SMALL,
    "winter_melon": PlantSize.VINE,
    "lotus_root": PlantSize.LARGE,
    "water_chestnut": PlantSize.MEDIUM,
    "taro": PlantSize.LARGE,
    "yam": PlantSize.LARGE,
    "cassava": PlantSize.LARGE,
    "jicama": PlantSize.VINE,
    "galangal": PlantSize.MEDIUM,
    
    # SPECIALTY CROPS
    "sunchoke": PlantSize.LARGE,
    "salsify": PlantSize.MEDIUM,
    "scorzonera": PlantSize.MEDIUM,
    "crosne": PlantSize.MEDIUM,
    "oca": PlantSize.MEDIUM,
    "ulluco": PlantSize.MEDIUM,
    "mashua": PlantSize.MEDIUM,
    "yacon": PlantSize.LARGE,
    "peanuts": PlantSize.MEDIUM,
    
    # TREE FRUITS (large spacing - orchard crops)
    "apple": PlantSize.LARGE,
    "pear": PlantSize.LARGE,
    "cherry": PlantSize.LARGE,
    "plum": PlantSize.LARGE,
    "peach": PlantSize.LARGE,
    "apricot": PlantSize.LARGE,
    "nectarine": PlantSize.LARGE,
    "fig": PlantSize.LARGE,
    "persimmon": PlantSize.LARGE,
    "pomegranate": PlantSize.LARGE,
    "quince": PlantSize.LARGE,
    "mulberry": PlantSize.LARGE,
    "pawpaw": PlantSize.LARGE,
    "jujube": PlantSize.LARGE,
    "medlar": PlantSize.LARGE,
    "loquat": PlantSize.LARGE,
    
    # CITRUS (large spacing)
    "orange": PlantSize.LARGE,
    "lemon": PlantSize.LARGE,
    "lime": PlantSize.LARGE,
    "grapefruit": PlantSize.LARGE,
    "tangerine": PlantSize.LARGE,
    "mandarin": PlantSize.LARGE,
    "kumquat": PlantSize.LARGE,
    "citron": PlantSize.LARGE,
    "yuzu": PlantSize.LARGE,
    "bergamot": PlantSize.LARGE,
    "pomelo": PlantSize.LARGE,
    "calamansi": PlantSize.LARGE,
    "key_lime": PlantSize.LARGE,
    "blood_orange": PlantSize.LARGE,
    "cara_cara": PlantSize.LARGE,
    "clementine": PlantSize.LARGE,
    
    # NUTS (large spacing - orchard crops)
    "almond": PlantSize.LARGE,
    "walnut": PlantSize.LARGE,
    "pecan": PlantSize.LARGE,
    "hazelnut": PlantSize.LARGE,
    "chestnut": PlantSize.LARGE,
    "pistachio": PlantSize.LARGE,
    "cashew": PlantSize.LARGE,
    "macadamia": PlantSize.LARGE,
    "pine_nut": PlantSize.LARGE,
    "brazil_nut": PlantSize.LARGE,
    "hickory": PlantSize.LARGE,
    "butternut": PlantSize.LARGE,
    "heartnut": PlantSize.LARGE,
    
    # TROPICAL FRUITS (large spacing)
    "mango": PlantSize.LARGE,
    "papaya": PlantSize.LARGE,
    "banana": PlantSize.LARGE,
    "plantain": PlantSize.LARGE,
    "pineapple": PlantSize.LARGE,
    "avocado": PlantSize.LARGE,
    "guava": PlantSize.LARGE,
    "lychee": PlantSize.LARGE,
    "dragon_fruit": PlantSize.VINE,
    "starfruit": PlantSize.LARGE,
    "coconut": PlantSize.LARGE,
    "date": PlantSize.LARGE,
    "breadfruit": PlantSize.LARGE,
    "jackfruit": PlantSize.LARGE,
    "durian": PlantSize.LARGE,
    "rambutan": PlantSize.LARGE,
    "mangosteen": PlantSize.LARGE,
    "longan": PlantSize.LARGE,
    "soursop": PlantSize.LARGE,
    "cherimoya": PlantSize.LARGE,
    "atemoya": PlantSize.LARGE,
    "sugar_apple": PlantSize.LARGE,
    "custard_apple": PlantSize.LARGE,
    "sapodilla": PlantSize.LARGE,
    "tamarind": PlantSize.LARGE,
    "carambola": PlantSize.LARGE,
    "acai": PlantSize.LARGE,
    "cacao": PlantSize.LARGE,
    "coffee": PlantSize.LARGE,
    "tea": PlantSize.LARGE,
    "vanilla": PlantSize.VINE,
    "black_pepper": PlantSize.VINE,
    "cinnamon": PlantSize.LARGE,
    "clove": PlantSize.LARGE,
    "nutmeg": PlantSize.LARGE,
    "allspice": PlantSize.LARGE,
    "cardamom": PlantSize.MEDIUM,
    "star_anise": PlantSize.LARGE,
    
    # MORE BERRIES
    "aronia": PlantSize.LARGE,
    "sea_buckthorn": PlantSize.LARGE,
    "serviceberry": PlantSize.LARGE,
    "chokeberry": PlantSize.LARGE,
    "lingonberry": PlantSize.MEDIUM,
    "cloudberry": PlantSize.MEDIUM,
    "salmonberry": PlantSize.LARGE,
    "thimbleberry": PlantSize.LARGE,
    "dewberry": PlantSize.VINE,
    "boysenberry": PlantSize.VINE,
    "loganberry": PlantSize.VINE,
    "marionberry": PlantSize.VINE,
    "tayberry": PlantSize.VINE,
    "jostaberry": PlantSize.LARGE,
    "honeyberry": PlantSize.LARGE,
    "haskap": PlantSize.LARGE,
    "schisandra": PlantSize.VINE,
    "barberry": PlantSize.LARGE,
    "buffaloberry": PlantSize.LARGE,
    "silverberry": PlantSize.LARGE,
    
    # MORE ASIAN VEGETABLES
    "chinese_cabbage": PlantSize.MEDIUM,
    "pe_tsai": PlantSize.MEDIUM,
    "wong_bok": PlantSize.MEDIUM,
    "choy_sum": PlantSize.SMALL,
    "pak_choi": PlantSize.SMALL,
    "chinese_broccoli": PlantSize.MEDIUM,
    "chinese_kale": PlantSize.MEDIUM,
    "chinese_mustard": PlantSize.MEDIUM,
    "chinese_spinach": PlantSize.SMALL,
    "amaranth_greens": PlantSize.SMALL,
    "malabar_spinach": PlantSize.VINE,
    "water_spinach": PlantSize.MEDIUM,
    "kangkong": PlantSize.MEDIUM,
    "ong_choy": PlantSize.MEDIUM,
    "chrysanthemum_greens": PlantSize.SMALL,
    "shungiku": PlantSize.SMALL,
    "perilla": PlantSize.MEDIUM,
    "vietnamese_coriander": PlantSize.SMALL,
    "thai_basil": PlantSize.SMALL,
    "holy_basil": PlantSize.SMALL,
    "lemon_basil": PlantSize.SMALL,
    "japanese_eggplant": PlantSize.MEDIUM,
    "thai_eggplant": PlantSize.MEDIUM,
    "indian_eggplant": PlantSize.MEDIUM,
    "long_beans": PlantSize.VINE,
    "winged_beans": PlantSize.VINE,
    "hyacinth_beans": PlantSize.VINE,
    "lablab_beans": PlantSize.VINE,
    "mung_bean_sprouts": PlantSize.SMALL,
    "soybean_sprouts": PlantSize.SMALL,
    
    # MORE ROOT VEGETABLES
    "sweet_potato": PlantSize.LARGE,
    "yam": PlantSize.LARGE,
    "taro": PlantSize.LARGE,
    "dasheen": PlantSize.LARGE,
    "eddoe": PlantSize.LARGE,
    "malanga": PlantSize.LARGE,
    "yautia": PlantSize.LARGE,
    "cassava": PlantSize.LARGE,
    "manioc": PlantSize.LARGE,
    "yuca": PlantSize.LARGE,
    "arrowroot": PlantSize.LARGE,
    "jerusalem_artichoke": PlantSize.LARGE,
    "chinese_artichoke": PlantSize.MEDIUM,
    "burdock": PlantSize.MEDIUM,
    "gobo": PlantSize.MEDIUM,
    "lotus_root": PlantSize.LARGE,
    "water_chestnut": PlantSize.MEDIUM,
    "bamboo_shoots": PlantSize.LARGE,
    
    # MORE SQUASH/GOURDS
    "butternut_squash": PlantSize.VINE,
    "acorn_squash": PlantSize.VINE,
    "spaghetti_squash": PlantSize.VINE,
    "delicata_squash": PlantSize.VINE,
    "kabocha_squash": PlantSize.VINE,
    "hubbard_squash": PlantSize.VINE,
    "turban_squash": PlantSize.VINE,
    "calabaza": PlantSize.VINE,
    "bottle_gourd": PlantSize.VINE,
    "snake_gourd": PlantSize.VINE,
    "ridge_gourd": PlantSize.VINE,
    "sponge_gourd": PlantSize.VINE,
    "ash_gourd": PlantSize.VINE,
    "wax_gourd": PlantSize.VINE,
    "fuzzy_melon": PlantSize.VINE,
    "hairy_melon": PlantSize.VINE,
    "opo_squash": PlantSize.VINE,
    
    # MORE GREENS
    "collards": PlantSize.MEDIUM,
    "turnip_greens": PlantSize.SMALL,
    "beet_greens": PlantSize.SMALL,
    "dandelion_greens": PlantSize.SMALL,
    "purslane": PlantSize.SMALL,
    "lamb's_quarters": PlantSize.SMALL,
    "orach": PlantSize.MEDIUM,
    "good_king_henry": PlantSize.MEDIUM,
    "sea_kale": PlantSize.MEDIUM,
    "cardoon": PlantSize.LARGE,
    
    # ADDITIONAL HERBS
    "anise": PlantSize.MEDIUM,
    "anise_hyssop": PlantSize.MEDIUM,
    "angelica": PlantSize.LARGE,
    "bay_laurel": PlantSize.LARGE,
    "bee_balm": PlantSize.MEDIUM,
    "bergamot": PlantSize.MEDIUM,
    "catnip": PlantSize.MEDIUM,
    "comfrey": PlantSize.LARGE,
    "costmary": PlantSize.MEDIUM,
    "curry_plant": PlantSize.MEDIUM,
    "epazote": PlantSize.MEDIUM,
    "feverfew": PlantSize.MEDIUM,
    "hyssop": PlantSize.MEDIUM,
    "lemon_verbena": PlantSize.MEDIUM,
    "lovage": PlantSize.LARGE,
    "mexican_oregano": PlantSize.MEDIUM,
    "nasturtium": PlantSize.SMALL,
    "rue": PlantSize.MEDIUM,
    "salad_burnet": PlantSize.SMALL,
    "savory": PlantSize.SMALL,
    "summer_savory": PlantSize.SMALL,
    "winter_savory": PlantSize.SMALL,
    "tansy": PlantSize.MEDIUM,
    "valerian": PlantSize.MEDIUM,
    "wormwood": PlantSize.MEDIUM,
    "yarrow": PlantSize.MEDIUM,
    
    # EDIBLE FLOWERS
    "calendula": PlantSize.SMALL,
    "marigold": PlantSize.SMALL,
    "pansy": PlantSize.SMALL,
    "viola": PlantSize.SMALL,
    "dianthus": PlantSize.SMALL,
    "hollyhock": PlantSize.LARGE,
    "hibiscus": PlantSize.LARGE,
    "rose": PlantSize.LARGE,
    "day_lily": PlantSize.MEDIUM,
    "squash_blossoms": PlantSize.VINE,
    
    # MICROGREENS (all small)
    "microgreens": PlantSize.SMALL,
    "sprouts": PlantSize.SMALL,
    "wheatgrass": PlantSize.SMALL,
    "pea_shoots": PlantSize.SMALL,
    "sunflower_shoots": PlantSize.SMALL,
    
    # COVER CROPS
    "clover": PlantSize.SMALL,
    "crimson_clover": PlantSize.SMALL,
    "white_clover": PlantSize.SMALL,
    "red_clover": PlantSize.SMALL,
    "vetch": PlantSize.MEDIUM,
    "hairy_vetch": PlantSize.MEDIUM,
    "field_peas": PlantSize.MEDIUM,
    "austrian_peas": PlantSize.MEDIUM,
    "winter_rye": PlantSize.MEDIUM,
    "annual_ryegrass": PlantSize.MEDIUM,
    "tillage_radish": PlantSize.MEDIUM,
    "daikon_radish": PlantSize.MEDIUM,
    "forage_turnip": PlantSize.MEDIUM,
    "rapeseed": PlantSize.MEDIUM,
    "canola": PlantSize.MEDIUM,
    "mustard": PlantSize.MEDIUM,
    "phacelia": PlantSize.SMALL,
    "buckwheat": PlantSize.MEDIUM,
    "sunn_hemp": PlantSize.LARGE,
    "cowpea": PlantSize.MEDIUM,
    "sorghum_sudangrass": PlantSize.LARGE,
    "pearl_millet": PlantSize.LARGE,
    "teff": PlantSize.MEDIUM,
    "flax": PlantSize.MEDIUM,
    "hemp": PlantSize.LARGE,
    
    # SEED CROPS
    "sunflower_seeds": PlantSize.LARGE,
    "pumpkin_seeds": PlantSize.VINE,
    "sesame": PlantSize.MEDIUM,
    "chia": PlantSize.MEDIUM,
    "poppy": PlantSize.SMALL,
    "nigella": PlantSize.SMALL,
    "coriander": PlantSize.MEDIUM,
    "cumin": PlantSize.MEDIUM,
    "fennel_seeds": PlantSize.MEDIUM,
    "fenugreek": PlantSize.MEDIUM,
    "caraway": PlantSize.MEDIUM,
    "dill_seeds": PlantSize.MEDIUM,
    "celery_seeds": PlantSize.MEDIUM,
    "anise_seeds": PlantSize.MEDIUM,
}


def get_crop_size(crop: str) -> PlantSize:
    """Get the size category for a crop"""
    crop_lower = crop.lower()
    
    # Direct match
    if crop_lower in CROP_SIZES:
        return CROP_SIZES[crop_lower]
    
    # Check for partial matches
    for key, size in CROP_SIZES.items():
        if key in crop_lower or crop_lower in key:
            return size
    
    # Default to medium if unknown
    return PlantSize.MEDIUM


def get_plants_per_sqft(size: PlantSize, method: SpacingMethod) -> float:
    """Get number of plants per square foot based on size and method"""
    if method == SpacingMethod.SQUARE_FOOT:
        if size == PlantSize.SMALL:
            return 4.0  # 4-16 depending on crop
        elif size == PlantSize.MEDIUM:
            return 1.0
        elif size == PlantSize.LARGE:
            return 0.25  # 1 per 4 sq ft
        else:  # VINE
            return 0.25  # With trellis
    
    elif method == SpacingMethod.INTENSIVE:
        # Tighter spacing
        if size == PlantSize.SMALL:
            return 9.0
        elif size == PlantSize.MEDIUM:
            return 2.0
        elif size == PlantSize.LARGE:
            return 0.5
        else:  # VINE
            return 0.25
    
    elif method == SpacingMethod.TRADITIONAL:
        # Row spacing - less efficient
        if size == PlantSize.SMALL:
            return 2.0
        elif size == PlantSize.MEDIUM:
            return 0.5
        elif size == PlantSize.LARGE:
            return 0.25
        else:  # VINE
            return 0.125  # Sprawling
    
    else:  # WIDE
        # Extra space for ease
        if size == PlantSize.SMALL:
            return 2.0
        elif size == PlantSize.MEDIUM:
            return 0.5
        elif size == PlantSize.LARGE:
            return 0.125
        else:  # VINE
            return 0.0625  # 1 per 16 sq ft


def calculate_bed_capacity(bed: GardenBed, method: SpacingMethod) -> Dict[PlantSize, int]:
    """Calculate how many plants of each size can fit in a bed"""
    total_sqft = bed.width * bed.length
    
    capacity = {}
    for size in PlantSize:
        plants_per_sqft = get_plants_per_sqft(size, method)
        capacity[size] = int(total_sqft * plants_per_sqft)
    
    return capacity


def generate_layout(
    crops: List[str],
    bed_width: int = 4,
    bed_length: int = 8,
    spacing_method: SpacingMethod = SpacingMethod.SQUARE_FOOT,
    sunlight: str = "Full Sun"
) -> GardenLayout:
    """
    Generate an optimized garden layout.
    
    Args:
        crops: List of crops to plant
        bed_width: Width of bed in feet
        bed_length: Length of bed in feet
        spacing_method: Spacing method to use
        sunlight: Sunlight level (Full Sun/Partial Sun/Shade)
    
    Returns:
        Complete garden layout with placements
    """
    bed = GardenBed(
        name=f"{bed_width}'x{bed_length}' Bed",
        width=bed_width,
        length=bed_length,
        sunlight=sunlight
    )
    
    # Get companion info for all crops
    companion_data = {}
    for crop in crops:
        info = get_companion_info(crop)
        if info:
            companion_data[crop] = info
    
    # Sort crops by size (large first for better placement)
    crops_with_size = [(crop, get_crop_size(crop)) for crop in crops]
    crops_with_size.sort(key=lambda x: (
        0 if x[1] == PlantSize.LARGE else
        1 if x[1] == PlantSize.VINE else
        2 if x[1] == PlantSize.MEDIUM else 3
    ))
    
    # Calculate how many of each crop can fit
    total_sqft = bed_width * bed_length
    placements = []
    
    for crop, size in crops_with_size:
        # Determine quantity based on size
        plants_per_sqft = get_plants_per_sqft(size, spacing_method)
        
        # Reserve space proportionally
        if size == PlantSize.LARGE or size == PlantSize.VINE:
            quantity = max(1, int(total_sqft * plants_per_sqft / len(crops)))
        elif size == PlantSize.MEDIUM:
            quantity = max(2, int(total_sqft * plants_per_sqft / len(crops)))
        else:  # SMALL
            quantity = max(4, int(total_sqft * plants_per_sqft / len(crops)))
        
        # Check for companion planting opportunities
        companion_to = None
        notes = []
        
        if crop in companion_data:
            for other_crop, _ in crops_with_size:
                if other_crop != crop and other_crop in companion_data[crop].good_companions:
                    companion_to = other_crop
                    notes.append(f"Companion to {other_crop}")
                    break
        
        placement = CropPlacement(
            crop=crop,
            quantity=quantity,
            size=size,
            companion_to=companion_to,
            notes=notes
        )
        placements.append(placement)
    
    bed.placements = placements
    
    # Add layout notes
    layout_notes = []
    layout_notes.append(f"Total space: {total_sqft} sq ft")
    layout_notes.append(f"Spacing method: {spacing_method.value}")
    
    # Add companion planting notes
    companions_found = sum(1 for p in placements if p.companion_to)
    if companions_found > 0:
        layout_notes.append(f"Companion plantings: {companions_found}")
    
    return GardenLayout(
        beds=[bed],
        spacing_method=spacing_method,
        notes=layout_notes
    )


def generate_ascii_layout(layout: GardenLayout) -> str:
    """
    Generate ASCII art representation of the layout.
    
    Args:
        layout: Garden layout to visualize
    
    Returns:
        ASCII art string
    """
    output = []
    output.append("=" * 70)
    output.append("GARDEN LAYOUT VISUALIZATION")
    output.append("=" * 70)
    output.append("")
    
    for bed in layout.beds:
        # Bed header
        output.append(f"┌{'─' * (bed.width * 8 + 2)}┐")
        output.append(f"│ {bed.name} ({bed.sunlight}){' ' * (bed.width * 8 - len(bed.name) - len(bed.sunlight) - 2)}│")
        output.append(f"├{'─' * (bed.width * 8 + 2)}┤")
        
        # Group placements by size for layout
        large_plants = [p for p in bed.placements if p.size in (PlantSize.LARGE, PlantSize.VINE)]
        medium_plants = [p for p in bed.placements if p.size == PlantSize.MEDIUM]
        small_plants = [p for p in bed.placements if p.size == PlantSize.SMALL]
        
        # Layout large plants first (north end to avoid shading)
        if large_plants:
            for plant in large_plants:
                crop_display = f"[{plant.crop.upper()}]"
                if plant.quantity > 1:
                    crop_display += f" x{plant.quantity}"
                output.append(f"│ {crop_display:<{bed.width * 8}} │")
        
        # Medium plants
        if medium_plants:
            output.append(f"│ {'':<{bed.width * 8}} │")
            for plant in medium_plants:
                crop_display = f"[{plant.crop.title()}]"
                if plant.quantity > 1:
                    crop_display += f" x{plant.quantity}"
                if plant.companion_to:
                    crop_display += f" (with {plant.companion_to})"
                output.append(f"│ {crop_display:<{bed.width * 8}} │")
        
        # Small plants (can fill gaps)
        if small_plants:
            output.append(f"│ {'':<{bed.width * 8}} │")
            small_line = " ".join([f"[{p.crop[:4]}]x{p.quantity}" for p in small_plants])
            output.append(f"│ {small_line:<{bed.width * 8}} │")
        
        output.append(f"└{'─' * (bed.width * 8 + 2)}┘")
        output.append("")
        
        # Planting notes
        output.append("Planting Notes:")
        for i, plant in enumerate(bed.placements, 1):
            size_desc = {
                PlantSize.LARGE: "24-36\" spacing",
                PlantSize.MEDIUM: "12-18\" spacing",
                PlantSize.SMALL: "4-6\" spacing",
                PlantSize.VINE: "Needs trellis or 36\" spacing"
            }.get(plant.size, "")
            
            output.append(f"  {i}. {plant.crop.title()}: {plant.quantity} plants ({size_desc})")
            for note in plant.notes:
                output.append(f"     • {note}")
        
        output.append("")
    
    # Overall layout notes
    if layout.notes:
        output.append("Layout Notes:")
        for note in layout.notes:
            output.append(f"  • {note}")
    
    return "\n".join(output)


def generate_layout_guide(crops: List[str], user_space: str = "4x8 bed") -> str:
    """
    Generate a complete layout guide for given crops.
    
    Args:
        crops: List of crops to layout
        user_space: User's space description
    
    Returns:
        Complete layout guide as string
    """
    # Parse space (simplified - assume 4x8 if unclear)
    try:
        parts = user_space.lower().split('x')
        width = int(''.join(filter(str.isdigit, parts[0]))) if parts else 4
        length = int(''.join(filter(str.isdigit, parts[1]))) if len(parts) > 1 else 8
    except:
        width, length = 4, 8
    
    # Generate layout
    layout = generate_layout(crops, width, length)
    
    # Generate ASCII visualization
    ascii_viz = generate_ascii_layout(layout)
    
    return ascii_viz
