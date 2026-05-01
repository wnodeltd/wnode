/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    serverExternalPackages: ['onnxruntime-node'],
};

export default nextConfig;
