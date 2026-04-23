"""
Stock service layer — contains business logic for stock data retrieval
and recommendation generation. Currently returns mock data; replace
with real NSE/BSE API calls when API keys are available.
"""

from datetime import datetime, timezone
from typing import List

from models.stock import (
    StockSearchResult,
    StockSearchResponse,
    Recommendation,
    RecommendationResponse,
)

# ---------------------------------------------------------------------------
# Mock data — replace with real API integration (e.g. NSE, Alpha Vantage)
# ---------------------------------------------------------------------------

MOCK_STOCKS: List[dict] = [
    {
        "symbol": "RELIANCE",
        "name": "Reliance Industries Ltd",
        "price": 2845.60,
        "change": 32.15,
        "change_percent": 1.14,
        "volume": 4_820_000,
        "market_cap": "19.2L Cr",
        "sector": "Energy",
    },
    {
        "symbol": "TCS",
        "name": "Tata Consultancy Services",
        "price": 3580.25,
        "change": -18.40,
        "change_percent": -0.51,
        "volume": 1_230_000,
        "market_cap": "13.1L Cr",
        "sector": "IT",
    },
    {
        "symbol": "INFY",
        "name": "Infosys Ltd",
        "price": 1452.75,
        "change": 21.30,
        "change_percent": 1.49,
        "volume": 3_540_000,
        "market_cap": "6.0L Cr",
        "sector": "IT",
    },
    {
        "symbol": "HDFC",
        "name": "HDFC Bank Ltd",
        "price": 1623.50,
        "change": -5.20,
        "change_percent": -0.32,
        "volume": 5_670_000,
        "market_cap": "12.4L Cr",
        "sector": "Finance",
    },
    {
        "symbol": "WIPRO",
        "name": "Wipro Ltd",
        "price": 445.30,
        "change": 8.75,
        "change_percent": 2.00,
        "volume": 2_100_000,
        "market_cap": "2.3L Cr",
        "sector": "IT",
    },
    {
        "symbol": "BAJFINANCE",
        "name": "Bajaj Finance Ltd",
        "price": 7210.00,
        "change": 110.50,
        "change_percent": 1.56,
        "volume": 980_000,
        "market_cap": "4.4L Cr",
        "sector": "Finance",
    },
    {
        "symbol": "HCLTECH",
        "name": "HCL Technologies Ltd",
        "price": 1305.00,
        "change": -12.00,
        "change_percent": -0.91,
        "volume": 1_450_000,
        "market_cap": "3.5L Cr",
        "sector": "IT",
    },
    {
        "symbol": "SBIN",
        "name": "State Bank of India",
        "price": 628.40,
        "change": 9.60,
        "change_percent": 1.55,
        "volume": 8_900_000,
        "market_cap": "5.6L Cr",
        "sector": "Finance",
    },
]

MOCK_RECOMMENDATIONS: List[dict] = [
    {
        "symbol": "RELIANCE",
        "name": "Reliance Industries Ltd",
        "action": "BUY",
        "target_price": 3100.00,
        "current_price": 2845.60,
        "confidence": 0.82,
        "rationale": "Strong Q3 results with Jio and retail segments showing robust growth. Expansion in green energy is a positive long-term catalyst.",
        "sector": "Energy",
    },
    {
        "symbol": "INFY",
        "name": "Infosys Ltd",
        "action": "BUY",
        "target_price": 1650.00,
        "current_price": 1452.75,
        "confidence": 0.75,
        "rationale": "Consistent deal wins, improving margins, and strong management guidance support the upside.",
        "sector": "IT",
    },
    {
        "symbol": "TCS",
        "name": "Tata Consultancy Services",
        "action": "HOLD",
        "target_price": 3700.00,
        "current_price": 3580.25,
        "confidence": 0.68,
        "rationale": "Stable business, but near-term headwinds from global IT spending slowdown. Hold for long-term compounding.",
        "sector": "IT",
    },
    {
        "symbol": "HDFC",
        "name": "HDFC Bank Ltd",
        "action": "BUY",
        "target_price": 1850.00,
        "current_price": 1623.50,
        "confidence": 0.79,
        "rationale": "Post-merger integration with HDFC Ltd progressing well; NIMs expected to improve in FY26.",
        "sector": "Finance",
    },
    {
        "symbol": "WIPRO",
        "name": "Wipro Ltd",
        "action": "SELL",
        "target_price": 400.00,
        "current_price": 445.30,
        "confidence": 0.60,
        "rationale": "Revenue growth remains muted; market share loss to peers warrants caution.",
        "sector": "IT",
    },
]


def search_stocks(query: str) -> StockSearchResponse:
    """
    Search stocks by symbol or name (case-insensitive substring match).

    Args:
        query: Search string (symbol or company name).

    Returns:
        StockSearchResponse with matching results.
    """
    query_lower = query.strip().lower()

    if not query_lower:
        # Return all stocks when query is empty
        matched = MOCK_STOCKS
    else:
        matched = [
            s for s in MOCK_STOCKS
            if query_lower in s["symbol"].lower() or query_lower in s["name"].lower()
        ]

    results = [StockSearchResult(**s) for s in matched]

    return StockSearchResponse(
        query=query,
        results=results,
        total=len(results),
    )


def get_recommendations() -> RecommendationResponse:
    """
    Return mock stock recommendations.

    Returns:
        RecommendationResponse with a list of recommendations.
    """
    recommendations = [Recommendation(**r) for r in MOCK_RECOMMENDATIONS]

    return RecommendationResponse(
        recommendations=recommendations,
        generated_at=datetime.now(timezone.utc).isoformat(),
        disclaimer=(
            "These recommendations are for informational purposes only and do not "
            "constitute financial advice. Please consult a SEBI-registered advisor "
            "before making investment decisions."
        ),
    )
