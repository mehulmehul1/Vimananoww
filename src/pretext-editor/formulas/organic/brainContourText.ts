import type { FormulaFn, LineSegment } from '../types';
import { seg } from '../helpers';

/**
 * brainContourText — Contour topology brain renderer.
 * Generates layered cortical contour bands with interrupted sulcal valleys.
 */

interface ContourLine {
  points: [number, number][];
  alpha: number;
  width: number;
}

// ─── Utilities ───────────────────────────────────────────────────────────

function clamp(v: number, a: number, b: number): number {
  return Math.max(a, Math.min(b, v));
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function smoothstep(a: number, b: number, x: number): number {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
}

function hash(x: number, y: number): number {
  const h = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123;
  return h - Math.floor(h);
}

function noise(x: number, y: number): number {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const h00 = hash(xi, yi);
  const h10 = hash(xi + 1, yi);
  const h01 = hash(xi, yi + 1);
  const h11 = hash(xi + 1, yi + 1);
  const u = smoothstep(0, 1, xf);
  const v = smoothstep(0, 1, yf);
  return lerp(lerp(h00, h10, u), lerp(h01, h11, u), v);
}

function fbm(x: number, y: number): number {
  let value = 0;
  let amp = 0.5;
  let freq = 1;
  for (let i = 0; i < 5; i++) {
    value += noise(x * freq, y * freq) * amp;
    amp *= 0.5;
    freq *= 2;
  }
  return value;
}

// ─── Brain silhouette ────────────────────────────────────────────────────

function brainMask(x: number, y: number): boolean {
  const nx = x / 320;
  const ny = y / 230;

  let d = nx * nx * 1.05 + ny * ny * 1.45;

  // frontal bulge
  d -= Math.exp(-((x - 110) ** 2 + (y + 10) ** 2) / 17000) * 0.24;

  // temporal lobe
  d -= Math.exp(-((x - 40) ** 2 + (y - 80) ** 2) / 11000) * 0.18;

  // occipital roundness
  d -= Math.exp(-((x + 200) ** 2 + (y + 5) ** 2) / 14000) * 0.16;

  // inferior flattening
  d += Math.max(0, y - 70) * 0.0026;

  // top flattening
  d += Math.max(0, -y - 120) * 0.0015;

  return d < 1;
}

// ─── Sulcal topology field ───────────────────────────────────────────────

function corticalHeight(x: number, y: number): number {
  const nx = x / 320;
  const ny = y / 240;

  // global layered contour structure
  let h =
    Math.sin(nx * 7.5 + ny * 2.0) * 0.8 +
    Math.sin(nx * 12.0 - ny * 1.4) * 0.45;

  // frontal curvature
  h += Math.exp(-((x - 120) ** 2 + y ** 2) / 17000) * 1.5;

  // temporal region
  h += Math.exp(-((x - 20) ** 2 + (y - 70) ** 2) / 10000) * 1.0;

  // occipital structure
  h += Math.exp(-((x + 170) ** 2 + y ** 2) / 15000) * 0.8;

  // central sulcus valley
  h -= Math.exp(-((x - 10) ** 2) / 1800) * 2.4;

  // sylvian fissure
  h -= Math.exp(-((y - 55) ** 2) / 600) *
    Math.exp(-((x - 30) ** 2) / 15000) *
    1.8;

  // domain warped noise
  const warp = fbm(nx * 3, ny * 3);

  h +=
    Math.sin(nx * 16 + warp * 8) * 0.22 +
    Math.sin(nx * 25 + warp * 5) * 0.1;

  return h;
}

// ─── Contour generation ──────────────────────────────────────────────────

function generateContours(): ContourLine[] {
  const contours: ContourLine[] = [];
  const levels = 46;

  for (let li = 0; li < levels; li++) {
    const target = lerp(-2.8, 2.8, li / levels);

    for (let y = -180; y < 180; y += 6) {
      let active = false;
      let line: [number, number][] = [];

      for (let x = -280; x < 260; x += 3) {
        if (!brainMask(x, y)) {
          if (line.length > 12) {
            contours.push({ points: line, alpha: 0.18, width: 1 });
          }
          line = [];
          active = false;
          continue;
        }

        const h = corticalHeight(x, y);
        const diff = Math.abs(h - target);
        const threshold = 0.08 + fbm(x * 0.01, y * 0.01) * 0.05;

        if (diff < threshold) {
          // interrupted contour behavior
          const interruption = fbm(x * 0.03 + li, y * 0.03);

          if (interruption > 0.82) {
            if (line.length > 10) {
              contours.push({ points: line, alpha: 0.22, width: 1 });
            }
            line = [];
            active = false;
            continue;
          }

          const jitterX = (fbm(x * 0.04, y * 0.04) - 0.5) * 2;
          const jitterY = (fbm(x * 0.04 + 10, y * 0.04 + 10) - 0.5) * 1.5;

          line.push([x + jitterX, y + jitterY]);
          active = true;
        } else {
          if (active && line.length > 12) {
            contours.push({ points: line, alpha: 0.22, width: 1 });
          }
          line = [];
          active = false;
        }
      }
    }
  }

  return contours;
}

// ─── Cache ───────────────────────────────────────────────────────────────

let cachedContours: ContourLine[] | null = null;

// ─── Formula ─────────────────────────────────────────────────────────────

export const brainContourText: FormulaFn = (_text, params, _time) => {
  if (!cachedContours) {
    cachedContours = generateContours();
  }

  const segments: LineSegment[] = [];

  for (const contour of cachedContours) {
    for (let i = 0; i < contour.points.length - 1; i++) {
      const p1 = contour.points[i];
      const p2 = contour.points[i + 1];

      const s = seg(p1[0], p1[1], p2[0], p2[1], 1000);

      (s as any).alpha = contour.alpha;
      (s as any).width = contour.width;

      segments.push(s);
    }
  }

  return { type: 'segments', segments };
};
