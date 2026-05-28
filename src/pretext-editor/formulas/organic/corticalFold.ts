import type { FormulaFn, LineSegment } from '../types';
import { seg } from '../helpers';

/**
 * Cortical Fold — Gray-Scott reaction-diffusion producing labyrinthine Turing patterns.
 * Simulates brain cortical folding: activator diffuses slowly, inhibitor diffuses fast.
 * Outputs contour lines of the activator field — these look like brain wrinkles.
 *
 * Parameters:
 *   f        — feed rate (default 0.035, labyrinthine regime)
 *   k        — kill rate (default 0.065)
 *   iterations — simulation steps (default 3000, more = finer folds)
 *   resolution — grid size (default 80, higher = more detail but slower)
 *   contourLevel — threshold for contour extraction (default 0.25)
 */
export const corticalFold: FormulaFn = (_text, params, _time) => {
  const f = params.f ?? 0.035;
  const k = params.k ?? 0.065;
  const iterations = params.iterations ?? 3000;
  const res = params.resolution ?? 80;
  const contourLevel = params.contourLevel ?? 0.25;
  const Du = 0.16;
  const Dv = 0.08;
  const dt = 1.0;

  const size = res * res;
  const u = new Float32Array(size);
  const v = new Float32Array(size);

  // Initialize: u=1 everywhere, v=0 with random seed patches
  u.fill(1.0);
  v.fill(0.0);

  // Seed activator patches — clustered for organic start
  const seedCount = Math.floor(size * 0.015);
  for (let i = 0; i < seedCount; i++) {
    // Cluster seeds near center with some spread
    const cx = res * 0.5 + (Math.random() - 0.5) * res * 0.6;
    const cy = res * 0.5 + (Math.random() - 0.5) * res * 0.6;
    const x = Math.floor(Math.max(0, Math.min(res - 1, cx)));
    const y = Math.floor(Math.max(0, Math.min(res - 1, cy)));
    const idx = y * res + x;
    v[idx] = 1.0;
    u[idx] = 0.5;
    // Also seed neighbors for smoother start
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const nx = (x + dx + res) % res;
        const ny = (y + dy + res) % res;
        v[ny * res + nx] = Math.max(v[ny * res + nx], 0.8);
      }
    }
  }

  // Laplacian (toroidal boundary)
  const lap = (arr: Float32Array, x: number, y: number): number => {
    const xm = ((x - 1) + res) % res;
    const xp = (x + 1) % res;
    const ym = ((y - 1) + res) % res;
    const yp = (y + 1) % res;
    return (
      arr[ym * res + xm] + arr[ym * res + x] + arr[ym * res + xp] +
      arr[y * res + xm] - 4 * arr[y * res + x] + arr[y * res + xp] +
      arr[yp * res + xm] + arr[yp * res + x] + arr[yp * res + xp]
    );
  };

  // Run Gray-Scott simulation
  for (let iter = 0; iter < iterations; iter++) {
    // Use double buffering to avoid artifacts
    const u2 = new Float32Array(u);
    const v2 = new Float32Array(v);

    for (let y = 0; y < res; y++) {
      for (let x = 0; x < res; x++) {
        const i = y * res + x;
        const uvv = u[i] * v[i] * v[i];
        u2[i] += (Du * lap(u, x, y) - uvv + f * (1 - u[i])) * dt;
        v2[i] += (Dv * lap(v, x, y) + uvv - (f + k) * v[i]) * dt;
        // Clamp
        u2[i] = Math.max(0, Math.min(1, u2[i]));
        v2[i] = Math.max(0, Math.min(1, v2[i]));
      }
    }

    u.set(u2);
    v.set(v2);
  }

  // Extract contour lines using marching squares
  const segments: LineSegment[] = [];
  const scale = 600 / res; // Map grid to ~600px canvas space

  for (let y = 0; y < res - 1; y++) {
    for (let x = 0; x < res - 1; x++) {
      const tl = v[y * res + x];
      const tr = v[y * res + (x + 1)];
      const br = v[(y + 1) * res + (x + 1)];
      const bl = v[(y + 1) * res + x];

      // Marching squares classification
      let code = 0;
      if (tl > contourLevel) code |= 8;
      if (tr > contourLevel) code |= 4;
      if (br > contourLevel) code |= 2;
      if (bl > contourLevel) code |= 1;

      if (code === 0 || code === 15) continue;

      // Interpolate edge crossings
      const lerpEdge = (a: number, b: number): number => {
        const d = b - a;
        return d === 0 ? 0.5 : (contourLevel - a) / d;
      };

      // Edge midpoints (interpolated)
      const topX = (x + lerpEdge(tl, tr)) * scale - 300;
      const topY = y * scale - 300;
      const rightX = (x + 1) * scale - 300;
      const rightY = (y + lerpEdge(tr, br)) * scale - 300;
      const bottomX = (x + lerpEdge(bl, br)) * scale - 300;
      const bottomY = (y + 1) * scale - 300;
      const leftX = x * scale - 300;
      const leftY = (y + lerpEdge(tl, bl)) * scale - 300;

      // Generate line segments based on case
      const addSeg = (x1: number, y1: number, x2: number, y2: number) => {
        segments.push(seg(x1, y1, x2, y2, 0));
      };

      switch (code) {
        case 1: case 14: addSeg(leftX, leftY, bottomX, bottomY); break;
        case 2: case 13: addSeg(bottomX, bottomY, rightX, rightY); break;
        case 3: case 12: addSeg(leftX, leftY, rightX, rightY); break;
        case 4: case 11: addSeg(topX, topY, rightX, rightY); break;
        case 5: // Saddle
          addSeg(leftX, leftY, topX, topY);
          addSeg(bottomX, bottomY, rightX, rightY);
          break;
        case 6: case 9: addSeg(topX, topY, bottomX, bottomY); break;
        case 7: case 8: addSeg(leftX, leftY, topX, topY); break;
        case 10: // Saddle
          addSeg(leftX, leftY, bottomX, bottomY);
          addSeg(topX, topY, rightX, rightY);
          break;
      }
    }
  }

  return { type: 'segments', segments };
};
