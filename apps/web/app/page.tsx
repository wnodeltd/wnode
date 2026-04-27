"use client";

import { useState, useEffect } from "react";
import AppLayout from "../components/layout/AppLayout";
import HeroSection from "../components/landing/HeroSection";
import WhatIsWnodeSection from "../components/landing/WhatIsWnodeSection";
import WhyItMattersSection from "../components/landing/WhyItMattersSection";
import PersonasSection from "../components/landing/PersonasSection";
import { ComparisonMinimal } from "../components/landing/ComparisonMinimal";
import TrustSection from "../components/landing/TrustSection";
import CTAModal, { ModalMode } from "../components/landing/CTAModal";

export default function LandingPage() {
    const [modalMode, setModalMode] = useState<ModalMode>("beta_tester");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const openModal = (mode: ModalMode) => {
        setModalMode(mode);
        setIsModalOpen(true);
    };

    if (!mounted) return null;
    
    return (
        <AppLayout>
            <div className="bg-black text-white selection:bg-blue-500/30">
                <HeroSection onOpenModal={openModal} />
                <WhatIsWnodeSection />
                <WhyItMattersSection />
                <PersonasSection onOpenModal={openModal} />
                <ComparisonMinimal />
                <div className="max-w-7xl mx-auto px-8 py-20 fade-in-section flex flex-col items-center">
                    <img 
                        src="/model.png" 
                        alt="Wnode Sovereign Compute Model" 
                        className="w-full h-auto rounded-[2rem] border border-white/5 shadow-2xl mb-12" 
                    />
                    <div className="flex flex-col items-center">
                        <span className="text-blue-400 text-[10px] font-bold uppercase tracking-[0.4em] mb-3">Join The Community</span>
                        <a 
                            href="https://discord.gg/5BNhsfg5Br"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[#5865F2] hover:bg-[#4752C4] text-white px-10 py-3 rounded-full font-bold text-base transition-all shadow-2xl"
                        >
                            Discord
                        </a>
                    </div>
                </div>
                <TrustSection onOpenModal={openModal} />
            </div>
            
            <CTAModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                mode={modalMode} 
            />
        </AppLayout>
    );
}
