/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: false,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'hebbkx1anhila5yf.public.blob.vercel-storage.com',
        port: '',
        pathname: '/**',
      },
      // Allow common news image domains
      {
        protocol: 'https',
        hostname: '*.cnn.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.bbc.co.uk',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.reuters.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.apnews.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.npr.org',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.washingtonpost.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.nytimes.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.wsj.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.axios.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.marketwatch.com',
        port: '',
        pathname: '/**',
      },
      // Catch-all for other news domains
      {
        protocol: 'https',
        hostname: '**',
        port: '',
        pathname: '/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
}

export default nextConfig
