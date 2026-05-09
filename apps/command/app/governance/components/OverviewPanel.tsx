import React from 'react';
import { Activity } from 'lucide-react';
import Tooltip from '../../components/Tooltip';

export default function OverviewPanel() {
  return (
    <div id="overview" className="bg-white/[0.02] border border-white/10 rounded-[5px] p-8 space-y-6 hover:shadow-[0_0_20px_rgba(74,222,128,0.05)] transition-all group">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Tooltip text="System status indicator">
            <Activity className="w-6 h-6 text-green-400 group-hover:drop-shadow-[0_0_8px_rgba(74,222,128,0.4)] transition-all" />
          </Tooltip>
          <h2 className="text-[14px] font-medium text-white uppercase tracking-widest">Overview</h2>
        </div>
      </div>
    </div>
  );
}
