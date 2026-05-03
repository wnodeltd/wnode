'use client';

import { useState, useEffect } from 'react';

export function useIntelligenceStatus() {
  const [status, setStatus] = useState({
    aiStatus: "Standby",
    latestInsight: "No anomalies detected",
    filesIndexed: { indexed: 0, total: 0 },
    trainingMode: "Disabled",
    modelName: "Loading..."
  });

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const [statusRes, insightRes, filesRes, modelRes] = await Promise.all([
          fetch('/api/intelligence/status').catch(() => null),
          fetch('/api/intelligence/latest-insight').catch(() => null),
          fetch('/api/intelligence/files-indexed').catch(() => null),
          fetch('/api/intelligence/model').catch(() => null)
        ]);

        const statusData = statusRes?.ok ? await statusRes.json() : null;
        const insightData = insightRes?.ok ? await insightRes.json() : null;
        const filesData = filesRes?.ok ? await filesRes.json() : null;
        const modelData = modelRes?.ok ? await modelRes.json() : null;
        console.log("Model API returned:", modelData);

        // Real data is now populated dynamically from the updated backend API routes
        setStatus(prev => ({
          ...prev,
          aiStatus: statusData?.aiStatus ?? prev.aiStatus,
          trainingMode: statusData?.trainingMode ?? prev.trainingMode,
          latestInsight: insightData?.text ?? prev.latestInsight,
          filesIndexed: filesData ?? prev.filesIndexed,
          modelName: modelData ? modelData.modelName : prev.modelName
        }));
      } catch (err) {
        console.error('Failed to fetch intelligence metrics:', err);
      }
    }
    
    fetchMetrics();
    // Optional polling could be added here later
  }, []);
  
  return status;
}
