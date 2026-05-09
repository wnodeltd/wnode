import React from 'react';
import { Activity } from 'lucide-react';

export default function OverviewPanel() {
  return (
    <div id="overview" className="bg-white/[0.02] border border-white/10 rounded-[5px] p-8 space-y-6 hover:shadow-[0_0_20px_rgba(74,222,128,0.05)] transition-all group">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Activity className="w-6 h-6 text-green-400 group-hover:drop-shadow-[0_0_8px_rgba(74,222,128,0.4)] transition-all" />
          <h2 className="text-[14px] font-medium text-white uppercase tracking-widest">Overview</h2>
        </div>
        <div className="flex gap-2">
          <span className="px-2 py-0.5 bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] uppercase font-bold rounded">Quorum Active</span>
          <span className="px-2 py-0.5 bg-[#22D3EE]/10 border border-[#22D3EE]/20 text-[#22D3EE] text-[10px] uppercase font-bold rounded">Voting Live</span>
          <span className="px-2 py-0.5 bg-white/5 border border-white/10 text-slate-500 text-[10px] uppercase font-bold rounded">Transparency Synced</span>
        </div>
      </div>
      
      <div className="h-[100px] flex flex-col justify-center border-t border-white/5 pt-6">
        <p className="text-[13px] text-slate-400 leading-relaxed">
          Governance Overview Context: All protocol parameters are currently within nominal ranges. 
          Quorum requirements for the current epoch have been met by 64% of active governance participants.
        </p>
      </div>
    </div>
  );
}
