import { baseURL } from "./baseUrl.js";

/** @type {import('next').NextConfig} */
const nextConfig = {
  assetPrefix: baseURL,
  devIndicators: false,
  transpilePackages: ["@workspace/ui"],
};

export default nextConfig;
