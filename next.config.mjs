/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
            protocol: 'https',
            hostname: 'cdn.builder.io',
            port: '',
            pathname: '/api/v1/image/**',
            },
            {
                protocol: 'https',
                hostname: 'example.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'static.ybox.vn',
                port: '',
                pathname: '/**',
            },
        ],
      },
};

export default nextConfig;