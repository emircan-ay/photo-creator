import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ywiqdzgohtebauynhbrr.supabase.co",
      },
      {
        protocol: "https",
        hostname: "replicate.delivery",
      },
      {
        protocol: "https",
        hostname: "*.replicate.delivery",
      },
    ],
  },
  // Higher level package-lock.json issues
  experimental: {
    turbo: {
      root: __dirname,
    }
  } as any,
};

export default nextConfig;
