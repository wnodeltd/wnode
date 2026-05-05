'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
    account: any | null;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [account, setAccount] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        async function fetchAccount() {
            try {
                const res = await fetch('/api/account/me');
                if (res.ok) {
                    const data = await res.json();
                    setAccount(data);
                } else {
                    setAccount(null);
                }
            } catch (error) {
                console.error('[Auth] Failed to fetch account:', error);
                setAccount(null);
            } finally {
                setIsLoading(false);
            }
        }

        fetchAccount();
    }, []);

    useEffect(() => {
        if (!isLoading && !account && !pathname?.startsWith('/login')) {
            router.push('/login');
        }
    }, [isLoading, account, pathname, router]);

    const value = useMemo(() => ({
        account,
        isLoading
    }), [account, isLoading]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="w-12 h-12 border-2 border-[#10b981]/20 border-t-[#10b981] animate-spin rounded-full" />
            </div>
        );
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
