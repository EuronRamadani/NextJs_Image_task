import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['images.unsplash.com', 'oaidalleapiprodscus.blob.core.windows.net'],
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
