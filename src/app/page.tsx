import Link from 'next/link';
import { Img } from '@/components/Img';
import { Reveal } from '@/components/Reveal';
import { HeroHQ } from '@/components/HeroHQ';
import { HScroll } from '@/components/HScroll';
import { ServicesList } from '@/components/ServicesList';
import { StudioTeaser } from '@/components/StudioTeaser';
import { LeaderSpotlight } from '@/components/LeaderSpotlight';
import { SplitWords } from '@/components/SplitWords';
import { SectionHead, TextLink } from '@/components/ui';
import { CtaBand, ProcessSection, WhyDelma } from '@/components/sections';
import { images, wpc, upvc, aluminium, works, services } from '@/content/site';

export default function Home() {
  const featured = [
    { title: 'باب WPC سادة', sub: wpc.models[0].use, href: '/products/wpc-doors/', image: wpc.models[0].image, fit: 'contain' as const },
    { title: 'باب WPC حفر', sub: wpc.models[1].use, href: '/products/wpc-doors/', image: wpc.models[1].image, fit: 'contain' as const },
    { title: 'باب WPC مع زجاج', sub: wpc.models[2].use, href: '/products/wpc-doors/', image: wpc.models[2].image, fit: 'contain' as const },
    { title: 'باب WPC ديكور بارز', sub: wpc.models[3].use, href: '/products/wpc-doors/', image: wpc.models[3].image, fit: 'contain' as const },
    { title: 'شبابيك UPVC', sub: 'مفصلية وسحّابة ومقوّسة', href: '/products/upvc/', image: upvc.gallery[0] },
    { title: 'الألمنيوم والزجاج', sub: 'واجهات وأبواب وشبابيك', href: '/products/aluminium-glass/', image: aluminium.hero },
  ];
  const preview = works.slice(0, 5);

  return (
    <>
      <HeroHQ />

      {/* MANIFESTO — the words light up as you scroll */}
      <section id="about-brief" className="section">
        <div className="wrap">
          <span aria-hidden className="block h-px w-14 bg-sky" />
          <p className="mt-8 max-w-[24ch] text-[clamp(30px,4.6vw,68px)] font-semibold leading-[1.35] text-ink">
            <SplitWords text="منذ 2011 في الرياض، نصنع ونورّد ونركّب الأبواب والنوافذ وحلول الألمنيوم والزجاج، باهتمام بالخامة والمقاس وجودة التنفيذ." dim={0.12} />
          </p>
          <div className="mt-16 grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="t-lead"><SplitWords text="تأسست مؤسسة دلما الجزيرة للمقاولات في الرياض عام 2011، لتقديم حلول متخصصة للمنازل والفلل والمشروعات التجارية، من عرض السعر حتى المتابعة بعد التركيب." dim={0.2} /></p>
              <Reveal delay={120} className="mt-10"><TextLink href="/about/">تعرّف على المؤسسة</TextLink></Reveal>
            </div>
            <div className="grid grid-cols-5 gap-4 lg:col-span-6 lg:col-start-7">
              <Reveal img className="col-span-3"><div className="relative aspect-[3/4] overflow-hidden"><Img img={images.showroomWide} sizes="35vw" className="absolute inset-0 h-full w-full" position="30% 50%" /></div></Reveal>
              <Reveal img delay={150} className="col-span-2 self-end"><div className="relative aspect-[3/4] overflow-hidden"><Img img={images.hq} sizes="25vw" className="absolute inset-0 h-full w-full" position="62% 50%" /></div>
                <p className="mt-3 text-[13px] text-muted">المقر والمعرض — حي السعادة</p></Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* FIELDS */}
      <section className="section pt-0">
        <div className="wrap">
          <SectionHead kicker="fields" title="مجالاتنا" lead="ثلاثة مجالات متخصصة، تُنفَّذ وفق المقاسات والمواصفات المعتمدة لكل مشروع." />
          <ServicesList items={services} images={[wpc.hero, upvc.hero, aluminium.hero]} />
        </div>
      </section>

      <StudioTeaser />
      <WhyDelma image={images.showroomCorner} />

      <HScroll items={featured} heading={
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHead kicker="selected" title="منتجات مختارة" lead="أربعة موديلات من أبواب WPC، إلى جانب شبابيك UPVC وحلول الألمنيوم والزجاج." />
          <TextLink href="/products/">جميع المنتجات</TextLink>
        </div>
      } />

      {/* WORKS PREVIEW */}
      <section className="section">
        <div className="wrap">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHead kicker="work" title="نماذج من أعمالنا ومنتجاتنا" />
            <Reveal delay={80}><TextLink href="/works/">عرض جميع النماذج</TextLink></Reveal>
          </div>
          <div className="mt-[clamp(40px,6vw,72px)] grid grid-cols-2 gap-4 md:grid-cols-12 md:auto-rows-[clamp(200px,19vw,260px)] md:gap-5">
            {preview.map((w, i) => {
              const span = ['md:col-span-4 md:row-span-2', 'md:col-span-5', 'md:col-span-3 md:row-span-2', 'md:col-span-2', 'md:col-span-3'][i] + ' md:h-full';
              const ar = ['aspect-[3/4]', 'aspect-[4/3]', 'aspect-[3/4]', 'aspect-square', 'aspect-[4/3]'][i] + ' md:aspect-auto md:h-full';
              return (
                <Reveal img key={w.src + i} delay={i * 70} className={`${span} ${i === 0 ? 'col-span-2' : ''}`}>
                  <Link href="/works/" className="zoom group relative block overflow-hidden bg-mist md:h-full">
                    <div className={`relative ${ar}`}><Img img={w} sizes="(min-width:768px) 33vw, 50vw" className="absolute inset-0 h-full w-full" /></div>
                    <span className="absolute bottom-0 right-0 bg-navy/85 px-3 py-1.5 text-[12px] text-ink opacity-0 transition-opacity duration-500 group-hover:opacity-100">{w.tag}</span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <ProcessSection tone="mist" />
      <LeaderSpotlight />
      <CtaBand />
    </>
  );
}
