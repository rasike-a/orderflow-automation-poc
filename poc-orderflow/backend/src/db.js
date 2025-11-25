const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const os = require("os");

// Use /tmp in serverless (Vercel), otherwise use project directory
const isVercel = process.env.VERCEL === "1";
const DB_DIR = isVercel ? "/tmp" : path.join(__dirname, "..");
const DB_PATH = path.join(DB_DIR, "data.sqlite");

// Ensure directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const db = new sqlite3.Database(DB_PATH);

db.serialize(() => {
  // Users
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL
    )
  `);

  // Magic links
  db.run(`
    CREATE TABLE IF NOT EXISTS magic_links (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      token TEXT NOT NULL UNIQUE,
      expires_at TEXT NOT NULL,
      used_at TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `);

  // Orders
  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      customer_email TEXT NOT NULL,
      product_name TEXT NOT NULL,
      status TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);

  // AI requests
  db.run(`
    CREATE TABLE IF NOT EXISTS ai_requests (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL,
      prompt TEXT NOT NULL,
      openai_raw TEXT NOT NULL,
      openai_summary TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY(order_id) REFERENCES orders(id)
    )
  `);

  // Simple job queue
  db.run(`
    CREATE TABLE IF NOT EXISTS jobs (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      payload TEXT NOT NULL,
      status TEXT NOT NULL,
      attempts INTEGER NOT NULL,
      last_error TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);
});

module.exports = db;

