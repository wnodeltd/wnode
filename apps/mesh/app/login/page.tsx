'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, ArrowRight, Layers, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Bypass logic
        if (email === 'stephen@nodl.one' && password === 'command') {
            localStorage.setItem('nodl_auth_bypass', 'true');
            localStorage.setItem('nodl_user_email', email);
            setTimeout(() => {
                router.push('/');
            }, 1000);
            return;
        }

        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#080808] flex flex-col items-center justify-center p-6 text-white overflow-hidden">
             {/* Background Glows */}
             <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-mesh-emerald/5 blur-[120px] -z-10" />
             <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/5 blur-[120px] -z-10" />

             <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-sm z-10 space-y-8"
             >
                 {/* Logo */}
                 <div className="flex flex-col items-center">
                    <img 
                        src="https://nodl.one/wp-content/uploads/2025/05/nodl-medium.webp" 
                        alt="nodl logo" 
                        className="h-12 w-auto mb-4"
                    />
                    <div className="bg-mesh-emerald/10 border border-mesh-emerald/20 px-3 py-1 rounded-[4px] text-[10px] font-bold text-mesh-emerald tracking-[0.3em]">
                        MESH STOREFRONT
                    </div>
                 </div>

                 <div className="surface-card p-8 space-y-6 relative overflow-hidden">
                    {/* Gold accent corner */}
                    <div className="absolute top-0 left-0 w-12 h-12 bg-amber-500/10 -translate-x-6 -translate-y-6 rotate-45 border border-amber-500/20" />
                    
                    <div className="text-center">
                        <h2 className="text-2xl font-bold tracking-tight uppercase">nodl mesh</h2>
                        <p className="text-small font-bold text-slate-500 uppercase tracking-widest mt-1">Global Compute Access</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-small font-bold text-slate-500 tracking-wider block uppercase">Ident Key</label>
                            <input 
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full bg-white/[0.02] border border-white/10 rounded-[4px] p-3.5 text-white text-sm focus:outline-none focus:border-mesh-emerald transition-all"
                                placeholder="operator@nodl.ch"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-small font-bold text-slate-500 tracking-wider block uppercase">Security Phrase</label>
                            <input 
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full bg-white/[0.02] border border-white/10 rounded-[4px] p-3.5 text-white text-sm focus:outline-none focus:border-mesh-emerald transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        <button 
                            disabled={isLoading}
                            className="w-full bg-mesh-emerald hover:bg-white text-black font-bold py-3.5 text-xs rounded-[4px] flex items-center justify-center gap-2 transition-all active:scale-[0.98] group"
                        >
                            {isLoading ? 'INITIATING...' : <>SYNC TO MESH <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>}
                        </button>
                    </form>

                    <div className="pt-6 border-t border-white/5 flex flex-col items-center gap-4">
                        <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Or Connect With</span>
                        <button className="w-full bg-white/[0.01] border border-white/5 py-3 rounded-[4px] text-white text-[10px] font-bold hover:bg-white/5 transition-all">
                             IDENTITY_PROVIDERS (OAUTH)
                        </button>
                    </div>
                 </div>

                 <p className="text-[10px] text-slate-700 tracking-widest font-bold text-center leading-relaxed px-4">
                    SAFE_EXECUTION_POLICY: ALL TASKS ARE SANDBOXED VIA WAZEERO RUNTIME.
                 </p>
             </motion.div>
        </div>
    );
}
