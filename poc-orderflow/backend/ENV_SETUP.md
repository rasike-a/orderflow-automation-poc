# Environment Variables & API Keys Setup Guide

## 📋 Required vs Optional

### ✅ **REQUIRED** (System won't work without these)

| Variable | Description | Default | Where to Get |
|----------|-------------|---------|--------------|
| `JWT_SECRET` | Secret key for signing JWT tokens | None | **Generate your own** (see below) |
| `MAGIC_LINK_VERIFY_URL` | Full URL for magic link verification | None | **Set to your server URL** |

### ⚠️ **OPTIONAL** (System works with mock/fallback behavior)

| Variable | Description | Default | Where to Get | Behavior if Missing |
|----------|-------------|---------|--------------|---------------------|
| `PORT` | Server port | `4000` | N/A | Uses default port 4000 |
| `OPENAI_API_KEY` | OpenAI API key | None | [OpenAI Platform](https://platform.openai.com/api-keys) | Returns mock summaries |
| `OPENAI_MODEL` | OpenAI model to use | `gpt-4o-mini` | N/A | Uses default model |
| `RESEND_API_KEY` | Resend API key for emails | None | [Resend Dashboard](https://resend.com/api-keys) | Skips email sending |
| `RESEND_FROM_EMAIL` | Email address to send from | None | Your verified domain | Skips email sending |

---

## 🔑 How to Get API Keys

### 1. **JWT_SECRET** (Required)
Generate a secure random string:
```bash
# Option 1: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Option 2: Using OpenSSL
openssl rand -hex 32

# Option 3: Online generator
# Visit: https://randomkeygen.com/
```

**Example:** `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6`

### 2. **MAGIC_LINK_VERIFY_URL** (Required)
Set this to your server's full URL:
- **Local development:** `http://localhost:4000/auth/magic-link/verify`
- **Production:** `https://yourdomain.com/auth/magic-link/verify`

### 3. **OPENAI_API_KEY** (Optional - for real AI summaries)

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to **API Keys**: https://platform.openai.com/api-keys
4. Click **"Create new secret key"**
5. Copy the key (starts with `sk-...`)
6. **Note:** You'll need to add billing/payment method to use the API

**Cost:** Pay-as-you-go, ~$0.15 per 1M input tokens for `gpt-4o-mini`

### 4. **RESEND_API_KEY** (Optional - for real email sending)

1. Go to [Resend](https://resend.com/)
2. Sign up for a free account
3. Navigate to **API Keys**: https://resend.com/api-keys
4. Click **"Create API Key"**
5. Copy the key (starts with `re_...`)

**Free Tier:** 3,000 emails/month, 100 emails/day

### 5. **RESEND_FROM_EMAIL** (Optional - required if using Resend)

1. In Resend dashboard, go to **Domains**
2. Add and verify your domain (or use their test domain)
3. Format: `"Your Name <no-reply@yourdomain.com>"` or just `"no-reply@yourdomain.com"`

**Test Domain:** Resend provides `onboarding@resend.dev` for testing (limited)

---

## 📝 Example `.env` File

### Minimal Setup (No External APIs)
```env
PORT=4000
JWT_SECRET=your-generated-secret-key-here
MAGIC_LINK_VERIFY_URL=http://localhost:4000/auth/magic-link/verify
```

### Full Setup (With All APIs)
```env
PORT=4000

# Authentication (REQUIRED)
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
MAGIC_LINK_VERIFY_URL=http://localhost:4000/auth/magic-link/verify

# OpenAI (OPTIONAL)
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
OPENAI_MODEL=gpt-4o-mini

# Resend Email (OPTIONAL)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL="OrderFlow <no-reply@yourdomain.com>"
```

---

## 🧪 Testing Without API Keys

The system is designed to work **without** OpenAI and Resend keys:

- ✅ **Authentication** will work (magic links + JWT)
- ✅ **Order creation** will work
- ✅ **Database** will store everything
- ✅ **Job queue** will process jobs
- ⚠️ **AI summaries** will be mock/placeholder text
- ⚠️ **Emails** will be skipped (logged to console)

This is perfect for local development and testing!

---

## 🚀 Quick Start

1. **Copy the example file:**
   ```bash
   cd backend
   cp .env.example .env
   ```

2. **Edit `.env` and set at minimum:**
   - `JWT_SECRET` (generate one)
   - `MAGIC_LINK_VERIFY_URL` (set to your server URL)

3. **Optionally add API keys** if you want real AI/email features

4. **Start the server:**
   ```bash
   npm start
   ```

---

## 🔒 Security Notes

- **Never commit `.env` to git** (it's in `.gitignore`)
- **JWT_SECRET** should be long and random (32+ characters)
- **API keys** are sensitive - keep them secure
- In production, use environment variables or secret management services

---

## ❓ Troubleshooting

**"JWT_SECRET is required" error:**
- Make sure `.env` file exists in `backend/` directory
- Check that `JWT_SECRET` is set (not empty)

**Magic links not working:**
- Verify `MAGIC_LINK_VERIFY_URL` matches your server URL
- Check that the URL is accessible from your browser

**OpenAI errors:**
- Verify API key is correct (starts with `sk-`)
- Check your OpenAI account has credits/billing set up
- Try the mock mode (remove the key) to test other features

**Resend errors:**
- Verify API key is correct (starts with `re_`)
- Check `RESEND_FROM_EMAIL` format is correct
- Verify your domain in Resend dashboard (if using custom domain)

