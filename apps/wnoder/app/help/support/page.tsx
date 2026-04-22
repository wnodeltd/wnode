"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft, Inbox, MessageSquare, LifeBuoy, FileText } from "lucide-react";

export default function WnoderSupportHelp() {
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
                        <Inbox className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold uppercase tracking-[0.2em] mb-1">Support</h1>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest">Wnode Ecosystem Technical Assistance</p>
                    </div>
                </div>

                <div className="space-y-16">
                    <section>
                        <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6">
                            Contacting Support
                        </h2>
                        <p className="text-slate-400 text-sm leading-relaxed mb-8">
                            If you encountered a persistent issue that our diagnostic tools cannot resolve, 
                            please reach out via one of our official support channels.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="p-6 bg-[#050505] border border-white/5 rounded">
                                <MessageSquare className="w-5 h-5 text-cyan-400 mb-4" />
                                <h3 className="text-white text-xs font-bold mb-3 uppercase tracking-widest">Community Discord</h3>
                                <p className="text-slate-500 text-[12px] leading-relaxed">
                                    Join the #operator-support channel for real-time peer help and platform updates.
                                </p>
                            </div>
                            <div className="p-6 bg-[#050505] border border-white/5 rounded">
                                <LifeBuoy className="w-5 h-5 text-cyan-400 mb-4" />
                                <h3 className="text-white text-xs font-bold mb-3 uppercase tracking-widest">Support Ticket</h3>
                                <p className="text-slate-500 text-[12px] leading-relaxed">
                                    Submit a formal L2 support ticket for financial queries or hardware-specific failures.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6">
                            Required Information
                        </h2>
                        <div className="space-y-4">
                            <p className="text-slate-400 text-sm leading-relaxed">
                                When contacting support, please have the following technical details ready:
                            </p>
                            <div className="p-6 bg-[#080808] border border-white/5 font-mono text-[11px] text-slate-400 space-y-3">
                                <div className="flex justify-between">
                                    <span>[NODE_ID]</span>
                                    <span className="text-white">Visible on your Overview dashboard</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>[CORE_VERSION]</span>
                                    <span className="text-white">Located in the Help index footer</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>[OS_ENVIRONMENT]</span>
                                    <span className="text-white">e.g. Linux (Fedora), macOS 15, Windows 11</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                             <FileText className="w-4 h-4" />
                             Compliance & Documentation
                        </h2>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6">
                            Institutional partners can access higher-tier documentation (L3) regarding network 
                            solvency and platform engineering via the Command Portal Help Center.
                        </p>
                        <ul className="text-[11px] text-slate-500 space-y-2 uppercase tracking-[0.1em] font-bold">
                            <li>• Terms of Service</li>
                            <li>• Privacy Policy</li>
                            <li>• Operator Agreement</li>
                        </ul>
                    </section>
                </div>
            </div>
        </main>
    );
}
