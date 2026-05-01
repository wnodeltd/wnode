/**
 * Wnode AI — Model Provider
 */

const { getProvider } = require("./provider_loader");
const { loadModel, runTinyInference } = require("./model_loader");

/**
 * Runs the job through the specific model provider.
 * @param {Object} job
 */
async function runModel(job) {
  const provider = getProvider();

  if (provider === "tiny-local") {
    // Phase 4e: Conditional inference
    if (job.payload && job.payload.input && job.payload.input.startsWith("infer:")) {
      const inputText = job.payload.input.replace("infer:", "").trim();
      const inference = await runTinyInference(inputText);
      return {
        jobId: job.id,
        status: "ok",
        data: { provider: "tiny-local", inference }
      };
    }

    const model = loadModel();
    return {
      jobId: job.id,
      status: "ok",
      data: { 
        provider: "tiny-local", 
        modelExists: model.exists,
        format: "onnx"
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
