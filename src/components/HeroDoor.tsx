'use client';
import { useEffect, useRef, useState } from 'react';
import { Img } from './Img';
import { SplitWords } from './SplitWords';
import { Button } from './ui';
import { images } from '@/content/site';
import { asset } from '@/lib/paths';

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/**
 * Scroll-driven 3D opening: a WPC door (real catalogue texture) set in a white wall swings open,
 * then the camera passes through the doorway into the company's showroom.
 * Only transform / opacity / filter are animated; all values flow through CSS variables set in one rAF.
 */
export function HeroDoor() {
  const sec = useRef<HTMLElement>(null);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const r = window.matchMedia('(prefers-reduced-motion: reduce)').matches; setReduce(r);
    const el = sec.current; if (!el || r) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = clamp(-rect.top / Math.max(1, total));
      const door = ease(clamp((p - 0.04) / 0.44));
      const fly = ease(clamp((p - 0.42) / 0.5));
      el.style.setProperty('--door', door.toFixed(4));
      el.style.setProperty('--fly', fly.toFixed(4));
      el.style.setProperty('--tout', clamp((p - 0.3) / 0.22).toFixed(4));
      el.style.setProperty('--wall', clamp((p - 0.86) / 0.12).toFixed(4));
      el.style.setProperty('--cap', clamp((p - 0.84) / 0.12).toFixed(4));
      el.style.setProperty('--hint', clamp(1 - p / 0.08).toFixed(4));
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', on, { passive: true }); window.addEventListener('resize', on);
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); cancelAnimationFrame(raf); };
  }, []);

  return (
    <section ref={sec} className={`hero-door relative ${reduce ? 'h-[100svh]' : 'h-[260svh] max-md:h-[200svh]'}`}
      style={{ ['--door' as string]: reduce ? 0.35 : 0, ['--fly' as string]: 0, ['--tout' as string]: 0, ['--wall' as string]: 0, ['--cap' as string]: 0, ['--hint' as string]: 1 }}>
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-navy">
        {/* the room behind the door: the real showroom */}
        <div className="absolute inset-0" style={{ transform: 'scale(calc(1.28 - var(--fly) * 0.28))', filter: 'brightness(calc(0.62 + var(--fly) * 0.38))' }}>
          <Img img={images.hero} priority sizes="100vw" className="h-full w-full" position="38% 50%" />
        </div>
        <div className="absolute inset-x-0 bottom-0 z-[3] px-[clamp(20px,5vw,56px)] pb-10 text-white" style={{ opacity: 'var(--cap)', transform: 'translate3d(0, calc((1 - var(--cap)) * 20px), 0)' }}>
          <div className="mx-auto flex max-w-[1320px] items-end justify-between gap-6">
            <p className="text-[clamp(22px,2.6vw,36px)] font-semibold leading-tight">معرض دلما الجزيرة<br /><span className="text-[0.55em] font-normal text-white/75">حي السعادة — الرياض</span></p>
            <span className="t-kicker !text-white/70">SHOWROOM</span>
          </div>
        </div>

        {/* the wall + doorway — scales around the doorway so the camera passes through it */}
        <div className="hero-door__wall absolute inset-0 z-[2]" style={{ opacity: 'calc(1 - var(--wall))' }}>
          <div className="hero-door__scene absolute inset-0" style={{ transform: 'scale(calc(1 + var(--fly) * var(--fly) * 7))' }}>
            <div className="hero-door__opening">
              {/* leaf */}
              <div className="hero-door__leaf" style={{ transform: 'rotateY(calc(var(--door) * -104deg))' }}>
                <div className="absolute inset-0" style={{ backgroundImage: `url(${asset('/img/colors/P04.webp')})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                <div aria-hidden className="absolute inset-[9%_12%_52%_12%] shadow-[inset_0_1px_0_rgba(255,255,255,0.18),inset_0_-1px_0_rgba(0,0,0,0.25),inset_1px_0_0_rgba(255,255,255,0.12),inset_-1px_0_0_rgba(0,0,0,0.2)]" />
                <div aria-hidden className="absolute inset-[54%_12%_7%_12%] shadow-[inset_0_1px_0_rgba(255,255,255,0.18),inset_0_-1px_0_rgba(0,0,0,0.25),inset_1px_0_0_rgba(255,255,255,0.12),inset_-1px_0_0_rgba(0,0,0,0.2)]" />
                <div aria-hidden className="absolute left-[7%] top-[49%] h-[3px] w-[14%] rounded-full bg-[#1d1f22] shadow-[0_2px_3px_rgba(0,0,0,0.35)]" />
                <div aria-hidden className="absolute left-[7%] top-[47.6%] h-[11px] w-[11px] rounded-full bg-[#2a2c2f]" />
                <div aria-hidden className="hero-door__edge" style={{ backgroundImage: `url(${asset('/img/colors/P04.webp')})` }} />
                {/* light falling across the leaf as it turns */}
                <div aria-hidden className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.35),rgba(0,0,0,0)_60%)]" style={{ opacity: 'calc(var(--door) * 0.9)' }} />
              </div>
            </div>
            {/* floor + contact shadow */}
            <div aria-hidden className="hero-door__floor" />
          </div>

          {/* copy on the wall */}
          <div className="hero-door__copy" style={{ opacity: 'calc(1 - var(--tout))', transform: 'translate3d(0, calc(var(--tout) * -40px), 0)' }}>
            <div className="flex items-center gap-4 page-enter" style={{ animationDelay: '200ms' }}><span className="h-px w-10 bg-sky" /><span className="t-kicker">DELMA AL JAZEERA · SINCE <span className="num">2011</span></span></div>
            <h1 className="t-display mt-7 text-ink"><SplitWords now text={'حلول متكاملة\nللأبواب والنوافذ'} delay={250} stagger={90} /></h1>
            <p className="t-lead mt-7 max-w-[44ch] page-enter" style={{ animationDelay: '750ms' }}>
              خبرة منذ <span className="num">2011</span> في تصنيع وتوريد وتركيب الأبواب والنوافذ وحلول الألمنيوم والزجاج، بجودة تنفيذ تهتم بأدق التفاصيل.
            </p>
            <div className="mt-10 flex flex-wrap gap-3 page-enter" style={{ animationDelay: '900ms' }}>
              <Button href="/products/">استكشف خدماتنا</Button>
              <Button href="/quote/" variant="ghost">اطلب عرض سعر</Button>
            </div>
          </div>

          {!reduce ? (
            <div aria-hidden className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3 text-[12px] text-muted" style={{ opacity: 'var(--hint)' }}>
              <span>مرّر لفتح الباب</span>
              <span className="relative block h-10 w-px overflow-hidden bg-line"><span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_2.4s_ease-in-out_infinite] bg-sky" /></span>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
