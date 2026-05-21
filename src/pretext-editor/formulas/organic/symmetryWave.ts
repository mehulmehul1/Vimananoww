import type { FormulaFn, FormulaParams, LineSegment } from '../types';
import { seg } from '../helpers';

/**
 * SymmetryWave Formula — Fish-skeleton with concentric rings
 *
 * Original:
 *   a=(x,y,d=mag(k=5*cos(x/19)*cos(y/30),e=y/8-12)**2/59+2)=>point(
 *     (q=4*sin(atan2(k,e)*9)+9*sin(d-t)-k/d*(9+sin(d*9-t*16)*3))+50*cos(c=d*d/7-t)+200,
 *     q*sin(c)+d*45-9
 *   )
 *   t=0,draw=$=>{t||createCanvas(w=400,w);background(9).stroke(w,36);for(t+=PI/240,i=1e4;i--;)a(i,i/41)}
 *
 * Design: Cached base curve + 2 concentric offset rings. Base curve is visualOnly
 * (red spine, no text). Text flows on offset rings only.
 */

/** Precomputed base curve cache */
let baseCache: Float64Array | null = null;
let cachedTime = -1;

function getBasePoints(time: number): Float64Array {
  if (baseCache && cachedTime === time) {
    return baseCache;
  }

  const total = 10000;
  const step = 25; // 400 base points (highly performant)
  const pts = new Float64Array((total / step) * 2);
  let idx = 0;

  for (let i = 0; i < total; i++) {
    const x = i;
    const y = i / 41;
    const k = 5 * Math.cos(x / 19) * Math.cos(y / 30);
    const e = y / 8 - 12;
    const d = (k * k + e * e) / 59 + 2;

    const c = (d * d) / 7 - time;
    const q =
      4 * Math.sin(Math.atan2(k, e) * 9) +
      9 * Math.sin(d - time) -
      (k / d) * (9 + Math.sin(d * 9 - time * 16) * 3);

    if (i % step === 0) {
      pts[idx++] = q + 50 * Math.cos(c) + 200;
      pts[idx++] = q * Math.sin(c) + d * 45 - 9;
    }
  }

  baseCache = pts;
  cachedTime = time;
  return pts;
}

export const symmetryWave: FormulaFn = (_text, params, time) => {
  const segments: LineSegment[] = [];

  const animationSpeed = params.animationSpeed ?? 30;
  const ringOffset = params.ringOffset ?? 12;

  const t = time * animationSpeed;
  const base = getBasePoints(t);
  const n = base.length / 2;

  // Build segments for base curve + 2 concentric rings
  for (let p = 1; p < n; p++) {
    const x0 = base[(p - 1) * 2];
    const y0 = base[(p - 1) * 2 + 1];
    const x1 = base[p * 2];
    const y1 = base[p * 2 + 1];

    const dx = x1 - x0;
    const dy = y1 - y0;
    const angle = Math.atan2(dy, dx);

    // Normal vector (perpendicular)
    const nx = -Math.sin(angle);
    const ny = Math.cos(angle);

    // Base spine — visual only (red line, no text)
    segments.push(seg(x0, y0, x1, y1, 0, true));

    // Ring 1: offset outward
    const o1 = ringOffset;
    segments.push(seg(x0 + nx * o1, y0 + ny * o1, x1 + nx * o1, y1 + ny * o1, 3));

    // Ring 2: offset inward
    const o2 = ringOffset * 2;
    segments.push(seg(x0 - nx * o2, y0 - ny * o2, x1 - nx * o2, y1 - ny * o2, 6));
  }

  return { type: 'segments' as const, segments };
};
