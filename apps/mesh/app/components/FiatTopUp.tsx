'use client';

import React, { useState } from 'react';
import { CreditCard, Loader2 } from 'lucide-react';
import { useAuth } from './AuthProvider';

export default function FiatTopUp() {
    const { profile } = useAuth();
    const [amount, setAmount] = useState('100');
    const [isLoading, setIsLoading] = useState(false);

    const handleTopUp = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('http://127.0.0.1:8080/stripe/payment/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amountCents: parseInt(amount) * 100,
                    jobID: 'top_up_' + Date.now(),
                    currency: 'usd'
                })
            });
            const data = await res.json();
            if (data.clientSecret) {
                alert('Success! Stripe Client Secret Acquired. Proceeding to Stripe Elements...');
                // Integration with @stripe/react-stripe-js goes here
            } else {
                alert('Failed to initialize payment');
            }
        } catch (error) {
            console.error(error);
        }
        setIsLoading(false);
    };

    return (
        <div className="bg-[#080808] border border-white/5 p-6 rounded-2xl relative overflow-hidden">
            <h3 className="text-sm font-bold text-white mb-2">Fiat Wallet Top-Up</h3>
            <p className="text-[10px] text-slate-500 mb-6">Fund your escrow wallet via securely via Stripe</p>
            
            <div className="space-y-4">
                <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                    <input 
                        type="number" 
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full bg-black/40 border border-white/5 focus:border-mesh-emerald/30 p-3 pl-8 text-white text-xs rounded-xl"
                    />
                </div>
                
                <button 
                    onClick={handleTopUp}
                    disabled={isLoading}
                    className="w-full py-3 bg-white text-black rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-white/90"
                >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                    Initiate Deposit
                </button>
            </div>
        </div>
    );
}
