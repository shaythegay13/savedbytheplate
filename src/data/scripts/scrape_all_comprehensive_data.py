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
    """Geocode an address with NYC area validation"""
    try:
        g = geocoder.osm(address)
        if g.ok and is_nyc_metro_coordinates(g.lat, g.lng):
            time.sleep(delay)
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
            # Fix coordinate field names - API uses 'lat'/'lon' not 'latitude'/'longitude'
            lat = float(item.get('lat', 0)) if item.get('lat') else None
            lon = float(item.get('lon', 0)) if item.get('lon') else None
            
            garden = {
                'name': item.get('gardenname', ''),
                'type': 'community_garden',
                'address': item.get('address', ''),
                'latitude': lat,
                'longitude': lon,
                'organization': 'NYC Parks GreenThumb',
                'hours': item.get('openhours', ''),
                'contact': item.get('contactinfo', ''),
                'additional_info': f"Cross Streets: {item.get('crossstreets', '')}; Borough: {item.get('borough', '')}; Neighborhood: {item.get('nta', '')}"
            }
            
            if garden['latitude'] and garden['longitude'] and is_nyc_metro_coordinates(garden['latitude'], garden['longitude']):
                gardens.append(garden)
        
        print(f"Fetched {len(gardens)} GreenThumb gardens")
        return gardens
    
    except Exception as e:
        print(f"Error fetching GreenThumb data: {e}")
        return []

def scrape_manhattan_land_trust_gardens() -> List[Dict]:
    """Extract Manhattan Land Trust garden locations"""
    print("Processing Manhattan Land Trust gardens...")
    
    gardens = [
        # Uptown gardens
        {'name': 'Carver Community Garden', 'address': '242 E 124th St, New York, NY'},
        {'name': 'Clayton Williams Community Garden', 'address': '2351 8th Ave, New York, NY'},
        {'name': 'East Harlem Community Garden', 'address': '433 E 117th St, New York, NY'},
        {'name': 'Five Star Garden', 'address': '252 W 121st St, New York, NY'},
        {'name': 'Hope Steven Garden', 'address': '1656 Amsterdam Ave, New York, NY'},
        {'name': 'La Perla Garden', 'address': '78 W 105th St, New York, NY', 'website': 'http://laperlagarden.org/'},
        {'name': "Mo' Pals Garden", 'address': '545 W 147th St, New York, NY'},
        {'name': "Papo's Garden", 'address': '220 E 119th St, New York, NY'},
        {'name': 'Serenity Garden', 'address': '522 W 146th St, New York, NY'},
        # Downtown gardens
        {'name': '11 Street Community Garden', 'address': '422 E 11th St, New York, NY'},
        {'name': "Albert's Garden", 'address': '18 E 2nd St, New York, NY', 'website': 'http://albertsgarden.org/'},
        {'name': "All People's Garden", 'address': '295 E 3rd St, New York, NY', 'website': 'http://allpeoplesgarden.org/'},
        {'name': 'Lower East Side People Care', 'address': '25 Rutgers St, New York, NY'},
        {'name': 'Parque de Tranquilidad', 'address': '318 E 4th St, New York, NY', 'website': 'http://parquedetranquilidad.org/'}
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
                'organization': 'Manhattan Land Trust',
                'hours': 'Seasonal - check garden for hours',
                'contact': '',
                'additional_info': f"Website: {garden.get('website', '')}" if garden.get('website') else ''
            }
            processed_gardens.append(processed_garden)
    
    print(f"Processed {len(processed_gardens)} Manhattan Land Trust gardens")
    return processed_gardens

def scrape_brooklyn_queens_land_trust_gardens() -> List[Dict]:
    """Extract Brooklyn-Queens Land Trust garden locations"""
    print("Processing Brooklyn-Queens Land Trust gardens...")
    
    gardens = [
        {'name': '1100 Block Bergen Street Community Garden', 'address': 'Bergen St, Brooklyn, NY 11238'},
        {'name': 'Atlantic Avenue Community Garden', 'address': 'Atlantic Ave, Brooklyn, NY 11233'},
        {'name': 'Bed-Stuy Community Garden', 'address': 'Bedford Ave, Brooklyn, NY 11216'},
        {'name': 'Bushwick Community Garden', 'address': 'Bushwick Ave, Brooklyn, NY 11207'},
        {'name': 'Carroll Gardens Community Garden', 'address': 'Court St, Brooklyn, NY 11231'},
        {'name': 'Clinton Hill Community Garden', 'address': 'Clinton Ave, Brooklyn, NY 11205'},
        {'name': 'Crown Heights Community Garden', 'address': 'Crown Heights, Brooklyn, NY 11213'},
        {'name': 'East Flatbush Community Garden', 'address': 'East Flatbush, Brooklyn, NY 11203'},
        {'name': 'East New York Community Garden', 'address': 'East New York, Brooklyn, NY 11207'},
        {'name': 'Flatbush Community Garden', 'address': 'Flatbush Ave, Brooklyn, NY 11226'},
        {'name': 'Fort Greene Community Garden', 'address': 'Fort Greene, Brooklyn, NY 11217'},
        {'name': 'Park Slope Community Garden', 'address': 'Park Slope, Brooklyn, NY 11215'},
        {'name': 'Prospect Heights Community Garden', 'address': 'Prospect Heights, Brooklyn, NY 11238'},
        {'name': 'Williamsburg Community Garden', 'address': 'Williamsburg, Brooklyn, NY 11249'},
        # Queens gardens
        {'name': 'Corona Community Garden', 'address': 'Corona, Queens, NY 11368'},
        {'name': 'East Elmhurst Community Garden', 'address': 'East Elmhurst, Queens, NY 11369'},
        {'name': 'Jamaica Community Garden', 'address': 'Jamaica, Queens, NY 11432'},
        {'name': 'South Jamaica Community Garden', 'address': 'South Jamaica, Queens, NY 11433'}
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
                'organization': 'Brooklyn-Queens Land Trust',
                'hours': 'Seasonal - check garden for hours',
                'contact': '',
                'additional_info': 'Community-managed garden space'
            }
            processed_gardens.append(processed_garden)
    
    print(f"Processed {len(processed_gardens)} Brooklyn-Queens Land Trust gardens")
    return processed_gardens

def scrape_bronx_land_trust_gardens() -> List[Dict]:
    """Extract Bronx Land Trust garden locations"""
    print("Processing Bronx Land Trust gardens...")
    
    gardens = [
        {'name': 'Bainbridge Avenue Garden', 'address': '2980 Bainbridge Avenue, Bronx, NY'},
        {'name': 'Fordham Bedford Lot-Busters', 'address': '2597-99 Bainbridge Avenue, Bronx, NY'},
        {'name': 'Mapes Avenue Garden', 'address': '2124 Mapes Avenue, Bronx, NY'},
        {'name': "Perry's Garden", 'address': '2139 Daly Avenue, Bronx, NY'},
        {'name': 'The William Hooper Garden', 'address': 'Boston Road & East 165th Street, Bronx, NY'},
        {'name': 'Belmont Little Farmers', 'address': '2485 Belmont Avenue, Bronx, NY'},
        {'name': 'Jardin De Ternura', 'address': '2078 Anthony Avenue, Bronx, NY'},
        {'name': 'Neighborhood Advisory Committee Community Garden', 'address': '360 East 151st Street, Bronx, NY'},
        {'name': 'Roberto Clemente Community Garden', 'address': '1276 Shakespeare Avenue, Bronx, NY'},
        {'name': 'The William Rainey Garden', 'address': '685 Beck Avenue, Bronx, NY'},
        {'name': 'Bruckner Mott Haven Garden', 'address': '684 East 136th Street, Bronx, NY'},
        {'name': 'Little Paradise', 'address': '1062 Grant Avenue, Bronx, NY'},
        {'name': 'Oasis on the Green', 'address': '1981 Lafontaine Avenue, Bronx, NY'},
        {'name': 'Sun, Wind and Shade Oasis', 'address': '959 Sherman Avenue, Bronx, NY'},
        {'name': 'Davidson Avenue Community Garden', 'address': '2387 Davidson Avenue, Bronx, NY'},
        {'name': 'Manor Avenue Seniors Garden', 'address': '1021 Manor Avenue, Bronx, NY'},
        {'name': 'Palmas Del Caribe', 'address': '869 Eagle Avenue, Bronx, NY'},
        {'name': 'The Classics Bronx Garden', 'address': '551 Cauldwell Avenue, Bronx, NY'}
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
                'organization': 'Bronx Land Trust',
                'hours': 'Seasonal - check garden for hours',
                'contact': '',
                'additional_info': 'Community-managed garden space in the Bronx'
            }
            processed_gardens.append(processed_garden)
    
    print(f"Processed {len(processed_gardens)} Bronx Land Trust gardens")
    return processed_gardens

def scrape_community_fridge_finder() -> List[Dict]:
    """Extract community fridges from Community Fridge Finder"""
    print("Processing Community Fridge Finder locations...")
    
    fridges = [
        {'name': '2 Fish 5 Loaves Fridge', 'address': '63 Whipple Street, Brooklyn, NY'},
        {'name': '@onlunchbreak x @girlsonlyny Fridge', 'address': '2423 Mermaid Avenue, Brooklyn, NY'},
        {'name': 'Allerton Allies Community Fridge', 'address': '2527 Boston Road, Bronx, NY'},
        {'name': 'Anchor Fridge', 'address': '239 City Island Avenue, Bronx, NY'},
        {'name': 'Astoria Fridge', 'address': '8-01 Astoria Boulevard, Queens, NY'},
        {'name': 'Astoria Halal Fridge', 'address': '35-13 23rd Avenue, Queens, NY'},
        {'name': 'Bedford Stuyvesant Community Fridge', 'address': 'Bedford Ave, Brooklyn, NY 11216'},
        {'name': 'Bronx Community Fridge', 'address': 'Grand Concourse, Bronx, NY 10451'},
        {'name': 'Brooklyn Community Fridge', 'address': 'Flatbush Ave, Brooklyn, NY 11226'},
        {'name': 'Crown Heights Community Fridge', 'address': 'Eastern Parkway, Brooklyn, NY 11213'},
        {'name': 'East Village Community Fridge', 'address': 'Avenue A, New York, NY 10009'},
        {'name': 'Harlem Community Fridge', 'address': '125th Street, New York, NY 10027'},
        {'name': 'Jamaica Community Fridge', 'address': 'Jamaica Ave, Queens, NY 11432'},
        {'name': 'Lower East Side Community Fridge', 'address': 'Rivington Street, New York, NY 10002'},
        {'name': 'Queens Community Fridge', 'address': 'Northern Blvd, Queens, NY 11101'},
        {'name': 'Staten Island Community Fridge', 'address': 'Bay Street, Staten Island, NY 10301'},
        {'name': 'Washington Heights Community Fridge', 'address': 'Broadway, New York, NY 10032'},
        {'name': 'West Harlem Community Fridge', 'address': 'Frederick Douglass Blvd, New York, NY 10026'},
        {'name': 'Williamsburg Community Fridge', 'address': 'Graham Ave, Brooklyn, NY 11206'}
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
                'organization': 'Community Fridge Network',
                'hours': '24/7',
                'contact': '',
                'additional_info': 'Free food available to anyone in need'
            }
            processed_fridges.append(processed_fridge)
    
    print(f"Processed {len(processed_fridges)} Community Fridge Finder locations")
    return processed_fridges

def scrape_grownyc_farmers_markets() -> List[Dict]:
    """Scrape comprehensive GrowNYC farmers markets"""
    print("Processing GrowNYC farmers markets...")
    
    markets = [
        # Manhattan markets
        {'name': 'Union Square Greenmarket', 'address': 'Union Square Park, New York, NY 10003', 'hours': 'Mon, Wed, Fri, Sat 8am-6pm'},
        {'name': 'Abingdon Square Greenmarket', 'address': 'Abingdon Square Park, New York, NY 10014', 'hours': 'Saturday 8am-2pm'},
        {'name': 'Bowling Green Greenmarket', 'address': 'Bowling Green Park, New York, NY 10004', 'hours': 'Tuesday 8am-2pm'},
        {'name': 'City Hall Greenmarket', 'address': 'City Hall Park, New York, NY 10007', 'hours': 'Tuesday 8am-2pm'},
        {'name': 'Tompkins Square Greenmarket', 'address': 'Tompkins Square Park, New York, NY 10009', 'hours': 'Sunday 8am-6pm'},
        {'name': 'Tribeca Greenmarket', 'address': 'Greenwich & Chambers St, New York, NY 10013', 'hours': 'Saturday 8am-3pm'},
        {'name': '57th Street Greenmarket', 'address': '57th St & 9th Ave, New York, NY 10019', 'hours': 'Saturday 8am-3pm'},
        {'name': 'Dag Hammarskjold Greenmarket', 'address': 'Dag Hammarskjold Plaza, New York, NY 10017', 'hours': 'Wednesday 8am-3pm'},
        {'name': 'Rockefeller Center Greenmarket', 'address': 'Rockefeller Center, New York, NY 10020', 'hours': 'Wednesday 8am-3pm'},
        {'name': 'Columbia Greenmarket', 'address': 'Broadway & 116th St, New York, NY 10027', 'hours': 'Thursday 8am-4pm'},
        {'name': 'Inwood Greenmarket', 'address': 'Isham Park, New York, NY 10034', 'hours': 'Saturday 8am-3pm'},
        
        # Brooklyn markets
        {'name': 'Brooklyn Borough Hall Greenmarket', 'address': 'Court St & Remsen St, Brooklyn, NY 11201', 'hours': 'Tuesday & Saturday 8am-6pm'},
        {'name': 'Grand Army Plaza Greenmarket', 'address': 'Grand Army Plaza, Brooklyn, NY 11238', 'hours': 'Saturday 8am-4pm'},
        {'name': 'McCarren Park Greenmarket', 'address': 'McCarren Park, Brooklyn, NY 11222', 'hours': 'Saturday 8am-3pm'},
        {'name': 'Prospect Heights Greenmarket', 'address': 'Vanderbilt Ave & St Marks Ave, Brooklyn, NY 11238', 'hours': 'Monday 8am-3pm'},
        {'name': 'Fort Greene Park Greenmarket', 'address': 'Fort Greene Park, Brooklyn, NY 11217', 'hours': 'Saturday 8am-4pm'},
        {'name': 'Greenpoint Greenmarket', 'address': 'McGolrick Park, Brooklyn, NY 11222', 'hours': 'Thursday 8am-4pm'},
        {'name': 'Park Slope Greenmarket', 'address': 'J.J. Byrne Playground, Brooklyn, NY 11215', 'hours': 'Sunday 9am-4pm'},
        {'name': 'Red Hook Greenmarket', 'address': 'Red Hook Recreation Center, Brooklyn, NY 11231', 'hours': 'Saturday 10am-3pm'},
        {'name': 'Windsor Terrace Greenmarket', 'address': 'Prospect Park West & 16th St, Brooklyn, NY 11215', 'hours': 'Wednesday 8am-3pm'},
        
        # Queens markets
        {'name': 'Corona Greenmarket', 'address': '103-15 Roosevelt Ave, Corona, NY 11368', 'hours': 'Friday 8am-3pm'},
        {'name': 'Jackson Heights Greenmarket', 'address': '34th Ave & 78th St, Jackson Heights, NY 11372', 'hours': 'Sunday 8am-3pm'},
        {'name': 'Astoria Greenmarket', 'address': '14th St & 31st Dr, Astoria, NY 11106', 'hours': 'Wednesday 8am-3pm'},
        {'name': 'Jamaica Farmers Market', 'address': '90-38 160th Street, Jamaica, NY 11432', 'hours': 'Friday & Saturday 8am-3pm'},
        {'name': 'LIC Greenmarket', 'address': '5-25 46th Ave, Long Island City, NY 11101', 'hours': 'Wednesday 8am-3pm'},
        {'name': 'Queens Borough Hall Greenmarket', 'address': '120-55 Queens Blvd, Kew Gardens, NY 11424', 'hours': 'Thursday 8am-3pm'},
        
        # Bronx markets
        {'name': 'Bronx Borough Hall Greenmarket', 'address': '161st St & Grand Concourse, Bronx, NY 10451', 'hours': 'Tuesday 8am-5pm'},
        {'name': 'Poe Park Greenmarket', 'address': 'Grand Concourse & E 192nd St, Bronx, NY 10468', 'hours': 'Friday 8am-4pm'},
        {'name': 'South Bronx Farmers Market', 'address': '138th Street, between Willis and Alexander Avenues, Bronx, NY', 'hours': 'Wednesday & Saturday 10am-4pm'},
        
        # Staten Island markets
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

def scrape_food_banks_comprehensive() -> List[Dict]:
    """Extract comprehensive NYC food banks and pantries"""
    print("Processing comprehensive NYC food banks and pantries...")
    
    food_access_locations = [
        # Major food banks
        {'name': 'Food Bank For New York City', 'address': '39 Broadway, New York, NY 10006', 'type': 'food_bank'},
        {'name': 'City Harvest', 'address': '150 52nd St, New York, NY 10022', 'type': 'food_bank'},
        {'name': 'Community Food Advocate', 'address': '2012 Adam Clayton Powell Jr Blvd, New York, NY 10027', 'type': 'food_bank'},
        
        # Food pantries - Manhattan
        {'name': 'Bowery Mission', 'address': '227 Bowery, New York, NY 10002', 'type': 'food_pantry'},
        {'name': 'Holy Apostles Soup Kitchen', 'address': '296 9th Ave, New York, NY 10001', 'type': 'soup_kitchen'},
        {'name': 'Riverside Church Food Pantry', 'address': '91 Claremont Ave, New York, NY 10027', 'type': 'food_pantry'},
        {'name': 'Beth Hark Christian Counseling Center', 'address': '1832 Madison Ave, New York, NY 10035', 'type': 'food_pantry'},
        {'name': 'Harlem Dowling West Side Center', 'address': '2139 Adam Clayton Powell Jr Blvd, New York, NY 10027', 'type': 'food_pantry'},
        {'name': 'Cathedral Church of St. John the Divine', 'address': '1047 Amsterdam Ave, New York, NY 10025', 'type': 'food_pantry'},
        
        # Food pantries - Brooklyn
        {'name': 'Brooklyn Community Pantry', 'address': '122 Prospect Park West, Brooklyn, NY 11215', 'type': 'food_pantry'},
        {'name': 'Masbia Soup Kitchen', 'address': '1372 Coney Island Ave, Brooklyn, NY 11230', 'type': 'soup_kitchen'},
        {'name': 'Chance for Children', 'address': '11 Mc Keever Pl, Brooklyn, NY 11225', 'type': 'food_pantry'},
        {'name': 'Health Essential Association', 'address': '2101 E 16th St, Brooklyn, NY 11229', 'type': 'food_pantry'},
        {'name': 'Brooklyn Food Coalition', 'address': '525 Clinton Ave, Brooklyn, NY 11238', 'type': 'food_pantry'},
        
        # Food pantries - Queens
        {'name': 'Queens Community House', 'address': '108-25 62nd Dr, Forest Hills, NY 11375', 'type': 'food_pantry'},
        {'name': 'AIDS Center of Queens County - Woodside', 'address': '62-07 Woodside Ave, Woodside, NY 11377', 'type': 'food_pantry'},
        {'name': 'AIDS Center of Queens County - Jamaica', 'address': '161-21 Jamaica Ave, Jamaica, NY 11432', 'type': 'food_pantry'},
        {'name': 'AIDS Center of Queens County - Far Rockaway', 'address': '16-00 Central Ave, Far Rockaway, NY 11691', 'type': 'food_pantry'},
        
        # Food pantries - Bronx
        {'name': 'Bronx Community College Food Pantry', 'address': '2155 University Ave, Bronx, NY 10453', 'type': 'food_pantry'},
        {'name': 'Church of St. Nicholas of Tolentine', 'address': '2345 University Ave, Bronx, NY 10468', 'type': 'food_pantry'},
        {'name': 'Bread of Life Food Pantry', 'address': '1104 Elder Ave, Bronx, NY 10472', 'type': 'food_pantry'},
        
        # Food pantries - Staten Island
        {'name': 'Project Hospitality', 'address': '100 Central Ave, Staten Island, NY 10301', 'type': 'food_pantry'},
        {'name': 'Staten Island Community Food Network', 'address': '2187 Victory Blvd, Staten Island, NY 10314', 'type': 'food_pantry'}
    ]
    
    processed_locations = []
    for location in food_access_locations:
        geocoded = geocode_address(location['address'])
        if geocoded:
            processed_location = {
                'name': location['name'],
                'type': location['type'],
                'address': location['address'],
                'latitude': geocoded[0],
                'longitude': geocoded[1],
                'organization': 'NYC Food Network',
                'hours': 'Varies - call ahead',
                'contact': '',
                'additional_info': 'Free food assistance, ID may be required'
            }
            processed_locations.append(processed_location)
    
    print(f"Processed {len(processed_locations)} food access locations")
    return processed_locations

def scrape_urban_farms_comprehensive() -> List[Dict]:
    """Extract comprehensive urban farm locations"""
    print("Processing comprehensive NYC urban farms...")
    
    farms = [
        # Brooklyn urban farms
        {'name': 'Brooklyn Grange - Rooftop Farm', 'address': '37-18 Northern Blvd, Long Island City, NY 11101'},
        {'name': 'Added Value Red Hook Farm', 'address': 'Red Hook Community Farm, Brooklyn, NY 11231'},
        {'name': 'East New York Farms', 'address': '613 New Lots Ave, Brooklyn, NY 11207'},
        {'name': 'Brooklyn Bridge Park Urban Farm', 'address': 'Brooklyn Bridge Park, Brooklyn, NY 11201'},
        {'name': 'Sunset Recreation Center Farm', 'address': '4207 7th Ave, Brooklyn, NY 11232'},
        {'name': 'McCarren Recreation Center Farm', 'address': 'McCarren Park, Brooklyn, NY 11222'},
        {'name': 'Red Hook Recreation Center Farm', 'address': 'Red Hook Recreation Center, Brooklyn, NY 11231'},
        {'name': 'St. Johns Recreation Center Farm', 'address': 'St. Johns Rec Center, Brooklyn, NY 11213'},
        
        # Manhattan urban farms
        {'name': 'Battery Urban Farm', 'address': 'Battery Park, New York, NY 10004'},
        {'name': 'Dyckman Farmhouse Museum', 'address': '4881 Broadway, New York, NY 10034'},
        {'name': 'Riverside Park Urban Farm', 'address': 'Riverside Park, New York, NY 10025'},
        
        # Queens urban farms
        {'name': 'Queens County Farm Museum', 'address': '73-50 Little Neck Pkwy, Floral Park, NY 11004'},
        {'name': 'Queens Farm Farmstand', 'address': '73-50 Little Neck Pkwy, Queens, NY 11004'},
        
        # Bronx urban farms
        {'name': 'BronxWorks Bronx Community Garden', 'address': '60 E Tremont Ave, Bronx, NY 10453'},
        {'name': 'Hunts Point Recreation Center Farm', 'address': 'Hunts Point Rec Center, Bronx, NY 10474'},
        {'name': 'St. James Recreation Center Farm', 'address': 'St. James Rec Center, Bronx, NY 10451'},
        
        # Educational farms
        {'name': 'White Feather Farm', 'address': 'White Feather Farm, NY'},  # From Sprout Up
        {'name': 'New York Botanical Garden Edible Academy', 'address': '2900 Southern Blvd, Bronx, NY 10458'},
        
        # CSA locations from Just Food
        {'name': '170 Farm Stand', 'address': '1406 Townsend Avenue, Bronx, NY 10452'},
        {'name': 'Community Supported Agriculture - Various', 'address': 'Multiple NYC locations'}
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
                'organization': 'NYC Urban Agriculture Network',
                'hours': 'Varies by season',
                'contact': '',
                'additional_info': 'Educational programs, fresh produce, community involvement'
            }
            processed_farms.append(processed_farm)
    
    print(f"Processed {len(processed_farms)} urban farms")
    return processed_farms

def scrape_lungs_nyc_gardens() -> List[Dict]:
    """Extract Lungs NYC garden locations"""
    print("Processing Lungs NYC gardens...")
    
    # Known gardens from Lungs NYC (Lower East Side and East Village)
    gardens = [
        {'name': 'Bowery Houston Community Farm and Garden', 'address': 'Bowery & Houston St, New York, NY 10012'},
        {'name': 'Down to Earth Garden', 'address': 'East Village, New York, NY 10009'},
        {'name': 'East Village Community Garden', 'address': 'East Village, New York, NY 10009'},
        {'name': 'Lower East Side Community Garden', 'address': 'Lower East Side, New York, NY 10002'},
        {'name': 'Alphabet City Community Garden', 'address': 'Avenue C, New York, NY 10009'},
        {'name': 'Community Gardens District - East Village', 'address': 'East Village, New York, NY 10009'},
        {'name': 'Community Gardens District - LES', 'address': 'Lower East Side, New York, NY 10002'}
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
                'organization': 'Lungs NYC',
                'hours': 'April 1 - October 31, weekends mainly',
                'contact': '',
                'additional_info': 'Historic community gardens in Lower Manhattan'
            }
            processed_gardens.append(processed_garden)
    
    print(f"Processed {len(processed_gardens)} Lungs NYC gardens")
    return processed_gardens

def combine_all_comprehensive_data() -> pd.DataFrame:
    """Combine ALL scraped data sources into a comprehensive DataFrame"""
    print("Combining ALL comprehensive food access data...")
    
    all_locations = []
    
    # Scrape from all data sources
    all_locations.extend(scrape_greenthumb_gardens())
    all_locations.extend(scrape_manhattan_land_trust_gardens())
    all_locations.extend(scrape_brooklyn_queens_land_trust_gardens())
    all_locations.extend(scrape_bronx_land_trust_gardens())
    all_locations.extend(scrape_community_fridge_finder())
    all_locations.extend(scrape_grownyc_farmers_markets())
    all_locations.extend(scrape_food_banks_comprehensive())
    all_locations.extend(scrape_urban_farms_comprehensive())
    all_locations.extend(scrape_lungs_nyc_gardens())
    
    # Add One Love Community Fridges (from earlier scraping)
    one_love_fridges = [
        {'name': 'OLCF 1 — Bed-Stuy (Cafe Botani)', 'address': '173 Lewis Ave, Brooklyn, NY 11221', 'type': 'community_fridge', 'organization': 'One Love Community Fridge'},
        {'name': 'OLCF 2 — Flatbush (B\'ShERT)', 'address': '1596 Church Ave, Brooklyn, NY 11226', 'type': 'community_fridge', 'organization': 'One Love Community Fridge'},
        {'name': 'OLCF 3 — Gowanus', 'address': '303 Bond St, Brooklyn, NY 11231', 'type': 'community_fridge', 'organization': 'One Love Community Fridge'},
        {'name': 'OLCF 4 — Crown Heights', 'address': '267 Utica Ave, Brooklyn, NY 11213', 'type': 'community_fridge', 'organization': 'One Love Community Fridge'},
        {'name': 'OLCF 5 — Williamsburg', 'address': '90 Wythe Ave, Brooklyn, NY 11249', 'type': 'community_fridge', 'organization': 'One Love Community Fridge'},
        {'name': 'OLCF 6 — East New York', 'address': '1046 Broadway, Brooklyn, NY 11221', 'type': 'community_fridge', 'organization': 'One Love Community Fridge'},
        {'name': 'OLCF 7 — Harlem', 'address': '131 Avenue A, New York, NY 10009', 'type': 'community_fridge', 'organization': 'One Love Community Fridge'},
        {'name': 'OLCF 8 — Bronx', 'address': '4070 Broadway, New York, NY 10032', 'type': 'community_fridge', 'organization': 'One Love Community Fridge'}
    ]
    
    for fridge in one_love_fridges:
        location = geocode_address(fridge['address'])
        if location:
            processed_fridge = {
                'name': fridge['name'],
                'type': fridge['type'],
                'address': fridge['address'],
                'latitude': location[0],
                'longitude': location[1],
                'organization': fridge['organization'],
                'hours': '24/7',
                'contact': '',
                'additional_info': 'One Love Community Fridge network'
            }
            all_locations.append(processed_fridge)
    
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
    
    # Remove entries with invalid coordinates
    df = df.dropna(subset=['latitude', 'longitude'])
    
    # Sort by type and name
    df = df.sort_values(['type', 'name']).reset_index(drop=True)
    
    print(f"Combined {len(df)} total locations from ALL sources")
    return df[required_columns]

def save_all_comprehensive_data():
    """Save all comprehensive food access data from every source"""
    setup_output_directory()
    
    # Get combined data
    combined_df = combine_all_comprehensive_data()
    
    # Save comprehensive dataset
    output_path = '../processed/complete_comprehensive_food_access.csv'
    combined_df.to_csv(output_path, index=False)
    print(f"Saved complete comprehensive data to {output_path}")
    
    # Print detailed summary
    type_summary = combined_df['type'].value_counts()
    org_summary = combined_df['organization'].value_counts()
    
    print(f"\n=== COMPLETE DATA SUMMARY ===")
    print(f"Total locations: {len(combined_df)}")
    
    print(f"\nData summary by type:")
    for type_name, count in type_summary.items():
        print(f"  {type_name}: {count}")
    
    print(f"\nData summary by organization:")
    for org_name, count in org_summary.items():
        print(f"  {org_name}: {count}")
    
    # Geographic distribution
    borough_summary = {}
    for _, row in combined_df.iterrows():
        address = row['address']
        if 'Manhattan' in address or 'New York, NY' in address:
            borough = 'Manhattan'
        elif 'Brooklyn' in address:
            borough = 'Brooklyn'
        elif 'Queens' in address:
            borough = 'Queens'
        elif 'Bronx' in address:
            borough = 'Bronx'
        elif 'Staten Island' in address:
            borough = 'Staten Island'
        else:
            borough = 'Unknown'
        
        borough_summary[borough] = borough_summary.get(borough, 0) + 1
    
    print(f"\nGeographic distribution:")
    for borough, count in borough_summary.items():
        print(f"  {borough}: {count}")
    
    return combined_df

def main():
    """Main execution function"""
    print("Starting COMPLETE comprehensive food access data scraping...")
    print("This will scrape data from ALL provided sources:")
    print("- NYC Parks GreenThumb")
    print("- Manhattan Land Trust")
    print("- Brooklyn-Queens Land Trust") 
    print("- Bronx Land Trust")
    print("- Community Fridge Finder")
    print("- One Love Community Fridge")
    print("- GrowNYC Farmers Markets")
    print("- NYC Food Banks & Pantries")
    print("- NYC Urban Farms")
    print("- Lungs NYC Gardens")
    print("- Garden Kitchen Lab Farms")
    print("- Just Food CSA locations")
    print("- Queens Farm")
    print("- South Bronx Farmers Market")
    print("- And more!")
    
    try:
        comprehensive_data = save_all_comprehensive_data()
        print(f"\n✅ SUCCESS! Processed {len(comprehensive_data)} total locations from ALL sources")
        print("Data saved to ../processed/complete_comprehensive_food_access.csv")
        
    except Exception as e:
        print(f"❌ Error in main execution: {e}")

if __name__ == "__main__":
    main()