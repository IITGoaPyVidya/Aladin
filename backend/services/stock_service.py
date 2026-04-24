"""
Indian Market API service layer with Alpha Vantage search.
- Search: Uses Alpha Vantage SYMBOL_SEARCH for global stock discovery
- Details: Uses Indian Market API for comprehensive Indian stock data
"""

import os
import requests
from typing import List, Dict, Any, Optional
from dotenv import load_dotenv

load_dotenv()

# API Configuration
INDIAN_API_BASE_URL = "https://stock.indianapi.in/stock"
INDIAN_API_KEY = os.getenv("INDIAN_API_KEY", "sk-live-D392kLXX1buGEN22DkWtfkJsFXvl7xpXKUEVdX79")

ALPHA_VANTAGE_API_KEY = os.getenv("ALPHA_VANTAGE_API_KEY", "K79DCQ4LIP7M2KHL")
ALPHA_VANTAGE_BASE_URL = "https://www.alphavantage.co/query"


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
    Search for stocks using Alpha Vantage SYMBOL_SEARCH API.
    
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
    
    try:
        # Alpha Vantage SYMBOL_SEARCH API
        url = f"{ALPHA_VANTAGE_BASE_URL}?function=SYMBOL_SEARCH&keywords={query}&apikey={ALPHA_VANTAGE_API_KEY}"
        print(f"[DEBUG] Alpha Vantage URL: {url}")
        
        response = requests.get(url, timeout=10)
        print(f"[DEBUG] Response status: {response.status_code}")
        
        data = response.json()
        print(f"[DEBUG] Response data keys: {list(data.keys())}")
        print(f"[DEBUG] Full response: {data}")
        
        # Check for rate limit
        if 'Note' in data:
            return {
                "query": query,
                "suggestions": [],
                "total": 0,
                "error": "API rate limit exceeded. Please try again in a minute."
            }
        
        # Check for API error messages
        if 'Error Message' in data:
            return {
                "query": query,
                "suggestions": [],
                "total": 0,
                "error": f"API Error: {data['Error Message']}"
            }
        
        if 'bestMatches' in data and data['bestMatches']:
            # Extract stock information
            suggestions = []
            for match in data['bestMatches']:
                stock_info = {
                    "symbol": match.get('1. symbol', 'N/A'),
                    "name": match.get('2. name', 'N/A'),
                    "type": match.get('3. type', 'N/A'),
                    "region": match.get('4. region', 'N/A'),
                    "currency": match.get('8. currency', 'N/A'),
                    "matchScore": match.get('9. matchScore', '0')
                }
                suggestions.append(stock_info)
            
            print(f"[DEBUG] Returning {len(suggestions)} results")
            return {
                "query": query,
                "suggestions": suggestions,
                "total": len(suggestions),
                "message": f"Found {len(suggestions)} matching stocks"
            }
        else:
            print(f"[DEBUG] No bestMatches in response")
            return {
                "query": query,
                "suggestions": [],
                "total": 0,
                "message": "No stocks found. Try different keywords."
            }
    
    except requests.exceptions.Timeout:
        return {
            "query": query,
            "suggestions": [],
            "total": 0,
            "error": "Search timed out - Please try again"
        }
    except requests.exceptions.ConnectionError:
        return {
            "query": query,
            "suggestions": [],
            "total": 0,
            "error": "Connection error - Check your internet connection"
        }
    except Exception as e:
        print(f"[DEBUG] Exception: {str(e)}")
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