# 🎨 Render Deployment Guide

Complete guide to deploy Aladin app on Render (frontend + backend).

## 📋 Prerequisites

✅ Your code is on GitHub  
✅ You have a Render account ([render.com](https://render.com) - sign up with GitHub)  
✅ API keys ready

---

## 🚀 Part 1: Deploy Backend Service

### Step 1: Create Backend Web Service

1. **Go to Render Dashboard**: [dashboard.render.com](https://dashboard.render.com)
2. Click **"New +"** → Select **"Web Service"**
3. Click **"Connect a repository"**
4. Authorize Render to access your GitHub
5. Select your `Aladin` repository

### Step 2: Configure Backend Settings

**Basic Settings:**
- **Name**: `aladin-backend`
- **Region**: Choose closest to you
- **Branch**: `main`
- **Root Directory**: `backend`
- **Runtime**: `Docker`
- **Docker Command**: Leave empty (uses Dockerfile CMD)

**Instance Type:**
- Select **"Free"** (512MB RAM, spins down after 15 min inactivity)

### Step 3: Add Backend Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add these variables:
```
PORT=8000
ALLOWED_ORIGINS=*
INDIAN_API_KEY=sk-live-D392kLXX1buGEN22DkWtfkJsFXvl7xpXKUEVdX79
ALPHA_VANTAGE_API_KEY=K79DCQ4LIP7M2KHL
```

### Step 4: Deploy Backend

1. Click **"Create Web Service"**
2. Render will build from `backend/Dockerfile`
3. Wait for build to complete (2-5 minutes)
4. Status changes to **"Live"** with green dot ✅
5. **Copy the backend URL** (e.g., `https://aladin-backend.onrender.com`)

### Step 5: Test Backend

Visit: `https://YOUR-BACKEND-URL.onrender.com/docs`

You should see FastAPI Swagger documentation! ✅

---

## 🎨 Part 2: Deploy Frontend Static Site

### Step 1: Create Static Site

1. In Render Dashboard, click **"New +"** → Select **"Static Site"**
2. Select your `Aladin` repository again
3. Click **"Connect"**

### Step 2: Configure Frontend Settings

**Basic Settings:**
- **Name**: `aladin-frontend`
- **Branch**: `main`
- **Root Directory**: `frontend`
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`

### Step 3: Add Frontend Environment Variable

Click **"Advanced"** → **"Add Environment Variable"**

Add this variable (use your backend URL from Part 1):
```
VITE_API_URL=https://YOUR-BACKEND-URL.onrender.com
```

⚠️ **IMPORTANT**: Replace `YOUR-BACKEND-URL` with actual backend URL!

Example: `VITE_API_URL=https://aladin-backend.onrender.com`

### Step 4: Deploy Frontend

1. Click **"Create Static Site"**
2. Render builds your React app (2-4 minutes)
3. Status changes to **"Live"** with green dot ✅
4. You get a URL like: `https://aladin-frontend.onrender.com`

---

## 🔧 Part 3: Update Backend CORS

### Update Backend Environment Variables

1. Go to your **backend service** in Render
2. Click **"Environment"** tab
3. Find `ALLOWED_ORIGINS` variable
4. Click **"Edit"**
5. Change from `*` to your frontend URL:
   ```
   ALLOWED_ORIGINS=https://aladin-frontend.onrender.com
   ```
6. Click **"Save Changes"**
7. Backend will automatically redeploy

---

## ✅ Part 4: Verify Deployment

### Test Backend:
1. Visit: `https://YOUR-BACKEND.onrender.com/docs`
2. Try endpoint: `/api/stocks/search?q=tata`
3. Should return JSON results ✅

### Test Frontend:
1. Visit: `https://YOUR-FRONTEND.onrender.com`
2. Navigate to **Search** page
3. Search for **"Infosys"** or **"Tata Steel"**
4. Click on a result
5. Verify all 9 tabs show data ✅

---

## 📊 Your Live URLs

Fill these in after deployment:

- **Frontend**: `https://_____________________________.onrender.com`
- **Backend API**: `https://_____________________________.onrender.com`
- **API Docs**: `https://_____________________________.onrender.com/docs`

---

## 💡 Important Render Notes

### Free Tier Limitations:
- **Backend**: Spins down after 15 minutes of inactivity
- **First request**: Takes 30-60 seconds to wake up (cold start)
- **After wake**: Normal speed
- **Frontend**: Always fast (no spin down)

### Keep Backend Awake (Optional):
Use a service like [UptimeRobot](https://uptimerobot.com) to ping your backend every 14 minutes to prevent spin-down.

### Custom Domain (Optional):
1. In Static Site, click **"Settings"** → **"Custom Domain"**
2. Add your domain
3. Update DNS records as instructed

---

## 🔄 Future Updates

**To deploy updates:**

```bash
git add .
git commit -m "Your update message"
git push origin main
```

Render automatically detects the push and redeploys both services! 🚀

---

## 🐛 Troubleshooting

### Build Failed:
- Check **"Events"** tab for error messages
- Verify Dockerfiles exist in correct locations
- Check build logs for specific errors

### Frontend Shows Network Error:
- Verify `VITE_API_URL` is set correctly
- Check backend is running (visit /docs)
- Update backend CORS to allow frontend domain

### Backend 500 Error:
- Check **"Logs"** tab in backend service
- Verify environment variables are set
- Check API keys are correct

### Cold Start Slow:
- Normal for free tier
- Backend wakes up in 30-60 seconds
- Consider paid tier ($7/month) for always-on

---

## 💰 Cost

**Free Tier:**
- Frontend: Unlimited, always fast ✅
- Backend: 750 hours/month (enough for side projects) ✅
- Total: $0/month

**Paid Tier** ($7/month per service):
- No spin down
- Faster cold starts
- More resources

---

## 🎉 Done!

Your Aladin app is now live on Render with:
- ✅ React frontend (fast static site)
- ✅ FastAPI backend (Docker-based)
- ✅ Auto-deploy on GitHub push
- ✅ Free hosting!

Enjoy your deployed app! 🚀
