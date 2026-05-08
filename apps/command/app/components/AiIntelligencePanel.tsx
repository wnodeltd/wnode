'use client';

import React, { useEffect, useState } from 'react';
import { Brain, Loader2 } from 'lucide-react';

export default function AiIntelligencePanel() {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('/api/ai/status')
      .then(res => res.json())
      .then(data => {
        setStatus(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('AI status fetch failed:', err);
        setError(true);
        setLoading(false);
      });
  }, []);

  const getStatusText = () => {
    if (error || !status) return 'Offline';
    if (status.modelExists && status.hasInference && status.hasEmbeddings && status.hasGeneration) {
      return 'Online';
    }
    if (status.modelExists) return 'Degraded';
    return 'Offline';
  };

  const getStatusColor = () => {
    const text = getStatusText();
    if (text === 'Online') return 'text-green-400';
    if (text === 'Degraded') return 'text-yellow-400';
    return 'text-red-400';
  };

  const getDotColor = () => {
    const text = getStatusText();
    if (text === 'Online') return 'bg-green-500';
    if (text === 'Degraded') return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getModelName = () => {
    if (!status?.modelPath) return 'Unknown';
    if (status.modelPath.toLowerCase().endsWith('.onnx')) return 'Onnx';
    if (status.modelPath.toLowerCase().endsWith('.gguf')) return 'GGUF';
    const parts = status.modelPath.split('/');
    return parts[parts.length - 1] || 'Unknown';
  };

  if (loading) {
    return (
      <div className="bg-white/[0.04] shadow-[0_4px_25px_rgba(0,0,0,0.4)] border border-white/20 p-5 rounded-[5px] flex items-center justify-center h-full min-h-[114px]">
        <Loader2 className="w-4 h-4 text-neutral-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white/[0.04] shadow-[0_4px_25px_rgba(0,0,0,0.4)] border border-white/20 p-4 rounded-[5px] flex flex-col gap-1 group truncate transition-all hover:bg-white/[0.06] backdrop-blur-sm h-full">
      <span className="text-[17px] text-white font-normal uppercase tracking-tight font-sans">
        AI - Mesh Maestro
      </span>
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${getDotColor()} shadow-sm`} />
            <span className={`text-[22px] font-normal tracking-tighter ${getStatusColor()}`}>
              {getStatusText()}
            </span>
          </div>
          <span className="text-[14px] text-[#3B82F6] font-normal font-sans tracking-widest mt-0.5 truncate max-w-[150px]">
            Model: {getModelName()}
          </span>
        </div>
        <Brain className="w-4 h-4 text-[#3B82F6] opacity-40 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  );
}
