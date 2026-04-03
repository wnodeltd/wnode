import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  statusColor?: string;
  subValue?: string;
  pulse?: boolean;
  larger?: boolean;
}

export default function MetricCard({ 
    label, 
    value, 
    icon: Icon, 
    statusColor = "text-white", 
    subValue,
    pulse,
    larger
}: MetricCardProps) {
  return (
    <div className={`ds-card p-5 flex flex-col gap-1 group truncate ${larger ? 'h-full justify-between' : ''}`}>
      <div className="flex items-center justify-between">
        <span className="ds-sub">{label}</span>
        <Icon className={`w-4 h-4 ds-icon opacity-20 group-hover:opacity-100 transition-opacity ${pulse ? 'animate-pulse' : ''}`} />
      </div>
      <div className="flex flex-col mt-1">
        <span className={`${larger ? 'text-2xl' : 'text-xl'} font-normal tracking-tighter ${statusColor} ${pulse ? 'animate-pulse' : ''}`}>
          {value}
        </span>
        {subValue && (
            <span className="text-[9px] text-[#b0bac3] mt-1 font-bold uppercase tracking-[0.1em]">
                {subValue}
            </span>
        )}
      </div>
    </div>
  );
}
