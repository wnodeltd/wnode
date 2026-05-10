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
      icon: <FilePlus className="text-yellow-400" />,
      tooltip: "Jump to active network proposals"
    },
    { 
      id: 'voting',
      label: "New Votes", 
      value: "—", 
      icon: <Vote className="text-blue-400" />,
      tooltip: "Jump to the voting terminal"
    },
    { 
      id: 'transparency',
      label: "New Resolutions", 
      value: "—", 
      icon: <CheckCircle className="text-green-400" />,
      tooltip: "Jump to the transparency ledger"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {metrics.map((m, i) => (
        <Tooltip key={i} text={m.tooltip} direction="down">
          <div 
            onClick={() => onSectionClick(m.id)}
            className="bg-white/[0.02] border border-white/10 rounded-[5px] p-5 hover:bg-white/[0.04] hover:border-white/20 transition-all group cursor-pointer flex flex-col justify-between h-[100px]"
          >
            <div className="flex items-center gap-2.5">
              <div className="group-hover:scale-110 transition-transform">
                {React.cloneElement(m.icon as React.ReactElement, { className: "w-5 h-5 " + (m.icon as React.ReactElement).props.className })}
              </div>
              <span className="text-[12px] text-white uppercase tracking-widest font-semibold">{m.label}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[16px] text-white font-mono">{m.value}</span>
            </div>
          </div>
        </Tooltip>
      ))}

      <Tooltip text="View Infrastructure Manager CRM details" direction="down">
        <div 
          onClick={() => onCrmClick(managerName, managerWUID)}
          className="bg-white/[0.02] border border-white/10 rounded-[5px] p-5 hover:bg-white/[0.04] hover:border-white/20 transition-all group cursor-pointer flex flex-col justify-between h-[100px]"
        >
          <div className="flex items-center gap-2.5">
            <Shield className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span className="text-[12px] text-white uppercase tracking-widest font-semibold">Infra Manager</span>
          </div>
          <div className="flex flex-col overflow-hidden gap-0.5">
            <span className="text-[16px] text-white font-mono truncate leading-none">{managerWUID}</span>
            <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold truncate leading-none">{managerName}</span>
          </div>
        </div>
      </Tooltip>
    </div>
  );
}
