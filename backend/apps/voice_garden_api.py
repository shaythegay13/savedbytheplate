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
import base64

# Load environment variables
load_dotenv('.env.local')

# Your deployed Python backend
GARDEN_API_URL = os.getenv("GARDEN_API_URL", "https://voiceagentrender.onrender.com")
CONVERSATION_ENDPOINT = os.getenv("GARDEN_CONVERSATION_URL", f"{GARDEN_API_URL}/api/conversation")

app = FastAPI(
    title="Enhanced Voice-Enabled Garden Planner API",
    description="AI Garden Planner with voice I/O and backend integration",
    version="3.0.0"
)

import os

# Get allowed origins from environment variable
ALLOWED_ORIGINS = os.getenv(
    'ALLOWED_ORIGINS',
    'https://savedbytheplate.lovable.app'
).split(',')

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
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
    """Transcribe audio.

    This API previously supported external STT providers. That integration has been removed.
    """
    raise HTTPException(status_code=501, detail="Audio transcription is not supported")


def extract_planning_intent(question: str) -> dict:
    """Extract intent from a question.

    External LLM-based intent extraction was removed. Keep a minimal stub so the API
    remains compatible.
    """
    return {"is_plan_request": False, "parameters": {}}


def generate_enhanced_answer(question: str, context: Optional[dict] = None) -> tuple:
    """Generate an answer using the backend conversation endpoint.

    External AI provider integrations were removed from this API.
    """
    intent = extract_planning_intent(question)

    payload: dict = {"message": question}
    if context:
        payload["context"] = context

    try:
        response = requests.post(CONVERSATION_ENDPOINT, json=payload, timeout=20)
        if response.status_code == 200:
            data = response.json()
            answer = data.get("response") or data.get("answer") or ""
            if answer:
                return answer, intent
    except Exception as e:
        print(f"Backend conversation error: {e}")

    return "I can help with garden questions, but I'm having trouble reaching the backend right now.", intent


def synthesize_speech(text: str) -> bytes:
    """Convert text to speech.

    This API previously supported external TTS providers. That integration has been removed.
    """
    raise HTTPException(status_code=501, detail="Speech synthesis is not supported")


@app.get("/")
async def root():
    return {
        "service": "Enhanced Voice-Enabled Garden Planner API",
        "version": "3.0.0",
        "backend": GARDEN_API_URL,
        "features": [
            "Text question input",
            "Backend-powered garden advice",
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
        "backend": GARDEN_API_URL,
        "backend_status": backend_status
    }


@app.post("/api/voice/ask", response_model=VoiceQuestionResponse)
async def ask_voice_question(request: VoiceQuestionRequest):
    """Ask a garden question via voice or text and get an intelligent response"""
    transcript = None

    # Handle audio input
    if request.audio_base64:
        audio_bytes = base64.b64decode(request.audio_base64)
        transcript = transcribe_audio(audio_bytes)
        question = transcript
    elif request.text_question:
        question = request.text_question
    else:
        raise HTTPException(status_code=400, detail="Must provide either audio_base64 or text_question")

    # Generate enhanced answer using Claude + backend data
    answer_text, intent = generate_enhanced_answer(question, request.context)
    audio_base64 = None

    return VoiceQuestionResponse(
        transcript=transcript,
        answer_text=answer_text,
        audio_base64=audio_base64,
        garden_plan=intent if intent.get('is_plan_request') else None
    )


@app.post("/api/voice/speak")
async def text_to_speech(text: str = Form(...)):
    """Convert text to speech"""
    raise HTTPException(status_code=501, detail="Text-to-speech is not supported")


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8001))
    print(f"Starting Enhanced Voice-Enabled Garden Planner API on port {port}")
    print(f"Backend: {GARDEN_API_URL}")
    print(f"Features: Backend integration with 270+ crops database")
    print(f"Docs available at: http://localhost:{port}/docs")
    uvicorn.run(app, host="0.0.0.0", port=port)
