# Project File Structure

Complete overview of the Renewable Grid Simulator project structure.

```
grid-simulator/
│
├── README.md                     # 📋 Main development roadmap (6-month plan)
├── .gitignore                    # 🚫 Git ignore rules
├── init.sh                       # 🚀 Setup script (macOS/Linux)
├── init.bat                      # 🚀 Setup script (Windows)
│
├── backend/                      # 🐍 Python FastAPI backend
│   ├── README.md                # Backend documentation
│   ├── requirements.txt         # Python dependencies
│   │
│   ├── app/                     # Main application code
│   │   ├── __init__.py
│   │   ├── main.py             # FastAPI entry point
│   │   │
│   │   ├── models/             # Pydantic data models
│   │   │   └── __init__.py     # GridState, EnergySource, etc.
│   │   │
│   │   ├── simulation/         # Core simulation engine
│   │   │   └── __init__.py     # Time manager, grid controller, etc.
│   │   │
│   │   ├── api/                # REST + WebSocket endpoints
│   │   │   └── __init__.py     # Route definitions
│   │   │
│   │   └── utils/              # Helper functions
│   │       └── __init__.py     # Math helpers, logging, etc.
│   │
│   └── tests/                  # Unit and integration tests
│       └── (test files will go here)
│
├── frontend/                    # ⚛️ React frontend
│   ├── README.md               # Frontend documentation
│   ├── package.json            # Node dependencies
│   ├── tsconfig.json           # TypeScript config
│   ├── tailwind.config.js      # Tailwind CSS config
│   ├── postcss.config.js       # PostCSS config
│   │
│   ├── public/                 # Static files
│   │   └── index.html         # HTML template
│   │
│   └── src/                    # Source code
│       ├── index.tsx           # Entry point
│       ├── index.css           # Global styles + Tailwind
│       ├── App.tsx             # Main app component
│       │
│       ├── components/         # React components
│       │   └── README.md       # Component overview
│       │   ├── Layout.tsx           (to be created)
│       │   ├── VisualScene/         (Phase 3)
│       │   ├── Dashboard/           (Phase 2)
│       │   ├── Modals/              (Phase 4)
│       │   └── Controls/            (Phase 4)
│       │
│       ├── hooks/              # Custom React hooks
│       │   └── index.ts        # useWebSocket, useSimulation, etc.
│       │
│       ├── services/           # API communication
│       │   └── api.ts          # REST + WebSocket client
│       │
│       ├── types/              # TypeScript definitions
│       │   └── simulation.ts   # Type definitions
│       │
│       └── styles/             # Additional CSS (if needed)
│
└── docs/                        # 📚 Documentation
    ├── architecture.md          # System architecture overview
    ├── SETUP.md                # Quick setup guide
    ├── api-spec.md                   (to be created)
    └── diagrams/               # Architecture diagrams
        └── (diagrams will go here)
```

## File Count Summary

**Current files:** 26 files created
- Backend: 8 files
- Frontend: 12 files
- Documentation: 4 files
- Project root: 2 files

**Files to be created:** 100+ files (over 6 months)
- Backend models: ~10 files
- Backend simulation: ~15 files
- Backend tests: ~20 files
- Frontend components: ~30 files
- Frontend hooks/services: ~10 files
- Documentation: ~5 files

## Key Files by Phase

### Phase 0 (Current - Setup)
✅ All project structure files
✅ Configuration files
✅ Initial README and documentation

### Phase 1 (Months 1-2: Backend)
📝 `backend/app/models/grid_state.py`
📝 `backend/app/simulation/time_manager.py`
📝 `backend/app/simulation/energy_sources/wind_turbine.py`
📝 `backend/app/simulation/energy_sources/solar_array.py`
📝 `backend/app/simulation/energy_sources/battery.py`
📝 `backend/app/simulation/energy_sources/gas_plant.py`
📝 `backend/app/simulation/weather_system.py`
📝 `backend/app/simulation/grid_controller.py`
📝 `backend/app/api/routes.py`

### Phase 2 (Month 3: Dashboard)
📝 `frontend/src/hooks/useWebSocket.ts`
📝 `frontend/src/components/Layout.tsx`
📝 `frontend/src/components/Dashboard/ChartsPanel.tsx`
📝 `frontend/src/components/Dashboard/MetricsPanel.tsx`
📝 `frontend/src/components/Dashboard/StatusPanel.tsx`

### Phase 3 (Month 4: Visual Scene)
📝 `frontend/src/components/VisualScene/Scene.tsx`
📝 `frontend/src/components/VisualScene/WindTurbine.tsx`
📝 `frontend/src/components/VisualScene/SolarArray.tsx`
📝 `frontend/src/components/VisualScene/City.tsx`
📝 `frontend/src/components/VisualScene/Battery.tsx`
📝 `frontend/src/components/VisualScene/Sky.tsx`

### Phase 4 (Month 5: Interactivity)
📝 `frontend/src/components/Modals/WindTurbineModal.tsx`
📝 `frontend/src/components/Modals/SolarWeatherModal.tsx`
📝 `frontend/src/components/Modals/DemandModal.tsx`
📝 `frontend/src/components/Modals/BatteryModal.tsx`
📝 `frontend/src/components/Controls/ScenarioSelector.tsx`

### Phase 5 (Month 6: Polish & Deploy)
📝 Deployment configs (Dockerfile, vercel.json, etc.)
📝 PORTFOLIO_README.md (final README for employers)
📝 docs/INTERVIEW_TALKING_POINTS.md

## Important Directories

**Never commit:**
- `backend/venv/` (Python virtual environment)
- `frontend/node_modules/` (Node packages)
- `*.db` (Database files)
- `.env` (Environment variables)

**Always commit:**
- All `.py` files (backend code)
- All `.tsx`, `.ts`, `.jsx`, `.js` files (frontend code)
- All `.md` files (documentation)
- Configuration files (`.json`, `.js` configs)
- `requirements.txt` and `package.json`

## Quick Navigation

```bash
# Backend development
cd backend
source venv/bin/activate  # Activate Python env
code app/main.py         # Edit main file

# Frontend development
cd frontend
code src/App.tsx         # Edit main component

# Documentation
cd docs
code architecture.md     # Edit architecture docs
```

---

**This structure will evolve** as the project is built. See README.md for the development roadmap.
