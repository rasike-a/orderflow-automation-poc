# 🔧 Fix Vercel Configuration Mismatch

## Problem
"Configuration Settings in the current Production deployment differ from your current Project Settings."

This happens when Vercel dashboard settings don't match your `vercel.json` file.

---

## ✅ Solution: Align Settings

### Option 1: Use vercel.json (Recommended)

**In Vercel Dashboard:**

1. Go to your project → **Settings** → **General**
2. Scroll to **Build & Development Settings**
3. Make sure these match `vercel.json`:
   - **Framework Preset**: `Other` (or leave as detected)
   - **Root Directory**: `.` (empty/root)
   - **Build Command**: (leave empty)
   - **Output Directory**: (leave empty)
   - **Install Command**: (leave empty, or `cd backend && npm install`)

4. **Save** the settings

5. **Redeploy**:
   - Go to **Deployments**
   - Click **⋯** on latest deployment
   - Select **Redeploy**

---

### Option 2: Update vercel.json to Match Dashboard

If you prefer to keep dashboard settings, update `vercel.json`:

```json
{
  "version": 2,
  "buildCommand": "cd backend && npm install",
  "outputDirectory": ".",
  "installCommand": "cd backend && npm install",
  "builds": [
    {
      "src": "backend/src/api/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "backend/src/api/index.js"
    },
    {
      "src": "/(.*\\.(html|js|css|png|jpg|jpeg|gif|svg|ico))",
      "dest": "frontend/$1"
    },
    {
      "src": "/",
      "dest": "frontend/index.html"
    }
  ]
}
```

---

## 🔍 Common Mismatches

### 1. Root Directory
- **Dashboard**: Might be set to `poc-orderflow` (old structure)
- **Should be**: `.` or empty (root)

### 2. Build Command
- **Dashboard**: Might have a build command
- **Should be**: Empty (or `cd backend && npm install`)

### 3. Framework Preset
- **Dashboard**: Might be set to a specific framework
- **Should be**: `Other` or auto-detected

### 4. Environment Variables
- Check that all env vars are set in **Settings → Environment Variables**
- Make sure they're applied to **Production**, **Preview**, and **Development**

---

## 📋 Step-by-Step Fix

1. **Go to Vercel Dashboard**
   - Navigate to your project
   - Click **Settings** → **General**

2. **Check Build Settings**
   ```
   Framework Preset: Other
   Root Directory: . (or empty)
   Build Command: (empty)
   Output Directory: (empty)
   Install Command: (empty or "cd backend && npm install")
   ```

3. **Check Environment Variables**
   - Go to **Settings** → **Environment Variables**
   - Verify all required vars are set:
     - `JWT_SECRET` ✅
     - `OPENAI_API_KEY` (optional)
     - `OPENAI_MODEL` (optional)
     - `RESEND_API_KEY` (optional)
     - `RESEND_FROM_EMAIL` (optional)
   - Make sure they're enabled for **Production**

4. **Redeploy**
   - Go to **Deployments**
   - Click **⋯** → **Redeploy**
   - Or push a new commit to trigger auto-deploy

---

## 🎯 Quick Fix (Recommended)

**Simplest approach:**

1. In Vercel Dashboard → **Settings** → **General**
2. Set **Root Directory** to `.` (or leave empty)
3. Clear **Build Command** (leave empty)
4. Clear **Output Directory** (leave empty)
5. Set **Framework Preset** to `Other`
6. Click **Save**
7. **Redeploy** the latest deployment

This will make dashboard settings match your `vercel.json`.

---

## ⚠️ If Still Having Issues

1. **Delete and Re-import** (last resort):
   - Delete the project in Vercel
   - Re-import from GitHub
   - Configure fresh with settings above

2. **Check Vercel CLI**:
   ```bash
   vercel --prod
   ```
   This will use `vercel.json` and ignore dashboard settings.

---

## ✅ Verification

After fixing, check:
- ✅ Deployment succeeds without warnings
- ✅ Frontend loads: `https://your-project.vercel.app`
- ✅ API works: `https://your-project.vercel.app/api/health`
- ✅ No configuration warnings in dashboard

---

## 📞 Need Help?

If issues persist:
1. Check Vercel deployment logs
2. Verify `vercel.json` syntax is valid
3. Ensure all environment variables are set
4. Try redeploying from a fresh commit

