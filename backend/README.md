# Backend - Renewable Grid Simulator

FastAPI-based simulation engine and API server.

## Quick Start

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run development server
uvicorn app.main:app --reload

# Or run directly
python app/main.py
```

## API Access

- **API Server:** http://localhost:8000
- **API Documentation:** http://localhost:8000/docs (Swagger UI)
- **ReDoc Documentation:** http://localhost:8000/redoc

## Project Structure

```
backend/
├── app/
│   ├── main.py           # FastAPI application entry point
│   ├── models/           # Pydantic data models
│   ├── simulation/       # Core simulation logic
│   ├── api/              # API routes and WebSocket
│   └── utils/            # Helper functions
├── tests/                # Unit and integration tests
└── requirements.txt      # Python dependencies
```

## Development

### Running Tests

```bash
pytest
```

### Code Quality

```bash
# Format code (if using black)
black app/

# Type checking (if using mypy)
mypy app/
```

## Environment Variables

Create a `.env` file in the backend directory:

```env
# Development settings
DEBUG=True
LOG_LEVEL=INFO

# CORS origins (comma-separated)
CORS_ORIGINS=http://localhost:3000

# Database (when implemented)
DATABASE_URL=sqlite:///./grid_sim.db
```

## Next Steps

See main README.md for development roadmap and current phase.
