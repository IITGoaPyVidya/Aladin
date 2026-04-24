"""
Stock-related API routes for Indian Market API.
"""

from fastapi import APIRouter, Query, HTTPException
from typing import Dict, Any

from services.stock_service import (
    search_stocks, 
    get_stock_details, 
    get_stock_summary,
    screen_stocks,
    get_sectors_data,
    get_news_sentiment,
    get_ai_analysis
)

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


@router.get("/screener", summary="Advanced stock screener")
def screener(
    min_price: float = Query(default=None, description="Minimum stock price"),
    max_price: float = Query(default=None, description="Maximum stock price"),
    sector: str = Query(default=None, description="Filter by sector/industry"),
    limit: int = Query(default=50, description="Maximum results to return"),
) -> Dict[str, Any]:
    """
    Filter stocks by various criteria.
    
    - **min_price**: Minimum stock price (e.g., 100)
    - **max_price**: Maximum stock price (e.g., 5000)
    - **sector**: Industry/sector name (e.g., 'IT', 'Banking', 'Pharma')
    - **limit**: Number of results (default 50)
    
    Example:
    ```
    GET /api/stocks/screener?min_price=500&max_price=3000&sector=IT&limit=20
    ```
    """
    return screen_stocks(min_price, max_price, sector, limit)


@router.get("/sectors", summary="Get sector-wise data")
def sectors() -> Dict[str, Any]:
    """
    Get sector/industry wise stock grouping and performance.
    
    Returns top stocks from each major sector:
    - IT & Technology
    - Banking & Finance  
    - Pharmaceuticals
    - Automotive
    - Energy & Power
    - FMCG & Consumer
    - And more...
    
    Example:
    ```
    GET /api/stocks/sectors
    ```
    """
    return get_sectors_data()


@router.get("/news-sentiment", summary="Get news with sentiment analysis")
def news_sentiment(
    symbol: str = Query(..., description="Stock symbol (e.g., TATASTEEL, RELIANCE)"),
) -> Dict[str, Any]:
    """
    Get latest news headlines with AI sentiment analysis.
    
    - **symbol**: Stock symbol
    
    Returns news with sentiment scores (Bullish, Neutral, Bearish).
    
    Example:
    ```
    GET /api/stocks/news-sentiment?symbol=TATASTEEL
    ```
    """
    return get_news_sentiment(symbol)


@router.get("/ai-analysis", summary="AI analyst personas stock analysis")
def ai_analysis(
    stock_name: str = Query(..., description="Company name for analysis"),
    persona: str = Query(..., description="Analyst persona: fundamental, technical, growth, value, momentum"),
) -> Dict[str, Any]:
    """
    Get stock analysis from different AI analyst personas:
    
    - **fundamental**: Deep value investor (Warren Buffett style)
    - **technical**: Chart pattern analyst (Technical trader)
    - **growth**: Growth investor (Cathie Wood style)
    - **value**: Contrarian value investor (Ben Graham style)
    - **momentum**: Momentum trader (Short-term trends)
    
    Returns detailed analysis with BUY/SELL/HOLD recommendation.
    
    Example:
    ```
    GET /api/stocks/ai-analysis?stock_name=Tata Steel&persona=fundamental
    ```
    """
    return get_ai_analysis(stock_name, persona)
