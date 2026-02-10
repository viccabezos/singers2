import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ubsutcsqciieiwswxpml.supabase.co",
        pathname: "/storage/v1/object/public/choir-photos/**",
      },
    ],
  },
};

export default nextConfig;
