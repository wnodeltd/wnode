"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft, Monitor, Cpu, Server, HardDrive } from "lucide-react";

export default function WnoderHardwareHelp() {
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
                        <Monitor className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold uppercase tracking-[0.2em] mb-1">Hardware Setup</h1>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest">Optimizing Your Machine for the Mesh</p>
                    </div>
                </div>

                <div className="space-y-16">
                    <section>
                        <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6">
                            Recommended Specs
                        </h2>
                        <p className="text-slate-400 text-sm leading-relaxed mb-8">
                            While Wnode runs on most modern desktop environments, specific hardware configurations 
                            will unlock higher performance multipliers and ensure you capture the maximum 
                            possible 70% Operator Yield for the mesh tasks you process.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-6 bg-[#050505] border border-white/5 rounded">
                                <div className="flex items-center gap-3 mb-4">
                                    <Cpu className="w-4 h-4 text-cyan-400" />
                                    <h3 className="text-white text-xs font-bold uppercase tracking-widest">Processor (CPU)</h3>
                                </div>
                                <ul className="text-[11px] text-slate-500 space-y-2">
                                    <li>• Minimum: Quad-core 2.0GHz</li>
                                    <li>• Optimal: Octa-core 3.5GHz+ for intensive WASM tasks</li>
                                </ul>
                            </div>
                            <div className="p-6 bg-[#050505] border border-white/5 rounded">
                                <div className="flex items-center gap-3 mb-4">
                                    <Server className="w-4 h-4 text-cyan-400" />
                                    <h3 className="text-white text-xs font-bold uppercase tracking-widest">Graphics (GPU)</h3>
                                </div>
                                <ul className="text-[11px] text-slate-500 space-y-2">
                                    <li>• Minimum: Dedicated GPU with 4GB VRAM</li>
                                    <li>• Optimal: NVIDIA RTX Series (CUDA support enabled)</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6">
                            Storage & Memory
                        </h2>
                        <div className="space-y-6">
                            <div className="flex gap-4 p-5 border-l border-white/10 bg-[#080808]">
                                <HardDrive className="w-5 h-5 text-slate-500 mt-1 shrink-0" />
                                <div>
                                    <p className="text-white text-xs font-bold mb-1 uppercase tracking-widest">RAM Requirements</p>
                                    <p className="text-slate-400 text-[13px] leading-relaxed">
                                        The engine requires a minimum of 8GB RAM. For stable high-tier performance, 
                                        16GB-32GB is recommended to handle large compute payloads without swapping.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4 p-5 border-l border-white/10 bg-[#080808]">
                                <Activity className="w-5 h-5 text-slate-500 mt-1 shrink-0" />
                                <div>
                                    <p className="text-white text-xs font-bold mb-1 uppercase tracking-widest">SSD Priority</p>
                                    <p className="text-slate-400 text-[13px] leading-relaxed">
                                        Wnode performs best on SSD storage. Fast read/write speeds are critical for 
                                        mesh task initialization and ledger synchronization.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="p-8 border border-white/10 bg-[#050505] rounded">
                        <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-4">
                            Cooling & Sustainability
                        </h2>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6">
                            Processing mesh tasks can generate significant heat. Ensure your device has 
                            adequate airflow. The platform measures thermal output as part of the 
                            'Hardware Health' score to promote network longevity.
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
}
