/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    typescript: {
        ignoreBuildErrors: true,
    },

    webpack: (config) => {
        config.externals.push({
            'onnxruntime-node': 'commonjs onnxruntime-node'
        });
        return config;
    },

    serverExternalPackages: ['onnxruntime-node']
};

export default nextConfig;
