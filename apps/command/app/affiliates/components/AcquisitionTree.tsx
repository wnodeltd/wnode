"use client";

import React from "react";
import { Layers, Search } from "lucide-react";
import { Tree } from "./Tree";

interface AcquisitionTreeProps {
    onNodeClick?: (node: any) => void;
    selectedNodeId?: string;
}

export default function AcquisitionTree({ onNodeClick, selectedNodeId }: AcquisitionTreeProps) {
    return (
        <section className="bg-white/[0.01] border border-white/10 rounded-[5px] overflow-hidden shadow-2xl">
            <div className="bg-white/[0.02] border-b border-white/5 p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Layers className="w-5 h-5 text-[#22D3EE]" />
                    <h2 className="text-[14px] font-bold text-white uppercase tracking-[0.1em]">Network Topology</h2>
                </div>
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-[#22D3EE] transition-colors" />
                    <input 
                        type="text" 
                        title="Search by name or WUID"
                        placeholder="Search network identities..." 
                        className="bg-black/40 border border-white/10 rounded-[5px] pl-10 pr-4 py-2 text-[12px] text-white w-64 focus:outline-none focus:border-[#22D3EE]/50 transition-all font-normal"
                        readOnly
                    />
                </div>
            </div>
            <div className="p-6">
                <Tree onNodeClick={onNodeClick} selectedNodeId={selectedNodeId} />
            </div>
        </section>
    );
}
