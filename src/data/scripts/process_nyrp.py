import pandas as pd
import requests
from bs4 import BeautifulSoup
import geocoder
from typing import Dict, List, Tuple
import os
import time


def fetch_nyrp_gardens() -> List[Dict]:
    """
    Fetch and parse NYRP gardens from their website
    """
    url = "https://www.nyrp.org/en/gardens-and-parks/"
    gardens = []

    try:
        response = requests.get(url)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "html.parser")

        # Find all garden entries (you'll need to adjust these selectors based on the actual HTML structure)
        garden_elements = soup.find_all(
            "div", class_="garden-item"
        )  # Adjust class name as needed

        for element in garden_elements:
            garden = {
                "name": element.find("h3").text.strip() if element.find("h3") else "",
                "address": (
                    element.find("address").text.strip()
                    if element.find("address")
                    else ""
                ),
                "type": "community_garden",
                "organization": "NYRP",
                "website": (
                    f"https://www.nyrp.org{element.find('a')['href']}"
                    if element.find("a")
                    else ""
                ),
            }

            if garden["address"]:
                # Get coordinates from address
                location = geocode_address(garden["address"])
                if location:
                    garden["latitude"], garden["longitude"] = location
                time.sleep(1)  # Be nice to the geocoding service

            gardens.append(garden)

    except requests.exceptions.RequestException as e:
        print(f"Error fetching NYRP data: {e}")

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


def process_nyrp_data() -> pd.DataFrame:
    """
    Process NYRP garden data into a standardized DataFrame
    """
    gardens = fetch_nyrp_gardens()

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
    print("Processing NYRP garden data...")
    nyrp_df = process_nyrp_data()

    if not nyrp_df.empty:
        save_data(nyrp_df, "nyrp_gardens.csv")
    else:
        print("No NYRP data was processed.")


if __name__ == "__main__":
    main()
