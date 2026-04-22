"use client";

import React from "react";
import { 
    HelpCircle, BookOpen, ShieldCheck, PieChart, Activity, 
    ChevronRight, ExternalLink, Info, Wrench, Inbox, AlertOctagon, Terminal, DollarSign
} from "lucide-react";
import Link from "next/link";
import { usePageTitle } from "../components/PageTitleContext";

export default function HelpPage() {
    usePageTitle("System Documentation", "Comprehensive platform guidance and operational intelligence.");

    const sections = [
        {
            title: "System Overview",
            icon: BookOpen,
            href: "/help/overview",
            items: [
                "Dashboard Navigation: Access global platform metrics from the Overview panel.",
                "Real-time Monitoring: View live network compute, memory, and user momentum.",
                "Sovereign Branding: The portal provides a unified interface for executive oversight."
            ]
        },
        {
            title: "Personnel Governance",
            icon: ShieldCheck,
            href: "/help/personnel",
            items: [
                "RBAC Access Levels: Owner, Management, Customer Service, and Visitor tiers.",
                "Invitation Workflow: Securely onboard staff and manage invitation tokens.",
                "Account Lifecycle: Suspend or reinstate access with real-time enforcement."
            ]
        },
        {
            title: "Founder Affiliates",
            icon: PieChart,
            href: "/help/affiliates",
            items: [
                "Genesis Pool: Managing the core layer of the affiliate economic network.",
                "Revenue Overrides: Authorized 3% commission layer for founder accounts.",
                "Organic Rotation: Sequential, persistent assignment of unreferred signups."
            ]
        },
        {
            title: "Network Inventory",
            icon: Activity,
            href: "/help/inventory",
            items: [
                "Node Management: Real-time status tracking (Active, Suspended, Offline).",
                "Pairing Protocol: Securely connecting hardware via WN-pairing codes.",
                "Telemetry Inspector: Deep-dive into individual node performance and metadata."
            ]
        },
        {
            title: "Money & Ledgers",
            icon: DollarSign,
            href: "/help/ledger",
            items: [
                "Economic Split: Authoritative 80% provider / 10% platform / 5% affiliate distribution.",
                "Stripe Health: Real-time visibility into payout capabilities and compliance status.",
                "Audit Tracing: Comprehensive transaction logs with job-level cross-referencing."
            ]
        },
        {
            title: "Pricing Protocol",
            icon: Terminal,
            href: "/help/pricing",
            items: [
                "Compute Tiers: Standardizing mesh resource costs across the marketplace.",
                "Dynamic Adjustment: Future-ready mechanisms for protocol-level price shifts.",
                "Market Historicals: Tracking pricing stability and demand momentum."
            ]
        },
        {
            title: "Sovereign Settings",
            icon: Wrench,
            href: "/help/settings",
            items: [
                "Global Parameters: Configure fees, thresholds, and system intervals.",
                "Maintenance Core: RBAC-locked overrides for backend and P2P resets.",
                "Business Profile: Centralized Stripe synchronization for administrative accounts."
            ]
        }
    ];

    return (
        <main className="flex-1 p-8 overflow-y-auto pb-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                {sections.map((section, idx) => (
                    <Link 
                        key={idx} 
                        href={section.href}
                        className="bg-white/[0.02] border border-white/10 rounded-[5px] p-8 hover:bg-white/[0.04] hover:border-cyan-400/30 transition-all group block"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className={`p-3 rounded-[5px] bg-white/5 border border-white/10 ${section.iconColor || 'text-slate-400'} group-hover:bg-cyan-400 group-hover:text-black group-hover:border-cyan-400 transition-all shrink-0`}>
                                <section.icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-[14px] font-bold uppercase tracking-widest text-white group-hover:text-cyan-400 transition-colors">{section.title}</h2>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 transition-colors" />
                        </div>
                        
                        <div className="space-y-4 text-slate-400">
                            {section.items.map((item, i) => (
                                <div key={i} className="flex gap-3 text-[13px] leading-relaxed">
                                    <div className="w-1 h-1 rounded-full bg-cyan-400/20 mt-2 shrink-0 group-hover:bg-cyan-400/40 transition-colors" />
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>
                    </Link>
                ))}
            </div>

            <div className="mt-12 pt-8 border-t border-white/5 max-w-6xl mx-auto flex flex-col items-center gap-4">
                <div className="flex items-center gap-2 text-slate-500 text-[10px] uppercase font-bold tracking-[0.2em]">
                    <ShieldCheck className="w-3 h-3 text-green-400/40" />
                    Wnode Core Executive Help System v1.0
                </div>
                <div className="text-slate-600 text-[9px] uppercase tracking-widest italic">
                    Documentation generated in real-time based on active subsystem configurations
                </div>
            </div>
        </main>
    );
}
