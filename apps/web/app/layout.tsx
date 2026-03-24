import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--" });

export const metadata: Metadata = {
    title: "Nodl — Harvesting the Idle",
    description: "A global, decentralized compute marketplace designed to democratize access to processing power.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className="dark scroll-smooth">
            <body data-portal="web" className={`${inter.variable} ${jetbrainsMono.variable} antialiased bg-obsidian text-slate-300`} style={{ "--web-portal-glow-color": "#00f2ff" } as any}>
                {children}
            </body>
        </html>
    );
}
