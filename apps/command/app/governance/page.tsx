"use client";

import React, { useState } from "react";
import { usePageTitle } from "../components/PageTitleContext";
import LeftNav from "./components/LeftNav";
import OverviewPanel from "./components/OverviewPanel";
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
            <main className="flex-1 xl:ml-64 p-8 pt-24 pb-24 max-w-5xl mx-auto w-full space-y-12">
                
                <div onClick={() => openSlideOut("Overview Details")} className="cursor-pointer">
                    <OverviewPanel />
                </div>

                <div onClick={() => openSlideOut("Proposal Audit")} className="cursor-pointer">
                    <ProposalsPanel />
                </div>

                <div onClick={() => openSlideOut("Voting terminal")} className="cursor-pointer">
                    <VotingPanel />
                </div>

                <div onClick={() => openSlideOut("Discord Context")} className="cursor-pointer">
                    <DiscordPanel />
                </div>

                <div onClick={() => openSlideOut("Operational Intelligence")} className="cursor-pointer">
                    <OperationalPanel />
                </div>

                <div onClick={() => openSlideOut("Transparency Ledger")} className="cursor-pointer">
                    <TransparencyPanel />
                </div>

                <div onClick={() => openSlideOut("Protocol Documents")} className="cursor-pointer">
                    <DocumentsPanel />
                </div>

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
