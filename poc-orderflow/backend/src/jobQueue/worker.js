const db = require("../db");
const { handlers } = require("./handlers");

async function processNextJob() {
  return new Promise((resolve) => {
    // Use a transaction-like approach: select and immediately mark as PROCESSING
    db.get(`
      SELECT * FROM jobs
      WHERE status='PENDING'
      ORDER BY created_at ASC
      LIMIT 1
    `, async (err, job) => {
      if (err || !job) return resolve();

      const handler = handlers[job.type];
      if (!handler) {
        // Mark unknown job types as failed
        db.run(`UPDATE jobs SET status='FAILED', last_error=?, updated_at=? WHERE id=?`,
          ['Unknown job type', new Date().toISOString(), job.id]);
        return resolve();
      }

      // Mark as PROCESSING to prevent race conditions
      db.run(`UPDATE jobs SET status='PROCESSING', updated_at=? WHERE id=?`,
        [new Date().toISOString(), job.id], async (updateErr) => {
          if (updateErr) {
            console.error("Failed to mark job as PROCESSING:", updateErr);
            return resolve();
          }

          try {
            const payload = JSON.parse(job.payload);
            const result = await handler(payload);

            if (result.success) {
              db.run(`UPDATE jobs SET status='SUCCESS', updated_at=? WHERE id=?`,
                [new Date().toISOString(), job.id]);
            } else {
              db.run(`UPDATE jobs SET status='FAILED', last_error=?, attempts=attempts+1, updated_at=? WHERE id=?`,
                [result.message || 'Handler returned failure', new Date().toISOString(), job.id]);
            }
          } catch (e) {
            db.run(`
              UPDATE jobs SET status='FAILED', last_error=?, attempts=attempts+1, updated_at=? WHERE id=?
            `, [e.message, new Date().toISOString(), job.id]);
          }

          resolve();
        });
    });
  });
}

function startWorker() {
  console.log("Job Worker Started");
  setInterval(() => processNextJob(), 1500);
}

module.exports = { startWorker };
