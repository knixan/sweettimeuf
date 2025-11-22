import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.sweettime-uf.se",
      },
      {
        protocol: "https",
        hostname: "www.karamello.com",
      },
    ],
  },
};

export default nextConfig;
