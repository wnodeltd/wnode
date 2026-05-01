"use client";

import AppLayout from "../../../components/layout/AppLayout";

export default function ManagementGovernancePage() {
    return (
        <AppLayout>
            <div className="bg-black text-white min-h-screen pt-40 pb-20 px-8">
                <div className="max-w-4xl mx-auto space-y-12 font-inter">
                    {/* HEADER */}
                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight uppercase font-space-grotesk">Wnode Management</h1>
                        <h2 className="text-sm tracking-[0.5em] text-purple-500 uppercase font-bold">Operational Governance</h2>
                    </div>

                    <div className="space-y-16 pt-12 text-white/80 leading-relaxed">
                        {/* LICENCE START */}
                        <div className="space-y-12">
                            <div className="space-y-4">
                                <h2 className="text-5xl font-bold text-white tracking-tighter uppercase">Management Stewardship Licence</h2>
                                <h3 className="text-xl italic text-slate-400">Governing the Operation, Maintenance, and Professional Stewardship of the Wnode Mesh</h3>
                                <p className="text-xs uppercase tracking-widest text-slate-600">Version 1.1 — Updated Stewardship Terms</p>
                            </div>

                            <hr className="border-white/10" />

                            <div className="space-y-6">
                                <h2 className="text-3xl font-bold text-white uppercase tracking-tight">1. Purpose and Nature</h2>
                                <p>
                                    The Wnode Mesh is community‑owned forever. The <span className="text-white font-medium">Management Stewardship Licence</span> is a professional service agreement granted by the community to a qualified operator (“The Steward”).
                                </p>
                                <p>
                                    The Steward is a <span className="text-white font-medium">service provider</span>, not an owner. They maintain uptime, security, and operational integrity but cannot change economic rules or influence governance.
                                </p>
                            </div>

                            <hr className="border-white/10" />

                            <div className="space-y-8">
                                <h2 className="text-3xl font-bold text-white uppercase tracking-tight">2. Steward Licence (Economic & Legal Status)</h2>
                                
                                <div className="space-y-4 p-8 bg-purple-500/5 border border-purple-500/20 rounded-3xl">
                                    <h3 className="text-xl font-bold text-purple-400">2.1 Conditional Economic Asset</h3>
                                    <p>
                                        The Steward Licence is an economic asset that may be sold or transferred — but <span className="text-white font-bold underline decoration-purple-500 decoration-2 underline-offset-4 text-lg">only with 87% DAO approval</span>.
                                    </p>
                                </div>

                                <div className="space-y-4 p-8 bg-red-500/5 border border-red-500/20 rounded-3xl">
                                    <h3 className="text-xl font-bold text-red-400">2.2 Prohibited Actions</h3>
                                    <p>Any unapproved attempt to:</p>
                                    <ul className="list-disc pl-6 space-y-1 text-slate-400 font-mono text-sm">
                                        <li>SELL</li>
                                        <li>TRANSFER</li>
                                        <li>ASSIGN</li>
                                        <li>PLEDGE</li>
                                        <li>COLLATERALISE</li>
                                    </ul>
                                    <p className="pt-2 font-bold text-white">...results in immediate revocation of the Licence.</p>
                                </div>
                            </div>

                            <hr className="border-white/10" />

                            <div className="space-y-8">
                                <h2 className="text-3xl font-bold text-white uppercase tracking-tight">3. Automatic Revocation</h2>
                                <p>The Licence is automatically revoked, without need for DAO vote, if triggered by:</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        "Insolvency or Bankruptcy",
                                        "Receivership or Administration",
                                        "Ceasing to Trade",
                                        "Fraud or Financial Misconduct",
                                        "Criminal Conviction",
                                        "Criminal Misconduct by Controlling Persons"
                                    ].map((trigger, i) => (
                                        <div key={i} className="flex items-center space-x-3 p-4 bg-white/5 rounded-xl border border-white/10">
                                            <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                            <span className="text-sm text-slate-300">{trigger}</span>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-sm italic text-red-400 bg-red-400/5 p-4 rounded-xl border border-red-400/20">
                                    IMPORTANT: A revoked Licence cannot be treated as an asset in insolvency. It immediately reverts to the Mesh DAO.
                                </p>
                            </div>

                            <hr className="border-white/10" />

                            <div className="space-y-6">
                                <h2 className="text-3xl font-bold text-white uppercase tracking-tight">4. Steward’s Core Rights & Duties</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    <div className="space-y-4">
                                        <h3 className="text-xl font-bold text-purple-400">Rights</h3>
                                        <ul className="list-disc pl-6 space-y-2 text-sm text-slate-400">
                                            <li>Receive <span className="text-white">7% of all Mesh revenue</span></li>
                                            <li>Exclusive right to operate backend infrastructure</li>
                                            <li>Coordinate platform development</li>
                                        </ul>
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="text-xl font-bold text-purple-400">Duties</h3>
                                        <ul className="list-disc pl-6 space-y-2 text-sm text-slate-400">
                                            <li>Maintain 24/7 uptime and security</li>
                                            <li>Respect the Mesh Constitution</li>
                                            <li>Maintain strict neutrality in DAO decisions</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <hr className="border-white/10" />

                            <div className="p-8 bg-purple-600/10 border border-purple-500/30 rounded-[2rem] text-center space-y-4">
                                <h3 className="text-2xl font-bold text-white">Separation of Powers</h3>
                                <div className="flex justify-center items-center space-x-8">
                                    <div className="text-lg font-bold text-purple-400">DAO governs.</div>
                                    <div className="w-px h-8 bg-white/20" />
                                    <div className="text-lg font-bold text-white">Steward operates.</div>
                                </div>
                                <p className="text-xs uppercase tracking-widest text-slate-500 pt-4">Neither can override the other’s domain.</p>
                            </div>

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
