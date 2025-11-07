#!/usr/bin/env python3
"""
Merge multiple location CSV files into a single deduplicated file.
Combines data from duplicate entries and ensures all locations have coordinates.
"""

import csv
import sys
from typing import Dict, List, Optional
from collections import defaultdict
import math

def normalize_name(name: str) -> str:
    """Normalize location name for comparison."""
    return name.lower().strip().replace("'", "").replace('"', '')

def are_coordinates_close(lat1: float, lng1: float, lat2: float, lng2: float, threshold_km: float = 0.1) -> bool:
    """Check if two coordinates are within threshold distance (default 100 meters)."""
    if lat1 == 0 or lng1 == 0 or lat2 == 0 or lng2 == 0:
        return False

    # Haversine formula for distance
    R = 6371  # Earth radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lng2 - lng1)
    a = (math.sin(dlat/2) * math.sin(dlat/2) +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlon/2) * math.sin(dlon/2))
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    distance = R * c
    return distance < threshold_km

def safe_float(value: str) -> float:
    """Safely convert string to float."""
    try:
        return float(value) if value and value.strip() else 0.0
    except ValueError:
        return 0.0

def merge_field(existing: str, new: str) -> str:
    """Merge two field values, preferring non-empty values."""
    existing = existing.strip() if existing else ""
    new = new.strip() if new else ""

    if not existing:
        return new
    if not new:
        return existing
    if existing == new:
        return existing

    # If both exist and are different, prefer the longer/more detailed one
    return new if len(new) > len(existing) else existing

def read_comprehensive_csv(filepath: str) -> List[Dict]:
    """Read complete_comprehensive_food_access.csv"""
    locations = []
    with open(filepath, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            lat = safe_float(row.get('latitude', ''))
            lng = safe_float(row.get('longitude', ''))

            if lat == 0 or lng == 0:
                continue  # Skip entries without coordinates

            locations.append({
                'name': row.get('name', '').strip(),
                'type': row.get('type', '').strip(),
                'address': row.get('address', '').strip(),
                'latitude': lat,
                'longitude': lng,
                'organization': row.get('organization', '').strip(),
                'hours': row.get('hours', '').strip(),
                'contact': row.get('contact', '').strip(),
                'additional_info': row.get('additional_info', '').strip(),
                'neighborhood': '',
                'owner': '',
                'local_items_selling': '',
                'social_media_website1': '',
                'social_media_website2': '',
                'website': '',
            })
    return locations

def read_nyc_complete_csv(filepath: str) -> List[Dict]:
    """Read nyc_food_access_data_COMPLETE.csv"""
    locations = []
    with open(filepath, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            lat = safe_float(row.get('lat', ''))
            lng = safe_float(row.get('long', ''))

            if lat == 0 or lng == 0:
                continue  # Skip entries without coordinates

            locations.append({
                'name': row.get('name', '').strip(),
                'type': row.get('type', '').strip(),
                'address': row.get('address', '').strip(),
                'latitude': lat,
                'longitude': lng,
                'organization': '',
                'hours': row.get('open_hours', '').strip(),
                'contact': row.get('contact_information', '').strip(),
                'additional_info': row.get('description', '').strip(),
                'neighborhood': row.get('neighborhood', '').strip(),
                'owner': row.get('owner', '').strip(),
                'local_items_selling': row.get('local_items_selling', '').strip(),
                'social_media_website1': row.get('social_media_website1', '').strip(),
                'social_media_website2': row.get('social_media_website2', '').strip(),
                'website': '',
            })
    return locations

def merge_locations(locations: List[Dict]) -> List[Dict]:
    """Deduplicate and merge location data."""
    merged = []
    processed_indices = set()

    for i, loc1 in enumerate(locations):
        if i in processed_indices:
            continue

        # Start with this location
        merged_loc = loc1.copy()
        processed_indices.add(i)

        # Find duplicates
        for j in range(i + 1, len(locations)):
            if j in processed_indices:
                continue

            loc2 = locations[j]

            # Check if duplicate (same name or very close coordinates)
            is_duplicate = False

            if normalize_name(loc1['name']) == normalize_name(loc2['name']):
                is_duplicate = True
            elif are_coordinates_close(loc1['latitude'], loc1['longitude'],
                                       loc2['latitude'], loc2['longitude']):
                is_duplicate = True

            if is_duplicate:
                # Merge all fields
                for key in merged_loc.keys():
                    if key not in ['latitude', 'longitude']:
                        merged_loc[key] = merge_field(merged_loc[key], loc2[key])
                    elif key == 'latitude' or key == 'longitude':
                        # Use non-zero coordinate if one is zero
                        if merged_loc[key] == 0:
                            merged_loc[key] = loc2[key]

                processed_indices.add(j)

        merged.append(merged_loc)

    return merged

def write_final_csv(locations: List[Dict], filepath: str):
    """Write merged locations to final CSV."""
    fieldnames = [
        'name', 'type', 'address', 'latitude', 'longitude',
        'organization', 'website', 'hours', 'contact', 'additional_info',
        'neighborhood', 'owner', 'local_items_selling',
        'social_media_website1', 'social_media_website2'
    ]

    with open(filepath, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()

        for loc in locations:
            # Ensure all fields exist
            row = {field: loc.get(field, '') for field in fieldnames}
            writer.writerow(row)

def main():
    print("Reading complete_comprehensive_food_access.csv...")
    comprehensive_locs = read_comprehensive_csv('/home/user/savedbytheplate/public/processed/complete_comprehensive_food_access.csv')
    print(f"  Found {len(comprehensive_locs)} locations with coordinates")

    print("Reading nyc_food_access_data_COMPLETE.csv...")
    nyc_locs = read_nyc_complete_csv('/home/user/savedbytheplate/public/processed/nyc_food_access_data_COMPLETE.csv')
    print(f"  Found {len(nyc_locs)} locations with coordinates")

    print("Merging and deduplicating locations...")
    all_locations = comprehensive_locs + nyc_locs
    print(f"  Total before deduplication: {len(all_locations)}")

    merged_locations = merge_locations(all_locations)
    print(f"  Total after deduplication: {len(merged_locations)}")
    print(f"  Removed {len(all_locations) - len(merged_locations)} duplicates")

    output_path = '/home/user/savedbytheplate/public/processed/final_locations.csv'
    print(f"Writing to {output_path}...")
    write_final_csv(merged_locations, output_path)

    print("✅ Done! Created final_locations.csv")

if __name__ == '__main__':
    main()
