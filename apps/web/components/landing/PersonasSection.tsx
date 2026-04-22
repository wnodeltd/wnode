"use client";

import { ModalMode } from "./CTAModal";

interface PersonasSectionProps {
    onOpenModal: (mode: ModalMode) => void;
}

export default function PersonasSection({ onOpenModal }: PersonasSectionProps) {
    const personas = [
        {
            title: "Creators & Influencers",
            hook: "Turn your audience into a real network—with shared upside.",
            bullets: [
                "Track referrals and influence automatically.",
                "Reward the people who actually move the needle.",
                "Build something that outlives any single platform."
            ],
            ctaLabel: "Join as a creator",
            mode: "persona_creator" as ModalMode
        },
        {
            title: "Entrepreneurs & Founders",
            hook: "Turn customers, partners, and advocates into a living asset.",
            bullets: [
                "Map your ecosystem in real time.",
                "See who drives growth, not just who pays invoices.",
                "Design incentives that compound over time."
            ],
            ctaLabel: "Join as a founder",
            mode: "persona_founder" as ModalMode
        },
        {
            title: "Community Builders",
            hook: "Give your community a structure that respects contribution.",
            bullets: [
                "Recognise connectors, not just loud voices.",
                "Make contribution visible and meaningful.",
                "Build a community that can sustain itself."
            ],
            ctaLabel: "Join as a community builder",
            mode: "persona_community" as ModalMode
        },
        {
            title: "Early Adopters",
            hook: "Be early to a new class of economic infrastructure.",
            bullets: [
                "Experiment with new models of ownership.",
                "Prototype networks that don't fit old categories.",
                "Help shape how the protocol evolves."
            ],
            ctaLabel: "Join as an early adopter",
            mode: "persona_early_adopter" as ModalMode
        }
    ];

    return (
        <section className="section-spacing border-t border-white/15">
            <div className="max-w-4xl mx-auto">
                <div className="fade-in-section text-center border border-blue-500/40 px-10 py-16 md:px-20 md:py-24 rounded-[40px] bg-white/[0.01] backdrop-blur-sm shadow-2xl">
                    <h2 className="text-4xl md:text-6xl font-bold mb-12 text-white uppercase tracking-tight">
                        COMPUTE IS THE EMERGING CURRENCY
                    </h2>
                    
                    <div className="text-left max-w-2xl mx-auto">
                        <p className="text-2xl md:text-3xl text-blue-500 font-medium mb-10">Wnode is :-</p>
                        
                        <div className="space-y-8">
                            {[
                                "Simple to join",
                                "Use any tech, old or new",
                                "Guaranteed daily payouts (Stripe Express account needed)",
                                "A true immutable growing real-world monetised asset",
                                "Cannot be frozen, removed, changed, or stopped"
                            ].map((b, i) => (
                                <div key={i} className="flex items-start gap-6 text-xl md:text-2xl text-slate-300">
                                    <span className="text-blue-500 font-bold text-3xl leading-none mt-1">•</span>
                                    <span>{b}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-10">
                        <div className="flex flex-col items-center gap-4">
                            <button 
                                onClick={() => onOpenModal("beta_tester")}
                                className="button-apple-primary text-xl px-12 py-5"
                            >
                                Become a beta tester
                            </button>
                            <a 
                                href="https://github.com/Nodlshire/wnode" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-orange-500 hover:text-orange-400 font-medium tracking-wide transition-colors flex items-center gap-2"
                            >
                                View the project on GitHub
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </a>
                        </div>
                        <button 
                            onClick={() => onOpenModal("waitlist")}
                            className="button-apple-secondary text-2xl group"
                        >
                            Join the waitlist 
                            <svg className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
