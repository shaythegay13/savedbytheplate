# 🎤 Voice-Only Garden Planner Integration

## What Changed

The garden planner is now **voice-only** - users interact with the AI by speaking their questions and receiving voice responses.

## Files Added

✅ **`voice_garden_api_updated.py`** - Voice API (uses your Render backend)
✅ **`src/components/garden-plan/VoiceGardenPlanner.tsx`** - Voice UI component
✅ **`.env.local`** - Your API keys (Deepgram, AWS)
✅ **`test_voice_api.py`** - Test suite

## Setup Steps

### 1. Install Python Dependencies

```bash
cd ~/CascadeProjects/new-garden-planner

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install requirements
pip install fastapi uvicorn boto3 deepgram-sdk pydantic python-dotenv requests
```

### 2. Replace Voice API

```bash
# Replace old version with updated one
mv voice_garden_api_updated.py voice_garden_api.py
```

### 3. Update Garden Plan Page

Replace `src/pages/GardenPlan.tsx` with voice-only interface:

```tsx
import VoiceGardenPlanner from '@/components/garden-plan/VoiceGardenPlanner';

const GardenPlan = () => {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4">
          🌱 AI Garden Planner
        </h1>
        <p className="text-center text-muted-foreground mb-8">
          Ask me anything about planning your perfect garden using your voice!
        </p>
        <VoiceGardenPlanner />
      </div>
    </div>
  );
};

export default GardenPlan;
```

### 4. Start Voice API

```bash
# Terminal 1: Start voice API
source venv/bin/activate
python voice_garden_api.py
```

Voice API will run on: **http://localhost:8001**

### 5. Start Frontend

```bash
# Terminal 2: Start React app
npm install
npm run dev
```

Frontend will run on: **http://localhost:5173** (or 3000)

## How It Works

1. **User clicks microphone** → Browser captures speech
2. **Speech sent to API** → AWS Polly converts to audio
3. **Question sent to Claude** → AI generates garden advice
4. **Response spoken back** → Natural Kendra voice

## API Architecture

```
Browser (Voice UI)
    ↓
Voice API (localhost:8001)
    ├─→ Deepgram (Speech-to-Text)
    ├─→ Claude/AWS Bedrock (AI Responses)  
    └─→ AWS Polly (Text-to-Speech - Kendra voice)
```

Your Python backend on Render is ready for future full garden plan generation if needed.

## Testing

```bash
# Test voice API
source venv/bin/activate
python test_voice_api.py
```

Should output:
```
✓ API is healthy
✓ Speech synthesized successfully
✓ Question processed successfully
```

## Environment Variables

Your `.env.local` has:
```bash
DEEPGRAM_API_KEY=5f5630d4607221b37fb973599daad379b4c86187
AWS_ACCESS_KEY_ID=AKIAXWHSJZBGTKVLZGN7
AWS_SECRET_ACCESS_KEY=ChMEZlc8L/OtrPfThr/pQYjJREfvWnHVJyc++bbF
AWS_REGION=us-west-2
```

## Usage

Users go to `/garden-plan` page and:
1. Click the green microphone button
2. Speak their question:
   - "What vegetables should I plant in spring?"
   - "I want to start a raised bed garden in Brooklyn"
   - "Tell me about companion planting for tomatoes"
3. AI responds with voice and text

## Troubleshooting

### Voice API won't start
- Check AWS credentials have Polly access
- Verify Deepgram API key is valid

### No audio output
- Check browser allows audio playback
- Test: `curl -X POST http://localhost:8001/api/voice/speak -F 'text=Test'`

### Voice sounds robotic
Current voice: **Kendra** (most natural)
To change, edit `voice_garden_api.py` line 147:
- **Joanna** - Clear, standard
- **Salli** - Warm, expressive
- **Ivy** - Younger, friendly

## What's Removed

❌ Old garden planner form UI
❌ Complex multi-step form process
❌ Local backend dependencies

## What's Kept

✅ Voice interaction (much simpler!)
✅ Your Render Python backend (ready when needed)
✅ Supabase functions (still available)
✅ All other site features (food map, etc.)

The garden planner is now a simple, voice-driven experience! 🎤🌱
