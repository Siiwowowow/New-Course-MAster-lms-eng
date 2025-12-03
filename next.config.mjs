/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',       // optional
        pathname: '/**', // allow all paths under this domain
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        port: '',       // optional
        pathname: '/**', // allow all paths under this domain
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        port: '',       // optional
        pathname: '/**', // allow all paths under this domain
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',       // optional
        pathname: '/**', // allow all paths under this domain
      },
    ],
  },
};

export default nextConfig;