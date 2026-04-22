"use client";

import React from "react";
import Link from "next/link";
import { 
    HelpCircle, Zap, CreditCard, Cpu, Activity, 
    ShieldCheck, ChevronRight, BookOpen, Inbox, Shield, Database, LayoutGrid
} from "lucide-react";

export default function HelpPage() {
    const sections = [
        {
            title: "Compute Marketplace",
            icon: LayoutGrid,
            href: "/help/marketplace",
            items: [
                "Compute Tiers: Access specific hardware profiles from Tiny (sandbox) to Ultra (multi-GPU).",
                "Market Pricing: Rates are dynamically set based on global supply and demand.",
                "Region Selection: Optimize latency by selecting compute pools closest to your data."
            ]
        },
        {
            title: "Job Orchestration",
            icon: Cpu,
            href: "/help/jobs",
            items: [
                "Job Bundles: Upload your compute logic as signed Job Bundles for distributed execution.",
                "Task Manifests: Define resource requirements, budgets, and lifecycle policies.",
                "Real-time Monitoring: Track execution progress and resource consumption via the dashboard."
            ]
        },
        {
            title: "Billing & Credits",
            icon: CreditCard,
            href: "/help/billing",
            items: [
                "Mesh Credits: Pre-fund your account with credits to ensure instantaneous provisioning.",
                "Top-Up System: Use the integrated Stripe flow to add funds to your financial ledger.",
                "Usage Transparency: View itemized transaction logs for every compute task executed."
            ]
        },
        {
            title: "Security & Trust",
            icon: ShieldCheck,
            href: "/help/security",
            items: [
                "Confidential Compute: Use DECC/TEE tiers for encrypted processing in secure enclaves.",
                "Signed Payloads: All compute job bundles must be cryptographically signed before submission.",
                "Immutable Ledger: Every transaction is recorded on the platform's audit-ready ledger."
            ]
        },
        {
            title: "API & Integration",
            icon: Activity,
            href: "/help/api",
            items: [
                "Mesh API: Programmatically manage jobs and credits using our high-performance REST API.",
                "SDK Access: Use the Wnode SDKs to integrate mesh compute into your existing workflows.",
                "WebSocket Streams: Subscribe to live job status updates and telemetry feeds."
            ]
        },
        {
            title: "Technical Support",
            icon: Inbox,
            href: "/help/support",
            items: [
                "Infrastructure Status: View the current operational state of global compute regions.",
                "Direct Support: Contact the Mesh Operations team for critical execution failures.",
                "Developer Docs: Detailed technical specifications for job bundle construction."
            ]
        }
    ];

    return (
        <main className="min-h-screen bg-black text-white p-12">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-16 border-b border-white/10 pb-8 underline-offset-8 decoration-mesh-emerald/30">
                    <div className="w-12 h-12 rounded-full border border-mesh-emerald/20 flex items-center justify-center bg-mesh-emerald/5 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                        <HelpCircle className="w-6 h-6 text-mesh-emerald" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold uppercase tracking-[0.3em]">Customer Guidance</h1>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-2">Nodl Mesh Handbook // v1.2.0-mesh</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {sections.map((section, idx) => (
                        <Link 
                            key={idx} 
                            href={section.href}
                            className="bg-[#050505] border border-white/5 p-8 rounded-none hover:border-mesh-emerald/30 transition-all group relative overflow-hidden block"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                                <section.icon className="w-16 h-16" />
                            </div>
                            
                            <div className="flex items-center gap-3 mb-6">
                                <section.icon className="w-4 h-4 text-mesh-emerald" />
                                <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/90 group-hover:text-mesh-emerald transition-colors">{section.title}</h2>
                            </div>

                            <div className="space-y-4">
                                {section.items.map((item, i) => (
                                    <div key={i} className="flex gap-3 text-[12px] text-slate-400 leading-relaxed font-normal">
                                        <ChevronRight className="w-3 h-3 mt-1 shrink-0 text-mesh-emerald/40" />
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="mt-20 pt-8 border-t border-white/5 flex justify-between items-center opacity-40 hover:opacity-100 transition-opacity duration-500">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold">
                        <Shield className="w-3 h-3 text-mesh-emerald" />
                        Verified Mesh Ecosystem
                    </div>
                    <div className="text-[9px] uppercase tracking-widest font-mono text-slate-500">
                        HASH: MESH-991-DDL-02 // SIG: 0xMESH
                    </div>
                </div>
            </div>
        </main>
    );
}
