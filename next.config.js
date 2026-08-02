/** @type {import('next').NextConfig} */
const path = require('path')
const nextConfig = {
  experimental: {
    useTypeScriptCli: true,
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
  reactStrictMode: true,
  output: 'standalone',
}

module.exports = nextConfig;
