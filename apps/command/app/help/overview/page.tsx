"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft, Info, BookOpen, ShieldCheck, Activity } from "lucide-react";
import { usePageTitle } from "../../components/PageTitleContext";

export default function HelpOverviewPage() {
    usePageTitle("Platform Overview", "High-level understanding of the Wnode Command ecosystem.");

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
                    <h1 className="text-3xl font-bold text-white mb-4 uppercase tracking-tighter">Command Overview</h1>
                    <p className="text-slate-400 text-sm leading-relaxed mb-12 max-w-2xl">
                        The Wnode Command Portal is the authoritative executive layer for global resource management. 
                        It provides real-time oversight of the mesh network's compute capacity, memory distribution, 
                        and institutional economic stability.
                    </p>

                    <div className="space-y-16">
                        <section>
                            <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <BookOpen className="w-4 h-4" />
                                Core Architecture
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h3 className="text-white text-sm font-bold">The Mesh Layer</h3>
                                    <p className="text-slate-400 text-[13px] leading-relaxed">
                                        A globally distributed network of operator nodes that execute compute tasks. 
                                        Each node is verified through cryptographic pairing and hardware fingerprints.
                                    </p>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-white text-sm font-bold">The Executive Engine</h3>
                                    <p className="text-slate-400 text-[13px] leading-relaxed">
                                        An automated settlement and monitoring system that captures performance and 
                                        distributes rewards based on the 80/20 platform economic manifest.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4" />
                                Operational Trust
                            </h2>
                            <ul className="space-y-4">
                                <li className="flex gap-4 p-4 bg-white/[0.01] border border-white/5 rounded">
                                    <span className="text-cyan-400 font-mono text-xs">01</span>
                                    <div>
                                        <p className="text-white text-xs font-bold mb-1">Real-time Telemetry</p>
                                        <p className="text-slate-500 text-[12px]">Every node heartbeat and API request is evaluated for network integrity and latency thresholds.</p>
                                    </div>
                                </li>
                                <li className="flex gap-4 p-4 bg-white/[0.01] border border-white/5 rounded">
                                    <span className="text-cyan-400 font-mono text-xs">02</span>
                                    <div>
                                        <p className="text-white text-xs font-bold mb-1">Institutional Oversight</p>
                                        <p className="text-slate-500 text-[12px]">Authoritative management of founder affiliate layers and personnel RBAC tiers.</p>
                                    </div>
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <Activity className="w-4 h-4" />
                                Executive Metrics
                            </h2>
                            <p className="text-slate-400 text-[13px] leading-relaxed mb-6">
                                The main dashboard provides high-density visibility into the ecosystem's momentum:
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <div className="p-4 border border-white/5 bg-white/[0.01]">
                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-2">Capacity</p>
                                    <p className="text-white text-xs font-medium">Network Compute (vCPUs)</p>
                                </div>
                                <div className="p-4 border border-white/5 bg-white/[0.01]">
                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-2">Growth</p>
                                    <p className="text-white text-xs font-medium">New Users This Month</p>
                                </div>
                                <div className="p-4 border border-white/5 bg-white/[0.01]">
                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-2">Health</p>
                                    <p className="text-white text-xs font-medium">API Latency (ms)</p>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <p className="text-slate-600 text-[10px] uppercase tracking-[0.2em]">© 2025 Wnode Technologies // Executive Documentation</p>
                </div>
            </div>
        </main>
    );
}
