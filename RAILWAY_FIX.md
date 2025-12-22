# 🔧 Fix Railway Build Error

## Error: "Error creating build plan with Railpack"

This error means Railway can't detect how to build your project.

## Solution: Set Root Directory in Railway

### Step 1: Check Railway Service Settings

1. Go to Railway dashboard
2. Click your service: `assetdrop-lite`
3. Go to **Settings** tab
4. Scroll to **"Root Directory"** section
5. **Set it to**: `backend`
6. Click **"Save"**

### Step 2: Redeploy

1. Go to **Deployments** tab
2. Click **"Redeploy"** on the latest deployment
3. Or push a new commit to trigger auto-deploy

---

## Alternative: Delete and Recreate Service

If setting root directory doesn't work:

1. **Delete the service:**
   - Railway → Service → Settings → Delete Service

2. **Create new service:**
   - Railway → "+ New" → "GitHub Repo"
   - Select: `johndalisto/assetdrop-lite`
   - **IMPORTANT**: In service settings, set:
     - **Root Directory**: `backend`
     - **Start Command**: `node src/server.js`
   - Click "Deploy"

3. **Set environment variables:**
   - Go to **Variables** tab
   - Add:
     ```
     CORS_ORIGINS = https://your-vercel-app.vercel.app
     AIRTABLE_API_KEY = demo_key
     AIRTABLE_BASE_ID = demo_base
     NODE_ENV = production
     PORT = 3001
     ```

---

## Verify Build Files

Make sure these files exist in the `backend` folder:
- ✅ `package.json`
- ✅ `nixpacks.toml`
- ✅ `railway.json`
- ✅ `src/server.js`

All these files are present in your repo, so the issue is likely the root directory setting.

---

## Quick Fix Checklist

- [ ] Railway service → Settings → Root Directory = `backend`
- [ ] Save settings
- [ ] Redeploy service
- [ ] Check build logs for success
- [ ] Set environment variables
- [ ] Test backend health: `https://your-railway-url.railway.app/api/health`

