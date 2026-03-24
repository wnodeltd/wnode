"use client";

import Sidebar from "../components/Sidebar";

export default function ProvidersPage() {
    return (
        <div className="flex min-h-screen bg-black text-white font-sans overflow-hidden">
            <Sidebar />
            <div className="flex-1 lg:pl-64 flex flex-col relative h-screen overflow-hidden">
                <header className="h-14 border-b border-white/10 flex items-center justify-between px-8 bg-black shrink-0">
                    <span className="text-[10px] font-normal text-slate-400 tracking-[0.2em] uppercase-none">Provider Management</span>
                    <div className="flex items-center gap-2.5 bg-[#E11D48] px-3 py-1 rounded-[5px]">
                        <span className="text-[14px] text-white font-normal uppercase-none">Stephen_Nodl [Owner]</span>
                    </div>
                </header>

                <main className="flex-1 p-[26px] overflow-y-auto pb-24 space-y-[26px]">
                    <div className="pb-2">
                        <h2 className="text-[16px] font-normal tracking-tight text-white mb-1 uppercase-none">Nodl'r Registry</h2>
                        <p className="text-[14px] text-slate-400 font-normal uppercase-none">Manage decentralized computational hardware providers.</p>
                    </div>

                    <div className="card-sovereign p-4 flex flex-col">
                        <div className="overflow-hidden border border-white/5 rounded-[5px]">
                            <table className="w-full text-left">
                                <thead className="bg-white/[0.02] text-[12px] text-slate-400 uppercase-none">
                                    <tr>
                                        <th className="px-4 py-2 font-normal">Provider ID</th>
                                        <th className="px-4 py-2 font-normal">Uptime</th>
                                        <th className="px-4 py-2 font-normal">Hardware</th>
                                        <th className="px-4 py-2 font-normal">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="text-[13px] text-slate-300 divide-y divide-white/5">
                                    {[
                                        { id: 'NODL-4492', uptime: '99.9%', hardware: 'RTX 4090 x 2', status: 'Online' },
                                        { id: 'NODL-1102', uptime: '98.2%', hardware: 'A100 x 1', status: 'Online' },
                                        { id: 'NODL-5561', uptime: '100%', hardware: 'RTX 3080 x 4', status: 'Warning' },
                                        { id: 'NODL-9002', uptime: '0%', hardware: 'T4 x 2', status: 'Offline' },
                                    ].map((row) => (
                                        <tr key={row.id} className="hover:bg-white/[0.01] cursor-pointer group">
                                            <td className="px-4 py-3 font-mono text-[11px] text-[#22D3EE] group-hover:text-white transition-colors">{row.id}</td>
                                            <td className="px-4 py-3">{row.uptime}</td>
                                            <td className="px-4 py-3 font-mono text-[11px] text-slate-500">{row.hardware}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-1.5 h-1.5 rounded-full ${
                                                        row.status === 'Online' ? 'bg-green-500' : 
                                                        row.status === 'Warning' ? 'bg-yellow-500' : 'bg-red-500'
                                                    }`} />
                                                    <span className="text-[11px]">{row.status}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
