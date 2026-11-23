import sizes from '@/content/image-sizes.json';
import { asset } from '@/lib/paths';
import type { Img as ImgT } from '@/content/site';

const S = sizes as unknown as Record<string, [number, number]>;

/** Responsive WebP with an 800px variant; width/height set to prevent layout shift. */
export function Img({ img, className = '', sizes: sz = '100vw', priority = false, fit = 'cover', position }: {
  img: ImgT; className?: string; sizes?: string; priority?: boolean; fit?: 'cover' | 'contain'; position?: string;
}) {
  const [w, h] = S[img.src] ?? [img.w, img.h];
  const full = asset(`/img/${img.src}.webp`);
  const hasSmall = w > 900;
  return (
    <img
      src={full}
      srcSet={hasSmall ? `${asset(`/img/${img.src}-800.webp`)} 800w, ${full} ${w}w` : undefined}
      sizes={hasSmall ? sz : undefined}
      width={w}
      height={h}
      alt={img.alt}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
      className={className}
      style={{ objectFit: fit, objectPosition: position }}
    />
  );
}
