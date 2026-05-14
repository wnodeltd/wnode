"use client";

import AppLayout from "../../components/layout/AppLayout";
import { useEffect, useState } from "react";

export default function ConstitutionPage() {
    const sections = [
        { id: "preamble", title: "Founders’ Preamble" },
        { id: "section1", title: "Section 1 — Definitions" },
        { id: "section2", title: "Section 2 — Governance Hierarchy" },
        { id: "section3", title: "Section 3 — Souls & Voting" },
        { id: "section4", title: "Section 4 — Nodes & NODLRs" },
        { id: "section5", title: "Section 5 — Voting Procedures" },
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
                top: element.getBoundingClientRect().top + window.pageYOffset - 80,
                behavior: "smooth"
            });
        }
    };

    return (
        <AppLayout>
            <div className="bg-black text-white min-h-screen pt-40 pb-40 px-6 md:px-12">
                <div className="max-w-4xl mx-auto space-y-6 font-inter text-slate-300">
                    
                    {/* TITLE & DOWNLOAD */}
                    <div className="space-y-6 pb-8 border-b border-white/10">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                            <div className="space-y-2">
                                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white font-space-grotesk uppercase">WNODE CONSTITUTION v2.1</h1>
                                <p className="text-xs uppercase tracking-[0.4em] text-blue-500 font-bold">Official Governance Charter — Full Text Version</p>
                            </div>
                            <a 
                                href="/docs/Governance_v2.1.pdf" 
                                target="_blank"
                                className="px-6 py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-sm hover:bg-blue-500 hover:text-white transition-all shadow-lg"
                            >
                                Download Full PDF
                            </a>
                        </div>
                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-[9px] uppercase tracking-widest text-slate-500 font-mono">
                            <span>Governing Law: England & Wales</span>
                            <span>Version: 2.1 (Ratified May 2026)</span>
                            <span>Author: Stephen Soos</span>
                        </div>
                    </div>

                    {/* COMPACT TABLE OF CONTENTS */}
                    <div className="p-8 bg-white/[0.02] border border-white/5 rounded-sm">
                        <h2 className="text-[10px] uppercase tracking-[0.3em] text-blue-500 font-black mb-6">Table of Contents</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-8">
                            {sections.map((s) => (
                                <button 
                                    key={s.id} 
                                    onClick={() => scrollToSection(s.id)}
                                    className="text-left text-[11px] text-slate-500 hover:text-white transition-colors flex items-start gap-2 group"
                                >
                                    <span className="text-blue-500/30 group-hover:text-blue-500 font-mono">/</span>
                                    <span>{s.title}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* DOCUMENT BODY */}
                    <div className="space-y-10 pt-6 leading-relaxed text-sm md:text-base">
                        
                        {/* PREAMBLE */}
                        <div id="preamble" className="scroll-mt-24 space-y-4">
                            <h2 className="text-xl font-bold text-white uppercase tracking-tight font-space-grotesk">FOUNDERS’ PREAMBLE</h2>
                            <div className="space-y-6">
                                <p>By: Stephen Soos (WUID 1000001-0426-01-AA)</p>
                                <p>Founder • Architect • Initial Steward • Initial Governance Board Member</p>
                                <p>Wnode was created as a community-owned, community-governed, and AI-powered planetary compute mesh.</p>
                                <p>As the Founder, I established this Constitution to ensure that Wnode remains:</p>
                                <ul className="list-disc pl-5 space-y-2 text-slate-400">
                                    <li>open,</li>
                                    <li>decentralised,</li>
                                    <li>transparent,</li>
                                    <li>fair,</li>
                                    <li>sovereign, and</li>
                                    <li>permanently aligned with the interests of its users, node operators, and token holders.</li>
                                </ul>
                                <p>I recognise that the Wnode Mesh belongs to the community, and that governance must always remain accountable to those who operate, support, and rely upon it.</p>
                                <p>This Constitution v2.1 sets out the governance structure, rights, duties, and safeguards that protect the Wnode Mesh, the DAO, and the community for all future generations. It establishes full operational sovereignty through Wnode-owned servers, development environments, power systems (including solar arrays), and a recursive sovereign AI LLM.</p>
                                <p>Wnode is deliberately built for maximum independence — owning and operating its own critical infrastructure to eliminate reliance on third-party cloud providers and ensure resilience against censorship, deplatforming, or external control.</p>
                                <p>It is adopted with the shared commitment that Wnode shall remain a public good, a community asset, and a truly sovereign, decentralised network governed by its participants with a strict 1 Soul = 1 Vote structure.</p>
                            </div>
                        </div>

                        <hr className="border-white/5" />

                        {/* SECTION 1 */}
                        <div id="section1" className="scroll-mt-24 space-y-4">
                            <h2 className="text-xl font-bold text-white uppercase tracking-tight font-space-grotesk">SECTION 1 — DEFINITIONS</h2>
                            <p className="italic text-slate-500">(This section establishes the precise meaning of all governance terms used throughout the Constitution.)</p>
                            <p>For the purposes of this Constitution, the following terms shall have the meanings set out below:</p>
                            
                            <div className="space-y-6">
                                {[
                                    { t: "1.1 “Wnode Mesh”", d: "The decentralised compute network operated collectively by node operators, governed by the DAO, and maintained through the governance structures defined in this Constitution." },
                                    { t: "1.2 “DAO” or “Wnode DAO”", d: "The decentralised autonomous organisation composed of verified token holders and NODLR Souls, empowered to vote on proposals and amend this Constitution." },
                                    { t: "1.3 “Founder”", d: "Stephen Soos (WUID 1000001-0426-01-AA), the creator and architect of the Wnode Mesh, and the individual who established the initial governance framework, token model, and operational architecture." },
                                    { t: "1.4 “Founder Board”", d: "A governance body composed of four (4) members, including the Founder, responsible for: constitutional guardianship, Steward appointment and removal, Infrastructure Manager oversight, emergency powers, and long-term strategic protection of the Mesh. The Founder Board is not fully elected by the DAO in its initial form to protect against early-stage capture. It includes progressive decentralisation mechanisms as defined in Section 2." },
                                    { t: "1.5 “Governance Board”", d: "A body made up of the initial members and responsible for: operational oversight, proposal validation, treasury supervision, and ensuring DAO decisions are implemented. The Founder is the Initial Governance Board Member." },
                                    { t: "1.6 “Steward”", d: "The holder of the Stewardship Licence, responsible for day-to-day Mesh operations, customer support, compliance, and UX management, as defined in Section 6. The Founder is the Initial Steward." },
                                    { t: "1.7 “Stewardship Licence”", d: "A perpetual, revenue-bearing commercial licence granted by the Founder Board to a Steward, defining operational rights, obligations, revenue share, and revocation conditions." },
                                    { t: "1.8 “Infrastructure Manager” (IM)", d: "The technical authority responsible for: uptime, infrastructure reliability, node verification, emergency technical response, hardware acquisition and maintenance. The IM operates independently of the Steward and answers to the Governance Board." },
                                    { t: "1.9 “Soul”", d: "A non-transferable identity token representing a verified individual within the Mesh. Souls may be: Locked Souls — identity-only, non-voting; Voting Souls — earned through node operation and NODLR verification." },
                                    { t: "1.10 “NODLR”", d: "A verified node operator who has passed technical and identity verification and earned a Voting Soul." },
                                    { t: "1.11 “WUID”", d: "The Wnode Universal Identifier assigned to each Soul. The Founder’s WUID is 1000001-0426-01-AA." },
                                    { t: "1.12 “Founder Affiliate Tree”", d: "A hierarchical, non-governance, non-token, commercial asset representing referral lineage and organic growth within the Mesh. It is: transferable, sellable, permanent, non-governance-bearing, infinite in depth, and entitles the Founder to 3% of the entire Affiliate Tree to infinity, as defined in the platform’s payment rules and Stripe architecture." },
                                    { t: "1.13 “Frozen Affiliate Tree”", d: "A Founder Affiliate Tree or NODLR Affiliate Affiliate Tree that remains owned by the individual but is restricted from new Level 1 recruitment." },
                                    { t: "1.14 “Governance Proposal”", d: "A proposal submitted to the DAO for: operational changes, constitutional amendments, treasury actions, parameter updates, role appointments." },
                                    { t: "1.15 “Emergency Action”", d: "A time-sensitive action authorised by the Founder Board or Infrastructure Manager to protect the Mesh from outages, attacks, catastrophic failures, or regulatory threats." },
                                    { t: "1.16 “Treasury”", d: "The on-chain financial reserves of the DAO, governed by DAO vote and safeguarded by the Governance Board." },
                                    { t: "1.17 “Wnode Token”", d: "The governance-adjacent utility token of the Mesh, used for staking, incentives, and economic participation. Tokens do not grant voting rights (see Section 3)." },
                                    { t: "1.18 “Constitution”", d: "This document, known as the Wnode Constitution v2.1, including all amendments ratified by the DAO in accordance with Section 5." },
                                    { t: "1.19 “NODLR Affiliate Affiliate Tree”", d: "A commercial, non-governance asset representing the referral lineage of a NODLR. It is: transferable, sellable, permanent, non-governance-bearing, strictly limited to Level 1 and Level 2 only, and subject to the same freezing and protection rules as Founder Affiliate Trees (except depth limitations)." },
                                    { t: "1.20 “Core Immutable Provisions”", d: "Provisions that enjoy the highest level of protection and can only be amended with 100% DAO approval plus Founder Board confirmation. These include: 1 Soul = 1 Vote; Soul non-transferability and permanence." },
                                    { t: "1.21 “Dispute Resolution”", d: "Final and binding arbitration seated in London under the LCIA Rules, governed by the laws of England & Wales." }
                                ].map((item, i) => (
                                    <div key={i} className="space-y-2">
                                        <h3 className="text-white font-bold text-sm tracking-tight">{item.t}</h3>
                                        <p className="text-slate-400 text-sm leading-relaxed pl-4 border-l border-white/5">{item.d}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <hr className="border-white/5" />

                        {/* SECTION 2 */}
                        <div id="section2" className="scroll-mt-24 space-y-4">
                            <h2 className="text-xl font-bold text-white uppercase tracking-tight font-space-grotesk">SECTION 2 — GOVERNANCE HIERARCHY</h2>
                            <p>This section establishes the structural order of authority within the Wnode DAO and defines how governance power is distributed, limited, and safeguarded.</p>
                            <p>The Wnode governance model is a hybrid constitutional system combining:</p>
                            <ul className="list-disc pl-5 space-y-2 text-slate-400">
                                <li>decentralised community voting (1 Soul = 1 Vote),</li>
                                <li>Founder-level constitutional guardianship with progressive decentralisation,</li>
                                <li>operational oversight by the Governance Board,</li>
                                <li>commercial stewardship via the Stewardship Licence, and</li>
                                <li>technical protection through the Infrastructure Manager.</li>
                            </ul>
                            
                            <div className="space-y-8 pt-4">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-bold text-white">2.1 The DAO (Wnode DAO)</h3>
                                    <p>The DAO is the sovereign community governance body of the Wnode Mesh.</p>
                                    <p>The DAO votes on proposals, approves constitutional amendments, controls the Treasury, and ratifies or rejects major system changes. DAO voting is strictly <span className="text-blue-500 font-bold">1 Soul = 1 Vote</span>, ensuring no whale dominance, no token-based power accumulation, no governance capture, and equal representation for all verified individuals.</p>
                                    <p>The DAO cannot override: the Core Immutable Provisions, the DAO owners’ constitutional rights, the Stewardship Licence terms, the Founder Board’s emergency powers, and the Infrastructure Manager’s emergency technical authority. These protections prevent catastrophic governance failures.</p>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-lg font-bold text-white">2.2 The Initial Founder – Stephen Soos</h3>
                                    <p>The Founder holds the permanent constitutional roles of Founder, Architect, Initial Steward, and Initial Governance Board Member. The Founder established the Mesh, authored the Constitution, defined the governance architecture, created the token and identity systems, and built the commercial and technical foundations.</p>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-lg font-bold text-white">2.3 The Founder Board</h3>
                                    <p>The Founder Board consists of four (4) members, including the Founder. Its responsibilities include constitutional guardianship, protection of the Mesh’s long-term integrity, appointment and removal of the Steward, oversight of the Infrastructure Manager, and activation of emergency powers.</p>
                                    <p><span className="text-white font-bold">Progressive Decentralisation Clause:</span> After 24 months from genesis or upon reaching 50,000 active Voting Souls, two (2) seats on the Founder Board shall transition to DAO-elected members serving 2-year terms (requiring 77% approval). The Founder retains a permanent seat. This balances early-stage protection against capture with community sovereignty.</p>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-lg font-bold text-white">2.4 The Governance Board</h3>
                                    <p>The Governance Board consists of the four initial members, including the Founder. Its responsibilities include operational oversight, proposal validation, treasury supervision, and ensuring DAO decisions are implemented. It bridges DAO decisions, Steward operations, and technical execution.</p>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-lg font-bold text-white">2.5 The Steward</h3>
                                    <p>The Steward is the holder of the Stewardship Licence, granting revenue rights, operational authority, customer support, compliance, and UX management. The Steward does not control governance, the Treasury, the token, or the Infrastructure Manager. The Steward is appointed and removable by the Founder Board. The Founder is the Initial Steward.</p>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-lg font-bold text-white">2.6 The Infrastructure Manager (IM)</h3>
                                    <p>The IM is the technical authority responsible for uptime, reliability, node verification, and technical response. The IM operates independently of the Steward, answers to the Governance Board, and may activate emergency technical powers. The IM cannot modify governance, alter token supply, or override the Founder Board.</p>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-lg font-bold text-white">2.7 Souls and NODLRs</h3>
                                    <p>Souls represent verified individuals. NODLRs are Souls who operate nodes, pass technical and identity verification (including Stripe Connect), earn Voting Souls, and own the DAO. NODLRs participate in DAO voting on a 1 Soul = 1 Vote basis, earn revenue from nodes, and build their NODLR Affiliate Trees (L1 + L2 only).</p>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-lg font-bold text-white">2.8 Affiliate Tree Assets</h3>
                                    <p>Affiliate Tree assets are commercial, not governance assets. Founder Affiliate Trees have infinite depth; NODLR Affiliate Trees are strictly Level 1 + Level 2 only. All Affiliate Trees are transferable, sellable, and permanent. They cannot influence DAO voting, governance power, token supply, or constitutional amendments.</p>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-lg font-bold text-white">2.9 Hierarchy Summary</h3>
                                    <p>From highest constitutional authority to lowest:</p>
                                    <ol className="list-decimal pl-5 space-y-1 text-slate-400 font-mono text-xs">
                                        <li>The Constitution (including Core Immutable Provisions)</li>
                                        <li>The DAO (1 Soul = 1 Vote)</li>
                                        <li>The Governance Board</li>
                                        <li>The Founder Board</li>
                                        <li>The Steward (commercial operator)</li>
                                        <li>The Infrastructure Manager (technical authority)</li>
                                    </ol>
                                </div>
                            </div>
                        </div>

                        <hr className="border-white/5" />

                        {/* SECTION 3 */}
                        <div id="section3" className="scroll-mt-24 space-y-4">
                            <h2 className="text-xl font-bold text-white uppercase tracking-tight font-space-grotesk">SECTION 3 — SOULS, IDENTITY & VOTING RIGHTS</h2>
                            <p>This section defines the identity system of the Wnode Mesh, the structure of Souls, and the rules governing voting rights within the DAO. It establishes the 1 Soul = 1 Vote model and ensures that governance remains decentralised and resistant to capture.</p>
                            
                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <h3 className="text-lg font-bold text-white">3.1 Souls as the Foundation of Identity</h3>
                                    <p>A Soul is the core identity primitive of the Wnode Mesh. It represents a verified human individual, is non-transferable, bound permanently to a WUID, and required for all governance participation. Souls ensure governance is based on people, not capital. <span className="text-blue-500 font-bold uppercase text-xs">Core Immutable Provision.</span></p>
                                </div>

                                <div className="space-y-3">
                                    <h3 className="text-lg font-bold text-white">3.2 Types of Souls</h3>
                                    <p>There are two types of Souls: <span className="text-white">Locked Souls</span> (identity-only, non-voting) and <span className="text-white">Voting Souls</span> (earned through NODLR verification and node operation). A Soul may upgrade from Locked to Voting, but never downgrade unless revoked for cause.</p>
                                </div>

                                <div className="space-y-3">
                                    <h3 className="text-lg font-bold text-white">3.3 Locked Souls</h3>
                                    <p>A Locked Soul is issued when an individual completes identity verification and joins the Mesh but has not yet become a NODLR. Locked Souls cannot vote, propose governance actions, or hold roles. They exist to ensure identity integrity without granting governance power prematurely.</p>
                                </div>

                                <div className="space-y-3">
                                    <h3 className="text-lg font-bold text-white">3.4 Voting Souls</h3>
                                    <p>A Voting Soul is earned when an individual becomes a verified NODLR, passes technical and Stripe verification, and operates a node in good standing. Voting Souls grant full DAO voting rights and the ability to submit proposals.</p>
                                </div>

                                <div className="space-y-3">
                                    <h3 className="text-lg font-bold text-white">3.5 1 Soul = 1 Vote</h3>
                                    <p>A Soul represents a flesh and blood human being (Person). The Wnode Mesh uses a strict one-person-one-vote model to prevent whale dominance, token-based governance capture, and plutocratic control. No Person may ever hold more than one Voting Soul. <span className="text-blue-500 font-bold uppercase text-xs">Core Immutable Provision.</span></p>
                                </div>

                                <div className="space-y-3">
                                    <h3 className="text-lg font-bold text-white">3.6 Soul Permanence</h3>
                                    <p>Souls are permanent, bound to a single human, non-transferable, and non-delegable. A Soul cannot be revoked; it can only be frozen for fraud, identity violation, malicious behavior, or regulatory requirement.</p>
                                </div>

                                <div className="space-y-3">
                                    <h3 className="text-lg font-bold text-white">3.7 WUID Assignment</h3>
                                    <p>Each Soul receives a Wnode Universal Identifier (WUID), which is globally unique and identifies the Soul across all systems (governance, node operation, compute purchase, dashboards). The Founder’s WUID is 1000001-0426-01-AA.</p>
                                </div>

                                <div className="space-y-3">
                                    <h3 className="text-lg font-bold text-white">3.8 Soul Privacy & Transparency</h3>
                                    <p>Souls are pseudonymous by default but must be verifiable and auditable. The DAO sees Soul status, proposal history, and voting history, but does not see private personal identity or regulatory documents.</p>
                                </div>

                                <div className="space-y-3">
                                    <h3 className="text-lg font-bold text-white">3.9 Soul-Based Governance Integrity</h3>
                                    <p>The Soul system ensures no duplicate identities, no Sybil attacks, and no multi-account voting. The Steward and Governance Board jointly enforce identity integrity.</p>
                                </div>

                                <div className="space-y-3">
                                    <h3 className="text-lg font-bold text-white">3.10 Souls and Affiliate Tree Assets</h3>
                                    <p>Souls are identity/governance assets; Affiliate Trees are immutable commercial assets. They are completely separate: Souls cannot be sold; Affiliate Trees can be sold. Souls grant governance power; Affiliate Trees do not. <span className="text-blue-500 font-bold uppercase text-xs">Core Immutable Provision.</span></p>
                                </div>

                                <div className="space-y-3">
                                    <h3 className="text-lg font-bold text-white">3.11 Souls and Token Holdings</h3>
                                    <p>Token holdings do not grant governance power, increase voting weight, or override Souls. Tokens are economic assets; Souls are governance assets. <span className="text-blue-500 font-bold uppercase text-xs">Core Immutable Provision.</span></p>
                                </div>
                            </div>
                        </div>

                        <hr className="border-white/5" />

                        {/* SECTION 4 */}
                        <div id="section4" className="scroll-mt-24 space-y-4">
                            <h2 className="text-xl font-bold text-white uppercase tracking-tight font-space-grotesk">SECTION 4 — NODES, NODLRS & OPERATIONAL PARTICIPATION</h2>
                            <p>This section defines the operational layer, including node operation, NODLR status, verification, and compute network participation.</p>
                            
                            <div className="space-y-10 pt-4">
                                <div className="space-y-3">
                                    <h3 className="text-lg font-bold text-white">4.1 Node Definition</h3>
                                    <p>A Node is any compute device registered to the Mesh that contributes resources, participates in workloads, meets hardware requirements, and is linked to a Soul/WUID.</p>
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-lg font-bold text-white">4.2 Node Operator Requirements</h3>
                                    <p>Operators must hold a Soul, register the device, maintain uptime, comply with Stripe verification, and adhere to security standards.</p>
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-lg font-bold text-white">4.3 NODLR Status</h3>
                                    <p>A NODLR is a verified operator who passes identity, technical, and Stripe verification, operates a node in good standing, and earns a Voting Soul.</p>
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-lg font-bold text-white">4.4 NODLR Responsibilities</h3>
                                    <p>NODLRs must maintain uptime, hardware compliance, and accurate identity info. Failure may result in suspension, loss of status/Voting Soul, or Tree freezing.</p>
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-lg font-bold text-white">4.5 Node Verification</h3>
                                    <p>The Infrastructure Manager performs periodic checks, uptime monitoring, and hardware compliance to prevent Sybil attacks or fraudulent nodes.</p>
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-lg font-bold text-white">4.6 Node Rewards</h3>
                                    <p>Rewards are based on compute contribution, uptime, and workload performance. They are paid automatically, transparently, and do not influence voting.</p>
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-lg font-bold text-white">4.7 NODLR Affiliate Trees (L1 + L2 Only)</h3>
                                    <p>Each NODLR maintains a two-level referral lineage (L1 direct, L2 indirect). These are immutable commercial assets, transferable, and sellable, but cannot expand beyond Level 2 or grant governance power.</p>
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-lg font-bold text-white">4.8 Founder Affiliate Tree Distinction</h3>
                                    <p>Founder Affiliate Trees have infinite depth and entitle the Founder to 3% of the entire Tree to infinity. This is a structural and permanent <span className="text-blue-500 font-bold uppercase text-xs">Core Immutable Provision.</span></p>
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-lg font-bold text-white">4.9 Node Suspension & Removal</h3>
                                    <p>Nodes may be removed for downtime, non-compliance, fraud, or identity violations. Suspension results in loss of rewards and status, and potential Tree freezing.</p>
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-lg font-bold text-white">4.10 Node Reactivation</h3>
                                    <p>Suspended nodes may be reactivated if compliance is restored and IM approves, but this does not automatically restore governance rights.</p>
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-lg font-bold text-white">4.11 Operational Integrity</h3>
                                    <p>Operators must avoid prohibited workloads, comply with regulations, and run nodes in secure environments (VMs). IM may take immediate protective action.</p>
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-lg font-bold text-white">4.13 Appeal Process</h3>
                                    <p>NODLRs facing sanctions may appeal to the Governance Board within 7 days, then the Founder Board, and finally the DAO via Emergency Proposal.</p>
                                </div>
                            </div>
                        </div>

                        <hr className="border-white/5" />

                        {/* SECTION 5 */}
                        <div id="section5" className="scroll-mt-24 space-y-4">
                            <h2 className="text-xl font-bold text-white uppercase tracking-tight font-space-grotesk">SECTION 5 — GOVERNANCE PROPOSALS & VOTING PROCEDURES</h2>
                            <p>This section defines how proposals are created, submitted, validated, and enacted.</p>
                            
                            <div className="space-y-8 pt-4">
                                <div className="space-y-3">
                                    <h3 className="text-lg font-bold text-white">5.1 Proposal Categories</h3>
                                    <p>Operational, Economic (reward/fee rates), Treasury (spending/grants), Role (appointments), Constitutional Amendments, and Emergency Proposals.</p>
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-lg font-bold text-white">5.2 Submission Rights</h3>
                                    <p>Only individuals with a Voting Soul may submit proposals, preventing spam and anonymous manipulation.</p>
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-lg font-bold text-white">5.4 Validation</h3>
                                    <p>The Governance Board validates proposals for constitutional/regulatory compliance, network security, and technical/economic feasibility before a DAO vote.</p>
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-lg font-bold text-white">5.5 Voting Process</h3>
                                    <p>1 Soul = 1 Vote. YES/NO options. 7-day period (unless emergency). Thresholds vary by category:</p>
                                    <ul className="list-disc pl-5 space-y-2 text-slate-400 font-mono text-xs">
                                        <li>Operational: {">"}66% YES (20% Quorum)</li>
                                        <li>Economic: {">"}80% YES (25% Quorum)</li>
                                        <li>Treasury: {">"}70% YES (30% Quorum)</li>
                                        <li>Role (non-Founder): {">"}75% YES (30% Quorum)</li>
                                        <li>Amendments: {">"}85% YES (40% Quorum)</li>
                                        <li>Core Immutable: 100% YES (50% Quorum)</li>
                                        <li>Emergency: {">"}50% YES (No Quorum)</li>
                                    </ul>
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-lg font-bold text-white">5.10 Founder Board Veto</h3>
                                    <p>The Founder Board may veto proposals threatening network integrity, compliance, security, or Founder rights. Vetoes may be overridden by a 90% DAO supermajority.</p>
                                </div>
                            </div>
                        </div>

                        <hr className="border-white/5" />

                        {/* SECTION 6 */}
                        <div id="section6" className="scroll-mt-24 space-y-4">
                            <h2 className="text-xl font-bold text-white uppercase tracking-tight font-space-grotesk">SECTION 6 — THE STEWARDSHIP LICENCE</h2>
                            <p>The Stewardship Licence defines the commercial and operational authority granted to the Steward. It is a commercial licence, not a governance role. The Founder is the Initial Steward.</p>
                            
                            <div className="space-y-8 pt-4">
                                <p><span className="text-white font-bold">6.1 Nature:</span> Perpetual unless revoked for cause, commercial, non-governance-bearing, and non-transferable without Founder Board approval.</p>
                                <p><span className="text-white font-bold">6.2 Rights:</span> Manage UX, onboarding, customer support, compliance, commercial operations, and receive revenue share as defined in the Stewardship Licence Agreement.</p>
                                <p><span className="text-white font-bold">6.4 Limitations:</span> The Steward cannot modify governance, alter token supply, control the Treasury, or override the Infrastructure Manager. The Steward is an operator, not a governor.</p>
                                <p><span className="text-white font-bold">6.9 Removal:</span> The Founder Board may remove the Steward for breach, negligence, fraud, or refusal to implement DAO changes. Removal triggers immediate Tree freezing and appointment of a new Steward.</p>
                            </div>
                        </div>

                        <hr className="border-white/5" />

                        {/* SECTION 7 */}
                        <div id="section7" className="scroll-mt-24 space-y-4">
                            <h2 className="text-xl font-bold text-white uppercase tracking-tight font-space-grotesk">SECTION 7 — Affiliate Tree ASSETS</h2>
                            <p>Affiliate Tree Assets (Founder infinite-depth, NODLR L1+L2 only) are commercial, non-governance assets representing referral lineage. They are permanent, transferable, and sellable, with zero influence over governance or tokens. <span className="text-blue-500 font-bold uppercase text-xs">Core Immutable Provision.</span></p>
                            <p>The Founder receives 3% of the entire Founder Affiliate Tree to infinity. NODLRs earn 3% from Level 1 and 7% from Level 2. Trees may be frozen for fraud or malicious behavior, restricting new recruitment but allowing existing revenue flow.</p>
                        </div>

                        <hr className="border-white/5" />

                        {/* SECTION 8 */}
                        <div id="section8" className="scroll-mt-24 space-y-4">
                            <h2 className="text-xl font-bold text-white uppercase tracking-tight font-space-grotesk">SECTION 8 — EMERGENCY POWERS & NETWORK PROTECTION</h2>
                            <p>Emergency powers (Technical, Security, Governance, Regulatory, Operational) exist solely to protect the Mesh from catastrophic harm. They are defensive, time-limited (72 hours initially), and require full transparency and DAO oversight.</p>
                            <p>The Infrastructure Manager may suspend nodes or block actors to protect technical stability. The Founder Board may override malicious proposals or remove the Steward to protect the Constitution.</p>
                        </div>

                        <hr className="border-white/5" />

                        {/* SECTION 9 */}
                        <div id="section9" className="scroll-mt-24 space-y-4">
                            <h2 className="text-xl font-bold text-white uppercase tracking-tight font-space-grotesk">SECTION 9 — TOKENOMICS & ECONOMIC MODEL</h2>
                            <p>The Wnode Token is a utility token for staking and incentives; it confers no voting rights. Governance remains strictly Soul-based. <span className="text-blue-500 font-bold uppercase text-xs">Core Immutable Provision.</span></p>
                            <p>Revenue flow: 70% to Node Operators, 10% to Sales Source, 7% to Steward, 3% Level 1, 7% Level 2, and 3% Founder override. The Treasury is DAO-controlled and audited quarterly.</p>
                        </div>

                        <hr className="border-white/5" />

                        {/* SECTION 10 */}
                        <div id="section10" className="scroll-mt-24 space-y-4">
                            <h2 className="text-xl font-bold text-white uppercase tracking-tight font-space-grotesk">SECTION 10 — COMPLIANCE, LIABILITY & GENERAL PROVISIONS</h2>
                            <p>Compliance with AML, KYC (Stripe), and GDPR is mandatory. The Mesh is governed by the laws of England & Wales, with arbitration in London under LCIA Rules. Liability is limited, and participants indemnify the DAO against claims arising from their operation of nodes.</p>
                        </div>

                        <hr className="border-white/5" />

                        {/* SECTION 11 */}
                        <div id="section11" className="scroll-mt-24 space-y-4">
                            <h2 className="text-xl font-bold text-white uppercase tracking-tight font-space-grotesk">SECTION 11 — ENFORCEMENT, SANCTIONS & APPEALS</h2>
                            <p>Sanctions (suspension, Tree freezing, Soul revocation) follow due process based on documented evidence of fraud, malicious behavior, or breach. Affected parties have 7 days to respond and may appeal to the Governance Board, Founder Board, and finally the DAO.</p>
                        </div>

                        <hr className="border-white/5" />

                        {/* SECTION 12 */}
                        <div id="section12" className="scroll-mt-24 space-y-4">
                            <h2 className="text-xl font-bold text-white uppercase tracking-tight font-space-grotesk">SECTION 12 — FINAL PROVISIONS</h2>
                            <p>Constitutional amendments require {">"}87% approval; Core Immutable Provisions (1 Soul = 1 Vote, Identity Permanence, Founder 3% entitlement) require 100% DAO approval. This document constitutes the entire understanding between participants and the Founder.</p>
                        </div>

                        <hr className="border-white/5" />

                        {/* SECTION 13 */}
                        <div id="section13" className="scroll-mt-24 space-y-4">
                            <h2 className="text-xl font-bold text-white uppercase tracking-tight font-space-grotesk">SECTION 13 — SOVEREIGNTY AND INFRASTRUCTURE INDEPENDENCE</h2>
                            <p>Wnode owns and operates bare-metal servers, development environments, UPS systems, solar arrays, and its own recursive AI LLM. These sovereignty measures ensure resistance to censorship and external control while accelerating innovation.</p>
                        </div>

                        <hr className="border-white/5" />

                        {/* SIGNATURE */}
                        <div className="pt-12 space-y-8 text-center border-t border-white/20">
                            <div className="space-y-4">
                                <p className="text-xs uppercase tracking-widest text-slate-500">Ratified and Signed</p>
                                <h3 className="text-2xl font-bold text-white font-space-grotesk uppercase">Stephen Soos</h3>
                                <div className="text-[10px] uppercase tracking-[0.2em] space-y-1 text-slate-500">
                                    <p>Founder • Architect • Initial Steward • Initial Governance Board Member</p>
                                    <p className="text-blue-500 font-bold">WUID: 1000001-0426-01-AA</p>
                                    <p>Date: May 13th 2026</p>
                                </div>
                            </div>
                            <div className="p-8 border border-white/5 bg-white/[0.01] rounded-sm max-w-xl mx-auto">
                                <p className="text-[9px] text-slate-600 leading-relaxed uppercase tracking-widest font-black">
                                    Notice: This web version is a formal rendering of the Wnode Constitution v2.1. In case of any textual discrepancy, the official signed PDF version remains the final authority.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
