/** @type {import('next').NextConfig} */

module.exports = {
  images: {
    unoptimized: false,
    domains: ["i.scdn.co"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      }
    ],
  },
};
