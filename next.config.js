/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  experimental: {
    serverActions: true,
  },
  allowedDevHosts: ['dev.envivoministerioelrenuevo.org'],
};

module.exports = nextConfig;
