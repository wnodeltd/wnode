/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    experimental: {
        // Correct key for Next.js 15 to allow dev origins
        allowedOrigins: ['127.0.0.1', 'localhost'],
    },
};

export default nextConfig;
