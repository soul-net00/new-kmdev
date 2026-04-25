import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    MONGODB_URI: process.env.MONGODB_URI
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "imgbb.com" },
      { protocol: "https", hostname: "i.imgur.com" },
      { protocol: "https", hostname: "ibb.co" },
      { protocol: "https", hostname: "postimg.cc" },
      { protocol: "https", hostname: "cdn.imgbin.com" },
      { protocol: "https", hostname: "**" }
    ]
  }
};

export default nextConfig;
