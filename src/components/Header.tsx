'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { nav, company } from '@/content/site';
import { asset } from '@/lib/paths';

export function Header() {
  const path = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [drop, setDrop] = useState(false);
  const ticking = useRef(false);

  useEffect(() => {
    const on = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => { setScrolled(window.scrollY > 24); ticking.current = false; });
    };
    on(); window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  useEffect(() => { setOpen(false); setDrop(false); }, [path]);
  useEffect(() => { document.documentElement.style.overflow = open ? 'hidden' : ''; }, [open]);

  const overHero = false;
  const isActive = (href: string) => (href === '/' ? path === '/' : path?.startsWith(href.replace(/\/$/, '')));

  return (
    <>
      <header
        className={`${overHero ? 'on-dark' : ''} fixed inset-x-0 top-0 z-50 border-b transition-[height,background-color,border-color] duration-500 ease-[var(--ease-out-soft)] ${scrolled || open ? 'h-[68px] border-line bg-white/[0.97]' : 'h-[88px] border-transparent bg-white/0'}`}
      >
        <div className="wrap flex h-full items-center justify-between gap-6">
          <Link href="/" aria-label={`${company.nameAr} — الرئيسية`} className="shrink-0">
            <img src={asset(overHero ? '/img/logo-mark-white.png' : '/img/logo-mark.png')} alt={company.nameAr} width={440} height={244}
              className={`w-auto transition-[height] duration-500 ease-[var(--ease-out-soft)] ${scrolled ? 'h-9' : 'h-11'}`} />
          </Link>

          <nav aria-label="القائمة الرئيسية" className="hidden lg:block">
            <ul className="flex items-center gap-8">
              {nav.map((n) => (
                <li key={n.href} className="relative"
                  onMouseEnter={() => n.children && setDrop(true)} onMouseLeave={() => n.children && setDrop(false)}>
                  <Link href={n.href} aria-current={isActive(n.href) ? 'page' : undefined}
                    aria-haspopup={n.children ? 'true' : undefined} aria-expanded={n.children ? drop : undefined}
                    onFocus={() => n.children && setDrop(true)}
                    className={`relative py-2 text-[15px] transition-colors duration-300 hover:text-accent ${isActive(n.href) ? 'text-accent' : 'text-ink'}`}>
                    {n.label}
                    <span className={`absolute -bottom-0.5 right-0 h-px bg-sky transition-[width] duration-500 ease-[var(--ease-out-soft)] ${isActive(n.href) ? 'w-full' : 'w-0'}`} />
                  </Link>
                  {n.children ? (
                    <div className={`absolute right-[-20px] top-full pt-4 transition-[opacity,transform] duration-300 ease-[var(--ease-out-soft)] ${drop ? 'pointer-events-auto opacity-100 translate-y-0' : 'pointer-events-none opacity-0 -translate-y-1'}`}>
                      <ul className="w-[290px] border border-line bg-paper py-3 shadow-[0_18px_40px_rgba(10,26,58,0.08)]">
                        {n.children.map((c, i) => (
                          <li key={c.href}>
                            <Link href={c.href} onBlur={() => i === n.children!.length - 1 && setDrop(false)}
                              className="group flex items-center justify-between px-5 py-3 text-[15px] text-ink transition-colors hover:bg-mist hover:text-accent">
                              {c.label}<span className="num text-[11px] text-muted">0{i + 1}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/quote/" className="hidden h-11 items-center btn-primary px-5 text-[14px] font-medium transition-colors duration-300  sm:inline-flex">
              اطلب عرض سعر
            </Link>
            <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? 'إغلاق القائمة' : 'فتح القائمة'}
              className="relative grid h-11 w-11 place-items-center lg:hidden">
              <span className={`absolute h-px w-6 bg-ink transition-transform duration-500 ease-[var(--ease-out-soft)] ${open ? 'rotate-45' : '-translate-y-[4px]'}`} />
              <span className={`absolute h-px w-6 bg-ink transition-transform duration-500 ease-[var(--ease-out-soft)] ${open ? '-rotate-45' : 'translate-y-[4px]'}`} />
            </button>
          </div>
        </div>
      </header>

      {/* mobile menu */}
      <div id="mobile-menu" aria-hidden={!open}
        className={`fixed inset-0 z-40 bg-paper pt-[68px] transition-[opacity,visibility] duration-500 ease-[var(--ease-out-soft)] lg:hidden ${open ? 'visible opacity-100' : 'invisible opacity-0'}`}>
        <nav aria-label="قائمة الجوال" className="wrap flex h-full flex-col overflow-y-auto pb-10 pt-6">
          <ul>
            {nav.map((n, i) => (
              <li key={n.href} className="border-b border-line"
                style={{ transition: 'transform .6s var(--ease-out-soft), opacity .6s', transitionDelay: open ? `${60 + i * 40}ms` : '0ms', transform: open ? 'none' : 'translateY(12px)', opacity: open ? 1 : 0 }}>
                <Link href={n.href} tabIndex={open ? 0 : -1} className={`flex items-center justify-between py-5 text-[22px] font-medium ${isActive(n.href) ? 'text-accent' : 'text-ink'}`}>
                  {n.label}<span className="num text-[12px] text-muted">0{i + 1}</span>
                </Link>
                {n.children ? (
                  <ul className="-mt-2 pb-4">
                    {n.children.map((c) => (
                      <li key={c.href}><Link href={c.href} tabIndex={open ? 0 : -1} className="block py-2.5 pr-4 text-[16px] text-body">{c.label}</Link></li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
          <Link href="/quote/" tabIndex={open ? 0 : -1} className="mt-8 inline-flex h-[52px] items-center justify-center bg-brand text-[16px] font-medium text-white">اطلب عرض سعر</Link>
        </nav>
      </div>
    </>
  );
}
