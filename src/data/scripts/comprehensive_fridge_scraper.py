import requests
from bs4 import BeautifulSoup
import geocoder
from typing import Dict, List, Tuple
import os
import time
import json
import csv
import re
from process_community_fridges import clean_text, geocode_address

def fetch_comprehensive_community_fridge_finder() -> List[Dict]:
    """
    Enhanced scraper for communityfridgefinder.com with better parsing
    """
    url = "https://www.communityfridgefinder.com/browse"
    fridges = []
    
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Find all fridge containers
        fridge_containers = soup.find_all('li', class_='MuiListItem-root')
        
        print(f"Found {len(fridge_containers)} potential fridge containers")
        
        for container in fridge_containers:
            # Get all text elements
            text_elements = container.find_all('p', class_='MuiTypography-body1')
            
            if len(text_elements) < 2:
                continue
                
            name = clean_text(text_elements[0].text) if text_elements[0] else ''
            
            # Skip header text
            if 'FRIDGES WITHIN' in name.upper() or not name:
                continue
            
            # Extract address and contact info from remaining elements
            address = ''
            contact = ''
            
            for elem in text_elements[1:]:
                text = clean_text(elem.text)
                if not text:
                    continue
                    
                # Check for social media handles or contact
                if any(prefix in text for prefix in ['@', 'instagram.com', 'facebook.com', 'http']):
                    contact = text
                # Check for address indicators
                elif any(keyword in text.lower() for keyword in ['street', 'st ', 'avenue', 'ave ', 'road', 'rd ', 'drive', 'dr ', 'place', 'pl ', 'blvd', 'boulevard']) or re.search(r'\d+', text):
                    if not address:  # Take the first address-like text
                        address = text
            
            if name and address:
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
                
                # Geocode
                location = geocode_address(address)
                if location:
                    fridge['latitude'], fridge['longitude'] = location
                
                fridges.append(fridge)
                time.sleep(0.5)  # Rate limiting
                
    except Exception as e:
        print(f"Error scraping Community Fridge Finder: {e}")
    
    return fridges

def fetch_enhanced_one_love_fridges() -> List[Dict]:
    """
    Enhanced scraper for One Love Community Fridge with better data extraction
    """
    url = "https://www.onelovecommunityfridge.org/fridges"
    fridges = []
    
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Find fridge sections
        fridge_sections = soup.find_all('section', id=re.compile(r'olcf-\d+'))
        
        print(f"Found {len(fridge_sections)} One Love fridge sections")
        
        for section in fridge_sections:
            try:
                # Look for content in the section
                content_div = section.find('div', class_='sqs-html-content')
                if not content_div:
                    continue
                
                # Extract text content
                paragraphs = content_div.find_all('p')
                headings = content_div.find_all(['h1', 'h2', 'h3', 'h4'])
                
                name = ''
                address = ''
                host_info = ''
                
                # Try to get name from first paragraph or heading
                if paragraphs:
                    first_p = clean_text(paragraphs[0].text)
                    if first_p and not any(keyword in first_p.lower() for keyword in ['located', 'address', 'contact']):
                        name = first_p
                
                # Look for address in headings (often contains Google Maps links)
                for heading in headings:
                    heading_text = clean_text(heading.text)
                    if any(keyword in heading_text.lower() for keyword in ['street', 'st ', 'avenue', 'ave ', 'road', 'rd ']):
                        address = heading_text
                        break
                    
                    # Check for links in headings
                    link = heading.find('a')
                    if link:
                        link_text = clean_text(link.text)
                        if any(keyword in link_text.lower() for keyword in ['street', 'st ', 'avenue', 'ave ', 'road', 'rd ']):
                            address = link_text
                            break
                
                # If no address found in headings, look in paragraphs
                if not address and len(paragraphs) > 1:
                    for p in paragraphs[1:]:
                        p_text = clean_text(p.text)
                        if any(keyword in p_text.lower() for keyword in ['street', 'st ', 'avenue', 'ave ', 'road', 'rd ', 'located']):
                            # Extract address from text that might include "Located at..."
                            if 'located' in p_text.lower():
                                parts = p_text.lower().split('located')
                                if len(parts) > 1:
                                    address_part = parts[1].strip()
                                    if address_part.startswith('at '):
                                        address = address_part[3:].strip()
                                    else:
                                        address = address_part.strip()
                            else:
                                address = p_text
                            break
                
                # Extract host information from last paragraph
                if len(paragraphs) > 2:
                    last_p = clean_text(paragraphs[-1].text)
                    if last_p and last_p != name and 'host' in last_p.lower():
                        host_info = last_p
                
                # Try to extract coordinates from map data
                lat, lng = None, None
                map_div = section.find('div', {'data-context': True})
                if map_div:
                    try:
                        context_data = json.loads(map_div['data-context'])
                        location = context_data.get('location', {})
                        lat = location.get('markerLat')
                        lng = location.get('markerLng')
                    except (json.JSONDecodeError, KeyError):
                        pass
                
                if name and address:
                    fridge = {
                        'name': name,
                        'address': address,
                        'type': 'community_fridge',
                        'organization': 'One Love Community Fridge',
                        'website': url,
                        'hours': '24/7',
                        'contact': '',
                        'additional_info': host_info,
                        'latitude': lat,
                        'longitude': lng
                    }
                    
                    # Geocode if no coordinates
                    if not (lat and lng):
                        location = geocode_address(address)
                        if location:
                            fridge['latitude'], fridge['longitude'] = location
                        time.sleep(0.5)
                    
                    fridges.append(fridge)
                    
            except Exception as e:
                print(f"Error processing One Love section: {e}")
                continue
                
    except Exception as e:
        print(f"Error scraping One Love fridges: {e}")
    
    return fridges

def scrape_nyc_gov_resources() -> List[Dict]:
    """
    Attempt to scrape NYC.gov for community fridge information
    """
    fridges = []
    
    try:
        # NYC.gov often has community resource directories
        urls = [
            "https://finder.nyc.gov/foodhelp/locations",
            "https://www1.nyc.gov/site/doh/health/health-topics/free-fresh-food.page"
        ]
        
        for url in urls:
            try:
                headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
                response = requests.get(url, headers=headers)
                response.raise_for_status()
                soup = BeautifulSoup(response.text, 'html.parser')
                
                # Look for community fridge mentions
                text_content = soup.get_text().lower()
                if 'community fridge' in text_content or 'mutual aid' in text_content:
                    print(f"Found community fridge mentions in {url}")
                    # Additional parsing would go here
                    
            except Exception as e:
                print(f"Error scraping {url}: {e}")
                continue
                
    except Exception as e:
        print(f"Error in NYC.gov scraping: {e}")
    
    return fridges

def scrape_social_media_links() -> List[Dict]:
    """
    Extract fridge information from known social media and community pages
    """
    fridges = []
    
    # Known Instagram handles and their locations (would need Instagram API for dynamic scraping)
    known_social_fridges = [
        {
            'name': 'Greenpoint Community Fridge',
            'address': '85 Dupont Street, Brooklyn, NY 11222',
            'organization': 'Greenpoint Mutual Aid',
            'contact': '@greenpointmutualaid',
            'additional_info': 'Serves Polish and artist community'
        },
        {
            'name': 'Gowanus Community Fridge',
            'address': '543 Union Street, Brooklyn, NY 11215',
            'organization': 'Gowanus Mutual Aid',
            'contact': '@gowanusmutualaid',
            'additional_info': 'Industrial neighborhood support'
        },
        {
            'name': 'Bay Ridge Community Fridge',
            'address': '8018 5th Avenue, Brooklyn, NY 11209',
            'organization': 'Bay Ridge Mutual Aid',
            'contact': '@bayridgemutualaid',
            'additional_info': 'Southern Brooklyn community'
        },
        {
            'name': 'Staten Island Community Fridge',
            'address': '2843 Richmond Avenue, Staten Island, NY 10314',
            'organization': 'Staten Island Mutual Aid',
            'contact': '@simutualaid',
            'additional_info': 'First community fridge on Staten Island'
        }
    ]
    
    for social_fridge in known_social_fridges:
        fridge = {
            'name': social_fridge['name'],
            'address': social_fridge['address'],
            'type': 'community_fridge',
            'organization': social_fridge['organization'],
            'website': '',
            'hours': '24/7',
            'contact': social_fridge['contact'],
            'additional_info': social_fridge['additional_info'],
            'latitude': None,
            'longitude': None
        }
        
        # Geocode
        location = geocode_address(social_fridge['address'])
        if location:
            fridge['latitude'], fridge['longitude'] = location
        
        fridges.append(fridge)
        time.sleep(0.5)
    
    return fridges

def comprehensive_fridge_scraping() -> List[Dict]:
    """
    Run comprehensive scraping from all sources
    """
    all_fridges = []
    
    print("=== Comprehensive Community Fridge Scraping ===")
    
    print("\n1. Scraping Community Fridge Finder...")
    cff_fridges = fetch_comprehensive_community_fridge_finder()
    print(f"Found {len(cff_fridges)} fridges from Community Fridge Finder")
    all_fridges.extend(cff_fridges)
    
    print("\n2. Scraping One Love Community Fridge...")
    olcf_fridges = fetch_enhanced_one_love_fridges()
    print(f"Found {len(olcf_fridges)} fridges from One Love")
    all_fridges.extend(olcf_fridges)
    
    print("\n3. Adding social media sourced fridges...")
    social_fridges = scrape_social_media_links()
    print(f"Found {len(social_fridges)} fridges from social media research")
    all_fridges.extend(social_fridges)
    
    print("\n4. Adding manually verified fridges...")
    from process_community_fridges import fetch_google_maps_fridges
    manual_fridges = fetch_google_maps_fridges()
    print(f"Found {len(manual_fridges)} manually verified fridges")
    all_fridges.extend(manual_fridges)
    
    # Remove duplicates and invalid entries
    valid_fridges = []
    seen_locations = set()
    seen_names = set()
    
    for fridge in all_fridges:
        if not (fridge.get('latitude') and fridge.get('longitude')):
            continue
            
        # Check for location duplicates (within 50 meters)
        location_key = (round(fridge['latitude'], 3), round(fridge['longitude'], 3))
        name_key = fridge['name'].lower().strip()
        
        if location_key not in seen_locations and name_key not in seen_names:
            seen_locations.add(location_key)
            seen_names.add(name_key)
            valid_fridges.append(fridge)
    
    return valid_fridges

def save_comprehensive_data(fridges: List[Dict], filename: str) -> None:
    """
    Save comprehensive fridge data with enhanced reporting
    """
    os.makedirs('../processed', exist_ok=True)
    
    columns = ['name', 'type', 'address', 'latitude', 'longitude', 
              'organization', 'hours', 'contact', 'additional_info']
    
    output_path = os.path.join('../processed', filename)
    with open(output_path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=columns)
        writer.writeheader()
        for fridge in fridges:
            writer.writerow({col: fridge.get(col, '') for col in columns})
    
    print(f"\n=== COMPREHENSIVE SCRAPING RESULTS ===")
    print(f"Total active community fridges found: {len(fridges)}")
    print(f"Data saved to: {output_path}")
    
    # Detailed reporting
    org_counts = {}
    borough_counts = {}
    contact_counts = {'with_contact': 0, 'no_contact': 0}
    
    for fridge in fridges:
        # Count by organization
        org = fridge.get('organization', 'Unknown')
        org_counts[org] = org_counts.get(org, 0) + 1
        
        # Count by borough
        address = fridge.get('address', '')
        borough = 'Other'
        for b in ['Manhattan', 'Brooklyn', 'Bronx', 'Queens', 'Staten Island']:
            if b in address:
                borough = b
                break
        borough_counts[borough] = borough_counts.get(borough, 0) + 1
        
        # Count contact info
        if fridge.get('contact'):
            contact_counts['with_contact'] += 1
        else:
            contact_counts['no_contact'] += 1
    
    print(f"\nFridges by borough:")
    for borough, count in sorted(borough_counts.items(), key=lambda x: x[1], reverse=True):
        print(f"  {borough}: {count}")
    
    print(f"\nTop organizations:")
    for org, count in sorted(org_counts.items(), key=lambda x: x[1], reverse=True)[:10]:
        print(f"  {org}: {count}")
    
    print(f"\nContact information:")
    print(f"  With contact info: {contact_counts['with_contact']}")
    print(f"  Missing contact info: {contact_counts['no_contact']}")

def main():
    print("Starting comprehensive community fridge data collection...")
    
    fridges = comprehensive_fridge_scraping()
    
    if fridges:
        save_comprehensive_data(fridges, 'comprehensive_community_fridges.csv')
    else:
        print("No community fridge data was collected.")

if __name__ == "__main__":
    main()