import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io', // <--- THIS IS THE KEY LINE
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // Optional: Keep if you use Unsplash placeholders
      },
    ],
  },
};

export default nextConfig;