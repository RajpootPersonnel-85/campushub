/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 640, 768, 1024, 1280, 1536, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    // Reduce bundle size by optimizing icon package imports
    optimizePackageImports: ["lucide-react"],
  },
  async headers() {
    return [
      {
        source: "/_next/static/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/:all*(svg|jpg|jpeg|png|gif|webp|ico)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        // Cache videos/posters aggressively
        source: "/:all*(mp4|webm)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000" },
        ],
      },
    ]
  },
}

export default nextConfig
