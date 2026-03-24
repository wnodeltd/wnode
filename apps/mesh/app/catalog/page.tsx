'use client';

import React, { useState } from 'react';
import { Search, Filter, Cpu, Globe, Zap, ShieldCheck, ChevronRight } from 'lucide-react';

const OFFERS = [
    { id: '1', tier: 'Boost', region: 'Europe (FRA)', cpu: '32 Cores', gpu: 'RTX 4090', latency: '12ms', price: '$0.0042/s', reliability: '99.9%' },
    { id: '2', tier: 'Standard', region: 'North America (NYC)', cpu: '16 Cores', gpu: 'Tesla T4', latency: '45ms', price: '$0.0018/s', reliability: '98.5%' },
    { id: '3', tier: 'Tiny', region: 'Asia (Tokyo)', cpu: '4 Cores', gpu: 'None', latency: '82ms', price: '$0.0006/s', reliability: '97.2%' },
    { id: '4', tier: 'Standard', region: 'South America (SP)', cpu: '12 Cores', gpu: 'RTX 3080', latency: '120ms', price: '$0.0021/s', reliability: '99.1%' },
];

export default function CatalogPage() {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="p-10 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-normal lowercase tracking-tighter text-white mb-1.5">Offer Catalog</h1>
                <p className="text-13px text-slate-500 uppercase tracking-widest font-normal">On-demand compute marketplace</p>
            </div>

            {/* Filters & Search */}
            <div className="flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="SEARCH NODES, REGIONS, OR SPECS..."
                        className="w-full bg-white/5 border border-white/5 px-12 py-4  text-[11px] uppercase tracking-widest text-white focus:outline-none focus:border-[#00f2ff]/30 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="flex items-center gap-2 bg-white/5 border border-white/5 px-6 py-4 font-black text-[11px] uppercase tracking-widest text-slate-400 hover:text-white hover:border-[#00f2ff]/30 transition-all">
                    <Filter className="w-4 h-4" /> Filters
                </button>
            </div>

            {/* Offer Grid */}
            <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-6 px-6 py-2  text-[9px] uppercase font-bold text-slate-500 tracking-widest">
                    <span>Host Tier</span>
                    <span>Region</span>
                    <span>Compute Specs</span>
                    <span>Latency</span>
                    <span>Reliability</span>
                    <span className="text-right">Price</span>
                </div>

                {OFFERS.map((offer) => (
                    <div key={offer.id} className="grid grid-cols-6 items-center bg-white/5 border border-white/5 p-6 group hover:border-[#00f2ff]/30 transition-all cursor-pointer">
                        <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-none ${offer.tier === 'Boost' ? 'bg-[#9d00ff] shadow-[0_0_10px_#9d00ff]' : offer.tier === 'Standard' ? 'bg-[#00f2ff] shadow-[0_0_10px_#00f2ff]' : 'bg-slate-500'}`} />
                            <span className=" text-xs font-bold text-white uppercase">{offer.tier}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Globe className="w-3 h-3 text-slate-500" />
                            <span className=" text-xs text-slate-300 uppercase">{offer.region}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className=" text-xs text-white uppercase">{offer.cpu}</span>
                            <span className=" text-[9px] text-[#00f2ff] uppercase">{offer.gpu}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Zap className="w-3 h-3 text-yellow-500" />
                            <span className=" text-xs text-slate-300">{offer.latency}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-3 h-3 text-green-500" />
                            <span className=" text-xs text-slate-300">{offer.reliability}</span>
                        </div>
                        <div className="flex items-center justify-end gap-4">
                            <span className=" text-sm font-black text-[#00f2ff] tracking-tighter">{offer.price}</span>
                            <ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-[#00f2ff] transition-colors" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
