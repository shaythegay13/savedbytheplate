"""
Crop family classifications for disease and companion planting recommendations.
Maps crops to their botanical families for intelligent recommendations.
"""

from enum import Enum
from typing import List, Dict, Set

class CropFamily(str, Enum):
    """Botanical families for crop classification"""
    SOLANACEAE = "Nightshades"  # Tomatoes, peppers, eggplant, potatoes
    BRASSICACEAE = "Brassicas"  # Cabbage, broccoli, kale, radish
    CUCURBITACEAE = "Cucurbits"  # Cucumbers, squash, melons, pumpkins
    FABACEAE = "Legumes"  # Beans, peas, lentils, peanuts
    APIACEAE = "Umbellifers"  # Carrots, celery, parsley, fennel
    ALLIACEAE = "Alliums"  # Onions, garlic, leeks, chives
    ASTERACEAE = "Composites"  # Lettuce, sunflowers, artichokes
    CHENOPODIACEAE = "Chenopods"  # Beets, chard, spinach, quinoa
    POACEAE = "Grasses"  # Corn, wheat, rice, oats, barley
    ROSACEAE = "Rose Family"  # Apples, pears, strawberries, almonds
    RUTACEAE = "Citrus"  # Oranges, lemons, limes, grapefruit
    VITACEAE = "Grape Family"  # Grapes
    MUSACEAE = "Banana Family"  # Bananas, plantains
    LAURACEAE = "Laurel Family"  # Avocado
    ANACARDIACEAE = "Cashew Family"  # Mango, cashew, pistachio
    JUGLANDACEAE = "Walnut Family"  # Walnuts, pecans, hickory
    PROTEACEAE = "Protea Family"  # Macadamia
    LAMIACEAE = "Mint Family"  # Basil, mint, oregano, thyme
    POLYGONACEAE = "Buckwheat Family"  # Buckwheat, rhubarb, sorrel
    TROPICAL_FRUIT = "Tropical Fruits"  # Papaya, pineapple, dragon fruit
    BERRIES = "Berry Fruits"  # Blueberries, raspberries, blackberries

# Crop to family mapping
CROP_FAMILIES: Dict[str, CropFamily] = {
    # Nightshades
    "tomatoes": CropFamily.SOLANACEAE,
    "peppers": CropFamily.SOLANACEAE,
    "eggplant": CropFamily.SOLANACEAE,
    "potatoes": CropFamily.SOLANACEAE,
    "tomatillo": CropFamily.SOLANACEAE,
    
    # Brassicas
    "broccoli": CropFamily.BRASSICACEAE,
    "cabbage": CropFamily.BRASSICACEAE,
    "cauliflower": CropFamily.BRASSICACEAE,
    "kale": CropFamily.BRASSICACEAE,
    "brussels_sprouts": CropFamily.BRASSICACEAE,
    "radishes": CropFamily.BRASSICACEAE,
    "turnips": CropFamily.BRASSICACEAE,
    "arugula": CropFamily.BRASSICACEAE,
    "bok_choy": CropFamily.BRASSICACEAE,
    "kohlrabi": CropFamily.BRASSICACEAE,
    "collard_greens": CropFamily.BRASSICACEAE,
    
    # Cucurbits
    "cucumbers": CropFamily.CUCURBITACEAE,
    "zucchini": CropFamily.CUCURBITACEAE,
    "squash": CropFamily.CUCURBITACEAE,
    "pumpkin": CropFamily.CUCURBITACEAE,
    "melons": CropFamily.CUCURBITACEAE,
    "watermelon": CropFamily.CUCURBITACEAE,
    "cantaloupe": CropFamily.CUCURBITACEAE,
    "honeydew": CropFamily.CUCURBITACEAE,
    
    # Legumes
    "beans": CropFamily.FABACEAE,
    "peas": CropFamily.FABACEAE,
    "lentils": CropFamily.FABACEAE,
    "chickpeas": CropFamily.FABACEAE,
    "soybeans": CropFamily.FABACEAE,
    "peanuts": CropFamily.FABACEAE,
    "kidney_beans": CropFamily.FABACEAE,
    "black_beans": CropFamily.FABACEAE,
    "lima_beans": CropFamily.FABACEAE,
    "mung_beans": CropFamily.FABACEAE,
    
    # Umbellifers
    "carrots": CropFamily.APIACEAE,
    "celery": CropFamily.APIACEAE,
    "parsley": CropFamily.APIACEAE,
    "cilantro": CropFamily.APIACEAE,
    "fennel": CropFamily.APIACEAE,
    "parsnip": CropFamily.APIACEAE,
    
    # Alliums
    "onions": CropFamily.ALLIACEAE,
    "garlic": CropFamily.ALLIACEAE,
    "leeks": CropFamily.ALLIACEAE,
    "chives": CropFamily.ALLIACEAE,
    "shallots": CropFamily.ALLIACEAE,
    
    # Composites
    "lettuce": CropFamily.ASTERACEAE,
    "sunflowers": CropFamily.ASTERACEAE,
    "artichokes": CropFamily.ASTERACEAE,
    "endive": CropFamily.ASTERACEAE,
    "radicchio": CropFamily.ASTERACEAE,
    
    # Chenopods
    "beets": CropFamily.CHENOPODIACEAE,
    "swiss_chard": CropFamily.CHENOPODIACEAE,
    "spinach": CropFamily.CHENOPODIACEAE,
    "quinoa": CropFamily.CHENOPODIACEAE,
    
    # Grasses/Grains
    "corn": CropFamily.POACEAE,
    "wheat": CropFamily.POACEAE,
    "rice": CropFamily.POACEAE,
    "oats": CropFamily.POACEAE,
    "barley": CropFamily.POACEAE,
    "rye": CropFamily.POACEAE,
    "millet": CropFamily.POACEAE,
    "sorghum": CropFamily.POACEAE,
    
    # Herbs (Mint family)
    "basil": CropFamily.LAMIACEAE,
    "mint": CropFamily.LAMIACEAE,
    "oregano": CropFamily.LAMIACEAE,
    "thyme": CropFamily.LAMIACEAE,
    "sage": CropFamily.LAMIACEAE,
    "rosemary": CropFamily.LAMIACEAE,
    
    # Fruits
    "strawberries": CropFamily.ROSACEAE,
    "apples": CropFamily.ROSACEAE,
    "pears": CropFamily.ROSACEAE,
    "peaches": CropFamily.ROSACEAE,
    "plums": CropFamily.ROSACEAE,
    "cherries": CropFamily.ROSACEAE,
    "almonds": CropFamily.ROSACEAE,
    "raspberries": CropFamily.BERRIES,
    "blackberries": CropFamily.BERRIES,
    "blueberries": CropFamily.BERRIES,
    "cranberries": CropFamily.BERRIES,
    "grapes": CropFamily.VITACEAE,
    "oranges": CropFamily.RUTACEAE,
    "lemons": CropFamily.RUTACEAE,
    "limes": CropFamily.RUTACEAE,
    "grapefruit": CropFamily.RUTACEAE,
    "bananas": CropFamily.MUSACEAE,
    "avocado": CropFamily.LAURACEAE,
    "mango": CropFamily.ANACARDIACEAE,
    "cashews": CropFamily.ANACARDIACEAE,
    "pistachios": CropFamily.ANACARDIACEAE,
    "walnuts": CropFamily.JUGLANDACEAE,
    "pecans": CropFamily.JUGLANDACEAE,
    "macadamia": CropFamily.PROTEACEAE,
    "papaya": CropFamily.TROPICAL_FRUIT,
    "pineapple": CropFamily.TROPICAL_FRUIT,
    "dragon_fruit": CropFamily.TROPICAL_FRUIT,
    
    # Extended Fruits
    "kiwi": CropFamily.TROPICAL_FRUIT,
    "fig": CropFamily.TROPICAL_FRUIT,
    "pomegranate": CropFamily.TROPICAL_FRUIT,
    "persimmon": CropFamily.TROPICAL_FRUIT,
    "nectarine": CropFamily.ROSACEAE,
    "apricot": CropFamily.ROSACEAE,
    "quince": CropFamily.ROSACEAE,
    "gooseberry": CropFamily.BERRIES,
    "currant": CropFamily.BERRIES,
    "elderberry": CropFamily.BERRIES,
    "mulberry": CropFamily.BERRIES,
    "goji_berry": CropFamily.SOLANACEAE,  # Actually nightshade family!
    "kumquat": CropFamily.RUTACEAE,
    "tangerine": CropFamily.RUTACEAE,
    "clementine": CropFamily.RUTACEAE,
    
    # Extended Vegetables
    "asparagus": CropFamily.ASTERACEAE,
    "artichoke": CropFamily.ASTERACEAE,
    "celery": CropFamily.APIACEAE,
    "parsnip": CropFamily.APIACEAE,
    "sweet_potato": CropFamily.SOLANACEAE,
    "potato": CropFamily.SOLANACEAE,
    "yam": CropFamily.TROPICAL_FRUIT,
    "okra": CropFamily.TROPICAL_FRUIT,
    "rhubarb": CropFamily.CHENOPODIACEAE,
    "rutabaga": CropFamily.BRASSICACEAE,
    "daikon": CropFamily.BRASSICACEAE,
    "collard_greens": CropFamily.BRASSICACEAE,
    "mustard_greens": CropFamily.BRASSICACEAE,
    "watercress": CropFamily.BRASSICACEAE,
    "endive": CropFamily.ASTERACEAE,
    "chicory": CropFamily.ASTERACEAE,
    "escarole": CropFamily.ASTERACEAE,
    
    # Extended Legumes
    "lentils": CropFamily.FABACEAE,
    "chickpeas": CropFamily.FABACEAE,
    "black_beans": CropFamily.FABACEAE,
    "kidney_beans": CropFamily.FABACEAE,
    "pinto_beans": CropFamily.FABACEAE,
    "navy_beans": CropFamily.FABACEAE,
    "lima_beans": CropFamily.FABACEAE,
    "fava_beans": CropFamily.FABACEAE,
    "adzuki_beans": CropFamily.FABACEAE,
    "mung_beans": CropFamily.FABACEAE,
    "black_eyed_peas": CropFamily.FABACEAE,
    "soybeans": CropFamily.FABACEAE,
    
    # Grains
    "wheat": CropFamily.POACEAE,
    "amaranth": CropFamily.CHENOPODIACEAE,  # Pseudo-grain
    "buckwheat": CropFamily.CHENOPODIACEAE,  # Pseudo-grain
    "teff": CropFamily.POACEAE,
    "farro": CropFamily.POACEAE,
    "spelt": CropFamily.POACEAE,
    "kamut": CropFamily.POACEAE,
    
    # Herbs (extended)
    "dill": CropFamily.APIACEAE,
    "tarragon": CropFamily.ASTERACEAE,
    "chervil": CropFamily.APIACEAE,
    "marjoram": CropFamily.LAMIACEAE,
    "lavender": CropFamily.LAMIACEAE,
    "lemon_balm": CropFamily.LAMIACEAE,
    "catnip": CropFamily.LAMIACEAE,
    
    # Nuts (extended)
    "hazelnuts": CropFamily.JUGLANDACEAE,
    "chestnuts": CropFamily.ROSACEAE,
    "brazil_nuts": CropFamily.TROPICAL_FRUIT,
    "pine_nuts": CropFamily.TROPICAL_FRUIT,
    
    # ALL REMAINING FRUITS (from your list)
    "acai": CropFamily.TROPICAL_FRUIT,
    "acerola_cherry": CropFamily.TROPICAL_FRUIT,
    "bael": CropFamily.TROPICAL_FRUIT,
    "bilberry": CropFamily.BERRIES,
    "breadfruit": CropFamily.TROPICAL_FRUIT,
    "buddhas_hand": CropFamily.RUTACEAE,
    "cape_gooseberry": CropFamily.SOLANACEAE,
    "cherimoya": CropFamily.TROPICAL_FRUIT,
    "coconut": CropFamily.TROPICAL_FRUIT,
    "crab_apple": CropFamily.ROSACEAE,
    "date": CropFamily.TROPICAL_FRUIT,
    "durian": CropFamily.TROPICAL_FRUIT,
    "feijoa": CropFamily.TROPICAL_FRUIT,
    "guava": CropFamily.TROPICAL_FRUIT,
    "jackfruit": CropFamily.TROPICAL_FRUIT,
    "longan": CropFamily.TROPICAL_FRUIT,
    "lychee": CropFamily.TROPICAL_FRUIT,
    "mangosteen": CropFamily.TROPICAL_FRUIT,
    "marionberry": CropFamily.BERRIES,
    "passionfruit": CropFamily.TROPICAL_FRUIT,
    "rambutan": CropFamily.TROPICAL_FRUIT,
    "starfruit": CropFamily.TROPICAL_FRUIT,
    "tamarind": CropFamily.FABACEAE,
    
    # ALL REMAINING VEGETABLES
    "brussels_sprouts": CropFamily.BRASSICACEAE,
    "cress": CropFamily.BRASSICACEAE,
    "green_beans": CropFamily.FABACEAE,
    "mushroom": CropFamily.TROPICAL_FRUIT,  # Not a plant but included
    "tomatillo": CropFamily.SOLANACEAE,
    
    # ALL REMAINING NUTS
    "andean_walnut": CropFamily.JUGLANDACEAE,
    "argan_nut": CropFamily.TROPICAL_FRUIT,
    "beech_nut": CropFamily.TROPICAL_FRUIT,
    "betel_nut": CropFamily.TROPICAL_FRUIT,
    "black_walnut": CropFamily.JUGLANDACEAE,
    "breadnut": CropFamily.TROPICAL_FRUIT,
    "bunya_nut": CropFamily.TROPICAL_FRUIT,
    "butternut": CropFamily.JUGLANDACEAE,
    "candle_nut": CropFamily.TROPICAL_FRUIT,
    "chilean_hazelnut": CropFamily.JUGLANDACEAE,
    "chinese_chestnut": CropFamily.ROSACEAE,
    "dika_nut": CropFamily.TROPICAL_FRUIT,
    "english_walnut": CropFamily.JUGLANDACEAE,
    "filbert": CropFamily.JUGLANDACEAE,
    "ginkgo_nut": CropFamily.TROPICAL_FRUIT,
    "hickory_nut": CropFamily.JUGLANDACEAE,
    "jack_nut": CropFamily.TROPICAL_FRUIT,
    "kola_nut": CropFamily.TROPICAL_FRUIT,
    "kurrajong_nut": CropFamily.TROPICAL_FRUIT,
    "lotus_nut": CropFamily.TROPICAL_FRUIT,
    "malabar_chestnut": CropFamily.TROPICAL_FRUIT,
    "marcona_almond": CropFamily.ROSACEAE,
    "mongongo_nut": CropFamily.TROPICAL_FRUIT,
    "monkey_puzzle_nut": CropFamily.TROPICAL_FRUIT,
    "palm_nut": CropFamily.TROPICAL_FRUIT,
    "paradise_nut": CropFamily.TROPICAL_FRUIT,
    "pignoli": CropFamily.TROPICAL_FRUIT,
    "pili_nut": CropFamily.TROPICAL_FRUIT,
    "saba_nut": CropFamily.TROPICAL_FRUIT,
    "tiger_nut": CropFamily.CHENOPODIACEAE,
    "water_caltrop": CropFamily.TROPICAL_FRUIT,
    
    # ALL REMAINING GRAINS
    "bulgur": CropFamily.POACEAE,
    "einkorn": CropFamily.POACEAE,
    "fonio": CropFamily.POACEAE,
    "freekeh": CropFamily.POACEAE,
    "semolina": CropFamily.POACEAE,
    "triticale": CropFamily.POACEAE,
    "wild_rice": CropFamily.POACEAE,
    
    # ALL REMAINING LEGUMES
    "haricot": CropFamily.FABACEAE,
    "black_turtle_bean": CropFamily.FABACEAE,
    "scarlet_runner_bean": CropFamily.FABACEAE,
    "rice_bean": CropFamily.FABACEAE,
    "moth_bean": CropFamily.FABACEAE,
    "tepary_bean": CropFamily.FABACEAE,
    "broad_bean": CropFamily.FABACEAE,
    "horse_bean": CropFamily.FABACEAE,
    "field_bean": CropFamily.FABACEAE,
    "garden_pea": CropFamily.FABACEAE,
    "protein_pea": CropFamily.FABACEAE,
    "garbanzo": CropFamily.FABACEAE,
    "pigeon_pea": CropFamily.FABACEAE,
    "bambara_groundnut": CropFamily.FABACEAE,
    "vetch": CropFamily.FABACEAE,
    "lupin": CropFamily.FABACEAE,
    "lablab_bean": CropFamily.FABACEAE,
    "jack_bean": CropFamily.FABACEAE,
    "sword_bean": CropFamily.FABACEAE,
    "winged_bean": CropFamily.FABACEAE,
    "velvet_bean": CropFamily.FABACEAE,
    "yam_bean": CropFamily.FABACEAE,
    "lentil_dal": CropFamily.FABACEAE,
    "cannellini_bean": CropFamily.FABACEAE,
    "mesquite_bean": CropFamily.FABACEAE,
    
    # RICE VARIETIES (35+)
    "aizon_rice": CropFamily.POACEAE,
    "ambemohar_rice": CropFamily.POACEAE,
    "annapoornna_rice": CropFamily.POACEAE,
    "atop_rice": CropFamily.POACEAE,
    "basmati_rice": CropFamily.POACEAE,
    "barma_black_rice": CropFamily.POACEAE,
    "bhut_muri_rice": CropFamily.POACEAE,
    "bora_rice": CropFamily.POACEAE,
    "champa_rice": CropFamily.POACEAE,
    "chokuwa_rice": CropFamily.POACEAE,
    "clearfield_rice": CropFamily.POACEAE,
    "dubraj_rice": CropFamily.POACEAE,
    "gandhasala_rice": CropFamily.POACEAE,
    "gobindobhog_rice": CropFamily.POACEAE,
    "hansraj_rice": CropFamily.POACEAE,
    "hasan_serai_rice": CropFamily.POACEAE,
    "hmt_rice": CropFamily.POACEAE,
    "idly_rice": CropFamily.POACEAE,
    "jay_shrirama_rice": CropFamily.POACEAE,
    "joha_rice": CropFamily.POACEAE,
    "jyothi_rice": CropFamily.POACEAE,
    "kamini_rice": CropFamily.POACEAE,
    "kasalath_rice": CropFamily.POACEAE,
    "katta_sambar_rice": CropFamily.POACEAE,
    "laxmi_bhog_rice": CropFamily.POACEAE,
    "minicate_rice": CropFamily.POACEAE,
    "molakolukulu_rice": CropFamily.POACEAE,
    "navara_rice": CropFamily.POACEAE,
    "patna_rice": CropFamily.POACEAE,
    "ponni_rice": CropFamily.POACEAE,
    "pusa_basmati_1121_rice": CropFamily.POACEAE,
    "radhunipagal_rice": CropFamily.POACEAE,
    "raja_hansa_rice": CropFamily.POACEAE,
    "ranjit_rice": CropFamily.POACEAE,
    "rosematta_rice": CropFamily.POACEAE,
    "sona_masuri_rice": CropFamily.POACEAE,
    "surekha_rice": CropFamily.POACEAE,
    "tulaipanji_rice": CropFamily.POACEAE,
    
    # SEEDS (edible/plantable)
    "sunflower_seed": CropFamily.ASTERACEAE,
    "pumpkin_seed": CropFamily.CUCURBITACEAE,
    "flax_seed": CropFamily.TROPICAL_FRUIT,
    "chia_seed": CropFamily.LAMIACEAE,
    "sesame_seed": CropFamily.TROPICAL_FRUIT,
    "hemp_seed": CropFamily.TROPICAL_FRUIT,
    "poppy_seed": CropFamily.TROPICAL_FRUIT,
    "caraway_seed": CropFamily.APIACEAE,
    "nigella_seed": CropFamily.TROPICAL_FRUIT,
    "mustard_seed": CropFamily.BRASSICACEAE,
    "coriander_seed": CropFamily.APIACEAE,
    "cumin_seed": CropFamily.APIACEAE,
    "fennel_seed": CropFamily.APIACEAE,
    "fenugreek_seed": CropFamily.FABACEAE,
    "basil_seed": CropFamily.LAMIACEAE,
    "watermelon_seed": CropFamily.CUCURBITACEAE,
    "grape_seed": CropFamily.VITACEAE,
    "cottonseed": CropFamily.TROPICAL_FRUIT,
    "safflower_seed": CropFamily.ASTERACEAE,
    "cardamom_seed": CropFamily.TROPICAL_FRUIT,
    "celery_seed": CropFamily.APIACEAE,
    "moringa_seed": CropFamily.TROPICAL_FRUIT,
    "lotus_seed": CropFamily.TROPICAL_FRUIT,
    "jackfruit_seed": CropFamily.TROPICAL_FRUIT,
    "sacha_inchi_seed": CropFamily.TROPICAL_FRUIT,
    "canola_seed": CropFamily.BRASSICACEAE,
}

# Common diseases by family - Comprehensive database for 270+ crops
FAMILY_DISEASES: Dict[CropFamily, List[str]] = {
    CropFamily.SOLANACEAE: [
        # Tomatoes, Peppers, Eggplant, Potatoes, Tomatillo, Goji Berry
        "Early Blight (Alternaria solani)", "Late Blight (Phytophthora infestans)", 
        "Septoria Leaf Spot", "Verticillium Wilt", "Fusarium Wilt",
        "Bacterial Spot", "Bacterial Speck", "Bacterial Canker",
        "Tomato Mosaic Virus (ToMV)", "Tobacco Mosaic Virus (TMV)",
        "Tomato Spotted Wilt Virus (TSWV)", "Blossom End Rot",
        "Powdery Mildew", "Gray Mold (Botrytis)", "Anthracnose",
        "Southern Blight", "Damping Off", "Root-Knot Nematodes",
        "Potato Scab", "Blackleg", "Hollow Heart", "Leaf Roll Virus"
    ],
    CropFamily.BRASSICACEAE: [
        # Cabbage, Broccoli, Kale, Radish, Turnip, Arugula, Bok Choy, Kohlrabi
        "Clubroot (Plasmodiophora brassicae)", "Black Rot (Xanthomonas campestris)",
        "Downy Mildew (Peronospora parasitica)", "Powdery Mildew",
        "White Rust (Albugo candida)", "Alternaria Leaf Spot",
        "Bacterial Soft Rot", "Black Leg (Phoma lingam)",
        "Fusarium Yellows", "Verticillium Wilt",
        "Cabbage Yellows", "Ring Spot", "Wirestem",
        "Damping Off", "Root Maggot Damage", "Flea Beetle Damage",
        "Cabbage Looper Damage", "Imported Cabbageworm",
        "Diamondback Moth", "Aphid-transmitted Viruses"
    ],
    CropFamily.CUCURBITACEAE: [
        # Cucumbers, Squash, Melons, Pumpkins, Watermelon, Zucchini
        "Powdery Mildew (Podosphaera xanthii)", "Downy Mildew (Pseudoperonospora cubensis)",
        "Anthracnose (Colletotrichum spp.)", "Bacterial Wilt (Erwinia tracheiphila)",
        "Cucumber Mosaic Virus (CMV)", "Watermelon Mosaic Virus",
        "Zucchini Yellow Mosaic Virus", "Fusarium Wilt",
        "Gummy Stem Blight (Didymella bryoniae)", "Angular Leaf Spot",
        "Alternaria Leaf Blight", "Phytophthora Blight",
        "Scab (Cladosporium cucumerinum)", "Belly Rot",
        "Blossom End Rot", "Pythium Root Rot", "Verticillium Wilt",
        "Target Spot", "Cercospora Leaf Spot"
    ],
    CropFamily.FABACEAE: [
        # Beans, Peas, Lentils, Chickpeas, Soybeans, Peanuts, All Legumes
        "Bean Rust (Uromyces appendiculatus)", "Anthracnose (Colletotrichum lindemuthianum)",
        "Bacterial Blight (Pseudomonas syringae)", "Halo Blight",
        "Common Bacterial Blight", "Powdery Mildew (Erysiphe polygoni)",
        "Downy Mildew", "Root Rot (Rhizoctonia, Fusarium, Pythium)",
        "Bean Common Mosaic Virus (BCMV)", "Bean Yellow Mosaic Virus",
        "White Mold (Sclerotinia sclerotiorum)", "Gray Mold (Botrytis)",
        "Fusarium Wilt", "Verticillium Wilt", "Ascochyta Blight",
        "Septoria Leaf Spot", "Cercospora Leaf Spot",
        "Damping Off", "Seed Rot", "Pod Rot",
        "Peanut Leaf Spot", "Southern Blight", "Root-Knot Nematodes"
    ],
    CropFamily.APIACEAE: [
        # Carrots, Celery, Parsley, Cilantro, Fennel, Parsnip, Dill
        "Carrot Rust Fly Damage", "Leaf Blight (Alternaria dauci)",
        "Cercospora Leaf Spot (Cercospora carotae)", "Powdery Mildew",
        "Aster Yellows (Phytoplasma)", "Bacterial Soft Rot",
        "Cavity Spot", "Black Rot", "Sclerotinia Rot",
        "Pythium Root Rot", "Rhizoctonia Root Rot",
        "Carrot Motley Dwarf Virus", "Celery Mosaic Virus",
        "Septoria Leaf Spot", "Early Blight", "Late Blight",
        "Damping Off", "Crown Rot", "Storage Rot"
    ],
    CropFamily.ALLIACEAE: [
        # Onions, Garlic, Leeks, Chives, Shallots
        "Onion Smut (Urocystis cepulae)", "Downy Mildew (Peronospora destructor)",
        "Purple Blotch (Alternaria porri)", "Botrytis Leaf Blight",
        "Botrytis Neck Rot", "White Rot (Sclerotium cepivorum)",
        "Fusarium Basal Rot", "Pink Root (Phoma terrestris)",
        "Bacterial Soft Rot", "Sour Skin (Burkholderia cepacia)",
        "Onion Yellow Dwarf Virus", "Iris Yellow Spot Virus",
        "Rust (Puccinia allii)", "Black Mold", "Blue Mold",
        "Stemphylium Leaf Blight", "Thrips Damage"
    ],
    CropFamily.ASTERACEAE: [
        # Lettuce, Sunflowers, Artichokes, Endive, Radicchio
        "Downy Mildew (Bremia lactucae)", "Bottom Rot (Rhizoctonia solani)",
        "Tipburn (Physiological)", "Lettuce Mosaic Virus (LMV)",
        "Septoria Leaf Spot", "Powdery Mildew", "Anthracnose",
        "Sclerotinia Drop (White Mold)", "Gray Mold (Botrytis)",
        "Bacterial Leaf Spot", "Corky Root Rot",
        "Fusarium Wilt", "Verticillium Wilt", "Big Vein Virus",
        "Lettuce Dieback", "Aster Yellows", "Damping Off",
        "Root Aphid Damage", "Sunflower Rust", "Sunflower Downy Mildew"
    ],
    CropFamily.CHENOPODIACEAE: [
        # Beets, Swiss Chard, Spinach, Quinoa
        "Cercospora Leaf Spot (Cercospora beticola)", "Downy Mildew",
        "Powdery Mildew", "Root Rot (Rhizoctonia, Pythium, Phytophthora)",
        "Damping Off", "Leaf Miners (Pegomya hyoscyami)",
        "Beet Curly Top Virus", "Beet Mosaic Virus",
        "Fusarium Yellows", "Verticillium Wilt",
        "Bacterial Leaf Spot", "Anthracnose",
        "Scab (Streptomyces scabies)", "Black Root",
        "Spinach Blight", "White Rust", "Alternaria Leaf Spot"
    ],
    CropFamily.ROSACEAE: [
        # Apples, Pears, Peaches, Plums, Cherries, Strawberries, Almonds, Nectarines, Apricots, Quinces
        "Fire Blight (Erwinia amylovora)", "Apple Scab (Venturia inaequalis)",
        "Powdery Mildew (Podosphaera leucotricha)", "Brown Rot (Monilinia spp.)",
        "Cedar Apple Rust (Gymnosporangium juniperi-virginianae)", "Black Knot (Apiosporina morbosa)",
        "Peach Leaf Curl (Taphrina deformans)", "Bacterial Canker (Pseudomonas syringae)",
        "Crown Gall (Agrobacterium tumefaciens)", "Bitter Rot",
        "Sooty Blotch and Flyspeck", "White Rot", "Black Rot",
        "Alternaria Leaf Blotch", "Frogeye Leaf Spot", "Brooks Fruit Spot",
        "Phytophthora Root Rot", "Armillaria Root Rot (Oak Root Fungus)",
        "Verticillium Wilt", "Bacterial Spot", "Shot Hole Disease",
        "Coryneum Blight", "Cytospora Canker", "Perennial Canker",
        "Silver Leaf (Chondrostereum purpureum)", "Replant Disease",
        "Apple Mosaic Virus", "Plum Pox Virus (Sharka)", "Prune Dwarf Virus"
    ],
    CropFamily.BERRIES: [
        # Strawberries, Blueberries, Raspberries, Blackberries, Cranberries, Gooseberries, Currants, Elderberries
        "Gray Mold (Botrytis cinerea)", "Anthracnose (Colletotrichum spp.)",
        "Powdery Mildew (Sphaerotheca macularis)", "Verticillium Wilt",
        "Phytophthora Root Rot", "Leaf Spot (Mycosphaerella fragariae)",
        "Cane Blight (Leptosphaeria coniothyrium)", "Orange Rust (Gymnoconia nitens)",
        "Mummy Berry (Monilinia vaccinii-corymbosi)", "Spur Blight",
        "Cane and Leaf Rust", "Yellow Rust", "Late Leaf Rust",
        "Septoria Leaf Spot", "Angular Leaf Spot", "Leaf Scorch",
        "Red Stele (Phytophthora fragariae)", "Black Root Rot",
        "Crown Rot", "Leather Rot", "Fruit Rot",
        "Strawberry Mottle Virus", "Raspberry Bushy Dwarf Virus",
        "Blueberry Shock Virus", "Tomato Ringspot Virus",
        "Tobacco Ringspot Virus", "Blueberry Stem Canker",
        "Fusicoccum Canker", "Godronia Canker", "Phomopsis Canker"
    ],
    CropFamily.RUTACEAE: [
        # Oranges, Lemons, Limes, Grapefruit, Tangerines, Kumquats, Clementines
        "Citrus Canker (Xanthomonas citri)", "Citrus Greening (Huanglongbing/HLB)",
        "Citrus Black Spot (Phyllosticta citricarpa)", "Melanose (Diaporthe citri)",
        "Alternaria Brown Spot (Alternaria alternata)", "Phytophthora Root Rot",
        "Phytophthora Gummosis", "Sooty Mold", "Citrus Scab (Elsinoe fawcettii)",
        "Greasy Spot (Mycosphaerella citri)", "Septoria Spot",
        "Anthracnose (Colletotrichum gloeosporioides)", "Brown Rot (Phytophthora spp.)",
        "Botrytis Rot", "Penicillium Rot", "Diplodia Stem-End Rot",
        "Tristeza Virus (CTV)", "Psorosis Virus", "Exocortis Viroid",
        "Stubborn Disease (Spiroplasma citri)", "Armillaria Root Rot",
        "Foot Rot", "Dry Root Rot", "Citrus Blast"
    ],
    CropFamily.VITACEAE: [
        # Grapes
        "Powdery Mildew (Uncinula necator)", "Downy Mildew (Plasmopara viticola)",
        "Black Rot (Guignardia bidwellii)", "Botrytis Bunch Rot (Gray Mold)",
        "Anthracnose (Elsinoe ampelina)", "Pierce's Disease (Xylella fastidiosa)",
        "Crown Gall (Agrobacterium vitis)", "Phomopsis Cane and Leaf Spot",
        "Eutypa Dieback (Eutypa lata)", "Esca (Black Measles)",
        "Botryosphaeria Dieback", "Armillaria Root Rot",
        "Phytophthora Root and Crown Rot", "Dead Arm Disease",
        "Grapevine Leafroll Virus", "Fanleaf Virus", "Corky Bark Virus",
        "Ripe Rot", "Bitter Rot", "Sour Rot", "Summer Bunch Rot"
    ],
    CropFamily.TROPICAL_FRUIT: [
        # Papaya, Pineapple, Dragon Fruit, Mango, Banana, Avocado, Guava, Kiwi, Fig, Pomegranate
        "Anthracnose (Colletotrichum spp.)", "Fusarium Wilt", "Root Rot (Phytophthora, Pythium)",
        "Leaf Spot (Cercospora, Pseudocercospora)", "Fruit Rot", "Bacterial Soft Rot",
        "Powdery Mildew", "Cercospora Leaf Spot", "Black Spot",
        "Papaya Ringspot Virus", "Banana Bunchy Top Virus", "Banana Streak Virus",
        "Panama Disease (Fusarium oxysporum f.sp. cubense)", "Black Sigatoka",
        "Yellow Sigatoka", "Moko Disease", "Avocado Root Rot (Phytophthora cinnamomi)",
        "Laurel Wilt (Raffaelea lauricola)", "Stem End Rot", "Body Rot",
        "Mango Malformation", "Bacterial Black Spot", "Sooty Mold",
        "Pink Disease", "Dieback", "Gummosis", "Fruit Fly Damage"
    ],
    CropFamily.JUGLANDACEAE: [
        # Walnuts, Pecans, Hickory, Hazelnuts
        "Walnut Blight (Xanthomonas arboricola)", "Anthracnose (Gnomonia leptostyla)",
        "Crown Rot (Phytophthora spp.)", "Thousand Cankers Disease (Geosmithia morbida)",
        "Phytophthora Root Rot", "Leaf Blotch (Marssonina juglandis)",
        "Armillaria Root Rot", "Botryosphaeria Canker", "Branch Wilt",
        "Pecan Scab (Fusicladium effusum)", "Downy Spot", "Brown Leaf Spot",
        "Vein Spot", "Liver Spot", "Zonate Leaf Spot",
        "Bunch Disease", "Shuck and Kernel Rot", "Crown Gall",
        "Walnut Black Line Disease", "Cherry Leaf Roll Virus"
    ],
    CropFamily.ANACARDIACEAE: [
        # Mango, Cashew, Pistachio
        "Anthracnose (Colletotrichum gloeosporioides)", "Powdery Mildew (Oidium mangiferae)",
        "Bacterial Black Spot (Xanthomonas campestris)", "Verticillium Wilt",
        "Root Rot (Phytophthora, Armillaria)", "Sooty Mold",
        "Mango Malformation", "Stem End Rot", "Dieback (Lasiodiplodia theobromae)",
        "Alternaria Leaf Spot", "Cercospora Leaf Spot", "Red Rust",
        "Cashew Gummosis", "Pistachio Verticillium Wilt", "Botryosphaeria Panicle and Shoot Blight",
        "Septoria Leaf Spot", "Phytophthora Blight", "Bacterial Canker"
    ],
    CropFamily.LAMIACEAE: [
        # Basil, Mint, Oregano, Thyme, Sage, Rosemary, Lavender, Lemon Balm
        "Powdery Mildew (Erysiphe spp.)", "Downy Mildew (Peronospora belbahrii)",
        "Root Rot (Rhizoctonia, Pythium, Fusarium)", "Fusarium Wilt",
        "Botrytis Gray Mold", "Bacterial Leaf Spot (Pseudomonas cichorii)",
        "Cercospora Leaf Spot", "Septoria Leaf Spot", "Alternaria Leaf Spot",
        "Damping Off", "Crown and Stem Rot", "Southern Blight",
        "Verticillium Wilt", "Anthracnose", "Rust (Puccinia menthae)",
        "Mint Rust", "Basil Mosaic Virus", "Alfalfa Mosaic Virus"
    ],
    CropFamily.POACEAE: [
        # Corn, Wheat, Rice, Oats, Barley, Rye, Millet, Sorghum, All Grains
        "Corn Smut (Ustilago maydis)", "Northern Corn Leaf Blight (Exserohilum turcicum)",
        "Southern Corn Leaf Blight (Bipolaris maydis)", "Gray Leaf Spot",
        "Common Rust (Puccinia sorghi)", "Southern Rust", "Anthracnose",
        "Fusarium Ear Rot", "Gibberella Ear Rot", "Diplodia Ear Rot",
        "Aspergillus Ear Rot", "Goss's Bacterial Wilt", "Stewart's Wilt",
        "Maize Dwarf Mosaic Virus", "Wheat Rust (Stem, Leaf, Stripe)",
        "Wheat Scab (Fusarium Head Blight)", "Powdery Mildew", "Septoria Tritici Blotch",
        "Tan Spot", "Barley Yellow Dwarf Virus", "Take-All (Gaeumannomyces graminis)",
        "Rice Blast (Magnaporthe oryzae)", "Bacterial Leaf Blight", "Sheath Blight",
        "Brown Spot", "Bakanae Disease", "False Smut", "Tungro Virus"
    ],
    CropFamily.MUSACEAE: [
        # Bananas, Plantains
        "Panama Disease (Fusarium Wilt TR4)", "Black Sigatoka (Mycosphaerella fijiensis)",
        "Yellow Sigatoka", "Banana Bunchy Top Virus", "Banana Streak Virus",
        "Moko Disease (Bacterial Wilt)", "Anthracnose", "Crown Rot",
        "Cigar End Rot", "Finger Rot", "Freckle", "Cordana Leaf Spot"
    ],
    CropFamily.LAURACEAE: [
        # Avocado
        "Phytophthora Root Rot (Phytophthora cinnamomi)", "Laurel Wilt (Raffaelea lauricola)",
        "Anthracnose (Colletotrichum gloeosporioides)", "Cercospora Spot",
        "Stem End Rot", "Body Rot", "Dothiorella Canker", "Verticillium Wilt",
        "Avocado Sunblotch Viroid", "Armillaria Root Rot"
    ],
    CropFamily.PROTEACEAE: [
        # Macadamia
        "Phytophthora Root Rot", "Husk Spot (Pseudocercospora macadamiae)",
        "Anthracnose", "Raceme Blight", "Trunk Canker", "Botrytis Blossom Blight"
    ],
}

# Companion planting by family
FAMILY_COMPANIONS: Dict[CropFamily, Dict[str, List[CropFamily]]] = {
    CropFamily.SOLANACEAE: {
        "good": [CropFamily.ALLIACEAE, CropFamily.LAMIACEAE, CropFamily.APIACEAE],
        "avoid": [CropFamily.BRASSICACEAE, CropFamily.FABACEAE]
    },
    CropFamily.BRASSICACEAE: {
        "good": [CropFamily.ALLIACEAE, CropFamily.ASTERACEAE, CropFamily.APIACEAE],
        "avoid": [CropFamily.SOLANACEAE, CropFamily.CUCURBITACEAE]
    },
    CropFamily.CUCURBITACEAE: {
        "good": [CropFamily.FABACEAE, CropFamily.POACEAE, CropFamily.ALLIACEAE],
        "avoid": [CropFamily.SOLANACEAE]
    },
    CropFamily.FABACEAE: {
        "good": [CropFamily.CUCURBITACEAE, CropFamily.POACEAE, CropFamily.APIACEAE],
        "avoid": [CropFamily.ALLIACEAE]
    },
    CropFamily.APIACEAE: {
        "good": [CropFamily.SOLANACEAE, CropFamily.FABACEAE, CropFamily.ALLIACEAE],
        "avoid": []
    },
    CropFamily.ALLIACEAE: {
        "good": [CropFamily.SOLANACEAE, CropFamily.BRASSICACEAE, CropFamily.ASTERACEAE],
        "avoid": [CropFamily.FABACEAE]
    },
}

def get_crop_family(crop_name: str) -> CropFamily:
    """Get the botanical family for a crop"""
    return CROP_FAMILIES.get(crop_name.lower().replace(" ", "_"), None)

def get_family_diseases(family: CropFamily) -> List[str]:
    """Get common diseases for a crop family"""
    return FAMILY_DISEASES.get(family, [])

def get_companion_recommendations(family: CropFamily) -> Dict[str, List[CropFamily]]:
    """Get companion planting recommendations for a family"""
    return FAMILY_COMPANIONS.get(family, {"good": [], "avoid": []})
