import type { FormulaFn, LineSegment } from '../types';
import { seg } from '../helpers';

/**
 * myceliumNetwork — 2D underground mycelial web.
 * Multiple origin nodes, hyphae branch outward, reconnect into a web.
 * Nutrient pulses flow through the network.
 *
 * Pure 2D — no 3D rotation, no perspective projection. Fast.
 *
 * Parameters:
 *   nodes         — number of origin points (default 6)
 *   branches      — hyphae per node (default 7)
 *   depth         — recursion depth (default 4)
 *   stepLength    — base hypha length (default 50)
 *   angleSpread   — branching angle (default 0.55)
 *   lengthDecay   — shrink per depth (default 0.62)
 *   reconnectDist — max reconnection distance (default 65)
 *   spread        — spatial spread (default 220)
 */

interface CachedMycelium {
  hyphaeSegs: LineSegment[];
  reconnectSegs: LineSegment[];
  nodePoints: Array<[number, number]>;
  params: string;
}

let cache: CachedMycelium | null = null;

function seed(n: number): number {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
}

function buildCache(
  nodeCount: number,
  branches: number,
  maxDepth: number,
  stepLength: number,
  angleSpread: number,
  lengthDecay: number,
  reconnectDist: number,
  spread: number,
  paramKey: string,
): CachedMycelium {
  const hyphaeSegs: LineSegment[] = [];
  const tips: Array<{ x: number; y: number }> = [];
  const nodePoints: Array<[number, number]> = [];

  // Generate origin nodes scattered in 2D
  const origins: Array<[number, number]> = [];
  for (let i = 0; i < nodeCount; i++) {
    const angle = (i / nodeCount) * Math.PI * 2;
    const r = 15 + seed(i * 3.1) * spread * 0.45;
    const ox = Math.cos(angle) * r;
    const oy = Math.sin(angle) * r;
    origins.push([ox, oy]);
    nodePoints.push([ox, oy]);
  }

  // Central origin
  origins.push([0, 0]);
  nodePoints.push([0, 0]);

  interface Entry {
    x: number; y: number; angle: number; length: number; depth: number;
  }

  for (let oi = 0; oi < origins.length; oi++) {
    const [ox, oy] = origins[oi];
    const stack: Entry[] = [];

    for (let b = 0; b < branches; b++) {
      const angle = (b / branches) * Math.PI * 2 + seed(oi * 11 + b) * 0.4;
      stack.push({
        x: ox, y: oy, angle,
        length: stepLength * (0.8 + seed(oi * 23 + b) * 0.4),
        depth: 0,
      });
    }

    while (stack.length > 0) {
      const e = stack.pop()!;
      if (e.depth >= maxDepth || e.length < 2) continue;

      // Organic wobble
      const wobble = Math.sin(e.x * 0.015 + e.y * 0.015 + e.depth * 1.3) * 0.12;
      const finalAngle = e.angle + wobble;

      const ex = e.x + Math.cos(finalAngle) * e.length;
      const ey = e.y + Math.sin(finalAngle) * e.length;

      hyphaeSegs.push(seg(e.x, e.y, ex, ey, e.depth));

      // Track tips for reconnection
      if (e.depth >= maxDepth - 2) {
        tips.push({ x: ex, y: ey });
      }

      // Branch
      const childCount = e.depth < 2 ? 3 : 2;
      const nextLength = e.length * lengthDecay;

      for (let c = 0; c < childCount; c++) {
        const spreadAngle = (c - (childCount - 1) / 2) * angleSpread;
        const jitter = (seed(ex * 0.1 + ey * 0.1 + c * 37) - 0.5) * 0.3;

        stack.push({
          x: ex, y: ey,
          angle: finalAngle + spreadAngle + jitter,
          length: nextLength,
          depth: e.depth + 1,
        });
      }
    }
  }

  // Reconnection: nearby tips connect (the web effect)
  // Cap to avoid O(n²) blowup with many tips
  const reconnectSegs: LineSegment[] = [];
  const maxTips = Math.min(tips.length, 200);
  for (let i = 0; i < maxTips; i++) {
    for (let j = i + 1; j < maxTips; j++) {
      const dx = tips[i].x - tips[j].x;
      const dy = tips[i].y - tips[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < reconnectDist && dist > 3) {
        reconnectSegs.push(seg(tips[i].x, tips[i].y, tips[j].x, tips[j].y, maxDepth + 1));
      }
    }
  }

  return { hyphaeSegs, reconnectSegs, nodePoints, params: paramKey };
}

export const myceliumNetwork: FormulaFn = (_text, params, time) => {
  const nodeCount = Math.floor(params.nodes ?? 6);
  const branches = Math.floor(params.branches ?? 7);
  const maxDepth = Math.floor(params.depth ?? 4);
  const stepLength = params.stepLength ?? 50;
  const angleSpread = params.angleSpread ?? 0.55;
  const lengthDecay = params.lengthDecay ?? 0.62;
  const reconnectDist = params.reconnectDist ?? 65;
  const spread = params.spread ?? 220;

  const paramKey = `${nodeCount}-${branches}-${maxDepth}-${stepLength}-${angleSpread}-${lengthDecay}-${reconnectDist}-${spread}`;

  if (!cache || cache.params !== paramKey) {
    cache = buildCache(
      nodeCount, branches, maxDepth, stepLength,
      angleSpread, lengthDecay, reconnectDist, spread, paramKey,
    );
  }

  // Gentle time-based sway (no heavy rotation)
  const sway = Math.sin(time * 0.15) * 2;
  const breathe = 1 + Math.sin(time * 0.25) * 0.02;

  const segments: LineSegment[] = [];

  // Hyphae with gentle sway
  for (const s of cache.hyphaeSegs) {
    const dx = s.x2 - s.x1;
    const dy = s.y2 - s.y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len === 0) continue;

    // Perpendicular sway based on depth
    const swayAmt = sway * ((s.depth ?? 0) * 0.3);
    const nx = -dy / len;
    const ny = dx / len;

    segments.push(seg(
      (s.x1 + nx * swayAmt) * breathe,
      (s.y1 + ny * swayAmt) * breathe,
      (s.x2 + nx * swayAmt) * breathe,
      (s.y2 + ny * swayAmt) * breathe,
      s.depth,
    ));
  }

  // Reconnection threads
  for (const s of cache.reconnectSegs) {
    segments.push(seg(s.x1, s.y1, s.x2, s.y2, s.depth));
  }

  // Node points as tiny crosses
  for (const [nx, ny] of cache.nodePoints) {
    const s = 3;
    segments.push(seg(nx - s, ny - s, nx + s, ny + s, 0));
    segments.push(seg(nx - s, ny + s, nx + s, ny - s, 0));
  }

  return { type: 'segments', segments };
};
