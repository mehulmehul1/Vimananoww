import type { FormulaFn, FormulaParams, LineSegment } from '../types';
import { seg } from '../helpers';

export const fractalTree: FormulaFn = (_text, params, time) => {
  const { rootBranches = 5, depth = 6, angleSpread = 52, branchLength = 90, lengthDecay = 0.68 } = params;
  const segments: LineSegment[] = [];

  const drawBranch = (x: number, y: number, angle: number, len: number, level: number) => {
    if (level <= 0) return;
    const endX = x + Math.cos(angle) * len;
    const endY = y + Math.sin(angle) * len;
    segments.push(seg(x, y, endX, endY, depth - level));

    const nextLen = len * lengthDecay;
    const halfAngle = (angleSpread * Math.PI) / 180 / 2;
    drawBranch(endX, endY, angle - halfAngle, nextLen, level - 1);
    drawBranch(endX, endY, angle + halfAngle, nextLen, level - 1);
  };

  for (let i = 0; i < rootBranches; i++) {
    const angle = (i / rootBranches) * Math.PI * 2 - Math.PI / 2;
    drawBranch(0, 0, angle, branchLength, depth);
  }

  return { type: 'segments', segments };
};


