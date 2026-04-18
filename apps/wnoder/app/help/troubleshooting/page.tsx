"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft, AlertTriangle, RefreshCw, Terminal, Search } from "lucide-react";

export default function WnoderTroubleshootingHelp() {
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
                        <AlertTriangle className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold uppercase tracking-[0.2em] mb-1">Troubleshooting</h1>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest">Resolving Common Mesh & App Issues</p>
                    </div>
                </div>

                <div className="space-y-16">
                    <section>
                        <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6">
                            First-Step Protocols
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="p-6 bg-[#050505] border border-white/5 rounded">
                                <h3 className="text-white text-xs font-bold mb-3 uppercase tracking-widest flex items-center gap-2">
                                    <RefreshCw className="w-3 h-3 text-cyan-400" />
                                    The Restart Rule
                                </h3>
                                <p className="text-slate-500 text-[12px] leading-relaxed">
                                    Most 'Sync Anomaly' or 'Unresponsive' errors are resolved by simply restarting 
                                     the Wnode engine. This clears the local handshake cache and forces a 
                                     fresh peer discovery.
                                </p>
                            </div>
                            <div className="p-6 bg-[#050505] border border-white/5 rounded">
                                <h3 className="text-white text-xs font-bold mb-3 uppercase tracking-widest flex items-center gap-2">
                                    <Search className="w-3 h-3 text-cyan-400" />
                                    Ledger Re-sync
                                </h3>
                                <p className="text-slate-500 text-[12px] leading-relaxed">
                                    If your earnings aren't showing, navigate to settings and use 'Re-sync Ledger'. 
                                     This cross-checks your local task logs with the platform's global registry.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6">
                            Common Error Codes
                        </h2>
                        <div className="space-y-4 font-mono">
                            <div className="p-4 bg-white/[0.02] border border-white/5 flex gap-4">
                                <span className="text-cyan-400 text-[10px] uppercase font-bold w-32 shrink-0">ERR_SYNC_04</span>
                                <span className="text-slate-400 text-[11px]">Mesh Handshake Failed. Usually caused by restrictive firewall rules or ISP proxy interference.</span>
                            </div>
                            <div className="p-4 bg-white/[0.02] border border-white/5 flex gap-4">
                                <span className="text-cyan-400 text-[10px] uppercase font-bold w-32 shrink-0">ERR_PAY_99</span>
                                <span className="text-slate-400 text-[11px]">Stripe Identity Mismatch. verified that your Stripe Express account status is 'Active'.</span>
                            </div>
                            <div className="p-4 bg-white/[0.02] border border-white/5 flex gap-4">
                                <span className="text-cyan-400 text-[10px] uppercase font-bold w-32 shrink-0">ERR_HW_TMP</span>
                                <span className="text-slate-400 text-[11px]">Thermal Safety Triggered. The engine has throttled due to high CPU/GPU temperatures.</span>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                            <Terminal className="w-4 h-4" />
                            Diagnostic Log View
                        </h2>
                        <p className="text-slate-400 text-[13px] leading-relaxed mb-6">
                            For advanced users, the 'Logs' tab provides a live stream of the Wnode engine's internal operations. 
                            Look for 'FATAL' or 'ERROR' tags to identify hardware-specific disruptions.
                        </p>
                        <div className="p-4 bg-[#0a0a0a] border border-white/5 text-[10px] text-slate-600 space-y-1 rounded select-none font-mono">
                            <p>[09:44:22] [INFO] P2P_HANDSHAKE_INITIATED</p>
                            <p>[09:44:23] [INFO] PEER_DISCOVERY_SUCCESS [0xWN...99]</p>
                            <p className="text-amber-500">[09:44:25] [WARN] LATENCY_SPIKE [240ms]</p>
                            <p>[09:44:30] [INFO] TASK_BLOCK_RECEIVED [NODE_RENDER_V1]</p>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}
