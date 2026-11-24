'use client';
import { Fragment, useEffect, useRef, type ElementType } from 'react';

/**
 * Word-by-word text (never per letter — Arabic letters stay joined).
 * Default: scroll-scrubbed — each word lights up and settles in place as you scroll through it.
 * `now`: a timed entrance instead (for the opening headline).
 */
export function SplitWords({ text, as: Tag = 'span', className = '', delay = 0, stagger = 55, now = false, dim = 0.14 }: {
  text: string; as?: ElementType; className?: string; delay?: number; stagger?: number; now?: boolean; dim?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    if (now) { requestAnimationFrame(() => el.classList.add('in')); return; }
    const words = Array.from(el.querySelectorAll<HTMLElement>('.scrub__w'));
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { words.forEach((w) => { w.style.opacity = '1'; }); return; }
    let raf = 0, visible = false;
    const n = words.length;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect(), vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh * 0.92 - r.top) / (vh * 0.47 + Math.min(r.height, vh * 0.5) * 0.4)));
      const spread = 3;
      for (let i = 0; i < n; i++) {
        const k = Math.min(1, Math.max(0, (p * (n + spread) - i) / spread));
        const w = words[i];
        w.style.opacity = String(dim + (1 - dim) * k);
        w.style.transform = k >= 1 ? 'none' : `translate3d(0, ${((1 - k) * 0.28).toFixed(3)}em, 0)`;
        w.style.filter = k >= 1 ? 'none' : `blur(${((1 - k) * 3).toFixed(2)}px)`;
      }
    };
    const on = () => { if (visible && !raf) raf = requestAnimationFrame(update); };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) on(); }, { rootMargin: '10% 0px' });
    io.observe(el); window.addEventListener('scroll', on, { passive: true }); window.addEventListener('resize', on);
    update();
    return () => { io.disconnect(); window.removeEventListener('scroll', on); window.removeEventListener('resize', on); cancelAnimationFrame(raf); };
  }, [now, dim]);

  let k = 0;
  const lines = text.split('\n');
  if (!now) {
    return (
      <Tag ref={ref} className={`scrub ${className}`} aria-label={text.replace(/\n/g, ' ')}>
        {lines.map((line, li) => (
          <span key={li} aria-hidden className="block">
            {line.split(' ').map((w, wi, arr) => (
              <Fragment key={wi}><span className="scrub__w">{w}</span>{wi < arr.length - 1 ? ' ' : null}</Fragment>
            ))}
          </span>
        ))}
      </Tag>
    );
  }
  return (
    <Tag ref={ref} className={`split ${className}`} aria-label={text.replace(/\n/g, ' ')}>
      {lines.map((line, li) => (
        <span key={li} aria-hidden className="block">
          {line.split(' ').map((w, wi, arr) => {
            const i = k++;
            return (
              <Fragment key={wi}>
                <span className="split__mask"><span className="split__word" style={{ transitionDelay: `${delay + i * stagger}ms` }}>{w}</span></span>
                {wi < arr.length - 1 ? ' ' : null}
              </Fragment>
            );
          })}
        </span>
      ))}
    </Tag>
  );
}
