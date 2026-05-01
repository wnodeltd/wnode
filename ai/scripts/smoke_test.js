/**
 * Wnode AI — Smoke Test
 */

const { runAiJob } = require("../api/ai_router");

async function smoke() {
  const job = { id: "smoke-1", type: "score", payload: { test: true } };
  const result = await runAiJob(job);
  console.log("SMOKE TEST RESULT:", result);
  process.exit(0);
}

smoke();
