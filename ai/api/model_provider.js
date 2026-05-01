/**
 * Wnode AI — Model Provider
 */

const { getProvider } = require("./provider_loader");
const { loadModel } = require("./model_loader");

/**
 * Runs the job through the specific model provider.
 * @param {Object} job
 */
async function runModel(job) {
  const provider = getProvider();

  if (provider === "tiny-local") {
    const model = loadModel();
    return {
      jobId: job.id,
      status: "ok",
      data: { 
        provider: "tiny-local", 
        modelExists: model.exists 
      }
    };
  }

  return {
    jobId: job.id,
    status: "error",
    error: "AI Provider Locked to tiny-local"
  };
}

module.exports = { runModel };
