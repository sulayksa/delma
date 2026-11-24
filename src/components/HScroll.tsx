'use client';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { Img } from './Img';
import type { Img as ImgT } from '@/content/site';

type Item = { title: string; sub: string; href: string; image: ImgT; fit?: 'cover' | 'contain' };

/**
 * Pinned horizontal gallery (desktop): vertical scroll drives the track sideways (RTL → it travels rightwards),
 * each card turns slightly in 3D depending on its distance from the centre. Mobile: native swipe with snap.
 */
export function HScroll({ items, heading }: { items: Item[]; heading: React.ReactNode }) {
  const sec = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = sec.current, tr = track.current; if (!el || !tr) return;
    const mq = window.matchMedia('(min-width: 1024px) and (prefers-reduced-motion: no-preference)');
    let raf = 0;
    const size = () => {
      if (!mq.matches) { el.style.height = ''; tr.style.transform = ''; return; }
      const dist = tr.scrollWidth - window.innerWidth + 120;
      el.style.height = `${window.innerHeight + dist}px`;
    };
    const update = () => {
      raf = 0; if (!mq.matches) return;
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, total)));
      const dist = tr.scrollWidth - window.innerWidth + 120;
      tr.style.transform = `translate3d(${p * dist}px, 0, 0)`;
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
      const cx = window.innerWidth / 2;
      Array.from(tr.children).forEach((c) => {
        const b = (c as HTMLElement).getBoundingClientRect();
        const d = (b.left + b.width / 2 - cx) / window.innerWidth; // -1..1
        const card = (c as HTMLElement).firstElementChild as HTMLElement;
        card.style.transform = `perspective(1400px) rotateY(${(-d * 18).toFixed(2)}deg) translate3d(0, ${(Math.abs(d) * 30).toFixed(1)}px, ${(-Math.abs(d) * 120).toFixed(1)}px)`;
      });
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(update); };
    const onResize = () => { size(); on(); };
    size(); update();
    window.addEventListener('scroll', on, { passive: true }); window.addEventListener('resize', onResize); mq.addEventListener('change', onResize);
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', onResize); mq.removeEventListener('change', onResize); cancelAnimationFrame(raf); };
  }, []);

  return (
    <section ref={sec} className="relative bg-mist">
      <div className="lg:sticky lg:top-0 lg:flex lg:h-[100svh] lg:flex-col lg:justify-center lg:overflow-hidden">
        <div className="wrap pt-[clamp(72px,10vw,120px)] lg:pt-[84px]">{heading}</div>
        <div ref={track} className="mt-10 flex gap-6 overflow-x-auto px-[clamp(20px,5vw,56px)] pb-10 [scrollbar-width:none] max-lg:snap-x max-lg:snap-mandatory lg:mt-12 lg:overflow-visible lg:pb-0 will-change-transform">
          {items.map((it, i) => (
            <div key={it.title} className="shrink-0 snap-start">
              <Link href={it.href} className="group block w-[min(76vw,340px)] will-change-transform lg:w-[min(26vw,42svh,380px)]">
                <div className="relative aspect-[4/5] overflow-hidden bg-paper">
                  <Img img={it.image} fit={it.fit ?? 'cover'} sizes="(min-width:1024px) 30vw, 76vw"
                    className={`absolute inset-0 h-full w-full transition-transform duration-[1.4s] ease-[var(--ease-out-soft)] group-hover:scale-[1.05] ${it.fit === 'contain' ? 'p-[9%]' : ''}`} />
                  <span className="num absolute right-4 top-4 text-[12px] text-muted">0{i + 1}</span>
                </div>
                <div className="mt-5 flex items-end justify-between gap-3 border-t border-line pt-4">
                  <div>
                    <h3 className="text-[20px] font-semibold text-ink transition-colors group-hover:text-sky">{it.title}</h3>
                    <p className="mt-1 text-[14px] text-body">{it.sub}</p>
                  </div>
                  <svg aria-hidden width="20" height="20" viewBox="0 0 24 24" fill="none" className="mb-1 shrink-0 text-sky transition-transform duration-500 group-hover:-translate-x-1.5"><path d="M19 12H5m0 0 6-6m-6 6 6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
              </Link>
            </div>
          ))}
        </div>
        <div className="wrap hidden lg:block"><div className="mt-10 h-px bg-line"><div ref={bar} className="h-full origin-right bg-brand" style={{ transform: 'scaleX(0)' }} /></div></div>
      </div>
    </section>
  );
}
