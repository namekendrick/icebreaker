export const baseURL =
  process.env.NODE_ENV == "development"
    ? process.env.NEXT_PUBLIC_DEV_URL || "http://localhost:3001"
    : "https://" +
      (process.env.VERCEL_ENV === "production"
        ? process.env.VERCEL_PROJECT_PRODUCTION_URL
        : process.env.VERCEL_BRANCH_URL || process.env.VERCEL_URL);
