# 🚀 Vercel Deployment Guide

This guide will walk you through deploying the OrderFlow POC to Vercel.

## ⚠️ Important Notes

### Limitations on Vercel (Serverless):
1. **SQLite Database**: SQLite files are read-only in serverless functions. The database will work for reads but writes may fail. Consider using a cloud database (PostgreSQL, etc.) for production.
2. **Background Worker**: The job worker won't run in serverless. Jobs will be enqueued but won't process automatically. You'll need a separate worker service or use Vercel Cron Jobs.
3. **File System**: The `/tmp` directory is the only writable location in serverless functions.

---

## 📋 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Vercel CLI** (optional but recommended):
   ```bash
   npm i -g vercel
   ```
3. **GitHub Repository**: Your code should be pushed to GitHub (already done ✅)

---

## 🚀 Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/new
   - Sign in with GitHub

2. **Import Your Repository**
   - Click "Import Git Repository"
   - Select `rasike-a/orderflow-automation-poc`
   - Click "Import"

3. **Configure Project**
   - **Framework Preset**: Other
   - **Root Directory**: `poc-orderflow` (or leave blank if deploying from root)
   - **Build Command**: Leave empty (or `cd backend && npm install`)
   - **Output Directory**: Leave empty
   - Click "Deploy"

4. **Add Environment Variables**
   After deployment starts, go to **Settings → Environment Variables** and add:
   
   ```
   JWT_SECRET=your-jwt-secret-here
   MAGIC_LINK_VERIFY_URL=https://your-project.vercel.app/api/auth/magic-link/verify
   OPENAI_API_KEY=your-openai-key
   OPENAI_MODEL=gpt-4o-mini
   RESEND_API_KEY=your-resend-key
   RESEND_FROM_EMAIL=hello@rasike.me
   PORT=3000
   ```
   
   **Important**: Update `MAGIC_LINK_VERIFY_URL` with your actual Vercel deployment URL after first deploy.

5. **Redeploy**
   - After adding environment variables, go to **Deployments**
   - Click the three dots on the latest deployment
   - Select "Redeploy"

---

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Navigate to Project Root**
   ```bash
   cd poc-orderflow
   ```

4. **Deploy**
   ```bash
   vercel
   ```
   
   Follow the prompts:
   - Set up and deploy? **Y**
   - Which scope? (Select your account)
   - Link to existing project? **N**
   - Project name? `orderflow-automation-poc`
   - Directory? `./`
   - Override settings? **N**

5. **Add Environment Variables**
   ```bash
   vercel env add JWT_SECRET
   vercel env add MAGIC_LINK_VERIFY_URL
   vercel env add OPENAI_API_KEY
   vercel env add OPENAI_MODEL
   vercel env add RESEND_API_KEY
   vercel env add RESEND_FROM_EMAIL
   ```

6. **Deploy to Production**
   ```bash
   vercel --prod
   ```

---

## 🔧 Configuration

### Update Frontend API URL

After deployment, update the frontend to use your Vercel API:

1. **Get your Vercel URL**: `https://your-project.vercel.app`

2. **Update `frontend/script.js`**:
   ```javascript
   const API = "https://your-project.vercel.app/api";
   ```

3. **Or use environment variable**:
   ```javascript
   const API = process.env.API_URL || "http://localhost:4000";
   ```

---

## 📝 Post-Deployment Checklist

- [ ] Environment variables added
- [ ] `MAGIC_LINK_VERIFY_URL` updated with production URL
- [ ] Frontend API URL updated
- [ ] Test health endpoint: `https://your-project.vercel.app/api/health`
- [ ] Test magic link flow
- [ ] Test order creation
- [ ] Verify database operations (may need cloud DB)

---

## 🐛 Troubleshooting

### Database Issues
If you see SQLite errors:
- SQLite is read-only in serverless
- Consider migrating to a cloud database (PostgreSQL on Vercel Postgres, Supabase, etc.)

### Worker Not Running
- Background workers don't run in serverless
- Jobs will be created but won't process automatically
- Use Vercel Cron Jobs or external worker service

### Environment Variables Not Working
- Make sure variables are added in Vercel dashboard
- Redeploy after adding variables
- Check variable names match exactly (case-sensitive)

### CORS Issues
- Already configured with `cors({ origin: "*" })`
- If issues persist, update CORS settings in `backend/src/api/index.js`

---

## 🔄 Updating Deployment

After making changes:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

Vercel will automatically redeploy on push to main branch.

Or manually:
```bash
vercel --prod
```

---

## 📊 Monitoring

- **Vercel Dashboard**: View deployments, logs, and analytics
- **Function Logs**: Check serverless function execution logs
- **Error Tracking**: Monitor errors in Vercel dashboard

---

## 🎯 Next Steps

1. **Database Migration**: Move to Vercel Postgres or Supabase
2. **Worker Service**: Set up separate worker service (Railway, Render, etc.)
3. **Custom Domain**: Add your custom domain in Vercel settings
4. **Environment Management**: Set up preview environments

---

## 📚 Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Serverless Functions](https://vercel.com/docs/concepts/functions)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

