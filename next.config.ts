import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // App Router is now stable in Next.js 14
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'], // For future database integration
  },
  
  // Image optimization
  images: {
    domains: [
      'avatars.githubusercontent.com', 
      'github.com',
      'easierhub.dev',
      'cdn.easierhub.dev'
    ],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Redirects for better SEO and compatibility
  async redirects() {
    return [
      {
        source: '/pkg/:path*',
        destination: '/packages/:path*',
        permanent: true,
      },
      {
        source: '/package/:path*',
        destination: '/packages/:path*',
        permanent: true,
      },
      {
        source: '/search',
        destination: '/packages',
        permanent: false,
      },
    ]
  },
  
  // Headers for security and performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, stale-while-revalidate=60',
          },
        ],
      },
    ]
  },
  
  // Compression and performance
  compress: true,
  
  // Environment variables for build-time
  env: {
    SITE_NAME: 'EasierHub',
    SITE_URL: process.env.NODE_ENV === 'production' ? 'https://easierhub.dev' : 'http://localhost:3000',
  },
  
  // Webpack configuration for optimizations
  webpack: (config, { isServer }) => {
    // Optimize bundle size
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      }
    }
    
    return config
  },
}

export default nextConfig
