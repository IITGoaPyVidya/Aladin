"""
Stock-related API routes.
"""

from fastapi import APIRouter, Query

from services.stock_service import search_stocks, get_recommendations
from models.stock import StockSearchResponse, RecommendationResponse

router = APIRouter(prefix="/api", tags=["stocks"])


@router.get("/search", response_model=StockSearchResponse, summary="Search stocks")
def search(
    q: str = Query(default="", description="Stock symbol or company name to search for"),
):
    """
    Search for stocks by symbol or company name.

    - **q**: Search query (e.g. `TCS`, `Infosys`, `RELIANCE`)

    Returns a list of matching stocks with price and market data.
    """
    return search_stocks(q)


@router.get(
    "/recommend",
    response_model=RecommendationResponse,
    summary="Get stock recommendations",
)
def recommend():
    """
    Get AI-powered stock recommendations.

    Returns a curated list of BUY / SELL / HOLD recommendations with
    confidence scores and rationale.
    """
    return get_recommendations()
