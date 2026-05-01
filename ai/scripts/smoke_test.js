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
  if (resInfer.status === "ok" && resInfer.data.inference && resInfer.data.inference.ok) {
    console.log("Inference OK. Shape:", resInfer.data.inference.outputShape);
  }

  // Test 3: Embedding
  console.log("\nRunning Embedding Test...");
  const jobEmbed = {
    id: "smoke-embed",
    type: "score",
    payload: { input: "embed: hello world this is a test" }
  };
  const resEmbed = await runAiJob(jobEmbed);
  
  if (resEmbed.status === "ok" && resEmbed.data.embedding && resEmbed.data.embedding.ok) {
    const emb = resEmbed.data.embedding;
    console.log("Embedding OK");
    console.log("Dims:", emb.dims);
    console.log("Preview (First 10):", emb.embedding.slice(0, 10));
  } else {
    console.error("Embedding Failed:", resEmbed.error || (resEmbed.data && resEmbed.data.embedding && resEmbed.data.embedding.error));
  }

  console.log("\nSMOKE TEST COMPLETE");
  process.exit(0);
}

smoke();
