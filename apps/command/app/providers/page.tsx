"use client";

import React, { useState, useEffect } from "react";
import { 
    Zap, DollarSign, Search, Filter, ChevronRight, HardDrive, 
    ShieldAlert, ShieldCheck, Mail, Lock, BarChart3, User, Server,
    RefreshCw, Plus, X, Shield, Users
} from "lucide-react";
import DetailPanel from "../components/DetailPanel";

export default function ProvidersPage() {
    const [providers, setProviders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedProvider, setSelectedProvider] = useState<any>(null);
    const [providerDetails, setProviderDetails] = useState<any>(null);
    const [search, setSearch] = useState("");
    const [tags, setTags] = useState<string[]>([
        "High-Uptime",
        "Verified Stripe",
        "Premium Hardware"
    ]);
    const [addingTag, setAddingTag] = useState(false);
    const [newTag, setNewTag] = useState("");

    const addTag = () => {
        if (newTag.trim() !== "") {
            setTags([...tags, newTag.trim()]);
            setNewTag("");
        }
        setAddingTag(false);
    };

    const removeTag = (tag: string) => {
        setTags(tags.filter(t => t !== tag));
    };

    const fetchProviders = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/nodlrs/all');
            if (res.ok) {
                const data = await res.json();
                setProviders(data);
            }
        } catch (error) {
            console.error('Failed to fetch providers:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProviders();
    }, []);

    useEffect(() => {
        if (selectedProvider) {
            const fetchDetails = async () => {
                try {
                    const res = await fetch(`/api/nodlrs/${selectedProvider.id}`);
                    if (res.ok) {
                        setProviderDetails(await res.json());
                    }
                } catch (error) {
                    console.error('Failed to fetch details:', error);
                }
            };
            fetchDetails();
        } else {
            setProviderDetails(null);
        }
    }, [selectedProvider]);

    const filteredProviders = providers.filter(p => 
        (p.displayName || "").toLowerCase().includes(search.toLowerCase()) || 
        (p.email || "").toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            <header className="h-14 border-b border-white/10 flex items-center justify-between px-8 bg-black shrink-0 relative z-10 transition-all">
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#22D3EE] shadow-[0_0_8px_#22D3EE]" />
                    <span className="text-[10px] font-normal text-slate-400 tracking-[0.2em] uppercase">Supply Core Active</span>
                </div>
                <button 
                    onClick={() => { fetchProviders(); }}
                    className="p-2 hover:bg-white/5 rounded-[5px] transition-colors text-slate-400 hover:text-white"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </header>

            <main className="p-8 w-full flex flex-col space-y-8 overflow-y-auto pb-24">
                <h1 className="text-[26px] font-medium text-white tracking-tight mb-4">
                    nodl’r ecosystem management
                </h1>

                <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-[6px] w-full flex-wrap">
                    <select className="w-fit transition-all bg-transparent border-none">
                        <option>Filter by Region</option>
                        <option>EU</option>
                        <option>US</option>
                        <option>Asia</option>
                        <option>Global</option>
                    </select>

                    <select className="w-fit transition-all bg-transparent border-none">
                        <option>Filter by Date Joined</option>
                        <option>Last 7 Days</option>
                        <option>Last 30 Days</option>
                        <option>Last 90 Days</option>
                        <option>All Time</option>
                    </select>

                    <select className="w-fit transition-all bg-transparent border-none">
                        <option>Filter by Earnings</option>
                        <option>$0–$500</option>
                        <option>$500–$5,000</option>
                        <option>$5,000–$25,000</option>
                        <option>$25,000+</option>
                    </select>

                    <select className="w-fit transition-all bg-transparent border-none">
                        <option>Filter by Nodl Count</option>
                        <option>0</option>
                        <option>1–5</option>
                        <option>6–20</option>
                        <option>21–50</option>
                        <option>50+</option>
                    </select>

                    <select className="w-fit transition-all bg-transparent border-none">
                        <option>Filter by Account Type</option>
                        <option>Individual</option>
                        <option>Company</option>
                        <option>DAO</option>
                        <option>Trust</option>
                        <option>Partnership</option>
                        <option>Foundation</option>
                    </select>

                    <div className="flex-1" />
                    <div className="relative">
                        <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input 
                            type="text"
                            placeholder="Search all provider accounts..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 pr-4 w-64 transition-all bg-transparent border-none"
                        />
                    </div>
                </div>

                <div className="bg-black/40 border border-white/5 rounded-[5px] overflow-hidden backdrop-blur-sm w-full text-left space-y-2">
                    <table className="w-full text-left">
                        <thead className="bg-white/[0.02] border-b border-white/5">
                            <tr>
                                <th className="px-6 py-4 text-slate-400 text-[12px] uppercase tracking-widest">Nodl’r Identity</th>
                                <th className="px-6 py-4 text-slate-400 text-[12px] uppercase tracking-widest">Global Status</th>
                                <th className="px-6 py-4 text-slate-400 text-[12px] uppercase tracking-widest">Active Nodls</th>
                                <th className="px-6 py-4 text-slate-400 text-[12px] uppercase tracking-widest">Revenue (MTD)</th>
                                <th className="px-6 py-4 text-slate-400 text-[12px] uppercase tracking-widest">Last Activity</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredProviders.map((p) => (
                                <tr 
                                    key={p.id} 
                                    onClick={() => setSelectedProvider(p)}
                                    className="hover:bg-white/[0.03] transition-colors cursor-pointer group"
                                >
                                    <td className="px-6 py-5 text-slate-200 text-[14px]">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-[5px] bg-[#22D3EE]/5 border border-[#22D3EE]/20 flex items-center justify-center text-[12px] font-bold text-[#22D3EE] group-hover:bg-[#22D3EE] group-hover:text-black transition-all">
                                                <Server className="w-5 h-5 text-[#22D3EE] group-hover:text-black" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[14px] font-normal text-white">{p.displayName}</span>
                                                <span className="text-[11px] text-slate-500 font-mono italic">{p.id}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-slate-200 text-[14px]">
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-1.5 h-1.5 rounded-full ${p.status === 'active' ? 'bg-green-500 shadow-[0_0_8px_#22C55E]' : 'bg-red-500/50'}`} />
                                                <span className="text-[11px] text-slate-300 capitalize tracking-widest">{p.status}</span>
                                            </div>
                                            <div className={`text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded-[2px] w-fit border ${p.stripeVerification === 'verified' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500'}`}>
                                                Stripe {p.stripeVerification}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-slate-200 text-[14px]">
                                        <div className="flex items-center gap-2">
                                            <HardDrive className="w-4 h-4 text-slate-600" />
                                            <span className="text-[15px] font-mono text-white">{p.nodeCount}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-slate-200 text-[14px] font-mono">
                                        <span className="text-[14px] text-[#22D3EE] font-normal">$0.00</span>
                                    </td>
                                    <td className="px-6 py-5 text-slate-200 text-[14px]">
                                        <span className="text-[12px] text-slate-500 font-mono">--</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredProviders.length === 0 && !loading && (
                        <div className="py-24 flex flex-col items-center justify-center space-y-4">
                            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-full">
                                <Server className="w-8 h-8 text-slate-700" />
                            </div>
                            <p className="text-[14px] text-slate-500 font-normal">No provider accounts found in registry.</p>
                        </div>
                    )}
                    {loading && <div className="py-20 flex justify-center"><RefreshCw className="w-8 h-8 animate-spin text-[#22D3EE] opacity-20" /></div>}
                </div>
            </main>

            <DetailPanel
                isOpen={!!selectedProvider}
                onClose={() => setSelectedProvider(null)}
                title="Nodl’r Account Details"
                subtitle={`Account ID: ${selectedProvider?.id}`}
                footer={
                    <div className="flex items-center gap-3">
                        <button disabled className="flex-1 py-3 bg-red-400/5 border border-red-400/10 rounded-[5px] text-[13px] text-red-400/30 cursor-not-allowed flex items-center justify-center gap-2 font-normal">
                            <ShieldAlert className="w-4 h-4" />
                            Suspend (N/A)
                        </button>
                        <button disabled className="flex-[2] py-3 bg-[#22D3EE]/10 border border-[#22D3EE]/20 text-[#22D3EE]/40 rounded-[5px] text-[13px] font-medium cursor-not-allowed flex items-center justify-center gap-2">
                            <ShieldCheck className="w-4 h-4" />
                            Authorize (N/A)
                        </button>
                    </div>
                }
            >
                {providerDetails ? (
                    <div className="space-y-12">
                        <section className="space-y-12">
                            <h4 className="text-[17px] font-medium text-slate-200 uppercase tracking-widest flex items-center gap-2">
                                <User className="w-4 h-4 text-[#22D3EE] relative top-[1px]" />
                                Account Details
                            </h4>
                            <div className="grid grid-cols-1 gap-4">
                                <div className="p-5 bg-white/5 border border-white/10 rounded-[5px] flex items-center justify-between gap-4">
                                    <span className="text-[14px] text-slate-300 uppercase tracking-widest flex items-center gap-2">
                                        <Mail className="w-3.5 h-3.5" /> Email Identity
                                    </span>
                                    <span className="text-[14px] text-white font-normal">{providerDetails.email}</span>
                                </div>
                                <div className="p-5 bg-white/5 border border-white/10 rounded-[5px] flex items-center justify-between">
                                    <span className="text-[12px] text-slate-300 uppercase tracking-widest">Name</span>
                                    <span className="text-[14px] text-white font-normal">
                                        {providerDetails?.email?.split('@')[0] ?? 'Unknown'}
                                    </span>
                                </div>
                                <div className="p-5 bg-white/5 border border-white/10 rounded-[5px] flex items-center justify-between">
                                    <span className="text-[12px] text-slate-300 uppercase tracking-widest">Role</span>
                                    <span className="text-[14px] text-white font-normal">{providerDetails.role}</span>
                                </div>
                                <div className="p-5 bg-white/5 border border-white/10 rounded-[5px] flex items-center justify-between">
                                    <span className="text-[12px] text-slate-500 uppercase tracking-widest">Account Created</span>
                                    <span className="text-[14px] text-white font-normal">
                                        {providerDetails.createdAt ? new Date(providerDetails.createdAt).toLocaleDateString() : 'N/A'}
                                    </span>
                                </div>
                                <div className="p-5 bg-white/5 border border-white/10 rounded-[5px] flex items-center justify-between">
                                    <span className="text-[12px] text-slate-300 uppercase tracking-widest">Account ID</span>
                                    <span className="text-[14px] text-white font-mono">
                                        {providerDetails.id}
                                    </span>
                                </div>
                            </div>
                        </section>

                        <section className="space-y-5">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-[#22D3EE] relative top-[1px]" />
                                <h4 className="text-[17px] font-medium text-slate-200 uppercase tracking-widest">
                                    Verification Methods
                                </h4>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-5 bg-white/5 border border-white/10 rounded-[5px]">
                                    <span className="text-[12px] text-slate-300 uppercase tracking-widest">Stripe Status</span>
                                    <div className="text-[14px] text-green-400 font-normal capitalize">
                                        {providerDetails.stripeVerification}
                                    </div>
                                </div>
                                <div className="p-5 bg-white/5 border border-white/10 rounded-[5px]">
                                    <span className="text-[12px] text-slate-300 uppercase tracking-widest">Operational Verification</span>
                                    <div className="text-[14px] text-white font-normal">
                                        Node Count: {providerDetails.fleetSummary?.length || 0}  
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="space-y-12">
                            <h4 className="text-[17px] font-medium text-slate-200 uppercase tracking-widest flex items-center gap-2">
                                <HardDrive className="w-4 h-4 text-[#22D3EE] relative top-[1px]" />
                                Nodl Fleet Overview
                            </h4>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-5 bg-white/5 border border-white/10 rounded-[5px]">
                                    <span className="text-[12px] text-slate-500 uppercase tracking-widest">Total Nodls</span>
                                    <div className="text-[18px] font-mono text-white">{providerDetails.fleetSummary?.length || 0}</div>
                                </div>
                                <div className="p-5 bg-white/5 border border-white/10 rounded-[5px]">
                                    <span className="text-[12px] text-slate-500 uppercase tracking-widest">Active Nodls</span>
                                    <div className="text-[18px] font-mono text-green-400">{providerDetails.fleetSummary?.length || 0}</div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                {providerDetails.fleetSummary?.map((node: any) => (
                                    <div key={node.id} className="p-4 bg-white/5 border border-white/10 rounded-[3px] flex justify-between items-center text-[11px]">
                                        <div className="flex flex-col">
                                            <span className="text-white font-mono">{node.id}</span>
                                            <span className="text-slate-500 uppercase tracking-widest">{node.tier}</span>
                                        </div>
                                        <span className="text-[#22D3EE] font-mono uppercase tracking-widest">{node.status}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="space-y-5">
                            <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-[#22D3EE] relative top-[1px]" />
                                <h4 className="text-[17px] font-medium text-slate-200 uppercase tracking-widest">
                                    Affiliate Network
                                </h4>
                            </div>
                            <div className="space-y-3">
                                {providerDetails.affiliateTree?.map((member: any) => (
                                    <div key={member.id} className="p-4 bg-white/5 border border-white/10 rounded-[3px] flex justify-between items-center text-[11px]">
                                        <span className="text-white font-mono">{member.id}</span>
                                        <span className="px-2 py-0.5 rounded-[2px] bg-white/10 text-slate-400 uppercase tracking-widest">L{member.level}</span>
                                    </div>
                                ))}
                                {(!providerDetails.affiliateTree || providerDetails.affiliateTree.length === 0) && (
                                    <p className="text-[12px] text-slate-500 italic">No affiliate network discovered for this user.</p>
                                )}
                            </div>
                        </section>
                    </div>
                ) : selectedProvider ? (
                    <div className="flex items-center justify-center py-40">
                        <RefreshCw className="w-8 h-8 animate-spin text-[#22D3EE] opacity-20" />
                    </div>
                ) : null}
            </DetailPanel>
        </>
    );
}
