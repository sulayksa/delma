'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Img } from './Img';
import { SplitWords } from './SplitWords';
import type { Img as ImgT } from '@/content/site';

type S = { slug: string; title: string; lead: string };

/**
 * Our fields as an architectural index: large titles, hairlines between them.
 * On desktop a framed photo follows the cursor and tilts with its speed (3D), cross-fading per row.
 * On touch screens each row carries its own photo.
 */
export function ServicesList({ items, images }: { items: S[]; images: ImgT[] }) {
  const wrap = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const w = wrap.current, c = card.current; if (!w || !c) return;
    if (!window.matchMedia('(hover: hover) and (min-width: 1024px)').matches) return;
    let x = 0, y = 0, tx = 0, ty = 0, raf = 0, vx = 0;
    const loop = () => {
      const nx = x + (tx - x) * 0.13, ny = y + (ty - y) * 0.13;
      vx = vx * 0.8 + (nx - x) * 0.2; x = nx; y = ny;
      c.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) perspective(900px) rotateY(${(-vx * 1.4).toFixed(2)}deg) rotateZ(${(vx * 0.25).toFixed(2)}deg)`;
      raf = Math.abs(tx - x) + Math.abs(ty - y) + Math.abs(vx) > 0.2 ? requestAnimationFrame(loop) : 0;
    };
    const onMove = (e: PointerEvent) => { const r = w.getBoundingClientRect(); tx = e.clientX - r.left; ty = e.clientY - r.top; if (!raf) raf = requestAnimationFrame(loop); };
    w.addEventListener('pointermove', onMove);
    return () => { cancelAnimationFrame(raf); w.removeEventListener('pointermove', onMove); };
  }, []);

  return (
    <div ref={wrap} className="relative mt-[clamp(40px,6vw,80px)] border-t border-line" onPointerLeave={() => setActive(null)}>
      {items.map((s, i) => (
        <Link key={s.slug} href={`/products/${s.slug}/`} onPointerEnter={() => setActive(i)} onFocus={() => setActive(i)} onBlur={() => setActive(null)}
          className="group relative grid items-center gap-6 border-b border-line py-[clamp(28px,4vw,56px)] lg:grid-cols-12">
          <span aria-hidden className="absolute inset-0 origin-right scale-x-0 bg-[linear-gradient(270deg,rgba(1,171,252,0.07),transparent_70%)] transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-x-100" />
          <h3 className="relative text-[clamp(34px,5.4vw,84px)] font-semibold leading-[1.1] text-ink transition-[color,transform] duration-500 ease-[var(--ease-out-soft)] group-hover:-translate-x-3 group-hover:text-accent lg:col-span-7">
            <SplitWords text={s.title} />
          </h3>
          <p className="relative text-[16px] leading-8 text-body lg:col-span-4 lg:col-start-9"><SplitWords text={s.lead} dim={0.2} /></p>
          <div className="lux relative aspect-[16/10] overflow-hidden lg:hidden"><Img img={images[i]} sizes="100vw" className="absolute inset-0 h-full w-full" /></div>
        </Link>
      ))}
      {/* cursor-following framed photo (desktop) */}
      <div ref={card} aria-hidden className="pointer-events-none absolute left-0 top-0 z-10 hidden h-[400px] w-[310px] lg:block"
        style={{ opacity: active == null ? 0 : 1, transition: 'opacity .45s ease' }}>
        <div className="relative h-full w-full overflow-hidden border border-line bg-white p-2 shadow-[0_40px_80px_rgba(10,26,58,0.22)]">
          {images.map((im, i) => (
            <div key={i} className="absolute inset-2 overflow-hidden transition-[opacity,transform] duration-500 ease-[var(--ease-out-soft)]" style={{ opacity: active === i ? 1 : 0, transform: active === i ? 'scale(1)' : 'scale(1.12)' }}>
              <Img img={im} sizes="320px" className="h-full w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
