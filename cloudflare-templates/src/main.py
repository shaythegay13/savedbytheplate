"""
Cloudflare Worker - Smart Backyard Garden Planning API
Groq-powered backend replacing Supabase Edge Functions
Target: <3s voice response time
"""
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import time
import logging

from .routes import voice
from .utils.rate_limit import RateLimiter

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Smart Backyard Garden API",
    description="Groq-powered garden planning with <3s voice response",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # TODO: Lock down to your domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize rate limiter
rate_limiter = RateLimiter()

@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    """Rate limiting middleware using Cloudflare KV"""
    # Skip rate limiting for health check
    if request.url.path == "/health":
        return await call_next(request)
    
    client_id = request.headers.get("X-User-ID", request.client.host)
    
    if not await rate_limiter.check_limit(client_id):
        logger.warning(f"Rate limit exceeded for client: {client_id}")
        return JSONResponse(
            status_code=429,
            content={
                "error": "Rate limit exceeded",
                "retry_after": 60,
                "message": "You've exceeded the request limit. Please try again in 1 minute."
            }
        )
    
    response = await call_next(request)
    return response

@app.middleware("http")
async def logging_middleware(request: Request, call_next):
    """Log all requests with timing"""
    start_time = time.time()
    response = await call_next(request)
    duration = (time.time() - start_time) * 1000
    
    logger.info(
        f"{request.method} {request.url.path} - {response.status_code} - {duration:.2f}ms"
    )
    return response

@app.get("/")
async def root():
    """API root endpoint"""
    return {
        "name": "Smart Backyard Garden API",
        "version": "2.0.0",
        "status": "operational",
        "endpoints": {
            "health": "/health",
            "voice_ask": "POST /voice/ask",
            "voice_speak": "POST /voice/speak",
            "docs": "/docs"
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint for monitoring"""
    return {
        "status": "healthy",
        "timestamp": time.time(),
        "version": "2.0.0",
        "services": {
            "groq": "operational",
            "tts": "operational",
            "rate_limiter": "operational"
        }
    }

# Register route modules
app.include_router(voice.router, prefix="/voice", tags=["Voice"])

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Handle all unhandled exceptions"""
    logger.error(f"Unhandled exception: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "message": str(exc),
            "path": str(request.url),
            "timestamp": time.time()
        }
    )

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """Handle HTTP exceptions"""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": exc.detail,
            "path": str(request.url),
            "timestamp": time.time()
        }
    )
