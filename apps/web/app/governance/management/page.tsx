"use client";

import AppLayout from "../../../components/layout/AppLayout";

export default function ManagementGovernancePage() {
    return (
        <AppLayout>
            <div className="bg-black text-white min-h-screen pt-40 pb-20 px-8">
                <div className="max-w-4xl mx-auto space-y-12">
                    <div className="space-y-4">
                        <h1 className="text-sm tracking-[0.5em] text-purple-500 uppercase font-bold">Operational Governance</h1>
                        <h2 className="text-4xl md:text-6xl font-bold tracking-tight uppercase font-space-grotesk">Wnode Management</h2>
                    </div>

                    <div className="p-12 border border-white/10 bg-white/5 rounded-[2.5rem] space-y-10">
                        <h3 className="text-2xl font-bold uppercase tracking-[0.2em] text-blue-400 border-b border-white/10 pb-6">Wnode Economic Constitution</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                            <div className="flex justify-between items-center border-b border-white/5 pb-4">
                                <span className="text-white/60 uppercase tracking-widest text-sm">Nodlr Pool</span>
                                <span className="text-2xl font-bold text-white font-space-grotesk">70%</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-white/5 pb-4">
                                <span className="text-white/60 uppercase tracking-widest text-sm">Sales Source</span>
                                <span className="text-2xl font-bold text-white font-space-grotesk">10%</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-white/5 pb-4">
                                <span className="text-white/60 uppercase tracking-widest text-sm">Management Licensee</span>
                                <span className="text-2xl font-bold text-white font-space-grotesk">7%</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-white/5 pb-4">
                                <span className="text-white/60 uppercase tracking-widest text-sm">L2 Affiliate</span>
                                <span className="text-2xl font-bold text-white font-space-grotesk">7%</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-white/5 pb-4">
                                <span className="text-white/60 uppercase tracking-widest text-sm">L1 Affiliate</span>
                                <span className="text-2xl font-bold text-white font-space-grotesk">3%</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-white/5 pb-4">
                                <span className="text-white/60 uppercase tracking-widest text-sm">Founder Tree</span>
                                <span className="text-2xl font-bold text-white font-space-grotesk">3%</span>
                            </div>
                        </div>

                        <p className="text-white/40 text-xs italic pt-4">
                            Note: All allocations are hard-coded into the protocol's deterministic ledger engine to ensure zero leakage and constitutional integrity.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="p-8 border border-white/5 bg-white/5 rounded-3xl space-y-4">
                            <h3 className="text-xl font-bold uppercase tracking-widest text-blue-400">Economic Integrity</h3>
                            <p className="text-white/60 leading-relaxed">
                                Management governance oversees the constitutional split, ensuring that all protocol revenue is distributed with 100% transparency.
                            </p>
                        </div>
                        <div className="p-8 border border-white/5 bg-white/5 rounded-3xl space-y-4">
                            <h3 className="text-xl font-bold uppercase tracking-widest text-purple-400">Entity Structure</h3>
                            <p className="text-white/60 leading-relaxed">
                                Strategic alignment between Sales Sources, Management Licensees, and the global Nodlr community.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
