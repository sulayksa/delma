import Link from 'next/link';
import { Reveal } from './Reveal';
import { SplitWords } from './SplitWords';
import { asset } from '@/lib/paths';

/** Invitation into the 3D door studio: the four models fanned in perspective. */
export function StudioTeaser() {
  const doors = ['wpc-plain-white', 'wpc-carved', 'wpc-glass', 'wpc-decor'];
  return (
    <section className="relative overflow-hidden bg-navy text-white">
      <div className="wrap grid items-center gap-12 py-[clamp(72px,10vw,140px)] lg:grid-cols-12">
        <div className="lg:col-span-5">
          <span aria-hidden className="block h-px w-12 bg-sky" />
          <h2 className="t-h1 mt-6"><SplitWords text={'جرّب الباب\nقبل أن تطلبه'} stagger={80} /></h2>
          <Reveal delay={200}><p className="mt-6 max-w-[42ch] text-[17px] leading-8 text-white/75">استوديو ثلاثي الأبعاد لأبواب WPC: اختر الموديل واللون من الكتالوج ولون المقبض، ودوّر الباب من كل الاتجاهات، ثم افتحه.</p></Reveal>
          <Reveal delay={280}>
            <Link href="/door-studio/" className="group mt-10 inline-flex h-[56px] items-center gap-4 bg-white px-7 text-[16px] font-medium text-navy transition-colors duration-300 hover:bg-sky hover:text-white">
              افتح استوديو الأبواب
              <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="none" className="transition-transform duration-500 group-hover:-translate-x-1.5"><path d="M19 12H5m0 0 6-6m-6 6 6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </Link>
          </Reveal>
        </div>
        <Link href="/door-studio/" aria-label="افتح استوديو الأبواب" className="studio-fan group relative h-[380px] lg:col-span-7 lg:h-[520px]">
          {doors.map((d, i) => (
            <img key={d} src={asset(`/img/${d}.webp`)} alt="" loading="lazy"
              className="studio-fan__door absolute bottom-0 h-[74%] w-auto object-contain"
              style={{ ['--i' as string]: i, right: `${2 + i * 24.5}%` }} />
          ))}
          <span aria-hidden className="absolute inset-x-[4%] bottom-0 h-px bg-white/15" />
        </Link>
      </div>
    </section>
  );
}
