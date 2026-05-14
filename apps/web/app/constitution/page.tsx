"use client";

import AppLayout from "../../components/layout/AppLayout";
import { useEffect, useState } from "react";

export default function ConstitutionPage() {
    const sections = [
        { id: "preamble", title: "Founders’ Preamble" },
        { id: "section1", title: "Section 1 — Definitions" },
        { id: "section2", title: "Section 2 — Governance Hierarchy" },
        { id: "section3", title: "Section 3 — Souls, Identity & Voting Rights" },
        { id: "section4", title: "Section 4 — Nodes & NODLRs" },
        { id: "section5", title: "Section 5 — Governance Proposals & Voting Procedures" },
        { id: "section6", title: "Section 6 — The Stewardship Licence" },
        { id: "section7", title: "Section 7 — Affiliate Tree Assets" },
        { id: "section8", title: "Section 8 — Emergency Powers & Network Protection" },
        { id: "section9", title: "Section 9 — Tokenomics & Economic Model" },
        { id: "section10", title: "Section 10 — Compliance, Liability & General Provisions" },
        { id: "section11", title: "Section 11 — Enforcement, Sanctions, Freezing & Appeals" },
        { id: "section12", title: "Section 12 — Amendments, Ratification & Final Provisions" },
        { id: "section13", title: "Section 13 — Sovereignty and Infrastructure Independence" },
    ];

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const headerOffset = 100;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    };

    return (
        <AppLayout>
            <div className="bg-black text-white min-h-screen pt-40 pb-20 px-8">
                <div className="max-w-4xl mx-auto space-y-16 font-inter text-white/80">
                    
                    {/* TOP DETAILS */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-[10px] uppercase tracking-widest text-slate-500 font-mono border-b border-white/10 pb-6">
                        <div className="flex items-center gap-2">
                            <span className="w-1 h-1 bg-blue-500 rounded-full animate-pulse"></span>
                            <span>Governing Law: England & Wales</span>
                        </div>
                        <div className="text-right">
                            By: Stephen Soos (WUID 1000001-0426-01-AA)
                        </div>
                    </div>

                    {/* HEADER */}
                    <div className="space-y-10">
                        <div className="space-y-4">
                            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter uppercase font-space-grotesk text-white leading-[0.8] mb-4">WNODE CONSTITUTION v2.1</h1>
                            <p className="text-sm tracking-[0.5em] text-blue-500 uppercase font-bold flex items-center gap-3">
                                <span className="h-px w-8 bg-blue-500/50"></span>
                                Official Governance Charter
                            </p>
                        </div>
                        
                        <div className="space-y-8">
                            <div className="relative">
                                <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-blue-500/20 to-transparent"></div>
                                <p className="text-2xl text-blue-100/90 leading-relaxed italic pl-6 py-2">
                                    “This is the official Wnode Constitution v2.1 — defining the governance, rights, duties, and safeguards of the Wnode Mesh.”
                                </p>
                            </div>

                            {/* DOWNLOAD BUTTON */}
                            <div className="space-y-4 pt-4">
                                <a 
                                    href="/docs/Governance_v2.1.pdf" 
                                    target="_blank"
                                    className="group relative inline-flex items-center space-x-4 px-10 py-5 bg-white text-black font-bold uppercase tracking-widest text-xs rounded-full overflow-hidden transition-all hover:pr-14"
                                >
                                    <span className="relative z-10 transition-colors group-hover:text-white">Download Constitution PDF</span>
                                    <svg className="w-5 h-5 relative z-10 transition-all group-hover:text-white group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                    <div className="absolute inset-0 bg-blue-600 translate-y-full transition-transform group-hover:translate-y-0"></div>
                                </a>
                                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold ml-2 opacity-60">
                                    Official signed version — Wnode Constitution v2.1 (Governing Law: England & Wales).
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* TABLE OF CONTENTS */}
                    <div className="p-10 bg-white/[0.01] border border-white/5 rounded-[2.5rem] space-y-8 backdrop-blur-sm shadow-2xl">
                        <h2 className="text-xs uppercase tracking-[0.4em] text-blue-500 font-black flex items-center gap-4">
                            Contents
                            <span className="h-px flex-1 bg-white/5"></span>
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-4">
                            {sections.map((s) => (
                                <button 
                                    key={s.id}
                                    onClick={() => scrollToSection(s.id)}
                                    className="text-left text-[11px] uppercase tracking-widest text-slate-400 hover:text-white transition-all flex items-center space-x-3 group"
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-white/5 group-hover:bg-blue-500 group-hover:scale-125 transition-all duration-300"></span>
                                    <span className="group-hover:translate-x-1 transition-transform duration-300">{s.title}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-32 pt-20">
                        
                        {/* PREAMBLE */}
                        <div id="preamble" className="scroll-mt-32 space-y-10 group">
                            <div className="space-y-2">
                                <span className="text-[10px] uppercase tracking-[0.6em] text-blue-500/50 font-bold">Introduction</span>
                                <h2 className="text-4xl md:text-5xl font-bold text-white uppercase tracking-tighter font-space-grotesk group-hover:text-blue-400 transition-colors">FOUNDERS’ PREAMBLE</h2>
                            </div>
                            <div className="space-y-8 leading-relaxed text-xl font-light text-slate-300">
                                <p>Wnode was created as a community-owned, community-governed, and AI-powered planetary compute mesh.</p>
                                <p>As the Founder, I established this Constitution to ensure that Wnode remains open, decentralised, transparent, fair, sovereign, and permanently aligned with the interests of its users, node operators, and token holders.</p>
                                <p className="text-blue-100/90 bg-blue-500/5 border-l-2 border-blue-500/30 p-8 rounded-r-3xl italic font-normal">
                                    “Wnode is deliberately built for maximum independence — owning and operating its own critical infrastructure to eliminate reliance on third-party cloud providers and ensure resilience against censorship, deplatforming, or external control.”
                                </p>
                            </div>
                        </div>

                        {/* SECTION 1 */}
                        <div id="section1" className="scroll-mt-32 space-y-12">
                            <h2 className="text-3xl font-bold text-white uppercase tracking-tight font-space-grotesk border-b border-white/5 pb-6">SECTION 1 — DEFINITIONS</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { t: "1.1 Wnode Mesh", d: "The decentralised compute network operated collectively by node operators, governed by the DAO." },
                                    { t: "1.2 DAO", d: "The decentralised autonomous organisation composed of verified token holders and NODLR Souls." },
                                    { t: "1.4 Founder Board", d: "Guardian body responsible for constitutional protection, Steward appointment, and emergency powers." },
                                    { t: "1.8 Infrastructure Manager", d: "Technical authority responsible for uptime, hardware acquisition, and node verification." },
                                    { t: "1.9 Soul", d: "Non-transferable identity token representing a verified individual. Identity over capital." },
                                    { t: "1.20 Core Immutable Provisions", d: "Fundamental rules protected by 100% DAO approval requirements (e.g. 1 Soul = 1 Vote)." }
                                ].map((def, i) => (
                                    <div key={i} className="p-8 bg-white/[0.02] border border-white/10 rounded-3xl space-y-3 hover:bg-white/[0.04] hover:border-blue-500/30 transition-all group">
                                        <h3 className="text-blue-400 font-bold text-xs uppercase tracking-[0.2em] group-hover:text-white transition-colors">{def.t}</h3>
                                        <p className="text-sm text-slate-400 leading-relaxed">{def.d}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* SECTION 2 */}
                        <div id="section2" className="scroll-mt-32 space-y-12">
                            <h2 className="text-3xl font-bold text-white uppercase tracking-tight font-space-grotesk border-b border-white/5 pb-6">SECTION 2 — GOVERNANCE HIERARCHY</h2>
                            <div className="space-y-8">
                                <div className="relative p-10 bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 rounded-[2.5rem] overflow-hidden">
                                    <div className="relative z-10 space-y-4">
                                        <h3 className="text-2xl font-bold text-white uppercase tracking-tighter">2.1 The DAO (Wnode DAO)</h3>
                                        <p className="text-base text-slate-300 leading-relaxed">The sovereign community governance body of the Wnode Mesh. Votes on proposals, controls the Treasury, and ratifies constitutional amendments. Strictly <span className="text-blue-400 font-black">1 Soul = 1 Vote</span>.</p>
                                    </div>
                                    <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full"></div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4">
                                        <h4 className="text-xs font-black text-white uppercase tracking-[0.3em]">Progressive Decentralisation</h4>
                                        <p className="text-xs text-slate-500 leading-relaxed">After 24 months or 50k active Voting Souls, two (2) seats on the Founder Board transition to DAO-elected members (requiring 77% approval).</p>
                                    </div>
                                    <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4">
                                        <h4 className="text-xs font-black text-white uppercase tracking-[0.3em]">Governance Board</h4>
                                        <p className="text-xs text-slate-500 leading-relaxed">Responsible for operational oversight, treasury supervision, and ensuring DAO decisions are correctly implemented.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SECTION 3 */}
                        <div id="section3" className="scroll-mt-32 space-y-12">
                            <h2 className="text-3xl font-bold text-white uppercase tracking-tight font-space-grotesk border-b border-white/5 pb-6">SECTION 3 — SOULS, IDENTITY & VOTING RIGHTS</h2>
                            <div className="space-y-8 text-lg font-light leading-relaxed">
                                <p>A Soul is the core identity primitive of the Wnode Mesh. It represents a verified human individual and is non-transferable, ensuring that governance is based on people, not capital.</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                                    <div className="space-y-4 p-8 bg-white/[0.02] rounded-3xl border border-white/5">
                                        <span className="inline-block px-3 py-1 bg-slate-500/20 text-slate-500 font-bold text-[10px] uppercase tracking-widest rounded-full">Locked Souls</span>
                                        <p className="text-sm text-slate-400">Identity-only, non-voting. Ensures identity integrity without granting governance power prematurely.</p>
                                    </div>
                                    <div className="space-y-4 p-8 bg-blue-500/5 rounded-3xl border border-blue-500/10">
                                        <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-500 font-bold text-[10px] uppercase tracking-widest rounded-full">Voting Souls</span>
                                        <p className="text-sm text-slate-300 font-medium">Full DAO voting rights. Earned through NODLR verification, technical standing, and node operation.</p>
                                    </div>
                                </div>
                                <p className="text-sm font-bold text-center text-blue-500/50 uppercase tracking-[0.5em] pt-8">No Person may ever hold more than one Voting Soul.</p>
                            </div>
                        </div>

                        {/* SECTION 4 */}
                        <div id="section4" className="scroll-mt-32 space-y-12">
                            <h2 className="text-3xl font-bold text-white uppercase tracking-tight font-space-grotesk border-b border-white/5 pb-6">SECTION 4 — NODES & NODLRS</h2>
                            <div className="space-y-8">
                                <p className="text-lg leading-relaxed text-slate-400">Nodes form the physical backbone of the network. NODLRs are verified node operators who have passed identity and technical verification to earn full participation rights.</p>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {[
                                        { t: "Uptime", d: "Nodes must maintain high reliability standards." },
                                        { t: "Verification", d: "Periodic checks ensure hardware compliance." },
                                        { t: "Rewards", d: "Paid based on actual compute contribution." }
                                    ].map((item, i) => (
                                        <div key={i} className="p-6 bg-white/[0.01] border border-white/5 rounded-2xl">
                                            <h5 className="text-white font-bold text-xs uppercase tracking-widest mb-2">{item.t}</h5>
                                            <p className="text-[11px] text-slate-500">{item.d}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* SECTION 5 */}
                        <div id="section5" className="scroll-mt-32 space-y-12">
                            <h2 className="text-3xl font-bold text-white uppercase tracking-tight font-space-grotesk border-b border-white/5 pb-6">SECTION 5 — GOVERNANCE PROCEDURES</h2>
                            <div className="space-y-8">
                                <div className="overflow-hidden rounded-3xl border border-white/5 bg-white/[0.01] shadow-2xl">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-white/[0.03] border-b border-white/10 text-blue-500 uppercase tracking-widest text-[10px]">
                                            <tr>
                                                <th className="px-8 py-6 font-black">Proposal Category</th>
                                                <th className="px-8 py-6 font-black text-center">Approval Threshold</th>
                                                <th className="px-8 py-6 font-black text-right">Quorum</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5 text-slate-400 font-mono">
                                            <tr><td className="px-8 py-6 uppercase tracking-widest font-sans font-bold text-white/60">Operational</td><td className="px-8 py-6 text-center text-blue-400 font-bold">{">"}66% YES</td><td className="px-8 py-6 text-right">20%</td></tr>
                                            <tr><td className="px-8 py-6 uppercase tracking-widest font-sans font-bold text-white/60">Economic</td><td className="px-8 py-6 text-center text-blue-400 font-bold">{">"}80% YES</td><td className="px-8 py-6 text-right">25%</td></tr>
                                            <tr><td className="px-8 py-6 uppercase tracking-widest font-sans font-bold text-white/60">Treasury</td><td className="px-8 py-6 text-center text-blue-400 font-bold">{">"}70% YES</td><td className="px-8 py-6 text-right">30%</td></tr>
                                            <tr><td className="px-8 py-6 uppercase tracking-widest font-sans font-bold text-white/60">Constitutional</td><td className="px-8 py-6 text-center text-blue-400 font-bold">{">"}85% YES</td><td className="px-8 py-6 text-right">40%</td></tr>
                                            <tr className="bg-blue-500/5"><td className="px-8 py-6 uppercase tracking-widest font-sans font-black text-blue-400">Core Immutable</td><td className="px-8 py-6 text-center text-blue-400 font-black">100% YES</td><td className="px-8 py-6 text-right font-black">50%</td></tr>
                                        </tbody>
                                    </table>
                                </div>
                                <p className="text-xs text-slate-600 text-center uppercase tracking-widest font-bold">Voting period: 7 days (unless emergency)</p>
                            </div>
                        </div>

                        {/* SECTION 6 */}
                        <div id="section6" className="scroll-mt-32 space-y-12">
                            <h2 className="text-3xl font-bold text-white uppercase tracking-tight font-space-grotesk border-b border-white/5 pb-6">SECTION 6 — THE STEWARDSHIP LICENCE</h2>
                            <div className="space-y-8">
                                <p className="text-lg leading-relaxed text-slate-400 italic">“The Stewardship Licence is a commercial licence, not a governance role. The Steward is an operator, not a governor.”</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <h4 className="text-blue-500 font-black uppercase tracking-widest text-[10px]">Steward Rights</h4>
                                        <ul className="space-y-2 text-sm text-slate-400 font-light">
                                            <li>• Manage UX, onboarding, and platform systems</li>
                                            <li>• Oversee commercial operations & support</li>
                                            <li>• Receive defined revenue share share share share</li>
                                        </ul>
                                    </div>
                                    <div className="space-y-4">
                                        <h4 className="text-blue-500 font-black uppercase tracking-widest text-[10px]">Limitations</h4>
                                        <ul className="space-y-2 text-sm text-slate-400 font-light">
                                            <li>• No modification of governance rules</li>
                                            <li>• No control over Treasury or Token supply</li>
                                            <li>• Removable by Founder Board for negligence</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SECTION 7 */}
                        <div id="section7" className="scroll-mt-32 space-y-12">
                            <h2 className="text-3xl font-bold text-white uppercase tracking-tight font-space-grotesk border-b border-white/5 pb-6">SECTION 7 — Affiliate Tree ASSETS</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="group p-10 bg-white/[0.02] border border-white/5 rounded-[2.5rem] space-y-6 hover:bg-blue-500/5 hover:border-blue-500/20 transition-all">
                                    <div className="space-y-2">
                                        <h4 className="text-white font-bold uppercase tracking-widest text-sm group-hover:text-blue-400 transition-colors">Founder Affiliate Trees</h4>
                                        <p className="text-xs text-blue-500 font-bold uppercase tracking-widest">Infinite Depth</p>
                                    </div>
                                    <p className="text-sm text-slate-400 leading-relaxed">Permanent commercial assets assigned to Founders. Immutable entitlement to 3% of the entire Affiliate Tree to infinity.</p>
                                </div>
                                <div className="group p-10 bg-white/[0.02] border border-white/5 rounded-[2.5rem] space-y-6 hover:bg-white/[0.04] transition-all">
                                    <div className="space-y-2">
                                        <h4 className="text-white font-bold uppercase tracking-widest text-sm group-hover:text-blue-400 transition-colors">NODLR Affiliate Trees</h4>
                                        <p className="text-xs text-slate-600 font-bold uppercase tracking-widest">L1 + L2 Only</p>
                                    </div>
                                    <p className="text-sm text-slate-400 leading-relaxed">Commercial assets representing referral lineage. Strictly limited to two levels: Level 1 (3%) and Level 2 (7%).</p>
                                </div>
                            </div>
                            <p className="text-[10px] text-center text-slate-600 uppercase tracking-[0.4em] font-black italic">Affiliate Tree Assets have zero influence over governance power.</p>
                        </div>

                        {/* SECTION 8, 9, 10 */}
                        <div id="section8" className="scroll-mt-32 space-y-12">
                            <h2 className="text-3xl font-bold text-white uppercase tracking-tight font-space-grotesk border-b border-white/5 pb-6">SECTION 8 — EMERGENCY POWERS</h2>
                            <p className="text-lg leading-relaxed text-slate-400">Emergency powers exist solely to protect the Mesh from catastrophic harm. They are time-limited (max 72h initially) and require mandatory DAO oversight and full public reporting after activation.</p>
                        </div>

                        <div id="section9" className="scroll-mt-32 space-y-12">
                            <h2 className="text-3xl font-bold text-white uppercase tracking-tight font-space-grotesk border-b border-white/5 pb-6">SECTION 9 — TOKENOMICS & ECONOMIC MODEL</h2>
                            <div className="relative p-12 bg-white/[0.01] border border-white/5 rounded-[3rem] overflow-hidden group">
                                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                                    <div className="space-y-6 text-center md:text-left">
                                        <h3 className="text-2xl font-bold text-white uppercase tracking-tighter">Economic Utility, <br/>Zero Political Power</h3>
                                        <p className="text-sm text-slate-400 leading-relaxed">Tokens are economic assets used for staking, incentives, and network activity. They confer no voting rights. This separation protects the Mesh from plutocratic capture.</p>
                                    </div>
                                    <div className="space-y-4 font-mono text-[11px] text-blue-500/70 border-l border-white/5 pl-12 hidden md:block">
                                        <p>Node Operators: 70%</p>
                                        <p>Sales Source: 10%</p>
                                        <p>Steward: 7%</p>
                                        <p>Affiliate L1: 3%</p>
                                        <p>Affiliate L2: 7%</p>
                                        <p>Founder Override: 3%</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SECTION 11, 12, 13 */}
                        <div id="section11" className="scroll-mt-32 space-y-12">
                            <h2 className="text-3xl font-bold text-white uppercase tracking-tight font-space-grotesk border-b border-white/5 pb-6">SECTION 11 — SANCTIONS & APPEALS</h2>
                            <div className="space-y-8">
                                <p className="text-lg text-slate-400 font-light leading-relaxed">Sanctions (node suspension, Tree freezing, Soul revocation) are applied only for documented cause such as identity fraud, network attacks, or severe misconduct.</p>
                                <div className="p-10 bg-red-500/5 border border-red-500/20 rounded-[2.5rem] space-y-6">
                                    <h4 className="text-red-400 font-black uppercase tracking-widest text-[10px]">Due Process Guaranteed</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-slate-400">
                                        <p>1. Written notice stating grounds & evidence.</p>
                                        <p>2. 7-day window to respond with mitigating evidence.</p>
                                        <p>3. Right to appeal to Governance Board, then Founder Board.</p>
                                        <p>4. Final escalation via Emergency Proposal to the DAO.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div id="section12" className="scroll-mt-32 space-y-12">
                            <div className="text-center space-y-4">
                                <h2 className="text-3xl font-bold text-white uppercase tracking-tight font-space-grotesk">SECTION 12 — FINAL PROVISIONS</h2>
                                <p className="text-[10px] text-blue-500 font-black uppercase tracking-[0.4em]">Core Immutable Foundations</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[
                                    "1 Soul = 1 Vote",
                                    "Soul Non-Transferability",
                                    "Economic/Governance Separation",
                                    "Founder’s 3% Entitlement",
                                    "Fixed/Capped Token Supply",
                                    "Infrastructure Sovereignty"
                                ].map((p, i) => (
                                    <div key={i} className="group p-6 bg-white/[0.02] rounded-2xl border border-white/5 hover:border-blue-500/40 transition-all text-center">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest group-hover:text-white transition-colors">{p}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div id="section13" className="scroll-mt-32 space-y-16">
                            <div className="space-y-4">
                                <h2 className="text-4xl md:text-5xl font-bold text-white uppercase tracking-tighter font-space-grotesk">SECTION 13 — SOVEREIGNTY</h2>
                                <p className="text-lg text-blue-400/70 font-light max-w-2xl">Ensuring maximum resistance to censorship, deplatforming, and external control through full technological self-reliance.</p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-8">
                                    <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl space-y-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                                                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-7 0V4" /></svg>
                                            </div>
                                            <h4 className="text-white font-bold uppercase tracking-widest text-sm">Physical Backbone</h4>
                                        </div>
                                        <ul className="space-y-4 text-xs text-slate-500 font-mono">
                                            <li className="flex gap-4"><span className="text-blue-500">01</span> Own and operate physical bare-metal servers</li>
                                            <li className="flex gap-4"><span className="text-blue-500">02</span> Self-hosted primary development environment</li>
                                            <li className="flex gap-4"><span className="text-blue-500">03</span> Independent power resilience (UPS & Solar)</li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="space-y-8">
                                    <div className="p-8 bg-gradient-to-br from-blue-600/10 to-transparent border border-blue-500/20 rounded-3xl space-y-6 relative overflow-hidden">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
                                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                            </div>
                                            <h4 className="text-white font-bold uppercase tracking-widest text-sm">Recursive AI LLM</h4>
                                        </div>
                                        <p className="text-sm text-slate-300 leading-relaxed italic">
                                            “Wnode shall own and operate its own proprietary recursive AI LLM for intelligent job routing, autonomous customer support, and continuous protocol optimization.”
                                        </p>
                                        <div className="absolute top-0 right-0 p-2">
                                            <span className="text-[8px] font-black text-blue-500/40 uppercase tracking-[0.3em]">Proprietary Node</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* FINAL SIGNATURE */}
                        <div className="pt-20 text-center space-y-16 border-t border-white/5">
                            <div className="space-y-10">
                                <p className="text-[10px] uppercase tracking-[0.5em] text-slate-700 font-black">Ratified May 13th 2026</p>
                                <div className="space-y-4">
                                    <div className="inline-block p-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-4">
                                        <div className="px-8 py-3 bg-black rounded-full">
                                            <p className="text-white font-space-grotesk font-black uppercase tracking-[0.2em] text-3xl">Stephen Soos</p>
                                        </div>
                                    </div>
                                    <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-bold max-w-sm mx-auto leading-relaxed">Founder • Architect • Initial Steward • Initial Governance Board Member</p>
                                    <p className="text-[10px] text-blue-500/80 font-mono font-black">WUID: 1000001-0426-01-AA</p>
                                </div>
                            </div>
                            
                            <div className="p-10 border border-white/5 bg-white/[0.01] rounded-[2.5rem] max-w-2xl mx-auto shadow-inner">
                                <p className="text-[10px] text-slate-600 leading-relaxed uppercase tracking-[0.3em] font-bold">
                                    Disclaimer: This page is a web rendering of the Wnode Constitution v2.1. In case of discrepancy, the signed PDF version prevails.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
