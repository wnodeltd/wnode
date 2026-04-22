import { useState, useEffect } from 'react';

export interface CRMRecord {
    nodlrId: string;
    email: string;
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
                // Using 8081 as the backend port for Wnode/Mesh as seen in .env
                const res = await fetch('http://localhost:8081/api/v1/account/me', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (res.ok) {
                    const data = await res.json();
                    setAccount(data);
                } else {
                    setError('Failed to fetch account');
                }
            } catch (err) {
                setError('Network error');
            } finally {
                setLoading(false);
            }
        };

        fetchAccount();
    }, []);

    return { account, loading, error };
}
