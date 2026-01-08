"""
Disease prevention and basic identification module.
Provides preventive care guidance and common disease information.

v3.1 Feature: Basic disease prevention strategies
v3.2 Enhancement: Regional disease risk assessment
v3.3 Enhancement: Expanded disease database, state-level risk, seasonal variations
"""

from typing import List, Dict, Optional, Tuple
from dataclasses import dataclass, field
from enum import Enum


class DiseaseRisk(str, Enum):
    """Disease risk levels by region"""
    LOW = "Low"
    MODERATE = "Moderate"
    HIGH = "High"
    VERY_HIGH = "Very High"


class DiseaseSeason(str, Enum):
    """Seasons when disease is most active"""
    SPRING = "Spring"
    SUMMER = "Summer"
    FALL = "Fall"
    WINTER = "Winter"
    YEAR_ROUND = "Year-Round"


@dataclass
class DiseaseInfo:
    """Information about a plant disease"""
    name: str
    scientific_name: str
    symptoms: List[str]
    prevention: List[str]
    organic_treatment: List[str]
    risk_factors: List[str]
    regional_risk: Optional[Dict[str, DiseaseRisk]] = None  # v3.2: Regional risk levels
    peak_seasons: Optional[List[DiseaseSeason]] = None  # v3.3: Seasonal risk
    state_risk: Optional[Dict[str, DiseaseRisk]] = None  # v3.3: State-level risk
    images_urls: Optional[List[str]] = None  # v3.3: Disease identification images


# Common diseases by crop
DISEASE_DATABASE = {
    "tomatoes": [
        DiseaseInfo(
            name="Early Blight",
            scientific_name="Alternaria solani",
            symptoms=[
                "Brown spots with concentric rings on lower leaves",
                "Target-like lesions",
                "Yellowing leaves that drop off",
                "Fruit rot near stem end"
            ],
            prevention=[
                "Mulch heavily to prevent soil splash",
                "Water at base of plant, avoid wetting foliage",
                "Ensure good air circulation (3-4 ft spacing)",
                "Remove affected leaves promptly",
                "Rotate crops - don't plant tomatoes in same spot for 3 years"
            ],
            organic_treatment=[
                "Remove and destroy infected leaves",
                "Apply copper fungicide at first sign",
                "Neem oil spray can slow spread",
                "Baking soda spray (1 tbsp per gallon water)"
            ],
            risk_factors=["High humidity", "Warm temperatures (75-85°F)", "Overhead watering"],
            regional_risk={
                "Northeast": DiseaseRisk.HIGH,
                "Southeast": DiseaseRisk.VERY_HIGH,
                "Midwest": DiseaseRisk.HIGH,
                "West": DiseaseRisk.MODERATE,
            }
        ),
        DiseaseInfo(
            name="Late Blight",
            scientific_name="Phytophthora infestans",
            symptoms=[
                "Water-soaked spots on leaves",
                "White fuzzy growth on undersides",
                "Rapid browning and death of foliage",
                "Brown, greasy-looking fruit rot"
            ],
            prevention=[
                "Plant resistant varieties",
                "Ensure excellent air circulation",
                "Avoid overhead watering",
                "Remove volunteer tomato plants",
                "Monitor weather - spreads in cool, wet conditions"
            ],
            organic_treatment=[
                "Remove and destroy entire plant if severely infected",
                "Copper spray as preventive in high-risk weather",
                "Do not compost infected material"
            ],
            risk_factors=["Cool wet weather (60-70°F with rain)", "High humidity", "Poor air circulation"],
            regional_risk={
                "Northeast": DiseaseRisk.VERY_HIGH,
                "Southeast": DiseaseRisk.MODERATE,
                "Midwest": DiseaseRisk.HIGH,
                "West": DiseaseRisk.LOW,
            }
        ),
        DiseaseInfo(
            name="Septoria Leaf Spot",
            scientific_name="Septoria lycopersici",
            symptoms=[
                "Small circular spots with gray centers",
                "Dark borders around spots",
                "Starts on lower leaves",
                "Leaves yellow and drop"
            ],
            prevention=[
                "Mulch to prevent soil splash",
                "Remove lower leaves as plant grows",
                "Stake or cage plants for air flow",
                "Water at soil level only"
            ],
            organic_treatment=[
                "Remove infected leaves immediately",
                "Copper fungicide spray",
                "Improve air circulation"
            ],
            risk_factors=["Wet conditions", "Temperatures 60-80°F", "Overhead watering"],
            regional_risk={
                "Northeast": DiseaseRisk.HIGH,
                "Southeast": DiseaseRisk.VERY_HIGH,
                "Midwest": DiseaseRisk.HIGH,
                "West": DiseaseRisk.MODERATE,
            },
            peak_seasons=[DiseaseSeason.SUMMER]
        ),
        DiseaseInfo(
            name="Fusarium Wilt",
            scientific_name="Fusarium oxysporum f. sp. lycopersici",
            symptoms=[
                "Yellowing of lower leaves",
                "Brown discoloration in vascular tissue",
                "Wilting on one side of plant first",
                "Eventually entire plant wilts and dies"
            ],
            prevention=[
                "Plant resistant varieties (VFN notation)",
                "4-year crop rotation",
                "Solarize soil if present",
                "Don't plant tomatoes where disease occurred",
                "Maintain soil pH 6.5-7.0"
            ],
            organic_treatment=[
                "No cure once infected",
                "Remove and destroy infected plants",
                "Only plant resistant varieties",
                "Soil solarization between seasons"
            ],
            risk_factors=["Warm soil", "Acidic soil", "Root damage", "Present in soil for years"],
            regional_risk={
                "Northeast": DiseaseRisk.MODERATE,
                "Southeast": DiseaseRisk.VERY_HIGH,
                "Midwest": DiseaseRisk.HIGH,
                "West": DiseaseRisk.HIGH,
            },
            peak_seasons=[DiseaseSeason.SUMMER]
        ),
        DiseaseInfo(
            name="Bacterial Canker",
            scientific_name="Clavibacter michiganensis",
            symptoms=[
                "Wilting of leaves and stems",
                "Tan to brown cankers on stems",
                "Bird's eye spots on fruit",
                "White bacterial ooze from lesions"
            ],
            prevention=[
                "Use certified disease-free seed and transplants",
                "Disinfect tools between plants",
                "Avoid overhead watering",
                "Don't work plants when wet",
                "2-3 year crop rotation"
            ],
            organic_treatment=[
                "Remove and destroy infected plants immediately",
                "Copper spray may slow spread",
                "No effective cure",
                "Don't compost infected material"
            ],
            risk_factors=["Cool wet weather", "Contaminated seed", "Wounds on plants"],
            regional_risk={
                "Northeast": DiseaseRisk.MODERATE,
                "Southeast": DiseaseRisk.MODERATE,
                "Midwest": DiseaseRisk.HIGH,
                "West": DiseaseRisk.LOW,
            },
            peak_seasons=[DiseaseSeason.SPRING, DiseaseSeason.SUMMER]
        ),
        DiseaseInfo(
            name="Blossom End Rot",
            scientific_name="Calcium deficiency disorder",
            symptoms=[
                "Dark, sunken spots at blossom end of fruit",
                "Leathery brown or black tissue",
                "Occurs as fruit develops",
                "Not a pathogen - physiological disorder"
            ],
            prevention=[
                "Maintain consistent soil moisture",
                "Mulch to retain moisture",
                "Avoid over-fertilizing with nitrogen",
                "Test soil and add calcium if needed",
                "Don't cultivate deeply near plants"
            ],
            organic_treatment=[
                "Foliar calcium spray",
                "Gypsum or lime to soil",
                "Consistent watering schedule",
                "Remove affected fruit"
            ],
            risk_factors=["Inconsistent watering", "Low calcium", "High nitrogen"],
            regional_risk={
                "Northeast": DiseaseRisk.MODERATE,
                "Southeast": DiseaseRisk.HIGH,
                "Midwest": DiseaseRisk.MODERATE,
                "West": DiseaseRisk.MODERATE,
            },
            peak_seasons=[DiseaseSeason.SUMMER]
        ),
        DiseaseInfo(
            name="Verticillium Wilt",
            scientific_name="Verticillium spp.",
            symptoms=[
                "Yellowing of lower leaves",
                "Wilting during heat of day",
                "Brown discoloration in stem tissue",
                "Progressive upward leaf death"
            ],
            prevention=[
                "Plant resistant varieties (VFN)",
                "4-year crop rotation",
                "Solarize soil if present",
                "Avoid planting where nightshades grew",
                "Maintain plant vigor"
            ],
            organic_treatment=[
                "No cure once infected",
                "Remove infected plants",
                "Soil solarization",
                "Only plant resistant varieties"
            ],
            risk_factors=["Cool soil temps", "Present in soil for years", "Stressed plants"],
            regional_risk={
                "Northeast": DiseaseRisk.MODERATE,
                "Southeast": DiseaseRisk.LOW,
                "Midwest": DiseaseRisk.HIGH,
                "West": DiseaseRisk.HIGH,
            },
            peak_seasons=[DiseaseSeason.SPRING, DiseaseSeason.SUMMER]
        ),
    ],
    
    "cucumbers": [
        DiseaseInfo(
            name="Powdery Mildew",
            scientific_name="Various fungi",
            symptoms=[
                "White powdery coating on leaves",
                "Starts as small white spots",
                "Leaves yellow and die",
                "Reduced fruit production"
            ],
            prevention=[
                "Plant resistant varieties",
                "Ensure good air circulation",
                "Water in morning so leaves dry quickly",
                "Don't overcrowd plants",
                "Avoid excess nitrogen fertilizer"
            ],
            organic_treatment=[
                "Milk spray (1:9 milk to water ratio)",
                "Baking soda solution (1 tbsp per gallon)",
                "Neem oil spray",
                "Remove severely infected leaves"
            ],
            risk_factors=["High humidity", "Moderate temperatures", "Shaded conditions"],
            regional_risk={
                "Northeast": DiseaseRisk.MODERATE,
                "Southeast": DiseaseRisk.HIGH,
                "Midwest": DiseaseRisk.MODERATE,
                "West": DiseaseRisk.LOW,
            },
            peak_seasons=[DiseaseSeason.SUMMER, DiseaseSeason.FALL]
        ),
        DiseaseInfo(
            name="Downy Mildew",
            scientific_name="Pseudoperonospora cubensis",
            symptoms=[
                "Yellow angular spots on upper leaf surface",
                "Gray-purple fuzzy growth underneath",
                "Leaves turn brown and die",
                "Rapid defoliation"
            ],
            prevention=[
                "Plant resistant varieties",
                "Avoid overhead watering",
                "Ensure good drainage",
                "Space plants properly",
                "Remove infected leaves immediately"
            ],
            organic_treatment=[
                "Copper fungicide at first sign",
                "Remove infected tissue",
                "Improve air circulation"
            ],
            risk_factors=["Cool nights with dew", "High humidity", "Poor air flow"],
            regional_risk={
                "Northeast": DiseaseRisk.HIGH,
                "Southeast": DiseaseRisk.VERY_HIGH,
                "Midwest": DiseaseRisk.HIGH,
                "West": DiseaseRisk.MODERATE,
            },
            peak_seasons=[DiseaseSeason.SUMMER, DiseaseSeason.FALL]
        ),
        DiseaseInfo(
            name="Angular Leaf Spot",
            scientific_name="Pseudomonas syringae pv. lachrymans",
            symptoms=[
                "Water-soaked spots on leaves",
                "Angular spots (limited by leaf veins)",
                "White bacterial ooze when wet",
                "Spots turn brown and fall out"
            ],
            prevention=[
                "Use certified disease-free seed",
                "Avoid overhead watering",
                "Don't work in wet garden",
                "2-3 year crop rotation",
                "Remove plant debris"
            ],
            organic_treatment=[
                "Copper spray at first sign",
                "Remove infected leaves",
                "No cure once established"
            ],
            risk_factors=["Cool wet weather", "Overhead watering", "Contaminated seed"],
            regional_risk={
                "Northeast": DiseaseRisk.MODERATE,
                "Southeast": DiseaseRisk.HIGH,
                "Midwest": DiseaseRisk.MODERATE,
                "West": DiseaseRisk.LOW,
            },
            peak_seasons=[DiseaseSeason.SPRING, DiseaseSeason.FALL]
        ),
    ],
    
    "beans": [
        DiseaseInfo(
            name="Bean Rust",
            scientific_name="Uromyces appendiculatus",
            symptoms=[
                "Small brown or reddish pustules on leaves",
                "Dusty rusty-colored spores",
                "Yellowing leaves",
                "Reduced pod production"
            ],
            prevention=[
                "Plant resistant varieties",
                "Avoid working in garden when plants are wet",
                "Don't overhead water",
                "Remove infected plants at end of season",
                "Rotate crops"
            ],
            organic_treatment=[
                "Remove infected leaves",
                "Sulfur spray",
                "Avoid excess nitrogen"
            ],
            risk_factors=["Warm humid weather", "Overhead watering", "Dense foliage"],
            regional_risk={
                "Northeast": DiseaseRisk.MODERATE,
                "Southeast": DiseaseRisk.HIGH,
                "Midwest": DiseaseRisk.HIGH,
                "West": DiseaseRisk.LOW,
            },
            peak_seasons=[DiseaseSeason.SUMMER]
        ),
        DiseaseInfo(
            name="Anthracnose",
            scientific_name="Colletotrichum coccodes",
            symptoms=[
                "Small brown to black spots on leaves",
                "Sunken lesions on pods",
                "Lesions may have pink spore masses",
                "Pods may rot"
            ],
            prevention=[
                "3-year crop rotation",
                "Remove infected plant debris",
                "Avoid overhead watering",
                "Use disease-free seed",
                "Don't work plants when wet"
            ],
            organic_treatment=[
                "Copper fungicide spray",
                "Remove infected pods",
                "Improve air circulation"
            ],
            risk_factors=["Warm wet weather", "High humidity", "Poor sanitation"],
            regional_risk={
                "Northeast": DiseaseRisk.MODERATE,
                "Southeast": DiseaseRisk.HIGH,
                "Midwest": DiseaseRisk.MODERATE,
                "West": DiseaseRisk.LOW,
            },
            peak_seasons=[DiseaseSeason.SUMMER, DiseaseSeason.FALL]
        ),
        DiseaseInfo(
            name="White Mold",
            scientific_name="Sclerotinia sclerotiorum",
            symptoms=[
                "White cottony growth on stems and pods",
                "Water-soaked lesions",
                "Black sclerotia (hard bodies) form",
                "Plant wilting and death"
            ],
            prevention=[
                "Ensure good air circulation",
                "Avoid dense plantings",
                "Don't overhead water",
                "Remove plant debris",
                "4-year crop rotation"
            ],
            organic_treatment=[
                "Remove infected plants immediately",
                "No effective organic cure",
                "Improve air flow"
            ],
            risk_factors=["Cool moist weather", "Dense canopy", "High humidity"],
            regional_risk={
                "Northeast": DiseaseRisk.MODERATE,
                "Southeast": DiseaseRisk.LOW,
                "Midwest": DiseaseRisk.HIGH,
                "West": DiseaseRisk.LOW,
            },
            peak_seasons=[DiseaseSeason.SPRING, DiseaseSeason.FALL]
        ),
    ],
    
    "squash": [
        DiseaseInfo(
            name="Powdery Mildew",
            scientific_name="Podosphaera xanthii",
            symptoms=[
                "White powdery spots on leaves",
                "Spreads to cover entire leaf",
                "Leaves turn yellow then brown",
                "Affects fruit quality"
            ],
            prevention=[
                "Plant resistant varieties",
                "Space plants for air flow",
                "Water at base, not overhead",
                "Prune to improve circulation",
                "Apply preventive sprays early"
            ],
            organic_treatment=[
                "Milk spray (1:9 ratio)",
                "Potassium bicarbonate spray",
                "Neem oil",
                "Remove severely infected leaves"
            ],
            risk_factors=["High humidity", "Moderate temps", "Dense foliage"],
            regional_risk={
                "Northeast": DiseaseRisk.MODERATE,
                "Southeast": DiseaseRisk.VERY_HIGH,
                "Midwest": DiseaseRisk.HIGH,
                "West": DiseaseRisk.LOW,
            },
            peak_seasons=[DiseaseSeason.SUMMER, DiseaseSeason.FALL]
        ),
        DiseaseInfo(
            name="Bacterial Wilt",
            scientific_name="Erwinia tracheiphila",
            symptoms=[
                "Sudden wilting of leaves and vines",
                "Wilt begins on individual leaves",
                "Milky sap oozes from cut stems",
                "Entire plant collapses"
            ],
            prevention=[
                "Control cucumber beetles (vectors)",
                "Use row covers until flowering",
                "Remove infected plants immediately",
                "Plant extra to compensate for losses"
            ],
            organic_treatment=[
                "No cure once infected",
                "Remove and destroy plants",
                "Control beetles with neem oil",
                "Trap crops can help"
            ],
            risk_factors=["Cucumber beetle feeding", "Warm weather", "No resistance available"],
            regional_risk={
                "Northeast": DiseaseRisk.HIGH,
                "Southeast": DiseaseRisk.MODERATE,
                "Midwest": DiseaseRisk.VERY_HIGH,
                "West": DiseaseRisk.LOW,
            },
            peak_seasons=[DiseaseSeason.SUMMER]
        ),
        DiseaseInfo(
            name="Gummy Stem Blight",
            scientific_name="Didymella bryoniae",
            symptoms=[
                "Brown lesions on stems",
                "Gummy ooze from lesions",
                "Leaf spots with dark margins",
                "Fruit rot at blossom end"
            ],
            prevention=[
                "3-year crop rotation",
                "Use disease-free seed",
                "Avoid overhead watering",
                "Remove plant debris",
                "Good air circulation"
            ],
            organic_treatment=[
                "Copper fungicide spray",
                "Remove infected tissue",
                "Improve drainage"
            ],
            risk_factors=["Warm humid weather", "Overhead irrigation", "Contaminated seed"],
            regional_risk={
                "Northeast": DiseaseRisk.MODERATE,
                "Southeast": DiseaseRisk.VERY_HIGH,
                "Midwest": DiseaseRisk.HIGH,
                "West": DiseaseRisk.LOW,
            },
            peak_seasons=[DiseaseSeason.SUMMER]
        ),
    ],
    
    "brassicas": [
        DiseaseInfo(
            name="Clubroot",
            scientific_name="Plasmodiophora brassicae",
            symptoms=[
                "Swollen, distorted roots",
                "Stunted growth",
                "Wilting during day",
                "Yellowing leaves"
            ],
            prevention=[
                "Rotate crops - don't plant brassicas for 4 years",
                "Improve drainage",
                "Lime soil if acidic (pH 7.2 ideal)",
                "Use resistant varieties",
                "Don't transplant from infected areas"
            ],
            organic_treatment=[
                "Remove and destroy infected plants",
                "Add lime to raise pH",
                "Solarize soil between crops",
                "No effective cure once infected"
            ],
            risk_factors=["Acidic soil", "Wet conditions", "Contaminated soil"],
            regional_risk={
                "Northeast": DiseaseRisk.HIGH,
                "Southeast": DiseaseRisk.MODERATE,
                "Midwest": DiseaseRisk.MODERATE,
                "West": DiseaseRisk.LOW,
            },
            peak_seasons=[DiseaseSeason.SPRING, DiseaseSeason.FALL]
        ),
        DiseaseInfo(
            name="Black Rot",
            scientific_name="Xanthomonas campestris",
            symptoms=[
                "V-shaped yellow lesions from leaf edge",
                "Black veins in yellow areas",
                "Leaves wilt and drop",
                "Heads rot"
            ],
            prevention=[
                "Use disease-free seeds",
                "Avoid overhead watering",
                "Remove crop debris after harvest",
                "3-year crop rotation",
                "Don't work plants when wet"
            ],
            organic_treatment=[
                "Remove infected plants immediately",
                "Copper spray may slow spread",
                "Destroy infected material (don't compost)"
            ],
            risk_factors=["Warm wet weather", "Contaminated tools", "Poor sanitation"],
            regional_risk={
                "Northeast": DiseaseRisk.MODERATE,
                "Southeast": DiseaseRisk.HIGH,
                "Midwest": DiseaseRisk.MODERATE,
                "West": DiseaseRisk.LOW,
            },
            peak_seasons=[DiseaseSeason.SUMMER, DiseaseSeason.FALL]
        ),
        DiseaseInfo(
            name="Downy Mildew",
            scientific_name="Peronospora parasitica",
            symptoms=[
                "Yellow spots on upper leaf surfaces",
                "White to gray mold underneath",
                "Stunted head development",
                "Leaf distortion"
            ],
            prevention=[
                "Plant resistant varieties",
                "Ensure good air circulation",
                "Avoid overhead watering",
                "Space plants properly",
                "Remove infected leaves"
            ],
            organic_treatment=[
                "Copper fungicide at first sign",
                "Remove infected leaves",
                "Improve air flow"
            ],
            risk_factors=["Cool moist weather", "High humidity", "Dense plantings"],
            regional_risk={
                "Northeast": DiseaseRisk.HIGH,
                "Southeast": DiseaseRisk.MODERATE,
                "Midwest": DiseaseRisk.HIGH,
                "West": DiseaseRisk.MODERATE,
            },
            peak_seasons=[DiseaseSeason.SPRING, DiseaseSeason.FALL]
        ),
        DiseaseInfo(
            name="Alternaria Leaf Spot",
            scientific_name="Alternaria brassicae",
            symptoms=[
                "Small dark brown to black spots on leaves",
                "Yellow halos around spots",
                "Concentric rings in larger lesions",
                "Premature leaf drop"
            ],
            prevention=[
                "3-year crop rotation",
                "Use disease-free seed",
                "Remove plant debris",
                "Avoid overhead watering",
                "Space plants for air flow"
            ],
            organic_treatment=[
                "Copper fungicide spray",
                "Remove infected leaves",
                "Improve air circulation"
            ],
            risk_factors=["Warm humid weather", "Overhead watering", "Dense plantings"],
            regional_risk={
                "Northeast": DiseaseRisk.MODERATE,
                "Southeast": DiseaseRisk.HIGH,
                "Midwest": DiseaseRisk.MODERATE,
                "West": DiseaseRisk.LOW,
            },
            peak_seasons=[DiseaseSeason.SUMMER, DiseaseSeason.FALL]
        ),
    ],
    
    # v3.3: Additional crops and diseases
    "peppers": [
        DiseaseInfo(
            name="Bacterial Spot",
            scientific_name="Xanthomonas spp.",
            symptoms=[
                "Small, dark, greasy-looking spots on leaves",
                "Yellow halos around spots",
                "Raised corky spots on fruit",
                "Leaf drop and defoliation"
            ],
            prevention=[
                "Use disease-free seeds and transplants",
                "Avoid overhead watering",
                "Don't work in wet garden",
                "3-year crop rotation",
                "Remove plant debris at end of season"
            ],
            organic_treatment=[
                "Copper spray at first sign",
                "Remove severely infected plants",
                "No cure once infected - focus on prevention"
            ],
            risk_factors=["Warm humid weather", "Heavy rains", "Overhead irrigation"],
            regional_risk={
                "Northeast": DiseaseRisk.MODERATE,
                "Southeast": DiseaseRisk.VERY_HIGH,
                "Midwest": DiseaseRisk.HIGH,
                "West": DiseaseRisk.LOW,
            },
            peak_seasons=[DiseaseSeason.SUMMER]
        ),
        DiseaseInfo(
            name="Phytophthora Blight",
            scientific_name="Phytophthora capsici",
            symptoms=[
                "Water-soaked lesions on stems at soil line",
                "Sudden wilting of entire plant",
                "White mold on infected tissue",
                "Fruit rot with white fuzzy growth"
            ],
            prevention=[
                "Ensure excellent drainage",
                "Raised beds help prevent",
                "Avoid planting where cucurbits grew",
                "Space plants well for air flow",
                "Mulch to prevent soil splash"
            ],
            organic_treatment=[
                "Remove and destroy infected plants immediately",
                "No effective organic treatment",
                "Solarize soil before replanting",
                "Consider resistant varieties"
            ],
            risk_factors=["Poor drainage", "Heavy rains", "Warm soil temps"],
            regional_risk={
                "Northeast": DiseaseRisk.MODERATE,
                "Southeast": DiseaseRisk.VERY_HIGH,
                "Midwest": DiseaseRisk.HIGH,
                "West": DiseaseRisk.LOW,
            },
            peak_seasons=[DiseaseSeason.SUMMER]
        ),
        DiseaseInfo(
            name="Anthracnose",
            scientific_name="Colletotrichum spp.",
            symptoms=[
                "Sunken circular spots on ripe fruit",
                "Dark brown to black lesions",
                "Pink or orange spore masses in center",
                "Affects mature fruit primarily"
            ],
            prevention=[
                "3-year crop rotation",
                "Remove old plant debris",
                "Avoid overhead watering",
                "Harvest promptly when ripe",
                "Good air circulation"
            ],
            organic_treatment=[
                "Copper fungicide spray",
                "Remove infected fruit",
                "Harvest fruit slightly early"
            ],
            risk_factors=["High humidity", "Warm temperatures", "Wet conditions"],
            regional_risk={
                "Northeast": DiseaseRisk.MODERATE,
                "Southeast": DiseaseRisk.HIGH,
                "Midwest": DiseaseRisk.MODERATE,
                "West": DiseaseRisk.LOW,
            },
            peak_seasons=[DiseaseSeason.SUMMER, DiseaseSeason.FALL]
        ),
    ],
    
    "lettuce": [
        DiseaseInfo(
            name="Downy Mildew",
            scientific_name="Bremia lactucae",
            symptoms=[
                "Yellow angular spots on upper leaf surface",
                "White downy growth underneath",
                "Stunted plant growth",
                "Leaves become brittle"
            ],
            prevention=[
                "Plant in full sun with good air flow",
                "Avoid overhead watering",
                "Space plants adequately",
                "Remove infected leaves promptly",
                "Use resistant varieties"
            ],
            organic_treatment=[
                "Copper fungicide at first sign",
                "Remove infected leaves",
                "Improve air circulation"
            ],
            risk_factors=["Cool moist weather", "High humidity", "Dense plantings"],
            regional_risk={
                "Northeast": DiseaseRisk.HIGH,
                "Southeast": DiseaseRisk.MODERATE,
                "Midwest": DiseaseRisk.HIGH,
                "West": DiseaseRisk.MODERATE,
            },
            peak_seasons=[DiseaseSeason.SPRING, DiseaseSeason.FALL]
        ),
        DiseaseInfo(
            name="Bottom Rot",
            scientific_name="Rhizoctonia solani",
            symptoms=[
                "Brown rot on lower leaves touching soil",
                "Slimy texture on infected tissue",
                "Spreads upward from soil line",
                "Entire head may collapse"
            ],
            prevention=[
                "Avoid overwatering",
                "Mulch to prevent soil splash",
                "Improve drainage",
                "Space plants for air flow",
                "Don't plant too deep"
            ],
            organic_treatment=[
                "Remove infected plants",
                "No effective treatment",
                "Improve cultural conditions"
            ],
            risk_factors=["Excess moisture", "Poor drainage", "Warm soil"],
            regional_risk={
                "Northeast": DiseaseRisk.MODERATE,
                "Southeast": DiseaseRisk.HIGH,
                "Midwest": DiseaseRisk.MODERATE,
                "West": DiseaseRisk.LOW,
            },
            peak_seasons=[DiseaseSeason.SPRING, DiseaseSeason.SUMMER]
        ),
        DiseaseInfo(
            name="Tipburn",
            scientific_name="Calcium deficiency disorder",
            symptoms=[
                "Brown edges on inner leaves",
                "Tissue death at leaf margins",
                "Occurs during rapid growth",
                "Not a pathogen - physiological"
            ],
            prevention=[
                "Maintain consistent soil moisture",
                "Avoid high nitrogen fertilization",
                "Ensure good air circulation",
                "Test soil calcium levels",
                "Don't stress plants"
            ],
            organic_treatment=[
                "Foliar calcium spray",
                "Consistent watering",
                "Reduce nitrogen",
                "Improve air circulation"
            ],
            risk_factors=["Rapid growth", "Inconsistent watering", "High temperatures"],
            regional_risk={
                "Northeast": DiseaseRisk.MODERATE,
                "Southeast": DiseaseRisk.HIGH,
                "Midwest": DiseaseRisk.MODERATE,
                "West": DiseaseRisk.MODERATE,
            },
            peak_seasons=[DiseaseSeason.SPRING, DiseaseSeason.SUMMER]
        ),
    ],
    
    "spinach": [
        DiseaseInfo(
            name="Downy Mildew",
            scientific_name="Peronospora farinosa f. sp. spinaciae",
            symptoms=[
                "Yellow spots on upper leaf surface",
                "Purple-gray fuzzy growth underneath",
                "Leaves curl and distort",
                "Stunted growth"
            ],
            prevention=[
                "Plant resistant varieties",
                "Ensure good air circulation",
                "Avoid overhead watering",
                "Don't plant in shade",
                "Remove old plant debris"
            ],
            organic_treatment=[
                "Remove infected leaves immediately",
                "No effective organic cure",
                "Focus on resistant varieties"
            ],
            risk_factors=["Cool moist conditions", "High humidity", "Poor air flow"],
            regional_risk={
                "Northeast": DiseaseRisk.HIGH,
                "Southeast": DiseaseRisk.MODERATE,
                "Midwest": DiseaseRisk.HIGH,
                "West": DiseaseRisk.MODERATE,
            },
            peak_seasons=[DiseaseSeason.SPRING, DiseaseSeason.FALL]
        ),
        DiseaseInfo(
            name="White Rust",
            scientific_name="Albugo occidentalis",
            symptoms=[
                "White pustules on leaves",
                "Leaf distortion and twisting",
                "Stunted growth",
                "Reduced leaf quality"
            ],
            prevention=[
                "Plant resistant varieties",
                "Avoid overhead watering",
                "Good air circulation",
                "Remove infected plants",
                "3-year crop rotation"
            ],
            organic_treatment=[
                "Remove infected leaves",
                "Copper fungicide spray",
                "Destroy infected material"
            ],
            risk_factors=["Cool moist weather", "High humidity", "Dense plantings"],
            regional_risk={
                "Northeast": DiseaseRisk.MODERATE,
                "Southeast": DiseaseRisk.LOW,
                "Midwest": DiseaseRisk.MODERATE,
                "West": DiseaseRisk.LOW,
            },
            peak_seasons=[DiseaseSeason.SPRING, DiseaseSeason.FALL]
        ),
    ],
    
    "onions": [
        DiseaseInfo(
            name="Downy Mildew",
            scientific_name="Peronospora destructor",
            symptoms=[
                "Pale green to yellow lesions on leaves",
                "Gray-purple fuzzy growth in humid weather",
                "Leaf tips die back",
                "Bulb development reduced"
            ],
            prevention=[
                "Plant in well-drained soil",
                "Ensure good air circulation",
                "Avoid overhead watering",
                "Don't plant too densely",
                "Remove infected plants"
            ],
            organic_treatment=[
                "Copper fungicide",
                "Remove infected plants",
                "Improve air flow"
            ],
            risk_factors=["Cool humid weather", "Dense plantings", "Wet foliage"],
            regional_risk={
                "Northeast": DiseaseRisk.HIGH,
                "Southeast": DiseaseRisk.MODERATE,
                "Midwest": DiseaseRisk.HIGH,
                "West": DiseaseRisk.LOW,
            },
            peak_seasons=[DiseaseSeason.SPRING]
        ),
        DiseaseInfo(
            name="Botrytis Neck Rot",
            scientific_name="Botrytis allii",
            symptoms=[
                "Gray mold at neck during storage",
                "Soft watery rot near neck",
                "Spreads to entire bulb",
                "Occurs primarily in storage"
            ],
            prevention=[
                "Cure bulbs properly before storage",
                "Ensure good air flow during curing",
                "Store in cool, dry location",
                "Don't store damaged bulbs",
                "Harvest when tops fall over naturally"
            ],
            organic_treatment=[
                "Remove infected bulbs from storage",
                "No treatment once infected",
                "Improve storage conditions"
            ],
            risk_factors=["Improper curing", "High humidity storage", "Neck damage"],
            regional_risk={
                "Northeast": DiseaseRisk.MODERATE,
                "Southeast": DiseaseRisk.HIGH,
                "Midwest": DiseaseRisk.MODERATE,
                "West": DiseaseRisk.LOW,
            },
            peak_seasons=[DiseaseSeason.FALL, DiseaseSeason.WINTER]
        ),
    ],
    
    "carrots": [
        DiseaseInfo(
            name="Alternaria Leaf Blight",
            scientific_name="Alternaria dauci",
            symptoms=[
                "Brown spots with yellow halos on leaves",
                "Leaf tips turn brown and die",
                "Entire leaves may die",
                "Reduces root size"
            ],
            prevention=[
                "3-year crop rotation",
                "Remove plant debris",
                "Avoid overhead watering",
                "Ensure good air circulation",
                "Use disease-free seed"
            ],
            organic_treatment=[
                "Remove infected foliage",
                "Copper fungicide spray",
                "Improve air circulation"
            ],
            risk_factors=["Warm humid weather", "Overhead watering", "Dense foliage"],
            regional_risk={
                "Northeast": DiseaseRisk.MODERATE,
                "Southeast": DiseaseRisk.HIGH,
                "Midwest": DiseaseRisk.MODERATE,
                "West": DiseaseRisk.LOW,
            },
            peak_seasons=[DiseaseSeason.SUMMER]
        ),
        DiseaseInfo(
            name="Cavity Spot",
            scientific_name="Pythium spp.",
            symptoms=[
                "Small sunken lesions on roots",
                "Brown discolored spots",
                "Lesions may enlarge and merge",
                "Reduces marketability"
            ],
            prevention=[
                "Improve soil drainage",
                "Avoid overwatering",
                "Maintain consistent soil moisture",
                "Crop rotation helps",
                "Add organic matter to soil"
            ],
            organic_treatment=[
                "No effective treatment",
                "Focus on prevention",
                "Improve soil conditions"
            ],
            risk_factors=["Wet soil", "Poor drainage", "Fluctuating moisture"],
            regional_risk={
                "Northeast": DiseaseRisk.MODERATE,
                "Southeast": DiseaseRisk.HIGH,
                "Midwest": DiseaseRisk.MODERATE,
                "West": DiseaseRisk.LOW,
            },
            peak_seasons=[DiseaseSeason.SPRING, DiseaseSeason.SUMMER]
        ),
    ],
    
    "potatoes": [
        DiseaseInfo(
            name="Early Blight",
            scientific_name="Alternaria solani",
            symptoms=[
                "Target-like spots on lower leaves",
                "Brown concentric rings",
                "Leaves yellow and drop",
                "Can affect tubers in storage"
            ],
            prevention=[
                "3-4 year crop rotation",
                "Mulch heavily",
                "Water at base, not overhead",
                "Remove volunteer plants",
                "Hill soil around plants"
            ],
            organic_treatment=[
                "Remove infected leaves",
                "Copper fungicide spray",
                "Baking soda solution"
            ],
            risk_factors=["Warm humid weather", "Overhead watering", "Stressed plants"],
            regional_risk={
                "Northeast": DiseaseRisk.HIGH,
                "Southeast": DiseaseRisk.VERY_HIGH,
                "Midwest": DiseaseRisk.HIGH,
                "West": DiseaseRisk.MODERATE,
            },
            peak_seasons=[DiseaseSeason.SUMMER]
        ),
        DiseaseInfo(
            name="Late Blight",
            scientific_name="Phytophthora infestans",
            symptoms=[
                "Water-soaked spots on leaves",
                "White mold on undersides",
                "Rapid plant death",
                "Brown rot on tubers"
            ],
            prevention=[
                "Plant certified disease-free seed",
                "Destroy all volunteer plants",
                "Excellent air circulation",
                "Monitor weather - spreads in cool wet weather",
                "Hill potatoes to protect tubers"
            ],
            organic_treatment=[
                "Remove and destroy infected plants",
                "Copper spray as preventive",
                "Don't compost infected material"
            ],
            risk_factors=["Cool wet weather (60-70°F)", "High humidity", "Rain"],
            regional_risk={
                "Northeast": DiseaseRisk.VERY_HIGH,
                "Southeast": DiseaseRisk.MODERATE,
                "Midwest": DiseaseRisk.HIGH,
                "West": DiseaseRisk.LOW,
            },
            peak_seasons=[DiseaseSeason.SUMMER, DiseaseSeason.FALL]
        ),
        DiseaseInfo(
            name="Scab",
            scientific_name="Streptomyces scabies",
            symptoms=[
                "Rough corky lesions on tuber surface",
                "Lesions can be shallow or deep",
                "Doesn't affect eating quality",
                "Cosmetic damage primarily"
            ],
            prevention=[
                "Maintain soil pH 5.0-5.2 (slightly acidic)",
                "Avoid fresh manure",
                "Keep soil evenly moist during tuber formation",
                "Use resistant varieties",
                "Crop rotation helps"
            ],
            organic_treatment=[
                "Sulfur acidifies soil",
                "No cure once present",
                "Focus on prevention"
            ],
            risk_factors=["Alkaline soil", "Dry conditions during tuber set", "Fresh manure"],
            regional_risk={
                "Northeast": DiseaseRisk.MODERATE,
                "Southeast": DiseaseRisk.LOW,
                "Midwest": DiseaseRisk.HIGH,
                "West": DiseaseRisk.MODERATE,
            },
            peak_seasons=[DiseaseSeason.SUMMER]
        ),
    ],
    
    "melons": [
        DiseaseInfo(
            name="Fusarium Wilt",
            scientific_name="Fusarium oxysporum f. sp. melonis",
            symptoms=[
                "Wilting of leaves and vines",
                "Yellowing of lower leaves first",
                "Brown discoloration in stem",
                "Plant death"
            ],
            prevention=[
                "Use resistant varieties (critical)",
                "4-year crop rotation",
                "Don't plant where melons had wilt before",
                "Avoid injuring roots",
                "Good drainage helps"
            ],
            organic_treatment=[
                "No effective treatment",
                "Remove and destroy infected plants",
                "Solarize soil if severe",
                "Plant only resistant varieties"
            ],
            risk_factors=["Warm soil temps", "Root damage", "Contaminated soil"],
            regional_risk={
                "Northeast": DiseaseRisk.MODERATE,
                "Southeast": DiseaseRisk.HIGH,
                "Midwest": DiseaseRisk.MODERATE,
                "West": DiseaseRisk.MODERATE,
            },
            peak_seasons=[DiseaseSeason.SUMMER]
        ),
        DiseaseInfo(
            name="Powdery Mildew",
            scientific_name="Podosphaera xanthii",
            symptoms=[
                "White powdery coating on leaves",
                "Fruit flavor may be affected",
                "Leaves die prematurely",
                "Reduces fruit quality"
            ],
            prevention=[
                "Plant resistant varieties",
                "Ensure good air circulation",
                "Avoid overhead watering",
                "Space plants properly",
                "Remove infected leaves"
            ],
            organic_treatment=[
                "Milk spray (1:9 ratio)",
                "Baking soda solution",
                "Neem oil spray",
                "Sulfur fungicide"
            ],
            risk_factors=["High humidity", "Moderate temperatures", "Dense foliage"],
            regional_risk={
                "Northeast": DiseaseRisk.MODERATE,
                "Southeast": DiseaseRisk.HIGH,
                "Midwest": DiseaseRisk.MODERATE,
                "West": DiseaseRisk.LOW,
            },
            peak_seasons=[DiseaseSeason.SUMMER, DiseaseSeason.FALL]
        ),
        DiseaseInfo(
            name="Anthracnose",
            scientific_name="Colletotrichum orbiculare",
            symptoms=[
                "Sunken spots on fruit",
                "Pink or orange spore masses",
                "Water-soaked lesions on leaves",
                "Vines may wilt"
            ],
            prevention=[
                "3-year crop rotation",
                "Use disease-free seed",
                "Remove plant debris",
                "Avoid overhead watering",
                "Good air circulation"
            ],
            organic_treatment=[
                "Copper fungicide spray",
                "Remove infected fruit",
                "Improve air flow"
            ],
            risk_factors=["Warm humid weather", "Overhead irrigation", "Wet foliage"],
            regional_risk={
                "Northeast": DiseaseRisk.MODERATE,
                "Southeast": DiseaseRisk.HIGH,
                "Midwest": DiseaseRisk.MODERATE,
                "West": DiseaseRisk.LOW,
            },
            peak_seasons=[DiseaseSeason.SUMMER, DiseaseSeason.FALL]
        ),
    ],
    
    "peas": [
        DiseaseInfo(
            name="Powdery Mildew",
            scientific_name="Erysiphe polygoni",
            symptoms=[
                "White powdery coating on leaves and pods",
                "Starts on lower leaves",
                "Leaves yellow and die",
                "Reduces pod production"
            ],
            prevention=[
                "Plant in full sun",
                "Ensure good air circulation",
                "Use resistant varieties",
                "Avoid overhead watering",
                "Plant early to avoid hot weather"
            ],
            organic_treatment=[
                "Milk spray (1:9 ratio)",
                "Baking soda solution",
                "Neem oil spray"
            ],
            risk_factors=["High humidity", "Warm weather", "Dense plantings"],
            regional_risk={
                "Northeast": DiseaseRisk.MODERATE,
                "Southeast": DiseaseRisk.HIGH,
                "Midwest": DiseaseRisk.MODERATE,
                "West": DiseaseRisk.LOW,
            },
            peak_seasons=[DiseaseSeason.SUMMER]
        ),
        DiseaseInfo(
            name="Fusarium Wilt",
            scientific_name="Fusarium oxysporum f. sp. pisi",
            symptoms=[
                "Yellowing of lower leaves",
                "Wilting of entire plant",
                "Brown discoloration in stem",
                "Stunted growth"
            ],
            prevention=[
                "Plant resistant varieties",
                "4-year crop rotation",
                "Improve soil drainage",
                "Don't plant in infected soil",
                "Maintain soil health"
            ],
            organic_treatment=[
                "No effective treatment",
                "Remove infected plants",
                "Soil solarization",
                "Plant only resistant varieties"
            ],
            risk_factors=["Warm soil", "Poor drainage", "Contaminated soil"],
            regional_risk={
                "Northeast": DiseaseRisk.MODERATE,
                "Southeast": DiseaseRisk.HIGH,
                "Midwest": DiseaseRisk.MODERATE,
                "West": DiseaseRisk.MODERATE,
            },
            peak_seasons=[DiseaseSeason.SUMMER]
        ),
        DiseaseInfo(
            name="Root Rot",
            scientific_name="Aphanomyces euteiches",
            symptoms=[
                "Yellowing plants",
                "Stunted growth",
                "Brown discolored roots",
                "Plant death"
            ],
            prevention=[
                "Ensure excellent drainage",
                "Raised beds help",
                "Don't overwater",
                "Plant resistant varieties",
                "Long crop rotations"
            ],
            organic_treatment=[
                "No effective cure",
                "Improve drainage",
                "Remove infected plants",
                "Focus on prevention"
            ],
            risk_factors=["Wet soil", "Poor drainage", "Cool weather"],
            regional_risk={
                "Northeast": DiseaseRisk.MODERATE,
                "Southeast": DiseaseRisk.LOW,
                "Midwest": DiseaseRisk.HIGH,
                "West": DiseaseRisk.LOW,
            },
            peak_seasons=[DiseaseSeason.SPRING]
        ),
    ],
    
    "corn": [
        DiseaseInfo(
            name="Common Rust",
            scientific_name="Puccinia sorghi",
            symptoms=[
                "Small, circular to elongate brown pustules on leaves",
                "Pustules on both sides of leaves",
                "Severe infection causes leaf death",
                "Reduces yield"
            ],
            prevention=[
                "Plant resistant hybrids",
                "Ensure good air circulation",
                "Remove infected plant debris",
                "Early planting helps avoid"
            ],
            organic_treatment=[
                "Usually not needed for home gardens",
                "Remove severely infected leaves",
                "Sulfur spray if severe"
            ],
            risk_factors=["Cool humid weather", "Heavy dew", "Moderate temps"],
            regional_risk={
                "Northeast": DiseaseRisk.MODERATE,
                "Southeast": DiseaseRisk.LOW,
                "Midwest": DiseaseRisk.HIGH,
                "West": DiseaseRisk.LOW,
            },
            peak_seasons=[DiseaseSeason.SUMMER]
        ),
        DiseaseInfo(
            name="Stewart's Wilt",
            scientific_name="Pantoea stewartii",
            symptoms=[
                "Long pale streaks on leaves",
                "Streaks turn brown",
                "Wilting of entire plant",
                "Bacterial ooze from cut stems"
            ],
            prevention=[
                "Plant resistant varieties",
                "Control corn flea beetles (vector)",
                "Remove infected plants",
                "Use certified seed"
            ],
            organic_treatment=[
                "No effective treatment",
                "Remove infected plants",
                "Focus on resistant varieties"
            ],
            risk_factors=["Flea beetle feeding", "Warm winters", "Sweet corn susceptible"],
            regional_risk={
                "Northeast": DiseaseRisk.MODERATE,
                "Southeast": DiseaseRisk.HIGH,
                "Midwest": DiseaseRisk.HIGH,
                "West": DiseaseRisk.LOW,
            },
            peak_seasons=[DiseaseSeason.SUMMER]
        ),
        DiseaseInfo(
            name="Gray Leaf Spot",
            scientific_name="Cercospora zeae-maydis",
            symptoms=[
                "Rectangular gray-brown lesions on leaves",
                "Lesions parallel to leaf veins",
                "Severe defoliation possible",
                "Yield loss"
            ],
            prevention=[
                "Plant resistant hybrids",
                "Crop rotation",
                "Bury or remove crop debris",
                "Avoid late plantings in some regions"
            ],
            organic_treatment=[
                "Usually not needed in home gardens",
                "Remove severely infected leaves",
                "Ensure good air circulation"
            ],
            risk_factors=["Warm humid weather", "Extended leaf wetness", "Susceptible hybrids"],
            regional_risk={
                "Northeast": DiseaseRisk.LOW,
                "Southeast": DiseaseRisk.VERY_HIGH,
                "Midwest": DiseaseRisk.HIGH,
                "West": DiseaseRisk.LOW,
            },
            peak_seasons=[DiseaseSeason.SUMMER]
        ),
    ],
    
    "zucchini": [
        DiseaseInfo(
            name="Bacterial Wilt",
            scientific_name="Erwinia tracheiphila",
            symptoms=[
                "Sudden wilting of leaves",
                "Wilting progresses to entire plant",
                "Milky bacterial ooze from cut stems",
                "Plant death"
            ],
            prevention=[
                "Control cucumber beetles (vectors)",
                "Row covers until flowering",
                "Remove infected plants immediately",
                "Plant extra to compensate"
            ],
            organic_treatment=[
                "No cure once infected",
                "Remove infected plants",
                "Control beetles with neem",
                "Row covers prevent beetle feeding"
            ],
            risk_factors=["Cucumber beetle feeding", "Warm weather", "No resistance available"],
            regional_risk={
                "Northeast": DiseaseRisk.HIGH,
                "Southeast": DiseaseRisk.MODERATE,
                "Midwest": DiseaseRisk.VERY_HIGH,
                "West": DiseaseRisk.LOW,
            },
            peak_seasons=[DiseaseSeason.SUMMER]
        ),
        DiseaseInfo(
            name="Powdery Mildew",
            scientific_name="Podosphaera xanthii",
            symptoms=[
                "White powdery spots on leaves",
                "Leaves yellow and die",
                "Reduced fruit production",
                "Affects fruit quality"
            ],
            prevention=[
                "Plant resistant varieties",
                "Ensure good air circulation",
                "Avoid overhead watering",
                "Space plants properly",
                "Remove infected leaves promptly"
            ],
            organic_treatment=[
                "Milk spray (1:9 ratio)",
                "Baking soda solution",
                "Neem oil spray",
                "Sulfur fungicide"
            ],
            risk_factors=["High humidity", "Moderate temps", "Dense foliage"],
            regional_risk={
                "Northeast": DiseaseRisk.MODERATE,
                "Southeast": DiseaseRisk.VERY_HIGH,
                "Midwest": DiseaseRisk.HIGH,
                "West": DiseaseRisk.LOW,
            },
            peak_seasons=[DiseaseSeason.SUMMER, DiseaseSeason.FALL]
        ),
    ],
    
    "eggplant": [
        DiseaseInfo(
            name="Verticillium Wilt",
            scientific_name="Verticillium dahliae",
            symptoms=[
                "Yellowing of older leaves",
                "Wilting on one side of plant",
                "Brown discoloration in stem",
                "Progressive plant decline"
            ],
            prevention=[
                "Plant resistant varieties",
                "4-year crop rotation",
                "Solarize soil if present",
                "Avoid planting where nightshades grew",
                "Maintain soil health"
            ],
            organic_treatment=[
                "No cure once infected",
                "Remove infected plants",
                "Soil solarization",
                "Compost to improve soil biology"
            ],
            risk_factors=["Cool soil", "Present in soil for years", "Stressed plants"],
            regional_risk={
                "Northeast": DiseaseRisk.MODERATE,
                "Southeast": DiseaseRisk.LOW,
                "Midwest": DiseaseRisk.HIGH,
                "West": DiseaseRisk.HIGH,
            },
            peak_seasons=[DiseaseSeason.SUMMER]
        ),
        DiseaseInfo(
            name="Phytophthora Blight",
            scientific_name="Phytophthora capsici",
            symptoms=[
                "Water-soaked lesions on stems",
                "Sudden plant wilting",
                "White mold on infected tissue",
                "Fruit rot"
            ],
            prevention=[
                "Excellent drainage essential",
                "Raised beds recommended",
                "Avoid planting where peppers/cucurbits grew",
                "Space plants well",
                "Mulch to prevent splash"
            ],
            organic_treatment=[
                "Remove infected plants immediately",
                "No effective organic cure",
                "Soil solarization helps"
            ],
            risk_factors=["Poor drainage", "Heavy rains", "Warm soil"],
            regional_risk={
                "Northeast": DiseaseRisk.MODERATE,
                "Southeast": DiseaseRisk.VERY_HIGH,
                "Midwest": DiseaseRisk.HIGH,
                "West": DiseaseRisk.LOW,
            },
            peak_seasons=[DiseaseSeason.SUMMER]
        ),
    ],
    
    "kale": [
        DiseaseInfo(
            name="Downy Mildew",
            scientific_name="Peronospora parasitica",
            symptoms=[
                "Yellow spots on upper leaf surfaces",
                "Gray-white mold underneath",
                "Leaf distortion",
                "Reduced leaf quality"
            ],
            prevention=[
                "Plant resistant varieties",
                "Good air circulation",
                "Avoid overhead watering",
                "Space plants adequately",
                "Remove infected leaves"
            ],
            organic_treatment=[
                "Copper fungicide",
                "Remove infected tissue",
                "Improve air flow"
            ],
            risk_factors=["Cool moist weather", "High humidity", "Dense plantings"],
            regional_risk={
                "Northeast": DiseaseRisk.HIGH,
                "Southeast": DiseaseRisk.MODERATE,
                "Midwest": DiseaseRisk.HIGH,
                "West": DiseaseRisk.MODERATE,
            },
            peak_seasons=[DiseaseSeason.SPRING, DiseaseSeason.FALL]
        ),
        DiseaseInfo(
            name="Alternaria Leaf Spot",
            scientific_name="Alternaria brassicae",
            symptoms=[
                "Dark brown spots with yellow halos",
                "Concentric rings in spots",
                "Premature leaf drop",
                "Reduced harvest quality"
            ],
            prevention=[
                "3-year crop rotation",
                "Remove plant debris",
                "Avoid overhead watering",
                "Space plants well",
                "Use disease-free seed"
            ],
            organic_treatment=[
                "Copper fungicide spray",
                "Remove infected leaves",
                "Improve air circulation"
            ],
            risk_factors=["Warm humid weather", "Overhead irrigation", "Dense foliage"],
            regional_risk={
                "Northeast": DiseaseRisk.MODERATE,
                "Southeast": DiseaseRisk.HIGH,
                "Midwest": DiseaseRisk.MODERATE,
                "West": DiseaseRisk.LOW,
            },
            peak_seasons=[DiseaseSeason.SUMMER, DiseaseSeason.FALL]
        ),
    ],
}


def get_disease_info(crop: str) -> List[DiseaseInfo]:
    """
    Get disease information for a crop.
    
    Args:
        crop: Crop name
    
    Returns:
        List of disease info for that crop
    """
    crop_lower = crop.lower()
    
    # Direct match
    if crop_lower in DISEASE_DATABASE:
        return DISEASE_DATABASE[crop_lower]
    
    # Check for partial matches
    for key in DISEASE_DATABASE:
        if key in crop_lower or crop_lower in key:
            return DISEASE_DATABASE[key]
    
    # Check brassica family
    brassica_crops = ["broccoli", "cauliflower", "cabbage", "kale", "brussels sprouts", "collards"]
    if any(b in crop_lower for b in brassica_crops):
        return DISEASE_DATABASE["brassicas"]
    
    return []


def get_regional_disease_risk(crop: str, region: Optional[str] = None) -> Dict[str, List[tuple]]:
    """
    Get disease risks for a crop, optionally filtered by region.
    
    Args:
        crop: Crop name
        region: Optional US region (Northeast, Southeast, Midwest, West)
    
    Returns:
        Dict with disease risks by risk level
    """
    diseases = get_disease_info(crop)
    if not diseases:
        return {}
    
    risk_groups = {
        "Very High": [],
        "High": [],
        "Moderate": [],
        "Low": [],
    }
    
    for disease in diseases:
        if disease.regional_risk and region:
            # Filter by specific region
            risk = disease.regional_risk.get(region)
            if risk:
                risk_groups[risk.value].append((disease.name, disease))
        elif disease.regional_risk:
            # Show all regional risks
            for reg, risk in disease.regional_risk.items():
                risk_groups[risk.value].append((disease.name, disease, reg))
        else:
            # No regional data, add to moderate
            risk_groups["Moderate"].append((disease.name, disease))
    
    return {k: v for k, v in risk_groups.items() if v}


def generate_disease_prevention_guide(crops: List[str], region: Optional[str] = None) -> str:
    """
    Generate disease prevention guide for selected crops.
    
    Args:
        crops: List of crop names
    
    Returns:
        Formatted prevention guide
    """
    if not crops:
        return ""
    
    guide = "\n🏥 Disease Prevention & Management Guide\n\n"
    
    if region:
        guide += f"Common diseases for your crops in the {region} region:\n\n"
    else:
        guide += "Common diseases for your crops and how to prevent them:\n\n"
    
    crops_with_info = []
    for crop in crops:
        diseases = get_disease_info(crop)
        if diseases:
            crops_with_info.append((crop, diseases))
    
    if not crops_with_info:
        guide += "No specific disease information available for your selected crops.\n"
        guide += "Follow general prevention practices below.\n\n"
    else:
        for crop, diseases in crops_with_info:
            guide += f"**{crop.title()}**:\n\n"
            
            for disease in diseases[:2]:  # Top 2 diseases per crop
                guide += f"  {disease.name}:\n"
                
                # v3.2: Show regional risk if available
                if disease.regional_risk and region and region in disease.regional_risk:
                    risk_level = disease.regional_risk[region].value
                    risk_emoji = {
                        "Very High": "🔴",
                        "High": "🟠",
                        "Moderate": "🟡",
                        "Low": "🟢"
                    }.get(risk_level, "")
                    guide += f"    Risk Level in {region}: {risk_emoji} {risk_level}\n"
                
                guide += f"    Symptoms: {disease.symptoms[0]}\n"
                guide += f"    Prevention:\n"
                for prev in disease.prevention[:3]:  # Top 3 prevention tips
                    guide += f"      • {prev}\n"
                if disease.risk_factors:
                    guide += f"    Risk Factors: {', '.join(disease.risk_factors[:2])}\n"
                guide += "\n"
    
    # General prevention tips
    guide += "**General Disease Prevention Tips**:\n"
    guide += "  ✓ Water at base of plants, avoid wetting foliage\n"
    guide += "  ✓ Ensure proper plant spacing for air circulation\n"
    guide += "  ✓ Mulch to prevent soil splash onto leaves\n"
    guide += "  ✓ Remove diseased plant material immediately\n"
    guide += "  ✓ Practice crop rotation (3-4 year cycle)\n"
    guide += "  ✓ Sanitize tools between plants\n"
    guide += "  ✓ Choose disease-resistant varieties when available\n"
    guide += "  ✓ Don't work in garden when plants are wet\n"
    guide += "  ✓ Remove debris and weeds that harbor diseases\n"
    guide += "  ✓ Monitor plants weekly for early detection\n\n"
    
    guide += "**When to Act**:\n"
    guide += "  • Inspect plants weekly, especially after rain\n"
    guide += "  • Catch diseases early when treatment is most effective\n"
    guide += "  • Remove infected leaves/plants promptly\n"
    guide += "  • Apply organic treatments at first sign of issues\n"
    guide += "  • Contact extension office if unsure about identification\n"
    
    return guide


def get_disease_by_symptoms(symptoms: List[str], crop: Optional[str] = None) -> List[DiseaseInfo]:
    """
    Find diseases matching symptoms (basic keyword matching).
    
    Args:
        symptoms: List of symptom descriptions
        crop: Optional crop to narrow search
    
    Returns:
        List of matching diseases
    """
    matches = []
    
    # Get relevant database
    if crop:
        diseases = get_disease_info(crop)
        search_set = [(crop, diseases)]
    else:
        search_set = DISEASE_DATABASE.items()
    
    # Search for symptom matches
    for crop_name, disease_list in search_set:
        for disease in disease_list:
            for user_symptom in symptoms:
                user_lower = user_symptom.lower()
                for disease_symptom in disease.symptoms:
                    if any(word in disease_symptom.lower() for word in user_lower.split()):
                        if disease not in matches:
                            matches.append(disease)
                        break
    
    return matches


def generate_organic_treatment_guide(crop: str) -> str:
    """
    Generate organic treatment guide for a specific crop.
    
    Args:
        crop: Crop name
    
    Returns:
        Formatted treatment guide
    """
    diseases = get_disease_info(crop)
    if not diseases:
        return ""
    
    guide = f"\n🌿 Organic Disease Treatments for {crop.title()}\n\n"
    
    for disease in diseases:
        guide += f"**{disease.name}**:\n"
        guide += "  Organic Treatments:\n"
        for treatment in disease.organic_treatment:
            guide += f"    • {treatment}\n"
        guide += "\n"
    
    guide += "**Common Organic Remedies**:\n"
    guide += "  • Copper Fungicide: Broad-spectrum, apply preventively\n"
    guide += "  • Neem Oil: Antifungal and pest control\n"
    guide += "  • Milk Spray: 1:9 milk:water for powdery mildew\n"
    guide += "  • Baking Soda: 1 tbsp per gallon for fungal issues\n"
    guide += "  • Compost Tea: Boosts plant immunity\n"
    guide += "  • Sulfur: Fungicide for various diseases\n\n"
    
    guide += "**Important Notes**:\n"
    guide += "  • Always follow label directions\n"
    guide += "  • Test spray on small area first\n"
    guide += "  • Apply in early morning or evening\n"
    guide += "  • Reapply after rain\n"
    guide += "  • Prevention is easier than cure\n"
    
    return guide
