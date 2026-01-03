import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  output: "standalone",
  compiler: {
    // Remove all console logs, excluding error logs
    removeConsole:
      process.env.NODE_ENV === "production" ? { exclude: ["error"] } : false,
  },
  reactStrictMode: true,
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
