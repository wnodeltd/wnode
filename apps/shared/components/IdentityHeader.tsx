"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    User, Shield, Key, Clock, LogOut, ChevronDown, 
    Settings, ShieldCheck, Activity, UserCircle, Loader2
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function IdentityHeader() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const displayUserId = user?.protocolId || user?.protocol_id || user?.protocolID || user?.protocol || user?.id || 'unknown-id';
    const [error, setError] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        // Immediately hydrate from localStorage (set during login)
        if (typeof window !== 'undefined') {
            const cached = localStorage.getItem("nodl_user");
            if (cached) {
                try {
                    setUser(JSON.parse(cached));
                    setLoading(false);
                } catch {}
            }
        }

        // Then try to enhance with fresh API data (non-blocking)
        const fetchUser = async () => {
            try {
                const jwt = typeof window !== 'undefined' ? localStorage.getItem("nodl_jwt") : null;
                if (!jwt) {
                    if (!user) setError(true);
                    setLoading(false);
                    return;
                }
                const controller = new AbortController();
                const timeout = setTimeout(() => controller.abort(), 5000);
                const res = await fetch("/api/account/me", {
                    headers: { "Authorization": `Bearer ${jwt}` },
                    signal: controller.signal,
                });
                clearTimeout(timeout);
                
                if (res.ok) {
                    const data = await res.json();
                    setUser(data);
                    localStorage.setItem("nodl_user", JSON.stringify(data));
                }
            } catch {
                // Silently fail — localStorage data is already loaded
            } finally {
                setLoading(false);
            }
        };

        fetchUser();

        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("nodl_jwt");
        localStorage.removeItem("nodl_user");
        router.push("/auth/login");
    };

    if (loading) {
        return (
            <div className="flex items-center gap-3 px-4 py-2 bg-white/[0.02] border border-white/10 rounded-[5px]">
                <Loader2 className="w-3.5 h-3.5 text-slate-500 animate-spin" />
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Authenticating...</span>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="flex items-center gap-2 px-4 py-2 bg-red-400/5 border border-red-400/20 rounded-[5px]">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                <span className="text-[10px] text-red-500 uppercase tracking-widest font-bold">Not signed in</span>
            </div>
        );
    }

    const menuItems = [
        { label: "My Account", icon: UserCircle, href: "/settings/profile" },
        { label: "Security Settings", icon: ShieldCheck, href: "/settings/security" },
        { label: "API Keys", icon: Key, href: "/settings/api" },
        { label: "Sessions", icon: Clock, href: "/settings/sessions" },
    ];

    return (
        <div className="relative" ref={dropdownRef}>
            <div 
                className="ds-card flex items-center gap-4 px-4 py-2 cursor-pointer group select-none hover:bg-white/[0.05] transition-all"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="text-right hidden md:flex flex-col items-end">
                    <div className="flex items-center gap-2">
                        <span className="text-[13px] font-bold text-white group-hover:text-[#22D3EE] transition-colors">
                            {user.email || 'No Email'} • <span className="uppercase">{user.role || 'USER'}</span>
                        </span>
                    </div>
                    <div className="text-[9px] font-mono opacity-40 uppercase tracking-tighter">{displayUserId}</div>
                </div>

                <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-white/[0.1] border border-white/20 flex items-center justify-center text-[#22D3EE] group-hover:bg-[#22D3EE] group-hover:text-black transition-all duration-300 shadow-inner overflow-hidden">
                        {user.avatar ? (
                            <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            <UserCircle className="w-5 h-5" />
                        )}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-green-500 border border-black shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                </div>
                
                <ChevronDown className={`w-3 h-3 text-slate-600 group-hover:text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute top-12 right-0 w-56 bg-black border border-white/10 rounded-[5px] shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden z-50 backdrop-blur-xl"
                    >
                        <div className="p-2 space-y-0.5">
                            {menuItems.map((item) => (
                                <button
                                    key={item.label}
                                    onClick={() => { router.push(item.href); setIsOpen(false); }}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 text-[12px] text-slate-400 hover:text-white hover:bg-white/[0.04] rounded-[3px] transition-all group"
                                >
                                    <item.icon className="w-4 h-4 text-slate-600 group-hover:text-[#22D3EE] transition-colors" />
                                    {item.label}
                                </button>
                            ))}
                            <div className="h-px bg-white/5 my-1 mx-2" />
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-3 py-2.5 text-[12px] text-slate-500 hover:text-red-400 hover:bg-red-400/5 rounded-[3px] transition-all group"
                            >
                                <LogOut className="w-4 h-4 text-slate-700 group-hover:text-red-400 transition-colors" />
                                Logout
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
