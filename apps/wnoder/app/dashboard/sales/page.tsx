"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Copy, Check, Info, AlertTriangle, Shield, ArrowUpRight } from 'lucide-react';
import { useAccount } from '../../hooks/useAccount';

interface OpportunityEvent {
    jobId: string;
    amountCents: number;
    category: string;
    reason: string;
    timestamp: string;
}

interface OpportunityAudit {
    nodlrId: string;
    earnedSalesCents: number;
    missedComputeCents: number;
    captureEfficiencyPercentage: number;
    potentialMonthlyTotalCents: number;
    events: OpportunityEvent[];
    expansionInsight: {
        analysis: string;
        missedMonthly: number;
    };
}

export default function MeshSalesPage() {
    const { account, loading: accountLoading } = useAccount();
    const [audit, setAudit] = useState<OpportunityAudit | null>(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchAudit = async () => {
            const token = localStorage.getItem('nodl_jwt');
            if (!token) return;

            try {
                // Using 8081 to match existing useAccount hook pattern
                const res = await fetch('http://localhost:8081/api/v1/account/opportunity', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (res.ok) {
                    const data = await res.json();
                    setAudit(data);
                }
            } catch (err) {
                console.error("Failed to fetch opportunity audit:", err);
            } finally {
                setLoading(false);
            }
        };

        if (!accountLoading) {
            fetchAudit();
        }
    }, [accountLoading]);

    const copyInviteCode = () => {
        if (account?.nodlrId) {
            navigator.clipboard.writeText(account.nodlrId);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (loading || accountLoading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#ffff00]"></div>
            </div>
        );
    }

    if (!audit || audit.events.length === 0) {
        return (
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-bold text-white uppercase tracking-tight">Mesh Sales</h1>
                    <p className="text-slate-400 text-sm">Monitor your network growth and uncaptured yield.</p>
                </div>

                <div className="surface-card p-12 flex flex-col items-center text-center space-y-6">
                    <div className="w-20 h-20 rounded-full bg-[#ffff00]/5 flex items-center justify-center border border-[#ffff00]/20">
                        <TrendingUp className="w-10 h-10 text-[#ffff00]" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-xl font-bold text-white uppercase">No Active Sales Lineage</h2>
                        <p className="text-slate-400 max-w-md">
                            You haven't linked any Mesh clients yet. Every client you bring to the mesh earns you a 10% perpetual commission.
                        </p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-xl p-6 w-full max-w-lg space-y-4 text-left">
                        <span className="text-[10px] font-bold text-[#ffff00] uppercase tracking-widest">Your Unique Invite Code</span>
                        <div className="flex items-center justify-between bg-black/40 border border-white/5 rounded-[5px] px-4 py-3">
                            <code className="text-lg font-mono text-white">{account?.nodlrId}</code>
                            <button 
                                onClick={copyInviteCode}
                                className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
                            >
                                {copied ? <Check className="w-4 h-4 text-emerald" /> : <Copy className="w-4 h-4" />}
                                {copied ? 'COPIED' : 'COPY'}
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg">
                        <div className="p-4 border border-white/5 bg-white/5 rounded-lg space-y-1">
                            <span className="text-[10px] text-slate-500 uppercase font-bold">Step 1</span>
                            <p className="text-xs text-white">Give your Invite Code to a Mesh client.</p>
                        </div>
                        <div className="p-4 border border-white/5 bg-white/5 rounded-lg space-y-1">
                            <span className="text-[10px] text-slate-500 uppercase font-bold">Step 2</span>
                            <p className="text-xs text-white">They enter it during Mesh registration.</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-12">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-white uppercase tracking-tight">Mesh Sales</h1>
                    <p className="text-slate-400 text-sm">Ambassador Intelligence & Yield Optimization</p>
                </div>

                <div className="bg-[#080808] border border-white/10 rounded-xl p-4 flex items-center gap-6 min-w-[300px]">
                    <div className="space-y-1 flex-1">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Invite Code</span>
                        <div className="text-lg font-mono text-white">{account?.nodlrId}</div>
                    </div>
                    <button 
                        onClick={copyInviteCode}
                        className={`p-3 rounded-lg border transition-all ${
                            copied ? 'bg-emerald/10 border-emerald/30 text-emerald' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                        }`}
                    >
                        {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    </button>
                </div>
            </header>

            {/* Diagnostic Alert */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#ffff00]/5 border border-[#ffff00]/20 rounded-xl p-6 flex items-start gap-4 shadow-[0_0_30px_rgba(255,255,0,0.05)]"
            >
                <div className="bg-[#ffff00]/10 p-2 rounded-lg">
                    <Shield className="w-5 h-5 text-[#ffff00]" />
                </div>
                <div className="space-y-1">
                    <span className="text-[11px] font-black text-[#ffff00] uppercase tracking-[0.2em]">Network Growth Diagnostic</span>
                    <p className="text-[15px] text-white font-medium leading-relaxed italic">
                        "{audit.expansionInsight.analysis}"
                    </p>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Efficiency Gauge */}
                <div className="surface-card p-8 flex flex-col items-center justify-center space-y-6 relative overflow-hidden">
                    <div className="absolute top-4 right-4">
                        <Info className="w-4 h-4 text-slate-600" />
                    </div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Capture Efficiency</span>
                    
                    <div className="relative w-48 h-48 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle
                                cx="96"
                                cy="96"
                                r="80"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="transparent"
                                className="text-white/5"
                            />
                            <circle
                                cx="96"
                                cy="96"
                                r="80"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="transparent"
                                strokeDasharray={2 * Math.PI * 80}
                                strokeDashoffset={2 * Math.PI * 80 * (1 - audit.captureEfficiencyPercentage / 100)}
                                className="text-[#ffff00] transition-all duration-1000 ease-out"
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-4xl font-bold text-white">{audit.captureEfficiencyPercentage.toFixed(1)}%</span>
                            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Total Yield</span>
                        </div>
                    </div>

                    <p className="text-[11px] text-center text-slate-400 max-w-[200px]">
                        Percentage of your invitees' compute spend captured by your own nodes.
                    </p>
                </div>

                {/* Revenue Matrix */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="surface-card p-6 border-emerald/20 flex flex-col justify-between">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald shadow-[0_0_8px_#10b981]" />
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Yield</span>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-3xl font-bold text-white">${(audit.earnedSalesCents / 100).toFixed(2)}</h3>
                                <p className="text-xs text-slate-500">Current 10% + 70% capture from your hardware.</p>
                            </div>
                        </div>
                        <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                            <span className="text-[10px] text-slate-500 uppercase">Growth Potential</span>
                            <span className="text-xs text-emerald flex items-center gap-1 font-bold">
                                <TrendingUp className="w-3 h-3" />
                                HIGH
                            </span>
                        </div>
                    </div>

                    <div className="surface-card p-6 border-red-500/20 flex flex-col justify-between">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]" />
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Mesh Spillover</span>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-3xl font-bold text-white">${(audit.missedComputeCents / 100).toFixed(2)}</h3>
                                <p className="text-xs text-slate-500">Revenue leaked to the mesh due to capacity/tier limits.</p>
                            </div>
                        </div>
                        <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                            <span className="text-[10px] text-slate-500 uppercase">Revenue Leak</span>
                            <span className="text-xs text-red-500 flex items-center gap-1 font-bold">
                                <AlertTriangle className="w-3 h-3" />
                                UNCAPTURED
                            </span>
                        </div>
                    </div>

                    <div className="md:col-span-2 surface-card p-6 bg-white/5">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Sovereign Potential</span>
                            <div className="px-3 py-1 bg-[#ffff00]/10 rounded-full border border-[#ffff00]/20 text-[10px] font-bold text-[#ffff00]">
                                PER MONTH
                            </div>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold text-white">${(audit.potentialMonthlyTotalCents / 100).toFixed(2)}</span>
                            <span className="text-slate-500 text-sm italic">Total spend from your Sales Lineage</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Event Log */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider">Lineage Event Log</h2>
                    <span className="text-[10px] text-slate-500 uppercase">Showing last {audit.events.length} events</span>
                </div>
                
                <div className="space-y-2">
                    {audit.events.map((event, i) => (
                        <div key={i} className="surface-card px-6 py-4 flex items-center justify-between bg-white/[0.02] hover:bg-white/5 transition-colors border-transparent hover:border-white/10">
                            <div className="flex items-center gap-4">
                                <div className={`p-2 rounded-lg ${
                                    event.category === 'HARDWARE_GAP' ? 'bg-purple-500/10 text-purple-400' :
                                    event.category === 'DOWNTIME' ? 'bg-red-500/10 text-red-400' :
                                    'bg-orange-500/10 text-orange-400'
                                }`}>
                                    <Cpu className="w-4 h-4" />
                                </div>
                                <div className="space-y-0.5">
                                    <div className="text-sm font-bold text-white flex items-center gap-2">
                                        {event.category.replace('_', ' ')}
                                        <span className="text-[10px] text-slate-500 font-normal">{new Date(event.timestamp).toLocaleDateString()}</span>
                                    </div>
                                    <div className="text-xs text-slate-400">{event.reason}</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm font-bold text-red-400">-${(event.amountCents / 100).toFixed(2)}</div>
                                <div className="text-[10px] text-slate-600 uppercase font-black">Missed Yield</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
