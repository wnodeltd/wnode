"use client";

import React from "react";

const CheckIcon = () => (
  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
  </svg>
);

const CrossIcon = () => (
  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const WarningIcon = () => (
  <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const features = [
  { name: "Autonomous Mesh Compute", wnode: "check", cloud: "cross", other: "warning" },
  { name: "3-Click Node Activation", wnode: "check", cloud: "cross", other: "cross" },
  { name: "100% Sovereign Mesh Ownership", wnode: "check", cloud: "cross", other: "cross" },
  { name: "Institutional-Grade Governance", wnode: "check", cloud: "cross", other: "cross" },
  { name: "Multi-Income Immutable Asset", wnode: "check", cloud: "cross", other: "cross" },
  { name: "Institution-Grade Affiliate Program", wnode: "check", cloud: "cross", other: "cross" },
  { name: "Any Device — Old or New", wnode: "check", cloud: "cross", other: "warning" },
  { name: "Turn Old Devices Into Clean Compute", wnode: "check", cloud: "cross", other: "cross" },
  { name: "Daily Payouts — Real Cash (No Crypto)", wnode: "check", cloud: "cross", other: "cross" },
  { name: "Real-Time Compute Market", wnode: "check", cloud: "cross", other: "warning" },
  { name: "Locality-Aware Job Routing", wnode: "check", cloud: "warning", other: "warning" },
];

const IconRenderer = ({ type }: { type: string }) => {
  if (type === "check") return <CheckIcon />;
  if (type === "cross") return <CrossIcon />;
  return <WarningIcon />;
};

const StatusLabel = ({ type, name }: { type: string, name: string }) => {
  if (type === "check") return name;
  if (type === "warning") return "LIMITED";
  return "UNAVAILABLE";
};

export function ComparisonMinimal() {
  return (
    <section className="w-full bg-black py-24 px-8 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold text-center text-white mb-20 uppercase tracking-tighter">
          How Wnode Compares
        </h2>

        <div className="rounded-xl border border-white/25 p-8 bg-white/[0.01]">
          <div className="grid grid-cols-3 gap-8">
            {/* Column 1: Wnode */}
            <div className="flex flex-col">
              <h3 className="text-white font-bold text-base mb-6 text-center uppercase tracking-wider">Wnode</h3>
              <div className="flex flex-col w-full">
                {features.map((f, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 py-2 mb-2 hover:bg-white/[0.03] transition-colors duration-150 rounded-lg group">
                    <IconRenderer type={f.wnode} />
                    <span className="text-[10px] md:text-xs text-white text-center opacity-80 group-hover:opacity-100 transition-opacity uppercase tracking-tight max-w-[120px]">
                      <StatusLabel type={f.wnode} name={f.name} />
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2: AWS / GCP / Azure */}
            <div className="flex flex-col border-l border-white/15">
              <h3 className="text-gray-500 text-base font-medium mb-6 text-center uppercase tracking-wider">AWS / GCP / Azure</h3>
              <div className="flex flex-col w-full">
                {features.map((f, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 py-2 mb-2 hover:bg-white/[0.03] transition-colors duration-150 rounded-lg group">
                    <IconRenderer type={f.cloud} />
                    <span className="text-[10px] md:text-xs text-gray-500 text-center opacity-80 group-hover:opacity-100 transition-opacity uppercase tracking-widest max-w-[120px] font-bold">
                      <StatusLabel type={f.cloud} name={f.name} />
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 3: Other DePINs */}
            <div className="flex flex-col border-l border-white/15">
              <h3 className="text-gray-600 text-base font-medium mb-6 text-center uppercase tracking-wider">Other DePINs</h3>
              <div className="flex flex-col w-full">
                {features.map((f, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 py-2 mb-2 hover:bg-white/[0.03] transition-colors duration-150 rounded-lg group">
                    <IconRenderer type={f.other} />
                    <span className="text-[10px] md:text-xs text-gray-600 text-center opacity-80 group-hover:opacity-100 transition-opacity uppercase tracking-widest max-w-[120px] font-bold">
                      <StatusLabel type={f.other} name={f.name} />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ComparisonMinimal;
