/**
 * Wnode AI — Model Loader
 */

const fs = require("fs");
const path = require("path");

/**
 * Loads the model file from disk.
 * Minimal implementation for Phase 4a.
 */
function loadModel() {
  try {
    const modelPath = path.join(__dirname, "..", "models", "tiny-local-model.bin");
    const stats = fs.statSync(modelPath);
    return { ok: true, size: stats.size };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

module.exports = { loadModel };
