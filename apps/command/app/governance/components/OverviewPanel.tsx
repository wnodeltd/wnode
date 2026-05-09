import React from 'react';
import { FilePlus, Vote, CheckCircle, User, Shield } from 'lucide-react';
import Tooltip from '../../components/Tooltip';

export default function OverviewPanel() {
  const metrics = [
    { 
      label: "New Proposals", 
      value: "—", 
      icon: <FilePlus className="w-5 h-5 text-yellow-400" />,
      tooltip: "Proposals submitted this week"
    },
    { 
      label: "New Votes", 
      value: "—", 
      icon: <Vote className="w-5 h-5 text-blue-400" />,
      tooltip: "Votes cast in the current epoch"
    },
    { 
      label: "New Resolutions", 
      value: "—", 
      icon: <CheckCircle className="w-5 h-5 text-green-400" />,
      tooltip: "Proposals resolved this week"
    },
    { 
      label: "Infra Manager", 
      value: "Stephen Soos", 
      subValue: "WUID-001",
      icon: <Shield className="w-5 h-5 text-cyan-400" />,
      tooltip: "Current authorized Infrastructure Manager"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {metrics.map((m, i) => (
        <Tooltip key={i} text={m.tooltip} direction="down">
          <div className="bg-white/[0.02] border border-white/10 rounded-[5px] p-6 space-y-4 hover:shadow-[0_0_20px_rgba(255,255,255,0.02)] transition-all group cursor-pointer flex flex-col justify-between h-full">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{m.label}</span>
              <div className="group-hover:scale-110 transition-transform">
                {m.icon}
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-[18px] text-white font-mono">{m.value}</span>
              {m.subValue && <span className="text-[10px] text-slate-500 font-mono">{m.subValue}</span>}
            </div>
          </div>
        </Tooltip>
      ))}
    </div>
  );
}
