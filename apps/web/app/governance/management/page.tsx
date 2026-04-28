"use client";

import AppLayout from "../../../components/layout/AppLayout";

export default function ManagementGovernancePage() {
    return (
        <AppLayout>
            <div className="bg-black text-white min-h-screen pt-40 pb-20 px-8">
                <div className="max-w-4xl mx-auto space-y-12">
                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight uppercase font-space-grotesk">Wnode Management</h1>
                        <h2 className="text-sm tracking-[0.5em] text-purple-500 uppercase font-bold">Operational Governance</h2>
                    </div>

                    <div className="space-y-16 pt-12">
                        {/* LICENCE START */}
                        <div className="space-y-12 text-white/80 leading-relaxed">
                            <div className="space-y-4">
                                <h2 className="text-5xl font-bold text-white tracking-tighter uppercase">Management Stewardship Licence</h2>
                                <h3 className="text-xl italic text-slate-400">Governing the Operation, Maintenance, and Professional Stewardship of the Wnode Mesh</h3>
                                <p className="text-xs uppercase tracking-widest text-slate-600">Website Version (Heads of Terms)</p>
                            </div>

                            <hr className="border-white/10" />

                            <div className="space-y-6">
                                <h2 className="text-3xl font-bold text-white uppercase tracking-tight">1. Purpose of the Stewardship Licence</h2>
                                <p>
                                    The Wnode Mesh (“The Mesh”) is a community‑owned distributed compute network operated by independent node owners (“Nodlrs”).
                                    To ensure the Mesh remains reliable, secure, and continuously improving, the community grants a perpetual <span className="text-white font-medium">Management Stewardship Licence</span> to a qualified operator (“The Steward”).
                                </p>
                                <p>
                                    The Steward is a <span className="text-white font-medium">professional, licensed operator</span> responsible for managing, maintaining, and improving the platform on behalf of the Mesh Owners.
                                    The Steward <span className="text-purple-400 font-bold">does not own the Mesh</span>, cannot influence governance, and holds no authority to change the Mesh Constitution.
                                </p>
                                <p>This licence defines the rights, responsibilities, and obligations of the Steward.</p>
                            </div>

                            <hr className="border-white/10" />

                            <div className="space-y-6">
                                <h2 className="text-3xl font-bold text-white uppercase tracking-tight">2. Parties to the Licence</h2>
                                <ol className="list-decimal pl-6 space-y-4">
                                    <li><span className="text-white font-medium">The Mesh DAO</span> — The sovereign governance body representing the collective interests of all Nodlrs and Mesh participants.</li>
                                    <li><span className="text-white font-medium">The Steward (Management Licensee)</span> — The entity selected through an open tender process to professionally operate and maintain the Mesh.</li>
                                    <li><span className="text-white font-medium">Stephen Soos</span> — Founder and first transferee of the Startup Stewardship Licence, responsible for transferring the licence to the successful bidder.</li>
                                </ol>
                            </div>

                            <hr className="border-white/10" />

                            <div className="space-y-6">
                                <h2 className="text-3xl font-bold text-white uppercase tracking-tight">3. Nature of the Licence</h2>
                                <ul className="list-disc pl-6 space-y-3">
                                    <li>The Stewardship Licence is a <span className="text-white font-medium">perpetual commercial licence</span>.</li>
                                    <li>It is <span className="text-white font-medium">transferable only through formal tender</span> and cannot be revoked except under defined breach conditions.</li>
                                    <li>The licence grants <span className="text-white font-medium">operational authority</span>, not ownership.</li>
                                    <li>The Mesh remains <span className="text-white font-medium">100% community‑owned</span>.</li>
                                </ul>
                            </div>

                            <hr className="border-white/10" />

                            <div className="space-y-8">
                                <h2 className="text-3xl font-bold text-white uppercase tracking-tight">4. Steward’s Core Rights</h2>
                                
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold text-purple-400">4.1 Operational Authority</h3>
                                    <p>The Steward has the exclusive right to:</p>
                                    <ul className="list-disc pl-6 space-y-2 text-slate-400">
                                        <li>Operate and maintain the Mesh backend infrastructure</li>
                                        <li>Manage servers (in‑house or outsourced)</li>
                                        <li>Oversee platform uptime, reliability, and security</li>
                                        <li>Coordinate development with in‑house and contributor developers</li>
                                        <li>Implement improvements aligned with the Mesh Constitution and community will</li>
                                    </ul>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold text-purple-400">4.2 Commercial Right to Revenue Share</h3>
                                    <ul className="list-disc pl-6 space-y-2 text-slate-400">
                                        <li>The Steward receives <span className="text-white font-medium">7% of all Mesh revenue</span>, automatically distributed.</li>
                                        <li>This share compensates for operational management, infrastructure, and continuous development.</li>
                                    </ul>
                                </div>
                            </div>

                            <hr className="border-white/10" />

                            <div className="space-y-8">
                                <h2 className="text-3xl font-bold text-white uppercase tracking-tight">5. Steward’s Core Responsibilities</h2>
                                
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold text-purple-400">5.1 Platform Operations</h3>
                                    <ul className="list-disc pl-6 space-y-2 text-slate-400">
                                        <li>Maintain 24/7 uptime and monitoring</li>
                                        <li>Ensure secure, scalable server infrastructure</li>
                                        <li>Manage updates, patches, and versioning</li>
                                        <li>Guarantee data integrity and system resilience</li>
                                    </ul>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold text-purple-400">5.3 Governance Compliance</h3>
                                    <ul className="list-disc pl-6 space-y-2 text-slate-400">
                                        <li>Respect the Mesh Constitution</li>
                                        <li>Operate without attempting to centralise power</li>
                                        <li>Never interfere with community governance</li>
                                        <li>Maintain strict neutrality in DAO decisions</li>
                                    </ul>
                                </div>
                            </div>

                            <hr className="border-white/10" />

                            <div className="space-y-6">
                                <h2 className="text-3xl font-bold text-white uppercase tracking-tight">6. Conditions for Revocation of Licence</h2>
                                <p>The Stewardship Licence <span className="text-white font-medium">can only be revoked</span> if the Steward commits:</p>
                                <ol className="list-decimal pl-6 space-y-3 text-red-400/80">
                                    <li><span className="text-white font-medium">Fraud or financial misconduct</span></li>
                                    <li><span className="text-white font-medium">A crime against the Mesh</span>, including sabotage or data tampering</li>
                                    <li><span className="text-white font-medium">An attempt to centralise power</span> or undermine decentralisation</li>
                                    <li><span className="text-white font-medium">An attempt to alter, bypass, or violate the Mesh Constitution</span></li>
                                    <li><span className="text-white font-medium">Gross negligence</span> resulting in systemic failure</li>
                                </ol>
                            </div>

                            <hr className="border-white/10" />

                            <div className="space-y-8">
                                <h2 className="text-3xl font-bold text-white uppercase tracking-tight">7. Tender Process for New Steward</h2>
                                <p>The Stewardship Licence is currently held by <span className="text-white font-medium">Stephen Soos</span> as the Startup Steward and is <span className="text-purple-400 font-bold uppercase tracking-widest">open for tender</span>.</p>
                                
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold text-purple-400">7.1 Eligibility Requirements</h3>
                                    <ul className="list-disc pl-6 space-y-2 text-slate-400">
                                        <li>Experience operating large-scale software platforms</li>
                                        <li>Strong professional reputation and ethical standing</li>
                                        <li>Sufficient financial and operational resources</li>
                                        <li>Technical capability across distributed systems and security</li>
                                        <li>Commitment to decentralisation and community ownership</li>
                                    </ul>
                                </div>
                            </div>

                            <hr className="border-white/10" />

                            <div className="pt-12 text-center space-y-6">
                                <h2 className="text-3xl font-bold text-white tracking-tighter uppercase">Professional Stewardship</h2>
                                <p className="text-xl text-purple-400 font-medium">Community Ownership Forever.</p>
                                <div className="p-8 border border-purple-500/20 bg-purple-500/5 rounded-full inline-block">
                                    <p className="text-xs uppercase tracking-[0.4em] text-purple-500 font-bold">Operational Excellence Guaranteed</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
