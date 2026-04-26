export default function TrustSection() {
    return (
        <section className="py-40 bg-black border-t border-white/5 relative overflow-hidden">
            {/* Subtle Glow Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-4xl mx-auto text-center px-8 fade-in-section relative z-10">
                <h2 className="text-sm tracking-[0.4em] text-blue-500 uppercase mb-8 font-bold">Proof of Integrity</h2>
                <div className="space-y-12">
                    <div className="group">
                        <p className="text-2xl md:text-4xl text-white font-bold tracking-tight leading-tight uppercase font-space-grotesk">
                            Built for developers.
                        </p>
                    </div>
                    <div className="group">
                        <p className="text-2xl md:text-4xl text-white font-bold tracking-tight leading-tight uppercase font-space-grotesk">
                            Backed by a founder with institutional-grade governance design.
                        </p>
                    </div>
                    <div className="group">
                        <p className="text-2xl md:text-4xl text-white font-bold tracking-tight leading-tight uppercase font-space-grotesk">
                            Designed for long-term economic integrity.
                        </p>
                    </div>
                </div>

                <div className="mt-32 pt-20 border-t border-white/5">
                    {/* REPLACE_THIS: Visionary Network Visual */}
                    <div className="w-full h-80 bg-white/[0.02] border border-white/5 rounded-none flex items-center justify-center grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-1000">
                        <span className="text-xs tracking-[0.5em] uppercase text-white/40">Visionary Network Visual</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
