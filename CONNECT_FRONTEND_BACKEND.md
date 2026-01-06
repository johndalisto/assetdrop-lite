# 🔗 Connect Vercel Frontend to Railway Backend

## Current Status
- ✅ Railway backend: Running on port 3001
- ✅ Vercel frontend: Deployed
- ❌ **Problem**: Frontend can't connect to backend (signup/login fails)

## Why It's Failing

The frontend is trying to connect to:
- Old Cloudflare tunnel URL (if old code deployed)
- Placeholder URL: `https://your-railway-backend.railway.app` (if new code but no env var)

## Step-by-Step Fix

### Step 1: Get Your Railway Backend URL

1. Go to Railway dashboard
2. Click your service: `assetdrop-lite`
3. Go to **Settings** tab
4. Scroll to **Networking** section
5. Click **"Generate Domain"** (if you haven't already)
6. Copy the public URL (e.g., `https://assetdrop-lite-production.up.railway.app`)

**OR** check the **Deploy Logs** - sometimes the URL is shown there.

### Step 2: Set Environment Variable in Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click your project: `assetdrop-lite` (or similar)
3. Go to **Settings** → **Environment Variables**
4. Click **"Add New"**
5. Add:
   - **Key**: `REACT_APP_API_URL`
   - **Value**: `https://your-railway-url.railway.app` (paste your Railway URL)
   - **Environment**: Select all (Production, Preview, Development)
6. Click **"Save"**

### Step 3: Redeploy Vercel

1. Go to **Deployments** tab
2. Click **"..."** on the latest deployment
3. Click **"Redeploy"**
4. Wait for deployment to complete

### Step 4: Get Your Vercel Frontend URLs

1. In Vercel, go to your project
2. Go to **Settings** → **Domains**
3. Copy all domains listed:
   - `https://assetdrop-lite.vercel.app`
   - `https://assetdrop-lite-git-main-john-dalitsos-projects.vercel.app`
   - Any other preview domains

### Step 5: Set CORS in Railway

1. Go to Railway dashboard
2. Click your service: `assetdrop-lite`
3. Go to **Variables** tab
4. Add/Update:
   - **Key**: `CORS_ORIGINS`
   - **Value**: `https://assetdrop-lite.vercel.app,https://assetdrop-lite-git-main-john-dalitsos-projects.vercel.app`
   - (Comma-separated, no spaces after commas - add all your Vercel domains)
5. Make sure these are also set:
   ```
   AIRTABLE_API_KEY = demo_key
   AIRTABLE_BASE_ID = demo_base
   NODE_ENV = production
   PORT = 3001
   ```
6. Railway will auto-redeploy when you save

### Step 6: Test the Connection

1. **Test Railway Backend:**
   - Visit: `https://your-railway-url.railway.app/api/health`
   - Should see: `{"status":"OK","timestamp":"..."}`

2. **Test Frontend:**
   - Visit your Vercel URL
   - Open browser console (F12)
   - Try to signup/login
   - Check console for errors:
     - ✅ No CORS errors = Good!
     - ✅ API calls go to Railway URL = Good!
     - ❌ CORS error = Railway CORS_ORIGINS wrong
     - ❌ Network error = Vercel REACT_APP_API_URL wrong

---

## Quick Checklist

- [ ] Got Railway backend URL
- [ ] Set `REACT_APP_API_URL` in Vercel (with Railway URL)
- [ ] Redeployed Vercel
- [ ] Got all Vercel frontend URLs
- [ ] Set `CORS_ORIGINS` in Railway (with all Vercel URLs, comma-separated)
- [ ] Railway auto-redeployed
- [ ] Tested Railway health endpoint
- [ ] Tested signup/login on frontend

---

## Common Errors

### "Failed to create account" / "Failed to login"
- **Cause**: Frontend can't reach backend
- **Fix**: 
  1. Check `REACT_APP_API_URL` in Vercel matches Railway URL exactly
  2. Check Railway backend is running (check logs)
  3. Check browser console for specific error

### CORS Error in Browser Console
- **Cause**: Railway doesn't allow your Vercel domain
- **Fix**: Add Vercel domain(s) to Railway `CORS_ORIGINS` variable

### "Network Error" or "Failed to fetch"
- **Cause**: Wrong Railway URL or backend not accessible
- **Fix**: 
  1. Test Railway URL directly: `https://your-railway-url.railway.app/api/health`
  2. If that fails, check Railway logs
  3. Verify Railway public domain is generated

### API calls go to wrong URL
- **Cause**: Vercel environment variable not set or old code deployed
- **Fix**: 
  1. Set `REACT_APP_API_URL` in Vercel
  2. Redeploy Vercel
  3. Check deployment uses latest commit (not old commit)

---

## Need Help?

Share:
1. Your Railway backend URL
2. Your Vercel frontend URL
3. Error message from browser console (F12 → Console tab)

