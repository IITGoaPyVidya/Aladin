"""
Aladin Backend — FastAPI application for Indian stock market data.

Provides comprehensive stock information using the Indian Market API.
"""

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.stocks import router as stocks_router

# ---------------------------------------------------------------------------
# App initialization
# ---------------------------------------------------------------------------

app = FastAPI(
    title="Aladin Stock API",
    description="Backend API for Indian stock market data with comprehensive analytics.",
    version="2.0.0",
)

# ---------------------------------------------------------------------------
# CORS — allow all origins in development; tighten in production
# ---------------------------------------------------------------------------

allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "*")
allowed_origins = (
    [o.strip() for o in allowed_origins_env.split(",")]
    if allowed_origins_env != "*"
    else ["*"]
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Routers
# ---------------------------------------------------------------------------

app.include_router(stocks_router)


# ---------------------------------------------------------------------------
# Health-check endpoint
# ---------------------------------------------------------------------------

@app.get("/", summary="Health check")
def root():
    """Returns a simple health-check response."""
    return {
        "status": "ok", 
        "message": "Aladin API is running 🚀",
        "version": "2.0.0",
        "endpoints": {
            "search": "/api/stocks/search?q=tata",
            "details": "/api/stocks/details?name=Tata Steel",
            "summary": "/api/stocks/summary?name=Tata Steel",
            "popular": "/api/stocks/popular"
        }
    }
