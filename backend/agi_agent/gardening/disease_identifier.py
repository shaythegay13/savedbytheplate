"""
Disease Identification System
Analyzes plant images to identify diseases from the comprehensive 300+ disease database
"""

from typing import List, Dict, Optional, Tuple
from pydantic import BaseModel
from .crop_families import FAMILY_DISEASES, CROP_FAMILIES, CropFamily, get_crop_family, get_family_diseases
import base64
import io


class DiseaseIdentificationRequest(BaseModel):
    """Request model for disease identification"""
    image_base64: Optional[str] = None  # Base64 encoded image
    image_url: Optional[str] = None  # URL to image
    crop_name: Optional[str] = None  # Optional: crop name to narrow search
    symptoms: Optional[List[str]] = None  # Optional: user-described symptoms
    location: Optional[str] = None  # Optional: location for regional diseases


class DiseaseMatch(BaseModel):
    """A potential disease match"""
    disease_name: str
    confidence: str  # "High", "Medium", "Low"
    crop_family: str
    description: str
    symptoms: List[str]
    prevention: List[str]
    treatment: List[str]
    similar_diseases: List[str]


class DiseaseIdentificationResponse(BaseModel):
    """Response model for disease identification"""
    status: str
    matches: List[DiseaseMatch]
    crop_identified: Optional[str] = None
    recommendations: List[str]
    notes: str


# Disease symptom keywords for matching
DISEASE_SYMPTOMS = {
    # Fungal diseases
    "Powdery Mildew": ["white", "powder", "coating", "leaves", "mildew"],
    "Downy Mildew": ["yellow", "downy", "fuzzy", "underside", "leaves"],
    "Early Blight": ["brown", "spots", "target", "rings", "concentric", "leaves"],
    "Late Blight": ["dark", "water-soaked", "lesions", "leaves", "stems"],
    "Anthracnose": ["dark", "sunken", "spots", "fruit", "leaves"],
    "Gray Mold": ["gray", "fuzzy", "mold", "fruit", "flowers"],
    "Rust": ["orange", "rust", "pustules", "leaves", "yellow"],
    "Black Spot": ["black", "spots", "circular", "leaves"],
    "Leaf Spot": ["spots", "brown", "yellow", "halo", "leaves"],
    "Root Rot": ["wilting", "yellowing", "stunted", "roots", "brown"],
    
    # Bacterial diseases
    "Bacterial Spot": ["small", "dark", "spots", "water-soaked", "leaves"],
    "Bacterial Wilt": ["wilting", "sudden", "entire plant", "vascular"],
    "Bacterial Canker": ["canker", "oozing", "stems", "branches"],
    "Fire Blight": ["blackened", "scorched", "shepherd's crook", "branches"],
    
    # Viral diseases
    "Mosaic Virus": ["mosaic", "mottled", "yellow", "green", "pattern"],
    "Leaf Curl": ["curled", "distorted", "puckered", "leaves"],
    "Yellows": ["yellowing", "stunted", "abnormal growth"],
    
    # Physiological
    "Blossom End Rot": ["dark", "sunken", "bottom", "fruit", "end"],
    "Tipburn": ["brown", "edges", "tips", "leaves"],
    "Sunscald": ["white", "bleached", "sunburned", "fruit"],
}


def identify_disease_from_image(
    image_data: Optional[str] = None,
    crop_name: Optional[str] = None,
    symptoms: Optional[List[str]] = None,
    location: Optional[str] = None
) -> DiseaseIdentificationResponse:
    """
    Identify plant disease from image and/or symptoms
    
    Note: This is a rule-based system. For production, integrate with:
    - Google Cloud Vision API for image analysis
    - TensorFlow/PyTorch ML model trained on plant diseases
    - PlantVillage dataset or similar
    """
    
    matches: List[DiseaseMatch] = []
    crop_identified = None
    
    # Step 1: Determine crop family
    crop_family = None
    if crop_name:
        crop_name_normalized = crop_name.lower().replace(" ", "_")
        crop_family = get_crop_family(crop_name_normalized)
        crop_identified = crop_name
    
    # Step 2: Get relevant diseases
    if crop_family:
        # Get diseases for this specific family
        family_diseases = get_family_diseases(crop_family)
    else:
        # Search across all families if crop unknown
        family_diseases = []
        for family in CropFamily:
            family_diseases.extend(get_family_diseases(family))
        family_diseases = list(set(family_diseases))  # Remove duplicates
    
    # Step 3: Match symptoms to diseases
    if symptoms:
        symptom_text = " ".join(symptoms).lower()
        
        for disease in family_diseases:
            disease_base = disease.split("(")[0].strip()  # Remove scientific names
            
            # Check if disease keywords match symptoms
            if disease_base in DISEASE_SYMPTOMS:
                keywords = DISEASE_SYMPTOMS[disease_base]
                matches_found = sum(1 for keyword in keywords if keyword in symptom_text)
                
                if matches_found >= 2:  # At least 2 keyword matches
                    confidence = "High" if matches_found >= 4 else "Medium" if matches_found >= 3 else "Low"
                    
                    match = create_disease_match(
                        disease,
                        confidence,
                        crop_family.value if crop_family else "Multiple families",
                        crop_name
                    )
                    matches.append(match)
    
    # Step 4: If no symptoms provided, return common diseases for the crop
    if not matches and crop_family:
        # Return top 5 most common diseases for this family
        for disease in family_diseases[:5]:
            match = create_disease_match(
                disease,
                "Medium",
                crop_family.value,
                crop_name
            )
            matches.append(match)
    
    # Step 5: Sort by confidence
    confidence_order = {"High": 0, "Medium": 1, "Low": 2}
    matches.sort(key=lambda x: confidence_order.get(x.confidence, 3))
    
    # Step 6: Generate recommendations
    recommendations = generate_recommendations(matches, crop_family)
    
    # Step 7: Create response
    notes = "Disease identification based on symptom analysis and crop family. "
    if not image_data:
        notes += "For more accurate identification, please provide a clear photo of the affected plant. "
    if not crop_name:
        notes += "Specifying the crop type will improve accuracy. "
    
    return DiseaseIdentificationResponse(
        status="success",
        matches=matches[:10],  # Return top 10 matches
        crop_identified=crop_identified,
        recommendations=recommendations,
        notes=notes
    )


def create_disease_match(
    disease_name: str,
    confidence: str,
    family_name: str,
    crop_name: Optional[str]
) -> DiseaseMatch:
    """Create a disease match with details"""
    
    # Extract base disease name
    disease_base = disease_name.split("(")[0].strip()
    
    # Generate symptoms based on disease type
    symptoms = get_disease_symptoms(disease_base)
    
    # Generate prevention tips
    prevention = get_disease_prevention(disease_base, family_name)
    
    # Generate treatment options
    treatment = get_disease_treatment(disease_base)
    
    # Find similar diseases
    similar = get_similar_diseases(disease_base)
    
    description = f"{disease_name} commonly affects {crop_name if crop_name else family_name} plants."
    
    return DiseaseMatch(
        disease_name=disease_name,
        confidence=confidence,
        crop_family=family_name,
        description=description,
        symptoms=symptoms,
        prevention=prevention,
        treatment=treatment,
        similar_diseases=similar
    )


def get_disease_symptoms(disease_name: str) -> List[str]:
    """Get symptoms for a disease"""
    symptom_map = {
        "Powdery Mildew": [
            "White powdery coating on leaves and stems",
            "Leaves may curl or become distorted",
            "Reduced plant vigor",
            "Premature leaf drop"
        ],
        "Downy Mildew": [
            "Yellow spots on upper leaf surface",
            "Fuzzy gray/purple growth on underside",
            "Leaves may curl downward",
            "Stunted growth"
        ],
        "Early Blight": [
            "Dark brown spots with concentric rings (target pattern)",
            "Yellowing around spots",
            "Lower leaves affected first",
            "Premature defoliation"
        ],
        "Late Blight": [
            "Dark water-soaked lesions on leaves",
            "White fuzzy growth in humid conditions",
            "Rapid spread in cool, wet weather",
            "Fruit rot with brown lesions"
        ],
        "Anthracnose": [
            "Dark sunken spots on fruit",
            "Circular lesions on leaves",
            "Pink spore masses in wet conditions",
            "Premature fruit drop"
        ],
        "Bacterial Spot": [
            "Small dark spots with yellow halos",
            "Water-soaked appearance",
            "Spots may merge together",
            "Fruit may have raised spots"
        ],
        "Blossom End Rot": [
            "Dark sunken area at blossom end of fruit",
            "Leathery texture",
            "Calcium deficiency related",
            "Not a disease but physiological disorder"
        ],
        "Root Rot": [
            "Wilting despite adequate water",
            "Yellowing leaves",
            "Stunted growth",
            "Brown, mushy roots"
        ],
    }
    
    # Check for partial matches
    for key in symptom_map:
        if key.lower() in disease_name.lower():
            return symptom_map[key]
    
    # Default symptoms
    return [
        "Visible damage to plant tissue",
        "Changes in leaf color or texture",
        "Reduced plant vigor",
        "Consult extension service for specific symptoms"
    ]


def get_disease_prevention(disease_name: str, family_name: str) -> List[str]:
    """Get prevention tips for a disease"""
    general_prevention = [
        "Practice crop rotation (3-4 year cycle)",
        "Ensure proper spacing for air circulation",
        "Water at base of plants, avoid wetting foliage",
        "Remove and destroy infected plant material",
        "Use disease-resistant varieties when available",
        "Maintain soil health with organic matter",
        "Sanitize tools between plants"
    ]
    
    specific_prevention = {
        "Powdery Mildew": [
            "Improve air circulation around plants",
            "Avoid overhead watering",
            "Apply sulfur or neem oil preventatively",
            "Plant in full sun when possible"
        ],
        "Blight": [
            "Use drip irrigation instead of overhead",
            "Mulch to prevent soil splash",
            "Remove lower leaves to improve airflow",
            "Apply copper fungicide preventatively"
        ],
        "Rust": [
            "Remove infected leaves immediately",
            "Avoid working with wet plants",
            "Apply fungicide at first sign",
            "Plant rust-resistant varieties"
        ],
        "Wilt": [
            "Solarize soil before planting",
            "Use resistant rootstocks",
            "Avoid planting in infected soil",
            "Control insect vectors"
        ],
    }
    
    # Check for specific prevention
    for key in specific_prevention:
        if key.lower() in disease_name.lower():
            return specific_prevention[key] + general_prevention[:3]
    
    return general_prevention[:5]


def get_disease_treatment(disease_name: str) -> List[str]:
    """Get treatment options for a disease"""
    
    if "virus" in disease_name.lower():
        return [
            "No cure for viral diseases",
            "Remove and destroy infected plants",
            "Control insect vectors (aphids, whiteflies)",
            "Plant virus-resistant varieties",
            "Prevent spread to healthy plants"
        ]
    
    if "bacterial" in disease_name.lower():
        return [
            "Remove infected plant parts",
            "Apply copper-based bactericide",
            "Improve air circulation",
            "Avoid overhead watering",
            "Disinfect tools between cuts"
        ]
    
    # Fungal diseases (most common)
    return [
        "Remove and destroy infected plant material",
        "Apply appropriate fungicide (organic or synthetic)",
        "Improve cultural practices (spacing, watering)",
        "Consider sulfur, copper, or neem oil treatments",
        "Ensure good drainage and air circulation",
        "For severe cases, remove entire plant"
    ]


def get_similar_diseases(disease_name: str) -> List[str]:
    """Get similar diseases that might be confused"""
    similar_map = {
        "Early Blight": ["Late Blight", "Septoria Leaf Spot", "Alternaria Leaf Spot"],
        "Powdery Mildew": ["Downy Mildew", "White Rust"],
        "Bacterial Spot": ["Bacterial Speck", "Septoria Leaf Spot"],
        "Anthracnose": ["Cercospora Leaf Spot", "Alternaria Leaf Spot"],
        "Root Rot": ["Fusarium Wilt", "Verticillium Wilt", "Damping Off"],
    }
    
    for key in similar_map:
        if key.lower() in disease_name.lower():
            return similar_map[key]
    
    return []


def generate_recommendations(matches: List[DiseaseMatch], crop_family: Optional[CropFamily]) -> List[str]:
    """Generate general recommendations based on matches"""
    recommendations = []
    
    if not matches:
        recommendations.append("Unable to identify disease from provided information")
        recommendations.append("Please provide clearer photos and describe symptoms")
        recommendations.append("Contact your local extension service for in-person diagnosis")
        return recommendations
    
    # High confidence match
    if matches and matches[0].confidence == "High":
        recommendations.append(f"Most likely disease: {matches[0].disease_name}")
        recommendations.append("Follow the prevention and treatment steps provided")
    else:
        recommendations.append("Multiple possible diseases identified")
        recommendations.append("Compare symptoms carefully with each match")
    
    # General recommendations
    recommendations.append("Remove affected plant parts immediately")
    recommendations.append("Improve air circulation and reduce humidity")
    recommendations.append("Consider sending sample to extension service for lab confirmation")
    
    if crop_family:
        recommendations.append(f"Practice crop rotation for {crop_family.value} family plants")
    
    return recommendations
