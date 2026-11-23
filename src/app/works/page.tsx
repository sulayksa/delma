import type { Metadata } from 'next';
import { Gallery } from '@/components/Gallery';
import { PageHero } from '@/components/ui';
import { CtaBand } from '@/components/sections';
import { works, wpc, upvc } from '@/content/site';

export const metadata: Metadata = {
  title: 'نماذج من أعمالنا ومنتجاتنا',
  description: 'صور حقيقية لأبواب WPC وشبابيك وأبواب UPVC وواجهات زجاجية من أعمال ومعرض مؤسسة دلما الجزيرة في الرياض.',
  alternates: { canonical: '/works/' },
};

export default function Page() {
  const extra = [...wpc.gallery.map((g) => ({ ...g, tag: 'المعرض' })), ...upvc.gallery.slice(1, 3).map((g) => ({ ...g, tag: 'UPVC' }))];
  return (
    <>
      <PageHero kicker="OUR WORK" title="نماذج من أعمالنا ومنتجاتنا" lead="صور حقيقية من ملفات المؤسسة ومعرضها، مصنّفة حسب نوع المنتج." />
      <section className="section">
        <div className="wrap"><Gallery items={[...works, ...extra]} filters /></div>
      </section>
      <CtaBand />
    </>
  );
}
