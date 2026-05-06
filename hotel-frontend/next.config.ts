import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    allowedDevOrigins: ['192.168.1.10'],
  },
};

export default nextConfig;
