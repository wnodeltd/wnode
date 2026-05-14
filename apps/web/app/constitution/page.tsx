"use client";

import AppLayout from "../../components/layout/AppLayout";
import { useState } from "react";

export default function ConstitutionPage() {
    const sections = [
        { id: "preamble", title: "Founders’ Preamble" },
        { id: "section1", title: "Section 1 — Definitions" },
        { id: "section2", title: "Section 2 — Governance Hierarchy" },
        { id: "section3", title: "Section 3 — Souls, Identity & Voting Rights" },
        { id: "section4", title: "Section 4 — Nodes & NODLRs" },
        { id: "section5", title: "Section 5 — Proposals & Voting" },
        { id: "section6", title: "Section 6 — Stewardship Licence" },
        { id: "section7", title: "Section 7 — Affiliate Tree Assets" },
        { id: "section8", title: "Section 8 — Emergency Powers" },
        { id: "section9", title: "Section 9 — Tokenomics" },
        { id: "section10", title: "Section 10 — Compliance & Liability" },
        { id: "section11", title: "Section 11 — Sanctions & Appeals" },
        { id: "section12", title: "Section 12 — Final Provisions" },
        { id: "section13", title: "Section 13 — Sovereignty" },
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
                <div className="max-w-4xl mx-auto space-y-16 font-inter text-white/80">
                    
                    {/* META */}
                    <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-slate-500 font-mono border-b border-white/10 pb-6">
                        <span>Governing Law: England & Wales</span>
                        <span>By: Stephen Soos (WUID 1000001-0426-01-AA)</span>
                    </div>

                    {/* HEADER */}
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase font-space-grotesk text-white leading-none">WNODE CONSTITUTION v2.1</h1>
                            <p className="text-sm tracking-[0.4em] text-blue-500 uppercase font-black flex items-center gap-4">
                                <span className="h-px w-12 bg-blue-500/50"></span>
                                Official Full Text Version
                            </p>
                        </div>
                        
                        <div className="flex flex-wrap gap-6 pt-4">
                            <a 
                                href="/docs/Governance_v2.1.pdf" 
                                target="_blank"
                                className="group relative inline-flex items-center space-x-4 px-8 py-4 bg-white text-black font-bold uppercase tracking-widest text-[11px] rounded-full overflow-hidden transition-all hover:pr-12"
                            >
                                <span className="relative z-10 transition-colors group-hover:text-white">Download Full PDF</span>
                                <svg className="w-4 h-4 relative z-10 transition-all group-hover:text-white group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                <div className="absolute inset-0 bg-blue-600 translate-y-full transition-transform group-hover:translate-y-0"></div>
                            </a>
                        </div>
                    </div>

                    {/* STICKY TABLE OF CONTENTS */}
                    <div className="sticky top-24 z-20 hidden lg:block float-right -mr-64 w-56 space-y-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-4 opacity-50">Navigation</p>
                        <div className="space-y-2 border-l border-white/5 pl-4">
                            {sections.map((s) => (
                                <button 
                                    key={s.id} 
                                    onClick={() => scrollToSection(s.id)}
                                    className="block text-[9px] uppercase tracking-widest text-slate-500 hover:text-blue-400 transition-colors text-left leading-tight"
                                >
                                    {s.title}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* MOBILE TOC */}
                    <div className="lg:hidden p-8 bg-white/[0.02] border border-white/5 rounded-3xl space-y-6">
                        <h2 className="text-xs uppercase tracking-widest text-blue-500 font-black">Table of Contents</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {sections.map((s) => (
                                <button 
                                    key={s.id} 
                                    onClick={() => scrollToSection(s.id)}
                                    className="text-left text-[10px] uppercase tracking-widest text-slate-400 hover:text-white flex items-center gap-2"
                                >
                                    <span className="w-1 h-1 rounded-full bg-blue-500/30"></span>
                                    {s.title}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-32 pt-20">
                        
                        {/* PREAMBLE */}
                        <div id="preamble" className="scroll-mt-32 space-y-10">
                            <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter font-space-grotesk border-b border-white/10 pb-8">FOUNDERS’ PREAMBLE</h2>
                            <div className="space-y-8 leading-relaxed text-lg font-light text-slate-300">
                                <p>Wnode was created as a community-owned, community-governed, and AI-powered planetary compute mesh.</p>
                                <p>As the Founder, I established this Constitution to ensure that Wnode remains open, decentralised, transparent, fair, sovereign, and permanently aligned with the interests of its users, node operators, and token holders.</p>
                                <p>This Constitution v2.1 sets out the governance structure, rights, duties, and safeguards that protect the Wnode Mesh, the DAO, and the community for all future generations. It establishes full operational sovereignty through Wnode-owned servers, development environments, power systems, and a recursive sovereign AI LLM.</p>
                                <blockquote className="p-8 bg-blue-500/5 border-l-2 border-blue-500/30 italic text-blue-100/90 rounded-r-3xl">
                                    “Wnode is deliberately built for maximum independence — owning and operating its own critical infrastructure to eliminate reliance on third-party cloud providers and ensure resilience against censorship, deplatforming, or external control.”
                                </blockquote >
                            </div>
                        </div>

                        {/* SECTION 1 */}
                        <div id="section1" className="scroll-mt-32 space-y-12">
                            <div className="space-y-2">
                                <span className="text-[10px] uppercase tracking-[0.5em] text-blue-500 font-black">Section 1</span>
                                <h2 className="text-4xl font-bold text-white uppercase tracking-tight font-space-grotesk">DEFINITIONS</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                                {[
                                    { t: "1.1 Wnode Mesh", d: "The decentralised compute network operated collectively by node operators, governed by the DAO." },
                                    { t: "1.2 DAO / Wnode DAO", d: "The decentralised autonomous organisation composed of verified token holders and NODLR Souls." },
                                    { t: "1.4 Founder Board", d: "A body of 4 members responsible for constitutional guardianship, Steward appointment, and emergency powers." },
                                    { t: "1.6 Steward", d: "Holder of the Stewardship Licence, responsible for platform operations and UX management." },
                                    { t: "1.9 Soul", d: "A non-transferable identity token representing a verified human individual (Locked or Voting)." },
                                    { t: "1.20 Core Immutable Provisions", d: "Provisions requiring 100% DAO approval to amend (e.g. 1 Soul = 1 Vote)." }
                                ].map((def, i) => (
                                    <div key={i} className="space-y-3 p-6 bg-white/[0.01] border-l border-white/10 hover:border-blue-500/30 transition-all">
                                        <h3 className="text-white font-bold text-xs uppercase tracking-widest">{def.t}</h3>
                                        <p className="text-sm text-slate-400 leading-relaxed">{def.d}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* SECTION 2 */}
                        <div id="section2" className="scroll-mt-32 space-y-12">
                            <div className="space-y-2">
                                <span className="text-[10px] uppercase tracking-[0.5em] text-blue-500 font-black">Section 2</span>
                                <h2 className="text-4xl font-bold text-white uppercase tracking-tight font-space-grotesk">GOVERNANCE HIERARCHY</h2>
                            </div>
                            <div className="space-y-12">
                                <div className="p-10 bg-white/[0.02] border border-white/5 rounded-[2.5rem] space-y-6">
                                    <h3 className="text-2xl font-bold text-white uppercase tracking-tighter">2.1 The DAO (Wnode DAO)</h3>
                                    <p className="text-base text-slate-300 leading-relaxed">The sovereign community governance body. Votes on proposals, controls the Treasury, and ratifies amendments. DAO voting is strictly <span className="text-blue-400 font-black">1 Soul = 1 Vote</span>.</p>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-500 font-mono uppercase tracking-widest">
                                        <li className="flex gap-3"><span className="text-blue-500">/</span> No whale dominance</li>
                                        <li className="flex gap-3"><span className="text-blue-500">/</span> No governance capture</li>
                                    </ul>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4 p-8 border border-white/5 rounded-3xl">
                                        <h4 className="text-xs font-black text-white uppercase tracking-widest">2.3 Founder Board</h4>
                                        <p className="text-sm text-slate-400 leading-relaxed">Constitutional guardians. Responsible for Steward appointment and emergency response. Progressive decentralisation starts after 24 months or 50k active Voting Souls.</p>
                                    </div>
                                    <div className="space-y-4 p-8 border border-white/5 rounded-3xl">
                                        <h4 className="text-xs font-black text-white uppercase tracking-widest">2.5 The Steward</h4>
                                        <p className="text-sm text-slate-400 leading-relaxed">The operational licence holder. Manages UX, compliance, and revenue operations. Does not control governance or the Treasury.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SECTION 3 */}
                        <div id="section3" className="scroll-mt-32 space-y-12">
                            <div className="space-y-2">
                                <span className="text-[10px] uppercase tracking-[0.5em] text-blue-500 font-black">Section 3</span>
                                <h2 className="text-4xl font-bold text-white uppercase tracking-tight font-space-grotesk">SOULS, IDENTITY & VOTING</h2>
                            </div>
                            <div className="space-y-8 leading-relaxed text-slate-300">
                                <p className="text-lg">Governance is based on <span className="text-white font-bold">People, not Capital</span>. A Soul represents a verified human individual and is non-transferable, ensuring that governance remains resistant to capture.</p>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="p-8 bg-white/[0.02] border border-white/5 rounded-2xl space-y-4">
                                        <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">3.1 Souls</span>
                                        <p className="text-xs text-slate-500">Permanently bound to a WUID. Cannot be sold, traded, or delegated.</p>
                                    </div>
                                    <div className="p-8 bg-white/[0.02] border border-white/5 rounded-2xl space-y-4">
                                        <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">3.5 One Person, One Vote</span>
                                        <p className="text-xs text-slate-300 font-bold">A Core Immutable Provision ensuring long-term stability and fairness.</p>
                                    </div>
                                    <div className="p-8 bg-white/[0.02] border border-white/5 rounded-2xl space-y-4">
                                        <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">3.11 Asset Separation</span>
                                        <p className="text-xs text-slate-500">Tokens and Affiliate Trees confer zero voting rights or governance influence.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SECTION 4 */}
                        <div id="section4" className="scroll-mt-32 space-y-12">
                            <div className="space-y-2">
                                <span className="text-[10px] uppercase tracking-[0.5em] text-blue-500 font-black">Section 4</span>
                                <h2 className="text-4xl font-bold text-white uppercase tracking-tight font-space-grotesk">NODES & NODLRS</h2>
                            </div>
                            <div className="space-y-8 leading-relaxed text-slate-300">
                                <p>Nodes form the physical backbone of the network. <span className="text-white font-medium">NODLRs</span> are verified node operators who hold Voting Souls and participate in DAO governance.</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="p-10 bg-white/[0.01] border border-white/5 rounded-[2.5rem] space-y-6">
                                        <h4 className="text-xs font-black text-white uppercase tracking-[0.3em]">4.3 NODLR Status</h4>
                                        <ul className="space-y-4 text-sm text-slate-500">
                                            <li className="flex gap-4">• Pass identity & technical verification</li>
                                            <li className="flex gap-4">• Maintain hardware in good standing</li>
                                            <li className="flex gap-4">• Gain full DAO voting rights</li>
                                        </ul>
                                    </div>
                                    <div className="p-10 bg-white/[0.01] border border-white/5 rounded-[2.5rem] space-y-6">
                                        <h4 className="text-xs font-black text-white uppercase tracking-[0.3em]">4.7 Affiliate Trees (NODLR)</h4>
                                        <p className="text-sm text-slate-400">Strictly limited to Level 1 (3%) and Level 2 (7%) commission. Permanent commercial assets, independent of governance.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SECTION 5 */}
                        <div id="section5" className="scroll-mt-32 space-y-12">
                            <div className="space-y-2">
                                <span className="text-[10px] uppercase tracking-[0.5em] text-blue-500 font-black">Section 5</span>
                                <h2 className="text-4xl font-bold text-white uppercase tracking-tight font-space-grotesk">GOVERNANCE PROCEDURES</h2>
                            </div>
                            <div className="space-y-10">
                                <div className="overflow-hidden rounded-3xl border border-white/5 bg-white/[0.01]">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-white/[0.03] border-b border-white/10 text-blue-500 uppercase tracking-widest text-[10px]">
                                            <tr>
                                                <th className="px-8 py-6">Proposal Type</th>
                                                <th className="px-8 py-6 text-center">Approval Threshold</th>
                                                <th className="px-8 py-6 text-right">Quorum</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5 text-slate-400">
                                            <tr><td className="px-8 py-6 font-bold text-white/60">Operational</td><td className="px-8 py-6 text-center">{">"}66% YES</td><td className="px-8 py-6 text-right">20%</td></tr>
                                            <tr><td className="px-8 py-6 font-bold text-white/60">Economic</td><td className="px-8 py-6 text-center">{">"}80% YES</td><td className="px-8 py-6 text-right">25%</td></tr>
                                            <tr><td className="px-8 py-6 font-black text-blue-400">Core Immutable</td><td className="px-8 py-6 text-center">100% YES</td><td className="px-8 py-6 text-right">50%</td></tr>
                                        </tbody>
                                    </table>
                                </div>
                                <p className="text-[10px] text-center text-slate-600 uppercase tracking-[0.5em]">Standard voting period: 7 days</p>
                            </div>
                        </div>

                        {/* SECTION 6 & 7 */}
                        <div id="section6" className="scroll-mt-32 space-y-12">
                            <div className="space-y-2">
                                <span className="text-[10px] uppercase tracking-[0.5em] text-blue-500 font-black">Section 6 & 7</span>
                                <h2 className="text-4xl font-bold text-white uppercase tracking-tight font-space-grotesk">STEWARDSHIP & ASSETS</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="p-10 bg-white/[0.02] border border-white/5 rounded-[2.5rem] space-y-6">
                                    <h4 className="text-xs font-black text-white uppercase tracking-widest">The Stewardship Licence</h4>
                                    <p className="text-sm text-slate-400 leading-relaxed italic">“The Stewardship Licence is a commercial licence, not a governance role. The Steward is an operator, not a governor.”</p>
                                    <ul className="space-y-3 text-xs text-slate-500">
                                        <li>• Removable for negligence or breach</li>
                                        <li>• accountable to the Governance Board</li>
                                    </ul>
                                </div>
                                <div id="section7" className="p-10 bg-white/[0.02] border border-white/5 rounded-[2.5rem] space-y-6">
                                    <h4 className="text-xs font-black text-white uppercase tracking-widest">Founder Affiliate Tree</h4>
                                    <p className="text-sm text-slate-400 leading-relaxed">Infinite-depth commercial lineage. Immutable entitlement to <span className="text-blue-400 font-bold">3% of the entire Affiliate Tree to infinity</span>. This is a Core Immutable Provision.</p>
                                </div>
                            </div>
                        </div>

                        {/* SECTION 8, 9, 10 */}
                        <div id="section8" className="scroll-mt-32 space-y-12">
                            <h2 className="text-3xl font-bold text-white uppercase tracking-tight font-space-grotesk border-b border-white/10 pb-6">SECTION 8 — EMERGENCY POWERS</h2>
                            <p className="text-lg leading-relaxed text-slate-400">Authorized solely to protect network integrity. Time-limited to 72 hours initially, requiring full public reporting and DAO review after activation.</p>
                        </div>

                        <div id="section9" className="scroll-mt-32 space-y-12">
                            <h2 className="text-3xl font-bold text-white uppercase tracking-tight font-space-grotesk border-b border-white/10 pb-6">SECTION 9 — TOKENOMICS</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center p-10 border border-white/5 rounded-3xl">
                                <div className="space-y-6">
                                    <h3 className="text-2xl font-bold text-white">Economic Utility, <br/>Zero Political Power</h3>
                                    <p className="text-sm text-slate-400">Tokens are used for staking and incentives but confer no voting rights. 70% of network revenue is allocated to Node Operators.</p>
                                </div>
                                <div className="space-y-3 font-mono text-[10px] text-blue-500/80">
                                    <p>Node Operators: 70%</p>
                                    <p>Affiliates: 10% (L1+L2)</p>
                                    <p>Steward: 7%</p>
                                    <p>Founder Override: 3%</p>
                                </div>
                            </div>
                        </div>

                        <div id="section10" className="scroll-mt-32 space-y-12">
                            <h2 className="text-3xl font-bold text-white uppercase tracking-tight font-space-grotesk border-b border-white/10 pb-6">SECTION 10 — COMPLIANCE & LIABILITY</h2>
                            <p className="text-sm text-slate-500 leading-relaxed max-w-2xl">Governed by the laws of <span className="text-white">England & Wales</span>. Dispute resolution via London arbitration under LCIA Rules. Mandatory AML/KYC compliance via Stripe Connect.</p>
                        </div>

                        {/* SECTION 11, 12 */}
                        <div id="section11" className="scroll-mt-32 space-y-12">
                            <h2 className="text-3xl font-bold text-white uppercase tracking-tight font-space-grotesk border-b border-white/10 pb-6">SECTION 11 — SANCTIONS & APPEALS</h2>
                            <div className="p-8 bg-red-500/5 border border-red-500/20 rounded-2xl space-y-4">
                                <h4 className="text-xs font-black text-red-400 uppercase tracking-widest">Enforcement Due Process</h4>
                                <p className="text-sm text-slate-400">Sanctions (suspension, Tree freezing) only for documented cause. 7-day notice and response window. Appeals handled by Governance Board, then Founder Board.</p>
                            </div>
                        </div>

                        <div id="section12" className="scroll-mt-32 space-y-12">
                            <h2 className="text-3xl font-bold text-white uppercase tracking-tight font-space-grotesk border-b border-white/10 pb-6">SECTION 12 — FINAL PROVISIONS</h2>
                            <p className="text-sm text-slate-500">Ratified May 13th 2026. This document constitutes the entire understanding regarding Mesh governance.</p>
                        </div>

                        {/* SECTION 13 */}
                        <div id="section13" className="scroll-mt-32 space-y-16">
                            <div className="space-y-4">
                                <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter font-space-grotesk">SECTION 13 — SOVEREIGNTY</h2>
                                <p className="text-lg text-blue-400/80 font-light max-w-2xl leading-relaxed">Maximum resistance to deplatforming through full technological self-reliance.</p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="p-10 bg-white/[0.02] border border-white/5 rounded-[2.5rem] space-y-6">
                                    <h4 className="text-white font-bold uppercase tracking-widest text-sm">13.1 Physical Infrastructure</h4>
                                    <ul className="space-y-4 text-xs text-slate-500 font-mono">
                                        <li>• Own & operate bare-metal servers</li>
                                        <li>• Self-hosted development environments</li>
                                        <li>• Solar-powered power resilience</li>
                                    </ul>
                                </div>
                                <div className="p-10 bg-gradient-to-br from-blue-600/10 to-transparent border border-blue-500/20 rounded-[2.5rem] space-y-6">
                                    <h4 className="text-white font-bold uppercase tracking-widest text-sm">13.2 Recursive AI LLM</h4>
                                    <p className="text-sm text-slate-300 leading-relaxed italic">
                                        “Proprietary recursive AI system for intelligent job routing, autonomous support, and protocol optimization, operated on Wnode sovereign hardware.”
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* FINAL SIGNATURE */}
                        <div className="pt-20 text-center space-y-16 border-t border-white/10">
                            <div className="space-y-6">
                                <p className="text-[10px] uppercase tracking-[0.6em] text-slate-700 font-black">Ratified May 13th 2026</p>
                                <div className="space-y-2">
                                    <p className="text-white font-space-grotesk font-black uppercase tracking-widest text-4xl">Stephen Soos</p>
                                    <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Founder • Architect • Initial Steward</p>
                                    <p className="text-[10px] text-blue-500/80 font-mono font-black">WUID: 1000001-0426-01-AA</p>
                                </div>
                            </div>
                            
                            <div className="p-10 border border-white/5 bg-white/[0.01] rounded-[2.5rem] max-w-2xl mx-auto">
                                <p className="text-[10px] text-slate-600 leading-relaxed uppercase tracking-widest font-black">
                                    This is a full-text web rendering of the Wnode Constitution v2.1. In case of discrepancy, the signed PDF version prevails.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
