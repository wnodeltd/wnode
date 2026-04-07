"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function LandingPage() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="relative min-h-screen">
            {/* Navbar */}
            <nav className={`fixed top-0 inset-x-0 z-50 px-10 py-6 flex items-center justify-between transition-all duration-500 ${scrolled ? "nav-blur border-b border-white/5" : "bg-transparent"}`}>
                <div className="flex items-center gap-2">
                    <div className="flex flex-col items-center justify-center w-12">
                        <svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto fill-white drop-shadow-sm">
                            <path d="M 22 110 L 22 50 A 28 28 0 0 1 78 50 L 78 110" fill="none" stroke="white" strokeWidth="26" strokeLinecap="butt" />
                            <circle cx="50" cy="72" r="16" />
                        </svg>
                        <span style={{ fontFamily: "'Roboto', sans-serif", fontSize: "14pt", fontWeight: "bold", color: "white", marginTop: "8px", lineHeight: "1", letterSpacing: "0.02em" }}>wnode</span>
                    </div>
                </div>

                <div className="hidden md:flex items-center gap-10 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                    <Link href="#vision" className="hover:text-cyber-cyan transition-colors">Vision</Link>
                    <Link href="#architecture" className="hover:text-cyber-cyan transition-colors">Architecture</Link>
                    <Link href="#economics" className="hover:text-cyber-cyan transition-colors">Economics</Link>
                    <Link href="#" className="hover:text-cyber-cyan transition-colors">Docs</Link>
                </div>

                <div className="flex items-center gap-4">
                    <Link href="http://127.0.0.1:3002" className="px-6 py-2.5 rounded-[5px] border border-white/10 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-obsidian transition-all">Enter Mesh</Link>
                    <Link href="http://127.0.0.1:3001" className="button-primary px-6 py-2.5 rounded-[5px] text-[10px]">Start Harvesting</Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative h-screen flex flex-col items-center justify-center text-center px-10 overflow-hidden">
                <div className="absolute inset-0 hero-gradient -z-10" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyber-cyan/5 rounded-full blur-[120px] -z-20" />

                <h1 className="text-8xl md:text-[12rem] font-black uppercase  tracking-tighter leading-[0.8] mb-8 animate-in fade-in zoom-in duration-1000">
                    Harvest <br />
                    <span className="text-cyber-cyan glow-cyan">the Idle.</span>
                </h1>

                <p className="max-w-2xl text-xl md:text-2xl font-medium text-slate-400 mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
                    The global decentralized resource layer. Turn your CPU/GPU cycles into a liquid commodity.
                </p>

                <div className="flex flex-col md:flex-row gap-6 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-700">
                    <Link href="http://127.0.0.1:3001" className="button-primary px-12 py-5 rounded-[5px] text-sm">Download Harvester</Link>
                    <Link href="http://127.0.0.1:3002" className="px-12 py-5 rounded-[5px] border border-white/10 bg-white/5 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-white/10 transition-all flex items-center justify-center">Deploy Task</Link>
                </div>

                {/* Floating Background Stats */}
                <div className="absolute bottom-20 left-10 text-left ">
                    <span className="text-[10px] text-slate-600 block uppercase mb-1">Total Network Power</span>
                    <span className="text-2xl font-bold text-cyber-cyan">842.1 TH/s</span>
                </div>
                <div className="absolute bottom-20 right-10 text-right ">
                    <span className="text-[10px] text-slate-600 block uppercase mb-1">Active Harvesters</span>
                    <span className="text-2xl font-bold text-white tracking-widest leading-none  uppercase">Global</span>
                </div>
            </section>

            {/* Vision Section */}
            <section id="vision" className="py-40 px-10 max-w-7xl mx-auto">
                <div className="grid md:grid-cols-2 gap-20 items-center">
                    <div className="space-y-8">
                        <h2 className="text-6xl font-black uppercase  tracking-tighter leading-none glow-cyan">Invisible <br /> Compute.</h2>
                        <p className="text-lg text-slate-400 leading-relaxed font-medium">
                            Wnode harvests unused CPU/GPU cycles from consumer devices, turning billions of idle processors into a liquid, global supercompute mesh. No AWS overhead. No centralized lock-in. Just raw throughput.
                        </p>
                        <div className="grid grid-cols-2 gap-8 pt-6">
                            <div>
                                <span className="text-3xl font-black   block mb-1">1/10x</span>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Traditional Cost</span>
                            </div>
                            <div>
                                <span className="text-3xl font-black   block mb-1">SLA 99%</span>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Mesh Reliability</span>
                            </div>
                        </div>
                    </div>
                    <div className="aspect-square bg-white/5 rounded-[60px] border border-white/5 relative overflow-hidden flex items-center justify-center">
                        <div className="w-48 h-48 bg-cyber-cyan/10 rounded-full blur-[60px] animate-pulse" />
                        <div className="text-4xl font-black  uppercase tracking-tighter glow-cyan -rotate-12">Universal <br /> Basic Income</div>
                    </div>
                </div>
            </section>
        </div>
    );
}
