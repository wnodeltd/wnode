"use client";

import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { Users, UserPlus, ArrowRightLeft, Shield, TrendingUp, Info } from "lucide-react";

interface TreeNode {
    id: string;
    level: number;
    email?: string; // Optional if fetched separately
}

interface AccountInfo {
    id: string;
    email: string;
    isFounder: boolean;
    founderIndex?: number;
}

export default function AffiliatesPage() {
    const [tree, setTree] = useState<TreeNode[]>([]);
    const [account, setAccount] = useState<AccountInfo | null>(null);
    const [transferModal, setTransferModal] = useState<{childId: string} | null>(null);
    const [newParentId, setNewParentId] = useState("");
    const [loading, setLoading] = useState(true);

    // Mock ID for development (in real app, this comes from auth context)
    const MOCK_USER_ID = "0xFD-OWNER-SYSTEM"; 

    useEffect(() => {
        const fetchData = async () => {
            try {
                // In a real setup, we'd fetch the current logged-in user's ID
                const [accRes, treeRes] = await Promise.all([
                    fetch(`http://process.env.NEXT_PUBLIC_API_URL || "https://api.nodl.one"/account/${MOCK_USER_ID}`),
                    fetch(`http://process.env.NEXT_PUBLIC_API_URL || "https://api.nodl.one"/affiliates/tree/${MOCK_USER_ID}`)
                ]);

                if (accRes.ok) setAccount(await accRes.json());
                if (treeRes.ok) setTree(await treeRes.json());
            } catch (err) {
                console.error("Failed to fetch affiliate data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleTransfer = async () => {
        if (!transferModal || !newParentId) return;
        
        try {
            const res = await fetch('http://process.env.NEXT_PUBLIC_API_URL || "https://api.nodl.one"/affiliates/transfer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ childId: transferModal.childId, newParentId })
            });
            if (res.ok) {
                // Refresh tree
                const treeRes = await fetch(`http://process.env.NEXT_PUBLIC_API_URL || "https://api.nodl.one"/affiliates/tree/${MOCK_USER_ID}`);
                if (treeRes.ok) setTree(await treeRes.json());
                setTransferModal(null);
                setNewParentId("");
            }
        } catch (err) {
            console.error("Transfer failed:", err);
        }
    };

    const l1 = tree.filter(n => n.level === 1);
    const l2 = tree.filter(n => n.level === 2);

    return (
        <div className="flex min-h-screen bg-black text-white font-sans overflow-hidden">
            <Sidebar />
            <div className="flex-1 lg:pl-64 flex flex-col relative h-screen overflow-hidden">
                <header className="h-14 border-b border-white/25 flex items-center justify-between px-8 bg-black shrink-0">
                    <span className="text-[12px] font-normal text-slate-400 tracking-[0.2em] uppercase-none font-mono">Affiliate Intelligence & Distribution</span>
                    <div className="flex items-center gap-3">
                        {account?.isFounder && (
                            <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-[3px] text-[10px] font-bold">
                                FOUNDER #{account.founderIndex}
                            </div>
                        )}
                        <div className="flex items-center gap-2.5 bg-[#22D3EE] px-3 py-1 rounded-[5px]">
                            <span className="text-[14px] text-black font-normal italic lowercase-none">{account?.email || "Stephen_Nodlrs"}</span>
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-10 overflow-y-auto pb-24 space-y-10">
                    <div className="flex justify-between items-end">
                        <div className="pb-2">
                            <h2 className="text-[20px] font-normal tracking-tight text-white mb-1 uppercase-none italic">Hierarchical Network</h2>
                            <p className="text-[14px] text-slate-400 font-normal uppercase-none">Visualizing automated placement and commission distribution.</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="card-sovereign py-2 px-5 bg-white/[0.04]">
                                <span className="text-[10px] text-slate-500 block uppercase-none">Standard Payout</span>
                                <span className="text-[16px] text-[#22D3EE] font-mono">2% L1 | 6% L2</span>
                            </div>
                            {account?.isFounder && (
                                <div className="card-sovereign py-2 px-5 bg-emerald-500/5 border-emerald-500/20">
                                    <span className="text-[10px] text-emerald-500 block uppercase-none">Founder Override</span>
                                    <span className="text-[16px] text-emerald-400 font-mono">+3% Global</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="card-sovereign p-6 space-y-4">
                            <div className="flex items-center gap-3 text-slate-500">
                                <Users className="w-4 h-4" />
                                <span className="text-[11px] uppercase-none tracking-widest">Total Affiliates</span>
                            </div>
                            <span className="text-[32px] font-normal font-mono">{tree.length}</span>
                        </div>
                        <div className="card-sovereign p-6 space-y-4">
                            <div className="flex items-center gap-3 text-[#22D3EE]">
                                <UserPlus className="w-4 h-4" />
                                <span className="text-[11px] uppercase-none tracking-widest">Direct (Level 1)</span>
                            </div>
                            <span className="text-[32px] font-normal font-mono">{l1.length}</span>
                        </div>
                        <div className="card-sovereign p-6 space-y-4">
                            <div className="flex items-center gap-3 text-slate-500">
                                <TrendingUp className="w-4 h-4" />
                                <span className="text-[11px] uppercase-none tracking-widest">Secondary (Level 2)</span>
                            </div>
                            <span className="text-[32px] font-normal font-mono">{l2.length}</span>
                        </div>
                        <div className="card-sovereign p-6 space-y-4 bg-[#22D3EE]/5 border-[#22D3EE]/20">
                            <div className="flex items-center gap-3 text-[#22D3EE]">
                                <Shield className="w-4 h-4" />
                                <span className="text-[11px] uppercase-none tracking-widest font-bold">Total Earnings</span>
                            </div>
                            <span className="text-[32px] text-[#22D3EE] font-normal font-mono">$ 0.00</span>
                        </div>
                    </div>

                    {/* Tree Visualizer */}
                    <div className="card-sovereign p-8 flex flex-col gap-8">
                        <div className="border-b border-white/10 pb-4 flex justify-between items-center">
                            <h3 className="text-[16px] text-white uppercase-none font-bold italic">Network Topology</h3>
                            <div className="flex gap-4 text-[10px] uppercase-none font-mono text-slate-500">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-[#22D3EE] rounded-full" />
                                    <span>Level 1</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-slate-700 rounded-full" />
                                    <span>Level 2</span>
                                </div>
                            </div>
                        </div>

                        {tree.length === 0 ? (
                            <div className="py-20 text-center text-slate-600 italic">
                                No active affiliates in your tree.
                            </div>
                        ) : (
                            <div className="space-y-10">
                                {l1.map(parent => (
                                    <div key={parent.id} className="space-y-4">
                                        <div className="flex items-center gap-4 bg-white/[0.04] p-4 rounded-[5px] border border-white/10 group">
                                            <div className="w-8 h-8 rounded-full bg-[#22D3EE]/20 flex items-center justify-center text-[#22D3EE] text-[12px] font-mono">L1</div>
                                            <div className="flex-1">
                                                <p className="text-[14px] font-mono text-white">{parent.id}</p>
                                                <p className="text-[10px] text-slate-500 uppercase-none tracking-widest">DIRECT SPONSOR</p>
                                            </div>
                                            <button 
                                                onClick={() => setTransferModal({childId: parent.id})}
                                                className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/5 hover:bg-white/10 p-2 rounded-[4px] text-slate-400 hover:text-white flex items-center gap-2 text-[10px] uppercase-none"
                                            >
                                                <ArrowRightLeft className="w-3.5 h-3.5" />
                                                Transfer
                                            </button>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pl-12 border-l border-white/10 ml-4 py-2">
                                            {tree.filter(n => n.level === 2).map(child => (
                                                 <div key={child.id} className="p-3 bg-white/[0.02] border border-white/5 rounded-[4px] flex items-center gap-3">
                                                    <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 text-[10px] font-mono">L2</div>
                                                    <span className="text-[12px] text-slate-400 font-mono overflow-hidden text-ellipsis">{child.id}</span>
                                                 </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </main>

                {/* Transfer Modal */}
                {transferModal && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[200] backdrop-blur-sm">
                        <div className="card-sovereign p-10 max-w-md w-full animate-in zoom-in-95 duration-200">
                             <h3 className="text-[20px] text-white uppercase-none italic mb-4">Transfer Affiliate</h3>
                             <p className="text-slate-400 text-[14px] mb-8 leading-relaxed">
                                You are about to reassign <span className="text-[#22D3EE] font-mono">{transferModal.childId}</span> to a new sponsor. 
                                <br/><br/>
                                <span className="text-orange-400 font-bold uppercase-none text-[12px] flex items-center gap-2">
                                    <Info className="w-4 h-4" />
                                    WARNING: THIS ACTION IS IRREVERSIBLE.
                                </span>
                             </p>
                             
                             <div className="space-y-2 mb-8">
                                <label className="text-[11px] text-slate-500 uppercase-none tracking-widest">New Sponsor Peer ID</label>
                                <input 
                                    className="w-full bg-black/50 border border-white/20 p-3 rounded-[5px] text-[#22D3EE] font-mono text-[13px] focus:outline-none focus:border-[#22D3EE]"
                                    placeholder="0xabc...123"
                                    value={newParentId}
                                    onChange={(e) => setNewParentId(e.target.value)}
                                />
                             </div>

                             <div className="flex gap-4">
                                <button 
                                    onClick={() => setTransferModal(null)}
                                    className="flex-1 py-3 bg-white/5 text-slate-400 rounded-[5px] text-[12px] font-bold tracking-widest uppercase-none hover:bg-white/10"
                                >
                                    CANCEL
                                </button>
                                <button 
                                    onClick={handleTransfer}
                                    className="flex-1 py-3 bg-[#22D3EE] text-black rounded-[5px] text-[12px] font-bold tracking-widest uppercase-none hover:bg-[#22D3EE]/90"
                                >
                                    CONFIRM TRANSFER
                                </button>
                             </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
