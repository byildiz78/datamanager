/** @type {import('next').NextConfig} */
const nextConfig = {
    basePath: process.env.NEXT_PUBLIC_BASEPATH,
    assetPrefix: process.env.NEXT_PUBLIC_BASEPATH,
    reactStrictMode: false,
    i18n: {
     locales: ['en', 'tr'],
     defaultLocale: 'tr',
    },
    output: 'standalone',
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    experimental: {
        optimizeCss: false, // Disable CSS optimization temporarily
    },
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production',
    },
    onDemandEntries: {
        maxInactiveAge: 25 * 1000,
        pagesBufferLength: 2,
    },
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'Content-Security-Policy',
                        value: "default-src 'self'; frame-src 'self' http: https: http://*.robotpos.com:* https://*.robotpos.com:* http://34.118.22.138:* https://34.118.22.138:*; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
                    },
                    {
                        key: 'Access-Control-Allow-Origin',
                        value: '*'
                    },
                    {
                        key: 'Upgrade-Insecure-Requests',
                        value: '1'
                    }
                ],
            },
        ]
    },
    async rewrites() {
        return [
            {
                source: '/superset/:path*',
                destination: 'http://34.118.22.138:8088/:path*'
            }
        ]
    },
};

export default nextConfig;