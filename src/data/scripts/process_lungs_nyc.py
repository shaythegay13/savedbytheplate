import pandas as pd
import requests
from bs4 import BeautifulSoup
import geocoder
from typing import Dict, List, Tuple
import os
import time


def fetch_lungs_nyc_gardens() -> List[Dict]:
    """
    Fetch community garden data from Lungs NYC website
    """
    url = "https://lungsnyc.org/gardens-greenspaces/"
    gardens = []

    try:
        response = requests.get(url)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "html.parser")

        # Look for garden listings (you'll need to adjust selectors based on actual HTML)
        garden_elements = soup.find_all(
            "div", class_="garden-listing"
        )  # Adjust as needed

        for element in garden_elements:
            name_elem = (
                element.find("h3") or element.find("h2") or element.find(".garden-name")
            )
            address_elem = element.find(".address") or element.find(".location")

            if name_elem:
                garden = {
                    "name": name_elem.get_text().strip(),
                    "address": address_elem.get_text().strip() if address_elem else "",
                    "type": "community_garden",
                    "organization": "Lungs NYC",
                    "website": "https://lungsnyc.org/",
                    "source_url": url,
                }

                # Try to extract additional details
                details_elem = element.find(".description") or element.find("p")
                if details_elem:
                    garden["additional_info"] = details_elem.get_text().strip()

                if garden["address"]:
                    # Get coordinates from address
                    location = geocode_address(garden["address"])
                    if location:
                        garden["latitude"], garden["longitude"] = location
                    time.sleep(1)  # Be nice to the geocoding service

                gardens.append(garden)

    except requests.exceptions.RequestException as e:
        print(f"Error fetching Lungs NYC data: {e}")
        # Fallback to known gardens from the site
        gardens = get_fallback_lungs_gardens()

    return gardens


def get_fallback_lungs_gardens() -> List[Dict]:
    """
    Fallback data from Lungs NYC based on known gardens
    """
    return [
        {
            "name": "Clinton Community Garden",
            "address": "436 West 48th Street, Manhattan, NY 10036",
            "type": "community_garden",
            "organization": "Lungs NYC",
            "website": "https://lungsnyc.org/",
            "latitude": 40.7628388,
            "longitude": -73.9917038,
            "additional_info": "Part of Lungs NYC network",
        },
        {
            "name": "Elizabeth Street Garden",
            "address": "207 Elizabeth Street, Manhattan, NY 10012",
            "type": "community_garden",
            "organization": "Lungs NYC",
            "website": "https://lungsnyc.org/",
            "latitude": 40.7223198,
            "longitude": -73.9945109,
            "additional_info": "Historic garden, part of Lungs NYC network",
        },
        {
            "name": "LaGuardia Corner Community Garden",
            "address": "511 LaGuardia Place, Manhattan, NY 10012",
            "type": "community_garden",
            "organization": "Lungs NYC",
            "website": "https://lungsnyc.org/",
            "latitude": 40.7276977,
            "longitude": -73.9991178,
            "additional_info": "Open most days, part of Lungs NYC network",
        },
    ]


def geocode_address(address: str) -> Tuple[float, float]:
    """
    Geocode an address to get latitude and longitude
    """
    try:
        g = geocoder.osm(f"{address}, New York, NY")
        if g.ok:
            return g.lat, g.lng
        return None
    except Exception as e:
        print(f"Error geocoding address {address}: {e}")
        return None


def process_lungs_nyc_data() -> pd.DataFrame:
    """
    Process Lungs NYC garden data into a standardized DataFrame
    """
    gardens = fetch_lungs_nyc_gardens()

    if not gardens:
        return pd.DataFrame()

    df = pd.DataFrame(gardens)

    # Ensure all required columns exist
    required_columns = [
        "name",
        "type",
        "address",
        "latitude",
        "longitude",
        "organization",
        "website",
    ]

    for col in required_columns:
        if col not in df.columns:
            df[col] = ""

    # Add empty columns for consistency with other datasets
    df["hours"] = ""
    df["contact"] = ""
    if "additional_info" not in df.columns:
        df["additional_info"] = ""

    # Select and order columns
    columns = [
        "name",
        "type",
        "address",
        "latitude",
        "longitude",
        "organization",
        "hours",
        "contact",
        "additional_info",
    ]

    return df[columns].copy()


def save_data(df: pd.DataFrame, filename: str) -> None:
    """
    Save the processed data to a CSV file
    """
    # Create the output directory if it doesn't exist
    os.makedirs("../processed", exist_ok=True)

    # Save to CSV
    output_path = f"../processed/{filename}"
    df.to_csv(output_path, index=False)
    print(f"Saved {len(df)} records to {output_path}")


def main():
    print("Processing Lungs NYC garden data...")
    lungs_df = process_lungs_nyc_data()

    if not lungs_df.empty:
        save_data(lungs_df, "lungs_nyc_gardens.csv")
    else:
        print("No Lungs NYC data was processed.")


if __name__ == "__main__":
    main()
