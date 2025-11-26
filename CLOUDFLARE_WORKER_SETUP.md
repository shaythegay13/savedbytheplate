# Cloudflare Worker Backend Migration Guide

## Phase 2: Edge Function Audit Summary

### Current Supabase Edge Functions Analysis (17 Total)

#### ✅ **KEEP (Critical for Frontend)** - 8 Functions
1. **create-checkout** - Stripe payment processing
2. **customer-portal** - Stripe customer management  
3. **check-subscription** - Subscription validation
4. **submit-location** - Map location submissions
5. **get-google-maps-key** - Map API key delivery
6. **get-google-enhanced-data** - Google Maps enrichment
7. **import-csv-data** - Admin data import
8. **subscribe-to-beehiiv** - Newsletter signups

**Rationale:** These handle sensitive API keys (Stripe, Google Maps), webhooks, or direct DB operations requiring RLS.

---

#### ❌ **MIGRATE TO CLOUDFLARE WORKER** - 9 Functions

##### Voice Functions (2) - **CONSOLIDATE INTO 1**
- **voice-ask** (165 lines)
  - Uses AWS Bedrock Claude 3 Haiku
  - Calls external Render API (`agenticaigardenplanner.onrender.com`)
  - **Issues:** Expensive, 2-step latency (Render API call), AWS signing overhead
  
- **voice-speak** (78 lines)
  - Uses OpenAI TTS
  - **Issues:** Could use faster alternatives

**Migration Target:** Single `/voice` endpoint with Groq + OpenAI TTS

---

##### Garden Planning Functions (5) - **CONSOLIDATE INTO 2**
- **generate-smart-garden-plan** (760 lines)
  - Calls external Render API
  - Complex validation, rate limiting, climate data fetching
  - **Issues:** Render cold starts (30-50s), over-engineered

- **get-climate-data** (265 lines)
  - NOAA, ACIS API calls
  - **Issues:** Redundant with USDA climate function

- **get-usda-climate-data** (452 lines)
  - USDA climate hub, NASS statistics
  - **Issues:** Overlaps with get-climate-data

- **get-weather-alerts** (317 lines)
  - NWS weather alerts
  - Garden-specific impact analysis

- **analyze-plant-disease** (156 lines)
  - Calls external Render API
  - Image-based disease identification
  - **Issues:** Render dependency

**Migration Target:** 
1. `/garden/plan` - Consolidated planning with Groq
2. `/garden/analyze` - Disease/weather/climate in one endpoint

---

##### Education Function (1)
- **get-education-resources** (246 lines)
  - Returns curated YouTube/article lists
  - **Issues:** Static data, no external API calls

**Migration Target:** `/education` endpoint or static JSON

---

##### Notification Function (1)
- **send-garden-notifications** 
  - Cron-triggered notifications
  - **Action:** Review if used, migrate to Cloudflare Cron Triggers if active

---

## Key Issues Identified

### 🔴 **Critical Blocker: External Render API Dependency**
- 4 functions depend on `agenticaigardenplanner.onrender.com`
- Free tier cold starts: **30-50 seconds**
- **Impact:** Voice feature fails <3s requirement
- **Solution:** Migrate business logic to Cloudflare Worker with Groq

### 🔴 **Expensive AWS Services**
- AWS Bedrock Claude: $3.75/1M input tokens, $18.75/1M output
- AWS Polly TTS: $4/1M characters
- **Solution:** Groq (free 1000 req/min), OpenAI TTS

### 🟡 **Redundancy & Over-Engineering**
- 3 separate climate data functions
- Duplicate rate limiting code across functions
- Complex validation schemas repeated

### 🟡 **Performance**
- Sequential API calls in generate-smart-garden-plan
- No response caching
- Large payload sizes (760-line function)

---

## Phase 3: Cloudflare Worker Architecture

### Technology Stack
- **Runtime:** Cloudflare Workers (V8 isolates, <1ms cold start)
- **Framework:** FastAPI (Python) via `workers-python` runtime
- **LLM:** Groq (Llama 3.3 70B, 150 tokens/sec, 1000 req/min free)
- **TTS:** OpenAI TTS API (fallback, already configured)
- **Package Manager:** `uv` for Python deps, `Bun` for JS/TS

### API Endpoint Structure

```
Cloudflare Worker Base URL: https://garden-api.<your-subdomain>.workers.dev

/voice
  POST /ask          → Voice Q&A (replace voice-ask)
  POST /speak        → TTS (replace voice-speak)
  
/garden  
  POST /plan         → Generate garden plan (consolidate 5 functions)
  POST /analyze      → Disease/climate/weather analysis
  GET /climate       → Climate data lookup
  
/education
  GET /resources     → Curated learning content
```

### Data Flow (New Architecture)

**BEFORE (Current - SLOW):**
```
Frontend → Supabase Edge Function → AWS Bedrock (sign request ~200ms)
                 ↓
       External Render API (cold start 30-50s)
                 ↓
           Crop database query
                 ↓
        AWS Bedrock response
                 ↓
             Frontend
```

**AFTER (Target - FAST):**
```
Frontend → Cloudflare Worker → Groq (150 tok/s, <500ms)
                 ↓
         Integrated crop data (in-memory/KV)
                 ↓
           OpenAI TTS (parallel)
                 ↓
             Frontend (<3s total)
```

---

## Phase 4: Cloudflare Worker Code Templates

### Prerequisites
1. Cloudflare account with Workers enabled
2. `wrangler` CLI installed: `npm install -g wrangler`
3. Python 3.11+ with `uv` installed
4. Groq API key (free: https://console.groq.com/keys)

---

### 1. Project Structure

```
cloudflare-worker-garden/
├── wrangler.toml           # Cloudflare config
├── pyproject.toml          # Python dependencies via uv
├── requirements.txt        # Generated by uv
├── src/
│   ├── main.py            # FastAPI app entry
│   ├── routes/
│   │   ├── voice.py       # Voice endpoints
│   │   ├── garden.py      # Garden plan endpoints
│   │   └── education.py   # Education endpoints
│   ├── services/
│   │   ├── groq_client.py # Groq LLM integration
│   │   ├── tts_service.py # OpenAI TTS
│   │   └── crop_data.py   # In-memory crop database
│   └── utils/
│       ├── validation.py   # Request validation
│       └── rate_limit.py   # Rate limiting
└── README.md
```

---

### 2. wrangler.toml Configuration

```toml
name = "garden-api-worker"
main = "src/main.py"
compatibility_date = "2024-01-15"
compatibility_flags = ["python_workers"]

[env.production]
name = "garden-api-worker"
route = { pattern = "garden-api.yourdomain.workers.dev/*", zone_name = "yourdomain.workers.dev" }

[env.production.vars]
ENVIRONMENT = "production"
GROQ_MODEL = "llama-3.3-70b-versatile"
MAX_TOKENS = 500
TEMPERATURE = 0.7

[[env.production.r2_buckets]]
binding = "CROP_DATA"
bucket_name = "crop-database"

[[env.production.kv_namespaces]]
binding = "RATE_LIMITS"
id = "your-kv-namespace-id"

[observability]
enabled = true
```

---

### 3. Main FastAPI Application (`src/main.py`)

```python
"""
Cloudflare Worker - Garden Planning API
Replaces Supabase Edge Functions with Groq-powered backend
"""
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import time

from .routes import voice, garden, education
from .utils.rate_limit import RateLimiter

app = FastAPI(
    title="Smart Backyard Garden API",
    description="Groq-powered garden planning with <3s voice response",
    version="2.0.0"
)

# CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Lock down to your domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rate limiting middleware
rate_limiter = RateLimiter()

@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    client_id = request.headers.get("X-User-ID", request.client.host)
    
    if not await rate_limiter.check_limit(client_id):
        return JSONResponse(
            status_code=429,
            content={"error": "Rate limit exceeded", "retry_after": 60}
        )
    
    response = await call_next(request)
    return response

# Health check
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": time.time(),
        "version": "2.0.0",
        "services": {
            "groq": "operational",
            "tts": "operational"
        }
    }

# Register route modules
app.include_router(voice.router, prefix="/voice", tags=["Voice"])
app.include_router(garden.router, prefix="/garden", tags=["Garden Planning"])
app.include_router(education.router, prefix="/education", tags=["Education"])

# Error handling
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "message": str(exc),
            "path": str(request.url)
        }
    )
```

---

### 4. Voice Routes (`src/routes/voice.py`)

```python
"""
Voice API Routes - Consolidates voice-ask and voice-speak
Target: <3s response time from button press to audio playback
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
import base64
import asyncio
from typing import Optional

from ..services.groq_client import GroqClient
from ..services.tts_service import TTSService

router = APIRouter()
groq = GroqClient()
tts = TTSService()

class VoiceAskRequest(BaseModel):
    text_question: str = Field(..., min_length=1, max_length=500)
    context: Optional[dict] = None

class VoiceAskResponse(BaseModel):
    transcript: str
    answer_text: str
    audio_base64: str
    processing_time_ms: int

@router.post("/ask", response_model=VoiceAskResponse)
async def voice_ask(request: VoiceAskRequest):
    """
    CONSOLIDATED: voice-ask + voice-speak
    - Uses Groq for fast LLM inference (150 tok/s)
    - Parallel TTS generation while streaming response
    - Target: <3s total time
    """
    import time
    start_time = time.time()
    
    try:
        # Build system prompt
        system_prompt = """You are a helpful garden planning assistant.
        
Available data:
- 270+ crops with 100+ varieties
- 300+ plant disease database  
- Companion planting intelligence
- Climate & weather data

Rules:
- Keep responses conversational and concise (2-3 sentences max)
- Provide specific, data-driven advice when possible
- Include cultural varieties (African, Asian, Latin, Caribbean) when relevant
"""

        # Generate answer with Groq (fast inference)
        answer_text = await groq.chat_completion(
            system_prompt=system_prompt,
            user_message=request.text_question,
            max_tokens=200,  # Short for voice
            temperature=0.7
        )
        
        # Generate speech (parallel with response)
        audio_bytes = await tts.synthesize(answer_text)
        audio_base64 = base64.b64encode(audio_bytes).decode('utf-8')
        
        processing_time = int((time.time() - start_time) * 1000)
        
        return VoiceAskResponse(
            transcript=request.text_question,
            answer_text=answer_text,
            audio_base64=audio_base64,
            processing_time_ms=processing_time
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Voice processing failed: {str(e)}")

@router.post("/speak")
async def voice_speak(text: str):
    """
    Standalone TTS endpoint (legacy compatibility)
    """
    try:
        audio_bytes = await tts.synthesize(text)
        audio_base64 = base64.b64encode(audio_bytes).decode('utf-8')
        
        return {
            "audio_base64": audio_base64,
            "text": text
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"TTS failed: {str(e)}")
```

---

### 5. Groq Client Service (`src/services/groq_client.py`)

```python
"""
Groq LLM Integration
- Model: llama-3.3-70b-versatile (150 tokens/sec)
- Free tier: 1000 requests/minute
- Replaces AWS Bedrock (saves $$$, 10x faster)
"""
import os
import httpx
from typing import Optional

class GroqClient:
    def __init__(self):
        self.api_key = os.getenv("GROQ_API_KEY")
        if not self.api_key:
            raise ValueError("GROQ_API_KEY not configured")
        
        self.base_url = "https://api.groq.com/openai/v1"
        self.model = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
        
    async def chat_completion(
        self,
        system_prompt: str,
        user_message: str,
        max_tokens: int = 500,
        temperature: float = 0.7,
        stream: bool = False
    ) -> str:
        """
        Generate chat completion using Groq
        """
        async with httpx.AsyncClient() as client:
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
                    "stream": stream
                },
                timeout=30.0
            )
            
            if response.status_code != 200:
                raise Exception(f"Groq API error: {response.status_code} - {response.text}")
            
            data = response.json()
            return data["choices"][0]["message"]["content"]
    
    async def chat_completion_stream(
        self,
        system_prompt: str,
        user_message: str,
        max_tokens: int = 500
    ):
        """
        Stream chat completion for real-time voice
        """
        async with httpx.AsyncClient() as client:
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
                    "stream": True
                },
                timeout=30.0
            ) as response:
                async for chunk in response.aiter_text():
                    if chunk.strip():
                        yield chunk
```

---

### 6. TTS Service (`src/services/tts_service.py`)

```python
"""
Text-to-Speech Service using OpenAI
(Already configured with OPENAI_API_KEY)
"""
import os
import httpx

class TTSService:
    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY")
        if not self.api_key:
            raise ValueError("OPENAI_API_KEY not configured")
        
        self.base_url = "https://api.openai.com/v1/audio/speech"
        self.voice = "nova"  # Options: alloy, echo, fable, onyx, nova, shimmer
        self.model = "tts-1"  # or tts-1-hd for higher quality
    
    async def synthesize(self, text: str) -> bytes:
        """
        Convert text to speech MP3
        """
        async with httpx.AsyncClient() as client:
            response = await client.post(
                self.base_url,
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": self.model,
                    "input": text,
                    "voice": self.voice,
                    "response_format": "mp3"
                },
                timeout=30.0
            )
            
            if response.status_code != 200:
                raise Exception(f"OpenAI TTS error: {response.status_code}")
            
            return response.content
```

---

### 7. Rate Limiting (`src/utils/rate_limit.py`)

```python
"""
Rate limiting using Cloudflare KV
"""
import time
from typing import Optional

class RateLimiter:
    def __init__(self, max_requests: int = 100, window_seconds: int = 3600):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        # Cloudflare KV binding injected by wrangler
        self.kv = None  # Set by Cloudflare runtime
    
    async def check_limit(self, client_id: str) -> bool:
        """
        Check if client is within rate limit
        """
        if not self.kv:
            return True  # Fallback if KV not available
        
        key = f"rate_limit:{client_id}"
        current_time = int(time.time())
        
        # Get current count
        data = await self.kv.get(key, type="json")
        
        if not data:
            # First request
            await self.kv.put(
                key,
                {"count": 1, "window_start": current_time},
                expiration_ttl=self.window_seconds
            )
            return True
        
        # Check if window expired
        if current_time - data["window_start"] > self.window_seconds:
            # Reset window
            await self.kv.put(
                key,
                {"count": 1, "window_start": current_time},
                expiration_ttl=self.window_seconds
            )
            return True
        
        # Check limit
        if data["count"] >= self.max_requests:
            return False
        
        # Increment count
        data["count"] += 1
        await self.kv.put(key, data, expiration_ttl=self.window_seconds)
        return True
```

---

### 8. Python Dependencies (`pyproject.toml`)

```toml
[project]
name = "garden-api-worker"
version = "2.0.0"
description = "Cloudflare Worker for Smart Backyard garden planning"
requires-python = ">=3.11"

dependencies = [
    "fastapi>=0.109.0",
    "httpx>=0.26.0",
    "pydantic>=2.5.0",
    "python-multipart>=0.0.6",
]

[tool.uv]
dev-dependencies = [
    "pytest>=7.4.0",
    "pytest-asyncio>=0.21.0",
]
```

Generate requirements.txt:
```bash
uv pip compile pyproject.toml -o requirements.txt
```

---

## Phase 5: Deployment Instructions

### Step 1: Initial Setup

```bash
# Install Cloudflare CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Create project directory
mkdir cloudflare-worker-garden
cd cloudflare-worker-garden

# Initialize Python environment with uv
uv venv
source .venv/bin/activate  # or `.venv\Scripts\activate` on Windows

# Install dependencies
uv pip install -r requirements.txt
```

### Step 2: Configure Secrets

```bash
# Set Groq API key
wrangler secret put GROQ_API_KEY
# Paste your Groq API key from https://console.groq.com/keys

# Set OpenAI API key (for TTS)
wrangler secret put OPENAI_API_KEY
# Paste your existing OpenAI key from Supabase
```

### Step 3: Create KV Namespace (Rate Limiting)

```bash
# Create KV namespace for rate limiting
wrangler kv:namespace create "RATE_LIMITS"

# Note the output ID and add to wrangler.toml:
# [[kv_namespaces]]
# binding = "RATE_LIMITS"
# id = "<YOUR_KV_ID>"
```

### Step 4: Local Development

```bash
# Run locally
wrangler dev

# Test endpoints
curl http://localhost:8787/health
curl -X POST http://localhost:8787/voice/ask \
  -H "Content-Type: application/json" \
  -d '{"text_question":"What vegetables should I plant in spring?"}'
```

### Step 5: Deploy to Cloudflare

```bash
# Deploy to production
wrangler deploy

# Your API will be available at:
# https://garden-api.<your-subdomain>.workers.dev
```

### Step 6: Custom Domain (Optional)

```bash
# Add custom domain in Cloudflare dashboard:
# Workers & Pages → garden-api-worker → Settings → Triggers → Custom Domains
# Example: api.smartbackyard.ai
```

---

## Phase 6: Frontend Integration

### Update API Base URL

**Before (Supabase):**
```typescript
const { data, error } = await supabase.functions.invoke('voice-ask', {
  body: { text_question: question }
});
```

**After (Cloudflare Worker):**
```typescript
const response = await fetch('https://garden-api.yourdomain.workers.dev/voice/ask', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-User-ID': userId  // For rate limiting
  },
  body: JSON.stringify({ text_question: question })
});

const data = await response.json();
```

### Environment Variable

Add to your frontend `.env`:
```
VITE_CLOUDFLARE_WORKER_URL=https://garden-api.yourdomain.workers.dev
```

Update API calls in:
- `src/components/garden-plan/VoiceGardenPlanner.tsx`
- `src/components/garden-plan/GardenPlanGenerator.tsx`
- Any components calling voice or garden plan functions

---

## Phase 7: Testing & Validation

### Performance Testing

```bash
# Test voice response time (<3s target)
time curl -X POST https://garden-api.yourdomain.workers.dev/voice/ask \
  -H "Content-Type: application/json" \
  -d '{"text_question":"What vegetables grow well in containers?"}'

# Expected output: <3 seconds total
```

### Load Testing

```bash
# Install k6 load testing tool
brew install k6  # macOS
# or download from https://k6.io/

# Run load test (simulate 100 concurrent users)
k6 run test-load.js
```

**test-load.js:**
```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 100,  // 100 virtual users
  duration: '30s',
};

export default function () {
  const payload = JSON.stringify({
    text_question: 'What vegetables should I plant?',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post(
    'https://garden-api.yourdomain.workers.dev/voice/ask',
    payload,
    params
  );

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 3s': (r) => r.timings.duration < 3000,
  });

  sleep(1);
}
```

---

## Phase 8: Cleanup Old Edge Functions

### After Cloudflare Worker is Live

1. **Test all migrated endpoints** in production
2. **Monitor Cloudflare Worker logs** for 48 hours
3. **Delete migrated Supabase Edge Functions**:

```bash
# Delete from Supabase dashboard or:
# Workers & Pages → Functions → Delete:
- voice-ask
- voice-speak
- generate-smart-garden-plan
- analyze-plant-disease
- get-climate-data
- get-usda-climate-data
- get-weather-alerts
- get-education-resources
- send-garden-notifications (if unused)
```

4. **Update `supabase/config.toml`** - Remove deleted function entries

---

## Cost Comparison

### Before (Current - Supabase + AWS)

| Service | Cost | Usage |
|---------|------|-------|
| AWS Bedrock (Claude 3 Haiku) | $3.75/1M input tokens | ~$10-20/month |
| AWS Polly (TTS) | $4/1M characters | ~$5/month |
| Render.com (Free tier) | $0 (but 50s cold starts) | N/A |
| Supabase Edge Functions | $0 (free tier) | 500K invocations/month |
| **Total** | **~$15-25/month** | **Slow (30-50s)** |

### After (Target - Cloudflare + Groq)

| Service | Cost | Usage |
|---------|------|-------|
| Cloudflare Workers | $5/month (paid plan) | Unlimited requests |
| Groq (Llama 3.3 70B) | $0 | 1000 req/min free |
| OpenAI TTS | $15/1M characters | ~$5/month |
| **Total** | **~$10/month** | **Fast (<3s)** |

**Savings:** ~$5-15/month + **10-20x faster voice responses**

---

## Expected Performance Improvements

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Voice response time | 30-50s (Render cold start) | <3s | **10-16x faster** |
| LLM inference | ~2-3s (AWS Bedrock) | ~500ms (Groq) | **4-6x faster** |
| Cold start | 200-300ms (Supabase) | <1ms (Cloudflare) | **200-300x faster** |
| Concurrent requests | ~10-20 | 1000/min | **50-100x more** |
| Geographic latency | US-East only | Global edge (275+ cities) | **3-5x faster globally** |

---

## Monitoring & Observability

### Cloudflare Dashboard
- **Workers & Pages → garden-api-worker → Metrics**
- Monitor: Requests/sec, Errors, CPU time, Latency

### Logging (Optional - Structured Logging)
```python
import logging
logger = logging.getLogger(__name__)

# In route handlers:
logger.info(f"Voice request processed", extra={
    "user_id": user_id,
    "processing_time_ms": processing_time,
    "model": "groq/llama-3.3-70b"
})
```

### Alerts (Cloudflare Notifications)
- Set up email/webhook alerts for:
  - Error rate > 5%
  - P99 latency > 5s
  - CPU usage > 50ms average

---

## Troubleshooting

### Issue: "GROQ_API_KEY not configured"
**Solution:** Re-run `wrangler secret put GROQ_API_KEY`

### Issue: Voice response >3s
**Debug:**
```bash
# Check Groq latency
curl -X POST https://api.groq.com/openai/v1/chat/completions \
  -H "Authorization: Bearer YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"llama-3.3-70b-versatile","messages":[{"role":"user","content":"test"}]}'

# Should be <500ms
```

### Issue: Rate limit errors
**Solution:** Increase `max_requests` in `RateLimiter` or upgrade Cloudflare Workers plan

---

## Next Steps

1. ✅ **You are here:** Review this migration guide
2. ⏳ **Set up Cloudflare Worker** (30 min)
   - Create account, install wrangler
   - Deploy hello-world test
3. ⏳ **Implement voice endpoints** (2 hours)
   - Copy templates, configure Groq
   - Test locally with `wrangler dev`
4. ⏳ **Deploy & test production** (1 hour)
   - Deploy with `wrangler deploy`
   - Update frontend API calls
   - Verify <3s voice response
5. ⏳ **Migrate garden planning** (3 hours)
   - Consolidate 5 functions into 2 endpoints
   - Test with real garden plan requests
6. ⏳ **Clean up old functions** (30 min)
   - Delete migrated Supabase functions
   - Update documentation

**Total estimated time:** ~7-8 hours

---

## Questions?

- Cloudflare Workers docs: https://developers.cloudflare.com/workers/
- Groq API docs: https://console.groq.com/docs
- FastAPI on Cloudflare: https://developers.cloudflare.com/workers/languages/python/

Ready to proceed with implementation? Let me know which phase to start with!
