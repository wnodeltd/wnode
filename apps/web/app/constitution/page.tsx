"use client";

import AppLayout from "../../components/layout/AppLayout";

export default function ConstitutionPage() {
    return (
        <AppLayout>
            <div className="bg-black text-white min-h-screen pt-40 pb-20 px-8">
                <div className="max-w-4xl mx-auto space-y-12 font-inter text-white/80">
                    {/* HEADER */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter uppercase font-space-grotesk text-white">CONSTITUTION</h1>
                            <div className="flex items-center space-x-4">
                                <h2 className="text-sm tracking-[0.5em] text-blue-500 uppercase font-bold">Wnode Mesh v2.0</h2>
                                <span className="h-px w-12 bg-blue-500/30"></span>
                                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-mono">Governing Law: England & Wales</span>
                            </div>
                        </div>
                        
                        <div className="p-6 bg-blue-500/5 border border-blue-500/20 rounded-2xl">
                            <p className="text-lg text-blue-100/90 leading-relaxed italic">
                                “This is the official Wnode Constitution v2.0 — defining the governance, rights, and responsibilities of all participants.”
                            </p>
                        </div>
                    </div>

                    <div className="space-y-16 pt-12">
                        {/* FOUNDERS’ PREAMBLE */}
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <h2 className="text-3xl font-bold text-white uppercase tracking-tight font-space-grotesk">FOUNDERS’ PREAMBLE</h2>
                                <div className="text-sm text-slate-500 space-y-1">
                                    <p>By: Stephen Soos (WUID 1000001-0426-01-AA)</p>
                                    <p className="uppercase tracking-widest text-[10px]">Founder • Architect • Initial Steward • Initial Governance Board Member</p>
                                </div>
                            </div>
                            
                            <div className="space-y-4 leading-relaxed">
                                <p>
                                    Wnode was created as a community-owned, community-governed, and AI-powered planetary compute mesh.
                                </p>
                                <p>
                                    As the Founder, I established this Constitution to ensure that Wnode remains:
                                </p>
                                <ul className="grid grid-cols-2 gap-4">
                                    {["open", "decentralised", "transparent", "fair", "permanently aligned"].map((item) => (
                                        <li key={item} className="flex items-center space-x-2 text-sm text-blue-400 font-medium">
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></span>
                                            <span className="uppercase tracking-widest">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                                <p>
                                    I recognise that the Wnode Mesh belongs to the community, and that governance must always remain accountable to those who operate, support, and rely upon it. This Constitution sets out the governance structure, rights, duties, and safeguards that protect the Wnode Mesh, the DAO, and the community for all future generations.
                                </p>
                                <p className="font-bold text-white border-l-4 border-blue-500 pl-6 py-4 bg-blue-500/5 rounded-r-xl">
                                    It is adopted with the shared commitment that Wnode shall remain a public good, a community asset, and a decentralised network governed by its participants, with a 1 Soul = 1 Vote structure to prevent power centralisation, whale takeover, asset dilution, and to preserve each Node account as an immutable asset.
                                </p>
                            </div>
                        </div>

                        <hr className="border-white/10" />

                        {/* SECTION 1 — DEFINITIONS */}
                        <div className="space-y-8">
                            <h2 className="text-3xl font-bold text-white uppercase tracking-tight font-space-grotesk">SECTION 1 — DEFINITIONS</h2>
                            <p className="text-slate-500 italic text-sm">(This section establishes the precise meaning of all governance terms used throughout the Constitution.)</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[
                                    { title: "1.1 “Wnode Mesh”", desc: "The decentralised compute network operated collectively by node operators, governed by the DAO, and maintained through the governance structures defined in this Constitution." },
                                    { title: "1.2 “DAO” or “Wnode DAO”", desc: "The decentralised autonomous organisation composed of verified token holders and NODLR Souls, empowered to vote on proposals and amend this Constitution." },
                                    { title: "1.3 “Founder”", desc: "Stephen Soos (WUID 1000001-0426-01-AA), the creator and architect of the Wnode Mesh, and the individual who established the initial governance framework." },
                                    { title: "1.4 “Founder Board”", desc: "A governance body composed of four Founder-appointed members, responsible for constitutional guardianship, Steward oversight, and emergency powers." },
                                    { title: "1.5 “Governance Board”", desc: "A body made up of the 4 initial founders responsible for operational oversight, proposal validation, and treasury supervision." },
                                    { title: "1.6 “Steward”", desc: "The holder of the Stewardship Licence, responsible for day-to-day Mesh operations, customer support, and UX management." },
                                    { title: "1.8 “Infrastructure Manager” (IM)", desc: "The technical authority responsible for uptime, reliability, node verification, and emergency response." },
                                    { title: "1.9 “Soul”", desc: "A non-transferable identity token representing a verified individual. Souls are either Locked (identity-only) or Voting (earned via operation)." }
                                ].map((def, i) => (
                                    <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl space-y-2 hover:border-blue-500/20 transition-colors">
                                        <h3 className="text-blue-400 font-bold tracking-tight uppercase text-xs">{def.title}</h3>
                                        <p className="text-sm text-slate-400 leading-relaxed">{def.desc}</p>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="space-y-6 pt-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <h3 className="text-xl font-bold text-white uppercase tracking-tighter">Identity & Commercial Terms</h3>
                                        <ul className="space-y-4">
                                            <li className="space-y-1">
                                                <span className="text-white font-medium text-sm">1.10 “NODLR”</span>
                                                <p className="text-xs text-slate-500">A verified node operator who has passed technical and identity verification and earned a Voting Soul.</p>
                                            </li>
                                            <li className="space-y-1">
                                                <span className="text-white font-medium text-sm">1.12 “Founder Tree”</span>
                                                <p className="text-xs text-slate-500">A hierarchical, non-governance commercial asset representing referral lineage. Transferable, sellable, and permanent.</p>
                                            </li>
                                            <li className="space-y-1">
                                                <span className="text-white font-medium text-sm">1.17 “Wnode Token”</span>
                                                <p className="text-xs text-slate-500">The governance and utility token of the Mesh, used for staking and incentives.</p>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="text-xl font-bold text-white uppercase tracking-tighter">Governance & Action Terms</h3>
                                        <ul className="space-y-4">
                                            <li className="space-y-1">
                                                <span className="text-white font-medium text-sm">1.14 “Governance Proposal”</span>
                                                <p className="text-xs text-slate-500">A proposal submitted to the DAO for operational, economic, or constitutional changes.</p>
                                            </li>
                                            <li className="space-y-1">
                                                <span className="text-white font-medium text-sm">1.15 “Emergency Action”</span>
                                                <p className="text-xs text-slate-500">A time-sensitive action authorised by the Founder Board or IM to protect the Mesh from failure.</p>
                                            </li>
                                            <li className="space-y-1">
                                                <span className="text-white font-medium text-sm">1.16 “Treasury”</span>
                                                <p className="text-xs text-slate-500">The on-chain financial reserves of the DAO, governed by DAO vote.</p>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <hr className="border-white/10" />

                        {/* SECTION 2 — GOVERNANCE HIERARCHY */}
                        <div className="space-y-8">
                            <h2 className="text-3xl font-bold text-white uppercase tracking-tight font-space-grotesk">SECTION 2 — GOVERNANCE HIERARCHY</h2>
                            <p className="text-slate-400">The Wnode governance model is a hybrid constitutional system combining community voting, constitutional guardianship, and technical protection.</p>
                            
                            <div className="space-y-6">
                                <div className="p-8 bg-blue-500/5 border border-blue-500/20 rounded-3xl space-y-4">
                                    <h3 className="text-xl font-bold text-white flex items-center space-x-3">
                                        <span className="text-blue-500 font-mono">2.1</span>
                                        <span>The Wnode DAO</span>
                                    </h3>
                                    <p className="text-sm leading-relaxed">
                                        The DAO is the sovereign community governance body. It votes on proposals, approves amendments, and controls the Treasury. 
                                        <span className="text-blue-400 font-bold block mt-2">Voting is strictly 1 Soul = 1 Vote.</span>
                                    </p>
                                    <div className="grid grid-cols-2 gap-4 text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                                        <div className="flex items-center space-x-2"><span className="w-1 h-1 bg-blue-500 rounded-full"></span><span>No Whale Dominance</span></div>
                                        <div className="flex items-center space-x-2"><span className="w-1 h-1 bg-blue-500 rounded-full"></span><span>No Governance Capture</span></div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {[
                                        { id: "2.3", title: "Founder Board", desc: "Constitutional guardianship and long-term integrity protection. Not elected by DAO." },
                                        { id: "2.4", title: "Governance Board", desc: "Operational oversight, bridging DAO decisions with technical execution." },
                                        { id: "2.5", title: "The Steward", desc: "Commercial operator under licence. Does not control governance or Treasury." },
                                        { id: "2.6", title: "Infrastructure Manager", desc: "Technical authority for uptime and security. Independent of the Steward." }
                                    ].map((item) => (
                                        <div key={item.id} className="p-6 bg-white/[0.03] border border-white/10 rounded-2xl space-y-2">
                                            <span className="text-[10px] font-mono text-blue-500 font-bold">{item.id}</span>
                                            <h4 className="text-lg font-bold text-white">{item.title}</h4>
                                            <p className="text-sm text-slate-400">{item.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <hr className="border-white/10" />

                        {/* SECTION 3 — SOULS & VOTING */}
                        <div className="space-y-8">
                            <h2 className="text-3xl font-bold text-white uppercase tracking-tight font-space-grotesk">SECTION 3 — SOULS, IDENTITY & VOTING RIGHTS</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold text-blue-400">1 Soul = 1 Vote</h3>
                                    <p className="text-sm leading-relaxed text-slate-400">
                                        A soul represents a flesh and blood human being. This model prevents plutocratic control and ensures equal representation for all verified individuals.
                                    </p>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold text-white">Soul Types</h3>
                                    <ul className="space-y-3 text-sm">
                                        <li className="flex items-start space-x-2">
                                            <span className="mt-1.5 w-1.5 h-1.5 bg-slate-500 rounded-full"></span>
                                            <div>
                                                <span className="text-white font-bold block">Locked Souls</span>
                                                <span className="text-slate-500">Identity-only, non-voting. Issued upon entry.</span>
                                            </div>
                                        </li>
                                        <li className="flex items-start space-x-2">
                                            <span className="mt-1.5 w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                                            <div>
                                                <span className="text-blue-400 font-bold block">Voting Souls</span>
                                                <span className="text-slate-500">Earned via NODLR verification and node operation.</span>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold text-white">Permanence</h3>
                                    <p className="text-sm text-slate-400 italic">
                                        “Souls are permanent and bound to a single human. They cannot be sold, traded, or delegated. They can only be frozen for cause.”
                                    </p>
                                </div>
                            </div>
                        </div>

                        <hr className="border-white/10" />

                        {/* SECTION 4 & 5 — OPERATIONS & PROPOSALS */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-4">
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-white uppercase tracking-tight font-space-grotesk">SECTION 4 — NODES & NODLRS</h2>
                                <p className="text-sm text-slate-400">
                                    NODLRs are verified operators who form the compute backbone. They earn revenue and maintain 1 Soul = 1 Vote power.
                                </p>
                                <div className="p-4 bg-white/5 border border-white/5 rounded-xl space-y-2">
                                    <h4 className="text-xs font-bold text-blue-500 uppercase tracking-widest">Affiliate Trees</h4>
                                    <p className="text-[11px] text-slate-500">NODLR Trees are limited to Level 1 + Level 2 only to maintain fairness.</p>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-white uppercase tracking-tight font-space-grotesk">SECTION 5 — PROPOSALS</h2>
                                <ul className="text-sm text-slate-400 space-y-4">
                                    <li className="flex justify-between border-b border-white/5 pb-2">
                                        <span>Operational</span>
                                        <span className="text-blue-400 font-mono font-bold">{">"}77% YES</span>
                                    </li>
                                    <li className="flex justify-between border-b border-white/5 pb-2">
                                        <span>Economic / Constitutional</span>
                                        <span className="text-blue-400 font-mono font-bold">100% YES</span>
                                    </li>
                                    <li className="flex justify-between border-b border-white/5 pb-2">
                                        <span>Treasury / Role</span>
                                        <span className="text-blue-400 font-mono font-bold">66% - 77% YES</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <hr className="border-white/10" />

                        {/* SECTION 10 — SAFEGUARDS */}
                        <div className="space-y-8">
                            <h2 className="text-3xl font-bold text-white uppercase tracking-tight font-space-grotesk text-center">CONSTITUTIONAL SAFEGUARDS</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-8 bg-white/5 border border-white/10 rounded-3xl space-y-4">
                                    <h3 className="text-xl font-bold text-white uppercase tracking-tighter">Immutable Elements</h3>
                                    <ul className="space-y-2 text-sm text-slate-400">
                                        <li>• Founder Identity & WUID</li>
                                        <li>• Founder’s 3% Infinite Entitlement</li>
                                        <li>• 1 Soul = 1 Vote Model</li>
                                        <li>• Separation of Governance & Commercial Assets</li>
                                        <li>• NODLR Tree Depth Limits</li>
                                    </ul>
                                </div>
                                <div className="p-8 border border-red-500/20 bg-red-500/5 rounded-3xl space-y-4">
                                    <h3 className="text-xl font-bold text-red-400 uppercase tracking-tighter">Prohibited Amendments</h3>
                                    <p className="text-sm text-slate-400">
                                        The DAO may not propose amendments that alter Owner rights, allow token-based voting, or grant governance power to commercial assets.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <hr className="border-white/10" />

                        {/* FINAL SECTION */}
                        <div className="pt-12 text-center space-y-8">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-bold text-white tracking-tighter uppercase font-space-grotesk">RATIFICATION & CONTINUITY</h2>
                                <p className="text-blue-400 font-medium">This Constitution is the supreme authority of the Wnode Mesh.</p>
                            </div>
                            
                            <div className="max-w-2xl mx-auto p-8 bg-blue-600/10 border border-blue-500/30 rounded-3xl">
                                <p className="text-sm text-slate-300 leading-relaxed italic">
                                    “Participation in the Mesh, operation of nodes, holding of Souls, and participation in governance constitutes acceptance of this Constitution. If any rule, policy, or agreement conflicts with this Constitution, the Constitution prevails.”
                                </p>
                            </div>

                            <div className="pt-8">
                                <p className="text-[10px] uppercase tracking-[0.4em] text-slate-600 font-bold">Wnode Constitution v2.0 • 2026</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
