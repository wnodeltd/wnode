'use client';

import React, { useEffect, useState } from 'react';
import { Brain, Cpu, Database, Activity, Check, X, Loader2 } from 'lucide-react';

export default function AiIntelligencePanel() {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [testResult, setTestResult] = useState<any>(null);
  const [runningTest, setRunningTest] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/ai/status')
      .then(res => res.json())
      .then(data => {
        setStatus(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('AI status fetch failed:', err);
        setError('AI status unavailable');
        setLoading(false);
      });
  }, []);

  const runTest = async (mode: string) => {
    setRunningTest(mode);
    setTestResult(null);
    try {
      const res = await fetch('/api/ai/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode })
      });
      const data = await res.json();
      if (data.ok) {
        setTestResult(data);
      } else {
        setError(data.error);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setRunningTest(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-white/[0.02] border border-white/10 p-6 rounded-[5px] flex items-center justify-center h-full">
        <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
      </div>
    );
  }

  if (error && !status) {
    return (
      <div className="bg-white/[0.02] border border-white/10 p-6 rounded-[5px] text-red-400 text-xs font-bold uppercase tracking-widest">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white/[0.02] border border-white/10 p-6 rounded-[5px] flex flex-col h-full shadow-sm transition-all hover:bg-white/[0.03]">
      <div className="flex items-center gap-3 mb-5 pb-3 border-b border-white/5">
        <Brain className="w-4 h-4 text-purple-400 opacity-70" />
        <span className="text-[11px] font-bold text-white uppercase tracking-[0.2em]">AI / Tiny-Local Model</span>
      </div>

      <div className="space-y-4 flex-1">
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 bg-black/20 rounded border border-white/5 flex flex-col">
            <span className="text-[8px] text-slate-500 uppercase font-bold tracking-widest">Provider</span>
            <span className="text-[10px] text-white font-mono">{status?.provider}</span>
          </div>
          <div className="p-2 bg-black/20 rounded border border-white/5 flex flex-col">
            <span className="text-[8px] text-slate-500 uppercase font-bold tracking-widest">Status</span>
            <span className={`text-[10px] font-mono ${status?.modelExists ? 'text-green-400' : 'text-red-400'}`}>
              {status?.modelExists ? 'PRESENT' : 'MISSING'}
            </span>
          </div>
        </div>

        <div className="p-2 bg-black/20 rounded border border-white/5 flex flex-col">
          <span className="text-[8px] text-slate-500 uppercase font-bold tracking-widest">Model Path</span>
          <span className="text-[9px] text-slate-400 font-mono truncate">{status?.modelPath}</span>
        </div>

        <div className="flex justify-between px-1">
          <Capability label="Inference" active={status?.hasInference} />
          <Capability label="Embeddings" active={status?.hasEmbeddings} />
          <Capability label="Generation" active={status?.hasGeneration} />
        </div>

        <div className="grid grid-cols-3 gap-2 pt-2">
          <TestButton label="Inference" mode="inference" running={runningTest === 'inference'} onClick={() => runTest('inference')} />
          <TestButton label="Embedding" mode="embedding" running={runningTest === 'embedding'} onClick={() => runTest('embedding')} />
          <TestButton label="Generation" mode="generation" running={runningTest === 'generation'} onClick={() => runTest('generation')} />
        </div>

        {testResult && (
          <div className="mt-4 p-3 bg-black/40 border border-purple-500/30 rounded text-[9px] font-mono animate-in fade-in slide-in-from-top-1">
            <div className="text-purple-400 font-bold mb-1 uppercase">Test Output ({testResult.type}):</div>
            {testResult.type === 'inference' && (
              <div className="text-slate-300">
                Shape: {JSON.stringify(testResult.outputShape)}<br/>
                Preview: {testResult.outputPreview.slice(0, 3).map((n: number) => n.toFixed(2)).join(', ')}...
              </div>
            )}
            {testResult.type === 'embedding' && (
              <div className="text-slate-300">
                Dims: {testResult.dims}<br/>
                Preview: {testResult.preview.slice(0, 3).map((n: number) => n.toFixed(2)).join(', ')}...
              </div>
            )}
            {testResult.type === 'generation' && (
              <div className="text-slate-300">
                Text: <span className="text-white italic">"{testResult.completion}"</span><br/>
                Tokens: {testResult.tokensPreview.slice(0, 3).join(', ')}...
              </div>
            )}
          </div>
        )}
        
        {error && testResult === null && (
           <div className="mt-2 text-[9px] text-red-500 font-bold uppercase">{error}</div>
        )}
      </div>
    </div>
  );
}

function Capability({ label, active }: { label: string; active: boolean }) {
  return (
    <div className="flex items-center gap-1.5">
      {active ? <Check className="w-2.5 h-2.5 text-green-500" /> : <X className="w-2.5 h-2.5 text-red-500" />}
      <span className="text-[9px] text-slate-400 uppercase font-bold tracking-tight">{label}</span>
    </div>
  );
}

function TestButton({ label, running, onClick, mode }: { label: string; running: boolean; onClick: () => void; mode: string }) {
  return (
    <button
      onClick={onClick}
      disabled={running}
      className={`px-2 py-1.5 rounded text-[8px] font-bold uppercase tracking-widest transition-all ${
        running ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 border border-purple-500/30'
      }`}
    >
      {running ? 'Running...' : `Test ${label}`}
    </button>
  );
}
