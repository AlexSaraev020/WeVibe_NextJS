/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
        port: '',
        pathname: "/**",
      },
    ],
  },
  async headers() {
    const url = process.env.NEXT_PUBLIC_API_URL;
    // no origin configured: send no CORS headers at all, rather than "*" plus credentials,
    // which browsers reject anyway
    if (!url) return [];
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: url,
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, DELETE, OPTIONS, PATCH",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
          {
            key: "Access-Control-Allow-Credentials",
            value: "true",
          },
        ],
      },
    ];
  },
  compress: false,
};

export default nextConfig;
