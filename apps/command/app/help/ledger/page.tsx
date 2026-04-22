"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft, DollarSign, ArrowUpRight, ShieldCheck, RefreshCw, BarChart3, Database, CreditCard } from "lucide-react";
import { usePageTitle } from "../../components/PageTitleContext";

export default function LedgerHelpPage() {
    usePageTitle("Money & Ledgers", "Technical guidance for platform economics and audit traces.");

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
                    <h1 className="text-3xl font-bold text-white mb-4 uppercase tracking-tighter">Institutional Ledgers</h1>
                    <p className="text-slate-400 text-sm leading-relaxed mb-12 max-w-2xl">
                        The Wnode economic engine utilizes a multi-layer settlement protocol designed for institutional transparency. 
                        Every transaction is traced from the originating compute job to the final Stripe settlement.
                    </p>

                    <div className="space-y-16">
                        <section>
                            <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <DollarSign className="w-4 h-4" />
                                Commission Split Logic
                            </h2>
                            <p className="text-slate-400 text-[13px] leading-relaxed mb-8">
                                Platform revenue is distributed automatically according to the authoritative economic manifest:
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="p-6 bg-white/[0.02] border border-white/5 rounded-[5px]">
                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-2 font-bold">Provider Share</p>
                                    <p className="text-2xl text-white font-mono tracking-tighter">80%</p>
                                    <p className="text-[11px] text-slate-600 mt-2 italic">Net to operator node.</p>
                                </div>
                                <div className="p-6 bg-[#22D3EE]/5 border border-[#22D3EE]/20 rounded-[5px]">
                                    <p className="text-[10px] text-[#22D3EE] uppercase tracking-widest mb-2 font-bold">Platform Fee</p>
                                    <p className="text-2xl text-[#22D3EE] font-mono tracking-tighter">10%</p>
                                    <p className="text-[11px] text-cyan-900 mt-2 italic">Global ecosystem accrual.</p>
                                </div>
                                <div className="p-6 bg-white/[0.02] border border-white/5 rounded-[5px]">
                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-2 font-bold">Affiliate Pool</p>
                                    <p className="text-2xl text-slate-300 font-mono tracking-tighter">05%</p>
                                    <p className="text-[11px] text-slate-600 mt-2 italic">Referral & Founder layers.</p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4" />
                                Stripe Operational Health
                            </h2>
                            <div className="space-y-6">
                                <p className="text-slate-400 text-[13px] leading-relaxed">
                                    The Ledger monitors the real-time status of the Stripe Connect platform to ensure payout continuity:
                                </p>
                                <ul className="space-y-4">
                                    <li className="flex gap-4 p-4 bg-white/[0.01] border border-white/5 rounded">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2" />
                                        <div>
                                            <p className="text-white text-xs font-bold mb-1 uppercase tracking-widest">Operational</p>
                                            <p className="text-slate-500 text-[12px]">All systems online. Charges and payouts are enabled globally.</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-4 p-4 bg-white/[0.01] border border-white/5 rounded">
                                        <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2" />
                                        <div>
                                            <p className="text-white text-xs font-bold mb-1 uppercase tracking-widest">Attention Required</p>
                                            <p className="text-slate-500 text-[12px]">KYC or compliance requirements are pending for specific platform accounts.</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <BarChart3 className="w-4 h-4" />
                                Audit Tracing
                            </h2>
                            <p className="text-slate-400 text-[13px] leading-relaxed mb-6">
                                Every line item in the Money Ledger provides a multi-dimensional forensic trace:
                            </p>
                            <div className="p-6 bg-black/40 border border-white/5 rounded-[5px] grid grid-cols-2 gap-y-6 gap-x-12">
                                <div>
                                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Transaction ID</h4>
                                    <p className="text-xs font-mono text-[#22D3EE] uppercase tracking-tighter">TX-8042-4211-WN</p>
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Related Job</h4>
                                    <p className="text-xs font-mono text-white">job_af832m12</p>
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Stripe Payout Reference</h4>
                                    <p className="text-xs font-mono text-slate-400">po_1TBQaC...LhT</p>
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Audit Status</h4>
                                    <span className="text-[10px] bg-green-500/10 text-green-400 px-2 py-0.5 rounded border border-green-500/20 font-bold uppercase tracking-widest">COMPLETED</span>
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
