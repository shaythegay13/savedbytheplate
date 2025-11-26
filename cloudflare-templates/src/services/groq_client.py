"""
Groq LLM Integration
Model: llama-3.3-70b-versatile (150 tokens/sec, 1000 req/min free tier)
Replaces: AWS Bedrock Claude 3 Haiku (saves $$$, 10x faster)
"""
import os
import httpx
import logging
from typing import Optional, AsyncGenerator

logger = logging.getLogger(__name__)

class GroqClient:
    """
    Groq API client for fast LLM inference
    
    Performance characteristics:
    - Model: llama-3.3-70b-versatile
    - Speed: ~150 tokens/second
    - Free tier: 1000 requests/minute
    - Latency: <500ms for typical garden questions
    """
    
    def __init__(self):
        self.api_key = os.getenv("GROQ_API_KEY")
        if not self.api_key:
            raise ValueError(
                "GROQ_API_KEY not configured. "
                "Run: wrangler secret put GROQ_API_KEY"
            )
        
        self.base_url = "https://api.groq.com/openai/v1"
        self.model = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
        self.timeout = 30.0
        
        logger.info(f"Groq client initialized with model: {self.model}")
        
    async def chat_completion(
        self,
        system_prompt: str,
        user_message: str,
        max_tokens: int = 500,
        temperature: float = 0.7,
        top_p: float = 1.0
    ) -> str:
        """
        Generate chat completion using Groq
        
        Args:
            system_prompt: System instructions for the model
            user_message: User's input message
            max_tokens: Maximum tokens to generate (default 500)
            temperature: Sampling temperature 0-2 (default 0.7)
            top_p: Nucleus sampling parameter (default 1.0)
            
        Returns:
            Generated response text
            
        Raises:
            HTTPException: If API call fails
        """
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    f"{self.base_url}/chat/completions",
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": self.model,
                        "messages": [
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": user_message}
                        ],
                        "max_tokens": max_tokens,
                        "temperature": temperature,
                        "top_p": top_p
                    },
                    timeout=self.timeout
                )
                
                if response.status_code != 200:
                    error_text = response.text
                    logger.error(f"Groq API error: {response.status_code} - {error_text}")
                    raise Exception(f"Groq API error: {response.status_code} - {error_text}")
                
                data = response.json()
                answer = data["choices"][0]["message"]["content"]
                
                # Log usage stats
                usage = data.get("usage", {})
                logger.info(
                    f"Groq completion: "
                    f"prompt_tokens={usage.get('prompt_tokens', 0)}, "
                    f"completion_tokens={usage.get('completion_tokens', 0)}, "
                    f"total_tokens={usage.get('total_tokens', 0)}"
                )
                
                return answer
                
            except httpx.TimeoutException:
                logger.error(f"Groq API timeout after {self.timeout}s")
                raise Exception("Groq API request timed out")
            except Exception as e:
                logger.error(f"Groq API exception: {str(e)}")
                raise
    
    async def chat_completion_stream(
        self,
        system_prompt: str,
        user_message: str,
        max_tokens: int = 500,
        temperature: float = 0.7
    ) -> AsyncGenerator[str, None]:
        """
        Stream chat completion for real-time responses
        
        Useful for: Long-form content, real-time voice synthesis
        
        Args:
            system_prompt: System instructions
            user_message: User input
            max_tokens: Max tokens to generate
            temperature: Sampling temperature
            
        Yields:
            Text chunks as they are generated
        """
        async with httpx.AsyncClient() as client:
            try:
                async with client.stream(
                    "POST",
                    f"{self.base_url}/chat/completions",
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": self.model,
                        "messages": [
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": user_message}
                        ],
                        "max_tokens": max_tokens,
                        "temperature": temperature,
                        "stream": True
                    },
                    timeout=self.timeout
                ) as response:
                    async for line in response.aiter_lines():
                        if line.strip() and line.startswith("data: "):
                            chunk = line[6:]  # Remove "data: " prefix
                            if chunk.strip() == "[DONE]":
                                break
                            try:
                                import json
                                data = json.loads(chunk)
                                content = data["choices"][0]["delta"].get("content")
                                if content:
                                    yield content
                            except json.JSONDecodeError:
                                continue
                                
            except httpx.TimeoutException:
                logger.error("Groq streaming timeout")
                raise Exception("Groq streaming request timed out")
            except Exception as e:
                logger.error(f"Groq streaming error: {str(e)}")
                raise
