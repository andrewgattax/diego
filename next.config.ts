import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-xxxx.r2.dev", // sostituisci con il tuo dominio R2
      },
    ],
  },
  reactCompiler: true,
};

export default nextConfig;
