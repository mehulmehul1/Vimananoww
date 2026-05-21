import type { FormulaFn, LineSegment } from '../types';
import {  seg  } from '../helpers';

export const fractalSnowflake: FormulaFn = (_text, params, _time) => {
  const { size = 280, iterations = 4 } = params;
  const segments: LineSegment[] = [];

  // Koch curve subdivision
  const koch = (ax: number, ay: number, bx: number, by: number, depth: number) => {
    if (depth <= 0) {
      segments.push(seg(ax, ay, bx, by, iterations - depth));
      return;
    }
    const dx = bx - ax, dy = by - ay;
    const p1x = ax + dx / 3, p1y = ay + dy / 3;
    const p2x = ax + dx * 2 / 3, p2y = ay + dy * 2 / 3;
    // Peak of the equilateral triangle
    const px = (ax + bx) / 2 - dy * Math.sqrt(3) / 6;
    const py = (ay + by) / 2 + dx * Math.sqrt(3) / 6;
    koch(ax, ay, p1x, p1y, depth - 1);
    koch(p1x, p1y, px, py, depth - 1);
    koch(px, py, p2x, p2y, depth - 1);
    koch(p2x, p2y, bx, by, depth - 1);
  };

  // Three sides of the initial equilateral triangle
  const h = size * Math.sqrt(3) / 2;
  const top = -h * 2 / 3;
  const bottom = h / 3;
  const ax = 0, ay = top;
  const bx = -size / 2, by = bottom;
  const cx = size / 2, cy = bottom;
  koch(ax, ay, bx, by, iterations);
  koch(bx, by, cx, cy, iterations);
  koch(cx, cy, ax, ay, iterations);

  return { type: 'segments', segments };
};



