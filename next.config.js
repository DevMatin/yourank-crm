/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  serverExternalPackages: ['@supabase/ssr'],
  // Stelle sicher, dass alle Seiten korrekt generiert werden
  output: 'standalone',
  // Optimiere Cache-Performance
  experimental: {
    // Entfernt cacheMaxMemorySize da es in Next.js 15 nicht mehr unterstützt wird
    serverComponentsExternalPackages: ['@supabase/supabase-js'],
  },
  webpack: (config, { isServer, dev }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    // Optimiere Webpack Cache für bessere Performance
    if (dev) {
      config.cache = {
        type: 'filesystem',
        buildDependencies: {
          config: [__filename],
        },
        // Reduziere Cache-Größe und verbessere Serialisierung
        maxMemoryGenerations: 1,
        memoryCacheUnaffected: true,
      };
    }
    
    return config;
  },
}

module.exports = nextConfig
