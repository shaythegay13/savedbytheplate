import pandas as pd
import os
from typing import List
import glob


def load_csv_files() -> List[pd.DataFrame]:
    """
    Load all processed CSV files from the processed directory
    """
    processed_dir = "../processed"
    dfs = []

    # Get all CSV files in the processed directory
    csv_files = glob.glob(os.path.join(processed_dir, "*.csv"))

    for file in csv_files:
        try:
            df = pd.read_csv(file)
            print(f"Loaded {len(df)} records from {file}")
            dfs.append(df)
        except Exception as e:
            print(f"Error loading {file}: {e}")

    return dfs


def combine_dataframes(dfs: List[pd.DataFrame]) -> pd.DataFrame:
    """
    Combine all DataFrames into a single DataFrame
    """
    if not dfs:
        return pd.DataFrame()

    # Concatenate all DataFrames
    combined_df = pd.concat(dfs, ignore_index=True)

    # Remove any duplicate entries based on name and address
    combined_df = combined_df.drop_duplicates(subset=["name", "address"])

    # Sort by organization and name
    combined_df = combined_df.sort_values(["organization", "name"])

    return combined_df


def validate_data(df: pd.DataFrame) -> pd.DataFrame:
    """
    Validate and clean the combined data
    """
    # Remove rows with missing essential data
    df = df.dropna(subset=["name", "address"])

    # Convert latitude and longitude to numeric, removing invalid values
    df["latitude"] = pd.to_numeric(df["latitude"], errors="coerce")
    df["longitude"] = pd.to_numeric(df["longitude"], errors="coerce")

    # Remove rows with invalid coordinates
    df = df.dropna(subset=["latitude", "longitude"])

    # Ensure all required columns exist
    required_columns = [
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

    for col in required_columns:
        if col not in df.columns:
            df[col] = ""

    return df[required_columns]


def save_combined_data(df: pd.DataFrame, filename: str) -> None:
    """
    Save the combined data to a CSV file
    """
    # Create the final directory if it doesn't exist
    os.makedirs("../final", exist_ok=True)

    # Save to CSV
    output_path = f"../final/{filename}"
    df.to_csv(output_path, index=False)
    print(f"Saved {len(df)} records to {output_path}")

    # Print summary statistics
    print("\nSummary Statistics:")
    print(f"Total locations: {len(df)}")
    print("\nBreakdown by type:")
    print(df["type"].value_counts())
    print("\nBreakdown by organization:")
    print(df["organization"].value_counts())


def main():
    print("Loading processed data files...")
    dfs = load_csv_files()

    if dfs:
        print("\nCombining data...")
        combined_df = combine_dataframes(dfs)

        print("\nValidating and cleaning data...")
        final_df = validate_data(combined_df)

        print("\nSaving combined data...")
        save_combined_data(final_df, "all_food_resources.csv")
    else:
        print("No data files were found to combine.")


if __name__ == "__main__":
    main()
