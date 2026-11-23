import type { Metadata } from 'next';
import { Img } from '@/components/Img';
import { Reveal } from '@/components/Reveal';
import { Gallery } from '@/components/Gallery';
import { SectionHead, TextLink } from '@/components/ui';
import { CtaBand } from '@/components/sections';
import { Models, ProductHero, Related } from '@/components/ProductBlocks';
import { wpc, colors } from '@/content/site';
import { asset } from '@/lib/paths';

export const metadata: Metadata = {
  title: 'أبواب WPC في الرياض',
  description: 'أبواب WPC من دلما الجزيرة في الرياض: أربعة موديلات (سادة، حفر، مع زجاج، ديكور بارز) و19 لونًا، تصنيع وتوريد وتركيب وفق المقاسات المطلوبة.',
  alternates: { canonical: '/products/wpc-doors/' },
};

export default function Page() {
  return (
    <>
      <ProductHero kicker={wpc.kicker} title={wpc.title} intro={wpc.intro} image={wpc.hero} crumbs="أبواب WPC" />
      <Models kicker="MODELS" title="الموديلات المتوفرة" items={wpc.models} />

      {/* details & specs */}
      <section className="section bg-mist">
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal><SectionHead kicker="DETAILS" title="تفاصيل التشطيب من الإطار إلى المقبض" lead="قطاعات الإطار ومقاطع الأبواب كما تظهر في عينات المؤسسة." /></Reveal>
            <Reveal delay={80}>
              <dl className="mt-10 grid grid-cols-3 border-t border-line">
                {wpc.specs.map((s) => (
                  <div key={s.label} className="border-l border-line py-6 pl-4 last:border-l-0">
                    <dd className="num text-[26px] font-semibold text-ink">{s.value}</dd>
                    <dt className="mt-2 text-[13px] leading-6 text-body">{s.label}</dt>
                  </div>
                ))}
              </dl>
              <p className="mt-4 text-[12px] text-muted">{wpc.specsSource}</p>
            </Reveal>
          </div>
          <div className="grid grid-cols-2 gap-4 lg:col-span-7">
            <Reveal img className="row-span-2"><div className="relative h-full min-h-[320px] overflow-hidden bg-white"><Img img={wpc.details[0]} fit="contain" sizes="30vw" className="absolute inset-0 h-full w-full p-6" /></div></Reveal>
            <Reveal img delay={100}><div className="relative aspect-[4/3] overflow-hidden bg-white"><Img img={wpc.details[1]} fit="contain" sizes="25vw" className="absolute inset-0 h-full w-full p-5" /></div></Reveal>
            <Reveal img delay={180}><div className="relative aspect-[4/3] overflow-hidden bg-white"><Img img={wpc.details[2]} fit="contain" sizes="25vw" className="absolute inset-0 h-full w-full p-5" /></div></Reveal>
          </div>
        </div>
      </section>

      {/* colours teaser */}
      <section className="section">
        <div className="wrap grid items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Reveal><SectionHead kicker="COLOURS" title={<><span className="num">19</span> لونًا ضمن الكتالوج</>} lead="درجات خشبية وفاتحة ورمادية تناسب أنماط التصميم الداخلي المختلفة." /></Reveal>
            <Reveal delay={80} className="mt-8"><TextLink href="/catalogue/">تصفّح كتالوج الألوان</TextLink></Reveal>
          </div>
          <ul className="grid grid-cols-5 gap-2 sm:grid-cols-10 lg:col-span-8">
            {colors.slice(0, 10).map((c, i) => (
              <Reveal as="li" key={c} delay={i * 40}>
                <img src={asset(`/img/colors/${c}-sm.webp`)} alt={`لون ${c}`} width={360} height={442} loading="lazy" className="aspect-[3/5] w-full object-cover" />
                <span className="num mt-1.5 block text-[11px] text-muted">{c}</span>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="section bg-mist">
        <div className="wrap">
          <Reveal><SectionHead kicker="SHOWROOM" title="من المعرض" className="mb-12" /></Reveal>
          <Gallery items={wpc.gallery} />
        </div>
      </section>
      <Related current="wpc-doors" />
      <CtaBand />
    </>
  );
}
