/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_BATTLENET_KEY: process.env.API_BATTLENET_KEY,
    API_BATTLENET_SECRET: process.env.API_BATTLENET_SECRET,
  },
}

module.exports = nextConfig