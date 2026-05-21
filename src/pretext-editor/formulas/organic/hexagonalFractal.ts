import type { FormulaFn, FormulaParams, LineSegment } from '../types';
import { seg } from '../helpers';

export const hexagonalFractal: FormulaFn = (_text, params, _time) => {
  const { iterations = 4, size = 200 } = params;
  const segments: LineSegment[] = [];

  const generateArm = (x: number, y: number, angle: number, len: number, depth: number) => {
    if (depth <= 0) return;
    const endX = x + Math.cos(angle) * len;
    const endY = y + Math.sin(angle) * len;
    segments.push(seg(x, y, endX, endY, iterations - depth));

    const nextLen = len * 0.5;
    generateArm(endX, endY, angle - Math.PI / 3, nextLen, depth - 1);
    generateArm(endX, endY, angle + Math.PI / 3, nextLen, depth - 1);
    generateArm(endX, endY, angle, nextLen * 0.7, depth - 1);
  };

  for (let i = 0; i < 6; i++) {
    generateArm(0, 0, (i / 6) * Math.PI * 2, size / 3, iterations);
  }

  return { type: 'segments', segments };
};


