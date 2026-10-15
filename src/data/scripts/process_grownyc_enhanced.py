import pandas as pd
import geocoder
from typing import Dict, List, Tuple
import os
import time
import re


def fetch_grownyc_enhanced_markets() -> List[Dict]:
    """
    Fetch enhanced farmers market data from GrowNYC
    """
    markets = []

    # Enhanced data for GrowNYC markets with more details
    grownyc_markets = [
        {
            "name": "Union Square Greenmarket",
            "address": "E 17th St & Union Square W, Manhattan, NY 10003",
            "hours": "Monday, Wednesday, Friday, Saturday 8am-6pm",
            "website": "https://www.grownyc.org/greenmarket/manhattan/union-square",
            "contact": "(212) 788-7476",
            "products": "Vegetables, Fruits, Meat, Dairy, Seafood, Baked Goods, Honey, Flowers, Plants, Wine, Cider",
            "seasons": "Year-round",
            "special_features": "Largest greenmarket in NYC, over 140 vendors",
        },
        {
            "name": "Grand Army Plaza Greenmarket",
            "address": "Prospect Park West & Flatbush Ave, Brooklyn, NY 11217",
            "hours": "Saturday 8am-4pm",
            "website": "https://www.grownyc.org/greenmarket/brooklyn/grand-army-plaza",
            "contact": "(212) 788-7476",
            "products": "Vegetables, Fruits, Meat, Poultry, Dairy, Eggs, Seafood, Baked Goods, Flowers",
            "seasons": "Year-round",
            "special_features": "Brooklyn's flagship market",
        },
        {
            "name": "Tompkins Square Greenmarket",
            "address": "E 7th St & Avenue A, Manhattan, NY 10009",
            "hours": "Sunday 8am-3pm",
            "website": "https://www.grownyc.org/greenmarket/manhattan/tompkins-square",
            "contact": "(212) 788-7476",
            "products": "Vegetables, Fruits, Meat, Eggs, Dairy, Baked Goods, Flowers",
            "seasons": "Year-round",
        },
        {
            "name": "Carroll Gardens Greenmarket",
            "address": "Carroll St between Smith & Hoyt St, Brooklyn, NY 11231",
            "hours": "Sunday 8am-3pm",
            "website": "https://www.grownyc.org/greenmarket/brooklyn/carroll-gardens",
            "contact": "(212) 788-7476",
            "products": "Vegetables, Fruits, Meat, Dairy, Eggs, Baked Goods, Flowers",
            "seasons": "Year-round",
        },
        {
            "name": "Fort Greene Park Greenmarket",
            "address": "Washington Park & DeKalb Ave, Brooklyn, NY 11217",
            "hours": "Saturday 8am-3pm",
            "website": "https://www.grownyc.org/greenmarket/brooklyn/fort-greene-park",
            "contact": "(212) 788-7476",
            "products": "Vegetables, Fruits, Meat, Dairy, Eggs, Baked Goods",
            "seasons": "Year-round",
        },
        {
            "name": "Greenpoint-McCarren Park Greenmarket",
            "address": "Lorimer St & Driggs Ave, Brooklyn, NY 11222",
            "hours": "Saturday 8am-3pm",
            "website": "https://www.grownyc.org/greenmarket/brooklyn/greenpoint-mccarren-park",
            "contact": "(212) 788-7476",
            "products": "Vegetables, Fruits, Meat, Dairy, Eggs, Seafood, Baked Goods",
            "seasons": "Year-round",
        },
        {
            "name": "Prospect Heights Greenmarket",
            "address": "Vanderbilt Ave between Bergen & Dean St, Brooklyn, NY 11238",
            "hours": "Saturday 8am-3pm",
            "website": "https://www.grownyc.org/greenmarket/brooklyn/prospect-heights",
            "contact": "(212) 788-7476",
            "products": "Vegetables, Fruits, Meat, Dairy, Eggs, Baked Goods, Flowers",
            "seasons": "Year-round",
        },
        {
            "name": "Astoria Greenmarket",
            "address": "14-20 Astoria Blvd S, Astoria, NY 11102",
            "hours": "Wednesday 8am-3pm",
            "website": "https://www.grownyc.org/greenmarket/queens/astoria",
            "contact": "(212) 788-7476",
            "products": "Vegetables, Fruits, Meat, Dairy, Eggs, Baked Goods",
            "seasons": "Year-round",
        },
        {
            "name": "Jackson Heights Greenmarket",
            "address": "34th Ave between 77th & 78th St, Jackson Heights, NY 11372",
            "hours": "Sunday 8am-3pm",
            "website": "https://www.grownyc.org/greenmarket/queens/jackson-heights",
            "contact": "(212) 788-7476",
            "products": "Vegetables, Fruits, Meat, Dairy, Eggs, Baked Goods",
            "seasons": "Year-round",
        },
        {
            "name": "Flushing Meadows Corona Park Greenmarket",
            "address": "Northern Blvd & 103rd St, Corona, NY 11368",
            "hours": "Sunday 8am-3pm",
            "website": "https://www.grownyc.org/greenmarket/queens/flushing-meadows-corona-park",
            "contact": "(212) 788-7476",
            "products": "Vegetables, Fruits, Meat, Dairy, Eggs, Baked Goods",
            "seasons": "Year-round",
        },
        {
            "name": "Lincoln Hospital Greenmarket",
            "address": "234 E 149th St, Bronx, NY 10451",
            "hours": "Tuesday & Friday 8am-3pm",
            "website": "https://www.grownyc.org/greenmarket/bronx/lincoln-hospital",
            "contact": "(212) 788-7476",
            "products": "Vegetables, Fruits, Meat, Dairy, Eggs, Baked Goods",
            "seasons": "Year-round",
        },
        {
            "name": "Poe Park Greenmarket",
            "address": "Grand Concourse & E 192nd St, Bronx, NY 10468",
            "hours": "Tuesday 8am-2pm",
            "website": "https://www.grownyc.org/greenmarket/bronx/poe-park",
            "contact": "(212) 788-7476",
            "products": "Vegetables, Fruits, Meat, Dairy, Eggs, Baked Goods",
            "seasons": "July-November",
        },
        {
            "name": "St. George Greenmarket",
            "address": "St. Marks Pl & Hyatt St, Staten Island, NY 10301",
            "hours": "Saturday 8am-2pm",
            "website": "https://www.grownyc.org/greenmarket/staten-island/st-george",
            "contact": "(212) 788-7476",
            "products": "Vegetables, Fruits, Meat, Dairy, Eggs, Baked Goods, Flowers",
            "seasons": "Year-round",
        },
    ]

    for market_data in grownyc_markets:
        market = {
            "name": market_data["name"],
            "address": market_data["address"],
            "type": "farmers_market",
            "organization": "GrowNYC",
            "website": market_data.get("website", "https://www.grownyc.org"),
            "hours": market_data["hours"],
            "contact": market_data["contact"],
            "additional_info": f"Products: {market_data['products']}; Seasons: {market_data.get('seasons', 'Seasonal')}; {market_data.get('special_features', '')}",
        }

        # Geocode the address
        location = geocode_address(market["address"])
        if location:
            market["latitude"], market["longitude"] = location
            markets.append(market)
            time.sleep(1)

    return markets


def fetch_local_harvest_nyc_markets() -> List[Dict]:
    """
    Enhanced Local Harvest farmers market data for NYC
    """
    markets = []

    # Known Local Harvest markets in NYC area
    local_harvest_markets = [
        {
            "name": "Brooklyn Flea Market - Food Vendors",
            "address": "176 Lafayette Ave, Brooklyn, NY 11238",
            "hours": "Saturday 10am-5pm",
            "website": "https://www.localharvest.org",
            "contact": "",
            "products": "Local food vendors, artisan products, prepared foods",
            "seasons": "April-October",
        },
        {
            "name": "Smorgasburg Williamsburg",
            "address": "East River State Park, 90 Kent Ave, Brooklyn, NY 11249",
            "hours": "Saturday 11am-6pm",
            "website": "https://www.smorgasburg.com",
            "contact": "",
            "products": "Local food vendors, artisan foods, diverse cuisines",
            "seasons": "April-October",
        },
        {
            "name": "Smorgasburg Prospect Park",
            "address": "Breeze Hill, Prospect Park, Brooklyn, NY 11225",
            "hours": "Sunday 11am-6pm",
            "website": "https://www.smorgasburg.com",
            "contact": "",
            "products": "Local food vendors, artisan foods, diverse cuisines",
            "seasons": "April-October",
        },
        {
            "name": "Red Hook Food Vendors",
            "address": "Red Hook Recreation Area, Bay St, Brooklyn, NY 11231",
            "hours": "Saturday & Sunday 11am-6pm",
            "website": "",
            "contact": "",
            "products": "Latin American food vendors, local specialties",
            "seasons": "April-October",
        },
    ]

    for market_data in local_harvest_markets:
        market = {
            "name": market_data["name"],
            "address": market_data["address"],
            "type": "farmers_market",
            "organization": "Local Harvest",
            "website": market_data.get("website", ""),
            "hours": market_data["hours"],
            "contact": market_data["contact"],
            "additional_info": f"Products: {market_data['products']}; Seasons: {market_data.get('seasons', 'Seasonal')}",
        }

        # Geocode the address
        location = geocode_address(market["address"])
        if location:
            market["latitude"], market["longitude"] = location
            markets.append(market)
            time.sleep(1)

    return markets


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


def process_enhanced_farmers_markets() -> List[Dict]:
    """
    Process enhanced farmers market data from multiple sources
    """
    print("Fetching enhanced farmers market data...")

    # Fetch from multiple sources
    grownyc_markets = fetch_grownyc_enhanced_markets()
    local_harvest_markets = fetch_local_harvest_nyc_markets()

    # Combine all sources
    all_markets = grownyc_markets + local_harvest_markets

    # Remove duplicates based on name similarity and proximity
    unique_markets = []
    for market in all_markets:
        if "latitude" not in market or "longitude" not in market:
            continue

        is_duplicate = False
        for existing in unique_markets:
            # Check name similarity and proximity
            if similar_names(market["name"], existing["name"]) or (
                "latitude" in existing
                and "longitude" in existing
                and abs(market["latitude"] - existing["latitude"]) < 0.001
                and abs(market["longitude"] - existing["longitude"]) < 0.001
            ):
                is_duplicate = True
                break

        if not is_duplicate:
            unique_markets.append(market)

    # Sort by name
    unique_markets.sort(key=lambda x: x["name"])

    return unique_markets


def similar_names(name1: str, name2: str) -> bool:
    """
    Check if two market names are similar (likely the same market)
    """
    # Normalize names for comparison
    norm1 = re.sub(r"[^a-zA-Z0-9\s]", "", name1.lower()).strip()
    norm2 = re.sub(r"[^a-zA-Z0-9\s]", "", name2.lower()).strip()

    # Check if one name contains the other or they share significant words
    words1 = set(norm1.split())
    words2 = set(norm2.split())

    # If they share 2+ significant words, consider them similar
    common_words = words1.intersection(words2)
    significant_words = [w for w in common_words if len(w) > 3]

    return len(significant_words) >= 2


def save_data(markets: List[Dict], filename: str) -> None:
    """
    Save the processed market data to a CSV file
    """
    if not markets:
        print("No enhanced market data to save.")
        return

    # Create DataFrame
    df = pd.DataFrame(markets)

    # Ensure all required columns exist
    required_columns = [
        "name",
        "type",
        "address",
        "latitude",
        "longitude",
        "organization",
        "website",
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

    print(f"Saved {len(df)} enhanced farmers market records to {output_path}")

    # Print summary
    organizations = df["organization"].value_counts()
    print(f"Organizations: {dict(organizations)}")


def main():
    enhanced_markets = process_enhanced_farmers_markets()

    if enhanced_markets:
        save_data(enhanced_markets, "enhanced_farmers_markets.csv")
    else:
        print("No enhanced farmers market data was processed.")


if __name__ == "__main__":
    main()
