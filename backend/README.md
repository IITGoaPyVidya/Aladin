# Aladin Backend API

FastAPI backend for Indian stock market data using the **Indian Market API** (stock.indianapi.in).

## 🚀 Features

- **Stock Search**: Search stocks by keyword with intelligent matching
- **Comprehensive Data**: Get detailed stock information including:
  - Current prices (BSE & NSE)
  - Technical analysis (moving averages, trends)
  - Peer comparison with competitors
  - Financial ratios and metrics
  - Analyst ratings and recommendations
  - Shareholding pattern (promoter, mutual funds)
  - Corporate actions (dividends, splits, AGM)
  - Company profile and management
  - Recent news articles with links
- **Quick Summary**: Get key metrics at a glance
- **Popular Stocks**: Pre-curated list of popular Indian stocks

## 📁 Project Structure

```
backend/
├── main.py              # FastAPI app entry point
├── requirements.txt     # Python dependencies
├── .env                 # Environment variables (API keys)
├── .env.example         # Example environment file
├── models/
│   ├── __init__.py
│   └── stock.py         # Pydantic models
├── routes/
│   ├── __init__.py
│   └── stocks.py        # API endpoints
└── services/
    ├── __init__.py
    └── stock_service.py # Business logic & API calls
```

## 🔧 Setup

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure Environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Update the `.env` file with your API key:

```env
INDIAN_API_KEY=your_api_key_here
```

### 3. Run the Server

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at: `http://localhost:8000`

## 📚 API Endpoints

### Health Check
```
GET /
```
Returns server status and available endpoints.

### Search Stocks
```
GET /api/stocks/search?q=tata
```
Search for stocks by keyword matching.

**Query Parameters:**
- `q` (string): Search keyword (e.g., "tata", "reliance", "bank")

**Response:**
```json
{
  "query": "tata",
  "suggestions": ["Tata Steel", "Tata Consultancy Services", ...],
  "total": 2,
  "message": "Found 2 matching stocks"
}
```

### Get Stock Details
```
GET /api/stocks/details?name=Tata Steel
```
Get comprehensive stock information.

**Query Parameters:**
- `name` (string, required): Full company name (e.g., "Tata Steel")

**Response:** Complete stock data including:
- Company profile
- Current prices (BSE/NSE)
- Technical indicators
- Peer comparison
- Analyst ratings
- Corporate actions
- Recent news
- And more...

### Get Stock Summary
```
GET /api/stocks/summary?name=Tata Steel
```
Get a quick summary of key metrics.

**Query Parameters:**
- `name` (string, required): Full company name

**Response:**
```json
{
  "success": true,
  "summary": {
    "company_name": "Tata Steel",
    "industry": "Iron & Steel",
    "bse_price": "210.95",
    "nse_price": "210.91",
    "percent_change": "-0.99",
    "year_high": "216.50",
    "year_low": "137"
  }
}
```

### Get Popular Stocks
```
GET /api/stocks/popular
```
Get a list of popular Indian stocks.

**Response:**
```json
{
  "stocks": ["Tata Steel", "Reliance Industries", "HDFC Bank", ...],
  "total": 19,
  "message": "Popular Indian stocks"
}
```

## 🧪 Testing the API

### Using cURL

```bash
# Search for stocks
curl "http://localhost:8000/api/stocks/search?q=tata"

# Get stock details
curl "http://localhost:8000/api/stocks/details?name=Tata%20Steel"

# Get stock summary
curl "http://localhost:8000/api/stocks/summary?name=Tata%20Steel"

# Get popular stocks
curl "http://localhost:8000/api/stocks/popular"
```

### Using Browser

Visit: `http://localhost:8000/docs` for interactive API documentation (Swagger UI)

## 🐳 Docker Support

Build and run with Docker:

```bash
# Build image
docker build -t aladin-backend .

# Run container
docker run -p 8000:8000 --env-file .env aladin-backend
```

## 📦 Dependencies

- **FastAPI**: Modern web framework
- **Uvicorn**: ASGI server
- **Pydantic**: Data validation
- **Requests**: HTTP client for API calls
- **python-dotenv**: Environment variable management

## 🔒 Security Notes

- **API Key**: Store your Indian Market API key securely in `.env`
- **CORS**: Update `ALLOWED_ORIGINS` in production to restrict access
- **Rate Limits**: Be aware of API rate limits from the Indian Market API provider

## 🎯 Workflow

1. **Frontend searches** → `POST /api/stocks/search?q=keyword`
2. **User selects stock** from suggestions
3. **Frontend fetches details** → `GET /api/stocks/details?name=Full Company Name`
4. **Display comprehensive data** in tabs (Overview, Technical, News, etc.)

## 🚧 Future Enhancements

- [ ] Implement caching for frequently accessed stocks
- [ ] Add rate limiting middleware
- [ ] Add authentication for API access
- [ ] Implement WebSocket for real-time price updates
- [ ] Add AI-powered stock recommendations
- [ ] Historical data analysis endpoints

## 📝 Notes

- The API uses **full company names** (e.g., "Tata Steel", not "TATASTEEL")
- All prices are in Indian Rupees (₹)
- Stock data includes both BSE and NSE prices
- Response times may vary based on API provider's performance

## 🤝 Contributing

1. Keep code clean and well-documented
2. Follow FastAPI best practices
3. Add type hints for all functions
4. Update this README when adding new endpoints

## 📄 License

This project is for educational purposes.

---

Built with ❤️ using FastAPI & Indian Market API
