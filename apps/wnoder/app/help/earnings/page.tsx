"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft, Zap, DollarSign, TrendingUp, Wallet } from "lucide-react";

export default function WnoderEarningsHelp() {
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
                        <DollarSign className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold uppercase tracking-[0.2em] mb-1">Earning Protocol</h1>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest">Maximizing your network rewards</p>
                    </div>
                </div>

                <div className="space-y-16">
                    <section>
                        <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6">
                            How You Earn
                        </h2>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6">
                            Your node earns platform currency by successfully processing compute tasks assigned by the mesh. 
                            Rewards are credited in real-time as tasks are completed and verified by the platform's forensic ledger.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="p-6 bg-[#050505] border border-white/5">
                                <h3 className="text-white text-xs font-bold mb-3 uppercase tracking-widest">Task Contribution</h3>
                                <p className="text-slate-500 text-[12px] leading-relaxed">
                                    Direct revenue based on the complexity and duration of tasks processed by your hardware.
                                </p>
                            </div>
                            <div className="p-6 bg-[#050505] border border-white/5">
                                <h3 className="text-white text-xs font-bold mb-3 uppercase tracking-widest">Network Momentum</h3>
                                <p className="text-slate-500 text-[12px] leading-relaxed">
                                    A platform-wide bonus that scales with the total compute demand in the mesh.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6">
                            Multiplier Tiers
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 border border-white/5 bg-[#080808]">
                                <span className="text-xs font-bold uppercase tracking-widest">Tier I: Basic</span>
                                <span className="text-cyan-400 font-mono text-xs">1.0x</span>
                            </div>
                            <div className="flex items-center justify-between p-4 border border-white/5 bg-[#080808]">
                                <span className="text-xs font-bold uppercase tracking-widest">Tier II: Reliable (99% Uptime)</span>
                                <span className="text-cyan-400 font-mono text-xs">1.5x</span>
                            </div>
                            <div className="flex items-center justify-between p-4 border border-white/5 bg-[#080808]">
                                <span className="text-xs font-bold uppercase tracking-widest">Tier III: Elite (GPU + Fiber)</span>
                                <span className="text-cyan-400 font-mono text-xs">2.5x</span>
                            </div>
                        </div>
                        <p className="text-[10px] text-slate-600 mt-4 italic">
                            *Multipliers are calculated every 24 hours based on your node's performance metrics.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6">
                            Payout Cycles
                        </h2>
                        <ul className="space-y-6">
                            <li className="flex gap-4">
                                <TrendingUp className="w-4 h-4 text-cyan-400 mt-1 shrink-0" />
                                <div>
                                    <p className="text-white text-xs font-bold mb-1 uppercase tracking-widest">Pending Balance</p>
                                    <p className="text-slate-400 text-[13px] leading-relaxed">
                                        Earnings stay in a "Pending" state for 72 hours to allow for task verification 
                                        and fraud prevention checks.
                                    </p>
                                </div>
                            </li>
                            <li className="flex gap-4">
                                <Wallet className="w-4 h-4 text-cyan-400 mt-1 shrink-0" />
                                <div>
                                    <p className="text-white text-xs font-bold mb-1 uppercase tracking-widest">Automated Sweep</p>
                                    <p className="text-slate-400 text-[13px] leading-relaxed">
                                        Once finalized, balances are automatically swept to your connected Stripe account 
                                        according to your regional payout schedule.
                                    </p>
                                </div>
                            </li>
                        </ul>
                    </section>
                </div>
            </div>
        </main>
    );
}
