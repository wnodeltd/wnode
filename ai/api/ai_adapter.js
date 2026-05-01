/**
 * Wnode AI — Adapter
 */

require("./ai_types");

/**
 * Executes an AI job.
 * @param {Object} job
 */
async function runJob(job) {
  try {
    if (job.type === "score") {
      return { jobId: job.id, status: "ok", data: { score: 0.5 } };
    }
    if (job.type === "route") {
      return { jobId: job.id, status: "ok", data: { target: "node-1" } };
    }
    return { jobId: job.id, status: "error", error: "Unknown job type" };
  } catch (err) {
    return { jobId: job.id, status: "error", error: err.message };
  }
}

module.exports = { runJob };
