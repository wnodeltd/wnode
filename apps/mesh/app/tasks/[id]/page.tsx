'use client';

import React, { useState, useEffect } from 'react';
import { Activity, Terminal, ShieldCheck, Download, BarChart3, Clock, Layers, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TaskMonitor({ params }: { params: { id: string } }) {
    const [status, setStatus] = useState('Executing');
    const [progress, setProgress] = useState(42);
    const [logs, setLogs] = useState<string[]>([]);

    useEffect(() => {
        const logSequence = [
            'Init: WASM Sandbox initialized (Wazero v1.0.0)',
            'Load: Manifest verified. Signature 0x8a...f2',
            'Compute: Starting inference workload...',
            'Network: Fetching input shards from IPFS...',
            'Compute: Block #1024 processed. TFLOPS: 1.2',
            'Compute: Block #2048 processed. TFLOPS: 1.4',
            'Integrity: Running intermediate attestation check...',
            'Compute: Block #3072 processed. TFLOPS: 1.3',
        ];

        let index = 0;
        const interval = setInterval(() => {
            if (index < logSequence.length) {
                setLogs(prev => [...prev.slice(-10), logSequence[index]]);
                setProgress(p => Math.min(100, p + 7));
                index++;
            } else {
                setStatus('Completed');
                clearInterval(interval);
            }
        }, 1500);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="p-10 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl font-normal lowercase tracking-tighter text-white">Task Monitoring</h1>
                        <span className="bg-[#00f2ff]/10 text-[#00f2ff] border border-[#00f2ff]/20 px-3 py-1  text-[9px] uppercase tracking-widest font-normal">ID_{params.id}</span>

                    </div>
                    <p className=" text-[10px] text-slate-500 uppercase tracking-[0.2em]">Real-time execution telemetry and log stream</p>
                </div>
                <div className="text-right">
                    <span className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">Status</span>
                    <div className="flex items-center gap-2 justify-end">
                        <div className={`w-2 h-2 rounded-full ${status === 'Completed' ? 'bg-green-500' : 'bg-[#00f2ff] animate-pulse'} shadow-[0_0_10px_rgba(0,242,255,0.5)]`} />
                        <span className=" text-sm text-white uppercase font-normal">{status}</span>

                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Progress & Logs */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Progress Card */}
                    <div className="bg-[#0a0a0b] border border-white/5 p-8 relative overflow-hidden">
                        <div className="flex justify-between items-end mb-6">
                            <div>
                                <span className="text-6xl font-normal text-white tracking-tighter leading-none">{progress}%</span>
                                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-normal mt-2">Payload Completion Status</span>

                            </div>
                            <div className="flex gap-10">
                                <div className="text-right">
                                    <span className="block text-[9px] text-slate-500 uppercase">Elapsed</span>
                                    <span className=" text-xs text-white">00:12:42</span>
                                </div>
                                <div className="text-right">
                                    <span className="block text-[9px] text-slate-500 uppercase">Estimated Remaining</span>
                                    <span className=" text-xs text-[#00f2ff]">00:04:18</span>
                                </div>
                            </div>
                        </div>
                        <div className="h-2 bg-white/5 w-full">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                className="h-full bg-gradient-to-r from-[#00f2ff] to-[#9d00ff] shadow-[0_0_15px_rgba(0,242,255,0.4)]"
                            />
                        </div>
                    </div>

                    {/* Log Terminal */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className=" text-[10px] uppercase font-bold text-slate-500 tracking-widest block flex items-center gap-2">
                                <Terminal className="w-3 h-3" /> Execution Log Stream
                            </label>
                            <span className="text-[9px] text-[#00f2ff] uppercase animate-pulse">Live Sync Active</span>
                        </div>
                        <div className="bg-black/80 border border-white/5 p-6  text-[11px] h-[300px] overflow-y-auto custom-scrollbar space-y-2">
                            {logs.map((log, i) => (
                                <div key={i} className="flex gap-4">
                                    <span className="text-slate-600">[{i + 100}]</span>
                                    <span className={log.includes('Verified') || log.includes('Success') ? 'text-green-500' : 'text-slate-300'}>{log}</span>
                                </div>
                            ))}
                            <div className="animate-pulse h-4 w-1 bg-[#00f2ff]/30" />
                        </div>
                    </div>
                </div>

                {/* Performance & Results SideBar */}
                <div className="space-y-6">
                    {/* Performance Metrics */}
                    <div className="bg-white/5 border border-white/5 p-6 space-y-6">
                        <h4 className=" text-[10px] uppercase font-bold text-slate-500 tracking-wider">Live Performance</h4>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between  text-[10px] mb-2">
                                    <span className="text-slate-500 uppercase">Current TFLOPS</span>
                                    <span className="text-white">1.34</span>
                                </div>
                                <div className="h-1 bg-white/5">
                                    <div className="h-full bg-[#00f2ff] w-3/4" />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between  text-[10px] mb-2">
                                    <span className="text-slate-500 uppercase">Memory Pressure</span>
                                    <span className="text-white">4.2 GB / 16 GB</span>
                                </div>
                                <div className="h-1 bg-white/5">
                                    <div className="h-full bg-[#00f2ff] w-1/4" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Result Card */}
                    <div className={`p-6 border transition-all ${status === 'Completed' ? 'bg-green-500/5 border-green-500/30' : 'bg-white/5 border-white/5 opacity-50'}`}>
                        <div className="flex items-center gap-3 mb-4">
                            <ShieldCheck className={`w-5 h-5 ${status === 'Completed' ? 'text-green-500' : 'text-slate-500'}`} />
                            <h4 className=" text-[10px] uppercase font-bold text-white tracking-widest">Encrypted Result</h4>
                        </div>
                        <p className="text-[10px] text-slate-500 uppercase leading-relaxed mb-6">
                            Outputs are end-to-end encrypted with your public key. Verify the integrity hash before decryption.
                        </p>
                        <button
                            disabled={status !== 'Completed'}
                            className={`w-full py-4 flex items-center justify-center gap-2  text-[10px] uppercase font-black tracking-widest transition-all ${status === 'Completed' ? 'bg-white text-black hover:bg-green-500 hover:text-white shadow-[0_0_20px_rgba(255,255,255,0.2)]' : 'bg-white/5 text-slate-700 pointer-events-none'}`}
                        >
                            <Download className="w-4 h-4" /> Download Result
                        </button>
                    </div>

                    {/* Network Provenance */}
                    <div className="p-6 bg-white/5 border border-white/5">
                        <h4 className=" text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-4">Host Provenance</h4>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                <span className=" text-[10px] text-white uppercase">NODLR_FDR_43</span>
                                <span className=" text-[8px] text-slate-500 ml-auto font-black uppercase tracking-tighter">EU_FRA_1</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                <span className=" text-[10px] text-white uppercase">GCP_COMP_POD_7</span>
                                <span className=" text-[8px] text-slate-500 ml-auto font-black uppercase tracking-tighter">US_EAST_4</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
