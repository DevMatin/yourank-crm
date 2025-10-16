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
    config.plugins = config.plugins || [];
    
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
      config.cache = false; // Deaktiviere Cache um Windows-Probleme zu vermeiden
    }
    
    
    return config;
  },
}

module.exports = nextConfig
