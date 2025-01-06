/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        port: '',
        pathname: "/**", 
      },
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
        port: '',
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
