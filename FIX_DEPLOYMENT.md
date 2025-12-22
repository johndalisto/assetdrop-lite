# 🔧 Fix Deployment Connection Issues

## Current Status
- ✅ Vercel frontend: Deployed successfully
- ✅ Railway backend: Running on port 3001
- ❌ **Problem**: They're not connected!

## Why It's Not Working

1. **Frontend** is using placeholder URL: `https://your-railway-backend.railway.app`
2. **Backend** doesn't have Vercel domain in CORS allowed origins

## Step-by-Step Fix

### 1. Get Your Railway Backend URL

1. Go to Railway dashboard
2. Click on your backend service (`assetdrop-liteheyalec`)
3. Click **"Settings"** tab
4. Scroll to **"Domains"** section
5. Copy the URL (looks like: `https://assetdrop-liteheyalec-production.up.railway.app`)

**OR** check the **"Deploy Logs"** - sometimes the URL is shown there.

### 2. Update Vercel Environment Variables

1. Go to Vercel dashboard
2. Click your project (`assetdrop-liteheyalec-2157`)
3. Go to **Settings** → **Environment Variables**
4. Click **"Add New"**
5. Add:
   - **Key**: `REACT_APP_API_URL`
   - **Value**: `https://your-railway-url.railway.app` (paste your Railway URL)
   - **Environment**: Production (and Preview if you want)
6. Click **"Save"**
7. Go to **Deployments** tab
8. Click **"..."** on the latest deployment → **"Redeploy"**

### 3. Get Your Vercel Frontend URLs

1. In Vercel, go to your project
2. Check the **"Domains"** section
3. Copy all domains (usually 2-3):
   - `https://assetdrop-liteheyalec-2157.vercel.app`
   - `https://assetdrop-liteheyalec-2157-git-main-john-dalitsos-projects.vercel.app`
   - Any custom domains

### 4. Update Railway CORS

1. Go to Railway dashboard
2. Click your backend service
3. Go to **"Variables"** tab
4. Add/Update:
   - **Key**: `CORS_ORIGINS`
   - **Value**: `https://assetdrop-liteheyalec-2157.vercel.app,https://assetdrop-liteheyalec-2157-git-main-john-dalitsos-projects.vercel.app`
   (comma-separated, no spaces after commas)
5. Make sure these are also set:
   - `AIRTABLE_API_KEY` = `demo_key`
   - `AIRTABLE_BASE_ID` = `demo_base`
   - `NODE_ENV` = `production`
6. Railway will auto-redeploy when you save variables

### 5. Test the Connection

1. Visit your Vercel frontend URL
2. Open browser console (F12)
3. Try to login/signup
4. Check for errors:
   - **CORS error**: Railway CORS_ORIGINS not set correctly
   - **404/Network error**: Vercel REACT_APP_API_URL not set correctly
   - **Connection refused**: Railway backend not running

## Quick Checklist

- [ ] Got Railway backend URL
- [ ] Set `REACT_APP_API_URL` in Vercel
- [ ] Redeployed Vercel
- [ ] Got Vercel frontend URLs
- [ ] Set `CORS_ORIGINS` in Railway (comma-separated)
- [ ] Railway auto-redeployed
- [ ] Tested login/signup on live site

## Common Issues

### "Network Error" or "Failed to fetch"
- **Cause**: Frontend can't reach backend
- **Fix**: Check `REACT_APP_API_URL` in Vercel matches Railway URL exactly

### "CORS error" or "Not allowed by CORS"
- **Cause**: Railway doesn't allow your Vercel domain
- **Fix**: Add Vercel domain(s) to Railway `CORS_ORIGINS` variable

### "404 Not Found" on API calls
- **Cause**: Wrong Railway URL or backend routes not working
- **Fix**: Test Railway URL directly: `https://your-railway-url.railway.app/api/health`

### Backend shows "Online" but requests fail
- **Cause**: Backend might be crashing on startup
- **Fix**: Check Railway "Deploy Logs" for error messages

## Need Help?

Share:
1. Your Railway backend URL
2. Your Vercel frontend URL(s)
3. Any error messages from browser console

