import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'club-mareva.s3.eu-west-2.amazonaws.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'clubmarevabeirut.com',
        pathname: '/wp-content/uploads/**',
      },
    ],
  },
};

export default nextConfig;
