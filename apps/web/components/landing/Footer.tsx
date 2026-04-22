import Link from "next/link";

export default function Footer() {
    return (
        <footer className="py-20 px-8 border-t border-white/15 bg-black">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12 mb-20">
                <div className="flex items-center gap-4">
                    <span className="text-xl font-bold tracking-tight text-white uppercase">Wnode</span>
                </div>
                
                <div className="flex flex-wrap justify-center gap-10 text-sm font-medium text-[var(--text-secondary)]">
                    <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
                    <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                    <Link href="/cookies" className="hover:text-white transition-colors">Cookies</Link>
                    <a href="mailto:stephen@wnode.one" className="hover:text-white transition-colors">Contact</a>
                </div>
            </div>

            <div className="max-w-6xl mx-auto border-t border-white/15 pt-12 text-center">
                <div className="text-[10px] text-slate-600 font-medium uppercase tracking-[0.3em]">
                    © 2026 Wnode Ltd. Sovereign Infrastructure.
                </div>
            </div>
        </footer>
    );
}
