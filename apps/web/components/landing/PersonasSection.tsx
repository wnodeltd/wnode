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
        <section className="py-32 bg-black border-t border-white/5">
            <div className="max-w-7xl mx-auto px-8">
                <h2 className="text-4xl md:text-5xl font-bold text-white uppercase tracking-tighter mb-20 font-space-grotesk text-center">
                    Join Wnode.
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {personas.map((p, i) => (
                        <div key={i} className="fade-in-section p-12 border border-white/5 bg-white/[0.01] flex flex-col justify-between hover:bg-white/[0.02] transition-all">
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
