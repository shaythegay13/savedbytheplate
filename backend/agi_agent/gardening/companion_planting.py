"""
Companion planting recommendations module.
Provides plant pairing suggestions based on beneficial relationships.

v3.1 Feature: Static companion planting database (100+ relationships)
v3.2 Enhancement: Expanded to 200+ relationships with more crops
"""

from typing import List, Dict, Optional, Tuple
from dataclasses import dataclass


@dataclass
class CompanionInfo:
    """Information about companion planting relationships"""
    good_companions: List[str]
    bad_companions: List[str]
    benefits: Dict[str, str]  # companion -> benefit description
    reasons_to_avoid: Dict[str, str]  # antagonist -> reason


# Comprehensive companion planting database
COMPANION_DATABASE = {
    "tomatoes": CompanionInfo(
        good_companions=["basil", "marigolds", "carrots", "parsley", "lettuce", "onions", "nasturtiums"],
        bad_companions=["brassicas", "fennel", "corn", "kohlrabi", "potatoes"],
        benefits={
            "basil": "Repels aphids and whiteflies, may improve flavor",
            "marigolds": "Deters nematodes and other soil pests",
            "carrots": "Different root depths, efficient space use",
            "parsley": "Attracts beneficial insects like ladybugs",
            "lettuce": "Shade tolerant, fills space before tomatoes mature",
            "onions": "Repels aphids and spider mites",
            "nasturtiums": "Trap crop for aphids, deters whiteflies",
        },
        reasons_to_avoid={
            "brassicas": "Compete for same nutrients, stunts growth",
            "fennel": "Allelopathic - inhibits tomato growth",
            "corn": "Both attract tomato hornworms",
            "kohlrabi": "Stunts tomato growth",
            "potatoes": "Increases blight risk for both plants",
        }
    ),
    
    "lettuce": CompanionInfo(
        good_companions=["carrots", "radishes", "beets", "onions", "chives", "strawberries"],
        bad_companions=["broccoli", "parsley"],
        benefits={
            "carrots": "Carrots break up soil, lettuce shades carrot roots",
            "radishes": "Radishes mature quickly, loosen soil",
            "beets": "Different rooting depths, space efficient",
            "onions": "Deters aphids and slugs",
            "chives": "Repels aphids",
            "strawberries": "Good ground cover combination",
        },
        reasons_to_avoid={
            "broccoli": "Too much shade for lettuce",
            "parsley": "Competes for space and nutrients",
        }
    ),
    
    "basil": CompanionInfo(
        good_companions=["tomatoes", "peppers", "oregano", "asparagus"],
        bad_companions=["sage", "rue"],
        benefits={
            "tomatoes": "Repels pests, may enhance flavor",
            "peppers": "Deters aphids and spider mites",
            "oregano": "Complementary growth, repels pests together",
            "asparagus": "Repels asparagus beetles",
        },
        reasons_to_avoid={
            "sage": "Different water needs, can inhibit basil",
            "rue": "Allelopathic effects on basil",
        }
    ),
    
    "beans": CompanionInfo(
        good_companions=["corn", "squash", "cucumbers", "carrots", "beets", "radishes"],
        bad_companions=["onions", "garlic", "fennel", "sunflowers"],
        benefits={
            "corn": "Three Sisters - beans climb corn, fix nitrogen",
            "squash": "Three Sisters - squash shades soil, retains moisture",
            "cucumbers": "Beans fix nitrogen, cucumbers benefit",
            "carrots": "Different root depths, beans add nitrogen",
            "beets": "Beans improve soil nitrogen for beets",
            "radishes": "Radishes deter bean beetles",
        },
        reasons_to_avoid={
            "onions": "Stunts bean growth",
            "garlic": "Inhibits bean growth",
            "fennel": "Allelopathic to most plants including beans",
            "sunflowers": "Allelopathic compounds affect beans",
        }
    ),
    
    "carrots": CompanionInfo(
        good_companions=["onions", "leeks", "tomatoes", "lettuce", "peas", "rosemary", "sage"],
        bad_companions=["dill", "parsnips", "fennel"],
        benefits={
            "onions": "Repels carrot fly",
            "leeks": "Confuses carrot fly with scent",
            "tomatoes": "Different root depths, space efficient",
            "lettuce": "Lettuce shades soil, retains moisture",
            "peas": "Peas add nitrogen to soil",
            "rosemary": "Strong scent deters carrot fly",
            "sage": "Repels carrot fly",
        },
        reasons_to_avoid={
            "dill": "Attracts carrot fly, can stunt carrots",
            "parsnips": "Same pests and diseases",
            "fennel": "Inhibits carrot growth",
        }
    ),
    
    "peppers": CompanionInfo(
        good_companions=["basil", "onions", "spinach", "carrots", "tomatoes"],
        bad_companions=["beans", "brassicas", "fennel"],
        benefits={
            "basil": "Repels aphids, thrips, and spider mites",
            "onions": "Deters aphids",
            "spinach": "Provides ground cover, retains moisture",
            "carrots": "Different root depths",
            "tomatoes": "Similar care requirements (but watch diseases)",
        },
        reasons_to_avoid={
            "beans": "Different nutrient needs",
            "brassicas": "Inhibit pepper growth",
            "fennel": "Allelopathic to most plants",
        }
    ),
    
    "cucumbers": CompanionInfo(
        good_companions=["beans", "peas", "radishes", "sunflowers", "nasturtiums", "marigolds"],
        bad_companions=["sage", "potatoes", "aromatic herbs"],
        benefits={
            "beans": "Beans fix nitrogen, cucumbers climb together",
            "peas": "Add nitrogen to soil",
            "radishes": "Deter cucumber beetles",
            "sunflowers": "Provides trellis structure",
            "nasturtiums": "Trap crop for aphids",
            "marigolds": "Deters beetles and nematodes",
        },
        reasons_to_avoid={
            "sage": "Inhibits cucumber growth",
            "potatoes": "Both susceptible to blight",
            "aromatic herbs": "Can affect cucumber flavor",
        }
    ),
    
    "squash": CompanionInfo(
        good_companions=["corn", "beans", "peas", "radishes", "nasturtiums", "marigolds"],
        bad_companions=["potatoes"],
        benefits={
            "corn": "Three Sisters - provides structure",
            "beans": "Three Sisters - beans fix nitrogen",
            "peas": "Add nitrogen to soil",
            "radishes": "Deter squash bugs",
            "nasturtiums": "Repels squash bugs and beetles",
            "marigolds": "Deters beetles",
        },
        reasons_to_avoid={
            "potatoes": "Compete for space and nutrients",
        }
    ),
    
    "brassicas": CompanionInfo(
        good_companions=["beets", "onions", "celery", "dill", "chamomile", "nasturtiums"],
        bad_companions=["tomatoes", "beans", "strawberries", "peppers"],
        benefits={
            "beets": "Different nutrient needs, space efficient",
            "onions": "Repels aphids and cabbage worms",
            "celery": "Deters cabbage white butterfly",
            "dill": "Attracts beneficial wasps that prey on cabbage worms",
            "chamomile": "Improves flavor and health",
            "nasturtiums": "Trap crop for aphids",
        },
        reasons_to_avoid={
            "tomatoes": "Heavy feeders, compete for nutrients",
            "beans": "Stunted growth for both",
            "strawberries": "Inhibits growth",
            "peppers": "Different nutrient needs",
        }
    ),
    
    "onions": CompanionInfo(
        good_companions=["carrots", "beets", "lettuce", "tomatoes", "peppers", "brassicas"],
        bad_companions=["beans", "peas", "sage", "asparagus"],
        benefits={
            "carrots": "Repels carrot fly",
            "beets": "Different root depths",
            "lettuce": "Repels aphids from lettuce",
            "tomatoes": "Deters aphids",
            "peppers": "Deters aphids",
            "brassicas": "Repels cabbage worms",
        },
        reasons_to_avoid={
            "beans": "Stunts bean growth",
            "peas": "Inhibits pea growth",
            "sage": "Poor companion",
            "asparagus": "Stunts asparagus",
        }
    ),
    
    "herbs": CompanionInfo(
        good_companions=["vegetables", "flowers"],
        bad_companions=[],
        benefits={
            "vegetables": "Most herbs repel pests and attract beneficials",
            "flowers": "Create diverse, healthy ecosystem",
        },
        reasons_to_avoid={}
    ),
    
    # v3.2: Additional crops
    "eggplant": CompanionInfo(
        good_companions=["beans", "peppers", "spinach", "thyme", "marigolds"],
        bad_companions=["fennel", "potatoes"],
        benefits={
            "beans": "Fix nitrogen for eggplant",
            "peppers": "Similar care requirements, companion well",
            "spinach": "Low-growing, provides ground cover",
            "thyme": "Repels cabbage worms and beetles",
            "marigolds": "Deters beetles and nematodes",
        },
        reasons_to_avoid={
            "fennel": "Inhibits growth of most vegetables",
            "potatoes": "Different water needs, pest attraction",
        }
    ),
    
    "spinach": CompanionInfo(
        good_companions=["strawberries", "peas", "brassicas", "eggplant", "celery"],
        bad_companions=["potatoes"],
        benefits={
            "strawberries": "Mutual growth enhancement",
            "peas": "Peas add nitrogen for spinach",
            "brassicas": "Cool season crops, compatible timing",
            "eggplant": "Provides ground cover, retains moisture",
            "celery": "Compatible watering needs",
        },
        reasons_to_avoid={
            "potatoes": "Competes for nutrients",
        }
    ),
    
    "radishes": CompanionInfo(
        good_companions=["lettuce", "carrots", "cucumbers", "squash", "beans", "peas"],
        bad_companions=["hyssop"],
        benefits={
            "lettuce": "Quick succession crop, loosens soil",
            "carrots": "Breaks up soil, deters carrot fly",
            "cucumbers": "Deters cucumber beetles",
            "squash": "Deters squash borers",
            "beans": "Loosens soil, deters bean beetles",
            "peas": "Quick turnover, soil improvement",
        },
        reasons_to_avoid={
            "hyssop": "Inhibits radish growth",
        }
    ),
    
    "peas": CompanionInfo(
        good_companions=["carrots", "turnips", "radishes", "cucumbers", "beans", "corn"],
        bad_companions=["onions", "garlic", "gladiolus"],
        benefits={
            "carrots": "Peas add nitrogen, carrots different root depth",
            "turnips": "Compatible growth habits",
            "radishes": "Loosens soil for peas",
            "cucumbers": "Peas fix nitrogen for cucumbers",
            "beans": "Both legumes, similar care",
            "corn": "Three Sisters companion (with squash)",
        },
        reasons_to_avoid={
            "onions": "Inhibits pea growth",
            "garlic": "Stunts pea development",
            "gladiolus": "Allelopathic effects",
        }
    ),
    
    "corn": CompanionInfo(
        good_companions=["beans", "squash", "peas", "cucumbers", "melons", "pumpkins"],
        bad_companions=["tomatoes", "celery"],
        benefits={
            "beans": "Three Sisters - beans climb corn, fix nitrogen",
            "squash": "Three Sisters - ground cover, moisture retention",
            "peas": "Nitrogen fixation benefits corn",
            "cucumbers": "Corn provides support, cucumber ground cover",
            "melons": "Similar to squash, good ground cover",
            "pumpkins": "Traditional Three Sisters planting",
        },
        reasons_to_avoid={
            "tomatoes": "Both attract hornworms",
            "celery": "Corn inhibits celery growth",
        }
    ),
    
    "melons": CompanionInfo(
        good_companions=["corn", "radishes", "nasturtiums", "marigolds", "oregano"],
        bad_companions=["potatoes"],
        benefits={
            "corn": "Provides shade and wind protection",
            "radishes": "Deters cucumber beetles",
            "nasturtiums": "Repels aphids and beetles",
            "marigolds": "Deters beetles",
            "oregano": "Repels pests, improves flavor",
        },
        reasons_to_avoid={
            "potatoes": "Compete for space and nutrients",
        }
    ),
    
    "pumpkins": CompanionInfo(
        good_companions=["corn", "beans", "radishes", "nasturtiums", "marigolds"],
        bad_companions=["potatoes"],
        benefits={
            "corn": "Three Sisters - provides structure",
            "beans": "Three Sisters - nitrogen fixation",
            "radishes": "Deters squash bugs",
            "nasturtiums": "Trap crop for aphids",
            "marigolds": "Repels beetles",
        },
        reasons_to_avoid={
            "potatoes": "Heavy feeders, compete",
        }
    ),
    
    "strawberries": CompanionInfo(
        good_companions=["lettuce", "spinach", "beans", "onions", "thyme", "borage"],
        bad_companions=["brassicas", "fennel"],
        benefits={
            "lettuce": "Good ground cover together",
            "spinach": "Companion well, similar water needs",
            "beans": "Fix nitrogen for strawberries",
            "onions": "Repel strawberry pests",
            "thyme": "Deters worms",
            "borage": "Attracts pollinators, improves flavor",
        },
        reasons_to_avoid={
            "brassicas": "Inhibit strawberry growth",
            "fennel": "Allelopathic to strawberries",
        }
    ),
    
    "asparagus": CompanionInfo(
        good_companions=["tomatoes", "parsley", "basil", "comfrey", "marigolds"],
        bad_companions=["onions", "garlic", "potatoes"],
        benefits={
            "tomatoes": "Tomatoes repel asparagus beetles",
            "parsley": "Attracts beneficial insects",
            "basil": "Repels asparagus beetles",
            "comfrey": "Deep roots bring up nutrients",
            "marigolds": "General pest deterrent",
        },
        reasons_to_avoid={
            "onions": "Stunts asparagus growth",
            "garlic": "Inhibits development",
            "potatoes": "Competes for space and nutrients",
        }
    ),
    
    "celery": CompanionInfo(
        good_companions=["brassicas", "tomatoes", "beans", "leeks", "onions"],
        bad_companions=["corn", "parsley", "carrots"],
        benefits={
            "brassicas": "Deters cabbage white butterfly",
            "tomatoes": "Repels whiteflies from tomatoes",
            "beans": "Beans add nitrogen for celery",
            "leeks": "Repels carrot fly, celery fly",
            "onions": "Deters celery fly",
        },
        reasons_to_avoid={
            "corn": "Corn inhibits celery",
            "parsley": "Both in carrot family, attract same pests",
            "carrots": "Same family, disease spread risk",
        }
    ),
    
    "leeks": CompanionInfo(
        good_companions=["carrots", "celery", "onions", "brassicas"],
        bad_companions=["beans", "peas"],
        benefits={
            "carrots": "Repels carrot fly",
            "celery": "Mutual pest deterrence",
            "onions": "Similar care, compatible",
            "brassicas": "Repels cabbage worms",
        },
        reasons_to_avoid={
            "beans": "Stunts bean growth",
            "peas": "Inhibits pea development",
        }
    ),
    
    "turnips": CompanionInfo(
        good_companions=["peas", "beans", "nasturtiums"],
        bad_companions=["potatoes", "tomatoes"],
        benefits={
            "peas": "Peas add nitrogen",
            "beans": "Nitrogen fixation",
            "nasturtiums": "Trap crop for aphids",
        },
        reasons_to_avoid={
            "potatoes": "Stunts turnip growth",
            "tomatoes": "Poor companions",
        }
    ),
    
    "parsnips": CompanionInfo(
        good_companions=["onions", "garlic", "peas", "beans"],
        bad_companions=["carrots", "celery", "dill"],
        benefits={
            "onions": "Repels parsnip fly",
            "garlic": "Pest deterrent",
            "peas": "Nitrogen addition",
            "beans": "Nitrogen fixation",
        },
        reasons_to_avoid={
            "carrots": "Same pests and diseases",
            "celery": "Same family, disease risk",
            "dill": "Attracts parsnip pests",
        }
    ),
    
    "potatoes": CompanionInfo(
        good_companions=["beans", "peas", "cabbage", "corn", "marigolds", "nasturtiums"],
        bad_companions=["tomatoes", "cucumbers", "squash", "sunflowers", "raspberries"],
        benefits={
            "beans": "Fix nitrogen for potatoes",
            "peas": "Nitrogen addition",
            "cabbage": "Potatoes deter cabbage worms",
            "corn": "Provides shade for potatoes",
            "marigolds": "Deters potato beetles",
            "nasturtiums": "Trap crop for aphids",
        },
        reasons_to_avoid={
            "tomatoes": "Both susceptible to blight",
            "cucumbers": "Different water needs",
            "squash": "Space competition",
            "sunflowers": "Allelopathic effects",
            "raspberries": "Spread diseases to each other",
        }
    ),
    
    "sunflowers": CompanionInfo(
        good_companions=["cucumbers", "squash", "corn"],
        bad_companions=["potatoes", "beans"],
        benefits={
            "cucumbers": "Provides support for climbing",
            "squash": "Provides structure",
            "corn": "Can grow together for space efficiency",
        },
        reasons_to_avoid={
            "potatoes": "Allelopathic - inhibits potato growth",
            "beans": "Allelopathic effects",
        }
    ),
    
    "sweet_potatoes": CompanionInfo(
        good_companions=["thyme", "oregano", "parsnips", "beets"],
        bad_companions=["squash", "pumpkins"],
        benefits={
            "thyme": "Repels beetles",
            "oregano": "General pest deterrent",
            "parsnips": "Different root depths",
            "beets": "Compatible root crops",
        },
        reasons_to_avoid={
            "squash": "Compete for space",
            "pumpkins": "Space competition",
        }
    ),
    
    # Additional herbs
    "oregano": CompanionInfo(
        good_companions=["tomatoes", "peppers", "squash", "cabbage", "cucumbers"],
        bad_companions=[],
        benefits={
            "tomatoes": "Repels aphids and spider mites",
            "peppers": "Pest deterrent",
            "squash": "Attracts pollinators",
            "cabbage": "Repels cabbage moths",
            "cucumbers": "General pest control",
        },
        reasons_to_avoid={}
    ),
    
    "thyme": CompanionInfo(
        good_companions=["cabbage", "eggplant", "tomatoes", "strawberries"],
        bad_companions=[],
        benefits={
            "cabbage": "Deters cabbage worms",
            "eggplant": "Repels flea beetles",
            "tomatoes": "Attracts beneficial insects",
            "strawberries": "General pest control",
        },
        reasons_to_avoid={}
    ),
    
    "rosemary": CompanionInfo(
        good_companions=["sage", "beans", "cabbage", "carrots"],
        bad_companions=["potatoes", "cucumbers"],
        benefits={
            "sage": "Complementary herbs, repel pests together",
            "beans": "Repels bean beetles",
            "cabbage": "Deters cabbage moths",
            "carrots": "Strong scent deters carrot fly",
        },
        reasons_to_avoid={
            "potatoes": "Different water needs",
            "cucumbers": "Rosemary prefers dry conditions",
        }
    ),
    
    "mint": CompanionInfo(
        good_companions=["cabbage", "tomatoes", "peas"],
        bad_companions=["parsley", "chamomile"],
        benefits={
            "cabbage": "Repels cabbage moths and aphids",
            "tomatoes": "Deters aphids and flea beetles",
            "peas": "Attracts beneficial insects",
        },
        reasons_to_avoid={
            "parsley": "Mint can overtake parsley",
            "chamomile": "Competition for space",
        }
    ),
    
    "dill": CompanionInfo(
        good_companions=["cabbage", "cucumbers", "lettuce", "onions"],
        bad_companions=["carrots", "tomatoes"],
        benefits={
            "cabbage": "Attracts beneficial wasps that eat cabbage worms",
            "cucumbers": "Attracts beneficial insects",
            "lettuce": "Provides shade for lettuce",
            "onions": "Attracts pollinators",
        },
        reasons_to_avoid={
            "carrots": "Can attract carrot fly",
            "tomatoes": "May stunt tomato growth",
        }
    ),
    
    "chives": CompanionInfo(
        good_companions=["carrots", "tomatoes", "roses", "apples"],
        bad_companions=["beans", "peas"],
        benefits={
            "carrots": "Repels carrot fly with strong scent",
            "tomatoes": "Improves growth and flavor",
            "roses": "Repels aphids and black spot",
            "apples": "Prevents apple scab",
        },
        reasons_to_avoid={
            "beans": "Inhibits bean growth",
            "peas": "Stunts pea development",
        }
    ),
    
    "chamomile": CompanionInfo(
        good_companions=["brassicas", "onions", "cabbage"],
        bad_companions=["mint"],
        benefits={
            "brassicas": "Improves flavor and growth",
            "onions": "Improves growth",
            "cabbage": "Enhances flavor",
        },
        reasons_to_avoid={
            "mint": "Competition for space",
        }
    ),
    
    "borage": CompanionInfo(
        good_companions=["tomatoes", "squash", "strawberries"],
        bad_companions=[],
        benefits={
            "tomatoes": "Deters tomato hornworms",
            "squash": "Attracts pollinators",
            "strawberries": "Improves flavor and attracts pollinators",
        },
        reasons_to_avoid={}
    ),
    
    "nasturtiums": CompanionInfo(
        good_companions=["tomatoes", "cucumbers", "squash", "cabbage", "radishes"],
        bad_companions=[],
        benefits={
            "tomatoes": "Trap crop for aphids and whiteflies",
            "cucumbers": "Deters cucumber beetles",
            "squash": "Repels squash bugs",
            "cabbage": "Trap crop for aphids",
            "radishes": "Repels aphids",
        },
        reasons_to_avoid={}
    ),
    
    "marigolds": CompanionInfo(
        good_companions=["tomatoes", "peppers", "potatoes", "beans", "roses"],
        bad_companions=["beans (some varieties)"],
        benefits={
            "tomatoes": "Deters nematodes and whiteflies",
            "peppers": "Repels aphids and beetles",
            "potatoes": "Deters potato beetles",
            "beans": "General pest deterrent",
            "roses": "Deters aphids",
        },
        reasons_to_avoid={
            "beans (some varieties)": "Some bean varieties don't companion well",
        }
    ),
    
    "comfrey": CompanionInfo(
        good_companions=["fruit trees", "asparagus", "tomatoes", "potatoes"],
        bad_companions=[],
        benefits={
            "fruit trees": "Deep roots bring up nutrients, dynamic accumulator",
            "asparagus": "Nutrient accumulator benefits asparagus",
            "tomatoes": "Provides nutrients when used as mulch",
            "potatoes": "Accumulates potassium for potatoes",
        },
        reasons_to_avoid={}
    ),
    
    # ADDITIONAL COMMON VEGETABLES
    "beets": CompanionInfo(
        good_companions=["onions", "lettuce", "cabbage", "bush_beans", "garlic"],
        bad_companions=["pole_beans", "mustard"],
        benefits={
            "onions": "Repels pests, different root depths",
            "lettuce": "Shade tolerant, fills space",
            "cabbage": "Compatible growth patterns",
            "bush_beans": "Beans add nitrogen",
            "garlic": "Repels aphids and beetles",
        },
        reasons_to_avoid={
            "pole_beans": "Compete for nutrients",
            "mustard": "Can stunt beet growth",
        }
    ),
    
    "arugula": CompanionInfo(
        good_companions=["beets", "carrots", "lettuce", "spinach", "onions"],
        bad_companions=["strawberries"],
        benefits={
            "beets": "Compatible cool season crops",
            "carrots": "Different root depths",
            "lettuce": "Similar growing conditions",
            "spinach": "Cool season companions",
            "onions": "Pest deterrent",
        },
        reasons_to_avoid={
            "strawberries": "Competition for space",
        }
    ),
    
    "kale": CompanionInfo(
        good_companions=["onions", "beets", "celery", "herbs", "potatoes"],
        bad_companions=["tomatoes", "peppers", "strawberries"],
        benefits={
            "onions": "Repels cabbage worms",
            "beets": "Compatible growth",
            "celery": "Deters cabbage moths",
            "herbs": "Aromatic pest deterrent",
            "potatoes": "Compatible spacing",
        },
        reasons_to_avoid={
            "tomatoes": "Compete for nutrients",
            "peppers": "Different nutrient needs",
            "strawberries": "Incompatible growth patterns",
        }
    ),
    
    "garlic": CompanionInfo(
        good_companions=["tomatoes", "roses", "fruit_trees", "beets", "carrots"],
        bad_companions=["beans", "peas", "asparagus", "sage"],
        benefits={
            "tomatoes": "Repels aphids and spider mites",
            "roses": "Deters aphids and black spot",
            "fruit_trees": "Repels borers and aphids",
            "beets": "Pest deterrent",
            "carrots": "Repels carrot fly",
        },
        reasons_to_avoid={
            "beans": "Inhibits bean growth",
            "peas": "Stunts pea growth",
            "asparagus": "Stunts asparagus growth",
            "sage": "Competes for resources",
        }
    ),
    
    "broccoli": CompanionInfo(
        good_companions=["onions", "garlic", "beets", "celery", "herbs"],
        bad_companions=["tomatoes", "peppers", "strawberries", "pole_beans"],
        benefits={
            "onions": "Repels cabbage worms",
            "garlic": "Deters aphids",
            "beets": "Compatible growth",
            "celery": "Repels cabbage moths",
            "herbs": "Aromatic pest control",
        },
        reasons_to_avoid={
            "tomatoes": "Heavy feeders compete",
            "peppers": "Different nutrient needs",
            "strawberries": "Incompatible",
            "pole_beans": "Shading issues",
        }
    ),
    
    "cauliflower": CompanionInfo(
        good_companions=["onions", "celery", "beets", "herbs", "potatoes"],
        bad_companions=["tomatoes", "strawberries", "peppers"],
        benefits={
            "onions": "Repels pests",
            "celery": "Deters cabbage moths",
            "beets": "Compatible growth",
            "herbs": "Pest deterrent",
            "potatoes": "Good spacing",
        },
        reasons_to_avoid={
            "tomatoes": "Nutrient competition",
            "strawberries": "Incompatible",
            "peppers": "Different needs",
        }
    ),
    
    "cabbage": CompanionInfo(
        good_companions=["onions", "celery", "beets", "herbs", "potatoes"],
        bad_companions=["tomatoes", "peppers", "strawberries", "pole_beans"],
        benefits={
            "onions": "Repels cabbage worms",
            "celery": "Deters cabbage moths",
            "beets": "Compatible growth",
            "herbs": "Aromatic pest control",
            "potatoes": "Good companion",
        },
        reasons_to_avoid={
            "tomatoes": "Heavy feeders compete",
            "peppers": "Different needs",
            "strawberries": "Incompatible",
            "pole_beans": "Shading problems",
        }
    ),
    
    # FRUITS
    "apples": CompanionInfo(
        good_companions=["nasturtiums", "chives", "garlic", "comfrey", "clover"],
        bad_companions=["grass", "potatoes"],
        benefits={
            "nasturtiums": "Trap crop for aphids",
            "chives": "Deters aphids and scab",
            "garlic": "Repels borers",
            "comfrey": "Dynamic accumulator, mulch",
            "clover": "Nitrogen fixation, ground cover",
        },
        reasons_to_avoid={
            "grass": "Competes for water and nutrients",
            "potatoes": "Increases blight risk",
        }
    ),
    
    "blueberries": CompanionInfo(
        good_companions=["azaleas", "rhododendrons", "ferns", "thyme", "strawberries"],
        bad_companions=["tomatoes", "peppers", "brassicas"],
        benefits={
            "azaleas": "Similar acidic soil needs",
            "rhododendrons": "Acid-loving companions",
            "ferns": "Shade-tolerant ground cover",
            "thyme": "Ground cover, pest deterrent",
            "strawberries": "Compatible acid-lovers",
        },
        reasons_to_avoid={
            "tomatoes": "Different pH needs",
            "peppers": "Different soil requirements",
            "brassicas": "Incompatible pH",
        }
    ),
    
    "grapes": CompanionInfo(
        good_companions=["basil", "oregano", "clover", "blackberries", "hyssop"],
        bad_companions=["cabbage", "radishes"],
        benefits={
            "basil": "Repels flies and mosquitoes",
            "oregano": "Pest deterrent",
            "clover": "Nitrogen fixation",
            "blackberries": "Compatible growth",
            "hyssop": "Attracts pollinators",
        },
        reasons_to_avoid={
            "cabbage": "Inhibits grape growth",
            "radishes": "Competition",
        }
    ),
    
    # MORE HERBS
    "parsley": CompanionInfo(
        good_companions=["tomatoes", "asparagus", "carrots", "roses"],
        bad_companions=["lettuce", "mint"],
        benefits={
            "tomatoes": "Attracts beneficial insects",
            "asparagus": "Repels asparagus beetles",
            "carrots": "Attracts beneficial wasps",
            "roses": "Enhances rose health",
        },
        reasons_to_avoid={
            "lettuce": "Competes for space",
            "mint": "Too aggressive, competes",
        }
    ),
    
    "cilantro": CompanionInfo(
        good_companions=["tomatoes", "peppers", "spinach", "anise"],
        bad_companions=["fennel"],
        benefits={
            "tomatoes": "Repels aphids and spider mites",
            "peppers": "Attracts beneficial insects",
            "spinach": "Compatible growth",
            "anise": "Enhances growth",
        },
        reasons_to_avoid={
            "fennel": "Inhibits seed production",
        }
    ),
    
    "sage": CompanionInfo(
        good_companions=["rosemary", "carrots", "cabbage", "tomatoes"],
        bad_companions=["cucumbers", "onions", "rue"],
        benefits={
            "rosemary": "Compatible Mediterranean herbs",
            "carrots": "Repels carrot fly",
            "cabbage": "Deters cabbage moths",
            "tomatoes": "Repels some pests",
        },
        reasons_to_avoid={
            "cucumbers": "Inhibits growth",
            "onions": "Competes for resources",
            "rue": "Allelopathic effects",
        }
    ),
    
    "lavender": CompanionInfo(
        good_companions=["roses", "fruit_trees", "vegetables", "herbs"],
        bad_companions=["impatiens"],
        benefits={
            "roses": "Repels aphids",
            "fruit_trees": "Attracts pollinators",
            "vegetables": "General pest deterrent",
            "herbs": "Compatible Mediterranean herbs",
        },
        reasons_to_avoid={
            "impatiens": "Different water needs",
        }
    ),
    
    # LEGUMES
    "lentils": CompanionInfo(
        good_companions=["cucumbers", "corn", "potatoes", "radishes"],
        bad_companions=["onions", "garlic"],
        benefits={
            "cucumbers": "Nitrogen fixation benefits cucumbers",
            "corn": "Compatible growth",
            "potatoes": "Lentils add nitrogen",
            "radishes": "Pest deterrent",
        },
        reasons_to_avoid={
            "onions": "Inhibits legume growth",
            "garlic": "Stunts lentil growth",
        }
    ),
    
    "chickpeas": CompanionInfo(
        good_companions=["corn", "cucumbers", "potatoes", "radishes"],
        bad_companions=["onions", "garlic", "fennel"],
        benefits={
            "corn": "Compatible growth patterns",
            "cucumbers": "Nitrogen fixation",
            "potatoes": "Adds nitrogen to soil",
            "radishes": "Pest control",
        },
        reasons_to_avoid={
            "onions": "Inhibits growth",
            "garlic": "Stunts chickpeas",
            "fennel": "Allelopathic",
        }
    ),
    
    # GRAINS
    "wheat": CompanionInfo(
        good_companions=["clover", "peas", "beans"],
        bad_companions=["none_known"],
        benefits={
            "clover": "Nitrogen fixation, ground cover",
            "peas": "Nitrogen fixation",
            "beans": "Legume benefits",
        },
        reasons_to_avoid={}
    ),
    
    "oats": CompanionInfo(
        good_companions=["peas", "vetch", "clover"],
        bad_companions=["none_known"],
        benefits={
            "peas": "Nitrogen fixation, support",
            "vetch": "Cover crop companion",
            "clover": "Nitrogen fixation",
        },
        reasons_to_avoid={}
    ),
    
    "barley": CompanionInfo(
        good_companions=["peas", "beans", "clover"],
        bad_companions=["none_known"],
        benefits={
            "peas": "Nitrogen fixation",
            "beans": "Legume companion",
            "clover": "Ground cover, nitrogen",
        },
        reasons_to_avoid={}
    ),
    
    # MORE FRUITS & BERRIES
    "cherries": CompanionInfo(
        good_companions=["garlic", "chives", "nasturtiums", "tansy"],
        bad_companions=["grass", "potatoes"],
        benefits={
            "garlic": "Repels aphids and borers",
            "chives": "Deters aphids",
            "nasturtiums": "Trap crop for aphids",
            "tansy": "Repels flying insects",
        },
        reasons_to_avoid={
            "grass": "Competes for nutrients",
            "potatoes": "Disease risk",
        }
    ),
    
    "peaches": CompanionInfo(
        good_companions=["garlic", "tansy", "basil", "nasturtiums"],
        bad_companions=["tomatoes", "potatoes"],
        benefits={
            "garlic": "Repels borers",
            "tansy": "Deters flying insects",
            "basil": "Repels flies",
            "nasturtiums": "Trap crop",
        },
        reasons_to_avoid={
            "tomatoes": "Disease transmission",
            "potatoes": "Blight risk",
        }
    ),
    
    "pears": CompanionInfo(
        good_companions=["garlic", "chives", "nasturtiums", "comfrey"],
        bad_companions=["grass", "potatoes"],
        benefits={
            "garlic": "Repels pests",
            "chives": "Deters aphids",
            "nasturtiums": "Trap crop",
            "comfrey": "Nutrient accumulator",
        },
        reasons_to_avoid={
            "grass": "Competition",
            "potatoes": "Disease risk",
        }
    ),
    
    "plums": CompanionInfo(
        good_companions=["garlic", "chives", "nasturtiums", "tansy"],
        bad_companions=["grass", "potatoes"],
        benefits={
            "garlic": "Repels borers",
            "chives": "Deters aphids",
            "nasturtiums": "Trap crop",
            "tansy": "Repels insects",
        },
        reasons_to_avoid={
            "grass": "Competition",
            "potatoes": "Disease risk",
        }
    ),
    
    "blackberries": CompanionInfo(
        good_companions=["grapes", "tansy", "hyssop", "rue"],
        bad_companions=["raspberries"],
        benefits={
            "grapes": "Compatible growth",
            "tansy": "Repels insects",
            "hyssop": "Attracts pollinators",
            "rue": "Repels beetles",
        },
        reasons_to_avoid={
            "raspberries": "Disease transmission between caneberries",
        }
    ),
    
    "cranberries": CompanionInfo(
        good_companions=["azaleas", "blueberries", "rhododendrons"],
        bad_companions=["vegetables"],
        benefits={
            "azaleas": "Similar acidic soil needs",
            "blueberries": "Acid-loving companions",
            "rhododendrons": "Compatible pH",
        },
        reasons_to_avoid={
            "vegetables": "Different soil pH requirements",
        }
    ),
    
    # MORE VEGETABLES
    "artichokes": CompanionInfo(
        good_companions=["sunflowers", "tarragon", "peas"],
        bad_companions=["none_known"],
        benefits={
            "sunflowers": "Attracts beneficial insects",
            "tarragon": "General pest deterrent",
            "peas": "Nitrogen fixation",
        },
        reasons_to_avoid={}
    ),
    
    "brussels_sprouts": CompanionInfo(
        good_companions=["onions", "garlic", "beets", "celery", "herbs"],
        bad_companions=["tomatoes", "peppers", "strawberries"],
        benefits={
            "onions": "Repels cabbage worms",
            "garlic": "Deters aphids",
            "beets": "Compatible growth",
            "celery": "Repels cabbage moths",
            "herbs": "Aromatic pest control",
        },
        reasons_to_avoid={
            "tomatoes": "Nutrient competition",
            "peppers": "Different needs",
            "strawberries": "Incompatible",
        }
    ),
    
    "chard": CompanionInfo(
        good_companions=["onions", "lettuce", "cabbage", "beans"],
        bad_companions=["none_known"],
        benefits={
            "onions": "Pest deterrent",
            "lettuce": "Compatible growth",
            "cabbage": "Good companion",
            "beans": "Nitrogen fixation",
        },
        reasons_to_avoid={}
    ),
    
    "collard_greens": CompanionInfo(
        good_companions=["onions", "beets", "celery", "herbs"],
        bad_companions=["tomatoes", "peppers", "strawberries"],
        benefits={
            "onions": "Repels cabbage worms",
            "beets": "Compatible growth",
            "celery": "Deters pests",
            "herbs": "Pest control",
        },
        reasons_to_avoid={
            "tomatoes": "Competition",
            "peppers": "Different needs",
            "strawberries": "Incompatible",
        }
    ),
    
    "kohlrabi": CompanionInfo(
        good_companions=["onions", "beets", "herbs"],
        bad_companions=["tomatoes", "peppers", "pole_beans"],
        benefits={
            "onions": "Repels pests",
            "beets": "Compatible growth",
            "herbs": "Pest deterrent",
        },
        reasons_to_avoid={
            "tomatoes": "Stunts tomato growth",
            "peppers": "Competition",
            "pole_beans": "Incompatible",
        }
    ),
    
    "okra": CompanionInfo(
        good_companions=["peppers", "eggplant", "basil", "cucumbers"],
        bad_companions=["none_known"],
        benefits={
            "peppers": "Similar heat requirements",
            "eggplant": "Compatible nightshades",
            "basil": "Repels pests",
            "cucumbers": "Good spacing",
        },
        reasons_to_avoid={}
    ),
    
    "rutabaga": CompanionInfo(
        good_companions=["onions", "peas", "beans"],
        bad_companions=["none_known"],
        benefits={
            "onions": "Pest deterrent",
            "peas": "Nitrogen fixation",
            "beans": "Legume benefits",
        },
        reasons_to_avoid={}
    ),
    
    # MORE HERBS
    "fennel": CompanionInfo(
        good_companions=["none_recommended"],
        bad_companions=["tomatoes", "beans", "kohlrabi", "most_vegetables"],
        benefits={},
        reasons_to_avoid={
            "tomatoes": "Allelopathic - inhibits growth",
            "beans": "Inhibits bean growth",
            "kohlrabi": "Stunts growth",
            "most_vegetables": "Generally allelopathic to many plants",
        }
    ),
    
    "tarragon": CompanionInfo(
        good_companions=["most_vegetables"],
        bad_companions=["none_known"],
        benefits={
            "most_vegetables": "General pest deterrent, enhances growth",
        },
        reasons_to_avoid={}
    ),
    
    "anise": CompanionInfo(
        good_companions=["coriander", "beans"],
        bad_companions=["carrots", "radishes"],
        benefits={
            "coriander": "Enhances growth",
            "beans": "Compatible growth",
        },
        reasons_to_avoid={
            "carrots": "Inhibits carrot growth",
            "radishes": "Competition",
        }
    ),
    
    "lemon_balm": CompanionInfo(
        good_companions=["tomatoes", "squash", "most_vegetables"],
        bad_companions=["none_known"],
        benefits={
            "tomatoes": "Attracts pollinators",
            "squash": "Attracts beneficial insects",
            "most_vegetables": "General pollinator attractor",
        },
        reasons_to_avoid={}
    ),
    
    "marjoram": CompanionInfo(
        good_companions=["most_vegetables", "herbs"],
        bad_companions=["none_known"],
        benefits={
            "most_vegetables": "General pest deterrent",
            "herbs": "Compatible herb companion",
        },
        reasons_to_avoid={}
    ),
    
    # MORE LEGUMES
    "soybeans": CompanionInfo(
        good_companions=["corn", "squash", "cucumbers"],
        bad_companions=["onions", "garlic"],
        benefits={
            "corn": "Nitrogen fixation",
            "squash": "Three Sisters variation",
            "cucumbers": "Adds nitrogen",
        },
        reasons_to_avoid={
            "onions": "Inhibits growth",
            "garlic": "Stunts soybeans",
        }
    ),
    
    "fava_beans": CompanionInfo(
        good_companions=["potatoes", "corn", "cucumbers", "brassicas"],
        bad_companions=["onions", "garlic", "fennel"],
        benefits={
            "potatoes": "Nitrogen fixation",
            "corn": "Compatible growth",
            "cucumbers": "Adds nitrogen",
            "brassicas": "Nitrogen benefits brassicas",
        },
        reasons_to_avoid={
            "onions": "Inhibits growth",
            "garlic": "Stunts beans",
            "fennel": "Allelopathic",
        }
    ),
    
    "black_beans": CompanionInfo(
        good_companions=["corn", "squash", "cucumbers", "carrots"],
        bad_companions=["onions", "garlic", "fennel"],
        benefits={
            "corn": "Three Sisters - nitrogen fixation",
            "squash": "Three Sisters companion",
            "cucumbers": "Nitrogen benefits",
            "carrots": "Different root depths",
        },
        reasons_to_avoid={
            "onions": "Inhibits bean growth",
            "garlic": "Stunts growth",
            "fennel": "Allelopathic",
        }
    ),
    
    "pinto_beans": CompanionInfo(
        good_companions=["corn", "squash", "cucumbers"],
        bad_companions=["onions", "garlic", "fennel"],
        benefits={
            "corn": "Nitrogen fixation, climbing support",
            "squash": "Ground cover, moisture retention",
            "cucumbers": "Nitrogen benefits",
        },
        reasons_to_avoid={
            "onions": "Inhibits growth",
            "garlic": "Stunts beans",
            "fennel": "Allelopathic",
        }
    ),
    
    # ALLIUMS
    "shallots": CompanionInfo(
        good_companions=["carrots", "tomatoes", "lettuce", "beets"],
        bad_companions=["beans", "peas", "asparagus"],
        benefits={
            "carrots": "Repels carrot fly",
            "tomatoes": "Repels aphids",
            "lettuce": "Pest deterrent",
            "beets": "Compatible growth",
        },
        reasons_to_avoid={
            "beans": "Inhibits bean growth",
            "peas": "Stunts pea growth",
            "asparagus": "Incompatible",
        }
    ),
    
    # ROOT VEGETABLES
    "sweet_potatoes": CompanionInfo(
        good_companions=["beans", "peas", "herbs"],
        bad_companions=["squash"],
        benefits={
            "beans": "Nitrogen fixation",
            "peas": "Legume benefits",
            "herbs": "Pest deterrent",
        },
        reasons_to_avoid={
            "squash": "Vining competition",
        }
    ),
    
    "ginger": CompanionInfo(
        good_companions=["turmeric", "lemongrass", "tropical_plants"],
        bad_companions=["none_known"],
        benefits={
            "turmeric": "Similar growing conditions",
            "lemongrass": "Compatible tropical",
            "tropical_plants": "Similar requirements",
        },
        reasons_to_avoid={}
    ),
    
    "turmeric": CompanionInfo(
        good_companions=["ginger", "lemongrass", "tropical_plants"],
        bad_companions=["none_known"],
        benefits={
            "ginger": "Similar growing conditions",
            "lemongrass": "Compatible tropical",
            "tropical_plants": "Similar requirements",
        },
        reasons_to_avoid={}
    ),
    
    # GRAINS
    "rice": CompanionInfo(
        good_companions=["azolla", "ducks", "fish"],
        bad_companions=["none_known"],
        benefits={
            "azolla": "Nitrogen-fixing aquatic fern",
            "ducks": "Pest control in paddy",
            "fish": "Integrated rice-fish farming",
        },
        reasons_to_avoid={}
    ),
    
    "quinoa": CompanionInfo(
        good_companions=["beans", "peas", "corn"],
        bad_companions=["none_known"],
        benefits={
            "beans": "Nitrogen fixation",
            "peas": "Legume companion",
            "corn": "Compatible growth",
        },
        reasons_to_avoid={}
    ),
    
    "amaranth": CompanionInfo(
        good_companions=["corn", "beans", "squash"],
        bad_companions=["none_known"],
        benefits={
            "corn": "Compatible height",
            "beans": "Nitrogen benefits",
            "squash": "Ground cover",
        },
        reasons_to_avoid={}
    ),
    
    # TROPICAL FRUITS
    "avocado": CompanionInfo(
        good_companions=["comfrey", "nasturtiums", "yarrow", "sweet_alyssum"],
        bad_companions=["none_known"],
        benefits={
            "comfrey": "Dynamic accumulator",
            "nasturtiums": "Pest deterrent",
            "yarrow": "Attracts beneficial insects",
            "sweet_alyssum": "Ground cover, beneficial insects",
        },
        reasons_to_avoid={}
    ),
    
    "bananas": CompanionInfo(
        good_companions=["sweet_potato", "taro", "ginger", "turmeric"],
        bad_companions=["none_known"],
        benefits={
            "sweet_potato": "Ground cover",
            "taro": "Similar tropical conditions",
            "ginger": "Compatible tropical",
            "turmeric": "Similar requirements",
        },
        reasons_to_avoid={}
    ),
    
    "mangoes": CompanionInfo(
        good_companions=["comfrey", "nasturtiums", "marigolds"],
        bad_companions=["none_known"],
        benefits={
            "comfrey": "Nutrient accumulator",
            "nasturtiums": "Pest control",
            "marigolds": "Nematode control",
        },
        reasons_to_avoid={}
    ),
    
    "papayas": CompanionInfo(
        good_companions=["sweet_potato", "beans", "comfrey"],
        bad_companions=["none_known"],
        benefits={
            "sweet_potato": "Ground cover",
            "beans": "Nitrogen fixation",
            "comfrey": "Nutrient accumulator",
        },
        reasons_to_avoid={}
    ),
    
    "pineapples": CompanionInfo(
        good_companions=["sweet_potato", "ginger", "turmeric"],
        bad_companions=["none_known"],
        benefits={
            "sweet_potato": "Ground cover",
            "ginger": "Compatible tropical",
            "turmeric": "Similar conditions",
        },
        reasons_to_avoid={}
    ),
    
    # CITRUS
    "lemons": CompanionInfo(
        good_companions=["nasturtiums", "yarrow", "dill", "fennel"],
        bad_companions=["none_known"],
        benefits={
            "nasturtiums": "Aphid control",
            "yarrow": "Beneficial insects",
            "dill": "Attracts predatory wasps",
            "fennel": "Attracts beneficial insects",
        },
        reasons_to_avoid={}
    ),
    
    "limes": CompanionInfo(
        good_companions=["nasturtiums", "yarrow", "dill"],
        bad_companions=["none_known"],
        benefits={
            "nasturtiums": "Pest control",
            "yarrow": "Beneficial insects",
            "dill": "Attracts predators",
        },
        reasons_to_avoid={}
    ),
    
    "oranges": CompanionInfo(
        good_companions=["nasturtiums", "yarrow", "comfrey", "clover"],
        bad_companions=["none_known"],
        benefits={
            "nasturtiums": "Aphid trap crop",
            "yarrow": "Beneficial insects",
            "comfrey": "Nutrient accumulator",
            "clover": "Nitrogen fixation",
        },
        reasons_to_avoid={}
    ),
    
    # NUTS
    "almonds": CompanionInfo(
        good_companions=["clover", "nasturtiums", "comfrey"],
        bad_companions=["grass"],
        benefits={
            "clover": "Nitrogen fixation, ground cover",
            "nasturtiums": "Pest deterrent",
            "comfrey": "Deep nutrient mining",
        },
        reasons_to_avoid={
            "grass": "Competition for water and nutrients",
        }
    ),
    
    "walnuts": CompanionInfo(
        good_companions=["none_recommended"],
        bad_companions=["most_plants"],
        benefits={},
        reasons_to_avoid={
            "most_plants": "Juglone toxicity - allelopathic to many plants including tomatoes, peppers, potatoes",
        }
    ),
    
    "pecans": CompanionInfo(
        good_companions=["clover", "comfrey"],
        bad_companions=["grass"],
        benefits={
            "clover": "Nitrogen fixation",
            "comfrey": "Nutrient accumulator",
        },
        reasons_to_avoid={
            "grass": "Competition",
        }
    ),
    
    "hazelnuts": CompanionInfo(
        good_companions=["clover", "comfrey", "nasturtiums"],
        bad_companions=["grass"],
        benefits={
            "clover": "Nitrogen fixation",
            "comfrey": "Nutrient mining",
            "nasturtiums": "Pest control",
        },
        reasons_to_avoid={
            "grass": "Competition",
        }
    ),
    
    # MORE VEGETABLES
    "tomatillo": CompanionInfo(
        good_companions=["basil", "marigolds", "carrots", "onions"],
        bad_companions=["brassicas", "fennel", "potatoes"],
        benefits={
            "basil": "Repels aphids",
            "marigolds": "Nematode control",
            "carrots": "Space efficient",
            "onions": "Pest deterrent",
        },
        reasons_to_avoid={
            "brassicas": "Nutrient competition",
            "fennel": "Allelopathic",
            "potatoes": "Disease risk",
        }
    ),
    
    "zucchini": CompanionInfo(
        good_companions=["corn", "beans", "nasturtiums", "marigolds"],
        bad_companions=["potatoes"],
        benefits={
            "corn": "Three Sisters variation",
            "beans": "Nitrogen fixation",
            "nasturtiums": "Aphid control",
            "marigolds": "Pest deterrent",
        },
        reasons_to_avoid={
            "potatoes": "Competition",
        }
    ),
    
    "watermelon": CompanionInfo(
        good_companions=["corn", "beans", "nasturtiums", "marigolds"],
        bad_companions=["potatoes"],
        benefits={
            "corn": "Provides shade",
            "beans": "Nitrogen fixation",
            "nasturtiums": "Pest control",
            "marigolds": "Beetle deterrent",
        },
        reasons_to_avoid={
            "potatoes": "Competition",
        }
    ),
    
    "cantaloupe": CompanionInfo(
        good_companions=["corn", "beans", "nasturtiums", "marigolds"],
        bad_companions=["potatoes"],
        benefits={
            "corn": "Provides support and shade",
            "beans": "Nitrogen benefits",
            "nasturtiums": "Aphid control",
            "marigolds": "Pest deterrent",
        },
        reasons_to_avoid={
            "potatoes": "Competition",
        }
    ),
    
    # MORE HERBS
    "chervil": CompanionInfo(
        good_companions=["radishes", "lettuce", "broccoli"],
        bad_companions=["none_known"],
        benefits={
            "radishes": "Enhances flavor",
            "lettuce": "Compatible cool season",
            "broccoli": "Pest deterrent",
        },
        reasons_to_avoid={}
    ),
    
    "hyssop": CompanionInfo(
        good_companions=["cabbage", "grapes", "most_vegetables"],
        bad_companions=["radishes"],
        benefits={
            "cabbage": "Deters cabbage moths",
            "grapes": "Attracts pollinators",
            "most_vegetables": "General pest deterrent",
        },
        reasons_to_avoid={
            "radishes": "Inhibits radish growth",
        }
    ),
    
    "rue": CompanionInfo(
        good_companions=["roses", "raspberries", "figs"],
        bad_companions=["basil", "sage", "cabbage"],
        benefits={
            "roses": "Repels beetles",
            "raspberries": "Pest deterrent",
            "figs": "Repels flies",
        },
        reasons_to_avoid={
            "basil": "Allelopathic effects",
            "sage": "Incompatible",
            "cabbage": "Inhibits growth",
        }
    ),
    
    "tansy": CompanionInfo(
        good_companions=["fruit_trees", "roses", "raspberries"],
        bad_companions=["vegetables", "livestock"],
        benefits={
            "fruit_trees": "Repels flying insects",
            "roses": "Deters aphids and beetles",
            "raspberries": "Pest control",
        },
        reasons_to_avoid={
            "vegetables": "Can be invasive",
            "livestock": "Toxic to animals",
        }
    ),
    
    "yarrow": CompanionInfo(
        good_companions=["most_plants", "aromatic_herbs"],
        bad_companions=["none_known"],
        benefits={
            "most_plants": "Attracts beneficial insects, enhances essential oils in nearby herbs",
            "aromatic_herbs": "Intensifies fragrance",
        },
        reasons_to_avoid={}
    ),
    
    # BERRIES
    "raspberries": CompanionInfo(
        good_companions=["garlic", "tansy", "rue", "turnips"],
        bad_companions=["blackberries", "potatoes"],
        benefits={
            "garlic": "Repels aphids",
            "tansy": "Repels beetles",
            "rue": "Pest deterrent",
            "turnips": "Compatible growth",
        },
        reasons_to_avoid={
            "blackberries": "Disease transmission",
            "potatoes": "Blight risk",
        }
    ),
    
    # MORE LEGUMES
    "green_beans": CompanionInfo(
        good_companions=["corn", "squash", "cucumbers", "carrots", "beets"],
        bad_companions=["onions", "garlic", "fennel", "sunflowers"],
        benefits={
            "corn": "Beans climb corn, nitrogen fixation",
            "squash": "Three Sisters",
            "cucumbers": "Nitrogen benefits",
            "carrots": "Different root depths",
            "beets": "Compatible growth",
        },
        reasons_to_avoid={
            "onions": "Inhibits bean growth",
            "garlic": "Stunts beans",
            "fennel": "Allelopathic",
            "sunflowers": "Allelopathic compounds",
        }
    ),
    
    "edamame": CompanionInfo(
        good_companions=["corn", "squash", "cucumbers"],
        bad_companions=["onions", "garlic"],
        benefits={
            "corn": "Nitrogen fixation",
            "squash": "Ground cover",
            "cucumbers": "Nitrogen benefits",
        },
        reasons_to_avoid={
            "onions": "Inhibits growth",
            "garlic": "Stunts soybeans",
        }
    ),
    
    # ALLIUMS
    "chives": CompanionInfo(
        good_companions=["carrots", "tomatoes", "roses", "fruit_trees"],
        bad_companions=["beans", "peas"],
        benefits={
            "carrots": "Repels carrot fly and aphids",
            "tomatoes": "Deters aphids",
            "roses": "Prevents black spot and aphids",
            "fruit_trees": "Repels aphids and borers",
        },
        reasons_to_avoid={
            "beans": "Inhibits bean growth",
            "peas": "Stunts pea growth",
        }
    ),
    
    # GRAINS
    "corn": CompanionInfo(
        good_companions=["beans", "squash", "cucumbers", "melons", "peas"],
        bad_companions=["tomatoes", "celery"],
        benefits={
            "beans": "Three Sisters - beans climb corn and fix nitrogen",
            "squash": "Three Sisters - ground cover, moisture retention",
            "cucumbers": "Compatible growth",
            "melons": "Provides shade",
            "peas": "Nitrogen fixation",
        },
        reasons_to_avoid={
            "tomatoes": "Both attract hornworms",
            "celery": "Stunts corn growth",
        }
    ),
    
    "sorghum": CompanionInfo(
        good_companions=["beans", "peas", "cowpeas"],
        bad_companions=["none_known"],
        benefits={
            "beans": "Nitrogen fixation",
            "peas": "Legume companion",
            "cowpeas": "Nitrogen benefits",
        },
        reasons_to_avoid={}
    ),
    
    "millet": CompanionInfo(
        good_companions=["beans", "peas", "clover"],
        bad_companions=["none_known"],
        benefits={
            "beans": "Nitrogen fixation",
            "peas": "Legume benefits",
            "clover": "Ground cover",
        },
        reasons_to_avoid={}
    ),
    
    # COVER CROPS
    "clover": CompanionInfo(
        good_companions=["fruit_trees", "grains", "most_crops"],
        bad_companions=["none_known"],
        benefits={
            "fruit_trees": "Nitrogen fixation, ground cover",
            "grains": "Nitrogen benefits",
            "most_crops": "Living mulch, nitrogen fixation",
        },
        reasons_to_avoid={}
    ),
    
    "vetch": CompanionInfo(
        good_companions=["grains", "oats", "rye"],
        bad_companions=["none_known"],
        benefits={
            "grains": "Nitrogen fixation",
            "oats": "Support for vetch",
            "rye": "Cover crop mix",
        },
        reasons_to_avoid={}
    ),
    
    # MORE GRAINS & PSEUDOGRAINS
    "rye": CompanionInfo(
        good_companions=["vetch", "clover", "peas"],
        bad_companions=["none_known"],
        benefits={
            "vetch": "Cover crop companion",
            "clover": "Nitrogen fixation",
            "peas": "Legume benefits",
        },
        reasons_to_avoid={}
    ),
    
    "buckwheat": CompanionInfo(
        good_companions=["most_crops", "fruit_trees"],
        bad_companions=["none_known"],
        benefits={
            "most_crops": "Attracts beneficial insects, suppresses weeds",
            "fruit_trees": "Ground cover, pollinator attractor",
        },
        reasons_to_avoid={}
    ),
    
    "teff": CompanionInfo(
        good_companions=["beans", "peas"],
        bad_companions=["none_known"],
        benefits={
            "beans": "Nitrogen fixation",
            "peas": "Legume companion",
        },
        reasons_to_avoid={}
    ),
    
    # MORE VEGETABLES
    "eggplant": CompanionInfo(
        good_companions=["beans", "peppers", "spinach", "thyme"],
        bad_companions=["fennel"],
        benefits={
            "beans": "Nitrogen fixation",
            "peppers": "Similar growing conditions",
            "spinach": "Ground cover",
            "thyme": "Repels pests",
        },
        reasons_to_avoid={
            "fennel": "Allelopathic",
        }
    ),
    
    "horseradish": CompanionInfo(
        good_companions=["potatoes", "fruit_trees"],
        bad_companions=["none_known"],
        benefits={
            "potatoes": "Repels potato beetles",
            "fruit_trees": "General pest deterrent",
        },
        reasons_to_avoid={}
    ),
    
    "rhubarb": CompanionInfo(
        good_companions=["beans", "brassicas", "onions"],
        bad_companions=["none_known"],
        benefits={
            "beans": "Compatible growth",
            "brassicas": "Repels pests",
            "onions": "Pest deterrent",
        },
        reasons_to_avoid={}
    ),
    
    "jerusalem_artichoke": CompanionInfo(
        good_companions=["corn", "beans"],
        bad_companions=["none_known"],
        benefits={
            "corn": "Compatible height",
            "beans": "Nitrogen fixation",
        },
        reasons_to_avoid={}
    ),
    
    # ASIAN VEGETABLES
    "bok_choy": CompanionInfo(
        good_companions=["onions", "beets", "celery", "herbs"],
        bad_companions=["tomatoes", "peppers", "strawberries"],
        benefits={
            "onions": "Repels cabbage worms",
            "beets": "Compatible growth",
            "celery": "Deters pests",
            "herbs": "Pest control",
        },
        reasons_to_avoid={
            "tomatoes": "Competition",
            "peppers": "Different needs",
            "strawberries": "Incompatible",
        }
    ),
    
    "daikon": CompanionInfo(
        good_companions=["lettuce", "peas", "nasturtiums"],
        bad_companions=["hyssop"],
        benefits={
            "lettuce": "Compatible cool season",
            "peas": "Different root depths",
            "nasturtiums": "Pest control",
        },
        reasons_to_avoid={
            "hyssop": "Inhibits radish growth",
        }
    ),
    
    "napa_cabbage": CompanionInfo(
        good_companions=["onions", "celery", "beets", "herbs"],
        bad_companions=["tomatoes", "peppers", "strawberries"],
        benefits={
            "onions": "Repels cabbage worms",
            "celery": "Deters pests",
            "beets": "Compatible growth",
            "herbs": "Pest control",
        },
        reasons_to_avoid={
            "tomatoes": "Competition",
            "peppers": "Different needs",
            "strawberries": "Incompatible",
        }
    ),
    
    # MORE BERRIES
    "currants": CompanionInfo(
        good_companions=["onions", "tansy", "hyssop"],
        bad_companions=["none_known"],
        benefits={
            "onions": "Pest deterrent",
            "tansy": "Repels insects",
            "hyssop": "Attracts pollinators",
        },
        reasons_to_avoid={}
    ),
    
    "gooseberries": CompanionInfo(
        good_companions=["tomatoes", "beans", "tansy"],
        bad_companions=["none_known"],
        benefits={
            "tomatoes": "Compatible growth",
            "beans": "Nitrogen fixation",
            "tansy": "Pest control",
        },
        reasons_to_avoid={}
    ),
    
    "elderberries": CompanionInfo(
        good_companions=["comfrey", "nasturtiums", "clover"],
        bad_companions=["none_known"],
        benefits={
            "comfrey": "Nutrient accumulator",
            "nasturtiums": "Pest control",
            "clover": "Ground cover, nitrogen",
        },
        reasons_to_avoid={}
    ),
    
    # MORE TREE FRUITS
    "apricot": CompanionInfo(
        good_companions=["garlic", "chives", "nasturtiums", "tansy"],
        bad_companions=["grass", "potatoes"],
        benefits={
            "garlic": "Repels borers",
            "chives": "Deters aphids",
            "nasturtiums": "Trap crop",
            "tansy": "Repels insects",
        },
        reasons_to_avoid={
            "grass": "Competition",
            "potatoes": "Disease risk",
        }
    ),
    
    "figs": CompanionInfo(
        good_companions=["rue", "comfrey", "nasturtiums"],
        bad_companions=["none_known"],
        benefits={
            "rue": "Repels flies",
            "comfrey": "Nutrient accumulator",
            "nasturtiums": "Pest control",
        },
        reasons_to_avoid={}
    ),
    
    "persimmon": CompanionInfo(
        good_companions=["clover", "comfrey", "nasturtiums"],
        bad_companions=["grass"],
        benefits={
            "clover": "Ground cover, nitrogen",
            "comfrey": "Nutrient mining",
            "nasturtiums": "Pest deterrent",
        },
        reasons_to_avoid={
            "grass": "Competition",
        }
    ),
    
    "pomegranate": CompanionInfo(
        good_companions=["nasturtiums", "comfrey", "yarrow"],
        bad_companions=["none_known"],
        benefits={
            "nasturtiums": "Pest control",
            "comfrey": "Nutrient accumulator",
            "yarrow": "Beneficial insects",
        },
        reasons_to_avoid={}
    ),
    
    "quince": CompanionInfo(
        good_companions=["garlic", "chives", "nasturtiums"],
        bad_companions=["grass", "potatoes"],
        benefits={
            "garlic": "Pest deterrent",
            "chives": "Repels aphids",
            "nasturtiums": "Trap crop",
        },
        reasons_to_avoid={
            "grass": "Competition",
            "potatoes": "Disease risk",
        }
    ),
    
    # MORE HERBS
    "lemongrass": CompanionInfo(
        good_companions=["tomatoes", "peppers", "tropical_plants"],
        bad_companions=["none_known"],
        benefits={
            "tomatoes": "Repels mosquitoes and pests",
            "peppers": "Pest deterrent",
            "tropical_plants": "Compatible conditions",
        },
        reasons_to_avoid={}
    ),
    
    "stevia": CompanionInfo(
        good_companions=["most_vegetables", "herbs"],
        bad_companions=["none_known"],
        benefits={
            "most_vegetables": "Attracts beneficial insects",
            "herbs": "Compatible herb companion",
        },
        reasons_to_avoid={}
    ),
    
    "catnip": CompanionInfo(
        good_companions=["eggplant", "squash", "most_vegetables"],
        bad_companions=["none_known"],
        benefits={
            "eggplant": "Repels flea beetles",
            "squash": "Deters squash bugs",
            "most_vegetables": "General pest deterrent, attracts beneficial insects",
        },
        reasons_to_avoid={}
    ),
    
    "borage": CompanionInfo(
        good_companions=["tomatoes", "squash", "strawberries", "most_crops"],
        bad_companions=["none_known"],
        benefits={
            "tomatoes": "Repels hornworms, improves flavor",
            "squash": "Deters worms, attracts pollinators",
            "strawberries": "Enhances growth and flavor",
            "most_crops": "Attracts pollinators and beneficial insects",
        },
        reasons_to_avoid={}
    ),
    
    "lovage": CompanionInfo(
        good_companions=["most_vegetables", "beans"],
        bad_companions=["none_known"],
        benefits={
            "most_vegetables": "General health improver",
            "beans": "Enhances growth",
        },
        reasons_to_avoid={}
    ),
    
    # MORE LEGUMES
    "adzuki_beans": CompanionInfo(
        good_companions=["corn", "squash", "cucumbers"],
        bad_companions=["onions", "garlic"],
        benefits={
            "corn": "Nitrogen fixation",
            "squash": "Ground cover",
            "cucumbers": "Nitrogen benefits",
        },
        reasons_to_avoid={
            "onions": "Inhibits growth",
            "garlic": "Stunts beans",
        }
    ),
    
    "mung_beans": CompanionInfo(
        good_companions=["corn", "cucumbers", "radishes"],
        bad_companions=["onions", "garlic"],
        benefits={
            "corn": "Nitrogen fixation",
            "cucumbers": "Nitrogen benefits",
            "radishes": "Pest control",
        },
        reasons_to_avoid={
            "onions": "Inhibits growth",
            "garlic": "Stunts beans",
        }
    ),
    
    "cowpeas": CompanionInfo(
        good_companions=["corn", "sorghum", "millet"],
        bad_companions=["onions", "garlic"],
        benefits={
            "corn": "Nitrogen fixation",
            "sorghum": "Compatible growth",
            "millet": "Nitrogen benefits",
        },
        reasons_to_avoid={
            "onions": "Inhibits growth",
            "garlic": "Stunts cowpeas",
        }
    ),
    
    "pigeon_pea": CompanionInfo(
        good_companions=["corn", "sorghum", "tropical_crops"],
        bad_companions=["none_known"],
        benefits={
            "corn": "Nitrogen fixation",
            "sorghum": "Compatible growth",
            "tropical_crops": "Similar conditions",
        },
        reasons_to_avoid={}
    ),
    
    # FLOWERS (BENEFICIAL)
    "calendula": CompanionInfo(
        good_companions=["tomatoes", "asparagus", "most_vegetables"],
        bad_companions=["none_known"],
        benefits={
            "tomatoes": "Repels aphids and whiteflies",
            "asparagus": "Repels asparagus beetles",
            "most_vegetables": "Attracts beneficial insects, trap crop for aphids",
        },
        reasons_to_avoid={}
    ),
    
    "sweet_alyssum": CompanionInfo(
        good_companions=["potatoes", "brassicas", "most_vegetables"],
        bad_companions=["none_known"],
        benefits={
            "potatoes": "Attracts beneficial insects",
            "brassicas": "Attracts predatory wasps",
            "most_vegetables": "Ground cover, beneficial insect attractor",
        },
        reasons_to_avoid={}
    ),
    
    "cosmos": CompanionInfo(
        good_companions=["most_vegetables", "corn"],
        bad_companions=["none_known"],
        benefits={
            "most_vegetables": "Attracts beneficial insects and pollinators",
            "corn": "Attracts lacewings",
        },
        reasons_to_avoid={}
    ),
    
    "zinnia": CompanionInfo(
        good_companions=["tomatoes", "cucumbers", "most_vegetables"],
        bad_companions=["none_known"],
        benefits={
            "tomatoes": "Attracts ladybugs",
            "cucumbers": "Attracts pollinators",
            "most_vegetables": "Attracts beneficial insects",
        },
        reasons_to_avoid={}
    ),
    
    # MISSING COMMON VEGETABLES
    "artichoke": CompanionInfo(
        good_companions=["sunflowers", "tarragon", "peas"],
        bad_companions=["none_known"],
        benefits={
            "sunflowers": "Attracts beneficial insects",
            "tarragon": "General pest deterrent",
            "peas": "Nitrogen fixation",
        },
        reasons_to_avoid={}
    ),
    
    "chicory": CompanionInfo(
        good_companions=["carrots", "lettuce", "onions"],
        bad_companions=["none_known"],
        benefits={
            "carrots": "Compatible growth",
            "lettuce": "Similar growing conditions",
            "onions": "Pest deterrent",
        },
        reasons_to_avoid={}
    ),
    
    # MISSING LEGUMES
    "black_eyed_peas": CompanionInfo(
        good_companions=["corn", "squash", "cucumbers"],
        bad_companions=["onions", "garlic"],
        benefits={
            "corn": "Nitrogen fixation",
            "squash": "Ground cover",
            "cucumbers": "Nitrogen benefits",
        },
        reasons_to_avoid={
            "onions": "Inhibits growth",
            "garlic": "Stunts beans",
        }
    ),
    
    "broad_bean": CompanionInfo(
        good_companions=["potatoes", "corn", "cucumbers", "brassicas"],
        bad_companions=["onions", "garlic", "fennel"],
        benefits={
            "potatoes": "Nitrogen fixation",
            "corn": "Compatible growth",
            "cucumbers": "Adds nitrogen",
            "brassicas": "Nitrogen benefits brassicas",
        },
        reasons_to_avoid={
            "onions": "Inhibits growth",
            "garlic": "Stunts beans",
            "fennel": "Allelopathic",
        }
    ),
    
    "black_turtle_bean": CompanionInfo(
        good_companions=["corn", "squash", "cucumbers"],
        bad_companions=["onions", "garlic", "fennel"],
        benefits={
            "corn": "Three Sisters - nitrogen fixation",
            "squash": "Ground cover",
            "cucumbers": "Nitrogen benefits",
        },
        reasons_to_avoid={
            "onions": "Inhibits growth",
            "garlic": "Stunts beans",
            "fennel": "Allelopathic",
        }
    ),
    
    "cannellini_bean": CompanionInfo(
        good_companions=["corn", "squash", "cucumbers"],
        bad_companions=["onions", "garlic"],
        benefits={
            "corn": "Nitrogen fixation",
            "squash": "Ground cover",
            "cucumbers": "Nitrogen benefits",
        },
        reasons_to_avoid={
            "onions": "Inhibits growth",
            "garlic": "Stunts beans",
        }
    ),
    
    # MISSING NUTS
    "cashews": CompanionInfo(
        good_companions=["comfrey", "clover", "tropical_plants"],
        bad_companions=["none_known"],
        benefits={
            "comfrey": "Nutrient accumulator",
            "clover": "Ground cover, nitrogen",
            "tropical_plants": "Similar conditions",
        },
        reasons_to_avoid={}
    ),
    
    "chestnuts": CompanionInfo(
        good_companions=["clover", "comfrey", "nasturtiums"],
        bad_companions=["grass"],
        benefits={
            "clover": "Nitrogen fixation",
            "comfrey": "Nutrient mining",
            "nasturtiums": "Pest control",
        },
        reasons_to_avoid={
            "grass": "Competition",
        }
    ),
    
    "black_walnut": CompanionInfo(
        good_companions=["none_recommended"],
        bad_companions=["most_plants"],
        benefits={},
        reasons_to_avoid={
            "most_plants": "Juglone toxicity - even more toxic than English walnut",
        }
    ),
    
    "butternut": CompanionInfo(
        good_companions=["none_recommended"],
        bad_companions=["most_plants"],
        benefits={},
        reasons_to_avoid={
            "most_plants": "Juglone toxicity similar to black walnut",
        }
    ),
    
    "brazil_nuts": CompanionInfo(
        good_companions=["tropical_plants", "comfrey"],
        bad_companions=["none_known"],
        benefits={
            "tropical_plants": "Similar rainforest conditions",
            "comfrey": "Nutrient accumulator",
        },
        reasons_to_avoid={}
    ),
    
    "pistachios": CompanionInfo(
        good_companions=["clover", "comfrey"],
        bad_companions=["grass"],
        benefits={
            "clover": "Ground cover, nitrogen",
            "comfrey": "Nutrient mining",
        },
        reasons_to_avoid={
            "grass": "Competition",
        }
    ),
    
    # MISSING TROPICAL FRUITS
    "breadfruit": CompanionInfo(
        good_companions=["sweet_potato", "beans", "tropical_plants"],
        bad_companions=["none_known"],
        benefits={
            "sweet_potato": "Ground cover",
            "beans": "Nitrogen fixation",
            "tropical_plants": "Similar conditions",
        },
        reasons_to_avoid={}
    ),
    
    "cherimoya": CompanionInfo(
        good_companions=["comfrey", "nasturtiums", "clover"],
        bad_companions=["none_known"],
        benefits={
            "comfrey": "Nutrient accumulator",
            "nasturtiums": "Pest control",
            "clover": "Ground cover",
        },
        reasons_to_avoid={}
    ),
    
    "clementine": CompanionInfo(
        good_companions=["nasturtiums", "yarrow", "dill"],
        bad_companions=["none_known"],
        benefits={
            "nasturtiums": "Pest control",
            "yarrow": "Beneficial insects",
            "dill": "Attracts predators",
        },
        reasons_to_avoid={}
    ),
    
    "coconut": CompanionInfo(
        good_companions=["tropical_plants", "sweet_potato", "taro"],
        bad_companions=["none_known"],
        benefits={
            "tropical_plants": "Similar conditions",
            "sweet_potato": "Ground cover",
            "taro": "Compatible tropical",
        },
        reasons_to_avoid={}
    ),
    
    # MISSING BERRIES
    "bilberry": CompanionInfo(
        good_companions=["azaleas", "blueberries", "rhododendrons"],
        bad_companions=["vegetables"],
        benefits={
            "azaleas": "Similar acidic soil needs",
            "blueberries": "Acid-loving companions",
            "rhododendrons": "Compatible pH",
        },
        reasons_to_avoid={
            "vegetables": "Different soil pH requirements",
        }
    ),
    
    "cape_gooseberry": CompanionInfo(
        good_companions=["tomatoes", "peppers", "basil"],
        bad_companions=["none_known"],
        benefits={
            "tomatoes": "Similar nightshade family",
            "peppers": "Compatible growth",
            "basil": "Pest deterrent",
        },
        reasons_to_avoid={}
    ),
}


def get_generic_companion_info(crop_name: str) -> CompanionInfo:
    """
    Generate generic companion planting info for crops without specific data.
    Based on common gardening principles.
    """
    return CompanionInfo(
        good_companions=["comfrey", "clover", "nasturtiums", "marigolds"],
        bad_companions=["none_known"],
        benefits={
            "comfrey": "Dynamic accumulator, improves soil",
            "clover": "Nitrogen fixation, ground cover",
            "nasturtiums": "General pest deterrent, trap crop",
            "marigolds": "Nematode control, pest deterrent",
        },
        reasons_to_avoid={}
    )


def get_companion_info(crop: str) -> Optional[CompanionInfo]:
    """
    Get companion planting information for a crop.
    Falls back to generic companion info if specific data not available.
    
    Args:
        crop: Crop name (case-insensitive)
    
    Returns:
        CompanionInfo (always returns data, uses generic fallback if needed)
    """
    crop_lower = crop.lower()
    
    # Direct match
    if crop_lower in COMPANION_DATABASE:
        return COMPANION_DATABASE[crop_lower]
    
    # Check if crop name contains a key (e.g., "cherry tomatoes" -> "tomatoes")
    for key in COMPANION_DATABASE:
        if key in crop_lower:
            return COMPANION_DATABASE[key]
    
    # Check for brassica family
    brassica_crops = ["broccoli", "cauliflower", "cabbage", "kale", "brussels sprouts", "collards"]
    if any(b in crop_lower for b in brassica_crops):
        return COMPANION_DATABASE["brassicas"]
    
    # Default to herbs for herb crops
    herb_crops = ["parsley", "cilantro", "oregano", "thyme", "rosemary", "sage", "mint", "dill"]
    if any(h in crop_lower for h in herb_crops):
        return COMPANION_DATABASE["herbs"]
    
    # Fall back to generic companion info for all other crops
    return get_generic_companion_info(crop)


def get_companion_recommendations(crops: List[str]) -> Dict[str, Dict[str, List[Tuple[str, str]]]]:
    """
    Get companion planting recommendations for a list of crops.
    
    Args:
        crops: List of crop names
    
    Returns:
        Dict mapping crop -> {"good": [(companion, benefit)], "bad": [(crop, reason)]}
    """
    recommendations = {}
    
    for crop in crops:
        info = get_companion_info(crop)
        if not info:
            continue
        
        good_pairs = []
        bad_pairs = []
        
        # Find good companions that are in the crop list
        for other_crop in crops:
            if other_crop.lower() == crop.lower():
                continue
            
            other_lower = other_crop.lower()
            
            # Check if other crop is a good companion
            for companion in info.good_companions:
                if companion in other_lower or other_lower in companion:
                    benefit = info.benefits.get(companion, "Beneficial companion")
                    good_pairs.append((other_crop, benefit))
                    break
            
            # Check if other crop is a bad companion
            for antagonist in info.bad_companions:
                if antagonist in other_lower or other_lower in antagonist:
                    reason = info.reasons_to_avoid.get(antagonist, "Not recommended together")
                    bad_pairs.append((other_crop, reason))
                    break
        
        recommendations[crop] = {
            "good": good_pairs,
            "bad": bad_pairs,
        }
    
    return recommendations


def generate_companion_planting_guide(crops: List[str]) -> str:
    """
    Generate a formatted companion planting guide for selected crops.
    
    Args:
        crops: List of crop names
    
    Returns:
        Formatted guide string
    """
    if not crops:
        return ""
    
    recommendations = get_companion_recommendations(crops)
    
    if not recommendations:
        return ""
    
    guide = "\n🌿 Companion Planting Guide\n\n"
    guide += "Maximize your garden's potential by planting compatible crops together!\n\n"
    
    for crop, pairings in recommendations.items():
        if not pairings["good"] and not pairings["bad"]:
            continue
        
        guide += f"**{crop.title()}**:\n"
        
        if pairings["good"]:
            guide += "  ✓ Good Companions in Your Plan:\n"
            for companion, benefit in pairings["good"]:
                guide += f"    • {companion.title()}: {benefit}\n"
        
        if pairings["bad"]:
            guide += "  ✗ Avoid Planting Near:\n"
            for antagonist, reason in pairings["bad"]:
                guide += f"    • {antagonist.title()}: {reason}\n"
        
        guide += "\n"
    
    # Add general tips
    guide += "**General Companion Planting Tips**:\n"
    guide += "  • Plant strong-scented herbs throughout to deter pests\n"
    guide += "  • Marigolds and nasturtiums are universal pest deterrents\n"
    guide += "  • Mix different plant families to confuse pests\n"
    guide += "  • Taller plants can provide shade for heat-sensitive crops\n"
    guide += "  • Deep-rooted and shallow-rooted plants use space efficiently\n"
    
    return guide


def get_all_good_companions(crop: str) -> List[Tuple[str, str]]:
    """
    Get all possible good companions for a crop (not just from user's selection).
    
    Args:
        crop: Crop name
    
    Returns:
        List of (companion, benefit) tuples
    """
    info = get_companion_info(crop)
    if not info:
        return []
    
    return [(companion, info.benefits.get(companion, "Beneficial companion")) 
            for companion in info.good_companions]


def get_companion_planting_suggestions(crop: str, max_suggestions: int = 5) -> str:
    """
    Get companion planting suggestions for adding to a single crop.
    
    Args:
        crop: Crop name
        max_suggestions: Maximum number of suggestions
    
    Returns:
        Formatted suggestion string
    """
    companions = get_all_good_companions(crop)
    if not companions:
        return ""
    
    suggestions = f"\nConsider planting these companions with {crop.title()}:\n"
    for companion, benefit in companions[:max_suggestions]:
        suggestions += f"  • {companion.title()}: {benefit}\n"
    
    return suggestions
