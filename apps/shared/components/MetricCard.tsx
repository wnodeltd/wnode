import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  colorClass?: string;
  subValue?: string;
}

export default function MetricCard({ 
  label, 
  value, 
  icon: Icon, 
  colorClass = "text-white", 
  subValue
}: MetricCardProps) {
  return (
    <div className="bg-white/[0.04] shadow-[0_4px_25px_rgba(0,0,0,0.4)] border border-white/20 p-5 rounded-[5px] flex flex-col gap-1 group truncate transition-all hover:bg-white/[0.06] backdrop-blur-sm">
      <span className="text-[17px] text-white font-normal uppercase tracking-tight font-sans">
        {label}
      </span>
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className={`text-[22px] font-normal tracking-tighter ${colorClass}`}>{value}</span>
          {subValue && (
            <span className="text-[14px] text-[#3B82F6] font-normal font-sans tracking-widest mt-0.5">
              {subValue}
            </span>
          )}
        </div>
        <Icon className="w-4 h-4 text-[#3B82F6] opacity-40 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  );
}
