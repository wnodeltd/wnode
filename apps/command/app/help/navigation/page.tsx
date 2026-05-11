"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft, Layout, Sidebar as SidebarIcon, PanelRight, Maximize2 } from "lucide-react";
import { usePageTitle } from "../../components/PageTitleContext";
import ImagePlaceholder from "../components/ImagePlaceholder";

export default function NavigationHelpPage() {
    usePageTitle("Navigation & Layout", "Structural guidance for the Command Portal interface.");

    return (
        <main className="flex-1 p-8 overflow-y-auto pb-24 font-sans text-slate-300">
            <div className="max-w-4xl mx-auto">
                <Link 
                    href="/help" 
                    className="flex items-center gap-2 text-cyan-400 text-[10px] uppercase font-bold tracking-widest mb-8 hover:text-white transition-colors"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Back to Help Center
                </Link>

                <div className="bg-white/[0.02] border border-white/10 p-12 rounded-[5px] shadow-2xl">
                    <h1 className="text-3xl font-bold text-white mb-4 uppercase tracking-tighter">Interface & Navigation</h1>
                    <p className="text-slate-400 text-sm leading-relaxed mb-12 max-w-2xl">
                        The Command Portal is designed for high-density executive oversight. Understanding the sidebar, panels, and slide-out patterns is key to efficient resource management.
                    </p>

                    <ImagePlaceholder name="cmd-navigation.png" />

                    <div className="space-y-16">
                        {/* 1. Global Sidebar */}
                        <section id="sidebar" className="scroll-mt-20">
                            <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <SidebarIcon className="w-4 h-4" />
                                1. Global Sidebar
                            </h2>
                            <p className="text-slate-400 text-[13px] leading-relaxed mb-6">
                                The left-hand sidebar is your primary navigation anchor. It provides instant access to all major operational sectors.
                            </p>
                            <ul className="list-disc pl-5 text-[12px] text-slate-400 space-y-2 mb-8">
                                <li><strong>Operations:</strong> The main dashboard and real-time fleet map.</li>
                                <li><strong>Network:</strong> Granular inventory of Nodes and User CRM.</li>
                                <li><strong>Finances:</strong> Authoritative ledgers and institutional statements.</li>
                            </ul>
                        </section>

                        {/* 2. Content Panels */}
                        <section id="panels" className="scroll-mt-20">
                            <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <Layout className="w-4 h-4" />
                                2. Modular Content Panels
                            </h2>
                            <p className="text-slate-400 text-[13px] leading-relaxed mb-6">
                                Pages are constructed using modular "Sovereign" panels. Each panel is dedicated to a specific data subset (e.g., Metrics, Charts, Tables).
                            </p>
                        </section>

                        {/* 3. Detail Slide-outs */}
                        <section id="slideouts" className="scroll-mt-20">
                            <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <PanelRight className="w-4 h-4" />
                                3. Contextual Slide-outs
                            </h2>
                            <p className="text-slate-400 text-[13px] leading-relaxed mb-6">
                                To maintain context, detailed records (Users, Nodes, Transactions) open in a right-hand slide-out drawer rather than a new page.
                            </p>
                            <ul className="list-disc pl-5 text-[12px] text-slate-400 space-y-2 mb-8">
                                <li><strong>Multi-tab Support:</strong> Most slide-outs feature internal tabs for deep-dive metadata.</li>
                                <li><strong>Dismissal:</strong> Click the backdrop or the close button to return to the main list.</li>
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
