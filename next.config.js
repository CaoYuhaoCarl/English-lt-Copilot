/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  assetPrefix: '',
  basePath: '',
  trailingSlash: true,
  webpack: (config) => {
    config.resolve.fallback = { 
      fs: false,
      path: false,
      os: false,
    };
    return config;
  }
};

module.exports = nextConfig;