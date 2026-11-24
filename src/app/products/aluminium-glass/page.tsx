import type { Metadata } from 'next';
import { Img } from '@/components/Img';
import { Reveal } from '@/components/Reveal';
import { SectionHead } from '@/components/ui';
import { CtaBand } from '@/components/sections';
import { ProductHero, Related } from '@/components/ProductBlocks';
import { aluminium } from '@/content/site';

export const metadata: Metadata = {
  title: 'أعمال الألمنيوم والزجاج والواجهات الزجاجية في الرياض',
  description: 'واجهات الاستركشر والسبايدر، أبواب وشبابيك الألمنيوم، زجاج السيكوريت، وواجهات الكلادينج — من دلما الجزيرة في الرياض.',
  alternates: { canonical: '/products/aluminium-glass/' },
};

export default function Page() {
  return (
    <>
      <ProductHero kicker={aluminium.kicker} title={aluminium.title} intro={aluminium.intro} image={aluminium.hero} crumbs="الألمنيوم والزجاج" />
      <section className="section">
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <Reveal><SectionHead kicker="SOLUTIONS" title="حلول للواجهات والأبواب والنوافذ" /></Reveal>
            <Reveal img delay={100} className="mt-10 hidden lg:block">
              <div className="lux relative aspect-square overflow-hidden"><Img img={aluminium.hero} sizes="30vw" className="absolute inset-0 h-full w-full" /></div>
            </Reveal>
          </div>
          <ol className="lg:col-span-7 lg:col-start-6">
            {aluminium.items.map((it, i) => (
              <Reveal as="li" key={it.no} delay={i * 60} className="grid grid-cols-12 gap-4 border-t border-line py-8 last:border-b">
                <h3 className="t-h3 col-span-12 text-ink sm:col-span-6">{it.title}</h3>
                <p className="t-body col-span-12 sm:col-span-6">{it.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>
      <section className="border-y border-line bg-mist">
        <div className="wrap py-10 text-[15px] leading-8 text-body">الأسعار حسب المقاسات والمخططات والمواصفات المعتمدة لكل مشروع — أرسل المخططات مع طلب عرض السعر.</div>
      </section>
      <Related current="aluminium-glass" />
      <CtaBand />
    </>
  );
}
