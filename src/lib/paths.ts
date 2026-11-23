export const BASE = process.env.NEXT_PUBLIC_BASE_PATH || '';
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://sulayksa.github.io/delma').replace(/\/$/, '');
export const asset = (p: string) => `${BASE}${p.startsWith('/') ? p : '/' + p}`;
