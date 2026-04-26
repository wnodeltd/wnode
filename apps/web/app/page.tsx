"use client";

import { useState, useEffect } from "react";
import AppLayout from "../components/layout/AppLayout";
import HeroSection from "../components/landing/HeroSection";
import WhatIsWnodeSection from "../components/landing/WhatIsWnodeSection";
import WhyItMattersSection from "../components/landing/WhyItMattersSection";
import PersonasSection from "../components/landing/PersonasSection";
import TrustSection from "../components/landing/TrustSection";
import Footer from "../components/landing/Footer";
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
                <TrustSection />
                <Footer />
            </div>
            
            <CTAModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                mode={modalMode} 
            />
        </AppLayout>
    );
}
