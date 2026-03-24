import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#000000",
                foreground: "#ffffff",
                cyber: {
                    cyan: "#00f2ff",
                    violet: "#9d00ff",
                    crimson: "#ff0055",
                },
                obsidian: "#050505",
            },
            fontFamily: {
                sans: ["Roboto", "sans-serif"],
                mono: ["Roboto", "monospace"],
            },
        },
    },
    plugins: [],
};
export default config;
