# 🎤 Voice-Only Garden Planner - Quick Start

## What Was Done

Your garden planner is now **voice-only**! The complex form UI has been replaced with a simple voice interface where users ask questions and get AI responses with natural speech.

## Files Added to Your Repo

```
new-garden-planner/
├── voice_garden_api.py              ← Voice API (Deepgram + Polly + Claude)
├── voice_garden_api_updated.py      ← Updated version (uses Render backend)
├── conversational_garden_api.py     ← Conversational layer
├── .env.local                       ← Your API keys
├── test_voice_api.py                ← Test suite
├── setup-voice.sh                   ← Automated setup script
├── VOICE_INTEGRATION_GUIDE.md       ← Detailed guide
├── src/
│   ├── components/garden-plan/
│   │   └── VoiceGardenPlanner.tsx   ← Voice UI component
│   └── pages/
│       ├── GardenPlan.tsx.backup    ← Old form UI (backup)
│       └── GardenPlanVoice.tsx      ← New voice-only page
```

## Quick Start (2 Commands)

```bash
cd ~/CascadeProjects/new-garden-planner

# 1. Run automated setup
./setup-voice.sh

# 2. Start voice API (in new terminal when prompted)
source venv/bin/activate
python voice_garden_api.py

# 3. Start frontend (in another terminal when prompted)
npm run dev
```

Then visit: **http://localhost:5173/garden-plan**

## What Users Experience

1. Click the **green microphone button**
2. **Speak their garden question**: 
   - "What should I plant in spring?"
   - "I want to start a raised bed garden in Brooklyn"
   - "Tell me about companion planting"
3. **AI responds with:**
   - Text display
   - Natural voice (AWS Polly - Kendra voice)
   - Personalized garden advice from Claude AI

## Technical Stack

- **Voice Input**: Browser Speech Recognition
- **Voice Output**: AWS Polly (Kendra - natural female voice)
- **AI Brain**: Claude 3 Haiku (via AWS Bedrock)
- **Speech-to-Text**: Deepgram (for advanced features)
- **Backend**: Your Python API on Render (ready when needed)

## API Keys Required

Already configured in `.env.local`:
- ✅ Deepgram API Key
- ✅ AWS Access Key (Polly + Bedrock)
- ✅ AWS Secret Key
- ✅ AWS Region

## Testing

```bash
source venv/bin/activate
python test_voice_api.py
```

Expected output:
```
✓ API is healthy
✓ Speech synthesized successfully  
✓ Question processed successfully
```

## Troubleshooting

### Voice API won't start
```bash
# Install dependencies
source venv/bin/activate
pip install fastapi uvicorn boto3 deepgram-sdk pydantic python-dotenv requests
```

### Frontend won't start
```bash
npm install
npm run dev
```

### Voice sounds robotic
Edit `voice_garden_api.py` line 147 to try different voices:
- **Kendra** (current) - Most natural
- **Joanna** - Clear, standard
- **Salli** - Warm
- **Ivy** - Younger, friendly

### No audio output
- Check browser allows audio playback
- Try Chrome/Edge (best compatibility)

## Architecture

```
User speaks → Browser captures
     ↓
Voice API (localhost:8001)
     ├→ Deepgram STT
     ├→ Claude AI (AWS Bedrock) 
     └→ AWS Polly TTS (Kendra voice)
     ↓
User hears natural voice response
```

## What Happened to Old Garden Planner?

- ❌ **Removed**: Complex multi-step form
- ❌ **Removed**: Local backend dependencies
- ✅ **Kept**: Your Python backend on Render (for future use)
- ✅ **Kept**: All Supabase functions
- ✅ **Kept**: Rest of your site (food map, etc.)
- ✅ **Added**: Simple, voice-driven experience

## Next Steps

1. Run `./setup-voice.sh`
2. Start both servers (voice API + frontend)
3. Test at `/garden-plan` page
4. Customize voice/personality as needed

See **VOICE_INTEGRATION_GUIDE.md** for detailed documentation.

---

**Your garden planner is now a modern voice AI experience!** 🎤🌱
