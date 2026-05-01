#!/usr/bin/env node

/**
 * Wnode AI — Model Loader
 *
 * Loads the GGUF model from the path defined in config.json.
 * The model file itself is a server-only asset and is NOT in GitHub.
 *
 * Exports:
 *   loadModel()  — resolves with the model instance (or null if unavailable)
 *   getModelInfo() — returns model metadata without loading
 *
 * No external dependencies. Uses Node.js built-ins only.
 * The actual GGUF inference binding is provided by the inference engine.
 */

const fs = require("fs");
const path = require("path");

const CONFIG_PATH = path.resolve(__dirname, "config.json");

/**
 * Read and parse the config file.
 * @returns {{ model_path: string }}
 */
function readConfig() {
  if (!fs.existsSync(CONFIG_PATH)) {
    throw new Error(`Config file not found: ${CONFIG_PATH}`);
  }
  const raw = fs.readFileSync(CONFIG_PATH, "utf-8");
  return JSON.parse(raw);
}

/**
 * Resolve the model file path.
 * The config stores an absolute server path (/ai/model/model.gguf).
 * In dev, we also check relative to the project root.
 * @returns {string|null} Resolved absolute path, or null if not found.
 */
function resolveModelPath() {
  const config = readConfig();
  const configPath = config.model_path;

  // 1. Check the absolute path as-is (server environment)
  if (fs.existsSync(configPath)) {
    return configPath;
  }

  // 2. Check relative to project root (dev environment)
  //    e.g. /home/user/project/ai/model/model.gguf
  const projectRoot = path.resolve(__dirname, "..", "..");
  const relativePath = path.join(projectRoot, configPath);
  if (fs.existsSync(relativePath)) {
    return relativePath;
  }

  // 3. Check relative to the ai/ directory
  const aiRelativePath = path.resolve(__dirname, "..", "model", "model.gguf");
  if (fs.existsSync(aiRelativePath)) {
    return aiRelativePath;
  }

  return null;
}

/**
 * Get model metadata without loading the full model.
 * @returns {{ available: boolean, path: string|null, size_bytes: number|null, name: string }}
 */
function getModelInfo() {
  const resolvedPath = resolveModelPath();

  if (!resolvedPath) {
    return {
      available: false,
      path: null,
      size_bytes: null,
      name: "model.gguf (not found)",
    };
  }

  const stats = fs.statSync(resolvedPath);
  return {
    available: true,
    path: resolvedPath,
    size_bytes: stats.size,
    name: path.basename(resolvedPath),
  };
}

/**
 * Load the model from disk.
 *
 * Returns the resolved model path and metadata if the file exists.
 * The actual GGUF parsing and inference is handled by inference_engine.js
 * which consumes this path to initialize its runtime.
 *
 * @returns {Promise<{ path: string, info: object }|null>}
 */
async function loadModel() {
  const info = getModelInfo();

  if (!info.available) {
    console.error("[model_loader] Model file not found.");
    console.error("[model_loader] Expected at:", readConfig().model_path);
    console.error("[model_loader] Ensure the model is downloaded on the server.");
    return null;
  }

  console.log(`[model_loader] Model found: ${info.path}`);
  console.log(`[model_loader] Size: ${(info.size_bytes / 1024 / 1024).toFixed(1)} MB`);

  return {
    path: info.path,
    info: info,
  };
}

module.exports = {
  loadModel,
  getModelInfo,
  resolveModelPath,
  readConfig,
};
