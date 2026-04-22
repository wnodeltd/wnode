"use client";

import { useState, useEffect } from "react";
import AppLayout from "../components/layout/AppLayout";
import HeroSection from "../components/landing/HeroSection";
import WhatIsWnodeSection from "../components/landing/WhatIsWnodeSection";
import WhyItMattersSection from "../components/landing/WhyItMattersSection";
import PersonasSection from "../components/landing/PersonasSection";
import TrustSection from "../components/landing/TrustSection";
import BetaSection from "../components/landing/BetaSection";
import CTAModal, { ModalMode } from "../components/landing/CTAModal";

export default function LandingPage() {
    const [modalMode, setModalMode] = useState<ModalMode>("beta_tester");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const openModal = (mode: ModalMode) => {
        console.log("Opening modal:", mode);
        setModalMode(mode);
        setIsModalOpen(true);
    };

    if (!mounted) return null;

    return (
        <AppLayout>
            <div className="bg-black text-white">
                <HeroSection onOpenModal={openModal} />
                <WhatIsWnodeSection />
                <WhyItMattersSection />
                <PersonasSection onOpenModal={openModal} />
                <TrustSection />
                <BetaSection onOpenModal={openModal} />
            </div>
            
            <CTAModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                mode={modalMode} 
            />
        </AppLayout>
    );
}
