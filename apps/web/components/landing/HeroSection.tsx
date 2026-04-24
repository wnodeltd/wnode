"use client";

import { ModalMode } from "./CTAModal";

interface HeroSectionProps {
    onOpenModal: (mode: ModalMode) => void;
}

export default function HeroSection({ onOpenModal }: HeroSectionProps) {
    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-8 pt-40 pb-20 overflow-hidden">
            {/* Logo and Brand - Absolute top placement */}
            <div className="absolute top-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-20">
                <img src="/logo.png" alt="wnode logo" className="w-16 h-16" />
                <span className="font-roboto text-xl tracking-[0.3em] uppercase font-light text-slate-500">wnode</span>
            </div>

            <div className="fade-in-section max-w-5xl mx-auto z-10 flex flex-col items-center">
                {/* Integrated Hero Section with Minimalist Border */}
                <div className="border border-blue-500/40 bg-transparent px-6 py-10 md:px-16 md:py-16 rounded-[24px] md:rounded-[40px] mb-16 relative transition-all max-w-5xl flex flex-col items-center w-full">
                    <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight leading-tight text-white mb-10 uppercase">
                        COMPUTE IS THE NEW GOLDRUSH
                    </h1>
                    
                    {/* Tagline with blue background - sharp corners */}
                    <div className="bg-[#3b82f6] text-white px-8 py-2.5 rounded-none font-medium tracking-[0.2em] uppercase text-sm md:text-base shadow-xl shadow-blue-500/20 mb-12">
                        Stake your claim
                    </div>

                    {/* Hardware Illustration */}
                    <div className="mb-12 transform hover:scale-[1.01] transition-transform duration-500 w-full px-4 flex justify-center">
                        <img src="/steps.png" alt="How it works" className="w-full max-w-4xl h-auto rounded-3xl" />
                    </div>



                    {/* Description in a Box - Split over 2 lines */}
                    <div className="max-w-2xl w-full p-6 md:p-8 rounded-[12px] border border-white/15 bg-black/40 backdrop-blur-md transition-all hover:border-white/10 shadow-2xl">
                        <p className="text-lg md:text-xl text-slate-300 font-normal leading-relaxed">
                            Old laptops or modern racks.<br className="hidden md:block" />
                            Any scale. Three clicks to start earning.
                        </p>
                    </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-10 w-full px-4">
                    <div className="flex flex-col items-center gap-4">
                        <button 
                            onClick={() => onOpenModal("beta_tester")}
                            className="button-apple-primary text-xl px-12 py-5"
                        >
                            Become a beta tester
                        </button>
                        <a 
                            href="https://github.com/wnodeltd/wnode" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-orange-500 hover:text-orange-400 font-medium tracking-wide transition-colors flex items-center gap-2"
                        >
                            View the project on GitHub
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </a>
                    </div>
                    <button 
                        onClick={() => onOpenModal("waitlist")}
                        className="button-apple-secondary text-xl group"
                    >
                        Join the waitlist 
                        <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Subtle Abstract Mesh Visual */}
            <div className="absolute inset-0 -z-10 opacity-10 pointer-events-none">
                <svg viewBox="0 0 1000 1000" className="w-full h-full text-blue-500/10">
                    <defs>
                        <radialGradient id="meshGradient" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
                            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                        </radialGradient>
                    </defs>
                    <circle cx="500" cy="500" r="450" fill="url(#meshGradient)" />
                </svg>
            </div>
        </section>
    );
}
