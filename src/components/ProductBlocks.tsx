import Link from 'next/link';
import { Img } from './Img';
import { Reveal } from './Reveal';
import { Button, SectionHead } from './ui';
import { services, showPrices, type Product, type Img as ImgT } from '@/content/site';

export function ProductHero({ kicker, title, intro, image, crumbs }: { kicker: string; title: string; intro: string; image: ImgT; crumbs: string }) {
  return (
    <section className="bg-mist pt-[88px]">
      <div className="wrap grid items-end gap-10 py-[clamp(40px,6vw,80px)] lg:grid-cols-12">
        <div className="lg:col-span-6">
          <nav aria-label="مسار التصفح" className="text-[13px] text-muted">
            <Link href="/" className="ulink">الرئيسية</Link><span className="mx-2">/</span><Link href="/products/" className="ulink">منتجاتنا وخدماتنا</Link><span className="mx-2">/</span><span className="text-ink">{crumbs}</span>
          </nav>
          <h1 className="t-h1 mt-8 text-ink" data-kicker={kicker}>{title}</h1>
          <p className="t-lead mt-6 max-w-[52ch]">{intro}</p>
          <div className="mt-9 flex flex-wrap gap-3"><Button href="/quote/">اطلب عرض سعر</Button><Button href="/catalogue/" variant="ghost">كتالوج الألوان</Button></div>
        </div>
        <Reveal img className="lg:col-span-6">
          <div className="lux relative aspect-[4/3] overflow-hidden"><Img img={image} priority sizes="(min-width:1024px) 50vw, 100vw" className="absolute inset-0 h-full w-full" /></div>
        </Reveal>
      </div>
    </section>
  );
}

/** Model line-up: studio shots on a light ground, name, suggested use, optional price. */
export function Models({ title, kicker, items, contain = true, note }: { title: string; kicker: string; items: Product[]; contain?: boolean; note?: string }) {
  return (
    <section className="section">
      <div className="wrap">
        <Reveal><SectionHead kicker={kicker} title={title} /></Reveal>
        <ul className="mt-[clamp(40px,6vw,72px)] grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-4">
          {items.map((m, i) => (
            <Reveal as="li" key={m.name} delay={i * 70} className="group">
              <div className="lux zoom relative aspect-[3/4] overflow-hidden">
                <Img img={m.image} fit={contain ? 'contain' : 'cover'} sizes="(min-width:1024px) 25vw, 50vw" className={`absolute inset-0 h-full w-full ${contain ? 'p-[8%]' : ''}`} />
              </div>
              <div className="mt-5 flex items-start justify-between gap-3 border-t border-line pt-4">
                <div>
                  <h3 className="text-[18px] font-semibold text-ink">{m.name}</h3>
                  <p className="mt-1 text-[14px] leading-6 text-body">{m.use}</p>
                </div>
                <span className="num text-[12px] text-muted">0{i + 1}</span>
              </div>
              {showPrices && m.price ? <p className="mt-2 text-[14px] text-accent">{m.price}</p> : null}
            </Reveal>
          ))}
        </ul>
        <p className="mt-10 text-[13px] leading-7 text-muted">{note ?? 'السعر النهائي يعتمد على المقاسات والمواصفات والكمية ونوع الزجاج، ويُؤكَّد في عرض السعر.'}</p>
      </div>
    </section>
  );
}

export function Related({ current }: { current: string }) {
  const list = services.filter((s) => s.slug !== current);
  return (
    <section className="section border-t border-line">
      <div className="wrap">
        <Reveal><SectionHead kicker="RELATED" title="خدمات ذات صلة" /></Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {list.map((s, i) => (
            <Reveal key={s.slug} delay={i * 80}>
              <Link href={`/products/${s.slug}/`} className="group grid grid-cols-5 items-center gap-5 border-t border-line pt-6">
                <div className="lux zoom relative col-span-2 aspect-[4/3] overflow-hidden"><Img img={s.image} sizes="20vw" className="absolute inset-0 h-full w-full" /></div>
                <div className="col-span-3">
                  <span className="num text-[12px] text-muted">{s.no}</span>
                  <h3 className="t-h3 mt-1 text-ink transition-colors group-hover:text-accent">{s.title}</h3>
                  <p className="mt-2 text-[14px] leading-7 text-body">{s.lead}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
