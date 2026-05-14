"use client";

import AppLayout from "../../components/layout/AppLayout";

export default function ConstitutionPage() {
    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            window.scrollTo({
                top: element.getBoundingClientRect().top + window.pageYOffset - 100,
                behavior: "smooth"
            });
        }
    };

    return (
        <AppLayout>
            <div className="bg-black text-white min-h-screen pt-40 pb-20 px-8">
                <div className="max-w-3xl mx-auto space-y-12 font-inter text-white/80">
                    
                    {/* META */}
                    <div className="flex justify-between items-center text-[9px] uppercase tracking-[0.3em] text-slate-600 font-mono border-b border-white/5 pb-4">
                        <span>England & Wales Law</span>
                        <span>Stephen Soos (WUID 1000001-0426-01-AA)</span>
                    </div>

                    {/* HEADER */}
                    <div className="space-y-6">
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase font-space-grotesk text-white">WNODE CONSTITUTION v2.1</h1>
                        <p className="text-sm text-blue-500/80 font-bold uppercase tracking-widest flex items-center gap-2">
                            <span className="w-4 h-px bg-blue-500"></span>
                            Executive Summary
                        </p>
                        <div className="flex gap-4">
                            <a href="/docs/Governance_v2.1.pdf" target="_blank" className="px-5 py-2 bg-white text-black font-bold uppercase tracking-widest text-[9px] rounded-full hover:bg-blue-600 hover:text-white transition-all">
                                Full PDF
                            </a>
                        </div>
                    </div>

                    {/* CONTENT GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                        
                        {/* PILLAR 1: IDENTITY */}
                        <div className="p-6 bg-white/[0.02] border border-white/10 rounded-2xl space-y-3">
                            <h3 className="text-blue-500 font-black uppercase tracking-widest text-[10px]">01. Identity & Voting</h3>
                            <p className="text-xs leading-relaxed text-slate-400">Governance is human-centric: <span className="text-white font-bold">1 Soul = 1 Vote</span>. Tokens and assets provide zero voting power. Identities (Souls) are non-transferable and permanent.</p>
                        </div>

                        {/* PILLAR 2: GOVERNANCE */}
                        <div className="p-6 bg-white/[0.02] border border-white/10 rounded-2xl space-y-3">
                            <h3 className="text-blue-500 font-black uppercase tracking-widest text-[10px]">02. Authority Hierarchy</h3>
                            <p className="text-xs leading-relaxed text-slate-400">The <span className="text-white font-bold">DAO</span> is sovereign over Treasury and Amendments. The <span className="text-white font-bold">Founder Board</span> acts as constitutional guardians with emergency oversight.</p>
                        </div>

                        {/* PILLAR 3: ECONOMICS */}
                        <div className="p-6 bg-white/[0.02] border border-white/10 rounded-2xl space-y-3">
                            <h3 className="text-blue-500 font-black uppercase tracking-widest text-[10px]">03. Mesh Economics</h3>
                            <p className="text-xs leading-relaxed text-slate-400">70% of revenue goes to <span className="text-white font-bold">Node Operators</span>. Affiliate Trees are commercial assets (Founder: Infinite | NODLR: L1+L2) independent of governance.</p>
                        </div>

                        {/* PILLAR 4: SOVEREIGNTY */}
                        <div className="p-6 bg-blue-600/5 border border-blue-500/20 rounded-2xl space-y-3">
                            <h3 className="text-blue-400 font-black uppercase tracking-widest text-[10px]">04. Infrastructure</h3>
                            <p className="text-xs leading-relaxed text-slate-300">Wnode owns its servers, development environments, and <span className="text-white font-bold">Solar Power</span> infrastructure. Operates a proprietary recursive AI LLM for routing and support.</p>
                        </div>

                    </div>

                    {/* KEY THRESHOLDS */}
                    <div className="p-6 bg-white/[0.01] border border-white/5 rounded-2xl space-y-4">
                        <h4 className="text-[9px] uppercase tracking-[0.4em] text-slate-600 font-black text-center">Voting Thresholds</h4>
                        <div className="flex justify-around text-[10px] font-mono text-slate-500 uppercase">
                            <div className="text-center"><p className="text-white font-bold">66%</p><p>Ops</p></div>
                            <div className="text-center"><p className="text-white font-bold">85%</p><p>Const</p></div>
                            <div className="text-center"><p className="text-blue-400 font-black">100%</p><p>Core</p></div>
                        </div>
                    </div>

                    {/* SIGNATURE */}
                    <div className="pt-12 text-center space-y-6 border-t border-white/5">
                        <div className="space-y-1">
                            <p className="text-white font-space-grotesk font-black uppercase tracking-widest text-xl">Stephen Soos</p>
                            <p className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">Founder • Architect • Initial Steward</p>
                        </div>
                        <p className="text-[8px] text-slate-700 uppercase tracking-widest font-black italic">
                            Wnode Constitution v2.1 Executive Summary. Web version of signed PDF.
                        </p>
                    </div>

                </div>
            </div>
        </AppLayout>
    );
}
