import type { FormulaFn, LineSegment } from '../types';
import {  seg  } from '../helpers';

export const sierpinskiCarpet: FormulaFn = (_text, params, _time) => {
  const { size = 300, iterations = 4 } = params;
  const half = size / 2;
  const segments: LineSegment[] = [];

  // Draw carpet grid lines recursively
  const drawCarpet = (x: number, y: number, s: number, depth: number) => {
    if (depth <= 0) return;
    const third = s / 3;
    // Draw the 8 sub-square outlines
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        if (row === 1 && col === 1) continue; // Skip center
        const sx = x + col * third;
        const sy = y + row * third;
        segments.push(seg(sx, sy, sx + third, sy, iterations - depth));
        segments.push(seg(sx + third, sy, sx + third, sy + third, iterations - depth));
        segments.push(seg(sx + third, sy + third, sx, sy + third, iterations - depth));
        segments.push(seg(sx, sy + third, sx, sy, iterations - depth));
        drawCarpet(sx, sy, third, depth - 1);
      }
    }
  };

  drawCarpet(-half, -half, size, iterations);

  return { type: 'segments', segments };
};



