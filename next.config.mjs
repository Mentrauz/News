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
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'ichef.bbci.co.uk',
      },
      {
        protocol: 'https',
        hostname: 'www.hindustantimes.com',
      },
      {
        protocol: 'https',
        hostname: 'cloudfront-us-east-1.images.arcpublishing.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.cnn.com',
      },
    ],
    domains: [
      'images.unsplash.com',
      'ichef.bbci.co.uk', // BBC images
      'www.hindustantimes.com', // HT images
      'cloudfront-us-east-1.images.arcpublishing.com', // Reuters
      'cdn.cnn.com', // CNN images
      'dims.apnews.com', // AP News images
      'storage.googleapis.com', // AP News backup
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/rss',
        destination: '/api/rss',
      },
    ];
  },
}

module.exports = nextConfig
