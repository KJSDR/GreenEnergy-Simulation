# Renewable Grid Simulator - Development Roadmap

## Project Overview
- npm start
- source venv/bin/activate
- uvicorn app.main:app --reload

**Goal:** Build a professional renewable energy grid simulation platform to demonstrate systems engineering skills for Danish green energy companies (Ørsted, Vestas, etc.)

**Timeline:** 6 months (steady pace, ~10 hours/week)

**Tech Stack:**
- Backend: FastAPI (Python), WebSocket, SQLite
- Frontend: React, TypeScript, Tailwind CSS, Recharts
- Deployment: Railway (backend) + Vercel (frontend)

**Key Features:**
- Split-screen interface (visual simulation + technical dashboard)
- Auto-running simulation with manual override controls
- Wind turbines, solar panels, battery storage, gas backup
- Real-time metrics: renewable %, CO₂ avoided, grid stability
- Click-to-control: interactive modals for each component

---

## Repository Structure

```
grid-simulator/
├── backend/                 # FastAPI simulation engine
│   ├── app/
│   │   ├── main.py         # FastAPI app entry point
│   │   ├── models/         # Pydantic data models
│   │   ├── simulation/     # Core simulation logic
│   │   ├── api/            # REST + WebSocket endpoints
│   │   └── utils/          # Helper functions
│   ├── tests/              # Backend tests
│   ├── requirements.txt    # Python dependencies
│   └── README.md          # Backend-specific docs
│
├── frontend/               # React visualization + dashboard
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API communication
│   │   ├── styles/        # CSS/Tailwind config
│   │   └── types/         # TypeScript types
│   ├── public/            # Static assets
│   ├── package.json       # Node dependencies
│   └── README.md          # Frontend-specific docs
│
├── docs/                   # Documentation & diagrams
│   ├── architecture.md    # System architecture
│   ├── api-spec.md        # API documentation
│   └── diagrams/          # Visual diagrams
│
├── .gitignore
├── README.md              # This file (development roadmap)
└── PORTFOLIO_README.md    # Final README for employers (created later)
```

---

## Development Phases (6-Month Roadmap)

### ✅ Phase 0: Project Setup (CURRENT - Week 0)
**Goal:** Initialize repository with proper structure

**Tasks:**
- [x] Create project structure
- [x] Initialize Git repository
- [x] Set up Python virtual environment
- [ ] Initialize FastAPI backend skeleton
- [ ] Initialize React frontend skeleton
- [ ] Configure .gitignore
- [x] First commit to GitHub
- [ ] Create development branch strategy

**Files to Create:**
- `backend/requirements.txt`
- `backend/app/main.py`
- `frontend/package.json`
- `frontend/src/App.tsx`
- `.gitignore`

**Success Criteria:**
- ✅ Can run `cd backend && uvicorn app.main:app --reload`
- ✅ Can run `cd frontend && npm start`
- ✅ Both show "Hello World" equivalents
- ✅ Pushed to GitHub

---

### 📦 Phase 1: Backend Simulation Engine (Months 1-2)

#### Week 1-2: Foundation & Data Models
**Goal:** Design core data structures and time system

**Tasks:**
- [ ] Design Pydantic models (`GridState`, `EnergySource`, `WeatherState`)
- [ ] Implement simulation tick system (15-min intervals)
- [ ] Create time advancement logic (24-hour cycles)
- [ ] Build state manager (current grid state)
- [ ] Add basic logging

**Files to Create:**
- `backend/app/models/grid_state.py`
- `backend/app/models/energy_sources.py`
- `backend/app/models/weather.py`
- `backend/app/simulation/time_manager.py`
- `backend/app/simulation/state_manager.py`

**Success Criteria:**
- ✅ Simulation can advance time tick-by-tick
- ✅ Grid state properly tracked
- ✅ Can serialize state to JSON

---

#### Week 3-4: Wind Turbine Model
**Goal:** Realistic wind power generation

**Tasks:**
- [ ] Implement wind turbine power curve (0-25 m/s)
- [ ] Add cut-in speed logic (3 m/s)
- [ ] Add rated power plateau (12-15 m/s)
- [ ] Add cut-out safety shutdown (>25 m/s)
- [ ] Unit tests for power calculations

**Files to Create:**
- `backend/app/simulation/energy_sources/wind_turbine.py`
- `backend/tests/test_wind_turbine.py`

**Success Criteria:**
- ✅ Wind turbine output matches realistic power curve
- ✅ Proper safety shutdowns at extreme speeds
- ✅ All edge cases tested

**Reference:**
- Typical turbine: 3 MW capacity, cut-in 3 m/s, rated 12 m/s, cut-out 25 m/s
- Power curve: P = 0.5 × ρ × A × v³ × Cp (simplified for model)

---

#### Week 5-6: Solar & Demand Models
**Goal:** Time-dependent solar generation and demand patterns

**Tasks:**
- [ ] Implement solar irradiance calculation (time of day)
- [ ] Add cloud cover impact on solar output
- [ ] Create residential demand curve (peaks at 8am, 6pm)
- [ ] Add temperature-based heating/cooling demand
- [ ] Seasonal adjustments (winter vs summer)

**Files to Create:**
- `backend/app/simulation/energy_sources/solar_array.py`
- `backend/app/simulation/demand_model.py`
- `backend/tests/test_solar_array.py`
- `backend/tests/test_demand_model.py`

**Success Criteria:**
- ✅ Solar output zero at night, peaks at solar noon
- ✅ Demand follows realistic daily pattern
- ✅ Cloud cover reduces solar appropriately

---

#### Week 7-8: Battery Storage & Gas Backup
**Goal:** Complete energy source portfolio

**Tasks:**
- [ ] Implement battery charge/discharge logic
- [ ] Add efficiency losses (95% round-trip)
- [ ] Track battery degradation (cycle counting)
- [ ] Create gas plant dispatch logic (last resort)
- [ ] Add CO₂ emission tracking for gas

**Files to Create:**
- `backend/app/simulation/energy_sources/battery.py`
- `backend/app/simulation/energy_sources/gas_plant.py`
- `backend/tests/test_battery.py`
- `backend/tests/test_gas_plant.py`

**Success Criteria:**
- ✅ Battery charges when surplus, discharges when deficit
- ✅ Gas activates only when renewables + battery insufficient
- ✅ CO₂ emissions accurately calculated

---

#### Week 9-10: Grid Balancing Logic
**Goal:** Intelligent auto-balancing algorithm

**Tasks:**
- [ ] Implement grid controller (supply = demand balancing)
- [ ] Add decision tree for battery management
- [ ] Prioritize renewables over gas
- [ ] Handle edge cases (battery empty, wind calm, peak demand)
- [ ] Add grid stability checks

**Files to Create:**
- `backend/app/simulation/grid_controller.py`
- `backend/tests/test_grid_controller.py`

**Success Criteria:**
- ✅ Grid always balanced (no blackouts)
- ✅ Minimizes gas usage automatically
- ✅ Smart battery charge/discharge decisions

---

#### Week 11-12: Weather System & Metrics
**Goal:** Dynamic weather and performance tracking

**Tasks:**
- [ ] Create weather system (wind speed variations, cloud cover)
- [ ] Add random weather events (storms, calm periods)
- [ ] Implement metrics tracker (renewable %, CO₂, costs)
- [ ] Add historical data storage (SQLite)
- [ ] Create API endpoints for state access

**Files to Create:**
- `backend/app/simulation/weather_system.py`
- `backend/app/simulation/metrics_tracker.py`
- `backend/app/api/routes.py`
- `backend/tests/test_weather_system.py`

**Success Criteria:**
- ✅ Weather changes realistically over time
- ✅ Metrics accurately track performance
- ✅ API returns current state via REST

---

### 🎨 Phase 2: Technical Dashboard (Month 3)

#### Week 13-14: React Setup & WebSocket
**Goal:** Frontend foundation with real-time connection

**Tasks:**
- [ ] Set up React + TypeScript project
- [ ] Configure Tailwind CSS
- [ ] Create WebSocket hook for backend connection
- [ ] Build layout structure (split-screen grid)
- [ ] Add basic state management (Zustand)

**Files to Create:**
- `frontend/src/hooks/useWebSocket.ts`
- `frontend/src/store/simulationStore.ts`
- `frontend/src/components/Layout.tsx`
- `frontend/src/types/simulation.ts`

**Success Criteria:**
- ✅ Frontend connects to backend WebSocket
- ✅ Receives real-time state updates
- ✅ Layout renders properly (left/right panels)

---

#### Week 15-16: Charts & Metrics Display
**Goal:** Professional data visualization

**Tasks:**
- [ ] Integrate Recharts library
- [ ] Create generation vs demand chart
- [ ] Create battery state chart
- [ ] Build metrics panel (renewable %, CO₂, costs)
- [ ] Add grid status indicators

**Files to Create:**
- `frontend/src/components/Dashboard/ChartsPanel.tsx`
- `frontend/src/components/Dashboard/MetricsPanel.tsx`
- `frontend/src/components/Dashboard/StatusPanel.tsx`

**Success Criteria:**
- ✅ Charts update in real-time
- ✅ Metrics display correctly
- ✅ Professional appearance

---

### 🎨 Phase 3: Visual Scene (Month 4)

#### Week 17-18: Static SVG Layout
**Goal:** Position all visual elements

**Tasks:**
- [ ] Design SVG scene layout (sky, ground, elements)
- [ ] Create wind turbine SVG components
- [ ] Create solar array SVG
- [ ] Create city/town SVG
- [ ] Create battery and gas plant visuals
- [ ] Position everything in fixed layout

**Files to Create:**
- `frontend/src/components/VisualScene/Scene.tsx`
- `frontend/src/components/VisualScene/WindTurbine.tsx`
- `frontend/src/components/VisualScene/SolarArray.tsx`
- `frontend/src/components/VisualScene/City.tsx`
- `frontend/src/components/VisualScene/Battery.tsx`
- `frontend/src/components/VisualScene/GasPlant.tsx`
- `frontend/src/components/VisualScene/Sky.tsx`

**Success Criteria:**
- ✅ All elements visible in proper positions
- ✅ Clean, professional aesthetic
- ✅ Responsive to container size

---

#### Week 19-20: Animations
**Goal:** Bring the scene to life

**Tasks:**
- [ ] Add turbine blade rotation (speed = wind speed)
- [ ] Add solar panel glow effect
- [ ] Add city lights on/off logic
- [ ] Add battery fill/drain animation
- [ ] Add gas plant smoke effect
- [ ] Add sky gradient changes (time of day)
- [ ] Add drifting clouds

**Files to Create:**
- `frontend/src/components/VisualScene/animations/turbineRotation.ts`
- `frontend/src/styles/animations.css`

**Success Criteria:**
- ✅ Animations reflect simulation state accurately
- ✅ Smooth transitions (60fps)
- ✅ Turbines stop when wind < 3 m/s or > 25 m/s

---

### 🎮 Phase 4: Interactivity (Month 5)

#### Week 21-22: Modal System & Controls
**Goal:** Click-to-control functionality

**Tasks:**
- [ ] Create modal component system
- [ ] Build wind turbine control modal
- [ ] Build solar/weather control modal
- [ ] Build city demand control modal
- [ ] Build battery control modal
- [ ] Build gas plant control modal
- [ ] Wire up parameter changes to backend API

**Files to Create:**
- `frontend/src/components/Modals/Modal.tsx`
- `frontend/src/components/Modals/WindTurbineModal.tsx`
- `frontend/src/components/Modals/SolarWeatherModal.tsx`
- `frontend/src/components/Modals/DemandModal.tsx`
- `frontend/src/components/Modals/BatteryModal.tsx`
- `frontend/src/components/Modals/GasModal.tsx`

**Success Criteria:**
- ✅ Click any element → relevant modal opens
- ✅ Parameter changes apply immediately
- ✅ Visual scene updates to reflect changes

---

#### Week 23-24: Scenarios & Presets
**Goal:** Quick exploration tools

**Tasks:**
- [ ] Create scenario preset system
- [ ] Add "Summer Day - High Solar" scenario
- [ ] Add "Winter Night - Peak Demand" scenario
- [ ] Add "Calm Weather - Grid Stress Test" scenario
- [ ] Add "Storm Conditions" scenario
- [ ] Add simulation speed controls (1x, 2x, 4x, 8x)
- [ ] Add reset functionality

**Files to Create:**
- `frontend/src/components/Controls/ScenarioSelector.tsx`
- `frontend/src/components/Controls/SpeedControls.tsx`
- `backend/app/api/scenarios.py`

**Success Criteria:**
- ✅ Scenarios load instantly
- ✅ Speed controls work smoothly
- ✅ Can reset to default state

---

### ✨ Phase 5: Polish & Deploy (Month 6)

#### Week 25-26: Visual Polish
**Goal:** Professional appearance

**Tasks:**
- [ ] Responsive design (desktop, tablet)
- [ ] Add dark mode (optional)
- [ ] Loading states for all async operations
- [ ] Error handling and user feedback
- [ ] Performance optimization
- [ ] Accessibility improvements (ARIA labels, keyboard nav)

**Success Criteria:**
- ✅ Works on all major browsers
- ✅ Mobile viewable (even if controls limited)
- ✅ No console errors
- ✅ Fast load times (<3s)

---

#### Week 27-28: Deployment
**Goal:** Live production environment

**Tasks:**
- [ ] Deploy backend to Railway
- [ ] Deploy frontend to Vercel
- [ ] Configure environment variables
- [ ] Set up custom domain (optional)
- [ ] Configure CORS properly
- [ ] Add basic monitoring/logging
- [ ] Load testing (ensure stability)

**Files to Create:**
- `backend/Dockerfile` (if needed for Railway)
- `frontend/vercel.json`
- `.env.example` files

**Success Criteria:**
- ✅ Live URL accessible publicly
- ✅ WebSocket connection stable
- ✅ No crashes under normal load
- ✅ SSL/HTTPS enabled

---

#### Week 29-30: Documentation & Portfolio Prep
**Goal:** Professional presentation

**Tasks:**
- [ ] Write final PORTFOLIO_README.md (for employers)
- [ ] Create architecture diagram
- [ ] Document API endpoints
- [ ] Record demo video (2-3 min screen recording)
- [ ] Create portfolio page entry
- [ ] Practice interview explanations
- [ ] Get feedback from friends/mentors

**Files to Create:**
- `PORTFOLIO_README.md`
- `docs/architecture-diagram.png`
- `docs/demo-video.mp4`
- `docs/INTERVIEW_TALKING_POINTS.md`

**Success Criteria:**
- ✅ README clearly explains project
- ✅ Can explain every technical decision
- ✅ Demo video shows key features
- ✅ Ready to send to employers

---

## Weekly Routine

**Recommended workflow:**
1. **Monday:** Review week's tasks, pick 1-2 to focus on
2. **Tue-Thu:** Development work (2-3 hours each day)
3. **Friday:** Testing, documentation, commit progress
4. **Weekend:** Catchup if needed, or research next week's tasks

**Total:** ~10-12 hours/week = sustainable pace

---

## Git Workflow

**Branch Strategy:**
- `main` - production-ready code only
- `develop` - integration branch
- `feature/*` - individual features (e.g., `feature/wind-turbine-model`)

**Commit Often:**
- Small, focused commits
- Descriptive messages
- Push to GitHub regularly (backup + progress tracking)

---

## Key Technical Decisions

### Why FastAPI?
- Async/await support (great for WebSockets)
- Automatic API documentation (OpenAPI/Swagger)
- Fast performance
- Type hints with Pydantic

### Why React + TypeScript?
- Industry standard for interactive UIs
- TypeScript prevents bugs in complex state management
- Great ecosystem (Recharts, Tailwind, etc.)

### Why Monorepo?
- Easier to manage for solo developer
- Share types between frontend/backend
- Single GitHub repository

### Why WebSocket?
- Real-time updates essential for live simulation
- Lower latency than polling
- Bi-directional communication

---

## Resources & References

### Learning Materials
- FastAPI Docs: https://fastapi.tiangolo.com/
- React Docs: https://react.dev/
- Recharts: https://recharts.org/
- Tailwind CSS: https://tailwindcss.com/

### Domain Knowledge
- Wind Turbine Power Curves: Research typical 3MW turbine specs
- Solar Irradiance: Basic solar geometry calculations
- Grid Operations: Learn about frequency stability, load balancing
- Danish Energy Mix: Ørsted reports, Vestas case studies

### Inspiration
- Energy dashboard examples (Grafana, Bloomberg Terminal aesthetics)
- SCADA system interfaces (industrial monitoring)
- Real-time data visualization best practices

---

## Success Metrics

**By Month 6, you should have:**
- ✅ Live URL showing working simulation
- ✅ Professional README with architecture diagrams
- ✅ Demo video ready to share
- ✅ Can explain every design decision in interviews
- ✅ Confident talking about renewable energy systems
- ✅ Portfolio piece that makes you memorable

**This project demonstrates:**
- 🎯 Systems thinking (grid balancing, optimization)
- 🎯 Backend engineering (APIs, simulation logic, algorithms)
- 🎯 Frontend skills (React, real-time updates, UX)
- 🎯 Domain knowledge (renewable energy, grid operations)
- 🎯 Full-stack capability (deployment, documentation)

---

## Notes & Adjustments

**Remember:**
- This is a living roadmap - adjust as you learn
- If something takes longer, that's okay - quality > speed
- Don't hesitate to simplify features if needed
- Ask for help when stuck (forums, Discord, Reddit)
- Celebrate small wins each week

**Flexibility:**
- Can skip dark mode if time is tight
- Demo video is optional but highly recommended
- Mobile responsiveness can be "viewable only" not "fully functional"
- Some polish items can be post-deployment

---

## Current Status

**Phase:** 0 - Project Setup  
**Week:** 0  
**Next Task:** Initialize Git repository and create skeleton projects  
**Blockers:** None  
**Notes:** Starting fresh, excited to build!

---

## Quick Start Commands (After Setup)

```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload

# Frontend
cd frontend
npm install
npm start

# Access
# Backend: http://localhost:8000
# Frontend: http://localhost:3000
# API Docs: http://localhost:8000/docs
```

---

**Let's build something incredible.** 🚀
