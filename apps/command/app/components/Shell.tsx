"use client";

import React from "react";
import Link from "next/link";
import Sidebar from "./Sidebar";
import IdentityHeader from "@shared/components/IdentityHeader";
import { PageTitleProvider, usePageTitle } from "./PageTitleContext";

function HeaderContent() {
    const { pageTitle } = usePageTitle();
    return (
        <header className="h-16 border-b border-white/10 flex items-center justify-between px-8 bg-neutral-950 shrink-0 z-50">
            <div className="flex items-center gap-4">
                <Link href="/" className="flex items-center">
                    <img src="/logo.webp" alt="NODL Logo" className="h-8" />
                </Link>
                <h1 className="text-lg font-normal tracking-tight text-white uppercase tracking-widest">{pageTitle}</h1>
            </div>
            <div className="flex items-center gap-6">
                <IdentityHeader />
            </div>
        </header>
    );
}

export default function Shell({ children }: { children: React.ReactNode }) {
    return (
        <PageTitleProvider>
            <div className="flex h-screen bg-black text-slate-200 overflow-hidden font-sans selection:bg-cyan-500/30">
                <Sidebar />
                <div className="flex-1 lg:pl-64 flex flex-col min-w-0 bg-neutral-950 overflow-hidden relative">
                    <HeaderContent />
                    <div className="flex-1 overflow-auto relative flex flex-col items-stretch w-full min-h-full">
                        {children}
                    </div>
                </div>
            </div>
        </PageTitleProvider>
    );
}
