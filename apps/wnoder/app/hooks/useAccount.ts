import { useState, useEffect } from 'react';

export interface CRMRecord {
    nodlrId: string;
    email: string;
    name?: string;
    stripeAccountId: string;
    status: string;
    nodes: string[];
    affiliates: string[];
    createdAt: string;
}

export function useAccount() {
    const [account, setAccount] = useState<CRMRecord | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAccount = async () => {
            const token = localStorage.getItem('nodl_jwt');
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                // Synchronizing with the active wnoded service on port 8082
                const userId = localStorage.getItem('nodl_user_id') || '';
                const res = await fetch('http://127.0.0.1:8082/api/v1/account/me', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'X-User-ID': userId
                    }
                });

                if (res.ok) {
                    const data = await res.json();
                    setAccount(data);
                } else {
                    setError('Failed to fetch account');
                    // Fallback to local auth data if bypass is active
                    applyBypassFallback();
                }
            } catch (err) {
                setError('Network error');
                // Fallback to local auth data if bypass is active
                applyBypassFallback();
            } finally {
                setLoading(false);
            }
        };

        const applyBypassFallback = () => {
            const bypass = localStorage.getItem('nodl_auth_bypass');
            if (bypass === 'true') {
                const email = localStorage.getItem('nodl_user_email') || 'stephen@wnode.one';
                const userId = localStorage.getItem('nodl_user_id') || '100001-0426-01-AA';
                console.warn('[useAccount] Backend unreachable, using auth bypass fallback');
                setAccount({
                    nodlrId: userId,
                    email: email,
                    stripeAccountId: '',
                    status: 'active',
                    nodes: [],
                    affiliates: [],
                    createdAt: new Date().toISOString(),
                    name: email.split('@')[0],
                });
            }
        };

        fetchAccount();
    }, []);

    return { account, loading, error };
}
