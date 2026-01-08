#!/usr/bin/env python3
"""
Conversational Garden Planning API
Conversational layer that delegates to the garden planning backend for natural conversations
"""

import os
import sys
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import json
import requests

# Load environment variables
load_dotenv('.env.local')

# Backend conversation endpoint
GARDEN_API_URL = os.getenv("GARDEN_API_URL", "https://agenticaigardenplanner.onrender.com")
CONVERSATION_ENDPOINT = os.getenv("GARDEN_CONVERSATION_URL", f"{GARDEN_API_URL}/api/conversation")

# Import backend garden planner
sys.path.append('./backend')
from agi_agent.gardening.models import (
    UserInput, LocationInput, GardeningMethod, SpaceSize, Sunlight,
    Experience, UserGoals, CropInterest, Preference, SoilType,
    GrowingLocation, Season, TimeCommitment
)
from agi_agent.gardening.climate import fetch_simple_forecast, geocode_location
from agi_agent.gardening.planner import generate_plan

app = FastAPI(
    title="Conversational Garden Planner API",
    description="Natural language garden planning assistant",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ConversationRequest(BaseModel):
    message: str
    context: Optional[dict] = None


class ConversationResponse(BaseModel):
    response: str
    garden_plan: Optional[str] = None
    extracted_info: Optional[dict] = None


def extract_garden_info(user_message: str, conversation_history: list = None) -> dict:
    """Use backend conversation endpoint to extract structured garden planning information from natural language"""
    return {}


def generate_conversational_response(user_message: str, extracted_info: dict) -> str:
    """Generate a conversational response by delegating to the backend conversation endpoint."""
    payload: dict = {"message": user_message}
    if extracted_info:
        payload["context"] = extracted_info

    try:
        resp = requests.post(CONVERSATION_ENDPOINT, json=payload, timeout=20)
        if resp.status_code == 200:
            data = resp.json()
            return data.get("response") or data.get("answer") or ""
    except Exception as e:
        print(f"Backend conversation error: {e}")

    return "I'm having trouble right now. Could you try again?"


@app.get("/")
async def root():
    return {
        "service": "Conversational Garden Planner API",
        "version": "1.0.0",
        "description": "Natural language garden planning assistant with voice support"
    }


@app.post("/api/conversation", response_model=ConversationResponse)
async def conversation(request: ConversationRequest):
    """
    Handle conversational garden planning requests
    """
    
    # Skip extraction for speed - just generate response directly
    extracted_info = {}
    
    # Generate conversational response (faster - single AI call)
    response_text = generate_conversational_response(request.message, extracted_info)
    
    # If user provided enough info for a full plan, generate it
    garden_plan = None
    if extracted_info.get("address"):
        try:
            # Build garden plan request
            location = LocationInput(address=extracted_info["address"])
            lat, lon = geocode_location(location)
            location.latitude = lat
            location.longitude = lon
            
            # Map extracted info to enums with defaults
            method = GardeningMethod.RAISED_BEDS
            size = SpaceSize.MEDIUM
            sunlight = Sunlight.FULL_SUN
            experience = Experience.BEGINNER
            
            # Try to map extracted values
            if extracted_info.get("experience"):
                exp_map = {
                    "Beginner": Experience.BEGINNER,
                    "Novice": Experience.NOVICE,
                    "Intermediate": Experience.INTERMEDIATE,
                    "Advanced": Experience.ADVANCED
                }
                experience = exp_map.get(extracted_info["experience"], Experience.BEGINNER)
            
            user_input = UserInput(
                location=location,
                method=method,
                size=size,
                sunlight=sunlight,
                soil_type=SoilType.MEDIUM,
                experience=experience,
                goals=UserGoals(
                    crops=[CropInterest.SUGGEST],
                    preferences=[Preference.LOW_MAINTENANCE]
                )
            )
            
            # Get climate and generate plan
            climate = fetch_simple_forecast(lat, lon)
            garden_plan = generate_plan(user_input, climate)
            
        except Exception as e:
            print(f"Error generating garden plan: {e}")
    
    return ConversationResponse(
        response=response_text,
        garden_plan=garden_plan,
        extracted_info=extracted_info
    )


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8002))
    print(f"Starting Conversational Garden Planner API on port {port}")
    print(f"Docs available at: http://localhost:{port}/docs")
    uvicorn.run(app, host="0.0.0.0", port=port)
