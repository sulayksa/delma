'use client';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, type ReactNode } from 'react';
import { BASE, asset } from '@/lib/paths';

gsap.registerPlugin(ScrollTrigger);

/**
 * Motion stack (web-motion-stack): Lenis smooth scroll driven by GSAP's ticker (one clock),
 * ScrollTrigger kept in sync, and a cinematic page transition — a navy curtain wipes up,
 * the Delma mark draws in, the route changes underneath, then the curtain lifts away.
 * Everything is skipped for prefers-reduced-motion.
 */
export function Providers({ children }: { children: ReactNode }) {
  const lenis = useRef<Lenis | null>(null);
  const curtain = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const path = usePathname();
  const busy = useRef(false);
  const reduce = useRef(false);

  useEffect(() => {
    reduce.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.documentElement.classList.add('gs-on');
    if (reduce.current) return;
    const l = new Lenis({ lerp: 0.2, wheelMultiplier: 1, autoRaf: false, anchors: true });
    lenis.current = l;
    l.on('scroll', ScrollTrigger.update);
    const tick = (t: number) => l.raf(t * 1000);
    gsap.ticker.add(tick); gsap.ticker.lagSmoothing(0);
    document.querySelectorAll('dialog, #mobile-menu, [data-scroll-own]').forEach((el) => el.setAttribute('data-lenis-prevent', ''));
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh); window.addEventListener('load', refresh);
    return () => { gsap.ticker.remove(tick); l.destroy(); lenis.current = null; window.removeEventListener('load', refresh); };
  }, []);

  // after each route change: jump to top, lift the curtain, re-measure triggers
  useEffect(() => {
    lenis.current?.scrollTo(0, { immediate: true, force: true }); window.scrollTo(0, 0);
    const c = curtain.current; if (!c) return;
    if (busy.current && !reduce.current) {
      const tl = gsap.timeline({ onComplete: () => { busy.current = false; gsap.set(c, { visibility: 'hidden' }); } });
      tl.to(c.querySelector('.pc-mark'), { opacity: 0, y: -24, duration: 0.35, ease: 'power2.in' }, 0.05)
        .to(c.querySelector('.pc-panel'), { yPercent: -100, duration: 0.85, ease: 'expo.inOut' }, 0.15)
        .to(c.querySelector('.pc-line'), { scaleX: 0, transformOrigin: 'left center', duration: 0.5, ease: 'power2.inOut' }, 0.15)
        .fromTo('#main', { y: 60, opacity: 0.4 }, { y: 0, opacity: 1, duration: 1, ease: 'expo.out', clearProps: 'transform,opacity' }, 0.35);
    }
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, [path]);

  // intercept internal links
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (reduce.current || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement).closest('a');
      if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname) {
        if (url.hash) { e.preventDefault(); const el = document.querySelector(decodeURIComponent(url.hash)); if (el) lenis.current ? lenis.current.scrollTo(el as HTMLElement, { offset: -80 }) : el.scrollIntoView({ behavior: 'smooth' }); }
        return;
      }
      if (BASE && !url.pathname.startsWith(BASE + '/')) return;
      e.preventDefault();
      if (busy.current) return; busy.current = true;
      const c = curtain.current!;
      const to = url.pathname.slice(BASE.length) + url.search + url.hash;
      gsap.set(c, { visibility: 'visible' });
      gsap.timeline({ onComplete: () => router.push(to, { scroll: false }) })
        .fromTo(c.querySelector('.pc-panel'), { yPercent: 100 }, { yPercent: 0, duration: 0.75, ease: 'expo.inOut' }, 0)
        .fromTo(c.querySelector('.pc-line'), { scaleX: 0, transformOrigin: 'right center' }, { scaleX: 1, duration: 0.7, ease: 'expo.inOut' }, 0.05)
        .fromTo(c.querySelector('.pc-mark'), { opacity: 0, y: 24, scale: 0.94 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power3.out' }, 0.42)
        .to('#main', { y: -50, opacity: 0.6, duration: 0.75, ease: 'expo.inOut' }, 0);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [router]);

  return (
    <>
      {children}
      <div ref={curtain} aria-hidden className="page-curtain" style={{ visibility: 'hidden' }}>
        <div className="pc-panel absolute inset-0 bg-navy" style={{ transform: 'translateY(100%)' }}>
          <div className="absolute inset-0 grid place-items-center">
            <img src={asset('/img/logo-mark-white.png')} alt="" width={440} height={244} className="pc-mark h-16 w-auto opacity-0" />
          </div>
        </div>
        <div className="pc-line absolute inset-x-0 top-0 h-[2px] bg-sky" style={{ transform: 'scaleX(0)' }} />
      </div>
    </>
  );
}
