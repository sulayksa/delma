import type { Metadata } from 'next';
import { QuoteForm } from '@/components/QuoteForm';
import { PageHero } from '@/components/ui';
import { company, telHref, waHref } from '@/content/site';

export const metadata: Metadata = {
  title: 'طلب عرض سعر',
  description: 'اطلب عرض سعر لأبواب WPC أو شبابيك UPVC أو أعمال الألمنيوم والزجاج من دلما الجزيرة في الرياض.',
  alternates: { canonical: '/quote/' },
};

export default function Page() {
  return (
    <>
      <PageHero kicker="REQUEST A QUOTE" title="طلب عرض سعر" lead="أرسل تفاصيل طلبك والمقاسات المتاحة، وأرفق الصور أو المخططات إن وُجدت." />
      <section className="section bg-mist">
        <div className="wrap grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8"><QuoteForm /></div>
          <aside className="lg:col-span-3 lg:col-start-10">
            <h2 className="text-[15px] font-semibold text-ink">تفضّل التواصل المباشر؟</h2>
            <ul className="mt-5 space-y-4 text-[15px]">
              <li><a href={waHref(company.phones.whatsapp)} target="_blank" rel="noopener noreferrer" className="ulink text-sky">واتساب <span className="num">{company.phones.whatsapp}</span></a></li>
              <li><a href={telHref(company.phones.primary)} className="ulink num text-ink">{company.phones.primary}</a></li>
              <li><a href={telHref(company.phones.secondary)} className="ulink num text-ink">{company.phones.secondary}</a></li>
            </ul>
            <p className="mt-8 border-t border-line pt-6 text-[14px] leading-7 text-body">{company.hours}</p>
          </aside>
        </div>
      </section>
    </>
  );
}
