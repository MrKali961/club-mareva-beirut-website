'use client';

import { useEffect, useRef } from 'react';

/**
 * Lightweight, dependency-free gold/cream confetti for the winners reveal.
 * Plays a single celebratory fall when `active` turns true, then fades and
 * stops (no permanent animation loop). Pure canvas — no party-kit aesthetic.
 */
export default function GoldConfetti({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = (canvas.width = canvas.offsetWidth * dpr);
    let h = (canvas.height = canvas.offsetHeight * dpr);

    const colors = ['#C6B158', '#DCCC8E', '#F5F5F0', '#9C8A3D'];
    const N = 150;
    type P = {
      x: number; y: number; vx: number; vy: number;
      rot: number; vr: number; size: number; color: string; round: boolean;
    };
    const parts: P[] = Array.from({ length: N }, () => ({
      x: Math.random() * w,
      y: Math.random() * -h,
      vx: (Math.random() - 0.5) * 1.4 * dpr,
      vy: (1 + Math.random() * 2.6) * dpr,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.22,
      size: (4 + Math.random() * 5) * dpr,
      color: colors[Math.floor(Math.random() * colors.length)],
      round: Math.random() < 0.45,
    }));

    let raf = 0;
    const start = performance.now();
    const DURATION = 7000;

    const tick = (t: number) => {
      const elapsed = t - start;
      ctx.clearRect(0, 0, w, h);
      ctx.globalAlpha = Math.max(0, 1 - Math.max(0, elapsed - 4200) / 2800);
      for (const p of parts) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.012 * dpr;
        p.rot += p.vr;
        if (p.y > h + 24) {
          p.y = -24;
          p.x = Math.random() * w;
          p.vy = (1 + Math.random() * 2.6) * dpr;
        }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        if (p.round) {
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size / 2, p.size / 2.6, 0, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.66);
        }
        ctx.restore();
      }
      if (elapsed < DURATION) raf = requestAnimationFrame(tick);
      else ctx.clearRect(0, 0, w, h);
    };
    raf = requestAnimationFrame(tick);

    const onResize = () => {
      w = canvas.width = canvas.offsetWidth * dpr;
      h = canvas.height = canvas.offsetHeight * dpr;
    };
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}
