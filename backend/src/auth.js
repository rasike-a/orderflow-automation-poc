require("dotenv").config();
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const db = require("./db");

const JWT_SECRET = process.env.JWT_SECRET;
const VERIFY_URL = process.env.MAGIC_LINK_VERIFY_URL;

function signJwt(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
}

function verifyJwt(token) {
  return jwt.verify(token, JWT_SECRET);
}

function authMiddleware(req, res, next) {
  const header = req.headers["authorization"] || "";
  const [b, token] = header.split(" ");
  if (b !== "Bearer" || !token) return res.status(401).json({ error: "Unauthorized" });

  try {
    req.user = verifyJwt(token);
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}

function createMagicLink(email, baseUrl = null) {
  return new Promise((resolve, reject) => {
    const now = new Date().toISOString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
    const token = uuidv4();

    // Auto-detect URL if not provided
    const verifyUrl = baseUrl || VERIFY_URL || 'http://localhost:4000/auth/magic-link/verify';

    db.get(`SELECT * FROM users WHERE email=?`, [email], (err, row) => {
      if (err) return reject(err);

      const ensureUser = (u) => {
        const id = uuidv4();
        db.run(`
          INSERT INTO magic_links (id, user_id, token, expires_at, created_at)
          VALUES (?, ?, ?, ?, ?)
        `, [id, u.id, token, expiresAt, now], (err2) => {
          if (err2) return reject(err2);
          resolve({ url: `${verifyUrl}?token=${token}` });
        });
      };

      if (!row) {
        const id = uuidv4();
        db.run(`
          INSERT INTO users (id, email, created_at)
          VALUES (?, ?, ?)
        `, [id, email, now], (err3) => {
          if (err3) return reject(err3);
          ensureUser({ id, email });
        });
      } else ensureUser(row);
    });
  });
}

function verifyMagicLinkToken(token) {
  return new Promise((resolve, reject) => {
    db.get(`
      SELECT ml.*, u.email 
      FROM magic_links ml 
      JOIN users u ON u.id = ml.user_id
      WHERE ml.token = ?
    `, [token], (err, row) => {
      if (err || !row) return reject("Invalid token");
      
      // Check if token has expired
      const now = new Date();
      const expiresAt = new Date(row.expires_at);
      if (now > expiresAt) return reject("Token expired");
      
      // Check if token has already been used
      if (row.used_at) return reject("Token already used");
      
      // Mark token as used
      db.run(`
        UPDATE magic_links SET used_at = ? WHERE id = ?
      `, [now.toISOString(), row.id], (err2) => {
        if (err2) return reject("Failed to mark token as used");
        
        const jwtToken = signJwt({ email: row.email, userId: row.user_id });
        resolve({ jwtToken, email: row.email });
      });
    });
  });
}

module.exports = {
  authMiddleware,
  createMagicLink,
  verifyMagicLinkToken
};
