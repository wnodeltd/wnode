"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Cpu, Users, Settings, LogOut, Upload, DollarSign } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

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
    const [avatar, setAvatar] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handlePhotoClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    useEffect(() => {
        const loadAvatar = async () => {
            try {
                const res = await fetch('/api/avatar');
                const data = await res.json();
                if (data?.avatar) setAvatar(data.avatar);
            } catch (e) {}
        };
        loadAvatar();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const tempReader = new FileReader();
            tempReader.onloadend = (event) => {
                const img = new window.Image();
                img.onload = async () => {
                    // Auto-compress any massive photo down to a 500px avatar
                    const MAX_SIZE = 500;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_SIZE) {
                            height *= MAX_SIZE / width;
                            width = MAX_SIZE;
                        }
                    } else {
                        if (height > MAX_SIZE) {
                            width *= MAX_SIZE / height;
                            height = MAX_SIZE;
                        }
                    }

                    const canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, width, height);

                    // Compress to lightweight JPEG (80% quality)
                    const base64 = canvas.toDataURL('image/jpeg', 0.8);
                    setAvatar(base64);

                    try {
                        await fetch('/api/avatar', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ avatar: base64 })
                        });
                    } catch (e) {}
                };
                img.src = event.target?.result as string;
            };
            tempReader.readAsDataURL(file);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans flex">
            {/* Sidebar */}
            <aside className="fixed inset-y-0 left-0 w-64 bg-[#080808] border-r border-white/10 hidden lg:flex flex-col z-50">
                <div className="h-20 flex flex-col items-start justify-center px-8 border-b border-white/10 shrink-0">
                    <img 
                        src="https://nodl.one/wp-content/uploads/2025/05/nodl-medium.webp" 
                        alt="nodl logo" 
                        className="h-8 w-auto mb-1"
                    />
                    <span className="text-[10px] font-bold tracking-[0.2em] text-white font-sans">Dashboard</span>
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
                        <LogOut className="w-4.5 h-4.5" /> Terminate Link
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 lg:pl-64 flex flex-col min-h-screen relative overflow-y-auto">
                {/* Internal Top Bar */}
                <header className="h-16 border-b border-white/10 flex items-center justify-between px-8 bg-[#080808]/80 backdrop-blur-md sticky top-0 z-40">
                    <div className="flex items-center gap-2.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        <span className="text-[10px] font-bold text-white tracking-[0.2em]">Network Online</span>
                    </div>


                    <div className="flex items-center gap-5">
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleFileChange} 
                            accept="image/*" 
                            className="hidden" 
                        />
                        <div className="flex flex-col items-end mr-6">
                            <span className="text-16px text-white font-bold tracking-tight font-mono">100001-0426-01-AA</span>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-16px font-bold text-white tracking-tight">Stephen Soos</span>
                            <button 
                                onClick={handlePhotoClick}
                                className="text-[10px] text-cyber-cyan hover:underline font-bold tracking-widest  mt-0.5"
                            >
                                Update Photo
                            </button>
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
            </div>
        </div>
    );
}
