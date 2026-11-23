import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/paths';
export const dynamic = 'force-static';
const pages = ['', 'about/', 'products/', 'products/wpc-doors/', 'products/upvc/', 'products/aluminium-glass/', 'works/', 'catalogue/', 'contact/', 'quote/'];
export default function sitemap(): MetadataRoute.Sitemap {
  return pages.map((p) => ({ url: `${SITE_URL}/${p}`, changeFrequency: 'monthly', priority: p === '' ? 1 : p.startsWith('products') ? 0.8 : 0.6 }));
}
