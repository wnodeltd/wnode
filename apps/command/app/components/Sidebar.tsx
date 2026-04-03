import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
    LayoutDashboard, Activity, Shield, BarChart3, Sliders, Settings, Zap, LogOut, Users, Share2, DollarSign
} from "lucide-react";

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const userStr = localStorage.getItem("nodl_user");
        if (userStr) {
            setUser(JSON.parse(userStr));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("nodl_jwt");
        localStorage.removeItem("nodl_user");
        router.push("/login");
    };

    const role = user?.role || 'visitor';

    const allItems = [
        { name: 'Dashboard', href: '/', icon: LayoutDashboard, roles: ['owner', 'manager', 'customer_service'] },
        { name: "nodl's", href: '/nodls', icon: Activity, roles: ['owner', 'manager', 'customer_service'] },
        { name: 'Pricing', href: '/pricing', icon: BarChart3, roles: ['owner', 'manager'] },
        { name: "nodl'rs", href: '/providers', icon: Zap, roles: ['owner', 'manager'] },
        { name: 'Mesh Customers', href: '/clients', icon: Users, roles: ['owner', 'manager', 'customer_service'] },
        { name: 'Affiliates', href: '/affiliates', icon: Share2, roles: ['owner', 'manager'] },
        { name: 'Ledger', href: '/ledger', icon: DollarSign, roles: ['owner', 'manager', 'customer_service'] },
        { name: 'Settings', href: '/settings', icon: Settings, roles: ['owner'] },
    ];

    const navItems = allItems.filter(item => item.roles.includes(role));

    return (
        <aside className="fixed inset-y-0 left-0 w-64 bg-black border-r border-white/10 hidden lg:flex flex-col z-50">
            <div className="pt-[24px] pl-8 mb-12 flex flex-col items-start gap-4">
                <Link href="/">
                    <div className="flex flex-col items-start select-none gap-3">
                        <img src="/logo.webp" alt="NODL Logo" className="h-10" />
                        <div className="flex flex-col items-start">
                            <span className="text-[10px] font-normal tracking-[0.4em] text-[#22D3EE]">NODL COMMAND</span>
                            <span className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-normal">Executive Control</span>
                        </div>
                    </div>
                </Link>
            </div>
            
            <nav className="flex-1 px-3 space-y-1">

                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
                    return (
                        <Link 
                            key={item.name}
                            href={item.href}
                            className={`w-full flex items-center gap-3 px-5 py-2.5 text-[14px] font-normal rounded-[5px] transition-all ${
                                isActive 
                                ? 'bg-[#22D3EE]/10 text-[#22D3EE] border border-[#22D3EE]/20 hover:bg-[#22D3EE]/15' 
                                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                            }`}
                        >
                            <item.icon className={`w-4 h-4 ${isActive ? 'text-[#22D3EE]' : 'text-slate-500'}`} />
                            {item.name}
                        </Link>
                    );
                })}
 
 
                <button 
                    onClick={handleLogout}
                    className="mt-6 flex items-center gap-3 px-5 py-2.5 text-[14px] font-normal text-red-400 hover:text-red-300 transition-colors rounded-[5px] hover:bg-red-400/5"
                >
                    <LogOut className="w-4 h-4" />
                    Logout
                </button>
            </nav>

            <div className="p-4 border-t border-white/10">
                <div className="px-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold text-[#22D3EE]">
                            {user?.email?.[0]?.toUpperCase() || 'A'}
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-[12px] font-normal text-white truncate">{user?.email || 'Admin'}</span>
                            <span className="text-[10px] font-normal text-[#22D3EE] uppercase tracking-tighter">{role}</span>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
