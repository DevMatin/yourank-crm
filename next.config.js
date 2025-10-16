/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  serverExternalPackages: ['@supabase/ssr', '@supabase/supabase-js'],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
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
        timers: false,
        console: false,
        vm: false,
        punycode: false,
      };
      
      config.resolve.alias = {
        ...config.resolve.alias,
        'require': false,
        'module': false,
        'exports': false,
        'global': 'globalThis',
      };

      // Ignore problematic modules that cause issues in browser environment
      const webpack = require('webpack');
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /^ws$/,
        })
      );
    }
    return config;
  },
}

module.exports = nextConfig