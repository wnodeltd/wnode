'use client';

import React from 'react';
import { usePageTitle } from "../components/PageTitleContext";
import { Brain } from 'lucide-react';

export default function IntelligencePage() {
  usePageTitle("Intelligence");

  return (
    <main className="flex-1 px-8 pt-8 pb-20 overflow-y-auto space-y-6 custom-scrollbar h-full relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="bg-white/[0.02] border border-white/10 p-10 rounded-[5px] flex flex-col gap-6 max-w-2xl shadow-sm transition-all hover:bg-white/[0.03]">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-purple-500/10 rounded-full border border-purple-500/20">
            <Brain className="w-8 h-8 text-purple-400" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Intelligence</h1>
        </div>
        
        <p className="text-slate-400 text-sm leading-relaxed">
          This space will host AI-driven insights, reports, and operator tools for the Wnode mesh.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 opacity-50 grayscale pointer-events-none">
          <div className="p-6 border border-white/10 rounded-[5px] bg-white/[0.01]">
            <h3 className="text-white text-xs font-bold uppercase tracking-widest mb-2">Mesh Analysis</h3>
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Awaiting model readiness...</p>
          </div>
          <div className="p-6 border border-white/10 rounded-[5px] bg-white/[0.01]">
            <h3 className="text-white text-xs font-bold uppercase tracking-widest mb-2">Predictive Health</h3>
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Awaiting model readiness...</p>
          </div>
        </div>
      </div>
    </main>
  );
}
