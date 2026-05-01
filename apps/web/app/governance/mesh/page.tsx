"use client";

import AppLayout from "../../../components/layout/AppLayout";

export default function MeshGovernancePage() {
    return (
        <AppLayout>
            <div className="bg-black text-white min-h-screen pt-40 pb-20 px-8">
                <div className="max-w-4xl mx-auto space-y-12 font-inter">
                    {/* HEADER */}
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
                                <p className="text-xs uppercase tracking-widest text-slate-600">Version 1.1 — Immutable Smart Contract Edition</p>
                            </div>

                            <hr className="border-white/10" />

                            {/* PREAMBLE */}
                            <div className="space-y-6">
                                <h2 className="text-3xl font-bold text-white uppercase tracking-tight">PREAMBLE</h2>
                                <p>
                                    The Mesh is a sovereign, decentralised compute network operated by a global community of human participants (“Nodlrs”) and their lawful entities.
                                    This Constitution establishes the immutable rules, rights, economic guarantees, governance processes, and enforcement mechanisms that protect the Mesh, its participants, and its economic integrity.
                                </p>
                                <p className="font-bold text-white border-l-4 border-blue-500 pl-6 py-2 bg-blue-500/5">
                                    This Constitution is encoded as a <span className="text-blue-400">smart contract</span>. It is <span className="text-white font-medium">immutable</span>, <span className="text-white font-medium">tamper‑proof</span>, and <span className="text-white font-medium">binding on all participants</span>.
                                </p>
                                <p>
                                    No Steward, developer, founder, corporation, or governance body may override or reinterpret any constitutional clause except through the amendment process defined herein.
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
                                        <li>Any lawful entity capable of entering agreements</li>
                                    </ul>
                                    <p className="pt-4">Each Nodlr must designate a <span className="text-white font-medium">Responsible Person</span>, who:</p>
                                    <ul className="list-disc pl-6 space-y-2 text-slate-400">
                                        <li>Is a verified human</li>
                                        <li>Undergoes identity verification</li>
                                        <li>Is accountable for the entity’s conduct</li>
                                        <li>Is bound by the 1 Soul = 1 Vote rule</li>
                                    </ul>
                                    <p className="text-sm italic text-slate-500 bg-slate-500/5 p-4 rounded-xl border border-slate-500/20">
                                        Legal entities may operate compute nodes and receive economic rights, but voting rights always map to the Responsible Person.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold text-blue-400">Section 2 — Sovereign Ownership</h3>
                                    <p>Each Nodlr possesses sovereign ownership over:</p>
                                    <ul className="list-disc pl-6 space-y-2 text-slate-400">
                                        <li>Their identity</li>
                                        <li>Their compute nodes</li>
                                        <li>Their affiliate network</li>
                                        <li>Their Founder Network lineage</li>
                                        <li>Their economic rights</li>
                                    </ul>
                                    <p>These rights are <span className="text-white font-medium italic">permanent, inalienable, non‑revocable, and non‑dilutable.</span></p>
                                </div>

                                <div className="space-y-4 border-l-2 border-blue-500/30 pl-6 py-4 bg-blue-500/5 rounded-r-2xl">
                                    <h3 className="text-xl font-bold text-blue-400">Section 3 — 1 Soul = 1 Vote (Constitutional Rule)</h3>
                                    <ul className="space-y-3 text-sm">
                                        <li><span className="text-white font-bold">•</span> Governance power belongs to humans, not corporations.</li>
                                        <li><span className="text-white font-bold">•</span> Each verified human receives exactly one vote.</li>
                                        <li><span className="text-white font-bold">•</span> Multiple entities controlled by the same human do not create additional votes.</li>
                                        <li><span className="text-white font-bold">•</span> Any attempt to circumvent this rule is a constitutional breach.</li>
                                    </ul>
                                </div>
                            </div>

                            <hr className="border-white/10" />

                            {/* ARTICLE II */}
                            <div className="space-y-8">
                                <h2 className="text-3xl font-bold text-white uppercase tracking-tight">ARTICLE II — ECONOMIC MODEL (IMMUTABLE)</h2>
                                <p>The Mesh economic model is constitutionally fixed and encoded into the smart contract. It cannot be changed without <span className="text-white font-medium underline decoration-blue-500 decoration-2 underline-offset-4">100% consensus</span> of all verified Nodlrs.</p>

                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold text-blue-400">Section 1 — Revenue Allocation</h3>
                                    <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/5">
                                        <table className="w-full text-left text-sm">
                                            <thead className="border-b border-white/10 text-slate-400 uppercase tracking-widest text-[10px]">
                                                <tr>
                                                    <th className="px-6 py-4 font-bold">Allocation</th>
                                                    <th className="px-6 py-4 font-bold">Percentage</th>
                                                    <th className="px-6 py-4 font-bold">Description</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/10">
                                                {[
                                                    { label: "Sales Source", value: "10%", desc: "Paid to the Nodlr who sourced the Mesh Client." },
                                                    { label: "Compute Node Operator", value: "70%", desc: "Paid to the Nodlr operating the compute node." },
                                                    { label: "Level 1 Affiliate", value: "3%", desc: "Paid to the direct referrer." },
                                                    { label: "Level 2 Affiliate", value: "7%", desc: "Paid to the referrer of the Level 1 affiliate." },
                                                    { label: "Steward Commission", value: "7%", desc: "Paid for operations, maintenance, and compliance." },
                                                    { label: "Founder Override", value: "3%", desc: "Paid infinitely deep within the tree‑local network." },
                                                ].map((row, i) => (
                                                    <tr key={i} className="hover:bg-white/5 transition-colors">
                                                        <td className="px-6 py-4 text-white font-bold">{row.label}</td>
                                                        <td className="px-6 py-4 text-blue-400 font-bold font-mono">{row.value}</td>
                                                        <td className="px-6 py-4 text-slate-400">{row.desc}</td>
                                                    </tr>
                                                ))}
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
                                        <ol className="list-decimal pl-6 space-y-1 text-slate-400">
                                            <li><span className="text-white font-medium">Constitutional</span> — Identity, economics, sovereignty</li>
                                            <li><span className="text-white font-medium">Operational</span> — Platform rules, processes, improvements</li>
                                            <li><span className="text-white font-medium">Automatic</span> — Maintenance and system‑level logic</li>
                                        </ol>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="p-8 bg-white/5 border border-white/10 rounded-3xl space-y-4">
                                            <h3 className="text-xl font-bold text-white">Constitutional Governance</h3>
                                            <ul className="space-y-2 text-sm text-slate-400">
                                                <li>• Requires <span className="text-white font-bold">100% consensus</span></li>
                                                <li>• Any <span className="text-red-500 font-bold uppercase">NO</span> vote causes immediate failure</li>
                                                <li>• Covers identity, economics, and sovereignty</li>
                                            </ul>
                                        </div>

                                        <div className="p-8 bg-white/5 border border-white/10 rounded-3xl space-y-4">
                                            <h3 className="text-xl font-bold text-white">Operational Governance</h3>
                                            <ul className="space-y-2 text-sm text-slate-400">
                                                <li>• Covers UI/UX, stability, growth, infrastructure</li>
                                                <li>• Requires <span className="text-white font-bold underline decoration-blue-500 decoration-2 underline-offset-4">&gt;50% YES</span> with quorum</li>
                                                <li>• Faster, flexible, iterative approach</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <hr className="border-white/10" />

                            {/* ARTICLE IV */}
                            <div className="space-y-8">
                                <h2 className="text-3xl font-bold text-white uppercase tracking-tight">ARTICLE IV — BREACHES, SUSPENSIONS, AND BANS</h2>
                                
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold text-blue-400">Section 1 — Immutable Asset Protection</h3>
                                    <p>Regardless of breach, suspension, or ban, all economic rights remain <span className="text-white font-bold">permanent and intact</span>.</p>
                                </div>

                                <div className="space-y-4 p-8 bg-red-500/5 border border-red-500/20 rounded-3xl">
                                    <h3 className="text-xl font-bold text-red-400">Section 3 — Permanent Ban</h3>
                                    <p className="pb-4">Applied only for:</p>
                                    <ul className="list-disc pl-6 space-y-2 text-slate-400">
                                        <li>Fraud</li>
                                        <li>Crimes against the Mesh</li>
                                        <li>Attempts to centralise power</li>
                                    </ul>
                                    <p className="pt-4 italic text-slate-300">Banned Nodlrs lose platform access but retain all economic rights permanently.</p>
                                </div>
                            </div>

                            <hr className="border-white/10" />

                            {/* ARTICLE V, VI, VII */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-4">
                                    <h2 className="text-2xl font-bold text-white uppercase tracking-tight">ARTICLE V — STEWARDSHIP</h2>
                                    <p className="text-sm text-slate-400">
                                        The Steward is a <span className="text-white font-medium">service provider</span>, not an owner. 
                                        They maintain uptime, security, and operational integrity but cannot change economic rules or influence governance.
                                    </p>
                                </div>
                                <div className="space-y-4">
                                    <h2 className="text-2xl font-bold text-white uppercase tracking-tight">ARTICLE VI — AMENDMENTS</h2>
                                    <ul className="text-sm text-slate-400 space-y-2">
                                        <li>• Constitutional amendments require <span className="text-white">100% consensus</span></li>
                                        <li>• Operational changes require a <span className="text-white">supermajority</span></li>
                                        <li>• All amendments must be public and transparent</li>
                                    </ul>
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

                            <hr className="border-white/10 pt-20" />

                            {/* OPERATIONAL RULES SECTION */}
                            <div className="space-y-12">
                                <div className="space-y-4">
                                    <h2 className="text-5xl font-bold text-white tracking-tighter uppercase">OPERATIONAL GOVERNANCE RULES</h2>
                                    <p className="text-xs uppercase tracking-widest text-blue-500 font-bold">GOVERNANCE RULES v1.0</p>
                                </div>

                                <div className="space-y-12">
                                    {/* 1. Nodesoul */}
                                    <div className="space-y-4">
                                        <h3 className="text-2xl font-bold text-white">1. Nodesoul (Identity & Voting)</h3>
                                        <ul className="list-disc pl-6 space-y-2 text-slate-400">
                                            <li>Nodesoul is a soulbound <span className="text-white">ERC721Votes</span> token.</li>
                                            <li><span className="text-white font-bold">1 Soul = 1 vote.</span></li>
                                            <li>Non‑transferable, non‑tradable.</li>
                                            <li>Minted only after Stripe verification.</li>
                                            <li>Burned on sale, death, fraud, or closure.</li>
                                            <li>NODLR accounts can be sold; <span className="text-red-400">Souls cannot.</span></li>
                                            <li>New owners receive a new Soul.</li>
                                        </ul>
                                    </div>

                                    {/* 2. Proposal Types */}
                                    <div className="space-y-6">
                                        <h3 className="text-2xl font-bold text-white">2. Proposal Types</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="p-6 bg-blue-500/5 border border-blue-500/20 rounded-2xl space-y-3">
                                                <h4 className="font-bold text-blue-400 uppercase text-xs tracking-widest">Constitutional</h4>
                                                <p className="text-xs text-slate-500">Affects identity, economics, or sovereignty.</p>
                                                <ul className="text-sm space-y-1">
                                                    <li>• Window: <span className="text-white">14 days</span></li>
                                                    <li>• Threshold: <span className="text-white">100% YES</span></li>
                                                    <li>• Any NO = instant failure</li>
                                                </ul>
                                            </div>
                                            <div className="p-6 bg-purple-500/5 border border-purple-500/20 rounded-2xl space-y-3">
                                                <h4 className="font-bold text-purple-400 uppercase text-xs tracking-widest">Operational</h4>
                                                <p className="text-xs text-slate-500">UI/UX, stability, growth, infrastructure.</p>
                                                <ul className="text-sm space-y-1">
                                                    <li>• Window: <span className="text-white">5 days</span></li>
                                                    <li>• Threshold: <span className="text-white font-bold">&gt;50% YES</span></li>
                                                    <li>• Quorum = votes cast</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 3. Proposal Lifecycle */}
                                    <div className="space-y-4">
                                        <h3 className="text-2xl font-bold text-white">3. Proposal Lifecycle</h3>
                                        <div className="flex flex-col space-y-4">
                                            {[
                                                "Draft",
                                                "Endorsement phase (minimum support threshold)",
                                                "On‑chain vote",
                                                "Execution via Timelock"
                                            ].map((step, i) => (
                                                <div key={i} className="flex items-center space-x-4">
                                                    <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-xs">{i+1}</div>
                                                    <div className="text-slate-300">{step}</div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-6 p-6 bg-white/5 rounded-2xl border border-white/10 text-sm space-y-2">
                                            <p className="text-white font-bold underline decoration-blue-500 underline-offset-4">Re‑proposal limits:</p>
                                            <ul className="list-disc pl-6 text-slate-400 space-y-1">
                                                <li>30‑day cooldown</li>
                                                <li>Must be materially changed</li>
                                                <li>Max 2 attempts per proposer per 12 months</li>
                                                <li>Max 3 total attempts per topic</li>
                                            </ul>
                                            <p className="pt-2 text-xs text-slate-500 italic">Votes are final.</p>
                                        </div>
                                    </div>

                                    {/* 4. Steward Licence */}
                                    <div className="space-y-6">
                                        <h3 className="text-2xl font-bold text-white">4. Steward Licence (Updated)</h3>
                                        <div className="space-y-4">
                                            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                                                <h4 className="font-bold text-white pb-2">4.1 Conditional Economic Asset</h4>
                                                <p className="text-sm text-slate-400">The Steward Licence is an economic asset that may be sold — but only with <span className="text-white font-bold">87% DAO approval</span>.</p>
                                            </div>
                                            <div className="p-6 bg-red-500/5 border border-red-500/20 rounded-2xl">
                                                <h4 className="font-bold text-red-400 pb-2">4.2 Prohibited Actions</h4>
                                                <p className="text-sm text-slate-400 pb-2">Any unapproved attempt to sell, transfer, assign, pledge, or collateralise results in <span className="text-white font-bold">immediate revocation</span>.</p>
                                            </div>
                                            <div className="p-6 bg-red-900/10 border border-red-500/30 rounded-2xl">
                                                <h4 className="font-bold text-red-400 pb-2">4.3 Automatic Revocation</h4>
                                                <p className="text-sm text-slate-400 pb-2">Triggered by insolvency, bankruptcy, fraud, or criminal misconduct. A revoked Licence <span className="text-white font-medium">cannot be treated as an asset</span> in insolvency.</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 5. DAO Contract Architecture */}
                                    <div className="space-y-4">
                                        <h3 className="text-2xl font-bold text-white">5. DAO Contract Architecture</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                            {[
                                                { tag: "Nodesoul", desc: "Soulbound ERC721Votes" },
                                                { tag: "MembershipMinter", desc: "Mints/burns Souls" },
                                                { tag: "WnodeGovernor", desc: "Voting logic" },
                                                { tag: "WnodeTimelock", desc: "Executes proposals" },
                                                { tag: "Treasury", desc: "Holds funds" },
                                                { tag: "StewardRegistry", desc: "Stores Steward" },
                                                { tag: "$WNODE", desc: "Utility token (not governance)" },
                                            ].map((item, i) => (
                                                <div key={i} className="flex items-center space-x-3 p-4 bg-white/5 rounded-xl border border-white/5">
                                                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-white">{item.tag}</span>
                                                        <span className="text-slate-500 text-xs">{item.desc}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* 6. Separation of Powers */}
                                    <div className="p-8 bg-blue-600/10 border border-blue-500/30 rounded-[2rem] text-center space-y-4">
                                        <h3 className="text-2xl font-bold text-white">6. Separation of Powers</h3>
                                        <div className="flex justify-center items-center space-x-8">
                                            <div className="text-lg font-bold text-blue-400">DAO governs.</div>
                                            <div className="w-px h-8 bg-white/20" />
                                            <div className="text-lg font-bold text-white">Steward operates.</div>
                                        </div>
                                        <p className="text-xs uppercase tracking-widest text-slate-500 pt-4">Neither can override the other’s domain.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
