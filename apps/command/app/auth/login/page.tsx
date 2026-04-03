"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch("http://127.0.0.1:8080/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Invalid credentials");
            }

            localStorage.setItem("nodl_jwt", data.token);
            localStorage.setItem("nodl_user", JSON.stringify(data.user));

            router.push("/");
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
            <form onSubmit={handleLogin} className="space-y-4 w-80">
                <h1 className="text-xl font-bold">Command Login</h1>

                <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-2 bg-gray-900 border border-gray-700 rounded"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="w-full p-2 bg-gray-900 border border-gray-700 rounded"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                {error && <p className="text-red-400 text-sm">{error}</p>}

                <button
                    type="submit"
                    className="w-full bg-cyan-500 py-2 rounded font-semibold"
                >
                    Login
                </button>
            </form>
        </div>
    );
}
