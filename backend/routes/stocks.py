"""
Stock-related API routes for Indian Market API.
"""

from fastapi import APIRouter, Query, HTTPException
from typing import Dict, Any

from services.stock_service import search_stocks, get_stock_details, get_stock_summary

router = APIRouter(prefix="/api/stocks", tags=["stocks"])


@router.get("/search", summary="Search stocks by keyword")
def search(
    q: str = Query(default="", description="Search keyword (company name or partial name)"),
) -> Dict[str, Any]:
    """
    Search for Indian stocks by keyword matching.
    
    - **q**: Search query (e.g., `Tata`, `Reliance`, `Bank`)
    
    Returns a list of matching stock suggestions that can be selected
    to fetch detailed information.
    
    Example:
    ```
    GET /api/stocks/search?q=tata
    ```
    """
    return search_stocks(q)


@router.get("/details", summary="Get comprehensive stock details")
def get_details(
    name: str = Query(..., description="Full company name (e.g., 'Tata Steel', 'Reliance Industries')"),
) -> Dict[str, Any]:
    """
    Get comprehensive stock details including:
    - Current prices (BSE & NSE)
    - Technical analysis (moving averages)
    - Peer comparison
    - Key financial ratios
    - Analyst ratings
    - Shareholding pattern
    - Corporate actions (dividends, splits, AGM)
    - Company profile
    - Recent news
    
    - **name**: Full company name (e.g., `Tata Steel`, `Reliance Industries`)
    
    Example:
    ```
    GET /api/stocks/details?name=Tata Steel
    ```
    """
    result = get_stock_details(name)
    
    if not result.get("success"):
        status_code = result.get("status_code", 500)
        raise HTTPException(
            status_code=status_code,
            detail=result.get("error", "Failed to fetch stock details")
        )
    
    return result


@router.get("/summary", summary="Get quick stock summary")
def get_summary(
    name: str = Query(..., description="Full company name"),
) -> Dict[str, Any]:
    """
    Get a quick summary of key stock metrics.
    
    - **name**: Full company name (e.g., `Tata Steel`)
    
    Returns:
    - Company name
    - Industry
    - BSE & NSE prices
    - Percent change
    - 52-week high/low
    
    Example:
    ```
    GET /api/stocks/summary?name=Tata Steel
    ```
    """
    result = get_stock_summary(name)
    
    if not result.get("success"):
        raise HTTPException(
            status_code=500,
            detail=result.get("error", "Failed to fetch stock summary")
        )
    
    return result


@router.get("/popular", summary="Get popular stocks list")
def get_popular() -> Dict[str, Any]:
    """
    Get a list of popular Indian stocks.
    
    Returns:
    - List of popular stock names
    - Total count
    
    This can be used for autocomplete suggestions or quick stock selection.
    """
    from services.stock_service import POPULAR_STOCKS
    
    return {
        "stocks": POPULAR_STOCKS,
        "total": len(POPULAR_STOCKS),
        "message": "Popular Indian stocks"
    }
