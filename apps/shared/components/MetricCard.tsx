import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  colorClass?: string;
  subValue?: string;
}

export default function MetricCard({ label, value, icon: Icon, colorClass = "text-white", subValue }: MetricCardProps) {
  return (
    <div className="bg-white/[0.02] border border-white/10 p-5 rounded-[5px] flex flex-col gap-1 group truncate transition-all hover:bg-white/[0.04] backdrop-blur-sm">
      <span className="ds-sub font-bold">{label}</span>
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className={`text-xl font-normal tracking-tighter ${colorClass}`}>{value}</span>
          {subValue && <span className="text-[9px] text-[#b0bac3] mt-0.5 font-bold uppercase tracking-widest">{subValue}</span>}
        </div>
        <Icon className="w-4 h-4 text-slate-500 opacity-20 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  );
}
