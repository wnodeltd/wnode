import { Cpu, Zap, Shield, BarChart3 } from "lucide-react";

export default function WhyItMattersSection() {
    const features = [
        {
            title: "Autonomous Mesh Compute",
            description: "No data centers. Just a resilient, distributed mesh of machines executing jobs in isolated RAM.",
            icon: Cpu,
        },
        {
            title: "Zero-Friction Onboarding",
            description: "Go from registration to live compute in seconds. No complex provisioning, just pure deployment.",
            icon: Zap,
        },
        {
            title: "Institutional Governance",
            description: "Built with long-term integrity at the core. Every decision is transparent, every economic flow is secured.",
            icon: Shield,
        },
        {
            title: "Investor-Ready Economics",
            description: "Direct revenue flows through the protocol. Real demand, real utility, real economic sovereignty.",
            icon: BarChart3,
        }
    ];

    return (
        <section className="py-32 bg-black border-t border-white/5">
            <div className="max-w-7xl mx-auto px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((f, i) => (
                        <div key={i} className="fade-in-section p-10 border border-white/5 bg-white/[0.02] hover:border-blue-500/30 transition-all group">
                            <f.icon className="w-8 h-8 text-blue-500 mb-8 group-hover:scale-110 transition-transform" />
                            <h3 className="text-xl font-bold mb-4 text-white uppercase tracking-tight font-space-grotesk">{f.title}</h3>
                            <p className="text-slate-400 leading-relaxed text-base">{f.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
