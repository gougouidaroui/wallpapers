import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    images: {
        domains: ['utfs.io'],
        remotePatterns: [
            {
                protocol: "https",
                hostname: "utfs.io",
                port: "",
                pathname: "/a/y0s1o6y4oe/**",
            },
        ],
    }
};

export default nextConfig;
