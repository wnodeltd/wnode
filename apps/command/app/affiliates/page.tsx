"use client";

import React, { useState, useCallback } from "react";
import { usePageTitle } from "../components/PageTitleContext";
import GenesisList from "./components/GenesisList";
import AcquisitionTree from "./components/AcquisitionTree";
import DetailPanel from "./components/DetailPanel";
import SearchBar from "./components/SearchBar";

export default function AffiliatesPage() {
    usePageTitle("Affiliate Network", "");
    const [selectedAffiliate, setSelectedAffiliate] = useState<any>(null);

    // Task 6: Structural Hooks for Phase 2
    const handleRowClick = useCallback((node: any) => {
        // Sets the selected affiliate object for the Detail Panel and highlighting
        setSelectedAffiliate(node);
        console.log("Selection Update:", node.wuid || node.nodlrId);
    }, []);

    const handleL1Click = useCallback((e: React.MouseEvent, row: any) => {
        e.stopPropagation(); // Prevent row click
        // Will show Level 1 list recursively in Phase 2
        console.log("L1 List Hook:", row.wuid || row.nodlrId);
    }, []);

    const selectedId = selectedAffiliate?.wuid || selectedAffiliate?.nodlrId;

    return (
        <main className="flex-1 px-8 pt-3 pb-20 overflow-y-auto space-y-10 custom-scrollbar relative">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#22D3EE]/5 rounded-full blur-[120px] pointer-events-none -z-10" />

            {/* Search Bar only (Enunciators removed) */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <SearchBar />
            </div>

            {/* Section 4: Genesis Layer */}
            <GenesisList 
                onRowClick={handleRowClick}
                onL1Click={handleL1Click}
                selectedWuid={selectedId}
            />

            {/* Section 6: Acquisition Topology */}
            <AcquisitionTree 
                onNodeClick={handleRowClick} 
                selectedNodeId={selectedId}
            />

            {/* Section 7: Detail Panel Shell */}
            <DetailPanel 
                isOpen={!!selectedAffiliate} 
                onClose={() => setSelectedAffiliate(null)} 
                node={selectedAffiliate} 
            />
        </main>
    );
}
