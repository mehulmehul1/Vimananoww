import type { FormulaFn, FormulaParams, LineSegment } from '../types';
import { seg } from '../helpers';

export const dendriticCrystal: FormulaFn = (_text, params, _time) => {
  const { seedLength = 120, branches = 6, depth = 6, angleSpread = 0.55, lengthDecay = 0.72, symmetry = 6 } = params;
  const segments: LineSegment[] = [];

  // Symmetric crystal growth with controlled branching
  const grow = (sx: number, sy: number, angle: number, len: number, d: number) => {
    if (d <= 0 || len < 5) return;
    const endX = sx + Math.cos(angle) * len;
    const endY = sy + Math.sin(angle) * len;
    segments.push(seg(sx, sy, endX, endY, depth - d));

    const nextLen = len * lengthDecay;
    // Main continuation
    grow(endX, endY, angle, nextLen, d - 1);
    // Side branches at symmetric angles
    const sideAngle = angleSpread * (1 + (depth - d) * 0.1);
    grow(endX, endY, angle - sideAngle, nextLen * 0.85, d - 1);
    grow(endX, endY, angle + sideAngle, nextLen * 0.85, d - 1);
  };

  // Grow from center with symmetric seeds
  for (let i = 0; i < symmetry; i++) {
    const angle = (i / symmetry) * Math.PI * 2 - Math.PI / 2;
    grow(0, 0, angle, seedLength, depth);
  }

  // Additional inner seeds for density
  if (branches > symmetry) {
    for (let i = 0; i < branches - symmetry; i++) {
      const angle = (i / (branches - symmetry)) * Math.PI * 2 - Math.PI / 2 + Math.PI / symmetry;
      grow(0, 0, angle, seedLength * 0.7, depth - 1);
    }
  }

  return { type: 'segments', segments };
};


