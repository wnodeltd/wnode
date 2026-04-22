"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft, CreditCard, ShieldCheck, ExternalLink, RefreshCw } from "lucide-react";

export default function WnoderStripeHelp() {
    return (
        <main className="min-h-screen bg-black text-white p-12 font-sans">
            <div className="max-w-4xl mx-auto">
                <Link 
                    href="/help" 
                    className="flex items-center gap-2 text-cyan-400 text-[10px] uppercase font-bold tracking-widest mb-12 hover:text-white transition-colors"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Back to Help Center
                </Link>

                <div className="flex items-center gap-4 mb-12 border-b border-white/10 pb-8">
                    <div className="w-12 h-12 rounded-full border border-cyan-400/20 flex items-center justify-center bg-cyan-400/5">
                        <CreditCard className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold uppercase tracking-[0.2em] mb-1">Stripe Payouts</h1>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest">Onboarding & Financial Settlement</p>
                    </div>
                </div>

                <div className="space-y-16">
                    <section>
                        <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6">
                            Express Onboarding
                        </h2>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6">
                            Wnode uses Stripe Express to provide a seamless, secure payout experience. To receive earnings, 
                            you must complete your financial onboarding through the Stripe portal.
                        </p>
                        <ul className="space-y-4">
                            <li className="flex gap-4 p-4 bg-[#050505] border border-white/5">
                                <span className="text-cyan-400 font-mono text-xs mt-1">01</span>
                                <div>
                                    <p className="text-white text-xs font-bold mb-1 uppercase tracking-widest">Connect Identity</p>
                                    <p className="text-slate-500 text-[12px]">Navigate to the Security settings and select 'Connect Stripe'. You will be redirected to Stripe's secure environment.</p>
                                </div>
                            </li>
                            <li className="flex gap-4 p-4 bg-[#050505] border border-white/5">
                                <span className="text-cyan-400 font-mono text-xs mt-1">02</span>
                                <div>
                                    <p className="text-white text-xs font-bold mb-1 uppercase tracking-widest">Verify Documents</p>
                                    <p className="text-slate-500 text-[12px]">Complete the required KYC (Know Your Customer) verification. This is required for institutional transparency.</p>
                                </div>
                            </li>
                            <li className="flex gap-4 p-4 bg-[#050505] border border-white/5">
                                <span className="text-cyan-400 font-mono text-xs mt-1">03</span>
                                <div>
                                    <p className="text-white text-xs font-bold mb-1 uppercase tracking-widest">Payout Enabled</p>
                                    <p className="text-slate-500 text-[12px]">Once verified, your Wnode dashboard will show a 'Stripe Connected' status and reflect your pending earnings.</p>
                                </div>
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6">
                            Payout Security
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="p-6 bg-[#080808] border-l-2 border-cyan-400">
                                <h3 className="text-white text-xs font-bold mb-3 uppercase tracking-widest flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4 text-cyan-400" />
                                    Zero-Custody
                                </h3>
                                <p className="text-slate-500 text-[12px] leading-relaxed">
                                    Wnode does not store your bank details. All sensitive financial information is 
                                    handled exclusively by Stripe.
                                </p>
                            </div>
                            <div className="p-6 bg-[#080808] border-l-2 border-cyan-400">
                                <h3 className="text-white text-xs font-bold mb-3 uppercase tracking-widest flex items-center gap-2">
                                    <RefreshCw className="w-4 h-4 text-cyan-400" />
                                    Manual Refresh
                                </h3>
                                <p className="text-slate-500 text-[12px] leading-relaxed">
                                    If your payout status seems stuck, use the 'Sync Financials' button in settings 
                                    to force a handshake with the Stripe API.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="p-8 border border-cyan-400/20 bg-cyan-400/[0.02]">
                        <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-4">
                            Stripe Dashboard
                        </h2>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6">
                            You can access your detailed tax forms, transaction history, and account settings 
                            directly via the Stripe Express Dashboard.
                        </p>
                        <button className="flex items-center gap-2 text-cyan-400 text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors">
                            External Link: stripe.com/express
                            <ExternalLink className="w-3 h-3" />
                        </button>
                    </section>
                </div>
            </div>
        </main>
    );
}
