"use client";

import React from "react";
import Sidebar from "./Sidebar";
import IdentityHeader from "@shared/components/IdentityHeader";

interface ShellProps {
    children: React.ReactNode;
}

export default function Shell({ children }: ShellProps) {
    return (
        <div className="flex min-h-screen bg-black text-white font-sans overflow-hidden">
            {/* Sidebar is fixed on LG+ screens */}
            <Sidebar />

            <div className="flex-1 lg:pl-64 flex flex-col relative h-screen overflow-hidden">
                {/* Persistent Identity Header */}
                <header className="h-16 flex items-center justify-end px-8 border-b border-white/5 bg-black/20 backdrop-blur-md shrink-0 relative z-50">
                    <IdentityHeader />
                </header>

                {/* Content Area */}
                <div className="flex-1 overflow-auto relative flex flex-col items-stretch w-full min-h-full">
                    {children}
                </div>
            </div>
        </div>
    );
}
