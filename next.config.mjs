/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'traitforge.s3.ap-southeast-2.amazonaws.com',
        pathname: '**',
      },
    ],
  },
  webpack: config => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    return config;
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  async redirects() {
    return [
      {
        source: '/affiliateCode', 
        destination: '/home?ref=affiliateCode',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
