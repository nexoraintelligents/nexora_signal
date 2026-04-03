import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  async redirects() {
    return [
      {
        source: '/dashboard',
        destination: '/seo',
        permanent: false,
      },
    ]
  },
};

export default nextConfig;
