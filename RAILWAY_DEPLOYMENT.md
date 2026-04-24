# 🚂 Railway Deployment Guide for Aladin

Complete step-by-step guide to deploy the Aladin stock market app to Railway.

## 📋 Prerequisites

1. **Railway Account** - Sign up at [railway.app](https://railway.app)
2. **GitHub Account** - Your code should be in a GitHub repository
3. **API Keys Ready**:
   - Indian Market API Key: `sk-live-D392kLXX1buGEN22DkWtfkJsFXvl7xpXKUEVdX79`
   - Alpha Vantage API Key: `K79DCQ4LIP7M2KHL`

## 🚀 Deployment Steps

### Step 1: Prepare Your GitHub Repository

1. **Initialize Git** (if not already done):
   ```bash
   cd C:\Users\sakar\sasa\study\projects\aladin\Aladin
   git init
   git add .
   git commit -m "Initial commit for Railway deployment"
   ```

2. **Create GitHub Repository**:
   - Go to [github.com/new](https://github.com/new)
   - Name: `aladin-stock-app`
   - Visibility: Public or Private
   - Click "Create repository"

3. **Push to GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/aladin-stock-app.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Create Railway Project

1. **Login to Railway**:
   - Go to [railway.app](https://railway.app)
   - Click "Login" → Sign in with GitHub

2. **Create New Project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Authorize Railway to access your repositories
   - Select your `aladin-stock-app` repository

3. **Railway will auto-detect** your `railway.toml` and create 2 services:
   - `backend` (FastAPI)
   - `frontend` (React/Nginx)

### Step 3: Configure Backend Service

1. **Click on the `backend` service** in Railway dashboard

2. **Add Environment Variables**:
   - Click "Variables" tab
   - Add the following variables:

   ```
   PORT=8000
   ALLOWED_ORIGINS=*
   INDIAN_API_KEY=sk-live-D392kLXX1buGEN22DkWtfkJsFXvl7xpXKUEVdX79
   ALPHA_VANTAGE_API_KEY=K79DCQ4LIP7M2KHL
   ```

3. **Generate Domain**:
   - Click "Settings" tab
   - Under "Networking" → Click "Generate Domain"
   - Copy the domain (e.g., `backend-production-xxxx.up.railway.app`)
   - **Save this URL** - you'll need it for the frontend

4. **Verify Deployment**:
   - Wait for build to complete (green checkmark)
   - Click on the generated domain
   - Add `/docs` to the URL to see FastAPI Swagger docs
   - Example: `https://backend-production-xxxx.up.railway.app/docs`

### Step 4: Configure Frontend Service

1. **Click on the `frontend` service** in Railway dashboard

2. **Add Environment Variables**:
   - Click "Variables" tab
   - Add one variable:

   ```
   VITE_API_URL=https://YOUR_BACKEND_DOMAIN.up.railway.app
   ```
   
   ⚠️ **Important**: Replace `YOUR_BACKEND_DOMAIN` with the actual backend URL from Step 3

3. **Update Backend CORS** (Required!):
   - Go back to **backend service**
   - Click "Variables" tab
   - Update `ALLOWED_ORIGINS`:
   
   ```
   ALLOWED_ORIGINS=https://YOUR_FRONTEND_DOMAIN.up.railway.app
   ```
   
   Or to allow all origins (less secure):
   ```
   ALLOWED_ORIGINS=*
   ```

4. **Generate Domain**:
   - In frontend service → "Settings" tab
   - Under "Networking" → Click "Generate Domain"
   - Copy the domain (e.g., `frontend-production-xxxx.up.railway.app`)

5. **Redeploy Frontend**:
   - After adding VITE_API_URL variable
   - Click "Deployments" tab
   - Click "⋯" menu on latest deployment → "Redeploy"

### Step 5: Verify Complete Deployment

1. **Test Backend API**:
   ```
   https://YOUR_BACKEND_DOMAIN.up.railway.app/docs
   ```
   - Should show FastAPI Swagger documentation
   - Test the `/api/stocks/search?q=tata` endpoint

2. **Test Frontend**:
   ```
   https://YOUR_FRONTEND_DOMAIN.up.railway.app
   ```
   - Should load the Aladin homepage
   - Navigate to Search page
   - Search for "Tata Steel" or "Infosys"
   - Click on a result
   - Verify all 9 tabs display data correctly

## 🔧 Configuration Reference

### Backend Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | Yes (auto-set) | Server port (Railway provides this) |
| `ALLOWED_ORIGINS` | Yes | CORS origins (use `*` or specific domain) |
| `INDIAN_API_KEY` | Yes | Indian Market API authentication key |
| `ALPHA_VANTAGE_API_KEY` | Yes | Alpha Vantage search API key |

### Frontend Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | Yes | Backend API URL (Railway backend domain) |

## 🐛 Troubleshooting

### Issue: Frontend shows "Network Error"
**Solution**: Check VITE_API_URL in frontend variables points to correct backend URL

### Issue: Backend shows CORS errors
**Solution**: Update ALLOWED_ORIGINS in backend to include frontend domain

### Issue: Build fails with ESLint errors
**Solution**: Already handled by `CI=false` in Dockerfile

### Issue: API returns 401 Unauthorized
**Solution**: Verify INDIAN_API_KEY and ALPHA_VANTAGE_API_KEY are correctly set

### Issue: Tabs show "N/A" data
**Solution**: Check browser console logs and backend logs in Railway dashboard

## 📊 Monitoring & Logs

### View Logs:
1. Click on a service (backend or frontend)
2. Click "Deployments" tab
3. Click on the latest deployment
4. View real-time logs at the bottom

### Common Log Commands:
```bash
# Backend logs show:
[DEBUG] Fetching stock details for: 'Tata Steel'
INFO: 200 OK

# Frontend nginx logs show:
GET /api/stocks/details?name=Tata+Steel 200
```

## 🔄 Updating Your App

### Push updates to GitHub:
```bash
git add .
git commit -m "Your update message"
git push origin main
```

Railway will **automatically redeploy** both services when you push to main branch.

## 💰 Cost Estimation

- **Railway Free Tier**: $5 worth of usage per month
- **Estimated usage**: 
  - Backend: ~$3-4/month
  - Frontend: ~$1-2/month
- **Total**: Should fit within free tier for moderate usage

## 🎉 Success Checklist

- [ ] Backend deployed with green status
- [ ] Backend `/docs` endpoint accessible
- [ ] Backend API search endpoint working
- [ ] Frontend deployed with green status
- [ ] Frontend homepage loads
- [ ] Stock search functionality working
- [ ] Stock details page displays all 9 tabs
- [ ] Overview tab shows company description
- [ ] Key Ratios tab shows financial metrics
- [ ] Shareholding tab shows ownership data
- [ ] No console errors in browser

## 📞 Support

If you encounter issues:
1. Check Railway logs for both services
2. Verify all environment variables are set correctly
3. Test backend API endpoints directly in browser
4. Check browser console for frontend errors
5. Verify API keys are valid at their respective providers

---

**Your App URLs** (fill in after deployment):
- Backend API: `https://_____________________________.up.railway.app`
- Frontend App: `https://_____________________________.up.railway.app`
