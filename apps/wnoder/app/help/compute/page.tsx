"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft, Cpu, Zap, Activity, ShieldCheck } from "lucide-react";

export default function WnoderComputeHelp() {
    return (
        <main className="min-h-screen bg-black text-white p-12 font-sans">
            <div className="max-w-4xl mx-auto">
                <Link 
                    href="/help" 
                    className="flex items-center gap-2 text-cyan-400 text-[10px] uppercase font-bold tracking-widest mb-12 hover:text-white transition-colors"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Back to Help Center
                </Link>

                <div className="flex items-center gap-4 mb-12 border-b border-white/10 pb-8">
                    <div className="w-12 h-12 rounded-full border border-cyan-400/20 flex items-center justify-center bg-cyan-400/5">
                        <Cpu className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold uppercase tracking-[0.2em] mb-1">Compute Basics</h1>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest">Resource Allocation & Optimization</p>
                    </div>
                </div>

                <div className="space-y-16">
                    <section>
                        <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6">
                            The Compute Engine
                        </h2>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6">
                            Wnode transforms your idle hardware into a high-performance compute node for the global mesh. 
                            The engine operates in the background, automatically consuming available CPU and GPU resources 
                            to process decentralized tasks.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-6 border border-white/5 bg-[#050505]">
                                <h3 className="text-white text-xs font-bold mb-3 uppercase tracking-widest">CPU Throughput</h3>
                                <p className="text-slate-500 text-[12px] leading-relaxed">
                                    General-purpose logic processing. CPU contribution forms the baseline for your 
                                    70% Operator Yield, processed via secure WASM-based execution layers.
                                </p>
                            </div>
                            <div className="p-6 border border-white/5 bg-[#050505]">
                                <h3 className="text-white text-xs font-bold mb-3 uppercase tracking-widest">GPU Acceleration</h3>
                                <div className="inline-block px-2 py-0.5 bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-[8px] font-bold uppercase mb-2">High Yield</div>
                                <p className="text-slate-500 text-[12px] leading-relaxed">
                                    Reserved for parallel intensive tasks like AI inference. Active GPU workloads 
                                    significantly boost the atomic payouts captured by your Wnode.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6">
                            Performance Tiers
                        </h2>
                        <div className="space-y-4">
                            <div className="flex gap-4 p-4 bg-[#080808] border-l border-cyan-400">
                                <Zap className="w-4 h-4 text-cyan-400 mt-1 shrink-0" />
                                <div>
                                    <p className="text-white text-xs font-bold mb-1 uppercase tracking-widest">Latency Optimization</p>
                                    <p className="text-slate-400 text-[13px] leading-relaxed">
                                        Your node's distance from task originators affects your score. 
                                        Low-latency connections are prioritized for synchronous mesh operations.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4 p-4 bg-[#080808] border-l border-cyan-400">
                                <Activity className="w-4 h-4 text-cyan-400 mt-1 shrink-0" />
                                <div>
                                    <p className="text-white text-xs font-bold mb-1 uppercase tracking-widest">Throughput Stability</p>
                                    <p className="text-slate-400 text-[13px] leading-relaxed">
                                        Frequent fluctuations in task completion speed can reduce your ranking. 
                                        Ensure a stable internet connection for maximum efficiency.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6">
                            Hardware Safety
                        </h2>
                        <p className="text-slate-400 text-[13px] leading-relaxed mb-6">
                            Wnode is designed with hardware longevity in mind. The system monitors thermal 
                            thresholds and will throttle compute if dangerous levels are detected.
                        </p>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <li className="flex items-center gap-3 text-[11px] text-slate-500 font-bold uppercase tracking-widest border border-white/5 p-3">
                                <ShieldCheck className="w-3 h-3 text-cyan-400" />
                                Thermal Throttling
                            </li>
                            <li className="flex items-center gap-3 text-[11px] text-slate-500 font-bold uppercase tracking-widest border border-white/5 p-3">
                                <ShieldCheck className="w-3 h-3 text-cyan-400" />
                                Memory Isolation
                            </li>
                            <li className="flex items-center gap-3 text-[11px] text-slate-500 font-bold uppercase tracking-widest border border-white/5 p-3">
                                <ShieldCheck className="w-3 h-3 text-cyan-400" />
                                Power Efficiency
                            </li>
                            <li className="flex items-center gap-3 text-[11px] text-slate-500 font-bold uppercase tracking-widest border border-white/5 p-3">
                                <ShieldCheck className="w-3 h-3 text-cyan-400" />
                                No File System Access
                            </li>
                        </ul>
                    </section>
                </div>

                <div className="mt-20 pt-8 border-t border-white/10 flex justify-between items-center opacity-40">
                    <div className="text-[9px] uppercase tracking-widest font-mono text-slate-500">
                        COMPUTE_SUBSYSTEM // ALPHA_REV_2
                    </div>
                </div>
            </div>
        </main>
    );
}
