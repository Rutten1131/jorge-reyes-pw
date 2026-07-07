import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000'],
      bodySizeLimit: '50mb',
    },
  },
  turbopack: {
    resolveAlias: {},
  },
  images: {
    remotePatterns: [],
    // Allow unoptimized images for blob-served content
    unoptimized: true,
  },
};

export default nextConfig;
