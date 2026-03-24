import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                cyber: {
                    cyan: "#00f2ff",
                    violet: "#9d00ff",
                },
                obsidian: "#050505",
            },
            fontFamily: {
                sans: ["var(--font-inter)"],
                mono: ["var(--font-jetbrains-mono)"],
            },
        },
    },
    plugins: [],
};
export default config;
