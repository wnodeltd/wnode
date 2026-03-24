"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { CreditCard, Shield, Users, Lock, Settings } from "lucide-react";

export default function SettingsPage() {
    const [isStripeConnected, setIsStripeConnected] = useState(true);

    return (
        <div className="flex min-h-screen bg-black text-white font-sans overflow-hidden">
            <Sidebar />
            <div className="flex-1 lg:pl-64 flex flex-col relative h-screen overflow-hidden">
                <header className="h-14 border-b border-white/25 flex items-center justify-between px-8 bg-black shrink-0">
                    <span className="text-[12px] font-normal text-slate-400 tracking-[0.2em] uppercase-none">System Security</span>
                    <div className="flex items-center gap-2.5 bg-[#22D3EE] px-3 py-1 rounded-[5px]">
                        <span className="text-[14px] text-black font-normal uppercase-none">Stephen_Nodlrs [Owner]</span>
                    </div>
                </header>

                <main className="flex-1 p-10 overflow-y-auto pb-24 space-y-10">
                    <div className="pb-2">
                        <h2 className="text-[16px] font-normal tracking-tight text-white mb-1 uppercase-none">Settings & controls</h2>
                        <p className="text-[14px] text-slate-400 font-normal uppercase-none">Manage platform governance, financials, and security parameters.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Financial Providers */}
                        <div className="card-sovereign p-8 flex flex-col gap-6">
                            <div className="flex items-center gap-3">
                                <CreditCard className="w-4 h-4 text-[#22D3EE]" />
                                <span className="text-[14px] font-normal text-white uppercase-none">Financial providers</span>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-white/[0.04] border border-white/10 rounded-[5px] group hover:border-[#22D3EE]/30 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-[5px] bg-white/5 flex items-center justify-center font-bold text-slate-500">S</div>
                                        <div className="flex flex-col">
                                            <span className="text-[14px] text-white">Stripe Connect</span>
                                            <span className="text-[11px] text-slate-500 font-normal">Automated Payouts & Escrow</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {isStripeConnected ? (
                                            <span className="text-[10px] px-2 py-0.5 bg-[#22D3EE]/10 text-[#22D3EE] rounded-full font-mono">CONNECTED</span>
                                        ) : (
                                            <button className="text-[10px] px-2 py-0.5 bg-slate-800 text-slate-400 rounded-full font-mono hover:bg-slate-700 transition-all">RECONNECT</button>
                                        )}
                                        <button className="text-slate-600 hover:text-white transition-colors">
                                            <Settings className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-[5px] opacity-40">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-[5px] bg-white/5 flex items-center justify-center font-bold text-slate-500">P</div>
                                        <div className="flex flex-col">
                                            <span className="text-[14px] text-white">PayPal Enterprise</span>
                                            <span className="text-[11px] text-slate-500">Secondary Fiat Gateway</span>
                                        </div>
                                    </div>
                                    <span className="text-[10px] px-2 py-0.5 border border-white/10 text-slate-500 rounded-full font-mono">AVAILABLE</span>
                                </div>

                                <button className="w-full py-3 border border-dashed border-white/10 rounded-[5px] text-[12px] text-slate-500 hover:text-white hover:border-white/20 transition-all font-normal">+ Add New Provider</button>
                            </div>
                        </div>

                        {/* Staff Access Registry */}
                        <div className="card-sovereign p-8 flex flex-col gap-6">
                            <div className="flex items-center gap-3">
                                <Users className="w-4 h-4 text-[#22D3EE]" />
                                <span className="text-[14px] font-normal text-white uppercase-none">Staff access registry</span>
                            </div>
                            <div className="space-y-4">
                                {[
                                    { name: 'Stephen_Nodlrs', role: 'Owner', access: 'God-Mode' },
                                    { name: 'Admin_01', role: 'Manager', access: 'Financials' },
                                ].map((staff) => (
                                    <div key={staff.name} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-[5px]">
                                        <div className="flex flex-col">
                                            <span className="text-[14px] text-white">{staff.name}</span>
                                            <span className="text-[11px] text-slate-500 font-normal">{staff.role}</span>
                                        </div>
                                        <span className="text-[10px] font-mono text-[#22D3EE]">{staff.access}</span>
                                    </div>
                                ))}
                                <button className="w-full py-3 border border-dashed border-white/10 rounded-[5px] text-[12px] text-slate-500 hover:text-white hover:border-white/20 transition-all font-normal">+ Add New Staff</button>
                            </div>
                        </div>

                        {/* Network Lockdown */}
                        <div className="card-sovereign p-8 flex flex-col gap-8">
                            <div className="flex items-center gap-3">
                                <Lock className="w-4 h-4 text-slate-500" />
                                <span className="text-[14px] font-normal text-white uppercase-none">Network lockdown</span>
                            </div>
                            <div className="space-y-8">
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-[13px] text-white">Emergency Shutdown</span>
                                        <span className="text-[11px] text-slate-600 font-normal italic">Immediate kill of all network protocols.</span>
                                    </div>
                                    <div className="w-12 h-6 bg-slate-800 rounded-full relative p-1 cursor-pointer">
                                        <div className="w-4 h-4 bg-slate-600 rounded-full" />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-[13px] text-white">Maintenance Mode</span>
                                        <span className="text-[11px] text-slate-600 font-normal italic">Redirect login to status page.</span>
                                    </div>
                                    <div className="w-12 h-6 bg-white/10 rounded-full relative p-1 cursor-pointer">
                                        <div className="w-4 h-4 bg-[#22D3EE] rounded-full ml-auto" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
