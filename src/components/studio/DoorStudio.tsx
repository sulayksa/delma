'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import type { DoorScene, Finish, Model, View } from './scene';
import { colors } from '@/content/site';
import { BASE, asset } from '@/lib/paths';

const MODELS: { id: Model; name: string; use: string; img: string }[] = [
  { id: 'plain', name: 'سادة', use: 'الحمامات والغرف الرطبة', img: 'wpc-plain-white' },
  { id: 'carved', name: 'حفر', use: 'مداخل الغرف والفلل', img: 'wpc-carved' },
  { id: 'glass', name: 'مع زجاج', use: 'الصالات والممرات', img: 'wpc-glass' },
  { id: 'decor', name: 'ديكور بارز', use: 'التصاميم الداخلية للفلل', img: 'wpc-decor' },
];
const FINISHES: { id: Finish; name: string; swatch: string }[] = [
  { id: 'black', name: 'أسود مطفي', swatch: 'linear-gradient(135deg,#3a3c40,#121315)' },
  { id: 'chrome', name: 'كروم', swatch: 'linear-gradient(135deg,#ffffff,#9aa3ad)' },
  { id: 'gold', name: 'ذهبي', swatch: 'linear-gradient(135deg,#ecd08a,#a8812e)' },
];
const VIEWS: { id: View; name: string }[] = [
  { id: 'front', name: 'أمامي' }, { id: 'angle', name: 'زاوية' }, { id: 'side', name: 'جانبي' }, { id: 'back', name: 'خلفي' },
];

export function DoorStudio() {
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const sc = useRef<DoorScene | null>(null);
  const [model, setModel] = useState<Model>('plain');
  const [color, setColor] = useState('P04');
  const [finish, setFinish] = useState<Finish>('black');
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [spin, setSpin] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [hint, setHint] = useState(true);

  // read ?model=&color= once
  useEffect(() => {
    const q = new URLSearchParams(location.search);
    const m = q.get('model') as Model | null; if (m && MODELS.some((x) => x.id === m)) setModel(m);
    const c = q.get('color'); if (c && colors.includes(c)) setColor(c);
  }, []);

  // boot three.js lazily (its code is only downloaded on this page)
  useEffect(() => {
    let disposed = false; let ro: ResizeObserver | null = null; let io: IntersectionObserver | null = null;
    (async () => {
      try {
        const test = document.createElement('canvas');
        if (!test.getContext('webgl2') && !test.getContext('webgl')) throw new Error('no-webgl');
        const { DoorScene } = await import('./scene');
        if (disposed || !canvas.current || !stage.current) return;
        const s = new DoorScene(canvas.current, BASE);
        sc.current = s;
        s.onState = ({ open, busy }) => { setOpen(open); setBusy(busy); };
        const q = new URLSearchParams(location.search);
        const m0 = (q.get('model') as Model) || 'plain';
        s.setModel(MODELS.some((x) => x.id === m0) ? m0 : 'plain');
        await s.setColor(colors.includes(q.get('color') || '') ? q.get('color')! : 'P04');
        const fit = () => { const r = stage.current!.getBoundingClientRect(); s.resize(r.width, r.height); };
        fit(); ro = new ResizeObserver(fit); ro.observe(stage.current);
        io = new IntersectionObserver(([e]) => s.setVisible(e.isIntersecting)); io.observe(stage.current);
        s.start(); setReady(true);
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) s.intro(); else s.view('angle', 1);
      } catch { setFailed(true); }
    })();
    return () => { disposed = true; ro?.disconnect(); io?.disconnect(); sc.current?.dispose(); sc.current = null; };
  }, []);

  useEffect(() => { if (ready) sc.current?.setModel(model); }, [model, ready]);
  useEffect(() => { if (ready) sc.current?.setColor(color); }, [color, ready]);
  useEffect(() => { if (ready) sc.current?.setFinish(finish); }, [finish, ready]);
  useEffect(() => { if (ready) sc.current?.setAutoRotate(spin); }, [spin, ready]);

  const current = MODELS.find((m) => m.id === model)!;
  const quoteHref = `/quote/?door=${encodeURIComponent(`باب WPC ${current.name} — اللون ${color} — مقبض ${FINISHES.find((f) => f.id === finish)!.name}`)}`;

  return (
    <section className="relative bg-[radial-gradient(120%_90%_at_60%_40%,#ffffff_0%,#f1f4f8_55%,#e6eaf0_100%)] pt-[68px]">
      <div className="grid lg:h-[calc(100svh-68px)] lg:min-h-[640px] lg:grid-cols-[400px_minmax(0,1fr)]">
        {/* 3D stage */}
        <div ref={stage} data-lenis-prevent onPointerDown={() => setHint(false)}
          className="relative h-[64svh] min-h-[420px] touch-none select-none lg:order-2 lg:h-auto">
          <canvas ref={canvas} className="absolute inset-0 h-full w-full cursor-grab active:cursor-grabbing" aria-label={`نموذج ثلاثي الأبعاد لباب WPC ${current.name} باللون ${color}`} role="img" />
          {!ready && !failed ? (
            <div className="absolute inset-0 grid place-items-center">
              <div className="flex flex-col items-center gap-4 text-[14px] text-muted">
                <span className="relative block h-px w-28 overflow-hidden bg-line"><span className="absolute inset-y-0 right-0 w-1/3 animate-[studioload_1.1s_ease-in-out_infinite] bg-brand" /></span>
                جارٍ تجهيز الباب…
              </div>
            </div>
          ) : null}
          {failed ? (
            <div className="absolute inset-0 grid place-items-center p-8 text-center">
              <div><p className="text-[16px] text-ink">متصفحك لا يدعم العرض ثلاثي الأبعاد.</p>
                <Link href="/products/wpc-doors/" className="ulink mt-3 inline-block text-brand">شاهد صور الموديلات</Link></div>
            </div>
          ) : null}

          {/* floating controls on the stage */}
          {ready ? (
            <>
              <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-1 border border-line bg-white/95 p-1 shadow-[0_10px_30px_rgba(10,26,58,0.08)]" role="group" aria-label="زوايا العرض">
                {VIEWS.map((v) => (
                  <button key={v.id} type="button" onClick={() => { setSpin(false); sc.current?.view(v.id); }}
                    className="h-10 px-3.5 text-[13px] text-ink transition-colors hover:bg-mist sm:px-4">{v.name}</button>
                ))}
                <span className="mx-1 h-6 w-px bg-line" />
                <button type="button" onClick={() => setSpin((s) => !s)} aria-pressed={spin}
                  className={`h-10 px-3.5 text-[13px] transition-colors sm:px-4 ${spin ? 'bg-brand text-white' : 'text-ink hover:bg-mist'}`}><span className="num">360°</span></button>
              </div>
              <div aria-hidden className={`pointer-events-none absolute left-1/2 top-6 -translate-x-1/2 text-[13px] text-muted transition-opacity duration-700 ${hint ? 'opacity-100' : 'opacity-0'}`}>
                اسحب لتدوير الباب · قرّب وبعّد بالعجلة أو بإصبعين
              </div>
            </>
          ) : null}
        </div>

        {/* configurator panel */}
        <aside className="relative z-[1] border-line bg-white lg:order-1 lg:overflow-y-auto lg:border-l" data-lenis-prevent>
          <div className="p-6 sm:p-8">
            <h1 className="text-[28px] font-semibold leading-tight text-ink">استوديو الأبواب</h1>
            <p className="mt-2 text-[15px] leading-7 text-body">اختر الموديل واللون والمقبض، ودوّر الباب من كل الاتجاهات، ثم افتحه.</p>

            <button type="button" onClick={() => sc.current?.toggle()} disabled={!ready || busy}
              className="group mt-7 flex h-[56px] w-full items-center justify-between bg-navy px-6 text-[16px] font-medium text-white transition-colors hover:bg-brand disabled:opacity-60">
              {open ? 'أغلق الباب' : 'افتح الباب'}
              <svg aria-hidden width="22" height="22" viewBox="0 0 24 24" fill="none" className={`transition-transform duration-700 ease-[var(--ease-out-soft)] ${open ? 'rotate-180' : ''}`}>
                <path d="M4 21V4a1 1 0 0 1 1-1h9v18M14 21h6M10 12h.01M14 3l6 2v16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <fieldset className="mt-8">
              <legend className="text-[13px] font-semibold text-ink">الموديل</legend>
              <div className="mt-3 grid grid-cols-4 gap-2">
                {MODELS.map((m) => (
                  <button key={m.id} type="button" onClick={() => setModel(m.id)} aria-pressed={model === m.id}
                    className={`group flex flex-col items-center border px-1 pb-2 pt-2 transition-colors ${model === m.id ? 'border-brand bg-mist' : 'border-line hover:border-ink/30'}`}>
                    <img src={asset(`/img/${m.img}.webp`)} alt="" width={60} height={110} loading="lazy" className="h-[64px] w-auto object-contain" />
                    <span className={`mt-2 text-[13px] ${model === m.id ? 'font-semibold text-brand' : 'text-ink'}`}>{m.name}</span>
                  </button>
                ))}
              </div>
              <p className="mt-2 text-[13px] text-muted">الاستخدام المقترح: {current.use}</p>
            </fieldset>

            <fieldset className="mt-8">
              <legend className="flex w-full items-baseline justify-between text-[13px] font-semibold text-ink">اللون <span className="num font-normal text-brand">{color}</span></legend>
              <div className="mt-3 grid grid-cols-7 gap-1.5">
                {colors.map((c) => (
                  <button key={c} type="button" onClick={() => setColor(c)} aria-pressed={color === c} aria-label={`اللون ${c}`} title={c}
                    className={`relative aspect-[3/4] overflow-hidden outline outline-1 outline-offset-2 transition-[outline-color] ${color === c ? 'outline-brand' : 'outline-transparent hover:outline-line'}`}>
                    <img src={asset(`/img/colors/${c}-sm.webp`)} alt="" width={360} height={442} loading="lazy" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="mt-8">
              <legend className="text-[13px] font-semibold text-ink">لون المقبض</legend>
              <div className="mt-3 flex gap-2">
                {FINISHES.map((f) => (
                  <button key={f.id} type="button" onClick={() => setFinish(f.id)} aria-pressed={finish === f.id}
                    className={`flex h-11 flex-1 items-center justify-center gap-2 border text-[13px] transition-colors ${finish === f.id ? 'border-brand text-brand' : 'border-line text-ink hover:border-ink/30'}`}>
                    <span className="h-4 w-4 rounded-full" style={{ background: f.swatch }} />{f.name}
                  </button>
                ))}
              </div>
            </fieldset>

            <Link href={quoteHref} className="group mt-9 flex h-[52px] items-center justify-between border border-ink/20 px-6 text-[15px] font-medium text-ink transition-colors hover:border-brand hover:bg-brand hover:text-white">
              اطلب عرض سعر لهذا الباب
              <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="none" className="transition-transform duration-500 group-hover:-translate-x-1.5"><path d="M19 12H5m0 0 6-6m-6 6 6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </Link>
            <p className="mt-5 text-[12px] leading-6 text-muted">نموذج توضيحي ثلاثي الأبعاد بخامات ألوان الكتالوج. المقاسات والتفاصيل النهائية حسب الطلب، ويُنصح بالاطلاع على العينة الفعلية في المعرض.</p>
          </div>
        </aside>
      </div>
      <style>{`@keyframes studioload{0%{transform:translateX(0)}100%{transform:translateX(-300%)}}`}</style>
    </section>
  );
}
