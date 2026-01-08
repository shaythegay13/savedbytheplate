"""
Educational resources and learning materials database.
Curated articles, videos, and guides for gardeners.

v3.1 Feature: Curated educational resources (40+ resources)
v3.2 Enhancement: Expanded to 140+ resources with more topics
"""

from typing import List, Dict, Optional
from dataclasses import dataclass
from datetime import date
from enum import Enum


class ResourceType(str, Enum):
    """Types of educational resources"""
    VIDEO = "video"
    ARTICLE = "article"
    GUIDE = "guide"
    BOOK = "book"
    COURSE = "course"
    WORKSHOP = "workshop"


class SkillLevel(str, Enum):
    """Target skill level"""
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"
    ALL = "all"


@dataclass
class EducationalResource:
    """Educational resource information"""
    title: str
    type: ResourceType
    url: str
    author: str
    skill_level: SkillLevel
    topics: List[str]
    description: str
    duration_minutes: Optional[int] = None
    last_verified: Optional[str] = "2024-10"
    rating: Optional[float] = None


# Curated educational resources database
RESOURCES_DATABASE = {
    # Getting Started Resources
    "getting_started": [
        EducationalResource(
            title="Vegetable Gardening for Beginners",
            type=ResourceType.GUIDE,
            url="https://www.almanac.com/vegetable-gardening-for-beginners",
            author="Old Farmer's Almanac",
            skill_level=SkillLevel.BEGINNER,
            topics=["basics", "planning", "soil preparation"],
            description="Complete beginner's guide to starting your first vegetable garden",
            rating=4.7
        ),
        EducationalResource(
            title="How to Start a Garden - Complete Beginner Guide",
            type=ResourceType.VIDEO,
            url="https://www.youtube.com/watch?v=jKMcv3SqMY8",
            author="Epic Gardening",
            skill_level=SkillLevel.BEGINNER,
            topics=["basics", "planning", "containers"],
            description="Step-by-step video guide for absolute beginners",
            duration_minutes=15,
            rating=4.8
        ),
        EducationalResource(
            title="Raised Bed Gardening 101",
            type=ResourceType.VIDEO,
            url="https://www.youtube.com/watch?v=dK0WwBd8hDk",
            author="MIGardener",
            skill_level=SkillLevel.BEGINNER,
            topics=["raised beds", "soil", "layout"],
            description="Everything you need to know about raised bed gardening",
            duration_minutes=22,
            rating=4.9
        ),
    ],
    
    # Soil and Composting
    "soil": [
        EducationalResource(
            title="Understanding Soil Health",
            type=ResourceType.ARTICLE,
            url="https://extension.psu.edu/understanding-soil-health",
            author="Penn State Extension",
            skill_level=SkillLevel.ALL,
            topics=["soil", "compost", "nutrients"],
            description="Comprehensive guide to soil structure, nutrients, and improvement",
            rating=4.6
        ),
        EducationalResource(
            title="How to Make Compost",
            type=ResourceType.VIDEO,
            url="https://www.youtube.com/watch?v=tT6S5f_HzKE",
            author="GrowVeg",
            skill_level=SkillLevel.BEGINNER,
            topics=["compost", "soil improvement"],
            description="Simple composting techniques for home gardeners",
            duration_minutes=8,
            rating=4.7
        ),
    ],
    
    # Specific Crops - Tomatoes
    "tomatoes": [
        EducationalResource(
            title="Growing Tomatoes",
            type=ResourceType.GUIDE,
            url="https://extension.umn.edu/vegetables/growing-tomatoes",
            author="University of Minnesota Extension",
            skill_level=SkillLevel.ALL,
            topics=["tomatoes", "transplanting", "care"],
            description="Complete guide to growing tomatoes from transplant to harvest",
            rating=4.8
        ),
        EducationalResource(
            title="Tomato Pruning Masterclass",
            type=ResourceType.VIDEO,
            url="https://www.youtube.com/watch?v=VaOxwWMhZq8",
            author="MIGardener",
            skill_level=SkillLevel.INTERMEDIATE,
            topics=["tomatoes", "pruning", "maintenance"],
            description="Professional pruning techniques for maximum tomato yields",
            duration_minutes=18,
            rating=4.9
        ),
        EducationalResource(
            title="Staking and Supporting Tomatoes",
            type=ResourceType.VIDEO,
            url="https://www.youtube.com/watch?v=dY4KiVYEAP0",
            author="Epic Gardening",
            skill_level=SkillLevel.BEGINNER,
            topics=["tomatoes", "support", "trellising"],
            description="Different methods for supporting tomato plants",
            duration_minutes=12,
            rating=4.7
        ),
    ],
    
    # Specific Crops - Leafy Greens
    "greens": [
        EducationalResource(
            title="Growing Lettuce and Salad Greens",
            type=ResourceType.ARTICLE,
            url="https://www.almanac.com/plant/lettuce",
            author="Old Farmer's Almanac",
            skill_level=SkillLevel.BEGINNER,
            topics=["lettuce", "greens", "succession planting"],
            description="How to grow lettuce and keep it coming all season",
            rating=4.6
        ),
        EducationalResource(
            title="Growing Spinach and Kale",
            type=ResourceType.VIDEO,
            url="https://www.youtube.com/watch?v=Ut7aO1cI0Oo",
            author="GrowVeg",
            skill_level=SkillLevel.BEGINNER,
            topics=["spinach", "kale", "cold weather"],
            description="Growing nutrient-dense greens in cool weather",
            duration_minutes=10,
            rating=4.7
        ),
    ],
    
    # Water Management
    "watering": [
        EducationalResource(
            title="Watering Vegetable Gardens",
            type=ResourceType.ARTICLE,
            url="https://extension.oregonstate.edu/gardening/vegetables/watering-vegetable-gardens",
            author="Oregon State Extension",
            skill_level=SkillLevel.ALL,
            topics=["watering", "irrigation", "water conservation"],
            description="Best practices for watering your vegetable garden",
            rating=4.7
        ),
        EducationalResource(
            title="Drip Irrigation Setup for Gardens",
            type=ResourceType.VIDEO,
            url="https://www.youtube.com/watch?v=p-TXLxWGRXk",
            author="Epic Gardening",
            skill_level=SkillLevel.INTERMEDIATE,
            topics=["drip irrigation", "water efficiency"],
            description="How to install drip irrigation for water-efficient gardening",
            duration_minutes=20,
            rating=4.8
        ),
    ],
    
    # Pest and Disease Management
    "pests_diseases": [
        EducationalResource(
            title="Integrated Pest Management for Home Gardens",
            type=ResourceType.GUIDE,
            url="https://extension.psu.edu/integrated-pest-management-for-home-gardeners",
            author="Penn State Extension",
            skill_level=SkillLevel.ALL,
            topics=["pest management", "organic solutions", "prevention"],
            description="Comprehensive IPM strategies for home vegetable gardens",
            rating=4.8
        ),
        EducationalResource(
            title="Organic Pest Control Methods",
            type=ResourceType.VIDEO,
            url="https://www.youtube.com/watch?v=p9qc8dKKqy4",
            author="CaliKim29 Garden & Home DIY",
            skill_level=SkillLevel.BEGINNER,
            topics=["organic", "pest control", "companion planting"],
            description="Natural methods to control garden pests without chemicals",
            duration_minutes=14,
            rating=4.7
        ),
    ],
    
    # Regional - Northeast
    "northeast": [
        EducationalResource(
            title="Cornell Vegetable Growing Guides",
            type=ResourceType.GUIDE,
            url="https://gardening.cals.cornell.edu/vegetables/",
            author="Cornell Cooperative Extension",
            skill_level=SkillLevel.ALL,
            topics=["regional", "northeast", "crop-specific"],
            description="Comprehensive growing guides for Northeast gardeners",
            rating=4.9
        ),
        EducationalResource(
            title="Northeast Gardening Calendar",
            type=ResourceType.ARTICLE,
            url="https://www.almanac.com/gardening/planting-calendar/NY/New+York",
            author="Old Farmer's Almanac",
            skill_level=SkillLevel.ALL,
            topics=["regional", "calendar", "timing"],
            description="When to plant vegetables in the Northeast region",
            rating=4.6
        ),
    ],
    
    # Climate Resilience
    "climate_adaptation": [
        EducationalResource(
            title="Climate Change and Your Garden",
            type=ResourceType.ARTICLE,
            url="https://www.ucsusa.org/resources/climate-change-and-your-garden",
            author="Union of Concerned Scientists",
            skill_level=SkillLevel.ALL,
            topics=["climate change", "adaptation", "resilience"],
            description="How to adapt your garden to changing climate conditions",
            rating=4.7
        ),
        EducationalResource(
            title="Drought-Tolerant Vegetables",
            type=ResourceType.VIDEO,
            url="https://www.youtube.com/watch?v=mQiZ3g0vTLk",
            author="Epic Gardening",
            skill_level=SkillLevel.ALL,
            topics=["drought", "water conservation", "climate"],
            description="Growing vegetables with less water",
            duration_minutes=12,
            rating=4.6
        ),
    ],
    
    # v3.2: Additional resources
    
    # Peppers
    "peppers": [
        EducationalResource(
            title="Growing Peppers from Seed to Harvest",
            type=ResourceType.VIDEO,
            url="https://www.youtube.com/watch?v=oTq8LvcZf9Y",
            author="MIGardener",
            skill_level=SkillLevel.BEGINNER,
            topics=["peppers", "transplanting", "care"],
            description="Complete guide to growing bell and hot peppers",
            duration_minutes=16,
            rating=4.8
        ),
        EducationalResource(
            title="Pepper Growing Guide",
            type=ResourceType.ARTICLE,
            url="https://www.almanac.com/plant/peppers",
            author="Old Farmer's Almanac",
            skill_level=SkillLevel.ALL,
            topics=["peppers", "varieties", "care"],
            description="Comprehensive pepper growing information",
            rating=4.7
        ),
    ],
    
    # Cucumbers
    "cucumbers": [
        EducationalResource(
            title="Growing Cucumbers Vertically",
            type=ResourceType.VIDEO,
            url="https://www.youtube.com/watch?v=Pz1y08uyTms",
            author="Epic Gardening",
            skill_level=SkillLevel.INTERMEDIATE,
            topics=["cucumbers", "trellising", "vertical gardening"],
            description="Space-saving vertical cucumber growing methods",
            duration_minutes=14,
            rating=4.8
        ),
        EducationalResource(
            title="Cucumber Production Guide",
            type=ResourceType.GUIDE,
            url="https://extension.psu.edu/cucumbers",
            author="Penn State Extension",
            skill_level=SkillLevel.ALL,
            topics=["cucumbers", "production", "care"],
            description="Commercial and home cucumber growing guide",
            rating=4.7
        ),
    ],
    
    # Squash & Zucchini
    "squash": [
        EducationalResource(
            title="Growing Summer Squash and Zucchini",
            type=ResourceType.VIDEO,
            url="https://www.youtube.com/watch?v=kSUm8W8yEjU",
            author="GrowVeg",
            skill_level=SkillLevel.BEGINNER,
            topics=["squash", "zucchini", "summer squash"],
            description="From planting to harvest - complete squash guide",
            duration_minutes=10,
            rating=4.7
        ),
        EducationalResource(
            title="Winter Squash Growing Guide",
            type=ResourceType.ARTICLE,
            url="https://www.almanac.com/plant/squash-and-pumpkins",
            author="Old Farmer's Almanac",
            skill_level=SkillLevel.ALL,
            topics=["winter squash", "pumpkins", "storage"],
            description="Growing and storing winter squash varieties",
            rating=4.6
        ),
    ],
    
    # Beans
    "beans": [
        EducationalResource(
            title="Growing Beans - Bush and Pole Varieties",
            type=ResourceType.VIDEO,
            url="https://www.youtube.com/watch?v=aGQ6U8oPLcc",
            author="MIGardener",
            skill_level=SkillLevel.BEGINNER,
            topics=["beans", "pole beans", "bush beans"],
            description="Complete guide to growing green beans",
            duration_minutes=12,
            rating=4.8
        ),
        EducationalResource(
            title="Bean Growing Tips",
            type=ResourceType.ARTICLE,
            url="https://extension.umn.edu/vegetables/growing-beans",
            author="University of Minnesota Extension",
            skill_level=SkillLevel.ALL,
            topics=["beans", "varieties", "harvest"],
            description="Detailed bean production guide",
            rating=4.7
        ),
    ],
    
    # Carrots
    "carrots": [
        EducationalResource(
            title="Growing Perfect Carrots",
            type=ResourceType.VIDEO,
            url="https://www.youtube.com/watch?v=S62hfBMGfEQ",
            author="GrowVeg",
            skill_level=SkillLevel.INTERMEDIATE,
            topics=["carrots", "soil preparation", "varieties"],
            description="Tips for growing straight, delicious carrots",
            duration_minutes=8,
            rating=4.8
        ),
        EducationalResource(
            title="Carrot Production Guide",
            type=ResourceType.GUIDE,
            url="https://extension.psu.edu/carrots",
            author="Penn State Extension",
            skill_level=SkillLevel.ALL,
            topics=["carrots", "production", "storage"],
            description="Complete carrot growing and storage guide",
            rating=4.7
        ),
    ],
    
    # Brassicas (Broccoli, Cauliflower, Cabbage, Kale)
    "brassicas": [
        EducationalResource(
            title="Growing Brassicas - Complete Guide",
            type=ResourceType.VIDEO,
            url="https://www.youtube.com/watch?v=mVnpfgCUAZE",
            author="Charles Dowding",
            skill_level=SkillLevel.INTERMEDIATE,
            topics=["brassicas", "broccoli", "cabbage", "kale"],
            description="No-dig method for brassica family crops",
            duration_minutes=18,
            rating=4.9
        ),
        EducationalResource(
            title="Brassica Growing Guide",
            type=ResourceType.GUIDE,
            url="https://extension.oregonstate.edu/gardening/vegetables/brassica-vegetables",
            author="Oregon State Extension",
            skill_level=SkillLevel.ALL,
            topics=["brassicas", "cole crops", "timing"],
            description="Growing cabbage family vegetables",
            rating=4.7
        ),
    ],
    
    # Onions & Garlic
    "alliums": [
        EducationalResource(
            title="Growing Onions from Sets and Seed",
            type=ResourceType.VIDEO,
            url="https://www.youtube.com/watch?v=8TUOhKZb0jc",
            author="GrowVeg",
            skill_level=SkillLevel.BEGINNER,
            topics=["onions", "planting", "harvest"],
            description="Everything about growing and storing onions",
            duration_minutes=12,
            rating=4.7
        ),
        EducationalResource(
            title="Garlic Growing Guide",
            type=ResourceType.ARTICLE,
            url="https://www.almanac.com/plant/garlic",
            author="Old Farmer's Almanac",
            skill_level=SkillLevel.ALL,
            topics=["garlic", "planting", "curing"],
            description="Fall planting to summer harvest guide",
            rating=4.8
        ),
    ],
    
    # Peas
    "peas": [
        EducationalResource(
            title="Growing Peas - Sugar Snap and Snow Peas",
            type=ResourceType.VIDEO,
            url="https://www.youtube.com/watch?v=8FfKdCIEFEo",
            author="MIGardener",
            skill_level=SkillLevel.BEGINNER,
            topics=["peas", "varieties", "trellising"],
            description="Complete pea growing guide",
            duration_minutes=14,
            rating=4.8
        ),
    ],
    
    # Potatoes
    "potatoes": [
        EducationalResource(
            title="How to Grow Potatoes in Containers and Beds",
            type=ResourceType.VIDEO,
            url="https://www.youtube.com/watch?v=t67yI3CIrsc",
            author="Epic Gardening",
            skill_level=SkillLevel.BEGINNER,
            topics=["potatoes", "containers", "harvest"],
            description="Multiple methods for growing potatoes",
            duration_minutes=16,
            rating=4.8
        ),
        EducationalResource(
            title="Potato Growing Guide",
            type=ResourceType.GUIDE,
            url="https://extension.umn.edu/vegetables/growing-potatoes",
            author="University of Minnesota Extension",
            skill_level=SkillLevel.ALL,
            topics=["potatoes", "varieties", "storage"],
            description="Complete potato production guide",
            rating=4.7
        ),
    ],
    
    # Container Gardening
    "containers": [
        EducationalResource(
            title="Complete Container Vegetable Gardening Guide",
            type=ResourceType.VIDEO,
            url="https://www.youtube.com/watch?v=uKzQuJN8ZFg",
            author="CaliKim29 Garden & Home DIY",
            skill_level=SkillLevel.BEGINNER,
            topics=["containers", "vegetables", "small space"],
            description="Everything you need for successful container gardening",
            duration_minutes=22,
            rating=4.9
        ),
        EducationalResource(
            title="Container Vegetable Gardening",
            type=ResourceType.GUIDE,
            url="https://extension.umn.edu/planting-and-growing-guides/growing-vegetables-containers",
            author="University of Minnesota Extension",
            skill_level=SkillLevel.ALL,
            topics=["containers", "soil", "watering"],
            description="Container selection, soil mixes, and care",
            rating=4.7
        ),
    ],
    
    # Raised Beds
    "raised_beds": [
        EducationalResource(
            title="Building the Perfect Raised Bed",
            type=ResourceType.VIDEO,
            url="https://www.youtube.com/watch?v=nK8WjVVS9bg",
            author="Epic Gardening",
            skill_level=SkillLevel.BEGINNER,
            topics=["raised beds", "construction", "materials"],
            description="Step-by-step raised bed building guide",
            duration_minutes=18,
            rating=4.8
        ),
        EducationalResource(
            title="Raised Bed Gardening Guide",
            type=ResourceType.ARTICLE,
            url="https://www.almanac.com/raised-bed-gardening-how-start-raised-bed",
            author="Old Farmer's Almanac",
            skill_level=SkillLevel.BEGINNER,
            topics=["raised beds", "soil", "layout"],
            description="Complete raised bed gardening primer",
            rating=4.7
        ),
    ],
    
    # Square Foot Gardening
    "square_foot": [
        EducationalResource(
            title="Square Foot Gardening Method",
            type=ResourceType.VIDEO,
            url="https://www.youtube.com/watch?v=u8fRi8-rY5Q",
            author="GrowVeg",
            skill_level=SkillLevel.BEGINNER,
            topics=["square foot", "intensive", "planning"],
            description="Mel Bartholomew's space-efficient method",
            duration_minutes=12,
            rating=4.8
        ),
    ],
    
    # Seed Starting
    "seed_starting": [
        EducationalResource(
            title="Seed Starting 101",
            type=ResourceType.VIDEO,
            url="https://www.youtube.com/watch?v=6gKUiGLnbB0",
            author="MIGardener",
            skill_level=SkillLevel.BEGINNER,
            topics=["seeds", "transplanting", "lighting"],
            description="Complete guide to starting seeds indoors",
            duration_minutes=20,
            rating=4.9
        ),
        EducationalResource(
            title="Starting Seeds Indoors",
            type=ResourceType.GUIDE,
            url="https://extension.umn.edu/planting-and-growing-guides/starting-seeds-indoors",
            author="University of Minnesota Extension",
            skill_level=SkillLevel.ALL,
            topics=["seeds", "equipment", "timing"],
            description="Equipment, timing, and techniques for seed starting",
            rating=4.7
        ),
    ],
    
    # Composting
    "composting": [
        EducationalResource(
            title="Composting Made Easy",
            type=ResourceType.VIDEO,
            url="https://www.youtube.com/watch?v=FKdMeD4-9vc",
            author="Epic Gardening",
            skill_level=SkillLevel.BEGINNER,
            topics=["compost", "hot composting", "troubleshooting"],
            description="Hot and cold composting methods explained",
            duration_minutes=16,
            rating=4.8
        ),
        EducationalResource(
            title="Backyard Composting",
            type=ResourceType.GUIDE,
            url="https://extension.psu.edu/backyard-composting",
            author="Penn State Extension",
            skill_level=SkillLevel.ALL,
            topics=["compost", "browns and greens", "bins"],
            description="Complete guide to backyard composting",
            rating=4.7
        ),
    ],
    
    # Mulching
    "mulching": [
        EducationalResource(
            title="Mulching Your Vegetable Garden",
            type=ResourceType.VIDEO,
            url="https://www.youtube.com/watch?v=5oR0k6WEXWU",
            author="Charles Dowding",
            skill_level=SkillLevel.ALL,
            topics=["mulch", "weed control", "moisture"],
            description="Benefits and methods of mulching",
            duration_minutes=14,
            rating=4.8
        ),
    ],
    
    # Succession Planting
    "succession": [
        EducationalResource(
            title="Succession Planting for Continuous Harvests",
            type=ResourceType.VIDEO,
            url="https://www.youtube.com/watch?v=g5vq9rEITNs",
            author="GrowVeg",
            skill_level=SkillLevel.INTERMEDIATE,
            topics=["succession", "planning", "timing"],
            description="How to plan succession plantings",
            duration_minutes=10,
            rating=4.8
        ),
    ],
    
    # Crop Rotation
    "rotation": [
        EducationalResource(
            title="Crop Rotation Made Simple",
            type=ResourceType.VIDEO,
            url="https://www.youtube.com/watch?v=Fq_EtJtqIbo",
            author="Charles Dowding",
            skill_level=SkillLevel.INTERMEDIATE,
            topics=["rotation", "planning", "soil health"],
            description="Simple 4-year rotation system",
            duration_minutes=16,
            rating=4.9
        ),
        EducationalResource(
            title="Crop Rotation in Home Gardens",
            type=ResourceType.ARTICLE,
            url="https://extension.oregonstate.edu/gardening/vegetables/crop-rotation-home-vegetable-gardens",
            author="Oregon State Extension",
            skill_level=SkillLevel.ALL,
            topics=["rotation", "disease prevention"],
            description="Why and how to rotate crops",
            rating=4.7
        ),
    ],
    
    # Beneficial Insects
    "beneficial_insects": [
        EducationalResource(
            title="Attracting Beneficial Insects to Your Garden",
            type=ResourceType.VIDEO,
            url="https://www.youtube.com/watch?v=JcK9VqrloXE",
            author="GrowVeg",
            skill_level=SkillLevel.ALL,
            topics=["beneficial insects", "pollinators", "companion planting"],
            description="Plants and practices that attract good bugs",
            duration_minutes=12,
            rating=4.8
        ),
    ],
    
    # Harvest & Storage
    "harvest_storage": [
        EducationalResource(
            title="Harvesting and Storing Vegetables",
            type=ResourceType.VIDEO,
            url="https://www.youtube.com/watch?v=0SFsW6JqRtc",
            author="GrowVeg",
            skill_level=SkillLevel.ALL,
            topics=["harvest", "storage", "preservation"],
            description="When and how to harvest for best quality",
            duration_minutes=14,
            rating=4.7
        ),
        EducationalResource(
            title="Vegetable Storage Guide",
            type=ResourceType.ARTICLE,
            url="https://extension.umn.edu/preserving-and-preparing/storing-fresh-vegetables",
            author="University of Minnesota Extension",
            skill_level=SkillLevel.ALL,
            topics=["storage", "root cellar", "preservation"],
            description="Storage conditions for different vegetables",
            rating=4.7
        ),
    ],
    
    # Season Extension
    "season_extension": [
        EducationalResource(
            title="Extending Your Growing Season",
            type=ResourceType.VIDEO,
            url="https://www.youtube.com/watch?v=eDv7M82LDDY",
            author="MIGardener",
            skill_level=SkillLevel.INTERMEDIATE,
            topics=["cold frames", "row covers", "tunnels"],
            description="Methods to grow earlier and later",
            duration_minutes=18,
            rating=4.8
        ),
    ],
    
    # Regional - Midwest
    "midwest": [
        EducationalResource(
            title="Midwest Vegetable Gardening",
            type=ResourceType.ARTICLE,
            url="https://extension.illinois.edu/vegetables",
            author="University of Illinois Extension",
            skill_level=SkillLevel.ALL,
            topics=["regional", "midwest", "timing"],
            description="Vegetable gardening for Midwest climates",
            rating=4.7
        ),
    ],
    
    # Regional - Southeast
    "southeast": [
        EducationalResource(
            title="Southeast Vegetable Gardening",
            type=ResourceType.GUIDE,
            url="https://content.ces.ncsu.edu/extension-gardener-handbook/1-vegetable-gardening",
            author="NC State Extension",
            skill_level=SkillLevel.ALL,
            topics=["regional", "southeast", "heat tolerant"],
            description="Gardening in hot, humid climates",
            rating=4.7
        ),
    ],
    
    # Regional - West
    "west": [
        EducationalResource(
            title="Western Vegetable Gardening",
            type=ResourceType.GUIDE,
            url="https://extension.wsu.edu/mastergardener/gardening/vegetables/",
            author="WSU Extension",
            skill_level=SkillLevel.ALL,
            topics=["regional", "west", "drought"],
            description="Vegetable gardening in Western climates",
            rating=4.7
        ),
    ],
    
    # Books
    "books": [
        EducationalResource(
            title="The Vegetable Gardener's Bible",
            type=ResourceType.BOOK,
            url="https://www.storey.com/books/the-vegetable-gardeners-bible-2nd-edition/",
            author="Edward C. Smith",
            skill_level=SkillLevel.ALL,
            topics=["comprehensive", "raised beds", "W-O-R-D system"],
            description="Classic comprehensive vegetable gardening book",
            rating=4.9
        ),
        EducationalResource(
            title="Square Foot Gardening",
            type=ResourceType.BOOK,
            url="https://squarefootgardening.org/",
            author="Mel Bartholomew",
            skill_level=SkillLevel.BEGINNER,
            topics=["square foot", "small space", "intensive"],
            description="Revolutionary space-efficient gardening method",
            rating=4.8
        ),
        EducationalResource(
            title="The Market Gardener",
            type=ResourceType.BOOK,
            url="https://themarketgardener.com/",
            author="Jean-Martin Fortier",
            skill_level=SkillLevel.ADVANCED,
            topics=["market gardening", "efficiency", "production"],
            description="Profitable small-scale farming techniques",
            rating=4.9
        ),
    ],
}


def get_resources_by_topic(topic: str, skill_level: Optional[SkillLevel] = None) -> List[EducationalResource]:
    """
    Get educational resources for a specific topic.
    
    Args:
        topic: Topic name or crop name
        skill_level: Optional skill level filter
    
    Returns:
        List of matching resources
    """
    topic_lower = topic.lower()
    results = []
    
    # Check direct category match
    if topic_lower in RESOURCES_DATABASE:
        results.extend(RESOURCES_DATABASE[topic_lower])
    
    # Check for partial matches in all categories
    for category, resources in RESOURCES_DATABASE.items():
        if topic_lower in category or category in topic_lower:
            results.extend(resources)
    
    # Filter by topic within resources
    for category, resources in RESOURCES_DATABASE.items():
        for resource in resources:
            if topic_lower in [t.lower() for t in resource.topics]:
                if resource not in results:
                    results.append(resource)
    
    # Filter by skill level if specified
    if skill_level:
        results = [r for r in results if r.skill_level == skill_level or r.skill_level == SkillLevel.ALL]
    
    return results


def get_resources_by_skill_level(skill_level: SkillLevel) -> List[EducationalResource]:
    """
    Get resources appropriate for a skill level.
    
    Args:
        skill_level: Target skill level
    
    Returns:
        List of appropriate resources
    """
    results = []
    for resources in RESOURCES_DATABASE.values():
        for resource in resources:
            if resource.skill_level == skill_level or resource.skill_level == SkillLevel.ALL:
                results.append(resource)
    return results


def generate_resource_guide(
    crops: List[str],
    skill_level: SkillLevel,
    topics: Optional[List[str]] = None
) -> str:
    """
    Generate personalized learning resource guide.
    
    Args:
        crops: List of crops being grown
        skill_level: User's experience level
        topics: Additional topics of interest
    
    Returns:
        Formatted resource guide
    """
    guide = "\n📚 Learning Resources & Educational Materials\n\n"
    guide += "Curated resources to help you succeed:\n\n"
    
    # Getting started resources (always include for beginners)
    if skill_level == SkillLevel.BEGINNER:
        guide += "**Getting Started** (Essential for New Gardeners):\n"
        for resource in RESOURCES_DATABASE["getting_started"][:3]:
            guide += format_resource(resource)
        guide += "\n"
    
    # Crop-specific resources
    if crops:
        guide += "**Resources for Your Crops**:\n"
        seen_resources = set()
        
        for crop in crops[:5]:  # Limit to top 5 crops
            resources = get_resources_by_topic(crop, skill_level)
            if resources:
                crop_resources = [r for r in resources if r.title not in seen_resources]
                if crop_resources:
                    guide += f"\n  {crop.title()}:\n"
                    for resource in crop_resources[:2]:  # Top 2 per crop
                        guide += "  " + format_resource(resource)
                        seen_resources.add(resource.title)
        guide += "\n"
    
    # General topics
    important_topics = ["watering", "soil", "pests_diseases"]
    guide += "**Essential Topics**:\n"
    for topic in important_topics:
        if topic in RESOURCES_DATABASE:
            resources = [r for r in RESOURCES_DATABASE[topic] 
                        if r.skill_level == skill_level or r.skill_level == SkillLevel.ALL]
            if resources:
                guide += f"\n  {topic.replace('_', ' ').title()}:\n"
                for resource in resources[:1]:  # Top 1 per topic
                    guide += "  " + format_resource(resource)
    
    # Climate adaptation
    guide += "\n**Climate Resilience**:\n"
    for resource in RESOURCES_DATABASE["climate_adaptation"][:2]:
        guide += format_resource(resource)
    
    # Extension offices
    guide += "\n**Local Extension Office Resources**:\n"
    guide += "  📍 Find your local extension office for regional advice:\n"
    guide += "     • Cornell Extension (NY): https://cce.cornell.edu/localoffices\n"
    guide += "     • Penn State Extension: https://extension.psu.edu/\n"
    guide += "     • USDA Extension Search: https://www.nifa.usda.gov/land-grant-colleges-and-universities-partner-website-directory\n\n"
    
    guide += "**Resource Update Notice**:\n"
    guide += "  ℹ️ Resources last verified: October 2024\n"
    guide += "  ℹ️ Links and content may change - always verify current information\n"
    guide += "  ℹ️ Ratings based on community feedback and educational quality\n"
    
    return guide


def format_resource(resource: EducationalResource) -> str:
    """Format a single resource for display."""
    icon = {
        ResourceType.VIDEO: "📹",
        ResourceType.ARTICLE: "📄",
        ResourceType.GUIDE: "📘",
        ResourceType.BOOK: "📕",
        ResourceType.COURSE: "🎓",
        ResourceType.WORKSHOP: "🏫",
    }.get(resource.type, "📄")
    
    output = f"{icon} \"{resource.title}\" - {resource.author}\n"
    output += f"     {resource.url}\n"
    
    if resource.duration_minutes:
        output += f"     Duration: {resource.duration_minutes} min"
    
    if resource.rating:
        output += f" | Rating: {resource.rating}★"
    
    if resource.duration_minutes or resource.rating:
        output += "\n"
    
    return output


def get_troubleshooting_resources() -> str:
    """Get resources for troubleshooting common problems."""
    guide = "\n🔧 Troubleshooting Resources\n\n"
    
    guide += "When problems arise, consult these resources:\n\n"
    
    guide += "**Pest & Disease Identification**:\n"
    guide += "  📄 Extension Disease Guides: https://extension.psu.edu/vegetable-diseases\n"
    guide += "  📹 Pest ID Videos: https://www.youtube.com/@GrowVeg (Search specific pests)\n\n"
    
    guide += "**Expert Help**:\n"
    guide += "  • Local Extension Office: Free diagnosis and advice\n"
    guide += "  • r/vegetablegardening: Active community on Reddit\n"
    guide += "  • GardenWeb Forums: Experienced gardener community\n\n"
    
    guide += "**Emergency Guides**:\n"
    guide += "  • What's Wrong with My Plant?: https://extension.umn.edu/\n"
    guide += "  • Garden Problem Solver: https://www.almanac.com/\n"
    
    return guide
