/**
 * Wnode AI — Smoke Test
 */

const { runAiJob } = require("../api/ai_router");
const { getProvider } = require("../api/provider_loader");

async function smoke() {
  console.log("Provider: tiny-local");
  const job = { id: "smoke-1", type: "score", payload: { test: true } };
  const result = await runAiJob(job);
  
  if (result.status === "ok" && result.data.modelLoaded) {
    console.log("Model loaded");
  }

  console.log("SMOKE TEST RESULT:", result);
  process.exit(0);
}

smoke();
