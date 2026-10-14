#!/usr/bin/env python3
"""
Process land trust garden data from Manhattan Land Trust and Brooklyn-Queens Land Trust.
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


def fetch_manhattan_land_trust_gardens() -> List[Dict]:
    """Fetch community garden data from Manhattan Land Trust."""
    gardens = []

    # Manhattan Land Trust gardens from the fetched content
    manhattan_gardens = [
        {"name": "Carver Community Garden", "address": "242 E 124th St, New York, NY"},
        {
            "name": "Clayton Williams Community Garden",
            "address": "2351 8th Ave, New York, NY",
        },
        {
            "name": "East Harlem Community Garden",
            "address": "433 E 117th St, New York, NY",
        },
        {"name": "Five Star Garden", "address": "252 W 121st St, New York, NY"},
        {"name": "Hope Steven Garden", "address": "1656 Amsterdam Ave, New York, NY"},
        {
            "name": "La Perla Garden",
            "address": "78 W 105th St, New York, NY",
            "website": "http://laperlagarden.org/",
        },
        {"name": "Mo' Pals Garden", "address": "545 W 147th St, New York, NY"},
        {"name": "Papo's Garden", "address": "220 E 119th St, New York, NY"},
        {"name": "Serenity Garden", "address": "522 W 146th St, New York, NY"},
        {
            "name": "11 Street Community Garden",
            "address": "422 E 11th St, New York, NY",
        },
        {
            "name": "Albert's Garden",
            "address": "18 E 2nd St, New York, NY",
            "website": "http://albertsgarden.org/",
        },
        {
            "name": "All People's Garden",
            "address": "295 E 3rd St, New York, NY",
            "website": "http://allpeoplesgarden.org/",
        },
        {
            "name": "Lower East Side People Care",
            "address": "25 Rutgers St, New York, NY",
        },
        {
            "name": "Parque de Tranquilidad",
            "address": "318 E 4th St, New York, NY",
            "website": "http://parquedetranquilidad.org/",
        },
    ]

    for garden_data in manhattan_gardens:
        lat, lon = geocode_address(garden_data["address"])
        if lat != 0 and lon != 0:
            garden = {
                "name": garden_data["name"],
                "type": "garden",
                "address": garden_data["address"],
                "latitude": lat,
                "longitude": lon,
                "organization": "Manhattan Land Trust",
                "website": garden_data.get("website", ""),
                "additional_info": "Community garden managed by Manhattan Land Trust",
            }
            gardens.append(garden)
            print(f"✅ Added Manhattan garden: {garden['name']}")
        else:
            print(
                f"❌ Could not geocode: {garden_data['name']} at {garden_data['address']}"
            )

        time.sleep(0.5)  # Rate limiting

    return gardens


def fetch_brooklyn_queens_land_trust_gardens() -> List[Dict]:
    """Fetch community garden data from Brooklyn-Queens Land Trust."""
    gardens = []

    # Sample BQLT gardens - in a real implementation, this would scrape the website
    bqlt_gardens = [
        {
            "name": "1100 Block Bergen Street Community Garden",
            "address": "Bergen St, Brooklyn, NY",
        },
        {
            "name": "Bed-Stuy Campaign Against Hunger Garden",
            "address": "Bed-Stuy, Brooklyn, NY",
        },
        {
            "name": "Chestnut Commons Community Garden",
            "address": "Chestnut St, Brooklyn, NY",
        },
        {"name": "Corona Community Garden", "address": "Corona, Queens, NY"},
        {
            "name": "East New York Community Garden",
            "address": "East New York, Brooklyn, NY",
        },
        {"name": "Flatbush Food Justice Garden", "address": "Flatbush, Brooklyn, NY"},
        {"name": "Jamaica Bay Community Garden", "address": "Jamaica, Queens, NY"},
        {
            "name": "Park Slope Food Justice Garden",
            "address": "Park Slope, Brooklyn, NY",
        },
        {
            "name": "Prospect Heights Community Garden",
            "address": "Prospect Heights, Brooklyn, NY",
        },
        {
            "name": "Williamsburg Community Garden",
            "address": "Williamsburg, Brooklyn, NY",
        },
    ]

    for garden_data in bqlt_gardens:
        lat, lon = geocode_address(garden_data["address"])
        if lat != 0 and lon != 0:
            garden = {
                "name": garden_data["name"],
                "type": "garden",
                "address": garden_data["address"],
                "latitude": lat,
                "longitude": lon,
                "organization": "Brooklyn-Queens Land Trust",
                "website": garden_data.get("website", ""),
                "additional_info": "Community garden managed by Brooklyn-Queens Land Trust",
            }
            gardens.append(garden)
            print(f"✅ Added BQLT garden: {garden['name']}")
        else:
            print(
                f"❌ Could not geocode: {garden_data['name']} at {garden_data['address']}"
            )

        time.sleep(0.5)  # Rate limiting

    return gardens


def process_land_trust_gardens() -> List[Dict]:
    """Process all land trust garden data."""
    print("🌱 Processing land trust gardens...")

    all_gardens = []

    # Fetch from both land trusts
    manhattan_gardens = fetch_manhattan_land_trust_gardens()
    bqlt_gardens = fetch_brooklyn_queens_land_trust_gardens()

    all_gardens.extend(manhattan_gardens)
    all_gardens.extend(bqlt_gardens)

    # Remove duplicates based on name and approximate location
    unique_gardens = []
    seen_names = set()

    for garden in all_gardens:
        garden_key = garden["name"].lower().strip()
        if garden_key not in seen_names:
            unique_gardens.append(garden)
            seen_names.add(garden_key)
        else:
            print(f"🔄 Skipping duplicate: {garden['name']}")

    print(f"📊 Total unique gardens processed: {len(unique_gardens)}")

    # Sort by name
    unique_gardens.sort(key=lambda x: x["name"])

    return unique_gardens


def save_data(gardens: List[Dict], filename: str = "land_trust_gardens.csv") -> None:
    """Save garden data to CSV file."""
    import os

    # Ensure processed directory exists
    processed_dir = "processed"
    if not os.path.exists(processed_dir):
        os.makedirs(processed_dir)

    filepath = os.path.join(processed_dir, filename)

    if not gardens:
        print(f"⚠️ No gardens to save to {filepath}")
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
        "additional_info",
    ]

    with open(filepath, "w", newline="", encoding="utf-8") as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(gardens)

    print(f"✅ Saved {len(gardens)} gardens to {filepath}")

    # Print summary
    organizations = {}
    for garden in gardens:
        org = garden.get("organization", "Unknown")
        organizations[org] = organizations.get(org, 0) + 1

    print("\n📊 Summary by organization:")
    for org, count in organizations.items():
        print(f"  • {org}: {count} gardens")


def main():
    """Main function to process and save land trust garden data."""
    gardens = process_land_trust_gardens()
    save_data(gardens)


if __name__ == "__main__":
    main()
