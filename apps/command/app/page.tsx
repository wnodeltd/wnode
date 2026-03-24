"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
    Activity, Shield, Zap, Server, Globe, Terminal, ChevronUp, ChevronDown 
} from "lucide-react";
import Sidebar from "./components/Sidebar";

export default function CommandCentrePage() {
    const [isTelemetryOpen, setIsTelemetryOpen] = useState(false);

    const metrics = [
        { label: 'Active nodes', value: 42, unit: 'Nodes', icon: Server, color: 'text-white', status: 'online', delta: '+2' },
        { label: 'Global load', value: 68, unit: '%', icon: Activity, color: 'text-white', pulse: true },
        { label: 'Network payouts', value: '412.8', unit: 'USD', icon: Zap, color: 'text-white', delta: '+12.4% (24h)' },
        { label: 'System latency', value: '124.2', unit: 'ms', icon: Globe, color: 'text-white', sub: 'Optimized' },
    ];

    const integrity = [
        { name: 'API Server', status: 'Active', light: 'bg-green-500' },
        { name: 'P2P Mesh Node', status: 'Online', light: 'bg-green-500' },
    ];

    return (
        <div className="flex min-h-screen bg-black text-white font-sans overflow-hidden">
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 lg:pl-64 flex flex-col relative h-screen overflow-hidden">
                {/* Identity Header */}
                <header className="h-14 border-b border-white/10 flex items-center justify-between px-8 bg-black shrink-0">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                        <span className="text-[10px] font-normal text-slate-400 tracking-[0.2em] uppercase-none">Network operational</span>
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="text-right flex items-center gap-4">
                            <div className="flex items-center gap-2.5 bg-[#22D3EE] px-3 py-1 rounded-[5px]">
                                <span className="text-black font-normal leading-none tracking-tight uppercase-none">Stephen_Nodlrs</span>
                                <span className="text-[10px] text-black/80 font-normal uppercase-none tracking-widest mt-0.5 whitespace-nowrap">[Owner]</span>
                            </div>
                            <div className="h-8 w-px bg-white/10" />
                            <div className="flex flex-col items-start font-mono text-[#22D3EE]">
                                <span className="text-[14px] font-normal tracking-tighter leading-none uppercase-none">ACC_#4492-X</span>
                                <span className="text-[10px] text-slate-500 font-normal uppercase-none tracking-widest leading-none mt-1">Global Admin</span>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-[26px] overflow-y-auto pb-24 space-y-[26px]">
                    {/* Header Section */}
                    <div className="pb-2">
                        <h2 className="text-[16px] font-normal tracking-tight text-white mb-1 uppercase-none">Command centre</h2>
                        <p className="text-[14px] text-slate-400 font-normal uppercase-none">Real-time infrastructure oversight and node coordination.</p>
                    </div>

                    {/* Row 1: Vitals */}
                    <div className="grid grid-cols-4 gap-4">
                        {metrics.map((m) => (
                            <div key={m.label} className="card-sovereign p-4 flex flex-col justify-between h-32 relative overflow-hidden group hover:border-white/30 transition-all">
                                <div className="flex items-center justify-between z-10">
                                    <span className="text-[12px] font-normal text-slate-400 uppercase-none">{m.label}</span>
                                    {m.label === 'Active nodes' && <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />}
                                    {m.label === 'System latency' && <span className="text-[10px] px-2 py-0.5 bg-[#1E40AF]/20 border border-[#1E40AF]/40 text-[#22D3EE] rounded-full uppercase-none">Optimized</span>}
                                </div>
                                <div className="flex flex-col z-10 mt-1">
                                    <div className="flex items-baseline gap-2">
                                        <span className={`text-2xl font-normal tracking-tighter uppercase-none ${m.pulse ? 'text-[#22D3EE]' : 'text-white'}`}>{m.value}</span>
                                        <span className="text-[11px] font-normal text-slate-500 tracking-wider font-mono uppercase-none">{m.unit}</span>
                                    </div>
                                    {m.label === 'Global load' && (
                                        <div className="mt-3 w-full bg-white/5 h-1 rounded-full overflow-hidden">
                                            <motion.div 
                                                initial={{ width: 0 }} 
                                                animate={{ width: `${m.value}%` }} 
                                                transition={{ duration: 1.5, ease: "easeOut" }}
                                                className="h-full bg-[#22D3EE] shadow-[0_0_8px_rgba(34,211,238,0.5)]" 
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="z-10 mt-1 flex items-center gap-2 min-h-[14px]">
                                    {m.delta && <span className="text-[11px] text-green-400 font-mono tracking-tighter uppercase-none">{m.delta}</span>}
                                </div>
                                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-[#22D3EE]/2 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        ))}
                    </div>

                    {/* Row 2: Protocol */}
                    <div className="card-sovereign p-4 h-[350px] relative overflow-hidden flex flex-col group shadow-sm">
                        <div className="flex items-center gap-3 mb-4 pb-2 border-b border-white/5">
                            <Globe className="w-4 h-4 text-[#22D3EE] opacity-50" />
                            <span className="text-[16px] font-normal text-white uppercase-none">Global distribution protocol</span>
                        </div>
                        <div className="flex-1 flex items-center justify-center bg-black/40 rounded-[3px] border border-white/5 relative">
                             <div className="absolute inset-0 bg-[#1E40AF]/5 rounded-[3px] blur-3xl animate-pulse" />
                             <div className="z-10 flex flex-col items-center gap-5">
                                <div className="relative">
                                    <div className="w-16 h-16 rounded-full border border-[#1E40AF]/20 flex items-center justify-center animate-[spin_10s_linear_infinite]" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                         <div className="w-2 h-2 rounded-full bg-[#22D3EE] shadow-[0_0_15px_#22D3EE]" />
                                    </div>
                                </div>
                                <span className="text-[11px] font-mono font-normal tracking-[0.4em] text-slate-400 animate-pulse uppercase-none">Scanning network...</span>
                             </div>
                        </div>
                    </div>

                    {/* Row 3: Integrity */}
                    <div className="card-sovereign p-8 flex flex-col">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                            <Shield className="w-4 h-4 text-[#22D3EE]" />
                            <span className="text-[16px] font-normal text-white uppercase-none">System integrity</span>
                        </div>
                        <div className="space-y-px">
                            {integrity.map((item) => (
                                <div key={item.name} className="flex items-center justify-between py-2.5 px-3 hover:bg-white/[0.04] transition-colors rounded-[3px] group border-b border-white/5 last:border-0 uppercase-none">
                                    <span className="text-[14px] font-normal text-slate-400 group-hover:text-white transition-colors uppercase-none">{item.name}</span>
                                    <div className="flex items-center gap-5">
                                        <span className="text-[11px] font-mono text-slate-500 tracking-tighter uppercase-none">{item.status}</span>
                                        <div className={`w-1.5 h-1.5 rounded-full ${item.light === 'bg-green-500' ? 'bg-[#22D3EE]' : 'bg-slate-700'}`} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>

                {/* Telemetry Feed */}
                <div className={`fixed bottom-0 right-0 left-64 bg-black border-t border-white/10 z-[60] transition-all duration-300 ${isTelemetryOpen ? 'h-64' : 'h-10'}`}>
                    <button 
                        onClick={() => setIsTelemetryOpen(!isTelemetryOpen)}
                        className="w-full h-10 flex items-center justify-between px-10 hover:bg-white/[0.04] transition-colors group"
                    >
                        <div className="flex items-center gap-3">
                            <Terminal className="w-4 h-4 text-[#22D3EE]" />
                            <span className="text-[12px] font-normal text-slate-400 group-hover:text-white transition-colors uppercase-none">Live telemetry feed</span>
                        </div>
                        {isTelemetryOpen ? <ChevronDown className="w-4 h-4 text-slate-600" /> : <ChevronUp className="w-4 h-4 text-slate-600" />}
                    </button>
                    <div className="p-6 font-mono text-[11px] text-[#22D3EE]/70 overflow-y-auto h-52 space-y-1 bg-black/50">
                        <p className="opacity-50 tracking-tighter uppercase-none">[{new Date().toISOString()}] INITIALIZING CORE MODULES...</p>
                        <p className="tracking-tighter uppercase-none text-slate-500">[OK] SECURITY PROTOCOLS ACTIVE</p>
                        <p className="tracking-tighter text-[#22D3EE] uppercase-none">[NET] DHT REFRESH IN PROGRESS</p>
                        <p className="tracking-tighter uppercase-none text-white/50">[SYS] TELEMETRY PULSE NOMINAL - L: 124.2ms</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
