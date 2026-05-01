/**
 * Wnode AI — Model Provider
 */

const { getProvider } = require("./provider_loader");

/**
 * Runs the job through the specific model provider.
 * @param {Object} job
 */
async function runModel(job) {
  const provider = getProvider();

  // Phase 3d: Enforce tiny-local only
  if (provider === "tiny-local") {
    return {
      jobId: job.id,
      status: "ok",
      data: { provider: "tiny-local", score: 0.42 }
    };
  }

  // Final fallback (should not be reachable in Phase 3d)
  return {
    jobId: job.id,
    status: "error",
    error: "AI Provider Locked to tiny-local"
  };
}

module.exports = { runModel };
