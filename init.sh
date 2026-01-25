#!/bin/bash

# Renewable Grid Simulator - Project Initialization Script
# This script sets up the development environment

echo "🌍 Renewable Grid Simulator - Initialization"
echo "============================================="
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.9+ first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Python 3 found: $(python3 --version)"
echo "✅ Node.js found: $(node --version)"
echo ""

# Initialize Git repository
echo "📦 Initializing Git repository..."
if [ ! -d ".git" ]; then
    git init
    git add .
    git commit -m "Initial commit: Project structure"
    echo "✅ Git repository initialized"
else
    echo "ℹ️  Git repository already exists"
fi
echo ""

# Backend setup
echo "🐍 Setting up Python backend..."
cd backend

if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
    echo "✅ Virtual environment created"
else
    echo "ℹ️  Virtual environment already exists"
fi

echo "Activating virtual environment and installing dependencies..."
source venv/bin/activate
pip install --upgrade pip > /dev/null 2>&1
pip install -r requirements.txt
echo "✅ Backend dependencies installed"

cd ..
echo ""

# Frontend setup
echo "⚛️  Setting up React frontend..."
cd frontend

if [ ! -d "node_modules" ]; then
    echo "Installing Node.js dependencies (this may take a few minutes)..."
    npm install
    echo "✅ Frontend dependencies installed"
else
    echo "ℹ️  Node modules already exist"
    echo "Run 'npm install' to update dependencies if needed"
fi

cd ..
echo ""

# Summary
echo "============================================="
echo "✅ Project initialization complete!"
echo ""
echo "📋 Next steps:"
echo ""
echo "1️⃣  Start the backend:"
echo "   cd backend"
echo "   source venv/bin/activate"
echo "   uvicorn app.main:app --reload"
echo ""
echo "2️⃣  Start the frontend (new terminal):"
echo "   cd frontend"
echo "   npm start"
echo ""
echo "3️⃣  Open your browser:"
echo "   Backend API: http://localhost:8000"
echo "   Frontend: http://localhost:3000"
echo "   API Docs: http://localhost:8000/docs"
echo ""
echo "📖 Read README.md for the full development roadmap"
echo "🏗️  Read docs/architecture.md to understand the system"
echo ""
echo "Happy coding! 🚀"
