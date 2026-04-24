# 🚂 Railway Manual Deployment Guide

Railway works best when you deploy each service separately. Follow these steps:

## 📋 Prerequisites
- GitHub repository with your code pushed
- Railway account connected to GitHub

## 🚀 Deploy Backend Service

### Step 1: Create Backend Service
1. Go to [railway.app](https://railway.app) → Your project
2. Click **"+ New"** → **"GitHub Repo"**
3. Select your `aladin` repository
4. Railway will ask to configure the service

### Step 2: Configure Backend Build
1. After selecting repo, Railway opens settings
2. **Service Name**: `backend`
3. Click **"Settings"** tab
4. Under **"Build"** section:
   - **Root Directory**: `backend`
   - **Builder**: Dockerfile
5. Under **"Deploy"** section:
   - **Custom Start Command**: `python -m uvicorn main:app --host 0.0.0.0 --port $PORT`

### Step 3: Add Backend Environment Variables
Click **"Variables"** tab, add:
```
PORT=8000
ALLOWED_ORIGINS=*
INDIAN_API_KEY=sk-live-D392kLXX1buGEN22DkWtfkJsFXvl7xpXKUEVdX79
ALPHA_VANTAGE_API_KEY=K79DCQ4LIP7M2KHL
```

### Step 4: Generate Backend Domain
1. Click **"Settings"** → **"Networking"**
2. Click **"Generate Domain"**
3. Copy the URL (e.g., `backend-production-xxxx.up.railway.app`)
4. **Save this URL** - needed for frontend!

---

## 🎨 Deploy Frontend Service

### Step 1: Create Frontend Service
1. In same Railway project, click **"+ New"** → **"GitHub Repo"**
2. Select your `aladin` repository again
3. Name this service: `frontend`

### Step 2: Configure Frontend Build
1. Click **"Settings"** tab
2. Under **"Build"** section:
   - **Root Directory**: `frontend`
   - **Builder**: Dockerfile
3. No custom start command needed (uses nginx)

### Step 3: Add Frontend Environment Variable
Click **"Variables"** tab, add:
```
VITE_API_URL=https://YOUR_BACKEND_DOMAIN.up.railway.app
```
⚠️ Replace with actual backend URL from Step 4 above

### Step 4: Generate Frontend Domain
1. Click **"Settings"** → **"Networking"**
2. Click **"Generate Domain"**
3. Copy the URL - **this is your live app!**

### Step 5: Update Backend CORS
1. Go back to **backend service**
2. Click **"Variables"** tab
3. Update `ALLOWED_ORIGINS`:
   ```
   ALLOWED_ORIGINS=https://YOUR_FRONTEND_DOMAIN.up.railway.app
   ```
4. Service will auto-redeploy

---

## ✅ Verify Deployment

**Backend API:**
- Visit: `https://your-backend.up.railway.app/docs`
- Should show FastAPI documentation
- Test `/api/stocks/search?q=tata`

**Frontend App:**
- Visit: `https://your-frontend.up.railway.app`
- Search for "Infosys" or "Tata Steel"
- Click result → All 9 tabs should show data

---

## 🐛 If Build Still Fails

Railway looks for `Dockerfile` in the root directory you specify:
- Backend looks for: `backend/Dockerfile` ✅ (exists)
- Frontend looks for: `frontend/Dockerfile` ✅ (exists)

If Railway says "Dockerfile not found":
1. Make sure you set **Root Directory** correctly in Settings
2. Verify Dockerfile exists: Check GitHub repo at `backend/Dockerfile` and `frontend/Dockerfile`
3. Try clicking "Redeploy" in Railway dashboard

---

## 💡 Key Points

- **Two separate services** in Railway, both from same GitHub repo
- **Root Directory** setting tells Railway which folder to use
- Each service finds its own `Dockerfile` in that folder
- No need for `railway.toml` - configure in Railway dashboard instead

---

## 🎉 Success!

Your app should now be live on Railway with both services running independently!
