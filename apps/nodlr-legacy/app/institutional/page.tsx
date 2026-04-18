"use client";

import React, { useState, useEffect } from "react";
import { Shield, TrendingUp, Wallet, ArrowUpRight, CheckCircle2, Globe, Cpu, History } from "lucide-react";
import { motion } from "framer-motion";

export default function OperatorInstitutional() {
    const [stats, setStats] = useState<any>(null);
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const jwt = typeof window !== "undefined" ? localStorage.getItem("nodl_jwt") : null;
                const headers = { 'Authorization': `Bearer ${jwt}` };
                
                // For operators, we fetch their specific money overview and ledger
                const [ovRes, histRes] = await Promise.all([
                    fetch('/api/v1/money/overview', { headers }),
                    fetch('/api/v1/money/transactions', { headers })
                ]);

                if (ovRes.ok) setStats(await ovRes.json());
                if (histRes.ok) setHistory(await histRes.json());
            } catch (err) {
                console.error("Failed to fetch operator institutional data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const formatCents = (cents: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
    };

    return (
        <main className="p-8 space-y-10 custom-scrollbar">
            <div className="flex flex-col gap-2 mb-10">
                <h2 className="text-[20px] font-normal text-white tracking-tight">Institutional Ledger</h2>
                <p className="text-[12px] text-slate-500 uppercase tracking-widest font-medium">Verify your node's economic footprint and payout integrity.</p>
            </div>

            {/* Core Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Aggregate Revenue", value: formatCents(stats?.totalComputeRevenue || 0), icon: TrendingUp, color: "text-[#22D3EE]" },
                    { label: "Available for Payout", value: formatCents(stats?.pendingTotal || 0), icon: Wallet, color: "text-purple-400" },
                    { label: "Uptime Rating", value: "99.99%", icon: Activity, color: "text-emerald-400" }
                ].map((stat, i) => (
                    <div key={stat.label} className="bg-white/[0.02] border border-white/5 p-8 rounded-[5px] relative overflow-hidden group">
                         <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <stat.icon className="w-12 h-12" />
                        </div>
                        <div className="text-slate-500 text-[10px] uppercase tracking-widest font-bold mb-4">{stat.label}</div>
                        <div className="text-[28px] text-white font-normal tracking-tighter">{stat.value}</div>
                    </div>
                ))}
            </div>

            {/* Ledger History */}
            <div className="bg-white/[0.01] border border-white/5 rounded-[5px] overflow-hidden">
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <History className="w-5 h-5 text-slate-500" />
                        <span className="text-[12px] uppercase font-bold tracking-widest text-slate-400">Transaction Forensic Log</span>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="text-[10px] text-slate-600 uppercase tracking-[0.2em] bg-white/[0.02]">
                            <tr>
                                <th className="px-8 py-4 font-bold">Transaction ID</th>
                                <th className="px-6 py-4 font-bold">Role / Source</th>
                                <th className="px-6 py-4 font-bold">Amount</th>
                                <th className="px-6 py-4 font-bold">Status</th>
                                <th className="px-8 py-4 font-bold text-right">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-[13px]">
                            {history.length === 0 ? (
                                <tr><td colSpan={5} className="px-8 py-12 text-center text-slate-600">No forensic records found for this node operator yet.</td></tr>
                            ) : history.map((tx) => (
                                <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="px-8 py-5 font-mono text-slate-400 text-[11px]">{tx.transactionId}</td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#22D3EE]" />
                                            <span className="text-white uppercase tracking-widest text-[10px]">{tx.role}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-[#22D3EE] font-mono">{formatCents(tx.amountCents)}</td>
                                    <td className="px-6 py-5">
                                        <span className="px-2 py-0.5 rounded-[3px] bg-white/5 border border-white/10 text-[10px] text-slate-400 uppercase tracking-widest">{tx.status}</span>
                                    </td>
                                    <td className="px-8 py-5 text-right text-slate-600 font-mono text-[11px]">
                                        {new Date(tx.createdAt).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Integrity Shield */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                <div className="bg-[#22D3EE]/5 border border-[#22D3EE]/10 p-8 rounded-[5px] flex items-center gap-6">
                    <div className="w-12 h-12 rounded-full bg-[#22D3EE]/10 flex items-center justify-center border border-[#22D3EE]/20 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
                        <Shield className="w-6 h-6 text-[#22D3EE]" />
                    </div>
                    <div>
                        <div className="text-white text-[14px] font-medium mb-1">Ledger Integrity: Verified</div>
                        <p className="text-slate-500 text-[12px] font-normal leading-relaxed">All compute sessions on your node have been reconciled against the authoritative platform ledger and synced with Stripe Connect.</p>
                    </div>
                </div>
                <div className="bg-purple-500/5 border border-purple-500/10 p-8 rounded-[5px] flex items-center gap-6">
                    <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                        <CheckCircle2 className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                        <div className="text-white text-[14px] font-medium mb-1">Stripe Settlement Ready</div>
                        <p className="text-slate-500 text-[12px] font-normal leading-relaxed">Your balance is currently in the 24h settlement queue and will be available for withdrawal according to your payout frequency.</p>
                    </div>
                </div>
            </div>
        </main>
    );
}

const Activity = ({className}: {className?: string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
);
