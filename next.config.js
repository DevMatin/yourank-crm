/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  serverExternalPackages: ['@supabase/ssr', '@supabase/supabase-js'],
  webpack: (config, { isServer, dev }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        util: false,
        buffer: false,
        process: false,
      };
    }
    
    // Supabase-spezifische Webpack-Konfiguration für Edge Runtime
    config.resolve.alias = {
      ...config.resolve.alias,
      '@supabase/realtime-js': false,
    };
    
    // Behebe RealtimeClient Konstruktor Probleme - einfachere Lösung
    if (!isServer) {
      config.externals = config.externals || [];
      if (Array.isArray(config.externals)) {
        config.externals.push('@supabase/realtime-js');
      } else {
        config.externals = [config.externals, '@supabase/realtime-js'];
      }
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
