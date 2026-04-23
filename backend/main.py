"""
Aladin Backend — FastAPI application entry point.

Starts the API server with CORS enabled so the React frontend
(running on a different port or domain) can communicate freely.
"""

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.stocks import router as stocks_router

# ---------------------------------------------------------------------------
# App initialisation
# ---------------------------------------------------------------------------

app = FastAPI(
    title="Aladin Stock API",
    description="Backend API for the Aladin stock analysis and recommendation webapp.",
    version="1.0.0",
)

# ---------------------------------------------------------------------------
# CORS — allow all origins in development; tighten in production by setting
# the ALLOWED_ORIGINS environment variable (comma-separated list).
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
    return {"status": "ok", "message": "Aladin API is running 🚀"}
