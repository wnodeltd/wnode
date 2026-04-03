"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    User, Shield, Key, Clock, LogOut, ChevronDown, 
    Settings, ShieldCheck, Activity, UserCircle, Loader2
} from "lucide-react";
import { useRouter } from "next/navigation";

declare global {
    interface Window {
        user_context: any;
    }
}

export default function IdentityHeader() {
    const [user, setUser] = useState<any>(null);
    const [fetchError, setFetchError] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        let cancelled = false;

        const loadUser = async () => {
            // 1. Try fetching from /api/account/me (authoritative source)
            try {
                const jwt = localStorage.getItem("nodl_jwt");
                const res = await fetch("/api/account/me", {
                    headers: jwt ? { Authorization: `Bearer ${jwt}` } : {},
                });

                if (res.ok && !cancelled) {
                    const data = await res.json();
                    const userData = {
                        id: data.id,
                        email: data.email,
                        role: data.role || "admin",
                        avatar: data.avatar || null,
                        displayName: data.displayName || data.email?.split("@")[0],
                    };
                    setUser(userData);
                    // Sync to localStorage for other components
                    localStorage.setItem("nodl_user", JSON.stringify(userData));

                    window.user_context = {
                        email: userData.email,
                        role: userData.role,
                        sovereign_id: `ID_${userData.id?.slice(0, 8) || "4492-X"}`,
                        permissions: userData.role === "owner" ? ["all"] : ["limited"],
                        session_age: "fresh",
                        mfa_enabled: true,
                    };
                    return;
                }
            } catch (e) {
                console.warn("[IdentityHeader] API fetch failed, falling back to localStorage:", e);
            }

            // 2. Fallback: localStorage
            if (!cancelled) {
                const userStr = localStorage.getItem("nodl_user");
                if (userStr) {
                    try {
                        const userData = JSON.parse(userStr);
                        setUser(userData);

                        window.user_context = {
                            email: userData.email,
                            role: userData.role,
                            sovereign_id: `ID_${userData.id?.slice(0, 8) || "4492-X"}`,
                            permissions: userData.role === "owner" ? ["all"] : ["limited"],
                            session_age: "fresh",
                            mfa_enabled: true,
                        };
                    } catch {
                        setFetchError(true);
                    }
                } else {
                    setFetchError(true);
                }
            }
        };

        loadUser();

        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            cancelled = true;
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("nodl_jwt");
        localStorage.removeItem("nodl_user");
        router.push("/login");
    };

    // Show a minimal placeholder while loading — never return null (keeps layout stable)
    if (!user) {
        return (
            <header className="h-14 border-b border-white/10 flex items-center justify-end px-8 bg-black/40 backdrop-blur-md shrink-0 relative z-[100]">
                <div className="flex items-center gap-3">
                    {fetchError ? (
                        <span className="ds-sub text-red-400">
                            Connection Lost
                        </span>
                    ) : (
                        <>
                            <Loader2 className="w-3.5 h-3.5 text-[#22D3EE] animate-spin" />
                            <span className="ds-sub">Authenticating Trace...</span>
                        </>
                    )}
                </div>
            </header>
        );
    }

    const menuItems = [
        { label: "My Account", icon: UserCircle, href: "/settings/profile" },
        { label: "Security Settings", icon: ShieldCheck, href: "/settings/security" },
        { label: "API Keys", icon: Key, href: "/settings/api" },
        { label: "Sessions", icon: Clock, href: "/settings/sessions" },
    ];

    return (
        <header className="h-14 border-b border-white/10 flex items-center justify-end px-8 bg-white/[0.02] backdrop-blur-md shrink-0 relative z-[100] transition-colors hover:bg-white/[0.04]">
            <div className="flex items-center gap-6" ref={dropdownRef}>
                <div 
                    className="flex items-center gap-4 cursor-pointer group select-none"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <div className="text-right hidden md:flex flex-col items-end">
                        <div className="flex items-center gap-2">
                            <span className="text-[13px] text-white font-bold tracking-tight group-hover:text-[#22D3EE] transition-colors">
                                {user.email} • {user.role?.toUpperCase()} • <span className="ds-sub opacity-60">ID_{user.id?.slice(0, 8) || '4492-X'}</span>
                            </span>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="w-9 h-9 rounded-[5px] bg-white/[0.03] border border-white/10 flex items-center justify-center text-[#22D3EE] group-hover:border-[#22D3EE]/50 transition-all shadow-inner overflow-hidden">
                            {user.avatar ? (
                                <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-5 h-5 opacity-70" />
                            )}
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-black shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                    </div>
                    
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </div>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="absolute top-14 right-8 w-56 bg-black border border-white/10 rounded-[5px] shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden z-20 backdrop-blur-xl"
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
        </header>
    );
}
