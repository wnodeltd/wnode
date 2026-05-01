/**
 * Wnode AI — Smoke Test
 */

const { runAiJob } = require("../api/ai_router");
const { getProvider } = require("../api/provider_loader");

async function smoke() {
  console.log("Provider: tiny-local");
  const job = { id: "smoke-1", type: "score", payload: { test: true } };
  const result = await runAiJob(job);
  
  if (result.status === "ok") {
    console.log(`Model Exists: ${result.data.modelExists}`);
  }

  console.log("SMOKE TEST RESULT:", result);
  process.exit(0);
}

smoke();
