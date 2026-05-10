"use client";

import React, { useState, useMemo, useEffect } from "react";
import { 
    Search, Plus, Shield, Users, 
    RefreshCw, CheckCircle2, Database, Zap, Clock, ShieldAlert,
    User, Mail, Phone, MapPin, Building2, LayoutGrid, Calendar, FileText, ArrowRight, Pin, PinOff
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import DetailPanel from "../components/DetailPanel";
import { CrmPerson, CrmEvent, CrmNote } from "./types";
import CrmDetailPanel from "./components/CrmDetailPanel";

const STEPHEN_SOOS: CrmPerson = {
  wuid: "100001-0426-01-AA",
  name: "Stephen Soos",
  email: "stephen@wnode.one",
  address: "",
  phone1: "",
  phone2: "",
  affiliateReferrer: "Founder",
  isNodlr: true,
  isFounderOrPartner: true,
  isMeshCustomer: true,
  activeNodes: 0,
  l1Affiliates: 0,
  l2Affiliates: 0,
  events: [],
  notes: []
};

export default function NodlrsCRM() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedPerson, setSelectedPerson] = useState<CrmPerson | null>(null);
    const [crmRecords, setCrmRecords] = useState<CrmPerson[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState<{type: 'success'|'error', text: string}|null>(null);

    // Persistence Hook (Phase 2.1)
    useEffect(() => {
        const saved = localStorage.getItem('crm_records');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setCrmRecords(parsed);
                }
            } catch (e) {
                console.error("Failed to load CRM records from storage");
            }
        }
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [nodlrsRes, statsRes] = await Promise.all([
                fetch('/api/nodlrs/all'),
                fetch('/api/stats')
            ]);
            
            let normalized: CrmPerson[] = [];
            
            if (nodlrsRes.ok) {
                const data = await nodlrsRes.json();
                const rawNodlrs = Array.isArray(data) 
                    ? data 
                    : (data && Array.isArray(data.nodlrs) ? data.nodlrs : []);
                
                normalized = rawNodlrs.map((r: any) => ({
                    wuid: r.protocolId || r.id || "W-UNKNOWN",
                    name: r.displayName || r.email || "Unknown Identity",
                    email: r.email,
                    org: r.organization,
                    isNodlr: true,
                    isMeshCustomer: !!r.isMeshCustomer,
                    isFounderOrPartner: !!r.isFounder,
                    activeNodes: Number(r.nodeCount || 0),
                    l1Affiliates: 0,
                    l2Affiliates: 0,
                    address: r.address || "",
                    phone1: r.phone1 || "",
                    phone2: r.phone2 || "",
                    affiliateReferrer: r.referrerName || r.referrerWuid || (r.isFounder ? "Founder" : "Partner"),
                    events: r.events || [],
                    notes: r.notes || []
                }));
            }

            // Merge with local storage (to preserve notes/edits)
            const saved = localStorage.getItem('crm_records');
            const localRecords = saved ? JSON.parse(saved) : [];

            const merged = [
                STEPHEN_SOOS,
                ...normalized.filter((p: CrmPerson) => p.wuid !== STEPHEN_SOOS.wuid)
            ].map(apiRecord => {
                const local = localRecords.find((l: CrmPerson) => l.wuid === apiRecord.wuid);
                if (local) {
                    // Preserve local notes and specific fields
                    return { ...apiRecord, notes: local.notes, address: local.address || apiRecord.address, phone1: local.phone1 || apiRecord.phone1, phone2: local.phone2 || apiRecord.phone2 };
                }
                return apiRecord;
            });

            // Add any local-only records (e.g. from invite simulation)
            const localOnly = localRecords.filter((l: CrmPerson) => !merged.find(m => m.wuid === l.wuid));
            const finalRecords = [...merged, ...localOnly];

            setCrmRecords(finalRecords);
            localStorage.setItem('crm_records', JSON.stringify(finalRecords));

            if (statsRes.ok) {
                const statsData = await statsRes.json();
                setStats(statsData);
            }
        } catch (error) {
            console.error('CRM Hub -> Critical Fetch Error:', error);
            const saved = localStorage.getItem('crm_records');
            setCrmRecords(saved ? JSON.parse(saved) : [STEPHEN_SOOS]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredRecords = useMemo(() => {
        return crmRecords.filter(r => 
            r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            (r.email || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
            r.wuid.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [crmRecords, searchQuery]);

    const handleUpdatePerson = (updated: CrmPerson) => {
        const newRecords = crmRecords.map(p => p.wuid === updated.wuid ? updated : p);
        setCrmRecords(newRecords);
        localStorage.setItem('crm_records', JSON.stringify(newRecords));
        if (selectedPerson?.wuid === updated.wuid) {
            setSelectedPerson(updated);
        }
    };

    // Invite Simulation Pipeline (Phase 2.1)
    const simulateInviteAcceptance = () => {
        const newWuid = `1000${Math.floor(Math.random() * 9000)}-${Math.floor(Math.random() * 9000)}-01-AA`;
        const newNodlr: CrmPerson = {
            wuid: newWuid,
            name: "New Invited Nodlr",
            email: `nodlr-${Math.floor(Math.random()*1000)}@test.com`,
            address: "",
            phone1: "",
            phone2: "",
            affiliateReferrer: STEPHEN_SOOS.wuid, // Referred by Stephen
            isNodlr: true,
            isFounderOrPartner: false,
            isMeshCustomer: true,
            activeNodes: 1,
            l1Affiliates: 0,
            l2Affiliates: 0,
            events: [{ id: 'evt-1', type: 'INVITE_ACCEPTED', date: new Date().toISOString(), description: 'Accepted invitation to the network.' }],
            notes: []
        };

        const updated = [...crmRecords, newNodlr];
        setCrmRecords(updated);
        localStorage.setItem('crm_records', JSON.stringify(updated));
        
        setMessage({ type: 'success', text: `New Nodlr Created: ${newWuid}` });
        setTimeout(() => setMessage(null), 3000);
    };

    return (
        <div className="flex-1 p-8 overflow-y-auto pb-24 relative custom-scrollbar h-full">
            <header className="flex flex-col gap-2 mb-10">
                <div className="flex items-center justify-start gap-6">
                    <h1 className="text-xl font-normal tracking-tight text-white uppercase tracking-widest">Nodl'r CRM Operations</h1>
                    <AnimatePresence>
                        {message && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className={`flex items-center gap-2 px-4 py-1.5 rounded-[5px] border ${message.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}
                            >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span className="text-[11px] font-normal uppercase tracking-wider">{message.text}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                <p className="text-[14px] text-slate-500 font-normal">Unified CRM hub for all Nodl'r and Mesh identities.</p>
            </header>

            {/* Summary Box */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-10">
                {[
                    { label: "Total CRM Records", value: crmRecords.length, icon: Users, color: "text-white" },
                    { label: "Active Nodes", value: stats?.activeNodes || 0, icon: CheckCircle2, color: "text-green-400" },
                    { label: "Flagged Nodes", value: stats?.flaggedNodes || 0, icon: ShieldAlert, color: "text-orange-400" },
                    { label: "Inactive Nodes", value: (stats?.totalNodes || 0) - (stats?.activeNodes || 0), icon: Clock, color: "text-blue-400" },
                    { label: "Mesh Inventory", value: stats?.totalNodes || 0, icon: Database, color: "text-[#22D3EE]" },
                    { label: "State Integrity", value: "Verified", icon: Zap, color: "text-white" },
                ].map((stat, i) => (
                    <div key={i} className="bg-white/[0.02] border border-white/10 rounded-[5px] p-5 flex flex-col gap-3 group hover:border-white/20 transition-all">
                        <div className="flex items-center justify-start gap-4">
                            <stat.icon className={`w-4 h-4 ${stat.color} opacity-40 group-hover:opacity-100 transition-opacity`} />
                            <span className="text-[9px] text-slate-600 uppercase font-bold tracking-widest">CRM Baseline</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[20px] text-white font-mono">{isLoading ? '...' : stat.value}</span>
                            <span className="text-[10px] text-slate-500 uppercase tracking-tighter">{stat.label}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="card-sovereign p-6 flex items-center gap-6 mb-8">
                <div className="flex-1 relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-[#22D3EE] transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Search Filters: Name, Email, or WUID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="max-w-[400px] w-full bg-black/50 border border-white/10 rounded-[5px] pl-12 pr-4 py-3 text-[14px] text-white focus:outline-none focus:border-[#22D3EE]/50 transition-all placeholder:text-slate-700 font-normal"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={simulateInviteAcceptance}
                        className="bg-white/5 hover:bg-white/10 text-slate-400 border border-white/10 px-4 py-3 rounded-[5px] text-[11px] font-bold uppercase tracking-widest transition-all"
                    >
                        Simulate Invite
                    </button>
                    <button className="bg-[#22D3EE] hover:bg-[#22D3EE]/80 text-black px-8 py-3 rounded-[5px] flex items-center gap-3 text-[13px] font-bold uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                        <Plus className="w-4 h-4" />
                        New Record
                    </button>
                </div>
            </div>

            <div className="bg-white/[0.01] border border-white/10 rounded-[5px] overflow-hidden">
                {/* Header Row */}
                <div className="grid grid-cols-[180px_1fr_140px_140px_140px] border-b border-white/10 bg-white/[0.02] px-6 py-4">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">WUID</span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Name / Status</span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">Active Nodes</span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">L1 Affiliates</span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">L2 Affiliates</span>
                </div>

                {/* Data Rows */}
                <div className="divide-y divide-white/5 p-1 space-y-1">
                    {filteredRecords.map((person) => (
                        <div 
                            key={person.wuid} 
                            onClick={() => setSelectedPerson(person)}
                            className="grid grid-cols-[180px_1fr_140px_140px_140px] items-center px-6 py-4 rounded-[4px] transition-all cursor-pointer hover:bg-white/[0.04] border border-transparent hover:border-white/10 group"
                        >
                            <span className="text-[12px] font-mono text-slate-400 group-hover:text-white transition-colors">{person.wuid}</span>
                            <div className="flex items-center gap-4 overflow-hidden">
                                <span className="text-[14px] text-white font-medium truncate">{person.name}</span>
                                <div className="flex items-center gap-1.5 shrink-0">
                                    {person.isNodlr && (
                                        <div className="px-1.5 py-0.5 rounded-[2px] bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[8px] font-bold uppercase tracking-widest">NODLR</div>
                                    )}
                                    {person.isMeshCustomer && (
                                        <div className="px-1.5 py-0.5 rounded-[2px] bg-green-500/10 border border-green-500/20 text-green-400 text-[8px] font-bold uppercase tracking-widest">MESH</div>
                                    )}
                                    {person.isFounderOrPartner && (
                                        <div className="px-1.5 py-0.5 rounded-[2px] bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[8px] font-bold uppercase tracking-widest">GOLD</div>
                                    )}
                                </div>
                            </div>
                            <div className="text-center">
                                <span className="text-[14px] font-mono text-white">{person.activeNodes}</span>
                            </div>
                            <div className="text-center">
                                <span className="text-[14px] font-mono text-slate-500 group-hover:text-slate-300 transition-colors">{person.l1Affiliates}</span>
                            </div>
                            <div className="text-center">
                                <span className="text-[14px] font-mono text-slate-500 group-hover:text-slate-300 transition-colors">{person.l2Affiliates}</span>
                            </div>
                        </div>
                    ))}
                    
                    {filteredRecords.length === 0 && (
                        <div className="py-20 flex flex-col items-center justify-center opacity-40">
                            <Users className="w-8 h-8 mb-4" />
                            <span className="text-[11px] uppercase tracking-widest">No CRM records matching search.</span>
                        </div>
                    )}
                </div>
            </div>

            <CrmDetailPanel 
                isOpen={!!selectedPerson}
                onClose={() => setSelectedPerson(null)}
                person={selectedPerson}
                onUpdate={handleUpdatePerson}
            />
        </div>
    );
}
