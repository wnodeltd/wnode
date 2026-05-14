"use client";

import AppLayout from "../../components/layout/AppLayout";
import { useState } from "react";

export default function ConstitutionPage() {
    const sections = [
        { id: "preamble", title: "Preamble" },
        { id: "definitions", title: "Definitions" },
        { id: "hierarchy", title: "Hierarchy" },
        { id: "identity", title: "Identity & Participation" },
        { id: "procedures", title: "Procedures & Voting" },
        { id: "economics", title: "Economics & Assets" },
        { id: "sovereignty", title: "Sovereignty" },
    ];

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
                <div className="max-w-4xl mx-auto space-y-12 font-inter text-white/80">
                    
                    {/* META */}
                    <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-slate-500 font-mono border-b border-white/10 pb-6">
                        <span>Law: England & Wales</span>
                        <span>Stephen Soos (WUID 1000001-0426-01-AA)</span>
                    </div>

                    {/* HEADER */}
                    <div className="space-y-6">
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter uppercase font-space-grotesk text-white leading-none">CONSTITUTION v2.1 <span className="text-blue-500 text-3xl font-light">Condensed</span></h1>
                        <p className="text-lg text-blue-100/70 italic border-l-2 border-blue-500 pl-6 py-1">
                            “The official Wnode Constitution v2.1 — defining the governance, rights, and safeguards of the Mesh.”
                        </p>
                        <div className="flex flex-wrap gap-4 pt-2">
                            <a href="/docs/Governance_v2.1.pdf" target="_blank" className="px-6 py-3 bg-white text-black font-bold uppercase tracking-widest text-[10px] rounded-full hover:bg-blue-500 hover:text-white transition-all">
                                Download Full PDF
                            </a>
                        </div>
                    </div>

                    {/* TOC */}
                    <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-wrap gap-x-6 gap-y-2">
                        {sections.map((s) => (
                            <button key={s.id} onClick={() => scrollToSection(s.id)} className="text-[10px] uppercase tracking-widest text-slate-500 hover:text-blue-400 transition-colors">
                                {s.title}
                            </button>
                        ))}
                    </div>

                    <div className="space-y-20">
                        {/* PREAMBLE & DEFINITIONS */}
                        <div id="preamble" className="scroll-mt-32 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-4">
                                    <h2 className="text-2xl font-bold text-white uppercase tracking-tight font-space-grotesk">Preamble</h2>
                                    <p className="text-sm leading-relaxed">Wnode is a community-owned, AI-powered planetary compute mesh. This Constitution ensures it remains open, decentralised, and sovereign, protected by 1 Soul = 1 Vote and infrastructure independence.</p>
                                </div>
                                <div id="definitions" className="space-y-4">
                                    <h2 className="text-2xl font-bold text-white uppercase tracking-tight font-space-grotesk">Key Definitions</h2>
                                    <ul className="text-xs space-y-2 text-slate-400">
                                        <li><span className="text-white font-bold">Wnode Mesh:</span> Decentralised compute network operated by nodes.</li>
                                        <li><span className="text-white font-bold">DAO:</span> The sovereign community governance body.</li>
                                        <li><span className="text-white font-bold">Soul:</span> Non-transferable identity representing a verified human.</li>
                                        <li><span className="text-white font-bold">NODLR:</span> Verified node operator with a Voting Soul.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* HIERARCHY */}
                        <div id="hierarchy" className="scroll-mt-32 space-y-6">
                            <h2 className="text-2xl font-bold text-white uppercase tracking-tight font-space-grotesk">Governance Hierarchy</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-xl">
                                    <h3 className="text-xs font-black text-blue-400 uppercase tracking-widest mb-2">1. The DAO</h3>
                                    <p className="text-[11px] text-slate-300">Highest authority. 1 Soul = 1 Vote. Controls Treasury and Amendments.</p>
                                </div>
                                <div className="p-6 bg-white/[0.02] border border-white/5 rounded-xl">
                                    <h3 className="text-xs font-black text-white uppercase tracking-widest mb-2">2. Boards</h3>
                                    <p className="text-[11px] text-slate-400">Founder Board (Guardians) & Governance Board (Operations).</p>
                                </div>
                                <div className="p-6 bg-white/[0.02] border border-white/5 rounded-xl">
                                    <h3 className="text-xs font-black text-white uppercase tracking-widest mb-2">3. Stewardship</h3>
                                    <p className="text-[11px] text-slate-400">Commercial operator under licence. UX & Support focus.</p>
                                </div>
                            </div>
                        </div>

                        {/* IDENTITY & PARTICIPATION */}
                        <div id="identity" className="scroll-mt-32 space-y-6">
                            <h2 className="text-2xl font-bold text-white uppercase tracking-tight font-space-grotesk">Identity & Participation</h2>
                            <div className="p-8 bg-white/[0.01] border border-white/5 rounded-2xl space-y-6">
                                <p className="text-sm">Governance is based on <span className="text-white font-bold">People, not Capital</span>. A Soul represents a verified human and is permanently bound to a single human being.</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <h4 className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">Locked Souls</h4>
                                        <p className="text-xs text-slate-500">Identity-only. No voting. Standard entry point.</p>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">Voting Souls</h4>
                                        <p className="text-xs text-slate-300">Earned via node operation and technical verification.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* PROCEDURES */}
                        <div id="procedures" className="scroll-mt-32 space-y-6">
                            <h2 className="text-2xl font-bold text-white uppercase tracking-tight font-space-grotesk">Procedures & Voting</h2>
                            <div className="overflow-hidden rounded-xl border border-white/5">
                                <table className="w-full text-left text-[10px] uppercase tracking-widest">
                                    <thead className="bg-white/5 text-blue-500">
                                        <tr><th className="p-4">Type</th><th className="p-4">Pass Rate</th><th className="p-4">Quorum</th></tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5 text-slate-400 font-mono">
                                        <tr><td className="p-4 font-sans font-bold text-white/60">Operational</td><td className="p-4">{">"}66%</td><td className="p-4">20%</td></tr>
                                        <tr><td className="p-4 font-sans font-bold text-white/60">Economic</td><td className="p-4">{">"}80%</td><td className="p-4">25%</td></tr>
                                        <tr><td className="p-4 font-sans font-black text-blue-400">Core Immutable</td><td className="p-4">100%</td><td className="p-4">50%</td></tr>
                                    </tbody>
                                </table>
                            </div>
                            <p className="text-[10px] text-slate-600 italic">Sanctions and freezing follow due process with mandatory notification and appeal rights.</p>
                        </div>

                        {/* ECONOMICS & ASSETS */}
                        <div id="economics" className="scroll-mt-32 space-y-6">
                            <h2 className="text-2xl font-bold text-white uppercase tracking-tight font-space-grotesk">Economics & Assets</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-6 bg-white/[0.02] border border-white/5 rounded-xl space-y-3">
                                    <h4 className="text-[10px] font-bold text-white uppercase tracking-widest">Affiliate Tree Assets</h4>
                                    <p className="text-xs text-slate-500">Commercial lineage assets. Founder (Infinite Depth, 3%). NODLR (L1 3%, L2 7%). Transferable, sellable, zero governance power.</p>
                                </div>
                                <div className="p-6 bg-white/[0.02] border border-white/5 rounded-xl space-y-3">
                                    <h4 className="text-[10px] font-bold text-white uppercase tracking-widest">Tokenomics</h4>
                                    <p className="text-xs text-slate-500">Utility only. No voting rights. Rewards based on compute contribution (70% to Node Operators).</p>
                                </div>
                            </div>
                        </div>

                        {/* SOVEREIGNTY */}
                        <div id="sovereignty" className="scroll-mt-32 space-y-8">
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold text-white uppercase tracking-tight font-space-grotesk">Infrastructure Sovereignty</h2>
                                <p className="text-sm text-slate-400">Wnode owns and operates physical bare-metal servers, development environments, and independent solar-backed power systems.</p>
                            </div>
                            <div className="p-8 bg-gradient-to-br from-blue-600/10 to-transparent border border-blue-500/20 rounded-2xl text-center">
                                <h3 className="text-lg font-bold text-white mb-2 uppercase tracking-tighter">Recursive AI LLM</h3>
                                <p className="text-xs text-slate-400 italic">“Proprietary sovereign AI for routing, support, and network optimization.”</p>
                            </div>
                        </div>

                        {/* SIGNATURE */}
                        <div className="pt-20 text-center space-y-10 border-t border-white/5">
                            <div className="space-y-2">
                                <p className="text-white font-space-grotesk font-black uppercase tracking-[0.2em] text-2xl">Stephen Soos</p>
                                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Founder • Architect • Initial Steward</p>
                                <p className="text-[10px] text-blue-500/80 font-mono">WUID: 1000001-0426-01-AA | May 13th 2026</p>
                            </div>
                            <p className="text-[9px] text-slate-600 uppercase tracking-widest font-bold">Web rendering of Constitution v2.1. PDF version prevails.</p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
