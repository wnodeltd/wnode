"use client";

import AppLayout from "../../../components/layout/AppLayout";

export default function MeshGovernancePage() {
    return (
        <AppLayout>
            <div className="bg-black text-white min-h-screen pt-40 pb-20 px-8">
                <div className="max-w-4xl mx-auto space-y-12">
                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight uppercase font-space-grotesk">Wnode Mesh</h1>
                        <h2 className="text-sm tracking-[0.5em] text-blue-500 uppercase font-bold">Protocol Governance</h2>
                    </div>

                    <div className="space-y-16 pt-12">
                        {/* CONSTITUTION START */}
                        <div className="space-y-12 text-white/80 leading-relaxed">
                            <div className="space-y-4">
                                <h2 className="text-5xl font-bold text-white tracking-tighter uppercase">THE MESH CONSTITUTION</h2>
                                <h3 className="text-xl italic text-slate-400">Sovereign Governance Charter of the Wnode Mesh Compute</h3>
                                <p className="text-xs uppercase tracking-widest text-slate-600">Version 1.0 — Immutable Smart Contract Edition*</p>
                            </div>

                            <hr className="border-white/10" />

                            <div className="space-y-6">
                                <h2 className="text-3xl font-bold text-white uppercase tracking-tight">PREAMBLE</h2>
                                <p>
                                    The Mesh is a sovereign, decentralised compute network operated by a global community of human participants (“Nodlrs”) and their lawful entities. This Constitution establishes the immutable rules, rights, economic guarantees, governance processes, and enforcement mechanisms that protect the Mesh, its participants, and its economic integrity.
                                </p>
                                <p className="font-bold text-white">
                                    This Constitution is encoded as a <span className="text-blue-400">smart contract</span>. It is <span className="text-white font-medium">immutable</span>, <span className="text-white font-medium">tamper‑proof</span>, and <span className="text-white font-medium">binding on all participants</span>.
                                </p>
                                <p>
                                    No Steward, developer, founder, corporation, or governance body may override, weaken, or reinterpret any constitutional clause except through the amendment process defined herein.
                                </p>
                            </div>

                            <hr className="border-white/10" />

                            {/* ARTICLE I */}
                            <div className="space-y-8">
                                <h2 className="text-3xl font-bold text-white uppercase tracking-tight">ARTICLE I — DEFINITION AND SOVEREIGNTY OF THE NODLR</h2>
                                
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold text-blue-400">Section 1 — Definition of a Nodlr</h3>
                                    <p>A <span className="text-white font-medium">Nodlr</span> may be:</p>
                                    <ul className="list-disc pl-6 space-y-2 text-slate-400">
                                        <li>A verified human individual</li>
                                        <li>A legally registered company</li>
                                        <li>A partnership</li>
                                        <li>A trust</li>
                                        <li>Any lawful entity capable of entering into agreements</li>
                                    </ul>
                                    <p className="pt-4">Every Nodlr must designate a <span className="text-white font-medium">Responsible Person</span>, who:</p>
                                    <ul className="list-disc pl-6 space-y-2 text-slate-400">
                                        <li>Is a verified human</li>
                                        <li>Undergoes identity verification</li>
                                        <li>Is accountable for the entity’s conduct</li>
                                        <li>Is bound by the 1 Soul = 1 Vote rule</li>
                                    </ul>
                                    <p className="text-sm italic text-slate-500">Legal entities may operate compute nodes and receive economic rights, but voting rights always map to the Responsible Person.</p>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold text-blue-400">Section 2 — Sovereign Ownership</h3>
                                    <p>Each Nodlr—individual or entity—possesses sovereign ownership over their identity, compute nodes, affiliate network, Founder Network lineage, and economic rights. These rights are <span className="text-white font-medium">permanent, inalienable, non‑revocable, and non‑dilutable.</span></p>
                                </div>

                                <div className="space-y-4 border-l-2 border-blue-500/30 pl-6 py-2 bg-blue-500/5 rounded-r-2xl">
                                    <h3 className="text-xl font-bold text-blue-400">Section 3 — 1 Soul = 1 Vote (Constitutional Rule)</h3>
                                    <div className="space-y-4 text-sm">
                                        <p><span className="text-white font-bold">3.1 Core Principle:</span> Governance power belongs to humans, not corporations. Each verified human receives exactly one vote. Legal entities do not receive independent votes.</p>
                                        <p><span className="text-white font-bold">3.2 Multiple Entities:</span> If a human controls multiple entities, they still receive only one vote.</p>
                                        <p><span className="text-white font-bold">3.3 Entities Barred From Voting:</span> Any entity where the Responsible Person already has a Nodlr account or controls another voting entity is barred from voting.</p>
                                        <p><span className="text-white font-bold">3.4 Anti‑Centralisation:</span> Any attempt to circumvent 1 Soul = 1 Vote is a constitutional breach.</p>
                                    </div>
                                </div>
                            </div>

                            <hr className="border-white/10" />

                            {/* ARTICLE II */}
                            <div className="space-y-8">
                                <h2 className="text-3xl font-bold text-white uppercase tracking-tight">ARTICLE II — ECONOMIC MODEL (IMMUTABLE)</h2>
                                <p>The Mesh economic model is constitutionally fixed and encoded into the smart contract. It cannot be changed without <span className="text-white font-medium">100% consensus</span> of all verified Nodlrs.</p>

                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold text-blue-400">Section 1 — Revenue Allocation</h3>
                                    <div className="overflow-x-auto rounded-2xl border border-white/10">
                                        <table className="w-full text-left text-sm">
                                            <thead className="bg-white/5 text-slate-400 uppercase tracking-widest text-[10px]">
                                                <tr>
                                                    <th className="px-6 py-4 font-bold">Allocation</th>
                                                    <th className="px-6 py-4 font-bold">Percentage</th>
                                                    <th className="px-6 py-4 font-bold">Description</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/10">
                                                <tr>
                                                    <td className="px-6 py-4 text-white font-bold">Sales Source</td>
                                                    <td className="px-6 py-4 text-blue-400 font-bold">10%</td>
                                                    <td className="px-6 py-4 text-slate-400">Paid to the Nodlr who sourced the Mesh Client.</td>
                                                </tr>
                                                <tr>
                                                    <td className="px-6 py-4 text-white font-bold">Compute Node Operator</td>
                                                    <td className="px-6 py-4 text-blue-400 font-bold">70%</td>
                                                    <td className="px-6 py-4 text-slate-400">Paid to the Nodlr operating the compute node.</td>
                                                </tr>
                                                <tr>
                                                    <td className="px-6 py-4 text-white font-bold">Level 1 Affiliate</td>
                                                    <td className="px-6 py-4 text-blue-400 font-bold">3%</td>
                                                    <td className="px-6 py-4 text-slate-400">Paid to the direct referrer of the active Nodlr.</td>
                                                </tr>
                                                <tr>
                                                    <td className="px-6 py-4 text-white font-bold">Level 2 Affiliate</td>
                                                    <td className="px-6 py-4 text-blue-400 font-bold">7%</td>
                                                    <td className="px-6 py-4 text-slate-400">Paid to the referrer of the Level 1 affiliate.</td>
                                                </tr>
                                                <tr>
                                                    <td className="px-6 py-4 text-white font-bold">Steward Commission</td>
                                                    <td className="px-6 py-4 text-blue-400 font-bold">7%</td>
                                                    <td className="px-6 py-4 text-slate-400">Paid for operations, maintenance, and compliance.</td>
                                                </tr>
                                                <tr>
                                                    <td className="px-6 py-4 text-white font-bold">Founder Override</td>
                                                    <td className="px-6 py-4 text-blue-400 font-bold">3%</td>
                                                    <td className="px-6 py-4 text-slate-400">Paid infinitely deep within the tree-local network.</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            <hr className="border-white/10" />

                            {/* ARTICLE III */}
                            <div className="space-y-8">
                                <h2 className="text-3xl font-bold text-white uppercase tracking-tight">ARTICLE III — GOVERNANCE STRUCTURE</h2>
                                
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-bold text-blue-400">Section 1 — Governance Layers</h3>
                                        <p className="text-sm text-slate-400">1. Constitutional (Identity, Economics) | 2. Operational (Platform rules) | 3. Automatic (Maintenance)</p>
                                    </div>

                                    <div className="p-8 bg-white/5 border border-white/10 rounded-3xl space-y-4">
                                        <h3 className="text-xl font-bold text-white">Constitutional Governance</h3>
                                        <p className="text-sm">Matters like economic models and voting rules require <span className="text-white font-bold underline decoration-blue-500 decoration-2">100% consensus</span>. A single “No” vote causes the proposal to fail.</p>
                                    </div>

                                    <div className="p-8 bg-white/5 border border-white/10 rounded-3xl space-y-4">
                                        <h3 className="text-xl font-bold text-white">Operational Governance</h3>
                                        <p className="text-sm">Matters like UI/UX changes and feature additions require a <span className="text-white font-bold underline decoration-purple-500 decoration-2">77% supermajority</span>.</p>
                                    </div>
                                </div>
                            </div>

                            <hr className="border-white/10" />

                            {/* ARTICLE IV */}
                            <div className="space-y-8">
                                <h2 className="text-3xl font-bold text-white uppercase tracking-tight">ARTICLE IV — BREACHES, SUSPENSIONS, AND BANS</h2>
                                
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold text-blue-400">Section 1 — Immutable Asset Protection</h3>
                                    <p>Regardless of breach, suspension, or ban, all economic rights—including revenue and lineage—remain <span className="text-white font-medium">permanent and intact</span>.</p>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold text-red-400">Section 3 — Permanent Ban</h3>
                                    <p>Applied only for fraud, crimes against the Mesh, or attempts to centralise power. Loses platform access but <span className="text-white font-medium">continues to receive all revenue permanently.</span></p>
                                </div>
                            </div>

                            <hr className="border-white/10" />

                            {/* ARTICLE V & VI */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-4">
                                    <h2 className="text-2xl font-bold text-white uppercase tracking-tight">ARTICLE V — STEWARDSHIP</h2>
                                    <p className="text-sm text-slate-400">The Steward is a <span className="text-white">service provider</span>, not an owner. They maintain uptime and security but cannot change economic rules or influence governance.</p>
                                </div>
                                <div className="space-y-4">
                                    <h2 className="text-2xl font-bold text-white uppercase tracking-tight">ARTICLE VI — AMENDMENTS</h2>
                                    <p className="text-sm text-slate-400">Constitutional amendments require <span className="text-white">100% consensus</span> and a public proposal. Operational changes require a <span className="text-white">77% supermajority</span>.</p>
                                </div>
                            </div>

                            <hr className="border-white/10" />

                            {/* PERPETUITY */}
                            <div className="pt-12 text-center space-y-6">
                                <h2 className="text-3xl font-bold text-white tracking-tighter uppercase">ARTICLE VII — PERPETUITY</h2>
                                <p className="text-xl text-blue-400 font-medium">Wnode Mesh is community‑owned forever.</p>
                                <div className="p-8 border border-blue-500/20 bg-blue-500/5 rounded-full inline-block">
                                    <p className="text-xs uppercase tracking-[0.4em] text-blue-500 font-bold">Immutable Smart Contract Enforced</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
