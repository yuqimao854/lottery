/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  output: 'export',
  // Optional: Add a trailing slash to all paths `/about` -> `/about/`
  // trailingSlash: true,
  // Optional: Change the output directory `out` -> `dist`
  distDir: 'dist',
  assetPrefix: 'https://yqm854-1300830811.cos-website.ap-chengdu.myqcloud.com',
};

module.exports = nextConfig;
