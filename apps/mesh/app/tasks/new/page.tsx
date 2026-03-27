'use client';

import React, { useState } from 'react';
import { Upload, Terminal, Zap, Shield, Info, Play, BarChart3, Database, Leaf } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TaskComposer() {
    const [sla, setSla] = useState('Standard');
    const [tier, setTier] = useState('Standard');
    const [wasmFile, setWasmFile] = useState<string | null>(null);

    const estimates = {
        cost: tier === 'Boost' ? '$12.42' : tier === 'Standard' ? '$4.18' : '$0.85',
        energy: '1.2 kWh',
        payout: tier === 'Boost' ? '$10.50' : tier === 'Standard' ? '$3.20' : '$0.60',
        co2: tier === 'Boost' ? '3.2 kg' : tier === 'Standard' ? '1.1 kg' : '0.2 kg'
    };

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Header */}
            <div className="border-b border-white/10 pb-4">
                <h1 className="text-3xl font-black lowercase tracking-tighter text-white mb-1">Task Composer</h1>
                <p className=" text-[10px] text-slate-500 uppercase tracking-[0.2em]">Configure and deploy WASM workloads to the mesh</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Configuration Panel */}
                <div className="lg:col-span-2 space-y-6">
                    {/* WASM Upload Area */}
                    <div className="space-y-3">
                        <label className=" text-[10px] uppercase font-bold text-slate-500 tracking-widest block">1. Compute Payload</label>
                        <div className="border border-dashed border-white/10 p-8 text-center group hover:border-mesh-emerald/30 transition-all cursor-pointer bg-white/[0.02] rounded-[6px]">
                            <Upload className="w-6 h-6 text-slate-600 group-hover:text-mesh-emerald mx-auto mb-3 transition-colors" />
                            <p className=" text-xs text-slate-400 uppercase tracking-widest">Drop signed WASM or <span className="text-mesh-emerald underline">Browse</span></p>
                            <p className="text-[9px] text-slate-600 mt-1 uppercase">Max size: 64MB · .wasm / .json manifest</p>
                        </div>
                    </div>

                    {/* Runtime Presets */}
                    <div className="space-y-3">
                        <label className=" text-[10px] uppercase font-bold text-slate-500 tracking-widest block">2. Runtime Preset</label>
                        <div className="grid grid-cols-3 gap-3">
                            {['Tiny', 'Standard', 'Boost'].map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setTier(t)}
                                    className={`p-3 border text-left transition-all rounded-[6px] ${tier === t ? 'bg-mesh-emerald/10 border-mesh-emerald/30' : 'bg-white/5 border-white/5 hover:border-white/20'}`}
                                >
                                    <span className={`block text-[11px] font-bold uppercase mb-1 ${tier === t ? 'text-mesh-emerald' : 'text-slate-400'}`}>{t}</span>
                                    <span className="block text-[9px] text-slate-500 uppercase leading-tight">
                                        {t === 'Tiny' ? '4 Core / 4GB' : t === 'Standard' ? '16 Core / 16GB' : '64 Core / 64GB + WebGPU'}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* SLA Selection */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <label className=" text-[10px] uppercase font-bold text-slate-500 tracking-widest block">3. Service Level Agreement</label>
                            <span className=" text-[10px] text-mesh-emerald uppercase">{sla} PRIORITY</span>
                        </div>
                        <div className="flex gap-3">
                            {['Spot', 'Standard', 'Reserved'].map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setSla(s)}
                                    className={`flex-1 p-3 border transition-all text-center rounded-[6px] ${sla === s ? 'bg-mesh-gold/10 border-mesh-gold/30 shadow-[0_0_15px_rgba(245,158,11,0.1)]' : 'bg-white/5 border-white/5'}`}
                                >
                                    <span className={`block text-[11px] font-bold uppercase ${sla === s ? 'text-mesh-gold' : 'text-slate-500'}`}>{s}</span>
                                </button>
                            ))}
                        </div>
                        <p className="text-[9px] text-slate-500 uppercase flex items-center gap-2">
                            <Info className="w-3 h-3" />
                            {sla === 'Spot' ? 'Lower cost, subject to preemption.' : sla === 'Standard' ? 'Balanced reliability and marketplace pricing.' : 'Guaranteed capacity with SLA protection.'}
                        </p>
                    </div>

                    {/* Manifest Inputs */}
                    <div className="space-y-3">
                        <label className=" text-[10px] uppercase font-bold text-slate-500 tracking-widest block">4. Manifest Inputs (CLI Args / JSON)</label>
                        <textarea
                            className="w-full h-24 bg-black/50 border border-white/5 p-3 rounded-[6px] text-[11px] text-mesh-emerald focus:outline-none focus:border-mesh-emerald/30 font-mono"
                            placeholder='{ "input_ref": "ipfs://...", "args": ["--mode", "inference"] }'
                        />
                    </div>
                </div>

                {/* Estimation & Action SideBar */}
                <div className="space-y-4">
                    <div className="bg-[#0a0a0b] border border-mesh-emerald/20 p-6 space-y-6 relative overflow-hidden rounded-[6px]">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-mesh-emerald/5 blur-3xl rounded-full -mr-16 -mt-16" />

                        <div>
                            <span className=" text-[9px] uppercase font-black text-slate-500 tracking-widest block mb-2">Cost Projection</span>
                            <div className="flex items-end gap-1.5">
                                <span className="text-4xl font-black text-white tracking-tighter leading-none">{estimates.cost}</span>
                                <span className=" text-[10px] text-slate-500 uppercase mb-1">/ESTIMATED TOTAL</span>
                            </div>
                        </div>

                        <div className="space-y-3 pt-6 border-t border-white/5">
                            <div className="flex justify-between items-center text-[10px] uppercase tracking-wider">
                                <span className="text-slate-500 flex items-center gap-2">
                                    <Zap className="w-3 h-3 text-mesh-gold" /> Energy Impact
                                </span>
                                <span className="text-white font-bold">{estimates.energy}</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px] uppercase tracking-wider">
                                <span className="text-slate-500 flex items-center gap-2">
                                    <Database className="w-3 h-3 text-mesh-emerald" /> Host Payout Split
                                </span>
                                <span className="text-mesh-emerald font-bold">{estimates.payout}</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px] uppercase tracking-wider">
                                <span className="text-slate-400 flex items-center gap-2">
                                    <Leaf className="w-3 h-3 text-emerald-500 animate-pulse" /> Green Savings
                                </span>
                                <span className="text-emerald-500 font-bold">{estimates.co2} CO₂</span>
                            </div>
                            <div className="text-[8px] text-slate-600 uppercase text-right -mt-2 mb-2 pr-1">
                                vs 120W cloud avg.
                            </div>
                            <div className="flex justify-between items-center text-[10px] uppercase tracking-wider">
                                <span className="text-slate-500 flex items-center gap-2">
                                    <Shield className="w-3 h-3 text-green-500" /> Manifest Integrity
                                </span>
                                <span className="text-green-500 font-bold">READY</span>
                            </div>
                        </div>

                        <button className="w-full bg-mesh-emerald hover:bg-emerald-400 text-black font-black uppercase tracking-[0.2em] py-4 rounded-[6px] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                            <Play className="w-3.5 h-3.5 fill-current" /> Initialize Task
                        </button>

                        <p className="text-[9px] text-center text-slate-600 uppercase tracking-tighter px-2">
                            By clicking initialize, you consent to secure compute orchestration across the nodl mesh.
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="bg-white/5 border border-white/5 p-4 rounded-[6px]">
                        <div className="flex items-center gap-2 mb-3">
                            <BarChart3 className="w-3.5 h-3.5 text-mesh-emerald" />
                            <span className=" text-[10px] uppercase font-bold text-slate-400">Mesh Health Sync</span>
                        </div>
                        <div className="space-y-1">
                            <div className="flex justify-between text-[11px] ">
                                <span className="text-slate-500">Global Supply</span>
                                <span className="text-white font-medium">842.1 TH/s</span>
                            </div>
                            <div className="flex justify-between text-[11px] ">
                                <span className="text-slate-500">Buyer Demand</span>
                                <span className="text-mesh-emerald font-bold">HIGH (1.2x)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

