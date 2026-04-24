# 🚂 Railway Single-Service Deployment

Deploy both backend and frontend in **one Railway service** using the unified Dockerfile.

## 📋 What You Have

✅ **Root Dockerfile** - Builds and runs both backend + frontend together
✅ **Nginx** - Serves React frontend and proxies API calls
✅ **Supervisor** - Manages both processes in one container

## 🚀 Deployment Steps

### 1. Push to GitHub

```bash
git add .
git commit -m "Add unified Dockerfile for Railway"
git push origin main
```

### 2. Create Railway Service

1. Go to [railway.app](https://railway.app) → Your project
2. Click **"+ New"** → **"GitHub Repo"**
3. Select your `aladin` repository
4. Railway will auto-detect the `Dockerfile` at root

### 3. Add Environment Variables

In Railway service, click **"Variables"** tab and add:

```bash
PORT=8000
ALLOWED_ORIGINS=*
INDIAN_API_KEY=sk-live-D392kLXX1buGEN22DkWtfkJsFXvl7xpXKUEVdX79
ALPHA_VANTAGE_API_KEY=K79DCQ4LIP7M2KHL
```

### 4. Configure Settings

Click **"Settings"** tab:
- **Root Directory**: Leave empty (uses project root)
- **Builder**: Dockerfile (auto-detected)
- No custom start command needed

### 5. Generate Domain

1. Settings → **"Networking"**
2. Click **"Generate Domain"**
3. Your app is live at: `https://your-app.up.railway.app` 🎉

## ✅ How It Works

```
Railway Service (Port 80)
├── Nginx (Port 80)
│   ├── / → Serves React frontend (static files)
│   └── /api/* → Proxies to backend
└── FastAPI Backend (Port 8000)
    └── Handles all /api requests
```

**Single Domain:**
- Frontend: `https://your-app.up.railway.app`
- API: `https://your-app.up.railway.app/api/stocks/search?q=tata`
- Docs: `https://your-app.up.railway.app/api/docs`

## 🧪 Test Your Deployment

1. **Visit your domain** - Should load the React homepage
2. **Search page** - Navigate to `/search`
3. **Search for stocks** - Try "Infosys", "Tata Steel"
4. **Click result** - Should show all 9 tabs with data
5. **API Docs** - Visit `/api/docs` for Swagger documentation

## 💰 Cost

**Single service** = Lower cost! 
- One container = One price
- Fits easily in Railway free tier ($5/month)

## 🔄 Updates

Push to GitHub and Railway auto-deploys:

```bash
git add .
git commit -m "Your updates"
git push origin main
```

## 🐛 Troubleshooting

### "Cannot connect to backend"
- Check Railway logs: Service → Deployments → View logs
- Verify environment variables are set
- Make sure both nginx and uvicorn are running (check logs)

### "Build failed"
- Verify Dockerfile exists at project root
- Check Railway build logs for errors
- Ensure all files committed to GitHub

### "API returns 404"
- Nginx should proxy `/api/*` to backend
- Check nginx configuration in Dockerfile
- Verify backend is running on port 8000

## 📊 View Logs

Railway Dashboard → Your Service → Deployments → Latest → Logs

You should see:
```
[supervisor] nginx started
[supervisor] backend started
INFO: Uvicorn running on http://127.0.0.1:8000
```

## ✨ Done!

Your entire Aladin app (frontend + backend) is now running in a single Railway service! 🚀
