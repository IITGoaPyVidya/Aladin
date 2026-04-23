"""
Pydantic models for stock data structures.
"""

from pydantic import BaseModel
from typing import Optional, List


class StockSearchResult(BaseModel):
    """Represents a single stock search result."""
    symbol: str
    name: str
    price: float
    change: float
    change_percent: float
    volume: int
    market_cap: Optional[str] = None
    sector: Optional[str] = None


class StockSearchResponse(BaseModel):
    """Response model for the /search endpoint."""
    query: str
    results: List[StockSearchResult]
    total: int


class Recommendation(BaseModel):
    """Represents a single stock recommendation."""
    symbol: str
    name: str
    action: str          # BUY, SELL, HOLD
    target_price: float
    current_price: float
    confidence: float    # 0.0 to 1.0
    rationale: str
    sector: str


class RecommendationResponse(BaseModel):
    """Response model for the /recommend endpoint."""
    recommendations: List[Recommendation]
    generated_at: str
    disclaimer: str
