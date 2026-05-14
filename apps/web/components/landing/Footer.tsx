interface FooterProps {
    onContactClick?: () => void;
}

export default function Footer({ onContactClick }: FooterProps) {
    return (
        <footer className="py-20 bg-black border-t border-white/15">
            <div className="max-w-7xl mx-auto px-8 flex flex-col items-center gap-16">
                <div className="w-full flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-4">
                        {/* KEEP_THIS: /logo.png */}
                        <img src="/logo.png" alt="wnode" className="w-10 h-10" />
                        <div className="flex flex-col text-left">
                            <span className="font-space-grotesk text-2xl tracking-tighter font-bold text-white uppercase leading-none">wnode</span>
                            <span className="text-[10px] uppercase tracking-widest text-blue-500 font-bold mt-1">Planetary Compute Mesh</span>
                        </div>
                    </div>
                    
                    <div className="flex flex-wrap justify-center items-center gap-10">
                        <a href="/" className="text-white/40 hover:text-white transition-colors text-xs uppercase tracking-[0.2em]">Home</a>
                        
                        {/* About Drop-up with Gap Protection */}
                        <div className="relative group py-2 -my-2">
                            <button className="text-white/40 group-hover:text-white transition-colors text-xs uppercase tracking-[0.2em] cursor-default flex items-center gap-2">
                                About
                                <span className="text-[10px] opacity-30 group-hover:opacity-100 transition-opacity">↑</span>
                            </button>
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-full h-8 pointer-events-none group-hover:pointer-events-auto" />
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 bg-black border border-white/25 p-6 rounded-2xl opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all flex flex-col gap-4 min-w-[200px] shadow-[0_-20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl">
                                <a href="/about/founders-note" className="text-white/40 hover:text-white text-[10px] uppercase tracking-widest transition-colors">Founder's Note</a>
                            </div>
                        </div>

                        {/* Governance Drop-up */}
                        <div className="relative group py-2 -my-2">
                            <button className="text-white/40 group-hover:text-white transition-colors text-xs uppercase tracking-[0.2em] cursor-default flex items-center gap-2">
                                Governance
                                <span className="text-[10px] opacity-30 group-hover:opacity-100 transition-opacity">↑</span>
                            </button>
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-full h-8 pointer-events-none group-hover:pointer-events-auto" />
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 bg-black border border-white/25 p-6 rounded-2xl opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all flex flex-col gap-4 min-w-[280px] shadow-[0_-20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl">
                                <a href="/governance/overview" className="text-white/40 hover:text-white text-[10px] uppercase tracking-widest transition-colors">Governance Overview</a>
                                <a href="/governance/constitution" className="text-white/40 hover:text-white text-[10px] uppercase tracking-widest transition-colors">Constitution</a>
                                <a href="/governance/roles" className="text-white/40 hover:text-white text-[10px] uppercase tracking-widest transition-colors">Roles & Responsibilities</a>
                                <a href="/governance/treasury" className="text-white/40 hover:text-white text-[10px] uppercase tracking-widest transition-colors">Treasury Transparency</a>
                                <a href="/governance/whitepaper" className="text-white/40 hover:text-white text-[10px] uppercase tracking-widest transition-colors">Whitepaper</a>
                                <a href="/governance/dao" className="text-white/40 hover:text-white text-[10px] uppercase tracking-widest transition-colors">DAO Mechanics</a>
                                <a href="/governance/tokens" className="text-white/40 hover:text-white text-[10px] uppercase tracking-widest transition-colors">Token Model & Economics</a>
                            </div>
                        </div>

                        {/* Legal Drop-up with Gap Protection */}
                        <div className="relative group py-2 -my-2">
                            <button className="text-white/40 group-hover:text-white transition-colors text-xs uppercase tracking-[0.2em] cursor-default flex items-center gap-2">
                                Legal
                                <span className="text-[10px] opacity-30 group-hover:opacity-100 transition-opacity">↑</span>
                            </button>
                            
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-full h-8 pointer-events-none group-hover:pointer-events-auto" />

                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 bg-black border border-white/25 p-6 rounded-2xl opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all flex flex-col gap-4 min-w-[220px] shadow-[0_-20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl">
                                <a href="/terms" className="text-white/40 hover:text-white text-[10px] uppercase tracking-widest transition-colors">Terms</a>
                                <a href="/privacy" className="text-white/40 hover:text-white text-[10px] uppercase tracking-widest transition-colors">Privacy</a>
                                <a href="/cookies" className="text-white/40 hover:text-white text-[10px] uppercase tracking-widest transition-colors">Cookies</a>
                            </div>
                        </div>

                        <a href="https://github.com/wnodeltd/wnode" className="text-white/40 hover:text-white transition-colors text-xs uppercase tracking-[0.2em]">GitHub</a>
                        <a href="/partners" className="text-white/40 hover:text-white transition-colors text-xs uppercase tracking-[0.2em]">Partners</a>
                        <button 
                            onClick={(e) => {
                                if (onContactClick) {
                                    e.preventDefault();
                                    onContactClick();
                                }
                            }}
                            className="text-white/40 hover:text-white transition-colors text-xs uppercase tracking-[0.2em]"
                        >
                            Contact
                        </button>
                    </div>
                </div>

                <div className="text-white/20 font-bold uppercase tracking-widest text-[10px]">
                    wnode © 2026
                </div>
            </div>
        </footer>
    );
}
