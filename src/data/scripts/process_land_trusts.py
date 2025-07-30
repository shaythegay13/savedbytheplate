import pandas as pd
import requests
from bs4 import BeautifulSoup
import geocoder
from typing import Dict, List, Tuple
import os
import time

def fetch_bqlt_gardens() -> List[Dict]:
    """
    Fetch Brooklyn-Queens Land Trust gardens
    """
    url = "https://bqlt.org/our-gardens"
    gardens = []
    
    try:
        response = requests.get(url)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Find all garden entries (adjust selectors based on actual HTML structure)
        garden_elements = soup.find_all('div', class_='garden-entry')  # Adjust class name
        
        for element in garden_elements:
            garden = {
                'name': element.find('h3').text.strip() if element.find('h3') else '',
                'address': element.find('address').text.strip() if element.find('address') else '',
                'type': 'community_garden',
                'organization': 'Brooklyn-Queens Land Trust',
                'website': url
            }
            
            if garden['address']:
                location = geocode_address(garden['address'])
                if location:
                    garden['latitude'], garden['longitude'] = location
                time.sleep(1)
            
            gardens.append(garden)
            
    except requests.exceptions.RequestException as e:
        print(f"Error fetching BQLT data: {e}")
    
    return gardens

def fetch_manhattan_land_trust_gardens() -> List[Dict]:
    """
    Fetch Manhattan Land Trust gardens
    """
    url = "https://www.manhattanlandtrust.org/our-gardens/"
    gardens = []
    
    try:
        response = requests.get(url)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Find all garden entries (adjust selectors based on actual HTML structure)
        garden_elements = soup.find_all('div', class_='garden-entry')  # Adjust class name
        
        for element in garden_elements:
            garden = {
                'name': element.find('h3').text.strip() if element.find('h3') else '',
                'address': element.find('address').text.strip() if element.find('address') else '',
                'type': 'community_garden',
                'organization': 'Manhattan Land Trust',
                'website': url
            }
            
            if garden['address']:
                location = geocode_address(garden['address'])
                if location:
                    garden['latitude'], garden['longitude'] = location
                time.sleep(1)
            
            gardens.append(garden)
            
    except requests.exceptions.RequestException as e:
        print(f"Error fetching Manhattan Land Trust data: {e}")
    
    return gardens

def fetch_bronx_land_trust_gardens() -> List[Dict]:
    """
    Fetch Bronx Land Trust gardens
    """
    url = "https://www.bronxlandtrust.org/ourgardens"
    gardens = []
    
    try:
        response = requests.get(url)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Find all garden entries (adjust selectors based on actual HTML structure)
        garden_elements = soup.find_all('div', class_='garden-entry')  # Adjust class name
        
        for element in garden_elements:
            garden = {
                'name': element.find('h3').text.strip() if element.find('h3') else '',
                'address': element.find('address').text.strip() if element.find('address') else '',
                'type': 'community_garden',
                'organization': 'Bronx Land Trust',
                'website': url
            }
            
            if garden['address']:
                location = geocode_address(garden['address'])
                if location:
                    garden['latitude'], garden['longitude'] = location
                time.sleep(1)
            
            gardens.append(garden)
            
    except requests.exceptions.RequestException as e:
        print(f"Error fetching Bronx Land Trust data: {e}")
    
    return gardens

def geocode_address(address: str) -> Tuple[float, float]:
    """
    Geocode an address to get latitude and longitude
    """
    try:
        g = geocoder.osm(address)
        if g.ok:
            return g.lat, g.lng
        return None
    except Exception as e:
        print(f"Error geocoding address {address}: {e}")
        return None

def process_land_trust_data() -> pd.DataFrame:
    """
    Process all land trust garden data into a standardized DataFrame
    """
    all_gardens = []
    
    print("Fetching BQLT gardens...")
    all_gardens.extend(fetch_bqlt_gardens())
    
    print("Fetching Manhattan Land Trust gardens...")
    all_gardens.extend(fetch_manhattan_land_trust_gardens())
    
    print("Fetching Bronx Land Trust gardens...")
    all_gardens.extend(fetch_bronx_land_trust_gardens())
    
    if not all_gardens:
        return pd.DataFrame()
    
    df = pd.DataFrame(all_gardens)
    
    # Ensure all required columns exist
    required_columns = ['name', 'type', 'address', 'latitude', 'longitude', 
                       'organization', 'website']
    
    for col in required_columns:
        if col not in df.columns:
            df[col] = ''
    
    # Add empty columns for consistency with other datasets
    df['hours'] = ''
    df['contact'] = ''
    df['additional_info'] = ''
    
    # Select and order columns
    columns = ['name', 'type', 'address', 'latitude', 'longitude', 
              'organization', 'hours', 'contact', 'additional_info']
    
    return df[columns].copy()

def save_data(df: pd.DataFrame, filename: str) -> None:
    """
    Save the processed data to a CSV file
    """
    # Create the output directory if it doesn't exist
    os.makedirs('../processed', exist_ok=True)
    
    # Save to CSV
    output_path = f'../processed/{filename}'
    df.to_csv(output_path, index=False)
    print(f"Saved {len(df)} records to {output_path}")

def main():
    print("Processing Land Trust garden data...")
    land_trust_df = process_land_trust_data()
    
    if not land_trust_df.empty:
        save_data(land_trust_df, 'land_trust_gardens.csv')
    else:
        print("No Land Trust data was processed.")

if __name__ == "__main__":
    main() 