import type { FormulaFn, LineSegment } from '../types';
import { seg } from '../helpers';

/**
 * Mycelial Web — Organic branching network that reconnects.
 * Simulates mycelium: thick hyphae branch outward, thinner hyphae connect between branches.
 * Nature's original neural network.
 *
 * Parameters:
 *   branches    — initial branch count (default 6)
 *   depth       — recursion depth (default 4)
 *   stepLength  — base step length (default 60)
 *   angleSpread — branching angle in radians (default 0.6)
 *   lengthDecay — length reduction per depth (default 0.65)
 *   reconnectDist — max distance for reconnection lines (default 80)
 */
export const mycelialWeb: FormulaFn = (_text, params, time) => {
  const branches = params.branches ?? 6;
  const maxDepth = params.depth ?? 4;
  const stepLength = params.stepLength ?? 60;
  const angleSpread = params.angleSpread ?? 0.6;
  const lengthDecay = params.lengthDecay ?? 0.65;
  const reconnectDist = params.reconnectDist ?? 80;

  const segments: LineSegment[] = [];
  const tips: Array<{ x: number; y: number; depth: number }> = [];

  // Organic sway based on time
  const sway = Math.sin(time * 0.2) * 0.1;
  const breathe = 1 + Math.sin(time * 0.3) * 0.03;

  // Iterative branch generation
  interface BranchEntry {
    x: number;
    y: number;
    angle: number;
    length: number;
    depth: number;
  }

  const stack: BranchEntry[] = [];

  // Seed branches from center, radiating outward
  for (let i = 0; i < branches; i++) {
    const angle = (i / branches) * Math.PI * 2 + sway;
    stack.push({
      x: 0,
      y: 0,
      angle,
      length: stepLength * breathe,
      depth: 0,
    });
  }

  while (stack.length > 0) {
    const entry = stack.pop()!;
    if (entry.depth >= maxDepth || entry.length < 3) continue;

    // Calculate end point with slight organic wobble
    const wobble = Math.sin(entry.x * 0.01 + entry.y * 0.01 + time * 0.5) * 0.15;
    const finalAngle = entry.angle + wobble;
    const ex = entry.x + Math.cos(finalAngle) * entry.length;
    const ey = entry.y + Math.sin(finalAngle) * entry.length;

    // Add segment — thicker at lower depths (depth 0 = thickest)
    segments.push(seg(entry.x, entry.y, ex, ey, entry.depth));

    // Track tips for reconnection
    if (entry.depth >= maxDepth - 2) {
      tips.push({ x: ex, y: ey, depth: entry.depth });
    }

    // Branch into 2-3 children
    const childCount = entry.depth < 2 ? 3 : 2;
    const nextLength = entry.length * lengthDecay;

    for (let c = 0; c < childCount; c++) {
      const branchAngle = finalAngle + (c - (childCount - 1) / 2) * angleSpread;
      // Add some randomness to make it organic
      const jitter = (Math.random() - 0.5) * 0.2;
      stack.push({
        x: ex,
        y: ey,
        angle: branchAngle + jitter,
        length: nextLength,
        depth: entry.depth + 1,
      });
    }
  }

  // Reconnection: connect nearby tips to form the web
  // This is what makes mycelium different from a tree — it reconnects
  for (let i = 0; i < tips.length; i++) {
    for (let j = i + 1; j < tips.length; j++) {
      const dx = tips[i].x - tips[j].x;
      const dy = tips[i].y - tips[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < reconnectDist && dist > 5) {
        // Thin reconnection line (high depth = thin)
        segments.push(seg(tips[i].x, tips[i].y, tips[j].x, tips[j].y, maxDepth));
      }
    }
  }

  return { type: 'segments', segments };
};
