const db = require("../db");
const { v4: uuidv4 } = require("uuid");

function enqueueJob(type, payload = {}) {
  return new Promise((resolve, reject) => {
    const id = uuidv4();
    const now = new Date().toISOString();
    db.run(`
      INSERT INTO jobs (id, type, payload, status, attempts, created_at, updated_at)
      VALUES (?, ?, ?, 'PENDING', 0, ?, ?)
    `, [id, type, JSON.stringify(payload), now, now], (err) => {
      if (err) reject(err);
      else resolve(id);
    });
  });
}

module.exports = { enqueueJob };
