#!/usr/bin/env python3
"""
Process Queens Farm and other NYC farm data.
"""

import requests
import csv
from typing import Dict, List, Tuple
import time


def clean_text(text: str) -> str:
    """Clean text by removing extra whitespace and newlines."""
    if not text:
        return ""
    return " ".join(text.strip().split())


def geocode_address(address: str) -> Tuple[float, float]:
    """
    Simple geocoding using multiple providers with NYC area checks.
    Returns (latitude, longitude) or (0, 0) if geocoding fails.
    """
    if not address:
        return 0, 0

    # Add NYC if not present for better geocoding
    if "NY" not in address and "New York" not in address:
        address += ", New York, NY"

    try:
        # Try Nominatim first
        nominatim_url = "https://nominatim.openstreetmap.org/search"
        params = {"q": address, "format": "json", "limit": 1, "countrycodes": "us"}

        response = requests.get(nominatim_url, params=params, timeout=10)
        if response.status_code == 200:
            data = response.json()
            if data:
                lat, lon = float(data[0]["lat"]), float(data[0]["lon"])
                # Check if coordinates are in NYC area (rough bounds)
                if 40.4 <= lat <= 41.0 and -74.5 <= lon <= -73.5:
                    return lat, lon

        time.sleep(1)  # Rate limiting

    except Exception as e:
        print(f"Geocoding failed for {address}: {e}")

    return 0, 0


def fetch_queens_farm_data() -> List[Dict]:
    """Fetch Queens County Farm Museum data."""
    farms = []

    # Queens Farm data from the fetched content
    queens_farm = {
        "name": "Queens County Farm Museum",
        "type": "farm",
        "address": "73-50 Little Neck Pkwy, Floral Park, NY 11004",
        "organization": "Queens County Farm Museum",
        "website": "https://www.queensfarm.org/",
        "hours": "Wed-Sun 10am-4pm (May 7 - Nov 23)",
        "additional_info": "Historic farm with seasonal farmstand, naturally grown produce without pesticides or chemicals",
    }

    lat, lon = geocode_address(queens_farm["address"])
    if lat != 0 and lon != 0:
        queens_farm.update({"latitude": lat, "longitude": lon})
        farms.append(queens_farm)
        print(f"✅ Added Queens Farm: {queens_farm['name']}")

    # Additional farmstand locations from Queens Farm
    farmstand_locations = [
        {
            "name": "Queens Farm Farmstand at Jamaica Hospital",
            "type": "market",
            "address": "Jamaica Hospital, Jamaica, NY",
            "organization": "Queens County Farm Museum",
            "hours": "Fridays 10am-3pm (May 30 - Oct 31)",
            "additional_info": "Off-site farmstand with Queens Farm naturally grown produce",
        },
        {
            "name": "Queens Farm Farmstand at Queens Borough Hall",
            "type": "market",
            "address": "Queens Borough Hall, Kew Gardens, NY",
            "organization": "Queens County Farm Museum",
            "hours": "Thursdays 10am-3pm (May 15 - Oct 30)",
            "additional_info": "Off-site farmstand with Queens Farm naturally grown produce",
        },
        {
            "name": "Queens Farm at Astoria Farmers Market",
            "type": "market",
            "address": "Astoria, Queens, NY",
            "organization": "Queens County Farm Museum",
            "hours": "Second Sunday of each month 1pm-5pm",
            "additional_info": "Queens Farm booth at Astoria Farmers Market",
        },
    ]

    for location in farmstand_locations:
        lat, lon = geocode_address(location["address"])
        if lat != 0 and lon != 0:
            location.update({"latitude": lat, "longitude": lon})
            farms.append(location)
            print(f"✅ Added farmstand: {location['name']}")

        time.sleep(0.5)  # Rate limiting

    return farms


def fetch_nyc_urban_farms() -> List[Dict]:
    """Fetch additional NYC urban farm data."""
    farms = []

    # Urban farms from various sources
    urban_farms = [
        {
            "name": "Brooklyn Grange Rooftop Farm - Navy Yard",
            "type": "urbanfarm",
            "address": "63 Flushing Ave, Brooklyn, NY 11205",
            "organization": "Brooklyn Grange",
            "website": "https://www.brooklyngrangefarm.com/",
            "additional_info": "World's largest rooftop soil farm, commercial-scale urban agriculture",
        },
        {
            "name": "Brooklyn Grange Rooftop Farm - Long Island City",
            "type": "urbanfarm",
            "address": "37-18 Northern Blvd, Long Island City, NY 11101",
            "organization": "Brooklyn Grange",
            "website": "https://www.brooklyngrangefarm.com/",
            "additional_info": "Rooftop farm producing over 80,000 lbs of organic produce annually",
        },
        {
            "name": "Added Value Red Hook Farm",
            "type": "urbanfarm",
            "address": "Red Hook, Brooklyn, NY",
            "organization": "Added Value",
            "website": "https://www.added-value.org/",
            "additional_info": "Youth-operated urban farm in Red Hook",
        },
        {
            "name": "GrowNYC Teaching Garden",
            "type": "urbanfarm",
            "address": "Union Square Park, New York, NY",
            "organization": "GrowNYC",
            "website": "https://www.grownyc.org/",
            "additional_info": "Educational urban farm and composting demonstration site",
        },
        {
            "name": "Bronx Green-Up Community Garden Network",
            "type": "urbanfarm",
            "address": "Bronx, NY",
            "organization": "Bronx Green-Up",
            "website": "https://www.nybg.org/learn/bronx-green-up/",
            "additional_info": "Network of community gardens and urban farms in the Bronx",
        },
        {
            "name": "Staten Island Farm Colony",
            "type": "farm",
            "address": "Staten Island, NY",
            "organization": "NYC Parks",
            "additional_info": "Historic farm site with ongoing agricultural programs",
        },
    ]

    for farm_data in urban_farms:
        lat, lon = geocode_address(farm_data["address"])
        if lat != 0 and lon != 0:
            farm_data.update({"latitude": lat, "longitude": lon})
            farms.append(farm_data)
            print(f"✅ Added urban farm: {farm_data['name']}")
        else:
            print(
                f"❌ Could not geocode: {farm_data['name']} at {farm_data['address']}"
            )

        time.sleep(0.5)  # Rate limiting

    return farms


def fetch_additional_markets() -> List[Dict]:
    """Fetch additional farmers market data."""
    markets = []

    # Additional markets from the provided sources
    additional_markets = [
        {
            "name": "South Bronx Farmers Market",
            "type": "market",
            "address": "South Bronx, NY",
            "organization": "South Bronx Farmers Market",
            "website": "http://southbronxfarmersmarket.com/",
            "additional_info": "Community-focused farmers market serving the South Bronx",
        },
        {
            "name": "Jamaica Farmers Market",
            "type": "market",
            "address": "Jamaica, Queens, NY",
            "organization": "Public Markets NYC",
            "website": "https://publicmarkets.nyc/jamaica-farmers-market",
            "additional_info": "Weekly farmers market in Jamaica, Queens",
        },
        {
            "name": "Harlem Farmers Market",
            "type": "market",
            "address": "Harlem, Manhattan, NY",
            "organization": "GrowNYC",
            "additional_info": "Weekly farmers market serving Harlem community",
        },
        {
            "name": "Brooklyn Borough Hall Greenmarket",
            "type": "market",
            "address": "Brooklyn Borough Hall, Brooklyn, NY",
            "organization": "GrowNYC",
            "hours": "Tuesdays and Saturdays",
            "additional_info": "Year-round farmers market at Brooklyn Borough Hall",
        },
    ]

    for market_data in additional_markets:
        lat, lon = geocode_address(market_data["address"])
        if lat != 0 and lon != 0:
            market_data.update({"latitude": lat, "longitude": lon})
            markets.append(market_data)
            print(f"✅ Added market: {market_data['name']}")
        else:
            print(
                f"❌ Could not geocode: {market_data['name']} at {market_data['address']}"
            )

        time.sleep(0.5)  # Rate limiting

    return markets


def process_farms_and_markets() -> List[Dict]:
    """Process all farm and market data."""
    print("🌾 Processing farms and markets...")

    all_locations = []

    # Fetch from all sources
    queens_farms = fetch_queens_farm_data()
    urban_farms = fetch_nyc_urban_farms()
    additional_markets = fetch_additional_markets()

    all_locations.extend(queens_farms)
    all_locations.extend(urban_farms)
    all_locations.extend(additional_markets)

    # Remove duplicates based on name and approximate location
    unique_locations = []
    seen_names = set()

    for location in all_locations:
        location_key = location["name"].lower().strip()
        if location_key not in seen_names:
            unique_locations.append(location)
            seen_names.add(location_key)
        else:
            print(f"🔄 Skipping duplicate: {location['name']}")

    print(f"📊 Total unique locations processed: {len(unique_locations)}")

    # Sort by name
    unique_locations.sort(key=lambda x: x["name"])

    return unique_locations


def save_data(locations: List[Dict], filename: str = "farms_and_markets.csv") -> None:
    """Save farm and market data to CSV file."""
    import os

    # Ensure processed directory exists
    processed_dir = "processed"
    if not os.path.exists(processed_dir):
        os.makedirs(processed_dir)

    filepath = os.path.join(processed_dir, filename)

    if not locations:
        print(f"⚠️ No locations to save to {filepath}")
        return

    # Define CSV headers
    fieldnames = [
        "name",
        "type",
        "address",
        "latitude",
        "longitude",
        "organization",
        "website",
        "hours",
        "additional_info",
    ]

    with open(filepath, "w", newline="", encoding="utf-8") as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(locations)

    print(f"✅ Saved {len(locations)} locations to {filepath}")

    # Print summary
    types = {}
    organizations = {}

    for location in locations:
        loc_type = location.get("type", "Unknown")
        org = location.get("organization", "Unknown")

        types[loc_type] = types.get(loc_type, 0) + 1
        organizations[org] = organizations.get(org, 0) + 1

    print("\n📊 Summary by type:")
    for loc_type, count in types.items():
        print(f"  • {loc_type}: {count} locations")

    print("\n📊 Summary by organization:")
    for org, count in organizations.items():
        print(f"  • {org}: {count} locations")


def main():
    """Main function to process and save farm and market data."""
    locations = process_farms_and_markets()
    save_data(locations)


if __name__ == "__main__":
    main()
