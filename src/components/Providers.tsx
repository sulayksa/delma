'use client';
import Lenis from 'lenis';
import { usePathname, useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useRef, type ReactNode } from 'react';
import { BASE } from '@/lib/paths';

const LenisCtx = createContext<Lenis | null>(null);
export const useLenis = () => useContext(LenisCtx);

/**
 * - Lenis inertial smooth scrolling (native scroll position, so sticky/IntersectionObserver keep working).
 * - Page transition: a navy curtain covers the page, the route changes underneath, then the curtain lifts.
 * Both are skipped for prefers-reduced-motion.
 */
export function Providers({ children }: { children: ReactNode }) {
  const lenis = useRef<Lenis | null>(null);
  const curtain = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const path = usePathname();
  const busy = useRef(false);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const l = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4), smoothWheel: true, touchMultiplier: 1.4 });
    lenis.current = l;
    let id = 0;
    const raf = (t: number) => { l.raf(t); id = requestAnimationFrame(raf); };
    id = requestAnimationFrame(raf);
    return () => { cancelAnimationFrame(id); l.destroy(); lenis.current = null; };
  }, []);

  // lift the curtain after each navigation
  useEffect(() => {
    const c = curtain.current; if (!c) return;
    lenis.current?.scrollTo(0, { immediate: true }); window.scrollTo(0, 0);
    if (c.dataset.state === 'cover') {
      requestAnimationFrame(() => { c.dataset.state = 'leave'; });
      const t = setTimeout(() => { c.dataset.state = 'idle'; busy.current = false; }, 900);
      return () => clearTimeout(t);
    }
  }, [path]);

  // intercept internal link clicks
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const onClick = (e: MouseEvent) => {
      if (reduce || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement).closest('a');
      if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname) { // same page: smooth-scroll to hash or top
        if (url.hash) { e.preventDefault(); const el = document.querySelector(decodeURIComponent(url.hash)); if (el) lenis.current ? lenis.current.scrollTo(el as HTMLElement, { offset: -80 }) : el.scrollIntoView({ behavior: 'smooth' }); }
        return;
      }
      if (!url.pathname.startsWith(BASE + '/') && BASE) return;
      e.preventDefault();
      if (busy.current) return; busy.current = true;
      const c = curtain.current!; c.dataset.state = 'cover';
      const to = url.pathname.slice(BASE.length) + url.search + url.hash;
      setTimeout(() => router.push(to, { scroll: false }), 620);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [router]);

  return (
    <LenisCtx.Provider value={lenis.current}>
      {children}
      <div ref={curtain} data-state="idle" aria-hidden className="page-curtain">
        <div className="page-curtain__panel" />
        <div className="page-curtain__line" />
      </div>
    </LenisCtx.Provider>
  );
}
