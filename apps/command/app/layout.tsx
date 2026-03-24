"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import "./globals.css";

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
            <head>
                <style dangerouslySetInnerHTML={{ __html: `
                    * { 
                        font-family: 'Roboto', sans-serif !important; 
                        font-weight: 400 !important; 
                        text-transform: none !important; 
                        letter-spacing: -0.01em !important; 
                    }
                    body { 
                        background-color: #000000 !important; 
                        margin: 0;
                        padding: 0;
                    }
                    .card { 
                        background: rgba(255, 255, 255, 0.08) !important; 
                        border: 1px solid rgba(255, 255, 255, 0.25) !important; 
                        border-radius: 5px !important; 
                    }
                ` }} />
            </head>
            <body data-portal="command" style={{ backgroundColor: 'black', color: 'white', '--command-portal-glow-color': '#22D3EE' } as any}>
                {pathname === "/login" ? children : (isAuthenticated ? children : null)}
            </body>
        </html>
    );
}
