'use client';
import { useState } from 'react';
import { Img } from './Img';
import { Lightbox } from './Lightbox';
import { Reveal } from './Reveal';
import type { Img as ImgT } from '@/content/site';

type Item = ImgT & { tag?: string };

/** Masonry-like gallery (CSS columns) with a filter and lightbox. */
export function Gallery({ items, filters = false }: { items: Item[]; filters?: boolean }) {
  const tags = ['الكل', ...Array.from(new Set(items.map((i) => i.tag).filter(Boolean) as string[]))];
  const [tag, setTag] = useState('الكل');
  const [open, setOpen] = useState<number | null>(null);
  const list = tag === 'الكل' ? items : items.filter((i) => i.tag === tag);
  const cur = open != null ? list[open] : null;

  return (
    <>
      {filters ? (
        <div role="tablist" aria-label="تصفية النماذج" className="mb-10 flex flex-wrap gap-2">
          {tags.map((t) => (
            <button key={t} type="button" role="tab" aria-selected={tag === t} onClick={() => { setTag(t); setOpen(null); }}
              className={`h-10 border px-5 text-[14px] transition-colors duration-300 ${tag === t ? 'border-sky bg-sky text-navy' : 'border-line text-ink hover:border-ink'}`}>{t}</button>
          ))}
        </div>
      ) : null}
      <ul className="columns-2 gap-4 md:columns-3 md:gap-5">
        {list.map((it, i) => (
          <li key={it.src + tag + i} className="mb-4 break-inside-avoid md:mb-5">
            <Reveal img delay={(i % 3) * 70}>
              <button type="button" onClick={() => setOpen(i)} className="lux zoom group relative block w-full overflow-hidden text-right" aria-label={`عرض الصورة: ${it.alt}`}>
                <Img img={it} sizes="(min-width:768px) 33vw, 50vw" className="block h-auto w-full" />
                {it.tag ? <span className="absolute bottom-0 right-0 bg-white/95 px-3 py-1.5 text-[12px] text-ink">{it.tag}</span> : null}
              </button>
            </Reveal>
          </li>
        ))}
      </ul>
      <Lightbox open={open != null} onClose={() => setOpen(null)} label="عارض الصور"
        onPrev={() => setOpen((o) => (o == null ? o : (o - 1 + list.length) % list.length))}
        onNext={() => setOpen((o) => (o == null ? o : (o + 1) % list.length))}
        caption={cur ? <span>{cur.alt} <span className="num mr-3 text-white/50">{(open ?? 0) + 1} / {list.length}</span></span> : null}>
        {cur ? <Img img={cur} sizes="100vw" fit="contain" className="max-h-full max-w-full" /> : null}
      </Lightbox>
    </>
  );
}
