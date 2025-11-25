# 🚀 Quick Start: Deploy to Vercel

## Step-by-Step Deployment

### 1. Prepare Your Repository ✅
- Code is already pushed to GitHub
- Vercel configuration files are ready

### 2. Deploy via Vercel Dashboard

1. **Go to**: https://vercel.com/new
2. **Sign in** with GitHub
3. **Import** `rasike-a/orderflow-automation-poc`
4. **Configure**:
   - Framework: **Other**
   - Root Directory: `poc-orderflow`
   - Build Command: (leave empty)
   - Output Directory: (leave empty)
5. **Click "Deploy"**

### 3. Add Environment Variables

After first deployment, go to **Settings → Environment Variables**:

```
JWT_SECRET=your-jwt-secret-from-env-file
MAGIC_LINK_VERIFY_URL=https://YOUR-PROJECT.vercel.app/api/auth/magic-link/verify
OPENAI_API_KEY=your-openai-key-from-env-file
OPENAI_MODEL=gpt-4o-mini
RESEND_API_KEY=your-resend-key-from-env-file
RESEND_FROM_EMAIL=hello@rasike.me
```

**Note**: Get your actual keys from `backend/.env` file (don't commit this file!).

**⚠️ Important**: Replace `YOUR-PROJECT` with your actual Vercel project name after first deploy.

### 4. Redeploy

- Go to **Deployments**
- Click **⋯** on latest deployment
- Select **Redeploy**

### 5. Test Your Deployment

- Frontend: `https://YOUR-PROJECT.vercel.app`
- API Health: `https://YOUR-PROJECT.vercel.app/api/health`
- Test order creation through the frontend

---

## 🎯 Your Deployment URL

After deployment, your app will be available at:
- **Frontend**: `https://YOUR-PROJECT.vercel.app`
- **API**: `https://YOUR-PROJECT.vercel.app/api`

---

## ⚠️ Known Limitations

1. **SQLite**: Database writes may fail in serverless. Consider cloud DB for production.
2. **Background Worker**: Jobs won't auto-process. Need external worker service.
3. **File Persistence**: Data in `/tmp` is ephemeral (resets on each function invocation).

---

## 🔄 Updating After Changes

Just push to GitHub:
```bash
git push origin main
```

Vercel auto-deploys on push to main branch.

---

## 📚 Full Documentation

See `VERCEL_DEPLOY.md` for detailed deployment guide.

