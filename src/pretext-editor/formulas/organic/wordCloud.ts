import type { FormulaFn, LineSegment } from '../types';
import {  seg  } from '../helpers';

export const wordCloud: FormulaFn = (_text, params, time) => {
  const { cloudCount = 5, wordCount = 40, radius = 150, spread = 80 } = params;
  const segments: LineSegment[] = [];

  for (let c = 0; c < cloudCount; c++) {
    const cx = Math.cos((c / cloudCount) * Math.PI * 2) * spread;
    const cy = Math.sin((c / cloudCount) * Math.PI * 2) * spread * 0.6;
    const cloudRadius = radius * (0.6 + Math.sin(c * 2.5) * 0.4);
    const phase = c * 1.5 + time * 0.3;

    // Create elliptical word orbits
    for (let w = 0; w < wordCount; w++) {
      const t0 = w / wordCount;
      const t1 = (w + 1) / wordCount;
      const angle0 = t0 * Math.PI * 2 + phase;
      const angle1 = t1 * Math.PI * 2 + phase;
      const r0 = cloudRadius * (0.7 + Math.sin(t0 * 6 + c) * 0.3);
      const r1 = cloudRadius * (0.7 + Math.sin(t1 * 6 + c) * 0.3);

      const x0 = cx + r0 * Math.cos(angle0);
      const y0 = cy + r0 * Math.sin(angle0) * 0.6; // Flattened ellipse
      const x1 = cx + r1 * Math.cos(angle1);
      const y1 = cy + r1 * Math.sin(angle1) * 0.6;

      segments.push(seg(x0, y0, x1, y1, Math.floor(w / 8)));
    }
  }

  return { type: 'segments', segments };
};



