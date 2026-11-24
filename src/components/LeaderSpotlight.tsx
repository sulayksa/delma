'use client';
import { useEffect, useRef } from 'react';
import { SplitWords } from './SplitWords';
import { Reveal } from './Reveal';
import { company, leadership } from '@/content/site';
import { asset } from '@/lib/paths';

/**
 * Executive portrait: the president stands in front of an architectural arch (a doorway — the company's craft),
 * framed by double gold hairlines; his head and shoulders break out of the arch.
 * The arch and the portrait sit on separate depth planes and lean with the mouse.
 */
export function LeaderSpotlight() {
  const p = leadership[0];
  const stage = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = stage.current; if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !window.matchMedia('(hover: hover)').matches) return;
    let raf = 0, x = 0, y = 0, tx = 0, ty = 0;
    const loop = () => {
      x += (tx - x) * 0.08; y += (ty - y) * 0.08;
      el.style.setProperty('--lx', x.toFixed(4)); el.style.setProperty('--ly', y.toFixed(4));
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.0005 ? requestAnimationFrame(loop) : 0;
    };
    const onMove = (e: PointerEvent) => { const r = el.getBoundingClientRect(); tx = (e.clientX - r.left) / r.width - 0.5; ty = (e.clientY - r.top) / r.height - 0.5; if (!raf) raf = requestAnimationFrame(loop); };
    const onLeave = () => { tx = ty = 0; if (!raf) raf = requestAnimationFrame(loop); };
    el.addEventListener('pointermove', onMove); el.addEventListener('pointerleave', onLeave);
    return () => { cancelAnimationFrame(raf); el.removeEventListener('pointermove', onMove); el.removeEventListener('pointerleave', onLeave); };
  }, []);

  return (
    <section className="section relative overflow-hidden" aria-labelledby="leader-title">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-[900px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(1,171,252,0.10),transparent)]" />
      <div className="wrap relative grid items-center gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5 lg:col-start-1">
          <span aria-hidden className="block h-px w-14 bg-gold" />
          <h2 id="leader-title" className="t-h2 mt-6 text-ink"><SplitWords text="القيادة والإدارة" /></h2>
          <p className="mt-3 text-[17px] text-body"><SplitWords text="رؤية تقود مسيرة العمل." dim={0.2} /></p>
          <div className="mt-14">
            <h3 className="text-[clamp(34px,4.4vw,60px)] font-semibold leading-[1.15] text-white"><SplitWords text={p.name} /></h3>
            <Reveal delay={100}>
              <div className="mt-6 flex items-center gap-4">
                <span className="h-px w-10 bg-gold" />
                <span className="text-[19px] font-medium text-gold">{p.role}</span>
              </div>
            </Reveal>
            {p.bio ? <Reveal delay={160}><p className="t-lead mt-8 max-w-[48ch]">{p.bio}</p></Reveal> : null}
            <Reveal delay={200}><p className="mt-10 text-[14px] leading-7 text-muted">{company.nameAr}<br />{company.city} · منذ <span className="num">{company.founded}</span></p></Reveal>
          </div>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <Reveal img>
            <div ref={stage} className="leader-stage relative mx-auto aspect-[4/5] w-full max-w-[560px]">
              {/* arch (back plane) */}
              <div className="leader-arch absolute inset-x-[8%] bottom-0 top-[14%]">
                <div className="absolute inset-0 rounded-t-full bg-[linear-gradient(180deg,#123A7C_0%,#0A2252_55%,#061433_100%)] shadow-[0_60px_120px_rgba(0,0,0,0.5)]" />
                <div className="absolute inset-[14px] rounded-t-full border border-gold/70" />
                <div className="absolute inset-[22px] rounded-t-full border border-gold/30" />
                <div className="absolute inset-0 overflow-hidden rounded-t-full"><div className="leader-sheen absolute inset-0" /></div>
              </div>
              {/* portrait (front plane) — breaks out of the arch */}
              <img src={asset('/img/leader-cutout.webp')} srcSet={`${asset('/img/leader-cutout-800.webp')} 1100w, ${asset('/img/leader-cutout.webp')} 2200w`} sizes="(min-width:1024px) 560px, 92vw"
                alt={`${p.name}، ${p.role}`} width={2200} height={2732} loading="lazy" decoding="async"
                className="leader-portrait absolute bottom-0 left-1/2 h-[100%] w-auto max-w-none [mask-image:linear-gradient(180deg,#000_78%,transparent_100%)]" />
              {/* plinth */}
              <div aria-hidden className="absolute inset-x-[4%] bottom-0 h-px bg-gradient-to-r from-transparent via-gold/80 to-transparent" />
              <div aria-hidden className="absolute -bottom-8 left-1/2 h-10 w-[70%] -translate-x-1/2 rounded-[50%] bg-black/50 blur-2xl" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
