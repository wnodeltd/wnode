'use client';

import React, { useState, useEffect } from 'react';
import { Users, Code, TrendingUp, Wallet, ArrowUpRight, ShieldCheck, ChevronRight, Info, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AffiliatePage() {
    const affiliateCode = "100001-0426-01-AA";
    const [l1Referrals, setL1Referrals] = useState([
        { id: '1', affiliate: '100421-0426-01-AA', status: 'ACTIVE', revenue: 12.42 },
        { id: '2', affiliate: '100085-0426-01-AA', status: 'ACTIVE', revenue: 8.15 },
        { id: '3', affiliate: '100204-0426-01-AA', status: 'PENDING', revenue: 0.00 },
    ]);
    const [l2Referrals, setL2Referrals] = useState([
        { id: '4', affiliate: '100931-0426-01-AA', status: 'ACTIVE', revenue: 42.12 },
        { id: '5', affiliate: '100772-0426-01-AA', status: 'ACTIVE', revenue: 15.80 },
    ]);
    const [selectedAffiliate, setSelectedAffiliate] = useState<any>(null);
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        const url = `wnode.one/invite/${affiliateCode}`;
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };


    const totalRevenue = (l1Referrals.reduce((acc, r) => acc + r.revenue, 0) * 0.02) + 
                         (l2Referrals.reduce((acc, r) => acc + r.revenue, 0) * 0.06);



    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Header */}
            <div className="flex justify-between items-end border-b border-white/10 pb-6">
                <div>
                    <h1 className="text-3xl font-normal tracking-tight text-white mb-1.5">Invite & earn</h1>
                    <p className="text-16px text-slate-400 font-normal">Grow your Affiliate network to increase revenue</p>
                </div>

                <div className="bg-[#9333ea]/10 border border-[#9333ea]/30 p-4.5 flex items-center gap-6 rounded-[5px]">
                    <div className="text-right">
                        <span className="block text-[10px] text-slate-500 uppercase font-normal mb-0.5 tracking-[0.2em]">Your invite code</span>
                        <span className="block text-2xl font-normal text-white tracking-tight">{affiliateCode}</span>
                    </div>
                    <button className="bg-[#9333ea] hover:bg-[#a855f7] text-white p-3 rounded-[5px] transition-all shadow-md active:scale-95">

                        <Code className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Metrics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="surface-card p-6 space-y-2.5 transition-all">
                    <div className="flex justify-between items-start">
                        <span className="text-small font-normal text-slate-500 uppercase tracking-[0.2em]">My earnings</span>
                        <TrendingUp className="w-3.5 h-3.5 text-cyber-purple opacity-50" />
                    </div>
                    <span className="text-3xl font-normal text-white tracking-tighter">${totalRevenue.toFixed(2)}</span>
                    <p className="text-[10px] text-slate-500 font-normal uppercase tracking-widest">Settled daily</p>
                </div>

                <div className="surface-card p-6 space-y-2.5 transition-all">
                    <div className="flex justify-between items-start">
                        <span className="text-small font-normal text-slate-500 uppercase tracking-[0.2em]">Direct affiliates</span>
                        <Users className="w-3.5 h-3.5 text-cyber-cyan opacity-50" />
                    </div>
                    <span className="text-3xl font-normal text-white tracking-tighter">{l1Referrals.length}</span>
                    <p className="text-[10px] text-slate-500 font-normal uppercase tracking-widest">2% Direct override</p>
                </div>

                <div className="surface-card p-6 space-y-2.5 transition-all">
                    <div className="flex justify-between items-start">
                        <span className="text-small font-normal text-slate-500 uppercase tracking-[0.2em]">Level 2 affiliates</span>
                        <ShieldCheck className="w-3.5 h-3.5 text-[#10b981] opacity-50" />
                    </div>
                    <span className="text-3xl font-normal text-[#10b981] tracking-tighter">{l2Referrals.length}</span>
                    <p className="text-[10px] text-slate-500 font-normal uppercase tracking-widest">Secondary network</p>
                </div>


            </div>

            <div className="grid grid-cols-1 gap-8">
                {/* Referrals Table */}
                <div className="space-y-4">
                    <div className="surface-card overflow-hidden">
                        <div className="bg-white/[0.02] p-4.5 border-b border-white/10">
                            <h3 className="text-base font-normal text-white tracking-tight">Direct affiliate network</h3>
                        </div>

                        <div className="bg-white/[0.02] px-8 py-5 grid grid-cols-4 items-center border-b border-white/10 gap-4">
                            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Affiliate</span>
                            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Status</span>
                            <span className="text-[11px] text-cyber-cyan uppercase font-black tracking-[0.2em]">Level 1</span>
                            <div className="text-right">
                                <span className="text-[11px] text-[#22D3EE] uppercase font-black tracking-[0.2em]">Level 2</span>
                            </div>
                        </div>

                        <div className="divide-y divide-white/5">
                            {l1Referrals.map(ref => (
                                <div 
                                    key={ref.id} 
                                    onClick={() => setSelectedAffiliate(ref)}
                                    className="grid grid-cols-4 px-8 py-6 items-center hover:bg-white/[0.04] cursor-pointer transition-all text-16px active:bg-white/[0.06] gap-4"
                                >
                                    <span className="font-normal text-white uppercase tracking-tighter font-mono">{ref.affiliate}</span>
                                    <div className="flex items-center gap-1.5">
                                        <div className={`w-1.5 h-1.5 rounded-full ${ref.status === 'ACTIVE' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                                        <span className="text-13px text-slate-400 font-normal uppercase">{ref.status}</span>
                                    </div>
                                    <span className="font-normal text-white">${ref.revenue.toFixed(2)}</span>
                                    <div className="text-right">
                                        <span className="text-small text-cyber-cyan font-normal">+$ {(ref.revenue * 0.02).toFixed(2)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div 
                        onClick={handleCopy}
                        className="surface-card p-4.5 flex items-center justify-between group cursor-pointer hover:border-cyber-cyan/30 transition-all max-w-lg relative"
                    >
                         <div className="flex-1 overflow-hidden">
                            <span className="text-[10px] text-slate-500 uppercase font-normal block mb-0.5">Invite link</span>
                            <span className="text-sm text-white font-normal truncate tracking-tight">wnode.one/invite/{affiliateCode}</span>
                        </div>
                        <div className="flex items-center gap-3 ml-4">
                            {copied && (
                                <span className="text-[10px] text-cyber-cyan uppercase font-bold tracking-widest animate-in fade-in slide-in-from-right-2">Copied!</span>
                            )}
                            {copied ? (
                                <Check className="w-4 h-4 text-cyber-cyan" />
                            ) : (
                                <Copy className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
                            )}
                        </div>
                    </div>


                </div>
            </div>

            {/* Side Drawer */}
            <AnimatePresence>
                {selectedAffiliate && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedAffiliate(null)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                        />
                        <motion.div 
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed right-0 top-0 bottom-0 w-[400px] bg-[#0a0a0a] border-l border-white/10 z-50 p-8 shadow-2xl flex flex-col"
                        >
                            <div className="flex justify-between items-center mb-12 pb-6 border-b border-white/5">
                                <div>
                                    <h4 className="text-sm uppercase font-bold text-cyber-cyan tracking-widest mb-1.5">Affiliate Detail</h4>
                                    <h2 className="text-2xl font-bold text-white tracking-tight font-mono">{selectedAffiliate.affiliate}</h2>
                                </div>
                                <button 
                                    onClick={() => setSelectedAffiliate(null)}
                                    className="p-2.5 hover:bg-white/5 rounded-[4px] transition-colors"
                                >
                                    <ChevronRight className="w-5 h-5 text-slate-400" />
                                </button>
                            </div>

                            <div className="space-y-10">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="surface-card p-5 space-y-2">
                                        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Nodes Active</span>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-2xl font-bold text-white">12</span>
                                            <span className="text-[10px] text-green-500 font-bold uppercase">Healthy</span>
                                        </div>
                                    </div>
                                    <div className="surface-card p-5 space-y-2">
                                        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Uptime</span>
                                        <div className="text-2xl font-bold text-white">99.8%</div>
                                    </div>
                                </div>

                                <div className="surface-card p-8 space-y-6">
                                    <div className="flex items-center gap-3 pb-4 border-b border-white/5">
                                        <TrendingUp className="w-4 h-4 text-cyber-purple" />
                                        <span className="text-sm font-bold text-white uppercase tracking-tight">Financial Contribution</span>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-end">
                                            <span className="text-[12px] text-slate-400 font-medium">Total Volume</span>
                                            <span className="text-lg font-bold text-white">${selectedAffiliate.revenue.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between items-end">
                                            <span className="text-[12px] text-cyber-cyan font-bold uppercase tracking-wider">Your 2% Cut</span>
                                            <span className="text-2xl font-bold text-cyber-cyan tracking-tight">${(selectedAffiliate.revenue * 0.02).toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-10">
                                    <button className="w-full bg-white text-black font-bold uppercase py-4 rounded-[4px] text-xs tracking-widest hover:bg-cyber-cyan transition-colors active:scale-95 shadow-lg">
                                        Message Affiliate
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>

    );
}
