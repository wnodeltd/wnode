"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    X, User, Mail, Phone, MapPin, Building2, 
    Calendar, FileText, Pin, PinOff, Plus, 
    ArrowRight, Activity, Users, Shield, Zap, Send
} from "lucide-react";
import { CrmPerson, CrmEvent, CrmNote } from "../types";

interface CrmDetailPanelProps {
    isOpen: boolean;
    onClose: () => void;
    person: CrmPerson | null;
    onUpdate: (updated: CrmPerson) => void;
}

export default function CrmDetailPanel({ isOpen, onClose, person, onUpdate }: CrmDetailPanelProps) {
    const [editingField, setEditingField] = useState<string | null>(null);
    const [editValue, setEditValue] = useState("");
    const [isAddingNote, setIsAddingNote] = useState(false);
    const [newNoteContent, setNewNoteContent] = useState("");

    if (!person && !isOpen) return null;

    const handleSaveField = (field: keyof CrmPerson) => {
        if (person) {
            onUpdate({ ...person, [field]: editValue });
        }
        setEditingField(null);
    };

    const startEditing = (field: keyof CrmPerson, value: string) => {
        setEditingField(field);
        setEditValue(value || "");
    };

    const handleAddNote = () => {
        if (!person || !newNoteContent.trim()) return;

        const newNote: CrmNote = {
            id: `note-${Date.now()}`,
            author: "System Admin", // Default for now
            date: new Date().toISOString(),
            content: newNoteContent.trim()
        };

        onUpdate({
            ...person,
            notes: [newNote, ...person.notes]
        });

        setNewNoteContent("");
        setIsAddingNote(false);
    };

    const togglePin = (noteId: string) => {
        if (!person) return;
        onUpdate({
            ...person,
            notes: person.notes.map(n => 
                n.id === noteId ? { ...n, pinned: !(n as any).pinned } : n
            )
        });
    };

    const lastContact = person?.events && person.events.length > 0 
        ? new Date(person.events[0].date).toLocaleDateString() 
        : "—";

    return (
        <>
            <div 
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            <div className={`fixed top-0 right-0 h-full w-[500px] bg-[#0A0A0A] border-l border-white/10 z-[100] shadow-[0_0_50px_rgba(0,0,0,0.8)] transition-transform duration-500 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-8 space-y-10 h-full overflow-y-auto custom-scrollbar">
                    {/* Header Top */}
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h2 className="text-[14px] font-bold text-white uppercase tracking-widest">CRM Entity Detail</h2>
                            <p className="text-[10px] text-[#22D3EE] font-mono tracking-tighter">Unified Identity Record</p>
                        </div>
                        <button 
                            onClick={onClose}
                            className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-500 hover:text-white"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {person && (
                        <div className="space-y-10">
                            {/* Profile Header */}
                            <header className="space-y-6">
                                <div className="flex items-start gap-6">
                                    <div className="w-16 h-16 rounded-[12px] bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                        <User className="w-8 h-8 text-slate-400" />
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <h3 className="text-2xl font-medium text-white">{person.name}</h3>
                                            <div className="flex items-center gap-1.5">
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
                                        <p className="text-[13px] font-mono text-[#22D3EE]">{person.wuid}</p>
                                        <div className="flex items-center gap-2 text-slate-500">
                                            <Mail className="w-3.5 h-3.5" />
                                            <span className="text-[12px] font-mono">{person.email || "—"}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button 
                                        onClick={() => setIsAddingNote(true)}
                                        className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-[5px] py-2.5 text-[11px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                                    >
                                        <FileText className="w-3.5 h-3.5 text-[#22D3EE]" /> Add Note
                                    </button>
                                </div>
                            </header>

                            {/* Summary Strip (Refined Phase 2.1) */}
                            <section className="grid grid-cols-3 gap-2 border-y border-white/5 py-8">
                                {[
                                    { label: "Last Contact", value: lastContact },
                                    { label: "L1 Net", value: person.l1Affiliates },
                                    { label: "L2 Net", value: person.l2Affiliates },
                                ].map((s, i) => (
                                    <div key={i} className="text-center space-y-2">
                                        <span className="text-[11px] text-white uppercase font-bold tracking-widest block">{s.label}</span>
                                        <span className="text-[16px] font-mono text-white block">{s.value}</span>
                                    </div>
                                ))}
                            </section>

                            {/* Personal Details Section */}
                            <section className="space-y-4">
                                <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                                    <User className="w-4 h-4 text-slate-500" />
                                    <h4 className="text-[11px] font-bold text-slate-300 uppercase tracking-widest">Personal Details</h4>
                                </div>
                                <div className="bg-black/40 border border-white/5 rounded-[5px] divide-y divide-white/5 overflow-hidden">
                                    <EditableField 
                                        label="Email" 
                                        value={person.email} 
                                        isEditing={editingField === 'email'}
                                        onEdit={() => startEditing('email', person.email || "")}
                                        onSave={() => handleSaveField('email')}
                                        onChange={setEditValue}
                                        mono
                                    />
                                    <EditableField 
                                        label="Address" 
                                        value={person.address} 
                                        isEditing={editingField === 'address'}
                                        onEdit={() => startEditing('address', person.address || "")}
                                        onSave={() => handleSaveField('address')}
                                        onChange={setEditValue}
                                        placeholder="Add address..."
                                    />
                                    <EditableField 
                                        label="Phone 1" 
                                        value={person.phone1} 
                                        isEditing={editingField === 'phone1'}
                                        onEdit={() => startEditing('phone1', person.phone1 || "")}
                                        onSave={() => handleSaveField('phone1')}
                                        onChange={setEditValue}
                                        placeholder="Add phone..."
                                        mono
                                    />
                                    <EditableField 
                                        label="Phone 2" 
                                        value={person.phone2} 
                                        isEditing={editingField === 'phone2'}
                                        onEdit={() => startEditing('phone2', person.phone2 || "")}
                                        onSave={() => handleSaveField('phone2')}
                                        onChange={setEditValue}
                                        placeholder="Add backup phone..."
                                        mono
                                    />
                                    <EditableField 
                                        label="Affiliate Referrer" 
                                        value={person.affiliateReferrer} 
                                        isEditing={editingField === 'affiliateReferrer'}
                                        onEdit={() => startEditing('affiliateReferrer', person.affiliateReferrer || "")}
                                        onSave={() => handleSaveField('affiliateReferrer')}
                                        onChange={setEditValue}
                                        placeholder="None"
                                    />
                                    <EditableField 
                                        label="Organization" 
                                        value={person.org} 
                                        isEditing={editingField === 'org'}
                                        onEdit={() => startEditing('org', person.org || "")}
                                        onSave={() => handleSaveField('org')}
                                        onChange={setEditValue}
                                        placeholder="Add organization..."
                                    />
                                </div>
                            </section>

                            {/* Notes Section */}
                            <section className="space-y-4">
                                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                                    <div className="flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-slate-500" />
                                        <h4 className="text-[11px] font-bold text-slate-300 uppercase tracking-widest">Notes</h4>
                                    </div>
                                    <button 
                                        onClick={() => setIsAddingNote(true)}
                                        className="text-[9px] text-[#22D3EE] uppercase font-bold tracking-widest hover:brightness-110 transition-all flex items-center gap-1"
                                    >
                                        <Plus className="w-3 h-3" /> Add Note
                                    </button>
                                </div>

                                <AnimatePresence>
                                    {isAddingNote && (
                                        <motion.div 
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="space-y-3 overflow-hidden"
                                        >
                                            <textarea 
                                                autoFocus
                                                value={newNoteContent}
                                                onChange={(e) => setNewNoteContent(e.target.value)}
                                                placeholder="Enter internal CRM note..."
                                                className="w-full h-24 bg-white/5 border border-[#22D3EE]/30 rounded-[5px] p-3 text-[13px] text-white focus:outline-none focus:border-[#22D3EE] transition-all resize-none"
                                            />
                                            <div className="flex justify-end gap-2 pb-2">
                                                <button 
                                                    onClick={() => setIsAddingNote(false)}
                                                    className="px-3 py-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:text-white transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                                <button 
                                                    onClick={handleAddNote}
                                                    className="px-4 py-1.5 bg-[#22D3EE]/10 border border-[#22D3EE]/30 rounded-[3px] text-[10px] font-bold text-[#22D3EE] uppercase tracking-widest hover:bg-[#22D3EE]/20 transition-all flex items-center gap-2"
                                                >
                                                    <Send className="w-3 h-3" /> Save Note
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="space-y-2">
                                    {person.notes.length > 0 ? (
                                        person.notes.map((n) => (
                                            <div key={n.id} className="p-4 bg-white/[0.02] border border-white/5 rounded-[5px] space-y-3 group cursor-pointer hover:bg-white/[0.04] transition-all">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 rounded-full bg-[#22D3EE]/10 flex items-center justify-center text-[10px] font-bold text-[#22D3EE]">
                                                            {n.author.charAt(0)}
                                                        </div>
                                                        <span className="text-[11px] text-white font-medium">{n.author}</span>
                                                        <span className="text-[10px] text-slate-600 font-mono">{new Date(n.date).toLocaleDateString()}</span>
                                                    </div>
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); togglePin(n.id); }}
                                                        className="text-slate-600 hover:text-[#22D3EE] transition-colors"
                                                    >
                                                        {(n as any).pinned ? <Pin className="w-3.5 h-3.5 text-[#22D3EE]" /> : <PinOff className="w-3.5 h-3.5" />}
                                                    </button>
                                                </div>
                                                <p className="text-[13px] text-slate-400 leading-relaxed">{n.content}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-center py-6 text-[11px] text-slate-600 uppercase tracking-widest">No notes recorded.</p>
                                    )}
                                </div>
                            </section>

                            {/* Cross-Links Section */}
                            <section className="space-y-4">
                                <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                                    <Zap className="w-4 h-4 text-[#22D3EE]" />
                                    <h4 className="text-[11px] font-bold text-slate-300 uppercase tracking-widest">Cross-Links</h4>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <button className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-white uppercase tracking-widest hover:bg-white/10 transition-all">
                                        <Users className="w-3 h-3 text-[#22D3EE]" /> View Affiliates
                                    </button>
                                    <button className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-white uppercase tracking-widest hover:bg-white/10 transition-all">
                                        <Activity className="w-3 h-3 text-green-400" /> Active Nodes
                                    </button>
                                </div>
                            </section>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

function EditableField({ 
    label, value, isEditing, onEdit, onSave, onChange, placeholder = "—", mono 
}: { 
    label: string, value?: string, isEditing: boolean, onEdit: () => void, onSave: () => void, onChange: (v: string) => void, placeholder?: string, mono?: boolean 
}) {
    return (
        <div className="p-4 flex justify-between items-center hover:bg-white/[0.02] transition-all group">
            <span className="text-[12px] text-slate-500 font-normal">{label}</span>
            <div className="flex-1 flex justify-end items-center gap-3">
                {isEditing ? (
                    <div className="flex items-center gap-2 w-full max-w-[250px]">
                        <input 
                            autoFocus
                            type="text" 
                            value={value} 
                            onChange={(e) => onChange(e.target.value)}
                            onBlur={onSave}
                            onKeyDown={(e) => e.key === 'Enter' && onSave()}
                            className="w-full bg-white/5 border border-[#22D3EE]/30 rounded px-2 py-1 text-[13px] text-white focus:outline-none focus:border-[#22D3EE] transition-all"
                        />
                        <button onClick={onSave} className="text-[#22D3EE] text-[10px] font-bold uppercase">Save</button>
                    </div>
                ) : (
                    <div 
                        onClick={onEdit}
                        className={`text-[13px] ${value ? 'text-white' : 'text-slate-600 italic'} cursor-pointer hover:text-[#22D3EE] transition-colors ${mono ? 'font-mono' : ''} text-right truncate max-w-[200px]`}
                    >
                        {value || placeholder}
                    </div>
                )}
            </div>
        </div>
    );
}
