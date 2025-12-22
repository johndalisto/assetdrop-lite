# Deployment Fix Guide

## Issues Fixed

1. ✅ **Frontend API URLs**: Replaced all hardcoded Cloudflare tunnel URLs with environment variable configuration
2. ✅ **Backend CORS**: Updated to accept Vercel domain from environment variables
3. ✅ **Vercel Routing**: Created `vercel.json` for proper React Router support
4. ✅ **Airtable Config**: Fixed to handle empty environment variables gracefully

## Next Steps

### 1. Get Your Railway Backend URL

1. Go to your Railway project dashboard
2. Click on your backend service
3. Find the **"Domains"** section
4. Copy the Railway URL (e.g., `https://your-app.up.railway.app`)

### 2. Update Vercel Environment Variables

1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Add/Update:
   ```
   REACT_APP_API_URL = https://your-railway-backend-url.railway.app
   ```
   (Replace with your actual Railway URL)

4. **Redeploy** your Vercel project after adding the variable

### 3. Update Railway Environment Variables

1. Go to your Railway project dashboard
2. Click on your backend service
3. Click **Variables** tab
4. Add/Update:
   ```
   CORS_ORIGINS = https://your-vercel-app.vercel.app,https://your-vercel-app-git-main-username.vercel.app
   ```
   (Add all your Vercel domains - check your Vercel deployment for the exact URLs)

5. Make sure these are set (even if using placeholders):
   ```
   AIRTABLE_API_KEY = demo_key
   AIRTABLE_BASE_ID = demo_base
   NODE_ENV = production
   PORT = 3001
   ```

6. **Redeploy** your Railway service after updating variables

### 4. Test the Deployment

1. Visit your Vercel frontend URL
2. Try to login/signup
3. Check browser console for any errors
4. Check Railway logs if there are issues

## Troubleshooting

### Vercel shows 404
- Make sure `vercel.json` is in the `frontend` folder
- Check that Root Directory is set to `frontend` in Vercel project settings
- Redeploy after making changes

### Login/Signup fails
- Check that `REACT_APP_API_URL` is set correctly in Vercel
- Check that Railway backend is running (check logs)
- Check that `CORS_ORIGINS` includes your Vercel domain in Railway

### Railway service crashes
- Check Railway logs for error messages
- Make sure `AIRTABLE_API_KEY` and `AIRTABLE_BASE_ID` are set (even if placeholders)
- Make sure `NODE_ENV` is set to `production`

## Files Changed

- `frontend/src/config/api.ts` - New API configuration file
- `frontend/src/contexts/AuthContext.tsx` - Updated to use API config
- `frontend/src/pages/AdminDashboard.tsx` - Updated to use API config
- `frontend/src/pages/ClientDashboard.tsx` - Updated to use API config
- `frontend/src/pages/SubmissionPage.tsx` - Updated to use API config
- `frontend/src/pages/DashboardPage.tsx` - Updated to use API config
- `frontend/vercel.json` - Created for React Router support
- `backend/src/server.js` - Updated CORS configuration
- `backend/src/config/airtable.js` - Fixed empty variable check

