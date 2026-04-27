import { Cpu, Zap, Shield, BarChart3 } from "lucide-react";

export default function WhyItMattersSection() {
    const features = [
        {
            title: "Autonomous Mesh Compute",
            description: "No data centers. Just a resilient, distributed mesh of machines executing jobs in isolated RAM.",
            icon: Cpu,
            color: "text-blue-500",
            border: "border-blue-500/50"
        },
        {
            title: "Zero-Friction Onboarding",
            description: "Go from registration to live compute in seconds. No complex provisioning, just pure deployment.",
            icon: Zap,
            color: "text-purple-500",
            border: "border-purple-500/50"
        },
        {
            title: "Institutional Governance",
            description: "Built with long-term integrity at the core. Every decision is transparent, every economic flow is secured.",
            icon: Shield,
            color: "text-lime-400",
            border: "border-lime-400/50"
        },
        {
            title: "Trustless Economics",
            description: "All money is managed by Stripe with payments made direct to your bank account daily",
            icon: BarChart3,
            color: "text-fuchsia-500",
            border: "border-fuchsia-500/50"
        }
    ];

    return (
        <section className="py-32 bg-black border-t border-white/15">
            <div className="max-w-7xl mx-auto px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((f, i) => (
                        <div key={i} className={`fade-in-section p-10 border ${f.border} rounded-2xl bg-white/[0.01] hover:bg-white/[0.03] transition-all group shadow-[0_0_20px_rgba(0,0,0,0.5)]`}>
                            <f.icon className={`w-8 h-8 ${f.color} mb-8 group-hover:scale-110 transition-transform`} />
                            <h3 className="text-xl font-bold mb-4 text-white uppercase tracking-tight font-space-grotesk">{f.title}</h3>
                            <p className="text-slate-400 leading-relaxed text-base">{f.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
