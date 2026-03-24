"use client";

import { useState } from "react";

export default function JobWizard() {
    const [step, setStep] = useState(1);
    const [isUploading, setIsUploading] = useState(false);
    const [jobConfig, setJobConfig] = useState({
        budget: 5.00,
        parallelism: 8,
        urgency: "Normal"
    });

    const handleDeploy = () => {
        setIsUploading(true);
        setTimeout(() => {
            setIsUploading(false);
            setStep(3);
        }, 2000);
    };

    return (
        <div className="glass-card rounded-[40px] p-12 gradient-border-cyan">
            {step === 1 && (
                <div className="space-y-8">
                    <div className="text-center">
                        <h2 className="text-4xl font-black uppercase  tracking-tighter mb-4 glow-cyan leading-none">Spawn Task</h2>
                        <p className="text-slate-500 text-sm font-medium">Upload your WASM compute bundle to the global mesh.</p>
                    </div>

                    <div className="aspect-video rounded-3xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center p-8 bg-white/5 hover:bg-cyber-cyan/5 transition-all group cursor-pointer">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-cyber-cyan">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                            </svg>
                        </div>
                        <p className="text-xs  uppercase tracking-widest text-slate-400">Drag & Drop .wasm</p>
                    </div>

                    <button
                        onClick={() => setStep(2)}
                        className="w-full py-5 rounded-2xl bg-white text-obsidian font-black uppercase tracking-[0.2em] transform active:scale-[0.98] transition-all"
                    >
                        Configure Params
                    </button>
                </div>
            )}

            {step === 2 && (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4">
                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-6 block">Budget Allocation (USD)</label>
                        <div className="flex items-center justify-between">
                            <span className="text-6xl font-black  tracking-tighter glow-cyan ">${jobConfig.budget}</span>
                            <input
                                type="range" min="1" max="100"
                                value={jobConfig.budget}
                                onChange={(e) => setJobConfig({ ...jobConfig, budget: parseInt(e.target.value) })}
                                className="w-48 appearance-none bg-white/10 h-1 rounded-full border-none"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">Parallelism</span>
                            <span className="text-3xl  font-bold">{jobConfig.parallelism}x Nodes</span>
                        </div>
                        <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">Priority</span>
                            <span className="text-3xl  font-bold text-cyber-violet">High</span>
                        </div>
                    </div>

                    <button
                        onClick={handleDeploy}
                        disabled={isUploading}
                        className="w-full py-5 rounded-2xl bg-cyber-cyan text-obsidian font-black uppercase tracking-[0.2em] shadow-[0_0_40px_rgba(0,242,255,0.3)] disabled:opacity-50 transition-all font-sans"
                    >
                        {isUploading ? "Initializing Mesh..." : "Deploy to Mesh"}
                    </button>
                </div>
            )}

            {step === 3 && (
                <div className="text-center py-10 space-y-6 animate-in zoom-in duration-500">
                    <div className="w-24 h-24 rounded-full bg-cyber-cyan/10 border-4 border-cyber-cyan flex items-center justify-center mx-auto mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-10 h-10 text-cyber-cyan">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                    </div>
                    <h2 className="text-4xl font-black uppercase tracking-tighter glow-cyan">Operational</h2>
                    <p className="text-slate-500 text-sm max-w-xs mx-auto">Task has been broadcasted. 42 nodes currently processing your manifest.</p>
                    <button
                        onClick={() => setStep(1)}
                        className="text-xs uppercase font-bold tracking-widest text-cyber-cyan border-b border-cyber-cyan/30 pt-4"
                    >
                        View Live Ops
                    </button>
                </div>
            )}
        </div>
    );
}
