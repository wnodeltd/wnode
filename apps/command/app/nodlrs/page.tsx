"use client";

import { useState } from "react";
import { 
    Search, Plus, Shield, Cpu, Network, History, ArrowRightLeft, 
    X, Power, ChevronRight, Activity 
} from "lucide-react";
import Sidebar from "../components/Sidebar";

export default function NodlrsCRM() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedNodlr, setSelectedNodlr] = useState<null | any>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editData, setEditData] = useState({ name: 'Stephen Nodlr', email: 'stephen@nodl.one', standing: 'Active' });

    const nodlrs = [
        { id: 'NODL_4492_X', status: 'Online', nodes: 8, affiliates: 124, payouts: '$12,400', value: '$42,500' },
        { id: 'NODL_1102_Y', status: 'Online', nodes: 3, affiliates: 42, payouts: '$4,500', value: '$12,800' },
        { id: 'NODL_5561_Z', status: 'Warning', nodes: 12, affiliates: 210, payouts: '$38,000', value: '$98,000' },
        { id: 'NODL_9002_A', status: 'Offline', nodes: 0, affiliates: 2, payouts: '$54', value: '$150' },
    ];

    const hardwareFleet = [
        { id: 'SRV-01', hardware: 'RTX 4090 x 2', load: '68%', temp: '42°C', status: 'online' },
        { id: 'SRV-02', hardware: 'A100 x 1', load: '92%', temp: '54°C', status: 'online' },
        { id: 'SRV-03', hardware: 'RTX 3080 x 4', load: '0%', temp: '28°C', status: 'suspend' },
    ];

    return (
        <div className="flex min-h-screen bg-black text-white font-sans overflow-hidden">
            <Sidebar />

            <div className="flex-1 lg:pl-64 flex flex-col relative h-screen overflow-hidden">
                <header className="h-14 border-b border-white/25 flex items-center justify-between px-8 bg-black shrink-0">
                    <span className="text-[12px] font-normal text-slate-400 tracking-[0.2em] uppercase-none">Nodl'r CRM Operations</span>
                    <div className="flex items-center gap-2.5 bg-[#22D3EE] px-3 py-1 rounded-[5px]">
                        <span className="text-[14px] text-black font-normal uppercase-none">Stephen_Nodlrs [Owner]</span>
                    </div>
                </header>

                <main className="flex-1 p-10 overflow-y-auto pb-24 space-y-10">
                    <div className="pb-2">
                        <h2 className="text-[16px] font-normal tracking-tight text-white mb-1 uppercase-none">Nodl'rs registry</h2>
                        <p className="text-[14px] text-slate-400 font-normal uppercase-none">Manage provider assets and global affiliate networks.</p>
                    </div>

                    <div className="card-sovereign p-6 flex items-center gap-6">
                        <div className="flex-1 relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-[#22D3EE] transition-colors" />
                            <input 
                                type="text" 
                                placeholder="Search by ID, Hardware, or Account..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-[5px] pl-12 pr-4 py-3 text-[14px] text-white focus:outline-none focus:border-[#22D3EE]/50 transition-all placeholder:text-slate-700"
                            />
                        </div>
                        <button className="bg-[#22D3EE] hover:bg-[#22D3EE]/80 text-black px-8 py-3 rounded-[5px] flex items-center gap-2 text-[14px] transition-all font-normal">
                            <Plus className="w-4 h-4" />
                            Add Nodl'r
                        </button>
                    </div>

                    <div className="card-sovereign overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-white/[0.04] text-[12px] text-slate-400 uppercase-none border-b border-white/10">
                                <tr>
                                    <th className="px-6 py-5 font-normal">Nodl'r ID</th>
                                    <th className="px-6 py-5 font-normal">Status</th>
                                    <th className="px-6 py-5 font-normal text-right">Nodes active</th>
                                    <th className="px-6 py-5 font-normal text-right">Affiliate count</th>
                                    <th className="px-6 py-5 font-normal text-right">Total payouts</th>
                                    <th className="px-6 py-5 font-normal text-right">Portfolio value</th>
                                </tr>
                            </thead>
                            <tbody className="text-[14px] text-slate-300 divide-y divide-white/5">
                                {nodlrs.map((row) => (
                                    <tr 
                                        key={row.id} 
                                        onClick={() => setSelectedNodlr(row)}
                                        className="hover:bg-white/[0.02] cursor-pointer group transition-colors"
                                    >
                                        <td className="px-6 py-4 font-mono text-[11px] text-[#22D3EE] group-hover:text-white transition-colors">{row.id}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-1.5 h-1.5 rounded-full ${
                                                    row.status === 'Online' ? 'bg-[#22D3EE] shadow-[0_0_8px_rgba(34,211,238,0.5)]' : 
                                                    row.status === 'Warning' ? 'bg-yellow-500' : 'bg-slate-700'
                                                }`} />
                                                <span className="text-[13px]">{row.status}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right text-white ">{row.nodes}</td>
                                        <td className="px-6 py-4 text-right text-slate-500">{row.affiliates}</td>
                                        <td className="px-6 py-4 text-right text-white font-mono text-[11px]">{row.payouts}</td>
                                        <td className="px-6 py-4 text-right text-[#22D3EE]">{row.value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </main>

                <div className={`fixed inset-y-0 right-0 w-[500px] bg-black border-l border-white/25 z-[100] transition-transform duration-500 shadow-2xl ${selectedNodlr ? 'translate-x-0' : 'translate-x-full'}`}>
                    {selectedNodlr && (
                        <div className="flex flex-col h-full overflow-hidden">
                            <header className="p-8 border-b border-white/10 flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-slate-500 uppercase-none tracking-widest mb-1">Asset master drawer</span>
                                    <h3 className="text-[20px] text-white font-normal uppercase-none">{selectedNodlr.id}</h3>
                                </div>
                                <button onClick={() => { setSelectedNodlr(null); setIsEditMode(false); }} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                                    <X className="w-6 h-6 text-slate-500 hover:text-white" />
                                </button>
                            </header>

                            <div className="flex-1 overflow-y-auto p-8 space-y-10">
                                <section className="space-y-6">
                                    <div className="flex items-center gap-2 text-[14px] text-white">
                                        <Shield className="w-4 h-4 text-[#22D3EE]" />
                                        <span>Person profile</span>
                                    </div>
                                    <div className="card-sovereign p-6 space-y-4">
                                        <div className="flex justify-between items-center text-[15px]">
                                            <span className="text-slate-400">Full name</span>
                                            {isEditMode ? (
                                                <input 
                                                    value={editData.name} 
                                                    onChange={(e) => setEditData({...editData, name: e.target.value})}
                                                    className="bg-black border border-white/10 rounded-[5px] px-3 py-1 text-white text-[14px] focus:outline-none focus:border-[#22D3EE]/50 w-48 text-right"
                                                />
                                            ) : (
                                                <span className="text-white">{editData.name}</span>
                                            )}
                                        </div>
                                        <div className="flex justify-between items-center text-[15px]">
                                            <span className="text-slate-400">Primary email</span>
                                            {isEditMode ? (
                                                <input 
                                                    value={editData.email} 
                                                    onChange={(e) => setEditData({...editData, email: e.target.value})}
                                                    className="bg-black border border-white/10 rounded-[5px] px-3 py-1 text-white text-[14px] focus:outline-none focus:border-[#22D3EE]/50 w-48 text-right"
                                                />
                                            ) : (
                                                <span className="text-white">{editData.email}</span>
                                            )}
                                        </div>
                                        <div className="flex justify-between items-center text-[15px]">
                                            <span className="text-slate-400">Account standing</span>
                                            {isEditMode ? (
                                                <select 
                                                    value={editData.standing} 
                                                    onChange={(e) => setEditData({...editData, standing: e.target.value})}
                                                    className="bg-black border border-white/10 rounded-[5px] px-3 py-1 text-[#22D3EE] text-[14px] focus:outline-none focus:border-[#22D3EE]/50"
                                                >
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
                                        <span>Hardware fleet</span>
                                    </div>
                                    <div className="space-y-3">
                                        {hardwareFleet.map(hw => (
                                            <div key={hw.id} className="p-6 bg-white/[0.04] border border-white/10 rounded-[5px] flex items-center justify-between group">
                                                <div className="flex flex-col">
                                                    <span className="text-[14px] text-white">{hw.hardware}</span>
                                                    <span className="text-[12px] text-slate-500">ID: {hw.id} • L: <span className="text-white">{hw.load}</span> • T: <span className="text-white">{hw.temp}</span></span>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <button 
                                                        className="p-2 bg-[#22D3EE]/10 text-[#22D3EE] rounded-[5px] hover:bg-[#22D3EE]/20 transition-colors"
                                                        title="Transfer Asset"
                                                        onClick={(e) => { e.stopPropagation(); alert('Target Nodl\'r ID required for: ' + hw.id); }}
                                                    >
                                                        <ArrowRightLeft className="w-4 h-4" />
                                                    </button>
                                                    <span className={`text-[11px] font-mono tracking-wider ${hw.status === 'online' ? 'text-[#22D3EE]' : 'text-slate-600'}`}>{hw.status}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                <section className="space-y-6">
                                    <div className="flex items-center gap-2 text-[14px] text-white">
                                        <History className="w-4 h-4 text-[#22D3EE]" />
                                        <span>Audit log</span>
                                    </div>
                                    <div className="card-sovereign p-6 space-y-4">
                                        {[
                                            { event: 'Account verification', date: '2024.03.12 14:20' },
                                            { event: 'L1 Network linked', date: '2024.04.01 11:45' },
                                            { event: 'Last payout processed', date: '2025.05.20 00:01' },
                                        ].map((log, i) => (
                                            <div key={i} className="flex justify-between items-center text-[13px] border-b border-white/5 last:border-0 pb-3">
                                                <span className="text-slate-400">{log.event}</span>
                                                <span className="text-slate-600 font-mono text-[11px]">{log.date}</span>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>

                            <footer className="p-8 border-t border-white/25 bg-black">
                                {isEditMode ? (
                                    <div className="flex gap-4">
                                        <button 
                                            onClick={() => setIsEditMode(false)}
                                            className="flex-1 py-4 bg-white/5 border border-white/10 rounded-[5px] text-[14px] hover:bg-white/10 transition-all text-slate-500"
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            onClick={() => setIsEditMode(false)}
                                            className="flex-1 py-4 bg-[#22D3EE] rounded-[5px] text-[14px] hover:bg-[#22D3EE]/80 transition-all text-black font-normal shadow-[0_0_20px_rgba(34,211,238,0.2)]"
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                ) : (
                                    <button 
                                        onClick={() => setIsEditMode(true)}
                                        className="w-full py-4 border border-white/25 rounded-[5px] text-[14px] hover:bg-white/5 transition-all flex items-center justify-center gap-2 text-slate-300"
                                    >
                                        Edit profile
                                    </button>
                                )}
                            </footer>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
