/**
 * Wnode AI — Model Loader
 */

const fs = require("fs");
const path = require("path");

/**
 * Loads the model file from disk and verifies its presence.
 * Minimal implementation for Phase 4b.
 */
function loadModel() {
  try {
    const modelPath = path.join(__dirname, "..", "models", "tiny-local-model.bin");
    
    if (!fs.existsSync(modelPath)) {
      return { ok: false, exists: false };
    }

    const stats = fs.statSync(modelPath);
    return { ok: true, exists: true, size: stats.size };
  } catch (err) {
    return { ok: false, exists: false, error: err.message };
  }
}

module.exports = { loadModel };
