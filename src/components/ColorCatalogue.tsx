'use client';
import { useState } from 'react';
import { Lightbox } from './Lightbox';
import { asset } from '@/lib/paths';

/** WPC colour catalogue P01–P19 using the texture photos from the company catalogue. */
export function ColorCatalogue({ codes }: { codes: string[] }) {
  const [sel, setSel] = useState(0);
  const [zoom, setZoom] = useState(false);
  const code = codes[sel];
  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
      {/* selected swatch */}
      <div className="lg:sticky lg:top-[100px] lg:col-span-5 lg:self-start">
        <button type="button" onClick={() => setZoom(true)} className="group relative block aspect-[4/5] w-full overflow-hidden bg-mist" aria-label={`تكبير عينة اللون ${code}`}>
          {codes.map((c, i) => (
            <img key={c} src={asset(`/img/colors/${c}.webp`)} alt={`عينة لون أبواب WPC بالكود ${c}`} width={900} height={1105} loading={i < 2 ? 'eager' : 'lazy'}
              className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-[var(--ease-out-soft)]" style={{ opacity: i === sel ? 1 : 0 }} />
          ))}
          <span className="absolute bottom-0 right-0 flex items-center gap-3 bg-paper px-5 py-3">
            <span className="text-[13px] text-muted">الكود</span><span className="num text-[20px] font-semibold text-ink">{code}</span>
          </span>
          <span className="absolute left-4 top-4 grid h-10 w-10 place-items-center bg-white/90 text-ink opacity-0 transition-opacity group-hover:opacity-100" aria-hidden>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M10 4h-6v6M14 20h6v-6M4 4l7 7M20 20l-7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </span>
        </button>
        <p className="mt-4 text-[13px] leading-7 text-muted">قد تختلف درجات الألوان المعروضة بحسب إعدادات الشاشة والإضاءة، ويُنصح بالاطلاع على العينة الفعلية في المعرض قبل اعتماد اللون.</p>
      </div>

      {/* grid */}
      <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4 lg:col-span-7 lg:grid-cols-5" aria-label="ألوان أبواب WPC">
        {codes.map((c, i) => (
          <li key={c}>
            <button type="button" onClick={() => setSel(i)} aria-pressed={i === sel} aria-label={`اختيار اللون ${c}`}
              className="group block w-full text-right">
              <span className={`relative block aspect-[3/4] overflow-hidden outline outline-1 outline-offset-[3px] transition-[outline-color] duration-300 ${i === sel ? 'outline-sky' : 'outline-transparent group-hover:outline-line'}`}>
                <img src={asset(`/img/colors/${c}-sm.webp`)} alt="" width={360} height={442} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-105" />
              </span>
              <span className={`num mt-2 block text-[13px] ${i === sel ? 'font-semibold text-sky' : 'text-body'}`}>{c}</span>
            </button>
          </li>
        ))}
      </ul>

      <Lightbox open={zoom} onClose={() => setZoom(false)} label={`عينة اللون ${code}`}
        onPrev={() => setSel((s) => (s - 1 + codes.length) % codes.length)} onNext={() => setSel((s) => (s + 1) % codes.length)}
        caption={<span className="num text-[16px] text-white">{code}</span>}>
        <img src={asset(`/img/colors/${code}.webp`)} alt={`عينة لون ${code} مكبّرة`} className="max-h-full max-w-full object-contain" />
      </Lightbox>
    </div>
  );
}
