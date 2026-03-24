'use client';

import React, { useState } from 'react';
import { CreditCard, Plus, ArrowUpRight, ArrowDownLeft, FileText, Download, Loader2, ShieldCheck } from 'lucide-react';

const TRANSACTIONS = [
    { id: '1', date: '21 MAR 2026', desc: 'Auto-Reload Credits', amount: '+$500.00', status: 'Success' },
    { id: '2', date: '20 MAR 2026', desc: 'Task #8412 Exec Fee', amount: '-$12.42', status: 'Success' },
    { id: '3', date: '19 MAR 2026', desc: 'SLA Reserved Pool [EU]', amount: '-$150.00', status: 'Success' },
    { id: '4', date: '18 MAR 2026', desc: 'Batch Inference #721', amount: '-$0.85', status: 'Success' },
];

export default function BillingPage() {
    const [balance, setBalance] = useState(1242.00);
    const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

    const handleLoadCredits = () => {
        setIsCheckoutLoading(true);
        // Mock Stripe Checkout session
        setTimeout(() => {
            setBalance(prev => prev + 500);
            setIsCheckoutLoading(false);
        }, 1500);
    };

    return (
        <div className="p-10 max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 ">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-normal lowercase tracking-tighter text-white mb-1.5 ">Billing Nexus</h1>
                </div>
                <button 
                    onClick={() => {}}
                    className="flex items-center gap-2 bg-[#10b981] hover:bg-[#10b981]/80 text-black px-6 py-4 font-normal text-xs uppercase tracking-widest transition-all shadow-lg disabled:opacity-50 rounded-[5px]"
                >
                    {isCheckoutLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Add Credits
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Balance Card */}
                <div className="surface-card p-6 flex flex-col justify-between">
                    <span className="text-[10px] uppercase font-normal text-slate-500 tracking-widest">Marketplace Balance</span>
                    <div className="mt-2">
                        <span className="text-5xl font-normal text-white tracking-tighter">
                            $1,242.00
                        </span>
                    </div>
                </div>

                <div className="surface-card p-6 flex flex-col justify-between">
                    <span className=" text-[10px] uppercase font-normal text-slate-500 tracking-widest">Usage (30d)</span>
                    <div className="mt-2">
                        <span className="text-4xl font-normal text-white tracking-tighter">$482.10</span>
                    </div>
                </div>

                <div className="surface-card p-6 flex flex-col justify-between">
                    <span className=" text-[10px] uppercase font-normal text-slate-500 tracking-widest">Reserved Nodes</span>
                    <div className="mt-2">
                        <span className="text-4xl font-normal text-[#9d00ff] tracking-tighter">12</span>
                    </div>
                </div>
            </div>

            {/* Transaction History */}
            <div className="surface-card overflow-hidden">
                <div className="p-6 border-b border-white/10">
                    <h3 className=" text-xs uppercase font-normal text-white tracking-widest">Transaction History</h3>
                </div>
                <div className="divide-y divide-white/10">
                    {TRANSACTIONS.map((tx, i) => (
                        <div key={i} className="p-6 flex justify-between items-center group hover:bg-white/[0.02] transition-colors">
                            <div className="flex flex-col">
                                <span className="text-sm text-white font-normal">{tx.desc}</span>
                                <span className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">{tx.date} • {tx.id}</span>
                            </div>
                            <div className="flex items-center gap-6">
                                <span className={`text-sm font-normal ${tx.amount.startsWith('+') ? 'text-green-500' : 'text-white'}`}>{tx.amount}</span>
                                <div className="flex items-center gap-2 text-slate-500">
                                    <span className={tx.status === 'Success' ? 'text-green-500/50' : 'text-red-500 font-normal'}>{tx.status}</span>
                                    <button className="p-2 hover:bg-white/5 transition-colors rounded-[4px]">
                                        <FileText className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}


function ShieldCheckIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    )
}
