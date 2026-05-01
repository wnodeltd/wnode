/**
 * Wnode AI — Adapter
 *
 * Lightweight AI adapter implementing the IAiClient interface.
 * Returns deterministic results for "score" and "route" jobs.
 */

class AiAdapter {
  /**
   * Runs a specific AI job and returns a result.
   * @param {import('./ai_types').AiJob} job
   * @returns {Promise<import('./ai_types').AiResult>}
   */
  async runJob(job) {
    try {
      if (job.type === "score") {
        return {
          jobId: job.id,
          status: "ok",
          data: { score: 0.5 }
        };
      }

      if (job.type === "route") {
        return {
          jobId: job.id,
          status: "ok",
          data: { target: "node-1" }
        };
      }

      return {
        jobId: job.id,
        status: "error",
        error: `Unknown job type: ${job.type}`
      };
    } catch (err) {
      return {
        jobId: job.id,
        status: "error",
        error: err.message || "An unknown error occurred in the AI adapter"
      };
    }
  }
}

module.exports = { AiAdapter };
