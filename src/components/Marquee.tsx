'use client';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { Img } from './Img';
import type { Img as ImgT } from '@/content/site';

type Item = { title: string; sub: string; href: string; image: ImgT; fit?: 'cover' | 'contain' };

/**
 * Featured products as a slow, continuous strip that moves on its own (compositor-only CSS transform,
 * not tied to scrolling). Pauses on hover/focus/touch and while off-screen; static, swipeable list for reduced motion.
 */
export function Marquee({ items, heading }: { items: Item[]; heading: React.ReactNode }) {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = root.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => el.classList.toggle('mq-off', !e.isIntersecting), { rootMargin: '100px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const card = (it: Item, i: number, dup: boolean) => (
    <li key={(dup ? 'd' : '') + it.title} className="mq__item" aria-hidden={dup || undefined}>
      <Link href={it.href} tabIndex={dup ? -1 : undefined} className="group block w-[min(68vw,300px)] lg:w-[340px]">
        <div className="lux relative aspect-[4/5] overflow-hidden">
          <Img img={it.image} fit={it.fit ?? 'cover'} sizes="(min-width:1024px) 340px, 68vw"
            className={`absolute inset-0 h-full w-full ${it.fit === 'contain' ? 'p-[9%]' : ''}`} />
          <span className="num absolute right-5 top-5 z-[3] text-[12px] text-muted">0{i + 1}</span>
        </div>
        <div className="mt-5 flex items-end justify-between gap-3 border-t border-line pt-4">
          <div>
            <h3 className="text-[20px] font-semibold text-ink transition-colors group-hover:text-accent">{it.title}</h3>
            <p className="mt-1 text-[14px] text-body">{it.sub}</p>
          </div>
          <svg aria-hidden width="20" height="20" viewBox="0 0 24 24" fill="none" className="mb-1 shrink-0 text-accent transition-transform duration-500 group-hover:-translate-x-1.5"><path d="M19 12H5m0 0 6-6m-6 6 6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
      </Link>
    </li>
  );
  return (
    <section ref={root} className="section relative bg-mist">
      <div className="wrap">{heading}</div>
      <div className="mq mt-12">
        <ul className="mq__track">
          {items.map((it, i) => card(it, i, false))}
          {items.map((it, i) => card(it, i, true))}
        </ul>
      </div>
    </section>
  );
}
