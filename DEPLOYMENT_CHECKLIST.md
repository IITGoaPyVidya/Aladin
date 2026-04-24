# 📝 Railway Deployment Checklist

Use this checklist to ensure smooth deployment to Railway.

## ✅ Pre-Deployment

- [ ] Code is working locally with `docker compose up --build`
- [ ] All files committed to Git
- [ ] GitHub repository created
- [ ] Code pushed to GitHub (main branch)
- [ ] API keys are ready:
  - [ ] Indian Market API key
  - [ ] Alpha Vantage API key

## ✅ Railway Account Setup

- [ ] Created Railway account at railway.app
- [ ] Connected GitHub account to Railway
- [ ] Authorized Railway to access repositories

## ✅ Backend Service

- [ ] Backend service created from GitHub repo
- [ ] Environment variables added:
  - [ ] `PORT=8000`
  - [ ] `ALLOWED_ORIGINS=*`
  - [ ] `INDIAN_API_KEY=your_key_here`
  - [ ] `ALPHA_VANTAGE_API_KEY=your_key_here`
- [ ] Backend deployed successfully (green checkmark)
- [ ] Generated backend domain
- [ ] Saved backend URL: `_______________________________________`
- [ ] Tested `/docs` endpoint: `https://YOUR_BACKEND.up.railway.app/docs`
- [ ] Tested search endpoint: `/api/stocks/search?q=tata`

## ✅ Frontend Service

- [ ] Frontend service created from GitHub repo
- [ ] Environment variable added:
  - [ ] `VITE_API_URL=https://YOUR_BACKEND.up.railway.app`
- [ ] Frontend deployed successfully (green checkmark)
- [ ] Generated frontend domain
- [ ] Saved frontend URL: `_______________________________________`
- [ ] Frontend redeployed after adding VITE_API_URL

## ✅ CORS Configuration

- [ ] Updated backend `ALLOWED_ORIGINS` with frontend domain
- [ ] Backend redeployed after CORS update

## ✅ Testing

### Backend Tests:
- [ ] FastAPI docs page loads
- [ ] Search endpoint returns results
- [ ] Stock details endpoint returns data
- [ ] No CORS errors in backend logs

### Frontend Tests:
- [ ] Homepage loads correctly
- [ ] Search page accessible
- [ ] Search for "Tata Steel" works
- [ ] Click on search result loads details page
- [ ] All 9 tabs visible
- [ ] Overview tab shows company description
- [ ] Key Ratios tab shows financial data
- [ ] Shareholding tab shows ownership data
- [ ] Technical tab shows moving averages
- [ ] Peer Comparison tab shows competitors
- [ ] Analyst Ratings tab shows recommendations
- [ ] Corporate Actions tab shows dividends
- [ ] Company Profile tab shows management
- [ ] Recent News tab shows news articles
- [ ] No console errors in browser

## ✅ Post-Deployment

- [ ] Both services show "Active" status in Railway
- [ ] Updated README with deployment URLs
- [ ] Shared app URL with users/team
- [ ] Set up custom domain (optional)
- [ ] Configured Railway environment for auto-deploys on push

## 🎉 Deployment Complete!

**Your Live URLs:**
- Frontend: `https://_____________________________.up.railway.app`
- Backend API: `https://_____________________________.up.railway.app`
- API Docs: `https://_____________________________.up.railway.app/docs`

---

## 🔄 Future Updates

To deploy updates:
```bash
git add .
git commit -m "Your update message"
git push origin main
```

Railway will automatically rebuild and redeploy both services! 🚀
