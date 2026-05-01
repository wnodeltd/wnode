/**
 * Wnode AI — Core Types
 *
 * Defines the minimal job and result types for the AI layer.
 */

/**
 * @typedef {Object} AiJob
 * @property {string} id - Unique job identifier.
 * @property {string} type - Job type: "score", "route", "classify".
 * @property {*} payload - Generic payload (object or string).
 */

/**
 * @typedef {Object} AiResult
 * @property {string} jobId - The ID of the originating job.
 * @property {"ok"|"error"} status - Result status.
 * @property {*} data - Result data (object or string).
 * @property {string} [error] - Optional error message.
 */

/**
 * @typedef {Object} IAiClient
 * @property {function(AiJob): Promise<AiResult>} runJob - Execute an AI job.
 */

module.exports = {};
