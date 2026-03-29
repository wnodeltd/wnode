"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import "./globals.css";
import { Libp2pProvider } from "./components/Libp2pProvider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Basic Security Gate
        const auth = localStorage.getItem("nodl_auth_session");
        if (!auth && pathname !== "/login") {
            router.push("/login");
        } else if (auth) {
            setIsAuthenticated(true);
        }

        // Session Timeout Logic (30 Minutes)
        let timeout: NodeJS.Timeout;
        const resetTimeout = () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                localStorage.removeItem("nodl_auth_session");
                window.location.href = "/login";
            }, 30 * 60 * 1000); // 30 mins
        };

        window.addEventListener("mousemove", resetTimeout);
        window.addEventListener("keydown", resetTimeout);
        resetTimeout();

        return () => {
            window.removeEventListener("mousemove", resetTimeout);
            window.removeEventListener("keydown", resetTimeout);
            clearTimeout(timeout);
        };
    }, [pathname, router]);

    return (
        <html lang="en">
            <body data-portal="command" style={{ backgroundColor: 'black', color: 'white', '--command-portal-glow-color': '#22D3EE' } as any}>
                <Libp2pProvider>
                    <React.Suspense fallback={<div className="h-screen w-screen bg-black" />}>
                        {pathname === "/login" ? children : (isAuthenticated ? children : null)}
                    </React.Suspense>
                </Libp2pProvider>
            </body>
        </html>
    );
}
