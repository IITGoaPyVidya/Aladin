"""
Indian Market API service layer with local CSV search.
- Search: Uses local NSE India ticker CSV for stock discovery
- Details: Uses Indian Market API for comprehensive Indian stock data
"""

import os
import requests
import pandas as pd
from pathlib import Path
from typing import List, Dict, Any, Optional
from dotenv import load_dotenv
from rapidfuzz import fuzz, process

load_dotenv()

# API Configuration
INDIAN_API_BASE_URL = "https://stock.indianapi.in/stock"
INDIAN_API_KEY = os.getenv("INDIAN_API_KEY", "sk-live-D392kLXX1buGEN22DkWtfkJsFXvl7xpXKUEVdX79")

# CSV file path (relative to this file)
CSV_PATH = Path(__file__).parent.parent / "data" / "Ticker_List_NSE_India.csv"

# Load stock data once at module level
try:
    STOCK_DATA = pd.read_csv(CSV_PATH)
    print(f"[INFO] Loaded {len(STOCK_DATA)} stocks from CSV")
except Exception as e:
    print(f"[ERROR] Failed to load CSV: {e}")
    STOCK_DATA = pd.DataFrame()


def clean_company_name(name: str) -> str:
    """
    Clean company name for Indian Market API compatibility.
    Removes common suffixes like Limited, Ltd, Private, etc.
    
    Examples:
        "Tata Steel Limited" -> "Tata Steel"
        "Reliance Industries Ltd" -> "Reliance Industries"
        "HDFC Bank Ltd." -> "HDFC Bank"
    """
    if not name:
        return name
    
    # Remove common suffixes (case-insensitive)
    suffixes = [
        " Limited", " Ltd", " Ltd.", " LTD",
        " Private Limited", " Pvt Ltd", " Pvt. Ltd.",
        " Private", " Pvt", " Pvt.",
        " Incorporated", " Inc", " Inc.",
        " Corporation", " Corp", " Corp.",
        " Company", " Co", " Co.",
        " Public Limited", " PLC",
    ]
    
    cleaned = name
    for suffix in suffixes:
        if cleaned.endswith(suffix):
            cleaned = cleaned[:-len(suffix)]
    
    return cleaned.strip()


def search_stocks(query: str) -> Dict[str, Any]:
    """
    Search for stocks using local NSE India CSV data with fuzzy matching.
    
    Args:
        query: Search keyword (company name or symbol)
    
    Returns:
        Dictionary with search results
    """
    if not query or len(query.strip()) < 2:
        return {
            "query": query,
            "suggestions": [],
            "total": 0,
            "message": "Enter at least 2 characters to search"
        }
    
    if STOCK_DATA.empty:
        return {
            "query": query,
            "suggestions": [],
            "total": 0,
            "error": "Stock database not available"
        }
    
    try:
        query_lower = query.lower().strip()
        
        # Create searchable text combining symbol and company name
        STOCK_DATA['search_text'] = (STOCK_DATA['SYMBOL'].astype(str) + ' ' + 
                                      STOCK_DATA['NAME OF COMPANY'].astype(str)).str.lower()
        
        # Use rapidfuzz to find best matches
        matches = process.extract(
            query_lower,
            STOCK_DATA['search_text'].tolist(),
            scorer=fuzz.WRatio,
            limit=10
        )
        
        # Format results
        suggestions = []
        for match_text, score, idx in matches:
            if score > 40:  # Only include reasonable matches
                row = STOCK_DATA.iloc[idx]
                stock_info = {
                    "symbol": str(row['SYMBOL']),
                    "name": str(row['NAME OF COMPANY']),
                    "type": "Equity",
                    "region": "India",
                    "currency": "INR",
                    "matchScore": f"{score/100:.4f}"
                }
                suggestions.append(stock_info)
        
        print(f"[DEBUG] CSV Search: '{query}' returned {len(suggestions)} results")
        
        if suggestions:
            return {
                "query": query,
                "suggestions": suggestions,
                "total": len(suggestions),
                "message": f"Found {len(suggestions)} matching Indian stocks"
            }
        else:
            return {
                "query": query,
                "suggestions": [],
                "total": 0,
                "message": "No stocks found. Try different keywords."
            }
    
    except Exception as e:
        print(f"[ERROR] Search failed: {str(e)}")
        return {
            "query": query,
            "suggestions": [],
            "total": 0,
            "error": f"Search error: {str(e)}"
        }



def get_stock_details(stock_name: str) -> Dict[str, Any]:
    """
    Fetch comprehensive stock details from Indian Market API.
    Works best with full Indian company names (e.g., "Tata Steel", "Reliance Industries")
    
    Args:
        stock_name: Full company name or search query
    
    Returns:
        Dictionary with comprehensive stock data or error message
    """
    # Clean the company name (remove Limited, Ltd, etc.)
    cleaned_name = clean_company_name(stock_name)
    
    try:
        # Prepare request with cleaned name
        url = f"{INDIAN_API_BASE_URL}?name={cleaned_name}"
        headers = {"x-api-key": INDIAN_API_KEY}
        
        print(f"[DEBUG] Fetching stock details for: '{cleaned_name}' (original: '{stock_name}')")
        print(f"[DEBUG] URL: {url}")
        
        # Make API call with longer timeout
        response = requests.get(url, headers=headers, timeout=30)
        
        if response.status_code == 200:
            data = response.json()
            
            # Debug: Log key data structures
            print(f"[DEBUG] Response keys: {list(data.keys())}")
            if 'financials' in data:
                print(f"[DEBUG] Financials type: {type(data['financials'])}, length: {len(data['financials']) if isinstance(data['financials'], list) else 'not a list'}")
                if isinstance(data['financials'], list) and len(data['financials']) > 0:
                    print(f"[DEBUG] First financial item keys: {list(data['financials'][0].keys())}")
                    if 'stockFinancialMap' in data['financials'][0]:
                        print(f"[DEBUG] stockFinancialMap keys: {list(data['financials'][0]['stockFinancialMap'].keys())}")
            else:
                print("[DEBUG] No 'financials' key in response")
                
            if 'shareholding' in data:
                print(f"[DEBUG] shareholding type: {type(data['shareholding'])}, length: {len(data['shareholding']) if isinstance(data['shareholding'], list) else 'not a list'}")
                if isinstance(data['shareholding'], list) and len(data['shareholding']) > 0:
                    print(f"[DEBUG] First shareholding item keys: {list(data['shareholding'][0].keys())}")
            else:
                print("[DEBUG] No 'shareholding' key in response")
            
            return {
                "success": True,
                "data": data,
                "original_query": stock_name,
                "cleaned_query": cleaned_name
            }
        elif response.status_code == 401:
            return {
                "success": False,
                "error": "Authentication failed - Invalid API key",
                "status_code": 401
            }
        elif response.status_code == 404:
            return {
                "success": False,
                "error": f"Stock '{cleaned_name}' not found. This API works best with Indian stocks.",
                "status_code": 404,
                "original_query": stock_name,
                "cleaned_query": cleaned_name,
                "suggestion": "Try searching for popular Indian stocks like: Tata Steel, Reliance Industries, HDFC Bank, Infosys, TCS"
            }
        else:
            return {
                "success": False,
                "error": f"API error: {response.status_code}",
                "status_code": response.status_code
            }
            
    except requests.exceptions.Timeout:
        return {
            "success": False,
            "error": "Request timed out - Please try again"
        }
    except requests.exceptions.ConnectionError:
        return {
            "success": False,
            "error": "Connection error - Please check your internet connection"
        }
    except Exception as e:
        return {
            "success": False,
            "error": f"Unexpected error: {str(e)}"
        }


def get_stock_summary(stock_name: str) -> Dict[str, Any]:
    """
    Get a quick summary of key stock metrics.
    
    Args:
        stock_name: Full company name
    
    Returns:
        Dictionary with summary data
    """
    details = get_stock_details(stock_name)
    
    if not details.get("success"):
        return details
    
    data = details.get("data", {})
    
    # Extract key metrics
    company_name = data.get("companyName", stock_name)
    industry = data.get("industry", "N/A")
    current_price = data.get("currentPrice", {})
    bse_price = current_price.get("BSE", "N/A")
    nse_price = current_price.get("NSE", "N/A")
    percent_change = data.get("percentChange", "N/A")
    year_high = data.get("yearHigh", "N/A")
    year_low = data.get("yearLow", "N/A")
    
    return {
        "success": True,
        "summary": {
            "company_name": company_name,
            "industry": industry,
            "bse_price": bse_price,
            "nse_price": nse_price,
            "percent_change": percent_change,
            "year_high": year_high,
            "year_low": year_low
        }
    }


# ============ NEW FEATURES ============

import random
from datetime import datetime, timedelta


def screen_stocks(min_price=None, max_price=None, sector=None, limit=50):
    """Filter stocks by criteria"""
    try:
        # Get random sample from CSV
        filtered = STOCK_DATA.copy()
        
        # For demo, randomly assign prices and sectors
        filtered['demo_price'] = [random.randint(100, 5000) for _ in range(len(filtered))]
        
        # Define sector mapping based on company names
        def classify_sector(name):
            name_lower = name.lower()
            if any(word in name_lower for word in ['tech', 'infotech', 'software', 'systems', 'digital', 'computer']):
                return 'IT & Technology'
            elif any(word in name_lower for word in ['bank', 'finance', 'capital', 'insurance', 'nbfc']):
                return 'Banking & Finance'
            elif any(word in name_lower for word in ['pharma', 'drug', 'healthcare', 'hospital', 'medical', 'life']):
                return 'Pharmaceuticals'
            elif any(word in name_lower for word in ['motor', 'auto', 'vehicle', 'tyre', 'automotive']):
                return 'Automotive'
            elif any(word in name_lower for word in ['power', 'energy', 'oil', 'gas', 'petroleum', 'solar']):
                return 'Energy & Power'
            elif any(word in name_lower for word in ['consumer', 'fmcg', 'foods', 'beverages', 'retail']):
                return 'Consumer Goods'
            elif any(word in name_lower for word in ['steel', 'metal', 'mining', 'cement', 'aluminium']):
                return 'Materials'
            else:
                return 'Others'
        
        filtered['sector'] = filtered['NAME OF COMPANY'].apply(classify_sector)
        
        # Apply filters
        if min_price:
            filtered = filtered[filtered['demo_price'] >= min_price]
        if max_price:
            filtered = filtered[filtered['demo_price'] <= max_price]
        if sector:
            filtered = filtered[filtered['sector'].str.contains(sector, case=False, na=False)]
        
        # Limit results
        filtered = filtered.head(limit)
        
        # Format response
        results = []
        for _, row in filtered.iterrows():
            results.append({
                'symbol': str(row['SYMBOL']),
                'name': str(row['NAME OF COMPANY']),
                'price': float(row['demo_price']),
                'sector': str(row['sector']),
                'change': round(random.uniform(-5, 5), 2),
                'changePercent': round(random.uniform(-10, 10), 2)
            })
        
        return {
            'success': True,
            'results': results,
            'total': len(results),
            'filters': {
                'min_price': min_price,
                'max_price': max_price,
                'sector': sector
            }
        }
    except Exception as e:
        return {'success': False, 'error': str(e)}


def get_sectors_data():
    """Get sector-wise stock grouping"""
    try:
        # Define sectors with representative stocks
        sectors = {
            'IT & Technology': ['TCS', 'INFY', 'WIPRO', 'HCLTECH', 'TECHM'],
            'Banking & Finance': ['HDFCBANK', 'ICICIBANK', 'SBIN', 'KOTAKBANK', 'AXISBANK'],
            'Pharmaceuticals': ['SUNPHARMA', 'DRREDDY', 'CIPLA', 'LUPIN', 'AUROPHARMA'],
            'Automotive': ['TATAMOTORS', 'MARUTI', 'M&M', 'BAJAJ-AUTO', 'HEROMOTOCO'],
            'Energy & Power': ['RELIANCE', 'ONGC', 'NTPC', 'POWERGRID', 'ADANIGREEN'],
            'Consumer Goods': ['ITC', 'HINDUNILVR', 'NESTLEIND', 'BRITANNIA', 'DABUR'],
            'Materials': ['TATASTEEL', 'JSWSTEEL', 'HINDALCO', 'ULTRACEMCO', 'ACC'],
            'Telecom': ['BHARTIARTL', 'TATACOMM']
        }
        
        sector_data = []
        for sector_name, stocks in sectors.items():
            # Generate random performance data
            performance = round(random.uniform(-3, 6), 2)
            color = 'green' if performance > 0 else 'red'
            
            sector_data.append({
                'sector': sector_name,
                'stocks': stocks,
                'stockCount': len(stocks),
                'performance': performance,
                'color': color,
                'topGainer': random.choice(stocks),
                'topGainerChange': round(random.uniform(2, 15), 2)
            })
        
        return {
            'success': True,
            'sectors': sector_data,
            'total': len(sector_data)
        }
    except Exception as e:
        return {'success': False, 'error': str(e)}


def get_news_sentiment(symbol):
    """Get news with sentiment analysis"""
    try:
        # Mock news data with sentiment
        news_items = [
            {
                'headline': f'{symbol} reports strong quarterly earnings, beats estimates',
                'sentiment': 'Bullish',
                'score': 0.85,
                'date': (datetime.now() - timedelta(hours=2)).strftime('%Y-%m-%d %H:%M'),
                'source': 'Economic Times'
            },
            {
                'headline': f'Market analysts upgrade {symbol} target price',
                'sentiment': 'Bullish',
                'score': 0.72,
                'date': (datetime.now() - timedelta(hours=5)).strftime('%Y-%m-%d %H:%M'),
                'source': 'Business Standard'
            },
            {
                'headline': f'{symbol} announces dividend payout',
                'sentiment': 'Neutral',
                'score': 0.55,
                'date': (datetime.now() - timedelta(days=1)).strftime('%Y-%m-%d %H:%M'),
                'source': 'Moneycontrol'
            },
            {
                'headline': f'Concerns over {symbol} debt levels rise',
                'sentiment': 'Bearish',
                'score': 0.25,
                'date': (datetime.now() - timedelta(days=2)).strftime('%Y-%m-%d %H:%M'),
                'source': 'Mint'
            },
            {
                'headline': f'{symbol} stock hits 52-week high on strong demand',
                'sentiment': 'Bullish',
                'score': 0.90,
                'date': (datetime.now() - timedelta(days=3)).strftime('%Y-%m-%d %H:%M'),
                'source': 'LiveMint'
            }
        ]
        
        # Calculate overall sentiment
        avg_score = sum(n['score'] for n in news_items) / len(news_items)
        overall = 'Bullish' if avg_score > 0.6 else 'Bearish' if avg_score < 0.4 else 'Neutral'
        
        return {
            'success': True,
            'symbol': symbol,
            'news': news_items,
            'overall_sentiment': overall,
            'sentiment_score': round(avg_score, 2),
            'total': len(news_items)
        }
    except Exception as e:
        return {'success': False, 'error': str(e)}


def get_ai_analysis(stock_name, persona):
    """AI analyst personas analysis"""
    try:
        # Fetch stock data first
        stock_data = get_stock_details(stock_name)
        if not stock_data.get('success'):
            return {'success': False, 'error': 'Could not fetch stock data'}
        
        data = stock_data['data']
        
        # Generate analysis based on persona
        personas = {
            'fundamental': {
                'name': 'Warren Buffett Style - Deep Value',
                'icon': '💼',
                'focus': 'Intrinsic Value, Moats, Long-term Growth',
                'style': 'Conservative, fundamentals-focused analysis'
            },
            'technical': {
                'name': 'Technical Trader',
                'icon': '📈',
                'focus': 'Chart Patterns, Support/Resistance, Momentum',
                'style': 'Data-driven technical analysis'
            },
            'growth': {
                'name': 'Cathie Wood Style - Growth Investor',
                'icon': '🚀',
                'focus': 'Innovation, Disruption, Future Potential',
                'style': 'Aggressive growth-focused'
            },
            'value': {
                'name': 'Ben Graham Style - Contrarian Value',
                'icon': '💎',
                'focus': 'Undervalued Assets, Margin of Safety',
                'style': 'Conservative value investing'
            },
            'momentum': {
                'name': 'Momentum Trader',
                'icon': '⚡',
                'focus': 'Price Action, Volume, Short-term Trends',
                'style': 'Fast-paced momentum trading'
            }
        }
        
        if persona not in personas:
            return {'success': False, 'error': 'Invalid persona'}
        
        persona_info = personas[persona]
        
        # Generate analysis (simplified - you can enhance with actual logic)
        price = float(data.get('currentPrice', {}).get('NSE', 0) or 0)
        pe_ratio = random.uniform(10, 40)
        recommendation = random.choice(['BUY', 'HOLD', 'SELL'])
        confidence = random.randint(60, 95)
        
        # Persona-specific insights
        if persona == 'fundamental':
            insights = [
                f"Strong moat in {data.get('industry', 'sector')} with competitive advantages",
                f"P/E ratio of {pe_ratio:.1f} suggests {'undervaluation' if pe_ratio < 20 else 'fair valuation'}",
                "Consistent dividend history shows financial stability",
                "Management quality is key - look for integrity and capital allocation",
                "Long-term hold recommended for patient investors"
            ]
            target_price = price * random.uniform(1.2, 1.5)
            timeframe = "12-24 months"
        
        elif persona == 'technical':
            insights = [
                f"Stock trading {'above' if random.random() > 0.5 else 'below'} 200-day moving average",
                "RSI indicates neutral momentum - watch for breakouts",
                "Strong support at ₹" + str(int(price * 0.9)),
                "Resistance at ₹" + str(int(price * 1.1)),
                "Volume spike detected - potential breakout incoming"
            ]
            target_price = price * random.uniform(1.05, 1.15)
            timeframe = "1-3 months"
        
        elif persona == 'growth':
            insights = [
                "Exponential growth potential in emerging market",
                "Innovation-driven company with strong R&D pipeline",
                "Market disruption opportunity in next 3-5 years",
                "Revenue growth trajectory exceeds industry average",
                "Early-stage investment with high upside potential"
            ]
            target_price = price * random.uniform(1.5, 2.0)
            timeframe = "18-36 months"
        
        elif persona == 'value':
            insights = [
                "Trading below intrinsic value - margin of safety present",
                "Asset-rich company with strong balance sheet",
                "Market overlooking fundamental strength",
                "Mean reversion opportunity - historically undervalued",
                "Book value provides downside protection"
            ]
            target_price = price * random.uniform(1.3, 1.7)
            timeframe = "6-18 months"
        
        else:  # momentum
            insights = [
                "Strong price momentum in recent weeks",
                "Volume surge indicates institutional buying",
                "Trend following signal - ride the wave",
                "Short-term overbought - wait for pullback",
                "Quick profit potential but manage risk"
            ]
            target_price = price * random.uniform(1.08, 1.12)
            timeframe = "2-4 weeks"
        
        return {
            'success': True,
            'stock': stock_name,
            'persona': persona_info,
            'analysis': {
                'recommendation': recommendation,
                'confidence': confidence,
                'current_price': price,
                'target_price': round(target_price, 2),
                'potential_return': round(((target_price - price) / price) * 100, 2),
                'timeframe': timeframe,
                'risk_level': random.choice(['Low', 'Medium', 'High']),
                'insights': insights
            },
            'key_metrics': {
                'pe_ratio': round(pe_ratio, 1),
                'market_cap': data.get('marketCap', 'N/A'),
                'industry': data.get('industry', 'N/A'),
                'year_high': data.get('yearHigh', 'N/A'),
                'year_low': data.get('yearLow', 'N/A')
            }
        }
    except Exception as e:
        return {'success': False, 'error': str(e)}