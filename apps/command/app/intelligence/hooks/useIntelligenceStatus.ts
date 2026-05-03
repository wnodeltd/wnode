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
        // Fetch from AI status (same as Dashboard)
        const aiRes = await fetch('/api/ai/status').catch(() => null);
        const aiData = aiRes && aiRes.ok ? await aiRes.json().catch(() => null) : null;

        // Fetch other metrics if they exist
        const intelRes = await fetch('/api/intelligence/status').catch(() => null);
        const intelData = intelRes && intelRes.ok ? await intelRes.json().catch(() => null) : null;

        const insightRes = await fetch('/api/intelligence/latest-insight').catch(() => null);
        const insightData = insightRes && insightRes.ok ? await insightRes.json().catch(() => null) : null;

        const filesRes = await fetch('/api/intelligence/files-indexed').catch(() => null);
        const filesData = filesRes && filesRes.ok ? await filesRes.json().catch(() => null) : null;

        // Parse model name precisely like AiIntelligencePanel.tsx
        let modelName = "Unknown";
        if (aiData?.modelPath) {
          const path = aiData.modelPath.toLowerCase();
          if (path.endsWith('.onnx')) modelName = 'Onnx';
          else if (path.endsWith('.gguf')) modelName = 'GGUF';
          else {
            const parts = aiData.modelPath.split('/');
            modelName = parts[parts.length - 1] || 'Unknown';
          }
        }

        setStatus(prev => ({
          ...prev,
          aiStatus: intelData?.aiStatus ?? (aiData ? "Online" : "Offline"),
          trainingMode: intelData?.trainingMode ?? "Disabled",
          latestInsight: insightData?.text ?? "No anomalies detected",
          filesIndexed: filesData ?? { indexed: 0, total: 0 },
          modelName: modelName
        }));
      } catch (err) {
        console.error('Failed to fetch intelligence metrics:', err);
      }
    }
    
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 5000);
    return () => clearInterval(interval);
  }, []);
  
  return status;
}
