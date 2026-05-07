"use client";

import React from "react";
import Link from "next/link";
import { 
    ChevronLeft, DollarSign, ArrowUpRight, ShieldCheck, 
    RefreshCw, BarChart3, Database, CreditCard, 
    Search, Filter, Download, FileText, Zap, Lock
} from "lucide-react";
import { usePageTitle } from "../../components/PageTitleContext";

export default function LedgerHelpPage() {
    usePageTitle("Money & Ledgers", "Technical guidance for platform economics and audit traces.");

    return (
        <main className="flex-1 p-8 overflow-y-auto pb-24 font-sans text-slate-300">
            <div className="max-w-4xl mx-auto">
                <Link 
                    href="/help" 
                    className="flex items-center gap-2 text-cyan-400 text-[10px] uppercase font-bold tracking-widest mb-8 hover:text-white transition-colors"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Back to Help Center
                </Link>

                <div className="bg-white/[0.02] border border-white/10 p-12 rounded-[5px] shadow-2xl">
                    <h1 className="text-3xl font-bold text-white mb-4 uppercase tracking-tighter">Sovereign Money Engine</h1>
                    <p className="text-slate-400 text-sm leading-relaxed mb-12 max-w-2xl">
                        The Sovereign Money Engine is the authoritative financial core of the Wnode ecosystem. 
                        It provides an immutable, cryptographically-verified ledger of all network value transitions, 
                        from compute job execution to institutional fiat settlement.
                    </p>

                    <div className="space-y-16">
                        {/* 1. Sovereign Ledger Overview */}
                        <section id="overview" className="scroll-mt-20">
                            <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <Database className="w-4 h-4" />
                                1. Sovereign Ledger Overview
                            </h2>
                            <p className="text-slate-400 text-[13px] leading-relaxed mb-6">
                                The Sovereign Ledger serves as the primary source of truth for the platform's economic state. 
                                It ensures that every transaction is tracked with forensic precision and that all revenue splits 
                                adhere to the constitutional protocol rules.
                            </p>
                            <ul className="list-disc pl-5 text-[12px] text-slate-400 space-y-2 mb-8">
                                <li><strong>Real-time Tracking:</strong> Continuous monitoring of all compute-related revenue events.</li>
                                <li><strong>Automated Distribution:</strong> Mathematical enforcement of the 80/10/5/5 split logic across network participants.</li>
                                <li><strong>Institutional Settlement:</strong> Bridge to global banking systems via the Stripe Connect infrastructure.</li>
                            </ul>
                            <div className="p-4 bg-black/20 border border-dashed border-white/10 rounded text-[10px] text-slate-500 font-mono text-center">
                                Screenshot: [Ledger Hero View]
                            </div>
                        </section>

                        {/* 2. Summary Cards */}
                        <section id="summary-cards" className="scroll-mt-20">
                            <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <BarChart3 className="w-4 h-4" />
                                2. Summary Cards: Platform, Steward, Pending, Escrow
                            </h2>
                            <p className="text-slate-400 text-[13px] leading-relaxed mb-6">
                                The top-level summary cards provide an aggregate view of the platform's total economic throughput 
                                and current liquidity state across four authoritative categories.
                            </p>
                            <ul className="list-disc pl-5 text-[12px] text-slate-400 space-y-2 mb-8">
                                <li><strong>Platform Accrual:</strong> Total gross volume processed and allocated to the network operator.</li>
                                <li><strong>Steward Revenue:</strong> Funds allocated for governance, maintenance, and protocol security.</li>
                                <li><strong>Pending Settlement:</strong> Revenue currently in the mandatory Stripe settlement cooling period.</li>
                                <li><strong>Escrowed Funds:</strong> Commissions held for participants who have not yet finalized their account onboarding.</li>
                            </ul>
                            <div className="p-4 bg-black/20 border border-dashed border-white/10 rounded text-[10px] text-slate-500 font-mono text-center">
                                Screenshot: [Money Summary Cards]
                            </div>
                        </section>

                        {/* 3. Transaction Table & Filters */}
                        <section id="table-filters" className="scroll-mt-20">
                            <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <Search className="w-4 h-4" />
                                3. Transaction Table & Filters
                            </h2>
                            <p className="text-slate-400 text-[13px] leading-relaxed mb-6">
                                The Authoritative Ledger Table provides a granular record of every financial event. 
                                Advanced filtering and search tools allow for precise forensic audits of specific participants or periods.
                            </p>
                            <ul className="list-disc pl-5 text-[12px] text-slate-400 space-y-2 mb-8">
                                <li><strong>Search:</strong> Locate records by Commission ID, Transaction ID, or Recipient WUID.</li>
                                <li><strong>Status Filtering:</strong> Isolate "Pending" vs. "Settled" (Paid) transactions.</li>
                                <li><strong>Table Metadata:</strong> View Sovereign Role, Settlement amounts, and exact Authentication Timestamps.</li>
                            </ul>
                            <div className="p-4 bg-black/20 border border-dashed border-white/10 rounded text-[10px] text-slate-500 font-mono text-center">
                                Screenshot: [Transaction Ledger Table]
                            </div>
                        </section>

                        {/* 4. Transaction Detail Slide-Out */}
                        <section id="detail-drawer" className="scroll-mt-20">
                            <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <ArrowUpRight className="w-4 h-4" />
                                4. Transaction Detail Slide-Out
                            </h2>
                            <p className="text-slate-400 text-[13px] leading-relaxed mb-6">
                                Clicking any transaction row opens the Economic Event Trace drawer, 
                                providing a deep-dive into the underlying metadata and split calculations.
                            </p>
                            <ul className="list-disc pl-5 text-[12px] text-slate-400 space-y-2 mb-8">
                                <li><strong>Gross Event Summary:</strong> Total transaction value and current protocol status.</li>
                                <li><strong>Constitutional Splits:</strong> Precise breakdown of how the amount was distributed to each role.</li>
                                <li><strong>Metadata Trace:</strong> Includes the cryptographic Integrity Hash and original Auth Timestamp.</li>
                            </ul>
                            <div className="p-4 bg-black/20 border border-dashed border-white/10 rounded text-[10px] text-slate-500 font-mono text-center">
                                Screenshot: [Transaction Detail Drawer]
                            </div>
                        </section>

                        {/* 5. CSV & PDF Exports */}
                        <section id="exports" className="scroll-mt-20">
                            <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <Download className="w-4 h-4" />
                                5. CSV & PDF Exports
                            </h2>
                            <p className="text-slate-400 text-[13px] leading-relaxed mb-6">
                                Audit-ready reporting tools enable the extraction of ledger data for external accounting and institutional compliance.
                            </p>
                            <ul className="list-disc pl-5 text-[12px] text-slate-400 space-y-2 mb-8">
                                <li><strong>CSV Export:</strong> Raw data optimized for spreadsheet analysis and programmatic ingestion.</li>
                                <li><strong>PDF Statement:</strong> A branded, executive-level summary suitable for official institutional records.</li>
                                <li><strong>Filtered Scope:</strong> Exports automatically respect the current search and filter settings.</li>
                            </ul>
                            <div className="p-4 bg-black/20 border border-dashed border-white/10 rounded text-[10px] text-slate-500 font-mono text-center">
                                Screenshot: [Export Modal Options]
                            </div>
                        </section>

                        {/* 6. State Integrity Anchor */}
                        <section id="integrity" className="scroll-mt-20">
                            <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <Zap className="w-4 h-4" />
                                6. State Integrity Anchor & Integrity Dashboard
                            </h2>
                            <p className="text-slate-400 text-[13px] leading-relaxed mb-6">
                                The Integrity Anchor provides cryptographic proof that the ledger has not been tampered with. 
                                It represents a rolling fingerprint of the entire financial state of the network.
                            </p>
                            <ul className="list-disc pl-5 text-[12px] text-slate-400 space-y-2 mb-8">
                                <li><strong>Rolling Hash:</strong> A unique SHA-256 string that updates with every financial transition.</li>
                                <li><strong>Audit Invariants:</strong> Real-time verification of Ledger Sanity, Split Parity, and Double-Spend Protection.</li>
                                <li><strong>Protocol Lockdown:</strong> Any hash mismatch immediately triggers a read-only isolation mode for security.</li>
                            </ul>
                            <div className="p-4 bg-black/20 border border-dashed border-white/10 rounded text-[10px] text-slate-500 font-mono text-center">
                                Screenshot: [State Integrity Anchor]
                            </div>
                        </section>

                        {/* 7. Stripe Connection & Health */}
                        <section id="stripe" className="scroll-mt-20">
                            <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <CreditCard className="w-4 h-4" />
                                7. Stripe Connection & Health
                            </h2>
                            <p className="text-slate-400 text-[13px] leading-relaxed mb-6">
                                The system monitors the bridge to the global banking infrastructure to ensure payout continuity 
                                and platform operational health.
                            </p>
                            <ul className="list-disc pl-5 text-[12px] text-slate-400 space-y-2 mb-8">
                                <li><strong>Operational Status:</strong> Indicates that charges and payouts are fully enabled.</li>
                                <li><strong>Attention Required:</strong> Flags KYC or compliance hurdles for specific connected accounts.</li>
                                <li><strong>Direct Sync:</strong> Real-time status polling from the Stripe Connect API.</li>
                            </ul>
                            <div className="p-4 bg-black/20 border border-dashed border-white/10 rounded text-[10px] text-slate-500 font-mono text-center">
                                Screenshot: [Stripe Health Indicator]
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
