"use client";

import React from "react";
import { Shield, Users, ChevronRight } from "lucide-react";

interface GenesisRow {
    index: string;
    name: string;
    type: "Founder" | "Partner";
    wuid: string;
    l1Count: string;
    l2Count: string;
}

interface GenesisListProps {
    onRowClick?: (row: GenesisRow) => void;
    onL1Click?: (e: React.MouseEvent, row: GenesisRow) => void;
}

const genesisData: GenesisRow[] = [
    { index: "01", name: "Stephen Soos", type: "Founder", wuid: "100001-0426-01-AA", l1Count: "—", l2Count: "—" },
    { index: "02", name: "Steward (Reserved)", type: "Founder", wuid: "—", l1Count: "—", l2Count: "—" },
    { index: "03", name: "Head of Development (Reserved)", type: "Founder", wuid: "—", l1Count: "—", l2Count: "—" },
    { index: "04", name: "Investor (Reserved)", type: "Founder", wuid: "—", l1Count: "—", l2Count: "—" },
    { index: "05", name: "Cars (Reserved)", type: "Partner", wuid: "—", l1Count: "—", l2Count: "—" },
    { index: "06", name: "Computers & Peripherals (Reserved)", type: "Partner", wuid: "—", l1Count: "—", l2Count: "—" },
    { index: "07", name: "Mobile Phones & Tablets (Reserved)", type: "Partner", wuid: "—", l1Count: "—", l2Count: "—" },
    { index: "08", name: "Smart TVs (Reserved)", type: "Partner", wuid: "—", l1Count: "—", l2Count: "—" },
    { index: "09", name: "Robots (Reserved)", type: "Partner", wuid: "—", l1Count: "—", l2Count: "—" },
    { index: "10", name: "IoT (Reserved)", type: "Partner", wuid: "—", l1Count: "—", l2Count: "—" },
];

export default function GenesisList({ onRowClick, onL1Click }: GenesisListProps) {
    return (
        <section className="space-y-6">

            <div className="bg-white/[0.01] border border-white/10 rounded-[5px] overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/10 bg-white/[0.02]">
                            <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Index</th>
                            <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Name</th>
                            <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Type</th>
                            <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">WUID</th>
                            <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">L1 Affiliates</th>
                            <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">L2 Affiliates</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {genesisData.map((row) => (
                            <tr 
                                key={row.index} 
                                onClick={() => onRowClick?.(row)}
                                className="group hover:bg-white/[0.03] transition-all cursor-pointer border-l-2 border-transparent hover:border-[#22D3EE]"
                            >
                                <td className="px-6 py-4">
                                    <span className="text-[12px] font-mono text-slate-500 group-hover:text-white transition-colors">{row.index}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-[13px] text-white font-medium">{row.name}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className={`flex items-center gap-2 px-2 py-0.5 rounded-[3px] w-fit border ${row.type === 'Founder' ? 'bg-yellow-400/10 border-yellow-400/20 text-yellow-400' : 'bg-[#22D3EE]/10 border-[#22D3EE]/20 text-[#22D3EE]'}`}>
                                        {row.type === 'Founder' ? <Shield className="w-2.5 h-2.5" /> : <Users className="w-2.5 h-2.5" />}
                                        <span className="text-[9px] font-bold uppercase tracking-widest">{row.type}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-[12px] font-mono text-slate-400 group-hover:text-[#22D3EE] transition-colors">{row.wuid}</span>
                                </td>
                                <td 
                                    className="px-6 py-4 text-center"
                                    onClick={(e) => onL1Click?.(e, row)}
                                >
                                    <span className="text-[12px] font-mono text-slate-500 hover:text-[#22D3EE] transition-colors">{row.l1Count}</span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className="text-[12px] font-mono text-slate-500">{row.l2Count}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
