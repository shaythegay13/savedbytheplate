#!/bin/bash
# Voice-Only Garden Planner Setup Script

echo "🎤 Setting up Voice-Only Garden Planner..."
echo ""

# Step 1: Replace voice API with updated version
echo "1️⃣  Updating voice API to use Render backend..."
mv voice_garden_api_updated.py voice_garden_api.py
echo "✅ Voice API updated"
echo ""

# Step 2: Backup old garden plan page
echo "2️⃣  Backing up old garden planner page..."
if [ -f "src/pages/GardenPlan.tsx" ]; then
    mv src/pages/GardenPlan.tsx src/pages/GardenPlan.tsx.backup
    echo "✅ Old page backed up to GardenPlan.tsx.backup"
else
    echo "ℹ️  No existing GardenPlan.tsx found"
fi
echo ""

# Step 3: Install voice-only page
echo "3️⃣  Installing voice-only garden planner page..."
mv src/pages/GardenPlanVoice.tsx src/pages/GardenPlan.tsx
echo "✅ Voice-only page installed"
echo ""

# Step 4: Check Python environment
echo "4️⃣  Checking Python environment..."
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
    echo "✅ Virtual environment created"
else
    echo "✅ Virtual environment exists"
fi
echo ""

# Step 5: Install Python dependencies
echo "5️⃣  Installing Python dependencies..."
source venv/bin/activate
pip install -q fastapi uvicorn boto3 deepgram-sdk pydantic python-dotenv requests
echo "✅ Python dependencies installed"
echo ""

# Step 6: Check Node modules
echo "6️⃣  Checking Node.js dependencies..."
if [ ! -d "node_modules" ]; then
    echo "Installing Node.js dependencies... (this may take a moment)"
    npm install
    echo "✅ Node dependencies installed"
else
    echo "✅ Node dependencies exist"
fi
echo ""

# Done!
echo "=========================================="
echo "✨ Setup Complete!"
echo "=========================================="
echo ""
echo "🚀 Next Steps:"
echo ""
echo "Terminal 1 - Start Voice API:"
echo "  source venv/bin/activate"
echo "  python voice_garden_api.py"
echo ""
echo "Terminal 2 - Start Frontend:"
echo "  npm run dev"
echo ""
echo "Then visit: http://localhost:5173/garden-plan"
echo ""
echo "📝 See VOICE_INTEGRATION_GUIDE.md for details"
echo ""
