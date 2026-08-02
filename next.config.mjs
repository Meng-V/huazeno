/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    // Everything is bundled in public/media, so the optimiser only ever sees
    // local files. Keep formats modest so the ECS box is not doing heavy work.
    formats: ['image/webp'],
  },
};

export default nextConfig;
