"use client";

import React, { useState, useEffect } from 'react';
import { FilePlus, Vote, CheckCircle, Shield } from 'lucide-react';
import Tooltip from '../../components/Tooltip';
import { normalizeAccount } from '@shared/lib/identity';

interface OverviewPanelProps {
  onCrmClick: (name: string, wuid: string) => void;
  onSectionClick: (id: string) => void;
}

export default function OverviewPanel({ onCrmClick, onSectionClick }: OverviewPanelProps) {
  const [manager, setManager] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadManager = async () => {
      try {
        const res = await fetch("/api/account/me");
        if (res.ok) {
          const data = await res.json();
          setManager(normalizeAccount(data));
        }
      } catch (e) {
        console.error("Governance SOT fetch failed:", e);
      } finally {
        setIsLoaded(true);
      }
    };
    loadManager();
  }, []);

  const managerName = manager?.displayName || "—";
  const managerWUID = manager?.id || "—";

  const metrics = [
    { 
      id: 'proposals',
      label: "New Proposals", 
      value: "—", 
      icon: <FilePlus className="w-6 h-6 text-yellow-400" />,
      tooltip: "Jump to active network proposals"
    },
    { 
      id: 'voting',
      label: "New Votes", 
      value: "—", 
      icon: <Vote className="w-6 h-6 text-blue-400" />,
      tooltip: "Jump to the voting terminal"
    },
    { 
      id: 'transparency',
      label: "New Resolutions", 
      value: "—", 
      icon: <CheckCircle className="w-6 h-6 text-green-400" />,
      tooltip: "Jump to the transparency ledger"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {metrics.map((m, i) => (
        <Tooltip key={i} text={m.tooltip} direction="down">
          <div 
            onClick={() => onSectionClick(m.id)}
            className="bg-white/[0.02] border border-white/10 rounded-[8px] p-[18px] space-y-2 hover:shadow-[0_0_20px_rgba(255,255,255,0.02)] transition-all group cursor-pointer flex flex-col justify-between h-[110px]"
          >
            <div className="flex items-center justify-between">
              <span className="text-[14px] text-slate-500 uppercase tracking-widest font-bold">{m.label}</span>
              <div className="group-hover:scale-110 transition-transform">
                {m.icon}
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-[20px] text-white font-mono font-semibold">{m.value}</span>
            </div>
          </div>
        </Tooltip>
      ))}

      <Tooltip text="View Infrastructure Manager CRM details" direction="down">
        <div 
          onClick={() => onCrmClick(managerName, managerWUID)}
          className="bg-white/[0.02] border border-white/10 rounded-[8px] p-[18px] space-y-2 hover:shadow-[0_0_20px_rgba(34,211,238,0.05)] transition-all group cursor-pointer flex flex-col justify-between h-[110px]"
        >
          <div className="flex items-center justify-between">
            <span className="text-[14px] text-slate-500 uppercase tracking-widest font-bold">Infra Manager</span>
            <div className="group-hover:scale-110 transition-transform text-cyan-400">
              <Shield className="w-6 h-6" />
            </div>
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-[20px] text-white font-semibold truncate">{managerName}</span>
            <span className="text-[10px] text-slate-500 font-mono truncate">{managerWUID}</span>
          </div>
        </div>
      </Tooltip>
    </div>
  );
}
