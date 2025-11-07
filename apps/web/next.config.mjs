/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  transpilePackages: ["@workspace/ui"],
  outputFileTracingIncludes: {
    "/": ["../../packages/database/generated/client/**/*"],
  },
};

export default nextConfig;
