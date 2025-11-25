# PROJECT CONTEXT FOR CURSOR

This repository contains a **POC (Proof of Concept)** implementation for a larger ecommerce automation system.

## 🔵 FULL PROJECT SCOPE (Future Production Version)

1. Email-based magic-link authentication
2. Backend API to receive orders from a Browser Extension
3. Call OpenAI API to analyze orders
4. Store results in a database
5. Send transactional emails (Resend)
6. Implement a scalable job-queue system
7. Automation Workers:
   - Payment automation on a 3rd-party marketplace (no public API)
   - Uploading shipping addresses to Amazon Business UI
   - Toggling “Send as gift” for 1k+ Amazon orders/day
8. Amazon Order API integration for tracking
9. Full browser extension integration
10. Observability (logs, screenshots, failure recovery)
11. Secure architecture end-to-end

---

## 🟢 **POC SCOPE (This Codebase)**

This POC demonstrates a **thin vertical slice** of the full system:

- Magic link authentication (simplified)
- JWT-based API protection
- Order creation API
- OpenAI request + structured result saving
- Email sending on order events (via Resend)
- SQLite database with core tables
- Lightweight job-queue (DB-based)
- Worker loop to process jobs
- Simulated workers (Payment / Amazon Address / Amazon Gift)
- Simple frontend UI for testing flow

No real automation is implemented — only FAKE handlers.  
This code is **purely for POC demonstration**.

---

## 🛠 TECHNOLOGIES

- Node.js + Express
- SQLite
- OpenAI API
- Resend Email API
- Browser-friendly demo frontend
- Lightweight queue & worker system

---

## 📌 NOTES FOR CURSOR

- Treat this repository as a **POC foundation**, not production.
- Maintain simple architecture.
- Keep code readable and modular.
- Do NOT add real automation scripts yet.
- Respect the structure of:
  - `backend/`
  - `frontend/`
  - `docs/context.md`

The next steps after this POC will be:
- turning the frontend into a browser extension,
- creating real Playwright automation workers,
- migrating the job queue to Redis/BullMQ,
- deploying the backend.

