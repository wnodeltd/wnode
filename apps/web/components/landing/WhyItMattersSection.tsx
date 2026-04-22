import { Cpu, TrendingUp, Zap, ShieldCheck } from "lucide-react";

export default function WhyItMattersSection() {
    const features = [
        {
            title: "Own Web 4",
            description: "Compute demand outstrips supply. Decentralized Edge and Mesh compute is the future",
            icon: Cpu,
            color: "text-cyan-400",
            borderColor: "border-cyan-500/50"
        },
        {
            title: "Affilate economics.",
            description: "Modelled on the most respected and robust Affiliate protocols to create highly leveraged passive income from real world \"in demand\" product.",
            icon: TrendingUp,
            color: "text-violet-400",
            borderColor: "border-violet-500/50"
        },
        {
            title: "No gatekeepers.",
            description: "Built on mesh infrastructure. No permission required to create, grow, or monetise.",
            icon: ShieldCheck,
            color: "text-amber-400",
            borderColor: "border-amber-500/50"
        },
        {
            title: "Novice-proof.",
            description: "3 Clicks and earn, add devices and grow your revenue to any scale.Fully automated, fully managed, always yours.",
            icon: Zap,
            color: "text-emerald-400",
            borderColor: "border-emerald-500/50"
        }
    ];

    return (
        <section className="section-spacing border-t border-white/15">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((f, i) => (
                    <div key={i} className={`fade-in-section p-6 rounded-[20px] border ${f.borderColor} bg-white/[0.02] backdrop-blur-sm transition-all hover:bg-white/[0.04] flex flex-col`}>
                        <f.icon className={`w-6 h-6 ${f.color} mb-6`} />
                        <h3 className="text-xl font-bold mb-4 text-white uppercase tracking-tight">{f.title}</h3>
                        <p className="text-slate-400 leading-relaxed text-base">{f.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
