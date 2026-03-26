"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
    LayoutDashboard, Activity, Shield, BarChart3, Sliders, Settings, Zap 
} from "lucide-react";

export default function Sidebar() {
    const pathname = usePathname();

    const navItems = [
        { name: 'Overview', href: '/', icon: LayoutDashboard },
        { name: 'Finances', href: '/finances', icon: Activity },
        { name: 'Nodl\'rs', href: '/nodlrs', icon: Shield },
        { name: 'Clients', href: '/clients', icon: BarChart3 },
        { name: 'Pricing', href: '/pricing', icon: Sliders },
        { name: 'Settings', href: '/settings', icon: Settings },
    ];

    const adminItems = [
        { name: 'Integrity', href: '/admin/integrity', icon: Shield },
        { name: 'Genesis', href: '/admin/genesis', icon: Zap },
    ];

    return (
        <aside className="fixed inset-y-0 left-0 w-64 bg-black border-r border-white/30 hidden lg:flex flex-col z-50">
            <div className="pt-[24px] pl-8 mb-12 flex flex-col items-start gap-4">
                <Link href="/">
                    <div className="flex flex-col items-start select-none">
                        <img src="/logo.svg" alt="NODL Logo" className="h-10 mb-2" />
                        <span className="text-[10px] font-normal tracking-[0.4em] text-[#22D3EE] uppercase-none">Command Centre</span>
                    </div>
                </Link>
            </div>
            
            <nav className="flex-1 px-3 space-y-1">
                {navItems.map((item) => {
                    const itemName = item.name === 'Nodl\'rs' ? 'Nodl\'rs' : item.name;
                    const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
                    return (
                        <Link 
                            key={item.name}
                            href={item.href}
                            className={`w-full flex items-center gap-3 px-5 py-2.5 text-[14px] font-normal rounded-[5px] transition-all ${
                                isActive 
                                ? 'bg-white/[0.12] text-white border border-white/30' 
                                : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
                            }`}
                        >
                            <item.icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                            {itemName}
                        </Link>
                    );
                })}

                <div className="pt-8 pb-4 px-8 underline-none select-none">
                    <span className="text-[10px] font-normal tracking-[0.2em] text-slate-600 uppercase">System Admin</span>
                </div>

                {adminItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
                    return (
                        <Link 
                            key={item.name}
                            href={item.href}
                            className={`w-full flex items-center gap-3 px-5 py-2.5 text-[14px] font-normal rounded-[5px] transition-all ${
                                isActive 
                                ? 'bg-white/[0.12] text-white border border-white/30 shadow-[0_0_15px_rgba(34,211,238,0.1)]' 
                                : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
                            }`}
                        >
                            <item.icon className={`w-4 h-4 ${isActive ? 'text-[#22D3EE]' : 'text-slate-500'}`} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
