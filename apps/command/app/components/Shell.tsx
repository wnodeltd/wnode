"use client";

import React from "react";
import Link from "next/link";
import Sidebar from "./Sidebar";
import IdentityHeader from "@shared/components/IdentityHeader";
import { PageTitleProvider, usePageTitle } from "./PageTitleContext";


import TopHeader from "./TopHeader";

export default function Shell({ children }: { children: React.ReactNode }) {
    return (
        <PageTitleProvider>
            <div className="flex h-screen bg-black text-slate-200 overflow-hidden font-sans selection:bg-cyan-500/30">
                <Sidebar />
                <div className="flex-1 lg:pl-64 flex flex-col min-w-0 bg-neutral-950 overflow-hidden relative">
                    <TopHeader />
                    <div className="flex-1 overflow-auto relative flex flex-col items-stretch w-full min-h-full">
                        {children}
                    </div>
                </div>
            </div>
        </PageTitleProvider>
    );
}
