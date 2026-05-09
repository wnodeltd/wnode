import React from 'react';

export default function TransparencyPanel() {
  return (
    <div id="transparency" className="bg-white/[0.02] border border-white/10 rounded-[5px] p-8 space-y-6">
      <h2 className="text-[14px] font-medium text-white uppercase tracking-widest">Transparency Report</h2>
      <div className="h-40 flex items-center justify-center border border-dashed border-white/10 rounded-[5px]">
        <span className="text-[11px] text-slate-500 uppercase tracking-widest">Transparency Audit Shell</span>
      </div>
    </div>
  );
}
