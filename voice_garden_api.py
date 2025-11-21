#!/usr/bin/env python3
"""
Enhanced Voice-Enabled Garden Planning API
Integrates with the Render backend to provide data-driven responses
"""

import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import requests
import json

# Load environment variables
load_dotenv('.env.local')

# Import voice capabilities
from deepgram import DeepgramClient
import boto3

# Initialize clients
deepgram = DeepgramClient(api_key=os.getenv("DEEPGRAM_API_KEY"))

# Initialize AWS Polly client for text-to-speech
polly_client = boto3.client(
    service_name='polly',
    region_name=os.getenv('AWS_REGION', 'us-west-2'),
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY')
)

# Initialize AWS Bedrock client for Claude
bedrock_runtime = boto3.client(
    service_name='bedrock-runtime',
    region_name=os.getenv('AWS_REGION', 'us-west-2'),
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY')
)

# Your deployed Python backend
GARDEN_API_URL = "https://agenticaigardenplanner.onrender.com"

app = FastAPI(
    title="Enhanced Voice-Enabled Garden Planner API",
    description="AI Garden Planner with voice I/O and backend integration",
    version="3.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class VoiceQuestionRequest(BaseModel):
    """Request for voice-based garden question"""
    audio_base64: Optional[str] = None
    text_question: Optional[str] = None
    location: Optional[str] = None
    context: Optional[dict] = None


class VoiceQuestionResponse(BaseModel):
    """Response with text and audio"""
    transcript: Optional[str] = None
    answer_text: str
    audio_base64: Optional[str] = None
    garden_plan: Optional[dict] = None


def transcribe_audio(audio_data: bytes) -> str:
    """Transcribe audio using Deepgram"""
    try:
        response = deepgram.listen.prerecorded.v("1").transcribe_file(
            {"buffer": audio_data, "mimetype": "audio/wav"},
            {"model": "nova-2", "smart_format": True}
        )
        return response.results.channels[0].alternatives[0].transcript
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Transcription error: {str(e)}")


def extract_planning_intent(question: str) -> dict:
    """Use Claude to extract garden planning intent from natural language"""
    try:
        system_prompt = """You are an AI that extracts garden planning parameters from natural language.
        Analyze the user's question and determine:
        1. Is this a request for a full garden plan? (yes/no)
        2. Extract any mentioned parameters: location, space type, size, sunlight, experience, crops, etc.
        
        Return JSON with:
        {
            "is_plan_request": boolean,
            "parameters": {
                "location": string or null,
                "space_type": string or null (e.g., "Raised Beds", "Container Gardening"),
                "space_size": string or null,
                "sunlight": string or null,
                "experience": string or null,
                "crops_mentioned": list of strings,
                "specific_question": string (the actual question if not a plan request)
            }
        }"""
        
        body = json.dumps({
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": 500,
            "system": system_prompt,
            "messages": [{
                "role": "user",
                "content": f"Extract intent from: {question}"
            }]
        })
        
        response = bedrock_runtime.invoke_model(
            modelId="anthropic.claude-3-haiku-20240307-v1:0",
            body=body
        )
        
        response_text = json.loads(response['body'].read())['content'][0]['text']
        # Extract JSON from response
        import re
        json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
        if json_match:
            return json.loads(json_match.group())
        return {"is_plan_request": False, "parameters": {}}
        
    except Exception as e:
        print(f"Intent extraction error: {e}")
        return {"is_plan_request": False, "parameters": {}}


def get_backend_crops(query: str = "", cultural_context: str = "") -> list:
    """Fetch relevant crops from backend, including cultural varieties"""
    try:
        response = requests.get(f"{GARDEN_API_URL}/api/crops", timeout=10)
        if response.status_code == 200:
            crops = response.json()
            # Filter based on query and cultural context
            if query or cultural_context:
                query_lower = query.lower()
                cultural_lower = cultural_context.lower()
                filtered = []
                for c in crops:
                    name = c.get('name', '').lower()
                    desc = c.get('description', '').lower()
                    origin = c.get('origin', '').lower()
                    tags = ' '.join(c.get('tags', [])).lower() if 'tags' in c else ''
                    
                    # Match on query
                    if query and (query_lower in name or query_lower in desc):
                        filtered.append(c)
                    # Match on cultural context
                    elif cultural_context and (cultural_lower in name or cultural_lower in desc or cultural_lower in origin or cultural_lower in tags):
                        filtered.append(c)
                
                return filtered[:50]
            return crops[:50]
        return []
    except Exception as e:
        print(f"Backend crops error: {e}")
        return []
    except Exception as e:
        print(f"Backend crops error: {e}")
        return []


def generate_enhanced_answer(question: str, context: Optional[dict] = None) -> tuple:
    """Generate answer using Claude + backend data when appropriate"""
    try:
        # Extract intent
        intent = extract_planning_intent(question)
        
        # Check if backend is available
        backend_context = ""
        try:
            health_check = requests.get(f"{GARDEN_API_URL}/", timeout=5)
            if health_check.status_code == 200:
                backend_info = health_check.json()
                backend_context = f"\n\nBackend features: {', '.join(backend_info.get('features', []))}"
        except:
            pass
        
        # Get relevant crops if mentioned
        crops_context = ""
        if intent.get('parameters', {}).get('crops_mentioned'):
            crops = get_backend_crops(intent['parameters']['crops_mentioned'][0])
            if crops:
                crops_context = f"\n\nRelevant crops from database: {', '.join([c.get('name', '') for c in crops[:10]])}"
        
        # Generate response with Claude using backend context
        system_prompt = f"""You are a friendly, expert garden planning assistant. Answer questions directly and conversatively.

        Your knowledge includes:
        - 270+ crops: fruits, vegetables, nuts, grains, legumes, rice, herbs
        - Culturally diverse crops from various traditions (African, Asian, Latin American, Caribbean, Mediterranean, etc.)
        - Disease identification and prevention
        - Climate and environmental considerations
        - Companion planting strategies
        {backend_context}
        
        Guidelines:
        - Answer the user's specific question directly
        - Keep responses conversational and concise (2-3 paragraphs) for voice output
        - When users ask about cultural or traditional crops, discuss relevant varieties from that cuisine/culture
        - Reference specific crop varieties from the database when relevant
        - Only mention additional features (disease ID, full plans, etc.) if the user asks about them
        - Be responsive, not prescriptive"""
        
        user_prompt = f"{question}{crops_context}"
        if context:
            user_prompt = f"Context: {context}\n\n{user_prompt}"
        
        body = json.dumps({
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": 1000,
            "system": system_prompt,
            "messages": [{
                "role": "user",
                "content": user_prompt
            }]
        })
        
        response = bedrock_runtime.invoke_model(
            modelId="anthropic.claude-3-haiku-20240307-v1:0",
            body=body
        )
        
        response_body = json.loads(response['body'].read())
        answer = response_body['content'][0]['text']
        
        return answer, intent
        
    except Exception as e:
        return f"I'd be happy to help with your garden question. Error: {str(e)}", {}


def synthesize_speech(text: str) -> bytes:
    """Convert text to speech using AWS Polly - natural Kendra voice"""
    try:
        response = polly_client.synthesize_speech(
            Text=text,
            OutputFormat='mp3',
            VoiceId='Kendra',
            Engine='neural'
        )
        return response['AudioStream'].read()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Speech synthesis error: {str(e)}")


@app.get("/")
async def root():
    return {
        "service": "Enhanced Voice-Enabled Garden Planner API",
        "version": "3.0.0",
        "backend": GARDEN_API_URL,
        "features": [
            "Voice question input (Deepgram STT)",
            "AI-powered garden advice (Claude + Backend data)",
            "Voice response output (AWS Polly Kendra)",
            "270+ crops database integration",
            "Climate-aware recommendations",
            "Intent extraction for smart responses"
        ],
        "endpoints": {
            "voice_question": "/api/voice/ask",
            "text_to_speech": "/api/voice/speak",
            "health": "/health"
        }
    }


@app.get("/health")
async def health():
    backend_status = "unknown"
    try:
        r = requests.get(f"{GARDEN_API_URL}/", timeout=5)
        backend_status = "online" if r.status_code == 200 else "offline"
    except:
        backend_status = "offline"
    
    return {
        "status": "healthy",
        "deepgram": "connected",
        "backend": GARDEN_API_URL,
        "backend_status": backend_status
    }


@app.post("/api/voice/ask", response_model=VoiceQuestionResponse)
async def ask_voice_question(request: VoiceQuestionRequest):
    """Ask a garden question via voice or text and get an intelligent response"""
    transcript = None
    
    # Handle audio input
    if request.audio_base64:
        import base64
        audio_bytes = base64.b64decode(request.audio_base64)
        transcript = transcribe_audio(audio_bytes)
        question = transcript
    elif request.text_question:
        question = request.text_question
    else:
        raise HTTPException(status_code=400, detail="Must provide either audio_base64 or text_question")
    
    # Generate enhanced answer using Claude + backend data
    answer_text, intent = generate_enhanced_answer(question, request.context)
    
    # Synthesize speech
    audio_data = synthesize_speech(answer_text)
    
    import base64
    audio_base64 = base64.b64encode(audio_data).decode('utf-8')
    
    return VoiceQuestionResponse(
        transcript=transcript,
        answer_text=answer_text,
        audio_base64=audio_base64,
        garden_plan=intent if intent.get('is_plan_request') else None
    )


@app.post("/api/voice/speak")
async def text_to_speech(text: str = Form(...)):
    """Convert text to speech"""
    audio_data = synthesize_speech(text)
    
    import base64
    audio_base64 = base64.b64encode(audio_data).decode('utf-8')
    
    return {
        "text": text,
        "audio_base64": audio_base64
    }


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8001))
    print(f"Starting Enhanced Voice-Enabled Garden Planner API on port {port}")
    print(f"Backend: {GARDEN_API_URL}")
    print(f"Features: Backend integration with 270+ crops database")
    print(f"Docs available at: http://localhost:{port}/docs")
    uvicorn.run(app, host="0.0.0.0", port=port)
