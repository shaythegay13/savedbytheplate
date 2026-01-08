from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field, validator


class GardeningMethod(str, Enum):
    RAISED_BEDS = "Raised Beds"
    CONTAINERS = "Container Gardening"
    IN_GROUND = "In-ground Gardening"
    VERTICAL = "Vertical Gardening"
    INDOOR = "Indoor Gardening"
    ROOFTOP = "Rooftop Gardening"
    HYDROPONIC = "Hydroponic Gardening"


class SpaceSize(str, Enum):
    SMALL = "Small (windowsill, few containers)"
    MEDIUM = "Medium (balcony, small patio)"
    LARGE = "Large (backyard, rooftop)"
    VERY_LARGE = "Very Large (community garden plot)"


class Sunlight(str, Enum):
    FULL_SUN = "Full Sun (6+ hours direct sunlight)"
    PARTIAL_SUN = "Partial Sun (4-6 hours direct sunlight)"
    LIMITED_SUN = "Limited Sun (2-4 hours direct sunlight)"
    NO_SUN = "No Sun (shade only)"
    ARTIFICIAL_LIGHTS = "Artificial Lights (grow lights)"
    # Legacy options for backward compatibility
    PARTIAL_SHADE = "Partial Shade (2-4 hours direct sunlight)"
    SHADE = "Shade (less than 2 hours direct sunlight)"
    ARTIFICIAL_ONLY = "Artificial Light Only (grow lights)"


class Experience(str, Enum):
    BEGINNER = "Beginner (never grown anything before)"
    NOVICE = "Novice (grown a few plants)"
    INTERMEDIATE = "Intermediate (successful garden seasons)"
    ADVANCED = "Advanced (experienced gardener)"


class CropInterest(str, Enum):
    LEAFY_GREENS = "Leafy Greens (lettuce, spinach, kale)"
    HERBS = "Herbs (basil, parsley, cilantro, mint)"
    TOMATOES = "Tomatoes"
    PEPPERS = "Peppers"
    ROOT_VEGETABLES = "Root Vegetables (carrots, radishes, beets)"
    MICROGREENS = "Microgreens"
    ONIONS_GARLIC = "Onions and Garlic"
    BEANS_PEAS = "Beans and Peas"
    SQUASH_CUCUMBERS = "Squash and Cucumbers"
    BERRIES = "Berries (strawberries, blueberries, raspberries)"
    FRUIT_TREES = "Fruit Trees (apples, pears, citrus)"
    SUGGEST = "I don't know - suggest crops for me"


class Preference(str, Enum):
    DROUGHT_RESISTANT = "Drought Resistant"
    MIN_WATER = "Plants that need minimal watering"
    NATIVE = "Native Plants"
    NATIVE_NYC = "Plants native to the NYC region"
    LOW_MAINTENANCE = "Low Maintenance"
    EASY_CARE = "Easy care plants for busy schedules"
    PEST_RESISTANT = "Pest Resistant"
    FAST_GROWING = "Fast Growing"
    YEAR_ROUND = "Year-Round Growing"


class GrowingLocation(str, Enum):
    INDOORS = "Indoors"
    OUTDOORS = "Outdoors"
    BOTH = "Both"


class Season(str, Enum):
    SPRING = "Spring"
    SUMMER = "Summer"
    FALL = "Fall"
    WINTER = "Winter"


class TimeCommitment(str, Enum):
    MINIMAL = "Minimal (check weekly)"
    MODERATE = "Moderate (few times per week)"
    DEDICATED = "Dedicated (daily care)"


class LocationInput(BaseModel):
    address: Optional[str] = Field(None, description="Free-form address")
    latitude: Optional[float] = Field(None, description="Latitude in decimal degrees")
    longitude: Optional[float] = Field(None, description="Longitude in decimal degrees")

    @validator('longitude')
    def validate_lon(cls, v):
        if v is None:
            return v
        if v < -180 or v > 180:
            raise ValueError('Longitude must be between -180 and 180')
        return v

    @validator('latitude')
    def validate_lat(cls, v):
        if v is None:
            return v
        if v < -90 or v > 90:
            raise ValueError('Latitude must be between -90 and 90')
        return v

    def has_coordinates(self) -> bool:
        return self.latitude is not None and self.longitude is not None


class UserGoals(BaseModel):
    crops: List[CropInterest]
    preferences: List[Preference] = []
    notes: Optional[str] = None


class SoilType(str, Enum):
    """Soil water holding capacity classification"""
    HIGH = "High (Clay, fine textured)"
    MEDIUM = "Medium (Loam, mixed)"
    LOW = "Low (Sand, coarse)"
    UNKNOWN = "Unknown - use medium as default"


class UserInput(BaseModel):
    location: LocationInput
    method: GardeningMethod
    size: SpaceSize
    sunlight: Sunlight
    experience: Experience
    goals: UserGoals
    soil_type: SoilType = SoilType.UNKNOWN
    seasons: Optional[List[str]] = None  # User's selected growing seasons (Spring, Summer, Fall, Winter)
    image_path: Optional[str] = None  # Optional path to the space image


class ClimateData(BaseModel):
    latitude: float
    longitude: float
    timezone: str
    daily_highs_c: List[float]
    daily_lows_c: List[float]
    daily_precip_mm: List[float]
    summary: str
    # Regional metadata
    country: Optional[str] = None
    state: Optional[str] = None
    city: Optional[str] = None
    us_region: Optional[str] = None  # e.g., Northeast, Midwest, South, West
    # Season planning
    usda_zone: Optional[str] = None  # e.g., 6b
    frost_last_spring: Optional[str] = None  # ISO date or month window
    frost_first_fall: Optional[str] = None  # ISO date or month window
