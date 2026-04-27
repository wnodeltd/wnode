interface FooterProps {
    onContactClick?: () => void;
}

export default function Footer({ onContactClick }: FooterProps) {
    return (
        <footer className="py-20 bg-black border-t border-white/5">
            <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-2">
                    {/* KEEP_THIS: /logo.png */}
                    <img src="/logo.png" alt="wnode" className="w-6 h-6 grayscale opacity-50" />
                    <span className="text-white/30 font-bold uppercase tracking-widest text-xs">wnode © 2026</span>
                </div>
                
                <div className="flex items-center gap-10">
                    <a href="/" className="text-white/40 hover:text-white transition-colors text-xs uppercase tracking-[0.2em]">Home</a>
                    
                    {/* Governance Drop-up with Gap Protection */}
                    <div className="relative group py-2 -my-2">
                        <button className="text-white/40 group-hover:text-white transition-colors text-xs uppercase tracking-[0.2em] cursor-default flex items-center gap-2">
                            Governance
                            <span className="text-[10px] opacity-30 group-hover:opacity-100 transition-opacity">↑</span>
                        </button>
                        
                        {/* Invisible bridge to prevent menu from closing when moving mouse */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-full h-8 pointer-events-none group-hover:pointer-events-auto" />

                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 bg-black border border-white/10 p-6 rounded-2xl opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all flex flex-col gap-4 min-w-[220px] shadow-[0_-20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl">
                            <a href="/governance/mesh" className="text-white/40 hover:text-white text-[10px] uppercase tracking-widest transition-colors">Wnode Mesh</a>
                            <a href="/governance/management" className="text-white/40 hover:text-white text-[10px] uppercase tracking-widest transition-colors">Wnode Management</a>
                        </div>
                    </div>

                    <a href="/privacy" className="text-white/40 hover:text-white transition-colors text-xs uppercase tracking-[0.2em]">Privacy</a>
                    <a href="/terms" className="text-white/40 hover:text-white transition-colors text-xs uppercase tracking-[0.2em]">Terms</a>
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
        </footer>
    );
}
