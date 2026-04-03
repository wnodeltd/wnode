"use client";

import React from "react";
import Sidebar from "./Sidebar";
import IdentityHeader from "./IdentityHeader";

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
                <IdentityHeader />

                {/* Content Area */}
                <div className="flex-1 overflow-auto relative flex flex-col items-stretch w-full min-h-full">
                    {children}
                </div>
            </div>
        </div>
    );
}
