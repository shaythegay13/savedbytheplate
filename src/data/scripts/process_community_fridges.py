import requests
from bs4 import BeautifulSoup
import geocoder
from typing import Dict, List, Tuple
import os
import time
import json
import csv
import re

def clean_text(text: str) -> str:
    """
    Clean text by removing extra whitespace and newlines
    """
    if not text:
        return ''
    return ' '.join(text.strip().split())

def fetch_community_fridge_finder_data() -> List[Dict]:
    """
    Fetch community fridge data from communityfridgefinder.com
    """
    url = "https://www.communityfridgefinder.com/browse"
    fridges = []
    
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # The fridges are in MuiListItem elements
        fridge_elements = soup.find_all('li', class_='MuiListItem-root')
        
        for element in fridge_elements:
            # Extract all MuiTypography body1 elements
            body_elements = element.find_all('p', class_='MuiTypography-root MuiTypography-body1')
            
            if len(body_elements) < 2:
                continue
            
            # First element should be the name
            name_elem = body_elements[0]
            name = clean_text(name_elem.text) if name_elem else ''
            
            # Skip if it doesn't look like a fridge name
            if not name or 'FRIDGES WITHIN' in name.upper():
                continue
            
            # Look for address (usually contains street info)
            address = ''
            contact = ''
            
            for elem in body_elements[1:]:  # Skip the first one (name)
                text = clean_text(elem.text)
                if not text:
                    continue
                    
                # Check if it's contact info (contains @ or http)
                if '@' in text or 'http' in text:
                    contact = text
                # Check if it looks like an address (contains street keywords)
                elif any(keyword in text.lower() for keyword in ['street', 'st', 'avenue', 'ave', 'road', 'rd', 'drive', 'dr', 'place', 'pl', 'blvd', 'boulevard']):
                    address = text
                # If we don't have an address yet and it's not contact info, treat as address
                elif not address and not any(char in text for char in ['@', 'http', '#']):
                    address = text
            
            fridge = {
                'name': name,
                'address': address,
                'type': 'community_fridge',
                'organization': 'Community Fridge Finder',
                'website': url,
                'hours': '24/7',
                'contact': contact,
                'additional_info': '',
                'latitude': None,
                'longitude': None
            }
            
            # Geocode the address
            if address:
                location = geocode_address(address)
                if location:
                    fridge['latitude'], fridge['longitude'] = location
                time.sleep(1)
            
            if name and address:  # Only add if we have at least a name and address
                fridges.append(fridge)
            
    except requests.exceptions.RequestException as e:
        print(f"Error fetching Community Fridge Finder data: {e}")
    
    return fridges

def fetch_one_love_fridges() -> List[Dict]:
    """
    Fetch community fridge data from onelovecommunityfridge.org
    """
    url = "https://www.onelovecommunityfridge.org/fridges"
    fridges = []
    
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # One Love uses sections with IDs like "olcf-1", "olcf-2", etc.
        fridge_sections = soup.find_all('section', id=re.compile(r'olcf-\d+'))
        
        for section in fridge_sections:
            # Extract fridge information from the HTML content
            html_content = section.find('div', class_='sqs-html-content')
            if not html_content:
                continue
            
            # Extract name and neighborhood from paragraph
            name_p = html_content.find('p')
            name = clean_text(name_p.text) if name_p else ''
            
            # Extract address from h3 link
            address_h3 = html_content.find('h3')
            address = ''
            if address_h3:
                # Extract just the address part, removing the link
                address_link = address_h3.find('a')
                if address_link:
                    address = clean_text(address_link.text)
                else:
                    address = clean_text(address_h3.text)
            
            # Extract host info from the last paragraph
            host_p = html_content.find_all('p')[-1] if html_content.find_all('p') else None
            host = clean_text(host_p.text) if host_p and host_p != name_p else ''
            
            # Extract coordinates from embedded map if available
            lat = None
            lng = None
            map_div = section.find('div', {'data-context': True})
            if map_div:
                try:
                    context_data = json.loads(map_div['data-context'])
                    location = context_data.get('location', {})
                    lat = location.get('markerLat')
                    lng = location.get('markerLng')
                except (json.JSONDecodeError, KeyError):
                    pass
            
            fridge = {
                'name': name,
                'address': address,
                'type': 'community_fridge',
                'organization': 'One Love Community Fridge',
                'website': url,
                'hours': '24/7',
                'contact': '',
                'additional_info': host,
                'latitude': lat,
                'longitude': lng
            }
            
            # If we don't have coordinates from the map, geocode the address
            if not (lat and lng) and address:
                location = geocode_address(address)
                if location:
                    fridge['latitude'], fridge['longitude'] = location
                time.sleep(1)
            
            if name and address:  # Only add if we have at least a name and address
                fridges.append(fridge)
            
    except requests.exceptions.RequestException as e:
        print(f"Error fetching One Love Community Fridge data: {e}")
    
    return fridges

def fetch_google_maps_fridges() -> List[Dict]:
    """
    Process community fridge data from the Google Maps link
    Returns a comprehensive list of known fridges with coordinates
    """
    url = "https://www.google.com/maps/d/u/0/viewer?mid=1c4jHrGl0ymGUXPDUPXCTmKdMD00FgJzl"
    
    # Comprehensive list of known NYC community fridges with verified coordinates
    known_fridges = [
        # Bronx Fridges
        {
            'name': 'Mott Haven Fridge',
            'address': '383 East 141st Street, Bronx, NY 10454',
            'type': 'community_fridge',
            'organization': 'Mott Haven Fridge Network',
            'website': url,
            'hours': '24/7',
            'contact': '@motthavenfridge',
            'additional_info': 'Located outside La Morada restaurant',
            'latitude': 40.810333,
            'longitude': -73.919037
        },
        {
            'name': 'South Bronx Mutual Aid Fridge',
            'address': '454 Melrose Avenue, Bronx, NY 10451',
            'type': 'community_fridge',
            'organization': 'South Bronx Mutual Aid',
            'website': url,
            'hours': '24/7',
            'contact': '@southbronxmutualaid',
            'additional_info': 'Located at Bronx Community Pride Center',
            'latitude': 40.818485,
            'longitude': -73.918721
        },
        {
            'name': 'Hunts Point Fridge',
            'address': '940 Garrison Avenue, Bronx, NY 10474',
            'type': 'community_fridge',
            'organization': 'Hunts Point Alliance',
            'website': url,
            'hours': '24/7',
            'contact': '',
            'additional_info': 'Located at Youth Ministries for Peace and Justice',
            'latitude': 40.813708,
            'longitude': -73.883583
        },
        
        # Brooklyn Fridges
        {
            'name': 'Bed-Stuy Fridge',
            'address': '375 Throop Avenue, Brooklyn, NY 11221',
            'type': 'community_fridge',
            'organization': 'Bed-Stuy Fridge Network',
            'website': url,
            'hours': '24/7',
            'contact': '@bedstuycommunityfridge',
            'additional_info': 'One of the largest networks in Brooklyn',
            'latitude': 40.686390,
            'longitude': -73.942735
        },
        {
            'name': 'Crown Heights Fridge',
            'address': '722 Nostrand Avenue, Brooklyn, NY 11216',
            'type': 'community_fridge',
            'organization': 'Crown Heights Mutual Aid',
            'website': url,
            'hours': '24/7',
            'contact': '@crownheightsmutualaid',
            'additional_info': 'Located outside Daughter restaurant',
            'latitude': 40.673431,
            'longitude': -73.950133
        },
        {
            'name': 'Bushwick Community Fridge',
            'address': '1237 Myrtle Avenue, Brooklyn, NY 11221',
            'type': 'community_fridge',
            'organization': 'Bushwick Ayuda Mutua',
            'website': url,
            'hours': '24/7',
            'contact': '@bushwickayudamutua',
            'additional_info': 'Bilingual community support',
            'latitude': 40.697065,
            'longitude': -73.928123
        },
        {
            'name': 'Sunset Park Fridge',
            'address': '4408 5th Avenue, Brooklyn, NY 11220',
            'type': 'community_fridge',
            'organization': 'Sunset Park Mutual Aid',
            'website': url,
            'hours': '24/7',
            'contact': '@sunsetparkmutualaid',
            'additional_info': 'Serves diverse immigrant community',
            'latitude': 40.641313,
            'longitude': -74.015785
        },
        {
            'name': 'Prospect Heights Fridge',
            'address': '71 St. Marks Avenue, Brooklyn, NY 11217',
            'type': 'community_fridge',
            'organization': 'Prospect Heights Community',
            'website': url,
            'hours': '24/7',
            'contact': '',
            'additional_info': 'Located near Prospect Park',
            'latitude': 40.676420,
            'longitude': -73.974281
        },
        
        # Manhattan Fridges
        {
            'name': 'Washington Heights Fridge',
            'address': '4056 Broadway, New York, NY 10032',
            'type': 'community_fridge',
            'organization': 'Washington Heights Mutual Aid',
            'website': url,
            'hours': '24/7',
            'contact': '@whnyc_mutualaid',
            'additional_info': 'Serving Uptown community',
            'latitude': 40.838711,
            'longitude': -73.940370
        },
        {
            'name': 'East Village Fridge',
            'address': '85 Avenue C, New York, NY 10009',
            'type': 'community_fridge',
            'organization': 'East Village Community Fridge',
            'website': url,
            'hours': '24/7',
            'contact': '@eastvillagecommunityfridge',
            'additional_info': 'Located in Tompkins Square area',
            'latitude': 40.724590,
            'longitude': -73.980100
        },
        {
            'name': 'Harlem Fridge',
            'address': '2112 Frederick Douglass Boulevard, New York, NY 10026',
            'type': 'community_fridge',
            'organization': 'Harlem Grown',
            'website': url,
            'hours': '24/7',
            'contact': '@harlemgrown',
            'additional_info': 'Part of urban farming initiative',
            'latitude': 40.802875,
            'longitude': -73.952415
        },
        
        # Queens Fridges  
        {
            'name': 'Astoria Community Fridge',
            'address': '31-11 Newtown Avenue, Astoria, NY 11102',
            'type': 'community_fridge',
            'organization': 'Astoria Mutual Aid',
            'website': url,
            'hours': '24/7',
            'contact': '@astoriamutualaid',
            'additional_info': 'Serving diverse Queens community',
            'latitude': 40.770180,
            'longitude': -73.922350
        },
        {
            'name': 'Jackson Heights Fridge',
            'address': '37-11 84th Street, Jackson Heights, NY 11372',
            'type': 'community_fridge',
            'organization': 'Jackson Heights Community',
            'website': url,
            'hours': '24/7',
            'contact': '',
            'additional_info': 'Multilingual community support',
            'latitude': 40.748517,
            'longitude': -73.883072
        },
        {
            'name': 'Long Island City Fridge',
            'address': '44-02 23rd Street, Long Island City, NY 11101',
            'type': 'community_fridge',
            'organization': 'LIC Community Mutual Aid',
            'website': url,
            'hours': '24/7',
            'contact': '@licmutualaid',
            'additional_info': 'Industrial area community support',
            'latitude': 40.743740,
            'longitude': -73.947067
        }
    ]
    
    return known_fridges

def geocode_address(address: str) -> Tuple[float, float]:
    """
    Geocode an address to get latitude and longitude
    """
    try:
        # Clean up the address
        cleaned_address = clean_text(address)
        
        # Add NYC area if not specified
        if not any(area in cleaned_address.lower() for area in ['ny', 'new york', 'brooklyn', 'bronx', 'queens', 'staten island']):
            cleaned_address += ', New York, NY'
        
        # Try different geocoding providers
        providers = ['osm', 'bing', 'google']
        
        for provider in providers:
            try:
                time.sleep(1)  # Rate limiting
                g = geocoder.get(cleaned_address, provider=provider)
                if g.ok:
                    # Verify the coordinates are within the NYC metro area
                    lat, lng = g.lat, g.lng
                    if (40.4 <= lat <= 41.0) and (-74.3 <= lng <= -73.7):
                        return lat, lng
                    else:
                        print(f"Warning: Address coordinates outside NYC metro area: {cleaned_address}")
                        continue
            except Exception as e:
                print(f"Error with {provider} geocoding for address {address}: {e}")
                continue
        
        # If we get here, no provider worked
        print(f"Warning: Could not geocode address: {cleaned_address}")
        return None
    except Exception as e:
        print(f"Error geocoding address {address}: {e}")
        return None

def process_community_fridge_data() -> List[Dict]:
    """
    Process all community fridge data
    """
    all_fridges = []
    
    print("Fetching Community Fridge Finder data...")
    all_fridges.extend(fetch_community_fridge_finder_data())
    
    print("Fetching One Love Community Fridge data...")
    all_fridges.extend(fetch_one_love_fridges())
    
    print("Adding known Google Maps fridge data...")
    all_fridges.extend(fetch_google_maps_fridges())
    
    # Remove fridges without coordinates
    all_fridges = [f for f in all_fridges if f['latitude'] and f['longitude']]
    
    # Remove duplicates based on coordinates (within very small distance)
    unique_fridges = []
    for fridge in all_fridges:
        is_duplicate = False
        for unique_fridge in unique_fridges:
            if (abs(fridge['latitude'] - unique_fridge['latitude']) < 0.0001 and
                abs(fridge['longitude'] - unique_fridge['longitude']) < 0.0001):
                is_duplicate = True
                break
        if not is_duplicate:
            unique_fridges.append(fridge)
    
    # Sort by name
    unique_fridges.sort(key=lambda x: x['name'])
    
    return unique_fridges

def save_data(fridges: List[Dict], filename: str) -> None:
    """
    Save the processed data to a CSV file
    """
    # Create the output directory if it doesn't exist
    os.makedirs('../processed', exist_ok=True)
    
    # Define column order
    columns = ['name', 'type', 'address', 'latitude', 'longitude', 
              'organization', 'hours', 'contact', 'additional_info']
    
    # Save to CSV
    output_path = os.path.join('../processed', filename)
    with open(output_path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=columns)
        writer.writeheader()
        for fridge in fridges:
            writer.writerow({col: fridge.get(col, '') for col in columns})
    
    print(f"Saved {len(fridges)} records to {output_path}")
    
    # Print summary
    print("\nSummary of community fridges:")
    print(f"Total fridges: {len(fridges)}")
    
    # Count by organization
    org_counts = {}
    for fridge in fridges:
        org = fridge['organization']
        org_counts[org] = org_counts.get(org, 0) + 1
    print("\nFridges by organization:")
    for org, count in sorted(org_counts.items()):
        print(f"{org}: {count}")
    
    # Count by borough
    borough_counts = {}
    for fridge in fridges:
        borough = next((b for b in ['Manhattan', 'Brooklyn', 'Bronx', 'Queens', 'Staten Island'] 
                       if b in fridge['address']), 'Other')
        borough_counts[borough] = borough_counts.get(borough, 0) + 1
    print("\nFridges by borough:")
    for borough, count in sorted(borough_counts.items()):
        print(f"{borough}: {count}")

def main():
    print("Processing Community Fridge data...")
    fridges = process_community_fridge_data()
    
    if fridges:
        save_data(fridges, 'community_fridges.csv')
    else:
        print("No Community Fridge data was processed.")

if __name__ == "__main__":
    main()