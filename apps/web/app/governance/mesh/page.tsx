"use client";

import AppLayout from "../../../components/layout/AppLayout";

export default function MeshGovernancePage() {
    return (
        <AppLayout>
            <div className="bg-black text-white min-h-screen pt-40 pb-20 px-8">
                <div className="max-w-4xl mx-auto space-y-12">
                    <div className="space-y-4">
                        <h1 className="text-sm tracking-[0.5em] text-blue-500 uppercase font-bold">Protocol Governance</h1>
                        <h2 className="text-4xl md:text-6xl font-bold tracking-tight uppercase font-space-grotesk">Wnode Mesh</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-12">
                        <div className="p-8 border border-white/15 bg-white/5 rounded-3xl space-y-4">
                            <h3 className="text-xl font-bold uppercase tracking-widest text-blue-400">Node Consensus</h3>
                            <p className="text-white/60 leading-relaxed">
                                The Wnode Mesh operates on a distributed consensus model where node operators validate protocol upgrades and resource allocations.
                            </p>
                        </div>
                        <div className="p-8 border border-white/15 bg-white/5 rounded-3xl space-y-4">
                            <h3 className="text-xl font-bold uppercase tracking-widest text-purple-400">Resource Logic</h3>
                            <p className="text-white/60 leading-relaxed">
                                Mesh governance ensures that compute resources are prioritized according to sovereign community requirements and protocol efficiency.
                            </p>
                        </div>
                    </div>

                    <div className="prose prose-invert max-w-none pt-12">
                        <p className="text-xl text-white/80 leading-relaxed">
                            This page will host the live voting and proposal mechanisms for the Wnode Mesh protocol.
                        </p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
