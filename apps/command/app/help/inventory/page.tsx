"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft, Activity, Server, Zap, ShieldCheck, Terminal, Hash, HardDrive } from "lucide-react";
import { usePageTitle } from "../../components/PageTitleContext";

export default function InventoryHelpPage() {
    usePageTitle("Network Inventory", "Operational documentation for node management and pairing.");

    return (
        <main className="flex-1 p-8 overflow-y-auto pb-24 font-sans">
            <div className="max-w-4xl mx-auto">
                <Link 
                    href="/help" 
                    className="flex items-center gap-2 text-cyan-400 text-[10px] uppercase font-bold tracking-widest mb-8 hover:text-white transition-colors"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Back to Help Center
                </Link>

                <div className="bg-white/[0.02] border border-white/10 p-12 rounded-[5px]">
                    <h1 className="text-3xl font-bold text-white mb-4 uppercase tracking-tighter">Network Inventory</h1>
                    <p className="text-slate-400 text-sm leading-relaxed mb-12 max-w-2xl">
                        The Node Registry provides a unified view into the globally distributed compute cluster. 
                        Administrators can monitor hardware integrity, manage node lifecycles, and audit telemetry in real-time.
                    </p>

                    <div className="space-y-16">
                        <section>
                            <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <Activity className="w-4 h-4" />
                                Operational States
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-[5px] flex items-center gap-4">
                                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22C55E]" />
                                    <div>
                                        <p className="text-white text-xs font-bold uppercase tracking-widest">Active</p>
                                        <p className="text-slate-500 text-[12px]">Node is online, responding to heartbeats, and available for compute tasks.</p>
                                    </div>
                                </div>
                                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-[5px] flex items-center gap-4">
                                    <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_#EF4444]" />
                                    <div>
                                        <p className="text-white text-xs font-bold uppercase tracking-widest">Suspended</p>
                                        <p className="text-slate-500 text-[12px]">Administrative block. The node is barred from receiving new workloads.</p>
                                    </div>
                                </div>
                                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-[5px] flex items-center gap-4">
                                    <div className="w-2 h-2 rounded-full bg-slate-700" />
                                    <div>
                                        <p className="text-white text-xs font-bold uppercase tracking-widest">Maintenance</p>
                                        <p className="text-slate-500 text-[12px]">Currently undergoing kernel updates or hardware reconfiguration.</p>
                                    </div>
                                </div>
                                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-[5px] flex items-center gap-4">
                                    <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                                    <div>
                                        <p className="text-white text-xs font-bold uppercase tracking-widest">Pairing Pending</p>
                                        <p className="text-slate-500 text-[12px]">Hardware detected but awaiting executive identity association.</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <Zap className="w-4 h-4" />
                                Pairing Protocol (WN-Codes)
                            </h2>
                            <p className="text-slate-400 text-[13px] leading-relaxed mb-6">
                                Wnode hardware is onboarded via the <strong className="text-white">Secure Pairing Protocol</strong>:
                            </p>
                            <div className="bg-black/40 border border-white/5 p-8 rounded-[5px] relative">
                                <div className="flex flex-col md:flex-row gap-8 items-center">
                                    <div className="p-6 bg-cyan-400/10 border border-cyan-400/20 rounded font-mono text-cyan-400 text-lg tracking-[0.5em] font-bold">
                                        WN-8F2Q-K90L
                                    </div>
                                    <div className="flex-1 space-y-4 text-sm">
                                        <p className="text-slate-400">
                                            Each pairing code is a one-time cryptographic token that associates a hardware fingerprint 
                                            with an operator's Stripe-verified identity.
                                        </p>
                                        <ul className="space-y-2 text-slate-500 text-xs">
                                            <li className="flex gap-2"><span>-</span> <span>Authenticates P2P host connectivity.</span></li>
                                            <li className="flex gap-2"><span>-</span> <span>Initializes sovereign compute containers.</span></li>
                                            <li className="flex gap-2"><span>-</span> <span>Locks node rewards to the verified payout account.</span></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <HardDrive className="w-4 h-4" />
                                Telemetry Inspector
                            </h2>
                            <p className="text-slate-400 text-[13px] leading-relaxed mb-6">
                                The inspector provides a low-level forensic view of every node's infrastructure:
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-5 border border-white/5 bg-white/[0.01] rounded">
                                    <h5 className="text-[10px] text-slate-500 uppercase tracking-widest mb-3">Resource Map</h5>
                                    <ul className="space-y-2 font-mono text-[11px] text-slate-400">
                                        <li className="flex justify-between"><span>Core Count</span> <span className="text-white">16 vCPUs</span></li>
                                        <li className="flex justify-between"><span>RAM (ECC)</span> <span className="text-white">64 GB</span></li>
                                        <li className="flex justify-between"><span>Kernel Ver.</span> <span className="text-white">5.15.0-SVP</span></li>
                                    </ul>
                                </div>
                                <div className="p-5 border border-white/5 bg-white/[0.01] rounded">
                                    <h5 className="text-[10px] text-slate-500 uppercase tracking-widest mb-3">Connectivity Trace</h5>
                                    <ul className="space-y-2 font-mono text-[11px] text-slate-400">
                                        <li className="flex justify-between"><span>Latency (P2P)</span> <span className="text-emerald-400">12ms</span></li>
                                        <li className="flex justify-between"><span>Host Status</span> <span className="text-emerald-400">REACHABLE</span></li>
                                        <li className="flex justify-between"><span>Encryption</span> <span className="text-white">TLS 1.3</span></li>
                                    </ul>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <p className="text-slate-600 text-[10px] uppercase tracking-[0.2em]">© 2026 Wnode Technologies // Executive Documentation</p>
                </div>
            </div>
        </main>
    );
}
