'use client';
import { useEffect, useRef, type ReactNode } from 'react';

/** Light parallax: translates its child a few % while in view. Off for reduced motion and on small screens. */
export function Parallax({ children, amount = 6, className = '' }: { children: ReactNode; amount?: number; className?: string }) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = outer.current, layer = inner.current; if (!el || !layer) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.innerWidth < 768) return;
    let raf = 0, visible = false;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect(), vh = window.innerHeight;
      const p = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2); // -1..1
      layer.style.transform = `translate3d(0, ${(-p * amount).toFixed(3)}%, 0) scale(1.08)`;
    };
    const on = () => { if (visible && !raf) raf = requestAnimationFrame(update); };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; on(); });
    io.observe(el); window.addEventListener('scroll', on, { passive: true });
    return () => { io.disconnect(); window.removeEventListener('scroll', on); cancelAnimationFrame(raf); };
  }, [amount]);
  return (
    <div ref={outer} className={`overflow-hidden ${className}`}>
      <div ref={inner} className="h-full w-full will-change-transform" style={{ transform: 'scale(1.08)' }}>{children}</div>
    </div>
  );
}
