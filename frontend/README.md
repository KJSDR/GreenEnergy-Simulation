# Frontend - Renewable Grid Simulator

React + TypeScript visualization and dashboard.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

## Development Server

- **URL:** http://localhost:3000
- **Auto-reloads** on code changes
- **Proxies API requests** to http://localhost:8000

## Project Structure

```
frontend/
├── src/
│   ├── App.tsx              # Main app component
│   ├── index.tsx            # Entry point
│   ├── components/          # React components
│   │   ├── VisualScene/    # Animated simulation (left panel)
│   │   ├── Dashboard/      # Metrics and charts (right panel)
│   │   ├── Modals/         # Control modals
│   │   └── Controls/       # UI controls
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API communication
│   ├── types/              # TypeScript definitions
│   └── styles/             # CSS and styling
├── public/                 # Static assets
└── package.json            # Dependencies
```

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **Zustand** - State management
- **Socket.io** - WebSocket connection
- **Framer Motion** - Animations

## Available Scripts

- `npm start` - Run development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App (not recommended)

## Environment Variables

Create `.env.local` for local development:

```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_WS_URL=ws://localhost:8000
```

## Next Steps

See main README.md for development roadmap and current phase.
