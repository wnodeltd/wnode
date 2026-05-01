/**
 * Wnode AI — Model Loader
 */

const fs = require("fs");
const path = require("path");

/**
 * Loads the model file from disk and verifies its presence.
 * Supports ONNX format for Phase 4c.
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

module.exports = { loadModel };
