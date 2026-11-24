'use client';
import { useEffect, useRef } from 'react';
import { SplitWords } from './SplitWords';
import { Reveal } from './Reveal';
import { Button } from './ui';
import { company, leadership } from '@/content/site';
import { asset } from '@/lib/paths';

/**
 * Leadership — "the portrait room". A deep navy stage with a soft spotlight; a gilded double-rule frame
 * stands on the stage and the president's portrait rises out of it, head and shoulders breaking the frame's
 * top edge. Name set large, role in gold, three facts on an engraved plate. Only verified facts are shown.
 */
export function LeaderSpotlight() {
  const p = leadership[0];
  const stage = useRef<HTMLDivElement>(null);

  // one-shot reveal (CSS transition on transform/opacity only) — nothing is recalculated while scrolling
  useEffect(() => {
    const el = stage.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('is-in'); io.disconnect(); } }, { rootMargin: '0px 0px -15% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const [first, ...rest] = p.name.split(' بن ');
  const facts: [string, React.ReactNode][] = [
    ['المؤسسة', company.shortAr],
    ['المقر', `${company.city}، حي السعادة`],
    ['منذ', <span key="y" className="num">{company.founded}</span>],
  ];

  return (
    <section className="ldr relative overflow-hidden" aria-labelledby="leader-title">
      <div aria-hidden className="ldr__glow absolute inset-0" />
      <div aria-hidden className="ldr__rules absolute inset-0" />
      <div className="wrap relative py-[clamp(80px,11vw,150px)]">
        <div ref={stage} className="grid items-center gap-[clamp(56px,7vw,96px)] lg:grid-cols-12">

          {/* portrait */}
          <div className="lg:col-span-5">
            <figure className="ldr__fig relative mx-auto w-full max-w-[500px]">
              <div aria-hidden className="ldr__frame absolute inset-x-0 bottom-0 top-[14%]">
                <span className="ldr__frame-in absolute inset-[12px]" />
                {['right-[6px] top-[6px] border-r border-t', 'left-[6px] top-[6px] border-l border-t', 'right-[6px] bottom-[6px] border-r border-b', 'left-[6px] bottom-[6px] border-l border-b'].map((c) => (
                  <span key={c} className={`ldr__corner absolute h-7 w-7 border-gold ${c}`} />
                ))}
              </div>
              <div className="ldr__clip relative aspect-[4/5]">
                <img src={asset('/img/leader-cutout.webp')} srcSet={`${asset('/img/leader-cutout-800.webp')} 1100w, ${asset('/img/leader-cutout.webp')} 2200w`} sizes="(min-width:1024px) 500px, 600px"
                  alt={`${p.name}، ${p.role}`} width={2200} height={2732} loading="lazy" decoding="async"
                  className="ldr__photo absolute bottom-0 left-1/2 h-[100%] w-auto max-w-none" />
              </div>
            </figure>
          </div>
          {/* text */}
          <div className="lg:col-span-7 lg:pr-[clamp(24px,4vw,72px)]">
            <Reveal><p className="flex items-center gap-4 text-[15px] font-medium text-gold"><span aria-hidden className="h-px w-12 bg-gold" />القيادة والإدارة</p></Reveal>
            <h2 id="leader-title" className="mt-9 font-semibold leading-[1.08] text-ink">
              <span className="block text-[clamp(46px,6.2vw,96px)]"><SplitWords text={first} /></span>
              {rest.length ? <span className="mt-2 block text-[clamp(24px,2.6vw,38px)] font-medium text-body"><SplitWords text={`بن ${rest.join(' بن ')}`} delay={120} /></span> : null}
            </h2>
            <Reveal delay={160}><p className="mt-8 text-[clamp(18px,1.5vw,22px)] text-ink">{p.role} — <span className="text-gold">{company.nameAr}</span></p></Reveal>
            {p.bio ? <Reveal delay={200}><p className="t-lead mt-6 max-w-[46ch]">{p.bio}</p></Reveal> : null}

            <Reveal delay={240}>
              <dl className="ldr__plate mt-12 grid grid-cols-3">
                {facts.map(([k, v]) => (
                  <div key={k} className="px-5 py-5 first:pr-6">
                    <dt className="text-[12px] text-muted">{k}</dt>
                    <dd className="mt-2 text-[15px] font-medium leading-6 text-ink">{v}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
            <Reveal delay={300}><div className="mt-10 flex flex-wrap gap-3"><Button href="/contact/">تواصل مع الإدارة</Button><Button href="/about/" variant="ghost">عن المؤسسة</Button></div></Reveal>
          </div>

        </div>
      </div>
    </section>
  );
}
