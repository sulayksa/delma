/**
 * One shared scroll/resize frame loop for every scroll-driven effect.
 * Each frame runs ALL layout reads first, then ALL style writes — so the browser lays out the page
 * at most once per frame (no read/write ping-pong between components = no forced reflows).
 */
type Job<T = unknown> = { read: () => T; write: (v: T) => void; enabled: () => boolean };
const jobs = new Set<Job>();
let raf = 0, bound = false;

const run = () => {
  raf = 0;
  const list = Array.from(jobs).filter((j) => j.enabled());
  const vals = list.map((j) => j.read());
  list.forEach((j, i) => j.write(vals[i]));
};
export const schedule = () => { if (!raf) raf = requestAnimationFrame(run); };

export function onFrame<T>(job: Job<T>) {
  jobs.add(job as Job);
  if (!bound && typeof window !== 'undefined') {
    bound = true;
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
  }
  schedule();
  return () => { jobs.delete(job as Job); };
}
