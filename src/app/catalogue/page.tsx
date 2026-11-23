import type { Metadata } from 'next';
import { ColorCatalogue } from '@/components/ColorCatalogue';
import { Button, PageHero } from '@/components/ui';
import { CtaBand } from '@/components/sections';
import { colors, company, waHref } from '@/content/site';

export const metadata: Metadata = {
  title: 'كتالوج ألوان أبواب WPC',
  description: 'كتالوج ألوان أبواب WPC من دلما الجزيرة: 19 لونًا بالأكواد P01 إلى P19.',
  alternates: { canonical: '/catalogue/' },
};

export default function Page() {
  return (
    <>
      <PageHero kicker="COLOUR CATALOGUE" title={<>كتالوج ألوان أبواب WPC</>} lead={<>تتوفر أبواب WPC بتشكيلة من <span className="num">19</span> لونًا، تشمل درجات متعددة تناسب أنماط التصميم الداخلي المختلفة. الأكواد <span className="num">P01–P19</span> كما وردت في كتالوج المؤسسة.</>}>
        <div className="mt-9"><Button href={waHref(company.phones.whatsapp, 'السلام عليكم، أرغب في استلام كتالوج ألوان أبواب WPC الكامل.')} external>اطلب الكتالوج الكامل عبر واتساب</Button></div>
      </PageHero>
      <section className="section"><div className="wrap"><ColorCatalogue codes={colors} /></div></section>
      <CtaBand />
    </>
  );
}
