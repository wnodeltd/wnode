/**
 * Wnode AI — Router Facade
 *
 * Exposes a single function to run AI jobs via a single adapter instance.
 */

const { AiAdapter } = require('./ai_adapter');

const adapter = new AiAdapter();

/**
 * Runs an AI job via the configured adapter.
 * @param {import('./ai_types').AiJob} job
 * @returns {Promise<import('./ai_types').AiResult>}
 */
async function runAiJob(job) {
  return await adapter.runJob(job);
}

module.exports = { runAiJob };
