import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  poweredByHeader: false,
  compress: true,
  images: {
    unoptimized: true, // Required for static export
  }
};

export default nextConfig;
