import type { FormulaFn, LineSegment } from '../types';
import {  seg  } from '../helpers';

export const dnaHelix: FormulaFn = (_text, params, time) => {
  const { turns = 6, radius = 80, height = 400, basePairs = 12 } = params;
  const segments: LineSegment[] = [];
  const rotation = time * 0.5; // Animate rotation over time

  const totalPoints = turns * basePairs * 4;
  for (let i = 0; i < totalPoints; i++) {
    const t0 = i / totalPoints;
    const t1 = (i + 1) / totalPoints;
    const y0 = -height / 2 + t0 * height;
    const y1 = -height / 2 + t1 * height;
    const theta0 = t0 * turns * Math.PI * 2 + rotation;
    const theta1 = t1 * turns * Math.PI * 2 + rotation;

    // Strand A
    const ax0 = radius * Math.cos(theta0);
    const ax1 = radius * Math.cos(theta1);
    segments.push(seg(ax0, y0, ax1, y1, 0));

    // Strand B (180 degrees out of phase)
    const bx0 = radius * Math.cos(theta0 + Math.PI);
    const bx1 = radius * Math.cos(theta1 + Math.PI);
    segments.push(seg(bx0, y0, bx1, y1, 0));

    // Rungs (base pairs) — visual only (red lines drawn, no text placement)
    if (i % 4 === 0) {
      segments.push(seg(ax0, y0, bx0, y0, 1, true)); // visualOnly=true
    }
  }

  return { type: 'segments', segments };
};



