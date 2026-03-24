import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./components/AuthProvider";
import Link from 'next/link';
import { LayoutGrid, Database, Cpu, CreditCard, LogOut, Settings } from 'lucide-react';


const roboto = Roboto({
    subsets: ["latin"],
    weight: ["100", "300", "400", "500", "700", "900"],
    variable: "--font-roboto",
});

export const metadata: Metadata = {
    title: "Nodl Mesh — Compute Marketplace",
    description: "Access high-performance decentralized compute resources.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className="dark">
            <body data-portal="mesh" className={`${roboto.variable} antialiased bg-black text-white min-h-screen font-sans flex`} style={{ "--mesh-portal-glow-color": "#fcba03" } as any}>
                <AuthProvider>
                    {/* Sidebar */}
                    <aside className="fixed inset-y-0 left-0 w-64 bg-[#111111] border-r border-white/10 hidden lg:flex flex-col z-50">
                        <div className="h-20 flex flex-col items-start justify-center px-8 border-b border-white/10 shrink-0 overflow-hidden">
                            <img 
                                src="https://nodl.one/wp-content/uploads/2025/05/nodl-medium.webp" 
                                alt="nodl logo" 
                                className="h-4 w-auto scale-[3] transform origin-left mb-1.5"
                            />
                            <span className="text-13px font-normal tracking-tight text-white uppercase mt-4 w-full text-left">nodl mesh</span>
                        </div>
                        
                        <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
                            {[
                                { name: 'Overview', href: '/dashboard', icon: LayoutGrid },
                                { name: 'Catalog', href: '/catalog', icon: Database },
                                { name: 'Tasks', href: '/tasks', icon: Cpu },
                                { name: 'Billing', href: '/billing', icon: CreditCard },
                                { name: 'Settings', href: '/settings', icon: Settings },
                            ].map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="flex items-center gap-3.5 px-6 py-3 text-sm font-normal text-slate-400 hover:text-white hover:bg-white/5 rounded-[5px] transition-all group"
                                >
                                    <item.icon className="w-4 h-4 text-slate-500 group-hover:text-emerald" />
                                    {item.name}
                                </Link>
                            ))}
                        </nav>

                        <div className="p-5 border-t border-white/10 shrink-0">
                            <button className="flex items-center gap-3 px-5 py-2.5 w-full text-slate-500 hover:text-red-500 transition-all text-13px font-normal">
                                <LogOut className="w-4.5 h-4.5" /> Terminate Link
                            </button>
                        </div>
                    </aside>

                    <div className="flex-1 lg:pl-64 flex flex-col min-h-screen relative overflow-y-auto">
                        <header className="h-16 border-b border-white/10 flex items-center justify-between px-8 bg-[#080808]/80 backdrop-blur-md sticky top-0 z-40">
                            <div className="flex items-center gap-2.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald" />
                                <span className="text-small font-normal text-slate-500 uppercase tracking-widest text-13px">Mesh Online</span>
                            </div>
                        </header>
                        <main className="flex-1 p-8">
                            {children}
                        </main>
                    </div>
                </AuthProvider>
            </body>
        </html>
    );
}

