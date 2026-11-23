'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { company, telHref, waHref } from '@/content/site';

/** Single floating contact button (bottom-left) that opens three options. */
export function ContactFab() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const studio = usePathname()?.includes('door-studio');
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === 'Escape' : !ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close); document.addEventListener('keydown', close);
    return () => { document.removeEventListener('mousedown', close); document.removeEventListener('keydown', close); };
  }, [open]);

  const items = [
    { label: 'واتساب', sub: company.phones.whatsapp, href: waHref(company.phones.whatsapp, 'السلام عليكم، أرغب في الاستفسار عن منتجاتكم.'), ext: true,
      icon: <path d="M20.5 3.5A11 11 0 0 0 3.3 17.1L2 22l5-1.3A11 11 0 0 0 20.5 3.5Zm-8.4 16.9a9.1 9.1 0 0 1-4.6-1.3l-.3-.2-3 .8.8-2.9-.2-.3a9.1 9.1 0 1 1 7.3 3.9Zm5-6.8c-.3-.1-1.6-.8-1.9-.9s-.4-.1-.6.1-.7.9-.9 1.1-.3.2-.6.1a7.5 7.5 0 0 1-3.7-3.2c-.3-.5.3-.5.8-1.6.1-.2 0-.4 0-.5l-.8-2c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.3.8 3.2.7a2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.6-.3Z" fill="currentColor" /> },
    { label: 'اتصال هاتفي', sub: company.phones.primary, href: telHref(company.phones.primary), ext: false,
      icon: <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.2 11.4 11.4 0 0 0 3.6.6 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.2.2 2.4.6 3.6a1 1 0 0 1-.3 1Z" fill="none" stroke="currentColor" strokeWidth="1.5" /> },
    { label: 'طلب عرض سعر', sub: 'نموذج مختصر', href: '/quote/', ext: false, internal: true,
      icon: <path d="M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /> },
  ];

  return (
    <div ref={ref} className={`fixed bottom-[max(20px,env(safe-area-inset-bottom))] left-5 z-40 sm:left-7 ${studio ? 'max-lg:hidden' : ''}`}>
      <div className={`absolute bottom-[68px] left-0 w-[250px] origin-bottom-left border border-line bg-white shadow-[0_24px_60px_rgba(10,26,58,0.14)] transition-[opacity,transform] duration-400 ease-[var(--ease-out-soft)] ${open ? 'pointer-events-auto scale-100 opacity-100' : 'pointer-events-none scale-[0.96] opacity-0'}`}
        role="menu" aria-hidden={!open}>
        {items.map((it, i) => {
          const inner = (
            <>
              <span className="grid h-10 w-10 shrink-0 place-items-center bg-mist text-brand"><svg aria-hidden width="20" height="20" viewBox="0 0 24 24">{it.icon}</svg></span>
              <span className="flex flex-col"><span className="text-[15px] font-medium text-ink">{it.label}</span><span className="num text-right text-[12px] text-muted">{it.sub}</span></span>
            </>
          );
          const cls = `flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-mist ${i ? 'border-t border-line' : ''}`;
          return it.internal
            ? <Link key={it.label} role="menuitem" tabIndex={open ? 0 : -1} href={it.href} className={cls} onClick={() => setOpen(false)}>{inner}</Link>
            : <a key={it.label} role="menuitem" tabIndex={open ? 0 : -1} href={it.href} className={cls} {...(it.ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{inner}</a>;
        })}
      </div>
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-haspopup="menu" aria-label={open ? 'إغلاق خيارات التواصل' : 'خيارات التواصل'}
        className="grid h-14 w-14 place-items-center rounded-full bg-brand text-white shadow-[0_10px_28px_rgba(0,62,154,0.28)] transition-[background-color,transform] duration-300 hover:-translate-y-0.5 hover:bg-navy">
        <svg aria-hidden width="24" height="24" viewBox="0 0 24 24" fill="none" className="transition-transform duration-500 ease-[var(--ease-out-soft)]" style={{ transform: open ? 'rotate(90deg)' : 'none' }}>
          {open
            ? <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            : <path d="M4 13v-1a8 8 0 0 1 16 0v1M4 13a2 2 0 0 1 2-2h1v6H6a2 2 0 0 1-2-2v-2Zm16 0a2 2 0 0 0-2-2h-1v6h1a2 2 0 0 0 2-2v-2Zm-3 4c0 2-2 3-5 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />}
        </svg>
      </button>
    </div>
  );
}
