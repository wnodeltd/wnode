"use client";

import { useState, useEffect } from "react";
import { Zap, TrendingUp, Cpu, Server, Activity, Plus } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import HealthAnnunciator from "../components/HealthAnnunciator";
import ImpactCard from "../components/ImpactCard";
import OnboardingWizard from "../components/OnboardingWizard";
import AddMachineModal from "../components/AddMachineModal";
import MachineList from "../components/MachineList";
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function DashboardPage() {
    const [isHarvesting, setIsHarvesting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [allocation, setAllocation] = useState({ cpu: 0, gpu: 0, ram: 12 });
    
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'https://api.nodl.one';
    const { data: impactData } = useSWR(`${apiBase}/api/impact`, fetcher, { refreshInterval: 5000 });
    const { data: accountData } = useSWR(`${apiBase}/api/v1/account/me`, fetcher);
    const { data: nodes } = useSWR(`${apiBase}/api/nodes`, (url) => 
        fetch(url, { headers: { 'Authorization': `Bearer ${localStorage.getItem('nodl_jwt')}` } }).then(res => res.json()),
        { refreshInterval: 10000 }
    );
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

    if (accountData && !isPayoutActive) {
        return (
            <div className="min-h-screen bg-black flex flex-col justify-center">
                <OnboardingWizard />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex justify-between items-end border-b border-white/10 pb-6">
                <div>
                    <h2 className="text-3xl font-normal tracking-tight text-white mb-1.5">Grow Your Affiliate Network</h2>
                    <p className="text-16px text-slate-400 font-normal">Your node's health and operational work summary</p>
                </div>

                <div className="w-80">
                    <HealthAnnunciator status="Nominal" connectedNodes={5} uptime="342:12:04" />
                </div>
            </div>


            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">


                {/* Action Panel */}
                <div className="lg:col-span-1 space-y-8">
                    <motion.div
                        animate={isHarvesting ? { borderColor: "rgba(147, 51, 234, 0.4)", boxShadow: "0 0 30px rgba(147, 51, 234, 0.2)" } : { borderColor: "rgba(255, 255, 255, 0.08)" }}
                        className="surface-card p-8 relative overflow-hidden group"
                        style={{ borderStyle: 'solid' }}


                    >
                        <AnimatePresence>
                            {isHarvesting && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(147,51,234,0.1),transparent_70%)] animate-pulse"
                                />
                            )}
                        </AnimatePresence>

                        <div className="relative z-10 flex flex-col items-center text-center space-y-8">
                            <motion.div
                                animate={isHarvesting ? { scale: [1, 1.1, 1] } : {}}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className={`w-16 h-16 flex items-center justify-center border transition-all shadow-xl ${isHarvesting ? 'bg-[#9333ea] border-white text-white' : 'bg-white/5 border-white/20 text-slate-400'}`}
                            >
                                <Zap className="w-8 h-8" />

                            </motion.div>
                            <div>
                                <h3 className="text-xl font-normal uppercase text-white tracking-tight">
                                    {isHarvesting ? 'Working' : 'Ready'}
                                </h3>
                                <p className="text-sm text-slate-400 mt-1 font-normal">
                                    {isHarvesting ? 'Sharing your power' : 'Ready to start'}
                                </p>

                            </div>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={toggleHarvesting}
                                className={`w-full font-normal uppercase py-4 text-lg transition-all shadow-2xl border ${isHarvesting ? 'bg-white text-black border-white' : 'bg-[#9333ea] text-white border-[#9333ea] hover:bg-white hover:text-black hover:border-white'}`}
                            >
                                {isHarvesting ? 'Stop Working' : 'Start Working'}

                            </motion.button>
                        </div>
                    </motion.div>

                    <div className="surface-card p-6 space-y-8">
                        <div>
                            <h4 className="text-[10px] uppercase font-normal text-[#9333ea] tracking-[0.2em] border-b border-[#9333ea]/10 pb-3 mb-6">Infrastructure snapshot</h4>
                            <div className="space-y-6">
                                <div className="flex justify-between items-center text-16px font-normal">
                                    <span className="text-slate-400">Total machines</span>
                                    <span className="text-white">5 Active</span>
                                </div>
                                <div className="flex justify-between items-center text-16px font-normal">
                                    <span className="text-slate-400">Total CPU power</span>
                                    <span className="text-white">112 Cores / 3.4GHz</span>
                                </div>
                                <div className="flex justify-between items-center text-16px font-normal">
                                    <span className="text-slate-400">Total GPU power</span>
                                    <span className="text-white">128GB VRAM (A100/H100)</span>
                                </div>
                                <div className="flex justify-between items-center text-16px font-normal">
                                    <span className="text-slate-400">Total RAM</span>
                                    <span className="text-white">512GB DDR5</span>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-white/5 space-y-6">
                            <h4 className="text-[10px] uppercase font-normal text-cyber-cyan tracking-[0.2em] border-b border-cyber-cyan/10 pb-3 mb-6">Real-time allocation</h4>
                            <div className="space-y-6">
                                <div>
                                    <div className="flex justify-between text-base font-normal mb-2 text-13px">
                                        <span className="text-slate-500 uppercase tracking-widest">Processor</span>
                                        <span className="text-white">{Math.round(allocation.cpu)}%</span>
                                    </div>
                                    <div className="h-1.5 bg-white/5 w-full rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${allocation.cpu}%` }}
                                            className="h-full bg-[#9333ea]"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-base font-normal mb-2 text-13px">
                                        <span className="text-slate-500 uppercase tracking-widest">Graphics</span>
                                        <span className="text-white">{Math.round(allocation.gpu)}%</span>
                                    </div>
                                    <div className="h-1.5 bg-white/5 w-full rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${allocation.gpu}%` }}
                                            className="h-full bg-cyber-cyan"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Charts & Stats */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Earnings Snapshot (3-Tier) */}
                        <div className="surface-card p-8 flex flex-col justify-between space-y-8">
                            <div>
                                <span className="text-[10px] uppercase font-normal text-slate-500 tracking-[0.2em] block mb-6 border-b border-white/5 pb-2">Earnings snapshot</span>
                                <div className="space-y-6">
                                    <div className="flex justify-between items-end">
                                        <span className="text-13px text-slate-400 font-normal">To date</span>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-2xl font-normal text-[#FFD700] tracking-tighter">$482</span>
                                            <span className="text-[#FFD700] text-xs font-normal">.10</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <span className="text-13px text-slate-400 font-normal">This month</span>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-lg font-normal text-white tracking-tighter">$124</span>
                                            <span className="text-slate-400 text-[10px] font-normal">.50</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <span className="text-13px text-slate-400 font-normal">24 hours</span>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-lg font-normal text-white tracking-tighter">$12</span>
                                            <span className="text-slate-400 text-[10px] font-normal">.80</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Affiliate Yield */}
                        <div className="surface-card p-8 flex flex-col justify-between space-y-8">
                            <div>
                                <span className="text-[10px] uppercase font-normal text-[#9333ea] tracking-[0.2em] block mb-6 border-b border-[#9333ea]/10 pb-2">Affiliate yield</span>
                                <div className="space-y-6">
                                    <div className="flex justify-between items-end">
                                        <span className="text-13px text-slate-400 font-normal">Level 1 earnings</span>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-lg font-normal text-white tracking-tighter">$82</span>
                                            <span className="text-slate-400 text-[10px] font-normal">.40</span>
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t border-white/5 flex justify-between items-baseline">
                                        <span className="text-[10px] text-slate-500 uppercase tracking-widest">Total yield</span>
                                        <span className="text-16px font-normal text-white">$124.50</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <ImpactCard 
                            carbonSaved={impact.carbonSavedKg}
                            kmAvoided={impact.equivalentKmDriven}
                            treeDays={impact.treeDays}
                            isActive={isHarvesting}
                        />
                    </div>



                    {/* Machine List */}
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h4 className="text-[10px] uppercase font-normal text-cyber-cyan tracking-[0.2em]">Active Infrastructure</h4>
                            <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsModalOpen(true)}
                                className="flex items-center gap-2 text-[10px] uppercase font-normal text-[#9333ea] border border-[#9333ea]/20 px-3 py-1.5 hover:bg-[#9333ea] hover:text-white transition-all shadow-lg"
                            >
                                <Plus className="w-3 h-3" />
                                Add New Machine
                            </motion.button>
                        </div>
                        <MachineList nodes={nodes || []} />
                    </div>

                    <AddMachineModal 
                        isOpen={isModalOpen} 
                        onClose={() => setIsModalOpen(false)} 
                        apiBase={apiBase} 
                    />
                </div>
            </div>
        </div>
    );
}
