import Link from 'next/link';
import type { ReactNode } from 'react';
import { SplitWords } from './SplitWords';

const Arrow = () => (
  <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="none" className="transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:-translate-x-1.5">
    <path d="M19 12H5m0 0 6-6m-6 6 6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

type BtnProps = { href: string; children: ReactNode; variant?: 'primary' | 'ghost' | 'light' | 'outline-light'; external?: boolean; className?: string };
const styles = {
  primary: 'bg-brand text-white hover:bg-navy',
  ghost: 'border border-ink/20 text-ink hover:border-ink hover:bg-ink hover:text-white',
  light: 'bg-white text-navy hover:bg-sky hover:text-white',
  'outline-light': 'border border-white/30 text-white hover:border-white hover:bg-white hover:text-navy',
};

/** Two button styles across the site; uniform 52px height. */
export function Button({ href, children, variant = 'primary', external, className = '' }: BtnProps) {
  const cls = `group inline-flex h-[52px] items-center justify-center gap-3 px-7 text-[15px] font-medium transition-colors duration-300 ${styles[variant]} ${className}`;
  if (external) return <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{children}<Arrow /></a>;
  return <Link href={href} className={cls}>{children}<Arrow /></Link>;
}

export function TextLink({ href, children, className = '' }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link href={href} className={`group inline-flex items-center gap-2 text-[15px] font-medium text-brand ${className}`}>
      <span className="ulink">{children}</span><Arrow />
    </Link>
  );
}

/** Small numbered kicker + title, aligned to the RTL grid */
export function SectionHead({ kicker, title, lead, light = false, className = '' }: { kicker: string; title: ReactNode; lead?: ReactNode; light?: boolean; className?: string }) {
  return (
    <div className={className}>
      <span aria-hidden className="block h-px w-12 bg-sky" data-kicker={kicker} />
      <h2 className={`t-h2 mt-6 ${light ? 'text-white' : 'text-ink'}`}>{typeof title === 'string' ? <SplitWords text={title} /> : title}</h2>
      {lead ? <p className={`t-lead mt-5 max-w-[60ch] ${light ? '!text-white/70' : ''}`}>{lead}</p> : null}
    </div>
  );
}

export function PageHero({ kicker, title, lead, children }: { kicker: string; title: ReactNode; lead?: ReactNode; children?: ReactNode }) {
  return (
    <section className="border-b border-line bg-mist pt-[132px] pb-[clamp(48px,7vw,96px)]">
      <div className="wrap">
        <nav aria-label="مسار التصفح" className="text-[14px] text-muted" data-kicker={kicker}><Link href="/" className="ulink">الرئيسية</Link><span className="mx-2 text-line">/</span><span className="text-ink">{typeof title === 'string' ? title : ''}</span></nav>
        <h1 className="t-h1 mt-6 max-w-[18ch] text-ink">{typeof title === 'string' ? <SplitWords now text={title} delay={350} stagger={70} /> : title}</h1>
        {lead ? <p className="t-lead mt-6 max-w-[62ch]">{lead}</p> : null}
        {children}
      </div>
    </section>
  );
}
