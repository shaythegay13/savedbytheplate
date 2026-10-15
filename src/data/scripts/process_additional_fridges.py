import pandas as pd
import geocoder
from typing import Dict, List, Tuple
import os
import time


def fetch_community_fridge_finder_enhanced() -> List[Dict]:
    """
    Fetch enhanced community fridge data from Community Fridge Finder
    """
    fridges = []

    # Since direct scraping might be limited, we'll use known fridge locations
    # from Community Fridge Finder and One Love Community Fridge
    known_fridges = [
        {
            "name": "Astoria Community Fridge",
            "address": "31-50 31st Street, Astoria, NY 11106",
            "organization": "Community Fridge Finder",
            "borough": "Queens",
            "notes": "Located outside Astoria Bookshop",
        },
        {
            "name": "Williamsburg Community Fridge",
            "address": "90 Wythe Avenue, Brooklyn, NY 11249",
            "organization": "Community Fridge Finder",
            "borough": "Brooklyn",
            "notes": "Available 24/7",
        },
        {
            "name": "East Village Community Fridge",
            "address": "131 Avenue A, New York, NY 10009",
            "organization": "Community Fridge Finder",
            "borough": "Manhattan",
            "notes": "Located outside dimes market",
        },
        {
            "name": "Washington Heights Community Fridge",
            "address": "4070 Broadway, New York, NY 10032",
            "organization": "Community Fridge Finder",
            "borough": "Manhattan",
            "notes": "Serving Washington Heights community",
        },
        {
            "name": "Jamaica Community Fridge",
            "address": "89-31 161st Street, Jamaica, NY 11432",
            "organization": "Community Fridge Finder",
            "borough": "Queens",
            "notes": "Community-maintained fridge",
        },
    ]

    for fridge_data in known_fridges:
        fridge = {
            "name": fridge_data["name"],
            "address": fridge_data["address"],
            "type": "community_fridge",
            "organization": fridge_data["organization"],
            "hours": "24/7",
            "contact": "",
            "additional_info": fridge_data.get("notes", ""),
        }

        # Geocode the address
        location = geocode_address(fridge["address"])
        if location:
            fridge["latitude"], fridge["longitude"] = location
            fridges.append(fridge)
            time.sleep(1)  # Be nice to geocoding service

    return fridges


def fetch_one_love_fridges_enhanced() -> List[Dict]:
    """
    Fetch enhanced data from One Love Community Fridge network
    """
    fridges = []

    # Actual One Love Community Fridge locations from their website
    one_love_fridges = [
        {
            "name": "OLCF 1 — Bed-Stuy (Cafe Botani)",
            "address": "173 Lewis Ave, Brooklyn, NY 11221",
            "organization": "One Love Community Fridge",
            "borough": "Brooklyn",
            "notes": "Hosted by Cafe Botani",
        },
        {
            "name": "OLCF 2 — Flatbush (B'ShERT)",
            "address": "1596 Church Ave, Brooklyn, NY 11226",
            "organization": "One Love Community Fridge",
            "borough": "Brooklyn",
            "notes": "Hosted by B'ShERT",
        },
        {
            "name": "OLCF 3 — Gowanus",
            "address": "303 Bond St, Brooklyn, NY 11231",
            "organization": "One Love Community Fridge",
            "borough": "Brooklyn",
            "notes": "One Love Community Fridge in Gowanus",
        },
        {
            "name": "OLCF 4 — Crown Heights",
            "address": "Crown Heights, Brooklyn, NY",
            "organization": "One Love Community Fridge",
            "borough": "Brooklyn",
            "notes": "One Love Community Fridge in Crown Heights",
        },
        {
            "name": "OLCF 5 — Williamsburg",
            "address": "Williamsburg, Brooklyn, NY",
            "organization": "One Love Community Fridge",
            "borough": "Brooklyn",
            "notes": "One Love Community Fridge in Williamsburg",
        },
        {
            "name": "OLCF 6 — East New York",
            "address": "East New York, Brooklyn, NY",
            "organization": "One Love Community Fridge",
            "borough": "Brooklyn",
            "notes": "One Love Community Fridge in East New York",
        },
        {
            "name": "OLCF 7 — Harlem",
            "address": "Harlem, Manhattan, NY",
            "organization": "One Love Community Fridge",
            "borough": "Manhattan",
            "notes": "One Love Community Fridge in Harlem",
        },
        {
            "name": "OLCF 8 — Bronx",
            "address": "Bronx, NY",
            "organization": "One Love Community Fridge",
            "borough": "Bronx",
            "notes": "One Love Community Fridge in the Bronx",
        },
    ]

    for fridge_data in one_love_fridges:
        fridge = {
            "name": fridge_data["name"],
            "address": fridge_data["address"],
            "type": "community_fridge",
            "organization": fridge_data["organization"],
            "hours": "24/7",
            "contact": "",
            "additional_info": fridge_data.get("notes", ""),
        }

        # Geocode the address
        location = geocode_address(fridge["address"])
        if location:
            fridge["latitude"], fridge["longitude"] = location
            fridges.append(fridge)
            time.sleep(1)

    return fridges


def geocode_address(address: str) -> Tuple[float, float]:
    """
    Geocode an address to get latitude and longitude with NYC area validation
    """
    try:
        g = geocoder.osm(address)
        if g.ok and is_nyc_metro_coordinates(g.lat, g.lng):
            return g.lat, g.lng
        return None
    except Exception as e:
        print(f"Error geocoding address {address}: {e}")
        return None


def is_nyc_metro_coordinates(lat: float, lng: float) -> bool:
    """
    Check if coordinates are within NYC metro area
    """
    # NYC metro area bounds (approximate)
    nyc_bounds = {
        "north": 40.9176,
        "south": 40.4774,
        "east": -73.7004,
        "west": -74.2591,
    }

    return (
        nyc_bounds["south"] <= lat <= nyc_bounds["north"]
        and nyc_bounds["west"] <= lng <= nyc_bounds["east"]
    )


def process_additional_fridges_data() -> List[Dict]:
    """
    Process additional community fridge data from multiple sources
    """
    print("Fetching additional community fridge data...")

    # Fetch from multiple sources
    community_finder_fridges = fetch_community_fridge_finder_enhanced()
    one_love_fridges = fetch_one_love_fridges_enhanced()

    # Combine all sources
    all_fridges = community_finder_fridges + one_love_fridges

    # Remove duplicates based on proximity (within ~100 meters)
    unique_fridges = []
    for fridge in all_fridges:
        if "latitude" not in fridge or "longitude" not in fridge:
            continue

        is_duplicate = False
        for existing in unique_fridges:
            if (
                "latitude" in existing
                and "longitude" in existing
                and abs(fridge["latitude"] - existing["latitude"]) < 0.001
                and abs(fridge["longitude"] - existing["longitude"]) < 0.001
            ):
                is_duplicate = True
                break

        if not is_duplicate:
            unique_fridges.append(fridge)

    # Sort by name
    unique_fridges.sort(key=lambda x: x["name"])

    return unique_fridges


def save_data(fridges: List[Dict], filename: str) -> None:
    """
    Save the processed fridge data to a CSV file
    """
    if not fridges:
        print("No fridge data to save.")
        return

    # Create DataFrame
    df = pd.DataFrame(fridges)

    # Ensure all required columns exist
    required_columns = [
        "name",
        "type",
        "address",
        "latitude",
        "longitude",
        "organization",
        "hours",
        "contact",
        "additional_info",
    ]

    for col in required_columns:
        if col not in df.columns:
            df[col] = ""

    df = df[required_columns]

    # Create the output directory if it doesn't exist
    os.makedirs("../processed", exist_ok=True)

    # Save to CSV
    output_path = f"../processed/{filename}"
    df.to_csv(output_path, index=False)

    print(f"Saved {len(df)} additional community fridge records to {output_path}")

    # Print summary
    organizations = df["organization"].value_counts()
    print(f"Organizations: {dict(organizations)}")


def main():
    additional_fridges = process_additional_fridges_data()

    if additional_fridges:
        save_data(additional_fridges, "additional_community_fridges.csv")
    else:
        print("No additional community fridge data was processed.")


if __name__ == "__main__":
    main()
