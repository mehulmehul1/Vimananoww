import { FormulaFn, FormulaParams } from '../types.ts';
import { seg } from '../helpers.ts';

const MAX_SEGMENTS = 800;

export const dendriticCrystal: FormulaFn = (_text, params, time) => {
  const { seedLength = 90, branches = 6, depth = 4, angleSpread = 0.55, lengthDecay = 0.72, symmetry = 5 } = params;
  const segments: any[] = [];
  const sway = Math.sin(time * 0.3) * 0.15;
  const breathe = 1 + Math.sin(time * 0.4) * 0.05;
  const swayCos = Math.cos(sway);
  const swaySin = Math.sin(sway);
  const decayedSeed = seedLength * breathe;

  // Iterative stack — avoids recursive function call overhead
  // Stack entry: [sx, sy, angle, len, depthRemaining]
  const stack: number[] = [];

  const pushBranch = (sx: number, sy: number, angle: number, len: number, d: number) => {
    stack.push(sx, sy, angle, len, d);
  };

  // Seed the crystal from symmetry axes
  for (let i = 0; i < symmetry; i++) {
    const angle = (i / symmetry) * Math.PI * 2 - Math.PI / 2;
    pushBranch(0, 0, angle, decayedSeed, depth);
  }
  // Extra secondary branches
  const extra = branches - symmetry;
  if (extra > 0) {
    for (let i = 0; i < extra; i++) {
      const angle = (i / extra) * Math.PI * 2 - Math.PI / 2 + Math.PI / symmetry;
      pushBranch(0, 0, angle, decayedSeed * 0.7, depth - 1);
    }
  }

  while (stack.length > 0 && segments.length < MAX_SEGMENTS) {
    const d = stack.pop()!;
    const len = stack.pop()!;
    const angle = stack.pop()!;
    const sy = stack.pop()!;
    const sx = stack.pop()!;

    if (d <= 0 || len < 4) continue;

    // Apply sway rotation to the direction vector
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);
    const rotX = cosA * swayCos - sinA * swaySin;
    const rotY = cosA * swaySin + sinA * swayCos;
    const endX = sx + rotX * len * breathe;
    const endY = sy + rotY * len * breathe;

    segments.push(seg(sx, sy, endX, endY, depth - d));

    const nextLen = len * lengthDecay;
    const sideAngle = angleSpread * (1 + (depth - d) * 0.1);

    // Continuation branch (always)
    pushBranch(endX, endY, angle, nextLen, d - 1);

    // Side branches — only spawn at alternating depths to cut exponential growth
    // This reduces 3-way branching to ~2-way effective, halving segment count
    if (d % 2 === 0 || d > 2) {
      pushBranch(endX, endY, angle - sideAngle, nextLen * 0.85, d - 1);
      pushBranch(endX, endY, angle + sideAngle, nextLen * 0.85, d - 1);
    }
  }

  return { type: 'segments', segments };
};
