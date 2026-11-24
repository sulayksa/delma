'use client';
import { useEffect, useRef } from 'react';

/**
 * Living architectural backdrop: a fine drafting grid that brightens under the cursor,
 * and plan-drawing symbols of doors and windows (swing arcs, sliding panes, arched frames)
 * floating at different depths — they drift with scrolling and lean toward the mouse.
 * One fixed canvas, one rAF loop, paused when the tab is hidden; static for reduced motion.
 */
type Glyph = { kind: number; x: number; y: number; s: number; z: number; r: number; vr: number };

export function BlueprintBg() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current!; const ctx = cv.getContext('2d')!;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let W = 0, H = 0, dpr = 1, raf = 0;
    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999, nx: 0, ny: 0, tnx: 0, tny: 0 };
    let scroll = window.scrollY, sy = scroll;
    let glyphs: Glyph[] = [];

    const seed = () => {
      const n = W < 768 ? 7 : 13; glyphs = [];
      for (let i = 0; i < n; i++) {
        glyphs.push({ kind: i % 5, x: Math.random() * W, y: Math.random() * H * 1.6, s: 70 + Math.random() * (W < 768 ? 70 : 130),
          z: 0.15 + Math.random() * 0.85, r: (Math.random() - 0.5) * 0.5, vr: (Math.random() - 0.5) * 0.0006 });
      }
    };
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2); W = window.innerWidth; H = window.innerHeight;
      cv.width = W * dpr; cv.height = H * dpr; cv.style.width = W + 'px'; cv.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); seed();
    };

    const glyph = (g: Glyph) => {
      const s = g.s; ctx.beginPath();
      switch (g.kind) {
        case 0: // door in plan: leaf + swing arc
          ctx.moveTo(0, 0); ctx.lineTo(s, 0); ctx.moveTo(0, 0); ctx.lineTo(0, -s);
          ctx.moveTo(s, 0); ctx.arc(0, 0, s, 0, -Math.PI / 2, true); break;
        case 1: // door elevation with panels + handle
          ctx.rect(-s * 0.32, -s * 0.7, s * 0.64, s * 1.4); ctx.rect(-s * 0.22, -s * 0.58, s * 0.44, s * 0.5); ctx.rect(-s * 0.22, s * 0.02, s * 0.44, s * 0.54);
          ctx.moveTo(-s * 0.26, 0); ctx.arc(-s * 0.26, 0, s * 0.025, 0, Math.PI * 2); break;
        case 2: // arched window with mullions
          ctx.moveTo(-s * 0.4, s * 0.5); ctx.lineTo(-s * 0.4, -s * 0.1); ctx.arc(0, -s * 0.1, s * 0.4, Math.PI, 0); ctx.lineTo(s * 0.4, s * 0.5); ctx.closePath();
          ctx.moveTo(0, -s * 0.5); ctx.lineTo(0, s * 0.5); ctx.moveTo(-s * 0.4, s * 0.12); ctx.lineTo(s * 0.4, s * 0.12); break;
        case 3: // sliding window in plan (two offset panes + arrow)
          ctx.rect(-s * 0.6, -s * 0.06, s * 0.66, s * 0.05); ctx.rect(-s * 0.06, s * 0.01, s * 0.66, s * 0.05);
          ctx.moveTo(-s * 0.3, s * 0.22); ctx.lineTo(s * 0.3, s * 0.22); ctx.lineTo(s * 0.22, s * 0.16); break;
        default: // curtain-wall grid
          for (let i = 0; i <= 3; i++) { ctx.moveTo(-s * 0.5 + (i * s) / 3, -s * 0.5); ctx.lineTo(-s * 0.5 + (i * s) / 3, s * 0.5); }
          for (let j = 0; j <= 2; j++) { ctx.moveTo(-s * 0.5, -s * 0.5 + (j * s) / 2); ctx.lineTo(s * 0.5, -s * 0.5 + (j * s) / 2); }
      }
      ctx.stroke();
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, W, H);
      sy += (scroll - sy) * 0.12;
      mouse.x += (mouse.tx - mouse.x) * 0.14; mouse.y += (mouse.ty - mouse.y) * 0.14;
      mouse.nx += (mouse.tnx - mouse.nx) * 0.05; mouse.ny += (mouse.tny - mouse.ny) * 0.05;

      // drafting grid (parallax with scroll)
      const step = W < 768 ? 48 : 72;
      const ox = (-mouse.nx * 10) % step, oy = (-sy * 0.25 - mouse.ny * 10) % step;
      const grid = (alpha: number) => {
        ctx.strokeStyle = `rgba(120,170,235,${alpha})`; ctx.lineWidth = 1; ctx.beginPath();
        for (let x = ox; x < W; x += step) { ctx.moveTo(Math.round(x) + 0.5, 0); ctx.lineTo(Math.round(x) + 0.5, H); }
        for (let y = oy; y < H; y += step) { ctx.moveTo(0, Math.round(y) + 0.5); ctx.lineTo(W, Math.round(y) + 0.5); }
        ctx.stroke();
      };
      grid(0.035);
      if (mouse.x > -1000) {
        // brighter grid + soft light under the cursor
        ctx.save(); const R = W < 768 ? 160 : 260;
        const g = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, R);
        g.addColorStop(0, 'rgba(1,171,252,0.10)'); g.addColorStop(1, 'rgba(1,171,252,0)');
        ctx.fillStyle = g; ctx.fillRect(mouse.x - R, mouse.y - R, R * 2, R * 2);
        ctx.beginPath(); ctx.arc(mouse.x, mouse.y, R, 0, Math.PI * 2); ctx.clip(); grid(0.13); ctx.restore();
      }

      // floating plan symbols
      for (const g of glyphs) {
        g.r += reduce ? 0 : g.vr;
        const span = H * 1.6;
        let y = (g.y - sy * g.z * 0.6) % span; if (y < -200) y += span;
        const x = g.x + mouse.nx * 40 * g.z;
        const yy = y + mouse.ny * 30 * g.z + Math.sin(t * 0.0003 + g.x) * 6 * g.z;
        const d = Math.hypot(x - mouse.x, yy - mouse.y);
        const near = Math.max(0, 1 - d / 320);
        ctx.save(); ctx.translate(x, yy); ctx.rotate(g.r + near * 0.08);
        ctx.strokeStyle = `rgba(${near > 0 ? '76,198,255' : '120,170,235'},${0.06 + g.z * 0.08 + near * 0.35})`;
        ctx.lineWidth = 1 + near * 0.6; glyph(g); ctx.restore();
      }
    };

    let last = 0;
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      if (document.hidden) return;
      if (t - last < 14) return; // ~60fps cap, smooth on 120Hz too
      last = t; draw(t);
    };
    const onMove = (e: PointerEvent) => {
      mouse.tx = e.clientX; mouse.ty = e.clientY; if (mouse.x < -1000) { mouse.x = mouse.tx; mouse.y = mouse.ty; }
      mouse.tnx = e.clientX / W - 0.5; mouse.tny = e.clientY / H - 0.5;
    };
    const onLeave = () => { mouse.tx = mouse.ty = -9999; mouse.x = mouse.y = -9999; };
    const onScroll = () => { scroll = window.scrollY; };

    resize(); draw(0);
    window.addEventListener('resize', resize);
    if (!reduce) {
      window.addEventListener('pointermove', onMove, { passive: true });
      document.addEventListener('pointerleave', onLeave);
      window.addEventListener('scroll', onScroll, { passive: true });
      raf = requestAnimationFrame(loop);
    }
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); window.removeEventListener('pointermove', onMove); document.removeEventListener('pointerleave', onLeave); window.removeEventListener('scroll', onScroll); };
  }, []);
  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-0" />;
}
