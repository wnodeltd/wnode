"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Cpu, Users, Settings, LogOut, Upload, DollarSign, Plus } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAvatar } from '../hooks/useAvatar';
import AddMachineModal from '../components/AddMachineModal';

const navigation = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Machines', href: '/dashboard/hardware', icon: Cpu },
    { name: 'Finances', href: '/dashboard/finances', icon: DollarSign },
    { name: 'Affiliates', href: '/dashboard/affiliates', icon: Users },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];


export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { avatar, uploadAvatar } = useAvatar();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handlePhotoClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                await uploadAvatar(file);
            } catch (e) {
                console.error("Failed to upload avatar:", e);
            }
        }
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans flex">
            {/* Sidebar */}
            <aside className="fixed inset-y-0 left-0 w-64 bg-[#080808] border-r border-white/10 hidden lg:flex flex-col z-50">
                <div className="pt-8 pl-8 mb-6 flex flex-col items-start gap-4 shrink-0">
                    <div className="flex flex-col items-start select-none gap-3">
                        <div className="flex flex-col items-center justify-center w-14">
                            <svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto fill-white drop-shadow-sm">
                                <path d="M 22 110 L 22 50 A 28 28 0 0 1 78 50 L 78 110" fill="none" stroke="white" strokeWidth="26" strokeLinecap="butt" />
                                <circle cx="50" cy="72" r="16" />
                            </svg>
                            <span style={{ fontFamily: "'Roboto', sans-serif", fontSize: "14pt", fontWeight: "bold", color: "white", marginTop: "12px", lineHeight: "1", letterSpacing: "0.02em" }}>wnode</span>
                        </div>
                        <div className="flex flex-col items-start mt-2">
                            <span className="text-[10px] font-normal tracking-[0.4em] text-[#ffff00]">NODLR DASHBOARD</span>
                        </div>
                    </div>
                </div>


                
                <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3.5 px-6 py-3 text-sm font-bold border border-transparent rounded-[5px] transition-all group ${
                                    isActive
                                        ? 'bg-white/5 border-white/10 text-white shadow-sm'
                                        : 'text-white/80 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                <item.icon className={`w-4 h-4 ${isActive ? 'text-cyber-cyan' : 'text-white'}`} />

                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-5 border-t border-white/10 shrink-0">
                    <button className="flex items-center gap-3 px-5 py-2.5 w-full text-white hover:text-red-500 transition-all text-13px font-bold">
                        <LogOut className="w-4.5 h-4.5" /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 lg:pl-64 flex flex-col min-h-screen relative overflow-y-auto">
                {/* Internal Top Bar */}
                <header className="h-16 border-b border-white/10 flex items-center justify-between px-8 bg-[#080808]/80 backdrop-blur-md sticky top-0 z-40">
                    <div className="flex items-center gap-2.5 w-1/3">
                    </div>

                    <div className="flex-1 flex justify-center overflow-visible">
                        <motion.button 
                            whileHover={{ scale: 1.05, backgroundColor: "#ffffff", color: "#9333ea" }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2.5 text-xs uppercase font-black bg-[#9333ea] text-white border border-[#9333ea] px-7 py-3.5 transition-all rounded-[4px] shadow-[0_0_20px_rgba(147,51,234,0.4)] relative -left-32"
                        >
                            <Plus className="w-4 h-4" />
                            Add Node
                        </motion.button>
                    </div>

                    <div className="flex items-center gap-5 w-1/3 justify-end">
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleFileChange} 
                            accept="image/*" 
                            className="hidden" 
                        />
                        <div className="flex flex-col items-end">
                            <span className="text-16px font-bold text-white tracking-tight">Stephen Soos</span>
                            <span className="text-[14.4px] text-blue-400 font-bold tracking-tight font-mono">100001-0426-01-AA</span>
                        </div>


                        <div className="w-9 h-9 rounded-full border border-white/10 overflow-hidden bg-white/5 flex items-center justify-center text-cyber-cyan font-bold text-sm">
                            {avatar ? (
                                <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
                            ) : (
                                "SS"
                            )}
                        </div>
                    </div>

                </header>

                {/* Content */}
                <main className="flex-1 p-8">
                    {children}
                </main>

                <AddMachineModal 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)} 
                    apiBase="http://127.0.0.1:8082" 
                />
            </div>
        </div>
    );
}
