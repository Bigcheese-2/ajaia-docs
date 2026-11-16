import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // File import accepts up to 2 MB (IMPORT_MAX_BYTES); leave headroom for multipart overhead.
    serverActions: { bodySizeLimit: "3mb" },
  },
};

export default nextConfig;
