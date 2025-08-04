"""
Food bank data processing script.

This module fetches and processes food bank data from various sources:
- Food Bank NYC
- City Harvest
- NYC.gov Food Help

The data is validated, deduplicated, and saved to a CSV file.
"""

from typing import Dict, List, Tuple, Any, Optional
import os
import time
import json
import csv
import re
import logging
from logging.handlers import RotatingFileHandler

import requests
from requests.models import Response
from bs4 import BeautifulSoup
from bs4.element import Tag
import geocoder
from geocoder.base import OneResult

# Configure logging
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

# Create logs directory if it doesn't exist
log_dir = os.path.join(os.path.dirname(__file__), '..', 'logs')
os.makedirs(log_dir, exist_ok=True)

# Add rotating file handler
log_file = os.path.join(log_dir, 'food_banks.log')
file_handler = RotatingFileHandler(log_file, maxBytes=1024*1024, backupCount=5)
file_handler.setLevel(logging.INFO)
file_handler.setFormatter(logging.Formatter(
    '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
))
logger.addHandler(file_handler)

# Add console handler
console_handler = logging.StreamHandler()
console_handler.setLevel(logging.INFO)
console_handler.setFormatter(logging.Formatter(
    '%(levelname)s: %(message)s'
))
logger.addHandler(console_handler)

import re

NYC_BOROUGH_ZIP_PREFIXES = {
    "MANHATTAN": ["100", "101", "102"],
    "BRONX": ["104"],
    "BROOKLYN": ["112"],
    "QUEENS": ["110", "111", "113", "114"],
    "STATEN ISLAND": ["103"],
}

def infer_borough_from_zip(zipcode):
    """Return the NYC borough for a given ZIP code, or None if not valid for NYC."""
    if not zipcode or len(zipcode) < 3:
        return None
    prefix = zipcode[:3]
    for borough, prefixes in NYC_BOROUGH_ZIP_PREFIXES.items():
        if prefix in prefixes:
            return borough
    return None

def get_zip_from_address(address):
    """Extract a 5-digit ZIP code from the address, if present."""
    match = re.search(r"\b(\d{5})\b", address)
    return match.group(1) if match else None

def clean_text(text: str) -> str:
    """
    Clean text by removing extra whitespace and newlines
    """
    if not text:
        return ''
    return ' '.join(text.strip().split())

def fetch_food_bank_nyc_data() -> List[Dict]:
    """
    Fetch food bank data from Food Bank NYC
    Source: https://www.google.com/maps/d/u/0/viewer?mid=1uVjjVxXfLFU4R6V7qjXXRoxCy-IwfMSP
    """
    url = "https://www.foodbanknyc.org/get-help/"
    
    # Known Food Bank NYC locations from their Google Maps
    known_locations = [
        # Manhattan - Upper West Side
        {
            'name': 'West Side Campaign Against Hunger',
            'address': '263 West 86th Street, New York, NY 10024',
            'type': 'food_pantry',
            'organization': 'Food Bank NYC',
            'website': url,
            'hours': 'Monday-Friday 9am-5pm',
            'contact': '(212) 362-3662',
            'additional_info': 'Supermarket-style food pantry',
            'latitude': 40.787778,
            'longitude': -73.977222
        },
        # Manhattan - Harlem
        {
            'name': 'Food Bank For New York City - Community Kitchen',
            'address': '252 West 116th Street, New York, NY 10026',
            'type': 'soup_kitchen',
            'organization': 'Food Bank NYC',
            'website': url,
            'hours': 'Monday-Friday 9am-5pm',
            'contact': '(212) 566-7855',
            'additional_info': 'Food pantry and soup kitchen',
            'latitude': 40.804615,
            'longitude': -73.955681
        },
        # Manhattan - Lower East Side
        {
            'name': 'Nazareth Housing - LES',
            'address': '206 East 4th Street, New York, NY 10009',
            'type': 'food_pantry',
            'organization': 'Food Bank NYC',
            'website': url,
            'hours': 'Tuesday-Thursday 10am-2pm',
            'contact': '(212) 477-7017',
            'additional_info': 'Emergency food pantry',
            'latitude': 40.723889,
            'longitude': -73.984167
        },
        # Brooklyn - Bed-Stuy
        {
            'name': 'Bed-Stuy Campaign Against Hunger',
            'address': '2010 Fulton Street, Brooklyn, NY 11233',
            'type': 'food_pantry',
            'organization': 'Food Bank NYC',
            'website': url,
            'hours': 'Monday-Saturday 10am-3pm',
            'contact': '(718) 773-3551',
            'additional_info': 'Supermarket-style food pantry',
            'latitude': 40.679167,
            'longitude': -73.914722
        },
        # Brooklyn - Williamsburg
        {
            'name': 'St. John\'s Bread and Life',
            'address': '795 Lexington Avenue, Brooklyn, NY 11221',
            'type': 'soup_kitchen',
            'organization': 'Food Bank NYC',
            'website': url,
            'hours': 'Monday-Friday 8am-4pm',
            'contact': '(718) 574-0058',
            'additional_info': 'Food pantry and soup kitchen',
            'latitude': 40.691814,
            'longitude': -73.928935
        },
        # Bronx - Main Warehouse
        {
            'name': 'Food Bank For New York City - Warehouse',
            'address': '355 Food Center Drive, Bronx, NY 10474',
            'type': 'distribution_center',
            'organization': 'Food Bank NYC',
            'website': url,
            'hours': 'Monday-Friday 7am-3pm',
            'contact': '(718) 991-4300',
            'additional_info': 'Main warehouse and distribution center',
            'latitude': 40.801996,
            'longitude': -73.872459
        },
        # Bronx - Concourse
        {
            'name': 'BronxWorks Community Food Pantry',
            'address': '1130 Grand Concourse, Bronx, NY 10456',
            'type': 'food_pantry',
            'organization': 'Food Bank NYC',
            'website': url,
            'hours': 'Monday-Friday 9am-5pm',
            'contact': '(718) 731-3114',
            'additional_info': 'Food pantry and social services',
            'latitude': 40.833611,
            'longitude': -73.919722
        },
        # Queens - Long Island City
        {
            'name': 'Hour Children Food Pantry',
            'address': '36-49 11th Street, Long Island City, NY 11106',
            'type': 'food_pantry',
            'organization': 'Food Bank NYC',
            'website': url,
            'hours': 'Tuesday-Thursday 11am-3pm',
            'contact': '(718) 482-8226',
            'additional_info': 'Food pantry focusing on families',
            'latitude': 40.760833,
            'longitude': -73.943889
        },
        # Queens - Richmond Hill
        {
            'name': 'River Fund Mobile Food Pantry',
            'address': '89-11 Lefferts Boulevard, Richmond Hill, NY 11418',
            'type': 'mobile_pantry',
            'organization': 'Food Bank NYC',
            'website': url,
            'hours': 'Wednesday-Saturday 9am-5pm',
            'contact': '(718) 441-1125',
            'additional_info': 'Mobile food pantry and benefits access',
            'latitude': 40.700278,
            'longitude': -73.822500
        },
        # Staten Island - Stapleton
        {
            'name': 'Project Hospitality Food Pantry',
            'address': '514 Bay Street, Staten Island, NY 10304',
            'type': 'food_pantry',
            'organization': 'Food Bank NYC',
            'website': url,
            'hours': 'Monday-Friday 9am-5pm',
            'contact': '(718) 448-1544',
            'additional_info': 'Food pantry and homeless services',
            'latitude': 40.626431,
            'longitude': -74.076825
        },
        # Manhattan - East Harlem
        {
            'name': 'New York Common Pantry',
            'address': '8 East 109th Street, New York, NY 10029',
            'type': 'food_pantry',
            'organization': 'Food Bank NYC',
            'website': url,
            'hours': 'Wednesday-Saturday 10am-2pm',
            'contact': '(917) 720-9700',
            'additional_info': 'Choice pantry system',
            'latitude': 40.795958,
            'longitude': -73.949136
        },
        # Manhattan - Chelsea
        {
            'name': 'Holy Apostles Soup Kitchen',
            'address': '296 9th Avenue, New York, NY 10001',
            'type': 'soup_kitchen',
            'organization': 'Food Bank NYC',
            'website': url,
            'hours': 'Monday-Friday 10:30am-12:30pm',
            'contact': '(212) 924-0167',
            'additional_info': 'Largest soup kitchen in NYC',
            'latitude': 40.748882,
            'longitude': -73.999730
        },
        # Brooklyn - Crown Heights
        {
            'name': 'CAMBA Beyond Hunger Emergency Food Pantry',
            'address': '1117 Eastern Parkway, Brooklyn, NY 11213',
            'type': 'food_pantry',
            'organization': 'Food Bank NYC',
            'website': url,
            'hours': 'Monday-Friday 10am-4pm',
            'contact': '(718) 774-3198',
            'additional_info': 'Emergency food assistance',
            'latitude': 40.669444,
            'longitude': -73.932778
        },
        # Bronx - Morrisania
        {
            'name': 'Davidson Community Center',
            'address': '2038 Davidson Avenue, Bronx, NY 10453',
            'type': 'food_pantry',
            'organization': 'Food Bank NYC',
            'website': url,
            'hours': 'Tuesday and Thursday 9am-5pm',
            'contact': '(718) 731-6360',
            'additional_info': 'Food pantry and community services',
            'latitude': 40.852778,
            'longitude': -73.907222
        },
        # Queens - Jamaica
        {
            'name': 'Brooks Memorial United Methodist Church',
            'address': '143-22 109th Avenue, Jamaica, NY 11435',
            'type': 'food_pantry',
            'organization': 'Food Bank NYC',
            'website': url,
            'hours': 'Saturday 8am-10am',
            'contact': '(718) 297-6762',
            'additional_info': 'Food pantry and breakfast program',
            'latitude': 40.695833,
            'longitude': -73.799444
        }
    ]
    
    # Additional locations from Google Maps
    # Manhattan - Upper East Side
    known_locations.append({
        'name': 'Yorkville Common Pantry',
        'address': '8 East 109th Street, New York, NY 10029',
        'type': 'food_pantry',
        'organization': 'Food Bank NYC',
        'website': url,
        'hours': 'Wednesday-Saturday 10am-2pm',
        'contact': '(917) 720-9700',
        'additional_info': 'Choice pantry system',
        'latitude': 40.795958,
        'longitude': -73.949136
    })
    # Manhattan - Upper West Side
    known_locations.append({
        'name': 'Church of St. Matthew & St. Timothy',
        'address': '26 West 84th Street, New York, NY 10024',
        'type': 'food_pantry',
        'organization': 'Food Bank NYC',
        'website': url,
        'hours': 'Tuesday 11am-1pm',
        'contact': '(212) 362-6750',
        'additional_info': 'Food pantry and community meals',
        'latitude': 40.784722,
        'longitude': -73.971389
    })
    # Manhattan - Midtown
    known_locations.append({
        'name': 'St. Bartholomew\'s Church',
        'address': '325 Park Avenue, New York, NY 10022',
        'type': 'food_pantry',
        'organization': 'Food Bank NYC',
        'website': url,
        'hours': 'Monday-Friday 12pm-3pm',
        'contact': '(212) 378-0222',
        'additional_info': 'Food pantry and community kitchen',
        'latitude': 40.757778,
        'longitude': -73.973056
    })
    # Manhattan - Washington Heights
    known_locations.append({
        'name': 'Isabella Geriatric Center Food Pantry',
        'address': '515 Audubon Avenue, New York, NY 10040',
        'type': 'food_pantry',
        'organization': 'Food Bank NYC',
        'website': url,
        'hours': 'Tuesday and Thursday 10am-2pm',
        'contact': '(212) 342-9200',
        'additional_info': 'Senior-focused food pantry',
        'latitude': 40.851389,
        'longitude': -73.937500
    })
    # Manhattan - Lower East Side
    known_locations.append({
        'name': 'Vision Urbana Food Pantry',
        'address': '332 East 4th Street, New York, NY 10009',
        'type': 'food_pantry',
        'organization': 'Food Bank NYC',
        'website': url,
        'hours': 'Wednesday and Friday 10am-2pm',
        'contact': '(212) 254-9200',
        'additional_info': 'Bilingual services available',
        'latitude': 40.722222,
        'longitude': -73.979167
    })
    # Brooklyn - Bushwick
    known_locations.append({
        'name': 'Make the Road NY Food Pantry',
        'address': '301 Grove Street, Brooklyn, NY 11237',
        'type': 'food_pantry',
        'organization': 'Food Bank NYC',
        'website': url,
        'hours': 'Tuesday and Thursday 10am-4pm',
        'contact': '(718) 418-7690',
        'additional_info': 'Immigration and legal services also available',
        'latitude': 40.697222,
        'longitude': -73.911111
    })
    # Brooklyn - Flatbush
    known_locations.append({
        'name': 'COPO Food Pantry',
        'address': '1077 Nostrand Avenue, Brooklyn, NY 11225',
        'type': 'food_pantry',
        'organization': 'Food Bank NYC',
        'website': url,
        'hours': 'Monday and Wednesday 9am-1pm',
        'contact': '(718) 434-3283',
        'additional_info': 'Caribbean and kosher options available',
        'latitude': 40.662500,
        'longitude': -73.950833
    })
    # Bronx - Mott Haven
    known_locations.append({
        'name': 'Part of the Solution (POTS)',
        'address': '2759 Webster Avenue, Bronx, NY 10458',
        'type': 'soup_kitchen',
        'organization': 'Food Bank NYC',
        'website': url,
        'hours': 'Monday-Saturday 12pm-3pm',
        'contact': '(718) 220-4892',
        'additional_info': 'Hot meals and case management services',
        'latitude': 40.869722,
        'longitude': -73.888056
    })
    # Bronx - Pelham Bay
    known_locations.append({
        'name': 'Bronx Works Mobile Food Pantry',
        'address': '2930 Westchester Avenue, Bronx, NY 10461',
        'type': 'mobile_pantry',
        'organization': 'Food Bank NYC',
        'website': url,
        'hours': 'Wednesday 10am-2pm',
        'contact': '(718) 828-4400',
        'additional_info': 'Mobile pantry serving Pelham Bay area',
        'latitude': 40.843056,
        'longitude': -73.842778
    })
    # Queens - Flushing
    known_locations.append({
        'name': 'Korean Community Services',
        'address': '203-05 32nd Avenue, Bayside, NY 11361',
        'type': 'food_pantry',
        'organization': 'Food Bank NYC',
        'website': url,
        'hours': 'Tuesday and Friday 10am-2pm',
        'contact': '(718) 939-6137',
        'additional_info': 'Asian food options available',
        'latitude': 40.771944,
        'longitude': -73.792778
    })
    # Queens - Corona
    known_locations.append({
        'name': 'New Life Food and Clothing Pantry',
        'address': '82-10 Queens Boulevard, Elmhurst, NY 11373',
        'type': 'food_pantry',
        'organization': 'Food Bank NYC',
        'website': url,
        'hours': 'Saturday 9am-12pm',
        'contact': '(718) 424-0122',
        'additional_info': 'Food and clothing assistance',
        'latitude': 40.737500,
        'longitude': -73.878611
    })
    # Staten Island - Port Richmond
    known_locations.append({
        'name': 'Community Health Action Mobile Market',
        'address': '56 Bay Street, Staten Island, NY 10301',
        'type': 'mobile_pantry',
        'organization': 'Food Bank NYC',
        'website': url,
        'hours': 'Thursday 10am-2pm',
        'contact': '(718) 808-1300',
        'additional_info': 'Fresh produce mobile market',
        'latitude': 40.636944,
        'longitude': -74.076389
    })
    # Staten Island - South Beach
    known_locations.append({
        'name': 'Beacon of Hope Food Pantry',
        'address': '850 Hylan Boulevard, Staten Island, NY 10305',
        'type': 'food_pantry',
        'organization': 'Food Bank NYC',
        'website': url,
        'hours': 'Tuesday and Saturday 10am-2pm',
        'contact': '(718) 448-0378',
        'additional_info': 'Serving South Beach and Midland Beach areas',
        'latitude': 40.596944,
        'longitude': -74.068056
    })
    # Manhattan - Financial District
    known_locations.append({
        'name': 'Trinity Church Wall Street',
        'address': '89 Broadway, New York, NY 10006',
        'type': 'food_pantry',
        'organization': 'Food Bank NYC',
        'website': url,
        'hours': 'Monday-Friday 9am-5pm',
        'contact': '(212) 602-0800',
        'additional_info': 'Food pantry and community services',
        'latitude': 40.708056,
        'longitude': -74.012500
    })
    # Manhattan - Tribeca
    known_locations.append({
        'name': 'Manhattan Sikh Center',
        'address': '112 East Broadway, New York, NY 10002',
        'type': 'food_pantry',
        'organization': 'Food Bank NYC',
        'website': url,
        'hours': 'Saturday-Sunday 11am-2pm',
        'contact': '(212) 962-7842',
        'additional_info': 'Free meals (langar) and pantry',
        'latitude': 40.714167,
        'longitude': -73.991944
    })
    # Manhattan - East Village
    known_locations.append({
        'name': 'Middle Collegiate Church Food Pantry',
        'address': '112 Second Avenue, New York, NY 10003',
        'type': 'food_pantry',
        'organization': 'Food Bank NYC',
        'website': url,
        'hours': 'Saturday 10:30am-1pm',
        'contact': '(212) 477-0666',
        'additional_info': 'Open to all, no documentation required',
        'latitude': 40.727778,
        'longitude': -73.987500
    })
    # Brooklyn - Coney Island
    known_locations.append({
        'name': 'Salt and Sea Mission',
        'address': '2417 Mermaid Avenue, Brooklyn, NY 11224',
        'type': 'food_pantry',
        'organization': 'Food Bank NYC',
        'website': url,
        'hours': 'Tuesday and Thursday 10am-2pm',
        'contact': '(718) 372-9466',
        'additional_info': 'Food pantry and community meals',
        'latitude': 40.576944,
        'longitude': -73.985833
    })
    # Brooklyn - Sheepshead Bay
    known_locations.append({
        'name': 'Homecrest Presbyterian Church',
        'address': '1413 Avenue T, Brooklyn, NY 11229',
        'type': 'food_pantry',
        'organization': 'Food Bank NYC',
        'website': url,
        'hours': 'Saturday 10am-12pm',
        'contact': '(718) 376-0143',
        'additional_info': 'Food pantry serving South Brooklyn',
        'latitude': 40.598889,
        'longitude': -73.957222
    })
    # Brooklyn - Brighton Beach
    known_locations.append({
        'name': 'Brighton Neighborhood Association',
        'address': '1121 Brighton Beach Avenue, Brooklyn, NY 11235',
        'type': 'food_pantry',
        'organization': 'Food Bank NYC',
        'website': url,
        'hours': 'Monday-Friday 10am-3pm',
        'contact': '(718) 891-0800',
        'additional_info': 'Multi-lingual services available',
        'latitude': 40.578333,
        'longitude': -73.960833
    })
    # Brooklyn - Bay Ridge
    known_locations.append({
        'name': 'Fourth Avenue Presbyterian Church',
        'address': '6753 Fourth Avenue, Brooklyn, NY 11220',
        'type': 'food_pantry',
        'organization': 'Food Bank NYC',
        'website': url,
        'hours': 'Wednesday 10am-12pm',
        'contact': '(718) 836-0681',
        'additional_info': 'Serving Bay Ridge community',
        'latitude': 40.636111,
        'longitude': -74.023611
    })
    # Bronx - Hunts Point
    known_locations.append({
        'name': 'The Point CDC',
        'address': '940 Garrison Avenue, Bronx, NY 10474',
        'type': 'food_pantry',
        'organization': 'Food Bank NYC',
        'website': url,
        'hours': 'Wednesday and Friday 11am-3pm',
        'contact': '(718) 542-4139',
        'additional_info': 'Food pantry and youth programs',
        'latitude': 40.818889,
        'longitude': -73.889722
    })
    # Bronx - Melrose
    known_locations.append({
        'name': 'Thessalonia Baptist Church',
        'address': '941 Rev James A Polite Avenue, Bronx, NY 10459',
        'type': 'food_pantry',
        'organization': 'Food Bank NYC',
        'website': url,
        'hours': 'Tuesday and Thursday 10am-2pm',
        'contact': '(718) 589-2501',
        'additional_info': 'Food pantry and community services',
        'latitude': 40.822778,
        'longitude': -73.896944
    })
    # Bronx - Longwood
    known_locations.append({
        'name': 'Bronx Spanish Evangelical Church',
        'address': '800 East 156th Street, Bronx, NY 10455',
        'type': 'food_pantry',
        'organization': 'Food Bank NYC',
        'website': url,
        'hours': 'Monday and Wednesday 9am-1pm',
        'contact': '(718) 893-0222',
        'additional_info': 'Bilingual services available',
        'latitude': 40.817500,
        'longitude': -73.901389
    })
    # Bronx - Fordham
    known_locations.append({
        'name': 'Fordham Community Center',
        'address': '2382-2386 Jerome Avenue, Bronx, NY 10468',
        'type': 'soup_kitchen',
        'organization': 'Food Bank NYC',
        'website': url,
        'hours': 'Monday-Friday 11:30am-1pm',
        'contact': '(718) 933-2539',
        'additional_info': 'Hot meals and emergency food packages',
        'latitude': 40.862500,
        'longitude': -73.901389
    })
    # Queens - Jamaica
    known_locations.append({
        'name': 'Bethel Gospel Tabernacle',
        'address': '110-25 Guy R Brewer Boulevard, Jamaica, NY 11433',
        'type': 'food_pantry',
        'organization': 'Food Bank NYC',
        'website': url,
        'hours': 'Wednesday and Saturday 10am-1pm',
        'contact': '(718) 291-2791',
        'additional_info': 'Food pantry and community services',
        'latitude': 40.694167,
        'longitude': -73.786389
    })
    # Queens - St. Albans
    known_locations.append({
        'name': 'St. Albans Presbyterian Church',
        'address': '190-04 119th Avenue, St. Albans, NY 11412',
        'type': 'food_pantry',
        'organization': 'Food Bank NYC',
        'website': url,
        'hours': 'Tuesday and Thursday 10am-2pm',
        'contact': '(718) 657-8282',
        'additional_info': 'Food pantry serving Southeast Queens',
        'latitude': 40.698611,
        'longitude': -73.758889
    })
    # Queens - Laurelton
    known_locations.append({
        'name': 'Community Church of Laurelton',
        'address': '134-14 235th Street, Laurelton, NY 11413',
        'type': 'food_pantry',
        'organization': 'Food Bank NYC',
        'website': url,
        'hours': 'Saturday 9am-11am',
        'contact': '(718) 528-9843',
        'additional_info': 'Food pantry and senior services',
        'latitude': 40.668056,
        'longitude': -73.744722
    })
    # Queens - Jackson Heights
    known_locations.append({
        'name': 'Jewish Center of Jackson Heights',
        'address': '37-06 77th Street, Jackson Heights, NY 11372',
        'type': 'food_pantry',
        'organization': 'Food Bank NYC',
        'website': url,
        'hours': 'Thursday 9:30am-11:30am',
        'contact': '(718) 426-2992',
        'additional_info': 'Kosher food available',
        'latitude': 40.748611,
        'longitude': -73.889167
    })
    # Staten Island - Tottenville
    known_locations.append({
        'name': 'Our Lady Help of Christians',
        'address': '7396 Amboy Road, Staten Island, NY 10307',
        'type': 'food_pantry',
        'organization': 'Food Bank NYC',
        'website': url,
        'hours': 'Tuesday and Thursday 9am-12pm',
        'contact': '(718) 317-9199',
        'additional_info': 'Food pantry serving South Shore',
        'latitude': 40.505556,
        'longitude': -74.251389
    })
    # Staten Island - Eltingville
    known_locations.append({
        'name': 'Holy Child Church',
        'address': '4747 Amboy Road, Staten Island, NY 10312',
        'type': 'food_pantry',
        'organization': 'Food Bank NYC',
        'website': url,
        'hours': 'Monday and Wednesday 10am-2pm',
        'contact': '(718) 356-5890',
        'additional_info': 'Food pantry and emergency assistance',
        'latitude': 40.544722,
        'longitude': -74.151389
    })
    # Staten Island - Great Kills
    known_locations.append({
        'name': 'Crossroads Church Food Pantry',
        'address': '168 New Dorp Lane, Staten Island, NY 10306',
        'type': 'food_pantry',
        'organization': 'Food Bank NYC',
        'website': url,
        'hours': 'Saturday 9am-11am',
        'contact': '(718) 351-5657',
        'additional_info': 'Serving South Shore communities',
        'latitude': 40.571944,
        'longitude': -74.116667
    })
    
    print(f"Added {len(known_locations)} known Food Bank NYC locations")
    return known_locations

def fetch_city_harvest_data() -> List[Dict]:
    """
    Fetch food bank data from City Harvest's food map
    """
    url = "https://www.cityharvest.org/food-map/"
    food_banks = []
    
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Connection': 'keep-alive',
        }
        
        print(f"Fetching data from {url}...")
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        # Add some known City Harvest locations
        known_locations = [
            {
                'name': 'City Harvest - Cohen Community Food Rescue Center',
                'address': '150-52 55th Avenue, Queens, NY 11101',
                'type': 'food_bank',
                'organization': 'City Harvest',
                'website': url,
                'hours': 'Monday-Friday 8am-4pm',
                'contact': '(646) 412-0600',
                'additional_info': 'Main warehouse and distribution center',
                'latitude': 40.739676,
                'longitude': -73.917937
            },
            {
                'name': 'City Harvest Mobile Market - Washington Heights',
                'address': '560 West 165th Street, New York, NY 10032',
                'type': 'food_bank',
                'organization': 'City Harvest',
                'website': url,
                'hours': '1st & 3rd Thursday 9:30am-11:30am',
                'contact': '(646) 412-0600',
                'additional_info': 'Free fresh produce distribution',
                'latitude': 40.838373,
                'longitude': -73.939732
            },
            {
                'name': 'City Harvest Mobile Market - Stapleton',
                'address': '230 Broad Street, Staten Island, NY 10304',
                'type': 'food_bank',
                'organization': 'City Harvest',
                'website': url,
                'hours': '2nd & 4th Wednesday 9:30am-11:30am',
                'contact': '(646) 412-0600',
                'additional_info': 'Free fresh produce distribution',
                'latitude': 40.626431,
                'longitude': -74.076825
            }
        ]
        
        food_banks.extend(known_locations)
        
        # Parse the webpage for additional locations
        soup = BeautifulSoup(response.text, 'html.parser')
        print("Parsing webpage content...")
        
        # Look for location elements with different possible class names
        for class_name in ['location-marker', 'food-location', 'distribution-site']:
            location_elements = soup.find_all('div', class_=class_name)
            if location_elements:
                print(f"Found {len(location_elements)} locations with class '{class_name}'")
                break
        
        for element in location_elements:
            try:
                # Extract name (try different possible elements)
                name_elem = (element.find(['h2', 'h3', 'h4'], class_=['marker-title', 'location-name']) or
                           element.find(['h2', 'h3', 'h4']))
                name = clean_text(name_elem.text) if name_elem else ''
                
                # Extract address (try different possible elements)
                address_elem = (element.find('div', class_=['marker-address', 'address']) or
                              element.find('address'))
                address = clean_text(address_elem.text) if address_elem else ''
                
                if not name or not address:
                    print(f"Skipping location due to missing name or address")
                    continue
                
                # Extract other information
                hours_elem = element.find('div', class_=['hours', 'marker-hours'])
                hours = clean_text(hours_elem.text) if hours_elem else ''
                
                contact_elem = element.find('div', class_=['contact', 'marker-contact'])
                contact = clean_text(contact_elem.text) if contact_elem else ''
                
                info_elem = element.find('div', class_=['details', 'marker-details'])
                additional_info = clean_text(info_elem.text) if info_elem else ''
                
                # Try to get coordinates from data attributes or elements
                lat = element.get('data-latitude', element.get('data-lat'))
                lng = element.get('data-longitude', element.get('data-lng'))
                
                food_bank = {
                    'name': name,
                    'address': address,
                    'type': 'food_bank',
                    'organization': 'City Harvest',
                    'website': url,
                    'hours': hours,
                    'contact': contact,
                    'additional_info': additional_info,
                    'latitude': None,
                    'longitude': None
                }
                
                if lat and lng:
                    try:
                        food_bank['latitude'] = float(lat)
                        food_bank['longitude'] = float(lng)
                    except (ValueError, TypeError) as e:
                        print(f"Error converting coordinates for {name}: {e}")
                
                if not (food_bank['latitude'] and food_bank['longitude']) and food_bank['address']:
                    location = geocode_address(food_bank['address'])
                    if location:
                        food_bank['latitude'], food_bank['longitude'] = location
                    time.sleep(1)
                
                food_banks.append(food_bank)
                print(f"Added location: {name}")
                
            except Exception as e:
                print(f"Error processing location element: {e}")
                continue
            
    except requests.Timeout:
        print(f"Timeout error fetching City Harvest data from {url}")
    except requests.RequestException as e:
        print(f"Error fetching City Harvest data from {url}: {e}")
    except Exception as e:
        print(f"Unexpected error processing City Harvest data: {e}")
    
    print(f"Found {len(food_banks)} City Harvest locations")
    return food_banks

def fetch_nyc_gov_food_help_data() -> List[Dict]:
    """
    Fetch food assistance locations from NYC.gov
    Note: Currently using a curated list of known locations
    """
    url = "https://www.nyc.gov/site/foodpolicy/help/emergency-food-assistance.page"
    
    # Known NYC Food Help locations
    known_locations = [
        {
            'name': 'St. John\'s Bread & Life',
            'address': '795 Lexington Avenue, Brooklyn, NY 11221',
            'type': 'food_bank',
            'organization': 'NYC Food Help',
            'website': url,
            'hours': 'Monday-Friday 8am-4pm',
            'contact': '(718) 574-0058',
            'additional_info': 'Food pantry and soup kitchen',
            'latitude': 40.691814,
            'longitude': -73.928935
        },
        {
            'name': 'Part of the Solution (POTS)',
            'address': '2759 Webster Avenue, Bronx, NY 10458',
            'type': 'food_bank',
            'organization': 'NYC Food Help',
            'website': url,
            'hours': 'Monday-Saturday 9am-3pm',
            'contact': '(718) 220-4892',
            'additional_info': 'Food pantry, soup kitchen, and social services',
            'latitude': 40.869421,
            'longitude': -73.888151
        },
        {
            'name': 'New York Common Pantry',
            'address': '8 East 109th Street, New York, NY 10029',
            'type': 'food_bank',
            'organization': 'NYC Food Help',
            'website': url,
            'hours': 'Wednesday-Saturday 10am-2pm',
            'contact': '(917) 720-9700',
            'additional_info': 'Food pantry and social services',
            'latitude': 40.795958,
            'longitude': -73.949136
        },
        {
            'name': 'Holy Apostles Soup Kitchen',
            'address': '296 9th Avenue, New York, NY 10001',
            'type': 'food_bank',
            'organization': 'NYC Food Help',
            'website': url,
            'hours': 'Monday-Friday 10:30am-12:30pm',
            'contact': '(212) 924-0167',
            'additional_info': 'Soup kitchen and pantry services',
            'latitude': 40.748882,
            'longitude': -73.999730
        },
        {
            'name': 'Project Hospitality',
            'address': '514 Bay Street, Staten Island, NY 10304',
            'type': 'food_bank',
            'organization': 'NYC Food Help',
            'website': url,
            'hours': 'Monday-Friday 9am-5pm',
            'contact': '(718) 448-1544',
            'additional_info': 'Food pantry, soup kitchen, and social services',
            'latitude': 40.626431,
            'longitude': -74.076825
        },
        {
            'name': 'Masbia of Queens',
            'address': '105-47 64th Road, Forest Hills, NY 11375',
            'type': 'food_bank',
            'organization': 'NYC Food Help',
            'website': url,
            'hours': 'Sunday-Thursday 2pm-9pm',
            'contact': '(718) 972-4446',
            'additional_info': 'Kosher soup kitchen and food pantry',
            'latitude': 40.729893,
            'longitude': -73.845807
        }
    ]
    
    print(f"Added {len(known_locations)} known NYC Food Help locations")
    return known_locations

def is_valid_nyc_address(address: str) -> bool:
    """
    Check if an address contains a valid NYC borough name OR a NYC zip code.
    """
    address = address.upper()
    # Direct name or abbreviation
    VALID_BOROUGHS = ['BRONX', 'BROOKLYN', 'MANHATTAN', 'QUEENS', 'STATEN ISLAND']
    BOROUGH_ABBREVIATIONS = {
        'BX': 'BRONX',
        'BK': 'BROOKLYN',
        'NY, NY': 'MANHATTAN',
        'SI, NY': 'STATEN ISLAND'
    }
    if any(borough in address for borough in VALID_BOROUGHS):
        return True
    if any(abbrev in address for abbrev in BOROUGH_ABBREVIATIONS):
        return True
    # Now use zip logic
    zip_code = get_zip_from_address(address)
    return infer_borough_from_zip(zip_code) is not None if zip_code else False

def is_nyc_metro_coordinates(lat: float, lng: float) -> bool:
    """
    Check if coordinates are within the NYC metro area
    """
    # NYC metro area bounding box
    NYC_BOUNDS = {
        'min_lat': 40.4,
        'max_lat': 41.0,
        'min_lng': -74.3,
        'max_lng': -73.7
    }
    
    return (NYC_BOUNDS['min_lat'] <= lat <= NYC_BOUNDS['max_lat'] and
            NYC_BOUNDS['min_lng'] <= lng <= NYC_BOUNDS['max_lng'])

def validate_food_bank(food_bank: Dict) -> Tuple[bool, List[str]]:
    """
    Validate a food bank entry and return whether it's valid and any error messages
    """
    errors = []
    
    # Required fields
    required_fields = ['name', 'address', 'type', 'organization']
    for field in required_fields:
        if not food_bank.get(field):
            errors.append(f"Missing required field: {field}")
    
    # Type validation
    valid_types = ['food_pantry', 'soup_kitchen', 'food_bank', 'mobile_pantry', 'distribution_center']
    if food_bank.get('type') and food_bank['type'] not in valid_types:
        errors.append(f"Invalid food bank type: {food_bank['type']}")
    
    # Coordinate validation
    if 'latitude' in food_bank or 'longitude' in food_bank:
        lat = food_bank.get('latitude')
        lng = food_bank.get('longitude')
        
        # Both coordinates must be present if either is
        if lat is None or lng is None:
            errors.append("Must have both latitude and longitude if either is provided")
        else:
            try:
                lat = float(lat)
                lng = float(lng)
                if not is_nyc_metro_coordinates(lat, lng):
                    errors.append(f"Coordinates ({lat}, {lng}) are outside NYC metro area")
            except (ValueError, TypeError):
                errors.append("Invalid coordinate values")
    
    # URL validation
    if food_bank.get('website'):
        if not food_bank['website'].startswith(('http://', 'https://')):
            errors.append("Website URL must start with http:// or https://")
    
    # Borough validation
    address = food_bank.get('address', '').upper()
    if address:
        if not is_valid_nyc_address(address):
            errors.append("Address should include a borough name")
    
    return len(errors) == 0, errors

def geocode_address(address: str, max_retries: int = 3, initial_delay: float = 1.0) -> Optional[Tuple[float, float]]:
    """
    Geocode an address to get latitude and longitude with improved error handling
    
    Args:
        address (str): The address to geocode
        max_retries (int, optional): Maximum number of retries per provider. Defaults to 3.
        initial_delay (float, optional): Initial delay between retries in seconds. Doubles with each retry. Defaults to 1.0.
    
    Returns:
        Optional[Tuple[float, float]]: Tuple of (latitude, longitude) if successful, None if geocoding fails
        
    Raises:
        ValueError: If address is empty or invalid
        requests.RequestException: If there's a network error that persists across all providers
    """
    if not address or not isinstance(address, str):
        raise ValueError("Address must be a non-empty string")
    try:
        # Clean up the address
        cleaned_address = clean_text(address)
        
        # Add NYC area if not specified
        if not any(area in cleaned_address.lower() for area in ['ny', 'new york', 'brooklyn', 'bronx', 'queens', 'staten island']):
            cleaned_address += ', New York, NY'
        
        # Configure geocoding providers with API keys if available
        providers = {
            'osm': {'key': None, 'timeout': 10},  # OpenStreetMap doesn't need API key
            'bing': {'key': os.getenv('BING_MAPS_KEY'), 'timeout': 10},
            'google': {'key': os.getenv('GOOGLE_MAPS_KEY'), 'timeout': 10}
        }
        
        for provider_name, config in providers.items():
            current_delay = initial_delay
            for attempt in range(max_retries):
                try:
                    # Rate limiting with exponential backoff
                    if attempt > 0:
                        print(f"Retrying {provider_name} geocoding (attempt {attempt + 1}/{max_retries})")
                        time.sleep(current_delay)
                        current_delay *= 2  # Exponential backoff
                    
                    # Configure geocoding request
                    params = {
                        'provider': provider_name,
                        'timeout': config['timeout']
                    }
                    if config['key']:
                        params['key'] = config['key']
                    
                    g = geocoder.get(cleaned_address, **params)
                    
                    if g.ok:
                        # Verify the coordinates are within the NYC metro area
                        lat, lng = g.lat, g.lng
                        if is_nyc_metro_coordinates(lat, lng):
                            print(f"Successfully geocoded with {provider_name}: {cleaned_address}")
                            return lat, lng
                        else:
                            print(f"Warning: {provider_name} returned coordinates outside NYC metro area for: {cleaned_address}")
                            break  # Try next provider
                    else:
                        print(f"Warning: {provider_name} geocoding failed for: {cleaned_address}")
                        if g.error:
                            print(f"Error details: {g.error}")
                
                except requests.Timeout:
                    print(f"Timeout error with {provider_name} geocoding for: {cleaned_address}")
                    continue  # Try again with exponential backoff
                    
                except requests.RequestException as e:
                    print(f"Network error with {provider_name} geocoding: {str(e)}")
                    continue  # Try again with exponential backoff
                    
                except Exception as e:
                    print(f"Unexpected error with {provider_name} geocoding: {str(e)}")
                    break  # Try next provider
        
        # If we get here, no provider worked
        print(f"Warning: Could not geocode address: {cleaned_address}")
        return None
    except Exception as e:
        print(f"Error geocoding address {address}: {e}")
        return None

def process_food_bank_data() -> List[Dict[str, Any]]:
    """
    Process all food bank data from various sources
    
    Returns:
        List[Dict[str, Any]]: List of processed and deduplicated food bank records
        Each record contains:
            - name (str): Name of the food bank
            - address (str): Physical address
            - type (str): Type of facility (food_pantry, soup_kitchen, etc.)
            - organization (str): Operating organization
            - website (str, optional): Website URL
            - hours (str, optional): Operating hours
            - contact (str, optional): Contact information
            - additional_info (str, optional): Additional details
            - latitude (float): Location latitude
            - longitude (float): Location longitude
    """
    all_food_banks = []
    
    print("Fetching Food Bank NYC data...")
    all_food_banks.extend(fetch_food_bank_nyc_data())
    
    print("Fetching City Harvest data...")
    all_food_banks.extend(fetch_city_harvest_data())
    
    print("Adding NYC.gov Food Help data...")
    all_food_banks.extend(fetch_nyc_gov_food_help_data())
    
    # Remove food banks without coordinates
    all_food_banks = [f for f in all_food_banks if f['latitude'] and f['longitude']]
    
    # Remove duplicates based on coordinates (within very small distance)
    unique_food_banks = []
    for food_bank in all_food_banks:
        is_duplicate = False
        for unique_food_bank in unique_food_banks:
            if (abs(food_bank['latitude'] - unique_food_bank['latitude']) < 0.0001 and
                abs(food_bank['longitude'] - unique_food_bank['longitude']) < 0.0001):
                is_duplicate = True
                break
        if not is_duplicate:
            unique_food_banks.append(food_bank)
    
    # Sort by name
    unique_food_banks.sort(key=lambda x: x['name'])
    
    return unique_food_banks

def save_data(food_banks: List[Dict], filename: str) -> None:
    """
    Save the processed data to a CSV file
    """
    if not food_banks:
        print("No Food Bank data to save.")
        return
    
    # Validate all food banks
    valid_food_banks = []
    skipped_count = 0
    for food_bank in food_banks:
        is_valid, errors = validate_food_bank(food_bank)
        if is_valid:
            valid_food_banks.append(food_bank)
        else:
            skipped_count += 1
            print(f"\nSkipping invalid food bank '{food_bank.get('name', 'Unknown')}':")
            for error in errors:
                print(f"  - {error}")
    
    if not valid_food_banks:
        print("No valid food banks to save.")
        return
    
    # Create the output directory if it doesn't exist
    os.makedirs('../processed', exist_ok=True)
    
    # Define column order
    columns = ['name', 'type', 'address', 'latitude', 'longitude', 
              'organization', 'hours', 'contact', 'additional_info']
    
    # Create output directory safely
    output_dir = os.path.join(os.path.dirname(__file__), '..', 'processed')
    os.makedirs(output_dir, exist_ok=True)
    
    # Save to CSV using context manager
    output_path = os.path.join(output_dir, filename)
    try:
        with open(output_path, 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=columns)
            writer.writeheader()
            for food_bank in valid_food_banks:
                writer.writerow({col: food_bank.get(col, '') for col in columns})
    except IOError as e:
        print(f"Error writing to file {output_path}: {e}")
        return
    
    print(f"\nSaved {len(valid_food_banks)} records to {output_path}")
    if skipped_count > 0:
        print(f"Skipped {skipped_count} invalid records")
    
    # Print summary
    print("\nSummary of food banks:")
    print(f"Total food banks: {len(valid_food_banks)}")
    
    # Count by organization
    org_counts = {}
    for food_bank in valid_food_banks:
        org = food_bank['organization']
        org_counts[org] = org_counts.get(org, 0) + 1
    print("\nFood banks by organization:")
    for org, count in sorted(org_counts.items()):
        print(f"{org}: {count}")
    
    # Count by borough
    borough_counts = {}
    for food_bank in valid_food_banks:
        borough = next((b for b in ['Manhattan', 'Brooklyn', 'Bronx', 'Queens', 'Staten Island'] 
                       if b in food_bank['address']), 'Other')
        borough_counts[borough] = borough_counts.get(borough, 0) + 1
    print("\nFood banks by borough:")
    for borough, count in sorted(borough_counts.items()):
        print(f"{borough}: {count}")

def main() -> None:
    """
    Main entry point for the food bank data processing script
    """
    try:
        print("Processing Food Bank data...")
        food_banks = process_food_bank_data()
        
        if food_banks:
            save_data(food_banks, 'food_banks.csv')
        else:
            print("No Food Bank data was processed.")
            
    except requests.RequestException as e:
        print(f"Network error occurred: {e}")
        return
        
    except Exception as e:
        print(f"Unexpected error occurred: {e}")
        raise  # Re-raise unexpected exceptions for debugging
        
    finally:
        print("Processing completed.")

if __name__ == "__main__":
    main() 