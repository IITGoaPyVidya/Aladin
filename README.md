# Aladin 🪄

> AI-powered stock analysis and recommendation webapp for Indian equities.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite, Recharts, React Router v6 |
| Backend | Python 3.11, FastAPI, Uvicorn |
| Deployment | Railway (Docker-based), Docker Compose for local dev |

---

## Project Structure

```
Aladin/
├── backend/                 # FastAPI backend
│   ├── main.py              # App entry point (CORS, routers)
│   ├── routes/
│   │   └── stocks.py        # /api/search & /api/recommend endpoints
│   ├── services/
│   │   └── stock_service.py # Business logic (mock data → real API)
│   ├── models/
│   │   └── stock.py         # Pydantic data models
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
│
├── frontend/                # React + Vite frontend
│   ├── src/
│   │   ├── components/      # Navbar, SearchBar, StockCard
│   │   ├── pages/           # Home, Dashboard, Search
│   │   └── services/api.js  # Axios client
│   ├── package.json
│   ├── Dockerfile
│   └── .env.example
│
├── docker-compose.yml       # Local development
├── railway.toml             # Railway deployment config
└── README.md
```

---

## Quick Start (Local)

### Option A — Docker Compose (recommended)

```bash
# 1. Copy env files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

# 2. Start both services
docker compose up --build

http://172.18.0.2:5173/
```

- **Frontend**: http://localhost:5173  
- **Backend API**: http://localhost:8000  
- **API docs (Swagger)**: http://localhost:8000/docs

---

### Option B — Run services separately

**Backend**

```bash
cd backend
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn main:app --reload
```

**Frontend**

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/` | Health check |
| `GET` | `/api/stocks/search?q=<query>` | Search stocks globally (Alpha Vantage) |
| `GET` | `/api/stocks/details?name=<stock>` | Get comprehensive stock details (Indian Market API) |
| `GET` | `/api/stocks/summary?name=<stock>` | Get quick stock summary |
| `GET` | `/api/stocks/popular` | Get list of popular Indian stocks |

Interactive API docs are available at **http://localhost:8000/docs** when the backend is running.

---

## 🚂 Railway Deployment

Deploy to Railway in minutes! See [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md) for complete step-by-step guide.

**Quick Deploy:**
1. Push code to GitHub
2. Connect to Railway
3. Set environment variables
4. Deploy! ✨

Railway will auto-detect the `railway.toml` and deploy both backend and frontend services.

---

## 🔑 API Keys Required

- **Indian Market API**: Get your key at [stock.indianapi.in](https://stock.indianapi.in/)
- **Alpha Vantage API**: Get your key at [alphavantage.co](https://www.alphavantage.co/support/#api-key)

---

## Deployment on Railway

1. Push this repo to GitHub and connect it to [Railway](https://railway.app).
2. Railway will detect `railway.toml` and create two services: **backend** and **frontend**.
3. Set environment variables in the Railway dashboard:
   - `ALLOWED_ORIGINS` → your frontend Railway URL (e.g. `https://aladin-frontend.up.railway.app`)
   - `VITE_API_URL` → your backend Railway URL (e.g. `https://aladin-backend.up.railway.app`)
4. Deploy! 🚀

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `8000` | Server port |
| `ALLOWED_ORIGINS` | `*` | Comma-separated CORS origins |
| `NSE_API_KEY` | — | Future: NSE data API key |

### Frontend (`frontend/.env.local`)

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:8000` | Backend base URL |

---

## Roadmap

- [ ] Integrate live NSE/BSE data (replace mock data)
- [ ] User authentication (JWT)
- [ ] Portfolio tracker
- [ ] Price alerts via email / push notifications
- [ ] ML-based recommendation engine

