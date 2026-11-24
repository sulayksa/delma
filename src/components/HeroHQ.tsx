'use client';
import { useEffect, useRef } from 'react';
import { Img } from './Img';
import { SplitWords } from './SplitWords';
import { Button } from './ui';

/**
 * Opening: the company's real headquarters, cinematic. The photo slowly pushes in as you scroll
 * and leans with the mouse; the headline arrives word by word; facts settle along the bottom edge.
 */
export function HeroHQ() {
  const sec = useRef<HTMLElement>(null);
  const layer = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = sec.current, ly = layer.current; if (!el || !ly) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0, mx = 0, my = 0, cx = 0, cy = 0, sc = 0;
    const loop = () => {
      cx += (mx - cx) * 0.06; cy += (my - cy) * 0.06;
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -r.top / r.height)); sc += (p - sc) * 0.2;
      ly.style.transform = `translate3d(${(cx * -18).toFixed(2)}px, ${(cy * -12 + sc * 90).toFixed(2)}px, 0) scale(${(1.08 + sc * 0.12).toFixed(4)})`;
      el.style.setProperty('--hp', sc.toFixed(3));
      raf = r.bottom > 0 ? requestAnimationFrame(loop) : 0;
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(loop); };
    const onMove = (e: PointerEvent) => { mx = e.clientX / window.innerWidth - 0.5; my = e.clientY / window.innerHeight - 0.5; kick(); };
    window.addEventListener('pointermove', onMove, { passive: true }); window.addEventListener('scroll', kick, { passive: true });
    kick();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('pointermove', onMove); window.removeEventListener('scroll', kick); };
  }, []);

  const facts = [['التأسيس', '2011'], ['المقر والمعرض', 'حي السعادة، الرياض'], ['الخدمات', 'تصنيع · توريد · تركيب']];
  return (
    <section ref={sec} className="relative overflow-hidden bg-paper max-md:pt-[96px] md:h-[100svh] md:min-h-[640px]">
      {/* phone: the whole building, framed — a 16:9 photo cropped to a tall screen only shows a blurry slice of the sign */}
      <div className="wrap md:hidden">
        <div className="lux relative aspect-[16/11] overflow-hidden page-enter">
          <Img img={{ src: 'hq-hero', alt: 'مقر مؤسسة دلما الجزيرة للمقاولات في الرياض', w: 3840, h: 2161 }} priority sizes="92vw" className="absolute inset-0 h-full w-full hero-hq__img" position="52% 46%" />
          <span className="absolute bottom-0 right-0 bg-white/95 px-3 py-1.5 text-[12px] text-ink">المقر الرئيسي — الرياض</span>
        </div>
      </div>
      <div className="absolute inset-y-0 left-0 hidden w-[64%] overflow-hidden md:block">
      <div ref={layer} className="absolute inset-[-4%] will-change-transform" style={{ transform: 'scale(1.08)' }}>
        <Img img={{ src: 'hq-hero', alt: 'مقر مؤسسة دلما الجزيرة للمقاولات في الرياض', w: 3840, h: 2161 }} sizes="64vw" className="h-full w-full hero-hq__img" position="56% 42%" />
      </div>
      </div>
      {/* grade: deep navy from the text side, fading to the photo */}
      <div aria-hidden className="absolute inset-0 hidden md:block bg-[linear-gradient(270deg,#F8FAFD_0%,#F8FAFD_36%,rgba(248,250,253,0.55)_46%,rgba(248,250,253,0)_58%)] max-md:bg-[linear-gradient(180deg,rgba(248,250,253,0)_0%,rgba(248,250,253,0)_22%,#F8FAFD_46%,#F8FAFD_100%)]" />
      <div aria-hidden className="absolute inset-x-0 top-0 hidden h-40 md:block bg-[linear-gradient(180deg,rgba(248,250,253,0.9),transparent)]" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 hidden h-40 md:block bg-[linear-gradient(0deg,var(--color-paper),transparent)]" />
      <div aria-hidden className="hero-hq__sweep absolute inset-0 hidden md:block" />

      <div className="wrap relative z-[2] flex flex-col pb-[clamp(48px,9vw,72px)] pt-10 md:h-full md:justify-center md:pb-0 md:pt-[120px]"
        style={{ opacity: 'calc(1 - var(--hp, 0) * 1.6)', transform: 'translate3d(0, calc(var(--hp, 0) * -60px), 0)' }}>
        <div className="max-w-[640px]">
          <span aria-hidden className="block h-px w-14 origin-right bg-sky page-enter" style={{ animationDelay: '150ms' }} />
          <h1 className="t-display mt-7 text-ink"><SplitWords now text={'حلول متكاملة\nللأبواب والنوافذ'} delay={250} stagger={95} /></h1>
          <p className="t-lead mt-7 max-w-[46ch] page-enter" style={{ animationDelay: '800ms' }}>
            خبرة منذ <span className="num">2011</span> في تصنيع وتوريد وتركيب الأبواب والنوافذ وحلول الألمنيوم والزجاج، بجودة تنفيذ تهتم بأدق التفاصيل.
          </p>
          <div className="mt-10 flex flex-wrap gap-3 page-enter" style={{ animationDelay: '950ms' }}>
            <Button href="/products/">استكشف خدماتنا</Button>
            <Button href="/door-studio/" variant="ghost">استوديو الأبواب ثلاثي الأبعاد</Button>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-[2] hidden md:block" style={{ opacity: 'calc(1 - var(--hp, 0) * 2)' }}>
        <dl className="wrap grid grid-cols-3 border-t border-line">
          {facts.map(([k, v], i) => (
            <div key={k} className="page-enter border-l border-line py-6 pl-6 last:border-l-0" style={{ animationDelay: `${1100 + i * 120}ms` }}>
              <dt className="text-[13px] text-muted">{k}</dt>
              <dd className="mt-1 text-[17px] font-medium text-ink">{k === 'التأسيس' ? <span className="num">{v}</span> : v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
