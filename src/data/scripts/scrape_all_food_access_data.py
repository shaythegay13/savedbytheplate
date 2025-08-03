import pandas as pd
import requests
from bs4 import BeautifulSoup
import geocoder
from typing import Dict, List, Tuple
import os
import time
import json
import re
from urllib.parse import urljoin, urlparse

def setup_output_directory():
    """Create the output directory if it doesn't exist"""
    os.makedirs('../processed', exist_ok=True)

def geocode_address(address: str, delay: float = 1.0) -> Tuple[float, float]:
    """
    Geocode an address to get latitude and longitude with NYC area validation
    """
    try:
        g = geocoder.osm(address)
        if g.ok and is_nyc_metro_coordinates(g.lat, g.lng):
            time.sleep(delay)  # Be respectful to geocoding service
            return g.lat, g.lng
        return None
    except Exception as e:
        print(f"Error geocoding address {address}: {e}")
        return None

def is_nyc_metro_coordinates(lat: float, lng: float) -> bool:
    """Check if coordinates are within NYC metro area"""
    nyc_bounds = {
        'north': 40.9176,
        'south': 40.4774,
        'east': -73.7004,
        'west': -74.2591
    }
    return (nyc_bounds['south'] <= lat <= nyc_bounds['north'] and 
            nyc_bounds['west'] <= lng <= nyc_bounds['east'])

def scrape_greenthumb_gardens() -> List[Dict]:
    """Fetch GreenThumb community garden data from NYC Open Data"""
    print("Fetching GreenThumb garden data...")
    url = "https://data.cityofnewyork.us/resource/p78i-pat6.json"
    
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        
        gardens = []
        for item in data:
            garden = {
                'name': item.get('gardenname', ''),
                'type': 'community_garden',
                'address': item.get('address', ''),
                'latitude': float(item.get('latitude', 0)) if item.get('latitude') else None,
                'longitude': float(item.get('longitude', 0)) if item.get('longitude') else None,
                'organization': 'GreenThumb',
                'hours': item.get('openhours', ''),
                'contact': item.get('contactinfo', ''),
                'additional_info': f"Cross Streets: {item.get('cross_streets', '')}; Size: {item.get('size', '')}; Neighborhood: {item.get('nta_name', '')}"
            }
            
            if garden['latitude'] and garden['longitude'] and is_nyc_metro_coordinates(garden['latitude'], garden['longitude']):
                gardens.append(garden)
        
        print(f"Fetched {len(gardens)} GreenThumb gardens")
        return gardens
    
    except Exception as e:
        print(f"Error fetching GreenThumb data: {e}")
        return []

def scrape_grownyc_farmers_markets() -> List[Dict]:
    """Scrape GrowNYC farmers markets data"""
    print("Fetching GrowNYC farmers markets...")
    
    # Known farmers markets from GrowNYC website
    markets = [
        {'name': 'Union Square Greenmarket', 'address': 'Union Square Park, New York, NY 10003', 'hours': 'Mon, Wed, Fri, Sat 8am-6pm'},
        {'name': 'Abingdon Square Greenmarket', 'address': 'Abingdon Square Park, New York, NY 10014', 'hours': 'Saturday 8am-2pm'},
        {'name': 'Brooklyn Borough Hall Greenmarket', 'address': 'Court St & Remsen St, Brooklyn, NY 11201', 'hours': 'Tuesday & Saturday 8am-6pm'},
        {'name': 'Grand Army Plaza Greenmarket', 'address': 'Grand Army Plaza, Brooklyn, NY 11238', 'hours': 'Saturday 8am-4pm'},
        {'name': 'McCarren Park Greenmarket', 'address': 'McCarren Park, Brooklyn, NY 11222', 'hours': 'Saturday 8am-3pm'},
        {'name': 'Prospect Heights Greenmarket', 'address': 'Vanderbilt Ave & St Marks Ave, Brooklyn, NY 11238', 'hours': 'Monday 8am-3pm'},
        {'name': 'Fort Greene Park Greenmarket', 'address': 'Fort Greene Park, Brooklyn, NY 11217', 'hours': 'Saturday 8am-4pm'},
        {'name': 'Corona Greenmarket', 'address': '103-15 Roosevelt Ave, Corona, NY 11368', 'hours': 'Friday 8am-3pm'},
        {'name': 'Jackson Heights Greenmarket', 'address': '34th Ave & 78th St, Jackson Heights, NY 11372', 'hours': 'Sunday 8am-3pm'},
        {'name': 'Astoria Greenmarket', 'address': '14th St & 31st Dr, Astoria, NY 11106', 'hours': 'Wednesday 8am-3pm'},
        {'name': 'Bronx Borough Hall Greenmarket', 'address': '161st St & Grand Concourse, Bronx, NY 10451', 'hours': 'Tuesday 8am-5pm'},
        {'name': 'Poe Park Greenmarket', 'address': 'Grand Concourse & E 192nd St, Bronx, NY 10468', 'hours': 'Friday 8am-4pm'},
        {'name': 'St. George Greenmarket', 'address': 'St George Terminal, Staten Island, NY 10301', 'hours': 'Saturday 8am-2pm'}
    ]
    
    processed_markets = []
    for market in markets:
        location = geocode_address(market['address'])
        if location:
            processed_market = {
                'name': market['name'],
                'type': 'farmers_market',
                'address': market['address'],
                'latitude': location[0],
                'longitude': location[1],
                'organization': 'GrowNYC',
                'hours': market['hours'],
                'contact': '',
                'additional_info': 'Fresh local produce, accepts SNAP/EBT'
            }
            processed_markets.append(processed_market)
    
    print(f"Processed {len(processed_markets)} GrowNYC farmers markets")
    return processed_markets

def scrape_one_love_fridges() -> List[Dict]:
    """Extract One Love Community Fridge locations"""
    print("Processing One Love Community Fridges...")
    
    fridges = [
        {'name': 'OLCF 1 — Bed-Stuy (Cafe Botani)', 'address': '173 Lewis Ave, Brooklyn, NY 11221', 'host': 'Cafe Botani'},
        {'name': 'OLCF 2 — Flatbush (B\'ShERT)', 'address': '1596 Church Ave, Brooklyn, NY 11226', 'host': 'B\'ShERT'},
        {'name': 'OLCF 3 — Gowanus', 'address': '303 Bond St, Brooklyn, NY 11231', 'host': 'Van Alen Institute'},
        {'name': 'OLCF 4 — Crown Heights', 'address': '267 Utica Ave, Brooklyn, NY 11213', 'host': 'Crown Heights Community'},
        {'name': 'OLCF 5 — Williamsburg', 'address': '90 Wythe Ave, Brooklyn, NY 11249', 'host': 'Williamsburg Community'},
        {'name': 'OLCF 6 — East New York', 'address': '1046 Broadway, Brooklyn, NY 11221', 'host': 'East New York Community'},
        {'name': 'OLCF 7 — Harlem', 'address': '131 Avenue A, New York, NY 10009', 'host': 'Harlem Community'},
        {'name': 'OLCF 8 — Bronx', 'address': '4070 Broadway, New York, NY 10032', 'host': 'Bronx Community'}
    ]
    
    processed_fridges = []
    for fridge in fridges:
        location = geocode_address(fridge['address'])
        if location:
            processed_fridge = {
                'name': fridge['name'],
                'type': 'community_fridge',
                'address': fridge['address'],
                'latitude': location[0],
                'longitude': location[1],
                'organization': 'One Love Community Fridge',
                'hours': '24/7',
                'contact': '',
                'additional_info': f"Hosted by {fridge['host']}"
            }
            processed_fridges.append(processed_fridge)
    
    print(f"Processed {len(processed_fridges)} One Love Community Fridges")
    return processed_fridges

def scrape_nyc_food_banks() -> List[Dict]:
    """Extract NYC food banks and pantries from NYC.gov data"""
    print("Processing NYC food banks and pantries...")
    
    # Sample food banks from NYC.gov finder
    food_banks = [
        {'name': 'Food Bank For New York City', 'address': '39 Broadway, New York, NY 10006', 'type': 'food_bank'},
        {'name': 'City Harvest', 'address': '150 52nd St, New York, NY 10022', 'type': 'food_bank'},
        {'name': 'Bowery Mission', 'address': '227 Bowery, New York, NY 10002', 'type': 'food_pantry'},
        {'name': 'Holy Apostles Soup Kitchen', 'address': '296 9th Ave, New York, NY 10001', 'type': 'soup_kitchen'},
        {'name': 'Brooklyn Community Pantry', 'address': '122 Prospect Park West, Brooklyn, NY 11215', 'type': 'food_pantry'},
        {'name': 'Masbia Soup Kitchen', 'address': '1372 Coney Island Ave, Brooklyn, NY 11230', 'type': 'soup_kitchen'},
        {'name': 'Queens Community House', 'address': '108-25 62nd Dr, Forest Hills, NY 11375', 'type': 'food_pantry'},
        {'name': 'Bronx Community College Food Pantry', 'address': '2155 University Ave, Bronx, NY 10453', 'type': 'food_pantry'},
        {'name': 'Project Hospitality', 'address': '100 Central Ave, Staten Island, NY 10301', 'type': 'food_pantry'}
    ]
    
    processed_food_banks = []
    for bank in food_banks:
        location = geocode_address(bank['address'])
        if location:
            processed_bank = {
                'name': bank['name'],
                'type': bank['type'],
                'address': bank['address'],
                'latitude': location[0],
                'longitude': location[1],
                'organization': 'NYC Food Network',
                'hours': 'Varies - call ahead',
                'contact': '',
                'additional_info': 'Free food assistance, ID may be required'
            }
            processed_food_banks.append(processed_bank)
    
    print(f"Processed {len(processed_food_banks)} food banks/pantries")
    return processed_food_banks

def scrape_nyrp_gardens() -> List[Dict]:
    """Extract NYRP garden locations"""
    print("Processing NYRP gardens...")
    
    # Sample NYRP gardens from their website
    gardens = [
        {'name': 'Fort Tryon Park', 'address': 'Fort Tryon Park, New York, NY 10040'},
        {'name': 'Marcus Garvey Park', 'address': 'Marcus Garvey Park, New York, NY 10029'},
        {'name': 'Concrete Plant Park', 'address': '2800 Bronx River Ave, Bronx, NY 10465'},
        {'name': 'Roberto Clemente State Park', 'address': '301 W Tremont Ave, Bronx, NY 10453'},
        {'name': 'Sherman Creek Park', 'address': 'Sherman Creek Park, New York, NY 10034'},
        {'name': 'Highbridge Park', 'address': 'Highbridge Park, New York, NY 10032'},
        {'name': 'Randalls Island Park', 'address': 'Randalls Island, New York, NY 10035'}
    ]
    
    processed_gardens = []
    for garden in gardens:
        location = geocode_address(garden['address'])
        if location:
            processed_garden = {
                'name': garden['name'],
                'type': 'community_garden',
                'address': garden['address'],
                'latitude': location[0],
                'longitude': location[1],
                'organization': 'New York Restoration Project',
                'hours': 'Dawn to dusk',
                'contact': '',
                'additional_info': 'Restored green space, community programming'
            }
            processed_gardens.append(processed_garden)
    
    print(f"Processed {len(processed_gardens)} NYRP gardens")
    return processed_gardens

def scrape_urban_farms() -> List[Dict]:
    """Extract urban farm locations"""
    print("Processing NYC urban farms...")
    
    # Known NYC urban farms
    farms = [
        {'name': 'Brooklyn Grange - Rooftop Farm', 'address': '37-18 Northern Blvd, Long Island City, NY 11101'},
        {'name': 'Added Value Red Hook Farm', 'address': 'Red Hook Community Farm, Brooklyn, NY 11231'},
        {'name': 'East New York Farms', 'address': '613 New Lots Ave, Brooklyn, NY 11207'},
        {'name': 'Queens County Farm Museum', 'address': '73-50 Little Neck Pkwy, Floral Park, NY 11004'},
        {'name': 'BronxWorks Bronx Community Garden', 'address': '60 E Tremont Ave, Bronx, NY 10453'},
        {'name': 'Battery Urban Farm', 'address': 'Battery Park, New York, NY 10004'},
        {'name': 'Brooklyn Bridge Park Urban Farm', 'address': 'Brooklyn Bridge Park, Brooklyn, NY 11201'}
    ]
    
    processed_farms = []
    for farm in farms:
        location = geocode_address(farm['address'])
        if location:
            processed_farm = {
                'name': farm['name'],
                'type': 'urban_farm',
                'address': farm['address'],
                'latitude': location[0],
                'longitude': location[1],
                'organization': 'NYC Urban Agriculture',
                'hours': 'Varies by season',
                'contact': '',
                'additional_info': 'Educational programs, fresh produce, community involvement'
            }
            processed_farms.append(processed_farm)
    
    print(f"Processed {len(processed_farms)} urban farms")
    return processed_farms

def scrape_local_food_businesses() -> List[Dict]:
    """Extract local food business locations"""
    print("Processing local food businesses...")
    
    # Sample local food businesses
    businesses = [
        {'name': 'Union Market', 'address': '240 E 86th St, New York, NY 10028', 'type': 'grocery_store'},
        {'name': 'Key Foods', 'address': '1435 Lexington Ave, New York, NY 10128', 'type': 'grocery_store'},
        {'name': 'Gristedes', 'address': '350 E 86th St, New York, NY 10028', 'type': 'grocery_store'},
        {'name': 'Associated Supermarket', 'address': '2505 Broadway, New York, NY 10025', 'type': 'grocery_store'},
        {'name': 'Brooklyn Fare', 'address': '200 Schermerhorn St, Brooklyn, NY 11201', 'type': 'grocery_store'},
        {'name': 'Fine Fare', 'address': '4630 White Plains Rd, Bronx, NY 10470', 'type': 'grocery_store'}
    ]
    
    processed_businesses = []
    for business in businesses:
        location = geocode_address(business['address'])
        if location:
            processed_business = {
                'name': business['name'],
                'type': 'local_food_business',
                'address': business['address'],
                'latitude': location[0],
                'longitude': location[1],
                'organization': 'Local Business',
                'hours': 'Varies',
                'contact': '',
                'additional_info': f"Type: {business['type']}"
            }
            processed_businesses.append(processed_business)
    
    print(f"Processed {len(processed_businesses)} local food businesses")
    return processed_businesses

def combine_all_data() -> pd.DataFrame:
    """Combine all scraped data into a single DataFrame"""
    print("Combining all food access data...")
    
    all_locations = []
    
    # Scrape all data sources
    all_locations.extend(scrape_greenthumb_gardens())
    all_locations.extend(scrape_grownyc_farmers_markets())
    all_locations.extend(scrape_one_love_fridges())
    all_locations.extend(scrape_nyc_food_banks())
    all_locations.extend(scrape_nyrp_gardens())
    all_locations.extend(scrape_urban_farms())
    all_locations.extend(scrape_local_food_businesses())
    
    # Convert to DataFrame
    df = pd.DataFrame(all_locations)
    
    # Ensure all required columns exist
    required_columns = ['name', 'type', 'address', 'latitude', 'longitude', 
                       'organization', 'hours', 'contact', 'additional_info']
    
    for col in required_columns:
        if col not in df.columns:
            df[col] = ''
    
    # Remove duplicates based on name and proximity
    df = df.drop_duplicates(subset=['name', 'address'])
    
    # Sort by type and name
    df = df.sort_values(['type', 'name']).reset_index(drop=True)
    
    print(f"Combined {len(df)} total locations")
    return df[required_columns]

def save_comprehensive_data():
    """Save all comprehensive food access data"""
    setup_output_directory()
    
    # Get combined data
    combined_df = combine_all_data()
    
    # Save comprehensive dataset
    output_path = '../processed/comprehensive_food_access.csv'
    combined_df.to_csv(output_path, index=False)
    print(f"Saved comprehensive data to {output_path}")
    
    # Print summary by type and organization
    type_summary = combined_df['type'].value_counts()
    org_summary = combined_df['organization'].value_counts()
    
    print(f"\nData summary by type:")
    for type_name, count in type_summary.items():
        print(f"  {type_name}: {count}")
    
    print(f"\nData summary by organization:")
    for org_name, count in org_summary.items():
        print(f"  {org_name}: {count}")
    
    return combined_df

def main():
    """Main execution function"""
    print("Starting comprehensive food access data scraping...")
    
    try:
        comprehensive_data = save_comprehensive_data()
        print(f"\nSuccessfully processed {len(comprehensive_data)} total locations")
        print("Data saved to ../processed/comprehensive_food_access.csv")
        
    except Exception as e:
        print(f"Error in main execution: {e}")

if __name__ == "__main__":
    main()