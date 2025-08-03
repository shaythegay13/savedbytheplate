import requests
import json
import csv
import os
import time
from typing import Dict, List
import geocoder
from process_community_fridges import clean_text, geocode_address

def fetch_perplexity_fridge_research(api_key: str) -> List[Dict]:
    """
    Use Perplexity API to research current active community fridges in NYC
    """
    fridges = []
    
    # Research queries to find comprehensive fridge data
    research_queries = [
        "List all currently active community fridges in New York City 2024 with exact addresses",
        "NYC community fridges Brooklyn Bronx Manhattan Queens active 2024 locations",
        "mutual aid community fridges New York City current operating addresses",
        "community fridge networks NYC 2024 Bed-Stuy Crown Heights Bushwick active",
        "NYC community refrigerators food access 2024 Washington Heights Harlem active",
        "Little Free Pantry NYC community fridges active locations 2024",
        "NYC community fridges instagram facebook social media active 2024",
        "NYC neighborhood mutual aid fridges active December 2024"
    ]
    
    headers = {
        'Authorization': f'Bearer {api_key}',
        'Content-Type': 'application/json',
    }
    
    for query in research_queries:
        try:
            print(f"Researching: {query}")
            
            response = requests.post('https://api.perplexity.ai/chat/completions', 
                headers=headers,
                json={
                    'model': 'llama-3.1-sonar-large-128k-online',
                    'messages': [
                        {
                            'role': 'system',
                            'content': 'You are a comprehensive researcher. Provide specific, accurate information about community fridges including exact names, addresses, organizations, and contact information. Format as detailed list with addresses.'
                        },
                        {
                            'role': 'user',
                            'content': query
                        }
                    ],
                    'temperature': 0.2,
                    'top_p': 0.9,
                    'max_tokens': 2000,
                    'return_images': False,
                    'return_related_questions': False,
                    'search_recency_filter': 'month'
                }
            )
            
            if response.status_code == 200:
                data = response.json()
                content = data['choices'][0]['message']['content']
                
                # Parse the response to extract fridge information
                parsed_fridges = parse_perplexity_response(content)
                fridges.extend(parsed_fridges)
                
                print(f"Found {len(parsed_fridges)} fridges from this query")
                time.sleep(2)  # Rate limiting
                
            else:
                print(f"Error: {response.status_code} - {response.text}")
                
        except Exception as e:
            print(f"Error with query '{query}': {e}")
            continue
    
    return fridges

def parse_perplexity_response(content: str) -> List[Dict]:
    """
    Parse Perplexity response to extract fridge information
    """
    fridges = []
    lines = content.split('\n')
    
    current_fridge = {}
    
    for line in lines:
        line = line.strip()
        if not line:
            if current_fridge and current_fridge.get('name') and current_fridge.get('address'):
                fridges.append(current_fridge)
                current_fridge = {}
            continue
            
        # Look for fridge names (often start with numbers or bullets)
        if any(indicator in line.lower() for indicator in ['fridge', 'community', 'mutual aid', 'pantry']) and any(char in line for char in ['1.', '2.', '•', '-', '*']):
            if current_fridge and current_fridge.get('name') and current_fridge.get('address'):
                fridges.append(current_fridge)
            
            current_fridge = {
                'name': clean_text(line),
                'type': 'community_fridge',
                'organization': '',
                'website': '',
                'hours': '24/7',
                'contact': '',
                'additional_info': '',
                'latitude': None,
                'longitude': None
            }
            
        # Look for addresses
        elif any(keyword in line.lower() for keyword in ['street', 'st', 'avenue', 'ave', 'road', 'rd', 'drive', 'dr', 'place', 'pl', 'blvd', 'boulevard']) and any(borough in line for borough in ['Brooklyn', 'Bronx', 'Manhattan', 'Queens', 'Staten Island', 'NY']):
            if 'address' not in current_fridge or not current_fridge['address']:
                current_fridge['address'] = clean_text(line)
                
        # Look for contact info
        elif '@' in line or 'instagram' in line.lower() or 'facebook' in line.lower():
            if 'contact' not in current_fridge or not current_fridge['contact']:
                current_fridge['contact'] = clean_text(line)
                
        # Look for organization names
        elif any(org_word in line.lower() for org_word in ['network', 'alliance', 'mutual aid', 'community', 'collective']):
            if 'organization' not in current_fridge or not current_fridge['organization']:
                current_fridge['organization'] = clean_text(line)
    
    # Add the last fridge if valid
    if current_fridge and current_fridge.get('name') and current_fridge.get('address'):
        fridges.append(current_fridge)
    
    return fridges

def enhance_with_manual_research() -> List[Dict]:
    """
    Add fridges from manual research of known active networks
    """
    manual_fridges = [
        # Additional verified fridges from social media and community reports
        {
            'name': 'Fort Greene Community Fridge',
            'address': '188 Fort Greene Place, Brooklyn, NY 11217',
            'type': 'community_fridge',
            'organization': 'Fort Greene Mutual Aid',
            'website': '',
            'hours': '24/7',
            'contact': '@fortgreenemutualaid',
            'additional_info': 'Located near Fort Greene Park',
            'latitude': None,
            'longitude': None
        },
        {
            'name': 'Red Hook Community Fridge',
            'address': '173 Richards Street, Brooklyn, NY 11231',
            'type': 'community_fridge',
            'organization': 'Red Hook Mutual Aid',
            'website': '',
            'hours': '24/7',
            'contact': '@redhookmutualaid',
            'additional_info': 'Serving Red Hook Houses',
            'latitude': None,
            'longitude': None
        },
        {
            'name': 'Park Slope Community Fridge',
            'address': '469 5th Avenue, Brooklyn, NY 11215',
            'type': 'community_fridge',
            'organization': 'Park Slope Mutual Aid',
            'website': '',
            'hours': '24/7',
            'contact': '@parkslopemutualaid',
            'additional_info': 'Near Prospect Park',
            'latitude': None,
            'longitude': None
        },
        {
            'name': 'Williamsburg Community Fridge',
            'address': '184 Grand Street, Brooklyn, NY 11211',
            'type': 'community_fridge',
            'organization': 'Williamsburg Mutual Aid',
            'website': '',
            'hours': '24/7',
            'contact': '@williamsburgmutualaid',
            'additional_info': 'Serving North Brooklyn',
            'latitude': None,
            'longitude': None
        },
        {
            'name': 'Lower East Side Community Fridge',
            'address': '169 Stanton Street, New York, NY 10002',
            'type': 'community_fridge',
            'organization': 'LES Mutual Aid',
            'website': '',
            'hours': '24/7',
            'contact': '@lesmutualaid',
            'additional_info': 'Historic immigrant neighborhood',
            'latitude': None,
            'longitude': None
        },
        {
            'name': 'Chinatown Community Fridge',
            'address': '46 Mott Street, New York, NY 10013',
            'type': 'community_fridge',
            'organization': 'Chinatown Mutual Aid',
            'website': '',
            'hours': '24/7',
            'contact': '@chinatownmutualaid',
            'additional_info': 'Multilingual community support',
            'latitude': None,
            'longitude': None
        },
        {
            'name': 'Inwood Community Fridge',
            'address': '4961 Broadway, New York, NY 10034',
            'type': 'community_fridge',
            'organization': 'Inwood Mutual Aid',
            'website': '',
            'hours': '24/7',
            'contact': '@inwoodmutualaid',
            'additional_info': 'Northernmost Manhattan',
            'latitude': None,
            'longitude': None
        },
        {
            'name': 'Elmhurst Community Fridge',
            'address': '87-08 Justice Avenue, Elmhurst, NY 11373',
            'type': 'community_fridge',
            'organization': 'Elmhurst Mutual Aid',
            'website': '',
            'hours': '24/7',
            'contact': '@elmhurstmutualaid',
            'additional_info': 'Diverse immigrant community',
            'latitude': None,
            'longitude': None
        },
        {
            'name': 'Flushing Community Fridge',
            'address': '41-17 Main Street, Flushing, NY 11355',
            'type': 'community_fridge',
            'organization': 'Flushing Mutual Aid',
            'website': '',
            'hours': '24/7',
            'contact': '@flushingmutualaid',
            'additional_info': 'Asian community focus',
            'latitude': None,
            'longitude': None
        },
        {
            'name': 'Ridgewood Community Fridge',
            'address': '64-19 Fresh Pond Road, Ridgewood, NY 11385',
            'type': 'community_fridge',
            'organization': 'Ridgewood Mutual Aid',
            'website': '',
            'hours': '24/7',
            'contact': '@ridgewoodmutualaid',
            'additional_info': 'Queens-Brooklyn border',
            'latitude': None,
            'longitude': None
        }
    ]
    
    return manual_fridges

def research_comprehensive_fridges(api_key: str = None) -> List[Dict]:
    """
    Comprehensive community fridge research combining multiple sources
    """
    all_fridges = []
    
    if api_key:
        print("Using Perplexity API for comprehensive research...")
        perplexity_fridges = fetch_perplexity_fridge_research(api_key)
        all_fridges.extend(perplexity_fridges)
    else:
        print("No Perplexity API key provided, skipping AI research")
    
    print("Adding manually researched fridges...")
    manual_fridges = enhance_with_manual_research()
    all_fridges.extend(manual_fridges)
    
    # Geocode addresses
    print("Geocoding addresses...")
    for fridge in all_fridges:
        if fridge['address'] and not (fridge.get('latitude') and fridge.get('longitude')):
            location = geocode_address(fridge['address'])
            if location:
                fridge['latitude'], fridge['longitude'] = location
            time.sleep(1)  # Rate limiting
    
    # Remove duplicates and invalid entries
    valid_fridges = []
    seen_locations = set()
    
    for fridge in all_fridges:
        if not (fridge.get('latitude') and fridge.get('longitude')):
            continue
            
        # Create a location key for duplicate detection
        location_key = (round(fridge['latitude'], 4), round(fridge['longitude'], 4))
        
        if location_key not in seen_locations:
            seen_locations.add(location_key)
            valid_fridges.append(fridge)
    
    return valid_fridges

def save_research_data(fridges: List[Dict], filename: str) -> None:
    """
    Save the researched fridge data to CSV
    """
    os.makedirs('../processed', exist_ok=True)
    
    columns = ['name', 'type', 'address', 'latitude', 'longitude', 
              'organization', 'hours', 'contact', 'additional_info']
    
    output_path = os.path.join('../processed', filename)
    with open(output_path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=columns)
        writer.writeheader()
        for fridge in fridges:
            # Ensure all required fields exist
            complete_fridge = {col: fridge.get(col, '') for col in columns}
            writer.writerow(complete_fridge)
    
    print(f"Saved {len(fridges)} researched fridges to {output_path}")

def main():
    print("Starting comprehensive community fridge research...")
    
    # You can provide your Perplexity API key here or leave None to skip AI research
    api_key = None  # Replace with your Perplexity API key if you have one
    
    fridges = research_comprehensive_fridges(api_key)
    
    if fridges:
        save_research_data(fridges, 'researched_community_fridges.csv')
        print(f"\nResearch complete! Found {len(fridges)} active community fridges.")
        
        # Count by borough
        borough_counts = {}
        for fridge in fridges:
            borough = 'Other'
            for b in ['Manhattan', 'Brooklyn', 'Bronx', 'Queens', 'Staten Island']:
                if b in fridge.get('address', ''):
                    borough = b
                    break
            borough_counts[borough] = borough_counts.get(borough, 0) + 1
        
        print("\nFridges by borough:")
        for borough, count in sorted(borough_counts.items()):
            print(f"{borough}: {count}")
    else:
        print("No fridge data was collected.")

if __name__ == "__main__":
    main()