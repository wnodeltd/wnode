/**
 * Automated Job Splitting Utility
 * Part of the Zero-Storage Streaming Architecture.
 * 
 * Splits a File into fixed-size chunks and submits them as independent sub-jobs.
 * Maintains memory safety via File.slice() and concurrency limits.
 * Aggregates results from all sub-jobs into a unified response.
 */

export const CHUNK_SIZE = 512 * 1024; // 512KB per chunk for safe streaming on M700
const MAX_CONCURRENCY = 2;

interface JobMetadata {
    budget: number;
    targetCycles: number;
}

/**
 * splitAndSubmit splits the input file, submits chunks, polls for completion,
 * and aggregates results into a single unified string.
 */
export async function splitAndSubmit(
    file: File,
    metadata: JobMetadata,
    apiBase: string
): Promise<string> {
    const parentJobId = crypto.randomUUID();
    const numChunks = Math.ceil(file.size / CHUNK_SIZE);
    const subJobIds: string[] = [];

    // --- PHASE 1: SUBMISSION ---
    
    const submitChunk = async (index: number): Promise<string> => {
        const start = index * CHUNK_SIZE;
        const end = Math.min(file.size, start + CHUNK_SIZE);
        const chunk = file.slice(start, end);

        const formData = new FormData();
        formData.append('wasm', chunk);
        formData.append('manifest', JSON.stringify({
            ...metadata,
            deliveryMode: 'streaming',
            engineType: 'wasm',
            parentJobId,
            chunkIndex: index,
            totalChunks: numChunks
        }));

        let attempts = 0;
        let lastError: any = null;

        while (attempts < 3) {
            try {
                const resp = await fetch(`${apiBase}/jobs/stream`, {
                    method: 'POST',
                    body: formData,
                });

                if (!resp.ok) {
                    const errorData = await resp.json().catch(() => ({}));
                    throw new Error(errorData.error || `HTTP ${resp.status}`);
                }

                const result = await resp.json();
                return result.id;
            } catch (err) {
                attempts++;
                lastError = err;
                if (attempts < 3) {
                    await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
                }
            }
        }
        throw new Error(`Failed to submit chunk ${index} after 3 attempts: ${lastError?.message}`);
    };

    for (let i = 0; i < numChunks; i += MAX_CONCURRENCY) {
        const batch: Promise<string>[] = [];
        for (let j = 0; j < MAX_CONCURRENCY && (i + j) < numChunks; j++) {
            batch.push(submitChunk(i + j));
        }
        const ids = await Promise.all(batch);
        subJobIds.push(...ids);
    }

    // --- PHASE 2: POLLING & AGGREGATION ---
    
    const results: string[] = new Array(numChunks).fill('');
    const pendingIndices = new Set(Array.from({length: numChunks}, (_, i) => i));

    while (pendingIndices.size > 0) {
        // Poll each pending sub-job
        const batch = Array.from(pendingIndices);
        for (const index of batch) {
            const id = subJobIds[index];
            try {
                const resp = await fetch(`${apiBase}/jobs/${id}`);
                if (!resp.ok) continue;
                
                const job = await resp.json();
                if (job.status === 'Completed') {
                    results[index] = job.result || '';
                    pendingIndices.delete(index);
                } else if (job.status === 'Failed') {
                    throw new Error(`Sub-job ${index} (${id}) failed. Aborting parent job.`);
                }
            } catch (err: any) {
                if (err.message.includes('Aborting')) throw err;
                // Ignore transient network errors during polling
            }
        }

        if (pendingIndices.size > 0) {
            // Wait before next polling cycle
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }

    // Concatenate results in order
    return results.join('');
}
