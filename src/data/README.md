# Food Resources Data

This directory contains data files for food resources in the NYC metropolitan area.

## Data Structure

The data is stored in CSV format with the following fields:

- `name`: Name of the resource
- `type`: Type of resource (community_garden, food_bank, farmers_market, community_fridge, urban_farm)
- `address`: Full address
- `latitude`: Latitude coordinate
- `longitude`: Longitude coordinate
- `organization`: Managing organization (e.g., GreenThumb, NYRP, BQLT)
- `website`: Website URL (if available)
- `hours`: Operating hours (if applicable)
- `contact`: Contact information (if available)
- `additional_info`: Any additional relevant information

## Data Sources

1. NYC Open Data - GreenThumb Community Gardens
2. New York Restoration Project (NYRP)
3. Land Trusts:
   - Brooklyn-Queens Land Trust
   - Manhattan Land Trust
   - Bronx Land Trust
4. Community Fridges
5. Food Banks
6. Farmers Markets
7. Urban Farms

## Processing Scripts

The `scripts` directory contains Python scripts for:
- Data collection from various sources
- Data cleaning and standardization
- Geocoding (when coordinates aren't provided)
- Data validation
- CSV generation 