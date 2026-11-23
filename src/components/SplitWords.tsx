'use client';
import { Fragment, useEffect, useRef, type ElementType } from 'react';

/**
 * Word-by-word masked rise (never per letter — Arabic letters must stay joined).
 * Lines may be separated with "\n". Starts when scrolled into view, or immediately with `now`.
 */
export function SplitWords({ text, as: Tag = 'span', className = '', delay = 0, stagger = 55, now = false }: {
  text: string; as?: ElementType; className?: string; delay?: number; stagger?: number; now?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    if (now) { requestAnimationFrame(() => el.classList.add('in')); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('in'); io.disconnect(); } }, { rootMargin: '0px 0px -10% 0px' });
    io.observe(el); return () => io.disconnect();
  }, [now]);
  let k = 0;
  const lines = text.split('\n');
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
