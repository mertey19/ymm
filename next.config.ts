import type { NextConfig } from 'next';
const config: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    loader: 'custom',
    loaderFile: './src/lib/image-loader.ts',
    deviceSizes: [768, 1080, 1400],
    imageSizes: [480],
  },
  poweredByHeader: false,
  devIndicators: false,
};
export default config;
