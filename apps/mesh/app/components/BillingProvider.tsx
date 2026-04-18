import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface BillingContextType {
    balance: number;
    loading: boolean;
    isTopUpOpen: boolean;
    setIsTopUpOpen: (open: boolean) => void;
    addCredits: (amount: number) => void;
    refresh: () => Promise<void>;
}

const BillingContext = createContext<BillingContextType | undefined>(undefined);

export function BillingProvider({ children }: { children: ReactNode }) {
    const [balance, setBalance] = useState(0.00);
    const [loading, setLoading] = useState(true);
    const [isTopUpOpen, setIsTopUpOpen] = useState(false);

    const fetchBalance = async () => {
        try {
            const email = localStorage.getItem('nodl_user_email') || 'stephen@nodl.one';
            const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';
            const res = await fetch(`${apiBase}/api/v1/money/balance?email=${encodeURIComponent(email)}`);
            if (res.ok) {
                const data = await res.json();
                setBalance(data.balance / 100); // Assume cents from backend
            }
        } catch (err) {
            console.error("Failed to fetch balance:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBalance();
        const interval = setInterval(fetchBalance, 30000);
        return () => clearInterval(interval);
    }, []);

    const addCredits = (amount: number) => {
        setBalance(prev => prev + amount);
    };

    return (
        <BillingContext.Provider value={{ 
            balance, 
            loading,
            isTopUpOpen, 
            setIsTopUpOpen,
            addCredits,
            refresh: fetchBalance
        }}>
            {children}
        </BillingContext.Provider>
    );
}

export function useBilling() {
    const context = useContext(BillingContext);
    if (context === undefined) {
        throw new Error('useBilling must be used within a BillingProvider');
    }
    return context;
}
