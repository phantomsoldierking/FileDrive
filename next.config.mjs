/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            hostname: "prestigious-walrus-161.convex.cloud",
          },
        ],
      },
};

export default nextConfig;
