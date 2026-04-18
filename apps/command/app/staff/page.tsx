"use client";

import { useState } from "react";
import { Shield, Users, UserPlus, MoreVertical, Search, Filter, ShieldCheck, ShieldAlert, BadgeCheck } from "lucide-react";
import { usePageTitle } from "../components/PageTitleContext";
import FounderAdmin from "../components/FounderAdmin";

const STAFF = [
    { id: '100001-0426-01-AA', name: 'Stephen Soos', email: 'stephen@wnode.one', role: 'Owner', status: 'Online', permissions: 'Full Authority', lastActive: 'Now' },
    { id: 'S-002', name: 'James Carter', email: 'james@wnode.one', role: 'Senior Manager', status: 'Offline', permissions: 'Operational Oversight', lastActive: '2h ago' },
    { id: 'S-003', name: 'Elena Vance', email: 'elena@wnode.one', role: 'Customer Service', status: 'Online', permissions: 'User Support', lastActive: 'Now' },
    { id: 'S-004', name: 'Marcus Wright', email: 'marcus@wnode.one', role: 'Visitor', status: 'Away', permissions: 'Audit Only', lastActive: '15m ago' },
];

const ROLE_COLORS = {
    'owner': 'text-[#22D3EE] bg-[#22D3EE]/10 border-[#22D3EE]/20',
    'executive': 'text-[#22D3EE] bg-[#22D3EE]/5 border-[#22D3EE]/10',
    'shareholder': 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    'management': 'text-purple-400 bg-purple-400/10 border-purple-400/20',
    'customer_service': 'text-slate-400 bg-white/[0.04] border-white/10',
    'visitor': 'text-slate-500 bg-white/[0.01] border-white/5',
    'founder': 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    'operator': 'text-blue-400 bg-blue-400/10 border-blue-400/20',
};

const ROLE_ICONS = {
    'owner': BadgeCheck,
    'executive': ShieldCheck,
    'shareholder': Shield,
    'management': ShieldAlert,
    'customer_service': Users,
    'visitor': Search,
    'founder': Zap,
    'operator': Activity,
};

export default function StaffManagementPage() {
    usePageTitle("Personnel Governance", "Define and manage personnel roles and system access permissions.");
    const [staff, setStaff] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchStaff = async () => {
        try {
            const jwt = typeof window !== "undefined" ? localStorage.getItem("nodl_jwt") : null;
            const res = await fetch('/api/v1/institutional/operators', {
                headers: { 'Authorization': `Bearer ${jwt}` }
            });
            if (res.ok) {
                const data = await res.json();
                // Filter for staff roles (any role that isn't 'standard')
                const staffMembers = data.filter((n: any) => n.role !== 'standard');
                setStaff(staffMembers);
            }
        } catch (err) {
            console.error("Failed to fetch personnel:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStaff();
    }, []);

    const handleFreeze = async (id: string, isFrozen: boolean) => {
        try {
            const jwt = typeof window !== "undefined" ? localStorage.getItem("nodl_jwt") : null;
            const res = await fetch(`/api/v1/admin/accounts/${isFrozen ? 'unfreeze' : 'freeze'}`, {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${jwt}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id })
            });
            if (res.ok) fetchStaff();
        } catch (err) {
            console.error("Failed to update freeze status:", err);
        }
    };

    const handleActivate = async (id: string) => {
        try {
            const jwt = typeof window !== "undefined" ? localStorage.getItem("nodl_jwt") : null;
            const res = await fetch('/api/v1/affiliates/genesis/activate', {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${jwt}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id })
            });
            if (res.ok) fetchStaff();
        } catch (err) {
            console.error("Failed to activate account:", err);
        }
    };

    const filteredStaff = staff.filter(member => 
        (member.email?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (member.role?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (member.operatorId?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <main className="flex-1 p-10 overflow-y-auto pb-24 space-y-10">
                    <div className="flex justify-between items-center pb-10 border-b border-white/5">
                        <div className="flex items-center gap-3">
                            <Shield className="w-5 h-5 text-[#22D3EE]" />
                            <h2 className="text-[14px] font-normal text-slate-300 uppercase tracking-widest">Active Personnel Directory</h2>
                        </div>
                        <button className="bg-[#22D3EE] hover:bg-[#22D3EE]/80 text-black px-8 py-3 rounded-[5px] text-[12px] font-normal flex items-center gap-2 transition-all uppercase tracking-widest">
                            <UserPlus className="w-4 h-4" /> Provision New Staff
                        </button>
                    </div>

                    <div className="card-sovereign p-6 flex flex-col md:flex-row gap-4 items-center">
                        <div className="relative flex-1 group w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-[#22D3EE] transition-colors" />
                            <input 
                                type="text" 
                                placeholder="Search by name, identity, or role..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-[5px] pl-12 pr-4 py-3 text-[14px] font-normal text-white focus:outline-none focus:border-[#22D3EE]/30 transition-all placeholder:text-slate-700"
                            />
                        </div>
                        <button className="px-5 py-3 bg-white/[0.04] border border-white/10 rounded-[5px] text-[14px] font-normal text-slate-400 hover:text-white transition-all flex items-center gap-2">
                            <Filter className="w-4 h-4 text-slate-600" /> Filter Roles
                        </button>
                    </div>

                    <div className="card-sovereign overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-white/[0.04] text-[12px] text-slate-400 uppercase-none border-b border-white/10">
                                    <tr>
                                        <th className="px-8 py-5 font-normal">Operator</th>
                                        <th className="px-6 py-5 font-normal">Role / Designation</th>
                                        <th className="px-6 py-5 font-normal">Status</th>
                                        <th className="px-8 py-5 font-normal text-left">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="text-[14px] text-slate-300 divide-y divide-white/5">
                                    {loading ? (
                                        <tr><td colSpan={4} className="px-8 py-12 text-center text-slate-500">Retrieving personnel security records...</td></tr>
                                    ) : filteredStaff.map((member) => {
                                        const Icon = ROLE_ICONS[member.role] || Users;
                                        return (
                                            <tr key={member.operatorId} className="hover:bg-white/[0.02] transition-colors group">
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-[5px] bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 group-hover:border-[#22D3EE]/30 transition-colors">
                                                            {member.email.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-[14px] font-normal text-white">{member.email}</span>
                                                            <span className="text-[12px] font-normal text-slate-600 font-mono tracking-tighter">{member.operatorId}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6">
                                                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-[5px] border text-[12px] font-normal ${ROLE_COLORS[member.role] || ROLE_COLORS['Visitor']}`}>
                                                        <Icon className="w-3.5 h-3.5" />
                                                        {member.role.replace('_', ' ').toUpperCase()}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-1.5 h-1.5 rounded-full ${member.status === 'active' ? 'bg-[#22D3EE] shadow-[0_0_8px_rgba(34,211,238,0.5)]' : 'bg-slate-700'}`} />
                                                        <span className="text-[14px] font-normal text-slate-500">{member.status.toUpperCase()}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-left">
                                                    <div className="flex items-center gap-2">
                                                        {member.isFounder && member.status === 'dormant' && (
                                                            <button 
                                                                onClick={() => handleActivate(member.operatorId)}
                                                                className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] rounded-[3px] hover:bg-emerald-500/20 transition-all uppercase tracking-wider"
                                                            >
                                                                Activate
                                                            </button>
                                                        )}
                                                        <button 
                                                            onClick={() => handleFreeze(member.operatorId, member.isFrozen)}
                                                            className={`px-3 py-1 border text-[11px] rounded-[3px] transition-all uppercase tracking-wider ${
                                                                member.isFrozen 
                                                                ? 'bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500/20' 
                                                                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                                                            }`}
                                                        >
                                                            {member.isFrozen ? 'Unfreeze' : 'Freeze'}
                                                        </button>
                                                        <button className="p-1.5 text-slate-700 hover:text-white transition-all">
                                                            <MoreVertical className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 pt-10 text-[12px] font-normal text-slate-700">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 opacity-50" />
                            RBAC Policy: Active
                        </div>
                    </div>
                </main>
        </>
    );
}
