"use client";

import AppLayout from "../../../components/layout/AppLayout";

export default function WhitepaperPage() {
    return (
        <AppLayout>
            <div className="bg-black text-white min-h-screen pt-40 pb-40 px-6 md:px-12">
                <div className="max-w-4xl mx-auto space-y-12">
                    
                    <div className="space-y-6 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white font-space-grotesk uppercase">Wnode Whitepaper</h1>
                        <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
                            The technical and economic blueprint for a sovereign, decentralised planetary compute mesh.
                        </p>
                    </div>

                    <div className="p-12 bg-white/[0.02] border border-white/10 rounded-sm space-y-8 flex flex-col items-center">
                        <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/20 rounded-full flex items-center justify-center mb-4">
                            <span className="text-blue-500 text-2xl font-bold">PDF</span>
                        </div>
                        
                        <div className="space-y-4 text-center max-w-xl">
                            <h2 className="text-xl font-bold text-white uppercase tracking-tight font-space-grotesk">Technical Specification v2.0</h2>
                            <p className="text-sm text-slate-500 leading-relaxed">
                                Explore the architecture of the Wnode Mesh, the 1 Soul = 1 Vote governance model, the recursive AI routing system, and the economic incentives for node operators.
                            </p>
                        </div>

                        <a 
                            href="/docs/Wnode_Whitepaper_v2.0.pdf" 
                            target="_blank"
                            className="px-12 py-4 bg-white text-black text-xs font-black uppercase tracking-[0.2em] rounded-sm hover:bg-blue-500 hover:text-white transition-all shadow-xl"
                        >
                            Download Whitepaper
                        </a>
                    </div>

                    <div className="pt-12 space-y-8">
                        <div className="w-full aspect-video bg-white/[0.01] border border-white/5 border-dashed rounded-sm flex items-center justify-center">
                            <span className="text-[10px] uppercase tracking-[0.5em] text-slate-700 font-black">[ Interactive Protocol Visualization Placeholder ]</span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { t: "Architecture", d: "Deep dive into the decentralised server mesh and sovereign infrastructure." },
                                { t: "Economic Model", d: "Understanding the WnodeToken utility and node operator rewards." },
                                { t: "Governance", d: "The human-centric identity system and DAO execution mechanics." }
                            ].map(item => (
                                <div key={item.t} className="space-y-2">
                                    <h3 className="text-white font-bold text-[10px] uppercase tracking-widest">{item.t}</h3>
                                    <p className="text-xs text-slate-500 leading-relaxed">{item.d}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </AppLayout>
    );
}
