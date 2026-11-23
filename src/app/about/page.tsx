import type { Metadata } from 'next';
import { Img } from '@/components/Img';
import { Reveal } from '@/components/Reveal';
import { PageHero, SectionHead } from '@/components/ui';
import { CtaBand, Leadership, ProcessSection, WhyDelma } from '@/components/sections';
import { company, images, services } from '@/content/site';

export const metadata: Metadata = {
  title: 'من نحن',
  description: 'مؤسسة دلما الجزيرة للمقاولات — تأسست في الرياض عام 2011، وتعمل في تصنيع وتوريد وتركيب أبواب WPC وPVC وشبابيك UPVC وأعمال الألمنيوم والزجاج.',
  alternates: { canonical: '/about/' },
};

export default function Page() {
  return (
    <>
      <PageHero kicker="ABOUT US" title="حلول سعودية متخصصة في الأبواب والنوافذ" />
      <section className="section">
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <Reveal><p className="t-lead !text-[clamp(19px,1.6vw,23px)] !leading-[2] !text-ink">
              تأسست {company.nameAr} في مدينة الرياض عام <span className="num">2011</span>، وتعمل في تصنيع وتوريد وتركيب أبواب WPC وPVC وشبابيك UPVC، إلى جانب أعمال الألمنيوم والزجاج والواجهات المعمارية.
            </p></Reveal>
            <Reveal delay={80}><p className="t-lead mt-6">
              نحرص على تقديم حلول تتناسب مع احتياجات المساحات السكنية والتجارية، مع الاهتمام باختيار الخامات المناسبة، ودقة المقاسات، وجودة التنفيذ والمتابعة بعد التركيب.
            </p></Reveal>
            <Reveal delay={140}>
              <dl className="mt-12 grid gap-0 border-t border-line sm:grid-cols-3">
                {[
                  ['التأسيس', <><span className="num">2011</span> · الرياض</>],
                  ['المقر والمعرض', 'حي السعادة، الرياض'],
                  ['القطاعات', company.sectors.join(' · ')],
                ].map(([k, v], i) => (
                  <div key={i} className="border-b border-line py-5 sm:border-b-0 sm:border-l sm:pl-5 sm:last:border-l-0">
                    <dt className="text-[13px] text-muted">{k}</dt><dd className="mt-2 text-[16px] font-medium leading-7 text-ink">{v}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <Reveal img><div className="relative aspect-[4/5] overflow-hidden"><Img img={images.hqSign} sizes="(min-width:1024px) 40vw, 100vw" className="absolute inset-0 h-full w-full" position="58% 50%" /></div></Reveal>
            <p className="mt-3 text-[13px] text-muted">مقر المؤسسة — شارع أبو عبيدة بن الجراح، حي السعادة</p>
          </div>
        </div>
      </section>

      <section className="section bg-mist">
        <div className="wrap grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-4"><SectionHead kicker="SPECIALTIES" title="مجالات التخصص" /></Reveal>
          <div className="lg:col-span-8">
            {services.map((s, i) => (
              <Reveal key={s.slug} delay={i * 70} className="grid grid-cols-12 gap-4 border-t border-line py-7 last:border-b">
                <span className="num col-span-2 text-[13px] text-sky-ink sm:col-span-1">{s.no}</span>
                <h3 className="t-h3 col-span-10 text-ink sm:col-span-4">{s.title}</h3>
                <p className="t-body col-span-12 sm:col-span-7">{s.lead}</p>
              </Reveal>
            ))}
            <Reveal delay={240}>
              <div className="mt-10 grid gap-6 sm:grid-cols-2">
                <div><h3 className="text-[15px] font-semibold text-ink">التركيب</h3><p className="t-body mt-1">{company.serviceArea.install}</p></div>
                <div><h3 className="text-[15px] font-semibold text-ink">التوريد</h3><p className="t-body mt-1">{company.serviceArea.supply}</p></div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <Reveal><SectionHead kicker="QUALITY" title="ما نهتم به في التنفيذ" /></Reveal>
          <div className="mt-12 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['اختيار الخامات', 'خامات مناسبة لطبيعة كل مساحة واستخدام.'],
              ['دقة المقاسات', 'تحديد المقاسات والمواصفات قبل التصنيع أو التجهيز.'],
              ['جودة التنفيذ', 'تصنيع وتركيب وفق المواصفات المعتمدة.'],
              ['المتابعة بعد التركيب', 'استقبال استفسارات العملاء بعد التركيب.'],
            ].map(([t, d], i) => (
              <Reveal key={t} delay={i * 70} className="bg-white p-7">
                <span className="num text-[12px] text-muted">0{i + 1}</span>
                <h3 className="t-h3 mt-6 text-ink">{t}</h3><p className="t-body mt-2">{d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <WhyDelma image={images.showroomWide} />
      <ProcessSection />
      <Leadership compact />
      <CtaBand />
    </>
  );
}
