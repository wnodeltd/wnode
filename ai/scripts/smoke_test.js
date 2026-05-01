/**
 * Wnode AI — Smoke Test
 */

const { runAiJob } = require("../api/ai_router");
const { getProvider } = require("../api/provider_loader");

async function smoke() {
  console.log("Provider: tiny-local");
  
  // Test 1: Basic Status
  const jobStatus = { id: "smoke-status", type: "score", payload: { test: true } };
  const resStatus = await runAiJob(jobStatus);
  console.log("STATUS TEST:", resStatus.data);

  // Test 2: Inference
  console.log("\nRunning Inference Test...");
  const jobInfer = { 
    id: "smoke-infer", 
    type: "score", 
    payload: { input: "infer: hello world" } 
  };
  const resInfer = await runAiJob(jobInfer);
  
  if (resInfer.status === "ok" && resInfer.data.inference) {
    const inf = resInfer.data.inference;
    if (inf.ok) {
      console.log("Inference OK");
      console.log("Output Shape:", inf.outputShape);
      console.log("Output Preview:", inf.outputPreview);
    } else {
      console.error("Inference Failed:", inf.error);
    }
  }

  console.log("\nSMOKE TEST COMPLETE");
  process.exit(0);
}

smoke();
