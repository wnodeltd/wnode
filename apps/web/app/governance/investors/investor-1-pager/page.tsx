"use client";

import AppLayout from "../../../../components/layout/AppLayout";
import { useEffect, useState } from "react";

const Section = ({ id, title, children }: { id: string, title: string, children: React.ReactNode }) => (
    <section id={id} className="scroll-mt-32 space-y-6">
        <h2 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-tight font-space-grotesk border-b border-white/10 pb-4">
            {title}
        </h2>
        <div className="text-slate-400 leading-relaxed space-y-4">
            {children}
        </div>
    </section>
);

export default function InvestorOnePagerPage() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <AppLayout>
            <div className="bg-black text-white min-h-screen pt-40 pb-40 px-6 md:px-12">
                <div className="max-w-4xl mx-auto">
                    
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20 border-b border-white/10 pb-12">
                        <div className="space-y-4">
                            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white font-space-grotesk uppercase leading-none">
                                Investor One-Pager
                            </h1>
                            <p className="text-blue-500 font-mono text-sm tracking-[0.3em] uppercase font-bold">
                                WNODE — AI-Powered Planetary Compute Mesh
                            </p>
                        </div>
                        <a 
                            href="/docs/investor_1_pager.pdf" 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white text-black px-8 py-3 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] inline-flex items-center gap-2 w-fit"
                        >
                            <span>Download PDF</span>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4" />
                                <polyline points="7 10 12 15 17 10" />
                                <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                        </a>
                    </div>

                    <div className="space-y-24">
                        
                        {/* The Problem */}
                        <Section id="problem" title="⚡ The Problem">
                            <p className="text-xl text-white/80 font-medium leading-relaxed">
                                AI compute demand is exploding. Centralised cloud providers create:
                            </p>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                                {[
                                    "High and unpredictable pricing",
                                    "Artificial scarcity",
                                    "Vendor lock-in",
                                    "Single points of failure",
                                    "Confusing access for startups and emerging markets"
                                ].map(item => (
                                    <li key={item} className="flex gap-3 items-center bg-white/[0.02] border border-white/5 p-4 rounded-sm">
                                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                                        <span className="text-sm font-bold uppercase tracking-widest">{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <p className="pt-8">
                                Meanwhile, up to <span className="text-white font-bold">75% of global hardware sits idle</span> — a massive untapped economic resource.
                            </p>
                        </Section>

                        {/* The Wnode Solution */}
                        <Section id="solution" title="🚀 The Wnode Solution">
                            <p>
                                Wnode transforms idle global hardware into a planetary compute mesh powered by:
                            </p>
                            <ul className="list-none space-y-4 pl-4 pt-4">
                                {[
                                    "AI-driven routing",
                                    "RAM-only execution (no storage, no leakage)",
                                    "Deterministic, verifiable compute",
                                    "USD pay in/outs + token incentives",
                                    "3-click onboarding (“Granny-Proof”)"
                                ].map(item => (
                                    <li key={item} className="flex gap-4 items-center">
                                        <span className="text-blue-500 font-bold text-xl">•</span>
                                        <span className="text-white font-bold text-sm uppercase tracking-wider">{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <p className="pt-6 italic">
                                Anyone can contribute compute. Anyone can access compute. The network governs itself.
                            </p>
                        </Section>

                        {/* Why Wnode Wins */}
                        <Section id="why-wins" title="🌍 Why Wnode Wins">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {[
                                    { t: "Sovereign Stack", d: "own AI model, own hardware, own tech" },
                                    { t: "Eco-Aligned", d: "no data centres, no cooling, no waste" },
                                    { t: "Ultra-Low Cost", d: "no infrastructure overhead" },
                                    { t: "Global Reach", d: "every laptop, desktop, and server becomes a node" },
                                    { t: "Regulator-Safe", d: "FIAT first, utility token second" },
                                    { t: "Capture-Resistant", d: "1 soul = 1 vote" }
                                ].map(item => (
                                    <div key={item.t} className="p-6 bg-white/[0.02] border border-white/5 rounded-sm space-y-2">
                                        <h3 className="text-white font-bold text-xs uppercase tracking-[0.2em]">{item.t}</h3>
                                        <p className="text-xs text-slate-500 uppercase tracking-widest">{item.d}</p>
                                    </div>
                                ))}
                            </div>
                        </Section>

                        {/* How It Works */}
                        <Section id="how-it-works" title="🧠 How It Works">
                            <div className="space-y-12">
                                <div>
                                    <h3 className="text-blue-500 font-bold text-xs uppercase tracking-widest mb-6">For Node Operators (Nodlrs)</h3>
                                    <ul className="flex flex-wrap gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                                        <li className="px-3 py-1 bg-white/5 rounded-sm">Install the app</li>
                                        <li className="opacity-30">→</li>
                                        <li className="px-3 py-1 bg-white/5 rounded-sm">Contribute compute</li>
                                        <li className="opacity-30">→</li>
                                        <li className="px-3 py-1 bg-white/5 rounded-sm">Get paid in USD</li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="text-blue-500 font-bold text-xs uppercase tracking-widest mb-6">For Customers</h3>
                                    <ul className="flex flex-wrap gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                                        <li className="px-3 py-1 bg-white/5 rounded-sm">Submit tasks</li>
                                        <li className="opacity-30">→</li>
                                        <li className="px-3 py-1 bg-white/5 rounded-sm">Pay in USD</li>
                                        <li className="opacity-30">→</li>
                                        <li className="px-3 py-1 bg-white/5 rounded-sm">Receive compute</li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="text-blue-500 font-bold text-xs uppercase tracking-widest mb-6">For the Network</h3>
                                    <ul className="list-none space-y-2 text-xs">
                                        <li className="flex gap-3 items-center"><span className="w-1 h-1 bg-blue-500 rounded-full" /> AI routes tasks to the best node</li>
                                        <li className="flex gap-3 items-center"><span className="w-1 h-1 bg-blue-500 rounded-full" /> Execution happens in RAM only</li>
                                        <li className="flex gap-3 items-center"><span className="w-1 h-1 bg-blue-500 rounded-full" /> Results are cryptographically verified</li>
                                        <li className="flex gap-3 items-center"><span className="w-1 h-1 bg-blue-500 rounded-full" /> Governance ensures fairness and transparency</li>
                                    </ul>
                                </div>
                            </div>
                        </Section>

                        {/* Governance */}
                        <Section id="governance" title="🏛 Governance">
                            <p>Wnode uses a soul-based governance model:</p>
                            <ul className="list-none space-y-4 pl-4 pt-4">
                                {[
                                    { t: "Governance Board", d: "(oversight)" },
                                    { t: "Stewards", d: "(operations)" },
                                    { t: "Infrastructure Manager", d: "(technical integrity)" },
                                    { t: "Community", d: "(1 soul = 1 vote)" }
                                ].map(item => (
                                    <li key={item.t} className="flex gap-4 items-baseline">
                                        <span className="text-white font-black text-sm uppercase tracking-[0.2em]">{item.t}</span>
                                        <span className="text-xs text-slate-600 uppercase tracking-widest">{item.d}</span>
                                    </li>
                                ))}
                            </ul>
                            <p className="pt-8 font-bold text-white uppercase tracking-widest text-xs">
                                No whales. No privileged nodes. No centralised control.
                            </p>
                        </Section>

                        {/* Token Utility */}
                        <Section id="token-utility" title="💠 Token Utility (WNODE)">
                            <p>WNODE is a utility token, used for:</p>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4">
                                {["Node rewards", "Partner payments", "Staking", "Incentives", "Future compute payments"].map(item => (
                                    <div key={item} className="p-4 bg-white/[0.02] border border-white/5 text-center text-[10px] font-bold uppercase tracking-widest text-blue-400">
                                        {item}
                                    </div>
                                ))}
                            </div>
                            <p className="pt-8">
                                <span className="text-white font-bold">FIAT comes first</span> for both customers and node operators — ensuring regulatory clarity and real-world adoption.
                            </p>
                        </Section>

                        {/* Market Opportunity */}
                        <Section id="market-opportunity" title="📈 Market Opportunity">
                            <p>
                                AI compute is projected to exceed <span className="text-white font-bold">$1 trillion in demand this decade</span>. Decentralised compute is the fastest-growing segment of Web3. Wnode sits at the intersection of:
                            </p>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                                {["AI", "DePIN", "Distributed compute", "Tokenised incentives", "Sovereign AI infrastructure"].map(item => (
                                    <li key={item} className="flex gap-3 items-center bg-white/[0.02] border border-white/5 p-4 rounded-sm">
                                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                                        <span className="text-xs font-bold uppercase tracking-widest">{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <p className="pt-8 text-white font-bold text-2xl tracking-tighter">
                                This is a once-per-generation convergence.
                            </p>
                        </Section>

                        {/* Roadmap */}
                        <Section id="roadmap" title="🛣 Roadmap">
                            <div className="space-y-12">
                                {[
                                    { p: "Phase 1 — MVP", d: "Node onboarding, RAM-only compute" },
                                    { p: "Phase 2 — Private Sale", d: "Token generation, governance bootstrapping" },
                                    { p: "Phase 3 — Mesh Activation", d: "Routing engine, verification layer" },
                                    { p: "Phase 4 — Governance Activation", d: "Board formation, constitution ratification" },
                                    { p: "Phase 5 — Scaling", d: "Enterprise integrations, global expansion" }
                                ].map((phase, idx) => (
                                    <div key={idx} className="relative pl-8 border-l border-white/10">
                                        <div className="absolute left-[-5px] top-0 w-[9px] h-[9px] bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                                        <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-2">{phase.p}</h4>
                                        <p className="text-xs text-slate-500 uppercase tracking-widest">{phase.d}</p>
                                    </div>
                                ))}
                            </div>
                        </Section>

                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
