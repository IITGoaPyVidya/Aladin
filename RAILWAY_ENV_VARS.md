# Environment Variables Template for Railway

## Backend Service Variables

```bash
# Server Configuration
PORT=8000

# CORS Configuration (update with your frontend domain after deployment)
ALLOWED_ORIGINS=*

# Indian Market API (for stock details)
# Get your key from: https://stock.indianapi.in/
INDIAN_API_KEY=sk-live-D392kLXX1buGEN22DkWtfkJsFXvl7xpXKUEVdX79

# Alpha Vantage API (for stock search)
# Get your key from: https://www.alphavantage.co/support/#api-key
ALPHA_VANTAGE_API_KEY=K79DCQ4LIP7M2KHL
```

## Frontend Service Variables

```bash
# Backend API URL (update with your Railway backend domain)
VITE_API_URL=https://YOUR_BACKEND_DOMAIN.up.railway.app
```

## Production Configuration Steps

### After Backend Deploys:
1. Copy backend Railway domain (e.g., `backend-production-abc123.up.railway.app`)
2. Update frontend `VITE_API_URL` with the backend domain
3. Redeploy frontend

### After Frontend Deploys:
1. Copy frontend Railway domain (e.g., `frontend-production-xyz789.up.railway.app`)
2. Update backend `ALLOWED_ORIGINS` with the frontend domain
3. Redeploy backend

### Final CORS Configuration (Most Secure):
Replace `ALLOWED_ORIGINS=*` with your actual frontend domain:
```bash
ALLOWED_ORIGINS=https://frontend-production-xyz789.up.railway.app
```

Or allow multiple domains (comma-separated):
```bash
ALLOWED_ORIGINS=https://frontend-production-xyz789.up.railway.app,https://www.yourapp.com
```
