"""
Tests for food bank data processing script
"""

from unittest.mock import patch, MagicMock

from scripts.process_food_banks import (
    clean_text,
    is_valid_nyc_address,
    is_nyc_metro_coordinates,
    validate_food_bank,
    geocode_address,
)


def test_clean_text():
    """Test text cleaning function"""
    # Test empty input
    assert clean_text("") == ""
    assert clean_text(None) == ""

    # Test whitespace handling
    assert clean_text("  hello  world  ") == "hello world"
    assert clean_text("\nhello\n\nworld\n") == "hello world"
    assert clean_text("\t hello \t world \t") == "hello world"


def test_is_valid_nyc_address():
    """Test NYC address validation"""
    # Test valid addresses
    assert is_valid_nyc_address("123 Main St, BRONX, NY")
    assert is_valid_nyc_address("456 Park Ave, BROOKLYN, NY")
    assert is_valid_nyc_address("789 Broadway, MANHATTAN, NY")
    assert is_valid_nyc_address("321 Queens Blvd, QUEENS, NY")
    assert is_valid_nyc_address("159 Victory Blvd, STATEN ISLAND, NY")

    # Test abbreviations
    assert is_valid_nyc_address("123 Main St, BX, NY")
    assert is_valid_nyc_address("456 Park Ave, BK, NY")
    assert is_valid_nyc_address("789 Broadway, NY, NY")
    assert is_valid_nyc_address("159 Victory Blvd, SI, NY")

    # Test invalid addresses
    assert not is_valid_nyc_address("123 Main St, New Jersey")
    assert not is_valid_nyc_address("456 Park Ave")
    assert not is_valid_nyc_address("")


def test_is_nyc_metro_coordinates():
    """Test NYC metro area coordinate validation"""
    # Test valid coordinates
    assert is_nyc_metro_coordinates(40.7128, -74.0060)  # Manhattan
    assert is_nyc_metro_coordinates(40.6782, -73.9442)  # Brooklyn
    assert is_nyc_metro_coordinates(40.8448, -73.8648)  # Bronx
    assert is_nyc_metro_coordinates(40.7282, -73.7949)  # Queens
    assert is_nyc_metro_coordinates(40.5795, -74.1502)  # Staten Island

    # Test invalid coordinates
    assert not is_nyc_metro_coordinates(0, 0)  # Null Island
    assert not is_nyc_metro_coordinates(51.5074, -0.1278)  # London
    assert not is_nyc_metro_coordinates(40.7128, -80.0060)  # Too far west
    assert not is_nyc_metro_coordinates(45.0000, -74.0060)  # Too far north


def test_validate_food_bank():
    """Test food bank record validation"""
    # Test valid food bank
    valid_food_bank = {
        "name": "Test Food Bank",
        "address": "123 Main St, BRONX, NY",
        "type": "food_pantry",
        "organization": "Food Bank NYC",
        "latitude": 40.7128,
        "longitude": -74.0060,
        "website": "https://example.com",
        "hours": "Mon-Fri 9-5",
        "contact": "555-1234",
        "additional_info": "Test info",
    }
    is_valid, errors = validate_food_bank(valid_food_bank)
    assert is_valid
    assert not errors

    # Test missing required fields
    invalid_food_bank = {
        "name": "Test Food Bank",
        "latitude": 40.7128,
        "longitude": -74.0060,
    }
    is_valid, errors = validate_food_bank(invalid_food_bank)
    assert not is_valid
    assert len(errors) > 0
    assert any("address" in error.lower() for error in errors)
    assert any("type" in error.lower() for error in errors)
    assert any("organization" in error.lower() for error in errors)

    # Test invalid type
    invalid_type_food_bank = valid_food_bank.copy()
    invalid_type_food_bank["type"] = "invalid_type"
    is_valid, errors = validate_food_bank(invalid_type_food_bank)
    assert not is_valid
    assert any("type" in error.lower() for error in errors)

    # Test invalid coordinates
    invalid_coords_food_bank = valid_food_bank.copy()
    invalid_coords_food_bank["latitude"] = 0
    invalid_coords_food_bank["longitude"] = 0
    is_valid, errors = validate_food_bank(invalid_coords_food_bank)
    assert not is_valid
    assert any("coordinates" in error.lower() for error in errors)

    # Test invalid website
    invalid_website_food_bank = valid_food_bank.copy()
    invalid_website_food_bank["website"] = "not-a-url"
    is_valid, errors = validate_food_bank(invalid_website_food_bank)
    assert not is_valid
    assert any("website" in error.lower() for error in errors)


def test_geocode_address():
    """Test address geocoding"""
    # Create a mock geocoder response
    mock_response = MagicMock()
    mock_response.ok = True
    mock_response.lat = 40.7128
    mock_response.lng = -74.0060

    # Create a failed mock response
    mock_failed_response = MagicMock()
    mock_failed_response.ok = False

    with patch("geocoder.get") as mock_get:
        # Test successful geocoding
        mock_get.return_value = mock_response
        result = geocode_address("123 Main St, Manhattan, NY")
        assert result is not None
        lat, lng = result
        assert 40.4 <= lat <= 41.0
        assert -74.3 <= lng <= -73.7

        # Test failed geocoding
        mock_get.return_value = mock_failed_response
        result = geocode_address("Invalid Address")
        assert result is None

        # Test rate limiting
        mock_get.return_value = mock_response
        result1 = geocode_address("123 Main St, Manhattan, NY")
        result2 = geocode_address("456 Park Ave, Brooklyn, NY")
        assert result1 is not None
        assert result2 is not None

        # Verify rate limiting delay
        assert mock_get.call_count >= 3  # At least 3 calls made
