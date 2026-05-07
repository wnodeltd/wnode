"use client";

import React, { useState, useEffect } from "react";
import { Users, Activity, Zap, TrendingUp, Shield } from "lucide-react";
import DetailPanel from "../components/DetailPanel";
import MetricCard from "@shared/components/MetricCard";
import IdentityHeader from "@shared/components/IdentityHeader";
import { usePageTitle } from "../components/PageTitleContext";
import { Tree } from "./components/Tree";
import { AffiliateNode } from "./components/TreeNode";

export default function AffiliatesPage() {
    usePageTitle("AFFILIATE NETWORK", "Hierarchical network topology and node distribution audit");
    
    const [summary, setSummary] = useState({
        totalAffiliates: 0,
        activeAffiliates: 0,
        totalNodes: 0,
        growth30d: 0,
    });
    
    const [selectedAffiliate, setSelectedAffiliate] = useState<AffiliateNode | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/affiliates/stats');
            if (res.ok) {
                const data = await res.json();
                setSummary(data);
            }
        } catch (err) {
            console.error("Failed to fetch affiliate metrics:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const handleNodeClick = (node: AffiliateNode) => {
        setSelectedAffiliate(node);
    };

    return (
        <>
            <main className="flex-1 p-8 pt-24 overflow-y-auto pb-24 relative space-y-12 focus:outline-none">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h1 className="text-xl font-bold text-white uppercase tracking-[0.2em] drop-shadow-sm">
                            AFFILIATE NETWORK
                        </h1>
                        <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest">
                            Hierarchical network topology and node distribution audit
                        </p>
                    </div>
                    <IdentityHeader />
                </div>

                {/* Summary Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Total Affiliates', value: summary.totalAffiliates || '0', icon: Users, color: 'text-white' },
                        { label: 'Active Affiliates', value: summary.activeAffiliates || '0', icon: Activity, color: 'text-emerald-400' },
                        { label: 'Total Nodes', value: summary.totalNodes || '0', icon: Zap, color: 'text-[#22D3EE]' },
                        { label: '30-Day Growth', value: `+${(summary.growth30d || 0).toFixed(1)}%`, icon: TrendingUp, color: 'text-purple-400' },
                    ].map((s) => (
                        <MetricCard 
                            key={s.label}
                            label={s.label}
                            value={s.value}
                            icon={s.icon}
                            statusColor={s.color}
                        />
                    ))}
                </div>

                {/* Genesis Layer (10 Founder Slots) */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                        <Shield className="w-4 h-4 text-amber-500" />
                        <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Genesis Layer Configuration</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-2">
                        {Array.from({ length: 10 }).map((_, i) => (
                            <div key={i} className="bg-white/[0.02] border border-white/5 p-3 rounded-[3px] text-center space-y-2 group hover:border-amber-500/30 transition-all">
                                <span className="text-[9px] text-slate-600 font-mono uppercase block">Slot 0{i + 1}</span>
                                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mx-auto shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                                <span className="text-[8px] text-amber-500/40 font-bold uppercase tracking-widest group-hover:text-amber-500 transition-colors">Founder</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Network Topology */}
                <Tree onNodeClick={handleNodeClick} />
            </main>

            {/* Slide-Out Detail Panel */}
            <DetailPanel
                isOpen={!!selectedAffiliate}
                onClose={() => setSelectedAffiliate(null)}
                title={selectedAffiliate?.nodlrId || 'Node Details'}
                subtitle={selectedAffiliate?.isFounder ? `Founder #${selectedAffiliate.founderIndex}` : undefined}
            >
                {selectedAffiliate && (
                    <div className="space-y-6">
                        {/* WUID */}
                        <div className="bg-white/[0.02] border border-white/5 p-4 rounded-[5px] space-y-1">
                            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">WUID</span>
                            <span className="font-mono text-[14px] text-[#22D3EE] block">{selectedAffiliate.nodlrId}</span>
                        </div>

                        {/* SOT-backed fields */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/[0.02] border border-white/5 p-4 rounded-[5px] space-y-1">
                                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Node Count</span>
                                <span className="text-white font-bold text-[14px] block">{selectedAffiliate.nodeCount}</span>
                            </div>
                            <div className="bg-white/[0.02] border border-white/5 p-4 rounded-[5px] space-y-1">
                                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Active</span>
                                <span className={`font-bold text-[14px] block ${selectedAffiliate.active ? 'text-emerald-400' : 'text-slate-600'}`}>
                                    {selectedAffiliate.active ? 'Yes' : 'No'}
                                </span>
                            </div>
                            <div className="bg-white/[0.02] border border-white/5 p-4 rounded-[5px] space-y-1">
                                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">L1 Count</span>
                                <span className="text-blue-400 font-bold text-[14px] block">{selectedAffiliate.l1Count}</span>
                            </div>
                            <div className="bg-white/[0.02] border border-white/5 p-4 rounded-[5px] space-y-1">
                                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">L2 Count</span>
                                <span className="text-purple-400 font-bold text-[14px] block">{selectedAffiliate.l2Count}</span>
                            </div>
                        </div>
                    </div>
                )}
            </DetailPanel>
        </>
    );
}
