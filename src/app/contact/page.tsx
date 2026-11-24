import type { Metadata } from 'next';
import { Img } from '@/components/Img';
import { Reveal } from '@/components/Reveal';
import { Button, PageHero } from '@/components/ui';
import { QuoteForm } from '@/components/QuoteForm';
import { company, images, telHref, waHref } from '@/content/site';

export const metadata: Metadata = {
  title: 'تواصل معنا',
  description: 'تواصل مع مؤسسة دلما الجزيرة: المعرض في حي السعادة، شارع أبو عبيدة بن الجراح، الرياض. واتساب 0509468833.',
  alternates: { canonical: '/contact/' },
};

export default function Page() {
  const rows: [string, React.ReactNode][] = [
    ['الهاتف', <><a className="ulink num" href={telHref(company.phones.primary)}>{company.phones.primary}</a><span className="mx-3 text-line">|</span><a className="ulink num" href={telHref(company.phones.secondary)}>{company.phones.secondary}</a></>],
    ['واتساب', <a className="ulink num" href={waHref(company.phones.whatsapp)} target="_blank" rel="noopener noreferrer">{company.phones.whatsapp}</a>],
    ['البريد الإلكتروني', <a className="ulink num" href={`mailto:${company.email}`}>{company.email}</a>],
    ['العنوان', company.address],
    ['ساعات العمل', company.hours],
    ['التواصل الاجتماعي', <span className="flex flex-wrap gap-x-5 gap-y-1">{company.social.map((s) => <a key={s.label} className="ulink" href={s.url} target="_blank" rel="noopener noreferrer">{s.label} <span className="num text-muted">{s.handle}</span></a>)}</span>],
  ];
  return (
    <>
      <PageHero kicker="CONTACT" title="تواصل معنا" lead="يسعدنا استقبال استفساراتكم ومساعدتكم في اختيار الحلول المناسبة، وتقديم عروض الأسعار حسب متطلباتكم." />
      <section className="section">
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <dl>
              {rows.map(([k, v], i) => (
                <Reveal key={k} delay={i * 50} className="grid grid-cols-3 gap-4 border-t border-line py-5 last:border-b">
                  <dt className="text-[14px] text-muted">{k}</dt><dd className="col-span-2 text-[16px] leading-8 text-ink">{v}</dd>
                </Reveal>
              ))}
            </dl>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button href={company.mapsUrl} external>افتح الموقع في خرائط Google</Button>
              <Button href={waHref(company.phones.whatsapp)} external variant="ghost">راسلنا على واتساب</Button>
            </div>
          </div>
          <Reveal img className="lg:col-span-6">
            <a href={company.mapsUrl} target="_blank" rel="noopener noreferrer" className="zoom group relative block aspect-[4/3] overflow-hidden" aria-label="موقع المعرض على خرائط Google">
              <Img img={images.hq} sizes="(min-width:1024px) 50vw, 100vw" className="absolute inset-0 h-full w-full" position="60% 50%" />
              <span className="absolute bottom-0 right-0 bg-paper px-5 py-3 text-[14px] text-ink">المعرض — حي السعادة، الرياض · <span className="text-sky">الخريطة ↗</span></span>
            </a>
          </Reveal>
        </div>
      </section>
      <section className="section bg-mist">
        <div className="wrap grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className="t-h2 text-ink">أرسل استفسارك</h2>
            <p className="t-body mt-4">املأ النموذج وسنعود إليك على رقم الجوال.</p>
          </div>
          <div className="lg:col-span-8"><QuoteForm /></div>
        </div>
      </section>
    </>
  );
}
