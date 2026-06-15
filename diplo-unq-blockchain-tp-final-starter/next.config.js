/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    // RainbowKit / wagmi / WalletConnect: optional deps that break CI if unresolved
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    config.resolve.alias = {
      ...config.resolve.alias,
      '@react-native-async-storage/async-storage': false,
    };
    return config;
  },
};

module.exports = nextConfig;
