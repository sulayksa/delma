'use client';
import { useEffect, useRef, useState } from 'react';

type Step = { no: string; title: string; text: string };

/** Four steps on a hairline; the line fills as the section scrolls through the viewport (rAF-throttled, transform only). */
export function Process({ steps }: { steps: Step[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(-1);

  useEffect(() => {
    const el = ref.current; if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0, visible = false;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect(); const vh = window.innerHeight;
      const p = reduce ? 1 : Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.35)));
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
      setActive(Math.min(steps.length - 1, Math.floor(p * steps.length * 1.0001) - (p === 0 ? 1 : 0)));
    };
    const onScroll = () => { if (visible && !raf) raf = requestAnimationFrame(update); };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) onScroll(); });
    io.observe(el); window.addEventListener('scroll', onScroll, { passive: true }); window.addEventListener('resize', onScroll);
    return () => { io.disconnect(); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); cancelAnimationFrame(raf); };
  }, [steps.length]);

  return (
    <div ref={ref} className="relative mt-[clamp(48px,7vw,88px)]">
      <div aria-hidden className="absolute right-0 left-0 top-[7px] hidden h-px bg-line md:block">
        <div ref={bar} className="h-full origin-right bg-sky" style={{ transform: 'scaleX(0)' }} />
      </div>
      <ol className="grid gap-10 md:grid-cols-4 md:gap-8">
        {steps.map((s, i) => {
          const on = i <= active;
          return (
            <li key={s.no} className="relative border-r border-line pr-6 md:border-r-0 md:pr-0">
              <span aria-hidden className={`absolute -right-[5px] top-1 h-[9px] w-[9px] rounded-full border transition-colors duration-500 md:right-0 md:top-[3px] ${on ? 'border-sky bg-sky' : 'border-line bg-paper'}`} />
              <div className="md:pt-10">
                <span className={`num text-[40px] font-light leading-none transition-colors duration-700 ${on ? 'text-sky' : 'text-line'}`}>{s.no}</span>
                <h3 className="t-h3 mt-4 text-ink">{s.title}</h3>
                <p className="t-body mt-2 max-w-[30ch]">{s.text}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
