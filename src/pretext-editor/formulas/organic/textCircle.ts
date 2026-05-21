import type { FormulaFn, LineSegment } from '../types';
import {  seg  } from '../helpers';

export const textCircle: FormulaFn = (_text, params, time) => {
  // Loop radius from 125 to 220 over a 6-second cycle, easing each pass
  const baseRadius = params.radius ?? 200;
  const cycleT = (time % 6) / 6;
  // easeOutCubic
  const ease = 1 - Math.pow(1 - cycleT, 3);
  const animatedRadius = baseRadius < 200
    ? baseRadius  // respect manual slider if user set low value
    : 125 + (220 - 125) * ease;

  const segments: LineSegment[] = [];
  const points = 120;

  for (let i = 0; i < points; i++) {
    const t0 = i / points;
    const t1 = (i + 1) / points;
    const angle0 = t0 * Math.PI * 2;
    const angle1 = t1 * Math.PI * 2;
    segments.push(seg(
      animatedRadius * Math.cos(angle0), animatedRadius * Math.sin(angle0),
      animatedRadius * Math.cos(angle1), animatedRadius * Math.sin(angle1),
      0
    ));
  }

  return { type: 'segments', segments };
};



