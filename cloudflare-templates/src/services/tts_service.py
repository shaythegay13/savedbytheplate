"""
Text-to-Speech Service using OpenAI
Voice: Nova (friendly, energetic)
Format: MP3
"""
import os
import httpx
import logging

logger = logging.getLogger(__name__)

class TTSService:
    """
    OpenAI Text-to-Speech API client
    
    Voices available:
    - alloy: Neutral, balanced
    - echo: Warm, conversational
    - fable: British accent
    - onyx: Deep, authoritative
    - nova: Friendly, energetic (DEFAULT)
    - shimmer: Soft, calm
    """
    
    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY")
        if not self.api_key:
            raise ValueError(
                "OPENAI_API_KEY not configured. "
                "Run: wrangler secret put OPENAI_API_KEY"
            )
        
        self.base_url = "https://api.openai.com/v1/audio/speech"
        self.voice = os.getenv("TTS_VOICE", "nova")
        self.model = os.getenv("TTS_MODEL", "tts-1")  # or tts-1-hd for higher quality
        self.timeout = 30.0
        
        logger.info(f"TTS service initialized: model={self.model}, voice={self.voice}")
    
    async def synthesize(self, text: str, voice: str = None) -> bytes:
        """
        Convert text to speech MP3 audio
        
        Args:
            text: Text to synthesize (max 4096 chars)
            voice: Override default voice (optional)
            
        Returns:
            MP3 audio bytes
            
        Raises:
            Exception: If TTS generation fails
        """
        if len(text) > 4096:
            logger.warning(f"Text length {len(text)} exceeds 4096 chars, truncating")
            text = text[:4096]
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    self.base_url,
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": self.model,
                        "input": text,
                        "voice": voice or self.voice,
                        "response_format": "mp3",
                        "speed": 1.0  # Normal speed
                    },
                    timeout=self.timeout
                )
                
                if response.status_code != 200:
                    error_text = response.text
                    logger.error(f"OpenAI TTS error: {response.status_code} - {error_text}")
                    raise Exception(f"OpenAI TTS error: {response.status_code}")
                
                audio_bytes = response.content
                audio_size_kb = len(audio_bytes) / 1024
                
                logger.info(
                    f"TTS synthesis complete: {len(text)} chars → {audio_size_kb:.2f}KB MP3"
                )
                
                return audio_bytes
                
            except httpx.TimeoutException:
                logger.error(f"OpenAI TTS timeout after {self.timeout}s")
                raise Exception("TTS request timed out")
            except Exception as e:
                logger.error(f"TTS exception: {str(e)}")
                raise
    
    async def synthesize_chunked(self, text: str, chunk_size: int = 1000) -> list[bytes]:
        """
        Synthesize long text in chunks
        
        Useful for: Text longer than 4096 characters
        
        Args:
            text: Full text to synthesize
            chunk_size: Characters per chunk (default 1000)
            
        Returns:
            List of MP3 audio chunks
        """
        chunks = []
        for i in range(0, len(text), chunk_size):
            chunk_text = text[i:i + chunk_size]
            audio_chunk = await self.synthesize(chunk_text)
            chunks.append(audio_chunk)
        
        logger.info(f"Synthesized {len(chunks)} audio chunks")
        return chunks
