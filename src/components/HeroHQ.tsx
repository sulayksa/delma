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
    <section ref={sec} className="relative h-[100svh] min-h-[640px] overflow-hidden bg-navy">
      <div ref={layer} className="absolute inset-[-4%] will-change-transform" style={{ transform: 'scale(1.08)' }}>
        <Img img={{ src: 'hq-hero', alt: 'مقر مؤسسة دلما الجزيرة للمقاولات في الرياض', w: 3840, h: 2161 }} priority sizes="100vw" className="h-full w-full hero-hq__img" position="60% 45%" />
      </div>
      {/* grade: deep navy from the text side, fading to the photo */}
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(270deg,rgba(4,12,32,0.94)_0%,rgba(4,12,32,0.78)_34%,rgba(4,12,32,0.25)_68%,rgba(4,12,32,0.35)_100%)] max-md:bg-[linear-gradient(180deg,rgba(4,12,32,0.55)_0%,rgba(4,12,32,0.86)_55%,rgba(4,12,32,0.96)_100%)]" />
      <div aria-hidden className="absolute inset-x-0 top-0 h-40 bg-[linear-gradient(180deg,rgba(4,12,32,0.85),transparent)]" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(0deg,var(--color-paper),transparent)]" />
      <div aria-hidden className="hero-hq__sweep absolute inset-0" />

      <div className="wrap relative z-[2] flex h-full flex-col justify-end pb-[clamp(36px,7vh,72px)] pt-[120px] md:justify-center md:pb-0"
        style={{ opacity: 'calc(1 - var(--hp, 0) * 1.6)', transform: 'translate3d(0, calc(var(--hp, 0) * -60px), 0)' }}>
        <div className="max-w-[640px]">
          <span aria-hidden className="block h-px w-14 origin-right bg-sky page-enter" style={{ animationDelay: '150ms' }} />
          <h1 className="t-display mt-7 text-white"><SplitWords now text={'حلول متكاملة\nللأبواب والنوافذ'} delay={250} stagger={95} /></h1>
          <p className="t-lead mt-7 max-w-[46ch] !text-white/80 page-enter" style={{ animationDelay: '800ms' }}>
            خبرة منذ <span className="num">2011</span> في تصنيع وتوريد وتركيب الأبواب والنوافذ وحلول الألمنيوم والزجاج، بجودة تنفيذ تهتم بأدق التفاصيل.
          </p>
          <div className="mt-10 flex flex-wrap gap-3 page-enter" style={{ animationDelay: '950ms' }}>
            <Button href="/products/">استكشف خدماتنا</Button>
            <Button href="/door-studio/" variant="outline-light">استوديو الأبواب ثلاثي الأبعاد</Button>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-[2] hidden md:block" style={{ opacity: 'calc(1 - var(--hp, 0) * 2)' }}>
        <dl className="wrap grid grid-cols-3 border-t border-white/15">
          {facts.map(([k, v], i) => (
            <div key={k} className="page-enter border-l border-white/10 py-6 pl-6 last:border-l-0" style={{ animationDelay: `${1100 + i * 120}ms` }}>
              <dt className="text-[13px] text-white/55">{k}</dt>
              <dd className="mt-1 text-[17px] font-medium text-white">{k === 'التأسيس' ? <span className="num">{v}</span> : v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
