'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../../src/lib/supabase';
import { User, Session } from '@supabase/supabase-js';
import LoadingSkeleton from './LoadingSkeleton';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    profile: any | null;
    isLoading: boolean;
    isGodMode: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [profile, setProfile] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const checkBypass = () => {
            if (typeof window !== 'undefined' && localStorage.getItem('nodl_auth_bypass') === 'true') {
                const mockEmail = localStorage.getItem('nodl_user_email') || 'stephen@nodl.one';
                const mockUser = {
                    id: 'mock-id-123',
                    email: mockEmail,
                    user_metadata: { full_name: 'Stephen' }
                } as any;

                setUser(mockUser);
                setSession({ user: mockUser } as any);
                setProfile({ id: 'mock-id-123', role: 'god', full_name: 'Stephen' });
                setIsLoading(false);
                return true;
            }
            return false;
        };

        const setData = async () => {
            if (checkBypass()) return;

            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                if (session) {
                    setSession(session);
                    setUser(session.user);

                    // Fetch profile
                    const { data: profileData } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', session.user.id)
                        .single();

                    setProfile(profileData);
                }
            } catch (err) {
                console.warn('Auth initialization failed (Supabase offline?):', err);
            } finally {
                setIsLoading(false);
            }
        };

        let subscription: any = null;
        try {
            const { data } = supabase.auth.onAuthStateChange((_event, session) => {
                if (typeof window !== 'undefined' && localStorage.getItem('nodl_auth_bypass') === 'true') return;

                setSession(session);
                setUser(session ? session.user : null);
                if (session) {
                    supabase.from('profiles')
                        .select('*')
                        .eq('id', session.user.id)
                        .single()
                        .then(({ data }) => setProfile(data));
                } else {
                    setProfile(null);
                }
                setIsLoading(false);
            });
            subscription = data.subscription;
        } catch (err) {
            console.warn('Auth state change subscription failed:', err);
        }

        setData();

        return () => {
            if (subscription) subscription.unsubscribe();
        };
    }, [pathname]);

    useEffect(() => {
        if (!isLoading && !user && !pathname?.startsWith('/login')) {
            router.push('/login');
        }
    }, [isLoading, user, pathname, router]);

    // Stable Profile State: prevent re-render loops by memoizing the profile object
    const memoizedProfile = useMemo(() => profile, [JSON.stringify(profile)]);

    const isGodMode = useMemo(() => {
        return memoizedProfile?.role === 'god';
    }, [memoizedProfile]);

    const value = useMemo(() => ({
        user,
        session,
        profile: memoizedProfile,
        isLoading,
        isGodMode
    }), [user, session, memoizedProfile, isLoading, isGodMode]);

    if (isLoading) {
        return <LoadingSkeleton />;
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
