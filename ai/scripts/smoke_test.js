/**
 * Wnode AI — Smoke Test
 *
 * Verifies the AI router and adapter with sample jobs.
 */

const { runAiJob } = require('../api/ai_router');

async function runTests() {
  console.log('--- Wnode AI Smoke Test ---');

  const jobs = [
    { id: 'test-1', type: 'score', payload: {} },
    { id: 'test-2', type: 'route', payload: {} },
    { id: 'test-3', type: 'unknown', payload: {} }
  ];

  for (const job of jobs) {
    console.log(`Running job: ${job.type} (${job.id})...`);
    try {
      const result = await runAiJob(job);
      console.log(`Result: ${result.status}`, result.data || result.error);
      
      if (job.type === 'unknown' && result.status !== 'error') {
        throw new Error('Unknown job should return error status');
      }
      if (job.type !== 'unknown' && result.status !== 'ok') {
        throw new Error(`Job ${job.type} failed: ${result.error}`);
      }
    } catch (err) {
      console.error(`FAILED: ${err.message}`);
      process.exit(1);
    }
  }

  console.log('--- ALL TESTS PASSED ---');
}

runTests();
