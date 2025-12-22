# 🚀 Fresh Deployment Guide - Start Clean

## Why Start Fresh?
- ✅ Deploy latest code (not old commits)
- ✅ Clean configuration (no old settings conflicts)
- ✅ Easier to troubleshoot
- ✅ Better organized

---

## Part 1: Delete & Recreate Vercel Project

### Step 1: Delete Old Vercel Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Find your project: `assetdrop-liteheyalec-2157` (or similar)
3. Click on the project
4. Go to **Settings** → Scroll to bottom
5. Click **"Delete Project"** → Type project name to confirm
6. Click **"Delete"**

### Step 2: Create New Vercel Project

1. In Vercel dashboard, click **"Add New"** → **"Project"**
2. Import from GitHub:
   - Select repository: `johndalisto/assetdrop-lite`
   - Branch: `main`
3. **IMPORTANT**: Configure Project Settings:
   - **Framework Preset**: `Create React App` (or auto-detect)
   - **Root Directory**: `frontend` ⚠️ **CRITICAL - Set this!**
   - **Build Command**: `npm run build` (auto-filled)
   - **Output Directory**: `build` (auto-filled)
   - **Install Command**: `npm install` (auto-filled)
4. Click **"Deploy"**

### Step 3: Set Environment Variables (BEFORE First Deploy)

**Before clicking "Deploy"**, click **"Environment Variables"**:

1. Add:
   - **Key**: `REACT_APP_API_URL`
   - **Value**: `https://your-railway-backend-url.railway.app`
   - **Environment**: Production, Preview, Development
   - ⚠️ **Get Railway URL first** (see Part 2, Step 1)

2. Click **"Save"**

3. Then click **"Deploy"**

---

## Part 2: Delete & Recreate Railway Service

### Step 1: Get Your Railway Backend URL First

**Before deleting**, get the URL:

1. Railway dashboard → Your backend service
2. **Settings** → **Networking** or **Domains**
3. Copy the public URL (e.g., `https://assetdrop-liteheyalec-production.up.railway.app`)

**If no domain exists:**
- Enable "Public Networking" or "Generate Domain" first
- Copy the URL

### Step 2: Delete Old Railway Service

1. Railway dashboard → Your project (`daring-contentment`)
2. Click on your backend service (`assetdrop-liteheyalec`)
3. Go to **Settings** → Scroll to bottom
4. Click **"Delete Service"** → Confirm

### Step 3: Create New Railway Service

1. In Railway project, click **"+ New"** → **"GitHub Repo"**
2. Select repository: `johndalisto/assetdrop-lite`
3. **IMPORTANT**: Configure Service:
   - **Root Directory**: `backend` ⚠️ **CRITICAL - Set this!**
   - **Start Command**: `npm start` (auto-filled)
   - **Build Command**: `npm install` (auto-filled)
4. Click **"Deploy"**

### Step 4: Set Environment Variables

1. After service is created, go to **Variables** tab
2. Add these variables:

   ```
   CORS_ORIGINS = https://your-vercel-app.vercel.app,https://your-vercel-app-git-main-john-dalitsos-projects.vercel.app
   AIRTABLE_API_KEY = demo_key
   AIRTABLE_BASE_ID = demo_base
   NODE_ENV = production
   PORT = 3001
   ```

   ⚠️ **Replace `your-vercel-app` with your actual Vercel domain** (get this after Vercel deploys)

3. Railway will auto-redeploy when you save variables

### Step 5: Get Railway Public URL

1. Railway service → **Settings** → **Networking**
2. Enable **"Public Networking"** if not already enabled
3. Copy the public URL (e.g., `https://assetdrop-liteheyalec-production.up.railway.app`)

---

## Part 3: Connect Everything Together

### Step 1: Update Vercel with Railway URL

1. Vercel → Your project → **Settings** → **Environment Variables**
2. Update `REACT_APP_API_URL`:
   - **Value**: `https://your-actual-railway-url.railway.app`
   - (Use the Railway URL from Part 2, Step 5)
3. Click **"Save"**
4. Go to **Deployments** → Click **"Redeploy"** on latest deployment

### Step 2: Update Railway with Vercel URLs

1. Railway → Your service → **Variables**
2. Update `CORS_ORIGINS`:
   - **Value**: `https://your-vercel-domain.vercel.app,https://your-vercel-preview-domain.vercel.app`
   - (Get these from Vercel → Your project → **Settings** → **Domains**)
3. Railway will auto-redeploy

---

## Part 4: Verify Everything Works

### Test Checklist:

1. **Railway Backend Health Check:**
   - Visit: `https://your-railway-url.railway.app/api/health`
   - Should see: `{"status":"OK","timestamp":"..."}`

2. **Vercel Frontend:**
   - Visit your Vercel URL
   - Open browser console (F12)
   - Try to signup/login
   - Check console for errors:
     - ✅ No CORS errors = Good!
     - ✅ No "Failed to fetch" = Good!
     - ❌ CORS error = Railway CORS_ORIGINS wrong
     - ❌ Network error = Vercel REACT_APP_API_URL wrong

3. **Check API Calls:**
   - In browser console → Network tab
   - Try to signup
   - API calls should go to Railway URL (not Cloudflare tunnel)

---

## Quick Reference

### Vercel Configuration:
- **Root Directory**: `frontend`
- **Environment Variable**: `REACT_APP_API_URL` = Railway URL

### Railway Configuration:
- **Root Directory**: `backend`
- **Environment Variables**:
  - `CORS_ORIGINS` = Vercel domains (comma-separated)
  - `AIRTABLE_API_KEY` = `demo_key`
  - `AIRTABLE_BASE_ID` = `demo_base`
  - `NODE_ENV` = `production`
  - `PORT` = `3001`

---

## Troubleshooting

### Vercel shows old commit:
- Make sure you're importing from `main` branch
- Check GitHub has latest code pushed

### Railway service crashes:
- Check Railway logs for errors
- Verify `AIRTABLE_API_KEY` and `AIRTABLE_BASE_ID` are set (even if placeholders)

### Frontend can't connect to backend:
- Verify `REACT_APP_API_URL` in Vercel matches Railway URL exactly
- Verify `CORS_ORIGINS` in Railway includes all Vercel domains
- Check browser console for specific error messages

---

## Need Help?

Share:
1. Your Railway backend URL
2. Your Vercel frontend URL(s)
3. Any error messages from browser console

