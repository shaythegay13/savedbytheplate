import pandas as pd
import requests
from typing import List
import os


def fetch_greenthumb_data() -> pd.DataFrame:
    """
    Fetch GreenThumb community garden data from NYC Open Data
    """
    url = "https://data.cityofnewyork.us/resource/p78i-pat6.json"

    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()

        # Convert to DataFrame
        df = pd.DataFrame(data)

        # Standardize column names and select relevant columns
        df = df.rename(
            columns={
                "gardenname": "name",
                "address": "address",
                "latitude": "latitude",
                "longitude": "longitude",
                "openhours": "hours",
                "contactinfo": "contact",
            }
        )

        # Add standard fields
        df["type"] = "community_garden"
        df["organization"] = "GreenThumb"

        # Clean up latitude and longitude
        df["latitude"] = pd.to_numeric(df["latitude"], errors="coerce")
        df["longitude"] = pd.to_numeric(df["longitude"], errors="coerce")

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

        # Combine any additional information into additional_info field
        df["additional_info"] = df.apply(
            lambda row: create_additional_info(row, df.columns), axis=1
        )

        return df[columns].copy()

    except requests.exceptions.RequestException as e:
        print(f"Error fetching GreenThumb data: {e}")
        return pd.DataFrame()


def create_additional_info(row: pd.Series, all_columns: List[str]) -> str:
    """
    Combine all additional information into a single field
    """
    # Columns we don't want to include in additional info
    skip_columns = [
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

    info_parts = []
    for col in all_columns:
        if col not in skip_columns and pd.notna(row[col]):
            info_parts.append(f"{col}: {row[col]}")

    return "; ".join(info_parts)


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
    # Process GreenThumb data
    print("Fetching GreenThumb garden data...")
    greenthumb_df = fetch_greenthumb_data()

    if not greenthumb_df.empty:
        save_data(greenthumb_df, "greenthumb_gardens.csv")
    else:
        print("No GreenThumb data was processed.")


if __name__ == "__main__":
    main()
