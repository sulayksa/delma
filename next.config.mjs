/** Static export — deployable to GitHub Pages, Cloudflare Pages or any static host.
 *  NEXT_PUBLIC_BASE_PATH: '/delma' on GitHub Pages (sulayksa.github.io/delma), '' on a root domain. */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
export default {
  output: 'export',
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  poweredByHeader: false,
};
