"use client";

import React, { useState } from "react";
import { usePageTitle } from "../components/PageTitleContext";
import { Terminal } from 'lucide-react';
import LeftNav from "./components/LeftNav";
import OverviewPanel from "./components/OverviewPanel";
import CommunityPanel from "./components/CommunityPanel";
import ProposalsPanel from "./components/ProposalsPanel";
import VotingPanel from "./components/VotingPanel";
import DiscordPanel from "./components/DiscordPanel";
import OperationalPanel from "./components/OperationalPanel";
import TransparencyPanel from "./components/TransparencyPanel";
import DocumentsPanel from "./components/DocumentsPanel";
import SlideOutHost from "./components/SlideOutHost";

export default function GovernancePage() {
    usePageTitle("Governance", "Participate in the decentralized management and evolution of the Nodl network.");
    
    const [isSlideOutOpen, setIsSlideOutOpen] = useState(false);
    const [slideOutTitle, setSlideOutTitle] = useState("");

    const openSlideOut = (title: string) => {
        setSlideOutTitle(title);
        setIsSlideOutOpen(true);
    };

    return (
        <div className="flex flex-1 relative">
            {/* Anchor Navigation */}
            <LeftNav />

            {/* Main Content Column */}
            <main className="flex-1 p-6 pt-10 pb-12 w-full flex flex-col">
                
                <div className="grid grid-cols-1 gap-8">
                    {/* Row 1: Overview */}
                    <section id="overview">
                        <OverviewPanel />
                    </section>

                    {/* Row 2: Community (Discord Embed) */}
                    <section id="community">
                        <CommunityPanel />
                    </section>

                    {/* Row 3: Proposals & Voting */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <section id="proposals" onClick={() => openSlideOut("Proposal Audit")} className="cursor-pointer">
                            <ProposalsPanel />
                        </section>
                        <section id="voting" onClick={() => openSlideOut("Voting terminal")} className="cursor-pointer">
                            <VotingPanel />
                        </section>
                    </div>

                    {/* Row 4: Discord & Operational */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <section id="discord" onClick={() => openSlideOut("Discord Context")} className="cursor-pointer">
                            <DiscordPanel />
                        </section>
                        <section id="operational" onClick={() => openSlideOut("Operational Intelligence")} className="cursor-pointer">
                            <OperationalPanel />
                        </section>
                    </div>

                    {/* Row 5: Transparency */}
                    <section id="transparency" onClick={() => openSlideOut("Transparency Ledger")} className="cursor-pointer">
                        <TransparencyPanel />
                    </section>

                    {/* Row 6: Documents */}
                    <section id="documents" onClick={() => openSlideOut("Protocol Documents")} className="cursor-pointer">
                        <DocumentsPanel />
                    </section>
                </div>

                {/* Footer */}
                <footer className="mt-20 flex flex-col items-center gap-2 pb-12 border-t border-white/5 pt-12">
                    <div className="flex items-center gap-2 text-slate-500">
                        <Terminal className="w-4 h-4 text-slate-600" />
                        <span className="text-[11px] uppercase tracking-[0.2em] font-medium">
                            Wnode Command — Executive Control v1.0
                        </span>
                    </div>
                </footer>

            </main>

            {/* Detail Overlay Host */}
            <SlideOutHost 
                isOpen={isSlideOutOpen} 
                onClose={() => setIsSlideOutOpen(false)} 
                title={slideOutTitle} 
            />
        </div>
    );
}
