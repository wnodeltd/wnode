"use client";

import { useState } from "react";
import ContactModal from "../landing/ContactModal";

import Header from "../landing/Header";
import Footer from "../landing/Footer";

interface AppLayoutProps {
    children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
    const [isContactOpen, setIsContactOpen] = useState(false);

    return (
        <div className="min-h-screen flex flex-col bg-black">
            <Header onContactClick={() => setIsContactOpen(true)} />
            <main className="flex-grow">
                {children}
            </main>
            
            <Footer onContactClick={() => setIsContactOpen(true)} />

            <ContactModal 
                isOpen={isContactOpen} 
                onClose={() => setIsContactOpen(false)} 
            />
        </div>
    );
}
