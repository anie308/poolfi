/** @type {import('next').NextConfig} */
const nextConfig = {
  // App Router is now stable in Next.js 14, no experimental flag needed
  output: 'standalone', // Enable for production deployment
  poweredByHeader: false,
  compress: true,
  generateEtags: true,
  
  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Headers for security
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
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
  
  webpack: (config, { isServer, dev }) => {
    // Add fallback for React Native modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      '@react-native-async-storage/async-storage': false,
    }
    
    // Add alias to prevent async storage imports
    config.resolve.alias = {
      ...config.resolve.alias,
      '@react-native-async-storage/async-storage': false,
    }

    // Handle pino-pretty warning
    config.resolve.alias = {
      ...config.resolve.alias,
      'pino-pretty': false,
    }
    
    // Simplified webpack config for development
    // Remove complex chunk splitting that can cause loading issues
    if (dev) {
      config.optimization.splitChunks = false
    }
    
    return config
  },
}

module.exports = nextConfig
