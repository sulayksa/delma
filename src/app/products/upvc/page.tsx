import type { Metadata } from 'next';
import { Reveal } from '@/components/Reveal';
import { Gallery } from '@/components/Gallery';
import { SectionHead } from '@/components/ui';
import { CtaBand } from '@/components/sections';
import { Models, ProductHero, Related } from '@/components/ProductBlocks';
import { upvc } from '@/content/site';

export const metadata: Metadata = {
  title: 'أبواب وشبابيك UPVC في الرياض',
  description: 'شبابيك UPVC مفصلية وسحّابة ومقوّسة، وأبواب شرائح وأبواب زجاج، من دلما الجزيرة في الرياض — وفق المقاسات المطلوبة.',
  alternates: { canonical: '/products/upvc/' },
};

export default function Page() {
  return (
    <>
      <ProductHero kicker={upvc.kicker} title={upvc.title} intro={upvc.intro} image={upvc.hero} crumbs="UPVC" />
      <Models kicker="TYPES" title="الأنواع المتوفرة" items={upvc.models} contain={false} />
      <section className="section bg-mist">
        <div className="wrap grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5"><SectionHead kicker="SYSTEMS" title="أنظمة القطاعات والفتح" lead="خصائص العزل الحراري والصوتي تختلف بحسب مواصفات المنتج والزجاج وطريقة التركيب." /></Reveal>
          <ol className="lg:col-span-6 lg:col-start-7">
            {upvc.systems.map((s, i) => (
              <Reveal as="li" key={s} delay={i * 80} className="flex items-baseline gap-6 border-t border-line py-6 last:border-b">
                <span className="num text-[13px] text-sky-ink">0{i + 1}</span><span className="text-[18px] text-ink">{s}</span>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>
      <section className="section">
        <div className="wrap">
          <Reveal><SectionHead kicker="EXECUTED" title="نماذج من شبابيك UPVC المنفّذة" className="mb-12" /></Reveal>
          <Gallery items={upvc.gallery} />
        </div>
      </section>
      <Related current="upvc" />
      <CtaBand />
    </>
  );
}
