import Link from 'next/link';
import { Img } from '@/components/Img';
import { Reveal } from '@/components/Reveal';
import { HeroDoor } from '@/components/HeroDoor';
import { HScroll } from '@/components/HScroll';
import { StackServices } from '@/components/StackServices';
import { StudioTeaser } from '@/components/StudioTeaser';
import { Button, SectionHead, TextLink } from '@/components/ui';
import { CtaBand, Leadership, ProcessSection, WhyDelma } from '@/components/sections';
import { company, images, wpc, upvc, aluminium, works, services } from '@/content/site';

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
      <HeroDoor />

      {/* ABOUT BRIEF */}
      <section id="about-brief" className="section border-t border-line">
        <div className="wrap grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal><SectionHead kicker="ABOUT" title={<>خبرة ممتدة منذ <span className="num">2011</span></>} /></Reveal>
            <Reveal delay={80}>
              <p className="t-lead mt-6">
                تأسست {company.nameAr} في الرياض عام <span className="num">2011</span>، لتقديم حلول متخصصة في الأبواب والنوافذ والألمنيوم والزجاج، مع الاهتمام باختيار الخامات، ودقة المقاسات، وجودة التصنيع والتركيب.
              </p>
            </Reveal>
            <Reveal delay={140}>
              <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-line pt-6 text-[14px]">
                <div><dt className="text-muted">التأسيس</dt><dd className="num mt-1 text-[17px] font-medium text-ink">2011</dd></div>
                <div><dt className="text-muted">المقر</dt><dd className="mt-1 text-[17px] font-medium text-ink">الرياض</dd></div>
                <div><dt className="text-muted">القطاعات</dt><dd className="mt-1 text-[15px] font-medium leading-7 text-ink">فلل · منازل · تجاري</dd></div>
              </dl>
            </Reveal>
            <Reveal delay={200} className="mt-10"><TextLink href="/about/">تعرّف على المؤسسة</TextLink></Reveal>
          </div>
          <div className="grid grid-cols-5 gap-4 lg:col-span-7">
            <Reveal img className="col-span-3"><div className="relative aspect-[3/4] overflow-hidden"><Img img={images.showroomWide} sizes="35vw" className="absolute inset-0 h-full w-full" position="30% 50%" /></div></Reveal>
            <Reveal img delay={150} className="col-span-2 self-end"><div className="relative aspect-[3/4] overflow-hidden"><Img img={images.hqSign} sizes="25vw" className="absolute inset-0 h-full w-full" position="55% 50%" /></div>
              <p className="mt-3 text-[13px] text-muted">مقر المؤسسة في الرياض</p></Reveal>
          </div>
        </div>
      </section>

      <section className="pt-[clamp(72px,10vw,152px)]">
        <div className="wrap">
          <Reveal><SectionHead kicker="OUR FIELDS" title="مجالاتنا" lead="ثلاثة مجالات متخصصة، تُنفَّذ وفق المقاسات والمواصفات المعتمدة لكل مشروع." /></Reveal>
          <div className="mt-[clamp(40px,6vw,72px)]"><StackServices items={services} images={[wpc.hero, upvc.hero, aluminium.hero]} /></div>
        </div>
      </section>
      <StudioTeaser />
      <WhyDelma image={images.showroomCorner} />

      {/* FEATURED PRODUCTS — pinned horizontal 3D gallery */}
      <HScroll items={featured} heading={
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHead kicker="SELECTED PRODUCTS" title="منتجات مختارة" lead="أربعة موديلات من أبواب WPC، إلى جانب شبابيك UPVC وحلول الألمنيوم والزجاج." />
          <TextLink href="/products/">جميع المنتجات</TextLink>
        </div>
      } />

      {/* WORKS PREVIEW */}
      <section className="section bg-mist">
        <div className="wrap">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <Reveal><SectionHead kicker="OUR WORK" title="نماذج من أعمالنا ومنتجاتنا" /></Reveal>
            <Reveal delay={80}><TextLink href="/works/">عرض جميع النماذج</TextLink></Reveal>
          </div>
          <div className="mt-[clamp(40px,6vw,72px)] grid grid-cols-2 gap-4 md:grid-cols-12 md:auto-rows-[clamp(200px,19vw,260px)] md:gap-5">
            {preview.map((w, i) => {
              const span = ['md:col-span-4 md:row-span-2', 'md:col-span-5', 'md:col-span-3 md:row-span-2', 'md:col-span-2', 'md:col-span-3'][i] + ' md:h-full';
              const ar = ['aspect-[3/4]', 'aspect-[4/3]', 'aspect-[3/4]', 'aspect-square', 'aspect-[4/3]'][i] + ' md:aspect-auto md:h-full';
              return (
                <Reveal img key={w.src + i} delay={i * 70} className={`${span} ${i === 0 ? 'col-span-2' : ''}`}>
                  <Link href="/works/" className="zoom group relative block overflow-hidden bg-white md:h-full">
                    <div className={`relative ${ar}`}><Img img={w} sizes="(min-width:768px) 33vw, 50vw" className="absolute inset-0 h-full w-full" /></div>
                    <span className="absolute bottom-0 right-0 bg-white/95 px-3 py-1.5 text-[12px] text-ink opacity-0 transition-opacity duration-500 group-hover:opacity-100">{w.tag}</span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <ProcessSection />
      <Leadership compact />
      <CtaBand />
    </>
  );
}
