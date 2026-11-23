'use client';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { Img } from './Img';
import { SplitWords } from './SplitWords';
import type { Img as ImgT } from '@/content/site';

type S = { slug: string; no: string; title: string; lead: string; image: ImgT };

/**
 * Stacked cards: each field pins under the header; as the next card slides over it,
 * the one underneath recedes in depth (scale + tilt + dim).
 */
export function StackServices({ items, images }: { items: S[]; images: ImgT[] }) {
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      refs.current.forEach((card, i) => {
        const next = refs.current[i + 1]; if (!card) return;
        const inner = card.firstElementChild as HTMLElement;
        if (!next) { inner.style.transform = ''; inner.style.filter = ''; return; }
        const nt = next.getBoundingClientRect().top;
        const top = card.getBoundingClientRect().top;
        const p = Math.min(1, Math.max(0, 1 - (nt - top) / (vh * 0.85)));
        inner.style.transform = `perspective(1600px) translate3d(0, ${-p * 30}px, 0) rotateX(${p * 6}deg) scale(${1 - p * 0.08})`;
        inner.style.filter = `brightness(${1 - p * 0.35})`;
      });
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(update); };
    update(); window.addEventListener('scroll', on, { passive: true }); window.addEventListener('resize', on);
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); cancelAnimationFrame(raf); };
  }, []);

  return (
    <div className="relative">
      {items.map((s, i) => (
        <div key={s.slug} ref={(el) => { refs.current[i] = el; }} className="sticky" style={{ top: `calc(84px + ${i * 18}px)`, zIndex: i + 1 }}>
          <div className="origin-top will-change-transform">
            <Link href={`/products/${s.slug}/`} className="group relative mb-[8vh] grid min-h-[min(78svh,720px)] overflow-hidden bg-navy text-white lg:grid-cols-12">
              <div className="relative z-[1] flex flex-col justify-between p-[clamp(28px,4vw,64px)] lg:col-span-5">
                <span aria-hidden className="h-px w-12 bg-sky" />
                <div>
                  <h3 className="t-h1 !text-[clamp(32px,4vw,56px)]"><SplitWords text={s.title} /></h3>
                  <p className="mt-5 max-w-[40ch] text-[17px] leading-8 text-white/70">{s.lead}</p>
                  <span className="mt-9 inline-flex items-center gap-3 border-b border-white/30 pb-2 text-[15px] transition-colors duration-500 group-hover:border-sky group-hover:text-sky">
                    اكتشف التفاصيل
                    <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="none" className="transition-transform duration-500 group-hover:-translate-x-1.5"><path d="M19 12H5m0 0 6-6m-6 6 6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </span>
                </div>
              </div>
              <div className="relative min-h-[300px] overflow-hidden lg:col-span-7">
                <Img img={images[i]} sizes="(min-width:1024px) 60vw, 100vw" className="absolute inset-0 h-full w-full transition-transform duration-[1.6s] ease-[var(--ease-out-soft)] group-hover:scale-[1.04]" />
                <div aria-hidden className="absolute inset-0 bg-[linear-gradient(270deg,rgba(10,26,58,0.55),rgba(10,26,58,0)_45%)] max-lg:bg-[linear-gradient(0deg,rgba(10,26,58,0.5),rgba(10,26,58,0)_50%)]" />
              </div>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
