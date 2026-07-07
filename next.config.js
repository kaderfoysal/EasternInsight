/** @type {import('next').NextConfig} */
const nextConfig = {
  // ── Image optimization ──
  images: {
    domains: ['localhost', 'res.cloudinary.com', 'img.youtube.com'],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 3600, // 1 hour
    // unoptimized: false — let Next.js optimize images
  },

  // ── HTTP compression ──
  compress: true,

  // ── Build output tracing (faster cold starts) ──
  output: 'standalone',

  // ── Turbopack for dev (much faster HMR) ──
  experimental: {
    // turbo: {}, // Uncomment if using Next.js 14.2+
  },

  // ── Static page cache headers ──
  async headers() {
    return [
      {
        source: '/api/categories',
        headers: [{ key: 'Cache-Control', value: 'public, s-maxage=120, stale-while-revalidate=300' }],
      },
      // Let Next.js handle static asset caching automatically
      // Vercel Cache Force Update: 1
    ];
  },

  env: {
    MONGODB_URI: process.env.MONGODB_URI,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
}

module.exports = nextConfig
