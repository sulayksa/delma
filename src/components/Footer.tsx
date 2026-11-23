import Link from 'next/link';
import { company, nav, telHref, waHref } from '@/content/site';
import { asset } from '@/lib/paths';

export function Footer() {
  const year = new Date().getFullYear();
  const products = nav.find((n) => n.children)?.children ?? [];
  return (
    <footer className="bg-navy text-white">
      <div className="wrap grid gap-12 py-[clamp(56px,8vw,104px)] md:grid-cols-12">
        <div className="md:col-span-4">
          <img src={asset('/img/logo-mark-white.png')} alt={company.nameAr} width={440} height={244} className="h-12 w-auto" loading="lazy" />
          <p className="mt-6 max-w-[34ch] text-[15px] leading-8 text-white/65">
            {company.nameAr} — تصنيع وتوريد وتركيب الأبواب والنوافذ وحلول الألمنيوم والزجاج في الرياض منذ <span className="num">{company.founded}</span>.
          </p>
        </div>
        <div className="md:col-span-2">
          <h2 className="text-[13px] font-semibold text-sky">الصفحات</h2>
          <ul className="mt-5 space-y-3 text-[15px] text-white/75">
            {nav.filter((n) => !n.children).map((n) => <li key={n.href}><Link className="ulink hover:text-white" href={n.href}>{n.label}</Link></li>)}
            <li><Link className="ulink hover:text-white" href="/quote/">طلب عرض سعر</Link></li>
          </ul>
        </div>
        <div className="md:col-span-3">
          <h2 className="text-[13px] font-semibold text-sky">منتجاتنا وخدماتنا</h2>
          <ul className="mt-5 space-y-3 text-[15px] text-white/75">
            {products.map((n) => <li key={n.href}><Link className="ulink hover:text-white" href={n.href}>{n.label}</Link></li>)}
          </ul>
        </div>
        <div className="md:col-span-3">
          <h2 className="text-[13px] font-semibold text-sky">تواصل معنا</h2>
          <ul className="mt-5 space-y-3 text-[15px] text-white/75">
            <li><a className="ulink num hover:text-white" href={telHref(company.phones.primary)}>{company.phones.primary}</a> · <a className="ulink num hover:text-white" href={telHref(company.phones.secondary)}>{company.phones.secondary}</a></li>
            <li><a className="ulink hover:text-white" href={waHref(company.phones.whatsapp)} target="_blank" rel="noopener noreferrer">واتساب <span className="num">{company.phones.whatsapp}</span></a></li>
            <li><a className="ulink num hover:text-white" href={`mailto:${company.email}`}>{company.email}</a></li>
            <li className="leading-7">{company.address}</li>
          </ul>
          <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[14px] text-white/70">
            {company.social.map((s) => <li key={s.label}><a className="ulink hover:text-white" href={s.url} target="_blank" rel="noopener noreferrer">{s.label}</a></li>)}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="wrap flex flex-col gap-2 py-6 text-[13px] text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© <span className="num">{year}</span> {company.nameAr}. جميع الحقوق محفوظة.</p>
          <p className="num">{company.nameEn}</p>
        </div>
      </div>
    </footer>
  );
}
