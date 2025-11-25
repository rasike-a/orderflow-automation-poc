require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const db = require("./db");
const { generateOrderSummary } = require("./openaiClient");
const {
  sendOrderReceivedEmail,
  sendOrderProcessedEmail
} = require("./resendClient");
const {
  authMiddleware,
  createMagicLink,
  verifyMagicLinkToken
} = require("./auth");
const { enqueueJob } = require("./jobQueue/queue");
const { startWorker } = require("./jobQueue/worker");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: "*" }));
app.use(express.json());

app.get("/health", (_, res) => res.json({ ok: true }));

// Magic-link request
app.post("/auth/magic-link", async (req, res) => {
  try {
    const { email } = req.body;
    const { url } = await createMagicLink(email);
    res.json({ status: "sent", message: "Check your email", url });
  } catch (e) {
    res.status(500).json({ error: e.toString() });
  }
});

// Magic-link verify
app.get("/auth/magic-link/verify", async (req, res) => {
  try {
    const { token } = req.query;
    const { jwtToken, email } = await verifyMagicLinkToken(token);

    res.send(`
      <h2>Login Success</h2>
      <p>Email: ${email}</p>
      <p>JWT Token:</p>
      <pre>${jwtToken}</pre>
    `);
  } catch (e) {
    res.status(400).send("Invalid token");
  }
});

// Protected order creation
app.post("/orders", authMiddleware, async (req, res) => {
  const { customerEmail, productName } = req.body;
  const now = new Date().toISOString();
  const orderId = uuidv4();

  db.run(`
    INSERT INTO orders (id, customer_email, product_name, status, created_at, updated_at)
    VALUES (?, ?, ?, 'RECEIVED', ?, ?)
  `, [orderId, customerEmail, productName, now, now]);

  await sendOrderReceivedEmail({ to: customerEmail, productName, orderId });

  const ai = await generateOrderSummary({ productName, customerEmail });

  db.run(`
    INSERT INTO ai_requests (id, order_id, prompt, openai_raw, openai_summary, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `, [uuidv4(), orderId, ai.prompt, ai.raw, ai.summary, now]);

  db.run(`
    UPDATE orders SET status='PROCESSED', updated_at=? WHERE id=?
  `, [new Date().toISOString(), orderId]);

  await sendOrderProcessedEmail({
    to: customerEmail,
    productName,
    orderId,
    summary: ai.summary
  });

  // Enqueue fake jobs
  await enqueueJob("PAYMENT_JOB", { orderId });
  await enqueueJob("AMAZON_ADDRESS_JOB", { orderId });
  await enqueueJob("AMAZON_GIFT_JOB", { orderId });

  res.json({
    orderId,
    status: "PROCESSED",
    aiSummary: ai.summary
  });
});

app.listen(PORT, () => {
  console.log(`Backend running on ${PORT}`);
  startWorker();
});
