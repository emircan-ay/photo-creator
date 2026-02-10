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
  experimental: {
    // try different structure
  } as any,
  turbopack: {
    root: ".",
  } as any,
};

export default nextConfig;
