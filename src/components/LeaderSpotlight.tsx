'use client';
import { useEffect, useRef } from 'react';
import { SplitWords } from './SplitWords';
import { Reveal } from './Reveal';
import { company, leadership } from '@/content/site';
import { asset } from '@/lib/paths';
import { onFrame, schedule } from '@/lib/frame';

/**
 * Leadership — editorial executive profile (light).
 * A tall studio backdrop with fine vertical fluting and gold corner marks; the president's cut-out portrait
 * rises out of it as you scroll in; name set large with a gold rule and three facts underneath.
 */
export function LeaderSpotlight() {
  const p = leadership[0];
  const frame = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = frame.current; if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { el.style.setProperty('--lp', '1'); return; }
    let visible = false, last = -1;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) schedule(); }, { rootMargin: '10% 0px' });
    io.observe(el);
    const off = onFrame({
      enabled: () => visible,
      read: () => { const r = el.getBoundingClientRect(), vh = window.innerHeight; return Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.75))); },
      write: (v: number) => { if (Math.abs(v - last) > 0.002) { last = v; el.style.setProperty('--lp', v.toFixed(3)); } },
    });
    return () => { io.disconnect(); off(); };
  }, []);

  const facts: [string, React.ReactNode][] = [
    ['المؤسسة', company.nameAr],
    ['المقر', `${company.city}، حي السعادة`],
    ['منذ', <span key="y" className="num">{company.founded}</span>],
  ];

  return (
    <section className="section relative overflow-hidden" aria-labelledby="leader-title">
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-line pb-8">
          <div>
            <span aria-hidden className="block h-px w-14 bg-gold" />
            <h2 id="leader-title" className="t-h2 mt-6 text-ink"><SplitWords text="القيادة والإدارة" /></h2>
          </div>
          <p className="text-[17px] text-body"><SplitWords text="رؤية تقود مسيرة العمل." dim={0.2} /></p>
        </div>

        <div className="mt-[clamp(40px,6vw,80px)] grid items-stretch gap-10 lg:grid-cols-12 lg:gap-0">
          <div className="flex flex-col justify-between lg:col-span-5 lg:py-10 lg:pl-14">
            <div>
              <Reveal><div className="flex items-center gap-4"><span className="h-px w-10 bg-gold" /><span className="text-[17px] font-medium text-gold">{p.role}</span></div></Reveal>
              <h3 className="mt-8 text-[clamp(40px,5vw,76px)] font-semibold leading-[1.12] text-ink"><SplitWords text={p.name.replace(' بن ', '\nبن ')} /></h3>
              {p.bio ? <Reveal delay={120}><p className="t-lead mt-8 max-w-[46ch]">{p.bio}</p></Reveal> : null}
            </div>
            <dl className="mt-14 grid grid-cols-3 border-t border-line">
              {facts.map(([k, v], i) => (
                <Reveal key={k} delay={i * 80} className="border-l border-line py-6 pl-4 last:border-l-0">
                  <dt className="text-[13px] text-muted">{k}</dt>
                  <dd className="mt-2 text-[15px] font-medium leading-7 text-ink">{v}</dd>
                </Reveal>
              ))}
            </dl>
          </div>

          <div className="lg:col-span-7">
            <div ref={frame} className="leader-frame relative aspect-[4/5] w-full overflow-hidden sm:aspect-square lg:aspect-auto lg:h-full lg:min-h-[680px]" style={{ ['--lp' as string]: 0 }}>
              <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,#E6ECF4_0%,#F1F4F9_60%,#F8FAFD_100%)]" />
              <div aria-hidden className="leader-flutes absolute inset-0" />
              <div aria-hidden className="absolute left-1/2 top-[8%] h-[70%] w-[62%] -translate-x-1/2 rounded-t-full bg-[radial-gradient(closest-side,rgba(255,255,255,0.95),rgba(255,255,255,0))]" />
              {['right-5 top-5 border-r border-t', 'left-5 top-5 border-l border-t', 'right-5 bottom-5 border-r border-b', 'left-5 bottom-5 border-l border-b'].map((c) => (
                <span key={c} aria-hidden className={`leader-corner absolute h-10 w-10 border-gold ${c}`} />
              ))}
              <img src={asset('/img/leader-cutout.webp')} srcSet={`${asset('/img/leader-cutout-800.webp')} 1100w, ${asset('/img/leader-cutout.webp')} 2200w`} sizes="(min-width:1024px) 58vw, 100vw"
                alt={`${p.name}، ${p.role}`} width={2200} height={2732} loading="lazy" decoding="async"
                className="leader-photo absolute bottom-0 left-1/2 h-[96%] w-auto max-w-none" />
              <div aria-hidden className="absolute inset-x-0 bottom-0 h-[16%] bg-[linear-gradient(0deg,#F8FAFD,rgba(248,250,253,0))]" />
              <div className="absolute bottom-6 right-6 border border-line bg-white/90 px-5 py-3">
                <p className="text-[13px] font-semibold text-ink">{p.name}</p>
                <p className="text-[12px] text-muted">{p.role} — {company.shortAr}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
