/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  distDir: '.next',
  future: {
    webpack5: true,
  },
  concurrentBuild: true,
}

module.exports = nextConfig
