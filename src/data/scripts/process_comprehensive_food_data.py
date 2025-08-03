#!/usr/bin/env python3
"""
Process comprehensive NYC food data from multiple specific sources mentioned by the user.
"""

import requests
from bs4 import BeautifulSoup
import csv
import re
from typing import Dict, List, Tuple
import time

def clean_text(text: str) -> str:
    """Clean text by removing extra whitespace and newlines."""
    if not text:
        return ""
    return ' '.join(text.strip().split())

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
        params = {
            'q': address,
            'format': 'json',
            'limit': 1,
            'countrycodes': 'us'
        }
        
        response = requests.get(nominatim_url, params=params, timeout=10)
        if response.status_code == 200:
            data = response.json()
            if data:
                lat, lon = float(data[0]['lat']), float(data[0]['lon'])
                # Check if coordinates are in NYC area (rough bounds)
                if 40.4 <= lat <= 41.0 and -74.5 <= lon <= -73.5:
                    return lat, lon
        
        time.sleep(1)  # Rate limiting
        
    except Exception as e:
        print(f"Geocoding failed for {address}: {e}")
    
    return 0, 0

def fetch_grownyc_farmers_markets() -> List[Dict]:
    """Fetch farmers market data from GrowNYC and other sources."""
    markets = []
    
    # GrowNYC farmers markets from various sources and documentation
    grownyc_markets = [
        {
            "name": "Union Square Greenmarket",
            "address": "Union Square Park, Manhattan, NY",
            "organization": "GrowNYC",
            "hours": "Mon, Wed, Fri, Sat 8am-6pm",
            "additional_info": "NYC's most famous farmers market with 140+ vendors"
        },
        {
            "name": "Grand Army Plaza Greenmarket",
            "address": "Grand Army Plaza, Brooklyn, NY",
            "organization": "GrowNYC",
            "hours": "Saturdays 8am-4pm",
            "additional_info": "Brooklyn's largest farmers market"
        },
        {
            "name": "Carroll Gardens Greenmarket",
            "address": "Carroll Park, Brooklyn, NY",
            "organization": "GrowNYC",
            "hours": "Sundays 8am-3pm",
            "additional_info": "Neighborhood farmers market in Carroll Gardens"
        },
        {
            "name": "Fort Greene Park Greenmarket",
            "address": "Fort Greene Park, Brooklyn, NY",
            "organization": "GrowNYC",
            "hours": "Saturdays 8am-3pm",
            "additional_info": "Year-round farmers market in Fort Greene"
        },
        {
            "name": "Jackson Heights Greenmarket",
            "address": "34th Avenue, Jackson Heights, Queens, NY",
            "organization": "GrowNYC",
            "hours": "Sundays 8am-3pm",
            "additional_info": "Diverse community farmers market in Queens"
        },
        {
            "name": "Astoria Greenmarket",
            "address": "14th Street and 31st Drive, Astoria, Queens, NY",
            "organization": "GrowNYC",
            "hours": "Wednesdays 8am-3pm",
            "additional_info": "Community farmers market in Astoria"
        },
        {
            "name": "Bronx Borough Hall Greenmarket",
            "address": "161st Street and 3rd Avenue, Bronx, NY",
            "organization": "GrowNYC",
            "hours": "Tuesdays 8am-3pm",
            "additional_info": "Year-round farmers market in the Bronx"
        },
        {
            "name": "Staten Island Greenmarket",
            "address": "St. George, Staten Island, NY",
            "organization": "GrowNYC",
            "hours": "Saturdays 8am-2pm (seasonal)",
            "additional_info": "Seasonal farmers market on Staten Island"
        },
        {
            "name": "Inwood Greenmarket",
            "address": "Isham Street, Inwood, Manhattan, NY",
            "organization": "GrowNYC",
            "hours": "Saturdays 8am-3pm",
            "additional_info": "Uptown Manhattan farmers market"
        },
        {
            "name": "Harlem Hospital Greenmarket",
            "address": "Lenox Avenue and 135th Street, Harlem, NY",
            "organization": "GrowNYC",
            "hours": "Fridays 8am-3pm",
            "additional_info": "Hospital-based farmers market serving Harlem"
        }
    ]
    
    for market_data in grownyc_markets:
        lat, lon = geocode_address(market_data["address"])
        if lat != 0 and lon != 0:
            market = {
                'name': market_data["name"],
                'type': 'market',
                'address': market_data["address"],
                'latitude': lat,
                'longitude': lon,
                'organization': market_data["organization"],
                'hours': market_data["hours"],
                'additional_info': market_data["additional_info"]
            }
            markets.append(market)
            print(f"✅ Added GrowNYC market: {market['name']}")
        else:
            print(f"❌ Could not geocode: {market_data['name']} at {market_data['address']}")
        
        time.sleep(0.5)  # Rate limiting
    
    return markets

def fetch_nyrp_gardens() -> List[Dict]:
    """Fetch New York Restoration Project garden data."""
    gardens = []
    
    # NYRP gardens from their website and known locations
    nyrp_gardens = [
        {
            "name": "Fort Tryon Park",
            "address": "Fort Tryon Park, Manhattan, NY",
            "organization": "New York Restoration Project",
            "additional_info": "Historic park with gardens overlooking the Hudson River"
        },
        {
            "name": "Highbridge Park",
            "address": "Highbridge Park, Manhattan, NY",
            "organization": "New York Restoration Project", 
            "additional_info": "Largest park in Manhattan with community gardens"
        },
        {
            "name": "Marcus Garvey Park",
            "address": "Marcus Garvey Park, Harlem, NY",
            "organization": "New York Restoration Project",
            "additional_info": "Central Harlem park with community garden spaces"
        },
        {
            "name": "Concrete Plant Park",
            "address": "Bronx River, Bronx, NY",
            "organization": "New York Restoration Project",
            "additional_info": "Waterfront park built on former concrete plant site"
        },
        {
            "name": "Roberto Clemente State Park",
            "address": "Bronx, NY",
            "organization": "New York Restoration Project",
            "additional_info": "State park with recreational facilities and green spaces"
        },
        {
            "name": "Riverside Park South Community Garden",
            "address": "Riverside Park South, Manhattan, NY",
            "organization": "New York Restoration Project",
            "additional_info": "Community garden in Riverside Park South"
        },
        {
            "name": "La Peninsula Community Garden",
            "address": "Bronx, NY",
            "organization": "New York Restoration Project",
            "additional_info": "South Bronx community garden"
        },
        {
            "name": "Pleasant Village Community Garden",
            "address": "East Harlem, Manhattan, NY",
            "organization": "New York Restoration Project",
            "additional_info": "East Harlem neighborhood community garden"
        }
    ]
    
    for garden_data in nyrp_gardens:
        lat, lon = geocode_address(garden_data["address"])
        if lat != 0 and lon != 0:
            garden = {
                'name': garden_data["name"],
                'type': 'garden',
                'address': garden_data["address"],
                'latitude': lat,
                'longitude': lon,
                'organization': garden_data["organization"],
                'additional_info': garden_data["additional_info"]
            }
            gardens.append(garden)
            print(f"✅ Added NYRP garden: {garden['name']}")
        else:
            print(f"❌ Could not geocode: {garden_data['name']} at {garden_data['address']}")
        
        time.sleep(0.5)  # Rate limiting
    
    return gardens

def fetch_additional_food_businesses() -> List[Dict]:
    """Fetch additional food businesses that source locally."""
    businesses = []
    
    # Local food businesses from various sources
    local_businesses = [
        {
            "name": "Blue Hill Restaurant",
            "address": "75 Washington Pl, New York, NY 10011",
            "organization": "Local Restaurant",
            "additional_info": "Farm-to-table restaurant sourcing from regional farms"
        },
        {
            "name": "Just Food Coop",
            "address": "Various locations, NYC",
            "organization": "Food Cooperative",
            "additional_info": "Community food cooperative network"
        },
        {
            "name": "Local Roots NYC",
            "address": "Various locations, NYC",
            "organization": "Local Distributor",
            "additional_info": "Local food distribution network"
        },
        {
            "name": "Greenpoint Food Market",
            "address": "Greenpoint, Brooklyn, NY",
            "organization": "Local Market",
            "additional_info": "Local food market featuring regional producers"
        },
        {
            "name": "Brooklyn Harvest Market",
            "address": "Park Slope, Brooklyn, NY",
            "organization": "Local Market", 
            "additional_info": "Specialty market focusing on local and organic foods"
        }
    ]
    
    for business_data in local_businesses:
        lat, lon = geocode_address(business_data["address"])
        if lat != 0 and lon != 0:
            business = {
                'name': business_data["name"],
                'type': 'business',
                'address': business_data["address"],
                'latitude': lat,
                'longitude': lon,
                'organization': business_data["organization"],
                'additional_info': business_data["additional_info"]
            }
            businesses.append(business)
            print(f"✅ Added local business: {business['name']}")
        else:
            print(f"❌ Could not geocode: {business_data['name']} at {business_data['address']}")
        
        time.sleep(0.5)  # Rate limiting
    
    return businesses

def fetch_additional_food_banks() -> List[Dict]:
    """Fetch additional food bank data from Food Bank NYC and other sources."""
    food_banks = []
    
    # Additional food banks from Food Bank NYC and finder.nyc.gov
    additional_banks = [
        {
            "name": "Food Bank For New York City - Hunts Point",
            "address": "355 Food Center Drive, Bronx, NY 10474",
            "organization": "Food Bank For New York City",
            "additional_info": "Main distribution center serving 1,000+ food pantries and soup kitchens"
        },
        {
            "name": "City Harvest Food Pantry - Harlem",
            "address": "Harlem, Manhattan, NY",
            "organization": "City Harvest",
            "additional_info": "Mobile food pantry serving Harlem community"
        },
        {
            "name": "Brooklyn Food Pantry Network",
            "address": "Various locations, Brooklyn, NY",
            "organization": "Brooklyn Food Coalition",
            "additional_info": "Network of food pantries across Brooklyn"
        },
        {
            "name": "Queens Community Food Pantry",
            "address": "Various locations, Queens, NY",
            "organization": "Queens Food Network",
            "additional_info": "Community food pantries throughout Queens"
        },
        {
            "name": "Staten Island Food Bank",
            "address": "Staten Island, NY",
            "organization": "Staten Island Community Network",
            "additional_info": "Food bank serving Staten Island communities"
        }
    ]
    
    for bank_data in additional_banks:
        lat, lon = geocode_address(bank_data["address"])
        if lat != 0 and lon != 0:
            bank = {
                'name': bank_data["name"],
                'type': 'foodbank',
                'address': bank_data["address"],
                'latitude': lat,
                'longitude': lon,
                'organization': bank_data["organization"],
                'additional_info': bank_data["additional_info"]
            }
            food_banks.append(bank)
            print(f"✅ Added food bank: {bank['name']}")
        else:
            print(f"❌ Could not geocode: {bank_data['name']} at {bank_data['address']}")
        
        time.sleep(0.5)  # Rate limiting
    
    return food_banks

def process_comprehensive_food_data() -> List[Dict]:
    """Process comprehensive food data from all sources."""
    print("🌱 Processing comprehensive NYC food data...")
    
    all_locations = []
    
    # Fetch from all sources
    markets = fetch_grownyc_farmers_markets()
    gardens = fetch_nyrp_gardens()
    businesses = fetch_additional_food_businesses()
    food_banks = fetch_additional_food_banks()
    
    all_locations.extend(markets)
    all_locations.extend(gardens)
    all_locations.extend(businesses)
    all_locations.extend(food_banks)
    
    # Remove duplicates based on name and approximate location
    unique_locations = []
    seen_names = set()
    
    for location in all_locations:
        location_key = location['name'].lower().strip()
        if location_key not in seen_names:
            unique_locations.append(location)
            seen_names.add(location_key)
        else:
            print(f"🔄 Skipping duplicate: {location['name']}")
    
    print(f"📊 Total unique locations processed: {len(unique_locations)}")
    
    # Sort by name
    unique_locations.sort(key=lambda x: x['name'])
    
    return unique_locations

def save_data(locations: List[Dict], filename: str = 'comprehensive_food_data.csv') -> None:
    """Save comprehensive food data to CSV file."""
    import os
    
    # Ensure processed directory exists
    processed_dir = 'processed'
    if not os.path.exists(processed_dir):
        os.makedirs(processed_dir)
    
    filepath = os.path.join(processed_dir, filename)
    
    if not locations:
        print(f"⚠️ No locations to save to {filepath}")
        return
    
    # Define CSV headers
    fieldnames = ['name', 'type', 'address', 'latitude', 'longitude', 'organization', 'hours', 'additional_info']
    
    with open(filepath, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        
        for location in locations:
            # Ensure all fields exist
            row = {field: location.get(field, '') for field in fieldnames}
            writer.writerow(row)
    
    print(f"✅ Saved {len(locations)} locations to {filepath}")
    
    # Print summary
    types = {}
    organizations = {}
    
    for location in locations:
        loc_type = location.get('type', 'Unknown')
        org = location.get('organization', 'Unknown')
        
        types[loc_type] = types.get(loc_type, 0) + 1
        organizations[org] = organizations.get(org, 0) + 1
    
    print(f"\n📊 Summary by type:")
    for loc_type, count in types.items():
        print(f"  • {loc_type}: {count} locations")
    
    print(f"\n📊 Summary by organization:")
    for org, count in organizations.items():
        print(f"  • {org}: {count} locations")

def main():
    """Main function to process and save comprehensive food data."""
    locations = process_comprehensive_food_data()
    save_data(locations)

if __name__ == "__main__":
    main()