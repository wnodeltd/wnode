"use client";

import { ModalMode } from "./CTAModal";

interface HeroSectionProps {
    onOpenModal: (mode: ModalMode) => void;
}

export default function HeroSection({ onOpenModal }: HeroSectionProps) {
    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center px-8 pt-40 pb-20 overflow-hidden bg-black">
            {/* Header / Brand */}
            <div className="absolute top-12 left-12 flex items-center gap-4 z-20">
                {/* KEEP_THIS: /logo.png */}
                <img src="/logo.png" alt="wnode" className="w-10 h-10" />
                <span className="font-space-grotesk text-2xl tracking-tighter font-bold text-white uppercase">wnode</span>
            </div>

            <div className="max-w-6xl w-full mx-auto z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="fade-in-section text-left">
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[0.95] text-white mb-8 uppercase font-space-grotesk">
                        THE MESH <br />
                        <span className="text-blue-500">IS THE NEW</span> <br />
                        COMPUTE.
                    </h1>
                    
                    <p className="text-xl md:text-2xl text-slate-400 mb-12 max-w-xl leading-relaxed">
                        Autonomous compute for developers. <br />
                        Sovereign economics for investors. <br />
                        The decentralized backbone of Web 4.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <button 
                            onClick={() => onOpenModal("developer")}
                            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white text-lg font-bold px-10 py-5 rounded-none transition-all shadow-[0_0_40px_rgba(59,130,246,0.3)] uppercase tracking-widest"
                        >
                            Become a Beta Developer
                        </button>
                        <button 
                            onClick={() => onOpenModal("investor")}
                            className="w-full sm:w-auto bg-transparent border border-white/20 hover:border-white/40 text-white text-lg font-bold px-10 py-5 rounded-none transition-all uppercase tracking-widest"
                        >
                            Join Investor Waitlist
                        </button>
                    </div>
                </div>

                <div className="hidden lg:block relative">
                    {/* REPLACE_THIS: Abstract Mesh Visual */}
                    <div className="relative aspect-square w-full flex items-center justify-center">
                        <div className="absolute inset-0 bg-blue-500/10 blur-[120px] rounded-full animate-pulse" />
                        {/* Placeholder for generated mesh image */}
                        <div className="w-full h-full border border-blue-500/20 rounded-full flex items-center justify-center">
                             <div className="text-blue-500/30 text-xs tracking-widest uppercase">Abstract Mesh Visual</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Subtle Grid Background */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(#3B82F6 1px, transparent 0)', backgroundSize: '40px 40px' }} 
            />
        </section>
    );
}
