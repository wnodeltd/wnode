"use client";

import React, { useState, useCallback } from "react";
import { usePageTitle } from "../components/PageTitleContext";
import GenesisList from "./components/GenesisList";
import AcquisitionTree from "./components/AcquisitionTree";
import DetailPanel from "./components/DetailPanel";
import SearchBar from "./components/SearchBar";
import Enunciators from "./components/Enunciators";

export default function AffiliatesPage() {
    usePageTitle("Affiliate Network", "Hierarchical network topology and node distribution audit");
    const [selectedAffiliate, setSelectedAffiliate] = useState<any>(null);

    // Task 6: Structural Hooks for Phase 2
    const handleRowClick = useCallback((row: any) => {
        // Will open Detail Panel for the affiliate
        setSelectedAffiliate(row);
        console.log("Detail Panel Hook:", row.wuid);
    }, []);

    const handleL1Click = useCallback((e: React.MouseEvent, row: any) => {
        e.stopPropagation(); // Prevent row click
        // Will show Level 1 list recursively in Phase 2
        console.log("L1 List Hook:", row.wuid);
    }, []);

    return (
        <main className="flex-1 px-8 pt-3 pb-20 overflow-y-auto space-y-10 custom-scrollbar relative">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#22D3EE]/5 rounded-full blur-[120px] pointer-events-none -z-10" />

            {/* Search and Enunciators Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <SearchBar />
                <Enunciators />
            </div>

            {/* Section 4: Genesis Layer (Replacing Section 3 Grid) */}
            <GenesisList 
                onRowClick={handleRowClick}
                onL1Click={handleL1Click}
            />

            {/* Section 6: Acquisition Topology */}
            <AcquisitionTree />

            {/* Section 7: Detail Panel Shell */}
            {/* Logic wiring for isOpen/onClose will be implemented in Phase 2 based on structure below */}
            <DetailPanel />
        </main>
    );
}
