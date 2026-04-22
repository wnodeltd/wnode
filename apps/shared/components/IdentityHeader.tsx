"use client";

import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

declare global {
    interface Window {
        user_context: any;
    }
}

export default function IdentityHeader() {
    const [user, setUser] = useState<any>(null);
    const [fetchError, setFetchError] = useState(false);

    useEffect(() => {
        let cancelled = false;

        const loadUser = async () => {
            try {
                const jwt = localStorage.getItem("nodl_jwt");
                const res = await fetch("/api/account/me", {
                    headers: jwt ? { Authorization: `Bearer ${jwt}` } : {},
                });

                if (res.ok && !cancelled) {
                    const data = await res.json();
                    setUser(data);
                    
                    if (typeof window !== "undefined") {
                        window.user_context = {
                            email: data.email,
                            role: data.role,
                            sovereign_id: `ID_${data.id?.slice(0, 8) || "4492-X"}`,
                            permissions: data.role === "owner" ? ["all"] : ["limited"],
                            session_age: "fresh",
                            mfa_enabled: true,
                        };
                    }
                    return;
                }
            } catch (e) {
                console.warn("[IdentityHeader] API fetch failed:", e);
            }

            if (!cancelled) {
                const userStr = localStorage.getItem("nodl_user");
                if (userStr) {
                    try {
                        const data = JSON.parse(userStr);
                        setUser(data);
                    } catch {
                        setFetchError(true);
                    }
                } else {
                    setFetchError(true);
                }
            }
        };

        loadUser();

        return () => {
            cancelled = true;
        };
    }, []);

    // Show a minimal placeholder while loading
    if (!user) {
        return (
            <div className="flex items-center gap-3 h-11">
                {fetchError ? (
                    <span className="text-[11px] text-neutral-400 font-sans uppercase tracking-wider">
                        Not signed in
                    </span>
                ) : (
                    <>
                        <Loader2 className="w-3.5 h-3.5 text-neutral-500 animate-spin" />
                        <span className="text-[11px] text-neutral-400 font-sans uppercase tracking-wider">
                            Syncing...
                        </span>
                    </>
                )}
            </div>
        );
    }

    return (
        <div className="flex items-center gap-4 select-none">
            <div className="text-right flex flex-col items-end min-w-0">
                <span className="text-[17px] text-white font-normal tracking-tight truncate max-w-[200px] font-sans">
                    {user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : (user.name || user.displayName || "Unknown Operator")}
                </span>
                <span className="text-[14px] text-[#3B82F6] font-normal tracking-widest uppercase mt-0.5 font-sans">
                    {user.account_id || user.id || user.protocolId || "0000-0000"}
                </span>
            </div>

            {/* User Avatar */}
            <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full opacity-20 group-hover:opacity-40 transition duration-300 blur-sm"></div>
                <div className="relative w-10 h-10 rounded-full border-2 border-neutral-800/50 bg-neutral-900 overflow-hidden flex items-center justify-center">
                    {user.avatar_url ? (
                        <img 
                            src={user.avatar_url} 
                            alt={user.name || "User"} 
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <span className="text-white font-medium text-sm">
                            {(user.name || user.firstName || "?").charAt(0).toUpperCase()}
                        </span>
                    )}
                </div>
                {/* Online Indicator */}
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#0A0A0A] rounded-full shadow-lg"></div>
            </div>
        </div>
    );
}
