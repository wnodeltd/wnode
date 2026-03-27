"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { 
    Search, Plus, X, Shield, Cpu, History, 
    Activity, ArrowRightLeft, Power, Leaf
} from "lucide-react";
import useSWR from 'swr';
import ImpactCard from "../components/ImpactCard";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function ClientsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedClient, setSelectedClient] = useState<null | any>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editData, setEditData] = useState({ name: 'Enterprise Mesh', email: 'ops@enterprise.mesh', standing: 'High-Performance' });

    const { data: pulseData } = useSWR('http://process.env.NEXT_PUBLIC_API_URL || "https://api.nodl.one"/api/system/pulse', fetcher, { refreshInterval: 5000 });
    const { data: peersData } = useSWR('http://process.env.NEXT_PUBLIC_API_URL || "https://api.nodl.one"/peers', fetcher, { refreshInterval: 5000 });
    const { data: globalImpact } = useSWR('http://process.env.NEXT_PUBLIC_API_URL || "https://api.nodl.one"/api/impact', fetcher, { refreshInterval: 5000 });

    const [activeTab, setActiveTab] = useState("all");

    const [sortBy, setSortBy] = useState("id");

    const livePeers = peersData || [];
    const pulse = pulseData || {};

    const clients = livePeers.map((p: any) => {
        const session = pulse[p.dna] || {}; // We use DNA as the key in registry
        const health = session.health || { score: 1.0, latency: 0 };
        
        return {
            id: p.id,
            dna: p.dna,
            latency: `${(health.latency / 1e6).toFixed(1)}ms`,
            score: health.score,
            integrity: session.integrityScore ?? 1.0,
            status: session.status || 'Active',
            co2: ((session.totalUptime || 0) / 3.6e12 * (0.120 - 0.012) * 0.3).toFixed(2),
        };
    }).filter((c: any) => {
        if (activeTab === "integrity") return c.status !== 'Active';
        if (searchQuery) return c.id.toLowerCase().includes(searchQuery.toLowerCase()) || c.dna.toLowerCase().includes(searchQuery.toLowerCase());
        return true;
    }).sort((a: any, b: any) => {
        if (sortBy === "health") return b.score - a.score;
        return a.id.localeCompare(b.id);
    });

    const activeTasks = [
        { id: 'TSK-990', purpose: 'LLM Fine-tuning', nodes: 8, status: 'Running' },
        { id: 'TSK-102', purpose: '3D Render Node', nodes: 4, status: 'Running' },
        { id: 'TSK-441', purpose: 'Hash Verification', nodes: 12, status: 'Paused' },
    ];

    return (
        <div className="flex min-h-screen bg-black text-white font-sans overflow-hidden">
            <Sidebar />
            <div className="flex-1 lg:pl-64 flex flex-col relative h-screen overflow-hidden">
                <header className="h-14 border-b border-white/25 flex items-center justify-between px-8 bg-black shrink-0">
                    <span className="text-[12px] font-normal text-slate-400 tracking-[0.2em] uppercase-none">Client Management</span>
                    <div className="flex items-center gap-2.5 bg-[#22D3EE] px-3 py-1 rounded-[5px]">
                        <span className="text-[14px] text-black font-normal uppercase-none">Stephen_Nodlrs [Owner]</span>
                    </div>
                </header>

                <main className="flex-1 p-10 overflow-y-auto pb-24 space-y-10">
                    <div className="pb-2 flex justify-between items-end">
                        <div>
                            <h2 className="text-[16px] font-normal tracking-tight text-white mb-1 uppercase-none">Client registry</h2>
                            <p className="text-[14px] text-slate-400 font-normal uppercase-none">Monitor enterprise and retail compute consumption.</p>
                        </div>
                        <div className="flex bg-white/5 p-1 rounded-[5px]">
                            <button 
                                onClick={() => setActiveTab("all")}
                                className={`px-6 py-1.5 rounded-[4px] text-[12px] transition-all ${activeTab === "all" ? "bg-white/10 text-white" : "text-slate-500 hover:text-white"}`}
                            >
                                All Accounts
                            </button>
                            <button 
                                onClick={() => setActiveTab("integrity")}
                                className={`px-6 py-1.5 rounded-[4px] text-[12px] transition-all ${activeTab === "integrity" ? "bg-[#EF4444]/10 text-[#EF4444]" : "text-slate-500 hover:text-white"}`}
                            >
                                Integrity Flags
                                {clients.filter((c: any) => c.status !== 'Active').length > 0 && 
                                    <span className="ml-2 bg-[#EF4444] text-white text-[9px] px-1.5 py-0.5 rounded-full">
                                        {clients.filter((c: any) => c.status !== 'Active').length}
                                    </span>
                                }
                            </button>
                        </div>
                    </div>

                    <div className="card-sovereign p-6 flex items-center gap-6">
                        <div className="flex-1 relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-[#22D3EE] transition-colors" />
                            <input 
                                type="text" 
                                placeholder="Search by Client ID or Task..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-[5px] pl-12 pr-4 py-3 text-[14px] focus:outline-none focus:border-[#22D3EE]/50 transition-all placeholder:text-slate-700 font-normal"
                            />
                        </div>
                        <div className="flex items-center gap-4 shrink-0">
                            <span className="text-[12px] text-slate-500 uppercase-none">Sort by:</span>
                            <div className="flex bg-white/5 p-1 rounded-[5px]">
                                <button 
                                    onClick={() => setSortBy("id")}
                                    className={`px-4 py-1.5 rounded-[4px] text-[12px] transition-all ${sortBy === "id" ? "bg-[#22D3EE] text-black" : "text-slate-400 hover:text-white"}`}
                                >
                                    Default
                                </button>
                                <button 
                                    onClick={() => setSortBy("health")}
                                    className={`px-4 py-1.5 rounded-[4px] text-[12px] transition-all ${sortBy === "health" ? "bg-[#22D3EE] text-black" : "text-slate-400 hover:text-white"}`}
                                >
                                    Top Earners
                                </button>
                            </div>
                            <button className="bg-[#22D3EE] hover:bg-[#22D3EE]/80 text-black px-6 py-3 rounded-[5px] text-[14px] flex items-center gap-2 font-normal transition-all">
                                <Plus className="w-4 h-4" /> Add Client
                            </button>
                        </div>
                    </div>

                    <div className="card-sovereign overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-white/[0.04] text-[12px] text-slate-400 uppercase-none border-b border-white/10">
                                <tr>
                                    <th className="px-6 py-5 font-normal text-slate-400">Peer ID</th>
                                    <th className="px-6 py-5 font-normal text-slate-400">Hardware DNA</th>
                                    <th className="px-6 py-5 font-normal text-slate-400">Latency</th>
                                    <th className="px-6 py-5 font-normal text-slate-400">Node Health</th>
                                    <th className="px-6 py-5 font-normal text-slate-400">Integrity</th>
                                    <th className="px-6 py-5 font-normal text-slate-400">CO₂ Saved (kg)</th>
                                    <th className="px-6 py-5 font-normal text-slate-400 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="text-[14px] text-slate-300 divide-y divide-white/5">
                                {clients.map((row: any) => (
                                    <tr 
                                        key={row.id} 
                                        onClick={() => setSelectedClient(row)}
                                        className="hover:bg-white/[0.02] cursor-pointer group transition-colors"
                                    >
                                        <td className="px-6 py-4 font-mono text-[11px] text-[#22D3EE] group-hover:text-white transition-colors">{row.id}</td>
                                        <td className="px-6 py-4 font-mono text-[11px] text-slate-400 truncate max-w-[150px]">{row.dna}</td>
                                        <td className="px-6 py-4 font-mono text-[11px] text-slate-500">{row.latency}</td>
                                        <td className="px-6 py-4">
                                            <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full transition-all duration-500 ${row.score < 0.3 ? 'bg-[#EF4444]' : 'bg-[#22D3EE]'}`}
                                                    style={{ width: `${row.score * 100}%` }}
                                                />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-[12px] font-mono text-[#22D3EE]">
                                                {(row.integrity * 100).toFixed(0)}%
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-[11px] text-emerald-500">{row.co2}</td>
                                        <td className={`px-6 py-4 text-right font-normal ${row.status !== 'Active' ? 'text-[#EF4444]' : 'text-[#22D3EE]'}`}>{row.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </main>

                <div className={`fixed inset-y-0 right-0 w-[500px] bg-black border-l border-white/25 z-[100] transition-transform duration-500 shadow-2xl ${selectedClient ? 'translate-x-0' : 'translate-x-full'}`}>
                    {selectedClient && (
                        <div className="flex flex-col h-full overflow-hidden">
                            <header className="p-8 border-b border-white/10 flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-slate-500 uppercase-none mb-1">Client master drawer</span>
                                    <div className="flex items-baseline gap-3">
                                        <h3 className="text-[20px] text-white font-normal uppercase-none">{selectedClient.id}</h3>
                                        <span className="text-[12px] text-[#22D3EE] font-mono">{(selectedClient.integrity * 100).toFixed(0)}% Integrity</span>
                                    </div>
                                </div>
                                <button onClick={() => { setSelectedClient(null); setIsEditMode(false); }} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                                    <X className="w-6 h-6 text-slate-500 hover:text-white" />
                                </button>
                            </header>

                            <div className="flex-1 overflow-y-auto p-8 space-y-10 pb-32">
                                <section className="space-y-6">
                                    <div className="flex items-center gap-2 text-[14px] text-white">
                                        <Shield className="w-4 h-4 text-[#22D3EE]" />
                                        <span>Company profile</span>
                                    </div>
                                    <div className="card-sovereign p-6 space-y-4">
                                        <div className="flex justify-between items-center text-[15px]">
                                            <span className="text-slate-400">Legal name</span>
                                            {isEditMode ? (
                                                <input value={editData.name} onChange={(e) => setEditData({...editData, name: e.target.value})} className="bg-black border border-white/10 rounded-[5px] px-3 py-1 text-white text-[14px] text-right w-48 focus:outline-none focus:border-[#22D3EE]/50" />
                                            ) : (
                                                <span className="text-white">{editData.name}</span>
                                            )}
                                        </div>
                                        <div className="flex justify-between items-center text-[15px]">
                                            <span className="text-slate-400">Operations email</span>
                                            {isEditMode ? (
                                                <input value={editData.email} onChange={(e) => setEditData({...editData, email: e.target.value})} className="bg-black border border-white/10 rounded-[5px] px-3 py-1 text-white text-[14px] text-right w-48 focus:outline-none focus:border-[#22D3EE]/50" />
                                            ) : (
                                                <span className="text-white">{editData.email}</span>
                                            )}
                                        </div>
                                        <div className="flex justify-between items-center text-[15px]">
                                            <span className="text-slate-400">Account standing</span>
                                            {isEditMode ? (
                                                <select value={editData.standing} onChange={(e) => setEditData({...editData, standing: e.target.value})} className="bg-black border border-white/10 rounded-[5px] px-3 py-1 text-[#22D3EE] text-[14px] focus:outline-none focus:border-[#22D3EE]/50">
                                                    <option>Active</option>
                                                    <option>Restricted</option>
                                                    <option>High-Performance</option>
                                                </select>
                                            ) : (
                                                <span className="text-[#22D3EE]">{editData.standing}</span>
                                            )}
                                        </div>
                                    </div>
                                </section>

                                <section className="space-y-6">
                                    <div className="flex items-center gap-2 text-[14px] text-white">
                                        <Cpu className="w-4 h-4 text-[#22D3EE]" />
                                        <span>Active compute tasks</span>
                                    </div>
                                    <div className="space-y-3">
                                        {activeTasks.map(task => (
                                            <div key={task.id} className="p-6 bg-white/[0.04] border border-white/10 rounded-[5px] flex items-center justify-between transition-colors hover:bg-white/[0.06]">
                                                <div className="flex flex-col">
                                                    <span className="text-[14px] text-white">{task.purpose}</span>
                                                    <span className="text-[12px] text-slate-500">ID: {task.id} • Clusters: <span className="text-white">{task.nodes}</span></span>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <button onClick={() => alert('Target Client ID for contract relocation')} className="p-2 bg-[#22D3EE]/10 text-[#22D3EE] rounded-[5px] hover:bg-[#22D3EE]/20 transition-colors">
                                                        <ArrowRightLeft className="w-4 h-4" />
                                                    </button>
                                                    <span className={`text-[11px] font-mono tracking-wider ${task.status === 'Running' ? 'text-[#22D3EE]' : 'text-slate-600'}`}>{task.status}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                <section className="space-y-6">
                                    <div className="flex items-center gap-2 text-[14px] text-white">
                                        <Leaf className="w-4 h-4 text-emerald-500" />
                                        <span>Environmental contribution</span>
                                    </div>
                                    <ImpactCard 
                                        carbonSaved={parseFloat(selectedClient.co2)}
                                        kmAvoided={parseFloat(selectedClient.co2) * 5.7}
                                        treeDays={parseFloat(selectedClient.co2) / 0.06}
                                        isActive={selectedClient.status === 'Active'}
                                    />
                                </section>

                                <section className="space-y-6">
                                    <div className="flex items-center gap-2 text-[14px] text-white">
                                        <History className="w-4 h-4 text-[#22D3EE]" />
                                        <span>Purchase history</span>
                                    </div>
                                    <div className="card-sovereign p-6 space-y-4">
                                        {[
                                            { date: '2025.03.20', amount: '$1,200.00', units: '1.2M TH/s' },
                                            { date: '2025.03.12', amount: '$450.00', units: '450K TH/s' },
                                        ].map((buy, i) => (
                                            <div key={i} className="flex justify-between items-center text-[13px] border-b border-white/5 last:border-0 pb-3">
                                                <div className="flex flex-col">
                                                    <span className="text-white font-normal">{buy.amount}</span>
                                                    <span className="text-slate-600 font-normal">{buy.units}</span>
                                                </div>
                                                <span className="text-slate-600 font-mono text-[11px]">{buy.date}</span>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>

                            <footer className="p-8 border-t border-white/25 bg-black absolute bottom-0 w-full space-y-4">
                                {selectedClient.status !== 'Active' && (
                                    <button 
                                        onClick={async () => {
                                            await fetch('http://process.env.NEXT_PUBLIC_API_URL || "https://api.nodl.one"/registry/release', {
                                                method: 'POST',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({ hardwareDNA: selectedClient.dna })
                                            });
                                            alert('Account Restored to Active Status');
                                            setSelectedClient(null);
                                        }}
                                        className="w-full py-4 bg-[#22D3EE] text-black rounded-[5px] text-[14px] font-bold shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:brightness-110 transition-all mb-4"
                                    >
                                        Review & Release Account
                                    </button>
                                )}
                                {isEditMode ? (
                                    <div className="flex gap-4">
                                        <button onClick={() => setIsEditMode(false)} className="flex-1 py-4 bg-white/5 border border-white/10 rounded-[5px] text-[14px] text-slate-500 hover:bg-white/10 transition-colors">Cancel</button>
                                        <button onClick={() => setIsEditMode(false)} className="flex-1 py-4 bg-[#22D3EE] rounded-[5px] text-[14px] text-black font-normal shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:bg-[#22D3EE]/80 transition-colors">Save Changes</button>
                                    </div>
                                ) : (
                                    <button onClick={() => setIsEditMode(true)} className="w-full py-4 border border-white/25 rounded-[5px] text-[14px] text-slate-400 hover:bg-white/5 transition-colors">Edit profile</button>
                                )}
                            </footer>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
