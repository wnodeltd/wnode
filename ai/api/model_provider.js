/**
 * Wnode AI — Model Provider
 */

/**
 * Runs the job through the specific model provider.
 * @param {Object} job
 */
async function runModel(job) {
  // Deterministic stub
  return {
    jobId: job.id,
    status: "ok",
    data: { provider: "stub", score: 0.42 }
  };
}

module.exports = { runModel };
