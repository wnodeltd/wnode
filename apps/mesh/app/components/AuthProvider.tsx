'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
    user: any | null;
    session: any | null;
    profile: any | null;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any | null>(null);
    const [session, setSession] = useState<any | null>(null);
    const [profile, setProfile] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const checkBypass = () => {
            if (typeof window !== 'undefined' && localStorage.getItem('nodl_auth_bypass') === 'true') {
                const mockEmail = localStorage.getItem('nodl_user_email') || 'stephen@nodl.one';
                const mockUser = {
                    id: 'mock-mesh-buyer-01',
                    email: mockEmail,
                    user_metadata: { full_name: 'Stephen (Buyer)' }
                } as any;

                setUser(mockUser);
                setSession({ user: mockUser } as any);
                setProfile({ id: 'mock-mesh-buyer-01', role: 'buyer', full_name: 'MESH_BUYER_01' });
                setIsLoading(false);
                return true;
            }
            return false;
        };

        const setData = async () => {
            if (checkBypass()) return;
            setIsLoading(false);
        };

        setData();
    }, [pathname]);

    useEffect(() => {
        if (!isLoading && !user && !pathname?.startsWith('/login')) {
            router.push('/login');
        }
    }, [isLoading, user, pathname, router]);

    const value = useMemo(() => ({
        user,
        session,
        profile,
        isLoading
    }), [user, session, profile, isLoading]);

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
