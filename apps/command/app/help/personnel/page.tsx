"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft, ShieldCheck, Users, Mail, Ban, Lock, BadgeCheck, ShieldAlert, Search } from "lucide-react";
import { usePageTitle } from "../../components/PageTitleContext";

export default function PersonnelHelpPage() {
    usePageTitle("Personnel Governance", "Operational guidance for staff roles and access control.");

    return (
        <main className="flex-1 p-8 overflow-y-auto pb-24 font-sans">
            <div className="max-w-4xl mx-auto">
                <Link 
                    href="/help" 
                    className="flex items-center gap-2 text-cyan-400 text-[10px] uppercase font-bold tracking-widest mb-8 hover:text-white transition-colors"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Back to Help Center
                </Link>

                <div className="bg-white/[0.02] border border-white/10 p-12 rounded-[5px]">
                    <h1 className="text-3xl font-bold text-white mb-4 uppercase tracking-tighter">Personnel Governance</h1>
                    <p className="text-slate-400 text-sm leading-relaxed mb-12 max-w-2xl">
                        The Command Portal utilizes a strict Role-Based Access Control (RBAC) system to ensure platform security. 
                        Administrators can manage staff identities, assign operational tiers, and monitor access integrity.
                    </p>

                    <div className="space-y-16">
                        <section>
                            <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <BadgeCheck className="w-4 h-4" />
                                Operational Tiers
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-6 bg-white/[0.02] border border-white/5 rounded-[5px] space-y-3">
                                    <div className="flex items-center gap-2 text-cyan-400">
                                        <Lock className="w-4 h-4" />
                                        <h3 className="text-xs font-bold uppercase tracking-widest">Owner (Sovereign)</h3>
                                    </div>
                                    <p className="text-slate-400 text-[13px] leading-relaxed">
                                        Full platform authority. Access to all financial ledgers, system overrides, 
                                        and the ability to assign/revoke Management roles. Limited to exactly one active account.
                                    </p>
                                </div>
                                <div className="p-6 bg-white/[0.02] border border-white/5 rounded-[5px] space-y-3">
                                    <div className="flex items-center gap-2 text-purple-400">
                                        <ShieldAlert className="w-4 h-4" />
                                        <h3 className="text-xs font-bold uppercase tracking-widest">Management</h3>
                                    </div>
                                    <p className="text-slate-400 text-[13px] leading-relaxed">
                                        High-privilege access for cluster operations. Can manage personnel, monitor network 
                                        inventory, and access institutional financial stats.
                                    </p>
                                </div>
                                <div className="p-6 bg-white/[0.02] border border-white/5 rounded-[5px] space-y-3">
                                    <div className="flex items-center gap-2 text-emerald-400">
                                        <Users className="w-4 h-4" />
                                        <h3 className="text-xs font-bold uppercase tracking-widest">Customer Service</h3>
                                    </div>
                                    <p className="text-slate-400 text-[13px] leading-relaxed">
                                        Support-tier access. Can view node telemetry and operator profiles to assist with 
                                        onboarding and technical troubleshooting.
                                    </p>
                                </div>
                                <div className="p-6 bg-white/[0.02] border border-white/5 rounded-[5px] space-y-3">
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <Search className="w-4 h-4" />
                                        <h3 className="text-xs font-bold uppercase tracking-widest">Visitor</h3>
                                    </div>
                                    <p className="text-slate-400 text-[13px] leading-relaxed">
                                        Read-only transparency tier. Restricted to public-facing telemetry and basic platform metrics. 
                                        Cannot perform state-modifying actions.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                Invitation Workflow
                            </h2>
                            <div className="space-y-4">
                                <div className="bg-black/40 border border-white/5 p-6 rounded-[5px] flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-cyan-400/10 flex items-center justify-center shrink-0">
                                        <span className="text-cyan-400 text-xs font-bold">01</span>
                                    </div>
                                    <p className="text-slate-400 text-[13px] leading-relaxed">
                                        <strong className="text-white">Secure Invite:</strong> Administrators provide a canonical email and assign a role. 
                                        The system generates a time-limited invitation token.
                                    </p>
                                </div>
                                <div className="bg-black/40 border border-white/5 p-6 rounded-[5px] flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-cyan-400/10 flex items-center justify-center shrink-0">
                                        <span className="text-cyan-400 text-xs font-bold">02</span>
                                    </div>
                                    <p className="text-slate-400 text-[13px] leading-relaxed">
                                        <strong className="text-white">Verification:</strong> The user receives a secure link to authenticate and initialize 
                                        their specific personnel credentials.
                                    </p>
                                </div>
                                <div className="bg-black/40 border border-white/5 p-6 rounded-[5px] flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-cyan-400/10 flex items-center justify-center shrink-0">
                                        <span className="text-cyan-400 text-xs font-bold">03</span>
                                    </div>
                                    <p className="text-slate-400 text-[13px] leading-relaxed">
                                        <strong className="text-white">Activation:</strong> Once claimed, the account status moves to <span className="text-cyan-400">ACTIVE</span>, 
                                        enabling permissions for the assigned operational tier.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <Ban className="w-4 h-4" />
                                Access Enforcement
                            </h2>
                            <p className="text-slate-400 text-[13px] leading-relaxed mb-6">
                                Administrators can terminate or suspend access via the <strong className="text-white">Actions</strong> menu:
                            </p>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <li className="px-4 py-3 border border-white/5 bg-white/[0.01]">
                                    <p className="text-white text-[11px] font-bold uppercase tracking-widest mb-1">Suspend Access</p>
                                    <p className="text-slate-500 text-[12px]">Renders the account dormant. The user cannot authenticate until reinstated.</p>
                                </li>
                                <li className="px-4 py-3 border border-white/5 bg-white/[0.01]">
                                    <p className="text-white text-[11px] font-bold uppercase tracking-widest mb-1">Remove User</p>
                                    <p className="text-slate-500 text-[12px]">Purges the account record and revokes all identity-based permissions permanently.</p>
                                </li>
                            </ul>
                        </section>
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <p className="text-slate-600 text-[10px] uppercase tracking-[0.2em]">© 2026 Wnode Technologies // Executive Documentation</p>
                </div>
            </div>
        </main>
    );
}
