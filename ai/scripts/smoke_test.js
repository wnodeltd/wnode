/**
 * Wnode AI — Smoke Test
 */

const { runAiJob } = require("../api/ai_router");
const { getProvider } = require("../api/provider_loader");

async function smoke() {
  console.log("ACTIVE PROVIDER:", getProvider());
  const job = { id: "smoke-1", type: "score", payload: { test: true } };
  const result = await runAiJob(job);
  console.log("SMOKE TEST RESULT:", result);
  process.exit(0);
}

smoke();
