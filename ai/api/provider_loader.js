/**
 * Wnode AI — Provider Loader
 */

const fs = require("fs");
const path = require("path");

/**
 * Reads the provider configuration and returns the active provider name.
 * Defaults to "stub" if config is missing or unreadable.
 */
function getProvider() {
  try {
    const configPath = path.join(__dirname, "..", "config", "provider.json");
    const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
    return config.provider || "stub";
  } catch (err) {
    return "stub";
  }
}

module.exports = { getProvider };
