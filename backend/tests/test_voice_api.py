#!/usr/bin/env python3
"""
Test the voice-enabled garden API
"""

import requests
import base64
import json

API_URL = "http://localhost:8001"

def test_text_question():
    """Test asking a text question"""
    print("\n" + "="*60)
    print("TEST 1: Text Question")
    print("="*60)
    
    response = requests.post(
        f"{API_URL}/api/voice/ask",
        json={
            "text_question": "What vegetables should I plant in spring?",
            "location": "New York, NY"
        }
    )
    
    if response.status_code == 200:
        data = response.json()
        print(f"✓ Question processed successfully")
        print(f"  Answer: {data['answer_text'][:200]}...")
        print(f"  Audio generated: {len(data.get('audio_base64', ''))} bytes")
        
        # Save audio response
        if data.get('audio_base64'):
            audio_bytes = base64.b64decode(data['audio_base64'])
            with open('test_response.mp3', 'wb') as f:
                f.write(audio_bytes)
            print(f"  Audio saved to: test_response.mp3")
    else:
        print(f"✗ Error: {response.status_code}")
        print(f"  {response.text}")


def test_text_to_speech():
    """Test text-to-speech endpoint"""
    print("\n" + "="*60)
    print("TEST 2: Text-to-Speech")
    print("="*60)
    
    text = "Welcome to your AI garden planner! I can help you plan your perfect garden."
    
    response = requests.post(
        f"{API_URL}/api/voice/speak",
        data={"text": text}
    )
    
    if response.status_code == 200:
        data = response.json()
        print(f"✓ Speech synthesized successfully")
        print(f"  Text: {data['text']}")
        print(f"  Audio size: {len(data['audio_base64'])} bytes")
        
        # Save audio
        audio_bytes = base64.b64decode(data['audio_base64'])
        with open('test_tts.mp3', 'wb') as f:
            f.write(audio_bytes)
        print(f"  Audio saved to: test_tts.mp3")
    else:
        print(f"✗ Error: {response.status_code}")
        print(f"  {response.text}")


def test_health():
    """Test health endpoint"""
    print("\n" + "="*60)
    print("TEST 3: Health Check")
    print("="*60)
    
    response = requests.get(f"{API_URL}/health")
    
    if response.status_code == 200:
        data = response.json()
        print(f"✓ API is healthy")
        print(f"  Status: {data['status']}")
        print(f"  Backend: {data['backend']}")
    else:
        print(f"✗ Error: {response.status_code}")


if __name__ == "__main__":
    print("Voice-Enabled Garden API Test Suite")
    print("Make sure the API is running: ./venv/bin/python backend/apps/voice_garden_api.py")
    
    try:
        # Test health first
        test_health()
        
        # Test text-to-speech
        test_text_to_speech()
        
        # Test text question
        test_text_question()
        
        print("\n" + "="*60)
        print("✅ All tests completed!")
        print("="*60)
        
    except requests.exceptions.ConnectionError:
        print("\n❌ Could not connect to API. Make sure it's running:")
        print("   ./venv/bin/python backend/apps/voice_garden_api.py")
    except Exception as e:
        print(f"\n❌ Test failed: {e}")
        import traceback
        traceback.print_exc()
