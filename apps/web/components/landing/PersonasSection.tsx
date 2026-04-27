"use client";

import { ModalMode } from "./CTAModal";

interface PersonasSectionProps {
    onOpenModal: (mode: ModalMode) => void;
}

export default function PersonasSection({ onOpenModal }: PersonasSectionProps) {
    const personas = [
        {
            title: "Developers",
            description: "Deploy to a mesh that respects your autonomy. Low latency, high uptime, zero storage.",
            cta: "Become a Beta Developer",
            mode: "developer" as ModalMode
        },
        {
            title: "Beta Testers",
            description: "Join the Sovereign Beta. Be the first to operate nodes and shape the protocol's future.",
            cta: "Join the Beta",
            mode: "beta_tester" as ModalMode
        },
        {
            title: "Evangelists",
            description: "Help build the wnode movement. Spread the vision of decentralized compute sovereignty.",
            cta: "Join as Evangelist",
            mode: "waitlist" as ModalMode
        },
        {
            title: "Node Owners",
            description: "Secure your place in the future of the compute economy. Institutional-grade vision.",
            cta: "Join Node Waitlist",
            mode: "investor" as ModalMode
        }
    ];

    return (
        <section className="py-32 bg-black border-t border-white/15">
            <div className="max-w-7xl mx-auto px-8">
                {/* Wnode Economic Constitution Section */}
                <div className="mb-40 p-12 border border-white/25 bg-white/[0.02] rounded-[2.5rem] space-y-10 max-w-5xl mx-auto backdrop-blur-3xl shadow-2xl">
                    <h3 className="text-2xl font-bold uppercase tracking-[0.3em] text-blue-500 border-b border-white/25 pb-8 text-center">Wnode Economic Constitution</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-10">
                        {/* Column 1 */}
                        <div className="space-y-10">
                            <div className="flex justify-between items-center border-b border-white/15 pb-4">
                                <span className="text-white/60 uppercase tracking-[0.2em] text-xs font-bold">Compute Node</span>
                                <span className="text-3xl font-bold text-white font-space-grotesk">70%</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-white/15 pb-4">
                                <span className="text-white/60 uppercase tracking-[0.2em] text-xs font-bold">Level 1 Affiliate</span>
                                <span className="text-3xl font-bold text-white font-space-grotesk">3%</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-white/15 pb-4">
                                <span className="text-white/60 uppercase tracking-[0.2em] text-xs font-bold">Level 2 Affiliate</span>
                                <span className="text-3xl font-bold text-white font-space-grotesk">7%</span>
                            </div>
                        </div>

                        {/* Column 2 */}
                        <div className="space-y-10">
                            <div className="flex justify-between items-center border-b border-white/15 pb-4">
                                <span className="text-white/60 uppercase tracking-[0.2em] text-xs font-bold">Sales Source</span>
                                <span className="text-3xl font-bold text-white font-space-grotesk">10%</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-white/15 pb-4">
                                <span className="text-white/60 uppercase tracking-[0.2em] text-xs font-bold">Management Licensee</span>
                                <span className="text-3xl font-bold text-white font-space-grotesk">7%</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-white/15 pb-4">
                                <span className="text-white/60 uppercase tracking-[0.2em] text-xs font-bold">Founder Affiliate Bonus</span>
                                <span className="text-3xl font-bold text-white font-space-grotesk">3%</span>
                            </div>
                        </div>
                    </div>

                    <p className="text-white/30 text-[10px] uppercase tracking-[0.2em] pt-6 text-center leading-relaxed max-w-2xl mx-auto">
                        Note: All allocations are hard-coded into the protocol's deterministic ledger engine to ensure zero leakage and constitutional integrity.
                    </p>
                </div>

                <h2 className="text-4xl md:text-5xl font-bold text-white uppercase tracking-tighter mb-20 font-space-grotesk text-center">
                    Join Wnode.
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {personas.map((p, i) => (
                        <div key={i} className="fade-in-section p-12 border border-white/15 bg-white/[0.01] flex flex-col justify-between hover:bg-white/[0.02] transition-all">
                            <div>
                                <h3 className="text-3xl font-bold mb-6 text-white uppercase tracking-tight font-space-grotesk">{p.title}</h3>
                                <p className="text-xl text-slate-400 mb-10 leading-relaxed">{p.description}</p>
                            </div>
                            <button 
                                onClick={() => onOpenModal(p.mode)}
                                className={`w-full font-bold py-5 uppercase tracking-widest transition-all ${
                                    p.mode === "investor" 
                                    ? "bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_40px_rgba(168,85,247,0.4)]" 
                                    : "bg-transparent border border-blue-500/50 hover:bg-blue-500/10 text-blue-400"
                                }`}
                            >
                                {p.cta}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
