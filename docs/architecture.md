# System Architecture

## Overview

The Renewable Grid Simulator is a full-stack web application that simulates renewable energy grid operations in real-time.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    USER'S BROWSER                           │
│  ┌──────────────────────┬───────────────────────────────┐  │
│  │   Visual Scene       │   Technical Dashboard         │  │
│  │   (React/SVG)        │   (React/Recharts)            │  │
│  │   - Turbines         │   - Metrics                   │  │
│  │   - Solar            │   - Charts                    │  │
│  │   - City             │   - Status                    │  │
│  │   - Battery          │                               │  │
│  └──────────────────────┴───────────────────────────────┘  │
│                           │                                 │
│                      WebSocket                              │
└───────────────────────────┼─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                    BACKEND SERVER                           │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            FastAPI Application                       │  │
│  │  ┌────────────┐  ┌──────────────┐  ┌─────────────┐  │  │
│  │  │   REST     │  │  WebSocket   │  │  Simulation │  │  │
│  │  │   API      │  │  Endpoint    │  │   Engine    │  │  │
│  │  └────────────┘  └──────────────┘  └─────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Simulation Engine Core                       │  │
│  │  ┌────────────────┐  ┌──────────────────────────┐   │  │
│  │  │ Time Manager   │  │  Energy Sources          │   │  │
│  │  │ (15-min ticks) │  │  - WindTurbine           │   │  │
│  │  └────────────────┘  │  - SolarArray            │   │  │
│  │                      │  - Battery               │   │  │
│  │  ┌────────────────┐  │  - GasPlant              │   │  │
│  │  │ Weather System │  └──────────────────────────┘   │  │
│  │  │ (wind, clouds) │                                 │  │
│  │  └────────────────┘  ┌──────────────────────────┐   │  │
│  │                      │  Grid Controller         │   │  │
│  │  ┌────────────────┐  │  (Auto-balancing)        │   │  │
│  │  │ Demand Model   │  └──────────────────────────┘   │  │
│  │  │ (load curves)  │                                 │  │
│  │  └────────────────┘  ┌──────────────────────────┐   │  │
│  │                      │  Metrics Tracker         │   │  │
│  │                      │  (renewable %, CO₂, etc) │   │  │
│  │                      └──────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Data Storage (SQLite)                   │  │
│  │  - Historical simulation runs (optional)             │  │
│  │  - Metrics history                                   │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Component Responsibilities

### Frontend (React)

**Visual Scene Panel:**
- Renders SVG-based animated visualization
- Updates in real-time based on simulation state
- Handles click interactions to open control modals

**Technical Dashboard Panel:**
- Displays real-time metrics and charts
- Shows grid status, energy sources, sustainability metrics
- Professional data visualization (Recharts)

**Communication:**
- WebSocket connection for real-time state streaming
- REST API calls for control actions (parameter changes)

### Backend (FastAPI)

**Simulation Engine:**
- Tick-based time advancement (15-min intervals)
- Calculates power generation for each source
- Balances supply and demand automatically
- Tracks performance metrics

**Energy Source Models:**
- **WindTurbine:** Realistic power curves based on wind speed
- **SolarArray:** Time-of-day and weather-dependent output
- **Battery:** Charge/discharge with efficiency losses
- **GasPlant:** Dispatchable backup power

**Grid Controller:**
- Auto-balancing algorithm (supply = demand)
- Battery management strategy
- Gas backup activation logic
- Prioritizes renewable sources

**API Layer:**
- REST endpoints for control and queries
- WebSocket endpoint for real-time state broadcasting
- Scenario presets

## Data Flow

### Real-Time Simulation Loop

```
1. Tick Event (every 15 min simulated time)
   ↓
2. Weather System updates (wind speed, clouds)
   ↓
3. Demand Model calculates current load
   ↓
4. Energy Sources calculate available power
   - Wind: f(wind_speed)
   - Solar: f(time_of_day, cloud_cover)
   - Battery: current charge level
   - Gas: dispatchable (available on demand)
   ↓
5. Grid Controller balances supply/demand
   - If surplus → charge battery or export
   - If deficit → discharge battery or activate gas
   ↓
6. Metrics Tracker updates
   - Renewable %
   - CO₂ emissions
   - Costs
   - Grid stability
   ↓
7. State broadcast via WebSocket to all connected clients
   ↓
8. Frontend receives update → re-renders
   - Charts update
   - Metrics update
   - Visual animations update
```

### User Control Flow

```
1. User clicks turbine on visual scene
   ↓
2. Modal opens with current parameters
   ↓
3. User adjusts wind speed slider
   ↓
4. Frontend sends API request: POST /control/wind
   ↓
5. Backend updates simulation parameters
   ↓
6. Next tick reflects new parameters
   ↓
7. WebSocket broadcasts new state
   ↓
8. Frontend updates to show changes
```

## Technology Choices

### Why FastAPI?
- Async/await support (critical for WebSockets)
- Automatic API documentation (Swagger/OpenAPI)
- Type hints with Pydantic (data validation)
- Fast performance

### Why React?
- Industry standard for interactive UIs
- Component-based architecture (reusable)
- Great ecosystem (Recharts, Tailwind, etc.)
- TypeScript support for type safety

### Why WebSocket?
- Real-time updates essential for live simulation
- Lower latency than polling
- Bi-directional communication
- Efficient for streaming state changes

### Why SQLite?
- Lightweight (no separate database server)
- Sufficient for single-user simulation
- Easy deployment
- Can upgrade to PostgreSQL later if needed

### Why Tailwind CSS?
- Utility-first (fast development)
- Consistent design system
- Small bundle size
- Easy to customize

## Deployment Architecture

```
┌──────────────────────────────────────────────────────┐
│                    PRODUCTION                        │
│                                                      │
│  ┌────────────────────┐      ┌──────────────────┐  │
│  │   Vercel (CDN)     │      │   Railway        │  │
│  │                    │      │                  │  │
│  │  React Frontend    │◄────►│  FastAPI Backend │  │
│  │  (Static files)    │ HTTPS │  + SQLite DB     │  │
│  └────────────────────┘      └──────────────────┘  │
│           │                            │            │
│           │                            │            │
│       HTTPS/WSS                    HTTPS/WSS       │
│           │                            │            │
└───────────┼────────────────────────────┼────────────┘
            │                            │
            └───────────► USER ◄─────────┘
```

**Frontend (Vercel):**
- Serves static React build
- Global CDN (fast loading worldwide)
- Automatic HTTPS
- GitHub integration (auto-deploy on push)

**Backend (Railway):**
- Runs FastAPI server
- WebSocket support
- SQLite database included
- Environment variables for config

## Security Considerations

- **CORS:** Configured to allow only frontend domain
- **Rate Limiting:** Prevent API abuse (to be implemented)
- **Input Validation:** Pydantic models validate all inputs
- **HTTPS:** All production traffic encrypted
- **No Authentication:** Public demo (no sensitive data)

## Scalability Notes

**Current Design (MVP):**
- Single-server architecture
- In-memory simulation state
- Each user gets their own simulation instance (isolated)

**Future Improvements (if needed):**
- Redis for shared state (multiple servers)
- PostgreSQL for persistent storage
- Load balancer for horizontal scaling
- Separate WebSocket server

## Development vs Production

| Feature | Development | Production |
|---------|-------------|------------|
| Frontend | localhost:3000 | Vercel CDN |
| Backend | localhost:8000 | Railway |
| Database | SQLite (local) | SQLite (Railway) |
| HTTPS | No | Yes |
| CORS | Localhost only | Specific domain |
| Hot Reload | Yes | No |
| Logging | Console | File + monitoring |

---

This architecture document will evolve as the project is built. See main README.md for implementation roadmap.
