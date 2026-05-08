"use client";

import React from "react";
import { X, Shield, Users, Activity, Network, Zap, Clock, Terminal } from "lucide-react";

interface DetailPanelProps {
    isOpen: boolean;
    onClose: () => void;
    node: any;
}

export default function DetailPanel({ isOpen, onClose, node }: DetailPanelProps) {
    if (!node && !isOpen) return null;

    const name = node?.name || node?.nodlrId || "Unknown Identity";
    const wuid = node?.wuid || node?.nodlrId || "—";
    const type = node?.type || (node?.isFounder ? "Founder" : "Partner");
    const active = node?.active !== undefined ? node.active : true;

    return (
        <>
            {/* Backdrop for outside click */}
            <div 
                className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[90] transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            <div className={`fixed top-0 right-0 h-full w-[450px] bg-[#0A0A0A] border-l border-white/10 z-[100] shadow-[0_0_50px_rgba(0,0,0,0.8)] transition-transform duration-500 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-8 space-y-8 h-full overflow-y-auto custom-scrollbar">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h2 className="text-[14px] font-bold text-white uppercase tracking-widest">Affiliate Intelligence</h2>
                            <p className="text-[10px] text-slate-500 font-mono">Node Trace Registry</p>
                        </div>
                        <button 
                            onClick={onClose}
                            className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-500 hover:text-white"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="space-y-10">
                        {/* Identity Header Card */}
                        <section className="p-6 bg-white/[0.02] border border-white/5 rounded-[5px] space-y-4">
                            <div className="flex items-center justify-between">
                                <div 
                                    title={type === 'Founder' ? "Founder node: root-level identity" : "Partner node: network affiliate"}
                                    className={`flex items-center gap-2 px-2 py-0.5 rounded-[3px] border ${type === 'Founder' ? 'bg-amber-300/10 border-amber-300/40 text-amber-300' : 'bg-[#22D3EE]/10 border-[#22D3EE]/40 text-[#22D3EE]'}`}
                                >
                                    {type === 'Founder' ? <Shield className="w-2.5 h-2.5" /> : <Users className="w-2.5 h-2.5" />}
                                    <span className="text-[9px] font-bold uppercase tracking-widest">{type}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-emerald-500 shadow-[0_0_8px_#10B981]' : 'bg-slate-700'}`} />
                                    <span className={`text-[9px] font-bold uppercase tracking-widest ${active ? 'text-emerald-400' : 'text-slate-600'}`}>
                                        {active ? 'active' : 'inactive'}
                                    </span>
                                </div>
                            </div>
                            
                            <div>
                                <h3 className="text-[18px] text-white font-medium">{name}</h3>
                                <p 
                                    title="Unique Wnode Identifier"
                                    className="text-[12px] font-mono text-slate-400 mt-1 cursor-help"
                                >
                                    {wuid}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-2">
                                <div className="space-y-1">
                                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">L1 Affiliates</span>
                                    <p className="text-[14px] text-white font-mono">{node?.l1Count || "—"}</p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">L2 Affiliates</span>
                                    <p className="text-[14px] text-white font-mono">{node?.l2Count || "—"}</p>
                                </div>
                            </div>
                        </section>

                        {/* Hardware Blueprint Mock */}
                        <section className="space-y-4">
                            <h3 className="text-[11px] text-slate-400 uppercase tracking-widest border-b border-white/5 pb-2 flex items-center gap-2">
                                <Terminal className="w-3 h-3" />
                                Hardware Blueprint
                            </h3>
                            <div className="space-y-3 p-4 bg-white/[0.01] border border-white/5 rounded-[5px]">
                                <div className="flex justify-between items-center">
                                    <span className="text-[11px] text-slate-500">Core Architecture</span>
                                    <span className="text-[11px] text-white font-mono">Wazero x86_64</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[11px] text-slate-500">Isolation Layer</span>
                                    <span className="text-[11px] text-white font-mono">Secure Sandbox v2</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[11px] text-slate-500">Compute Tier</span>
                                    <span className="text-[11px] text-[#22D3EE] font-mono font-bold italic">Titanium</span>
                                </div>
                            </div>
                        </section>

                        {/* Network Activity Mock */}
                        <section className="space-y-4">
                            <h3 className="text-[11px] text-slate-400 uppercase tracking-widest border-b border-white/5 pb-2 flex items-center gap-2">
                                <Activity className="w-3 h-3" />
                                Live Telemetry
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 bg-white/[0.02] rounded-[3px] border border-white/5">
                                    <span className="text-[9px] text-slate-500 uppercase block">Uptime</span>
                                    <span className="text-[12px] text-white font-mono">99.98%</span>
                                </div>
                                <div className="p-3 bg-white/[0.02] rounded-[3px] border border-white/5">
                                    <span className="text-[9px] text-slate-500 uppercase block">Latency</span>
                                    <span className="text-[12px] text-white font-mono">14ms</span>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </>
    );
}
