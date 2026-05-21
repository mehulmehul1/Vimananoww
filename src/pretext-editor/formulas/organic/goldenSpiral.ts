import type { FormulaFn, LineSegment } from '../types';
import {  seg  } from '../helpers';

export const goldenSpiral: FormulaFn = (_text, params, _time) => {
  const { turns = 4, growthRate = 0.1759 } = params;
  const segments: LineSegment[] = [];
  const a = 15;

  const totalPoints = turns * 100;
  for (let i = 0; i < totalPoints; i++) {
    const t0 = i / totalPoints;
    const t1 = (i + 1) / totalPoints;
    const theta0 = t0 * turns * Math.PI * 2;
    const theta1 = t1 * turns * Math.PI * 2;
    const r0 = a * Math.exp(growthRate * theta0);
    const r1 = a * Math.exp(growthRate * theta1);
    const depth = Math.floor(t0 * turns); // each turn = deeper level
    segments.push(seg(
      r0 * Math.cos(theta0), r0 * Math.sin(theta0),
      r1 * Math.cos(theta1), r1 * Math.sin(theta1),
      depth
    ));
  }

  return { type: 'segments', segments };
};



