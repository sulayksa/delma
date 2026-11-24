import Link from 'next/link';
import { company, nav, telHref, waHref } from '@/content/site';
import { asset } from '@/lib/paths';

/** Compact footer: brand + quick contact on one row, every link on one wrapping line, then a thin legal strip. */
export function Footer() {
  const year = new Date().getFullYear();
  const links = [...nav.filter((n) => !n.children), ...(nav.find((n) => n.children)?.children ?? []), { href: '/quote/', label: 'طلب عرض سعر' }];
  const chip = 'inline-flex items-center gap-2 border border-white/15 px-3.5 py-2 text-[13px] text-white/85 transition-colors hover:border-sky hover:text-white';
  return (
    <footer className="on-dark bg-navy text-white">
      <div className="wrap py-[clamp(32px,4.5vw,52px)]">
        <div className="flex flex-wrap items-center justify-between gap-x-10 gap-y-5">
          <div className="flex items-center gap-4">
            <img src={asset('/img/logo-mark-white.png')} alt={company.nameAr} width={440} height={244} className="h-10 w-auto" loading="lazy" />
            <p className="hidden whitespace-nowrap text-[13px] leading-6 text-white/60 sm:block">{company.nameAr} — {company.city}، منذ <span className="num">{company.founded}</span></p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a className={chip} href={waHref(company.phones.whatsapp)} target="_blank" rel="noopener noreferrer">واتساب <span className="num" dir="ltr">{company.phones.whatsapp}</span></a>
            <a className={chip} href={telHref(company.phones.secondary)}>اتصال <span className="num" dir="ltr">{company.phones.secondary}</span></a>
            <a className={chip} href={`mailto:${company.email}`}><span className="num" dir="ltr">{company.email}</span></a>
          </div>
        </div>
        <nav aria-label="روابط الموقع" className="mt-6 border-t border-white/10 pt-5">
          <ul className="flex flex-wrap gap-x-5 gap-y-2.5 text-[14px] text-white/70">
            {links.map((n) => <li key={n.href}><Link className="ulink hover:text-white" href={n.href}>{n.label}</Link></li>)}
          </ul>
        </nav>
      </div>
      <div className="border-t border-white/10">
        <div className="wrap flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-4 text-[12px] text-white/55">
          <p>© <span className="num">{year}</span> {company.nameAr}</p>
          <ul className="flex flex-wrap gap-x-4 gap-y-1">
            {company.social.map((s) => <li key={s.label}><a className="ulink hover:text-white" href={s.url} target="_blank" rel="noopener noreferrer">{s.label}</a></li>)}
          </ul>
        </div>
      </div>
    </footer>
  );
}
