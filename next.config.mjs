/** @type {import('next').NextConfig} */
const nextConfig = {
    reactCompiler: true,
    output: 'standalone',
    compress: true,
    swcMinify: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**.bstatic.com'
            }
        ]
    }
};

export default nextConfig;
