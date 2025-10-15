/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  serverExternalPackages: ['@supabase/ssr', '@supabase/supabase-js'],
  // Deaktiviere Build-Tracing für Vercel-Kompatibilität
  output: 'standalone',
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
