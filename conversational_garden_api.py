#!/usr/bin/env python3
"""
Conversational Garden Planning API
Integrates OpenAI with garden planning backend for natural conversations
"""

import os
import sys
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import json

# Load environment variables
load_dotenv('.env.local')

# Import AWS Bedrock for Claude
import boto3

# Import backend garden planner
sys.path.append('./backend')
from agi_agent.gardening.models import (
    UserInput, LocationInput, GardeningMethod, SpaceSize, Sunlight,
    Experience, UserGoals, CropInterest, Preference, SoilType,
    GrowingLocation, Season, TimeCommitment
)
from agi_agent.gardening.climate import fetch_simple_forecast, geocode_location
from agi_agent.gardening.planner import generate_plan

# AWS Bedrock configuration
AWS_REGION = os.getenv("AWS_REGION", "us-east-1")
AWS_ACCESS_KEY = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")

if not AWS_ACCESS_KEY or not AWS_SECRET_KEY:
    raise ValueError("AWS credentials not found. Set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY")

bedrock_client = boto3.client(
    service_name='bedrock-runtime',
    region_name=AWS_REGION,
    aws_access_key_id=AWS_ACCESS_KEY,
    aws_secret_access_key=AWS_SECRET_KEY
)

CLAUDE_MODEL = "anthropic.claude-3-haiku-20240307-v1:0"  # Fast and cheap
print(f"Using Claude via AWS Bedrock: {CLAUDE_MODEL}")

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

SYSTEM_INSTRUCTION = """You are a friendly expert garden planner - educational, polite, and kind like a favorite teacher.

Help users plan their gardens by answering questions about:
- What to plant and when
- Companion planting
- Watering and spacing
- Diseases and pests
- Crop rotation

Keep responses SHORT (2-3 sentences max for voice). Be warm and encouraging!"""


class ConversationRequest(BaseModel):
    message: str
    context: Optional[dict] = None


class ConversationResponse(BaseModel):
    response: str
    garden_plan: Optional[str] = None
    extracted_info: Optional[dict] = None


def extract_garden_info(user_message: str, conversation_history: list = None) -> dict:
    """Use Claude to extract structured garden planning information from natural language"""
    
    extraction_prompt = f"""Extract garden planning information from this user message: "{user_message}"

Return a JSON object with these fields (use null if not mentioned):
{{
  "address": "full address if mentioned",
  "method": "Container Garden|Raised Bed Garden|In-Ground Garden|Vertical Garden|Indoor Garden|Rooftop Garden|Hydroponic",
  "size": "Small|Medium|Large|Very Large",
  "growing_location": "Indoors|Outdoors|Both",
  "sunlight": "Full Sun|Partial Sun|Partial Shade|Shade",
  "soil_type": "Sandy|Medium|Clay|Rocky|Unknown",
  "seasons": ["Spring", "Summer", "Fall", "Winter"],
  "time_commitment": "Minimal|Moderate|Dedicated",
  "experience": "Beginner|Novice|Intermediate|Advanced",
  "crop_interests": ["list of crops mentioned"],
  "preferences": ["Drought Resistant", "Native Plants", "Low Maintenance", "Pest Resistant", "Fast Growing"],
  "question_type": "general_planning|companion_planting|watering|spacing|diseases|rotation|resources|other",
  "specific_question": "the specific question if asking about something particular"
}}

Only return the JSON, no other text."""

    try:
        message = claude_client.messages.create(
            model=CLAUDE_MODEL,
            max_tokens=150,
            system=extraction_prompt,
            messages=[
                {"role": "user", "content": user_message}
            ]
        )
        text = message.content[0].text.strip()
        # Remove markdown code blocks if present
        if text.startswith("```json"):
            text = text[7:]
        if text.startswith("```"):
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]
        return json.loads(text.strip())
    except Exception as e:
        print(f"Error extracting info: {e}")
        return {}


def generate_conversational_response(user_message: str, extracted_info: dict) -> str:
    """Generate a conversational response using Claude via Bedrock"""
    try:
        # Bedrock request body
        body = json.dumps({
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": 150,
            "system": SYSTEM_INSTRUCTION,
            "messages": [
                {
                    "role": "user",
                    "content": f"{user_message}\n\nAnswer in 2-3 short sentences."
                }
            ]
        })
        
        response = bedrock_client.invoke_model(
            modelId=CLAUDE_MODEL,
            body=body
        )
        
        response_body = json.loads(response['body'].read())
        return response_body['content'][0]['text']
    except Exception as e:
        return f"I'm having trouble right now. Could you try again? Error: {str(e)}"


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
