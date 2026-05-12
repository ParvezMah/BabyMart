import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    images: {
    // unoptimized:true,
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "d2v5dzhdg4zhx3.cloudfront.net" },

    ],
    },
};

export default nextConfig;
