# Crop Database Expansion Plan

## Current Status
- ✅ 100+ crops with detailed variety information
- ✅ Disease prevention system
- ✅ Companion planting system

## Expansion Needed
Add 245+ crops across categories:
- 50+ Fruits
- 50+ Vegetables  
- 40+ Nuts
- 35+ Grains
- 35+ Seeds
- 35+ Legumes
- 35+ Rice varieties

## Implementation Strategy

### Phase 1: Basic Crop Data (DONE)
Create simplified entries for all crops with:
- Name and category
- Growing season
- Difficulty level
- Space requirements
- Days to maturity
- Basic care needs

### Phase 2: Disease Mapping
Map crops to disease families:
- Nightshades → Early blight, Late blight, etc.
- Brassicas → Clubroot, Black rot, etc.
- Cucurbits → Powdery mildew, Downy mildew, etc.

### Phase 3: Companion Planting
Use crop family relationships for companion recommendations

### Phase 4: Enhancement
Add detailed variety information over time for popular crops

## Files to Create
1. `extended_crops_data.json` - All crop data in JSON format
2. `crop_families.py` - Family-based disease and companion mapping
3. `crop_loader.py` - Load and integrate extended crops

## Next Steps
Run: `python -m agi_agent.gardening.generate_extended_crops`
This will create the JSON database from the crop lists provided.
