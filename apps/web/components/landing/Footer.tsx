export default function Footer() {
    return (
        <footer className="py-20 bg-black border-t border-white/5">
            <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-2">
                    {/* KEEP_THIS: /logo.png */}
                    <img src="/logo.png" alt="wnode" className="w-6 h-6 grayscale opacity-50" />
                    <span className="text-white/30 font-bold uppercase tracking-widest text-xs">wnode © 2026</span>
                </div>
                
                <div className="flex items-center gap-10">
                    <a href="/privacy" className="text-white/40 hover:text-white transition-colors text-xs uppercase tracking-[0.2em]">Privacy</a>
                    <a href="/terms" className="text-white/40 hover:text-white transition-colors text-xs uppercase tracking-[0.2em]">Terms</a>
                    <a href="https://github.com/wnodeltd/wnode" className="text-white/40 hover:text-white transition-colors text-xs uppercase tracking-[0.2em]">GitHub</a>
                    <a href="mailto:hello@wnode.one" className="text-white/40 hover:text-white transition-colors text-xs uppercase tracking-[0.2em]">Contact</a>
                </div>
            </div>
        </footer>
    );
}
