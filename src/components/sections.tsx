import Link from 'next/link';
import { Img } from './Img';
import { Reveal } from './Reveal';
import { Button, SectionHead } from './ui';
import { Process } from './Process';
import { SplitWords } from './SplitWords';
import { company, leadership, services, steps, why, waHref, type Leader } from '@/content/site';

/** Editorial list of the three fields — large images, small numbering, hairlines. */
export function ServicesEditorial() {
  return (
    <section className="section">
      <div className="wrap">
        <Reveal><SectionHead kicker="OUR FIELDS" title="مجالاتنا" lead="ثلاثة مجالات متخصصة، تُنفَّذ وفق المقاسات والمواصفات المعتمدة لكل مشروع." /></Reveal>
        <div className="mt-[clamp(40px,6vw,80px)] border-t border-line">
          {services.map((s, i) => (
            <Link key={s.slug} href={`/products/${s.slug}/`} className="group grid items-center gap-6 border-b border-line py-8 md:grid-cols-12 md:gap-10 md:py-10">
              <Reveal delay={i * 60} className="md:col-span-1"><span className="num text-[13px] text-muted">{s.no}</span></Reveal>
              <Reveal delay={i * 60 + 40} className="md:col-span-5">
                <h3 className="t-h2 !text-[clamp(26px,3vw,40px)] text-ink transition-colors duration-500 group-hover:text-accent">{s.title}</h3>
                <p className="t-body mt-3 max-w-[44ch]">{s.lead}</p>
              </Reveal>
              <div className="md:col-span-4 md:col-start-8">
                <div className="lux zoom relative aspect-[16/10] overflow-hidden">
                  <Img img={s.image} sizes="(min-width:768px) 34vw, 100vw" className="absolute inset-0 h-full w-full" />
                </div>
              </div>
              <div className="hidden justify-end md:col-span-1 md:flex">
                <span className="grid h-12 w-12 place-items-center border border-line text-ink transition-[background-color,color,border-color] duration-500 group-hover:border-sky group-hover:bg-brand group-hover:text-white">
                  <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="none" className="transition-transform duration-500 group-hover:-translate-x-0.5"><path d="M19 12H5m0 0 6-6m-6 6 6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Six reasons as a two-column numbered list next to one strong image. */
export function WhyDelma({ image }: { image: Parameters<typeof Img>[0]['img'] }) {
  return (
    <section className="section bg-mist">
      <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <Reveal><SectionHead kicker="WHY DELMA" title="لماذا دلما؟" lead="نعمل وفق مقاسات ومواصفات معتمدة، ونتابع مع العميل من عرض السعر حتى ما بعد التركيب." /></Reveal>
          <Reveal img delay={120} className="mt-10 hidden lg:block">
            <div className="lux relative aspect-[4/5] overflow-hidden"><Img img={image} sizes="40vw" className="absolute inset-0 h-full w-full" /></div>
          </Reveal>
        </div>
        <ol className="grid content-start gap-x-12 sm:grid-cols-2 lg:col-span-7">
          {why.map((w, i) => (
            <Reveal as="li" key={w.no} delay={(i % 2) * 80} className="border-t border-line py-8">
              <span className="num text-[13px] font-medium text-sky-ink">{w.no}</span>
              <h3 className="t-h3 mt-3 text-ink">{w.title}</h3>
              <p className="t-body mt-2">{w.text}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function ProcessSection({ tone = 'white' }: { tone?: 'white' | 'mist' }) {
  return (
    <section className={`section ${tone === 'mist' ? 'bg-mist' : ''}`}>
      <div className="wrap">
        <Reveal><SectionHead kicker="HOW WE WORK" title="من الطلب إلى التركيب" lead="خطوات واضحة لتنفيذ طلبك، من القياس حتى التركيب في الموقع." /></Reveal>
        <Process steps={steps} />
      </div>
    </section>
  );
}

/** Navy closing call-to-action. */
export function CtaBand() {
  return (
    <section className="on-dark relative overflow-hidden bg-navy">
      <div className="wrap grid items-end gap-10 py-[clamp(72px,10vw,140px)] lg:grid-cols-12">
        <div className="lg:col-span-8">
          <h2 className="t-display text-white"><SplitWords text={'ابدأ مشروعك\nبخطوة واضحة'} stagger={80} /></h2>
          <Reveal delay={120}><p className="t-lead mt-6 max-w-[52ch] !text-white/70">يسعدنا مساعدتك في اختيار الحلول المناسبة وتقديم عرض سعر وفق متطلبات مشروعك.</p></Reveal>
        </div>
        <Reveal delay={180} className="flex flex-wrap gap-3 lg:col-span-4 lg:justify-end">
          <Button href="/quote/" variant="light">اطلب عرض سعر الآن</Button>
          <Button href={waHref(company.phones.whatsapp, 'السلام عليكم، أرغب في عرض سعر.')} external variant="outline-light">واتساب</Button>
        </Reveal>
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-y-0 left-[8%] hidden w-px bg-white/[0.06] lg:block" />
      <div aria-hidden className="pointer-events-none absolute inset-y-0 left-[30%] hidden w-px bg-white/[0.06] lg:block" />
    </section>
  );
}

/** Leadership — executive profile. Photo optional: without one, a neutral monogram panel is shown (never a stand-in face). */
export function Leadership({ compact = false }: { compact?: boolean }) {
  const [lead, ...others] = leadership;
  return (
    <section className={`section ${compact ? 'bg-mist' : ''}`} aria-labelledby="leadership-title">
      <div className="wrap">
        <Reveal><SectionHead kicker="LEADERSHIP" title={<span id="leadership-title">القيادة والإدارة</span>} lead="رؤية تقود مسيرة العمل." /></Reveal>
        <ExecutiveProfile person={lead} />
        {others.length ? (
          <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((p) => <MemberCard key={p.name} person={p} />)}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function Portrait({ person, sizes }: { person: Leader; sizes: string }) {
  if (person.photo) return <Img img={person.photo} sizes={sizes} className="absolute inset-0 h-full w-full" position="50% 20%" />;
  const initials = person.name.split(' ').filter((w) => w.length > 2).slice(0, 2).map((w) => w[0]).join(' ');
  return <div className="absolute inset-0 grid place-items-center bg-[linear-gradient(180deg,#EEF1F5,#E3E7ED)] text-[64px] font-light text-sky/40">{initials}</div>;
}

function ExecutiveProfile({ person }: { person: Leader }) {
  return (
    <div className="mt-[clamp(40px,6vw,72px)] grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
      <Reveal img className="lg:col-span-5">
        <figure className="relative">
          {/* architectural frame: offset hairline rectangle behind the portrait */}
          <div aria-hidden className="absolute -bottom-4 -left-4 right-4 top-4 border border-sky/40" />
          <div className="relative aspect-[4/5] overflow-hidden bg-[#F2F4F7]">
            <Portrait person={person} sizes="(min-width:1024px) 40vw, 100vw" />
          </div>
        </figure>
      </Reveal>
      <div className="lg:col-span-6 lg:col-start-7">
        <Reveal><h3 className="t-h1 text-ink">{person.name}</h3></Reveal>
        <Reveal delay={100}><p className="mt-4 text-[18px] text-accent">{person.role}</p></Reveal>
        <Reveal delay={140}><div className="mt-8 h-px w-24 bg-sky" /></Reveal>
        {person.bio ? <Reveal delay={180}><p className="t-lead mt-8 max-w-[52ch]">{person.bio}</p></Reveal> : null}
        <Reveal delay={200}><p className="mt-8 text-[15px] leading-8 text-muted">{company.nameAr} · {company.city} · منذ <span className="num">{company.founded}</span></p></Reveal>
      </div>
    </div>
  );
}

function MemberCard({ person }: { person: Leader }) {
  return (
    <Reveal className="group">
      <div className="relative aspect-[4/5] overflow-hidden bg-mist"><Portrait person={person} sizes="33vw" /></div>
      <h3 className="t-h3 mt-5 text-ink">{person.name}</h3>
      <p className="mt-1 text-[15px] text-accent">{person.role}</p>
    </Reveal>
  );
}
