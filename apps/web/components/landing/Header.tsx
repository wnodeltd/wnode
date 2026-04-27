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
    const [governanceOpen, setGovernanceOpen] = useState(false);

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
        { 
            name: "Governance", 
            isDropdown: true,
            subLinks: [
                { name: "Wnode Mesh", href: "/governance/mesh", color: "text-slate-500" },
                { name: "Wnode Management", href: "/governance/management", color: "text-slate-500" }
            ]
        },
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
                <div className="flex flex-col items-center justify-center h-full space-y-8 overflow-y-auto pt-20">
                    {navLinks.map((link) => (
                        link.isDropdown ? (
                            <div key={link.name} className="flex flex-col items-center space-y-6">
                                <button 
                                    onClick={() => setGovernanceOpen(!governanceOpen)}
                                    className="text-2xl font-bold uppercase tracking-[0.4em] text-slate-400 hover:text-white transition-all flex items-center gap-4"
                                >
                                    {link.name}
                                    <span className={`transition-transform duration-300 text-slate-600 ${governanceOpen ? "rotate-180" : ""}`}>↓</span>
                                </button>
                                <div className={`flex flex-col items-center space-y-6 overflow-hidden transition-all duration-500 ${governanceOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"}`}>
                                    {link.subLinks?.map((sub) => (
                                        <a 
                                            key={sub.name}
                                            href={sub.href} 
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="text-2xl font-bold uppercase tracking-[0.4em] text-slate-500 hover:text-white transition-all"
                                        >
                                            {sub.name}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <a 
                                key={link.name} 
                                href={link.href} 
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-2xl font-bold uppercase tracking-[0.4em] text-slate-400 hover:text-white transition-all"
                            >
                                {link.name}
                            </a>
                        )
                    ))}

                    <div className="pt-8 flex flex-col items-center space-y-6">
                        <button 
                            onClick={() => {
                                setMobileMenuOpen(false);
                                onContactClick();
                            }}
                            className="bg-white text-black px-12 py-4 rounded-full font-bold text-lg"
                        >
                            Contact
                        </button>
                        <a 
                            href="https://discord.gg/5BNhsfg5Br"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setMobileMenuOpen(false)}
                            className="bg-[#5865F2] hover:bg-[#4752C4] text-white px-12 py-4 rounded-full font-bold text-lg transition-all"
                        >
                            Discord
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}
