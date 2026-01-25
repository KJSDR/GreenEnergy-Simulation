# Quick Setup Guide

Get the project running locally in 5 minutes.

## Prerequisites

- **Python 3.9+** ([Download](https://www.python.org/downloads/))
- **Node.js 18+** ([Download](https://nodejs.org/))
- **Git** ([Download](https://git-scm.com/))
- **Code Editor** (VS Code recommended)

## Initial Setup

### 1. Clone the Repository

```bash
# Clone your GitHub repository
git clone https://github.com/YOUR_USERNAME/grid-simulator.git
cd grid-simulator
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn app.main:app --reload
```

**Backend should now be running at:** http://localhost:8000

**Test it:** Open http://localhost:8000/docs in your browser

### 3. Frontend Setup

Open a **new terminal** (keep backend running):

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

**Frontend should now be running at:** http://localhost:3000

## Verify Everything Works

1. **Backend:** http://localhost:8000 should show `{"status": "online"}`
2. **Frontend:** http://localhost:3000 should show the React app
3. **API Docs:** http://localhost:8000/docs should show Swagger UI

## Common Issues

### Python virtual environment not activating
- **Windows:** Try `venv\Scripts\activate.bat` instead
- **Permission error:** Run terminal as administrator

### Port already in use
- **Backend:** Someone else using port 8000
  - Change port: `uvicorn app.main:app --reload --port 8001`
- **Frontend:** Someone else using port 3000
  - React will automatically suggest port 3001

### Module not found errors
- Make sure virtual environment is activated (you should see `(venv)` in terminal)
- Try: `pip install -r requirements.txt` again

### npm install fails
- Clear cache: `npm cache clean --force`
- Delete `node_modules` and try again
- Update npm: `npm install -g npm@latest`

## Development Workflow

**Typical workflow:**

1. Start backend: `cd backend && source venv/bin/activate && uvicorn app.main:app --reload`
2. Start frontend: `cd frontend && npm start` (new terminal)
3. Make changes to code
4. Both will auto-reload on save
5. View changes in browser

**VS Code users:**
- Install Python extension
- Install ESLint extension
- Use integrated terminal (can run both servers in split terminal)

## Next Steps

- Read `README.md` for full development roadmap
- Read `docs/architecture.md` to understand system design
- Start with Phase 1: Backend simulation engine

## Git Workflow

```bash
# Create a new branch for your work
git checkout -b feature/simulation-engine

# Make changes, then commit
git add .
git commit -m "Implement wind turbine power curve"

# Push to GitHub
git push origin feature/simulation-engine

# When ready, merge to main
git checkout main
git merge feature/simulation-engine
git push origin main
```

---

**You're all set! Happy coding.** 🚀
