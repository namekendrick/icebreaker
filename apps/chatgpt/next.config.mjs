import { baseURL } from "./baseUrl.js";

/** @type {import('next').NextConfig} */
const nextConfig = {
  assetPrefix: baseURL,
  devIndicators: false,
  transpilePackages: ["@workspace/ui"],
  outputFileTracingIncludes: {
    "/": ["../../packages/database/generated/client/**/*"],
  },
};

export default nextConfig;
