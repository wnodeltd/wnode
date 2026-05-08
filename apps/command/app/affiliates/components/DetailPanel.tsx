"use client";

import React from "react";
import { X, Shield, Activity, Network, Zap, Clock, Terminal } from "lucide-react";

export default function DetailPanel() {
    return (
        <div className="fixed top-0 right-0 h-full w-[450px] bg-[#0A0A0A] border-l border-white/10 z-[100] shadow-[0_0_50px_rgba(0,0,0,0.8)] translate-x-full">
            <div className="p-8 space-y-8">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h2 className="text-[14px] font-bold text-white uppercase tracking-widest">Affiliate Intelligence</h2>
                        <p className="text-[10px] text-slate-500 font-mono">Node Trace Registry</p>
                    </div>
                    <button className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-500">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-10">
                    <section className="space-y-4">
                        <div className="h-24 bg-white/[0.02] border border-white/5 rounded-[5px] animate-pulse" />
                    </section>
                    <section className="space-y-4">
                        <h3 className="text-[11px] text-slate-400 uppercase tracking-widest border-b border-white/5 pb-2">Hardware Blueprint</h3>
                        <div className="space-y-3 h-32 bg-white/[0.01] rounded animate-pulse" />
                    </section>
                </div>
            </div>
        </div>
    );
}
