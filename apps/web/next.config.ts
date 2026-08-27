import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Admin-uploaded product photos are served by the API's local disk
    // storage (apps/api/src/uploads) rather than living in this app's
    // public/ folder, so next/image needs the host explicitly allow-listed.
    //
    // dangerouslyAllowLocalIP: the API is on localhost in dev, which
    // Next 16's image optimizer blocks by default as an SSRF guard. Safe
    // here since it's just this machine talking to itself; in production
    // the API would be a real domain and this flag wouldn't apply.
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "4000",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
