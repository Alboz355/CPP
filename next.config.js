/** @type {import('next').NextConfig} */
const nextConfig = {
  // Mode de fonctionnement
  reactStrictMode: true,
  swcMinify: true,
  
  // Optimisations d'images
  images: {
    domains: [
      's2.coinmarketcap.com',
      'assets.coingecko.com',
      'crypto-wallet.app',
      'www.crypto-wallet.app'
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Optimisations expérimentales
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
    largePageDataBytes: 128 * 1000, // 128KB
  },

  // Compression
  compress: true,

  // PWA Support
  generateEtags: true,

  // Optimisations de build
  productionBrowserSourceMaps: false,
  
  // Headers de sécurité
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
          }
        ]
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, stale-while-revalidate=60'
          }
        ]
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      }
    ]
  },

  // Rewrites pour les PWA shortcuts
  async rewrites() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'query',
            key: 'action',
            value: 'send'
          }
        ],
        destination: '/?page=send'
      },
      {
        source: '/:path*',
        has: [
          {
            type: 'query',
            key: 'action',
            value: 'receive'
          }
        ],
        destination: '/?page=receive'
      },
      {
        source: '/:path*',
        has: [
          {
            type: 'query',
            key: 'action',
            value: 'tpe'
          }
        ],
        destination: '/?page=tpe'
      },
      {
        source: '/:path*',
        has: [
          {
            type: 'query',
            key: 'action',
            value: 'prices'
          }
        ],
        destination: '/?page=prices'
      }
    ]
  },

  // Optimisations webpack
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Optimisations de performance
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          vendor: {
            name: 'vendors',
            chunks: 'all',
            test: /node_modules/,
            enforce: true
          },
          common: {
            name: 'commons',
            minChunks: 2,
            chunks: 'all',
            enforce: true
          }
        }
      }
    }

    // Polyfills pour les cryptomonnaies
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      util: require.resolve('util/'),
      buffer: require.resolve('buffer/'),
      process: require.resolve('process/browser'),
    }

    config.plugins.push(
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
        process: 'process/browser',
      })
    )

    return config
  },

  // Variables d'environnement publiques
  env: {
    CUSTOM_KEY: 'production'
  },

  // Configuration TypeScript stricte
  typescript: {
    ignoreBuildErrors: false,
  },

  // Configuration ESLint stricte
  eslint: {
    ignoreDuringBuilds: false,
  },

  // Optimisations du serveur
  serverRuntimeConfig: {
    // Disponible uniquement côté serveur
  },
  
  publicRuntimeConfig: {
    // Disponible côté client et serveur
    APP_NAME: 'CryptoPay Pro',
    APP_VERSION: '1.0.0'
  }
}

module.exports = nextConfig