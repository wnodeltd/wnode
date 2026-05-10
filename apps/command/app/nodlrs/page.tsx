"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { 
    Search, Plus, Shield, Users, 
    RefreshCw, CheckCircle2, Database, Zap, Clock, ShieldAlert,
    User, Mail, Phone, MapPin, Building2, LayoutGrid, Calendar, FileText, ArrowRight, Pin, PinOff,
    Handshake, TrendingUp, Network, PlusCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
  createdAt: "2024-01-01T00:00:00Z",
  lastContact: new Date().toISOString(),
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
    const [navigationHistory, setNavigationHistory] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState<{type: 'success'|'error', text: string}|null>(null);

    // Referral Tree Verification Engine
    const verifyReferralTree = useCallback((records: CrmPerson[]) => {
        console.log("CRM -> Starting Referral Tree Verification...");
        let errors: string[] = [];
        
        records.forEach(person => {
            const referrer = person.affiliateReferrer;
            if (referrer && referrer !== "Founder") {
                const parent = records.find(r => r.wuid === referrer);
                if (!parent) {
                    errors.push(`Orphan found: ${person.name} (${person.wuid}) refers to missing WUID ${referrer}`);
                }
                if (referrer === person.wuid) {
                    errors.push(`Circular reference: ${person.name} (${person.wuid}) refers to self`);
                }
            }
        });

        if (errors.length === 0) {
            console.log("%cReferral Tree Integrity: PASS", "color: #22D3EE; font-weight: bold");
            return { pass: true, errors: [] };
        } else {
            console.warn("Referral Tree Integrity: FAIL");
            errors.forEach(e => console.error(`[Referral Error] ${e}`));
            return { pass: false, errors };
        }
    }, []);

    useEffect(() => {
        const saved = localStorage.getItem('crm_records');
        if (saved) {
            try {
                let parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) {
                    const hasStephen = parsed.find(p => p.wuid === STEPHEN_SOOS.wuid);
                    const records = hasStephen ? parsed : [STEPHEN_SOOS, ...parsed];
                    const migrated = records.map(p => ({
                        ...p,
                        createdAt: p.createdAt || new Date().toISOString(),
                        lastContact: p.lastContact || p.createdAt || new Date().toISOString()
                    }));
                    setCrmRecords(migrated);
                    verifyReferralTree(migrated);
                }
            } catch (e) {
                console.error("Failed to load CRM records");
            }
        } else {
            setCrmRecords([STEPHEN_SOOS]);
        }
    }, [verifyReferralTree]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const nodlrsRes = await fetch('/api/nodlrs/all');
            let normalized: CrmPerson[] = [];
            
            if (nodlrsRes.ok) {
                const data = await nodlrsRes.json();
                const rawNodlrs = Array.isArray(data) ? data : (data?.nodlrs || []);
                
                normalized = rawNodlrs.map((r: any) => ({
                    wuid: r.protocolId || r.id || "W-UNKNOWN",
                    name: r.displayName || r.email || "Unknown Identity",
                    email: r.email,
                    createdAt: r.createdAt || new Date().toISOString(),
                    lastContact: r.lastContact || r.createdAt || new Date().toISOString(),
                    isNodlr: true,
                    isMeshCustomer: !!r.isMeshCustomer,
                    isFounderOrPartner: !!r.isFounder,
                    activeNodes: Number(r.nodeCount || 0),
                    l1Affiliates: 0,
                    l2Affiliates: 0,
                    affiliateReferrer: r.referrerWuid || (r.isFounder ? "Founder" : "Partner"),
                    events: r.events || [],
                    notes: r.notes || []
                }));
            }

            const saved = localStorage.getItem('crm_records');
            const localRecords = saved ? JSON.parse(saved) : [];

            const merged = [
                STEPHEN_SOOS,
                ...normalized.filter((p: CrmPerson) => p.wuid !== STEPHEN_SOOS.wuid)
            ].map(apiRecord => {
                const local = localRecords.find((l: CrmPerson) => l.wuid === apiRecord.wuid);
                if (local) {
                    return { 
                        ...apiRecord, 
                        notes: local.notes || [],
                        address: local.address || "",
                        phone1: local.phone1 || "",
                        phone2: local.phone2 || "",
                        createdAt: local.createdAt || apiRecord.createdAt,
                        lastContact: local.lastContact || apiRecord.lastContact
                    };
                }
                return apiRecord;
            });

            setCrmRecords(merged);
            localStorage.setItem('crm_records', JSON.stringify(merged));
            verifyReferralTree(merged);
        } catch (error) {
            console.error('CRM Hub -> Fetch Error:', error);
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

    const dashboardStats = useMemo(() => {
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
        const totalClients = crmRecords.length;
        const activeClients = crmRecords.filter(p => {
            const last = p.lastContact ? new Date(p.lastContact) : new Date(0);
            return last >= thirtyDaysAgo;
        }).length;
        const newClients = crmRecords.filter(p => {
            const created = new Date(p.createdAt);
            return created >= thirtyDaysAgo;
        }).length;
        const totalNodes = crmRecords.reduce((acc, p) => acc + (p.activeNodes || 0), 0);
        return { totalClients, activeClients, newClients, totalNodes };
    }, [crmRecords]);

    const handleUpdatePerson = (updated: CrmPerson) => {
        const newRecords = crmRecords.map(p => p.wuid === updated.wuid ? updated : p);
        setCrmRecords(newRecords);
        localStorage.setItem('crm_records', JSON.stringify(newRecords));
        verifyReferralTree(newRecords);
        if (selectedPerson?.wuid === updated.wuid) {
            setSelectedPerson(updated);
        }
    };

    const handleSelectPerson = (person: CrmPerson) => {
        setNavigationHistory([person.wuid]);
        setSelectedPerson(person);
    };

    const handleNavigateToReferrer = (wuid: string) => {
        const referrer = crmRecords.find(r => r.wuid === wuid);
        if (referrer) {
            setNavigationHistory(prev => [...prev, wuid]);
            setSelectedPerson(referrer);
        }
    };

    const handleBack = () => {
        if (navigationHistory.length > 1) {
            const newHistory = [...navigationHistory];
            newHistory.pop();
            const prevWuid = newHistory[newHistory.length - 1];
            const prevPerson = crmRecords.find(r => r.wuid === prevWuid);
            if (prevPerson) {
                setNavigationHistory(newHistory);
                setSelectedPerson(prevPerson);
            }
        }
    };

    return (
        <div className="flex-1 p-8 overflow-y-auto pb-24 relative custom-scrollbar h-full">
            <header className="flex flex-col gap-2 mb-10">
                <div className="flex items-center justify-start gap-6">
                    <h1 className="text-xl font-normal tracking-tight text-white uppercase tracking-widest">Nodl'r CRM Database</h1>
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
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-10">
                <CrmMetricCard 
                    label="Total Clients / Contacts" 
                    value={dashboardStats.totalClients} 
                    icon={Users} 
                    color="text-blue-400" 
                    border="border-blue-500/30"
                    subtext="Aggregated"
                    tooltip="Total number of unique identities in the database."
                />
                <CrmMetricCard 
                    label="Active Clients" 
                    value={dashboardStats.activeClients} 
                    icon={Handshake} 
                    color="text-green-400" 
                    border="border-green-500/30"
                    subtext="Last 30 days"
                    tooltip="Clients who have interacted within the last 30 days."
                />
                <CrmMetricCard 
                    label="New Clients" 
                    value={dashboardStats.newClients} 
                    icon={TrendingUp} 
                    color="text-teal-400" 
                    border="border-teal-500/30"
                    subtext="Last 30 days"
                    tooltip="Growth indicator: records created in the last 30 days."
                />
                <CrmMetricCard 
                    label="Active Nodes" 
                    value={dashboardStats.totalNodes} 
                    icon={Network} 
                    color="text-yellow-500" 
                    border="border-yellow-500/30"
                    subtext="Network Registry"
                    tooltip="Real-time count of active network infrastructure."
                />
            </div>

            <div className="card-sovereign p-6 flex items-center gap-6 mb-8">
                <div className="flex-1 relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-[#22D3EE] transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Search Database: Name, Email, or WUID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="max-w-[400px] w-full bg-black/50 border border-white/10 rounded-[5px] pl-12 pr-4 py-3 text-[14px] text-white focus:outline-none focus:border-[#22D3EE]/50 transition-all placeholder:text-slate-700 font-normal"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <button className="bg-[#22D3EE] hover:bg-[#22D3EE]/80 text-black px-8 py-3 rounded-[5px] flex items-center gap-3 text-[13px] font-bold uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                        <Plus className="w-4 h-4" />
                        New Entry
                    </button>
                </div>
            </div>

            <div className="bg-white/[0.01] border border-white/10 rounded-[5px] overflow-hidden">
                <div className="grid grid-cols-[180px_1fr_140px_140px_140px] border-b border-white/10 bg-white/[0.02] px-6 py-4">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">WUID</span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Name / Status</span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">Nodes</span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">L1</span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">L2</span>
                </div>

                <div className="divide-y divide-white/5 p-1 space-y-1">
                    {filteredRecords.map((person) => (
                        <div 
                            key={person.wuid} 
                            onClick={() => handleSelectPerson(person)}
                            className="grid grid-cols-[180px_1fr_140px_140px_140px] items-center px-6 py-4 rounded-[4px] transition-all cursor-pointer hover:bg-white/[0.04] border border-transparent hover:border-white/10 group"
                            title={`View details for ${person.name}`}
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
                </div>
            </div>

            <CrmDetailPanel 
                isOpen={!!selectedPerson}
                onClose={() => setSelectedPerson(null)}
                person={selectedPerson}
                onUpdate={handleUpdatePerson}
                onNavigate={handleNavigateToReferrer}
                history={navigationHistory}
                onBack={handleBack}
            />
        </div>
    );
}

function CrmMetricCard({ label, value, icon: Icon, color, border, subtext, tooltip }: any) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div 
            className={`relative bg-white/[0.02] border ${border} rounded-[5px] p-6 flex flex-col gap-4 group hover:bg-white/[0.04] transition-all cursor-help`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            title={tooltip}
        >
            <AnimatePresence>
                {isHovered && tooltip && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute -top-12 left-1/2 -translate-x-1/2 z-[120] bg-black border border-white/20 px-3 py-1.5 rounded text-[10px] text-white uppercase tracking-widest whitespace-nowrap shadow-2xl pointer-events-none"
                    >
                        {tooltip}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-black border-r border-b border-white/20 rotate-45 -mt-1" />
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex items-center justify-between">
                <Icon className={`w-5 h-5 ${color} opacity-80 group-hover:opacity-100 transition-opacity`} />
                <span className="text-[11px] text-white uppercase font-bold tracking-widest">{label}</span>
            </div>
            <div className="flex flex-col items-center justify-center gap-1">
                <span className="text-[28px] text-white font-mono font-bold leading-none">{value}</span>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest">{subtext}</span>
            </div>
        </div>
    );
}
