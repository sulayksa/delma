'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import type { DoorScene, Finish, Product, Surface, View } from './scene';
import { colors } from '@/content/site';
import { BASE, asset } from '@/lib/paths';

type Cat = 'wpc' | 'upvc' | 'win';
const CATS: { id: Cat; name: string; noun: string }[] = [
  { id: 'wpc', name: 'أبواب WPC', noun: 'الباب' },
  { id: 'upvc', name: 'أبواب UPVC', noun: 'الباب' },
  { id: 'win', name: 'شبابيك UPVC', noun: 'الشباك' },
];
const PRODUCTS: { id: Product; cat: Cat; name: string; use: string; img: string }[] = [
  { id: 'wpc-plain', cat: 'wpc', name: 'سادة', use: 'الحمامات والغرف الرطبة', img: 'wpc-plain-white' },
  { id: 'wpc-carved', cat: 'wpc', name: 'حفر', use: 'مداخل الغرف والفلل', img: 'wpc-carved' },
  { id: 'wpc-glass', cat: 'wpc', name: 'مع زجاج', use: 'الصالات والممرات', img: 'wpc-glass' },
  { id: 'wpc-decor', cat: 'wpc', name: 'ديكور بارز', use: 'التصاميم الداخلية للفلل', img: 'wpc-decor' },
  { id: 'upvc-panel', cat: 'upvc', name: 'باب شرائح', use: 'للشرفات والحدائق', img: 'upvc-panel-door' },
  { id: 'upvc-glass', cat: 'upvc', name: 'باب زجاج', use: 'أبواب مزودة بزجاج', img: 'upvc-glass-door' },
  { id: 'win-casement', cat: 'win', name: 'مفصلي', use: 'لغرف النوم والصالات', img: 'upvc-casement' },
  { id: 'win-sliding', cat: 'win', name: 'سحّاب', use: 'للشرفات والفتحات الكبيرة', img: 'upvc-sliding' },
  { id: 'win-tilt', cat: 'win', name: 'قلّاب', use: 'تهوية والشباك مثبّت من الجوانب', img: 'upvc-tilt' },
];
const UPVC_COLORS: { id: string; name: string; s: Surface; swatch: string }[] = [
  { id: 'white', name: 'أبيض', s: { kind: 'solid', hex: 0xf3f3ef }, swatch: '#f3f3ef' },
  { id: 'grey', name: 'رمادي', s: { kind: 'solid', hex: 0x6f747c }, swatch: '#6f747c' },
  { id: 'anth', name: 'أنثراسايت', s: { kind: 'solid', hex: 0x2e3238 }, swatch: '#2e3238' },
  { id: 'wood', name: 'خشبي', s: { kind: 'texture', code: 'P04' }, swatch: '' },
];
const FINISHES: { id: Finish; name: string; swatch: string }[] = [
  { id: 'black', name: 'أسود مطفي', swatch: 'linear-gradient(135deg,#3a3c40,#121315)' },
  { id: 'chrome', name: 'كروم', swatch: 'linear-gradient(135deg,#ffffff,#9aa3ad)' },
  { id: 'gold', name: 'ذهبي', swatch: 'linear-gradient(135deg,#ecd08a,#a8812e)' },
];
const VIEWS: { id: View; name: string }[] = [{ id: 'front', name: 'أمامي' }, { id: 'angle', name: 'زاوية' }, { id: 'side', name: 'جانبي' }, { id: 'back', name: 'خلفي' }];

export function DoorStudio() {
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const sc = useRef<DoorScene | null>(null);
  const [product, setProduct] = useState<Product>('wpc-plain');
  const [wpcColor, setWpcColor] = useState('P04');
  const [upvcColor, setUpvcColor] = useState('white');
  const [finish, setFinish] = useState<Finish>('black');
  const [open, setOpen] = useState(false);
  const [spin, setSpin] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [hover, setHover] = useState(false);
  const [pulse, setPulse] = useState(true);

  const cur = PRODUCTS.find((p) => p.id === product)!;
  const cat = cur.cat;
  const noun = CATS.find((c) => c.id === cat)!.noun;

  useEffect(() => {
    const q = new URLSearchParams(location.search).get('model');
    const map: Record<string, Product> = { plain: 'wpc-plain', carved: 'wpc-carved', glass: 'wpc-glass', decor: 'wpc-decor' };
    const p = (q && (map[q] || (PRODUCTS.some((x) => x.id === q) ? (q as Product) : null))) || null;
    if (p) setProduct(p);
  }, []);

  useEffect(() => {
    let disposed = false; let ro: ResizeObserver | null = null; let io: IntersectionObserver | null = null;
    (async () => {
      try {
        const t = document.createElement('canvas');
        if (!t.getContext('webgl2') && !t.getContext('webgl')) throw new Error('no-webgl');
        const { DoorScene } = await import('./scene');
        if (disposed || !canvas.current || !stage.current) return;
        const s = new DoorScene(canvas.current, BASE);
        sc.current = s;
        s.onState = ({ open }) => { setOpen(open); setPulse(false); };
        s.onHover = setHover;
        const fit = () => { const r = stage.current!.getBoundingClientRect(); s.resize(r.width, r.height); };
        fit(); ro = new ResizeObserver(fit); ro.observe(stage.current);
        io = new IntersectionObserver(([e]) => s.setVisible(e.isIntersecting)); io.observe(stage.current);
        s.start(); setReady(true);
      } catch { setFailed(true); }
    })();
    return () => { disposed = true; ro?.disconnect(); io?.disconnect(); sc.current?.dispose(); sc.current = null; };
  }, []);

  const first = useRef(true);
  useEffect(() => {
    const s = sc.current; if (!ready || !s) return;
    s.setProduct(product);
    s.setSurface(cat === 'wpc' ? { kind: 'texture', code: wpcColor } : UPVC_COLORS.find((c) => c.id === upvcColor)!.s);
    s.setFinish(finish);
    if (first.current) { first.current = false; if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) s.view('angle', 1); else s.intro(); }
    else s.view('angle', 1100);
  }, [product, ready]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (ready && cat === 'wpc') sc.current?.setSurface({ kind: 'texture', code: wpcColor }); }, [wpcColor]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (ready && cat !== 'wpc') sc.current?.setSurface(UPVC_COLORS.find((c) => c.id === upvcColor)!.s); }, [upvcColor]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (ready) sc.current?.setFinish(finish); }, [finish, ready]);
  useEffect(() => { if (ready) sc.current?.setAutoRotate(spin); }, [spin, ready]);

  const colorName = cat === 'wpc' ? wpcColor : UPVC_COLORS.find((c) => c.id === upvcColor)!.name;
  const catName = CATS.find((c) => c.id === cat)!.name;
  const quoteHref = `/quote/?door=${encodeURIComponent(`${catName} — ${cur.name} — اللون ${colorName}${cat !== 'win' ? ` — مقبض ${FINISHES.find((f) => f.id === finish)!.name}` : ''}`)}`;

  return (
    <section className="relative pt-[68px]">
      <div className="grid lg:h-[calc(100svh-68px)] lg:min-h-[660px] lg:grid-cols-[420px_minmax(0,1fr)]">
        <div ref={stage} data-lenis-prevent
          className="relative h-[66svh] min-h-[440px] touch-none select-none bg-[radial-gradient(110%_85%_at_55%_38%,#ffffff_0%,#eef1f5_52%,#d9dfe8_100%)] lg:order-2 lg:h-auto">
          <canvas ref={canvas} className="absolute inset-0 h-full w-full cursor-grab active:cursor-grabbing" role="img" aria-label={`نموذج ثلاثي الأبعاد: ${catName} — ${cur.name}`} />
          {!ready && !failed ? (
            <div className="absolute inset-0 grid place-items-center text-[14px] text-[#5b6577]">
              <div className="flex flex-col items-center gap-4">
                <span className="relative block h-px w-28 overflow-hidden bg-[#cfd6e0]"><span className="absolute inset-y-0 right-0 w-1/3 animate-[studioload_1.1s_ease-in-out_infinite] bg-[#003E9A]" /></span>
                جارٍ تجهيز النموذج…
              </div>
            </div>
          ) : null}
          {failed ? <div className="absolute inset-0 grid place-items-center p-8 text-center text-[#0E1A2E]">متصفحك لا يدعم العرض ثلاثي الأبعاد.</div> : null}
          {ready ? (
            <>
              <div aria-live="polite" className={`pointer-events-none absolute left-1/2 top-6 flex -translate-x-1/2 items-center gap-3 whitespace-nowrap bg-[#071430]/85 px-4 py-2.5 text-[13px] text-white backdrop-blur transition-opacity duration-500 ${pulse || hover ? 'opacity-100' : 'opacity-0'}`}>
                <span className="relative grid h-3 w-3 place-items-center"><span className="h-2 w-2 rounded-full bg-sky" /></span>
                المس {noun} {open ? 'لإغلاقه' : 'لفتحه'} · اسحب للتدوير
              </div>
              <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-1 border border-[#d5dbe4] bg-white/95 p-1 text-[#0E1A2E] shadow-[0_10px_30px_rgba(10,26,58,0.1)]" role="group" aria-label="زوايا العرض">
                {VIEWS.map((v) => (
                  <button key={v.id} type="button" onClick={() => { setSpin(false); sc.current?.view(v.id); }} className="h-10 px-2.5 text-[13px] transition-colors hover:bg-[#eef1f5] sm:px-4">{v.name}</button>
                ))}
                <span className="mx-1 h-6 w-px bg-[#d5dbe4]" />
                <button type="button" onClick={() => setSpin((s) => !s)} aria-pressed={spin} className={`h-10 px-2.5 text-[13px] transition-colors sm:px-4 ${spin ? 'bg-[#003E9A] text-white' : 'hover:bg-[#eef1f5]'}`}><span className="num">360°</span></button>
              </div>
            </>
          ) : null}
        </div>

        <aside className="relative z-[1] border-line bg-paper lg:order-1 lg:overflow-y-auto lg:border-l" data-lenis-prevent>
          <div className="p-6 sm:p-8">
            <h1 className="text-[30px] font-semibold leading-tight text-ink">استوديو الأبواب والشبابيك</h1>
            <p className="mt-2 text-[15px] leading-7 text-body">اختر المنتج واللون، دوّره من كل الاتجاهات، والمسه ليفتح ويُغلق.</p>
            <div role="tablist" aria-label="الفئة" className="mt-7 grid grid-cols-3 border border-line">
              {CATS.map((c) => (
                <button key={c.id} type="button" role="tab" aria-selected={cat === c.id} onClick={() => setProduct(PRODUCTS.find((p) => p.cat === c.id)!.id)}
                  className={`h-12 text-[14px] transition-colors ${cat === c.id ? 'bg-sky font-semibold text-navy' : 'text-ink hover:bg-white/5'}`}>{c.name}</button>
              ))}
            </div>
            <fieldset className="mt-7">
              <legend className="text-[13px] font-semibold text-ink">النوع</legend>
              <div className={`mt-3 grid gap-2 ${cat === 'wpc' ? 'grid-cols-4' : cat === 'upvc' ? 'grid-cols-2' : 'grid-cols-3'}`}>
                {PRODUCTS.filter((p) => p.cat === cat).map((p) => (
                  <button key={p.id} type="button" onClick={() => setProduct(p.id)} aria-pressed={product === p.id}
                    className={`group flex flex-col items-center border px-1 pb-2 pt-2 transition-colors ${product === p.id ? 'border-sky bg-white/5' : 'border-line hover:border-ink/30'}`}>
                    <span className="block h-[68px] w-full overflow-hidden bg-white"><img src={asset(`/img/${p.img}.webp`)} alt="" loading="lazy" className={`h-full w-full ${cat === 'wpc' ? 'object-contain' : 'object-cover'}`} /></span>
                    <span className={`mt-2 text-[13px] ${product === p.id ? 'font-semibold text-sky' : 'text-ink'}`}>{p.name}</span>
                  </button>
                ))}
              </div>
              <p className="mt-2 text-[13px] text-muted">الاستخدام: {cur.use}</p>
            </fieldset>
            <fieldset className="mt-7">
              <legend className="flex w-full items-baseline justify-between text-[13px] font-semibold text-ink">اللون <span className={`font-normal text-sky ${cat === 'wpc' ? 'num' : ''}`}>{colorName}</span></legend>
              {cat === 'wpc' ? (
                <div className="mt-3 grid grid-cols-7 gap-1.5">
                  {colors.map((c) => (
                    <button key={c} type="button" onClick={() => setWpcColor(c)} aria-pressed={wpcColor === c} aria-label={`اللون ${c}`} title={c}
                      className={`relative aspect-[3/4] overflow-hidden outline outline-1 outline-offset-2 transition-[outline-color] ${wpcColor === c ? 'outline-sky' : 'outline-transparent hover:outline-line'}`}>
                      <img src={asset(`/img/colors/${c}-sm.webp`)} alt="" loading="lazy" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="mt-3 grid grid-cols-4 gap-2">
                  {UPVC_COLORS.map((c) => (
                    <button key={c.id} type="button" onClick={() => setUpvcColor(c.id)} aria-pressed={upvcColor === c.id}
                      className={`flex flex-col items-center gap-2 border py-3 text-[12px] transition-colors ${upvcColor === c.id ? 'border-sky text-sky' : 'border-line text-ink hover:border-ink/30'}`}>
                      <span className="h-7 w-7 rounded-full border border-white/20" style={c.swatch ? { background: c.swatch } : { backgroundImage: `url(${asset('/img/colors/P04-sm.webp')})`, backgroundSize: 'cover' }} />
                      {c.name}
                    </button>
                  ))}
                </div>
              )}
            </fieldset>
            {cat !== 'win' ? (
              <fieldset className="mt-7">
                <legend className="text-[13px] font-semibold text-ink">لون المقبض</legend>
                <div className="mt-3 flex gap-2">
                  {FINISHES.map((f) => (
                    <button key={f.id} type="button" onClick={() => setFinish(f.id)} aria-pressed={finish === f.id}
                      className={`flex h-11 flex-1 items-center justify-center gap-2 border text-[13px] transition-colors ${finish === f.id ? 'border-sky text-sky' : 'border-line text-ink hover:border-ink/30'}`}>
                      <span className="h-4 w-4 rounded-full" style={{ background: f.swatch }} />{f.name}
                    </button>
                  ))}
                </div>
              </fieldset>
            ) : null}
            <Link href={quoteHref} className="group mt-9 flex h-[54px] items-center justify-between bg-sky px-6 text-[15px] font-medium text-navy transition-colors hover:bg-white">
              اطلب عرض سعر لهذا الاختيار
              <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="none" className="transition-transform duration-500 group-hover:-translate-x-1.5"><path d="M19 12H5m0 0 6-6m-6 6 6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </Link>
            <p className="mt-5 text-[12px] leading-6 text-muted">نموذج توضيحي ثلاثي الأبعاد. ألوان WPC من خامات الكتالوج، وألوان UPVC تقريبية؛ المقاسات والتفاصيل النهائية حسب الطلب، ويُنصح بالاطلاع على العينة الفعلية في المعرض.</p>
          </div>
        </aside>
      </div>
      <style>{`@keyframes studioload{0%{transform:translateX(0)}100%{transform:translateX(-300%)}}`}</style>
    </section>
  );
}
