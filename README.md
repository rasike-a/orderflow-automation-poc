# OrderFlow POC

A proof-of-concept implementation for an ecommerce automation system demonstrating:
- Magic link authentication
- JWT-based API protection
- Order creation and processing
- OpenAI integration for order analysis
- Email notifications via Resend
- SQLite database with job queue
- Background worker for job processing

## 📋 Project Structure

```
poc-orderflow/
├── backend/
│   ├── src/
│   │   ├── server.js          # Express API server
│   │   ├── db.js              # SQLite database setup
│   │   ├── auth.js            # Magic link & JWT auth
│   │   ├── openaiClient.js   # OpenAI API integration
│   │   ├── resendClient.js   # Resend email integration
│   │   └── jobQueue/
│   │       ├── queue.js       # Job enqueueing
│   │       ├── worker.js      # Background worker
│   │       └── handlers.js    # Job handlers (simulated)
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── index.html             # Simple test UI
│   └── script.js              # Frontend logic
└── docs/
    └── context.md             # Project context & scope
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- SQLite3 (usually comes with Node.js)

### Setup

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your API keys:
   ```env
   PORT=4000
   OPENAI_API_KEY=your_openai_key_here
   OPENAI_MODEL=gpt-4o-mini
   RESEND_API_KEY=your_resend_key_here
   RESEND_FROM_EMAIL="Your Startup <no-reply@yourdomain.com>"
   JWT_SECRET=super-secret-key-change-me
   MAGIC_LINK_VERIFY_URL=http://localhost:4000/auth/magic-link/verify
   ```

   **Note:** The system will work without OpenAI and Resend keys (with mock responses), but you'll need a `JWT_SECRET` for authentication.

3. **Start the server:**
   ```bash
   npm start
   # or for development with auto-reload:
   npm run dev
   ```

   The server will:
   - Initialize the SQLite database (`data.sqlite`)
   - Create all required tables
   - Start the job worker
   - Listen on port 4000

4. **Test the frontend:**
   - Open `frontend/index.html` in a browser
   - Or serve it with a simple HTTP server:
     ```bash
     cd frontend
     python3 -m http.server 8000
     # Then visit http://localhost:8000
     ```

## 🔐 Authentication Flow

1. **Request magic link:**
   ```bash
   curl -X POST http://localhost:4000/auth/magic-link \
     -H "Content-Type: application/json" \
     -d '{"email": "user@example.com"}'
   ```

2. **Click the magic link** (or visit the URL returned in the response)

3. **Copy the JWT token** from the verification page

4. **Use the token** in API requests:
   ```bash
   curl -X POST http://localhost:4000/orders \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"customerEmail": "customer@example.com", "productName": "Widget"}'
   ```

## 📡 API Endpoints

### `GET /health`
Health check endpoint.

**Response:**
```json
{"ok": true}
```

### `POST /auth/magic-link`
Request a magic link for authentication.

**Request:**
```json
{"email": "user@example.com"}
```

**Response:**
```json
{
  "status": "sent",
  "message": "Check your email",
  "url": "http://localhost:4000/auth/magic-link/verify?token=..."
}
```

### `GET /auth/magic-link/verify`
Verify magic link token and get JWT.

**Query Parameters:**
- `token` - Magic link token

**Response:** HTML page with JWT token

### `POST /orders`
Create a new order (requires authentication).

**Headers:**
- `Authorization: Bearer <JWT_TOKEN>`

**Request:**
```json
{
  "customerEmail": "customer@example.com",
  "productName": "Widget"
}
```

**Response:**
```json
{
  "orderId": "uuid",
  "status": "PROCESSED",
  "aiSummary": "Order analysis summary..."
}
```

## 🗄️ Database Schema

The SQLite database (`data.sqlite`) contains:

- **users** - User accounts
- **magic_links** - Magic link tokens
- **orders** - Order records
- **ai_requests** - OpenAI API request logs
- **jobs** - Job queue (PENDING → PROCESSING → SUCCESS/FAILED)

## 🔄 Job Queue

When an order is created, three jobs are automatically enqueued:
- `PAYMENT_JOB` - Simulated payment processing
- `AMAZON_ADDRESS_JOB` - Simulated Amazon address update
- `AMAZON_GIFT_JOB` - Simulated Amazon gift toggle

The worker processes jobs every 1.5 seconds. Jobs transition:
- `PENDING` → `PROCESSING` → `SUCCESS` or `FAILED`

## 🧪 Testing Without API Keys

The system gracefully handles missing API keys:
- **OpenAI**: Returns mock summaries
- **Resend**: Logs warnings, skips email sending

You can test the full flow without external services by just setting `JWT_SECRET`.

## 📝 Notes

- This is a **POC** - not production-ready code
- Job handlers are **simulated** (fake delays, no real automation)
- Database is SQLite (will migrate to PostgreSQL in production)
- Job queue is DB-based (will migrate to Redis/BullMQ in production)
- Frontend is a simple HTML page (will become a browser extension)

## 🔮 Future Enhancements

See `docs/context.md` for the full project scope and planned enhancements.

## 📄 License

MIT

