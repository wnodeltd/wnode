'use client';

import { Wallet, Leaf, Plus } from 'lucide-react';
import { useBilling } from './BillingProvider';
import { useAuth } from './AuthProvider';
import { Basket } from './Basket';
import { TopUpDialogue } from './TopUpDialogue';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

const PAGE_TITLES: Record<string, string> = {
    '/dashboard': 'MEMBER OVERVIEW',
    '/catalog': 'COMPUTE CATALOG',
    '/jobs': 'JOB MANAGEMENT',
    '/billing': 'FINANCIAL LEDGER',
    '/settings': 'ACCOUNT SETTINGS',
    '/help': 'CUSTOMER GUIDANCE',
};

export function Header() {
    const { balance, setIsTopUpOpen } = useBilling();
    const { user: profile } = useAuth();
    const pathname = usePathname();

    const currentTitle = PAGE_TITLES[pathname] || 'MESH SYSTEM';

    return (
        <header className="h-16 border-b border-white/10 flex items-center justify-between px-8 bg-[#080808]/80 backdrop-blur-md sticky top-0 z-40 font-sans">
            {/* Left Section: Page Title & User Context */}
            <div className="flex items-center gap-6 w-1/3">
                <div className="flex flex-col">
                    <h2 className="text-sm font-black text-white tracking-[0.2em] uppercase leading-none">
                        {currentTitle}
                    </h2>
                </div>
            </div>

            {/* Middle Section: Actions */}
            <div className="flex-1 flex justify-center items-center gap-3 overflow-visible">
                <button 
                    onClick={() => setIsTopUpOpen(true)}
                    className="flex items-center gap-2.5 text-sm uppercase font-black bg-blue-600 text-white border border-transparent px-8 py-3.5 transition-all rounded-[4px] shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:bg-blue-500"
                >
                    <Plus className="w-4 h-4" />
                    Top Up
                </button>
            </div>

            {/* Right Section: Profile & Stats */}
            <div className="flex items-center gap-5 w-1/3 justify-end">
                {/* Carbon Saved Indicator */}
                <div className="hidden lg:flex items-center gap-2.5 px-6 py-2.5 bg-[#064e3b] text-white/90 border border-white/5 rounded-[4px] shadow-lg transition-all cursor-default">
                    <Leaf className="w-3.5 h-3.5 text-white/70" />
                    <div className="flex flex-col">
                        <span className="text-[7px] font-medium text-white/60 tracking-[0.2em] leading-none mb-1 uppercase">Total Impact</span>
                        <span className="text-xs font-medium text-white tracking-tight leading-none uppercase">14.4 kg CO2 Saved</span>
                    </div>
                </div>

                <div className="h-6 w-[1px] bg-white/10 mx-1" />

                <div className="flex flex-col items-end">
                    <span className="text-16px font-bold text-white tracking-tight">
                        {profile?.full_name || 'Stephen Soos'}
                    </span>
                    <span className="text-[14.4px] text-[#3B82F6] font-bold tracking-tight font-mono">
                        {profile?.meshClientId || 'M0-000001-0420'}
                    </span>
                </div>


            </div>

            <TopUpDialogue />
        </header>
    );
}
