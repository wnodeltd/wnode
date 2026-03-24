'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Database, Cpu, CreditCard, Code, LogOut, Layers } from 'lucide-react';

export default function Sidebar() {
    const pathname = usePathname();

    const navItems = [
        { name: 'Overview', href: '/dashboard', icon: Home },
        { name: 'Catalog', href: '/catalog', icon: Database },
        { name: 'Task Composer', href: '/tasks/new', icon: Cpu },
        { name: 'Billing', href: '/billing', icon: CreditCard },
        { name: 'Developer API', href: '/api-docs', icon: Code },
    ];

    return (
        <aside className="w-64 border-r border-white/5 hidden md:flex flex-col bg-[#050505] shrink-0">
            {/* Logo Section */}
            <div className="p-6 border-b border-white/5 flex flex-col items-center gap-2">
                <div className="w-10 h-10 flex items-center justify-center bg-[#00f2ff]/10 border border-[#00f2ff]/30">
                    <Layers className="w-5 h-5 text-[#00f2ff]" />
                </div>
                <div className="text-center mt-2">
                    <span className="font-normal text-xl tracking-tighter text-white uppercase leading-none">NODL MESH</span>
                    <p className="text-[10px] text-[#00f2ff] uppercase tracking-widest mt-1 font-normal">Global Storefront</p>
                </div>
            </div>


            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1 mt-4">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 transition-all  text-[11px] uppercase tracking-wider ${isActive
                                    ? 'bg-[#00f2ff]/10 text-[#00f2ff] border border-[#00f2ff]/20'
                                    : 'text-slate-500 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <item.icon className="w-4 h-4" />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            {/* User / Bottom Section */}
            <div className="p-4 border-t border-white/5">
                <div className="flex items-center gap-3 px-4 py-3 mb-4">
                    <div className="w-8 h-8 rounded-[4px] border border-[#00f2ff]/30 bg-[#00f2ff]/5 flex items-center justify-center">
                        <span className="text-[10px] font-normal text-[#00f2ff]">M</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] text-white font-normal leading-none uppercase">MESH_BUYER_01</span>
                        <span className="text-[8px] text-slate-500 uppercase mt-1 font-normal">Standard Tier</span>
                    </div>
                </div>

                <button className="flex items-center gap-3 px-4 py-3 w-full hover:bg-red-500/10 text-slate-500 hover:text-red-500 transition-colors  text-[11px] uppercase tracking-wider">
                    <LogOut className="w-4 h-4" /> Terminate Session
                </button>
            </div>
        </aside>
    );
}
