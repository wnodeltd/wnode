"use client";

import React from "react";
import { usePageTitle } from "../components/PageTitleContext";
import { Shield, Info, Lock } from "lucide-react";

export default function SettingsPage() {
    usePageTitle("System Settings", "Core protocol configuration and administrative controls.");

    return (
        <main className="flex-1 p-8 pt-24 overflow-y-auto pb-24 relative flex items-center justify-center focus:outline-none">
            <div className="max-w-md w-full bg-white/[0.02] border border-white/10 rounded-[5px] p-8 text-center space-y-6 backdrop-blur-xl shadow-2xl">
                <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center justify-center mx-auto">
                    <Shield className="w-8 h-8 text-amber-500" />
                </div>
                
                <div className="space-y-2">
                    <h2 className="text-lg font-bold text-white uppercase tracking-widest">Administrative Lock</h2>
                    <p className="text-xs text-slate-500 leading-relaxed">
                        System-level configuration is managed by the Wnode engineering team. 
                        For protocol adjustments or constant tuning, please contact technical support 
                        or refer to the executive documentation.
                    </p>
                </div>

                <div className="pt-4 border-t border-white/5 flex flex-col gap-3">
                    <div className="flex items-center justify-center gap-2 text-[10px] text-slate-600 uppercase tracking-widest font-bold">
                        <Lock className="w-3 h-3" />
                        <span>Security Policy Active</span>
                    </div>
                </div>
            </div>

            {/* Ambient background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />
        </main>
    );
}
