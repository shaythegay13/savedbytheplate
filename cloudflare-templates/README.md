# Cloudflare Worker - Smart Backyard Garden API

Groq-powered backend replacing Supabase Edge Functions for **<3 second voice responses**.

## Quick Start

### 1. Prerequisites

```bash
# Install Cloudflare CLI
npm install -g wrangler

# Install Python 3.11+ and uv
curl -LsSf https://astral.sh/uv/install.sh | sh

# Login to Cloudflare
wrangler login
```

### 2. Setup Project

```bash
# Create project directory
mkdir cloudflare-worker-garden
cd cloudflare-worker-garden

# Copy template files
# (Copy all files from cloudflare-templates/ folder here)

# Initialize Python environment
uv venv
source .venv/bin/activate  # or `.venv\Scripts\activate` on Windows

# Install dependencies
uv pip install -r requirements.txt
```

### 3. Configure Secrets

```bash
# Set Groq API key (get from https://console.groq.com/keys)
wrangler secret put GROQ_API_KEY

# Set OpenAI API key (for TTS)
wrangler secret put OPENAI_API_KEY
```

### 4. Create KV Namespace

```bash
# Create KV namespace for rate limiting
wrangler kv:namespace create "RATE_LIMITS"

# Copy the ID from output and paste into wrangler.toml:
# [[env.production.kv_namespaces]]
# binding = "RATE_LIMITS"
# id = "YOUR_KV_ID_HERE"
```

### 5. Deploy

```bash
# Test locally first
wrangler dev

# Deploy to Cloudflare
wrangler deploy

# Your API will be live at:
# https://garden-api-worker.YOUR_SUBDOMAIN.workers.dev
```

## API Endpoints

### Voice Q&A with TTS
```bash
POST /voice/ask
{
  "text_question": "What vegetables should I plant in spring?"
}

Response:
{
  "transcript": "What vegetables should I plant in spring?",
  "answer_text": "For spring planting, I recommend lettuce...",
  "audio_base64": "//uQxAAA...",
  "processing_time_ms": 2847,
  "model_used": "groq/llama-3.3-70b-versatile"
}
```

### Text-to-Speech Only
```bash
POST /voice/speak
{
  "text": "Welcome to your garden planning assistant!"
}

Response:
{
  "audio_base64": "//uQxAAA...",
  "text": "Welcome to your garden planning assistant!",
  "processing_time_ms": 1523,
  "audio_format": "mp3",
  "voice": "nova"
}
```

### Health Check
```bash
GET /health

Response:
{
  "status": "healthy",
  "timestamp": 1735689123.456,
  "version": "2.0.0",
  "services": {
    "groq": "operational",
    "tts": "operational"
  }
}
```

## Frontend Integration

### Update API Base URL

```typescript
// Before (Supabase)
const { data } = await supabase.functions.invoke('voice-ask', {
  body: { text_question: question }
});

// After (Cloudflare Worker)
const response = await fetch('https://garden-api-worker.YOUR_SUBDOMAIN.workers.dev/voice/ask', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-User-ID': userId  // For rate limiting
  },
  body: JSON.stringify({ text_question: question })
});

const data = await response.json();
```

### Add Environment Variable

```env
# .env
VITE_CLOUDFLARE_WORKER_URL=https://garden-api-worker.YOUR_SUBDOMAIN.workers.dev
```

## Performance Targets

- **Voice response:** <3 seconds (button press → audio starts)
- **LLM inference:** <500ms (Groq Llama 3.3 70B)
- **TTS synthesis:** <2 seconds (OpenAI TTS)
- **Cold start:** <1ms (Cloudflare Workers)

## Monitoring

### Cloudflare Dashboard
- Workers & Pages → garden-api-worker → Metrics
- Monitor: Requests/sec, Errors, Latency, CPU time

### Logs
```bash
# Tail production logs
wrangler tail

# Tail with filters
wrangler tail --status error
```

## Cost Estimate

| Service | Cost | Usage |
|---------|------|-------|
| Cloudflare Workers (Paid) | $5/month | Unlimited requests |
| Groq (Free tier) | $0 | 1000 req/min |
| OpenAI TTS | $15/1M chars | ~$5/month |
| **Total** | **~$10/month** | **<3s responses** |

Compare to current: ~$15-25/month with 30-50s response times

## Troubleshooting

### "GROQ_API_KEY not configured"
```bash
wrangler secret put GROQ_API_KEY
```

### Voice response >3s
Check Groq latency:
```bash
curl -X POST https://api.groq.com/openai/v1/chat/completions \
  -H "Authorization: Bearer YOUR_KEY" \
  -d '{"model":"llama-3.3-70b-versatile","messages":[{"role":"user","content":"test"}]}'
```

### Rate limit errors
Increase in `src/utils/rate_limit.py`:
```python
RateLimiter(max_requests=200, window_seconds=3600)
```

## Next Steps

1. ✅ Deploy Cloudflare Worker
2. ✅ Test `/voice/ask` endpoint (<3s target)
3. ⏳ Update frontend API calls
4. ⏳ Monitor performance for 48 hours
5. ⏳ Delete old Supabase edge functions

## Documentation

- [Cloudflare Workers](https://developers.cloudflare.com/workers/)
- [Groq API](https://console.groq.com/docs)
- [OpenAI TTS](https://platform.openai.com/docs/guides/text-to-speech)
- [FastAPI](https://fastapi.tiangolo.com/)

## Support

For issues or questions:
- Cloudflare: https://discord.gg/cloudflaredev
- Groq: https://discord.gg/groq
- Project: [Your support channel]
