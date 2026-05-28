import type { FormulaFn, LineSegment } from '../types';
import { seg } from '../helpers';

/**
 * brainStreamlines — Cortical streamline renderer.
 * Renders flowing cortical trajectories instead of UV mesh edges.
 * Produces recognizable brain silhouette through contour-flow topology.
 */

interface BrainLine {
  points: [number, number, number][];
  depth: number;
  width: number;
  alpha: number;
}

// ─── Noise ───────────────────────────────────────────────────────────────

function hash(x: number, y: number): number {
  const h = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123;
  return h - Math.floor(h);
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function smooth(t: number): number {
  return t * t * (3 - 2 * t);
}

function noise2D(x: number, y: number): number {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const h00 = hash(xi, yi);
  const h10 = hash(xi + 1, yi);
  const h01 = hash(xi, yi + 1);
  const h11 = hash(xi + 1, yi + 1);
  const u = smooth(xf);
  const v = smooth(yf);
  return lerp(lerp(h00, h10, u), lerp(h01, h11, u), v);
}

function fbm(x: number, y: number): number {
  let value = 0;
  let amp = 0.5;
  let freq = 1;
  for (let i = 0; i < 5; i++) {
    value += noise2D(x * freq, y * freq) * amp;
    amp *= 0.5;
    freq *= 2;
  }
  return value;
}

// ─── Brain silhouette ────────────────────────────────────────────────────

function brainBoundary(x: number, y: number): boolean {
  const nx = x / 280;
  const ny = y / 210;

  let d = nx * nx * 0.9 + ny * ny * 1.4;

  // frontal lobe
  d -= Math.exp(-((x - 80) ** 2 + (y + 10) ** 2) / 12000) * 0.22;

  // temporal lobe
  d -= Math.exp(-((x + 30) ** 2 + (y - 60) ** 2) / 9000) * 0.18;

  // occipital
  d -= Math.exp(-((x + 180) ** 2 + (y + 10) ** 2) / 10000) * 0.12;

  // bottom flattening
  d += Math.max(0, y - 70) * 0.002;

  return d < 1;
}

// ─── Cortical directional field ──────────────────────────────────────────

function corticalFlow(x: number, y: number): number {
  const nx = x / 280;
  const ny = y / 210;

  // global flow
  let angle = Math.atan2(ny * 0.7, nx * 1.2);

  // frontal sweep
  angle += Math.exp(-((x - 120) ** 2 + y ** 2) / 18000) * 1.2;

  // temporal curve
  angle -= Math.exp(-((x + 20) ** 2 + (y - 80) ** 2) / 10000) * 1.0;

  // occipital wrap
  angle += Math.exp(-((x + 180) ** 2 + y ** 2) / 16000) * 0.7;

  // domain warp
  angle += (fbm(nx * 3, ny * 3) - 0.5) * 1.5;

  return angle;
}

// ─── Streamline tracing ──────────────────────────────────────────────────

function traceLine(
  startX: number,
  startY: number,
  maxSteps: number,
): BrainLine | null {
  let x = startX;
  let y = startY;

  const points: [number, number, number][] = [];

  for (let i = 0; i < maxSteps; i++) {
    if (!brainBoundary(x, y)) break;

    const angle = corticalFlow(x, y);
    const dx = Math.cos(angle);
    const dy = Math.sin(angle);

    const z =
      Math.sin(x * 0.01) * 18 +
      Math.cos(y * 0.015) * 14;

    points.push([x, y, z]);

    x += dx * 5.5;
    y += dy * 5.5;
  }

  if (points.length < 12) return null;

  const depth =
    points.reduce((s, p) => s + p[2], 0) / points.length;

  return { points, depth, width: 1, alpha: 1 };
}

// ─── Projection ──────────────────────────────────────────────────────────

function rotate3(
  x: number, y: number, z: number,
  rotY: number, rotX: number,
): [number, number, number] {
  const cy = Math.cos(rotY), sy = Math.sin(rotY);
  const cx = Math.cos(rotX), sx = Math.sin(rotX);

  const x1 = x * cy + z * sy;
  const z1 = -x * sy + z * cy;
  const y2 = y * cx - z1 * sx;
  const z2 = y * sx + z1 * cx;

  return [x1, y2, z2];
}

function project3(x: number, y: number, z: number): [number, number, number] {
  const depth = z + 900;
  const fov = 700;
  return [x * fov / depth, y * fov / depth, depth];
}

// ─── Cached streamlines ──────────────────────────────────────────────────

let cachedLines: BrainLine[] | null = null;

function buildLines(): BrainLine[] {
  const lines: BrainLine[] = [];
  const rows = 44;

  for (let y = -180; y <= 180; y += 8) {
    for (let x = -260; x <= 220; x += 22) {
      if (!brainBoundary(x, y)) continue;

      // sparse stochastic selection
      if (hash(x * 0.1, y * 0.1) < 0.58) continue;

      const line = traceLine(x, y, rows);
      if (line) lines.push(line);
    }
  }

  return lines;
}

// ─── Formula ─────────────────────────────────────────────────────────────

export const brainStreamlines: FormulaFn = (_text, params, time) => {
  if (!cachedLines) cachedLines = buildLines();

  const rotY = time * (params.rotSpeed ?? 0.06);
  const rotX = params.tiltX ?? 0.18;

  const segments: LineSegment[] = [];

  for (const line of cachedLines) {
    for (let i = 0; i < line.points.length - 1; i++) {
      const p1 = line.points[i];
      const p2 = line.points[i + 1];

      const r1 = rotate3(p1[0], p1[1], p1[2], rotY, rotX);
      const r2 = rotate3(p2[0], p2[1], p2[2], rotY, rotX);

      // backface rejection
      if (r1[2] < -120) continue;

      const proj1 = project3(r1[0], r1[1], r1[2]);
      const proj2 = project3(r2[0], r2[1], r2[2]);

      const depth = (proj1[2] + proj2[2]) * 0.5;

      const s = seg(proj1[0], proj1[1], proj2[0], proj2[1], depth);

      // Store alpha/width on segment for renderer
      (s as any).alpha = 0.25 + Math.max(0, r1[2]) * 0.0014;
      (s as any).width = 0.5 + Math.max(0, r1[2]) * 0.002;

      segments.push(s);
    }
  }

  return { type: 'segments', segments };
};
