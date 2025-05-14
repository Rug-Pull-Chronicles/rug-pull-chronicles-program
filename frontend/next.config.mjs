/* @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "madlads.s3.us-west-2.amazonaws.com",
        pathname: "/images/**",
      },
    ],
  },
};

export default nextConfig;
