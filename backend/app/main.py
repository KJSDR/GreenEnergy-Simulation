"""
Renewable Grid Simulator - Backend API
Main FastAPI application entry point
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Initialize FastAPI app
app = FastAPI(
    title="Renewable Grid Simulator API",
    description="Backend API for renewable energy grid simulation platform",
    version="0.1.0",
)

# Configure CORS (will need to update origins for production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "online",
        "message": "Renewable Grid Simulator API",
        "version": "0.1.0",
    }


@app.get("/api/status")
async def api_status():
    """API status endpoint"""
    return {
        "api": "operational",
        "simulation": "not yet implemented",
        "websocket": "not yet implemented",
    }


# TODO: Add simulation endpoints
# TODO: Add WebSocket endpoint for real-time updates
# TODO: Add control endpoints (wind, solar, demand, etc.)


if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,  # Auto-reload on code changes (development only)
    )
