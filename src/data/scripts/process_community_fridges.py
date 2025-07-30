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
        
        # The fridges are in a list/grid layout
        fridge_elements = soup.find_all('div', class_='listing-item')
        
        for element in fridge_elements:
            # Extract name from the heading
            name_elem = element.find(['h3', 'h4'], class_='listing-title')
            name = clean_text(name_elem.text) if name_elem else ''
            
            # Extract address from the location info
            address_elem = element.find('div', class_='listing-address')
            address = clean_text(address_elem.text) if address_elem else ''
            
            # Extract additional info
            info_elem = element.find('div', class_='listing-description')
            additional_info = clean_text(info_elem.text) if info_elem else ''
            
            # Extract contact if available
            contact_elem = element.find('div', class_='listing-contact')
            contact = clean_text(contact_elem.text) if contact_elem else ''
            
            # Extract hours if available
            hours_elem = element.find('div', class_='listing-hours')
            hours = clean_text(hours_elem.text) if hours_elem else '24/7'
            
            # Try to get coordinates directly if available
            lat = element.get('data-lat')
            lng = element.get('data-lng')
            
            fridge = {
                'name': name,
                'address': address,
                'type': 'community_fridge',
                'organization': 'Community Fridge Finder',
                'website': url,
                'hours': hours,
                'contact': contact,
                'additional_info': additional_info,
                'latitude': None,
                'longitude': None
            }
            
            if lat and lng:
                try:
                    fridge['latitude'] = float(lat)
                    fridge['longitude'] = float(lng)
                except (ValueError, TypeError):
                    pass
            
            if not (fridge['latitude'] and fridge['longitude']) and fridge['address']:
                location = geocode_address(fridge['address'])
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
        
        # One Love uses sections for each fridge
        fridge_elements = soup.find_all('section', class_='fridge-section')
        
        for element in fridge_elements:
            # Extract name from the heading
            name_elem = element.find(['h2', 'h3'], class_='fridge-name')
            name = clean_text(name_elem.text) if name_elem else ''
            
            # Extract address
            address_elem = element.find('div', class_='fridge-address')
            address = clean_text(address_elem.text) if address_elem else ''
            
            # Extract status/info
            status_elem = element.find('div', class_='fridge-status')
            status = clean_text(status_elem.text) if status_elem else ''
            
            # Extract contact info
            contact_elem = element.find('div', class_='fridge-contact')
            contact = clean_text(contact_elem.text) if contact_elem else ''
            
            # Try to get coordinates from data attributes
            lat = element.get('data-latitude')
            lng = element.get('data-longitude')
            
            fridge = {
                'name': name,
                'address': address,
                'type': 'community_fridge',
                'organization': 'One Love Community Fridge',
                'website': url,
                'hours': '24/7',  # Most One Love fridges are 24/7
                'contact': contact,
                'additional_info': status,
                'latitude': None,
                'longitude': None
            }
            
            if lat and lng:
                try:
                    fridge['latitude'] = float(lat)
                    fridge['longitude'] = float(lng)
                except (ValueError, TypeError):
                    pass
            
            if not (fridge['latitude'] and fridge['longitude']) and fridge['address']:
                location = geocode_address(fridge['address'])
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
    For now, returns a list of known fridges with hardcoded coordinates
    """
    url = "https://www.google.com/maps/d/u/0/viewer?mid=1c4jHrGl0ymGUXPDUPXCTmKdMD00FgJzl"
    
    # Known fridge locations with coordinates
    known_fridges = [
        {
            'name': 'Mott Haven Fridge',
            'address': '383 East 141st Street, Bronx, NY 10454',
            'type': 'community_fridge',
            'organization': 'Mott Haven Fridge Network',
            'website': url,
            'hours': '24/7',
            'contact': '',
            'additional_info': 'Located outside La Morada restaurant',
            'latitude': 40.810333,
            'longitude': -73.919037
        },
        {
            'name': 'Bed-Stuy Fridge',
            'address': '375 Throop Avenue, Brooklyn, NY 11221',
            'type': 'community_fridge',
            'organization': 'Bed-Stuy Fridge Network',
            'website': url,
            'hours': '24/7',
            'contact': '',
            'additional_info': '',
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
            'contact': '',
            'additional_info': 'Located outside Daughter',
            'latitude': 40.673431,
            'longitude': -73.950133
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