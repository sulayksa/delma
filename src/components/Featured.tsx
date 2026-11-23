'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Img } from './Img';
import type { Img as ImgT } from '@/content/site';

type Item = { title: string; sub: string; href: string; image: ImgT; fit?: 'cover' | 'contain' };

/** Selected products: an index on one side, one large image that cross-fades on hover / focus / tap. */
export function Featured({ items }: { items: Item[] }) {
  const [i, setI] = useState(0);
  return (
    <div className="mt-[clamp(40px,6vw,72px)] grid gap-8 lg:grid-cols-12 lg:gap-16">
      <ul className="border-t border-line lg:col-span-5" role="tablist" aria-label="منتجات مختارة">
        {items.map((it, k) => (
          <li key={it.title} className="border-b border-line">
            <button type="button" role="tab" aria-selected={i === k} aria-controls="featured-panel"
              onMouseEnter={() => setI(k)} onFocus={() => setI(k)} onClick={() => setI(k)}
              className="group flex w-full items-center justify-between gap-4 py-5 text-right">
              <span className="flex items-baseline gap-4">
                <span className={`num w-6 text-[12px] transition-colors ${i === k ? 'text-sky-ink' : 'text-muted'}`}>0{k + 1}</span>
                <span className={`text-[clamp(18px,1.6vw,22px)] font-medium transition-colors duration-300 ${i === k ? 'text-brand' : 'text-ink group-hover:text-brand'}`}>{it.title}</span>
              </span>
              <span className={`text-[13px] text-muted transition-opacity duration-300 ${i === k ? 'opacity-100' : 'opacity-0 sm:opacity-60'}`}>{it.sub}</span>
            </button>
          </li>
        ))}
      </ul>
      <div id="featured-panel" role="tabpanel" className="lg:col-span-7">
        <div className="relative aspect-[4/3] overflow-hidden bg-mist">
          {items.map((it, k) => (
            <div key={it.title} aria-hidden={i !== k}
              className="absolute inset-0 transition-[opacity,transform] duration-700 ease-[var(--ease-out-soft)]"
              style={{ opacity: i === k ? 1 : 0, transform: i === k ? 'scale(1)' : 'scale(1.02)' }}>
              <Img img={it.image} fit={it.fit ?? 'cover'} sizes="(min-width:1024px) 55vw, 100vw" className={`h-full w-full ${it.fit === 'contain' ? 'p-8' : ''}`} />
            </div>
          ))}
        </div>
        <div className="mt-5 flex items-center justify-between">
          <p className="text-[15px] text-body">{items[i].sub}</p>
          <Link href={items[i].href} className="group inline-flex items-center gap-2 text-[15px] font-medium text-brand"><span className="ulink">عرض التفاصيل</span>
            <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="none" className="transition-transform duration-500 group-hover:-translate-x-1.5"><path d="M19 12H5m0 0 6-6m-6 6 6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
