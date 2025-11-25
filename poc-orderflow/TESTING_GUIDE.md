# 🧪 Local Testing Guide

This guide walks you through testing all main scenarios of the OrderFlow POC.

## 📋 Prerequisites Check

✅ Dependencies installed: `npm install` in `backend/`  
✅ Environment configured: `.env` file exists with API keys  
✅ Database initialized: `data.sqlite` will be created automatically  

---

## 🚀 Step 1: Start the Server

```bash
cd poc-orderflow/backend
npm start
```

You should see:
```
Backend running on 4000
Job Worker Started
Connected to database
```

**Keep this terminal running!**

---

## 🧪 Step 2: Test Scenarios

### Scenario 1: Health Check ✅

**Purpose:** Verify server is running

```bash
curl http://localhost:4000/health
```

**Expected Response:**
```json
{"ok":true}
```

---

### Scenario 2: Magic Link Authentication 🔐

**Purpose:** Test the authentication flow

#### 2a. Request Magic Link

```bash
curl -X POST http://localhost:4000/auth/magic-link \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

**Expected Response:**
```json
{
  "status": "sent",
  "message": "Check your email",
  "url": "http://localhost:4000/auth/magic-link/verify?token=..."
}
```

**Copy the URL from the response!**

#### 2b. Verify Magic Link

Open the URL in your browser, or use curl:

```bash
# Replace TOKEN with the token from step 2a
curl "http://localhost:4000/auth/magic-link/verify?token=YOUR_TOKEN_HERE"
```

**Expected:** HTML page with your JWT token displayed

**Copy the JWT token!** You'll need it for the next step.

---

### Scenario 3: Create an Order 📦

**Purpose:** Test the complete order processing flow

```bash
# Replace YOUR_JWT_TOKEN with the token from Scenario 2
curl -X POST http://localhost:4000/orders \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "customerEmail": "customer@example.com",
    "productName": "Test Product"
  }'
```

**Expected Response:**
```json
{
  "orderId": "uuid-here",
  "status": "PROCESSED",
  "aiSummary": "AI-generated summary..."
}
```

**What happens behind the scenes:**
1. ✅ Order saved to database
2. ✅ "Order received" email sent (or skipped if no Resend key)
3. ✅ OpenAI generates order summary
4. ✅ AI request saved to database
5. ✅ Order status updated to PROCESSED
6. ✅ "Order processed" email sent
7. ✅ 3 jobs enqueued (PAYMENT_JOB, AMAZON_ADDRESS_JOB, AMAZON_GIFT_JOB)

---

### Scenario 4: Verify Jobs Processed ⚙️

**Purpose:** Check that background jobs are working

Wait 3-5 seconds after creating an order, then check the database:

```bash
cd poc-orderflow/backend
sqlite3 data.sqlite "SELECT type, status, attempts FROM jobs ORDER BY created_at DESC LIMIT 3;"
```

**Expected Output:**
```
AMAZON_GIFT_JOB|SUCCESS|0
AMAZON_ADDRESS_JOB|SUCCESS|0
PAYMENT_JOB|SUCCESS|0
```

All jobs should show `SUCCESS` status.

---

### Scenario 5: Check Database Records 💾

**Purpose:** Verify data persistence

#### Check Orders
```bash
sqlite3 data.sqlite "SELECT id, customer_email, product_name, status FROM orders ORDER BY created_at DESC LIMIT 5;"
```

#### Check AI Requests
```bash
sqlite3 data.sqlite "SELECT order_id, openai_summary FROM ai_requests ORDER BY created_at DESC LIMIT 1;" | head -c 200
```

#### Check Users
```bash
sqlite3 data.sqlite "SELECT email, created_at FROM users;"
```

---

### Scenario 6: Test Frontend UI 🖥️

**Purpose:** Test the user interface

1. **Open the frontend:**
   ```bash
   # Option 1: Open directly in browser
   open poc-orderflow/frontend/index.html
   
   # Option 2: Serve with HTTP server
   cd poc-orderflow/frontend
   python3 -m http.server 8000
   # Then visit http://localhost:8000
   ```

2. **Get a JWT token** (use Scenario 2)

3. **Fill in the form:**
   - Paste JWT token
   - Enter customer email: `customer@example.com`
   - Enter product name: `Widget`
   - Click "Create Order"

4. **Check the response** displayed below

---

## 🔍 Advanced Testing

### Test Error Scenarios

#### Invalid JWT Token
```bash
curl -X POST http://localhost:4000/orders \
  -H "Authorization: Bearer invalid-token" \
  -H "Content-Type: application/json" \
  -d '{"customerEmail":"test@example.com","productName":"Test"}'
```

**Expected:** `401 Unauthorized`

#### Expired Magic Link
```bash
# Try to verify an old/used token
curl "http://localhost:4000/auth/magic-link/verify?token=old-token"
```

**Expected:** `400 Invalid token` or `Token expired`

#### Missing Required Fields
```bash
curl -X POST http://localhost:4000/orders \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"customerEmail":"test@example.com"}'
```

**Expected:** Order created (productName might be null/empty)

---

## 📊 Monitoring

### Watch Server Logs

The server console shows:
- ✅ Database connections
- ✅ Job processing messages
- ✅ Email sending attempts
- ✅ OpenAI API calls
- ⚠️ Warnings for missing API keys

### Check Job Worker

Jobs are processed every 1.5 seconds. Watch for:
```
Simulating payment job for <orderId>
Simulating Amazon address update <orderId>
Simulating Amazon gift toggle <orderId>
```

---

## ✅ Success Criteria

All scenarios pass if:
- [x] Health check returns `{"ok":true}`
- [x] Magic link creation works
- [x] Magic link verification returns JWT
- [x] Order creation with JWT works
- [x] Orders appear in database
- [x] AI summaries are generated (or mocked)
- [x] Jobs are processed successfully
- [x] Frontend can create orders

---

## 🐛 Troubleshooting

**Server won't start:**
- Check if port 4000 is already in use
- Verify `.env` file exists
- Check `JWT_SECRET` is set

**Authentication fails:**
- Verify JWT token is correct
- Check token hasn't expired (1 day expiry)
- Ensure `JWT_SECRET` matches

**Jobs not processing:**
- Check server logs for errors
- Verify database is accessible
- Check job status in database

**OpenAI not working:**
- Verify `OPENAI_API_KEY` in `.env`
- Check API key is valid
- System will use mock if key missing

**Emails not sending:**
- Verify `RESEND_API_KEY` and `RESEND_FROM_EMAIL` in `.env`
- Check Resend dashboard for domain verification
- System will skip emails if keys missing

---

## 🎯 Quick Test Script

Use the provided test script:

```bash
cd poc-orderflow/backend
node test-flow.js
```

This runs through all scenarios automatically!

