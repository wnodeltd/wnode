"use client";

import React from "react";
import { usePageTitle } from "./PageTitleContext";
import IdentityHeader from "@shared/components/IdentityHeader";
import { ChevronRight } from "lucide-react";

export default function TopHeader() {
    const { pageTitle, pageSubtitle } = usePageTitle();

    return (
        <header className="sticky top-0 z-40 w-full bg-black/60 backdrop-blur-md border-b border-white/5 px-8 py-4 flex items-center justify-between">
            <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                    <h1 className="text-[14px] font-bold text-white uppercase tracking-widest leading-none">
                        {pageTitle || "Overview"}
                    </h1>
                </div>
                {pageSubtitle && (
                    <p className="text-[11px] text-slate-500 font-medium tracking-tight mt-0.5">
                        {pageSubtitle}
                    </p>
                )}
            </div>

            <div className="flex items-center gap-4">
                <IdentityHeader />
            </div>
        </header>
    );
}
