"use client";

import { useState, useEffect } from "react";
import { Zap, TrendingUp, Cpu, Server, Activity, Plus } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import HealthAnnunciator from "../components/HealthAnnunciator";
import ImpactCard from "../components/ImpactCard";
import OnboardingWizard from "../components/OnboardingWizard";
import AddMachineModal from "../components/AddMachineModal";
import MachineList from "../components/MachineList";
import FleetMap from "@shared/components/FleetMap";
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

import { useProviderNodes } from "../hooks/useProviderNodes";

export default function DashboardPage() {
    const [isHarvesting, setIsHarvesting] = useState(false);
    const [allocation, setAllocation] = useState({ cpu: 0, gpu: 0, ram: 12 });
    
    const apiBase = 'http://127.0.0.1:8082';
    const { data: impactData } = useSWR(`${apiBase}/api/impact`, fetcher, { refreshInterval: 10000 });
    const { data: accountData } = useSWR(`${apiBase}/api/v1/account/me`, fetcher);
    
    // Nodes are now handled internally by FleetMap in "provider" mode
    // but we still need the count for the stat bar.
    // To keep it simple and consistent with Copilot's "single source" rule,
    // we can either let FleetMap report back or just do a simple count fetch here.
    // Given the "170 errors" issue, let's keep page.tsx minimal.
    const { nodes, loading: nodesLoading } = useProviderNodes();
    const impact = impactData || { carbonSavedKg: 0, equivalentKmDriven: 0, treeDays: 0 };
    const isPayoutActive = accountData?.payoutStatus === 'active';

    useEffect(() => {
        let interval: any;
        if (isHarvesting) {
            interval = setInterval(() => {
                setAllocation(prev => ({
                    cpu: Math.min(95, prev.cpu + Math.random() * 5),
                    gpu: Math.min(98, prev.gpu + Math.random() * 8),
                    ram: Math.min(64, prev.ram + Math.random() * 2)
                }));
            }, 1000);
        } else {
            interval = setInterval(() => {
                setAllocation(prev => ({
                    cpu: Math.max(0, prev.cpu - 10),
                    gpu: Math.max(0, prev.gpu - 15),
                    ram: Math.max(12, prev.ram - 2)
                }));
            }, 500);
        }
        return () => clearInterval(interval);
    }, [isHarvesting]);

    const toggleHarvesting = () => setIsHarvesting(!isHarvesting);
    
    // Bypass onboarding for owner role
    const isOwner = accountData?.role === 'owner';

    if (accountData && !isPayoutActive && !isOwner) {
        return (
            <div className="min-h-screen bg-black flex flex-col justify-center">
                <OnboardingWizard />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Top Stat Bar */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="surface-card p-4 flex flex-col justify-between">
                    <span className="text-[10px] uppercase text-slate-500 tracking-widest">Total Earnings</span>
                    <span className="text-2xl font-bold text-[#FFD700] tracking-tighter">$482.10</span>
                </div>
                <div className="surface-card p-4 flex flex-col justify-between">
                    <span className="text-[10px] uppercase text-[#9333ea] tracking-widest">Affiliate Yield</span>
                    <span className="text-2xl font-bold text-white tracking-tighter">$124.50</span>
                </div>
                <div className="surface-card p-4 flex flex-col justify-between text-cyber-cyan border border-cyber-cyan/20">
                    <span className="text-[10px] uppercase text-cyber-cyan opacity-70 tracking-widest font-bold">Global Rank</span>
                    <span className="text-2xl font-bold tracking-tighter">#412</span>
                </div>
                <div className="surface-card p-4 flex flex-col justify-between">
                    <span className="text-[10px] uppercase text-slate-500 tracking-widest">Active Nodes</span>
                    <span className="text-2xl font-bold text-cyber-cyan tracking-tighter">{nodes?.length || 0}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Main Content (Left) */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Fleet Map */}
                    <FleetMap 
                        nodes={nodes}
                        loading={nodesLoading}
                        id="nodlr-fleet-map"
                    />

                    {/* Machine List */}
                    <div className="surface-card p-8 space-y-6">
                        <div className="flex justify-between items-center border-b border-white/5 pb-4">
                            <div className="flex items-center gap-3">
                                <Server className="w-4 h-4 text-cyber-cyan" />
                                <h4 className="text-sm uppercase font-bold text-white tracking-widest">Active Infrastructure</h4>
                            </div>
                        </div>
                        <MachineList nodes={nodes || []} />
                    </div>
                </div>

                {/* Sidebar Controls (Right) */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Harvest Control */}
                    <motion.div
                        animate={isHarvesting ? { borderColor: "rgba(147, 51, 234, 0.4)", boxShadow: "0 0 40px rgba(147, 51, 234, 0.15)" } : { borderColor: "rgba(255, 255, 255, 0.05)" }}
                        className="surface-card p-8 flex flex-col items-center text-center space-y-6 relative overflow-hidden group border-2"
                        style={{ borderStyle: 'solid' }}
                    >
                        {isHarvesting && (
                            <div className="absolute inset-0 bg-gradient-to-b from-[#9333ea]/5 to-transparent animate-pulse pointer-events-none" />
                        )}
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center border-2 transition-all ${isHarvesting ? 'bg-[#9333ea] border-white shadow-[0_0_20px_#9333ea]' : 'bg-white/5 border-white/10 text-slate-600'}`}>
                            <Zap className={`w-10 h-10 ${isHarvesting ? 'text-white' : 'text-slate-600'}`} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold uppercase tracking-tighter text-white">
                                {isHarvesting ? 'Systems Active' : 'Standby Mode'}
                            </h3>
                            <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-normal">
                                {isHarvesting ? 'Distributing Compute Cycle' : 'Awaiting mesh assignment'}
                            </p>
                        </div>
                        <button
                            onClick={toggleHarvesting}
                            className={`w-full py-4 rounded-[4px] font-bold uppercase tracking-widest transition-all ${isHarvesting ? 'bg-white text-black hover:bg-slate-200 shadow-xl' : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.4)]'}`}
                        >
                            {isHarvesting ? 'Deactivate Node' : 'Initialize Fleet'}
                        </button>
                    </motion.div>

                    {/* Impact Card */}
                    <ImpactCard 
                        carbonSaved={impact.carbonSavedKg || 0}
                        kmAvoided={impact.equivalentKmDriven || 0}
                        treeDays={impact.treeDays || 0}
                        isActive={isHarvesting}
                    />

                    {/* Infrastructure Snapshot */}
                    <div className="surface-card p-6 space-y-6">
                        <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                            <Activity className="w-3.5 h-3.5 text-[#9333ea]" />
                            <h4 className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Resource Snapshot</h4>
                        </div>
                        <div className="space-y-4">
                            {[
                                { label: 'CPU Cores', value: '112 Cores' },
                                { label: 'VRAM Pool', value: '128GB' },
                                { label: 'System RAM', value: '512GB' },
                                { label: 'Network', value: '10 Gbps' }
                            ].map(stat => (
                                <div key={stat.label} className="flex justify-between items-center">
                                    <span className="text-[11px] text-slate-500 uppercase tracking-tight font-normal">{stat.label}</span>
                                    <span className="text-13px text-white font-mono font-bold">{stat.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Allocation Meters */}
                    <div className="surface-card p-6 space-y-6">
                         <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                            <Cpu className="w-3.5 h-3.5 text-cyber-cyan" />
                            <h4 className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Mesh Allocation</h4>
                        </div>
                        <div className="space-y-6">
                            {[
                                { label: 'Processor', value: allocation.cpu, color: '#9333ea' },
                                { label: 'Graphics', value: allocation.gpu, color: '#22d3ee' }
                            ].map(meter => (
                                <div key={meter.label} className="space-y-2">
                                    <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest">
                                        <span className="text-slate-500 font-normal">{meter.label}</span>
                                        <span className="text-white">{Math.round(meter.value)}%</span>
                                    </div>
                                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div 
                                            animate={{ width: `${meter.value}%` }}
                                            transition={{ type: "spring", stiffness: 50 }}
                                            className="h-full"
                                            style={{ backgroundColor: meter.color, boxShadow: `0 0 10px ${meter.color}` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
