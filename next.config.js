/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "static.qobuz.com",
      },
    ],
  },
};

module.exports = nextConfig;
