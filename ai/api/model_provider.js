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

  if (provider === "stub") {
    return {
      jobId: job.id,
      status: "ok",
      data: { provider: "stub", score: 0.42 }
    };
  }

  return {
    jobId: job.id,
    status: "error",
    error: `Unknown provider: ${provider}`
  };
}

module.exports = { runModel };
