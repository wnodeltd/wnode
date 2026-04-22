import useSWR from 'swr';
import { useAuth } from '../components/AuthProvider';
import { featureFlags } from '@/lib/featureFlags';

export function useProviderNodes() {
    const { user } = useAuth();
    
    const fetcher = async (url: string) => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('nodl_jwt') : null;
        const userId = user?.id || 'mock-id-123';

        const res = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'x-user-id': userId
            }
        });

        if (!res.ok) {
            const error = new Error('An error occurred while fetching nodes.');
            // @ts-ignore
            error.info = await res.json();
            // @ts-ignore
            error.status = res.status;
            throw error;
        }

        return res.json();
    };

    // If simulations are enabled, we optionally mix in or prefer mocked data.
    // However, Phase 1 objective is to drive everything from /api/nodes.
    const { data, error, isLoading, mutate } = useSWR(
        user ? '/api/nodes' : null,
        fetcher,
        {
            refreshInterval: 10000, // Refresh every 10s
        }
    );

    return {
        nodes: Array.isArray(data) ? data : [],
        loading: isLoading,
        error,
        refresh: mutate
    };
}
