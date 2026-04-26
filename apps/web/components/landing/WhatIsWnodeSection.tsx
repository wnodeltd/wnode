export default function WhatIsWnodeSection() {
    return (
        <section className="py-32 bg-black border-t border-white/5">
            <div className="max-w-6xl mx-auto text-center px-8 fade-in-section">
                <h2 className="text-3xl md:text-5xl font-bold text-white uppercase tracking-tighter leading-tight font-space-grotesk mb-16">
                    Wnode is a sovereign mesh of compute power. <br />
                    No central authority. No gatekeepers. <br />
                    Just pure, autonomous execution for the next era of the web.
                </h2>
                
                {/* KEEP_THIS: devices.png */}
                <div className="relative group">
                    <div className="absolute inset-0 bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />
                    <img 
                        src="/devices.png" 
                        alt="Wnode Ecosystem" 
                        className="relative w-full h-auto rounded-[2rem] border border-white/5 shadow-2xl transition-all duration-700 group-hover:border-blue-500/20" 
                    />
                </div>
            </div>
        </section>
    );
}
