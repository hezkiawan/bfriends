import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "avatar.vercel.sh",
        port: "",
      },
      {
        hostname: "u3ttlknavg.ufs.sh",
        port: "",
      },
    ],
  },
};

export default nextConfig;
