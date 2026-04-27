"use client";

import { useState, useEffect } from "react";

interface HeaderProps {
    onContactClick: () => void;
}

export default function Header({ onContactClick }: HeaderProps) {
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            
            // Show header if scrolling up or at the top
            if (currentScrollY < lastScrollY || currentScrollY < 50) {
                setIsVisible(true);
            } 
            // Hide header if scrolling down and past a threshold
            else if (currentScrollY > 100 && currentScrollY > lastScrollY) {
                setIsVisible(false);
            }
            
            setScrolled(currentScrollY > 50);
            setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Privacy", href: "/privacy" },
        { name: "Terms", href: "/terms" },
        { name: "GitHub", href: "https://github.com/wnodeltd/wnode" },
        { name: "Partners", href: "/partners" },
    ];

    return (
        <>
            <header className={`fixed top-0 left-0 right-0 z-[80] ${
                scrolled ? "py-4 bg-black/80 backdrop-blur-xl border-b border-white/10" : "py-10 bg-transparent"
            } ${
                isVisible ? "block" : "hidden"
            }`}>
                <div className="max-w-7xl mx-auto px-8 flex justify-end items-center">
                    {/* Burger Button - Visible on all screen sizes */}
                    <button 
                        className="text-white z-[90] relative w-8 h-8 flex flex-col justify-center items-center gap-1.5"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        <span className={`w-8 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? "rotate-45 translate-y-2" : ""}`} />
                        <span className={`w-8 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? "opacity-0" : ""}`} />
                        <span className={`w-8 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
                    </button>
                </div>
            </header>

            {/* Mobile Menu Overlay - Used for all screen sizes now */}
            <div className={`fixed inset-0 bg-black z-[70] transition-all duration-500 ${
                mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            }`}>
                <div className="flex flex-col items-center justify-center h-full space-y-12">
                    {navLinks.map((link) => (
                        <a 
                            key={link.name} 
                            href={link.href} 
                            onClick={() => setMobileMenuOpen(false)}
                            className="text-2xl font-bold uppercase tracking-[0.4em] text-slate-400 hover:text-white transition-all"
                        >
                            {link.name}
                        </a>
                    ))}
                    <button 
                        onClick={() => {
                            setMobileMenuOpen(false);
                            onContactClick();
                        }}
                        className="bg-white text-black px-12 py-4 rounded-full font-bold text-lg"
                    >
                        Contact
                    </button>
                </div>
            </div>
        </>
    );
}
