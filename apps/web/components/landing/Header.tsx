"use client";

import { useState, useEffect } from "react";

interface HeaderProps {
    onContactClick: () => void;
}

export default function Header({ onContactClick }: HeaderProps) {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header className={`fixed top-0 left-0 right-0 z-[80] transition-all duration-500 ${
            scrolled ? "py-4 bg-black/80 backdrop-blur-xl border-b border-white/10" : "py-10 bg-transparent"
        }`}>
            <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <img src="/logo.png" alt="wnode" className="w-10 h-10" />
                    <span className="text-xl font-bold tracking-tight text-white uppercase font-roboto">Wnode</span>
                </div>

                <nav className="hidden md:flex items-center gap-12 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
                    <a href="#why" className="hover:text-white transition-colors">Vision</a>
                    <a href="#mesh" className="hover:text-white transition-colors">Mesh</a>
                    <button 
                        onClick={onContactClick}
                        className="bg-white text-black px-6 py-2 rounded-full hover:bg-slate-200 transition-all font-bold tracking-normal text-xs"
                    >
                        Contact
                    </button>
                </nav>

                <button className="md:hidden text-white" onClick={onContactClick}>
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8h18M3 16h18" />
                    </svg>
                </button>
            </div>
        </header>
    );
}
