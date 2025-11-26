"""
Voice API Routes
Consolidates voice-ask and voice-speak Supabase Edge Functions
Target: <3s total response time (LLM + TTS)
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
import base64
import time
import logging
from typing import Optional

from ..services.groq_client import GroqClient
from ..services.tts_service import TTSService

logger = logging.getLogger(__name__)
router = APIRouter()

# Initialize services
groq = GroqClient()
tts = TTSService()

class VoiceAskRequest(BaseModel):
    text_question: str = Field(..., min_length=1, max_length=500, description="User's garden question")
    context: Optional[dict] = Field(None, description="Optional conversation context")

class VoiceAskResponse(BaseModel):
    transcript: str
    answer_text: str
    audio_base64: str
    processing_time_ms: int
    model_used: str

class VoiceSpeakRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=1000, description="Text to convert to speech")

@router.post("/ask", response_model=VoiceAskResponse)
async def voice_ask(request: VoiceAskRequest):
    """
    Voice Q&A endpoint with TTS
    
    Process flow:
    1. Generate answer using Groq (target <500ms)
    2. Synthesize speech using OpenAI TTS (target <2s)
    3. Return both text and audio (target <3s total)
    
    Replaces: voice-ask + voice-speak Supabase Edge Functions
    """
    start_time = time.time()
    
    try:
        logger.info(f"Voice question received: {request.text_question[:50]}...")
        
        # System prompt optimized for voice responses
        system_prompt = """You are a helpful garden planning assistant with expertise in:

- 270+ crops with 100+ varieties
- 300+ plant disease database
- Companion planting intelligence
- Climate & weather data analysis
- Urban and container gardening
- Cultural varieties (African, Asian, Latin, Caribbean, Indigenous)

Response guidelines:
- Keep answers conversational and concise (2-3 sentences maximum)
- Provide specific, data-driven advice when possible
- Mention plant names, growing conditions, and timing
- Sound natural when read aloud
- No emojis or special formatting

Example good response:
"For spring planting in containers, I recommend tomatoes, lettuce, and herbs like basil. 
These thrive in 5-gallon pots with at least 6 hours of sunlight. 
Start seeds indoors 6-8 weeks before your last frost date."
"""

        # Generate answer with Groq (fast inference)
        groq_start = time.time()
        answer_text = await groq.chat_completion(
            system_prompt=system_prompt,
            user_message=request.text_question,
            max_tokens=200,  # Short for voice
            temperature=0.7
        )
        groq_duration = (time.time() - groq_start) * 1000
        logger.info(f"Groq inference completed in {groq_duration:.2f}ms")
        
        # Generate speech audio
        tts_start = time.time()
        audio_bytes = await tts.synthesize(answer_text)
        tts_duration = (time.time() - tts_start) * 1000
        logger.info(f"TTS synthesis completed in {tts_duration:.2f}ms")
        
        # Encode audio to base64
        audio_base64 = base64.b64encode(audio_bytes).decode('utf-8')
        
        total_duration = (time.time() - start_time) * 1000
        
        logger.info(
            f"Voice request completed in {total_duration:.2f}ms "
            f"(Groq: {groq_duration:.2f}ms, TTS: {tts_duration:.2f}ms)"
        )
        
        # Alert if exceeding 3s target
        if total_duration > 3000:
            logger.warning(f"Voice response exceeded 3s target: {total_duration:.2f}ms")
        
        return VoiceAskResponse(
            transcript=request.text_question,
            answer_text=answer_text,
            audio_base64=audio_base64,
            processing_time_ms=int(total_duration),
            model_used=f"groq/{groq.model}"
        )
        
    except Exception as e:
        logger.error(f"Voice ask error: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Voice processing failed: {str(e)}"
        )

@router.post("/speak")
async def voice_speak(request: VoiceSpeakRequest):
    """
    Standalone TTS endpoint
    
    Converts text to speech MP3 audio.
    Useful for legacy compatibility or custom text-to-speech needs.
    
    Replaces: voice-speak Supabase Edge Function
    """
    start_time = time.time()
    
    try:
        logger.info(f"TTS request: {len(request.text)} characters")
        
        # Generate speech
        audio_bytes = await tts.synthesize(request.text)
        audio_base64 = base64.b64encode(audio_bytes).decode('utf-8')
        
        duration = (time.time() - start_time) * 1000
        logger.info(f"TTS completed in {duration:.2f}ms")
        
        return {
            "audio_base64": audio_base64,
            "text": request.text,
            "processing_time_ms": int(duration),
            "audio_format": "mp3",
            "voice": tts.voice
        }
        
    except Exception as e:
        logger.error(f"TTS error: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Text-to-speech failed: {str(e)}"
        )

@router.get("/voices")
async def list_voices():
    """
    List available TTS voices
    """
    return {
        "voices": [
            {"id": "alloy", "description": "Neutral, balanced voice"},
            {"id": "echo", "description": "Warm, conversational voice"},
            {"id": "fable", "description": "British accent, storytelling"},
            {"id": "onyx", "description": "Deep, authoritative voice"},
            {"id": "nova", "description": "Friendly, energetic voice (default)"},
            {"id": "shimmer", "description": "Soft, calm voice"}
        ],
        "current_voice": tts.voice,
        "note": "Voice can be changed in environment configuration"
    }
