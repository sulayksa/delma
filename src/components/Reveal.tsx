'use client';
import { useEffect, useRef, type ElementType, type ReactNode, type CSSProperties } from 'react';

/** Fades/lifts its child once when it enters the viewport (IntersectionObserver, transform + opacity only). */
export function Reveal({ children, as: Tag = 'div', delay = 0, y = 18, img = false, className = '', style }: {
  children: ReactNode; as?: ElementType; delay?: number; y?: number; img?: boolean; className?: string; style?: CSSProperties;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { el.classList.add('in'); io.disconnect(); } }), { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    io.observe(el); return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref} className={`${img ? 'reveal-img' : 'reveal'} ${className}`} style={{ ['--rv-d' as string]: `${delay}ms`, ['--rv-y' as string]: `${y}px`, ...style }}>
      {children}
    </Tag>
  );
}
