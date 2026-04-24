"""
Pydantic models for stock data structures.

Note: Most responses use Dict[str, Any] for flexibility with the
comprehensive Indian Market API response structure.
"""

from pydantic import BaseModel
from typing import Optional, List, Dict, Any


class SearchSuggestion(BaseModel):
    """Single stock suggestion from search."""
    name: str
    matched: bool = True


class StockSearchRequest(BaseModel):
    """Request model for stock search."""
    query: str
    limit: Optional[int] = 10


class StockDetailsRequest(BaseModel):
    """Request model for stock details."""
    stock_name: str


# For backward compatibility, keeping minimal models
class HealthResponse(BaseModel):
    """Health check response."""
    status: str
    message: str
