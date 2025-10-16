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
        path: false,
        os: false,
        http: false,
        https: false,
        zlib: false,
        querystring: false,
        url: false,
        assert: false,
        constants: false,
        _stream_duplex: false,
        _stream_passthrough: false,
        _stream_readable: false,
        _stream_transform: false,
        _stream_writable: false,
        timers: false,
        console: false,
        vm: false,
        punycode: false,
      };
    }
    
    // Supabase-spezifische Webpack-Konfiguration für Edge Runtime
    config.resolve.alias = {
      ...config.resolve.alias,
      '@supabase/realtime-js': false,
      '@supabase/supabase-js': false,
    };
    
    // Behebe require() Probleme im Browser
    config.resolve.alias = {
      ...config.resolve.alias,
      'require': false,
    };
    
    // Stelle sicher, dass keine Node.js Module im Browser verwendet werden
    const webpack = require('webpack');
    config.plugins = config.plugins || [];
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
        'global': 'globalThis',
      })
    );
    
    // Externe Module für Edge Runtime
    config.externals = config.externals || [];
    if (Array.isArray(config.externals)) {
      config.externals.push({
        '@supabase/realtime-js': 'commonjs @supabase/realtime-js',
        '@supabase/supabase-js': 'commonjs @supabase/supabase-js',
      });
    }
    
    // Entferne problematische externals Konfiguration
    // Die alias Konfiguration oben sollte ausreichen
    
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
