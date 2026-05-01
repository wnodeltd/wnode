/**
 * Wnode AI — Model Loader
 */

const fs = require("fs");
const path = require("path");

/**
 * Loads the model file from disk and verifies its presence.
 */
function loadModel() {
  try {
    const modelPath = path.join(__dirname, "..", "models", "tiny-local-model.onnx");
    
    if (!fs.existsSync(modelPath)) {
      return { ok: false, exists: false };
    }

    const stats = fs.statSync(modelPath);
    return { 
      ok: true, 
      exists: true, 
      size: stats.size, 
      format: "onnx" 
    };
  } catch (err) {
    return { ok: false, exists: false, error: err.message };
  }
}

/**
 * Runs a minimal inference on the ONNX model.
 * Phase 4e: Tiny, safe, CPU-only.
 */
async function runTinyInference(inputText) {
  try {
    // Import INSIDE the function as per 4e spec
    const ort = require("onnxruntime-node");
    const modelPath = path.join(__dirname, "..", "models", "tiny-local-model.onnx");

    // Load model
    const session = await ort.InferenceSession.create(modelPath, {
      executionProviders: ["cpu"]
    });

    // Trivial tokenizer: split on spaces, IDs = word length
    const words = inputText.split(/\s+/).filter(w => w.length > 0);
    const inputIds = words.map(w => w.length);
    
    if (inputIds.length === 0) {
      inputIds.push(0); // Ensure non-empty
    }

    // Create tensors
    const tensorInputIds = new ort.Tensor("int64", BigInt64Array.from(inputIds.map(n => BigInt(n))), [1, inputIds.length]);
    const tensorMask = new ort.Tensor("int64", BigInt64Array.from(inputIds.map(() => 1n)), [1, inputIds.length]);
    const tensorType = new ort.Tensor("int64", BigInt64Array.from(inputIds.map(() => 0n)), [1, inputIds.length]);

    // Run inference
    const feeds = {
      input_ids: tensorInputIds,
      attention_mask: tensorMask,
      token_type_ids: tensorType
    };

    const results = await session.run(feeds);
    
    // Get first output
    const outputName = session.outputNames[0];
    const outputTensor = results[outputName];
    
    return {
      ok: true,
      outputShape: outputTensor.dims,
      outputPreview: Array.from(outputTensor.data.slice(0, 5))
    };

  } catch (err) {
    return { ok: false, error: err.message };
  }
}

module.exports = { loadModel, runTinyInference };
