'use client';
import { useCallback, useEffect, useRef, type ReactNode } from 'react';

/** Accessible full-screen viewer: Esc closes, arrows navigate, focus is trapped on the dialog. */
export function Lightbox({ open, onClose, onPrev, onNext, label, children, caption }: {
  open: boolean; onClose: () => void; onPrev?: () => void; onNext?: () => void; label: string; children: ReactNode; caption?: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const key = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowLeft') onNext?.(); // RTL: left = next
    if (e.key === 'ArrowRight') onPrev?.();
  }, [onClose, onPrev, onNext]);
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    document.addEventListener('keydown', key); document.documentElement.style.overflow = 'hidden';
    ref.current?.focus();
    return () => { document.removeEventListener('keydown', key); document.documentElement.style.overflow = ''; prev?.focus(); };
  }, [open, key]);

  return (
    <div ref={ref} role="dialog" aria-modal="true" aria-label={label} tabIndex={-1} aria-hidden={!open}
      className={`fixed inset-0 z-[70] flex flex-col bg-[rgba(10,26,58,0.94)] outline-none transition-[opacity,visibility] duration-500 ease-[var(--ease-out-soft)] ${open ? 'visible opacity-100' : 'invisible opacity-0'}`}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="flex items-center justify-between px-5 py-4 text-white sm:px-8">
        <div className="text-[14px] text-white/80">{caption}</div>
        <button type="button" onClick={onClose} className="grid h-11 w-11 place-items-center text-white hover:text-sky" aria-label="إغلاق">
          <svg aria-hidden width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
        </button>
      </div>
      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-8 sm:px-20" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
        {onPrev ? <NavBtn side="right" label="السابق" onClick={onPrev} /> : null}
        <div className={`flex h-full w-full items-center justify-center transition-transform duration-500 ease-[var(--ease-out-soft)] ${open ? 'scale-100' : 'scale-[0.98]'}`}>{open ? children : null}</div>
        {onNext ? <NavBtn side="left" label="التالي" onClick={onNext} /> : null}
      </div>
    </div>
  );
}

function NavBtn({ side, label, onClick }: { side: 'left' | 'right'; label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} aria-label={label}
      className={`absolute top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center border border-white/25 text-white transition-colors hover:border-white hover:bg-white hover:text-navy ${side === 'left' ? 'left-3 sm:left-6' : 'right-3 sm:right-6'}`}>
      <svg aria-hidden width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ transform: side === 'right' ? 'scaleX(-1)' : undefined }}><path d="M19 12H5m0 0 6-6m-6 6 6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </button>
  );
}
