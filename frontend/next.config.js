/** @type {import('next').NextConfig} */

module.exports = {
  images: {
    domains: ["i.scdn.co"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/category",
        destination: "/",
        permanent: true,
      },
    ];
  },
};
