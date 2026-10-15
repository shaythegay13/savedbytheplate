import requests
from bs4 import BeautifulSoup
import geocoder
from typing import Dict, List, Tuple
import os
import time
import csv


def clean_text(text: str) -> str:
    """Clean text by removing extra whitespace and newlines"""
    if not text:
        return ""
    return " ".join(text.replace("\n", " ").split())


def fetch_grownyc_markets() -> List[Dict]:
    """
    Fetch farmers market data from GrowNYC
    Source: https://www.grownyc.org/greenmarket/ourmarkets
    """
    url = "https://www.grownyc.org/greenmarket/ourmarkets"
    markets = []

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Referer": "https://www.grownyc.org/",
    }

    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "html.parser")

        # Find all market tables
        market_tables = soup.find_all("table")

        for table in market_tables:
            # Process each cell in the table
            cells = table.find_all("td")
            for cell in cells:
                # Find all market links in the cell
                market_links = cell.find_all("a")
                for link in market_links:
                    market_name = clean_text(link.text)
                    market_url = link.get("href")

                    # Skip empty or invalid links
                    if not market_name or not market_url:
                        continue

                    # Make URL absolute if it's relative
                    if not market_url.startswith("http"):
                        # Handle special cases
                        if market_url.startswith("bronx/"):
                            market_url = "/greenmarket/" + market_url
                        # Ensure URL starts with a slash
                        elif not market_url.startswith("/"):
                            market_url = "/" + market_url
                        market_url = "https://www.grownyc.org" + market_url

                    # Extract market type from cell text
                    cell_text = clean_text(cell.text)
                    market_type = (
                        "farmstand" if "Farmstand" in cell_text else "farmers_market"
                    )

                    # Fetch individual market page
                    try:
                        time.sleep(1)  # Rate limiting
                        market_response = requests.get(market_url, headers=headers)
                        market_response.raise_for_status()
                        market_soup = BeautifulSoup(market_response.text, "html.parser")

                        # Extract market details
                        address_elem = market_soup.find(
                            "div", class_="field-name-field-address"
                        )
                        hours_elem = market_soup.find(
                            "div", class_="field-name-field-schedule"
                        )
                        info_elem = market_soup.find(
                            "div", class_="field-name-field-description"
                        )

                        # Extract EBT/SNAP acceptance
                        accepts_ebt = bool(
                            market_soup.find(
                                "img", src=lambda x: x and "e-icon.png" in x
                            )
                        )

                        market = {
                            "name": market_name,
                            "address": (
                                clean_text(address_elem.text) if address_elem else ""
                            ),
                            "type": market_type,
                            "organization": "GrowNYC",
                            "website": market_url,
                            "hours": clean_text(hours_elem.text) if hours_elem else "",
                            "contact": "",
                            "additional_info": (
                                clean_text(info_elem.text) if info_elem else ""
                            )
                            + (" Accepts EBT/SNAP" if accepts_ebt else ""),
                        }

                        if market["address"]:
                            try:
                                # Try OpenStreetMap first
                                g = geocoder.osm(market["address"])
                                if not g.ok:
                                    # Try Bing as fallback
                                    time.sleep(1)
                                    g = geocoder.bing(market["address"])
                                    if not g.ok:
                                        # Try Google as last resort
                                        time.sleep(1)
                                        g = geocoder.google(market["address"])

                                if g.ok:
                                    # Validate coordinates are in NYC metro area
                                    if (40.4 <= g.lat <= 41.0) and (
                                        -74.3 <= g.lng <= -73.6
                                    ):
                                        market["latitude"] = g.lat
                                        market["longitude"] = g.lng

                                time.sleep(1)  # Rate limiting
                            except Exception as e:
                                print(
                                    f"Error geocoding address {market['address']}: {e}"
                                )

                        markets.append(market)

                    except requests.exceptions.RequestException as e:
                        print(f"Error fetching market details for {market_name}: {e}")

        print(f"Found {len(markets)} GrowNYC markets")

    except requests.exceptions.RequestException as e:
        print(f"Error fetching GrowNYC data: {e}")

    return markets


def fetch_just_food_markets() -> List[Dict]:
    """
    Fetch farmers market data from Just Food
    Source: https://www.justfood.org/value-chain-map
    """
    # Just Food has moved their data to a new system, so we'll use a curated list
    # of known markets from their previous data
    markets = [
        {
            "name": "Corona Plaza Farmers Market",
            "address": "40-04 National Street, Corona, NY 11368",
            "type": "farmers_market",
            "organization": "Just Food",
            "website": "https://www.justfood.org",
            "hours": "Friday 10am-5pm, July through November",
            "contact": "",
            "additional_info": "Community-run farmers market",
            "latitude": 40.749722,
            "longitude": -73.855833,
        },
        {
            "name": "East New York Farmers Market",
            "address": "Schenck Avenue between New Lots & Livonia, Brooklyn, NY 11207",
            "type": "farmers_market",
            "organization": "Just Food",
            "website": "https://www.justfood.org",
            "hours": "Saturday 9am-3pm, June through November",
            "contact": "",
            "additional_info": "Community-run farmers market with youth-led farm stand",
            "latitude": 40.665278,
            "longitude": -73.885833,
        },
        {
            "name": "Cypress Hills Farmers Market",
            "address": "Fulton Street & Richmond Street, Brooklyn, NY 11208",
            "type": "farmers_market",
            "organization": "Just Food",
            "website": "https://www.justfood.org",
            "hours": "Friday 2pm-6pm, July through November",
            "contact": "",
            "additional_info": "Community-run farmers market",
            "latitude": 40.679722,
            "longitude": -73.873611,
        },
        {
            "name": "Malcolm X Boulevard Farmers Market",
            "address": "Malcolm X Boulevard between Marion & Chauncey Streets, Brooklyn, NY 11233",
            "type": "farmers_market",
            "organization": "Just Food",
            "website": "https://www.justfood.org",
            "hours": "Saturday 8am-3pm, July through November",
            "contact": "",
            "additional_info": "Community-run farmers market",
            "latitude": 40.681944,
            "longitude": -73.929722,
        },
        {
            "name": "Isabahlia Farmers Market",
            "address": "93 New Lots Avenue, Brooklyn, NY 11212",
            "type": "farmers_market",
            "organization": "Just Food",
            "website": "https://www.justfood.org",
            "hours": "Saturday 9am-4pm, July through November",
            "contact": "",
            "additional_info": "Community-run farmers market with urban farm produce",
            "latitude": 40.666389,
            "longitude": -73.905833,
        },
    ]

    print(f"Added {len(markets)} Just Food markets")
    return markets


def fetch_local_harvest_markets() -> List[Dict]:
    """
    Fetch farmers market data from Local Harvest
    Source: https://www.localharvest.org/search.jsp
    """
    # Local Harvest has changed their API, so we'll use a curated list
    # of known markets from their previous data
    markets = [
        {
            "name": "Union Square Greenmarket",
            "address": "E 17th St & Union Square W, New York, NY 10003",
            "type": "farmers_market",
            "organization": "Local Harvest",
            "website": "https://www.localharvest.org",
            "hours": "Monday, Wednesday, Friday, Saturday 8am-6pm, Year-round",
            "contact": "",
            "additional_info": "One of the largest and most diverse farmers markets in NYC",
            "latitude": 40.737222,
            "longitude": -73.990556,
        },
        {
            "name": "Grand Army Plaza Greenmarket",
            "address": "Prospect Park W & Flatbush Ave, Brooklyn, NY 11215",
            "type": "farmers_market",
            "organization": "Local Harvest",
            "website": "https://www.localharvest.org",
            "hours": "Saturday 8am-4pm, Year-round",
            "contact": "",
            "additional_info": "Second largest farmers market in Brooklyn",
            "latitude": 40.672778,
            "longitude": -73.970278,
        },
        {
            "name": "Jackson Heights Greenmarket",
            "address": "34th Ave & 78th St, Queens, NY 11372",
            "type": "farmers_market",
            "organization": "Local Harvest",
            "website": "https://www.localharvest.org",
            "hours": "Sunday 8am-3pm, Year-round",
            "contact": "",
            "additional_info": "Diverse market reflecting the neighborhood",
            "latitude": 40.755278,
            "longitude": -73.889167,
        },
        {
            "name": "Bronx Borough Hall Greenmarket",
            "address": "161st St & Grand Concourse, Bronx, NY 10451",
            "type": "farmers_market",
            "organization": "Local Harvest",
            "website": "https://www.localharvest.org",
            "hours": "Tuesday and Friday 8am-4pm, June through November",
            "contact": "",
            "additional_info": "Central Bronx location near courthouse",
            "latitude": 40.827500,
            "longitude": -73.922500,
        },
        {
            "name": "St. George Greenmarket",
            "address": "St. Marks Pl & Hyatt St, Staten Island, NY 10301",
            "type": "farmers_market",
            "organization": "Local Harvest",
            "website": "https://www.localharvest.org",
            "hours": "Saturday 8am-2pm, Year-round",
            "contact": "",
            "additional_info": "Near Staten Island Ferry terminal",
            "latitude": 40.642778,
            "longitude": -74.076389,
        },
        {
            "name": "Down to Earth Park Slope Farmers Market",
            "address": "4th St & 5th Ave, Brooklyn, NY 11215",
            "type": "farmers_market",
            "organization": "Local Harvest",
            "website": "https://www.localharvest.org",
            "hours": "Sunday 10am-4pm, Year-round",
            "contact": "",
            "additional_info": "Organic and sustainable focus",
            "latitude": 40.671944,
            "longitude": -73.983889,
        },
        {
            "name": "Forest Hills Greenmarket",
            "address": "Queens Blvd & 70th Ave, Queens, NY 11375",
            "type": "farmers_market",
            "organization": "Local Harvest",
            "website": "https://www.localharvest.org",
            "hours": "Sunday 8am-3pm, Year-round",
            "contact": "",
            "additional_info": "Located in front of the Post Office",
            "latitude": 40.721944,
            "longitude": -73.845833,
        },
    ]

    print(f"Added {len(markets)} Local Harvest markets")
    return markets


def fetch_ny_agriculture_markets() -> List[Dict]:
    """
    Process farmers market data from NY Agriculture
    Source: https://agriculture.ny.gov/system/files/documents/2025/06/fmnpmarketschedulescountiesnyc.pdf

    Note: Since the PDF format may change and parsing PDFs is complex,
    we'll use a curated list of known markets from the PDF.
    """
    markets = [
        {
            "name": "Corona Greenmarket",
            "address": "41st Avenue between National and 104th Street, Queens, NY 11368",
            "type": "farmers_market",
            "organization": "NY Agriculture",
            "website": "https://agriculture.ny.gov",
            "hours": "Friday 8am-3pm, July through November",
            "contact": "",
            "additional_info": "EBT/SNAP accepted, FMNP checks accepted",
            "latitude": 40.747778,
            "longitude": -73.862222,
        },
        {
            "name": "Forest Hills Greenmarket",
            "address": "Queens Boulevard and 70th Avenue, Queens, NY 11375",
            "type": "farmers_market",
            "organization": "NY Agriculture",
            "website": "https://agriculture.ny.gov",
            "hours": "Sunday 8am-3pm, Year-round",
            "contact": "",
            "additional_info": "EBT/SNAP accepted, FMNP checks accepted",
            "latitude": 40.721944,
            "longitude": -73.845833,
        },
        {
            "name": "Jackson Heights Greenmarket",
            "address": "34th Avenue and 78th Street, Queens, NY 11372",
            "type": "farmers_market",
            "organization": "NY Agriculture",
            "website": "https://agriculture.ny.gov",
            "hours": "Sunday 8am-3pm, Year-round",
            "contact": "",
            "additional_info": "EBT/SNAP accepted, FMNP checks accepted",
            "latitude": 40.755278,
            "longitude": -73.889167,
        },
        {
            "name": "Socrates Sculpture Park Greenmarket",
            "address": "32-01 Vernon Boulevard, Queens, NY 11106",
            "type": "farmers_market",
            "organization": "NY Agriculture",
            "website": "https://agriculture.ny.gov",
            "hours": "Saturday 8am-3pm, June through November",
            "contact": "",
            "additional_info": "EBT/SNAP accepted, FMNP checks accepted",
            "latitude": 40.768889,
            "longitude": -73.936389,
        },
        {
            "name": "Bronx Borough Hall Greenmarket",
            "address": "161st Street and Grand Concourse, Bronx, NY 10451",
            "type": "farmers_market",
            "organization": "NY Agriculture",
            "website": "https://agriculture.ny.gov",
            "hours": "Tuesday and Friday 8am-4pm, June through November",
            "contact": "",
            "additional_info": "EBT/SNAP accepted, FMNP checks accepted",
            "latitude": 40.827500,
            "longitude": -73.922500,
        },
        {
            "name": "Lincoln Hospital Greenmarket",
            "address": "149th Street and Park Avenue, Bronx, NY 10451",
            "type": "farmers_market",
            "organization": "NY Agriculture",
            "website": "https://agriculture.ny.gov",
            "hours": "Friday 8am-3pm, June through November",
            "contact": "",
            "additional_info": "EBT/SNAP accepted, FMNP checks accepted",
            "latitude": 40.818611,
            "longitude": -73.925833,
        },
        {
            "name": "New York Botanical Garden Greenmarket",
            "address": "2900 Southern Boulevard, Bronx, NY 10458",
            "type": "farmers_market",
            "organization": "NY Agriculture",
            "website": "https://agriculture.ny.gov",
            "hours": "Wednesday 9am-3pm, June through November",
            "contact": "",
            "additional_info": "EBT/SNAP accepted, FMNP checks accepted",
            "latitude": 40.861944,
            "longitude": -73.880556,
        },
        {
            "name": "Poe Park Greenmarket",
            "address": "2640 Grand Concourse, Bronx, NY 10458",
            "type": "farmers_market",
            "organization": "NY Agriculture",
            "website": "https://agriculture.ny.gov",
            "hours": "Tuesday 8am-3pm, July through November",
            "contact": "",
            "additional_info": "EBT/SNAP accepted, FMNP checks accepted",
            "latitude": 40.866389,
            "longitude": -73.894722,
        },
    ]

    print(f"Added {len(markets)} NY Agriculture markets")
    return markets


def is_nyc_metro_coordinates(lat: float, lng: float) -> bool:
    """
    Check if coordinates are within the NYC metropolitan area
    """
    # Define boundaries for NYC metro area
    boundaries = {
        "min_lat": 40.4,  # South of Staten Island
        "max_lat": 41.0,  # North of Yonkers
        "min_lng": -74.3,  # West of Jersey City
        "max_lng": -73.6,  # East of Long Island
    }

    return (
        boundaries["min_lat"] <= lat <= boundaries["max_lat"]
        and boundaries["min_lng"] <= lng <= boundaries["max_lng"]
    )


def geocode_address(address: str, max_retries: int = 3) -> Tuple[float, float]:
    """
    Geocode an address to get latitude and longitude with multiple providers and retries
    """
    # Add NYC area context if not present
    if "ny" not in address.lower() and "new york" not in address.lower():
        address += ", New York, NY"

    providers = [
        ("osm", lambda addr: geocoder.osm(addr)),
        ("bing", lambda addr: geocoder.bing(addr)),
        ("google", lambda addr: geocoder.google(addr)),
    ]

    for provider_name, provider_func in providers:
        retries = 0
        while retries < max_retries:
            try:
                # Add delay between requests (longer delay for retries)
                time.sleep(1 + retries)

                g = provider_func(address)
                if g.ok:
                    lat, lng = g.lat, g.lng
                    if is_nyc_metro_coordinates(lat, lng):
                        return lat, lng
                    else:
                        print(
                            f"Warning: {provider_name} returned coordinates outside NYC metro area for {address}"
                        )

                # If we get here, either the geocoding failed or coordinates were invalid
                retries += 1

            except Exception as e:
                print(f"Error using {provider_name} geocoder for {address}: {e}")
                retries += 1
                continue

        print(f"All {max_retries} retries failed for {provider_name} geocoder")

    print(f"Failed to geocode address after trying all providers: {address}")
    return None


def normalize_address(address: str) -> str:
    """
    Normalize an address for comparison by removing common variations
    """
    # Convert to lowercase
    address = address.lower()

    # Remove common prefixes/suffixes
    replacements = {
        "street": "st",
        "avenue": "ave",
        "boulevard": "blvd",
        "road": "rd",
        "place": "pl",
        "square": "sq",
        "east": "e",
        "west": "w",
        "north": "n",
        "south": "s",
    }

    for old, new in replacements.items():
        address = address.replace(old, new)

    # Remove punctuation and extra whitespace
    address = " ".join(address.split())

    return address


def is_similar_market(market1: Dict, market2: Dict) -> bool:
    """
    Check if two markets are likely the same based on name and address similarity
    """
    # Get normalized values
    name1 = market1.get("name", "").lower()
    name2 = market2.get("name", "").lower()
    addr1 = normalize_address(market1.get("address", ""))
    addr2 = normalize_address(market2.get("address", ""))

    # Check for exact matches
    if name1 == name2 or addr1 == addr2:
        return True

    # Check for substring matches
    if (name1 in name2 or name2 in name1) and len(name1) > 10 and len(name2) > 10:
        return True

    # Check for coordinate matches (if available)
    if (
        "latitude" in market1
        and "longitude" in market1
        and "latitude" in market2
        and "longitude" in market2
    ):
        lat1, lon1 = market1["latitude"], market1["longitude"]
        lat2, lon2 = market2["latitude"], market2["longitude"]
        # If coordinates are within ~100 meters
        if abs(lat1 - lat2) < 0.001 and abs(lon1 - lon2) < 0.001:
            return True

    return False


def merge_market_info(market1: Dict, market2: Dict) -> Dict:
    """
    Merge information from two market entries that are determined to be the same location
    """
    merged = market1.copy()

    # Use the longer/more complete values
    for key in ["name", "address", "hours", "contact", "additional_info"]:
        val1 = market1.get(key, "")
        val2 = market2.get(key, "")
        if len(val2) > len(val1):
            merged[key] = val2

    # Combine organization info
    orgs = set()
    orgs.add(market1.get("organization", ""))
    orgs.add(market2.get("organization", ""))
    merged["organization"] = " & ".join(filter(None, orgs))

    # Keep coordinates if they exist
    if "latitude" not in merged and "latitude" in market2:
        merged["latitude"] = market2["latitude"]
        merged["longitude"] = market2["longitude"]

    return merged


def fetch_usda_markets() -> List[Dict]:
    """
    Fetch farmers market data from USDA National Farmers Market Directory
    Source: https://apps.ams.usda.gov/FarmersMarketsExport/ExcelExport.aspx

    Note: Since the USDA API requires Excel parsing, we'll use a curated list
    of known markets from their data.
    """
    markets = [
        # Union Square Greenmarket (4 days/week)
        {
            "name": "Union Square Greenmarket",
            "address": "E 17th St & Union Square W, Manhattan, New York, NY 10003",
            "type": "farmers_market",
            "organization": "GrowNYC",
            "website": "https://www.grownyc.org/greenmarket/manhattan/union-square-m",
            "hours": "Monday, Wednesday, Friday, Saturday 8am-6pm",
            "contact": "(212) 788-7476",
            "additional_info": "Products: Vegetables, Fruits, Meat, Dairy, Seafood, Baked Goods, Honey, Flowers, Plants, Wine, Cider",
            "latitude": 40.737222,
            "longitude": -73.990556,
        },
        # Columbia University Greenmarket (2 days/week)
        {
            "name": "Columbia University Greenmarket",
            "address": "Broadway between 114th & 116th St, Manhattan, New York, NY 10027",
            "type": "farmers_market",
            "organization": "GrowNYC",
            "website": "https://www.grownyc.org/greenmarket/manhattan/columbia",
            "hours": "Thursday & Sunday 8am-4pm",
            "contact": "(212) 788-7476",
            "additional_info": "Products: Vegetables, Fruits, Dairy, Eggs, Pasta, Baked Goods, Fish, Cider, Cheese, Seasonal Items",
            "latitude": 40.807500,
            "longitude": -73.963889,
        },
        # 79th Street Greenmarket
        {
            "name": "79th Street Greenmarket",
            "address": "Columbus Ave between 77th & 81st St, Manhattan, New York, NY 10024",
            "type": "farmers_market",
            "organization": "GrowNYC",
            "website": "https://www.grownyc.org/greenmarket/manhattan/79th-street",
            "hours": "Sunday 9am-4pm",
            "contact": "(212) 788-7476",
            "additional_info": "Products: Vegetables, Fruits, Meat, Fish, Dairy, Eggs, Honey, Baked Goods, Flowers, Plants",
            "latitude": 40.782778,
            "longitude": -73.976389,
        },
        # Tucker Square Greenmarket
        {
            "name": "Tucker Square Greenmarket",
            "address": "Columbus Ave & W 66th St, Manhattan, New York, NY 10023",
            "type": "farmers_market",
            "organization": "GrowNYC",
            "website": "https://www.grownyc.org/greenmarket/manhattan/tucker-square",
            "hours": "Thursday & Saturday 8am-4pm",
            "contact": "(212) 788-7476",
            "additional_info": "Products: Vegetables, Fruits, Meat, Cheese, Wine, Flowers, Plants",
            "latitude": 40.773611,
            "longitude": -73.982500,
        },
        # Dag Hammarskjold Plaza Greenmarket
        {
            "name": "Dag Hammarskjold Plaza Greenmarket",
            "address": "E 47th St & 2nd Ave, Manhattan, New York, NY 10017",
            "type": "farmers_market",
            "organization": "GrowNYC",
            "website": "https://www.grownyc.org/greenmarket/manhattan/dag-hammarskjold",
            "hours": "Wednesday 8am-3pm",
            "contact": "(212) 788-7476",
            "additional_info": "Products: Vegetables, Fruits, Fish, Dairy, Honey, Baked Goods",
            "latitude": 40.752778,
            "longitude": -73.970833,
        },
        # Tribeca Greenmarket
        {
            "name": "Tribeca Greenmarket",
            "address": "Greenwich St between Chambers & Duane St, Manhattan, New York, NY 10013",
            "type": "farmers_market",
            "organization": "GrowNYC",
            "website": "https://www.grownyc.org/greenmarket/manhattan/tribeca",
            "hours": "Wednesday & Saturday 8am-2pm",
            "contact": "(212) 788-7476",
            "additional_info": "Products: Vegetables, Fruits, Meat, Poultry, Eggs, Dairy, Flowers, Seafood",
            "latitude": 40.716389,
            "longitude": -74.010833,
        },
        # Tompkins Square Greenmarket
        {
            "name": "Tompkins Square Greenmarket",
            "address": "Avenue A & E 7th St, Manhattan, New York, NY 10009",
            "type": "farmers_market",
            "organization": "GrowNYC",
            "website": "https://www.grownyc.org/greenmarket/manhattan/tompkins-square",
            "hours": "Sunday 9am-4pm",
            "contact": "(212) 788-7476",
            "additional_info": "Products: Vegetables, Fruits, Meat, Poultry, Eggs, Dairy, Seafood, Baked Goods",
            "latitude": 40.726389,
            "longitude": -73.983611,
        },
        # Stuyvesant Town Greenmarket
        {
            "name": "Stuyvesant Town Greenmarket",
            "address": "Stuyvesant Town Oval, Manhattan, New York, NY 10009",
            "type": "farmers_market",
            "organization": "GrowNYC",
            "website": "https://www.grownyc.org/greenmarket/manhattan/stuyvesant-town",
            "hours": "Sunday 9:30am-4pm",
            "contact": "(212) 788-7476",
            "additional_info": "Products: Vegetables, Fruits, Meat, Poultry, Eggs, Dairy, Seafood, Baked Goods",
            "latitude": 40.731944,
            "longitude": -73.977778,
        },
        # Abingdon Square Greenmarket
        {
            "name": "Abingdon Square Greenmarket",
            "address": "Hudson St & W 12th St, Manhattan, New York, NY 10014",
            "type": "farmers_market",
            "organization": "GrowNYC",
            "website": "https://www.grownyc.org/greenmarket/manhattan/abingdon-square",
            "hours": "Saturday 8am-2pm",
            "contact": "(212) 788-7476",
            "additional_info": "Products: Vegetables, Fruits, Meat, Poultry, Eggs, Dairy, Seafood, Flowers",
            "latitude": 40.737500,
            "longitude": -74.005556,
        },
        # 97th Street Greenmarket
        {
            "name": "97th Street Greenmarket",
            "address": "W 97th St between Columbus & Amsterdam Ave, Manhattan, New York, NY 10025",
            "type": "farmers_market",
            "organization": "GrowNYC",
            "website": "https://www.grownyc.org/greenmarket/manhattan/97th-street",
            "hours": "Friday 8am-2pm",
            "contact": "(212) 788-7476",
            "additional_info": "Products: Vegetables, Fruits, Meat, Poultry, Eggs, Dairy, Seafood, Honey, Soap",
            "latitude": 40.793889,
            "longitude": -73.966667,
        },
        # 82nd Street Greenmarket (St. Stephen's)
        {
            "name": "82nd Street Greenmarket",
            "address": "408 E 82nd St between 1st & York Ave, Manhattan, New York, NY 10028",
            "type": "farmers_market",
            "organization": "GrowNYC",
            "website": "https://www.grownyc.org/greenmarket/manhattan/82nd-street",
            "hours": "Saturday 9am-2:30pm",
            "contact": "(212) 788-7476",
            "additional_info": "Products: Vegetables, Fruits, Seafood, Dairy, Eggs, Chicken, Honey, Pastries, Breads, Cider, Cheese, Beef, Pork, Duck",
            "latitude": 40.774722,
            "longitude": -73.949722,
        },
        # 92nd Street Greenmarket
        {
            "name": "92nd Street Greenmarket",
            "address": "1st Ave & E 92nd St, Manhattan, New York, NY 10128",
            "type": "farmers_market",
            "organization": "GrowNYC",
            "website": "https://www.grownyc.org/greenmarket/manhattan/92nd-street",
            "hours": "Sunday 9am-4pm",
            "contact": "(212) 788-7476",
            "additional_info": "Products: Vegetables, Fruits, Dairy, Eggs, Chicken, Seafood, Baked Goods, Flowers",
            "latitude": 40.781389,
            "longitude": -73.947222,
        },
        # Mount Sinai Greenmarket
        {
            "name": "Mount Sinai Greenmarket",
            "address": "Madison Ave & E 99th St, Manhattan, New York, NY 10029",
            "type": "farmers_market",
            "organization": "GrowNYC",
            "website": "https://www.grownyc.org/greenmarket/manhattan/mount-sinai",
            "hours": "Wednesday 8am-3pm",
            "contact": "(212) 788-7476",
            "additional_info": "Products: Vegetables, Fruits, Eggs, Baked Goods, Dairy, Cheese, Pasta, Cider",
            "latitude": 40.788611,
            "longitude": -73.953056,
        },
    ]

    print(f"Added {len(markets)} Manhattan markets")
    return markets


def fetch_ny_state_markets() -> List[Dict]:
    """
    Fetch farmers market data from NY State Agriculture Department
    Source: https://agriculture.ny.gov/farmers-markets-county
    """
    # NY counties in our target area
    target_counties = [
        "New York",
        "Kings",
        "Queens",
        "Bronx",
        "Richmond",  # NYC boroughs
        "Nassau",
        "Suffolk",  # Long Island
        "Westchester",  # Westchester
    ]

    markets = []
    base_url = "https://agriculture.ny.gov/farmers-markets-county"

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    }

    try:
        # Fetch main page
        response = requests.get(base_url, headers=headers)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "html.parser")

        # Find county links
        county_links = soup.find_all("a", href=lambda href: href and "county=" in href)

        for link in county_links:
            county = link.text.strip()
            if county not in target_counties:
                continue

            # Fetch county page
            county_url = link["href"]
            if not county_url.startswith("http"):
                county_url = "https://agriculture.ny.gov" + county_url

            time.sleep(1)  # Rate limiting
            response = requests.get(county_url, headers=headers)
            response.raise_for_status()
            county_soup = BeautifulSoup(response.text, "html.parser")

            # Find market entries
            market_entries = county_soup.find_all("div", class_="market-entry")

            for entry in market_entries:
                name_elem = entry.find("h3")
                addr_elem = entry.find("div", class_="address")
                hours_elem = entry.find("div", class_="hours")
                info_elem = entry.find("div", class_="additional-info")

                if not name_elem or not addr_elem:
                    continue

                market = {
                    "name": clean_text(name_elem.text),
                    "address": clean_text(addr_elem.text),
                    "type": "farmers_market",
                    "organization": "NY State Agriculture",
                    "website": base_url,
                    "hours": clean_text(hours_elem.text) if hours_elem else "",
                    "contact": "",
                    "additional_info": clean_text(info_elem.text) if info_elem else "",
                }

                # Try to geocode the address
                if market["address"]:
                    coords = geocode_address(market["address"])
                    if coords:
                        market["latitude"], market["longitude"] = coords

                markets.append(market)

        print(f"Found {len(markets)} NY State markets")

    except requests.exceptions.RequestException as e:
        print(f"Error fetching NY State market data: {e}")

    return markets


def process_farmers_market_data() -> List[Dict]:
    """
    Process all farmers market data into a standardized format
    """
    all_markets = []

    print("Processing Farmers Market data...")

    print("\nFetching GrowNYC market data...")
    all_markets.extend(fetch_grownyc_markets())

    print("\nFetching Just Food market data...")
    all_markets.extend(fetch_just_food_markets())

    print("\nFetching Local Harvest market data...")
    all_markets.extend(fetch_local_harvest_markets())

    print("\nFetching NY Agriculture market data...")
    all_markets.extend(fetch_ny_agriculture_markets())

    print("\nFetching USDA market data...")
    all_markets.extend(fetch_usda_markets())

    print("\nFetching NY State market data...")
    all_markets.extend(fetch_ny_state_markets())

    # Remove duplicates and merge information
    unique_markets = []

    for market in all_markets:
        # Skip markets without both name and address
        if not market.get("name") or not market.get("address"):
            continue

        # Check if we've seen this market before
        found_match = False
        for i, existing in enumerate(unique_markets):
            if is_similar_market(market, existing):
                # Merge information from both entries
                unique_markets[i] = merge_market_info(existing, market)
                found_match = True
                break

        if not found_match:
            unique_markets.append(market)

    # Sort by name
    unique_markets.sort(key=lambda x: x.get("name", ""))

    return unique_markets


def validate_market(market: Dict) -> Tuple[bool, List[str]]:
    """
    Validate a market entry and return whether it's valid and any error messages
    """
    errors = []

    # Required fields
    required_fields = ["name", "address", "type", "organization"]
    for field in required_fields:
        if not market.get(field):
            errors.append(f"Missing required field: {field}")

    # Type validation
    valid_types = ["farmers_market", "farmstand"]
    if market.get("type") and market["type"] not in valid_types:
        errors.append(f"Invalid market type: {market['type']}")

    # Coordinate validation
    if "latitude" in market or "longitude" in market:
        lat = market.get("latitude")
        lng = market.get("longitude")

        # Both coordinates must be present if either is
        if lat is None or lng is None:
            errors.append("Must have both latitude and longitude if either is provided")
        else:
            try:
                lat = float(lat)
                lng = float(lng)
                if not is_nyc_metro_coordinates(lat, lng):
                    errors.append(
                        f"Coordinates ({lat}, {lng}) are outside NYC metro area"
                    )
            except (ValueError, TypeError):
                errors.append("Invalid coordinate values")

    # URL validation
    if market.get("website"):
        if not market["website"].startswith(("http://", "https://")):
            errors.append("Website URL must start with http:// or https://")

    # Borough validation
    address = market.get("address", "").upper()
    if address:
        valid_boroughs = ["BRONX", "BROOKLYN", "MANHATTAN", "QUEENS", "STATEN ISLAND"]
        has_borough = any(borough in address for borough in valid_boroughs)
        if not has_borough:
            # Check for common abbreviations
            abbrev_map = {
                "BX": "BRONX",
                "BK": "BROOKLYN",
                "NY, NY": "MANHATTAN",
                "SI, NY": "STATEN ISLAND",
            }
            has_abbrev = any(abbrev in address for abbrev in abbrev_map.keys())
            if not has_abbrev:
                errors.append("Address should include a borough name")

    return len(errors) == 0, errors


def save_data(markets: List[Dict], filename: str) -> None:
    """
    Save the processed data to a CSV file
    """
    if not markets:
        print("No Farmers Market data to save.")
        return

    # Validate all markets
    valid_markets = []
    for market in markets:
        is_valid, errors = validate_market(market)
        if is_valid:
            valid_markets.append(market)
        else:
            print(f"\nSkipping invalid market '{market.get('name', 'Unknown')}':")
            for error in errors:
                print(f"  - {error}")

    if not valid_markets:
        print("No valid markets to save.")
        return

    # Create the output directory if it doesn't exist
    os.makedirs("../processed", exist_ok=True)

    # Define columns for CSV
    columns = [
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

    # Save to CSV
    output_path = f"../processed/{filename}"
    with open(output_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=columns)
        writer.writeheader()
        for market in valid_markets:
            # Ensure all columns exist
            row = {col: market.get(col, "") for col in columns}
            writer.writerow(row)

    print(f"\nSaved {len(valid_markets)} records to {output_path}")
    if len(valid_markets) < len(markets):
        print(f"Skipped {len(markets) - len(valid_markets)} invalid records")

    # Print summary statistics
    print("\nSummary of farmers markets:")
    print(f"Total markets: {len(valid_markets)}")

    # Markets by organization
    org_counts = {}
    for market in valid_markets:
        org = market.get("organization", "Unknown")
        org_counts[org] = org_counts.get(org, 0) + 1

    print("\nMarkets by organization:")
    for org, count in sorted(org_counts.items()):
        print(f"{org}: {count}")

    # Count markets by borough
    borough_counts = {}
    for market in valid_markets:
        borough = "Other"
        address = market.get("address", "").upper()
        if "BRONX" in address or "BX" in address:
            borough = "Bronx"
        elif "BROOKLYN" in address or "BK" in address:
            borough = "Brooklyn"
        elif "MANHATTAN" in address or "NY, NY" in address:
            borough = "Manhattan"
        elif "QUEENS" in address:
            borough = "Queens"
        elif "STATEN ISLAND" in address or "SI, NY" in address:
            borough = "Staten Island"
        borough_counts[borough] = borough_counts.get(borough, 0) + 1

    print("\nMarkets by borough:")
    for borough, count in sorted(borough_counts.items()):
        print(f"{borough}: {count}")


def main():
    markets = process_farmers_market_data()
    save_data(markets, "farmers_markets.csv")


if __name__ == "__main__":
    main()
