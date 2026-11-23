import Link from 'next/link';
import { Img } from '@/components/Img';
import { Reveal } from '@/components/Reveal';
import { Parallax } from '@/components/Parallax';
import { Featured } from '@/components/Featured';
import { Button, SectionHead, TextLink } from '@/components/ui';
import { CtaBand, Leadership, ProcessSection, ServicesEditorial, WhyDelma } from '@/components/sections';
import { company, images, wpc, upvc, aluminium, works } from '@/content/site';

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
      {/* HERO — asymmetric: copy on the start side, a tall showroom image bleeding to the end edge */}
      <section className="relative overflow-hidden bg-white pt-[88px]">
        <div className="grid min-h-[calc(100svh-88px)] lg:grid-cols-12">
          <div className="wrap flex flex-col justify-center py-14 lg:col-span-6 lg:max-w-none lg:py-0 lg:pl-12 lg:pr-[max(56px,calc((100vw-1320px)/2+56px))]">
            <div className="reveal in flex items-center gap-4" style={{ ['--rv-d' as string]: '80ms' }}><span className="h-px w-10 bg-sky" /><span className="t-kicker">DELMA AL JAZEERA · SINCE <span className="num">2011</span></span></div>
            <h1 className="t-display mt-7 max-w-[13ch] text-ink page-enter" style={{ animationDelay: '120ms' }}>حلول متكاملة للأبواب والنوافذ</h1>
            <p className="t-lead mt-7 max-w-[48ch] page-enter" style={{ animationDelay: '220ms' }}>
              خبرة منذ <span className="num">2011</span> في تصنيع وتوريد وتركيب الأبواب والنوافذ وحلول الألمنيوم والزجاج، بجودة تنفيذ تهتم بأدق التفاصيل.
            </p>
            <div className="mt-10 flex flex-wrap gap-3 page-enter" style={{ animationDelay: '320ms' }}>
              <Button href="/products/">استكشف خدماتنا</Button>
              <Button href="/quote/" variant="ghost">اطلب عرض سعر</Button>
            </div>
            <a href="#about-brief" className="mt-16 hidden items-center gap-3 text-[13px] text-muted lg:inline-flex" aria-label="انتقل إلى النبذة">
              <span className="relative block h-10 w-px overflow-hidden bg-line"><span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_2.4s_ease-in-out_infinite] bg-sky" /></span>
              مرّر للأسفل
            </a>
          </div>
          <div className="relative min-h-[56vh] lg:col-span-6 lg:min-h-0">
            <Parallax amount={5} className="absolute inset-0">
              <Img img={images.hero} priority sizes="(min-width:1024px) 50vw, 100vw" className="h-full w-full" position="40% 50%" />
            </Parallax>
            <div className="absolute bottom-0 right-0 hidden bg-white px-7 py-5 lg:block">
              <p className="text-[13px] text-muted">المعرض</p>
              <p className="mt-1 text-[15px] font-medium text-ink">حي السعادة، الرياض</p>
            </div>
          </div>
        </div>
        <style>{`@keyframes scrollcue{0%{transform:translateY(-100%)}60%,100%{transform:translateY(200%)}}`}</style>
      </section>

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

      <ServicesEditorial />
      <WhyDelma image={images.showroomCorner} />

      {/* FEATURED PRODUCTS */}
      <section className="section">
        <div className="wrap">
          <Reveal><SectionHead kicker="SELECTED PRODUCTS" title="منتجات مختارة" lead="أربعة موديلات من أبواب WPC، إلى جانب شبابيك UPVC وحلول الألمنيوم والزجاج." /></Reveal>
          <Featured items={featured} />
        </div>
      </section>

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
