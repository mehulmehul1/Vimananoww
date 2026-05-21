import type { FormulaFn, LineSegment } from '../types';
import {  seg  } from '../helpers';

export const sierpinskiTriangle: FormulaFn = (_text, params, _time) => {
  const { size = 300, iterations = 4 } = params;
  const h = size * Math.sqrt(3) / 2;
  const top = -h * 2 / 3;
  const bottom = h / 3;
  const segments: LineSegment[] = [];

  // Generate Sierpinski triangle segments recursively
  const drawTriangle = (ax: number, ay: number, bx: number, by: number, cx: number, cy: number, depth: number) => {
    if (depth <= 0) {
      segments.push(seg(ax, ay, bx, by, iterations - depth));
      segments.push(seg(bx, by, cx, cy, iterations - depth));
      segments.push(seg(cx, cy, ax, ay, iterations - depth));
      return;
    }
    const abx = (ax + bx) / 2, aby = (ay + by) / 2;
    const bcx = (bx + cx) / 2, bcy = (by + cy) / 2;
    const cax = (cx + ax) / 2, cay = (cy + ay) / 2;
    drawTriangle(ax, ay, abx, aby, cax, cay, depth - 1);
    drawTriangle(abx, aby, bx, by, bcx, bcy, depth - 1);
    drawTriangle(cax, cay, bcx, bcy, cx, cy, depth - 1);
  };

  // Main triangle vertices
  const ax = 0, ay = top;
  const bx = -size / 2, by = bottom;
  const cx = size / 2, cy = bottom;
  drawTriangle(ax, ay, bx, by, cx, cy, iterations);

  return { type: 'segments', segments };
};



