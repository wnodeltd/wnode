"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { 
    Search, Plus, X, Shield, Cpu, History, 
    Activity, ArrowRightLeft, Power 
} from "lucide-react";

export default function ClientsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedClient, setSelectedClient] = useState<null | any>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editData, setEditData] = useState({ name: 'Enterprise Mesh', email: 'ops@enterprise.mesh', standing: 'High-Performance' });

    const clients = [
        { id: 'CLI_9821_Z', compute: '1.2M TH/s', tasks: 12, balance: '$4,210.00', status: 'Active' },
        { id: 'CLI_1002_A', compute: '450K TH/s', tasks: 4, balance: '$1,102.50', status: 'Active' },
        { id: 'CLI_5561_B', compute: '2.8M TH/s', tasks: 28, balance: '$12,411.00', status: 'High-Performance' },
    ];

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
                    <div className="pb-2">
                        <h2 className="text-[16px] font-normal tracking-tight text-white mb-1 uppercase-none">Client registry</h2>
                        <p className="text-[14px] text-slate-400 font-normal uppercase-none">Monitor enterprise and retail compute consumption.</p>
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
                        <button className="bg-[#22D3EE] hover:bg-[#22D3EE]/80 text-black px-8 py-3 rounded-[5px] text-[14px] flex items-center gap-2 font-normal transition-all">
                            <Plus className="w-4 h-4" /> Add Client
                        </button>
                    </div>

                    <div className="card-sovereign overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-white/[0.04] text-[12px] text-slate-400 uppercase-none border-b border-white/10">
                                <tr>
                                    <th className="px-6 py-5 font-normal">Client ID</th>
                                    <th className="px-6 py-5 font-normal">Compute Purchased</th>
                                    <th className="px-6 py-5 font-normal">Active Tasks</th>
                                    <th className="px-6 py-5 font-normal text-right">Balance (USD)</th>
                                </tr>
                            </thead>
                            <tbody className="text-[14px] text-slate-300 divide-y divide-white/5">
                                {clients.map((row) => (
                                    <tr 
                                        key={row.id} 
                                        onClick={() => setSelectedClient(row)}
                                        className="hover:bg-white/[0.02] cursor-pointer group transition-colors"
                                    >
                                        <td className="px-6 py-4 font-mono text-[11px] text-[#22D3EE] group-hover:text-white transition-colors">{row.id}</td>
                                        <td className="px-6 py-4">{row.compute}</td>
                                        <td className="px-6 py-4 font-mono text-[11px] text-slate-500">{row.tasks} Tasks</td>
                                        <td className="px-6 py-4 text-white text-right font-normal">{row.balance}</td>
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
                                    <h3 className="text-[20px] text-white font-normal uppercase-none">{selectedClient.id}</h3>
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

                            <footer className="p-8 border-t border-white/25 bg-black absolute bottom-0 w-full">
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
