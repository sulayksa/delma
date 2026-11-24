import type { Metadata } from 'next';
import Link from 'next/link';
import { Img } from '@/components/Img';
import { Reveal } from '@/components/Reveal';
import { Button, PageHero } from '@/components/ui';
import { CtaBand, ProcessSection } from '@/components/sections';
import { services, wpc, upvc, aluminium } from '@/content/site';

export const metadata: Metadata = {
  title: 'منتجاتنا وخدماتنا',
  description: 'أبواب WPC وPVC، أبواب وشبابيك UPVC، وأعمال الألمنيوم والزجاج والواجهات — تصنيع وتوريد وتركيب في الرياض.',
  alternates: { canonical: '/products/' },
};

const subs: Record<string, string[]> = {
  'wpc-doors': wpc.models.map((m) => m.name),
  upvc: upvc.models.map((m) => m.name),
  'aluminium-glass': aluminium.items.map((m) => m.title),
};

export default function Page() {
  return (
    <>
      <PageHero kicker="PRODUCTS & SERVICES" title="منتجاتنا وخدماتنا" lead="حلول متنوعة للمساحات السكنية والتجارية: تصنيع وتوريد وتركيب وفق المقاسات والمواصفات المطلوبة.">
        <div className="mt-9 flex flex-wrap gap-3"><Button href="/door-studio/">جرّب الأبواب والشبابيك ثلاثية الأبعاد</Button><Button href="/quote/" variant="ghost">اطلب عرض سعر</Button></div>
      </PageHero>
      <section className="section">
        <div className="wrap space-y-[clamp(64px,9vw,128px)]">
          {services.map((s, i) => (
            <article key={s.slug} className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
              <Reveal img className={`lg:col-span-7 ${i % 2 ? 'lg:order-2' : ''}`}>
                <Link href={`/products/${s.slug}/`} className="lux zoom relative block aspect-[16/11] overflow-hidden">
                  <Img img={i === 0 ? wpc.hero : i === 1 ? upvc.hero : s.image} sizes="(min-width:1024px) 58vw, 100vw" className="absolute inset-0 h-full w-full" />
                </Link>
              </Reveal>
              <div className={`lg:col-span-5 ${i % 2 ? 'lg:order-1' : ''}`}>
                <Reveal delay={60}><h2 className="t-h2 text-ink">{s.title}</h2></Reveal>
                <Reveal delay={100}><p className="t-lead mt-4">{s.lead}</p></Reveal>
                <Reveal delay={140}>
                  <ul className="mt-8 border-t border-line">
                    {subs[s.slug].map((t) => <li key={t} className="border-b border-line py-3 text-[15px] text-ink">{t}</li>)}
                  </ul>
                </Reveal>
                <Reveal delay={180}>
                  <Link href={`/products/${s.slug}/`} className="group mt-8 inline-flex items-center gap-2 text-[15px] font-medium text-accent"><span className="ulink">التفاصيل والصور</span>
                    <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="none" className="transition-transform duration-500 group-hover:-translate-x-1.5"><path d="M19 12H5m0 0 6-6m-6 6 6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </Link>
                </Reveal>
              </div>
            </article>
          ))}
        </div>
      </section>
      <ProcessSection tone="mist" />
      <CtaBand />
    </>
  );
}
