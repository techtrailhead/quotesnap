/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ["@napi-rs/canvas"]
  },
  webpack: (config) => {
    config.externals = config.externals || [];
    config.externals.push(/@napi-rs\/canvas.*/);
    return config;
  }
};

export default nextConfig;
