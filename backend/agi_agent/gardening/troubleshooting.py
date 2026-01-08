"""
Expert Tips and Troubleshooting Database
Problem identification, solutions, and prevention strategies
"""

from typing import List, Dict, Optional
from .crop_families import CropFamily, CROP_FAMILIES


# Comprehensive troubleshooting database
TROUBLESHOOTING_DATABASE = {
    # TOMATO PROBLEMS
    "tomato": {
        "blossom_end_rot": {
            "symptoms": "Dark, sunken spots on bottom of fruit",
            "cause": "Calcium deficiency due to inconsistent watering",
            "solution": "Water consistently (1-2 inches per week). Mulch to retain moisture. Add calcium (crushed eggshells or lime).",
            "prevention": "Maintain consistent soil moisture. Avoid over-fertilizing with nitrogen."
        },
        "cracking": {
            "symptoms": "Fruits split open, often in concentric circles",
            "cause": "Irregular watering - dry period followed by heavy watering",
            "solution": "Harvest cracked fruits immediately. Improve watering consistency.",
            "prevention": "Water deeply and regularly. Mulch heavily. Choose crack-resistant varieties."
        },
        "hornworms": {
            "symptoms": "Large green caterpillars, defoliation, black droppings",
            "cause": "Tomato hornworm larvae",
            "solution": "Hand-pick and destroy. Look for white cocoons (parasitic wasps - leave them!). Use Bt spray if severe.",
            "prevention": "Check plants daily. Encourage beneficial wasps. Till soil in fall to destroy pupae."
        },
        "early_blight": {
            "symptoms": "Brown spots with concentric rings on lower leaves",
            "cause": "Fungal disease, spreads in wet conditions",
            "solution": "Remove affected leaves. Apply copper fungicide. Improve air circulation.",
            "prevention": "Mulch to prevent soil splash. Water at base. Rotate crops. Choose resistant varieties."
        },
        "leaf_curl": {
            "symptoms": "Leaves curl upward, plant looks stressed",
            "cause": "Often environmental stress (heat, inconsistent watering)",
            "solution": "Ensure consistent watering. Provide shade in extreme heat. Check for aphids.",
            "prevention": "Maintain consistent care. Mulch well. Choose heat-tolerant varieties."
        }
    },
    
    # PEPPER PROBLEMS
    "pepper": {
        "blossom_drop": {
            "symptoms": "Flowers fall off without setting fruit",
            "cause": "Temperature stress (too hot >90°F or too cold <60°F)",
            "solution": "Provide shade in extreme heat. Be patient - will set fruit when temps moderate.",
            "prevention": "Choose heat-tolerant varieties. Provide afternoon shade in hot climates."
        },
        "sunscald": {
            "symptoms": "White, papery patches on fruits",
            "cause": "Direct sun exposure on fruits",
            "solution": "Harvest affected fruits. Leave more foliage for shade.",
            "prevention": "Don't over-prune. Provide shade cloth in extreme heat."
        },
        "aphids": {
            "symptoms": "Tiny insects on new growth, sticky residue, curled leaves",
            "cause": "Aphid infestation",
            "solution": "Spray with water. Apply insecticidal soap. Release ladybugs.",
            "prevention": "Encourage beneficial insects. Avoid over-fertilizing (attracts aphids)."
        }
    },
    
    # LETTUCE PROBLEMS
    "lettuce": {
        "bolting": {
            "symptoms": "Plant sends up flower stalk, leaves turn bitter",
            "cause": "Heat stress, long days",
            "solution": "Harvest immediately. Plant heat-tolerant varieties for summer.",
            "prevention": "Plant in cool seasons. Provide shade in warm weather. Choose slow-bolt varieties."
        },
        "tip_burn": {
            "symptoms": "Brown, crispy leaf edges",
            "cause": "Calcium deficiency, inconsistent watering, heat stress",
            "solution": "Improve watering consistency. Ensure good air circulation.",
            "prevention": "Water regularly. Don't overcrowd plants. Add calcium to soil."
        },
        "slugs": {
            "symptoms": "Irregular holes in leaves, slime trails",
            "cause": "Slug damage",
            "solution": "Hand-pick at night. Use beer traps. Apply diatomaceous earth around plants.",
            "prevention": "Remove debris. Water in morning. Use copper barriers."
        }
    },
    
    # CUCUMBER PROBLEMS
    "cucumber": {
        "bitter_cucumbers": {
            "symptoms": "Cucumbers taste bitter",
            "cause": "Stress from inconsistent watering, heat, or poor nutrition",
            "solution": "Improve watering consistency. Ensure adequate fertilization.",
            "prevention": "Water deeply and regularly. Mulch well. Choose modern varieties (less bitter)."
        },
        "powdery_mildew": {
            "symptoms": "White powdery coating on leaves",
            "cause": "Fungal disease, common in humid conditions",
            "solution": "Remove affected leaves. Spray with milk solution (1:9 milk:water). Apply sulfur fungicide.",
            "prevention": "Provide good air circulation. Water at base. Choose resistant varieties."
        },
        "cucumber_beetles": {
            "symptoms": "Yellow/green striped beetles, holes in leaves, wilting",
            "cause": "Cucumber beetle feeding and disease transmission",
            "solution": "Hand-pick beetles. Use row covers until flowering. Apply neem oil.",
            "prevention": "Use row covers. Plant trap crops. Rotate crops annually."
        },
        "poor_pollination": {
            "symptoms": "Fruits abort or develop poorly",
            "cause": "Lack of pollinators or male flowers",
            "solution": "Hand-pollinate flowers. Encourage bees with nearby flowers.",
            "prevention": "Plant pollinator-friendly flowers. Avoid pesticides during flowering."
        }
    },
    
    # SQUASH PROBLEMS
    "squash": {
        "squash_bugs": {
            "symptoms": "Brown shield-shaped bugs, wilting leaves, eggs on undersides",
            "cause": "Squash bug infestation",
            "solution": "Hand-pick bugs and eggs daily. Trap under boards. Use insecticidal soap.",
            "prevention": "Check daily. Remove eggs immediately. Use row covers early season."
        },
        "vine_borers": {
            "symptoms": "Sudden wilting, sawdust-like frass at stem base",
            "cause": "Squash vine borer larvae inside stem",
            "solution": "Slit stem, remove borer, bury stem to re-root. Inject Bt into stem.",
            "prevention": "Use row covers until flowering. Wrap stem bases with foil. Plant succession crops."
        },
        "blossom_end_rot": {
            "symptoms": "Dark, sunken spots on blossom end of fruit",
            "cause": "Calcium deficiency, inconsistent watering",
            "solution": "Water consistently. Add calcium. Remove affected fruits.",
            "prevention": "Maintain even soil moisture. Mulch heavily. Test soil pH."
        }
    },
    
    # BEAN PROBLEMS
    "beans": {
        "no_pods": {
            "symptoms": "Flowers but no pod development",
            "cause": "Too much nitrogen, heat stress, or poor pollination",
            "solution": "Reduce nitrogen fertilizer. Wait for cooler weather. Ensure pollinators present.",
            "prevention": "Avoid high-nitrogen fertilizers. Plant in appropriate season."
        },
        "rust": {
            "symptoms": "Orange-brown pustules on leaves",
            "cause": "Fungal disease, spreads in wet conditions",
            "solution": "Remove affected leaves. Avoid overhead watering. Apply sulfur fungicide.",
            "prevention": "Water at base. Provide good air circulation. Rotate crops."
        },
        "mexican_bean_beetles": {
            "symptoms": "Copper-colored beetles, skeletonized leaves",
            "cause": "Mexican bean beetle feeding",
            "solution": "Hand-pick beetles and larvae. Apply neem oil. Use row covers.",
            "prevention": "Check undersides of leaves. Plant early to avoid peak populations."
        }
    },
    
    # CARROT PROBLEMS
    "carrot": {
        "forked_roots": {
            "symptoms": "Carrots split into multiple roots",
            "cause": "Rocks, hard soil, or fresh manure",
            "solution": "Harvest and use. Improve soil for next planting.",
            "prevention": "Remove rocks. Use well-aged compost. Loosen soil deeply."
        },
        "hairy_roots": {
            "symptoms": "Excessive fine roots on carrot",
            "cause": "Too much nitrogen fertilizer",
            "solution": "Harvest and use. Reduce fertilizer next time.",
            "prevention": "Avoid high-nitrogen fertilizers. Use aged compost only."
        },
        "carrot_rust_fly": {
            "symptoms": "Tunnels in roots, stunted growth",
            "cause": "Carrot rust fly larvae",
            "solution": "Harvest early. Use row covers for next planting.",
            "prevention": "Use row covers. Rotate planting location. Plant in late spring."
        }
    },
    
    # BROCCOLI/CAULIFLOWER
    "broccoli": {
        "small_heads": {
            "symptoms": "Heads remain small, button prematurely",
            "cause": "Heat stress, inconsistent watering, or transplant shock",
            "solution": "Harvest small heads. Plant earlier next time for cool weather.",
            "prevention": "Plant in cool season. Provide consistent water. Transplant carefully."
        },
        "hollow_stems": {
            "symptoms": "Stems are hollow inside",
            "cause": "Boron deficiency or rapid growth",
            "solution": "Add borax (1 tbsp per 100 sq ft). Harvest and use.",
            "prevention": "Test soil. Add compost. Avoid over-fertilizing."
        },
        "cabbage_worms": {
            "symptoms": "Green caterpillars, holes in leaves and heads",
            "cause": "Cabbage worm larvae",
            "solution": "Hand-pick. Apply Bt spray. Use row covers.",
            "prevention": "Use row covers from planting. Check daily for eggs on undersides."
        }
    },
    
    "cauliflower": {
        "purple_heads": {
            "symptoms": "Heads turn purple instead of white",
            "cause": "Sun exposure or cold stress",
            "solution": "Harvest and use - still edible. Tie leaves over head next time.",
            "prevention": "Blanch heads by tying outer leaves over developing head."
        },
        "loose_curds": {
            "symptoms": "Head doesn't form tight, compact curds",
            "cause": "Temperature stress or inconsistent watering",
            "solution": "Harvest and use. Improve growing conditions.",
            "prevention": "Plant in cool season. Water consistently. Choose heat-tolerant varieties."
        }
    },
    
    # MELONS
    "melon": {
        "poor_fruit_set": {
            "symptoms": "Flowers but no fruit development",
            "cause": "Poor pollination or only male flowers",
            "solution": "Hand-pollinate. Be patient - female flowers come later.",
            "prevention": "Plant pollinator flowers nearby. Avoid pesticides during flowering."
        },
        "cracking": {
            "symptoms": "Melons split open",
            "cause": "Irregular watering, especially near ripening",
            "solution": "Harvest cracked melons immediately. Improve watering consistency.",
            "prevention": "Reduce watering as melons ripen. Maintain consistent moisture."
        },
        "lack_of_sweetness": {
            "symptoms": "Melons taste bland",
            "cause": "Harvested too early, insufficient sun, or overwatering",
            "solution": "Let melons ripen longer. Check for slip (stem separates easily).",
            "prevention": "Wait for full ripeness. Reduce water as fruit ripens. Ensure full sun."
        }
    },
    
    # STRAWBERRIES
    "strawberry": {
        "gray_mold": {
            "symptoms": "Gray fuzzy mold on berries",
            "cause": "Botrytis fungus in wet conditions",
            "solution": "Remove affected berries. Improve air circulation. Apply fungicide.",
            "prevention": "Mulch with straw. Water at base. Space plants properly."
        },
        "no_fruit": {
            "symptoms": "Plants grow but don't produce berries",
            "cause": "Too much nitrogen, wrong variety for climate, or too young",
            "solution": "Reduce nitrogen. Ensure variety matches climate. Be patient with June-bearers.",
            "prevention": "Use balanced fertilizer. Choose appropriate variety. First year plants produce lightly."
        }
    },
    
    # RASPBERRIES/BLACKBERRIES
    "raspberry": {
        "crumbly_berries": {
            "symptoms": "Berries fall apart when picked",
            "cause": "Virus infection or stink bug damage",
            "solution": "Remove infected canes. Control stink bugs.",
            "prevention": "Buy certified disease-free plants. Monitor for stink bugs."
        },
        "cane_blight": {
            "symptoms": "Canes die back, purple lesions",
            "cause": "Fungal disease entering through wounds",
            "solution": "Prune out infected canes. Sterilize pruners between cuts.",
            "prevention": "Prune carefully. Remove old canes after fruiting. Improve air circulation."
        }
    },
    
    # CORN
    "corn": {
        "poor_pollination": {
            "symptoms": "Ears with missing kernels",
            "cause": "Poor pollination from wind or heat",
            "solution": "Hand-pollinate remaining ears. Plant in blocks next time.",
            "prevention": "Plant in blocks (4x4 minimum) not rows. Shake tassels to distribute pollen."
        },
        "corn_earworms": {
            "symptoms": "Worms in ear tips, damaged kernels",
            "cause": "Corn earworm larvae",
            "solution": "Cut off damaged tips. Apply mineral oil to silk. Use Bt.",
            "prevention": "Apply drops of mineral oil to silk after pollination. Plant early varieties."
        }
    },
    
    # POTATOES
    "potato": {
        "scab": {
            "symptoms": "Rough, corky patches on skin",
            "cause": "Bacterial disease in alkaline soil",
            "solution": "Harvest and use - still edible. Peel before cooking.",
            "prevention": "Lower soil pH to 5.0-5.5. Avoid fresh manure. Rotate crops."
        },
        "hollow_heart": {
            "symptoms": "Hollow cavity in center of tuber",
            "cause": "Rapid growth from excess water/fertilizer",
            "solution": "Harvest and use - still edible.",
            "prevention": "Avoid over-fertilizing. Water consistently, not excessively."
        },
        "colorado_potato_beetles": {
            "symptoms": "Orange and black striped beetles, defoliation",
            "cause": "Colorado potato beetle infestation",
            "solution": "Hand-pick beetles and larvae. Apply neem oil. Use row covers.",
            "prevention": "Mulch heavily. Check daily. Rotate planting location."
        }
    },
    
    # BEETS
    "beet": {
        "poor_germination": {
            "symptoms": "Seeds don't sprout well",
            "cause": "Soil crust, old seeds, or cold soil",
            "solution": "Keep soil moist. Cover with vermiculite instead of soil.",
            "prevention": "Soak seeds overnight. Keep soil moist. Plant when soil is 50°F+."
        },
        "zoning": {
            "symptoms": "White rings inside beet",
            "cause": "Temperature fluctuations during growth",
            "solution": "Harvest and use - still edible.",
            "prevention": "Plant in stable weather. Mulch to moderate soil temperature."
        }
    },
    
    # PEAS
    "peas": {
        "powdery_mildew": {
            "symptoms": "White powder on leaves, especially late season",
            "cause": "Fungal disease in warm, humid conditions",
            "solution": "Harvest remaining peas. Remove plants. Plant earlier next year.",
            "prevention": "Plant early for cool weather. Choose resistant varieties. Provide air circulation."
        },
        "pea_weevils": {
            "symptoms": "Round holes in peas, small beetles",
            "cause": "Pea weevil damage",
            "solution": "Harvest early. Freeze peas to kill larvae.",
            "prevention": "Plant early. Use row covers. Till soil in fall."
        }
    },
    
    # SPINACH
    "spinach": {
        "bolting": {
            "symptoms": "Sends up flower stalk, leaves turn bitter",
            "cause": "Heat and long days",
            "solution": "Harvest immediately. Plant heat-tolerant varieties for summer.",
            "prevention": "Plant in cool seasons. Provide shade in warm weather. Choose slow-bolt varieties."
        },
        "leaf_miners": {
            "symptoms": "Squiggly trails in leaves",
            "cause": "Leaf miner larvae tunneling in leaves",
            "solution": "Remove affected leaves. Use row covers.",
            "prevention": "Use row covers from planting. Remove affected leaves promptly."
        }
    },
    
    # GARLIC/ONIONS (additional)
    "garlic": {
        "small_bulbs": {
            "symptoms": "Bulbs remain small",
            "cause": "Planted too late, harvested too early, or poor soil",
            "solution": "Harvest and use. Plant earlier next fall.",
            "prevention": "Plant in October. Fertilize in spring. Harvest when half the leaves are brown."
        },
        "rust": {
            "symptoms": "Orange pustules on leaves",
            "cause": "Fungal disease in wet conditions",
            "solution": "Remove affected leaves. Improve air circulation.",
            "prevention": "Space properly. Avoid overhead watering. Choose resistant varieties."
        }
    },
    
    # HERBS
    "herbs": {
        "leggy_growth": {
            "symptoms": "Tall, spindly stems with few leaves",
            "cause": "Insufficient light or not pinching back",
            "solution": "Pinch back growing tips. Move to sunnier location.",
            "prevention": "Provide full sun. Pinch tips regularly. Harvest frequently."
        },
        "flowering": {
            "symptoms": "Plants send up flower stalks",
            "cause": "Natural lifecycle or stress",
            "solution": "Pinch off flowers immediately for basil. Let other herbs flower.",
            "prevention": "Pinch basil flowers immediately. Other herbs can flower (attracts pollinators)."
        }
    },
    
    # GENERAL PROBLEMS
    "general": {
        "damping_off": {
            "symptoms": "Seedlings collapse at soil line",
            "cause": "Fungal disease in overly wet, cool conditions",
            "solution": "Remove affected seedlings. Improve air circulation. Reduce watering.",
            "prevention": "Use sterile seed-starting mix. Don't overwater. Provide good air flow."
        },
        "nutrient_deficiency": {
            "symptoms": "Yellowing leaves, poor growth, purple tints",
            "cause": "Lack of nitrogen, phosphorus, or other nutrients",
            "solution": "Apply balanced fertilizer. Test soil to identify specific deficiency.",
            "prevention": "Add compost regularly. Test soil annually. Fertilize as needed."
        },
        "overwatering": {
            "symptoms": "Yellowing leaves, wilting despite wet soil, root rot",
            "cause": "Too much water, poor drainage",
            "solution": "Reduce watering. Improve drainage. Check for root rot.",
            "prevention": "Water only when top inch of soil is dry. Ensure good drainage."
        },
        "underwatering": {
            "symptoms": "Wilting, dry soil, crispy leaf edges",
            "cause": "Insufficient water",
            "solution": "Water deeply. Mulch to retain moisture.",
            "prevention": "Water regularly (1-2 inches per week). Mulch heavily. Check soil moisture daily."
        }
    }
}


# Common mistakes database
COMMON_MISTAKES = {
    "planting_too_early": {
        "mistake": "Planting warm-season crops before soil warms",
        "consequence": "Poor germination, stunted growth, disease susceptibility",
        "solution": "Wait until soil reaches 60-70°F. Use soil thermometer.",
        "tip": "Be patient! Crops planted at the right time will catch up and surpass early plantings."
    },
    "overcrowding": {
        "mistake": "Planting too close together",
        "consequence": "Poor air circulation, disease, reduced yields, competition",
        "solution": "Thin seedlings to proper spacing. Follow seed packet recommendations.",
        "tip": "It's hard to thin, but proper spacing = healthier plants and better harvests."
    },
    "inconsistent_watering": {
        "mistake": "Watering irregularly - too much then too little",
        "consequence": "Blossom end rot, cracking, stress, poor fruit development",
        "solution": "Water deeply 1-2 times per week. Mulch to retain moisture.",
        "tip": "Consistent watering is more important than frequent watering."
    },
    "over_fertilizing": {
        "mistake": "Too much fertilizer, especially nitrogen",
        "consequence": "Lush foliage but no fruit, salt buildup, pest attraction",
        "solution": "Follow fertilizer directions. Use compost instead of synthetic fertilizers.",
        "tip": "More is not better! Over-fertilizing causes more problems than under-fertilizing."
    },
    "ignoring_pests": {
        "mistake": "Not checking plants regularly for pests",
        "consequence": "Pest populations explode, severe damage, disease transmission",
        "solution": "Check plants daily. Remove pests by hand. Act quickly.",
        "tip": "5 minutes of daily scouting prevents hours of pest management later."
    },
    "poor_soil_prep": {
        "mistake": "Planting in unprepared, compacted, or poor soil",
        "consequence": "Poor root development, nutrient deficiencies, drainage issues",
        "solution": "Add 2-4 inches of compost. Loosen soil. Test pH.",
        "tip": "Great soil = great garden. Invest time in soil preparation."
    },
    "no_crop_rotation": {
        "mistake": "Planting same crops in same spot year after year",
        "consequence": "Disease buildup, pest problems, nutrient depletion",
        "solution": "Rotate crop families. Wait 2-3 years before replanting same family.",
        "tip": "Rotation is your best defense against disease and pests."
    },
    "harvesting_too_late": {
        "mistake": "Letting produce over-ripen on plant",
        "consequence": "Reduced production, poor quality, pest attraction",
        "solution": "Harvest regularly at peak ripeness.",
        "tip": "Frequent harvesting encourages more production!"
    },
    "not_hardening_off": {
        "mistake": "Transplanting seedlings directly from indoors to garden",
        "consequence": "Transplant shock, sunburn, stunted growth, death",
        "solution": "Gradually acclimate plants over 7-10 days.",
        "tip": "Hardening off is crucial! Start with 1 hour outside, increase daily."
    },
    "wrong_variety_for_climate": {
        "mistake": "Planting varieties not suited to your climate",
        "consequence": "Poor growth, no fruit set, disease susceptibility",
        "solution": "Choose varieties rated for your hardiness zone and day length.",
        "tip": "Check seed packets for 'days to maturity' - ensure it fits your growing season."
    },
    "planting_in_same_spot": {
        "mistake": "Not rotating crops or planting same family repeatedly",
        "consequence": "Disease buildup, pest problems, soil depletion",
        "solution": "Rotate crop families. Wait 2-3 years before replanting same family.",
        "tip": "Keep a garden map! Track what you planted where each year."
    }
}


def get_crop_family_from_name(crop: str) -> Optional[str]:
    """Get crop family for troubleshooting purposes"""
    from .crop_families import CROP_FAMILIES, CropFamily
    crop_key = crop.lower().replace(" ", "_")
    family = CROP_FAMILIES.get(crop_key)
    if family:
        return family.value
    return None


# Family-based troubleshooting (applies to all crops in family)
FAMILY_TROUBLESHOOTING = {
    "Nightshades": {
        "blossom_end_rot": {
            "symptoms": "Dark, sunken spots on bottom of fruit",
            "cause": "Calcium deficiency due to inconsistent watering",
            "solution": "Water consistently. Mulch to retain moisture. Add calcium.",
            "prevention": "Maintain consistent soil moisture. Avoid over-fertilizing with nitrogen."
        },
        "early_blight": {
            "symptoms": "Brown spots with concentric rings on lower leaves",
            "cause": "Fungal disease, spreads in wet conditions",
            "solution": "Remove affected leaves. Apply copper fungicide. Improve air circulation.",
            "prevention": "Mulch to prevent soil splash. Water at base. Rotate crops."
        },
        "aphids": {
            "symptoms": "Tiny insects on new growth, sticky residue",
            "cause": "Aphid infestation",
            "solution": "Spray with water. Apply insecticidal soap. Release ladybugs.",
            "prevention": "Encourage beneficial insects. Avoid over-fertilizing."
        }
    },
    "Brassicas": {
        "cabbage_worms": {
            "symptoms": "Green caterpillars, holes in leaves",
            "cause": "Cabbage worm larvae",
            "solution": "Hand-pick. Apply Bt spray. Use row covers.",
            "prevention": "Use row covers from planting. Check daily for eggs."
        },
        "clubroot": {
            "symptoms": "Swollen, distorted roots, stunted growth",
            "cause": "Soil-borne disease, persists for years",
            "solution": "Remove and destroy plants. Don't compost. Lime soil to pH 7.2.",
            "prevention": "Rotate crops. Test soil. Choose resistant varieties."
        },
        "flea_beetles": {
            "symptoms": "Tiny holes in leaves, small jumping beetles",
            "cause": "Flea beetle feeding",
            "solution": "Use row covers. Apply neem oil. Trap with sticky traps.",
            "prevention": "Use row covers. Plant later to avoid peak populations."
        }
    },
    "Cucurbits": {
        "powdery_mildew": {
            "symptoms": "White powdery coating on leaves",
            "cause": "Fungal disease in humid conditions",
            "solution": "Remove affected leaves. Spray with milk solution. Apply sulfur.",
            "prevention": "Provide good air circulation. Water at base. Choose resistant varieties."
        },
        "cucumber_beetles": {
            "symptoms": "Yellow/green striped beetles, wilting",
            "cause": "Cucumber beetle feeding and disease transmission",
            "solution": "Hand-pick beetles. Use row covers. Apply neem oil.",
            "prevention": "Use row covers. Plant trap crops. Rotate crops."
        },
        "poor_pollination": {
            "symptoms": "Fruits abort or develop poorly",
            "cause": "Lack of pollinators",
            "solution": "Hand-pollinate flowers. Encourage bees.",
            "prevention": "Plant pollinator flowers. Avoid pesticides during flowering."
        }
    },
    "Legumes": {
        "rust": {
            "symptoms": "Orange-brown pustules on leaves",
            "cause": "Fungal disease in wet conditions",
            "solution": "Remove affected leaves. Avoid overhead watering. Apply sulfur.",
            "prevention": "Water at base. Provide good air circulation. Rotate crops."
        },
        "mexican_bean_beetles": {
            "symptoms": "Copper-colored beetles, skeletonized leaves",
            "cause": "Mexican bean beetle feeding",
            "solution": "Hand-pick beetles and larvae. Apply neem oil.",
            "prevention": "Check undersides of leaves. Plant early."
        },
        "no_pods": {
            "symptoms": "Flowers but no pod development",
            "cause": "Too much nitrogen or heat stress",
            "solution": "Reduce nitrogen. Wait for cooler weather.",
            "prevention": "Avoid high-nitrogen fertilizers. Plant in appropriate season."
        }
    },
    "Alliums": {
        "thrips": {
            "symptoms": "Silver streaks on leaves, distorted growth",
            "cause": "Thrips feeding",
            "solution": "Spray with water. Apply insecticidal soap. Use reflective mulch.",
            "prevention": "Remove debris. Use row covers. Encourage predators."
        },
        "white_rot": {
            "symptoms": "White fungal growth at base, yellowing leaves",
            "cause": "Soil-borne fungal disease",
            "solution": "Remove and destroy plants. Don't plant alliums there for 8+ years.",
            "prevention": "Rotate crops. Avoid overhead watering. Use disease-free sets."
        },
        "small_bulbs": {
            "symptoms": "Bulbs remain small",
            "cause": "Planted too late, poor soil, or harvested too early",
            "solution": "Harvest and use. Plant earlier next time.",
            "prevention": "Plant at correct time. Fertilize regularly. Harvest when tops fall."
        }
    },
    "Umbellifers": {
        "carrot_rust_fly": {
            "symptoms": "Tunnels in roots, stunted growth",
            "cause": "Carrot rust fly larvae",
            "solution": "Harvest early. Use row covers for next planting.",
            "prevention": "Use row covers. Rotate location. Plant in late spring."
        },
        "forked_roots": {
            "symptoms": "Roots split into multiple parts",
            "cause": "Rocks, hard soil, or fresh manure",
            "solution": "Harvest and use. Improve soil for next planting.",
            "prevention": "Remove rocks. Use well-aged compost. Loosen soil deeply."
        },
        "leaf_blight": {
            "symptoms": "Brown spots on leaves, yellowing",
            "cause": "Fungal disease in wet conditions",
            "solution": "Remove affected leaves. Improve air circulation.",
            "prevention": "Space properly. Water at base. Rotate crops."
        }
    },
    "Composites": {
        "bolting": {
            "symptoms": "Sends up flower stalk, leaves turn bitter",
            "cause": "Heat stress, long days",
            "solution": "Harvest immediately. Plant heat-tolerant varieties.",
            "prevention": "Plant in cool seasons. Provide shade. Choose slow-bolt varieties."
        },
        "tip_burn": {
            "symptoms": "Brown, crispy leaf edges",
            "cause": "Calcium deficiency, inconsistent watering",
            "solution": "Improve watering consistency. Ensure good air circulation.",
            "prevention": "Water regularly. Don't overcrowd. Add calcium to soil."
        },
        "aphids": {
            "symptoms": "Tiny insects, sticky residue",
            "cause": "Aphid infestation",
            "solution": "Spray with water. Apply insecticidal soap.",
            "prevention": "Encourage beneficial insects. Avoid over-fertilizing."
        }
    },
    "Chenopods": {
        "leaf_miners": {
            "symptoms": "Squiggly trails in leaves",
            "cause": "Leaf miner larvae tunneling",
            "solution": "Remove affected leaves. Use row covers.",
            "prevention": "Use row covers from planting. Remove affected leaves promptly."
        },
        "bolting": {
            "symptoms": "Sends up flower stalk",
            "cause": "Heat stress or long days",
            "solution": "Harvest immediately.",
            "prevention": "Plant in cool season. Choose slow-bolt varieties."
        },
        "poor_germination": {
            "symptoms": "Seeds don't sprout well",
            "cause": "Soil crust or old seeds",
            "solution": "Keep soil moist. Cover with vermiculite.",
            "prevention": "Soak seeds overnight. Keep soil moist."
        }
    },
    "Grasses": {
        "corn_earworms": {
            "symptoms": "Worms in ears, damaged kernels",
            "cause": "Corn earworm larvae",
            "solution": "Cut off damaged tips. Apply mineral oil to silk.",
            "prevention": "Apply mineral oil after pollination. Plant early varieties."
        },
        "smut": {
            "symptoms": "Large gray galls on ears or tassels",
            "cause": "Fungal disease",
            "solution": "Remove and destroy galls before they open.",
            "prevention": "Rotate crops. Remove infected plants. Choose resistant varieties."
        },
        "poor_pollination": {
            "symptoms": "Ears with missing kernels",
            "cause": "Poor wind pollination",
            "solution": "Hand-pollinate remaining ears.",
            "prevention": "Plant in blocks (4x4 minimum) not rows."
        }
    },
    "Rose Family": {
        "gray_mold": {
            "symptoms": "Gray fuzzy mold on fruit",
            "cause": "Botrytis fungus in wet conditions",
            "solution": "Remove affected fruit. Improve air circulation.",
            "prevention": "Mulch with straw. Water at base. Space properly."
        },
        "japanese_beetles": {
            "symptoms": "Skeletonized leaves, beetles present",
            "cause": "Japanese beetle feeding",
            "solution": "Hand-pick beetles. Use traps away from plants.",
            "prevention": "Check daily. Use row covers. Treat lawn for grubs."
        },
        "fire_blight": {
            "symptoms": "Blackened, scorched-looking branches",
            "cause": "Bacterial disease",
            "solution": "Prune 12 inches below infection. Sterilize pruners.",
            "prevention": "Avoid over-fertilizing. Choose resistant varieties."
        }
    },
    "Mint Family": {
        "powdery_mildew": {
            "symptoms": "White powder on leaves",
            "cause": "Fungal disease in humid conditions",
            "solution": "Improve air circulation. Remove affected leaves.",
            "prevention": "Space properly. Water at base. Prune regularly."
        },
        "leggy_growth": {
            "symptoms": "Tall, spindly stems with few leaves",
            "cause": "Insufficient light or not pinching back",
            "solution": "Pinch back growing tips. Move to sunnier location.",
            "prevention": "Provide full sun. Pinch tips regularly. Harvest frequently."
        },
        "root_rot": {
            "symptoms": "Wilting despite wet soil, brown roots",
            "cause": "Overwatering, poor drainage",
            "solution": "Reduce watering. Improve drainage. May need to replant.",
            "prevention": "Ensure good drainage. Don't overwater."
        }
    }
}


def get_troubleshooting_info(crop: str, problem: str) -> Optional[Dict]:
    """Get troubleshooting information for a specific crop problem"""
    crop_key = crop.lower().replace(" ", "_")
    
    # First check crop-specific problems
    crop_problems = TROUBLESHOOTING_DATABASE.get(crop_key, {})
    specific_problem = crop_problems.get(problem.lower().replace(" ", "_"))
    if specific_problem:
        return specific_problem
    
    # Fall back to family-based problems
    family = get_crop_family_from_name(crop)
    if family and family in FAMILY_TROUBLESHOOTING:
        family_problems = FAMILY_TROUBLESHOOTING[family]
        return family_problems.get(problem.lower().replace(" ", "_"))
    
    return None


def generate_troubleshooting_guide(crops: List[str]) -> str:
    """
    Generate troubleshooting guide for selected crops.
    Uses both crop-specific and family-based troubleshooting.
    
    Args:
        crops: List of crop names
    
    Returns:
        Formatted troubleshooting guide
    """
    guide = "\n\n" + "="*70 + "\n"
    guide += "TROUBLESHOOTING GUIDE\n"
    guide += "="*70 + "\n\n"
    guide += "Common problems and solutions for your crops:\n\n"
    
    # Group crops by family for efficient display
    family_groups = {}
    for crop in crops[:8]:  # Top 8 crops
        family = get_crop_family_from_name(crop)
        if family:
            if family not in family_groups:
                family_groups[family] = []
            family_groups[family].append(crop)
    
    # Show family-based problems
    for family, family_crops in family_groups.items():
        if family in FAMILY_TROUBLESHOOTING:
            crops_list = ", ".join(family_crops)
            guide += f"**{family.upper()} ({crops_list}):**\n\n"
            
            family_problems = FAMILY_TROUBLESHOOTING[family]
            for problem_name, problem_info in list(family_problems.items())[:3]:  # Top 3 per family
                problem_title = problem_name.replace("_", " ").title()
                guide += f"**{problem_title}**\n"
                guide += f"• Symptoms: {problem_info['symptoms']}\n"
                guide += f"• Cause: {problem_info['cause']}\n"
                guide += f"• Solution: {problem_info['solution']}\n"
                guide += f"• Prevention: {problem_info['prevention']}\n\n"
            
            guide += "-"*70 + "\n\n"
    
    # Show crop-specific problems if available
    for crop in crops[:5]:
        crop_key = crop.lower().replace(" ", "_")
        if crop_key in TROUBLESHOOTING_DATABASE:
            guide += f"**{crop.upper()} - Specific Issues:**\n\n"
            problems = TROUBLESHOOTING_DATABASE[crop_key]
            
            for problem_name, problem_info in list(problems.items())[:2]:  # Top 2 specific
                problem_title = problem_name.replace("_", " ").title()
                guide += f"**{problem_title}**\n"
                guide += f"• Symptoms: {problem_info['symptoms']}\n"
                guide += f"• Solution: {problem_info['solution']}\n\n"
            
            guide += "-"*70 + "\n\n"
    
    # Add general problems
    guide += "**GENERAL GARDEN PROBLEMS:**\n\n"
    general_problems = TROUBLESHOOTING_DATABASE.get("general", {})
    for problem_name, problem_info in general_problems.items():
        problem_title = problem_name.replace("_", " ").title()
        guide += f"**{problem_title}**\n"
        guide += f"• Symptoms: {problem_info['symptoms']}\n"
        guide += f"• Solution: {problem_info['solution']}\n"
        guide += f"• Prevention: {problem_info['prevention']}\n\n"
    
    return guide


def generate_common_mistakes_guide() -> str:
    """
    Generate guide on common gardening mistakes.
    
    Returns:
        Formatted common mistakes guide
    """
    guide = "\n\n**AVOID THESE COMMON MISTAKES:**\n\n"
    
    for mistake_key, mistake_info in COMMON_MISTAKES.items():
        mistake_title = mistake_key.replace("_", " ").title()
        guide += f"**{mistake_title}**\n"
        guide += f"❌ Mistake: {mistake_info['mistake']}\n"
        guide += f"⚠️  Consequence: {mistake_info['consequence']}\n"
        guide += f"✅ Solution: {mistake_info['solution']}\n"
        guide += f"💡 Tip: {mistake_info['tip']}\n\n"
    
    return guide


def generate_expert_tips(crops: List[str]) -> str:
    """
    Generate expert tips for selected crops.
    
    Args:
        crops: List of crop names
    
    Returns:
        Formatted expert tips
    """
    tips = "\n\n**EXPERT TIPS FOR SUCCESS:**\n\n"
    
    tips += "**General Tips:**\n"
    tips += "1. **Check plants daily** - Catch problems early when they're easy to fix\n"
    tips += "2. **Water deeply, less often** - Encourages deep root growth\n"
    tips += "3. **Mulch everything** - Retains moisture, suppresses weeds, moderates soil temp\n"
    tips += "4. **Feed the soil, not the plant** - Healthy soil = healthy plants\n"
    tips += "5. **Harvest regularly** - Encourages more production\n"
    tips += "6. **Keep a garden journal** - Track what works and what doesn't\n"
    tips += "7. **Start small** - Better to succeed with a small garden than fail with a large one\n"
    tips += "8. **Be patient** - Plants grow on their schedule, not yours\n\n"
    
    tips += "**Pro Secrets:**\n"
    tips += "• Plant marigolds and nasturtiums to attract beneficial insects\n"
    tips += "• Use companion planting to naturally repel pests\n"
    tips += "• Harvest in the morning for best flavor and longest storage\n"
    tips += "• Pinch basil and herbs regularly to keep them bushy\n"
    tips += "• Remove tomato suckers for larger (but fewer) fruits\n"
    tips += "• Hand-pollinate squash flowers if you see few bees\n"
    tips += "• Bury tomato stems deep - they'll grow roots along the stem\n"
    tips += "• Use row covers to protect from pests and extend season\n\n"
    
    return tips


def generate_seasonal_tips(season: str) -> str:
    """
    Generate season-specific tips.
    
    Args:
        season: Current season (Spring, Summer, Fall, Winter)
    
    Returns:
        Formatted seasonal tips
    """
    tips = f"\n\n**{season.upper()} GARDENING TIPS:**\n\n"
    
    if season.lower() == "spring":
        tips += "• Don't rush! Wait for soil to warm before planting warm-season crops\n"
        tips += "• Start cool-season crops (lettuce, peas, broccoli) as soon as soil can be worked\n"
        tips += "• Prepare beds by adding 2-4 inches of compost\n"
        tips += "• Start tomatoes and peppers indoors 6-8 weeks before last frost\n"
        tips += "• Harden off transplants gradually before planting out\n"
        tips += "• Use row covers to protect from late frosts\n"
    
    elif season.lower() == "summer":
        tips += "• Water deeply in early morning to reduce evaporation\n"
        tips += "• Mulch heavily to retain moisture and suppress weeds\n"
        tips += "• Harvest daily to encourage continued production\n"
        tips += "• Provide shade for cool-season crops in extreme heat\n"
        tips += "• Start fall crops (broccoli, cabbage) in mid-summer\n"
        tips += "• Watch for pests - populations peak in summer\n"
    
    elif season.lower() == "fall":
        tips += "• Plant garlic in October for next summer's harvest\n"
        tips += "• Harvest winter squash before first hard frost\n"
        tips += "• Plant cover crops in empty beds\n"
        tips += "• Extend season with row covers and cold frames\n"
        tips += "• Clean up diseased plant material to prevent overwintering\n"
        tips += "• Mulch perennials after ground freezes\n"
    
    else:  # winter
        tips += "• Plan next year's garden layout and crop rotation\n"
        tips += "• Order seeds early for best selection\n"
        tips += "• Start onions and leeks indoors in late winter\n"
        tips += "• Review garden journal and plan improvements\n"
        tips += "• Maintain tools and equipment\n"
        tips += "• Start tomatoes and peppers 6-8 weeks before last frost\n"
    
    return tips
