"use client";

import React, { useState, useEffect } from "react";
import { 
    Users, Share2, DollarSign, TrendingUp, 
    ChevronRight, ArrowUpRight, BarChart3, Mail, 
    Network, Activity, ShieldCheck, Globe
} from "lucide-react";
import { motion } from "framer-motion";

export default function ReferralsPage() {
    const [overview, setOverview] = useState<any>(null);
    const [graph, setGraph] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [userEmail, setUserEmail] = useState("stephen@wnode.one"); // Authority context

    const fetchData = async () => {
        try {
            const baseUrl = '/api/v1/acquisition';
            
            const oRes = await fetch(`${baseUrl}/overview?email=${userEmail}`);
            if (oRes.ok) setOverview(await oRes.json());
            
            const gRes = await fetch(`${baseUrl}/graph?email=${userEmail}`);
            if (gRes.ok) {
                const data = await gRes.json();
                setGraph(data.nodes || []);
            }
        } catch (err) {
            console.error("Failed to fetch acquisition data:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [userEmail]);

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-2xl font-black tracking-tighter text-white italic uppercase mb-1">
                        Acquisition Engine
                    </h1>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-mesh-emerald animate-pulse" />
                        <p className="text-[10px] text-slate-500 font-bold tracking-[0.2em] uppercase">Auth_Node: Referral Graph V1.0</p>
                    </div>
                </div>
                
                <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg flex items-center gap-3">
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest">Your Code:</span>
                    <span className="text-sm font-mono font-bold text-mesh-emerald uppercase tracking-tighter cursor-pointer hover:text-white transition-colors">
                        WNODE_PRO_STEVIE
                    </span>
                    <Share2 className="w-3.5 h-3.5 text-slate-600 cursor-pointer" />
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Referrals', value: overview?.totalReferrals || '0', icon: Users, color: 'text-white' },
                    { label: 'Network Depth', value: overview?.l2Count > 0 ? 'Level 2' : 'Level 1', icon: Network, color: 'text-mesh-emerald' },
                    { label: 'Revenue Yield', value: `$${((overview?.totalRevenue || 0) / 100).toLocaleString(undefined, {minimumFractionDigits: 2})}`, icon: DollarSign, color: 'text-amber-500' },
                    { label: 'Conversion', value: `${(overview?.conversionRate || 0).toFixed(1)}%`, icon: TrendingUp, color: 'text-green-500' },
                ].map((s, i) => (
                    <motion.div 
                        key={s.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white/[0.03] border border-white/10 p-5 rounded-xl group hover:bg-white/[0.06] hover:border-mesh-emerald/30 transition-all"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-8 h-8 rounded-lg bg-black/40 border border-white/5 flex items-center justify-center">
                                <s.icon className={`w-4 h-4 ${s.color}`} />
                            </div>
                            <span className="text-[10px] text-slate-600 font-mono font-bold tracking-tighter uppercase opacity-0 group-hover:opacity-100 transition-opacity">Live_Sync</span>
                        </div>
                        <span className="text-[11px] text-slate-500 uppercase tracking-widest font-bold block mb-1">{s.label}</span>
                        <span className={`text-2xl font-black tracking-tighter ${s.color}`}>{s.value}</span>
                    </motion.div>
                ))}
            </div>

            {/* Referral Graph Table */}
            <div className="space-y-4">
                <div className="border-b border-white/5 pb-2 flex justify-between items-end">
                    <span className="text-[10px] font-bold text-slate-500 tracking-[0.2em] uppercase">Propagated Network Nodes</span>
                    <Activity className="w-3.5 h-3.5 text-mesh-emerald opacity-50" />
                </div>

                <div className="bg-white/[0.02] border border-white/10 rounded-xl overflow-hidden backdrop-blur-xl">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/[0.02]">
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Node_Identity</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono text-center">Hierarchy</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono text-center">Status</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono text-right">Yield_Attrib</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono text-right">Temporal_Stamp</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {graph.map((node) => (
                                <tr key={node.id} className="hover:bg-mesh-emerald/[0.02] transition-colors group">
                                    <td className="px-6 py-4 relative">
                                        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-mesh-emerald opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_10px_#fcba03]" />
                                        <div className="flex items-center gap-4">
                                            <div className="w-8 h-8 rounded-full bg-black/40 border border-white/5 flex items-center justify-center text-[11px] font-bold text-mesh-emerald group-hover:bg-mesh-emerald group-hover:text-black transition-all">
                                                {node.email[0].toUpperCase()}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-white group-hover:text-mesh-emerald transition-colors">{node.email}</span>
                                                <span className="text-[9px] text-slate-600 font-mono tracking-tighter uppercase font-bold">{node.id}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest border ${
                                            node.level === 1 ? 'bg-mesh-emerald/10 border-mesh-emerald/30 text-mesh-emerald' : 'bg-white/5 border-white/10 text-slate-500'
                                        }`}>
                                            Layer {node.level}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className={`w-1.5 h-1.5 rounded-full ${node.status === 'active' ? 'bg-mesh-emerald shadow-[0_0_8px_#fcba03]' : 'bg-slate-700'}`} />
                                            <span className={`text-[10px] uppercase tracking-widest font-bold ${node.status === 'active' ? 'text-white' : 'text-slate-600'}`}>
                                                {node.status}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right font-mono text-sm">
                                        <span className={node.revenue > 0 ? 'text-green-500 font-bold' : 'text-slate-700'}>
                                            ${(node.revenue / 100).toLocaleString(undefined, {minimumFractionDigits: 2})}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="text-[10px] text-slate-600 font-mono uppercase tracking-tighter">
                                            {new Date(node.createdAt).toLocaleDateString()}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {graph.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3 opacity-20">
                                            <ShieldCheck className="w-12 h-12" />
                                            <p className="text-[10px] font-bold uppercase tracking-[0.3em]">No propagation nodes detected in this quadrant.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-6 bg-white/[0.02] border border-white/10 rounded-xl space-y-4">
                        <div className="flex items-center gap-2 text-mesh-emerald">
                            <ShieldCheck className="w-4 h-4" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Ownership Integrity Assurance</span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed font-normal">
                            Every node in your propagation tree is anchored via authoritative protocol ID. Yield attribution is calculated at the moment of compute proving, with instantaneous commission splits enforced by the platform ledger.
                        </p>
                    </div>

                    <div className="p-6 bg-white/[0.02] border border-white/10 rounded-xl flex items-center justify-between">
                        <div className="space-y-1">
                            <span className="text-[10px] text-slate-600 uppercase tracking-[0.25em] font-bold block">Graph Coherence Status</span>
                            <span className="text-sm font-bold text-white uppercase tracking-tight">Canonical Ledger Synced</span>
                        </div>
                        <div className="w-10 h-10 bg-mesh-emerald/20 rounded-full flex items-center justify-center animate-pulse">
                            <Activity className="w-5 h-5 text-mesh-emerald" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
