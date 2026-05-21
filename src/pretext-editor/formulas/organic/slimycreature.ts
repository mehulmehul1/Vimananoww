import type { FormulaFn, FormulaParams, LineSegment } from '../types';
import { seg } from '../helpers';

const getPoint = (i: number, t: number) => {
  const k = 4 * Math.cos(i / 21);
  const e = (i / 235) / 8 - 20;
  const d = Math.sqrt(k * k + e * e);
  const c = d - t;
  const safeK = Math.abs(k) < 0.001 ? 0.001 : k;
  const q = 3 * Math.sin(k * 2) + 0.3 / safeK + Math.sin((i / 235) / 19) * k * (9 + 2 * Math.sin(e * 14 - d * 3 + t * 2));
  
  return {
    x: q + 50 * Math.cos(c) + 200,
    y: q * Math.sin(c) + d * 39 - 475,
  };
};

export const slimycreature: FormulaFn = (_text, params, t) => {
  const segments: LineSegment[] = [];
  
  const step = 15; 
  
  for (let i = 0; i < 10000; i += step) {
    const p1 = getPoint(i, t);
    const p2 = getPoint(Math.min(i + step, 10000), t);
    
    // Reverse the depth so it scales down from the core (end of loop) to the tips (start of loop)
    const depth = Math.floor((10000 - i) / 1000); 
    
    segments.push(seg(p1.x, p1.y, p2.x, p2.y, depth));
  }
  
  return {
    type: 'segments',
    segments,
  };
};

