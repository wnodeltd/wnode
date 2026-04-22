export default function TrustSection() {
    return (
        <section className="section-spacing border-t border-white/15 bg-black">
            <div className="max-w-5xl mx-auto text-center fade-in-section flex flex-col items-center">
                <h2 className="text-3xl font-semibold mb-8 text-white tracking-tight uppercase">Our philosophy</h2>
                <p className="text-xl md:text-2xl text-slate-300 leading-relaxed mb-16 max-w-4xl">
                    Wnode is a truly community owned W4 Decentralised Compute Network designed to leverage surging demand in favour of its community owners. Wnode replaces corporate data centres with a sovereign Mesh built with security as a foundation stone.
                </p>
                <div className="w-full transform hover:scale-[1.01] transition-transform duration-700">
                    <img src="/network-vision.png" alt="Wnode Network Vision" className="w-full h-auto rounded-[40px] shadow-2xl border border-white/15" />
                </div>
            </div>
        </section>
    );
}
