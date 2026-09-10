import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // Limit build parallelism: this dev machine has very little free RAM,
  // and the default worker-per-CPU pool was exhausting heap during the
  // "Collecting page data" phase. Safe to remove on a beefier machine/CI.
  experimental: {
    cpus: 2,
    workerThreads: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
